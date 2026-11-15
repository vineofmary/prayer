#!/usr/bin/env node
/**
 * Mount of Mercy v2 — Debre Abay Ge'ez Zema + Oakland Saint Michael Livestream Dry-Run Benchmark
 *
 * Validates the v2 Multilingual IPA (`air-air/xlsr-53-espeak-student-ONNX`, q4) +
 * Supervised 10-Class Ge'ez Zema CTC Head (`public/js/zema_acoustic_model_data.js`) +
 * Online Coupled Slide Viterbi Aligner (`public/js/liturgy_tracker.js`) across:
 *   0. Real Debre Abay Ge'ez Zema (`tools/.cache/zema_16k/ahadu.wav`):
 *      - Tracks 150s of slow melismatic Zema on `3-26` (Aḥadu Ab Ḳidus) word-by-word (`0 -> 9`)
 *        WITHOUT premature slide jump and WITHOUT triggering off-book Sanctuary Interlude,
 *        then auto-advances `3-26 -> 3-27` right when the congregation enters (`በአማን አብ ቅዱስ`)!
 *   1. Oakland Livestream Opening Order of the Liturgy [72s..112s] (Ge'ez Zema + Red-Dot)
 *   2. Amharic Hierarchy Blessing -> Romans 11:13-25 Pauline Epistle [1806s..1842s]
 *   3. Automatic Anaphora Switch Detection (`apostles` -> `mary` at St.Mary-1 & Deacon Litany)
 *   4. Silence Guardrail + Off-Book Pre-Communion Exhortation [13750s..13768s] ->
 *      Smooth cross-fade into `img/With-her-beloved-Son.png` -> Acoustic Re-acquisition!
 */

const fs = require('fs');
const path = require('path');
const Module = require('module');

process.env.NODE_PATH = path.resolve(__dirname, 'node_modules');
Module._initPaths();

require('../public/js/zema_acoustic_model_data.js');
require('../public/js/zaima_notation_data.js');
require('../public/js/liturgy_tracker.js');

const tracker = globalThis.liturgyTracker;
const zemaHead = globalThis.ZEMA_ACOUSTIC_MODEL_DATA;

const LIVESTREAM_WAV = path.resolve(__dirname, '.cache/yt_osUtNVTlkFM_16k.wav');
const AHADU_ZEMA_WAV = path.resolve(__dirname, '.cache/zema_16k/ahadu.wav');
const SAMPLE_RATE = 16000;
const WAV_HEADER_BYTES = 44;
const CLASS_NAMES = zemaHead.classes || ['_', 'A', 'I', 'U', 'B', 'M', 'T', 'S', 'K', 'R'];
const NUM_CLASSES = CLASS_NAMES.length;

function readWavFloat32Slice(fd, startSec, durationSec) {
    const stat = fs.fstatSync(fd);
    const totalSamples = Math.max(0, Math.floor((stat.size - WAV_HEADER_BYTES) / 2));
    const startSample = Math.min(totalSamples, Math.max(0, Math.floor(startSec * SAMPLE_RATE)));
    const numSamples = Math.min(totalSamples - startSample, Math.max(1, Math.floor(durationSec * SAMPLE_RATE)));
    const byteOffset = WAV_HEADER_BYTES + startSample * 2;
    const buf = Buffer.alloc(numSamples * 2);
    const bytesRead = fs.readSync(fd, buf, 0, buf.length, byteOffset);
    const actualSamples = Math.floor(bytesRead / 2);
    const out = new Float32Array(actualSamples);
    let sq = 0;
    for (let i = 0; i < actualSamples; i++) {
        const v = buf.readInt16LE(i * 2) / 32768.0;
        out[i] = v;
        sq += v * v;
    }
    const rms = actualSamples > 0 ? Math.sqrt(sq / actualSamples) : 0;
    return { samples: out, rms };
}

function normalizeZeroMeanUnitVariance(samples) {
    const n = samples.length;
    if (!n) return samples;
    let sum = 0;
    for (let i = 0; i < n; i++) sum += samples[i];
    const mean = sum / n;
    let varSum = 0;
    for (let i = 0; i < n; i++) {
        const d = samples[i] - mean;
        varSum += d * d;
    }
    const invStd = 1.0 / Math.sqrt(varSum / n + 1e-7);
    const out = new Float32Array(n);
    for (let i = 0; i < n; i++) {
        out[i] = (samples[i] - mean) * invStd;
    }
    return out;
}

function projectIpaLogitsToZemaPosteriors(logitsData, rawSamples, numFrames50, vocabSize, hopDurationMs = 1100) {
    const T25 = Math.max(1, Math.floor(numFrames50 / 2));
    const hopSamples = Math.max(1, Math.floor(rawSamples.length / T25));
    const frameLogPosteriors = new Float32Array(T25 * NUM_CLASSES);
    const frameRms = new Float32Array(T25);
    const ipaProbsBuf = new Float32Array(vocabSize);
    const routing = zemaHead.routingMatrix;
    const voicedBlankShift = typeof zemaHead.voicedBlankShift === 'number' ? zemaHead.voicedBlankShift : -3.3;
    const unvoicedBlankBoost = typeof zemaHead.unvoicedBlankBoost === 'number' ? zemaHead.unvoicedBlankBoost : 3.5;

    let nonBlankVoicedFrames = 0;
    let ctcSkeleton = '';
    let prevNonBlank = 0;

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
            for (let v = 0; v < vocabSize; v++) sumExp += Math.exp(logitsData[base50 + v] - maxL);
            const invS = (1.0 / subCount) / (sumExp || 1);
            for (let v = 0; v < vocabSize; v++) {
                ipaProbsBuf[v] += Math.exp(logitsData[base50 + v] - maxL) * invS;
            }
        }

        const zOff = t * NUM_CLASSES;
        let maxZ = -Infinity;
        for (let c = 0; c < NUM_CLASSES; c++) {
            let pooled = 1e-6;
            const rRow = routing[c];
            for (let v = 0; v < vocabSize; v++) pooled += rRow[v] * ipaProbsBuf[v];
            const zVal = Math.log(pooled) + (c === 0 ? (isVoiced ? voicedBlankShift : unvoicedBlankBoost) : 0);
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
        for (let c = 0; c < NUM_CLASSES; c++) frameLogPosteriors[zOff + c] -= logNorm;

        if (isVoiced && bestC > 0) {
            nonBlankVoicedFrames++;
            if (bestC !== prevNonBlank) {
                ctcSkeleton += CLASS_NAMES[bestC];
                prevNonBlank = bestC;
            }
        }
    }

    const hopFrames = Math.max(1, Math.min(T25, Math.round(hopDurationMs / 40)));
    const rightGuard = T25 > hopFrames + 2 ? 2 : 0;
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

    return {
        ctcText: ctcSkeleton,
        hopSkeleton,
        phoneDensity: T25 > 0 ? nonBlankVoicedFrames / T25 : 0,
        framePosteriors: frameLogPosteriors,
        frameRms,
        hopPosteriors,
        hopRms
    };
}

function loadKidaseDataset() {
    const code = fs.readFileSync(path.resolve(__dirname, '../public/js/kidase.js'), 'utf8');
    return new Function(`${code}\nreturn kidaseData;`)();
}

function loadRomans11Card() {
    let am54Verses = '';
    try {
        const am54Raw = JSON.parse(
            fs.readFileSync(path.resolve(__dirname, '../public/bible/አም54_Haile_Selassie_Amharic_Bible_1962AD_1954EC.json'), 'utf8')
        );
        const books = am54Raw.books || am54Raw;
        const rom = Array.isArray(books)
            ? books.find(b => /ሮሜ|romans/i.test(b.title || b.name || b.book || ''))
            : (books['Romans'] || books['ሮሜ']);
        if (rom && Array.isArray(rom.chapters)) {
            const ch11 = rom.chapters[10];
            const verses = ch11.verses || ch11;
            if (Array.isArray(verses)) {
                am54Verses = verses.slice(12, 25).map(v => typeof v === 'string' ? v : (v.text || v.verse || '')).join(' ');
            }
        }
    } catch (_) {}

    if (!am54Verses) {
        am54Verses = 'ለእናንተም ለአሕዛብ እናገራለሁ እኔ የአሕዛብ ሐዋርያ በሆንሁ መጠን ሥጋዬ የሆኑትን አስቀንቼ ምናልባት ከእነርሱ አንዳንዱን አድን እንደ ሆነ አገልግሎቴን አከብራለሁ የእነርሱ መጣል ለዓለም መታረቅ ከሆነ ከሙታን ከሚመጣ ሕይወት በቀር መመለሳቸው ምን ይሆን';
    }

    return {
        cardId: 'Reading-Pauline-Rom11',
        readingType: 'pauline',
        sectionTitle: 'Order of the Liturgy — Pauline Epistle (Romans 11:13-25)',
        amharic_script: 'ለእናንተ ለአሕዛብ እናገራለሁ፤ እኔ የአሕዛብ ሐዋርያ እንደ መሆኔ መጠን አገልግሎቴን አከብራለሁ፤ ምናልባት የሥጋዬን ወገኖች አስቀንቼ ከእነርሱ አንዳንዶቹን አድን ይሆናል። የእነርሱ መጣል ለዓለም መታረቅ ከሆነ መቀበላቸውማ ከሙታን ከመነሣት በቀር ምን ይሆናል?',
        english: 'For I speak to you Gentiles inasmuch as I am an apostle to the Gentiles I magnify my ministry if by any means I may provoke to jealousy those who are my flesh and save some of them For if their being cast away is the reconciling of the world what will their acceptance be but life from the dead',
        _shadowTexts: [
            { langKey: 'amharic_script', edition: 'am54', text: am54Verses }
        ]
    };
}

async function main() {
    console.log('=== Mount of Mercy v2: Ge\'ez Zema + Oakland Saint Michael Livestream Dry-Run ===');
    const { AutoModelForCTC, Tensor } = await import('@huggingface/transformers');
    const modelId = zemaHead.modelId || 'air-air/xlsr-53-espeak-student-ONNX';

    const tLoad0 = performance.now();
    const model = await AutoModelForCTC.from_pretrained(modelId, { dtype: 'q4' });
    console.log(`Loaded ${modelId} (q4 + 10-class Supervised Zema CTC Head) in ${Math.round(performance.now() - tLoad0)}ms\n`);

    const totalInferMsList = [];

    async function inferFdWindow(fd, startSec, durationSec, hopDurationMs = 1100) {
        const { samples, rms } = readWavFloat32Slice(fd, startSec, durationSec);
        if (rms < 0.0075 || samples.length < 400) {
            return { ctcText: '', hopSkeleton: '', phoneDensity: 0, rms, inferMs: 0, hopPosteriors: null, hopRms: null };
        }
        const norm = normalizeZeroMeanUnitVariance(samples);
        const len = norm.length;
        const inputValues = new Tensor('float32', norm, [1, len]);
        const attentionMask = new Tensor('int64', new BigInt64Array(len).fill(1n), [1, len]);

        const t0 = performance.now();
        const { logits } = await model({ input_values: inputValues, attention_mask: attentionMask });
        const inferMs = Math.round(performance.now() - t0);
        totalInferMsList.push(inferMs);
        const [, numFrames50, vocabSize] = logits.dims;
        const projected = projectIpaLogitsToZemaPosteriors(logits.data, samples, numFrames50, vocabSize, hopDurationMs);
        return { ...projected, rms, inferMs };
    }

    const kidaseData = loadKidaseDataset();
    const audibleOrder = kidaseData.order.filter(p => !/inaudible/i.test(p.instruction || ''));

    // -------------------------------------------------------------------------
    // SCENARIO 0: Real Debre Abay Ge'ez Zema (`ahadu.wav` — 150s Melismatic Chant!)
    // -------------------------------------------------------------------------
    if (fs.existsSync(AHADU_ZEMA_WAV)) {
        console.log('--- Scenario 0: Real Debre Abay Ge\'ez Zema (`ahadu.wav`: 3-26 Aḥadu -> 3-27 Be\'aman) ---');
        const zemaFd = fs.openSync(AHADU_ZEMA_WAV, 'r');
        const ahaduSlides = audibleOrder.filter(p => p.chapter === '3' && Number(p.stanza) >= 26 && Number(p.stanza) <= 30);
        const zemaGraph = tracker.buildLiturgicalSlideGraph(ahaduSlides);

        let curZemaIdx = 0; // 3-26
        let vitState = null;
        let stitchedSkel = '';
        const zemaTrackerState = {
            ...tracker.state,
            autonomyMode: 'copilot',
            activeScope: 'anchor',
            isSanctuaryInterludeVisible: false,
            unmatchedVoicedMs: 0,
            suppressedTargets: new Map()
        };

        let advancedAtSec = -1;
        let maxWordOn326 = -1;
        let anyFalseInterlude = false;

        for (let endSec = 3.2; endSec <= 162.0; endSec += 1.2) {
            const startSec = Math.max(0, endSec - 3.2);
            const inf = await inferFdWindow(zemaFd, startSec, 3.2, 1200);
            stitchedSkel = tracker.appendStitchedHopSkeleton(stitchedSkel, inf.hopSkeleton, 48);

            const obs = tracker.createObservationProfile(stitchedSkel || inf.ctcText);
            const step = tracker.evaluateLiturgicalStep({
                obsProfile: obs,
                rms: inf.rms,
                phoneDensity: inf.phoneDensity,
                hopPosteriors: inf.hopPosteriors,
                hopRms: inf.hopRms,
                windowDurationMs: 1200,
                currentSlideIdx: curZemaIdx,
                graph: zemaGraph,
                shadowBranches: null,
                trackerState: zemaTrackerState,
                nowMs: endSec * 1000
            });

            const wIdx = step.dotEval ? step.dotEval.wordIndex : -1;
            if (curZemaIdx === 0 && wIdx > maxWordOn326) {
                maxWordOn326 = wIdx;
            }

            if (zemaTrackerState.isSanctuaryInterludeVisible) anyFalseInterlude = true;

            if (Math.abs(endSec % 24) < 1.2 || step.action === 'advance_local') {
                const words326 = zemaGraph.nodes[curZemaIdx].columns.geez_script?.words || [];
                const wObj = words326[wIdx];
                const wSurface = wObj ? (wObj.surface || wObj) : '-';
                console.log(
                    `  [t=${endSec.toFixed(1)}s] slide=3:${ahaduSlides[curZemaIdx].stanza} ` +
                    `word=${wIdx}/${words326.length} (${wSurface}) ` +
                    `hop="${inf.hopSkeleton}" action=${step.action}`
                );
            }

            if (step.action === 'advance_local' && curZemaIdx === 0) {
                advancedAtSec = endSec;
                curZemaIdx = step.targetSlideIndex;
                console.log(`  ✨ ZEMA COUPLED ADVANCE 3:26 -> 3:27 at t=${endSec.toFixed(1)}s (conf=${step.confidence?.toFixed(2)})`);
            }
        }
        fs.closeSync(zemaFd);
        console.log(`  Summary Scenario 0: maxWordOn326=${maxWordOn326}/9, advancedAt=${advancedAtSec.toFixed(1)}s, falseInterlude=${anyFalseInterlude}\n`);

        if (anyFalseInterlude) {
            throw new Error('Scenario 0 FAILED: False Sanctuary Interlude during melismatic Zema!');
        }
        if (advancedAtSec < 130 || advancedAtSec > 162) {
            throw new Error(`Scenario 0 FAILED: Expected 3:26->3:27 transition around ~145-158s, got ${advancedAtSec}s`);
        }
    }

    if (!fs.existsSync(LIVESTREAM_WAV)) {
        console.log('Skipping Oakland livestream WAV scenarios (cached file not present).');
        return;
    }

    const wavFd = fs.openSync(LIVESTREAM_WAV, 'r');
    const romans11Card = loadRomans11Card();
    const paulineBlessingCard = {
        cardId: 'Pauline-Blessing',
        sectionTitle: 'Order of the Liturgy',
        amharic_script: 'በጸሎቱና በበረከቱ ፓትርያርካችን በአባ ማትያስ በብፁዕ ሊቀ ጳጳሳችን በአባ ቴዎፍሎስ ለዘላለም ጸንቶ ይኑር አሜን የሐዋርያው የቅዱስ ጳውሎስ መልእክት ወደ ሮሜ ሰዎች',
        english: 'May his prayer and blessing rest upon our Patriarch Abba Mathias and our Archbishop Abba Theophilus forever Amen The Epistle of St Paul to the Romans'
    };

    const serviceSlides = [
        ...audibleOrder.slice(0, 25),
        paulineBlessingCard,
        romans11Card,
        ...audibleOrder.slice(25, 60),
        ...kidaseData.apostles.slice(0, 20)
    ];

    const graph = tracker.buildLiturgicalSlideGraph(serviceSlides);
    const shadowBranches = tracker.buildShadowLiturgicalBranches(kidaseData, {
        selectedAnaphora: 'apostles',
        selectedKidaseDay: 'sunday'
    });

    // -------------------------------------------------------------------------
    // SCENARIO 1: Opening Order of the Liturgy [72s..112s] (Ge'ez Zema + Dual Red-Dot)
    // -------------------------------------------------------------------------
    console.log('--- Scenario 1: Oakland Livestream Opening [72s..112s] (Ge\'ez Zema) ---');
    const doxologyIdx = serviceSlides.findIndex(s => /ብሩክ\s*እግዚአብሔር\s*አብ/.test(s.geez_script || ''));
    let curSlide = doxologyIdx >= 0 ? doxologyIdx : 0;
    let vit1 = null;
    const simState1 = { ...tracker.state, activeSpokenColumn: 'geez_script' };
    for (let sec = 72; sec <= 112; sec += 4) {
        const inf = await inferFdWindow(wavFd, sec, 4.2, 4000);
        if (inf.hopPosteriors) {
            vit1 = tracker.updateOnlineCoupledViterbi(graph.nodes[curSlide], graph.nodes[curSlide + 1] || null, curSlide + 1, inf.hopPosteriors, inf.hopRms, simState1);
        }
        const obs = tracker.createObservationProfile(inf.ctcText);
        const evNode = tracker.scoreObservationAgainstNode(obs, graph.nodes[curSlide], graph);
        console.log(`  [${sec}s] (${inf.inferMs}ms) ZemaSkel="${inf.ctcText.slice(0, 34)}" -> nodeScore=${evNode.score.toFixed(2)}, viterbiWord=${vit1 ? vit1.wordIndex : -1}/${graph.nodes[curSlide].columns.geez_script?.words.length || 0}`);
    }

    // -------------------------------------------------------------------------
    // SCENARIO 2: Amharic Hierarchy Blessing -> Romans 11:13-25 Pauline Epistle [1806s..1842s]
    // -------------------------------------------------------------------------
    console.log('\n--- Scenario 2: Amharic Hierarchy Blessing -> Pauline Epistle (Romans 11:13-25) [1806s..1842s] ---');
    const blessingIdx = serviceSlides.findIndex(s => s.cardId === 'Pauline-Blessing');
    const romansIdx = serviceSlides.findIndex(s => s.cardId === 'Reading-Pauline-Rom11');
    curSlide = blessingIdx;
    let vit2 = null;
    const simState2 = {
        ...tracker.state,
        autonomyMode: 'copilot',
        activeScope: 'anchor',
        isSanctuaryInterludeVisible: false,
        unmatchedVoicedMs: 0,
        suppressedTargets: new Map()
    };

    for (let sec = 1806; sec <= 1842; sec += 4) {
        const inf = await inferFdWindow(wavFd, sec, 4.5, 4000);
        const obs = tracker.createObservationProfile(inf.ctcText);
        const step = tracker.evaluateLiturgicalStep({
            obsProfile: obs,
            rms: inf.rms,
            phoneDensity: inf.phoneDensity,
            hopPosteriors: inf.hopPosteriors,
            hopRms: inf.hopRms,
            windowDurationMs: 4000,
            currentSlideIdx: curSlide,
            graph,
            shadowBranches,
            trackerState: simState2,
            nowMs: sec * 1000
        });
        if (step.action === 'advance_local') {
            console.log(`  [${sec}s] (${inf.inferMs}ms) Skel="${inf.ctcText.slice(0, 32)}" -> ✨ AUTO-ADVANCED +1 to ${serviceSlides[step.targetSlideIndex].cardId} (conf=${step.confidence?.toFixed(2)})`);
            curSlide = step.targetSlideIndex;
        } else {
            const dot = step.dotEval || tracker.evaluateMultiColumnRedDot(obs, graph.nodes[curSlide], 'amharic_script', -1, sec * 1000);
            console.log(`  [${sec}s] (${inf.inferMs}ms) Skel="${inf.ctcText.slice(0, 32)}" -> slide=${serviceSlides[curSlide].cardId}, action=${step.action}, col=${dot.activeColumn}, wordIdx=${dot.wordIndex}`);
        }
    }

    // -------------------------------------------------------------------------
    // SCENARIO 3: Unselected Anaphora of St. Mary (`ቅዳሴ ማርያም`) Detection
    // -------------------------------------------------------------------------
    console.log('\n--- Scenario 3: Anaphora of Our Lady Mary Auto-Detection (`apostles` -> `mary`) ---');
    const apostlesStartIdx = serviceSlides.findIndex(s => /^Apostles-/i.test(s.cardId || `${s.chapter}-${s.stanza}`));
    const simState3 = {
        ...tracker.state,
        autonomyMode: 'copilot',
        anaphoraSwitchMode: 'prompt_3s',
        activeScope: 'anaphora',
        isSanctuaryInterludeVisible: false,
        unmatchedVoicedMs: 0,
        suppressedTargets: new Map()
    };
    let rollSkel3 = '';
    for (const sec of [4712, 4716, 4720, 4862, 4867, 4872, 4877]) {
        const inf = await inferFdWindow(wavFd, sec, 5.2, 4200);
        rollSkel3 = tracker.appendStitchedHopSkeleton(rollSkel3, inf.hopSkeleton || inf.ctcText, 48);
        const obs = tracker.createObservationProfile(rollSkel3);
        const step = tracker.evaluateLiturgicalStep({
            obsProfile: obs,
            rms: inf.rms,
            phoneDensity: inf.phoneDensity,
            windowDurationMs: 5000,
            currentSlideIdx: apostlesStartIdx,
            graph,
            shadowBranches,
            trackerState: simState3,
            nowMs: sec * 1000
        });
        console.log(`  [${sec}s] (${inf.inferMs}ms, dens=${inf.phoneDensity.toFixed(2)}) Skel="${inf.ctcText.slice(0, 34)}" -> action=${step.action}${step.anaphoraKey ? ` (${step.label} @ ${step.cardId}, conf=${step.confidence})` : ''}`);
    }

    // -------------------------------------------------------------------------
    // SCENARIO 4: Silence Guardrail + Off-Book Sermon -> Mary Icon Interlude -> Re-Acquisition
    // -------------------------------------------------------------------------
    console.log('\n--- Scenario 4: Silence Guardrail + Off-Book Sermon [13750s..13768s] -> Mary Icon Interlude -> Re-Acquisition ---');
    const simState4 = {
        ...tracker.state,
        autonomyMode: 'copilot',
        activeScope: 'anchor',
        isSanctuaryInterludeVisible: false,
        unmatchedVoicedMs: 0,
        reacquireStreak: 0,
        reacquireCandidateIdx: -1,
        suppressedTargets: new Map()
    };

    for (let s = 1; s <= 4; s++) {
        const silenceStep = tracker.evaluateLiturgicalStep({
            obsProfile: tracker.createObservationProfile(''),
            rms: 0.002,
            phoneDensity: 0,
            windowDurationMs: 3000,
            currentSlideIdx: romansIdx,
            graph,
            shadowBranches: null,
            trackerState: simState4,
            nowMs: s * 3000
        });
        if (s === 4) {
            console.log(`  [Silence 12s] -> action=${silenceStep.action}, iconVisible=${simState4.isSanctuaryInterludeVisible}`);
        }
    }

    let sermonSkel = '';
    for (let sec = 13750; sec <= 13768; sec += 3) {
        const inf = await inferFdWindow(wavFd, sec, 3.2, 3000);
        sermonSkel = tracker.appendStitchedHopSkeleton(sermonSkel, inf.hopSkeleton || inf.ctcText, 40);
        const obs = tracker.createObservationProfile(sermonSkel);
        const step = tracker.evaluateLiturgicalStep({
            obsProfile: obs,
            rms: inf.rms,
            phoneDensity: inf.phoneDensity,
            windowDurationMs: 3000,
            currentSlideIdx: romansIdx,
            graph,
            shadowBranches: null,
            trackerState: simState4,
            nowMs: sec * 1000
        });
        console.log(`  [Off-Book Sermon ${sec}s] (${inf.inferMs}ms) Skel="${inf.ctcText.slice(0, 30)}" -> action=${step.action}, iconVisible=${simState4.isSanctuaryInterludeVisible} (unmatchedMs=${simState4.unmatchedVoicedMs})`);
    }

    let resumeRoll = '';
    for (const resumeSec of [1825, 1828, 1831, 1834]) {
        const inf = await inferFdWindow(wavFd, resumeSec, 4.8, 3200);
        resumeRoll = tracker.appendStitchedHopSkeleton(resumeRoll, inf.hopSkeleton || inf.ctcText, 48);
        const obs = tracker.createObservationProfile(resumeRoll);
        const step = tracker.evaluateLiturgicalStep({
            obsProfile: obs,
            rms: inf.rms,
            phoneDensity: inf.phoneDensity,
            windowDurationMs: 3000,
            currentSlideIdx: 0,
            graph,
            shadowBranches: null,
            trackerState: simState4,
            nowMs: resumeSec * 1000
        });
        const targetLabel = step.targetSlideIndex !== undefined
            ? (serviceSlides[step.targetSlideIndex].cardId || `${serviceSlides[step.targetSlideIndex].chapter}-${serviceSlides[step.targetSlideIndex].stanza}`)
            : null;
        console.log(`  [Resume ${resumeSec}s] (${inf.inferMs}ms) Skel="${inf.ctcText.slice(0, 32)}" -> action=${step.action}${targetLabel ? ` -> Slide ${targetLabel} (conf=${step.confidence})` : ''}, iconVisible=${simState4.isSanctuaryInterludeVisible}`);
    }

    fs.closeSync(wavFd);
    const validLatencies = totalInferMsList.filter(x => x > 0);
    const avgMs = Math.round(validLatencies.reduce((a, b) => a + b, 0) / Math.max(1, validLatencies.length));
    console.log(`\n=== v2 Dry-Run Complete: ${validLatencies.length} ONNX windows processed, mean inference latency = ${avgMs}ms/window ===`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
