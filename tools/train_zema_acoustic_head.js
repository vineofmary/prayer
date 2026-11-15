#!/usr/bin/env node
/**
 * Supervised 10-Class Ge'ez Zema & Multilingual Sanctuary CTC Projection Head Trainer
 *
 * Unifies the acoustic worker output space directly with `liturgy_tracker.js`'s
 * 9 non-blank articulatory classes + CTC Blank:
 *   0: _ (CTC Blank — strictly pinned on <pad>/<s>/</s>/<unk>)
 *   1: A (Open vowels: a, ɑ, æ, ɐ, ʌ)
 *   2: I (Front/mid/epenthetic vowels & palatal glide: e, ə, ɛ, i, ɪ, ɨ, j, y)
 *   3: U (Rounded vowels & labiovelar glide: u, o, ɔ, ʊ, w)
 *   4: B (Labials: b, p, f, v, β)
 *   5: M (Nasals: m, n, ɲ, ŋ)
 *   6: T (Coronal stops/flaps: t, d, ɾ, ʈ, ɖ)
 *   7: S (Sibilants & affricates: s, z, ʃ, ʒ, ts, tʃ, dʒ)
 *   8: K (Velars, ejectives, uvulars & pharyngeals: k, ɡ, q, x, ɣ, χ, ʁ, ħ)
 *   9: R (Liquids: l, r, ɹ, ʎ)
 */

'use strict';

const fs = require('fs');
const path = require('path');

require('../public/js/liturgy_tracker.js');
const tracker = globalThis.liturgyTracker;

const MODEL_ID = 'air-air/xlsr-53-espeak-student-ONNX';
const SAMPLE_RATE = 16000;
const WAV_HEADER_BYTES = 44;

const CLASS_NAMES = ['_', 'A', 'I', 'U', 'B', 'M', 'T', 'S', 'K', 'R'];
const CLASS_TO_ID = Object.fromEntries(CLASS_NAMES.map((c, i) => [c, i]));
const NUM_CLASSES = CLASS_NAMES.length;

function mapIpaTokenToPriorClass(tok, id) {
    if (id <= 3 || !tok) return 0;
    const t = tok.replace(/[ːˑˈˌ͡]/g, '');
    if (/^(?:ts|dz|tʃ|dʒ|tɕ|dʑ)/.test(t)) return 7; // S
    if (/^[aɑæɐʌɶ]/.test(t)) return 1;               // A
    if (/^[əɛeɜɚɘɵœøiɪɨᵻjyɥ]/.test(t)) return 2;     // I (unifies front/mid/sads epenthetic vowels)
    if (/^[uʊoɔɤɯwʍʋ]/.test(t)) return 3;            // U
    if (/^[bpfvβɸ]/.test(t)) return 4;               // B
    if (/^[mnɲŋɱɳɴ]/.test(t)) return 5;              // M
    if (/^[tdʈɖɾθð]/.test(t)) return 6;              // T
    if (/^[szʃʒɕʑʂʐçʝ]/.test(t)) return 7;           // S
    if (/^[kɡgqcxɣχʁħʕhɦʔɟ]/.test(t)) return 8;      // K
    if (/^[lrɹɭʎɫʀɽ]/.test(t)) return 9;             // R
    return 0;
}

function encodeTargetSequence(text, preserveGutturalZema = false) {
    // Optionally preserve pharyngeal ሐ/ኀ as K on pure Ge'ez Zema words like አሐዱ -> AKATU
    let adjusted = text;
    if (preserveGutturalZema) {
        adjusted = adjusted
            .replace(/ሐ/g, 'ከአ')
            .replace(/ሑ/g, 'ኩ')
            .replace(/ሒ/g, 'ኪ')
            .replace(/ሓ/g, 'ካ')
            .replace(/ሔ/g, 'ኬ')
            .replace(/ሕ/g, 'ክ')
            .replace(/ሖ/g, 'ኮ');
    }
    const sk = tracker.toCanonicalAcousticSkeleton(adjusted).full;
    const ids = [];
    for (let i = 0; i < sk.length; i++) {
        const id = CLASS_TO_ID[sk[i]];
        if (id > 0 && (ids.length === 0 || ids[ids.length - 1] !== id)) {
            ids.push(id);
        }
    }
    return ids;
}

function readWavSlice(filePath, startSec, durSec) {
    const fd = fs.openSync(filePath, 'r');
    const n = Math.floor(durSec * SAMPLE_RATE);
    const buf = Buffer.alloc(n * 2);
    const br = fs.readSync(fd, buf, 0, buf.length, WAV_HEADER_BYTES + Math.floor(startSec * SAMPLE_RATE) * 2);
    fs.closeSync(fd);
    const len = Math.floor(br / 2);
    const raw = new Float32Array(len);
    const norm = new Float32Array(len);
    let mean = 0;
    for (let i = 0; i < len; i++) {
        raw[i] = buf.readInt16LE(i * 2) / 32768.0;
        mean += raw[i];
    }
    mean /= (len || 1);
    let sq = 0;
    for (let i = 0; i < len; i++) {
        const d = raw[i] - mean;
        sq += d * d;
    }
    const inv = 1 / Math.sqrt(sq / (len || 1) + 1e-7);
    for (let i = 0; i < len; i++) {
        norm[i] = (raw[i] - mean) * inv;
    }
    return { raw, norm };
}

function logAddExp(a, b) {
    if (a === -Infinity) return b;
    if (b === -Infinity) return a;
    return a > b ? a + Math.log1p(Math.exp(b - a)) : b + Math.log1p(Math.exp(a - b));
}

function computeCtcLossAndGrad(Z, T, targetIds) {
    const C = NUM_CLASSES;
    const U = targetIds.length;
    const L = 2 * U + 1;
    if (U === 0 || T < U) return { loss: 0, gradZ: new Float64Array(T * C) };

    const logProbs = new Float64Array(T * C);
    const probs = new Float64Array(T * C);
    for (let t = 0; t < T; t++) {
        const base = t * C;
        let maxZ = -Infinity;
        for (let c = 0; c < C; c++) if (Z[base + c] > maxZ) maxZ = Z[base + c];
        let sumExp = 0;
        for (let c = 0; c < C; c++) sumExp += Math.exp(Z[base + c] - maxZ);
        const logZ = maxZ + Math.log(sumExp);
        for (let c = 0; c < C; c++) {
            const lp = Z[base + c] - logZ;
            logProbs[base + c] = lp;
            probs[base + c] = Math.exp(lp);
        }
    }

    const extLabel = new Int32Array(L);
    for (let s = 0; s < L; s++) extLabel[s] = (s % 2 === 0) ? 0 : targetIds[(s - 1) >> 1];

    const alpha = new Float64Array(T * L).fill(-Infinity);
    alpha[0] = logProbs[extLabel[0]];
    if (L > 1) alpha[1] = logProbs[extLabel[1]];

    for (let t = 1; t < T; t++) {
        const prevOff = (t - 1) * L, currOff = t * L, lpOff = t * C;
        for (let s = 0; s < L; s++) {
            const lab = extLabel[s];
            let acc = alpha[prevOff + s];
            if (s >= 1) acc = logAddExp(acc, alpha[prevOff + s - 1]);
            if (s >= 2 && lab !== 0 && lab !== extLabel[s - 2]) {
                acc = logAddExp(acc, alpha[prevOff + s - 2]);
            }
            if (acc !== -Infinity) alpha[currOff + s] = acc + logProbs[lpOff + lab];
        }
    }

    const logLik = L > 1
        ? logAddExp(alpha[(T - 1) * L + L - 1], alpha[(T - 1) * L + L - 2])
        : alpha[(T - 1) * L];
    if (!Number.isFinite(logLik)) return { loss: 50, gradZ: new Float64Array(T * C) };

    const beta = new Float64Array(T * L).fill(-Infinity);
    beta[(T - 1) * L + (L - 1)] = 0;
    if (L > 1) beta[(T - 1) * L + (L - 2)] = 0;

    for (let t = T - 2; t >= 0; t--) {
        const nextOff = (t + 1) * L, currOff = t * L, nextLpOff = (t + 1) * C;
        for (let s = 0; s < L; s++) {
            const lab = extLabel[s];
            let acc = beta[nextOff + s] + logProbs[nextLpOff + lab];
            if (s + 1 < L) acc = logAddExp(acc, beta[nextOff + s + 1] + logProbs[nextLpOff + extLabel[s + 1]]);
            if (s + 2 < L && extLabel[s + 2] !== 0 && extLabel[s + 2] !== lab) {
                acc = logAddExp(acc, beta[nextOff + s + 2] + logProbs[nextLpOff + extLabel[s + 2]]);
            }
            beta[currOff + s] = acc;
        }
    }

    const gradZ = new Float64Array(T * C);
    for (let t = 0; t < T; t++) {
        const cAcc = new Float64Array(C).fill(-Infinity);
        const abOff = t * L;
        for (let s = 0; s < L; s++) {
            const a = alpha[abOff + s], b = beta[abOff + s];
            if (a === -Infinity || b === -Infinity) continue;
            cAcc[extLabel[s]] = logAddExp(cAcc[extLabel[s]], a + b);
        }
        let normLog = -Infinity;
        for (let c = 0; c < C; c++) normLog = logAddExp(normLog, cAcc[c]);
        const base = t * C;
        for (let c = 0; c < C; c++) {
            const gamma = normLog !== -Infinity && cAcc[c] !== -Infinity ? Math.exp(cAcc[c] - normLog) : 0;
            gradZ[base + c] = (probs[base + c] - gamma) / T;
        }
    }

    return { loss: -logLik / T, gradZ };
}

function editDistance(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Int32Array(n + 1));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] = a[i - 1] === b[j - 1]
                ? dp[i - 1][j - 1]
                : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m][n];
}

// Vibrato-invariant CTC collapse: collapses consecutive identical non-blank classes across
// brief Zema pitch/vibrato dips (mirrors `toCanonicalAcousticSkeleton` deduplication!)
function decodeCollapsedClasses(Z, fRmsArr, T) {
    const out = [];
    let prevNonBlank = 0;
    for (let t = 0; t < T; t++) {
        if (fRmsArr[t] < 0.0075) continue;
        const base = t * NUM_CLASSES;
        let bestC = 0;
        let bestV = Z[base];
        for (let c = 1; c < NUM_CLASSES; c++) {
            if (Z[base + c] > bestV) {
                bestV = Z[base + c];
                bestC = c;
            }
        }
        if (bestC > 0 && bestC !== prevNonBlank) {
            out.push(bestC);
            prevNonBlank = bestC;
        }
    }
    return out;
}

async function main() {
    console.log('=== Training Supervised 10-Class Ge\'ez Zema CTC Acoustic Head ===');
    const { AutoModelForCTC, Tensor } = await import('@huggingface/transformers');

    const vocabPath = path.resolve(__dirname, 'node_modules/@huggingface/transformers/.cache', MODEL_ID, 'vocab.json');
    const vocabObj = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
    const V = Object.keys(vocabObj).length;
    const idToTok = new Array(V).fill('');
    for (const [k, v] of Object.entries(vocabObj)) idToTok[v] = k;

    const model = await AutoModelForCTC.from_pretrained(MODEL_ID, { dtype: 'q4' });

    const CORPUS = [
        { name: 'awsu', file: '.cache/zema_16k/awsu.wav', start: 0, dur: 14.0, text: 'አውሥኡ', zemaGuttural: false, split: 'train' },
        { name: 'ninetser', file: '.cache/zema_16k/ninetser.wav', start: 0, dur: 16.4, text: 'ንነጽር', zemaGuttural: false, split: 'train' },
        { name: 'wiste_tsibah', file: '.cache/zema_16k/wiste_tsibah.wav', start: 0, dur: 17.3, text: 'ውስተ ጽባሕ ነጽሩ', zemaGuttural: true, split: 'train' },
        { name: 'ansiu_edewikimu', file: '.cache/zema_16k/ansiu_edewikimu.wav', start: 0, dur: 22.0, text: 'አንሥኡ እደዊክሙ ቀሳውስት', zemaGuttural: false, split: 'train' },
        { name: 'webotu_open', file: '.cache/zema_16k/webotu.wav', start: 0, dur: 22.0, text: 'ወቦቱ ረሰይከ ለነ', zemaGuttural: false, split: 'train' },
        { name: 'ahadu_1', file: '.cache/zema_16k/ahadu.wav', start: 0, dur: 46.0, text: 'አሐዱ አብ ቅዱስ', zemaGuttural: true, split: 'train' },
        { name: 'ahadu_2', file: '.cache/zema_16k/ahadu.wav', start: 46, dur: 44.0, text: 'አሐዱ ወልድ ቅዱስ', zemaGuttural: true, split: 'train' },
        { name: 'oak_doxology_1', file: '.cache/yt_osUtNVTlkFM_16k.wav', start: 73, dur: 14.0, text: 'ብሩክ እግዚአብሔር አብ አኃዜ ኵሉ', zemaGuttural: false, split: 'train' },
        { name: 'oak_mary_incipit', file: '.cache/yt_osUtNVTlkFM_16k.wav', start: 4716, dur: 8.0, text: 'በቅዳሴ ለማርያም', zemaGuttural: false, split: 'train' },
        // Validation split
        { name: 'ahadu_3_val', file: '.cache/zema_16k/ahadu.wav', start: 90, dur: 30.0, text: 'አሐዱ ውእቱ መንፈስ ቅዱስ', zemaGuttural: true, split: 'val' },
        { name: 'oak_rom11_val', file: '.cache/yt_osUtNVTlkFM_16k.wav', start: 1814, dur: 12.0, text: 'ለእናንተ ለአሕዛብ እናገራለሁ እኔ የአሕዛብ ሐዋርያ', zemaGuttural: false, split: 'val' }
    ];

    const extracted = [];
    for (const item of CORPUS) {
        const fPath = path.resolve(__dirname, item.file);
        if (!fs.existsSync(fPath)) continue;
        const { raw, norm } = readWavSlice(fPath, item.start, item.dur);
        const mask = new BigInt64Array(norm.length).fill(1n);
        const out = await model({
            input_values: new Tensor('float32', norm, [1, norm.length]),
            attention_mask: new Tensor('int64', mask, [1, norm.length])
        });
        const T50 = out.logits.dims[1];
        const T = Math.floor(T50 / 2);
        const hopSamples = Math.floor(raw.length / T);
        const ipaProbs = new Float32Array(T * V);
        const fRms = new Float32Array(T);

        for (let t = 0; t < T; t++) {
            let fsq = 0;
            const s0 = t * hopSamples;
            for (let i = 0; i < hopSamples && s0 + i < raw.length; i++) fsq += raw[s0 + i] * raw[s0 + i];
            fRms[t] = Math.sqrt(fsq / hopSamples);

            for (let sub = 0; sub < 2; sub++) {
                const base50 = (t * 2 + sub) * V;
                let maxL = -Infinity;
                for (let v = 0; v < V; v++) if (out.logits.data[base50 + v] > maxL) maxL = out.logits.data[base50 + v];
                let sumE = 0;
                for (let v = 0; v < V; v++) sumE += Math.exp(out.logits.data[base50 + v] - maxL);
                const invS = 0.5 / sumE;
                const dst = t * V;
                for (let v = 0; v < V; v++) ipaProbs[dst + v] += Math.exp(out.logits.data[base50 + v] - maxL) * invS;
            }
        }

        const targetIds = encodeTargetSequence(item.text, item.zemaGuttural);
        extracted.push({
            ...item,
            T,
            ipaProbs,
            fRms,
            targetIds,
            targetStr: targetIds.map(id => CLASS_NAMES[id]).join('')
        });
    }

    const theta0 = new Float64Array(NUM_CLASSES * V);
    for (let v = 0; v < V; v++) {
        const priorC = mapIpaTokenToPriorClass(idToTok[v], v);
        for (let c = 0; c < NUM_CLASSES; c++) {
            theta0[c * V + v] = (c === priorC) ? 4.2 : -1.2;
        }
    }
    const theta = new Float64Array(theta0);
    let voicedBlankShift = -3.65;

    function buildRoutingMatrix() {
        const R = new Float64Array(NUM_CLASSES * V);
        // STRICT PIN: tokens 0..3 (<pad>, <s>, </s>, <unk>) route 100% to BLANK (class 0)!
        for (let v = 0; v < 4; v++) {
            R[0 * V + v] = 1.0;
        }
        for (let v = 4; v < V; v++) {
            let maxT = -Infinity;
            for (let c = 0; c < NUM_CLASSES; c++) if (theta[c * V + v] > maxT) maxT = theta[c * V + v];
            let sumE = 0;
            for (let c = 0; c < NUM_CLASSES; c++) {
                const e = Math.exp(theta[c * V + v] - maxT);
                R[c * V + v] = e;
                sumE += e;
            }
            for (let c = 0; c < NUM_CLASSES; c++) R[c * V + v] /= sumE;
        }
        return R;
    }

    function forwardClip(clip, R) {
        const { T, ipaProbs, fRms } = clip;
        const Z = new Float64Array(T * NUM_CLASSES);
        const P_pooled = new Float64Array(T * NUM_CLASSES);
        for (let t = 0; t < T; t++) {
            const pOff = t * V, zOff = t * NUM_CLASSES;
            const voiced = fRms[t] >= 0.008;
            for (let c = 0; c < NUM_CLASSES; c++) {
                const rOff = c * V;
                let s = 1e-6;
                for (let v = 0; v < V; v++) s += R[rOff + v] * ipaProbs[pOff + v];
                P_pooled[zOff + c] = s;
                Z[zOff + c] = Math.log(s) + (c === 0 ? (voiced ? voicedBlankShift : 2.5) : 0);
            }
        }
        return { P_pooled, Z };
    }

    function evaluateSplit(splitName) {
        const R = buildRoutingMatrix();
        let totLoss = 0, count = 0, totEd = 0, totLen = 0;
        for (const clip of extracted) {
            if (clip.split !== splitName) continue;
            const { Z } = forwardClip(clip, R);
            const { loss } = computeCtcLossAndGrad(Z, clip.T, clip.targetIds);
            const predIds = decodeCollapsedClasses(Z, clip.fRms, clip.T);
            totLoss += loss;
            count++;
            totEd += editDistance(predIds, clip.targetIds);
            totLen += clip.targetIds.length;
        }
        return { loss: count ? totLoss / count : 0, per: totLen ? totEd / totLen : 0 };
    }

    const initTr = evaluateSplit('train');
    const initVa = evaluateSplit('val');
    console.log(`Initial  -> Train Loss: ${initTr.loss.toFixed(4)} (PER ${(initTr.per * 100).toFixed(1)}%) | Val Loss: ${initVa.loss.toFixed(4)} (PER ${(initVa.per * 100).toFixed(1)}%)`);

    const mTheta = new Float64Array(theta.length);
    const vTheta = new Float64Array(theta.length);
    let mBlank = 0, vBlank = 0;
    const lr = 0.035;
    const beta1 = 0.9, beta2 = 0.999, eps = 1e-8;
    const l2Prior = 0.025; // Preserves universal IPA phonology while suppressing Zema vibrato noise
    const EPOCHS = 36;

    for (let ep = 1; ep <= EPOCHS; ep++) {
        const R = buildRoutingMatrix();
        const gTheta = new Float64Array(theta.length);
        let gBlank = 0;
        let trainClips = 0;

        for (const clip of extracted) {
            if (clip.split !== 'train') continue;
            trainClips++;
            const { P_pooled, Z } = forwardClip(clip, R);
            const { gradZ } = computeCtcLossAndGrad(Z, clip.T, clip.targetIds);

            const dR = new Float64Array(NUM_CLASSES * V);
            for (let t = 0; t < clip.T; t++) {
                const zOff = t * NUM_CLASSES, pOff = t * V;
                if (clip.fRms[t] >= 0.008) gBlank += gradZ[zOff + 0];
                for (let c = 0; c < NUM_CLASSES; c++) {
                    const coeff = gradZ[zOff + c] / P_pooled[zOff + c];
                    if (Math.abs(coeff) < 1e-9) continue;
                    const rOff = c * V;
                    for (let v = 4; v < V; v++) {
                        const ip = clip.ipaProbs[pOff + v];
                        if (ip > 1e-5) dR[rOff + v] += coeff * ip;
                    }
                }
            }

            // Backprop only for v >= 4 (tokens 0..3 stay strictly pinned to Blank!)
            for (let v = 4; v < V; v++) {
                let dot = 0;
                for (let c = 0; c < NUM_CLASSES; c++) dot += R[c * V + v] * dR[c * V + v];
                for (let c = 0; c < NUM_CLASSES; c++) {
                    const idx = c * V + v;
                    gTheta[idx] += R[idx] * (dR[idx] - dot);
                }
            }
        }

        for (let v = 4; v < V; v++) {
            for (let c = 0; c < NUM_CLASSES; c++) {
                const i = c * V + v;
                gTheta[i] = gTheta[i] / trainClips + l2Prior * (theta[i] - theta0[i]);
                mTheta[i] = beta1 * mTheta[i] + (1 - beta1) * gTheta[i];
                vTheta[i] = beta2 * vTheta[i] + (1 - beta2) * gTheta[i] * gTheta[i];
                theta[i] -= lr * (mTheta[i] / (1 - Math.pow(beta1, ep))) / (Math.sqrt(vTheta[i] / (1 - Math.pow(beta2, ep))) + eps);
            }
        }

        gBlank /= trainClips;
        mBlank = beta1 * mBlank + (1 - beta1) * gBlank;
        vBlank = beta2 * vBlank + (1 - beta2) * gBlank * gBlank;
        voicedBlankShift -= (lr * 0.25) * (mBlank / (1 - Math.pow(beta1, ep))) / (Math.sqrt(vBlank / (1 - Math.pow(beta2, ep))) + eps);
        voicedBlankShift = Math.max(-4.1, Math.min(-2.8, voicedBlankShift));

        if (ep === 1 || ep % 12 === 0 || ep === EPOCHS) {
            const tr = evaluateSplit('train');
            const va = evaluateSplit('val');
            console.log(`Epoch ${String(ep).padStart(2)} -> Train Loss: ${tr.loss.toFixed(4)} (PER ${(tr.per * 100).toFixed(1)}%) | Val Loss: ${va.loss.toFixed(4)} (PER ${(va.per * 100).toFixed(1)}%) | blankShift=${voicedBlankShift.toFixed(2)}`);
        }
    }

    const R_final_flat = buildRoutingMatrix();
    console.log('\n--- Post-Training Decoded Zema & Sanctuary Clips ---');
    for (const clip of extracted) {
        const { Z } = forwardClip(clip, R_final_flat);
        const pred = decodeCollapsedClasses(Z, clip.fRms, clip.T).map(id => CLASS_NAMES[id]).join('');
        console.log(`  [${clip.split.padEnd(5)}] ${clip.name.padEnd(18)} | Target: ${clip.targetStr.padEnd(28)} | Pred: ${pred.slice(0, 64)}`);
    }

    const routingRows = Array.from({ length: NUM_CLASSES }, (_, c) =>
        Array.from({ length: V }, (__, v) => Math.round(R_final_flat[c * V + v] * 10000) / 10000)
    );

    const outJsPath = path.resolve(__dirname, '../public/js/zema_acoustic_model_data.js');
    const jsContent = `// ============================================================================
// MOUNT OF MERCY — Supervised 10-Class Ge'ez Zema CTC Acoustic Projection Head
// ============================================================================
// Trained via exact Forward-Backward CTC Loss on Debre Abay / 1 ሥርዓተ ቅዳሴ
// Ge'ez & Izzel Zema recordings + Oakland Kidus Michael sanctuary audio
// over universal 53-language IPA CTC (${MODEL_ID}).
// ============================================================================

(function (root) {
    'use strict';

    const ZEMA_ACOUSTIC_MODEL_DATA = {
        modelId: ${JSON.stringify(MODEL_ID)},
        classNames: ${JSON.stringify(CLASS_NAMES)},
        classes: ${JSON.stringify(CLASS_NAMES)},
        voicedBlankShift: ${Math.round(voicedBlankShift * 1000) / 1000},
        unvoicedBlankBoost: 2.5,
        ipaVocab: ${JSON.stringify(idToTok)},
        // [10 x ${V}] Bayesian probability routing matrix R[classIdx][tokenId]
        routingMatrix: ${JSON.stringify(routingRows)}
    };

    if (root) {
        root.ZEMA_ACOUSTIC_MODEL_DATA = ZEMA_ACOUSTIC_MODEL_DATA;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ZEMA_ACOUSTIC_MODEL_DATA;
    }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof self !== 'undefined' ? self : this));
`;
    fs.writeFileSync(outJsPath, jsContent, 'utf8');
    console.log(`\nWrote calibrated Zema CTC head (${Math.round(jsContent.length / 1024)} KB) -> ${outJsPath}`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
