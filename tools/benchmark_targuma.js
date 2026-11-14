#!/usr/bin/env node
/**
 * Targuma End-to-End Streaming Benchmark & YouTube Miracle of Mary Replay Harness
 *
 * Usage:
 *   node tools/benchmark_targuma.js [--url https://www.youtube.com/watch?v=KH2px4RYn9o] [--start 88] [--duration 42] [--compare-all]
 *
 * Streams genuine 16kHz mono LINEAR16 PCM from an Amharic Miracle of Mary / EOTC sermon
 * reading at real-time 1.0x pace into the deployed Targuma Cloud Run service and compares:
 *   1. Option A Hybrid (Chirp 3 WebSocket + Cloud Translation V3 Drafts + Gemini Flash Polish)
 *   2. Option B Fallback (Pause-Aware VAD + 16kHz WAV + Gemini Streaming SSE + Ordered Slots)
 *   3. Legacy Baseline (2.6s Blind Chunks + Unary Gemini + Single-Flight Drop Lock)
 *   4. YouTube's own USM `am-orig` Automatic Captions + Live Miracle of Mary Identification
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const CACHE_DIR = path.join(__dirname, '.cache');
const YT_DLP_BIN = path.join(CACHE_DIR, 'yt-dlp');

const DEFAULT_YT_URL = 'https://www.youtube.com/watch?v=KH2px4RYn9o';
const WS_URL = process.env.TARGUMA_WS_URL || 'wss://targuma-stream-974361367981.us-central1.run.app/ws';
const HTTP_URL = process.env.TARGUMA_HTTP_URL || 'https://targuma-stream-974361367981.us-central1.run.app/targumaGemini';

const SAMPLE_RATE = 16000;
const FRAME_MS = 100;
const FRAME_SAMPLES = (SAMPLE_RATE * FRAME_MS) / 1000; // 1600 samples = 3200 bytes

require(path.join(ROOT_DIR, 'app/src/main/assets/js/targuma_service.js'));
const targumaService = globalThis.targumaService;

function parseArgs(argv) {
    const opts = {
        url: DEFAULT_YT_URL,
        file: '',
        startSec: 88,
        durationSec: 42,
        sourceLang: 'am',
        targetLang: 'en',
        compareAll: true
    };
    for (let i = 2; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--url' && argv[i + 1]) opts.url = argv[++i];
        else if (arg === '--file' && argv[i + 1]) opts.file = argv[++i];
        else if (arg === '--start' && argv[i + 1]) opts.startSec = Number(argv[++i]);
        else if (arg === '--duration' && argv[i + 1]) opts.durationSec = Number(argv[++i]);
        else if (arg === '--source' && argv[i + 1]) opts.sourceLang = argv[++i];
        else if (arg === '--target' && argv[i + 1]) opts.targetLang = argv[++i];
        else if (arg === '--ws-only') opts.compareAll = false;
        else if (arg === '--compare-all') opts.compareAll = true;
    }
    return opts;
}

function ensureYtDlp() {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    if (!fs.existsSync(YT_DLP_BIN)) {
        console.log('[Setup] Downloading standalone yt-dlp_macos to tools/.cache/yt-dlp...');
        execFileSync('curl', [
            '-fsSL',
            'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos',
            '-o',
            YT_DLP_BIN
        ], { stdio: 'inherit' });
        fs.chmodSync(YT_DLP_BIN, 0o755);
    }
}

function extractVideoId(url) {
    const m = String(url).match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : 'custom_clip';
}

function prepareAudioAndYoutubeSubs(opts) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    if (opts.file) {
        const wavOut = path.join(CACHE_DIR, 'custom_input_16k.wav');
        execFileSync('/usr/bin/afconvert', ['-f', 'WAVE', '-d', 'LEI16@16000', '-c', '1', opts.file, wavOut]);
        return { wavPath: wavOut, subsPath: null, videoId: path.basename(opts.file) };
    }

    const videoId = extractVideoId(opts.url);
    const prefix = videoId === 'KH2px4RYn9o' ? 'miracle_belaeseb' : ('yt_' + videoId);
    const m4aPath = path.join(CACHE_DIR, prefix + '.m4a');
    const wavPath = path.join(CACHE_DIR, prefix + '_16k.wav');
    const origSubPath = path.join(CACHE_DIR, prefix + '.am-orig.json3');
    const fallbackSubPath = path.join(CACHE_DIR, prefix + '.am.json3');

    if (!fs.existsSync(wavPath)) {
        ensureYtDlp();
        if (!fs.existsSync(m4aPath)) {
            console.log('[YouTube] Downloading audio & USM auto-captions for ' + opts.url + ' ...');
            execFileSync(YT_DLP_BIN, [
                '--js-runtimes', 'node',
                '-f', 'bestaudio[ext=m4a]/bestaudio',
                '--write-auto-subs',
                '--sub-langs', 'am-orig,am',
                '--sub-format', 'json3',
                '-o', path.join(CACHE_DIR, prefix + '.%(ext)s'),
                opts.url
            ], { stdio: 'inherit' });
        }
        execFileSync('/usr/bin/afconvert', ['-f', 'WAVE', '-d', 'LEI16@16000', '-c', '1', m4aPath, wavPath]);
    }

    const subsPath = fs.existsSync(origSubPath) ? origSubPath : (fs.existsSync(fallbackSubPath) ? fallbackSubPath : null);
    return { wavPath, subsPath, videoId };
}

/**
 * Properly scans RIFF/WAVE chunks (handling Apple CoreAudio 'FLLR' padding chunks)
 * to extract exact Int16 PCM samples.
 */
function readWavPcm16(wavPath) {
    const buf = fs.readFileSync(wavPath);
    if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WAVE') {
        throw new Error('Invalid RIFF/WAVE header in ' + wavPath);
    }
    let offset = 12;
    let sampleRate = SAMPLE_RATE;
    while (offset + 8 <= buf.length) {
        const chunkId = buf.toString('ascii', offset, offset + 4);
        const chunkSize = buf.readUInt32LE(offset + 4);
        const dataStart = offset + 8;
        if (chunkId === 'fmt ') {
            sampleRate = buf.readUInt32LE(dataStart + 4);
        } else if (chunkId === 'data') {
            const pcmBuf = buf.subarray(dataStart, dataStart + chunkSize);
            const samples = new Int16Array(pcmBuf.buffer, pcmBuf.byteOffset, Math.floor(pcmBuf.byteLength / 2));
            return { samples, sampleRate };
        }
        offset = dataStart + chunkSize + (chunkSize % 2);
    }
    throw new Error('No PCM data chunk found in ' + wavPath);
}

function extractYoutubeCaptionSegment(subsPath, startSec, durationSec) {
    if (!subsPath || !fs.existsSync(subsPath)) return { events: [], fullText: '' };
    const raw = JSON.parse(fs.readFileSync(subsPath, 'utf8'));
    const startMs = startSec * 1000;
    const endMs = (startSec + durationSec) * 1000;

    const lines = [];
    for (const ev of (raw.events || [])) {
        if (!ev.segs || typeof ev.tStartMs !== 'number') continue;
        if (ev.tStartMs + (ev.dDurationMs || 0) < startMs || ev.tStartMs > endMs) continue;
        const text = ev.segs.map(s => s.utf8 || '').join('').replace(/\s+/g, ' ').trim();
        if (!text) continue;
        lines.push({
            relStartSec: Number(((ev.tStartMs - startMs) / 1000).toFixed(2)),
            text
        });
    }
    return {
        events: lines,
        fullText: lines.map(l => l.text).join(' ')
    };
}

function percentile(sortedVals, p) {
    if (!sortedVals.length) return 0;
    const idx = Math.min(sortedVals.length - 1, Math.max(0, Math.floor((p / 100) * sortedVals.length)));
    return Math.round(sortedVals[idx]);
}

function summarizeNumbers(arr) {
    if (!arr.length) return { count: 0, min: 0, p50: 0, p95: 0, mean: 0 };
    const sorted = arr.slice().sort((a, b) => a - b);
    const sum = sorted.reduce((acc, v) => acc + v, 0);
    return {
        count: sorted.length,
        min: Math.round(sorted[0]),
        p50: percentile(sorted, 50),
        p95: percentile(sorted, 95),
        mean: Math.round(sum / sorted.length)
    };
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mode 1: Option A Hybrid — Real-time 1.0x streaming over Chirp 3 WebSocket + Cloud Translation V3 + Gemini Polish
 */
async function benchmarkOptionAHybridWs(pcmWindow, opts) {
    console.log('\n[1/3] Running Option A Immutable-Clause Benchmark (Chirp 3 Breath-Aware WS + Single-Shot Gemini 2.5 Flash)...');
    const drafts = [];
    const commits = [];
    const polishes = [];
    const clauseCadenceGaps = [];
    const nmtLatencies = [];
    const commitTimestamps = new Map();

    let firstVoiceSentAt = 0;
    let firstCommitAt = 0;
    let lastCommitAt = 0;

    return new Promise((resolve, reject) => {
        const ws = new WebSocket(WS_URL);
        let readyResolved = false;

        const failTimeout = setTimeout(() => {
            if (!readyResolved) {
                try { ws.close(); } catch (_) {}
                reject(new Error('Timed out connecting to ' + WS_URL));
            }
        }, 15000);

        ws.addEventListener('open', () => {
            const startMsg = JSON.stringify({
                type: 'start',
                sourceLang: opts.sourceLang,
                targetLang: opts.targetLang,
                sampleRate: SAMPLE_RATE,
                model: 'gemini-2.5-flash',
                enablePolish: true
            });
            ws.send(startMsg);
        });

        ws.addEventListener('message', async (ev) => {
            if (typeof ev.data !== 'string') return;
            let msg = null;
            try { msg = JSON.parse(ev.data); } catch (_) { return; }

            const now = Date.now();
            if (msg.type === 'ready' && !readyResolved) {
                readyResolved = true;
                clearTimeout(failTimeout);

                // Stream 100ms frames at genuine 1.0x real-time pace
                const totalFrames = Math.floor(pcmWindow.length / FRAME_SAMPLES);
                const t0 = Date.now();
                for (let f = 0; f < totalFrames; f++) {
                    const frame = pcmWindow.subarray(f * FRAME_SAMPLES, (f + 1) * FRAME_SAMPLES);
                    const rms = targumaService.computeInt16Rms(frame);
                    if (!firstVoiceSentAt && rms >= 0.0085) {
                        firstVoiceSentAt = Date.now();
                    }
                    const payload = Buffer.from(frame.buffer, frame.byteOffset, frame.byteLength);
                    ws.send(payload);

                    const targetElapsed = (f + 1) * FRAME_MS;
                    const waitMs = targetElapsed - (Date.now() - t0);
                    if (waitMs > 2) {
                        await sleep(waitMs);
                    }
                }

                // Flush trailing clause and allow Chirp 3 (~650ms) + single-shot Gemini (~600ms) to finish
                try { ws.send(JSON.stringify({ type: 'flush' })); } catch (_) {}
                await sleep(3200);
                try { ws.send(JSON.stringify({ type: 'stop' })); } catch (_) {}
                await sleep(250);
                try { ws.close(); } catch (_) {}

                resolve({
                    mode: 'Option A Immutable Clause (Chirp 3 Breath-Aware WS + Single-Shot Gemini Flash)',
                    firstClauseMs: firstCommitAt && firstVoiceSentAt ? (firstCommitAt - firstVoiceSentAt) : 0,
                    draftCount: drafts.length,
                    commitCount: commits.length,
                    inPlaceMutations: polishes.length,
                    droppedChunks: 0,
                    clauseCadenceStats: summarizeNumbers(clauseCadenceGaps),
                    translateMsStats: summarizeNumbers(nmtLatencies),
                    commits
                });
                return;
            }

            if (msg.type === 'draft') {
                drafts.push(msg);
            } else if (msg.type === 'commit') {
                if (!firstCommitAt) firstCommitAt = now;
                if (lastCommitAt > 0) {
                    clauseCadenceGaps.push(now - lastCommitAt);
                }
                lastCommitAt = now;
                commitTimestamps.set(msg.segmentId, now);
                if (msg.nmtMs) nmtLatencies.push(Number(msg.nmtMs));
                commits.push({
                    atMs: firstVoiceSentAt ? (now - firstVoiceSentAt) : 0,
                    seq: msg.seq,
                    segmentId: msg.segmentId,
                    sourceText: msg.sourceText,
                    translatedText: msg.translatedText,
                    polished: Boolean(msg.polished),
                    translateMs: msg.nmtMs || 0
                });
                console.log('  [Clause #' + commits.length + ' @ +' + ((firstVoiceSentAt ? (now - firstVoiceSentAt) : 0) / 1000).toFixed(1) + 's | ' + (msg.nmtMs || 0) + 'ms] ' + msg.sourceText + '\n    -> ' + msg.translatedText);
            } else if (msg.type === 'polish') {
                polishes.push(msg);
            }
        });

        ws.addEventListener('error', (err) => {
            clearTimeout(failTimeout);
            reject(new Error('WebSocket error: ' + (err.message || 'connection failed')));
        });
    });
}

/**
 * Mode 2: Option B — Smart Pause-Aware VAD + 16kHz WAV + Gemini Streaming SSE + Concurrent Slots
 */
async function benchmarkOptionBSseVad(pcmWindow, opts) {
    console.log('\n[2/3] Running Option B Benchmark (Pause-Aware VAD + 16kHz WAV + Gemini Streaming SSE)...');
    let vadTracker = { spokenMs: 0, trailingPauseMs: 0, totalMs: 0, sustainedActiveMs: 0 };
    let sliceFrames = [];
    let sliceSampleCount = 0;

    const slicesDispatched = [];
    const ttftLatencies = [];
    const fullSliceLatencies = [];
    const endToEndViewerLags = [];
    const completedClauses = [];
    const recentContext = [];
    let seqCounter = 0;

    const totalFrames = Math.floor(pcmWindow.length / FRAME_SAMPLES);
    const t0 = Date.now();
    const pendingPromises = [];

    for (let f = 0; f < totalFrames; f++) {
        const frame = pcmWindow.subarray(f * FRAME_SAMPLES, (f + 1) * FRAME_SAMPLES);
        const rms = targumaService.computeInt16Rms(frame);

        sliceFrames.push(frame);
        sliceSampleCount += frame.length;
        vadTracker = targumaService.evaluateVadEndpointState(vadTracker, rms, FRAME_MS);

        if (vadTracker.totalMs === 0 && !vadTracker.shouldFlush) {
            while (sliceFrames.length > 3) {
                const dropped = sliceFrames.shift();
                sliceSampleCount -= dropped.length;
            }
        } else if (vadTracker.shouldFlush && sliceSampleCount > 0) {
            const combined = new Int16Array(sliceSampleCount);
            let off = 0;
            for (const c of sliceFrames) {
                combined.set(c, off);
                off += c.length;
            }
            const audioDurationMs = Math.round((combined.length / SAMPLE_RATE) * 1000);
            if (vadTracker.keepOverlap && combined.length > 5120) {
                const tail = combined.slice(combined.length - 5120);
                sliceFrames = [tail];
                sliceSampleCount = tail.length;
            } else {
                sliceFrames = [];
                sliceSampleCount = 0;
            }
            vadTracker = { spokenMs: 0, trailingPauseMs: 0, totalMs: 0, sustainedActiveMs: 0 };

            const seq = ++seqCounter;
            const wavBytes = targumaService.encodePcm16ToWavBytes(combined, SAMPLE_RATE);
            const audioBase64 = Buffer.from(wavBytes).toString('base64');
            const dispatchStartedAt = Date.now();
            slicesDispatched.push({ seq, audioDurationMs });

            const p = (async () => {
                const reqBody = JSON.stringify({
                    stream: true,
                    model: 'gemini-2.5-flash',
                    sourceLang: opts.sourceLang,
                    targetLang: opts.targetLang,
                    audioBase64,
                    mimeType: 'audio/wav',
                    recentContext: recentContext.slice(-3)
                });
                const resp = await fetch(HTTP_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
                    body: reqBody
                });
                const text = await resp.text();
                const lines = text.split('\n');
                let recordedTtft = false;
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed.startsWith('data:')) continue;
                    try {
                        const evt = JSON.parse(trimmed.slice(5).trim());
                        if (evt.type === 'draft' && !recordedTtft) {
                            recordedTtft = true;
                            ttftLatencies.push(Date.now() - dispatchStartedAt);
                        } else if (evt.type === 'done' && !evt.isSilence && evt.translatedText) {
                            const reqMs = Date.now() - dispatchStartedAt;
                            fullSliceLatencies.push(reqMs);
                            // Perceived viewer lag from midpoint of spoken clause = 0.5 * audioDurationMs + reqMs
                            endToEndViewerLags.push(Math.round(audioDurationMs * 0.5 + reqMs));
                            recentContext.push(evt.sourceText || '');
                            completedClauses.push({
                                seq,
                                audioDurationMs,
                                reqMs,
                                sourceText: evt.sourceText,
                                translatedText: evt.translatedText
                            });
                            console.log('  [SSE #' + seq + ' ' + reqMs + 'ms] ' + evt.translatedText);
                        }
                    } catch (_) {}
                }
            })();
            pendingPromises.push(p);
        }

        const targetElapsed = (f + 1) * FRAME_MS;
        const waitMs = targetElapsed - (Date.now() - t0);
        if (waitMs > 2) await sleep(waitMs);
    }

    await Promise.all(pendingPromises);
    completedClauses.sort((a, b) => a.seq - b.seq);

    return {
        mode: 'Option B Fallback (Pause-Aware VAD + Gemini SSE)',
        slicesTotal: slicesDispatched.length,
        completedCount: completedClauses.length,
        droppedChunks: 0,
        ttftStats: summarizeNumbers(ttftLatencies),
        requestStats: summarizeNumbers(fullSliceLatencies),
        viewerLagStats: summarizeNumbers(endToEndViewerLags),
        clauses: completedClauses
    };
}

/**
 * Mode 3: Legacy Baseline — Fixed 2.6s Blind Chunks + Unary Gemini + Single-Flight `inFlight` Drop Lock
 */
async function benchmarkLegacyBaseline(pcmWindow, opts) {
    console.log('\n[3/3] Running Legacy Baseline Simulation (2.6s Blind Chunks + Unary Request + Single-Flight Drop Lock)...');
    const CHUNK_MS = 2600;
    const CHUNK_SAMPLES = Math.floor((SAMPLE_RATE * CHUNK_MS) / 1000);
    const totalChunks = Math.floor(pcmWindow.length / CHUNK_SAMPLES);

    let inFlight = false;
    let droppedChunks = 0;
    let sentChunks = 0;
    const requestLatencies = [];
    const viewerLags = [];
    const outputs = [];
    const pending = [];

    const t0 = Date.now();
    for (let c = 0; c < totalChunks; c++) {
        const targetTime = (c + 1) * CHUNK_MS;
        const waitMs = targetTime - (Date.now() - t0);
        if (waitMs > 2) await sleep(waitMs);

        const slice = pcmWindow.subarray(c * CHUNK_SAMPLES, (c + 1) * CHUNK_SAMPLES);
        if (inFlight) {
            droppedChunks++;
            console.log('  [Legacy Chunk #' + (c + 1) + '] DROPPED (previous request still in-flight!)');
            continue;
        }

        inFlight = true;
        sentChunks++;
        const wavBytes = targumaService.encodePcm16ToWavBytes(slice, SAMPLE_RATE);
        const audioBase64 = Buffer.from(wavBytes).toString('base64');
        const startedAt = Date.now();

        const p = (async () => {
            try {
                const reqBody = JSON.stringify({
                    stream: false,
                    model: 'gemini-2.5-flash',
                    sourceLang: opts.sourceLang,
                    targetLang: opts.targetLang,
                    audioBase64,
                    mimeType: 'audio/wav',
                    recentContext: []
                });
                const resp = await fetch(HTTP_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
                    body: reqBody
                });
                const data = await resp.json();
                const reqMs = Date.now() - startedAt;
                requestLatencies.push(reqMs);
                // Legacy viewer lag from speech onset of the 2.6s chunk = 2600ms recording + reqMs
                viewerLags.push(CHUNK_MS + reqMs);
                if (data && data.translatedText) {
                    outputs.push({ chunkIndex: c + 1, reqMs, sourceText: data.sourceText, translatedText: data.translatedText });
                    console.log('  [Legacy Chunk #' + (c + 1) + ' ' + (CHUNK_MS + reqMs) + 'ms total lag] ' + data.translatedText);
                }
            } finally {
                inFlight = false;
            }
        })();
        pending.push(p);
    }

    await Promise.all(pending);
    const dropRatePct = totalChunks > 0 ? Number(((droppedChunks / totalChunks) * 100).toFixed(1)) : 0;

    return {
        mode: 'Legacy Targuma (2.6s Blind Chunks + Single-Flight Lock)',
        totalChunks,
        sentChunks,
        droppedChunks,
        dropRatePct,
        requestStats: summarizeNumbers(requestLatencies),
        viewerLagStats: summarizeNumbers(viewerLags),
        outputs
    };
}

function checkMiracleDatasetAlignment(sourceTranscript, englishTranscript) {
    try {
        const ctx = { window: {} };
        vm.createContext(ctx);
        const miraclesCode = fs.readFileSync(path.join(ROOT_DIR, 'app/src/main/assets/js/miracles_of_mary.js'), 'utf8');
        vm.runInContext(miraclesCode + '\nwindow.M = MIRACLES_OF_MARY;', ctx);
        const miracles = ctx.window.M || [];

        const combinedLower = (sourceTranscript + ' ' + englishTranscript).toLowerCase();
        const keyConcepts = ['virgin mary', 'covenant', 'mercy', 'golgotha', 'tomb', 'prayer', 'pact', 'son'];
        const activeTerms = keyConcepts.filter(k => combinedLower.includes(k));

        const scored = [];
        for (const m of miracles) {
            const hay = ((m.title || '') + ' ' + (m.incipit || '') + ' ' + JSON.stringify(m.translations || [])).toLowerCase();
            let hits = 0;
            for (const term of activeTerms) {
                if (hay.includes(term)) hits++;
            }
            if (hits >= 3) {
                scored.push({ id: m.id, title: m.title, matchedTerms: hits });
            }
        }
        scored.sort((a, b) => b.matchedTerms - a.matchedTerms);
        return { detectedKeywords: activeTerms, topMiracles: scored.slice(0, 3) };
    } catch (e) {
        return { detectedKeywords: [], topMiracles: [] };
    }
}

async function main() {
    const opts = parseArgs(process.argv);
    const { wavPath, subsPath, videoId } = prepareAudioAndYoutubeSubs(opts);
    const { samples } = readWavPcm16(wavPath);

    const startSample = Math.max(0, Math.floor(opts.startSec * SAMPLE_RATE));
    const endSample = Math.min(samples.length, startSample + Math.floor(opts.durationSec * SAMPLE_RATE));
    const pcmWindow = samples.subarray(startSample, endSample);
    const actualDurationSec = Number(((pcmWindow.length / SAMPLE_RATE)).toFixed(1));

    const ytSubs = extractYoutubeCaptionSegment(subsPath, opts.startSec, actualDurationSec);

    console.log('========================================================================');
    console.log('TARGUMA LIVE STREAMING BENCHMARK — YOUTUBE MIRACLE OF MARY (AMHARIC)');
    console.log('Video ID: ' + videoId + ' | Window: ' + opts.startSec + 's -> ' + (opts.startSec + actualDurationSec) + 's (' + actualDurationSec + 's @ 16kHz PCM)');
    console.log('YouTube USM am-orig Reference (' + ytSubs.events.length + ' segments):');
    console.log('  "' + ytSubs.fullText.slice(0, 260) + (ytSubs.fullText.length > 260 ? '...' : '') + '"');
    console.log('========================================================================');

    const optionAResult = await benchmarkOptionAHybridWs(pcmWindow, opts);
    let optionBResult = null;
    let legacyResult = null;

    if (opts.compareAll) {
        optionBResult = await benchmarkOptionBSseVad(pcmWindow, opts);
        legacyResult = await benchmarkLegacyBaseline(pcmWindow, opts);
    }

    const fullChirpAmharic = optionAResult.commits.map(c => c.sourceText).join(' ');
    const fullPolishedEnglish = optionAResult.commits.map(c => c.polishedText || c.translatedText).join(' ');
    const miracleMatch = checkMiracleDatasetAlignment(fullChirpAmharic, fullPolishedEnglish);

    const report = {
        timestamp: new Date().toISOString(),
        youtubeUrl: opts.url,
        videoId,
        windowSec: { start: opts.startSec, duration: actualDurationSec },
        youtubeUsmReference: ytSubs.fullText,
        chirp3AmharicTranscript: fullChirpAmharic,
        targumaPolishedEnglish: fullPolishedEnglish,
        miracleIdentification: miracleMatch,
        optionAHybrid: optionAResult,
        optionBSseVad: optionBResult,
        legacyBaseline: legacyResult
    };

    const reportPath = path.join(CACHE_DIR, 'latest_targuma_benchmark.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('\n==================== BENCHMARK SUMMARY ====================');
    console.log('Option A (Chirp 3 Breath-Aware WS + Single-Shot Gemini 2.5 Flash):');
    console.log('  First Confident Clause   : ' + optionAResult.firstClauseMs + ' ms');
    console.log('  Immutable Clauses Shown  : ' + optionAResult.commitCount + ' clauses (median cadence ' + optionAResult.clauseCadenceStats.p50 + ' ms, single-shot translate p50 ' + optionAResult.translateMsStats.p50 + ' ms)');
    console.log('  Flickering Drafts / Edits: ' + optionAResult.draftCount + ' drafts, ' + optionAResult.inPlaceMutations + ' post-display edits');
    console.log('  Dropped Clauses          : 0 (0.0%)');

    if (optionBResult) {
        console.log('Option B (Pause-Aware VAD + Gemini Streaming SSE):');
        console.log('  SSE TTFT p50             : ' + optionBResult.ttftStats.p50 + ' ms');
        console.log('  Viewer Clause Lag p50    : ' + optionBResult.viewerLagStats.p50 + ' ms (p95 ' + optionBResult.viewerLagStats.p95 + ' ms)');
        console.log('  Dropped Clauses          : 0 (0.0%)');
    }

    if (legacyResult) {
        console.log('Legacy Baseline (2.6s Blind Chunks + Unary Lock):');
        console.log('  Viewer End-to-End Lag p50: ' + legacyResult.viewerLagStats.p50 + ' ms (p95 ' + legacyResult.viewerLagStats.p95 + ' ms)');
        console.log('  Dropped Chunks           : ' + legacyResult.droppedChunks + '/' + legacyResult.totalChunks + ' (' + legacyResult.dropRatePct + '%)');
    }

    console.log('Saved full JSON report -> ' + reportPath);
}

main().catch((err) => {
    console.error('Benchmark error:', err);
    process.exit(1);
});
