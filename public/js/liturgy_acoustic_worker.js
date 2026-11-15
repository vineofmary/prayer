// ============================================================================
// MOUNT OF MERCY — On-Device Ge'ez Zema & Multilingual IPA CTC Worker (v2)
// ============================================================================
// Runs 100% locally in a WebWorker ($0.00/hr ongoing cost, offline-cached):
// - Dynamically loads @huggingface/transformers ONNX Runtime (WASM / WebGPU)
//   and caches quantized `air-air/xlsr-53-espeak-student-ONNX` (q4 / q8,
//   53-language universal IPA CTC — zero English spelling bias!) in browser
//   CacheStorage on first opt-in.
// - Applies the supervised 10-class Ge'ez Zema Bayesian probability routing
//   head (`zema_acoustic_model_data.js`) trained via Forward-Backward CTC Loss
//   on Debre Abay / `1 ሥርዓተ ቅዳሴ` Zema chants + Oakland Kidus Michael audio.
// - Emits BOTH:
//   1. Continuous 25Hz (40ms/frame) 10-class log-posteriors (`framePosteriors`)
//      and non-overlapping center-right hop slices (`hopPosteriors`, `hopRms`)
//      for zero-echo Online Coupled Slide Viterbi Forced Alignment.
//   2. Vibrato-invariant collapsed acoustic skeletons (`ctcText`, `hopSkeleton`)
//      for high-IDF global/scoped stanza search & Anaphora switch detection.
// ============================================================================

/* eslint-disable no-restricted-globals */
import './zema_acoustic_model_data.js';

const DEFAULT_MODEL_ID = 'air-air/xlsr-53-espeak-student-ONNX';
const TRANSFORMERS_ESM_URLS = [
    'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.4.0/+esm',
    'https://unpkg.com/@huggingface/transformers@3.4.0/dist/transformers.min.js'
];

const CLASS_NAMES = ['_', 'A', 'I', 'U', 'B', 'M', 'T', 'S', 'K', 'R'];
const NUM_CLASSES = 10;
const SAMPLE_RATE = 16000;

let modelInstance = null;
let TensorCtor = null;
let loadingPromise = null;
let inferBusy = false;

function getZemaHeadConfig() {
    const data = (typeof globalThis !== 'undefined' && globalThis.ZEMA_ACOUSTIC_MODEL_DATA)
        ? globalThis.ZEMA_ACOUSTIC_MODEL_DATA
        : null;
    return {
        modelId: (data && data.modelId) || DEFAULT_MODEL_ID,
        voicedBlankShift: (data && typeof data.voicedBlankShift === 'number') ? data.voicedBlankShift : -3.34,
        unvoicedBlankBoost: (data && typeof data.unvoicedBlankBoost === 'number') ? data.unvoicedBlankBoost : 2.5,
        routingMatrix: (data && Array.isArray(data.routingMatrix)) ? data.routingMatrix : null
    };
}

function normalizePcmFloat32(samples) {
    const n = samples.length;
    if (n === 0) return new Float32Array(0);
    let sum = 0;
    for (let i = 0; i < n; i++) sum += samples[i];
    const mean = sum / n;
    let sq = 0;
    for (let i = 0; i < n; i++) {
        const d = samples[i] - mean;
        sq += d * d;
    }
    const invStd = 1 / Math.sqrt(sq / n + 1e-7);
    const out = new Float32Array(n);
    for (let i = 0; i < n; i++) {
        out[i] = (samples[i] - mean) * invStd;
    }
    return out;
}

/**
 * Projects [1, T50, V] IPA CTC logits through the supervised 10-class Ge'ez Zema
 * Bayesian routing head, downsampled 2x to 25Hz (40ms/frame), and extracts both
 * full-window collapsed skeletons and non-overlapping hop posteriors.
 */
function projectIpaLogitsToZemaPosteriors(logitsData, rawSamples, numFrames50, vocabSize, hopDurationMs = 450) {
    const cfg = getZemaHeadConfig();
    const T25 = Math.max(1, Math.floor(numFrames50 / 2));
    const hopSamples = Math.max(1, Math.floor(rawSamples.length / T25));
    const frameLogPosteriors = new Float32Array(T25 * NUM_CLASSES);
    const frameRms = new Float32Array(T25);
    const ipaProbsBuf = new Float32Array(vocabSize);
    const routing = cfg.routingMatrix;

    let nonBlankVoicedFrames = 0;
    let voicedFrames = 0;
    let ctcSkeleton = '';
    let prevNonBlank = 0;
    const charSpans = [];

    for (let t = 0; t < T25; t++) {
        let fsq = 0;
        const s0 = t * hopSamples;
        for (let i = 0; i < hopSamples && (s0 + i) < rawSamples.length; i++) {
            const v = rawSamples[s0 + i];
            fsq += v * v;
        }
        const fRms = Math.sqrt(fsq / hopSamples);
        frameRms[t] = fRms;
        const isVoiced = fRms >= 0.0075;
        if (isVoiced) voicedFrames++;

        // Average 2 adjacent 50Hz IPA softmax distributions -> 25Hz (40ms)
        ipaProbsBuf.fill(0);
        const subCount = (t * 2 + 1 < numFrames50) ? 2 : 1;
        for (let sub = 0; sub < subCount; sub++) {
            const base50 = (t * 2 + sub) * vocabSize;
            let maxL = -Infinity;
            for (let v = 0; v < vocabSize; v++) {
                const lv = logitsData[base50 + v];
                if (lv > maxL) maxL = lv;
            }
            let sumExp = 0;
            for (let v = 0; v < vocabSize; v++) {
                sumExp += Math.exp(logitsData[base50 + v] - maxL);
            }
            const invS = (1.0 / subCount) / (sumExp || 1);
            for (let v = 0; v < vocabSize; v++) {
                ipaProbsBuf[v] += Math.exp(logitsData[base50 + v] - maxL) * invS;
            }
        }

        // Pool into 10 calibrated Ge'ez Zema classes and normalize log-posteriors
        const zOff = t * NUM_CLASSES;
        let maxZ = -Infinity;
        for (let c = 0; c < NUM_CLASSES; c++) {
            let pooled = 1e-6;
            if (routing && routing[c] && routing[c].length === vocabSize) {
                const rRow = routing[c];
                for (let v = 0; v < vocabSize; v++) {
                    pooled += rRow[v] * ipaProbsBuf[v];
                }
            } else {
                pooled += c === 0 ? ipaProbsBuf[0] : (1 - ipaProbsBuf[0]) / 9;
            }
            const zVal = Math.log(pooled) + (c === 0 ? (isVoiced ? cfg.voicedBlankShift : cfg.unvoicedBlankBoost) : 0);
            frameLogPosteriors[zOff + c] = zVal;
            if (zVal > maxZ) maxZ = zVal;
        }

        let sumZ = 0;
        let bestC = 0;
        let bestZ = -Infinity;
        for (let c = 0; c < NUM_CLASSES; c++) {
            const zVal = frameLogPosteriors[zOff + c];
            sumZ += Math.exp(zVal - maxZ);
            if (zVal > bestZ) {
                bestZ = zVal;
                bestC = c;
            }
        }
        const logNorm = maxZ + Math.log(sumZ || 1);
        for (let c = 0; c < NUM_CLASSES; c++) {
            frameLogPosteriors[zOff + c] -= logNorm;
        }

        if (isVoiced && bestC > 0) {
            nonBlankVoicedFrames++;
            if (bestC !== prevNonBlank) {
                const ch = CLASS_NAMES[bestC];
                ctcSkeleton += ch;
                charSpans.push({
                    ch,
                    frameStart: t * 2,
                    frameEnd: (t + 1) * 2,
                    prob: Math.round(Math.exp(frameLogPosteriors[zOff + bestC]) * 1000) / 1000
                });
                prevNonBlank = bestC;
            } else if (charSpans.length > 0) {
                charSpans[charSpans.length - 1].frameEnd = (t + 1) * 2;
            }
        }
    }

    // Extract non-overlapping center-right hop slice (skipping last 1 right-boundary frame = 40ms
    // so bidirectional Transformer self-attention has right-context while minimizing red-dot lag!)
    const hopFrames = Math.max(1, Math.min(T25, Math.round(hopDurationMs / 40)));
    const rightGuard = T25 > hopFrames + 1 ? 1 : 0;
    const hopEnd = T25 - rightGuard;
    const hopStart = Math.max(0, hopEnd - hopFrames);
    const hopLen = hopEnd - hopStart;

    const hopPosteriors = frameLogPosteriors.slice(hopStart * NUM_CLASSES, hopEnd * NUM_CLASSES);
    const hopRms = frameRms.slice(hopStart, hopEnd);

    let hopSkeleton = '';
    let hopPrevC = 0;
    for (let i = 0; i < hopLen; i++) {
        if (hopRms[i] < 0.0075) continue;
        const off = i * NUM_CLASSES;
        let bC = 0;
        let bV = hopPosteriors[off];
        for (let c = 1; c < NUM_CLASSES; c++) {
            if (hopPosteriors[off + c] > bV) {
                bV = hopPosteriors[off + c];
                bC = c;
            }
        }
        if (bC > 0 && bC !== hopPrevC) {
            hopSkeleton += CLASS_NAMES[bC];
            hopPrevC = bC;
        }
    }

    const phoneDensity = T25 > 0 ? nonBlankVoicedFrames / T25 : 0;

    return {
        ctcText: ctcSkeleton,
        hopSkeleton,
        words: ctcSkeleton ? [{ word: ctcSkeleton, startSec: 0, endSec: Math.round(T25 * 40) / 1000, confidence: 0.85 }] : [],
        charSpans,
        numFrames: T25,
        nonBlankFrames: nonBlankVoicedFrames,
        voicedFrames,
        phoneDensity: Math.round(phoneDensity * 1000) / 1000,
        framePosteriors: frameLogPosteriors,
        frameRms,
        hopPosteriors,
        hopRms,
        hopFrames: hopLen
    };
}

function computeProsodicSyllableEnvelope(samples, sampleRate = SAMPLE_RATE) {
    const hop = Math.floor(sampleRate * 0.05);
    const frames = Math.floor(samples.length / hop);
    let onsetCount = 0;
    let prevE = 0;

    for (let f = 0; f < frames; f++) {
        const start = f * hop;
        let sq = 0;
        for (let i = 0; i < hop; i++) {
            const s = samples[start + i];
            sq += s * s;
        }
        const rms = Math.sqrt(sq / hop);
        if (rms > 0.013 && rms > prevE * 1.40) {
            onsetCount++;
        }
        prevE = rms * 0.65 + prevE * 0.35;
    }
    return { onsetCount, frameCount: frames };
}

async function importTransformersLibrary() {
    let lastErr = null;
    for (const url of TRANSFORMERS_ESM_URLS) {
        try {
            const mod = await import(/* @vite-ignore */ url);
            if (mod && mod.AutoModelForCTC && mod.Tensor) {
                return mod;
            }
        } catch (err) {
            lastErr = err;
        }
    }
    throw lastErr || new Error('Unable to load @huggingface/transformers runtime');
}

async function ensureAcousticModelLoaded() {
    if (modelInstance && TensorCtor) return true;
    if (loadingPromise) return loadingPromise;

    loadingPromise = (async () => {
        self.postMessage({ type: 'model_status', status: 'loading', progress: 5 });

        const tf = await importTransformersLibrary();
        if (tf.env) {
            tf.env.allowLocalModels = false;
            tf.env.useBrowserCache = true;
        }
        TensorCtor = tf.Tensor;
        const cfg = getZemaHeadConfig();

        const progressCallback = (info) => {
            if (info && typeof info.progress === 'number') {
                self.postMessage({
                    type: 'model_status',
                    status: 'downloading',
                    progress: Math.min(99, Math.max(5, Math.round(info.progress))),
                    file: info.file || ''
                });
            }
        };

        let device = 'wasm';
        try {
            if (typeof navigator !== 'undefined' && navigator.gpu) {
                const adapter = await navigator.gpu.requestAdapter();
                if (adapter) device = 'webgpu';
            }
        } catch (_) {
            device = 'wasm';
        }

        try {
            modelInstance = await tf.AutoModelForCTC.from_pretrained(cfg.modelId, {
                dtype: 'q4',
                device,
                progress_callback: progressCallback
            });
        } catch (_) {
            modelInstance = await tf.AutoModelForCTC.from_pretrained(cfg.modelId, {
                dtype: 'q8',
                device: 'wasm',
                progress_callback: progressCallback
            });
        }

        self.postMessage({ type: 'model_status', status: 'ready', progress: 100, device, modelId: cfg.modelId });
        return true;
    })().catch((err) => {
        loadingPromise = null;
        self.postMessage({
            type: 'model_status',
            status: 'error',
            message: err && err.message ? err.message : String(err)
        });
        return false;
    });

    return loadingPromise;
}

self.onmessage = async (event) => {
    const msg = event.data || {};

    if (msg.type === 'warmup') {
        await ensureAcousticModelLoaded();
        return;
    }

    if (msg.type === 'infer') {
        const samples = msg.samples instanceof Float32Array
            ? msg.samples
            : new Float32Array(msg.samples || []);
        const seq = msg.seq || 0;
        const windowStartMs = msg.windowStartMs || 0;
        const hopDurationMs = msg.hopDurationMs || 450;
        const rms = typeof msg.rms === 'number' ? msg.rms : 0;

        const prosody = computeProsodicSyllableEnvelope(samples, SAMPLE_RATE);

        if (!modelInstance) {
            ensureAcousticModelLoaded();
            self.postMessage({
                type: 'infer_result',
                seq,
                windowStartMs,
                rms,
                modelReady: false,
                ctcText: '',
                hopSkeleton: '',
                words: [],
                charSpans: [],
                phoneDensity: 0,
                prosody
            });
            return;
        }

        if (inferBusy) {
            return;
        }

        // Fast 0ms silence bypass so trailing pauses never stall GPU for ~0.7-1.0s
        let tailSq = 0;
        const tailLen = Math.min(samples.length, Math.floor(SAMPLE_RATE * 0.4));
        const tailStart = samples.length - tailLen;
        for (let i = tailStart; i < samples.length; i++) {
            const s = samples[i];
            tailSq += s * s;
        }
        const tailRms = tailLen > 0 ? Math.sqrt(tailSq / tailLen) : 0;
        if (rms < 0.0055 && tailRms < 0.0055) {
            self.postMessage({
                type: 'infer_result',
                seq,
                windowStartMs,
                hopDurationMs,
                rms,
                modelReady: true,
                latencyMs: 0,
                ctcText: '',
                hopSkeleton: '',
                words: [],
                charSpans: [],
                numFrames: 0,
                nonBlankFrames: 0,
                phoneDensity: 0,
                prosody
            });
            return;
        }

        inferBusy = true;
        const t0 = performance.now();
        try {
            const norm = normalizePcmFloat32(samples);
            const mask = new BigInt64Array(norm.length).fill(1n);
            const inputTensor = new TensorCtor('float32', norm, [1, norm.length]);
            const attentionMask = new TensorCtor('int64', mask, [1, norm.length]);
            const output = await modelInstance({
                input_values: inputTensor,
                attention_mask: attentionMask
            });
            const logits = output.logits;
            const dims = logits.dims || [1, 0, 392];
            const decoded = projectIpaLogitsToZemaPosteriors(
                logits.data,
                samples,
                dims[1] || 0,
                dims[2] || 392,
                hopDurationMs
            );

            self.postMessage({
                type: 'infer_result',
                seq,
                windowStartMs,
                hopDurationMs,
                rms,
                modelReady: true,
                latencyMs: Math.round(performance.now() - t0),
                ctcText: decoded.ctcText,
                hopSkeleton: decoded.hopSkeleton,
                words: decoded.words,
                charSpans: decoded.charSpans,
                numFrames: decoded.numFrames,
                nonBlankFrames: decoded.nonBlankFrames,
                phoneDensity: decoded.phoneDensity,
                framePosteriors: decoded.framePosteriors,
                frameRms: decoded.frameRms,
                hopPosteriors: decoded.hopPosteriors,
                hopRms: decoded.hopRms,
                hopFrames: decoded.hopFrames,
                prosody
            }, [
                decoded.framePosteriors.buffer,
                decoded.frameRms.buffer,
                decoded.hopPosteriors.buffer,
                decoded.hopRms.buffer
            ]);
        } catch (err) {
            self.postMessage({
                type: 'infer_result',
                seq,
                windowStartMs,
                hopDurationMs,
                rms,
                modelReady: false,
                error: err && err.message ? err.message : String(err),
                ctcText: '',
                hopSkeleton: '',
                words: [],
                charSpans: [],
                phoneDensity: 0,
                prosody
            });
        } finally {
            inferBusy = false;
        }
    }
};
