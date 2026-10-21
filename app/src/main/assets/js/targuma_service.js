// ============================================================================
// TARGUMA (ተርጉማ) — Live EOTC Sermon & Announcement Captioning Engine
// ============================================================================
// Features:
// 1. Ultra-Low Latency Gemini Flash Interpreter (Gemini 3 Flash default, Gemini 2.5 Flash)
// 2. Bottom-Anchored Chronological Captions with Smooth Continuous FLIP Glide &
//    Incoming Ellipsis Anchor (• • •) where the next line will appear
// 3. Consistent Red/Gold/Italic EOTC Liturgical & Sacred Term Formatting across all models
// 4. Strict Target-Language Output (never leaks source script in target-only mode)
// 5. Desktop Left-Quarter Icon + Right 3/4 Caption Stage (or 100% width when icon hidden)
// 6. Smart Cloud Cost Protection (Local VAD silence gate + 3-min silence auto-pause +
//    background tab guard + 45-min max session guard)
// ============================================================================

(function () {
    'use strict';

    const TARGUMA_GEMINI_ENDPOINT = 'https://us-central1-mount-of-mercy.cloudfunctions.net/targumaGemini';

    // Cloud cost protection thresholds
    const SILENCE_AUTO_PAUSE_MS = 3 * 60 * 1000;      // Auto-pause after 3 minutes of silence
    const MAX_SESSION_DURATION_MS = 45 * 60 * 1000;   // Auto-pause after 45 minutes continuous session
    const HIDDEN_TAB_AUTO_PAUSE_MS = 60 * 1000;       // Auto-pause 60s after phone locked / tab hidden in local mode
    const SPEECH_RMS_THRESHOLD = 0.015;               // Local VAD threshold (0 cloud calls when below this)
    const AUDIO_SLICE_DURATION_MS = 2600;             // 2.6s slice for low latency + full phrase context
    const CLIENT_FETCH_TIMEOUT_MS = 6500;             // Client fetch timeout so queue never stalls

    // Clean model options (no emojis, no parenthetical descriptors; Gemini 3 Flash default)
    const GEMINI_MODELS = [
        {
            id: 'gemini-3-flash-preview',
            label: 'Gemini 3 Flash',
            shortLabel: 'Gemini 3 Flash'
        },
        {
            id: 'gemini-2.5-flash',
            label: 'Gemini 2.5 Flash',
            shortLabel: 'Gemini 2.5 Flash'
        }
    ];

    // Available Orthodox Icons for Sanctuary Stage (plus option to hide icon)
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
        'am': { label: 'አማርኛ (Amharic)', short: 'አማርኛ', bcp47: 'am-ET', isEthiopic: true },
        'ti': { label: 'ትግርኛ (Tigrinya)', short: 'ትግርኛ', bcp47: 'ti-ET', isEthiopic: true },
        'en': { label: 'English', short: 'English', bcp47: 'en-US', isEthiopic: false },
        'es': { label: 'Español (Spanish)', short: 'Español', bcp47: 'es-PR', isEthiopic: false }
    };

    // Deterministic EOTC Liturgical Glossary so Gemini 2.5 Flash & Gemini 3 Flash
    // both consistently apply gold italic + bracketed meaning formatting
    const EOTC_LITURGICAL_ENRICHER = [
        {
            sourceRegex: /ቅዳሴ/,
            plainTargetRegex: /\b(Divine Liturgy|the Liturgy)\b/i,
            phonetic: 'Qidase',
            meaning: 'Divine Liturgy'
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
        geminiModel: 'gemini-3-flash-preview', // Default: Gemini 3 Flash
        displayMode: 'target',                 // 'target' or 'bilingual'
        maxLines: 3,                           // 2, 3, or 4 visible chronological lines
        fontSizePx: 32,                        // Customizable caption font size (px)
        selectedIconId: 'mary_with_son',       // Icon ID or 'none' to hide icon
        roomMode: 'local',                     // 'local', 'broadcast', 'viewer'
        roomCode: 'oakland',                   // Parish broadcast room code
        captions: [],                          // Chronological caption list (oldest at top -> newest at bottom)
        recentContext: [],                     // Last 2 transcribed phrases for continuity
        controlsMinimized: false,
        lastLatencyMs: 0
    };

    // Audio, Sequence & Timer Handles
    let wakeLockSentinel = null;
    let firestoreUnsubscribe = null;
    let mediaStream = null;
    let mediaRecorder = null;
    let audioContext = null;
    let analyserNode = null;
    let audioChunkTimer = null;
    let levelMeterRaf = null;
    let currentChunkMaxRms = 0;
    let activeAudioRequests = 0;
    let chunkSequenceCounter = 0;
    let lastRenderedSequence = 0;

    // Cloud Cost / Idle Protection Timers
    let lastSpeechDetectedAt = 0;
    let sessionStartedAt = 0;
    let idleWatchdogInterval = null;
    let hiddenTabTimer = null;

    let translationCache = new Map();

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
                    state.geminiModel = 'gemini-3-flash-preview';
                }
                if (parsed.displayMode === 'target' || parsed.displayMode === 'bilingual') state.displayMode = parsed.displayMode;
                if ([2, 3, 4].includes(Number(parsed.maxLines))) state.maxLines = Number(parsed.maxLines);
                if (parsed.fontSizePx >= 18 && parsed.fontSizePx <= 72) state.fontSizePx = Number(parsed.fontSizePx);
                if (parsed.selectedIconId && TARGUMA_ICONS.some(i => i.id === parsed.selectedIconId)) {
                    state.selectedIconId = parsed.selectedIconId;
                }
                if (parsed.roomCode) state.roomCode = String(parsed.roomCode).trim().toLowerCase();
            } else {
                state.fontSizePx = window.innerWidth < 768 ? 22 : 34;
            }
        } catch (e) {
            console.warn('Could not load Targuma settings:', e);
        }
        trimCaptionsToMaxLines();
    }

    function saveTargumaSettings() {
        try {
            localStorage.setItem('mountOfMercy_targumaSettings', JSON.stringify({
                sourceLang: state.sourceLang,
                targetLang: state.targetLang,
                geminiModel: state.geminiModel,
                displayMode: state.displayMode,
                maxLines: state.maxLines,
                fontSizePx: state.fontSizePx,
                selectedIconId: state.selectedIconId,
                roomCode: state.roomCode
            }));
        } catch (e) {
            console.warn('Could not save Targuma settings:', e);
        }
    }

    function trimCaptionsToMaxLines() {
        const n = state.maxLines || 3;
        if (!Array.isArray(state.captions)) {
            state.captions = [];
            return;
        }
        if (state.captions.length > n) {
            state.captions = state.captions.slice(-n);
        }
    }

    function clearAllCaptions() {
        state.captions = [];
        state.recentContext = [];
    }

    // --- Wake Lock Management (Web + Android Native Bridge) ---
    async function requestWakeLock() {
        try {
            if (window.AndroidTargumaBridge && typeof window.AndroidTargumaBridge.setKeepScreenOn === 'function') {
                window.AndroidTargumaBridge.setKeepScreenOn(true);
            }
            if ('wakeLock' in navigator) {
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

        // If target language is English or Spanish (non-Ethiopic), strip any leaked Ethiopic characters
        // so source Amharic/Tigrinya script NEVER appears inside an English-only or Spanish-only caption box
        if (!LANGUAGE_META[targetLang]?.isEthiopic) {
            cleaned = cleaned.replace(/[\u1200-\u137F]+/g, '').replace(/\s{2,}/g, ' ').trim();
        }
        return cleaned;
    }

    function formatGeminiTranslationToHtml(rawTranslatedText, targetLang, sourceText = '') {
        let sanitized = sanitizeTargetLanguageText(rawTranslatedText, targetLang);
        if (!sanitized) return '';

        // Deterministic EOTC Liturgical Enricher:
        // If the model (e.g. Gemini 2.5 Flash) translated a Ge'ez/EOTC term into plain English without
        // *Phonetic* [Meaning] markers, enrich it so both models produce identical gold/italic formatting
        if (targetLang === 'en' && !sanitized.includes('[')) {
            for (const rule of EOTC_LITURGICAL_ENRICHER) {
                if ((sourceText && rule.sourceRegex.test(sourceText)) || rule.plainTargetRegex.test(sanitized)) {
                    if (rule.plainTargetRegex.test(sanitized)) {
                        sanitized = sanitized.replace(rule.plainTargetRegex, `*${rule.phonetic}* [${rule.meaning}]`);
                    }
                }
            }
        }

        let html = escapeHtml(sanitized);

        // Convert *Phonetic* [Meaning] into gold Style B span
        html = html.replace(/\*([^*]+)\*\s*\[([^\]]+)\]/g, (_, phonetic, meaning) => {
            return `<span class="targuma-geez-term"><i>${phonetic.trim()}</i> <span class="targuma-geez-gloss">[${meaning.trim()}]</span></span>`;
        });

        // Convert remaining *italic* terms into gold italic span
        html = html.replace(/\*([^*]+)\*/g, '<span class="targuma-geez-term"><i>$1</i></span>');

        // Apply full EOTC Sacred Rubrication (Red)
        html = highlightSacredTermsInCaption(html);
        return html;
    }

    function highlightSacredTermsInCaption(htmlText) {
        if (typeof displayOptions !== 'undefined' && displayOptions.showRubrication === false) {
            return htmlText;
        }
        return htmlText.replace(
            /\b(Lord and Savior Jesus Christ|Our Lord Jesus Christ|Jesus Christ|Iyesus Kristos|Jesucristo|Christ Jesus|Jesus|Jesús|Christ|Cristo|Medhane Alem|Savior of the World|Our Savior|Redeemer|Holy Trinity|Santísima Trinidad|Father,?\s+Son,?\s+and\s+Holy Spirit|Holy Spirit|Espíritu Santo|Our Lady Saint Mary|Our Lady|Nuestra Señora|Saint Mary|St\.\s*Mary|Santa María|Blessed Virgin Mary|Virgin Mary|Virgen María|Mother of God|Madre de Dios|Theotokos|Weladite Amlak|Kidane Mihret|Covenant of Mercy|Almighty God|Heavenly Father|Lord God|Egziabher|God|Dios|Lord|Señor|እግዚአብሔር|ኢየሱስ ክርስቶስ|መድኃኔዓለም|መንፈስ ቅዱስ|ቅድስት ሥላሴ|ቅድስት ድንግል ማርያም|ወላዲተ አምላክ|ኪዳነ ምሕረት|እመቤታችን)\b/g,
            '<span class="rubric-red">$1</span>'
        );
    }

    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    // --- Append Caption at the Bottom with Smooth Continuous Upward Glide ---
    function appendCaptionAtBottom(sourceText, translatedText) {
        const cleanTarget = sanitizeTargetLanguageText(translatedText, state.targetLang);
        if (!cleanTarget) return;

        const cleanSource = String(sourceText || '').trim();

        // Deduplicate if identical to the latest line at the bottom
        if (state.captions.length > 0) {
            const latest = state.captions[state.captions.length - 1];
            if (latest.rawTarget === cleanTarget || (cleanSource && latest.sourceText === cleanSource)) {
                return;
            }
        }

        // Split overly long paragraphs in Bilingual mode so each line stays compact and never requires scrolling
        const targetWords = cleanTarget.split(/\s+/);
        if (targetWords.length > 26 && state.displayMode === 'bilingual') {
            const mid = Math.ceil(targetWords.length / 2);
            const firstHalf = targetWords.slice(0, mid).join(' ');
            const secondHalf = targetWords.slice(mid).join(' ');
            insertChronologicalItem(cleanSource, firstHalf);
            insertChronologicalItem('', secondHalf);
            return;
        }

        insertChronologicalItem(cleanSource, cleanTarget);
    }

    function insertChronologicalItem(cleanSource, cleanTarget) {
        const translatedHtml = formatGeminiTranslationToHtml(cleanTarget, state.targetLang, cleanSource);
        if (!translatedHtml) return;

        const newItem = {
            id: 'cap_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
            sourceText: cleanSource,
            rawTarget: cleanTarget,
            translatedHtml,
            sourceLang: state.sourceLang,
            targetLang: state.targetLang,
            timestamp: Date.now()
        };

        state.captions.push(newItem);
        trimCaptionsToMaxLines();

        if (cleanSource) {
            state.recentContext.push(cleanSource);
            if (state.recentContext.length > 2) {
                state.recentContext = state.recentContext.slice(-2);
            }
        }

        renderCaptionsStage(true);

        if (state.roomMode === 'broadcast') {
            publishToFirestoreRoom();
        }
    }

    // --- Multimodal Audio Chunk -> Vertex AI Gemini Flash (`targumaGemini`) ---
    async function transcribeAndTranslateAudioChunk(audioBlob, mimeType) {
        if (!audioBlob || audioBlob.size < 1200 || !state.isListening) return;
        if (activeAudioRequests >= 2) return; // Prevent backpressure queue buildup

        const mySeq = ++chunkSequenceCounter;
        activeAudioRequests++;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CLIENT_FETCH_TIMEOUT_MS);

        try {
            const base64Audio = await blobToBase64(audioBlob);
            if (!base64Audio || !state.isListening) return;

            const activeModel = state.geminiModel || 'gemini-3-flash-preview';

            // Using text/plain avoids CORS preflight OPTIONS round-trips on mobile & desktop
            const resp = await fetch(TARGUMA_GEMINI_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
                body: JSON.stringify({
                    model: activeModel,
                    sourceLang: state.sourceLang,
                    targetLang: state.targetLang,
                    audioBase64: base64Audio,
                    mimeType: mimeType || audioBlob.type || 'audio/webm',
                    recentContext: state.recentContext
                }),
                signal: controller.signal
            });

            if (!resp.ok) return;
            const data = await resp.json();
            if (!data || data.isSilence || !data.translatedText) return;

            // Drop out-of-order late packets so older sentences never appear after newer ones
            if (mySeq < lastRenderedSequence) return;
            lastRenderedSequence = mySeq;

            if (data.latencyMs) {
                state.lastLatencyMs = data.latencyMs;
            }

            // Record valid human speech timestamp for idle watchdog
            lastSpeechDetectedAt = Date.now();
            appendCaptionAtBottom(data.sourceText, data.translatedText);
        } catch (err) {
            if (err && err.name !== 'AbortError') {
                console.debug('Audio chunk translation notice:', err.message || err);
            }
        } finally {
            clearTimeout(timeoutId);
            activeAudioRequests = Math.max(0, activeAudioRequests - 1);
        }
    }

    // --- Text Retranslation when User Swaps Target Language ---
    async function translateTargumaPhrase(rawText, sourceLang, targetLang) {
        const cleanText = String(rawText || '').trim();
        if (!cleanText) return '';

        const activeModel = state.geminiModel || 'gemini-3-flash-preview';
        const cacheKey = `${activeModel}:${sourceLang}:${targetLang}:${cleanText}`;
        if (translationCache.has(cacheKey)) {
            return translationCache.get(cacheKey);
        }

        try {
            const resp = await fetch(TARGUMA_GEMINI_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
                body: JSON.stringify({
                    model: activeModel,
                    sourceLang,
                    targetLang,
                    text: cleanText,
                    recentContext: []
                })
            });

            if (resp.ok) {
                const data = await resp.json();
                if (data && data.translatedText) {
                    const finalHtml = formatGeminiTranslationToHtml(data.translatedText, targetLang, cleanText);
                    if (translationCache.size > 200) {
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

    function blobToBase64(blob) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const res = String(reader.result || '');
                const commaIdx = res.indexOf(',');
                resolve(commaIdx >= 0 ? res.slice(commaIdx + 1) : res);
            };
            reader.onerror = () => resolve('');
            reader.readAsDataURL(blob);
        });
    }

    function getSupportedAudioMimeType() {
        if (typeof MediaRecorder === 'undefined') return '';
        const candidates = [
            'audio/webm;codecs=opus',
            'audio/webm',
            'audio/mp4',
            'audio/ogg;codecs=opus'
        ];
        for (const mime of candidates) {
            if (typeof MediaRecorder.isTypeSupported === 'function' && MediaRecorder.isTypeSupported(mime)) {
                return mime;
            }
        }
        return '';
    }

    // --- Unified Low-Latency Multimodal Audio Streamer (Works on Pixel 9 Pro XL & Desktop!) ---
    async function startMultimodalAudioStream() {
        stopMultimodalAudioStream();
        if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
            return false;
        }

        try {
            mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 16000,
                    echoCancellation: false,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                audioContext = new AudioCtx();
                const sourceNode = audioContext.createMediaStreamSource(mediaStream);
                analyserNode = audioContext.createAnalyser();
                analyserNode.fftSize = 512;
                sourceNode.connect(analyserNode);

                const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
                const updateMeter = () => {
                    if (!state.isListening || !analyserNode) return;
                    analyserNode.getByteTimeDomainData(dataArray);
                    let sumSquares = 0;
                    for (let i = 0; i < dataArray.length; i++) {
                        const norm = (dataArray[i] - 128) / 128;
                        sumSquares += norm * norm;
                    }
                    const rms = Math.sqrt(sumSquares / dataArray.length);
                    if (rms > currentChunkMaxRms) {
                        currentChunkMaxRms = rms;
                    }
                    if (rms > SPEECH_RMS_THRESHOLD) {
                        lastSpeechDetectedAt = Date.now();
                    }
                    updateMicLevelIndicator(rms);
                    levelMeterRaf = requestAnimationFrame(updateMeter);
                };
                levelMeterRaf = requestAnimationFrame(updateMeter);
            }

            if (typeof MediaRecorder !== 'undefined') {
                const mimeType = getSupportedAudioMimeType();

                const recordSingleSlice = () => {
                    if (!state.isListening || !mediaStream || !mediaStream.active) return;
                    currentChunkMaxRms = 0;
                    let chunks = [];
                    let rec = null;
                    try {
                        const opts = mimeType
                            ? { mimeType, audioBitsPerSecond: 24000 }
                            : { audioBitsPerSecond: 24000 };
                        rec = new MediaRecorder(mediaStream, opts);
                    } catch (e) {
                        rec = new MediaRecorder(mediaStream);
                    }
                    mediaRecorder = rec;

                    rec.ondataavailable = (ev) => {
                        if (ev.data && ev.data.size > 0) {
                            chunks.push(ev.data);
                        }
                    };

                    rec.onstop = () => {
                        const peakRms = currentChunkMaxRms;
                        // Local VAD Silence Gate: only send to Gemini if human speech energy was present
                        if (chunks.length > 0 && peakRms >= SPEECH_RMS_THRESHOLD && state.isListening) {
                            const blob = new Blob(chunks, { type: rec.mimeType || mimeType || 'audio/webm' });
                            transcribeAndTranslateAudioChunk(blob, rec.mimeType || mimeType || 'audio/webm');
                        }
                        if (state.isListening && mediaStream && mediaStream.active) {
                            recordSingleSlice();
                        }
                    };

                    try {
                        rec.start();
                        audioChunkTimer = setTimeout(() => {
                            if (rec && rec.state === 'recording') {
                                try { rec.stop(); } catch (e) {}
                            }
                        }, AUDIO_SLICE_DURATION_MS);
                    } catch (e) {
                        console.warn('MediaRecorder start error:', e);
                    }
                };

                recordSingleSlice();
            }
            return true;
        } catch (err) {
            console.warn('Microphone getUserMedia error:', err);
            return false;
        }
    }

    function stopMultimodalAudioStream() {
        clearTimeout(audioChunkTimer);
        audioChunkTimer = null;
        if (levelMeterRaf) {
            cancelAnimationFrame(levelMeterRaf);
            levelMeterRaf = null;
        }
        if (mediaRecorder) {
            try {
                mediaRecorder.onstop = null;
                if (mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                }
            } catch (e) {}
            mediaRecorder = null;
        }
        if (mediaStream) {
            try {
                mediaStream.getTracks().forEach(track => track.stop());
            } catch (e) {}
            mediaStream = null;
        }
        if (audioContext) {
            try {
                audioContext.close();
            } catch (e) {}
            audioContext = null;
            analyserNode = null;
        }
        updateMicLevelIndicator(0);
    }

    function updateMicLevelIndicator(rms) {
        const dot = document.getElementById('targuma-live-dot');
        if (!dot || !state.isListening) return;
        const boost = Math.min(1.65, 1 + rms * 4.2);
        dot.style.transform = `scale(${boost.toFixed(2)})`;
    }

    // --- Smart Idle & Forgotten-Listener Guardrail ---
    function startIdleProtectionWatchdog() {
        stopIdleProtectionWatchdog();
        lastSpeechDetectedAt = Date.now();
        sessionStartedAt = Date.now();

        idleWatchdogInterval = setInterval(() => {
            if (!state.isListening) return;
            const now = Date.now();

            // 1. Auto-pause after 3 minutes of silence (5 minutes if Media Team broadcast host)
            const silenceLimit = state.roomMode === 'broadcast' ? 5 * 60 * 1000 : SILENCE_AUTO_PAUSE_MS;
            if (now - lastSpeechDetectedAt >= silenceLimit) {
                const mins = Math.round(silenceLimit / 60000);
                stopLocalListening(false);
                updateStatusBanner(
                    `Listening paused automatically after ${mins} minutes of silence to save cloud resources. Tap "Start Listening" to resume.`,
                    'idle'
                );
                return;
            }

            // 2. Auto-pause after 45 minutes of continuous session
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

    // Pause personal microphone if user locks phone or hides browser tab for >60 seconds
    document.addEventListener('visibilitychange', () => {
        if (!state.isListening || state.roomMode === 'broadcast') return;
        if (document.visibilityState === 'hidden') {
            clearTimeout(hiddenTabTimer);
            hiddenTabTimer = setTimeout(() => {
                if (document.visibilityState === 'hidden' && state.isListening && state.roomMode !== 'broadcast') {
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

    // --- Android Native Runtime Permission Callback ---
    window.onAndroidAudioPermissionResult = function (granted) {
        if (granted && state.isActive) {
            startLocalListening();
        } else if (!granted) {
            updateStatusBanner('Microphone permission was denied. Please enable Microphone access in Settings.', 'error');
        }
    };

    // --- Start / Stop Listening ---
    async function startLocalListening() {
        if (window.AndroidTargumaBridge && typeof window.AndroidTargumaBridge.hasAudioPermission === 'function') {
            if (!window.AndroidTargumaBridge.hasAudioPermission()) {
                updateStatusBanner('Requesting microphone permission...', 'listening');
                window.AndroidTargumaBridge.requestAudioPermission();
                return;
            }
        }

        stopLocalListening(false);

        state.isListening = true;
        requestWakeLock();
        updateTargumaControlsUI();
        renderCaptionsStage(false);
        updateStatusBanner(
            `Listening (${LANGUAGE_META[state.sourceLang].short} → ${LANGUAGE_META[state.targetLang].short})`,
            'listening'
        );

        const audioStreamStarted = await startMultimodalAudioStream();
        if (!audioStreamStarted) {
            state.isListening = false;
            updateTargumaControlsUI();
            renderCaptionsStage(false);
            updateStatusBanner('Could not access microphone. Please grant microphone permission and try again.', 'error');
            return;
        }

        startIdleProtectionWatchdog();
    }

    function stopLocalListening(updateBanner = true) {
        state.isListening = false;
        stopIdleProtectionWatchdog();
        stopMultimodalAudioStream();
        releaseWakeLock();
        updateTargumaControlsUI();
        renderCaptionsStage(false);
        if (updateBanner) {
            updateStatusBanner(DEFAULT_IDLE_STATUS, 'idle');
        }
    }

    // --- Live Parish Broadcast Room Mode (Firestore Real-time Sync) ---
    function getFirestoreRoomRef(roomCode) {
        if (typeof firebase === 'undefined' || !firebase.firestore) return null;
        const cleanCode = String(roomCode || 'oakland').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'oakland';
        return firebase.firestore().collection('targuma_sessions').doc(cleanCode);
    }

    async function publishToFirestoreRoom() {
        if (state.roomMode !== 'broadcast') return;
        const docRef = getFirestoreRoomRef(state.roomCode);
        if (!docRef) return;

        const serializedCaptions = state.captions.map(c => ({
            id: c.id,
            sourceText: c.sourceText,
            rawTarget: c.rawTarget,
            translatedHtml: c.translatedHtml,
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
            captions: serializedCaptions,
            updatedAt: Date.now()
        };

        try {
            await docRef.set(payload, { merge: true });
        } catch (err) {
            console.debug('Firestore broadcast note:', err.message);
        }
    }

    function connectAsParishViewer(roomCode) {
        disconnectFirestoreRoom();
        stopLocalListening(false);

        state.roomCode = String(roomCode || state.roomCode || 'oakland').trim().toLowerCase();
        state.roomMode = 'viewer';
        requestWakeLock();
        saveTargumaSettings();
        updateTargumaControlsUI();

        const docRef = getFirestoreRoomRef(state.roomCode);
        if (!docRef) {
            updateStatusBanner('Firestore is unavailable offline.', 'error');
            return;
        }

        updateStatusBanner(`Connected to Parish Room "${state.roomCode.toUpperCase()}" — Waiting for broadcast...`, 'viewer');

        firestoreUnsubscribe = docRef.onSnapshot((docSnap) => {
            if (!docSnap.exists) {
                updateStatusBanner(`Joined Parish Room "${state.roomCode.toUpperCase()}" — No active broadcast yet.`, 'viewer');
                return;
            }
            const data = docSnap.data();
            if (Array.isArray(data.captions)) {
                state.captions = data.captions.slice(-(state.maxLines || 3));
            } else if (Array.isArray(data.slots)) {
                state.captions = data.slots.filter(Boolean).slice(-(state.maxLines || 3));
            }
            if (data.selectedIconId && TARGUMA_ICONS.some(i => i.id === data.selectedIconId)) {
                state.selectedIconId = data.selectedIconId;
                updateStageIcon();
            }
            updateStatusBanner(`LIVE Parish Broadcast • Room: ${state.roomCode.toUpperCase()}`, 'listening');
            renderCaptionsStage(true);
        }, (err) => {
            console.warn('Firestore viewer subscription error:', err);
            updateStatusBanner(`Could not subscribe to room "${state.roomCode}": ${err.message}`, 'warn');
        });
    }

    function disconnectFirestoreRoom() {
        if (firestoreUnsubscribe) {
            firestoreUnsubscribe();
            firestoreUnsubscribe = null;
        }
    }

    // --- UI Construction & Rendering ---
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

        container.innerHTML = `
            <!-- Top Sanctuary Control Bar -->
            <div class="targuma-toolbar" id="targuma-toolbar">
                <div class="targuma-toolbar-row targuma-toolbar-primary">
                    <!-- Brand + Info Button -->
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

                    <!-- Language Direction Selector + ⇄ Swap -->
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

                    <!-- Gemini Model Selector (Clean options without emojis or parentheticals) -->
                    <div class="targuma-model-switcher">
                        <label class="targuma-sr-only" for="targuma-model-select">Gemini AI Model</label>
                        <select id="targuma-model-select" class="targuma-select targuma-model-select" title="Select Gemini Model">
                            ${GEMINI_MODELS.map(m => `<option value="${m.id}">${m.label}</option>`).join('')}
                        </select>
                    </div>

                    <!-- Primary Action: Start/Pause Listening + Settings + Hide Controls + Exit -->
                    <div class="targuma-action-group">
                        <button type="button" id="targuma-mic-btn" class="targuma-mic-btn">
                            <svg class="targuma-mic-svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
                            </svg>
                            <span id="targuma-mic-btn-label">Start Listening</span>
                        </button>

                        <button type="button" id="targuma-settings-toggle-btn" class="targuma-icon-btn" title="Customize Display, Icon, & Parish Broadcast" aria-label="Targuma Display Settings">
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

                <!-- Collapsible Customization & Parish Broadcast Drawer -->
                <div class="targuma-toolbar-drawer hidden" id="targuma-toolbar-drawer">
                    <div class="targuma-drawer-grid">
                        <!-- Display Mode: Target Language Only vs Bilingual Stacked -->
                        <div class="targuma-setting-item">
                            <label for="targuma-display-mode-select">Caption Style</label>
                            <select id="targuma-display-mode-select" class="targuma-select">
                                <option value="target">Target Language Only</option>
                                <option value="bilingual">Bilingual Stacked</option>
                            </select>
                        </div>

                        <!-- Visible Lines (2-4 Lines) -->
                        <div class="targuma-setting-item">
                            <label for="targuma-lines-select">Visible Lines</label>
                            <select id="targuma-lines-select" class="targuma-select">
                                <option value="2">2 Lines</option>
                                <option value="3">3 Lines</option>
                                <option value="4">4 Lines</option>
                            </select>
                        </div>

                        <!-- Text Size Slider -->
                        <div class="targuma-setting-item">
                            <label for="targuma-font-slider">Caption Size: <span id="targuma-font-size-val">${state.fontSizePx}px</span></label>
                            <div class="targuma-slider-wrap">
                                <button type="button" id="targuma-font-dec" class="targuma-mini-btn" aria-label="Decrease Caption Font Size">A-</button>
                                <input type="range" id="targuma-font-slider" min="18" max="64" value="${state.fontSizePx}" />
                                <button type="button" id="targuma-font-inc" class="targuma-mini-btn" aria-label="Increase Caption Font Size">A+</button>
                            </div>
                        </div>

                        <!-- Orthodox Icon Selector (includes Hide Icon) -->
                        <div class="targuma-setting-item">
                            <label for="targuma-icon-select">Sanctuary Icon</label>
                            <select id="targuma-icon-select" class="targuma-select">
                                ${TARGUMA_ICONS.map(icon => `<option value="${icon.id}">${icon.titleEnglish}</option>`).join('')}
                            </select>
                        </div>

                        <!-- Parish Broadcast / Viewer Room Mode -->
                        <div class="targuma-setting-item targuma-room-item">
                            <label for="targuma-room-mode-select">Mode &amp; Parish TV Sync</label>
                            <div class="targuma-room-controls">
                                <select id="targuma-room-mode-select" class="targuma-select">
                                    <option value="local">Personal Microphone</option>
                                    <option value="broadcast">Media Team Host (Broadcast)</option>
                                    <option value="viewer">Sanctuary TV / Viewer</option>
                                </select>
                                <input type="text" id="targuma-room-code-input" class="targuma-room-input" placeholder="Parish code (e.g. oakland)" value="${escapeHtml(state.roomCode)}" title="Parish Room Code" />
                                <button type="button" id="targuma-clear-captions-btn" class="targuma-mini-btn" title="Clear Screen Captions">Clear</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Floating Button to Restore Toolbar when Controls are Hidden -->
            <button type="button" id="targuma-restore-toolbar-btn" class="targuma-restore-toolbar-btn hidden" title="Show Controls">
                Show Controls
            </button>

            <!-- Sanctuary Stage:
                 Desktop: Left Quarter = Large Orthodox Icon | Right 3/4 = Caption Box (or 100% if icon hidden)
                 Mobile: Top Orthodox Icon | Bottom Caption Box -->
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
                            <!-- Chronological captions + bottom ellipsis anchor rendered here -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Targuma "i" Info Modal -->
            <div id="targuma-info-modal" class="modal">
                <div class="modal-content targuma-info-modal-content">
                    <span class="close-button" id="close-targuma-info-modal">&times;</span>
                    <h3 class="ethiopic-label">ተርጉማ • About Targuma</h3>
                    <p>
                        <strong>Targuma (ተርጉማ)</strong> bridges the language barrier in our parishes by providing live captions and translations during Sunday sermons (<em>Sibket</em>), lectures, and church announcements so every member of the congregation can understand and participate.
                    </p>
                    <p>
                        <strong>How to Use:</strong> Choose the spoken language and your desired caption language, then tap <strong>Start Listening</strong>. You can adjust the text size, switch between <em>Target Language Only</em> and <em>Bilingual Stacked</em> view, or hide the icon and toolbar for Sanctuary TV displays.
                    </p>
                    <p>
                        <strong>How It Works:</strong> Powered by Gemini AI, Targuma listens for spoken phrases, translates them in real time, and phonetically spells out woven Ge'ez liturgical terms with brief meanings in brackets. To protect cloud resources, listening automatically pauses after 3 minutes of silence.
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
        const roomModeSelect = container.querySelector('#targuma-room-mode-select');
        const roomCodeInput = container.querySelector('#targuma-room-code-input');
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
                updateStatusBanner(
                    `Listening (${LANGUAGE_META[state.sourceLang].short} → ${LANGUAGE_META[state.targetLang].short})`,
                    'listening'
                );
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
                updateStatusBanner(
                    `Listening (${LANGUAGE_META[state.sourceLang].short} → ${LANGUAGE_META[state.targetLang].short})`,
                    'listening'
                );
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
                updateStatusBanner(
                    `Listening (${LANGUAGE_META[state.sourceLang].short} → ${LANGUAGE_META[state.targetLang].short})`,
                    'listening'
                );
            }
            retranslateExistingCaptions();
        });

        if (modelSelect) {
            modelSelect.addEventListener('change', () => {
                state.geminiModel = modelSelect.value;
                saveTargumaSettings();
            });
        }

        micBtn.addEventListener('click', () => {
            if (state.roomMode === 'viewer') {
                state.roomMode = 'local';
                disconnectFirestoreRoom();
                roomModeSelect.value = 'local';
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

        // Clicking the Orthodox Icon cycles between visible Orthodox icons
        stageIcon.addEventListener('click', () => {
            const visibleIcons = TARGUMA_ICONS.filter(i => i.id !== 'none');
            const idx = visibleIcons.findIndex(i => i.id === state.selectedIconId);
            const nextIcon = visibleIcons[(idx + 1) % visibleIcons.length];
            state.selectedIconId = nextIcon.id;
            iconSelect.value = state.selectedIconId;
            updateStageIcon();
            saveTargumaSettings();
            if (state.roomMode === 'broadcast') publishToFirestoreRoom();
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
            state.fontSizePx = Math.max(18, Math.min(64, Number(newSize) || 32));
            fontSlider.value = state.fontSizePx;
            const valSpan = container.querySelector('#targuma-font-size-val');
            if (valSpan) valSpan.textContent = `${state.fontSizePx}px`;
            const viewport = container.querySelector('#targuma-captions-viewport');
            if (viewport) viewport.style.setProperty('--targuma-font-size', `${state.fontSizePx}px`);
            saveTargumaSettings();
        }

        fontSlider.addEventListener('input', () => applyFontSize(fontSlider.value));
        fontDec.addEventListener('click', () => applyFontSize(state.fontSizePx - 2));
        fontInc.addEventListener('click', () => applyFontSize(state.fontSizePx + 2));

        iconSelect.addEventListener('change', () => {
            state.selectedIconId = iconSelect.value;
            updateStageIcon();
            saveTargumaSettings();
            if (state.roomMode === 'broadcast') publishToFirestoreRoom();
        });

        roomModeSelect.addEventListener('change', () => {
            const newMode = roomModeSelect.value;
            state.roomCode = (roomCodeInput.value || 'oakland').trim().toLowerCase();
            saveTargumaSettings();

            if (newMode === 'viewer') {
                connectAsParishViewer(state.roomCode);
            } else if (newMode === 'broadcast') {
                disconnectFirestoreRoom();
                state.roomMode = 'broadcast';
                updateStatusBanner(`Broadcast Host Ready for Room "${state.roomCode.toUpperCase()}" — Tap "Start Listening" to broadcast`, 'listening');
                publishToFirestoreRoom();
            } else {
                disconnectFirestoreRoom();
                state.roomMode = 'local';
                updateStatusBanner(DEFAULT_IDLE_STATUS, 'idle');
            }
            updateTargumaControlsUI();
        });

        roomCodeInput.addEventListener('change', () => {
            state.roomCode = (roomCodeInput.value || 'oakland').trim().toLowerCase();
            saveTargumaSettings();
            if (state.roomMode === 'viewer') {
                connectAsParishViewer(state.roomCode);
            } else if (state.roomMode === 'broadcast') {
                publishToFirestoreRoom();
            }
        });

        clearBtn.addEventListener('click', () => {
            clearAllCaptions();
            renderCaptionsStage(false);
            if (state.roomMode === 'broadcast') publishToFirestoreRoom();
        });
    }

    async function retranslateExistingCaptions() {
        for (let i = 0; i < state.captions.length; i++) {
            const item = state.captions[i];
            if (item && item.sourceText) {
                const newHtml = await translateTargumaPhrase(item.sourceText, state.sourceLang, state.targetLang);
                if (newHtml) {
                    item.targetLang = state.targetLang;
                    item.translatedHtml = newHtml;
                }
            }
        }
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

        if (stageEl) {
            stageEl.classList.toggle('icon-hidden', isHidden);
        }
        if (frameEl) {
            frameEl.classList.toggle('hidden', isHidden);
        }
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
        const roomModeSelect = container.querySelector('#targuma-room-mode-select');
        const roomCodeInput = container.querySelector('#targuma-room-code-input');

        if (sourceSelect) sourceSelect.value = state.sourceLang;
        if (targetSelect) targetSelect.value = state.targetLang;
        if (modelSelect) modelSelect.value = state.geminiModel;
        if (displayModeSelect) displayModeSelect.value = state.displayMode;
        if (linesSelect) linesSelect.value = String(state.maxLines);
        if (fontSlider) fontSlider.value = String(state.fontSizePx);
        if (fontVal) fontVal.textContent = `${state.fontSizePx}px`;
        if (iconSelect) iconSelect.value = state.selectedIconId;
        if (roomModeSelect) roomModeSelect.value = state.roomMode;
        if (roomCodeInput) roomCodeInput.value = state.roomCode;
        updateStageIcon();
    }

    function updateTargumaControlsUI() {
        const micBtn = document.getElementById('targuma-mic-btn');
        const micLabel = document.getElementById('targuma-mic-btn-label');
        const liveDot = document.getElementById('targuma-live-dot');
        const headerBtn = document.getElementById('targuma-mode-toggle-header');

        if (micBtn && micLabel) {
            micBtn.classList.toggle('listening', state.isListening);
            micLabel.textContent = state.isListening ? 'Pause Listening' : 'Start Listening';
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

    // --- Render Bottom-Anchored Chronological Captions with Smooth FLIP Glide & Ellipsis Anchor ---
    function renderCaptionsStage(animateGlide = false) {
        const listEl = document.getElementById('targuma-captions-list');
        const viewportEl = document.getElementById('targuma-captions-viewport');
        if (!listEl) return;

        trimCaptionsToMaxLines();
        if (viewportEl) {
            viewportEl.classList.toggle('bilingual-mode', state.displayMode === 'bilingual');
            viewportEl.dataset.lines = String(state.maxLines);
        }

        const isStreamingActive = state.isListening || state.roomMode === 'viewer';

        if (state.captions.length === 0) {
            listEl.innerHTML = `
                <div class="targuma-empty-placeholder">
                    <p class="targuma-placeholder-primary">
                        “Listen, my daughter, and see, and incline your ear” <span class="ethiopic-label">(ስምዒ ወለትየ ወርእዪ ወአጽምዒ እዝነኪ — መዝ ፵፬፡፲)</span>
                    </p>
                </div>
                ${isStreamingActive ? `
                <div class="targuma-upcoming-ellipsis" aria-hidden="true" title="Next caption will appear here">
                    <span class="targuma-ellipsis-dot"></span>
                    <span class="targuma-ellipsis-dot"></span>
                    <span class="targuma-ellipsis-dot"></span>
                </div>` : ''}
            `;
            return;
        }

        // Record previous vertical positions by caption ID for smooth FLIP upward glide
        const prevRects = new Map();
        if (animateGlide) {
            listEl.querySelectorAll('.targuma-caption-line[data-cap-id]').forEach(el => {
                prevRects.set(el.dataset.capId, el.getBoundingClientRect().top);
            });
        }

        const visible = state.captions.slice(-state.maxLines);
        let html = '';
        visible.forEach((cap, idx) => {
            const isNewest = idx === visible.length - 1;
            const lineClass = isNewest ? 'targuma-line-latest' : 'targuma-line-previous';
            html += `<div class="targuma-caption-line ${lineClass}" data-cap-id="${escapeHtml(cap.id)}">`;
            if (state.displayMode === 'bilingual' && cap.sourceText) {
                html += `<div class="targuma-line-source">${escapeHtml(cap.sourceText)}</div>`;
            }
            html += `<div class="targuma-line-target">${cap.translatedHtml}</div>`;
            html += `</div>`;
        });

        // Subtle ellipsis row at the bottom showing where the next line will appear
        if (isStreamingActive) {
            html += `
                <div class="targuma-upcoming-ellipsis" aria-hidden="true" title="Next caption will appear here">
                    <span class="targuma-ellipsis-dot"></span>
                    <span class="targuma-ellipsis-dot"></span>
                    <span class="targuma-ellipsis-dot"></span>
                </div>
            `;
        }

        listEl.innerHTML = html;

        // Apply smooth FLIP upward glide so existing lines glide gently up and the new bottom line fades in softly
        if (animateGlide) {
            listEl.querySelectorAll('.targuma-caption-line[data-cap-id]').forEach(el => {
                const capId = el.dataset.capId;
                const newTop = el.getBoundingClientRect().top;
                if (prevRects.has(capId)) {
                    const deltaY = prevRects.get(capId) - newTop;
                    if (Math.abs(deltaY) > 1) {
                        el.style.transition = 'none';
                        el.style.transform = `translateY(${deltaY}px)`;
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                el.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease';
                                el.style.transform = 'translateY(0)';
                            });
                        });
                    }
                } else {
                    // Newest line entering at the bottom where the ellipsis was
                    el.style.transition = 'none';
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(12px)';
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            el.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease';
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

    function initTargumaButton() {
        loadTargumaSettings();
        const headerBtn = document.getElementById('targuma-mode-toggle-header');
        if (headerBtn && !headerBtn.dataset.targumaBound) {
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

    window.toggleTargumaMode = toggleTargumaMode;
    window.initTargumaFeature = initTargumaButton;

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(initTargumaButton, 0);
    } else {
        document.addEventListener('DOMContentLoaded', initTargumaButton);
    }
})();
