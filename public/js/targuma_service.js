// ============================================================================
// TARGUMA (ተርጉማ) — Live EOTC Sermon & Announcement Captioning Engine (v3)
// ============================================================================
// Architecture:
// 1. Primary Option A (Confident Immutable Clause Pipeline):
//    - 16kHz LINEAR16 PCM WebAudio Stream -> Cloud Run WebSocket (`targuma-stream`)
//    - Google Cloud Speech-to-Text V2 `chirp_3` (`am-ET`, `en-US`, `es-US`) with
//      built-in sanctuary denoiser + adaptive prosodic breath-pause flushing +
//      Amharic/Tigrinya run-on sentence syntactic clause segmentation
//    - Single-shot Vertex AI Gemini 2.5 Flash (`thinkingBudget: 0`) + Cloud Translation V3
//      parallel fallback so every clause arrives ALREADY polished and NEVER mutates on screen
// 2. Automatic Option B Fallback (Tigrinya `ti` & Firewall/Offline-WS Resilience):
//    - Continuous 16kHz PCM Ring Buffer + Natural Clause VAD Endpointer
//    - Streaming Server-Sent Events (`:streamGenerateContent?alt=sse`) + Ordered Sequence Slots
//      committing each completed clause cleanly without flickering partial words
// 3. Multi-Source Live Testing:
//    - Live Sanctuary Microphone, Browser Tab Audio (`getDisplayMedia` for YouTube testing),
//      and Local Audio/Video File 1.0x Replay
// ============================================================================

(function () {
    'use strict';

    const TARGUMA_STREAM_WS_URL = 'wss://targuma-stream-974361367981.us-central1.run.app/ws';
    const TARGUMA_STREAM_HTTP_URL = 'https://targuma-stream-974361367981.us-central1.run.app/targumaGemini';
    const TARGUMA_FALLBACK_CF_URL = 'https://us-central1-mount-of-mercy.cloudfunctions.net/targumaGemini';

    // Cloud cost & session protection thresholds
    const SILENCE_AUTO_PAUSE_MS = 3 * 60 * 1000;      // Auto-pause after 3 minutes of silence
    const MAX_SESSION_DURATION_MS = 45 * 60 * 1000;   // Auto-pause after 45 minutes continuous session
    const HIDDEN_TAB_AUTO_PAUSE_MS = 60 * 1000;       // Auto-pause 60s after phone locked / tab hidden in local mic mode

    // Audio & VAD thresholds (16kHz mono PCM, 100ms = 1600-sample frames)
    const TARGET_SAMPLE_RATE = 16000;
    const PCM_FRAME_SAMPLES = 1600;                   // 100ms frame = 3200 bytes Int16LE
    const SPEECH_RMS_THRESHOLD = 0.011;               // Active speech energy threshold
    const SPEECH_PAUSE_RMS_THRESHOLD = 0.0075;        // Breath/clause pause threshold
    const MIN_SUSTAINED_SPEECH_MS = 160;              // Reject single-frame coughs/clicks (<160ms)
    const WS_POST_SPEECH_HANGOVER_MS = 1200;          // Trailing quiet frames sent so Chirp 3 flushes breath pauses cleanly
    const WS_PRE_SPEECH_LOOKBEHIND_FRAMES = 3;        // 300ms lookbehind so first consonant after silence is never clipped

    // Option B (SSE VAD Ring Buffer) clause-level endpointing parameters
    const VAD_MIN_CLAUSE_SPEECH_MS = 2000;            // Minimum spoken clause before slicing on a breath pause
    const VAD_BREATH_PAUSE_MS = 280;                  // 280ms breath pause triggers clean clause dispatch
    const VAD_MAX_SLICE_MS = 4600;                    // Max continuous speech before clause soft split
    const VAD_OVERLAP_SAMPLES = Math.floor(TARGET_SAMPLE_RATE * 0.24); // 240ms overlap prevents mid-word cuts
    const MAX_CONCURRENT_SSE_REQUESTS = 3;
    const CLIENT_FETCH_TIMEOUT_MS = 8000;
    const MAX_DRAFT_DISPLAY_WORDS = 22;

    // Clean model options (in Settings drawer; Gemini 2.5 Flash default)
    const GEMINI_MODELS = [
        {
            id: 'gemini-2.5-flash',
            label: 'Gemini 2.5 Flash',
            shortLabel: 'Gemini 2.5 Flash'
        },
        {
            id: 'gemini-3-flash-preview',
            label: 'Gemini 3 Flash',
            shortLabel: 'Gemini 3 Flash'
        }
    ];

    const TARGUMA_ICONS = [
        {
            id: 'mary_with_son',
            src: 'img/With-her-beloved-Son.png',
            titleEnglish: 'With Her Beloved Son'
        },
        {
            id: 'silus_kidus',
            src: 'img/Silus-Kidus.svg',
            titleEnglish: 'The Holy Trinity'
        },
        {
            id: 'covenant_mercy',
            src: 'img/Covenant-of-Mercy.svg',
            titleEnglish: 'Covenant of Mercy'
        },
        {
            id: 'covenant_mercy_psalm',
            src: 'img/Covenant-of-Mercy-with-Psalm.svg',
            titleEnglish: 'Covenant of Mercy with Psalm 44'
        },
        {
            id: 'mary_blesses_ephraim',
            src: 'img/Mary-Blesses-Ephraim.svg',
            titleEnglish: 'Our Lady Mary Blesses St. Ephrem'
        },
        {
            id: 'ephraim_mary_thursday',
            src: 'img/Ephraim-and-Mary-on-Thursday.svg',
            titleEnglish: 'St. Ephrem Praises Our Lady'
        },
        {
            id: 'none',
            src: '',
            titleEnglish: 'Hide Icon'
        }
    ];

    const LANGUAGE_META = {
        'am': { label: 'አማርኛ (Amharic)', short: 'አማርኛ', bcp47: 'am-ET', isEthiopic: true, supportsChirp3Ws: true },
        'ti': { label: 'ትግርኛ (Tigrinya)', short: 'ትግርኛ', bcp47: 'ti-ET', isEthiopic: true, supportsChirp3Ws: false },
        'en': { label: 'English', short: 'English', bcp47: 'en-US', isEthiopic: false, supportsChirp3Ws: true },
        'es': { label: 'Español (Spanish)', short: 'Español', bcp47: 'es-US', isEthiopic: false, supportsChirp3Ws: true }
    };

    // Deterministic EOTC Liturgical Glossary so every clause renders gold italic + bracketed meanings
    const EOTC_LITURGICAL_ENRICHER = [
        {
            sourceRegex: /ቅዳሴ/,
            plainTargetRegex: /\b(Divine Liturgy|the Liturgy|Qidase|Kidase)\b/i,
            phonetic: 'Qidase',
            meaning: 'Divine Liturgy'
        },
        {
            sourceRegex: /ኪዳነ\s*ምሕረት|ኪዳነ\s*ምህረት/,
            plainTargetRegex: /\b(Kidane Mihret)\b/i,
            phonetic: 'Kidane Mihret',
            meaning: 'Covenant of Mercy'
        },
        {
            sourceRegex: /ቁርባን|ርባን/,
            plainTargetRegex: /\b(Holy Communion|Eucharist)\b/i,
            phonetic: 'Qiddus Qurban',
            meaning: 'Holy Communion'
        },
        {
            sourceRegex: /ታቦት/,
            plainTargetRegex: /\b(Ark of the Covenant|Tabot|altar tablet)\b/i,
            phonetic: 'Tabot',
            meaning: 'Ark of the Covenant'
        },
        {
            sourceRegex: /ሱባኤ/,
            plainTargetRegex: /\b(spiritual retreat|retreat|fasting retreat|Subae|Suba'e)\b/i,
            phonetic: "Suba'e",
            meaning: 'Spiritual Retreat'
        },
        {
            sourceRegex: /ንስሐ\s*አባት/,
            plainTargetRegex: /\b(confession father|spiritual father)\b/i,
            phonetic: 'Nisiha Abbat',
            meaning: 'Confession Father'
        },
        {
            sourceRegex: /ንስሐ/,
            plainTargetRegex: /\b(repentance|penance)\b/i,
            phonetic: 'Nisiha',
            meaning: 'Repentance'
        },
        {
            sourceRegex: /ማኅሌት|ማህሌት/,
            plainTargetRegex: /\b(liturgical chanting|night vigil|chanting service|Mahlet)\b/i,
            phonetic: 'Mahlet',
            meaning: 'Liturgical Chanting'
        },
        {
            sourceRegex: /ቃለ\s*ሕይወት\s*ያሰማልን/,
            plainTargetRegex: /\b(May He let us hear the Word of Life|hear the word of life)\b/i,
            phonetic: 'Qale Hiwot Yasemalin',
            meaning: 'May He let us hear the Word of Life'
        },
        {
            sourceRegex: /ሰበካ\s*ጉባኤ/,
            plainTargetRegex: /\b(parish council|church council)\b/i,
            phonetic: 'Sebeka Gubae',
            meaning: 'Parish Council'
        },
        {
            sourceRegex: /ሰንበት\s*ትምህርት\s*ቤት/,
            plainTargetRegex: /\b(Sunday School)\b/i,
            phonetic: 'Senbet Timhirt Bet',
            meaning: 'Sunday School'
        },
        {
            sourceRegex: /ደብረ\s*ምሕረት|ደብረ\s*ምህረት/,
            plainTargetRegex: /\b(Mount of Mercy|Debre Mihret)\b/i,
            phonetic: 'Debre Mihret',
            meaning: 'Mount of Mercy'
        },
        {
            sourceRegex: /ተአምረ\s*ማርያም|ታምረ\s*ማርያም/,
            plainTargetRegex: /\b(Miracles? of Mary|Teamire Mariam)\b/i,
            phonetic: 'Teamire Mariam',
            meaning: 'Miracles of Mary'
        },
        {
            sourceRegex: /ምሕላ|ምህላ/,
            plainTargetRegex: /\b(public supplication|supplication service|Mihla)\b/i,
            phonetic: 'Mihla',
            meaning: 'Supplication'
        }
    ];

    const DEFAULT_IDLE_STATUS = 'Tap "Start Listening" to see live captions in your language';

    // --- State ---
    let state = {
        isActive: false,
        isListening: false,
        sourceLang: 'am',                      // 'am', 'ti', 'en', 'es'
        targetLang: 'en',                      // 'en', 'am', 'ti', 'es'
        geminiModel: 'gemini-2.5-flash',       // Default: Gemini 2.5 Flash
        displayMode: 'target',                 // 'target' or 'bilingual'
        maxLines: 3,                           // 2, 3, or 4 visible chronological clauses
        fontSizePx: 34,                        // Customizable caption font size (px)
        selectedIconId: 'mary_with_son',       // Icon ID or 'none' to hide icon
        roomMode: 'local',                     // Personal sanctuary mode (Parish Sync UI hidden)
        roomCode: 'oakland',
        audioInputMode: 'microphone',          // 'microphone' | 'tab' | 'file'
        transportMode: 'idle',                 // 'idle' | 'ws_chirp3' | 'sse_vad'
        captions: [],                          // Immutable chronological clause list
        liveDraft: null,                       // Unused in immutable-clause mode (kept null so words never flicker)
        recentContext: [],                     // Last 3 transcribed clauses for homiletic continuity
        controlsMinimized: false,
        lastLatencyMs: 0
    };

    // Audio, WebSocket, VAD & Timer Handles
    let wakeLockSentinel = null;
    let firestoreUnsubscribe = null;
    let mediaStream = null;
    let audioContext = null;
    let sourceAudioNode = null;
    let analyserNode = null;
    let pcmWorkletNode = null;
    let scriptProcessorNode = null;
    let silentSinkGain = null;
    let fileMediaElementSource = null;
    let replayObjectUrl = null;
    let levelMeterRaf = null;

    // WebSocket Chirp 3 handles
    let streamWs = null;
    let streamWsReady = false;
    let wsReconnectTimer = null;
    let wsKeepAliveTimer = null;
    let lookbehindPcmFrames = [];
    let sustainedSpeechMs = 0;
    let lastActiveVoiceFrameAt = 0;

    // Option B (SSE VAD Ring Buffer) handles
    let vadSliceSamples = [];
    let vadSliceSampleCount = 0;
    let activeSseRequests = 0;
    let chunkSequenceCounter = 0;

    // Cloud Cost / Idle Protection Timers
    let lastSpeechDetectedAt = 0;
    let sessionStartedAt = 0;
    let idleWatchdogInterval = null;
    let hiddenTabTimer = null;

    let translationCache = new Map();

    // --- Pure DSP & Formatting Helpers ---
    function downsampleFloat32ToInt16Pcm(float32Samples, inputSampleRate, targetSampleRate) {
        if (!float32Samples || float32Samples.length === 0) {
            return new Int16Array(0);
        }
        const inRate = Number(inputSampleRate) || TARGET_SAMPLE_RATE;
        const outRate = Number(targetSampleRate) || TARGET_SAMPLE_RATE;

        if (inRate === outRate) {
            const out = new Int16Array(float32Samples.length);
            for (let i = 0; i < float32Samples.length; i++) {
                const s = Math.max(-1, Math.min(1, float32Samples[i]));
                out[i] = s < 0 ? Math.round(s * 32768) : Math.round(s * 32767);
            }
            return out;
        }

        const ratio = inRate / outRate;
        const outLength = Math.max(1, Math.floor(float32Samples.length / ratio));
        const result = new Int16Array(outLength);
        let offsetResult = 0;
        let offsetBuffer = 0;

        while (offsetResult < outLength) {
            const nextOffsetBuffer = Math.min(
                float32Samples.length,
                Math.round((offsetResult + 1) * ratio)
            );
            let accum = 0;
            let count = 0;
            for (let i = offsetBuffer; i < nextOffsetBuffer; i++) {
                accum += float32Samples[i];
                count++;
            }
            const avg = count > 0 ? accum / count : (float32Samples[offsetBuffer] || 0);
            const clamped = Math.max(-1, Math.min(1, avg));
            result[offsetResult] = clamped < 0 ? Math.round(clamped * 32768) : Math.round(clamped * 32767);
            offsetResult++;
            offsetBuffer = nextOffsetBuffer;
        }
        return result;
    }

    function computeInt16Rms(int16Samples) {
        if (!int16Samples || int16Samples.length === 0) return 0;
        let sumSq = 0;
        for (let i = 0; i < int16Samples.length; i++) {
            const norm = int16Samples[i] / 32768;
            sumSq += norm * norm;
        }
        return Math.sqrt(sumSq / int16Samples.length);
    }

    function encodePcm16ToWavBytes(int16Samples, sampleRate) {
        const rate = Number(sampleRate) || TARGET_SAMPLE_RATE;
        const numSamples = int16Samples ? int16Samples.length : 0;
        const dataByteLength = numSamples * 2;
        const buffer = new ArrayBuffer(44 + dataByteLength);
        const view = new DataView(buffer);

        function writeAscii(offset, str) {
            for (let i = 0; i < str.length; i++) {
                view.setUint8(offset + i, str.charCodeAt(i));
            }
        }

        writeAscii(0, 'RIFF');
        view.setUint32(4, 36 + dataByteLength, true);
        writeAscii(8, 'WAVE');
        writeAscii(12, 'fmt ');
        view.setUint32(16, 16, true);          // Subchunk1Size (PCM)
        view.setUint16(20, 1, true);           // AudioFormat = 1 (LINEAR16)
        view.setUint16(22, 1, true);           // NumChannels = 1 (Mono)
        view.setUint32(24, rate, true);        // SampleRate
        view.setUint32(28, rate * 2, true);    // ByteRate
        view.setUint16(32, 2, true);           // BlockAlign
        view.setUint16(34, 16, true);          // BitsPerSample
        writeAscii(36, 'data');
        view.setUint32(40, dataByteLength, true);

        for (let i = 0; i < numSamples; i++) {
            view.setInt16(44 + i * 2, int16Samples[i], true);
        }
        return new Uint8Array(buffer);
    }

    function uint8ArrayToBase64(bytes) {
        if (!bytes || bytes.length === 0) return '';
        if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
            return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString('base64');
        }
        let binary = '';
        const chunkSize = 0x8000;
        for (let i = 0; i < bytes.length; i += chunkSize) {
            const sub = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
            binary += String.fromCharCode.apply(null, sub);
        }
        return btoa(binary);
    }

    function evaluateVadEndpointState(vadState, frameRms, frameDurationMs) {
        const next = {
            spokenMs: vadState.spokenMs || 0,
            trailingPauseMs: vadState.trailingPauseMs || 0,
            totalMs: (vadState.totalMs || 0) + frameDurationMs,
            sustainedActiveMs: vadState.sustainedActiveMs || 0,
            shouldFlush: false,
            keepOverlap: false
        };

        if (frameRms >= SPEECH_RMS_THRESHOLD) {
            next.sustainedActiveMs += frameDurationMs;
            if (next.sustainedActiveMs >= MIN_SUSTAINED_SPEECH_MS) {
                next.spokenMs += frameDurationMs;
                next.trailingPauseMs = 0;
            }
        } else if (frameRms < SPEECH_PAUSE_RMS_THRESHOLD) {
            next.sustainedActiveMs = 0;
            if (next.spokenMs > 0) {
                next.trailingPauseMs += frameDurationMs;
            } else {
                // Transient click/cough (<160ms) followed by silence: reset immediately
                next.totalMs = 0;
                next.trailingPauseMs = 0;
            }
        } else if (next.spokenMs > 0) {
            next.spokenMs += frameDurationMs * 0.5;
        }

        if (next.spokenMs >= VAD_MIN_CLAUSE_SPEECH_MS && next.trailingPauseMs >= VAD_BREATH_PAUSE_MS) {
            next.shouldFlush = true;
            next.keepOverlap = false;
        } else if (next.totalMs >= VAD_MAX_SLICE_MS && next.spokenMs >= MIN_SUSTAINED_SPEECH_MS) {
            next.shouldFlush = true;
            next.keepOverlap = true;
        } else if (next.totalMs >= VAD_MAX_SLICE_MS && next.spokenMs < MIN_SUSTAINED_SPEECH_MS) {
            // Pure dead air: reset slice without cloud call
            next.totalMs = 0;
            next.spokenMs = 0;
            next.trailingPauseMs = 0;
        }

        return next;
    }

    function windowDraftWords(rawText, maxWords) {
        const limit = maxWords || MAX_DRAFT_DISPLAY_WORDS;
        const words = String(rawText || '').trim().split(/\s+/).filter(Boolean);
        if (words.length <= limit) {
            return words.join(' ');
        }
        return '… ' + words.slice(-limit).join(' ');
    }

    // --- Load / Save Preferences ---
    function loadTargumaSettings() {
        try {
            const raw = localStorage.getItem('mountOfMercy_targumaSettings');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.sourceLang && LANGUAGE_META[parsed.sourceLang]) state.sourceLang = parsed.sourceLang;
                if (parsed.targetLang && LANGUAGE_META[parsed.targetLang]) state.targetLang = parsed.targetLang;
                if (parsed.geminiModel && GEMINI_MODELS.some(m => m.id === parsed.geminiModel)) {
                    state.geminiModel = parsed.geminiModel;
                } else {
                    state.geminiModel = 'gemini-2.5-flash';
                }
                if (parsed.displayMode === 'target' || parsed.displayMode === 'bilingual') state.displayMode = parsed.displayMode;
                if ([2, 3, 4].includes(Number(parsed.maxLines))) state.maxLines = Number(parsed.maxLines);
                if (parsed.fontSizePx >= 18 && parsed.fontSizePx <= 72) state.fontSizePx = Number(parsed.fontSizePx);
                if (parsed.selectedIconId && TARGUMA_ICONS.some(i => i.id === parsed.selectedIconId)) {
                    state.selectedIconId = parsed.selectedIconId;
                }
            } else {
                state.fontSizePx = (typeof window !== 'undefined' && window.innerWidth < 768) ? 24 : 36;
            }
        } catch (e) {
            console.warn('Could not load Targuma settings:', e);
        }
        state.roomMode = 'local';
        trimCaptionsToMaxLines();
    }

    function saveTargumaSettings() {
        try {
            const payload = JSON.stringify({
                sourceLang: state.sourceLang,
                targetLang: state.targetLang,
                geminiModel: state.geminiModel,
                displayMode: state.displayMode,
                maxLines: state.maxLines,
                fontSizePx: state.fontSizePx,
                selectedIconId: state.selectedIconId
            });
            localStorage.setItem('mountOfMercy_targumaSettings', payload);
        } catch (e) {
            console.warn('Could not save Targuma settings:', e);
        }
    }

    function trimCaptionsToMaxLines() {
        const keepLimit = Math.max(6, (state.maxLines || 3) + 3);
        if (!Array.isArray(state.captions)) {
            state.captions = [];
            return;
        }
        if (state.captions.length > keepLimit) {
            state.captions = state.captions.slice(-keepLimit);
        }
    }

    function clearAllCaptions() {
        state.captions = [];
        state.liveDraft = null;
        state.recentContext = [];
        chunkSequenceCounter = 0;
    }

    // --- Wake Lock Management (Web + Android Native Bridge) ---
    async function requestWakeLock() {
        try {
            if (window.AndroidTargumaBridge && typeof window.AndroidTargumaBridge.setKeepScreenOn === 'function') {
                window.AndroidTargumaBridge.setKeepScreenOn(true);
            }
            if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
                wakeLockSentinel = await navigator.wakeLock.request('screen');
            }
        } catch (err) {
            console.debug('WakeLock note:', err.message);
        }
    }

    async function releaseWakeLock() {
        try {
            if (window.AndroidTargumaBridge && typeof window.AndroidTargumaBridge.setKeepScreenOn === 'function') {
                window.AndroidTargumaBridge.setKeepScreenOn(false);
            }
            if (wakeLockSentinel) {
                await wakeLockSentinel.release();
                wakeLockSentinel = null;
            }
        } catch (err) {
            console.debug('WakeLock release note:', err.message);
        }
    }

    // --- Target-Language Sanitization & Style B + Rubric Formatting ---
    function sanitizeTargetLanguageText(rawText, targetLang) {
        let cleaned = String(rawText || '').trim();
        if (!cleaned) return '';

        // Decode basic HTML entities that Cloud Translate V3 may emit
        cleaned = cleaned
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&');

        // Strip any leaked Ethiopic characters when target is English or Spanish
        if (!LANGUAGE_META[targetLang]?.isEthiopic) {
            cleaned = cleaned.replace(/[\u1200-\u137F]+/g, '').replace(/\s{2,}/g, ' ').trim();
        }
        return cleaned;
    }

    function formatGeminiTranslationToHtml(rawTranslatedText, targetLang, sourceText = '') {
        let sanitized = sanitizeTargetLanguageText(rawTranslatedText, targetLang);
        if (!sanitized) return '';

        if (targetLang === 'en' && !sanitized.includes('[')) {
            for (const rule of EOTC_LITURGICAL_ENRICHER) {
                if ((sourceText && rule.sourceRegex.test(sourceText)) || rule.plainTargetRegex.test(sanitized)) {
                    if (rule.plainTargetRegex.test(sanitized)) {
                        sanitized = sanitized.replace(rule.plainTargetRegex, '*' + rule.phonetic + '* [' + rule.meaning + ']');
                    }
                }
            }
        }

        let html = escapeHtml(sanitized);

        // Convert *Phonetic* [Meaning] into gold Style B span
        html = html.replace(/\*([^*]+)\*\s*\[([^\]]+)\]/g, (_, phonetic, meaning) => {
            return '<span class="targuma-geez-term"><i>' + phonetic.trim() + '</i> <span class="targuma-geez-gloss">[' + meaning.trim() + ']</span></span>';
        });

        // Convert remaining *italic* terms into gold italic span
        html = html.replace(/\*([^*]+)\*/g, '<span class="targuma-geez-term"><i>$1</i></span>');

        // Apply EOTC Sacred Rubrication (Red)
        html = highlightSacredTermsInCaption(html);
        return html;
    }

    function highlightSacredTermsInCaption(htmlText) {
        if (typeof displayOptions !== 'undefined' && displayOptions.showRubrication === false) {
            return htmlText;
        }
        return htmlText.replace(
            /\b(Lord and Savior Jesus Christ|Our Lord Jesus Christ|Jesus Christ|Iyesus Kristos|Jesucristo|Christ Jesus|Jesus|Jesús|Christ|Cristo|Medhane Alem|Savior of the World|Our Savior|Redeemer|Holy Trinity|Santísima Trinidad|Father,?\s+Son,?\s+and\s+Holy Spirit|Holy Spirit|Espíritu Santo|Our Lady Saint Mary|Our Lady|Nuestra Señora|Saint Mary|St\.\s*Mary|Santa María|Blessed Virgin Mary|Virgin Mary|Virgen María|Mother of God|Madre de Dios|Theotokos|Weladite Amlak|Kidane Mihret|Covenant of Mercy|Archangel Saint Michael|Saint Michael|St\.\s*Michael|San Miguel|His Grace Abune|Almighty God|Heavenly Father|Lord God|Egziabher|God|Dios|Lord|Señor|እግዚአብሔር|ኢየሱስ ክርስቶስ|መድኃኔዓለም|መንፈስ ቅዱስ|ቅድስት ሥላሴ|ቅድስት ድንግል ማርያም|ወላዲተ አምላክ|ኪዳነ ምሕረት|እመቤታችን|ቅዱስ ሚካኤል|ብፁዕ አቡነ)\b/g,
            '<span class="rubric-red">$1</span>'
        );
    }

    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    // --- Immutable Clause Commit & Ordered Sequence Slotting ---
    // Note: Word-by-word drafts and post-display text mutations are intentionally disabled
    // so once a clause appears on screen, it stays rock-solid for readers.
    function updateLiveDraftCaption(segmentId, sourceText, rawTranslatedText) {
        lastSpeechDetectedAt = Date.now();
        if (sourceText || rawTranslatedText) {
            evaluateMiracleLiveMatch(sourceText, rawTranslatedText);
        }
    }

    function commitFinalizedCaption(segmentId, sourceText, rawTranslatedText, options = {}) {
        const cleanTarget = sanitizeTargetLanguageText(rawTranslatedText, state.targetLang);
        const cleanSource = String(sourceText || '').trim();
        state.liveDraft = null;

        if (!cleanTarget) {
            return;
        }

        // Immutability guarantee: if this segmentId is already on screen, NEVER overwrite its wording!
        if (segmentId && state.captions.some(c => c.id === segmentId)) {
            return;
        }

        // Deduplicate against immediately preceding finalized clause
        if (state.captions.length > 0) {
            const latest = state.captions[state.captions.length - 1];
            if (latest.rawTarget === cleanTarget || (cleanSource && latest.sourceText === cleanSource)) {
                return;
            }
        }

        let seq;
        if (typeof options.seq === 'number') {
            seq = options.seq;
            chunkSequenceCounter = Math.max(chunkSequenceCounter, Math.ceil(seq));
        } else {
            seq = ++chunkSequenceCounter;
        }

        // Split extra-long clauses (>24 target words) cleanly into two balanced sequential clauses
        const targetWords = cleanTarget.split(/\s+/);
        if (targetWords.length > 24) {
            const mid = Math.ceil(targetWords.length / 2);
            const baseId = segmentId || ('cap_' + Date.now());
            insertOrderedCaptionBySeq(seq - 0.01, baseId + '_a', cleanSource, targetWords.slice(0, mid).join(' '), true);
            insertOrderedCaptionBySeq(seq, baseId + '_b', '', targetWords.slice(mid).join(' '), true);
            return;
        }

        const resolvedId = segmentId || ('cap_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6));
        insertOrderedCaptionBySeq(seq, resolvedId, cleanSource, cleanTarget, Boolean(options.polished));
    }

    function insertOrderedCaptionBySeq(seq, segmentId, cleanSource, cleanTarget, polished = true) {
        const translatedHtml = formatGeminiTranslationToHtml(cleanTarget, state.targetLang, cleanSource);
        if (!translatedHtml) return;

        const newItem = {
            id: segmentId,
            seq: seq,
            sourceText: cleanSource,
            rawTarget: cleanTarget,
            translatedHtml: translatedHtml,
            polished: Boolean(polished),
            sourceLang: state.sourceLang,
            targetLang: state.targetLang,
            timestamp: Date.now()
        };

        // Insert in chronological `seq` order rather than dropping out-of-order completions
        let inserted = false;
        for (let i = state.captions.length - 1; i >= 0; i--) {
            const existingSeq = typeof state.captions[i].seq === 'number' ? state.captions[i].seq : -Infinity;
            if (seq >= existingSeq) {
                state.captions.splice(i + 1, 0, newItem);
                inserted = true;
                break;
            }
        }
        if (!inserted) {
            state.captions.unshift(newItem);
        }

        trimCaptionsToMaxLines();

        if (cleanSource) {
            state.recentContext.push(cleanSource);
            if (state.recentContext.length > 3) {
                state.recentContext = state.recentContext.slice(-3);
            }
        }

        lastSpeechDetectedAt = Date.now();
        renderCaptionsStage(true);
        evaluateMiracleLiveMatch(cleanSource, cleanTarget);

        if (state.roomMode === 'broadcast') {
            publishToFirestoreRoom();
        }
    }

    // Kept as a no-op for displayed clauses to uphold strict on-screen immutability
    function polishExistingCaption() {
        return;
    }

    function handleStreamingServerEvent(evt) {
        if (!evt || typeof evt !== 'object') return;

        if (evt.type === 'ready') {
            streamWsReady = true;
            state.transportMode = 'ws_chirp3';
            refreshStreamingStatusPill();
            return;
        }

        if (evt.type === 'fallback_required') {
            streamWsReady = false;
            state.transportMode = 'sse_vad';
            closeStreamWebSocket(false);
            refreshStreamingStatusPill();
            return;
        }

        if (evt.type === 'draft') {
            // Word-by-word drafts are intentionally not displayed on screen
            updateLiveDraftCaption(evt.segmentId, evt.sourceText, evt.translatedText);
            return;
        }

        if (evt.type === 'commit') {
            if (evt.nmtMs) {
                state.lastLatencyMs = Number(evt.nmtMs);
            }
            commitFinalizedCaption(evt.segmentId, evt.sourceText, evt.translatedText, {
                seq: typeof evt.seq === 'number' ? evt.seq : undefined,
                polished: Boolean(evt.polished)
            });
        }
    }

    // --- Option A: Chirp 3 Immutable-Clause WebSocket Client ---
    function canUseChirp3WebSocket() {
        return Boolean(
            typeof WebSocket !== 'undefined' &&
            LANGUAGE_META[state.sourceLang] &&
            LANGUAGE_META[state.sourceLang].supportsChirp3Ws
        );
    }

    function connectStreamWebSocket() {
        closeStreamWebSocket(false);
        if (!state.isListening || !canUseChirp3WebSocket()) {
            state.transportMode = 'sse_vad';
            return;
        }

        try {
            const ws = new WebSocket(TARGUMA_STREAM_WS_URL);
            ws.binaryType = 'arraybuffer';
            streamWs = ws;

            ws.onopen = () => {
                if (ws !== streamWs || !state.isListening) {
                    try { ws.close(); } catch (_) {}
                    return;
                }
                const startMsg = JSON.stringify({
                    type: 'start',
                    sourceLang: state.sourceLang,
                    targetLang: state.targetLang,
                    sampleRate: TARGET_SAMPLE_RATE,
                    model: state.geminiModel || 'gemini-2.5-flash',
                    enablePolish: true
                });
                ws.send(startMsg);

                wsKeepAliveTimer = setInterval(() => {
                    if (ws === streamWs && ws.readyState === WebSocket.OPEN) {
                        try {
                            const pingMsg = JSON.stringify({ type: 'ping', ts: Date.now() });
                            ws.send(pingMsg);
                        } catch (_) {}
                    }
                }, 20000);
            };

            ws.onmessage = (ev) => {
                if (ws !== streamWs || typeof ev.data !== 'string') return;
                try {
                    const parsed = JSON.parse(ev.data);
                    handleStreamingServerEvent(parsed);
                } catch (_) {}
            };

            ws.onerror = () => {
                if (ws !== streamWs) return;
                streamWsReady = false;
                state.transportMode = 'sse_vad';
                refreshStreamingStatusPill();
            };

            ws.onclose = () => {
                if (ws !== streamWs) return;
                streamWs = null;
                streamWsReady = false;
                if (wsKeepAliveTimer) {
                    clearInterval(wsKeepAliveTimer);
                    wsKeepAliveTimer = null;
                }
                if (state.isListening) {
                    state.transportMode = 'sse_vad';
                    refreshStreamingStatusPill();
                    if (canUseChirp3WebSocket()) {
                        wsReconnectTimer = setTimeout(() => {
                            if (state.isListening && canUseChirp3WebSocket()) {
                                connectStreamWebSocket();
                            }
                        }, 4000);
                    }
                }
            };
        } catch (err) {
            streamWs = null;
            streamWsReady = false;
            state.transportMode = 'sse_vad';
        }
    }

    function closeStreamWebSocket(sendStop = true) {
        if (wsReconnectTimer) {
            clearTimeout(wsReconnectTimer);
            wsReconnectTimer = null;
        }
        if (wsKeepAliveTimer) {
            clearInterval(wsKeepAliveTimer);
            wsKeepAliveTimer = null;
        }
        if (streamWs) {
            const old = streamWs;
            streamWs = null;
            streamWsReady = false;
            try {
                if (sendStop && old.readyState === WebSocket.OPEN) {
                    const stopMsg = JSON.stringify({ type: 'stop' });
                    old.send(stopMsg);
                }
                old.close();
            } catch (_) {}
        }
    }

    function sendWsConfigUpdate() {
        if (streamWs && streamWs.readyState === WebSocket.OPEN && streamWsReady) {
            if (!canUseChirp3WebSocket()) {
                closeStreamWebSocket(true);
                state.transportMode = 'sse_vad';
                refreshStreamingStatusPill();
                return;
            }
            try {
                const cfgMsg = JSON.stringify({
                    type: 'config',
                    sourceLang: state.sourceLang,
                    targetLang: state.targetLang,
                    model: state.geminiModel || 'gemini-2.5-flash',
                    enablePolish: true
                });
                streamWs.send(cfgMsg);
            } catch (_) {}
        } else if (state.isListening && canUseChirp3WebSocket()) {
            connectStreamWebSocket();
        }
    }

    // --- Option B: Pause-Aware Clause VAD WAV Slice -> Gemini Streaming SSE ---
    async function streamWavSliceOverSse(wavBytes) {
        if (!wavBytes || wavBytes.length < 1600 || !state.isListening) return;
        if (activeSseRequests >= MAX_CONCURRENT_SSE_REQUESTS) return;

        const mySeq = ++chunkSequenceCounter;
        const mySegId = 'sse_seg_' + mySeq + '_' + Date.now().toString(36);
        activeSseRequests++;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CLIENT_FETCH_TIMEOUT_MS);

        try {
            const base64Audio = uint8ArrayToBase64(wavBytes);
            if (!base64Audio || !state.isListening) return;

            const payload = JSON.stringify({
                stream: true,
                model: state.geminiModel || 'gemini-2.5-flash',
                sourceLang: state.sourceLang,
                targetLang: state.targetLang,
                audioBase64: base64Audio,
                mimeType: 'audio/wav',
                recentContext: state.recentContext
            });

            let resp = null;
            try {
                resp = await fetch(TARGUMA_STREAM_HTTP_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
                    body: payload,
                    signal: controller.signal
                });
            } catch (_) {
                resp = await fetch(TARGUMA_FALLBACK_CF_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
                    body: payload,
                    signal: controller.signal
                });
            }

            if (!resp || !resp.ok) return;

            const contentType = String(resp.headers.get('content-type') || '');
            if (contentType.includes('text/event-stream') && resp.body && typeof resp.body.getReader === 'function') {
                const reader = resp.body.getReader();
                const decoder = new TextDecoder();
                let buf = '';

                while (true) {
                    const step = await reader.read();
                    if (step.done) break;
                    buf += decoder.decode(step.value, { stream: true });
                    const lines = buf.split('\n');
                    buf = lines.pop() || '';

                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (!trimmed.startsWith('data:')) continue;
                        const raw = trimmed.slice(5).trim();
                        if (!raw) continue;
                        try {
                            const evt = JSON.parse(raw);
                            if (evt.type === 'done' && !evt.isSilence && evt.translatedText) {
                                if (evt.latencyMs) state.lastLatencyMs = evt.latencyMs;
                                commitFinalizedCaption(mySegId, evt.sourceText, evt.translatedText, {
                                    seq: mySeq,
                                    polished: true
                                });
                            }
                        } catch (_) {}
                    }
                }
            } else {
                const data = await resp.json();
                if (data && !data.isSilence && data.translatedText) {
                    if (data.latencyMs) state.lastLatencyMs = data.latencyMs;
                    commitFinalizedCaption(mySegId, data.sourceText, data.translatedText, {
                        seq: mySeq,
                        polished: true
                    });
                }
            }
        } catch (err) {
            if (err && err.name !== 'AbortError') {
                console.debug('SSE clause notice:', err.message || err);
            }
        } finally {
            clearTimeout(timeoutId);
            activeSseRequests = Math.max(0, activeSseRequests - 1);
        }
    }

    // --- Process Each 100ms 16kHz Int16 PCM Frame ---
    let vadTracker = { spokenMs: 0, trailingPauseMs: 0, totalMs: 0, sustainedActiveMs: 0 };

    function handlePcm16Frame(int16Frame) {
        if (!state.isListening || !int16Frame || int16Frame.length === 0) return;

        const frameDurationMs = (int16Frame.length / TARGET_SAMPLE_RATE) * 1000;
        const rms = computeInt16Rms(int16Frame);
        const now = Date.now();

        if (rms >= SPEECH_RMS_THRESHOLD) {
            sustainedSpeechMs += frameDurationMs;
            if (sustainedSpeechMs >= MIN_SUSTAINED_SPEECH_MS) {
                lastSpeechDetectedAt = now;
                lastActiveVoiceFrameAt = now;
            }
        } else {
            sustainedSpeechMs = 0;
        }

        // Route 1: Real-Time Chirp 3 Immutable-Clause WebSocket
        if (streamWs && streamWs.readyState === WebSocket.OPEN && streamWsReady && canUseChirp3WebSocket()) {
            const inVoiceOrHangover =
                sustainedSpeechMs >= MIN_SUSTAINED_SPEECH_MS ||
                (lastActiveVoiceFrameAt > 0 && (now - lastActiveVoiceFrameAt) <= WS_POST_SPEECH_HANGOVER_MS);

            if (inVoiceOrHangover) {
                if (lookbehindPcmFrames.length > 0) {
                    for (const prev of lookbehindPcmFrames) {
                        try { streamWs.send(prev.buffer.slice(prev.byteOffset, prev.byteOffset + prev.byteLength)); } catch (_) {}
                    }
                    lookbehindPcmFrames = [];
                }
                try {
                    streamWs.send(int16Frame.buffer.slice(int16Frame.byteOffset, int16Frame.byteOffset + int16Frame.byteLength));
                } catch (_) {}
            } else {
                lookbehindPcmFrames.push(int16Frame);
                if (lookbehindPcmFrames.length > WS_PRE_SPEECH_LOOKBEHIND_FRAMES) {
                    lookbehindPcmFrames.shift();
                }
            }
            return;
        }

        // Route 2: Smart Clause-Aware VAD Ring Buffer -> Gemini Streaming SSE
        vadSliceSamples.push(int16Frame);
        vadSliceSampleCount += int16Frame.length;
        vadTracker = evaluateVadEndpointState(vadTracker, rms, frameDurationMs);

        if (vadTracker.totalMs === 0 && !vadTracker.shouldFlush) {
            while (vadSliceSamples.length > WS_PRE_SPEECH_LOOKBEHIND_FRAMES) {
                const dropped = vadSliceSamples.shift();
                vadSliceSampleCount -= dropped.length;
            }
            return;
        }

        if (vadTracker.shouldFlush && vadSliceSampleCount > 0) {
            const combined = new Int16Array(vadSliceSampleCount);
            let offset = 0;
            for (const chunk of vadSliceSamples) {
                combined.set(chunk, offset);
                offset += chunk.length;
            }

            if (vadTracker.keepOverlap && combined.length > VAD_OVERLAP_SAMPLES) {
                const overlapTail = combined.slice(combined.length - VAD_OVERLAP_SAMPLES);
                vadSliceSamples = [overlapTail];
                vadSliceSampleCount = overlapTail.length;
            } else {
                vadSliceSamples = [];
                vadSliceSampleCount = 0;
            }

            vadTracker = { spokenMs: 0, trailingPauseMs: 0, totalMs: 0, sustainedActiveMs: 0 };
            const wavBytes = encodePcm16ToWavBytes(combined, TARGET_SAMPLE_RATE);
            streamWavSliceOverSse(wavBytes);
        }
    }

    // --- Fast Text Retranslation when User Swaps Target Language ---
    async function translateTargumaPhrase(rawText, sourceLang, targetLang) {
        const cleanText = String(rawText || '').trim();
        if (!cleanText) return '';
        if (sourceLang === targetLang) {
            return formatGeminiTranslationToHtml(cleanText, targetLang, cleanText);
        }

        const activeModel = state.geminiModel || 'gemini-2.5-flash';
        const cacheKey = activeModel + ':' + sourceLang + ':' + targetLang + ':' + cleanText;
        if (translationCache.has(cacheKey)) {
            return translationCache.get(cacheKey);
        }

        try {
            const bodyStr = JSON.stringify({
                mode: 'nmt',
                model: activeModel,
                sourceLang,
                targetLang,
                text: cleanText
            });

            let resp = null;
            try {
                resp = await fetch(TARGUMA_STREAM_HTTP_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
                    body: bodyStr
                });
            } catch (_) {
                resp = await fetch(TARGUMA_FALLBACK_CF_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
                    body: bodyStr
                });
            }

            if (resp && resp.ok) {
                const data = await resp.json();
                if (data && data.translatedText) {
                    const finalHtml = formatGeminiTranslationToHtml(data.translatedText, targetLang, cleanText);
                    if (translationCache.size > 300) {
                        const firstKey = translationCache.keys().next().value;
                        translationCache.delete(firstKey);
                    }
                    translationCache.set(cacheKey, finalHtml);
                    return finalHtml;
                }
            }
        } catch (err) {
            console.debug('Retranslate notice:', err);
        }
        return '';
    }

    // --- Unified 16kHz PCM Audio Pipeline (Mic, Browser Tab YouTube Audio, or Local File Replay) ---
    async function attachWebAudioPipeline(inputSourceMode) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return false;

        if (!audioContext || audioContext.state === 'closed') {
            try {
                audioContext = new AudioCtx({ sampleRate: TARGET_SAMPLE_RATE });
            } catch (_) {
                audioContext = new AudioCtx();
            }
        }
        if (audioContext.state === 'suspended') {
            try { await audioContext.resume(); } catch (_) {}
        }

        if (inputSourceMode === 'file') {
            const audioEl = document.getElementById('targuma-replay-audio');
            if (!audioEl || !audioEl.src) {
                updateStatusBanner('Choose an audio or video clip in Settings below to start replay.', 'idle');
                return false;
            }
            if (!fileMediaElementSource) {
                fileMediaElementSource = audioContext.createMediaElementSource(audioEl);
            }
            sourceAudioNode = fileMediaElementSource;
            try { sourceAudioNode.connect(audioContext.destination); } catch (_) {}
            try { await audioEl.play(); } catch (_) {}
        } else if (inputSourceMode === 'tab') {
            if (!navigator.mediaDevices || typeof navigator.mediaDevices.getDisplayMedia !== 'function') {
                updateStatusBanner('Browser Tab Audio capture requires a desktop browser (Chrome/Edge). Use File Replay on mobile.', 'error');
                return false;
            }
            mediaStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                }
            });
            const audioTracks = mediaStream.getAudioTracks();
            if (!audioTracks || audioTracks.length === 0) {
                mediaStream.getTracks().forEach(t => t.stop());
                mediaStream = null;
                updateStatusBanner('No tab audio shared. Select a browser tab and enable "Also share tab audio".', 'error');
                return false;
            }
            audioTracks[0].addEventListener('ended', () => {
                if (state.isListening) stopLocalListening(true);
            });
            const audioOnlyStream = new MediaStream(audioTracks);
            sourceAudioNode = audioContext.createMediaStreamSource(audioOnlyStream);
        } else {
            if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
                return false;
            }
            mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: TARGET_SAMPLE_RATE,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            sourceAudioNode = audioContext.createMediaStreamSource(mediaStream);
        }

        analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 512;
        sourceAudioNode.connect(analyserNode);

        const meterBytes = new Uint8Array(analyserNode.frequencyBinCount);
        const updateMeter = () => {
            if (!state.isListening || !analyserNode) return;
            analyserNode.getByteTimeDomainData(meterBytes);
            let sumSq = 0;
            for (let i = 0; i < meterBytes.length; i++) {
                const norm = (meterBytes[i] - 128) / 128;
                sumSq += norm * norm;
            }
            updateMicLevelIndicator(Math.sqrt(sumSq / meterBytes.length));
            levelMeterRaf = requestAnimationFrame(updateMeter);
        };
        levelMeterRaf = requestAnimationFrame(updateMeter);

        const actualRate = audioContext.sampleRate || TARGET_SAMPLE_RATE;
        let pendingInt16 = new Int16Array(0);

        function pushFloat32Samples(floatChunk) {
            const downsampled = downsampleFloat32ToInt16Pcm(floatChunk, actualRate, TARGET_SAMPLE_RATE);
            if (downsampled.length === 0) return;

            const merged = new Int16Array(pendingInt16.length + downsampled.length);
            merged.set(pendingInt16, 0);
            merged.set(downsampled, pendingInt16.length);

            let offset = 0;
            while (offset + PCM_FRAME_SAMPLES <= merged.length) {
                handlePcm16Frame(merged.slice(offset, offset + PCM_FRAME_SAMPLES));
                offset += PCM_FRAME_SAMPLES;
            }
            pendingInt16 = merged.slice(offset);
        }

        silentSinkGain = audioContext.createGain();
        silentSinkGain.gain.value = 0;
        silentSinkGain.connect(audioContext.destination);

        let workletAttached = false;
        if (audioContext.audioWorklet && typeof Blob !== 'undefined' && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
            try {
                const workletCode = [
                    'class TargumaPcmProcessor extends AudioWorkletProcessor {',
                    '  process(inputs) {',
                    '    const ch = inputs && inputs[0] && inputs[0][0];',
                    '    if (ch && ch.length > 0) {',
                    '      this.port.postMessage(ch.slice(0));',
                    '    }',
                    '    return true;',
                    '  }',
                    '}',
                    'registerProcessor("targuma-pcm-processor", TargumaPcmProcessor);'
                ].join('\n');
                const blobUrl = URL.createObjectURL(new Blob([workletCode], { type: 'application/javascript' }));
                await audioContext.audioWorklet.addModule(blobUrl);
                URL.revokeObjectURL(blobUrl);

                pcmWorkletNode = new AudioWorkletNode(audioContext, 'targuma-pcm-processor');
                pcmWorkletNode.port.onmessage = (ev) => {
                    if (ev.data) pushFloat32Samples(ev.data);
                };
                sourceAudioNode.connect(pcmWorkletNode);
                pcmWorkletNode.connect(silentSinkGain);
                workletAttached = true;
            } catch (_) {
                workletAttached = false;
            }
        }

        if (!workletAttached && typeof audioContext.createScriptProcessor === 'function') {
            scriptProcessorNode = audioContext.createScriptProcessor(2048, 1, 1);
            scriptProcessorNode.onaudioprocess = (ev) => {
                if (!state.isListening) return;
                const ch = ev.inputBuffer.getChannelData(0);
                if (ch && ch.length > 0) {
                    pushFloat32Samples(new Float32Array(ch));
                }
            };
            sourceAudioNode.connect(scriptProcessorNode);
            scriptProcessorNode.connect(silentSinkGain);
        }

        return true;
    }

    async function startMultimodalAudioStream() {
        stopMultimodalAudioStream(false);
        lookbehindPcmFrames = [];
        vadSliceSamples = [];
        vadSliceSampleCount = 0;
        vadTracker = { spokenMs: 0, trailingPauseMs: 0, totalMs: 0, sustainedActiveMs: 0 };
        sustainedSpeechMs = 0;
        lastActiveVoiceFrameAt = 0;

        if (canUseChirp3WebSocket()) {
            connectStreamWebSocket();
        } else {
            state.transportMode = 'sse_vad';
        }

        try {
            const ok = await attachWebAudioPipeline(state.audioInputMode || 'microphone');
            if (!ok) {
                closeStreamWebSocket(true);
                return false;
            }
            return true;
        } catch (err) {
            console.warn('Audio capture start error:', err);
            closeStreamWebSocket(true);
            return false;
        }
    }

    function stopMultimodalAudioStream(pauseReplayFile = true) {
        closeStreamWebSocket(true);

        if (levelMeterRaf) {
            cancelAnimationFrame(levelMeterRaf);
            levelMeterRaf = null;
        }
        if (pcmWorkletNode) {
            try {
                pcmWorkletNode.port.onmessage = null;
                pcmWorkletNode.disconnect();
            } catch (_) {}
            pcmWorkletNode = null;
        }
        if (scriptProcessorNode) {
            try {
                scriptProcessorNode.onaudioprocess = null;
                scriptProcessorNode.disconnect();
            } catch (_) {}
            scriptProcessorNode = null;
        }
        if (silentSinkGain) {
            try { silentSinkGain.disconnect(); } catch (_) {}
            silentSinkGain = null;
        }
        if (analyserNode) {
            try { analyserNode.disconnect(); } catch (_) {}
            analyserNode = null;
        }
        if (sourceAudioNode && sourceAudioNode !== fileMediaElementSource) {
            try { sourceAudioNode.disconnect(); } catch (_) {}
            sourceAudioNode = null;
        }
        if (mediaStream) {
            try {
                mediaStream.getTracks().forEach(track => track.stop());
            } catch (_) {}
            mediaStream = null;
        }
        if (pauseReplayFile && state.audioInputMode === 'file') {
            const audioEl = document.getElementById('targuma-replay-audio');
            if (audioEl && !audioEl.paused) {
                try { audioEl.pause(); } catch (_) {}
            }
        }
        if (audioContext && state.audioInputMode !== 'file') {
            try { audioContext.close(); } catch (_) {}
            audioContext = null;
            fileMediaElementSource = null;
        }
        state.transportMode = 'idle';
        updateMicLevelIndicator(0);
    }

    function updateMicLevelIndicator(rms) {
        const dot = document.getElementById('targuma-live-dot');
        if (!dot || !state.isListening) return;
        const boost = Math.min(1.65, 1 + rms * 4.2);
        dot.style.transform = 'scale(' + boost.toFixed(2) + ')';
    }

    function refreshStreamingStatusPill() {
        if (!state.isListening) return;
        const srcLabel = LANGUAGE_META[state.sourceLang]?.short || state.sourceLang;
        const tgtLabel = LANGUAGE_META[state.targetLang]?.short || state.targetLang;
        const sourcePrefix =
            state.audioInputMode === 'tab' ? 'Listening to Tab Audio' :
            state.audioInputMode === 'file' ? 'Replaying Audio' : 'Listening';
        updateStatusBanner(sourcePrefix + ' • ' + srcLabel + ' → ' + tgtLabel, 'listening');
    }

    // --- Smart Idle & Forgotten-Listener Guardrail ---
    function startIdleProtectionWatchdog() {
        stopIdleProtectionWatchdog();
        lastSpeechDetectedAt = Date.now();
        sessionStartedAt = Date.now();

        idleWatchdogInterval = setInterval(() => {
            if (!state.isListening) return;
            const now = Date.now();

            const silenceLimit = state.roomMode === 'broadcast' ? 5 * 60 * 1000 : SILENCE_AUTO_PAUSE_MS;
            if (now - lastSpeechDetectedAt >= silenceLimit) {
                const mins = Math.round(silenceLimit / 60000);
                stopLocalListening(false);
                updateStatusBanner(
                    'Listening paused automatically after ' + mins + ' minutes of silence. Tap "Start Listening" to resume.',
                    'idle'
                );
                return;
            }

            if (now - sessionStartedAt >= MAX_SESSION_DURATION_MS) {
                stopLocalListening(false);
                updateStatusBanner(
                    'Session paused after 45 minutes of continuous listening. Tap "Start Listening" to continue.',
                    'idle'
                );
            }
        }, 10000);
    }

    function stopIdleProtectionWatchdog() {
        if (idleWatchdogInterval) {
            clearInterval(idleWatchdogInterval);
            idleWatchdogInterval = null;
        }
        if (hiddenTabTimer) {
            clearTimeout(hiddenTabTimer);
            hiddenTabTimer = null;
        }
    }

    if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', () => {
            if (!state.isListening || state.roomMode === 'broadcast' || state.audioInputMode !== 'microphone') return;
            if (document.visibilityState === 'hidden') {
                clearTimeout(hiddenTabTimer);
                hiddenTabTimer = setTimeout(() => {
                    if (document.visibilityState === 'hidden' && state.isListening && state.roomMode !== 'broadcast' && state.audioInputMode === 'microphone') {
                        stopLocalListening(false);
                        updateStatusBanner(
                            'Listening paused while app was in the background. Tap "Start Listening" to resume.',
                            'idle'
                        );
                    }
                }, HIDDEN_TAB_AUTO_PAUSE_MS);
            } else {
                clearTimeout(hiddenTabTimer);
                hiddenTabTimer = null;
            }
        });
    }

    if (typeof window !== 'undefined') {
        window.onAndroidAudioPermissionResult = function (granted) {
            if (granted && state.isActive) {
                startLocalListening();
            } else if (!granted) {
                updateStatusBanner('Microphone permission was denied. Please enable Microphone access in Settings.', 'error');
            }
        };
    }

    // --- Start / Stop Listening ---
    async function startLocalListening() {
        if (state.audioInputMode === 'microphone' && window.AndroidTargumaBridge && typeof window.AndroidTargumaBridge.hasAudioPermission === 'function') {
            if (!window.AndroidTargumaBridge.hasAudioPermission()) {
                updateStatusBanner('Requesting microphone permission...', 'listening');
                window.AndroidTargumaBridge.requestAudioPermission();
                return;
            }
        }

        stopLocalListening(false);

        state.isListening = true;
        state.lastLatencyMs = 0;
        requestWakeLock();
        updateTargumaControlsUI();
        renderCaptionsStage(false);
        refreshStreamingStatusPill();

        const audioStreamStarted = await startMultimodalAudioStream();
        if (!audioStreamStarted) {
            state.isListening = false;
            updateTargumaControlsUI();
            renderCaptionsStage(false);
            if (state.audioInputMode === 'microphone') {
                updateStatusBanner('Could not access microphone. Please grant microphone permission and try again.', 'error');
            }
            return;
        }

        startIdleProtectionWatchdog();
    }

    function stopLocalListening(updateBanner = true) {
        state.isListening = false;
        state.liveDraft = null;
        stopIdleProtectionWatchdog();
        stopMultimodalAudioStream(true);
        releaseWakeLock();
        updateTargumaControlsUI();
        renderCaptionsStage(false);
        if (updateBanner) {
            updateStatusBanner(DEFAULT_IDLE_STATUS, 'idle');
        }
    }

    // --- Optional URL-triggered Firestore Viewer Support (UI hidden per user preference) ---
    function getFirestoreRoomRef(roomCode) {
        if (typeof firebase === 'undefined' || !firebase.firestore) return null;
        const cleanCode = String(roomCode || 'oakland').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'oakland';
        return firebase.firestore().collection('targuma_sessions').doc(cleanCode);
    }

    async function publishToFirestoreRoom() {
        if (state.roomMode !== 'broadcast') return;
        const docRef = getFirestoreRoomRef(state.roomCode);
        if (!docRef) return;

        const visibleCaptions = state.captions.slice(-(state.maxLines || 3)).map(c => ({
            id: c.id,
            sourceText: c.sourceText,
            rawTarget: c.rawTarget,
            translatedHtml: c.translatedHtml,
            polished: Boolean(c.polished),
            sourceLang: c.sourceLang,
            targetLang: c.targetLang,
            timestamp: c.timestamp
        }));

        const payload = {
            roomCode: state.roomCode,
            sourceLang: state.sourceLang,
            targetLang: state.targetLang,
            selectedIconId: state.selectedIconId,
            maxLines: state.maxLines,
            captions: visibleCaptions,
            liveDraft: null,
            updatedAt: Date.now()
        };

        try {
            await docRef.set(payload, { merge: true });
        } catch (err) {
            console.debug('Firestore sync note:', err.message);
        }
    }

    function connectAsParishViewer(roomCode) {
        disconnectFirestoreRoom();
        stopLocalListening(false);

        state.roomCode = String(roomCode || state.roomCode || 'oakland').trim().toLowerCase();
        state.roomMode = 'viewer';
        requestWakeLock();
        updateTargumaControlsUI();

        const docRef = getFirestoreRoomRef(state.roomCode);
        if (!docRef) {
            updateStatusBanner('Live stream unavailable offline.', 'error');
            return;
        }

        updateStatusBanner('Connected • Waiting for live captions...', 'viewer');

        firestoreUnsubscribe = docRef.onSnapshot((docSnap) => {
            if (!docSnap.exists) return;
            const data = docSnap.data() || {};
            if (Array.isArray(data.captions)) {
                state.captions = data.captions.slice(-(state.maxLines || 3));
            } else if (Array.isArray(data.slots)) {
                state.captions = data.slots.filter(Boolean).slice(-(state.maxLines || 3));
            }
            if (data.selectedIconId && TARGUMA_ICONS.some(i => i.id === data.selectedIconId)) {
                state.selectedIconId = data.selectedIconId;
                updateStageIcon();
            }
            updateStatusBanner('Live Sanctuary Captions', 'listening');
            renderCaptionsStage(true);
        }, (err) => {
            console.warn('Firestore viewer subscription error:', err);
        });
    }

    function disconnectFirestoreRoom() {
        if (firestoreUnsubscribe) {
            firestoreUnsubscribe();
            firestoreUnsubscribe = null;
        }
    }

    // --- UI Construction & Rendering ---
    function supportsTabAudioCapture() {
        const isAndroidWebView = Boolean(window.AndroidTargumaBridge);
        return Boolean(!isAndroidWebView && typeof navigator !== 'undefined' && navigator.mediaDevices && typeof navigator.mediaDevices.getDisplayMedia === 'function');
    }

    function ensureTargumaDOM() {
        let container = document.getElementById('targuma-view');
        if (container) return container;

        const mainContentEl = document.querySelector('.main-content');
        if (!mainContentEl) return null;

        container = document.createElement('section');
        container.id = 'targuma-view';
        container.className = 'targuma-view hidden';
        container.setAttribute('aria-live', 'polite');

        const currentIcon = TARGUMA_ICONS.find(i => i.id === state.selectedIconId) || TARGUMA_ICONS[0];
        const isIconHidden = state.selectedIconId === 'none';
        const modelOptionsHtml = GEMINI_MODELS.map(m => '<option value="' + m.id + '">' + m.label + '</option>').join('');
        const iconOptionsHtml = TARGUMA_ICONS.map(icon => '<option value="' + icon.id + '">' + icon.titleEnglish + '</option>').join('');
        const tabAudioOptionHtml = supportsTabAudioCapture()
            ? '<option value="tab">Browser Tab Audio (YouTube Test)</option>'
            : '';

        container.innerHTML = `
            <!-- Top Sanctuary Control Bar (Clean & Focused) -->
            <div class="targuma-toolbar" id="targuma-toolbar">
                <div class="targuma-toolbar-row targuma-toolbar-primary">
                    <div class="targuma-brand-group">
                        <div class="targuma-brand-badge" title="Targuma Live Sermon & Announcement Interpreter">
                            <span class="targuma-live-dot" id="targuma-live-dot"></span>
                            <span class="ethiopic-label targuma-title-text">ተርጉማ • Targuma</span>
                        </div>
                        <button type="button" id="targuma-info-btn" class="targuma-info-btn" title="About Targuma" aria-label="About Targuma">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                            </svg>
                        </button>
                    </div>

                    <div class="targuma-lang-switcher">
                        <label class="targuma-sr-only" for="targuma-source-lang">Spoken Input Language</label>
                        <select id="targuma-source-lang" class="targuma-select" title="Spoken Language (Input)">
                            <option value="am">አማርኛ (Amharic)</option>
                            <option value="ti">ትግርኛ (Tigrinya)</option>
                            <option value="en">English</option>
                            <option value="es">Español (Spanish)</option>
                        </select>

                        <button type="button" id="targuma-swap-langs-btn" class="targuma-icon-btn" title="Swap Input & Output Languages (⇄)" aria-label="Swap Input and Output Languages">
                            ⇄
                        </button>

                        <label class="targuma-sr-only" for="targuma-target-lang">Caption Output Language</label>
                        <select id="targuma-target-lang" class="targuma-select" title="Caption Language (Output)">
                            <option value="en">English</option>
                            <option value="am">አማርኛ (Amharic)</option>
                            <option value="ti">ትግርኛ (Tigrinya)</option>
                            <option value="es">Español (Spanish)</option>
                        </select>
                    </div>

                    <div class="targuma-action-group">
                        <button type="button" id="targuma-mic-btn" class="targuma-mic-btn">
                            <svg class="targuma-mic-svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
                            </svg>
                            <span id="targuma-mic-btn-label">Start Listening</span>
                        </button>

                        <button type="button" id="targuma-settings-toggle-btn" class="targuma-icon-btn" title="Customize Display, Icon, Model & Audio Source" aria-label="Targuma Settings">
                            ⚙
                        </button>

                        <button type="button" id="targuma-tv-zen-btn" class="targuma-icon-btn" title="Hide Controls" aria-label="Hide Controls">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                            </svg>
                        </button>

                        <button type="button" id="targuma-exit-btn" class="targuma-icon-btn targuma-exit-btn" title="Exit Targuma Mode" aria-label="Exit Targuma Mode">
                            ✕
                        </button>
                    </div>
                </div>

                <!-- Collapsible Display & Audio Settings Drawer -->
                <div class="targuma-toolbar-drawer hidden" id="targuma-toolbar-drawer">
                    <div class="targuma-drawer-grid">
                        <div class="targuma-setting-item">
                            <label for="targuma-display-mode-select">Caption Style</label>
                            <select id="targuma-display-mode-select" class="targuma-select">
                                <option value="target">Target Language Only</option>
                                <option value="bilingual">Bilingual Stacked</option>
                            </select>
                        </div>

                        <div class="targuma-setting-item">
                            <label for="targuma-lines-select">Visible Clauses</label>
                            <select id="targuma-lines-select" class="targuma-select">
                                <option value="2">2 Clauses</option>
                                <option value="3">3 Clauses</option>
                                <option value="4">4 Clauses</option>
                            </select>
                        </div>

                        <div class="targuma-setting-item">
                            <label for="targuma-font-slider">Caption Size: <span id="targuma-font-size-val">${state.fontSizePx}px</span></label>
                            <div class="targuma-slider-wrap">
                                <button type="button" id="targuma-font-dec" class="targuma-mini-btn" aria-label="Decrease Caption Font Size">A-</button>
                                <input type="range" id="targuma-font-slider" min="18" max="64" value="${state.fontSizePx}" />
                                <button type="button" id="targuma-font-inc" class="targuma-mini-btn" aria-label="Increase Caption Font Size">A+</button>
                            </div>
                        </div>

                        <div class="targuma-setting-item">
                            <label for="targuma-icon-select">Sanctuary Icon</label>
                            <select id="targuma-icon-select" class="targuma-select">
                                ${iconOptionsHtml}
                            </select>
                        </div>

                        <div class="targuma-setting-item">
                            <label for="targuma-audio-source-select">Audio Input Source</label>
                            <select id="targuma-audio-source-select" class="targuma-select" title="Select Microphone, YouTube Browser Tab, or Local Audio File">
                                <option value="microphone">Live Microphone / Line-In</option>
                                ${tabAudioOptionHtml}
                                <option value="file">Audio / Video File Replay</option>
                            </select>
                        </div>

                        <div class="targuma-setting-item">
                            <label for="targuma-model-select">Translation Model</label>
                            <div class="targuma-model-stage-controls">
                                <select id="targuma-model-select" class="targuma-select targuma-model-select" title="Select Gemini Model">
                                    ${modelOptionsHtml}
                                </select>
                                <button type="button" id="targuma-clear-captions-btn" class="targuma-mini-btn" title="Clear Screen Captions">Clear</button>
                            </div>
                        </div>
                    </div>

                    <!-- Local Audio / Video File Replay Bar (Visible when Audio Input Source = File Replay) -->
                    <div class="targuma-file-replay-bar hidden" id="targuma-file-replay-bar">
                        <label class="targuma-mini-btn targuma-file-upload-label" for="targuma-replay-file-input">
                            Choose Sermon / Miracle Clip
                        </label>
                        <input type="file" id="targuma-replay-file-input" accept="audio/*,video/*" class="targuma-sr-only" />
                        <span class="targuma-file-replay-name" id="targuma-file-replay-name">No clip selected</span>
                        <audio id="targuma-replay-audio" controls preload="metadata" class="targuma-replay-audio"></audio>
                    </div>
                </div>
            </div>

            <button type="button" id="targuma-restore-toolbar-btn" class="targuma-restore-toolbar-btn hidden" title="Show Controls">
                Show Controls
            </button>

            <div class="targuma-sanctuary-stage ${isIconHidden ? 'icon-hidden' : ''}" id="targuma-sanctuary-stage">
                <div class="targuma-icon-frame ${isIconHidden ? 'hidden' : ''}" id="targuma-icon-frame">
                    <img id="targuma-stage-icon" src="${currentIcon.src || 'img/With-her-beloved-Son.png'}" alt="${escapeHtml(currentIcon.titleEnglish)}" class="targuma-stage-icon" title="Click to cycle Orthodox icon" />
                </div>

                <div class="targuma-stage-main" id="targuma-stage-main">
                    <div class="targuma-status-pill" id="targuma-status-pill">
                        ${DEFAULT_IDLE_STATUS}
                    </div>

                    <div class="targuma-captions-viewport" id="targuma-captions-viewport" style="--targuma-font-size: ${state.fontSizePx}px;">
                        <div class="targuma-captions-list" id="targuma-captions-list">
                        </div>
                    </div>
                </div>
            </div>

            <div id="targuma-info-modal" class="modal">
                <div class="modal-content targuma-info-modal-content">
                    <span class="close-button" id="close-targuma-info-modal">&times;</span>
                    <h3>Targuma: Live Translated Captions</h3>
                    <p>
                        Targuma bridges the language barrier in our parishes by providing live captions and translations during sermons, readings, and announcements.
                    </p>
                    <p>
                        <strong>How to Use:</strong> Choose the spoken language and your desired caption language, then tap <strong>Start Listening</strong>. To broadcast translations directly to the phones of nearby parishioners, place one host device near the sound source and set it to &ldquo;Media Team Host (Broadcast)&rdquo; mode so nearby devices can join instantaneously.
                    </p>
                    <p>
                        <strong>Historical Context:</strong> In the ancient Second Temple period and synagogue tradition, when Hebrew Scriptures were read aloud, an appointed priest or translator would translate the text live on the spot into the congregation's spoken lingua franca (Aramaic)—a practice known as a <em>Targum</em> (translation/interpretation), from which this feature takes its name.
                    </p>
                </div>
            </div>
        `;

        const prayerDisplayEl = document.getElementById('prayer-display');
        if (prayerDisplayEl && prayerDisplayEl.parentNode) {
            prayerDisplayEl.parentNode.insertBefore(container, prayerDisplayEl);
        } else {
            mainContentEl.appendChild(container);
        }

        bindTargumaUIEvents(container);
        syncTargumaInputsFromState();
        renderCaptionsStage(false);
        return container;
    }

    function bindTargumaUIEvents(container) {
        const sourceSelect = container.querySelector('#targuma-source-lang');
        const targetSelect = container.querySelector('#targuma-target-lang');
        const swapBtn = container.querySelector('#targuma-swap-langs-btn');
        const modelSelect = container.querySelector('#targuma-model-select');
        const micBtn = container.querySelector('#targuma-mic-btn');
        const settingsToggleBtn = container.querySelector('#targuma-settings-toggle-btn');
        const drawer = container.querySelector('#targuma-toolbar-drawer');
        const tvZenBtn = container.querySelector('#targuma-tv-zen-btn');
        const restoreToolbarBtn = container.querySelector('#targuma-restore-toolbar-btn');
        const exitBtn = container.querySelector('#targuma-exit-btn');
        const infoBtn = container.querySelector('#targuma-info-btn');
        const infoModal = container.querySelector('#targuma-info-modal');
        const closeInfoModalBtn = container.querySelector('#close-targuma-info-modal');

        const displayModeSelect = container.querySelector('#targuma-display-mode-select');
        const linesSelect = container.querySelector('#targuma-lines-select');
        const fontSlider = container.querySelector('#targuma-font-slider');
        const fontDec = container.querySelector('#targuma-font-dec');
        const fontInc = container.querySelector('#targuma-font-inc');
        const iconSelect = container.querySelector('#targuma-icon-select');
        const audioSourceSelect = container.querySelector('#targuma-audio-source-select');
        const fileReplayBar = container.querySelector('#targuma-file-replay-bar');
        const fileInput = container.querySelector('#targuma-replay-file-input');
        const fileNameSpan = container.querySelector('#targuma-file-replay-name');
        const replayAudio = container.querySelector('#targuma-replay-audio');
        const clearBtn = container.querySelector('#targuma-clear-captions-btn');
        const stageIcon = container.querySelector('#targuma-stage-icon');

        sourceSelect.addEventListener('change', () => {
            state.sourceLang = sourceSelect.value;
            if (state.sourceLang === state.targetLang) {
                state.targetLang = state.sourceLang === 'en' ? 'am' : 'en';
                targetSelect.value = state.targetLang;
            }
            saveTargumaSettings();
            if (state.isListening) {
                sendWsConfigUpdate();
                refreshStreamingStatusPill();
            }
        });

        targetSelect.addEventListener('change', () => {
            state.targetLang = targetSelect.value;
            if (state.targetLang === state.sourceLang) {
                state.sourceLang = state.targetLang === 'en' ? 'am' : 'en';
                sourceSelect.value = state.sourceLang;
            }
            saveTargumaSettings();
            if (state.isListening) {
                sendWsConfigUpdate();
                refreshStreamingStatusPill();
            }
            retranslateExistingCaptions();
        });

        swapBtn.addEventListener('click', () => {
            const prevSource = state.sourceLang;
            state.sourceLang = state.targetLang;
            state.targetLang = prevSource;
            syncTargumaInputsFromState();
            saveTargumaSettings();
            if (state.isListening) {
                sendWsConfigUpdate();
                refreshStreamingStatusPill();
            }
            retranslateExistingCaptions();
        });

        if (modelSelect) {
            modelSelect.addEventListener('change', () => {
                state.geminiModel = modelSelect.value;
                saveTargumaSettings();
                if (state.isListening) {
                    sendWsConfigUpdate();
                }
            });
        }

        if (audioSourceSelect) {
            audioSourceSelect.addEventListener('change', () => {
                const wasListening = state.isListening;
                if (wasListening) stopLocalListening(false);
                state.audioInputMode = audioSourceSelect.value || 'microphone';
                if (fileReplayBar) {
                    fileReplayBar.classList.toggle('hidden', state.audioInputMode !== 'file');
                }
                updateTargumaControlsUI();
                if (state.audioInputMode === 'tab') {
                    updateStatusBanner('Tab Audio ready — Tap "Capture Tab Audio" and pick your YouTube tab.', 'idle');
                } else if (state.audioInputMode === 'file') {
                    updateStatusBanner('Choose a sermon or Miracle of Mary clip below, then tap "Start File Replay".', 'idle');
                } else {
                    updateStatusBanner(DEFAULT_IDLE_STATUS, 'idle');
                }
            });
        }

        if (fileInput && replayAudio) {
            fileInput.addEventListener('change', () => {
                const file = fileInput.files && fileInput.files[0];
                if (!file) return;
                if (replayObjectUrl) {
                    try { URL.revokeObjectURL(replayObjectUrl); } catch (_) {}
                }
                replayObjectUrl = URL.createObjectURL(file);
                replayAudio.src = replayObjectUrl;
                if (fileNameSpan) fileNameSpan.textContent = file.name;
                updateStatusBanner('Loaded "' + file.name + '" — Tap "Start File Replay" to stream live captions.', 'idle');
            });

            replayAudio.addEventListener('ended', () => {
                if (state.isListening && state.audioInputMode === 'file') {
                    stopLocalListening(false);
                    updateStatusBanner('Finished replaying audio clip.', 'idle');
                }
            });
        }

        micBtn.addEventListener('click', () => {
            if (state.roomMode === 'viewer') {
                state.roomMode = 'local';
                disconnectFirestoreRoom();
            }
            if (state.isListening) {
                stopLocalListening(true);
            } else {
                startLocalListening();
            }
        });

        settingsToggleBtn.addEventListener('click', () => {
            drawer.classList.toggle('hidden');
            settingsToggleBtn.classList.toggle('active', !drawer.classList.contains('hidden'));
        });

        tvZenBtn.addEventListener('click', () => {
            setToolbarMinimized(true);
        });

        restoreToolbarBtn.addEventListener('click', () => {
            setToolbarMinimized(false);
        });

        exitBtn.addEventListener('click', () => {
            toggleTargumaMode(false);
        });

        if (infoBtn && infoModal) {
            infoBtn.addEventListener('click', () => {
                infoModal.style.display = 'block';
            });
        }
        if (closeInfoModalBtn && infoModal) {
            closeInfoModalBtn.addEventListener('click', () => {
                infoModal.style.display = 'none';
            });
        }
        if (infoModal) {
            infoModal.addEventListener('click', (ev) => {
                if (ev.target === infoModal) {
                    infoModal.style.display = 'none';
                }
            });
        }

        stageIcon.addEventListener('click', () => {
            const visibleIcons = TARGUMA_ICONS.filter(i => i.id !== 'none');
            const idx = visibleIcons.findIndex(i => i.id === state.selectedIconId);
            const nextIcon = visibleIcons[(idx + 1) % visibleIcons.length];
            state.selectedIconId = nextIcon.id;
            iconSelect.value = state.selectedIconId;
            updateStageIcon();
            saveTargumaSettings();
        });

        displayModeSelect.addEventListener('change', () => {
            state.displayMode = displayModeSelect.value;
            saveTargumaSettings();
            renderCaptionsStage(false);
        });

        linesSelect.addEventListener('change', () => {
            state.maxLines = Number(linesSelect.value) || 3;
            trimCaptionsToMaxLines();
            saveTargumaSettings();
            renderCaptionsStage(false);
        });

        function applyFontSize(newSize) {
            state.fontSizePx = Math.max(18, Math.min(64, Number(newSize) || 34));
            fontSlider.value = state.fontSizePx;
            const valSpan = container.querySelector('#targuma-font-size-val');
            if (valSpan) valSpan.textContent = state.fontSizePx + 'px';
            const viewport = container.querySelector('#targuma-captions-viewport');
            if (viewport) viewport.style.setProperty('--targuma-font-size', state.fontSizePx + 'px');
            saveTargumaSettings();
        }

        fontSlider.addEventListener('input', () => applyFontSize(fontSlider.value));
        fontDec.addEventListener('click', () => applyFontSize(state.fontSizePx - 2));
        fontInc.addEventListener('click', () => applyFontSize(state.fontSizePx + 2));

        iconSelect.addEventListener('change', () => {
            state.selectedIconId = iconSelect.value;
            updateStageIcon();
            saveTargumaSettings();
        });

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                clearAllCaptions();
                renderCaptionsStage(false);
            });
        }
    }

    async function retranslateExistingCaptions() {
        const items = state.captions.slice();
        await Promise.all(items.map(async (item) => {
            if (item && item.sourceText) {
                const newHtml = await translateTargumaPhrase(item.sourceText, state.sourceLang, state.targetLang);
                if (newHtml) {
                    item.targetLang = state.targetLang;
                    item.translatedHtml = newHtml;
                }
            }
        }));
        renderCaptionsStage(false);
    }

    function setToolbarMinimized(minimized) {
        state.controlsMinimized = minimized;
        const toolbar = document.getElementById('targuma-toolbar');
        const restoreBtn = document.getElementById('targuma-restore-toolbar-btn');
        const statusPill = document.getElementById('targuma-status-pill');
        if (toolbar) toolbar.classList.toggle('hidden', minimized);
        if (restoreBtn) restoreBtn.classList.toggle('hidden', !minimized);
        if (statusPill) statusPill.classList.toggle('hidden', minimized);
    }

    function updateStageIcon() {
        const isHidden = state.selectedIconId === 'none';
        const iconObj = TARGUMA_ICONS.find(i => i.id === state.selectedIconId) || TARGUMA_ICONS[0];
        const stageEl = document.getElementById('targuma-sanctuary-stage');
        const frameEl = document.getElementById('targuma-icon-frame');
        const imgEl = document.getElementById('targuma-stage-icon');

        if (stageEl) stageEl.classList.toggle('icon-hidden', isHidden);
        if (frameEl) frameEl.classList.toggle('hidden', isHidden);
        if (imgEl && !isHidden && iconObj.src) {
            imgEl.src = iconObj.src;
            imgEl.alt = iconObj.titleEnglish;
        }
    }

    function syncTargumaInputsFromState() {
        const container = document.getElementById('targuma-view');
        if (!container) return;

        const sourceSelect = container.querySelector('#targuma-source-lang');
        const targetSelect = container.querySelector('#targuma-target-lang');
        const modelSelect = container.querySelector('#targuma-model-select');
        const displayModeSelect = container.querySelector('#targuma-display-mode-select');
        const linesSelect = container.querySelector('#targuma-lines-select');
        const fontSlider = container.querySelector('#targuma-font-slider');
        const fontVal = container.querySelector('#targuma-font-size-val');
        const iconSelect = container.querySelector('#targuma-icon-select');
        const audioSourceSelect = container.querySelector('#targuma-audio-source-select');
        const fileReplayBar = container.querySelector('#targuma-file-replay-bar');

        if (sourceSelect) sourceSelect.value = state.sourceLang;
        if (targetSelect) targetSelect.value = state.targetLang;
        if (modelSelect) modelSelect.value = state.geminiModel;
        if (displayModeSelect) displayModeSelect.value = state.displayMode;
        if (linesSelect) linesSelect.value = String(state.maxLines);
        if (fontSlider) fontSlider.value = String(state.fontSizePx);
        if (fontVal) fontVal.textContent = state.fontSizePx + 'px';
        if (iconSelect) iconSelect.value = state.selectedIconId;
        if (audioSourceSelect) audioSourceSelect.value = state.audioInputMode;
        if (fileReplayBar) fileReplayBar.classList.toggle('hidden', state.audioInputMode !== 'file');
        updateStageIcon();
    }

    function updateTargumaControlsUI() {
        const micBtn = document.getElementById('targuma-mic-btn');
        const micLabel = document.getElementById('targuma-mic-btn-label');
        const liveDot = document.getElementById('targuma-live-dot');
        const headerBtn = document.getElementById('targuma-mode-toggle-header');

        if (micBtn && micLabel) {
            micBtn.classList.toggle('listening', state.isListening);
            if (state.isListening) {
                micLabel.textContent = 'Pause Listening';
            } else if (state.audioInputMode === 'tab') {
                micLabel.textContent = 'Capture Tab Audio';
            } else if (state.audioInputMode === 'file') {
                micLabel.textContent = 'Start File Replay';
            } else {
                micLabel.textContent = 'Start Listening';
            }
        }
        if (liveDot) {
            liveDot.classList.toggle('active', state.isListening || state.roomMode === 'viewer');
        }
        if (headerBtn) {
            headerBtn.classList.toggle('targuma-header-active', state.isActive);
        }
    }

    function updateStatusBanner(message, statusType) {
        const pill = document.getElementById('targuma-status-pill');
        if (!pill) return;
        pill.textContent = message;
        pill.dataset.status = statusType || 'idle';
    }

    // --- Render Balanced Sanctuary Clause Stage (2–4 Immutable Clauses + Subtle Listening Dots) ---
    function renderCaptionsStage(animateGlide = false) {
        const listEl = document.getElementById('targuma-captions-list');
        const viewportEl = document.getElementById('targuma-captions-viewport');
        if (!listEl) return;

        if (viewportEl) {
            viewportEl.classList.toggle('bilingual-mode', state.displayMode === 'bilingual');
            viewportEl.dataset.lines = String(state.maxLines);
        }

        const isStreamingActive = state.isListening || state.roomMode === 'viewer';

        if (state.captions.length === 0) {
            listEl.innerHTML = `
                <div class="targuma-empty-placeholder">
                    <p class="targuma-placeholder-primary">
                        “Listen, my daughter, and see, and incline your ear”
                        <span class="ethiopic-label targuma-placeholder-sub">(ስምዒ ወለትየ ወርእዪ ወአጽምዒ እዝነኪ — መዝ ፵፬፡፲)</span>
                    </p>
                </div>
                ${isStreamingActive ? `
                <div class="targuma-upcoming-ellipsis" aria-hidden="true" title="Listening for next clause">
                    <span class="targuma-ellipsis-dot"></span>
                    <span class="targuma-ellipsis-dot"></span>
                    <span class="targuma-ellipsis-dot"></span>
                </div>` : ''}
            `;
            return;
        }

        const prevRects = new Map();
        if (animateGlide) {
            listEl.querySelectorAll('.targuma-caption-line[data-cap-id]').forEach(el => {
                prevRects.set(el.dataset.capId, el.getBoundingClientRect().top);
            });
        }

        const visibleCommitted = state.captions.slice(-(state.maxLines || 3));

        let html = '';
        visibleCommitted.forEach((cap, idx) => {
            const isNewestVisible = idx === visibleCommitted.length - 1;
            const lineClass = isNewestVisible ? 'targuma-line-latest' : 'targuma-line-previous';
            html += '<div class="targuma-caption-line ' + lineClass + '" data-cap-id="' + escapeHtml(cap.id) + '">';
            if (state.displayMode === 'bilingual' && cap.sourceText) {
                html += '<div class="targuma-line-source">' + escapeHtml(cap.sourceText) + '</div>';
            }
            html += '<div class="targuma-line-target">' + cap.translatedHtml + '</div>';
            html += '</div>';
        });

        if (isStreamingActive) {
            html += `
                <div class="targuma-upcoming-ellipsis" aria-hidden="true" title="Listening for next clause">
                    <span class="targuma-ellipsis-dot"></span>
                    <span class="targuma-ellipsis-dot"></span>
                    <span class="targuma-ellipsis-dot"></span>
                </div>
            `;
        }

        listEl.innerHTML = html;

        if (animateGlide) {
            listEl.querySelectorAll('.targuma-caption-line[data-cap-id]').forEach(el => {
                const capId = el.dataset.capId;
                const newTop = el.getBoundingClientRect().top;
                if (prevRects.has(capId)) {
                    const deltaY = prevRects.get(capId) - newTop;
                    if (Math.abs(deltaY) > 1) {
                        el.style.transition = 'none';
                        el.style.transform = 'translateY(' + deltaY + 'px)';
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                el.style.transition = 'transform 0.52s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.48s ease';
                                el.style.transform = 'translateY(0)';
                            });
                        });
                    }
                } else {
                    el.style.transition = 'none';
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(8px)';
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            el.style.transition = 'transform 0.52s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.48s ease';
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0)';
                        });
                    });
                }
            });
        }
    }

    // --- Toggle Targuma Mode On / Off ---
    function toggleTargumaMode(forceState) {
        loadTargumaSettings();
        const container = ensureTargumaDOM();
        if (!container) return;

        const nextActive = typeof forceState === 'boolean' ? forceState : !state.isActive;
        state.isActive = nextActive;

        const prayerDisplayEl = document.getElementById('prayer-display');

        if (state.isActive && typeof window.toggleLearningMode === 'function') {
            window.toggleLearningMode(false);
        }

        if (state.isActive && typeof displayOptions !== 'undefined' && displayOptions.presentationMode === 'slides') {
            if (typeof window.togglePresentationMode === 'function') {
                window.togglePresentationMode();
            }
        }

        if (state.isActive && typeof collapseSidebar === 'function') {
            collapseSidebar();
        }

        document.body.classList.toggle('targuma-mode-active', state.isActive);
        container.classList.toggle('hidden', !state.isActive);
        if (prayerDisplayEl) {
            prayerDisplayEl.classList.toggle('hidden', state.isActive);
        }

        document.querySelectorAll('.primary-nav-tab, .header-nav-tab, .bottom-nav-item').forEach(btn => {
            const navTarget = btn.getAttribute('data-nav-tab');
            if (!navTarget) return;
            if (state.isActive) {
                btn.classList.toggle('active', navTarget === 'targuma');
            } else if (!document.body.classList.contains('learning-mode-active')) {
                const fallbackTab = (typeof activePrimaryTab !== 'undefined' && (activePrimaryTab === 'pray' || activePrimaryTab === 'liturgy')) ? activePrimaryTab : 'pray';
                btn.classList.toggle('active', navTarget === fallbackTab);
            }
        });
        const floatingEl = document.getElementById('prayer-floating-controls');
        if (floatingEl) {
            floatingEl.style.display = (state.isActive || document.body.classList.contains('learning-mode-active')) ? 'none' : 'flex';
        }

        if (!state.isActive) {
            stopLocalListening(false);
            disconnectFirestoreRoom();
            setToolbarMinimized(false);
        } else {
            window.scrollTo(0, 0);
            syncTargumaInputsFromState();
            renderCaptionsStage(false);
            requestWakeLock();
        }

        updateTargumaControlsUI();
    }

    // --- Live Miracle of Mary Identification (via Targuma AI) ---
    let isMiracleLiveDetectActive = false;
    let accumulatedMiracleTranscript = '';

    function evaluateMiracleLiveMatch(sourceText, targetText) {
        const banner = document.getElementById('miracle-live-match-banner');
        const miracleModal = document.getElementById('miracle-modal');
        const isModalVisible = miracleModal && miracleModal.style.display === 'block';
        if (!isMiracleLiveDetectActive && !isModalVisible) return;

        const combinedChunk = ((sourceText || '') + ' ' + (targetText || '')).trim();
        if (!combinedChunk) return;

        accumulatedMiracleTranscript = (accumulatedMiracleTranscript + ' ' + combinedChunk).trim().slice(-500);
        if (typeof window.matchMiraclesByText !== 'function') return;

        const matches = window.matchMiraclesByText(accumulatedMiracleTranscript, false);
        if (banner) {
            banner.style.display = 'block';
            if (matches && matches.length > 0) {
                const topMatches = matches.slice(0, 3);
                const chipsHtml = topMatches.map(m => (
                    '<button type="button" class="miracle-live-match-chip" data-miracle-id="' + escapeHtml(m.id) + '">' +
                    escapeHtml(m.title || ('Miracle #' + m.id)) +
                    '</button>'
                )).join('');
                banner.innerHTML =
                    '<div class="miracle-live-banner-header">Targuma AI Live Match Suggestions (Tap to select):</div>' +
                    '<div class="miracle-live-banner-chips">' + chipsHtml + '</div>';
                banner.querySelectorAll('.miracle-live-match-chip').forEach(chip => {
                    chip.addEventListener('click', () => {
                        const searchInput = document.getElementById('miracle-search-input');
                        if (searchInput) {
                            searchInput.value = chip.textContent || '';
                            searchInput.dispatchEvent(new Event('input'));
                        }
                    });
                });
            } else {
                banner.innerHTML = '<div class="miracle-live-banner-header">Listening for Miracle of Mary keywords... (' + escapeHtml(combinedChunk.slice(0, 60)) + ')</div>';
            }
        }
    }

    function toggleMiracleLiveIdentification() {
        const btn = document.getElementById('miracle-voice-detect-btn');
        const banner = document.getElementById('miracle-live-match-banner');
        isMiracleLiveDetectActive = !isMiracleLiveDetectActive;

        if (isMiracleLiveDetectActive) {
            accumulatedMiracleTranscript = '';
            if (btn) {
                btn.classList.add('listening');
                const span = btn.querySelector('span');
                if (span) span.textContent = 'Listening for Miracle... (Tap to Stop)';
            }
            if (banner) {
                banner.style.display = 'block';
                banner.innerHTML = '<div class="miracle-live-banner-header">Targuma AI is listening to the reader (Amharic, Tigrinya, Ge\'ez, or English)...</div>';
            }
            if (!state.isListening) {
                startLocalListening();
            }
        } else {
            if (btn) {
                btn.classList.remove('listening');
                const span = btn.querySelector('span');
                if (span) span.textContent = 'Identify Live Reading (Targuma AI)';
            }
            if (!state.isActive && state.isListening) {
                stopLocalListening(false);
            }
        }
    }

    function initTargumaButton() {
        loadTargumaSettings();
        const headerBtn = document.getElementById('targuma-mode-toggle-header');
        if (headerBtn && !headerBtn.dataset.targumaBound && !headerBtn.classList.contains('primary-nav-tab') && !headerBtn.classList.contains('header-nav-tab')) {
            headerBtn.dataset.targumaBound = 'true';
            headerBtn.addEventListener('click', () => {
                toggleTargumaMode();
            });
        }

        try {
            const params = new URLSearchParams(window.location.search);
            const roomParam = params.get('targuma');
            if (roomParam) {
                toggleTargumaMode(true);
                if (roomParam !== '1' && roomParam !== 'true') {
                    connectAsParishViewer(roomParam);
                }
            }
        } catch (e) {}
    }

    const TargumaServiceAPI = {
        get isTargumaMode() { return state.isActive; },
        get state() { return state; },
        exitTargumaMode: () => toggleTargumaMode(false),
        toggleTargumaMode,
        toggleMiracleLiveIdentification,
        initTargumaFeature: initTargumaButton,
        clearAllCaptions,
        // Exported streaming & DSP helpers for unit/replay testing
        downsampleFloat32ToInt16Pcm,
        computeInt16Rms,
        encodePcm16ToWavBytes,
        evaluateVadEndpointState,
        windowDraftWords,
        sanitizeTargetLanguageText,
        formatGeminiTranslationToHtml,
        handleStreamingServerEvent,
        commitFinalizedCaption,
        insertOrderedCaptionBySeq,
        polishExistingCaption,
        updateLiveDraftCaption
    };

    if (typeof globalThis !== 'undefined') {
        globalThis.targumaService = TargumaServiceAPI;
    }

    if (typeof window !== 'undefined') {
        window.toggleTargumaMode = toggleTargumaMode;
        window.initTargumaFeature = initTargumaButton;
        window.targumaService = TargumaServiceAPI;
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = TargumaServiceAPI;
    }

    if (typeof document !== 'undefined') {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(initTargumaButton, 0);
        } else {
            document.addEventListener('DOMContentLoaded', initTargumaButton);
        }
    }
})();
