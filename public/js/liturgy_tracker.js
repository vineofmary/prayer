// ============================================================================
// MOUNT OF MERCY — Kidase Audio Auto-Navigation, Sanctuary Interlude &
//                  Dual Red-Dot Chanting/Reading Tracker (v1)
// ============================================================================
// Features:
// 1. Co-Pilot Liturgical Stanza Graph Navigation:
//    - Silent +1 sequential slide progression & automatic `Inaudible Prayer` skipping
//    - IDF-weighted disambiguation so repetitive refrains ("ሰላም ለኵልክሙ",
//      "እግዚኦ መሐረነ ክርስቶስ", "ተንሥኡ ለጸሎት", "አሜን") advance locally (+1)
//      without EVER causing false cross-section jumps
//    - 3-second Co-Pilot auto-confirm toast pill (`prompt_3s`) for non-linear
//      stanza jumps, Day-of-Kidase switches (2-73/2-74/2-75), Creed branches
//      (4-33 <-> The300-1), and unselected Anaphora switches (Apostles <-> Mary)
//    - Anaphora of the Apostles (`ቅዳሴ ሐዋርያት`) congregation-chant backbone fallback
//      when one of the 12 unbundled Anaphoras is celebrated
// 2. Sanctuary Icon Interlude (`img/With-her-beloved-Son.png`):
//    - Smoothly cross-fades Slides Mode into the icon of Mary with Her Beloved Son
//      during sustained off-book vocalization (unbundled priest stanzas, Mezmur,
//      Qine, Sinksar, homily, announcements) while never triggering on silence,
//      then jumps behind the curtain and fades cleanly onto the next matched slide
// 3. Low-Latency Dual Red-Dot + Subtle Rubric Glow (`dot_plus_glow`):
//    - GPU-composited (`translate3d`) crimson dot beneath the active word/fidel
//      AND its `.geez-phonetic-append` congregation transliteration twin in lockstep
//    - Dynamically switches active column (Ge'ez <-> Amharic <-> English) with
//      hysteresis and aligns against shadow Bible editions (`am54` + `am-2000`,
//      `kjv` + `nkjv`, `gez-1980` + `gez-2014`) so alternate printed Bibles or
//      skipped phrases never stall tracking
// ============================================================================

(function () {
    'use strict';

    // --- Built-in Ethiopic -> Phonetic Fallback Map (covers Ge'ez, Amharic & Tigrinya) ---
    const ETHIOPIC_SYLLABLE_CONSONANTS = [
        ['ሀ', 'h'], ['ለ', 'l'], ['ሐ', 'h'], ['መ', 'm'], ['ሠ', 's'], ['ረ', 'r'], ['ሰ', 's'], ['ሸ', 'sh'],
        ['ቀ', 'k'], ['ቐ', 'k'], ['በ', 'b'], ['ቨ', 'v'], ['ተ', 't'], ['ቸ', 'ch'], ['ኀ', 'h'], ['ነ', 'n'],
        ['ኘ', 'n'], ['አ', ''], ['ከ', 'k'], ['ኸ', 'h'], ['ወ', 'w'], ['ዐ', ''], ['ዘ', 'z'], ['ዠ', 'zh'],
        ['የ', 'y'], ['ደ', 'd'], ['ጀ', 'j'], ['ገ', 'g'], ['ጠ', 't'], ['ጨ', 'ch'], ['ጰ', 'p'], ['ጸ', 'ts'],
        ['ፀ', 'ts'], ['ፈ', 'f'], ['ፐ', 'p']
    ];
    const ETHIOPIC_VOWEL_ORDERS = ['e', 'u', 'i', 'a', 'e', '', 'o', 'wa'];
    const BUILTIN_ETHIOPIC_MAP = (function () {
        const map = Object.create(null);
        for (const [baseChar, cons] of ETHIOPIC_SYLLABLE_CONSONANTS) {
            const baseCode = baseChar.charCodeAt(0);
            for (let order = 0; order < 8; order++) {
                const ch = String.fromCharCode(baseCode + order);
                const vowel = (cons === '' && (order === 0 || order === 3)) ? 'a' : ETHIOPIC_VOWEL_ORDERS[order];
                map[ch] = cons + vowel;
            }
        }
        // Labiovelars (ቈ, ኈ, ኰ, ጐ)
        const labiovelars = [
            [0x1248, 'kw'], [0x1288, 'hw'], [0x12B0, 'kw'], [0x1310, 'gw']
        ];
        const lvVowels = ['e', '', 'i', 'a', 'e', ''];
        for (const [code, prefix] of labiovelars) {
            for (let offset = 0; offset < lvVowels.length; offset++) {
                if (lvVowels[offset] !== '' || offset === 5) {
                    map[String.fromCharCode(code + offset)] = prefix + lvVowels[offset];
                }
            }
        }
        return map;
    })();

    // Common repetitive liturgical refrains (permitted for +1 local advance, NEVER for cross-zone jumps)
    const REPETITIVE_REFRAIN_PATTERNS = [
        /^(?:ሰላም\s*ለኵልክሙ|ሰላም\s*ለሁላችሁ|peace\s*be\s*(?:unto|with)\s*you(?:\s*all)?)$/i,
        /^(?:ምስለ\s*መንፈስከ|ከመንፈስህ\s*ጋራ|(?:and\s*)?with\s*your\s*spirit)$/i,
        /^(?:እግዚኦ\s*መሐረነ\s*ክርስቶስ|አቤቱ\s*ክርስቶስ\s*ማረን|lord\s*have\s*mercy(?:\s*upon\s*us)?(?:\s*o\s*christ)?)$/i,
        /^(?:ተንሥኡ\s*ለጸሎት|ለጸሎት\s*ተነሡ|stand\s*up\s*for\s*prayer)$/i,
        /^(?:ጸልዩ|प्रार्थना|pray)$/i,
        /^(?:አሜን|amen|ሃሌ\s*ሉያ|hallelujah|alleluia)+$/i,
        /^(?:ኪርያላይሶን|kyrie\s*eleison)+$/i
    ];

    const SPEAKER_PREFIX_STRIP_REGEX = /^(?:፨\s*)?(?:Priest|Asst\.\s*Priest|Deacon|Subdeacon|People|ALL|All|Leader|Reader|ካህን|ካህን\s*ንፍቅ|ዲያቆን|ንፍቀ\s*ዲያቆን|ሕዝብ|ኵሎሙ|ሁሉም|መሪሕ|መሪ|አንባቢ|Kahn|Kahin|Dīyaḳon|Diyakon|Ḥizb|Ḥzb|Hizb|Kwllomu|Sacerdote|Diácono|Pueblo)(?:\s*\([^)]*\))?\s*[:፡።፤፣-]\s*/gi;

    // Timing & Confidence Constants (calibrated on Debre Abay Zema & Oakland Saint Michael livestream)
    const TARGET_SAMPLE_RATE = 16000;
    const SLIDING_WINDOW_SEC = 3.6;
    const ACTIVE_TRACK_WINDOW_SEC = 2.0;        // Faster 2.0s active Viterbi window (~660ms WebGPU on Pixel)
    const HOP_INTERVAL_MS = 450;
    const VOICE_RMS_MIN = 0.008;
    const MIN_PHONE_DENSITY_VOICED = 0.025;     // Supports slow melismatic Ge'ez Zema vowel sustains
    const OFFBOOK_ENTER_VOICED_MS = 5500;       // 5.5s sustained unmatched voice -> smooth Mary icon fade-in
    const OFFBOOK_REACQUIRE_CONFIRM_WINDOWS = 2;
    const COPILOT_COUNTDOWN_MS = 3000;          // 3s auto-accept toast for cross-section / Anaphora switches
    const COLUMN_SWITCH_HYSTERESIS = 0.16;      // Prevents column flicker on shared words like "Amen"
    const COLUMN_SWITCH_HOLD_MS = 380;
    const END_PAUSE_SPOKEN_MS = 500;            // Smooth auto-advance after finishing slide + brief pause (English/Amharic)
    const END_PAUSE_ZEMA_MS = 1650;             // Longer guard for slow melismatic Ge'ez Zema breath pauses
    const ACOUSTIC_CLASS_MAP = { A: 1, I: 2, U: 3, B: 4, M: 5, T: 6, S: 7, K: 8, R: 9 };
    const NUM_POSTERIOR_CLASSES = 10;

    const LITURGY_SCOPES = [
        { id: 'anchor', label: 'Follow from current slide', sub: 'Locks onto this prayer card & advances forward' },
        { id: 'unknown', label: "I don't know where we're at", sub: 'Finds your place across the active service' },
        { id: 'matins_kidan', label: 'Matins & Covenant Prayer', sub: 'ጸሎተ ነግህ / ጸሎተ ኪዳን' },
        { id: 'liturgy_word', label: 'Order of the Liturgy & Readings', sub: 'ሥርዓተ ቅዳሴ — ምንባባት' },
        { id: 'anaphora', label: 'Eucharistic Service (Anaphora)', sub: 'አኰቴተ ቍርባን (with Apostles fallback)' }
    ];

    // --- Runtime State ---
    const state = {
        isActive: false,
        autonomyMode: 'copilot',          // 'copilot' | 'anchored' | 'autonomous'
        trackerStyle: 'dot_plus_glow',    // 'dot_plus_glow' | 'dot_only' | 'off'
        anaphoraSwitchMode: 'prompt_3s',  // 'prompt_3s' | 'strict_selected'
        activeScope: 'anchor',
        modelStatus: 'idle',              // 'idle' | 'loading' | 'downloading' | 'ready' | 'error'
        modelProgress: 0,
        isSanctuaryInterludeVisible: false,
        usingApostlesBackboneFallback: false,
        activeSpokenColumn: null,         // 'geez_script' | 'amharic_script' | 'english' | 'tigrinya_script'
        lockedSpokenColumn: null,         // Multi-hop locked column preventing horizontal cross-column drift
        _colLockCandidate: null,
        _colLockStreak: 0,
        _colChallenger: null,
        _colChallengerStreak: 0,
        activeWordIndex: -1,
        activeWordFraction: 0,
        unmatchedVoicedMs: 0,
        endOfSlideSilentMs: 0,
        _endOfSlideMeta: null,
        reacquireStreak: 0,
        reacquireCandidateIdx: -1,
        localSkipStreak: 0,
        localSkipCandidateIdx: -1,
        lastSlideAdvanceAt: 0,
        _lastObservedSlideIdx: -1,
        lastManualOverrideAt: 0,
        lastColumnSwitchAt: 0,
        pendingCopilotAction: null,
        suppressedTargets: new Map()      // key -> expiry timestamp
    };

    let slideIndexData = null;
    let shadowBranchData = null;
    let acousticWorker = null;
    let mediaStream = null;
    let audioContext = null;
    let processorNode = null;
    let workletBlobUrl = null;
    let silentGainNode = null;
    let pcmRingBuffer = new Float32Array(Math.floor(TARGET_SAMPLE_RATE * SLIDING_WINDOW_SEC));
    let pcmRingFilled = 0;
    let totalSamplesPushed = 0;
    let lastDispatchedSampleCount = 0;
    let workerInferBusy = false;
    let workerInferStartedAt = 0;
    let hopTimer = null;
    let inferSeq = 0;
    let rollingPhonemeStream = '';        // Non-echoing stitched stream of distinct acoustic classes
    let instrumentedCard = null;
    let copilotTimerId = null;
    let copilotIntervalId = null;

    // =========================================================================
    // 1. PURE PHONETIC & ARTICULATORY-ACOUSTIC EQUIVALENCE ENGINE
    // =========================================================================

    function transliterateEthiopicText(text) {
        if (!text) return '';
        const str = String(text);
        if (typeof window !== 'undefined' && window.__mountOfMercy && typeof window.__mountOfMercy.transliterateGeezToPhonetic === 'function') {
            return window.__mountOfMercy.transliterateGeezToPhonetic(str);
        }
        let out = '';
        for (const ch of str) {
            if (BUILTIN_ETHIOPIC_MAP[ch] !== undefined) {
                out += BUILTIN_ETHIOPIC_MAP[ch];
            } else {
                out += ch;
            }
        }
        return out;
    }

    const INLINE_SPEAKER_TOKEN_REGEX = /^(?:Priest|Deacon|Subdeacon|People|ALL|Leader|Reader|ካህን|ዲያቆን|ሕዝብ|ኵሎሙ|ሁሉም|መሪሕ|መሪ|አንባቢ|Kahn|Kahin|Dīyaḳon|Diyakon|Ḥizb|Ḥzb|Hizb|Kwllomu)[:፡።፤፣]?$/i;

    function stripHtmlAndSpeakerPrefixes(rawText, markUnspokenRubrics = false) {
        if (!rawText) return '';
        let s = String(rawText)
            .replace(/<sup[^>]*>[\s\S]*?<\/sup>/gi, ' ')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/?(?:p|div|li|tr|h[1-6])\b[^>]*>/gi, '\n')
            .replace(/<\/?(?:span|i|em|b|strong|u|ruby|rb|rt|rtc|rbc)\b[^>]*>/gi, '')
            .replace(/<[^>]*>/g, ' ')
            .replace(/\{\{[^}]+\}\}/g, ' ')
            .replace(/\[\d+\]/g, ' ');

        const lines = s.split(/\n+/).map(line => line.trim().replace(SPEAKER_PREFIX_STRIP_REGEX, ''));
        if (markUnspokenRubrics) {
            for (let li = 0; li < lines.length; li++) {
                // Mark unspoken `፨ ... ፨` liturgical section headers (e.g. `፨ THE ORDER OF THE LITURGY ፨`)
                lines[li] = lines[li].replace(/፨([^፨\n]+)፨/g, (_, inner) =>
                    ' ' + inner.trim().split(/\s+/).filter(Boolean).map(tok => '\uE000' + tok).join(' ') + ' '
                );
                // Mark unspoken parenthetical editorial glosses / stage rubrics (e.g. `(full of awe)`, `(Aaron)`, `(People repeat)`)
                lines[li] = lines[li].replace(/\(([^()\n]{1,80})\)/g, (_, inner) =>
                    ' ' + inner.trim().split(/\s+/).filter(Boolean).map(tok => '\uE000' + tok).join(' ') + ' '
                );
            }
        }
        return lines.join(' ');
    }

    function stripPunctuationPreserveHyphenatedWords(str) {
        return str
            .replace(/[፠፨፡።፣፤፥፦፧""''«»()[\]{}.,;!?—–]+/g, ' ')
            .replace(/(?:^|\s)-+|-+(?=\s|$)/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function stripLiturgicalMarkup(rawText) {
        if (!rawText) return '';
        return stripPunctuationPreserveHyphenatedWords(stripHtmlAndSpeakerPrefixes(rawText, false));
    }

    // Calibrated English Liturgical Pronunciation Lexicon (aligned 1:1 with eSpeak IPA -> 9-class Zema CTC Head:
    // IPA /a,ɑ,æ,ʌ,aɪ,aʊ/->A, /e,i,ɪ,ɛ,ə,ɜ,ɚ,eɪ,j/->I, /o,u,ʊ,ɔ,oʊ,w/->U, /b,p,f,v/->B,
    // /m,n,ŋ/->M, /t,d,θ,ð/->T, /s,z,ʃ,ʒ,tʃ,dʒ/->S, /k,ɡ,h/->K, /l,r,ɹ/->R)
    const ENGLISH_LITURGICAL_PRONUNCIATION_MAP = {
        one: 'wan', once: 'wans', two: 'tu', to: 'tu', too: 'tu', into: 'intu', unto: 'antu',
        three: 'tri', through: 'tru', throughout: 'truat', though: 'do', thought: 'tot',
        the: 'di', this: 'dis', that: 'dat', these: 'dis', those: 'dos',
        they: 'de', their: 'der', theirs: 'ders', them: 'dem', then: 'den', there: 'der', therefore: 'derfor',
        thou: 'da', thee: 'di', thy: 'da', thine: 'dan', with: 'wid', without: 'widat', within: 'widin',
        father: 'fader', fathers: 'faders', mother: 'mader', brother: 'brader', brothers: 'braders', brethren: 'bredren',
        son: 'san', sons: 'sans', sun: 'san', love: 'lav', beloved: 'bilaved',
        come: 'kam', comes: 'kams', coming: 'kaming', some: 'sam', done: 'dan', none: 'nan', nothing: 'nating',
        blood: 'blad', flood: 'flad', above: 'ebav', among: 'emang', amongst: 'emangst',
        of: 'av', from: 'fram', upon: 'epan', god: 'gad', gods: 'gads', lord: 'lord', lords: 'lords',
        not: 'nat', what: 'wat', was: 'was', all: 'ol', call: 'kol', called: 'kold', fall: 'fol', water: 'water',
        holy: 'holi', holies: 'holis', holiness: 'holines', who: 'hu', whom: 'hum', whose: 'hus', whole: 'hol',
        spirit: 'sbirit', spirits: 'sbirits', spiritual: 'sbiritual',
        true: 'tru', truly: 'truli', truth: 'trut',
        christ: 'krast', christian: 'kristian', christians: 'kristians', eucharist: 'yukarist',
        jesus: 'sisus', mary: 'meri', virgin: 'virsin', church: 'sirs',
        praise: 'pres', praised: 'presd', praises: 'presis', glory: 'glori', glorify: 'glorifa', glorified: 'glorifad',
        mercy: 'mirsi', merciful: 'mirsiful', compassion: 'kambasen',
        peace: 'pis', grace: 'gres', faith: 'fet', faithful: 'fetful',
        pray: 'pre', prayer: 'prer', prayers: 'prers', stand: 'stand', arise: 'eras',
        people: 'pipel', peoples: 'pipels', nation: 'nesen', nations: 'nesens', gentiles: 'sentals', israelite: 'isrelat',
        forgive: 'forgiv', forgiven: 'forgiven', forgiveness: 'forgivnes',
        give: 'giv', given: 'given', giver: 'giver', have: 'hav', has: 'has', had: 'had', hath: 'hat', doth: 'dat',
        live: 'liv', living: 'living', life: 'laf',
        light: 'lat', might: 'mat', mighty: 'mati', almighty: 'olmati',
        right: 'rat', righteous: 'rases', righteousness: 'rasesnes', high: 'ha', highest: 'haest', night: 'nat', sight: 'sat',
        my: 'ma', by: 'ba', i: 'a', eye: 'a', eyes: 'as',
        you: 'yu', your: 'yur', yours: 'yurs', yourself: 'yurself',
        we: 'wi', he: 'hi', she: 'si', me: 'mi', be: 'bi', been: 'bin', being: 'biing',
        his: 'his', him: 'him', her: 'hir', our: 'ar', ours: 'ars', hour: 'ar', hours: 'ars',
        honour: 'aner', honor: 'aner',aire: 'er', heir: 'er',
        are: 'ar', were: 'wir', where: 'wer', here: 'hir',
        now: 'na', how: 'ha', bow: 'ba', power: 'pauer', powers: 'pauers',
        world: 'wirld', worlds: 'wirlds', word: 'wird', words: 'wirds', work: 'wirk', works: 'wirks',
        worthy: 'wirdi', worship: 'wirsib', earth: 'irt', heart: 'hart', hearts: 'harts', heard: 'hird',
        heaven: 'heven', heavens: 'hevens', heavenly: 'hevenli',
        bread: 'bred', dead: 'ded', death: 'det', breath: 'bret', head: 'hed', shed: 'sed', said: 'sed', says: 'ses',
        take: 'tek', make: 'mek', made: 'med', sake: 'sek', name: 'nem', names: 'nems', same: 'sem', came: 'kem',
        save: 'sev', saved: 'sevd', savior: 'sevyer', saviour: 'sevyer',
        age: 'es', ages: 'esis', forever: 'foriver', ever: 'iver', never: 'niver', over: 'over',
        body: 'badi', covenant: 'kavenant', sacrifice: 'sakrifas', incense: 'insens',
        psalm: 'sam', psalms: 'sams', lamb: 'lam', womb: 'wum', tomb: 'tum',
        kneel: 'nil', know: 'no', known: 'non', knowledge: 'noles', wrath: 'rat', write: 'rat', written: 'riten',
        apostle: 'apasel', apostles: 'apasels', epistle: 'ibisel', deacon: 'diken', priest: 'prist', priests: 'prists',
        bishop: 'bisep', bishops: 'biseps', patriarch: 'patriark', archbishop: 'arsbisep',
        certainly: 'sirtenli', magnify: 'magnifa', ministry: 'ministri', reconciling: 'rikansaling', acceptance: 'akseptans'
    };

    const COMMON_ENGLISH_FUNCTION_WORDS = new Set([
        'the', 'one', 'holy', 'father', 'son', 'spirit', 'truly', 'praise', 'lord', 'god',
        'you', 'your', 'with', 'unto', 'peace', 'all', 'people', 'nations', 'for', 'from',
        'and', 'who', 'that', 'this', 'which', 'have', 'has', 'his', 'him', 'our', 'are',
        'was', 'were', 'not', 'mercy', 'upon', 'stand', 'prayer', 'glory', 'now', 'ever',
        'world', 'christ', 'mary', 'virgin', 'we', 'they', 'their', 'them', 'shall', 'will'
    ]);

    function isLikelyEnglishSentence(cleanLower) {
        if (!cleanLower || !cleanLower.includes(' ')) return false;
        const toks = cleanLower.split(/\s+/);
        let hits = 0;
        for (let i = 0; i < toks.length; i++) {
            if (COMMON_ENGLISH_FUNCTION_WORDS.has(toks[i])) {
                hits++;
                if (hits >= 2 || (toks.length <= 4 && hits >= 1)) return true;
            }
        }
        return false;
    }

    function normalizeEnglishWordToPhonetic(word) {
        if (!word) return '';
        if (ENGLISH_LITURGICAL_PRONUNCIATION_MAP[word]) {
            return ENGLISH_LITURGICAL_PRONUNCIATION_MAP[word];
        }
        let w = word;
        // High-precision English orthographic -> eSpeak IPA rules
        w = w
            .replace(/^kn/, 'n')
            .replace(/^wr/, 'r')
            .replace(/^ps/, 's')
            .replace(/^wh/, 'w')
            .replace(/chr/g, 'kr')
            .replace(/ph/g, 'f')
            .replace(/dg(?=[eiy])/g, 's')
            .replace(/tch/g, 's')
            .replace(/tion$/g, 'sen')
            .replace(/tions$/g, 'sens')
            .replace(/sion$/g, 'sen')
            .replace(/[ct]ious$/g, 'ses')
            .replace(/ture$/g, 'ser')
            .replace(/igh/g, 'a')
            .replace(/eigh/g, 'e')
            .replace(/ough/g, 'o')
            .replace(/augh/g, 'o')
            .replace(/gh/g, '')
            .replace(/mb$/g, 'm')
            .replace(/gn$/g, 'n')
            .replace(/ck/g, 'k')
            .replace(/qu/g, 'kw')
            .replace(/sh|ch|zh/g, 's')
            .replace(/th/g, 't')
            .replace(/c(?=[eiy])/g, 's')
            .replace(/g(?=[eiy])/g, 's');

        // Silent-e & long-vowel patterns on 4+ char English words
        if (w.length >= 4) {
            w = w
                .replace(/([bcdfgjklmnpqrstvwxz])le$/, '$1el')
                .replace(/a([bcdfgjklmnpqrstvwxz])e$/, 'e$1')
                .replace(/i([bcdfgjklmnpqrstvwxz])e$/, 'a$1')
                .replace(/o([bcdfgjklmnpqrstvwxz])e$/, 'o$1')
                .replace(/u([bcdfgjklmnpqrstvwxz])e$/, 'u$1')
                .replace(/([^aeiou])e$/, '$1');
        }

        w = w
            .replace(/ee|ea/g, 'i')
            .replace(/oo/g, 'u')
            .replace(/ou|ow/g, 'a')
            .replace(/ai|ay/g, 'e')
            .replace(/oa/g, 'o');

        return w;
    }

    function normalizeLatinPhonetic(str) {
        if (!str) return '';
        return transliterateEthiopicText(str)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/['’`ʿʾ]/g, '')
            .replace(/ḥ/g, 'h')
            .replace(/ḳ/g, 'k')
            .replace(/ṭ/g, 't')
            .replace(/ṣ/g, 'ts')
            .replace(/ṱ/g, 't')
            .replace(/p̣/g, 'p')
            .replace(/ñ/g, 'n')
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    /**
     * Maps normalized Latin/Phonetic characters into the 9-class articulatory-acoustic
     * equivalence alphabet (`A, I, U, B, M, T, S, K, R`) calibrated against Wav2Vec2 CTC
     * outputs on Ge'ez Zema, Amharic, Tigrinya, and English sanctuary audio.
     */
    function toCanonicalAcousticSkeleton(input, options = null) {
        if (!input) return { full: '', consonants: '', rawPhonetic: '' };
        const rawStr = String(input).trim();

        // Fast-path: pure uppercase 9-class CTC skeleton stream from worker (e.g. "AKATUBKITUS...")
        if (/^[AIUBMTSKR_]+$/.test(rawStr)) {
            let full = '';
            let consonants = '';
            let prevFull = '';
            let prevCons = '';
            for (let i = 0; i < rawStr.length; i++) {
                const cls = rawStr[i];
                if (cls === '_') continue;
                const isVowel = cls === 'A' || cls === 'I' || cls === 'U';
                if (cls !== prevFull) { full += cls; prevFull = cls; }
                if (!isVowel && cls !== prevCons) { consonants += cls; prevCons = cls; }
            }
            return { full, consonants, rawPhonetic: rawStr.toLowerCase() };
        }

        const hasEthiopic = /[\u1200-\u137F]/.test(rawStr);
        const clean = normalizeLatinPhonetic(rawStr);
        if (!clean) return { full: '', consonants: '', rawPhonetic: '' };

        const useEnglishG2P = !hasEthiopic && Boolean(
            (options && options.isEnglish) || isLikelyEnglishSentence(clean)
        );

        let pre = '';
        if (useEnglishG2P) {
            const engWords = clean.split(/\s+/).filter(Boolean).map(normalizeEnglishWordToPhonetic);
            // Note: in `zema_acoustic_model_data.js`, IPA `/h/` (token 39) routes to class `K` (0.961),
            // and remaining English `h` after digraph resolution (`th/sh/ch/ph/wh/gh`) is true `/h/`!
            pre = engWords.join('')
                .replace(/c/g, 'k')
                .replace(/kw/g, 'ku')
                .replace(/h/g, 'k');
        } else {
            // Collapse multi-char Ethiopic/Latin digraphs
            pre = clean
                .replace(/sh|ch|ts|zh|th/g, 's')
                .replace(/ck/g, 'k')
                .replace(/c(?=[eiy])/g, 's')
                .replace(/c/g, 'k')
                .replace(/ph/g, 'b')
                .replace(/kw|qu/g, 'ku')
                .replace(/gw/g, 'ku')
                .replace(/hw/g, 'u')
                .replace(/\s+/g, '');
        }

        let full = '';
        let consonants = '';
        let prevFull = '';
        let prevCons = '';

        for (let i = 0; i < pre.length; i++) {
            const c = pre[i];
            let cls = '';
            let isVowel = false;

            if (c === 'a') { cls = 'A'; isVowel = true; }
            else if (c === 'e' || c === 'i' || c === 'y') { cls = 'I'; isVowel = true; }
            else if (c === 'o' || c === 'u' || c === 'w') { cls = 'U'; isVowel = true; }
            else if (c === 'b' || c === 'p' || c === 'v' || c === 'f') { cls = 'B'; }
            else if (c === 'm' || c === 'n') { cls = 'M'; }
            else if (c === 't' || c === 'd') { cls = 'T'; }
            else if (c === 's' || c === 'z' || c === 'c' || c === 'j') { cls = 'S'; }
            else if (c === 'k' || c === 'g' || c === 'q' || c === 'x') { cls = 'K'; }
            else if (c === 'l' || c === 'r') { cls = 'R'; }

            if (!cls) continue;
            if (cls !== prevFull) {
                full += cls;
                prevFull = cls;
            }
            if (!isVowel && cls !== prevCons) {
                consonants += cls;
                prevCons = cls;
            }
        }

        return { full, consonants, rawPhonetic: clean };
    }

    function extractShingles(str, k) {
        const out = [];
        if (!str || str.length < k) {
            if (str && str.length >= 2) out.push(str);
            return out;
        }
        for (let i = 0; i <= str.length - k; i++) {
            out.push(str.slice(i, i + k));
        }
        return out;
    }

    /**
     * Builds fine-grained 25Hz HMM/Viterbi phoneme states for a column's words,
     * preserving optional pharyngeal K onsets on Ge'ez `ሐ/ኀ/ሀ` (and English `/h/` + coda `/r/`)
     * and applying St. Yared Zaima (`᎖` Chiret melisma vs `᎗` Hidet sweep) duration priors.
     */
    function buildZemaPhonemeStates(words, cardId = '') {
        const states = [];
        const zaimaLookup = (typeof globalThis !== 'undefined' && globalThis.ZAIMA_NOTATION_DATA && globalThis.ZAIMA_NOTATION_DATA.byCardId)
            ? globalThis.ZAIMA_NOTATION_DATA.byCardId[cardId]
            : null;

        for (let w = 0; w < words.length; w++) {
            const wd = words[w];
            if (wd.isUnspokenRubric) continue;
            const surf = wd.surface || '';
            const surfLower = surf.toLowerCase();
            let expanded = '';
            const optFlags = [];

            const hasEthiopic = /[\u1200-\u137F]/.test(surf);
            if (hasEthiopic) {
                for (const ch of surf) {
                    if ('ሐሑሒሓሔሕሖኀኁኂኃኄኅኆሀሁሂሃሄህሆ'.includes(ch)) {
                        expanded += 'K';
                        optFlags.push(true);
                    }
                    const sk = toCanonicalAcousticSkeleton(ch).full;
                    for (let k = 0; k < sk.length; k++) {
                        expanded += sk[k];
                        optFlags.push(false);
                    }
                }
            } else if (wd.isEnglish && wd.engPhonetic) {
                const ep = wd.engPhonetic;
                for (let k = 0; k < ep.length; k++) {
                    const ch = ep[k];
                    const prevIsVowel = k > 0 && 'aeiouy'.includes(ep[k - 1]);
                    const nextIsVowel = k + 1 < ep.length && 'aeiouy'.includes(ep[k + 1]);
                    if (ch === 'h') {
                        expanded += 'K';
                        optFlags.push(true); // English /h/ optional in rapid connected speech
                        continue;
                    }
                    if (ch === 'r' && prevIsVowel && !nextIsVowel) {
                        expanded += 'R';
                        optFlags.push(true); // English coda /r/ (`ɚ` vs `əɹ`) optional across speakers
                        continue;
                    }
                    if (ch === 'd' && k === ep.length - 1 && surfLower === 'and') {
                        expanded += 'T';
                        optFlags.push(true); // Word-final /d/ in "and" frequently elided in English chanting ("an' of")
                        continue;
                    }
                    let cls = '';
                    if (ch === 'a') cls = 'A';
                    else if (ch === 'e' || ch === 'i' || ch === 'y') cls = 'I';
                    else if (ch === 'o' || ch === 'u' || ch === 'w') cls = 'U';
                    else if (ch === 'b' || ch === 'p' || ch === 'v' || ch === 'f') cls = 'B';
                    else if (ch === 'm' || ch === 'n') cls = 'M';
                    else if (ch === 't' || ch === 'd') cls = 'T';
                    else if (ch === 's' || ch === 'z' || ch === 'c' || ch === 'j') cls = 'S';
                    else if (ch === 'k' || ch === 'g' || ch === 'q' || ch === 'x') cls = 'K';
                    else if (ch === 'l' || ch === 'r') cls = 'R';
                    if (cls) {
                        expanded += cls;
                        optFlags.push(false);
                    }
                }
            } else {
                for (let k = 0; k < wd.skeleton.length; k++) {
                    expanded += wd.skeleton[k];
                    optFlags.push(false);
                }
            }

            // Check Zaima notation for Chiret (`\u1396`) melisma stretch or Hidet (`\u1397`) rapid sweep.
            // English speech uses 1-frame (40ms) min consonant dwell so rapid function words never stall,
            // while Ge'ez Zema keeps 2-frame (80ms) consonant dwell unless marked with Hidet (`᎗`)
            // so slow melismatic vowels never slip across consonants on transient frames.
            let maxMelismaFrames = wd.isEnglish ? 22 : 260;
            let minConsDwell = wd.isEnglish ? 1 : 2;
            if (!wd.isEnglish && zaimaLookup && Array.isArray(zaimaLookup.words)) {
                const zWord = zaimaLookup.words.find(zw => zw.base === surf);
                if (zWord && zWord.rawNotation) {
                    if (zWord.rawNotation.includes('\u1396')) maxMelismaFrames = 400; // Chiret (`᎖`) extended melisma!
                    if (zWord.rawNotation.includes('\u1397')) minConsDwell = 1;       // Hidet (`᎗`) rapid syllabic sweep!
                }
            }

            const dedup = [];
            for (let i = 0; i < expanded.length; i++) {
                const cls = ACOUSTIC_CLASS_MAP[expanded[i]] || 0;
                if (!cls) continue;
                if (dedup.length > 0 && dedup[dedup.length - 1].cls === cls && !optFlags[i]) continue;
                dedup.push({ cls, isOptional: optFlags[i] });
            }

            const wordIdx = typeof wd.index === 'number' ? wd.index : w;
            for (let idx = 0; idx < dedup.length; idx++) {
                states.push({
                    cls: dedup[idx].cls,
                    isOptional: dedup[idx].isOptional,
                    wordIndex: wordIdx,
                    surface: surf,
                    intraFraction: Math.round(((idx + 0.5) / Math.max(1, dedup.length)) * 100) / 100,
                    maxMelismaFrames,
                    minConsDwell
                });
            }
        }
        return states;
    }

    /**
     * Tokenizes a surface text column into word records with individual acoustic profiles,
     * Zema Viterbi phoneme states, and cumulative character offsets for red-dot tracking.
     * Preserves 1:1 DOM `wordIndex` parity with `wrapTextNodesWithWordSpans` while excluding
     * unspoken `፨ ... ፨` banners and `(...)` editorial glosses from acoustic matching.
     */
    function buildColumnWordSequence(rawText, cardId = '', langKey = '') {
        const marked = stripPunctuationPreserveHyphenatedWords(stripHtmlAndSpeakerPrefixes(rawText, true));
        if (!marked) {
            return { words: [], zemaStates: [], fullSkeleton: '', consonantSkeleton: '', shingles: new Set(), consShingles: new Set() };
        }
        const plainClean = marked.replace(/\uE000/g, '');
        const isEnglishCol = langKey === 'english' || (!/[\u1200-\u137F]/.test(plainClean) && !langKey && isLikelyEnglishSentence(plainClean.toLowerCase()));
        const rawTokens = marked.split(/\s+/).filter(Boolean);
        const prelimWords = [];

        for (let i = 0; i < rawTokens.length; i++) {
            const rawTok = rawTokens[i];
            const isMarkedRubric = rawTok.includes('\uE000');
            const surface = rawTok.replace(/\uE000/g, '').trim();
            if (!surface) continue;
            // Match `wrapTextNodesWithWordSpans`: inline standalone speaker labels are not wrapped as chanted words
            if (INLINE_SPEAKER_TOKEN_REGEX.test(surface)) continue;

            const isWordEnglish = isEnglishCol && !/[\u1200-\u137F]/.test(surface);
            const sk = toCanonicalAcousticSkeleton(surface, isWordEnglish ? { isEnglish: true } : null);
            if (!sk.full && !sk.consonants) continue;

            const ethiopicChars = (surface.match(/[\u1200-\u137F]/g) || []).length;
            const latinSyllables = (sk.rawPhonetic.match(/[aeiou]+/g) || []).length;
            const syllableCount = Math.max(1, ethiopicChars || latinSyllables || 1);

            prelimWords.push({
                surface,
                isUnspokenRubric: isMarkedRubric,
                phonetic: sk.rawPhonetic,
                engPhonetic: isWordEnglish ? normalizeEnglishWordToPhonetic(sk.rawPhonetic.replace(/\s+/g, '')) : '',
                isEnglish: isWordEnglish,
                skeleton: sk.full,
                consonants: sk.consonants,
                syllableCount
            });
        }

        // If every word in the stanza was inside `፨ ... ፨` or `(...)`, treat them as spoken so the card remains matchable
        const hasSpokenWords = prelimWords.some(w => !w.isUnspokenRubric);
        const words = [];
        let concatFull = '';
        let concatCons = '';

        for (let i = 0; i < prelimWords.length; i++) {
            const pw = prelimWords[i];
            const isUnspokenRubric = hasSpokenWords ? pw.isUnspokenRubric : false;
            const fullStart = concatFull.length;
            if (!isUnspokenRubric) concatFull += pw.skeleton;
            const fullEnd = concatFull.length;

            const consStart = concatCons.length;
            if (!isUnspokenRubric) concatCons += pw.consonants;
            const consEnd = concatCons.length;

            words.push({
                index: words.length,
                surface: pw.surface,
                isUnspokenRubric,
                phonetic: pw.phonetic,
                engPhonetic: pw.engPhonetic,
                isEnglish: pw.isEnglish,
                skeleton: pw.skeleton,
                consonants: pw.consonants,
                syllableCount: pw.syllableCount,
                fullStart,
                fullEnd,
                consStart,
                consEnd
            });
        }

        const shingles = new Set([
            ...extractShingles(concatFull, 7),
            ...extractShingles(concatFull, 6)
        ]);
        const consShingles = new Set([
            ...extractShingles(concatCons, 6),
            ...extractShingles(concatCons, 5)
        ]);
        const zemaStates = buildZemaPhonemeStates(words, cardId);

        return {
            words,
            zemaStates,
            fullSkeleton: concatFull,
            consonantSkeleton: concatCons,
            shingles,
            consShingles
        };
    }

    /**
     * Breaks long single-language sequences (e.g., 400-word Pauline/Gospel readings) into
     * localized 26-word overlapping windows (stride 12) so scattered shingle hits across
     * 15 verses never sum together to cause false positives on off-book speech.
     */
    function buildScoringWindowsFromSeq(seq) {
        if (!seq || !seq.words || seq.words.length === 0) return [];
        if (seq.words.length <= 28) {
            return [{ shingles: seq.shingles, consShingles: seq.consShingles }];
        }
        const wins = [];
        for (let i = 0; i < seq.words.length; i += 12) {
            const wSlice = seq.words.slice(i, i + 26);
            const fStart = wSlice[0].fullStart;
            const fEnd = wSlice[wSlice.length - 1].fullEnd;
            const cStart = wSlice[0].consStart;
            const cEnd = wSlice[wSlice.length - 1].consEnd;
            const subFull = seq.fullSkeleton.slice(fStart, fEnd);
            const subCons = seq.consonantSkeleton.slice(cStart, cEnd);
            wins.push({
                shingles: new Set([
                    ...extractShingles(subFull, 7),
                    ...extractShingles(subFull, 6)
                ]),
                consShingles: new Set([
                    ...extractShingles(subCons, 6),
                    ...extractShingles(subCons, 5)
                ])
            });
            if (i + 26 >= seq.words.length) break;
        }
        return wins;
    }

    function isRepetitiveLiturgicalText(rawText, wordCount, distinctiveShingleCount) {
        const clean = stripLiturgicalMarkup(rawText);
        if (!clean) return true;
        for (const rx of REPETITIVE_REFRAIN_PATTERNS) {
            if (rx.test(clean)) return true;
        }
        if (wordCount <= 3 && distinctiveShingleCount < 3) return true;
        return false;
    }

    // =========================================================================
    // 2. LITURGICAL GRAPH & SHADOW EDITION / ANAPHORA BACKBONE INDEXER
    // =========================================================================

    function inferLiturgicalZoneFromTitle(sectionTitle, cardId) {
        const t = String(sectionTitle || '').toLowerCase();
        const cid = String(cardId || '');
        if (t.includes('theotokia') || t.includes('praises of mary') || t.includes('ውዳሴ ማርያም') || t.includes('gate of light') || t.includes('አንቀጸ ብርሃን') || t.includes('angels praise')) {
            return 'theotokia';
        }
        if (t.includes('anaphora') || t.includes('ቅዳሴ ሐዋርያት') || t.includes('ቅዳሴ ማርያም') || t.includes('አኰቴተ ቍርባን') || t.includes('melk') || t.includes('miracle') || /^apostles-|^st\.mary-|^mary-/i.test(cid)) {
            return 'anaphora';
        }
        if (t.includes('pre-liturgy psalms') || t.includes('ቅድመ ቅዳሴ')) {
            return 'prep_psalms';
        }
        if (t.includes('matins') || t.includes('vespers') || t.includes('kidan') || t.includes('ጸሎተ ነግህ') || t.includes('ጸሎተ ሠርክ') || t.includes('ጸሎተ ኪዳን') || /^kidan-/i.test(cid)) {
            return 'matins_kidan';
        }
        if (/^(?:1|2)-/.test(cid) && !/^2-7[345]$/.test(cid)) {
            return 'prep';
        }
        if (t.includes('order of the liturgy') || t.includes('ሥርዓተ ቅዳሴ') || /^(?:2|3|4|the300)-/i.test(cid)) {
            return 'liturgy_word';
        }
        return 'liturgy_word';
    }

    /**
     * Builds the complete Liturgical Stanza Graph over rendered slides (or an array of
     * prayer objects for headless Node benchmarking/testing), computing IDF weights,
     * `Inaudible Prayer` epsilon bridges, and repetitive-prayer guardrails.
     */
    function buildLiturgicalSlideGraph(slidesInput, options = {}) {
        const shingleDf = Object.create(null);
        const consDf = Object.create(null);
        const rawNodes = [];
        let currentSectionTitle = '';

        for (let idx = 0; idx < slidesInput.length; idx++) {
            const item = slidesInput[idx];
            const isDom = typeof Element !== 'undefined' && item instanceof Element;

            if (isDom && item.classList.contains('section-title')) {
                currentSectionTitle = item.textContent || '';
                rawNodes.push({
                    slideIndex: idx,
                    isSectionTitle: true,
                    isInaudible: false,
                    sectionTitle: currentSectionTitle,
                    cardId: '',
                    readingType: '',
                    zone: inferLiturgicalZoneFromTitle(currentSectionTitle, ''),
                    columns: {},
                    shadowColumns: [],
                    allShingles: new Set(),
                    allConsShingles: new Set(),
                    wordCount: 0
                });
                continue;
            }

            let cardId = '';
            let readingType = '';
            let isInaudible = false;
            let isChant = false;
            const columns = {};
            const shadowColumns = [];

            if (isDom) {
                cardId = item.dataset.cardId || '';
                readingType = item.dataset.readingType || '';
                const labelEl = item.querySelector('.prayer-label');
                const infoEl = item.querySelector('.info-panel');
                const labelTxt = (labelEl ? labelEl.textContent : '') + ' ' + (infoEl ? infoEl.textContent : '');
                isInaudible = /inaudible\s*prayer|ጸሎት\s*በልኁሳስ|quiet\s*prayer/i.test(labelTxt);

                item.querySelectorAll('.language-section').forEach(sec => {
                    const langCls = Array.from(sec.classList).find(c => c.startsWith('lang-') && c !== 'lang-phonetic' && c !== 'lang-ethiopic-script');
                    const langKey = langCls ? langCls.slice(5) : '';
                    const pEl = sec.querySelector('.language-text');
                    if (!langKey || !pEl) return;
                    // Clone without `.geez-phonetic-append` or interlinear `.zaima-rt` annotations
                    // and extract `.textContent` so `.zaima-rb` per-fidel spans NEVER split words apart!
                    const clone = pEl.cloneNode(true);
                    clone.querySelectorAll('sup, .geez-phonetic-append, .zaima-rt, .zaima-beit-margin, .zaima-speaker-rubric').forEach(el => el.remove());
                    clone.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
                    columns[langKey] = buildColumnWordSequence(clone.textContent || '', cardId, langKey);
                });

                isChant = Boolean(item.querySelector('.geez-phonetic-append')) || /people|ሕዝብ|ኵሎሙ|ሁሉም/i.test(item.textContent || '');
            } else if (item && typeof item === 'object') {
                // Plain prayer object (for headless Node livestream dry-run & unit tests)
                if (item._isSectionTitle) {
                    currentSectionTitle = item.title || '';
                    rawNodes.push({
                        slideIndex: idx,
                        isSectionTitle: true,
                        isInaudible: false,
                        sectionTitle: currentSectionTitle,
                        cardId: '',
                        readingType: '',
                        zone: inferLiturgicalZoneFromTitle(currentSectionTitle, ''),
                        columns: {},
                        shadowColumns: [],
                        allShingles: new Set(),
                        allConsShingles: new Set(),
                        wordCount: 0
                    });
                    continue;
                }
                cardId = item.cardId || (item.chapter && item.stanza ? `${item.chapter}-${item.stanza}` : '');
                readingType = item.readingType || '';
                isInaudible = /inaudible\s*prayer|ጸሎት\s*በልኁሳስ/i.test(item.instruction || '');
                const activeLangKeys = Array.isArray(options.languages)
                    ? options.languages
                    : ['geez_script', 'amharic_script', 'english', 'tigrinya_script'];
                for (const lk of activeLangKeys) {
                    if (item[lk] && String(item[lk]).trim()) {
                        columns[lk] = buildColumnWordSequence(item[lk], cardId, lk);
                    }
                }
                if (Array.isArray(item._shadowTexts)) {
                    for (const st of item._shadowTexts) {
                        if (st && st.text) {
                            const sLang = st.langKey || 'amharic_script';
                            shadowColumns.push({
                                langKey: sLang,
                                edition: st.edition || 'alt',
                                seq: buildColumnWordSequence(st.text, cardId, sLang)
                            });
                        }
                    }
                }
                isChant = Boolean(item.isChant) || (typeof window !== 'undefined' && window.__mountOfMercy && typeof window.__mountOfMercy.isChantStanza === 'function' && window.__mountOfMercy.isChantStanza(item)) ||
                    /people|ሕዝብ|ኵሎሙ|ሁሉም/i.test(`${item.english || ''} ${item.geez_script || ''} ${item.amharic_script || ''}`);
            }

            // Attach shadow Bible editions from global `getBibleVersesFromRef` if DOM reading card
            if (isDom && readingType && options.shadowBibleMap && options.shadowBibleMap[cardId]) {
                for (const st of options.shadowBibleMap[cardId]) {
                    shadowColumns.push({
                        langKey: st.langKey,
                        edition: st.edition,
                        seq: buildColumnWordSequence(st.text, cardId, st.langKey || '')
                    });
                }
            }

            const allShingles = new Set();
            const allConsShingles = new Set();
            const scoringWindows = [];
            let maxWords = 0;
            let sampleSurfaceText = '';

            for (const col of Object.values(columns)) {
                if (col.words.length > maxWords) {
                    maxWords = col.words.length;
                    sampleSurfaceText = col.words.map(w => w.surface).join(' ');
                }
                col.shingles.forEach(sh => allShingles.add(sh));
                col.consShingles.forEach(sh => allConsShingles.add(sh));
                scoringWindows.push(...buildScoringWindowsFromSeq(col));
            }
            for (const sc of shadowColumns) {
                sc.seq.shingles.forEach(sh => allShingles.add(sh));
                sc.seq.consShingles.forEach(sh => allConsShingles.add(sh));
                scoringWindows.push(...buildScoringWindowsFromSeq(sc.seq));
            }

            allShingles.forEach(sh => { shingleDf[sh] = (shingleDf[sh] || 0) + 1; });
            allConsShingles.forEach(sh => { consDf[sh] = (consDf[sh] || 0) + 1; });

            rawNodes.push({
                slideIndex: idx,
                isSectionTitle: false,
                isInaudible,
                isChant,
                sectionTitle: currentSectionTitle,
                cardId,
                readingType,
                zone: inferLiturgicalZoneFromTitle(currentSectionTitle, cardId),
                columns,
                shadowColumns,
                scoringWindows,
                allShingles,
                allConsShingles,
                wordCount: maxWords,
                sampleSurfaceText
            });
        }

        const N = Math.max(1, rawNodes.filter(n => !n.isSectionTitle).length);
        const rareCutoff = Math.max(3, Math.ceil(N * 0.07));

        for (const node of rawNodes) {
            let distinctiveCount = 0;
            node.allShingles.forEach(sh => {
                if ((shingleDf[sh] || 0) <= rareCutoff) distinctiveCount++;
            });
            node.distinctiveShingleCount = distinctiveCount;
            node.isRepetitiveRefrain = node.isSectionTitle
                ? true
                : isRepetitiveLiturgicalText(node.sampleSurfaceText, node.wordCount, distinctiveCount);
        }

        // Compute strict +1 forward transition edges (bridging only Section Titles & Inaudible Prayers)
        // plus bounded +2/+3 short-skip candidates for rare skipped prayer cards.
        for (let i = 0; i < rawNodes.length; i++) {
            const immediateNext = [];
            const shortSkipNext = [];
            let stepsAudible = 0;
            for (let j = i + 1; j < rawNodes.length && j <= i + 12; j++) {
                const target = rawNodes[j];
                if (target.isSectionTitle) continue;
                if (stepsAudible === 0) {
                    immediateNext.push(j);
                }
                if (!target.isInaudible) {
                    stepsAudible++;
                    if (stepsAudible >= 2 && stepsAudible <= 3 && !target.isRepetitiveRefrain) {
                        shortSkipNext.push(j);
                    }
                    if (stepsAudible >= 3) break;
                }
            }
            rawNodes[i].localNextIndices = immediateNext;
            rawNodes[i].shortSkipIndices = shortSkipNext;
        }

        let totalShingleCount = 0;
        for (const node of rawNodes) {
            if (!node.isSectionTitle) totalShingleCount += node.allShingles.size;
        }
        const avgShingleSize = Math.max(25, totalShingleCount / N);

        return {
            nodes: rawNodes,
            docCount: N,
            avgShingleSize,
            shingleDf,
            consDf,
            rareCutoff
        };
    }

    function buildMergedPrayerSequence(p, cardId = '') {
        const geezSeq = p.geez_script ? buildColumnWordSequence(p.geez_script, cardId, 'geez_script') : null;
        const amhSeq = p.amharic_script ? buildColumnWordSequence(p.amharic_script, cardId, 'amharic_script') : null;
        const engSeq = p.english ? buildColumnWordSequence(p.english, cardId, 'english') : null;
        const parts = [geezSeq, amhSeq, engSeq].filter(Boolean);
        const shingles = new Set();
        const consShingles = new Set();
        const words = [];
        let fullSkeleton = '';
        let consonantSkeleton = '';
        for (const pt of parts) {
            pt.shingles.forEach(s => shingles.add(s));
            pt.consShingles.forEach(s => consShingles.add(s));
            for (const w of pt.words) words.push(w);
            fullSkeleton += pt.fullSkeleton;
            consonantSkeleton += pt.consonantSkeleton;
        }
        return { words, fullSkeleton, consonantSkeleton, shingles, consShingles };
    }

    /**
     * Builds shadow branch matchers for:
     * 1. Unselected Anaphora (`mary` vs `apostles`)
     * 2. Shared Anaphora of the Apostles congregation backbone (`isSharedAnaphoraBackbone`)
     * 3. Day-of-Kidase stanza variants (`2-73`, `2-74`, `2-75`) & Creed (`4-33`, `The300-1`)
     */
    function buildShadowLiturgicalBranches(kidaseDataset, currentSettings = {}) {
        const branches = {
            unselectedAnaphora: [],
            apostlesBackbone: [],
            dayVariants: []
        };
        if (!kidaseDataset) return branches;

        const selectedAnaphora = currentSettings.selectedAnaphora || 'apostles';
        const otherKey = selectedAnaphora === 'mary' ? 'apostles' : 'mary';
        const otherList = kidaseDataset[otherKey] || [];

        // Index distinctive opening stanzas of unselected Anaphora (excluding shared generic responses)
        otherList.slice(0, 18).forEach((p, idx) => {
            const cardId = `${p.chapter}-${p.stanza}`;
            const geezClean = stripLiturgicalMarkup(p.geez_script || '');
            if (isRepetitiveLiturgicalText(geezClean, geezClean.split(/\s+/).filter(Boolean).length, 10)) return;
            const seq = buildMergedPrayerSequence(p, cardId);
            if (seq.words.length >= 4) {
                branches.unselectedAnaphora.push({
                    anaphoraKey: otherKey,
                    label: otherKey === 'mary' ? 'Anaphora of Mary | ቅዳሴ ማርያም' : 'Anaphora of the Apostles | ቅዳሴ ሐዋርያት',
                    cardId,
                    stanzaOffset: idx,
                    seq
                });
            }
        });

        // Index shared Deacon cues & People's chants in Anaphora of the Apostles as universal fallback
        const apostlesList = kidaseDataset.apostles || [];
        apostlesList.forEach((p, idx) => {
            const textBlob = `${p.english || ''} ${p.geez_script || ''} ${p.amharic_script || ''}`;
            const isShared = /(?:People|ALL|ሕዝብ|ኵሎሙ|ሁሉም|Deacon|ዲያቆን)\s*[:፡፤]/i.test(textBlob);
            if (isShared) {
                const cardId = `${p.chapter}-${p.stanza}`;
                const seq = buildMergedPrayerSequence(p, cardId);
                if (seq.words.length >= 3) {
                    branches.apostlesBackbone.push({
                        cardId,
                        stanzaIndex: idx,
                        seq,
                        preview: (p.english || p.geez_script || '').slice(0, 60)
                    });
                }
            }
        });

        // Day-of-Kidase stanza variants (2-73 Weekday, 2-74 Saturday, 2-75 Sunday)
        if (Array.isArray(kidaseDataset.order)) {
            const dayMap = {
                '73': { day: 'weekday', cardId: '2-73', label: 'Weekday Chant (እምነ በሀ)' },
                '74': { day: 'saturday', cardId: '2-74', label: 'Saturday Chant (መስቀል አብርሃ)' },
                '75': { day: 'sunday', cardId: '2-75', label: 'Sunday Chant (ኵሉ ዘገብራ)' }
            };
            kidaseDataset.order.forEach(p => {
                if (p.chapter === '2' && dayMap[p.stanza] && dayMap[p.stanza].day !== currentSettings.selectedKidaseDay) {
                    const seq = buildMergedPrayerSequence(p, dayMap[p.stanza].cardId);
                    if (seq.words.length >= 3) {
                        branches.dayVariants.push({
                            ...dayMap[p.stanza],
                            seq
                        });
                    }
                }
            });
        }

        return branches;
    }

    // =========================================================================
    // 3. ACOUSTIC SCORING, SUBSEQUENCE DTW ALIGNMENT & STATE MACHINE
    // =========================================================================

    /**
     * Scores an incoming audio observation (either CTC text / charSpans OR Ethiopic/English
     * transcript text) against a slide node using IDF-weighted canonical acoustic shingles.
     */
    function scoreObservationAgainstNode(obsProfile, node, graph) {
        if (!node || node.isSectionTitle || (node.allShingles.size === 0 && node.allConsShingles.size === 0)) {
            return { score: 0, coverage: 0, distinctiveHits: 0 };
        }

        const N = graph.docCount || 1;
        const windows = (Array.isArray(node.scoringWindows) && node.scoringWindows.length > 0)
            ? node.scoringWindows
            : [{ shingles: node.allShingles, consShingles: node.allConsShingles }];

        const totalQueryShingles = obsProfile.shingles.size + obsProfile.consShingles.size;
        let bestResult = { score: 0, rawIdfScore: 0, coverage: 0, distinctiveHits: 0 };

        for (const win of windows) {
            let idfScore = 0;
            let queryWeightSum = 0;
            let matchedQueryShingles = 0;
            let distinctiveHits = 0;

            for (const sh of obsProfile.shingles) {
                const df = graph.shingleDf[sh] || 0;
                const inTarget = win.shingles.has(sh);
                const idf = df > 0
                    ? Math.log(1 + (N - df + 0.5) / (df + 0.5))
                    : (inTarget ? Math.log(1 + (N + 0.5) / 1.5) : 1.1);
                queryWeightSum += Math.max(0.5, idf);
                if (inTarget) {
                    idfScore += idf * 1.45;
                    matchedQueryShingles++;
                    if (df <= graph.rareCutoff) {
                        distinctiveHits++;
                    }
                }
            }

            for (const csh of obsProfile.consShingles) {
                const df = graph.consDf[csh] || 0;
                const inTarget = win.consShingles.has(csh);
                const idf = df > 0
                    ? Math.log(1 + (N - df + 0.5) / (df + 0.5))
                    : (inTarget ? Math.log(1 + (N + 0.5) / 1.5) : 0.9);
                queryWeightSum += Math.max(0.35, idf * 0.7);
                if (inTarget) {
                    idfScore += idf * 1.05;
                    matchedQueryShingles++;
                    if (df <= graph.rareCutoff) {
                        distinctiveHits++;
                    }
                }
            }

            // Overlapping (7,6)/(6,5) CTC shingles have ~45% effective independent degrees of freedom
            const effectiveDenom = Math.max(4.0, queryWeightSum * 0.45);
            const normScore = Math.min(1.0, idfScore / effectiveDenom);
            const coverage = totalQueryShingles > 0 ? matchedQueryShingles / totalQueryShingles : 0;

            if (normScore > bestResult.score) {
                bestResult = {
                    score: Math.round(normScore * 1000) / 1000,
                    rawIdfScore: Math.round(idfScore * 100) / 100,
                    coverage: Math.round(coverage * 1000) / 1000,
                    distinctiveHits
                };
            }
        }

        return bestResult;
    }

    function createObservationProfile(rawAudioText) {
        const sk = toCanonicalAcousticSkeleton(rawAudioText);
        return {
            rawText: rawAudioText || '',
            fullSkeleton: sk.full,
            consonantSkeleton: sk.consonants,
            shingles: new Set([
                ...extractShingles(sk.full, 7),
                ...extractShingles(sk.full, 6)
            ]),
            consShingles: new Set([
                ...extractShingles(sk.consonants, 6),
                ...extractShingles(sk.consonants, 5)
            ])
        };
    }

    /**
     * Subsequence Dynamic Time Warping (DTW) / Smith-Waterman local aligner
     * with Zema vowel-stretch self-loops and skipped-word resilience.
     *
     * Finds where the rolling spoken observation ends inside a column's word list
     * and returns { columnScore, wordIndex, intraWordFraction }.
     */
    function alignObservationToColumnWords(obsProfile, colSeq, prevWordIdx = -1) {
        if (!colSeq || !colSeq.words || colSeq.words.length === 0 || !obsProfile.fullSkeleton) {
            return { columnScore: 0, wordIndex: -1, intraWordFraction: 0 };
        }

        const q = obsProfile.fullSkeleton;
        const t = colSeq.fullSkeleton;
        if (q.length < 3 || t.length < 2) {
            return { columnScore: 0, wordIndex: -1, intraWordFraction: 0 };
        }

        const Q = Math.min(q.length, 96);
        const queryTail = q.slice(-Q);
        const T = t.length;

        // Subsequence Smith-Waterman with forward bias around prevWordIdx's character offset
        let expectedCenter = -1;
        if (prevWordIdx >= 0 && prevWordIdx < colSeq.words.length) {
            expectedCenter = colSeq.words[prevWordIdx].fullEnd;
        }

        let prevRow = new Float32Array(T + 1);
        let currRow = new Float32Array(T + 1);
        let bestScore = 0;
        let bestTargetEnd = -1;

        for (let i = 1; i <= Q; i++) {
            const qc = queryTail[i - 1];
            const isQueryVowel = qc === 'A' || qc === 'I' || qc === 'U';
            currRow[0] = 0;

            for (let j = 1; j <= T; j++) {
                const tc = t[j - 1];
                let matchGain = -1.10;
                if (qc === tc) {
                    matchGain = isQueryVowel ? 1.10 : 1.80; // Consonants carry stronger discriminative anchor weight
                } else if (isQueryVowel && (tc === 'A' || tc === 'I' || tc === 'U')) {
                    matchGain = 0.15; // Small credit for Zema vowel coloration shifts
                }

                const diag = prevRow[j - 1] + matchGain;
                // Zero/near-zero self-loop penalty on sustained Zema vowels in query
                const stretchQuery = prevRow[j] - (isQueryVowel ? 0.12 : 0.65);
                // Small skip penalty in target text (allows reader skipping words)
                const skipTarget = currRow[j - 1] - 0.55;

                const val = Math.max(0, diag, stretchQuery, skipTarget);
                currRow[j] = val;

                if (i >= Math.floor(Q * 0.65)) {
                    // Add gentle forward-continuity prior if prevWordIdx is active
                    let adjusted = val;
                    if (expectedCenter >= 0) {
                        const dist = j - expectedCenter;
                        if (dist >= -8 && dist <= 48) {
                            adjusted += 1.2;
                        } else if (dist < -18) {
                            adjusted -= 1.4; // Discourage jumping backward on repeated words in same card
                        }
                    }
                    if (adjusted > bestScore) {
                        bestScore = adjusted;
                        bestTargetEnd = j;
                    }
                }
            }
            const tmp = prevRow;
            prevRow = currRow;
            currRow = tmp;
        }

        const maxPossible = Q * 1.45;
        const normColScore = Math.max(0, Math.min(1, bestScore / Math.max(4, maxPossible)));

        if (bestTargetEnd <= 0 || normColScore < 0.22) {
            return { columnScore: normColScore, wordIndex: -1, intraWordFraction: 0 };
        }

        // Map character position `bestTargetEnd` back to exact spoken word & intra-word fraction [0..1]
        let matchedWordIdx = 0;
        let intraFraction = 0;
        let lastSpokenIdx = colSeq.words.length - 1;
        while (lastSpokenIdx > 0 && colSeq.words[lastSpokenIdx].isUnspokenRubric && colSeq.words[lastSpokenIdx].fullEnd === colSeq.words[lastSpokenIdx].fullStart) {
            lastSpokenIdx--;
        }
        for (let w = 0; w < colSeq.words.length; w++) {
            const wd = colSeq.words[w];
            if (wd.isUnspokenRubric && wd.fullEnd === wd.fullStart) continue;
            if (bestTargetEnd <= wd.fullEnd || w === lastSpokenIdx) {
                matchedWordIdx = w;
                const span = Math.max(1, wd.fullEnd - wd.fullStart);
                intraFraction = Math.max(0, Math.min(1, (bestTargetEnd - wd.fullStart) / span));
                break;
            }
        }

        return {
            columnScore: Math.round(normColScore * 1000) / 1000,
            wordIndex: matchedWordIdx,
            intraWordFraction: Math.round(intraFraction * 100) / 100
        };
    }

    /**
     * Evaluates all visible columns + shadow Bible editions on a slide to determine
     * the winning spoken language column and exact word/syllable red-dot coordinates.
     */
    function evaluateMultiColumnRedDot(obsProfile, node, currentSpokenCol, currentWordIdx, nowMs = Date.now()) {
        if (!node || node.isSectionTitle || !node.columns) {
            return { activeColumn: currentSpokenCol, wordIndex: -1, intraWordFraction: 0, bestScore: 0 };
        }

        let bestLang = null;
        let bestAlign = { columnScore: 0, wordIndex: -1, intraWordFraction: 0 };
        const colScores = {};

        for (const [langKey, colSeq] of Object.entries(node.columns)) {
            const prevW = langKey === currentSpokenCol ? currentWordIdx : -1;
            const res = alignObservationToColumnWords(obsProfile, colSeq, prevW);
            colScores[langKey] = res;
            if (res.columnScore > bestAlign.columnScore) {
                bestAlign = res;
                bestLang = langKey;
            }
        }

        // Also align against shadow Bible editions (e.g., am54 Haile Selassie Bible when am-2000 is displayed)
        // and project fractional progress onto the displayed column of that same language!
        if (Array.isArray(node.shadowColumns)) {
            for (const sc of node.shadowColumns) {
                const dispSeq = node.columns[sc.langKey];
                if (!dispSeq || dispSeq.words.length === 0) continue;
                const shadowRes = alignObservationToColumnWords(obsProfile, sc.seq, -1);
                if (shadowRes.columnScore > bestAlign.columnScore && shadowRes.wordIndex >= 0) {
                    const progressRatio = (shadowRes.wordIndex + shadowRes.intraWordFraction) / Math.max(1, sc.seq.words.length);
                    const projectedPos = progressRatio * dispSeq.words.length;
                    const projIdx = Math.min(dispSeq.words.length - 1, Math.floor(projectedPos));
                    const projFrac = projectedPos - projIdx;
                    bestLang = sc.langKey;
                    bestAlign = {
                        columnScore: shadowRes.columnScore,
                        wordIndex: projIdx,
                        intraWordFraction: Math.round(projFrac * 100) / 100
                    };
                    colScores[sc.langKey] = bestAlign;
                }
            }
        }

        // Apply column-switching hysteresis so shared words ("Amen", "Kristos") don't flicker columns
        if (currentSpokenCol && colScores[currentSpokenCol] && bestLang && bestLang !== currentSpokenCol) {
            const curScore = colScores[currentSpokenCol].columnScore;
            if (bestAlign.columnScore - curScore < COLUMN_SWITCH_HYSTERESIS || (nowMs - state.lastColumnSwitchAt) < COLUMN_SWITCH_HOLD_MS) {
                bestLang = currentSpokenCol;
                bestAlign = colScores[currentSpokenCol];
            } else {
                state.lastColumnSwitchAt = nowMs;
            }
        } else if (bestLang && bestLang !== currentSpokenCol) {
            state.lastColumnSwitchAt = nowMs;
        }

        return {
            activeColumn: bestLang,
            wordIndex: bestAlign.wordIndex,
            intraWordFraction: bestAlign.intraWordFraction,
            bestScore: bestAlign.columnScore,
            colScores
        };
    }

    function summarizeColumnTrackerState(ct) {
        if (!ct) return null;
        let bestS = 0;
        let maxCurrVit = -Infinity;
        for (let s = 0; s < ct.S1; s++) {
            if (ct.vit[s] > maxCurrVit) maxCurrVit = ct.vit[s];
        }
        for (let s = 1; s < ct.S; s++) {
            if (ct.vit[s] > ct.vit[bestS]) bestS = s;
        }
        const firstSpokenW = ct.firstSpokenWordIdx;
        const lastSpokenW = ct.lastSpokenWordIdx;
        const spokenSpan = Math.max(1, lastSpokenW >= firstSpokenW ? (lastSpokenW - firstSpokenW + 1) : ct.totalWords);
        const minWordsBeforeCross = spokenSpan <= 3 ? 0 : (firstSpokenW + Math.floor((spokenSpan - 1) * (ct.isEnglishCol ? 0.55 : 0.58)));
        const nextLen = Math.max(1, ct.S - ct.S1);
        const nextConfirmNeeded = ct.isEnglishCol
            ? Math.min(3, Math.max(2, Math.floor(nextLen * 0.20)))
            : Math.min(7, Math.max(4, Math.floor(nextLen * 0.45)));
        const crossedToNext = ct.nextSlideIdx >= 0 &&
            ct.S > ct.S1 &&
            ct.maxWordReached >= minWordsBeforeCross &&
            bestS >= ct.S1 + nextConfirmNeeded &&
            ct.vit[bestS] > maxCurrVit + (ct.isEnglishCol ? 0.05 : 0.25) &&
            ct.emaLlr >= (ct.isEnglishCol ? 0.14 : 0.16);

        const clampedCurrState = Math.min(ct.S1 - 1, bestS);
        const stObj = ct.allStates[clampedCurrState];
        if (stObj.wordIndex > ct.maxWordReached && stObj.wordIndex <= ct.maxWordReached + 3) {
            ct.maxWordReached = stObj.wordIndex;
        } else if (stObj.wordIndex > ct.maxWordReached + 3 && ct.emaLlr >= 0.35) {
            ct.maxWordReached = stObj.wordIndex;
        }
        const reportedWordIndex = (stObj.wordIndex < ct.maxWordReached && ct.maxWordReached - stObj.wordIndex <= 2)
            ? ct.maxWordReached
            : stObj.wordIndex;

        return {
            wordIndex: reportedWordIndex,
            intraWordFraction: stObj.intraFraction,
            emaLlr: Math.round(ct.emaLlr * 1000) / 1000,
            stateIndex: clampedCurrState,
            totalStates: ct.S1,
            crossedToNext,
            nextSlideIdx: ct.nextSlideIdx,
            nextSeedStateOffset: crossedToNext ? Math.max(0, bestS - ct.S1) : 0
        };
    }

    /**
     * Online Coupled Slide + Next-Slide Continuous Log-Posterior Viterbi Filter.
     *
     * Tracks 25Hz (40ms) 10-class calibrated Zema acoustic log-posteriors across
     * arbitrarily long melismatic chants (15s-300s per stanza!) as well as rapid
     * spoken/chanted English & Amharic readings, enforcing an Acoustic Landmark Gate
     * so sustained Zema vowels never bunny-hop across unspoken consonants while
     * automatically crossing into `nextNode` the moment the congregation/clergy enters it.
     */
    function updateOnlineCoupledViterbi(currentNode, nextNode, nextSlideIdx, hopPosteriors, hopRms, trackerState, nowMs = Date.now(), swColScores = null) {
        if (!currentNode || currentNode.isSectionTitle || !currentNode.columns || !hopPosteriors || !hopPosteriors.length) {
            return null;
        }
        const numFrames = Math.floor(hopPosteriors.length / NUM_POSTERIOR_CLASSES);
        if (numFrames <= 0) return null;

        if (!trackerState._viterbiSession || trackerState._viterbiSession.slideIdx !== currentNode.slideIndex) {
            const seedOffset = (trackerState._pendingNextSeed && trackerState._pendingNextSeed.slideIdx === currentNode.slideIndex)
                ? trackerState._pendingNextSeed
                : null;
            trackerState._pendingNextSeed = null;

            const colTrackers = {};
            const SPOKEN_TRACK_COLUMNS = new Set(['geez_script', 'amharic_script', 'tigrinya_script', 'english']);
            for (const [langKey, colSeq] of Object.entries(currentNode.columns)) {
                if (!SPOKEN_TRACK_COLUMNS.has(langKey)) continue;
                const currStates = colSeq.zemaStates || buildZemaPhonemeStates(colSeq.words || [], currentNode.cardId);
                if (currStates.length === 0) continue;

                let nextStates = [];
                if (nextNode && nextNode.columns) {
                    const nextCol = nextNode.columns[langKey] || Object.values(nextNode.columns)[0];
                    if (nextCol) {
                        const ns = nextCol.zemaStates || buildZemaPhonemeStates(nextCol.words || [], nextNode.cardId);
                        nextStates = ns.slice(0, 20);
                    }
                }

                const S1 = currStates.length;
                const allStates = currStates.concat(nextStates);
                const S = allStates.length;
                const vit = new Float64Array(S).fill(-Infinity);
                const dwell = new Int32Array(S);
                const firstSpokenWordIdx = currStates[0].wordIndex;
                const lastSpokenWordIdx = currStates[S1 - 1].wordIndex;

                if (seedOffset && seedOffset.langKey === langKey && seedOffset.stateOffset > 0 && seedOffset.stateOffset < S1) {
                    const st0 = seedOffset.stateOffset;
                    vit[st0] = 0;
                    dwell[st0] = 2;
                    if (st0 > 0) vit[st0 - 1] = -0.5;
                    if (st0 + 1 < S1) vit[st0 + 1] = -0.5;
                } else {
                    vit[0] = 0;
                    if (S1 > 1 && allStates[0].isOptional) vit[1] = -0.2;
                }

                colTrackers[langKey] = {
                    langKey,
                    isEnglishCol: langKey === 'english',
                    nextSlideIdx,
                    S1,
                    S,
                    totalWords: (colSeq.words || []).length,
                    firstSpokenWordIdx,
                    lastSpokenWordIdx,
                    allStates,
                    vit,
                    dwell,
                    emaLlr: 0.25,
                    maxWordReached: firstSpokenWordIdx,
                    voicedFramesSeen: 0
                };
            }

            trackerState._viterbiSession = {
                slideIdx: currentNode.slideIndex,
                nextSlideIdx,
                colTrackers
            };
        }

        const session = trackerState._viterbiSession;
        const logUniform = Math.log(1 / 9);
        const normLogP = new Float64Array(NUM_POSTERIOR_CLASSES);

        for (let t = 0; t < numFrames; t++) {
            const fRms = hopRms ? hopRms[t] : 0.02;
            if (fRms < 0.0075) continue;

            // Compute conditional log-probabilities over the 9 non-blank acoustic classes (all <= 0)
            const base = t * NUM_POSTERIOR_CLASSES;
            let maxNB = -Infinity;
            for (let c = 1; c < NUM_POSTERIOR_CLASSES; c++) {
                if (hopPosteriors[base + c] > maxNB) maxNB = hopPosteriors[base + c];
            }
            let sumNB = 0;
            for (let c = 1; c < NUM_POSTERIOR_CLASSES; c++) {
                sumNB += Math.exp(hopPosteriors[base + c] - maxNB);
            }
            const logDenom = maxNB + Math.log(sumNB || 1);
            for (let c = 1; c < NUM_POSTERIOR_CLASSES; c++) {
                normLogP[c] = Math.max(-2.6, hopPosteriors[base + c] - logDenom);
            }

            for (const ct of Object.values(session.colTrackers)) {
                const { S1, S, allStates, vit, dwell, isEnglishCol } = ct;
                const nextVit = new Float64Array(S).fill(-Infinity);
                const nextDwell = new Int32Array(S);
                ct.voicedFramesSeen++;

                // Allow mid-slide catch-up ONLY if the prefix alignment is failing (`emaLlr < 0.08`)
                // so stanzas with repeated refrains (e.g. 3x `አሐዱ ... ቅዱስ` in 3:26) never teleport
                // from occurrence #1 to occurrence #3 on word 0!
                let catchupFloor = -Infinity;
                if (ct.voicedFramesSeen >= 40 && ct.voicedFramesSeen <= 110 && ct.emaLlr < 0.08) {
                    let maxCurr = -Infinity;
                    for (let u = 0; u < S1; u++) if (vit[u] > maxCurr) maxCurr = vit[u];
                    catchupFloor = maxCurr - 6.2;
                }

                const tailRatio = S1 <= 8 ? 0.55 : (isEnglishCol ? 0.72 : 0.80);
                const tailStart = Math.max(0, Math.floor(S1 * tailRatio));
                const finalTailStart = Math.max(tailStart, S1 - 2);
                const enterGate = -1.85;
                const stepCost1 = isEnglishCol ? -0.55 : -1.10;

                for (let s = 0; s < S; s++) {
                    const stMeta = allStates[s];
                    const lp = normLogP[stMeta.cls];
                    const canEnter = lp >= enterGate;
                    // Never artificially evict final-cadence melisma (`s >= tailStart`) before next-slide consonants arrive!
                    const satPenalty = (s < tailStart && dwell[s] > stMeta.maxMelismaFrames)
                        ? (isEnglishCol ? -0.075 : -0.045)
                        : 0.0;

                    let bestPrev = vit[s] > -Infinity ? (vit[s] + satPenalty) : -Infinity;
                    let fromSame = true;

                    if (canEnter) {
                        if (s >= 1 && s !== S1 && dwell[s - 1] >= allStates[s - 1].minConsDwell) {
                            const v1 = vit[s - 1] + stepCost1;
                            if (v1 > bestPrev) { bestPrev = v1; fromSame = false; }
                        }
                        if (s >= 2 && s !== S1 && s !== S1 + 1) {
                            if (allStates[s - 1].isOptional && dwell[s - 2] >= (isEnglishCol ? 1 : 2)) {
                                const v2 = vit[s - 2] - (isEnglishCol ? 0.68 : 1.25);
                                if (v2 > bestPrev) { bestPrev = v2; fromSame = false; }
                            } else if (s < S1 && dwell[s - 2] >= (isEnglishCol ? 2 : 8) && lp >= -1.15 && stMeta.cls !== allStates[s - 2].cls) {
                                // Soft-lenition 1-consonant skip (only within current slide `s < S1`, never inside next-slide boundary gate!)
                                const v2 = vit[s - 2] - (isEnglishCol ? 1.95 : 3.60);
                                if (v2 > bestPrev) { bestPrev = v2; fromSame = false; }
                            }
                        }
                        if (s === S1) {
                            for (let u = tailStart; u < S1; u++) {
                                const atEnd = u >= finalTailStart;
                                const reqDwell = isEnglishCol ? (atEnd ? 1 : 2) : 3;
                                const cCost = isEnglishCol ? (atEnd ? -0.80 : -1.45) : -2.10;
                                if (dwell[u] >= reqDwell) {
                                    const vb = vit[u] + cCost;
                                    if (vb > bestPrev) { bestPrev = vb; fromSame = false; }
                                }
                            }
                        }
                        if (s < S1 && catchupFloor > bestPrev && lp >= -0.95) {
                            bestPrev = catchupFloor;
                            fromSame = false;
                        }
                    }

                    if (bestPrev > -Infinity) {
                        nextVit[s] = bestPrev + lp;
                        nextDwell[s] = fromSame ? dwell[s] + 1 : 1;
                    }
                }

                let bestS = 0;
                let bestV = -Infinity;
                for (let s = 0; s < S; s++) {
                    if (nextVit[s] > bestV) {
                        bestV = nextVit[s];
                        bestS = s;
                    }
                }
                if (bestV > -Infinity) {
                    for (let s = 0; s < S; s++) {
                        if (nextVit[s] > -Infinity) nextVit[s] -= bestV;
                    }
                    ct.emaLlr = 0.93 * ct.emaLlr + 0.07 * (normLogP[allStates[bestS].cls] - logUniform);
                }
                ct.vit = nextVit;
                ct.dwell = nextDwell;
            }
        }

        // Fuse rolling Smith-Waterman forward alignment on English ONLY when English is the locked spoken column
        // (or there is no Ge'ez chant column), so sustained Ge'ez Zema vowels never advance the English Viterbi tracker!
        if (swColScores && session.colTrackers.english && (trackerState.lockedSpokenColumn === 'english' || !session.colTrackers.geez_script)) {
            const engCt = session.colTrackers.english;
            const swEng = swColScores.english;
            const maxOtherSw = Object.entries(swColScores)
                .filter(([k]) => k !== 'english')
                .reduce((mx, [, v]) => Math.max(mx, v ? v.columnScore : 0), 0);
            if (swEng && swEng.columnScore >= 0.32 && swEng.columnScore >= maxOtherSw + 0.03 && swEng.wordIndex > engCt.maxWordReached) {
                let curVitBestS = 0;
                for (let s = 1; s < engCt.S1; s++) {
                    if (engCt.vit[s] > engCt.vit[curVitBestS]) curVitBestS = s;
                }
                const curVitWord = engCt.allStates[curVitBestS].wordIndex;
                if (swEng.wordIndex > curVitWord && swEng.wordIndex <= engCt.maxWordReached + 8) {
                    const seedVal = engCt.vit[curVitBestS] - 0.25;
                    for (let s = 0; s < engCt.S1; s++) {
                        if (engCt.allStates[s].wordIndex === swEng.wordIndex && seedVal > engCt.vit[s]) {
                            engCt.vit[s] = seedVal;
                            engCt.dwell[s] = Math.max(engCt.dwell[s], 1);
                        }
                    }
                    engCt.maxWordReached = Math.max(engCt.maxWordReached, swEng.wordIndex);
                    engCt.emaLlr = Math.max(engCt.emaLlr, 0.26);
                }
            }
        }

        const perColumn = {};
        let winningLang = null;
        let winningSummary = null;

        for (const [langKey, ct] of Object.entries(session.colTrackers)) {
            const sum = summarizeColumnTrackerState(ct);
            perColumn[langKey] = sum;
            if (!winningSummary || sum.emaLlr > winningSummary.emaLlr + 0.08 || (langKey === trackerState.activeSpokenColumn && Math.abs(sum.emaLlr - winningSummary.emaLlr) <= 0.08)) {
                winningLang = langKey;
                winningSummary = sum;
            }
        }
        if (!winningSummary) return null;

        return {
            activeColumn: winningLang,
            ...winningSummary,
            perColumn
        };
    }

    /**
     * Resolves and locks the active spoken language column with multi-hop hysteresis so the
     * red tracking dot NEVER drifts horizontally into an adjacent language column mid-chant.
     * Requires consonant-shingle sequence evidence (`consHits >= 2`) before locking onto non-Ge'ez
     * columns on chant stanzas, preventing stretched Ge'ez Zema vowel melismas from ever mis-locking
     * onto an English/Amharic translation column.
     */
    function resolveLockedSpokenColumn(currentNode, viterbiEval, shingleDotEval, trackerState, obsProfile = null) {
        if (!currentNode || !currentNode.columns) return null;
        const availableCols = Object.keys(currentNode.columns);
        if (availableCols.length === 0) return null;
        if (availableCols.length === 1) {
            trackerState.lockedSpokenColumn = availableCols[0];
            trackerState._colChallenger = null;
            trackerState._colChallengerStreak = 0;
            return availableCols[0];
        }

        const swMap = {};
        const consHitsMap = {};
        const colEvidence = {};
        let maxSw = 0;

        for (const lk of availableCols) {
            const sw = (shingleDotEval && shingleDotEval.colScores && shingleDotEval.colScores[lk])
                ? shingleDotEval.colScores[lk].columnScore
                : 0;
            swMap[lk] = sw;
            if (sw > maxSw) maxSw = sw;

            let cHits = 0;
            const colSeq = currentNode.columns[lk];
            if (obsProfile && obsProfile.consShingles && colSeq && colSeq.consShingles) {
                for (const csh of obsProfile.consShingles) {
                    if (colSeq.consShingles.has(csh)) cHits++;
                }
            }
            consHitsMap[lk] = cHits;

            const vSum = (viterbiEval && viterbiEval.perColumn && viterbiEval.perColumn[lk])
                ? viterbiEval.perColumn[lk]
                : null;
            const vNorm = vSum ? Math.max(0, Math.min(1, vSum.emaLlr * 0.45)) : 0;
            const consBonus = Math.min(0.14, cHits * 0.035);
            colEvidence[lk] = (vSum ? (sw * 0.78 + vNorm * 0.22) : sw) + consBonus;
        }

        const sorted = availableCols.slice().sort((a, b) => colEvidence[b] - colEvidence[a]);
        const bestCol = sorted[0];
        const secondScore = sorted.length > 1 ? colEvidence[sorted[1]] : 0;
        const bestScore = colEvidence[bestCol];
        const bestSw = swMap[bestCol] || 0;
        const secondSw = sorted.length > 1 ? (swMap[sorted[1]] || 0) : 0;
        const bestConsHits = consHitsMap[bestCol] || 0;
        const bestColHasConsIndex = Boolean(currentNode.columns[bestCol]?.consShingles?.size > 0);
        const margin = bestScore - secondScore;
        const isChantWithGeez = Boolean(!currentNode.readingType && currentNode.columns.geez_script);
        const geezConsHits = consHitsMap.geez_script || 0;
        const maxNonGeezConsHits = availableCols
            .filter(k => k !== 'geez_script' && k !== 'tigrinya_script')
            .reduce((mx, k) => Math.max(mx, consHitsMap[k] || 0), 0);

        const locked = (trackerState.lockedSpokenColumn && currentNode.columns[trackerState.lockedSpokenColumn])
            ? trackerState.lockedSpokenColumn
            : null;

        if (!locked) {
            // Lock Ge'ez Zema once 25Hz Zema Viterbi tracks at least 2 spoken words past the stanza's first spoken word
            // (and English is not genuinely outscoring Ge'ez on consonant shingles)
            const vGeez = (viterbiEval && viterbiEval.perColumn && viterbiEval.perColumn.geez_script)
                ? viterbiEval.perColumn.geez_script
                : null;
            const firstGeezSpokenIdx = currentNode.columns.geez_script?.zemaStates?.[0]?.wordIndex ?? 0;
            if (
                isChantWithGeez && vGeez &&
                vGeez.wordIndex >= firstGeezSpokenIdx + 2 &&
                vGeez.emaLlr >= 0.22 &&
                (consHitsMap.english || 0) <= geezConsHits &&
                (swMap.english || 0) < 0.34
            ) {
                trackerState.lockedSpokenColumn = 'geez_script';
                trackerState._colLockCandidate = null;
                trackerState._colLockStreak = 0;
                return 'geez_script';
            }

            // Fast first-hop English / Amharic recognition before 2 full 5/6-gram consonant shingles accumulate:
            // requires strong acoustic Viterbi LLR lead AND Smith-Waterman lead with zero Ge'ez consonant hits.
            const vBest = (viterbiEval && viterbiEval.perColumn && viterbiEval.perColumn[bestCol])
                ? viterbiEval.perColumn[bestCol]
                : null;
            const fastFirstHopNonGeezOk = Boolean(
                isChantWithGeez &&
                bestCol !== 'geez_script' &&
                geezConsHits === 0 &&
                (swMap.geez_script || 0) < 0.24 &&
                vBest && vGeez &&
                vBest.emaLlr >= 0.32 &&
                vBest.emaLlr >= vGeez.emaLlr + 0.18 &&
                bestSw >= 0.34 &&
                bestSw >= (swMap.geez_script || 0) + 0.10
            );

            // On non-reading chant cards with Ge'ez, require genuine 5/6-gram consonant-shingle matches (`bestConsHits >= 2` beating Ge'ez)
            // OR unambiguous fast first-hop acoustic + SW lead before choosing/locking a non-Ge'ez column
            // so vowel-heavy Zema melismas never drift into English/Amharic!
            const nonGeezConsonantGateOk = !isChantWithGeez ||
                bestCol === 'geez_script' ||
                (bestConsHits >= 2 && bestConsHits > geezConsHits) ||
                fastFirstHopNonGeezOk ||
                (!bestColHasConsIndex && bestSw >= 0.52);

            if (!nonGeezConsonantGateOk) {
                return 'geez_script';
            }

            // Lock immediately on unmistakable multi-consonant subsequence match (`bestSw >= 0.36`)
            if (bestSw >= 0.36 && (bestSw - secondSw) >= 0.06) {
                trackerState.lockedSpokenColumn = bestCol;
                trackerState._colLockCandidate = null;
                trackerState._colLockStreak = 0;
                return bestCol;
            }
            // Or lock after 2 consistent hops with real subsequence alignment (`bestSw >= 0.27`)
            if (bestSw >= 0.27 && margin >= 0.04) {
                if (trackerState._colLockCandidate === bestCol) {
                    trackerState._colLockStreak = (trackerState._colLockStreak || 0) + 1;
                } else {
                    trackerState._colLockCandidate = bestCol;
                    trackerState._colLockStreak = 1;
                }
                if (trackerState._colLockStreak >= 2) {
                    trackerState.lockedSpokenColumn = bestCol;
                    trackerState._colLockCandidate = null;
                    trackerState._colLockStreak = 0;
                    return bestCol;
                }
            }
            if (maxSw < 0.25) {
                if (trackerState.activeSpokenColumn && currentNode.columns[trackerState.activeSpokenColumn]) {
                    return trackerState.activeSpokenColumn;
                }
                if (isChantWithGeez) {
                    return 'geez_script';
                }
            }
            if (trackerState.activeSpokenColumn && currentNode.columns[trackerState.activeSpokenColumn] &&
                bestScore - colEvidence[trackerState.activeSpokenColumn] < 0.12) {
                return trackerState.activeSpokenColumn;
            }
            return bestCol;
        }

        // Column is currently LOCKED: only release if a challenger has strong consonant + subsequence evidence across consecutive voiced hops!
        if (bestCol !== locked) {
            const lockedScore = colEvidence[locked] || 0;
            const leadOverLocked = bestScore - lockedScore;
            const atSlideStart = (trackerState.activeWordIndex <= 1) && (swMap[locked] || 0) < 0.22;
            const neededStreak = atSlideStart ? 2 : 4;
            const neededLead = atSlideStart ? 0.10 : 0.16;
            const challengerGateOk = !isChantWithGeez ||
                bestCol === 'geez_script' ||
                (bestConsHits >= 2 && bestConsHits > geezConsHits) ||
                (!bestColHasConsIndex && bestSw >= 0.52);

            if (challengerGateOk && bestSw >= 0.35 && leadOverLocked >= neededLead) {
                if (trackerState._colChallenger === bestCol) {
                    trackerState._colChallengerStreak = (trackerState._colChallengerStreak || 0) + 1;
                } else {
                    trackerState._colChallenger = bestCol;
                    trackerState._colChallengerStreak = 1;
                }
                if (trackerState._colChallengerStreak >= neededStreak) {
                    trackerState.lockedSpokenColumn = bestCol;
                    trackerState._colChallenger = null;
                    trackerState._colChallengerStreak = 0;
                    return bestCol;
                }
            } else {
                trackerState._colChallenger = null;
                trackerState._colChallengerStreak = 0;
            }
        } else {
            trackerState._colChallenger = null;
            trackerState._colChallengerStreak = 0;
        }

        return locked;
    }

    /**
     * Core Liturgical Co-Pilot Decision Step (pure & deterministic for unit/livestream replay).
     */
    function evaluateLiturgicalStep({
        obsProfile,
        rms,
        phoneDensity,
        hopPosteriors = null,
        hopRms = null,
        windowDurationMs,
        currentSlideIdx,
        graph,
        shadowBranches,
        trackerState,
        nowMs = Date.now()
    }) {
        const hasPosteriorStream = Boolean(hopPosteriors && hopPosteriors.length >= NUM_POSTERIOR_CLASSES);
        const isVoiced = rms >= VOICE_RMS_MIN && (
            hasPosteriorStream
                ? phoneDensity >= 0.015
                : (phoneDensity >= MIN_PHONE_DENSITY_VOICED && obsProfile.fullSkeleton.length >= 4)
        );

        const currentNode = graph.nodes[currentSlideIdx] || null;
        const primaryNextIdx = (currentNode && Array.isArray(currentNode.localNextIndices) && currentNode.localNextIndices.length > 0)
            ? currentNode.localNextIndices.find(idx => !graph.nodes[idx].isInaudible) ?? currentNode.localNextIndices[0]
            : -1;
        const primaryNextNode = primaryNextIdx >= 0 ? graph.nodes[primaryNextIdx] : null;

        // 1. Silence / Censing Guardrail: NEVER trigger icon interlude on silence,
        //    AND if the reader just finished the final word/tail of the current slide and paused
        //    into TRUE acoustic silence (`rms < VOICE_RMS_MIN`), smoothly transition +1!
        const isAcousticSilence = rms < VOICE_RMS_MIN;
        if (!isVoiced) {
            trackerState.unmatchedVoicedMs = Math.max(0, trackerState.unmatchedVoicedMs - Math.floor(windowDurationMs * 0.35));
            const endMeta = trackerState._endOfSlideMeta;
            if (
                isAcousticSilence &&
                !trackerState.isSanctuaryInterludeVisible &&
                currentNode && !currentNode.isSectionTitle &&
                primaryNextIdx >= 0 &&
                endMeta && endMeta.slideIdx === currentSlideIdx && endMeta.reached
            ) {
                trackerState.endOfSlideSilentMs = (trackerState.endOfSlideSilentMs || 0) + windowDurationMs;
                const reqPauseMs = endMeta.isGeez ? END_PAUSE_ZEMA_MS : END_PAUSE_SPOKEN_MS;
                const sinceLastAdv = trackerState.lastSlideAdvanceAt > 0 ? (nowMs - trackerState.lastSlideAdvanceAt) : 99999;
                if (trackerState.endOfSlideSilentMs >= reqPauseMs && sinceLastAdv >= 1000) {
                    trackerState._viterbiSession = null;
                    trackerState.unmatchedVoicedMs = 0;
                    trackerState.endOfSlideSilentMs = 0;
                    trackerState._endOfSlideMeta = null;
                    trackerState.reacquireStreak = 0;
                    trackerState.localSkipStreak = 0;
                    trackerState.localSkipCandidateIdx = -1;
                    return {
                        action: 'advance_local',
                        targetSlideIndex: primaryNextIdx,
                        confidence: 0.72,
                        reason: 'end_of_slide_pause'
                    };
                }
            } else if (!isAcousticSilence) {
                trackerState.endOfSlideSilentMs = 0;
            }
            return { action: 'hold_silent', isVoiced: false };
        }
        trackerState.endOfSlideSilentMs = 0;

        const currentScoreObj = currentNode ? scoreObservationAgainstNode(obsProfile, currentNode, graph) : { score: 0, coverage: 0, distinctiveHits: 0 };
        const effectivePrevCol = (trackerState.lockedSpokenColumn && currentNode && currentNode.columns && currentNode.columns[trackerState.lockedSpokenColumn])
            ? trackerState.lockedSpokenColumn
            : trackerState.activeSpokenColumn;
        const shingleDotEval = currentNode && !trackerState.isSanctuaryInterludeVisible
            ? evaluateMultiColumnRedDot(obsProfile, currentNode, effectivePrevCol, trackerState.activeWordIndex, nowMs)
            : { activeColumn: effectivePrevCol, wordIndex: -1, intraWordFraction: 0, bestScore: 0, colScores: {} };

        // Run Online Coupled Slide Viterbi when 25Hz Zema posteriors are available (fused with Smith-Waterman for English)
        const rawViterbiEval = (hasPosteriorStream && currentNode && !trackerState.isSanctuaryInterludeVisible)
            ? updateOnlineCoupledViterbi(currentNode, primaryNextNode, primaryNextIdx, hopPosteriors, hopRms, trackerState, nowMs, shingleDotEval.colScores || null)
            : null;

        const chosenCol = (currentNode && !trackerState.isSanctuaryInterludeVisible)
            ? resolveLockedSpokenColumn(currentNode, rawViterbiEval, shingleDotEval, trackerState, obsProfile)
            : effectivePrevCol;

        const viterbiEval = (rawViterbiEval && chosenCol && rawViterbiEval.perColumn && rawViterbiEval.perColumn[chosenCol])
            ? { activeColumn: chosenCol, ...rawViterbiEval.perColumn[chosenCol], perColumn: rawViterbiEval.perColumn }
            : rawViterbiEval;

        const chosenSw = (chosenCol && shingleDotEval.colScores && shingleDotEval.colScores[chosenCol])
            ? shingleDotEval.colScores[chosenCol]
            : null;

        const isColumnConfirmed = Boolean(trackerState.lockedSpokenColumn && trackerState.lockedSpokenColumn === chosenCol);
        const allowImmediateDot = isColumnConfirmed || Boolean(
            viterbiEval && viterbiEval.wordIndex >= 0 && (
                (chosenCol === 'geez_script' && viterbiEval.emaLlr >= 0.14) ||
                (chosenCol !== 'geez_script' && viterbiEval.emaLlr >= 0.22)
            )
        );

        let dotEval = { activeColumn: chosenCol, wordIndex: -1, intraWordFraction: 0, bestScore: 0 };
        if (allowImmediateDot && viterbiEval && viterbiEval.emaLlr >= 0.08 && viterbiEval.wordIndex >= 0) {
            let finalWordIdx = viterbiEval.wordIndex;
            let finalFrac = viterbiEval.intraWordFraction;
            // Let high-confidence Smith-Waterman pull the dot smoothly ahead on English if Viterbi lags rapid speech
            if (chosenCol === 'english' && chosenSw && chosenSw.columnScore >= 0.30 && chosenSw.wordIndex > finalWordIdx && chosenSw.wordIndex <= finalWordIdx + 6) {
                finalWordIdx = chosenSw.wordIndex;
                finalFrac = chosenSw.intraWordFraction;
            }
            if (trackerState.activeSpokenColumn === chosenCol && trackerState.activeWordIndex > finalWordIdx && (trackerState.activeWordIndex - finalWordIdx) <= 3) {
                finalWordIdx = trackerState.activeWordIndex;
            }
            dotEval = {
                activeColumn: viterbiEval.activeColumn,
                wordIndex: finalWordIdx,
                intraWordFraction: finalFrac,
                bestScore: Math.min(1, Math.max(chosenSw ? chosenSw.columnScore : shingleDotEval.bestScore, 0.35 + viterbiEval.emaLlr * 0.45))
            };
        } else if (chosenCol && chosenSw && chosenSw.wordIndex >= 0 && (isColumnConfirmed || (!hasPosteriorStream && chosenSw.columnScore >= 0.26))) {
            dotEval = {
                activeColumn: chosenCol,
                wordIndex: chosenSw.wordIndex,
                intraWordFraction: chosenSw.intraWordFraction,
                bestScore: chosenSw.columnScore
            };
        }

        // Record end-of-slide completion state so a clean pause after the final word advances smoothly
        if (!trackerState.isSanctuaryInterludeVisible && currentNode && chosenCol && currentNode.columns && currentNode.columns[chosenCol]) {
            const colSeq = currentNode.columns[chosenCol];
            let lastSpokenIdx = (colSeq.words ? colSeq.words.length : 1) - 1;
            while (lastSpokenIdx > 0 && colSeq.words[lastSpokenIdx].isUnspokenRubric) lastSpokenIdx--;
            const isGeezCol = chosenCol === 'geez_script' || chosenCol === 'tigrinya_script';
            let reachedEnd = false;
            if (isGeezCol) {
                reachedEnd = Boolean(
                    viterbiEval && viterbiEval.emaLlr >= 0.16 &&
                    viterbiEval.wordIndex >= lastSpokenIdx &&
                    viterbiEval.stateIndex >= Math.max(0, viterbiEval.totalStates - 4)
                );
            } else {
                reachedEnd = Boolean(
                    (viterbiEval && viterbiEval.emaLlr >= 0.14 && (
                        viterbiEval.stateIndex >= Math.max(0, viterbiEval.totalStates - 3) ||
                        (dotEval.wordIndex >= Math.max(0, lastSpokenIdx - 1) && viterbiEval.stateIndex >= Math.floor(viterbiEval.totalStates * 0.78))
                    )) ||
                    (dotEval.wordIndex >= lastSpokenIdx && dotEval.bestScore >= 0.28)
                );
            }
            if (reachedEnd) {
                trackerState._endOfSlideMeta = {
                    slideIdx: currentSlideIdx,
                    col: chosenCol,
                    isGeez: isGeezCol,
                    reached: true,
                    reachedAtMs: nowMs
                };
            } else if (
                trackerState._endOfSlideMeta &&
                trackerState._endOfSlideMeta.slideIdx === currentSlideIdx &&
                viterbiEval && viterbiEval.stateIndex < Math.floor(viterbiEval.totalStates * 0.70) &&
                dotEval.wordIndex < Math.max(0, lastSpokenIdx - 1)
            ) {
                trackerState._endOfSlideMeta = null;
            }
        }

        // 2. Check Immediate +1 Local Forward Candidate (bridging only Section Titles / Inaudible Prayers)
        let bestLocalIdx = -1;
        let bestLocalEval = { score: 0, coverage: 0, distinctiveHits: 0 };
        if (currentNode && Array.isArray(currentNode.localNextIndices)) {
            for (const candIdx of currentNode.localNextIndices) {
                const candNode = graph.nodes[candIdx];
                const ev = scoreObservationAgainstNode(obsProfile, candNode, graph);
                if (ev.score > bestLocalEval.score) {
                    bestLocalEval = ev;
                    bestLocalIdx = candIdx;
                }
            }
        }

        const currentWordRatio = (currentNode && dotEval.activeColumn && currentNode.columns[dotEval.activeColumn] && dotEval.wordIndex >= 0)
            ? (dotEval.wordIndex + 1) / Math.max(1, currentNode.columns[dotEval.activeColumn].words.length)
            : 0;

        // Protect against premature +1 jump when we are still in the first half of the current slide
        // (e.g. parallel responsorial stanzas like 3:26 "One is the Holy Father" <-> 3:27 "Truly the Father is Holy")
        const viterbiMidSlideHold = Boolean(
            viterbiEval && viterbiEval.emaLlr >= 0.20 && currentWordRatio > 0 && currentWordRatio < 0.55
        );
        const shingleMidSlideHold = Boolean(
            !viterbiEval && currentScoreObj.score >= 0.16 && currentWordRatio > 0 && currentWordRatio < 0.50
        );

        const localBeatsCurrent = bestLocalIdx !== -1 && bestLocalEval.distinctiveHits >= 2 && (
            viterbiMidSlideHold
                ? (bestLocalEval.score >= 0.34 && bestLocalEval.score > currentScoreObj.score + 0.14)
                : shingleMidSlideHold
                    ? (bestLocalEval.score >= 0.28 && bestLocalEval.score > currentScoreObj.score + 0.10)
                    : ((bestLocalEval.score >= 0.19 && bestLocalEval.score > currentScoreObj.score + 0.05) ||
                       (currentWordRatio >= 0.60 && bestLocalEval.score >= 0.16 && bestLocalEval.coverage >= 0.14 && bestLocalEval.score > currentScoreObj.score + 0.02))
        );

        const scope = trackerState.activeScope || 'anchor';

        // 3. Handle Re-Entry FIRST if Sanctuary Icon Interlude (`With-her-beloved-Son.png`) is Currently Visible
        if (trackerState.isSanctuaryInterludeVisible) {
            let bestInterludeIdx = -1;
            let bestInterludeEval = { score: 0, coverage: 0, distinctiveHits: 0 };
            for (let idx = 0; idx < graph.nodes.length; idx++) {
                const node = graph.nodes[idx];
                if (node.isSectionTitle || node.isInaudible || node.isRepetitiveRefrain) continue;
                const ev = scoreObservationAgainstNode(obsProfile, node, graph);
                let rankScore = ev.score;
                // Strong forward-chronological bias when recovering from an off-book interlude
                if (idx >= currentSlideIdx && idx <= currentSlideIdx + 25) {
                    rankScore += 0.06;
                }
                if (rankScore > bestInterludeEval.score && ev.distinctiveHits >= 2) {
                    bestInterludeEval = { ...ev, score: rankScore };
                    bestInterludeIdx = idx;
                }
            }

            if (bestInterludeIdx !== -1 && bestInterludeEval.score >= 0.25 && bestInterludeEval.distinctiveHits >= 3) {
                if (trackerState.reacquireCandidateIdx === bestInterludeIdx || Math.abs(trackerState.reacquireCandidateIdx - bestInterludeIdx) <= 1) {
                    trackerState.reacquireStreak++;
                } else {
                    trackerState.reacquireCandidateIdx = bestInterludeIdx;
                    trackerState.reacquireStreak = 1;
                }

                if (trackerState.reacquireStreak >= OFFBOOK_REACQUIRE_CONFIRM_WINDOWS) {
                    trackerState.isSanctuaryInterludeVisible = false;
                    trackerState.unmatchedVoicedMs = 0;
                    trackerState.reacquireStreak = 0;
                    trackerState.localSkipStreak = 0;
                    trackerState.activeScope = 'anchor';
                    return {
                        action: 'exit_interlude_to_slide',
                        targetSlideIndex: bestInterludeIdx,
                        confidence: bestInterludeEval.score
                    };
                }
                return { action: 'interlude_confirming', candidateIdx: bestInterludeIdx };
            }

            if (shadowBranches) {
                let bestBackboneMatch = null;
                for (const bb of (shadowBranches.apostlesBackbone || [])) {
                    const fakeNode = {
                        isSectionTitle: false,
                        allShingles: bb.seq.shingles,
                        allConsShingles: bb.seq.consShingles
                    };
                    const ev = scoreObservationAgainstNode(obsProfile, fakeNode, graph);
                    if (ev.score >= 0.25 && ev.distinctiveHits >= 2 && (!bestBackboneMatch || ev.score > bestBackboneMatch.score)) {
                        bestBackboneMatch = { ...bb, score: ev.score };
                    }
                }
                if (bestBackboneMatch) {
                    trackerState.isSanctuaryInterludeVisible = false;
                    trackerState.usingApostlesBackboneFallback = true;
                    trackerState.unmatchedVoicedMs = 0;
                    trackerState.reacquireStreak = 0;
                    trackerState.activeScope = 'anchor';
                    return {
                        action: 'exit_interlude_to_apostles_backbone',
                        cardId: bestBackboneMatch.cardId,
                        confidence: bestBackboneMatch.score
                    };
                }
            }

            return { action: 'stay_in_interlude' };
        }

        // 4. Advance +1 Locally When Next Slide Beats Current (or Coupled 25Hz Viterbi Crosses Boundary)
        if (localBeatsCurrent || (viterbiEval && viterbiEval.crossedToNext)) {
            const targetIdx = (viterbiEval && viterbiEval.crossedToNext) ? viterbiEval.nextSlideIdx : bestLocalIdx;
            if (viterbiEval && viterbiEval.crossedToNext) {
                trackerState._pendingNextSeed = {
                    slideIdx: targetIdx,
                    langKey: viterbiEval.activeColumn,
                    stateOffset: viterbiEval.nextSeedStateOffset
                };
            }
            trackerState._viterbiSession = null;
            trackerState.unmatchedVoicedMs = 0;
            trackerState.reacquireStreak = 0;
            trackerState.localSkipStreak = 0;
            trackerState.localSkipCandidateIdx = -1;
            return {
                action: 'advance_local',
                targetSlideIndex: targetIdx,
                confidence: viterbiEval && viterbiEval.crossedToNext ? Math.min(1, 0.5 + viterbiEval.emaLlr * 0.35) : bestLocalEval.score,
                dotEval
            };
        }

        // 4b. In Anaphora zone (or unmistakable opening incipit `stanzaOffset <= 2`):
        //     check if clergy began the Unselected Anaphora (e.g. St. Mary instead of Apostles).
        //     Requires beating BOTH current slide (`+0.08`) and local +1 (`+0.04`) with distinctive shingles!
        if (shadowBranches && trackerState.anaphoraSwitchMode !== 'strict_selected') {
            const inAnaphoraContext = !currentNode || currentNode.zone === 'anaphora' || scope === 'anaphora' || scope === 'unknown';
            let bestAnaphoraHit = null;
            for (const br of (shadowBranches.unselectedAnaphora || [])) {
                if (!inAnaphoraContext && br.stanzaOffset > 2) continue;
                const fakeNode = {
                    isSectionTitle: false,
                    allShingles: br.seq.shingles,
                    allConsShingles: br.seq.consShingles
                };
                const ev = scoreObservationAgainstNode(obsProfile, fakeNode, graph);
                const minScore = inAnaphoraContext ? 0.21 : 0.35;
                const minDistinctive = inAnaphoraContext ? 2 : 4;
                const suppKey = `anaphora:${br.anaphoraKey}`;
                const suppressedUntil = trackerState.suppressedTargets.get(suppKey) || 0;
                const beatsCurrent = (ev.score > currentScoreObj.score + 0.08) ||
                    (ev.rawIdfScore > (currentScoreObj.rawIdfScore || 0) * 1.35 + 8 && ev.distinctiveHits >= (currentScoreObj.distinctiveHits || 0) + 4);
                const beatsLocal = (ev.score > bestLocalEval.score + 0.04) ||
                    (ev.rawIdfScore > (bestLocalEval.rawIdfScore || 0) * 1.35 + 8);
                if (
                    ev.score >= minScore &&
                    ev.distinctiveHits >= minDistinctive &&
                    nowMs > suppressedUntil &&
                    beatsCurrent &&
                    beatsLocal
                ) {
                    if (!bestAnaphoraHit || ev.rawIdfScore > bestAnaphoraHit.ev.rawIdfScore) {
                        bestAnaphoraHit = { br, ev, suppKey };
                    }
                }
            }
            if (bestAnaphoraHit) {
                trackerState.unmatchedVoicedMs = 0;
                trackerState.isSanctuaryInterludeVisible = false;
                return {
                    action: trackerState.autonomyMode === 'autonomous' ? 'switch_anaphora_immediate' : 'prompt_copilot',
                    branchType: 'anaphora',
                    anaphoraKey: bestAnaphoraHit.br.anaphoraKey,
                    cardId: bestAnaphoraHit.br.cardId,
                    label: bestAnaphoraHit.br.label,
                    confidence: bestAnaphoraHit.ev.score,
                    suppressionKey: bestAnaphoraHit.suppKey
                };
            }
        }

        // 5. Check if Current Slide is Actively Matching (Shingles OR Continuous Zema Viterbi!)
        //    CRITICAL: When the current slide IS matching, STAY LOCKED on it — NEVER jump elsewhere!
        const isLongSlide = currentNode && currentNode.allShingles.size > 140;
        const viterbiActivelyTracking = Boolean(
            viterbiEval &&
            scope !== 'unknown' &&
            viterbiEval.emaLlr >= (isLongSlide ? 0.24 : 0.14) &&
            viterbiEval.wordIndex >= 0
        );
        const isCurrentMatching = scope !== 'unknown' && (viterbiActivelyTracking || (isLongSlide
            ? (currentScoreObj.score >= 0.16 && currentScoreObj.distinctiveHits >= 2)
            : ((currentScoreObj.score >= 0.15 && currentScoreObj.distinctiveHits >= 2) ||
               (currentScoreObj.score >= 0.12 && currentScoreObj.distinctiveHits >= 1 && dotEval.bestScore >= 0.45))));

        if (isCurrentMatching) {
            trackerState.unmatchedVoicedMs = 0;
            trackerState.localSkipStreak = 0;
            trackerState.localSkipCandidateIdx = -1;
            return {
                action: 'track_current_slide',
                dotEval,
                confidence: Math.max(currentScoreObj.score, dotEval.bestScore)
            };
        }

        // 6. Bounded Short Forward Skip (+2 or +3 audible slides) ONLY after 2 consecutive high-confidence hops
        //    Handles the rare case where clergy skip 1-2 prayer cards right ahead without ever jumping wildly!
        if (currentNode && Array.isArray(currentNode.shortSkipIndices) && currentNode.shortSkipIndices.length > 0) {
            let bestSkipIdx = -1;
            let bestSkipEval = { score: 0, coverage: 0, distinctiveHits: 0 };
            for (const skipIdx of currentNode.shortSkipIndices) {
                const skipNode = graph.nodes[skipIdx];
                if (!skipNode || skipNode.isRepetitiveRefrain) continue;
                const ev = scoreObservationAgainstNode(obsProfile, skipNode, graph);
                if (ev.score > bestSkipEval.score) {
                    bestSkipEval = ev;
                    bestSkipIdx = skipIdx;
                }
            }
            if (bestSkipIdx !== -1 && bestSkipEval.score >= 0.27 && bestSkipEval.distinctiveHits >= 3 && bestSkipEval.score > currentScoreObj.score + 0.10) {
                if (trackerState.localSkipCandidateIdx === bestSkipIdx) {
                    trackerState.localSkipStreak = (trackerState.localSkipStreak || 0) + 1;
                } else {
                    trackerState.localSkipCandidateIdx = bestSkipIdx;
                    trackerState.localSkipStreak = 1;
                }
                if (trackerState.localSkipStreak >= 2) {
                    trackerState._viterbiSession = null;
                    trackerState.unmatchedVoicedMs = 0;
                    trackerState.localSkipStreak = 0;
                    trackerState.localSkipCandidateIdx = -1;
                    return {
                        action: 'advance_local',
                        targetSlideIndex: bestSkipIdx,
                        confidence: bestSkipEval.score,
                        dotEval
                    };
                }
            } else {
                trackerState.localSkipStreak = 0;
                trackerState.localSkipCandidateIdx = -1;
            }
        }

        // 7. Day-of-Kidase Stanza Variants (`2-73/74/75`), evaluated ONLY in Chapter 2 or 'unknown' scope
        if (shadowBranches && trackerState.anaphoraSwitchMode !== 'strict_selected') {
            const inDayVariantContext = !currentNode || /^2-/.test(currentNode.cardId || '') || scope === 'unknown';
            if (inDayVariantContext) {
                for (const dv of (shadowBranches.dayVariants || [])) {
                    const fakeNode = {
                        isSectionTitle: false,
                        allShingles: dv.seq.shingles,
                        allConsShingles: dv.seq.consShingles
                    };
                    const ev = scoreObservationAgainstNode(obsProfile, fakeNode, graph);
                    const suppKey = `day:${dv.day}`;
                    const suppressedUntil = trackerState.suppressedTargets.get(suppKey) || 0;
                    if (ev.score >= 0.28 && ev.distinctiveHits >= 2 && nowMs > suppressedUntil) {
                        trackerState.unmatchedVoicedMs = 0;
                        return {
                            action: trackerState.autonomyMode === 'autonomous' ? 'switch_day_immediate' : 'prompt_copilot',
                            branchType: 'kidase_day',
                            day: dv.day,
                            cardId: dv.cardId,
                            label: dv.label,
                            confidence: ev.score,
                            suppressionKey: suppKey
                        };
                    }
                }
            }
        }

        // 8. Scoped / Global Discovery Search — ONLY when user explicitly chose "I don't know where we're at"
        //    (`scope === 'unknown'`) or a section finder scope (`scope !== 'anchor'`)!
        //    CRITICAL: When `scope === 'anchor'` ("Follow from current slide"), NEVER teleport globally!
        if (scope !== 'anchor') {
            let bestGlobalIdx = -1;
            let bestGlobalEval = { score: 0, coverage: 0, distinctiveHits: 0 };

            for (let idx = 0; idx < graph.nodes.length; idx++) {
                const node = graph.nodes[idx];
                if (node.isSectionTitle || node.isInaudible || node.isRepetitiveRefrain) continue;
                if (scope !== 'unknown' && node.zone !== scope) continue;

                const ev = scoreObservationAgainstNode(obsProfile, node, graph);
                let rankScore = ev.score;
                if (idx > currentSlideIdx && idx <= currentSlideIdx + 25) {
                    rankScore += 0.03;
                }
                if (rankScore > bestGlobalEval.score && ev.distinctiveHits >= 2) {
                    bestGlobalEval = { ...ev, score: rankScore };
                    bestGlobalIdx = idx;
                }
            }

            const minGlobalScore = scope === 'unknown' ? 0.25 : 0.30;
            const minGlobalHits = 3;
            if (bestGlobalIdx !== -1 && bestGlobalIdx !== currentSlideIdx && bestGlobalEval.score >= minGlobalScore && bestGlobalEval.distinctiveHits >= minGlobalHits) {
                const suppKey = `slide:${bestGlobalIdx}`;
                const suppressedUntil = trackerState.suppressedTargets.get(suppKey) || 0;
                if (nowMs > suppressedUntil && trackerState.autonomyMode !== 'anchored') {
                    trackerState.unmatchedVoicedMs = 0;
                    if (scope === 'unknown' || trackerState.autonomyMode === 'autonomous') {
                        // Lock back to sequential 'anchor' mode immediately once place is found!
                        trackerState.activeScope = 'anchor';
                        return {
                            action: 'jump_global_immediate',
                            targetSlideIndex: bestGlobalIdx,
                            confidence: bestGlobalEval.score
                        };
                    }
                    const targetNode = graph.nodes[bestGlobalIdx];
                    return {
                        action: 'prompt_copilot',
                        branchType: 'slide_jump',
                        targetSlideIndex: bestGlobalIdx,
                        cardId: targetNode.cardId,
                        label: targetNode.cardId ? `Stanza ${targetNode.cardId}` : `Slide ${bestGlobalIdx + 1}`,
                        confidence: bestGlobalEval.score,
                        suppressionKey: suppKey
                    };
                }
            }
        }

        // 9. Sustained Off-Book Speech/Chant -> Smoothly Cross-Fade into Mary with Her Beloved Son
        //    In live anchored Follow mode (`isActive && scope === 'anchor'`), require 15s of genuinely
        //    unmatched voice so soft/slow chanting on the current slide NEVER blanks/fades the screen!
        trackerState.unmatchedVoicedMs += windowDurationMs;
        const interludeEnterMs = (trackerState.isActive && scope === 'anchor') ? 15000 : OFFBOOK_ENTER_VOICED_MS;
        if (trackerState.unmatchedVoicedMs >= interludeEnterMs) {
            trackerState.isSanctuaryInterludeVisible = true;
            trackerState.reacquireStreak = 0;
            trackerState.reacquireCandidateIdx = -1;
            return {
                action: 'enter_sanctuary_interlude',
                unmatchedVoicedMs: trackerState.unmatchedVoicedMs
            };
        }

        return {
            action: 'listening_unmatched',
            unmatchedVoicedMs: trackerState.unmatchedVoicedMs
        };
    }

    // =========================================================================
    // 4. ACTIVE-SLIDE DOM TOKENIZATION & DUAL RED-DOT OVERLAY (`dot_plus_glow`)
    // =========================================================================

    /**
     * Aligns Ge'ez word indices in `.lang-geez_script` with their corresponding
     * congregation chant words in `<i class="geez-phonetic-append">` so both dots
     * glide in 100% mathematical lockstep when the congregation chants.
     */
    function computeGeezToPhoneticWordMap(geezWords, phoneticWords) {
        const map = new Array(geezWords.length).fill(-1);
        if (!geezWords.length || !phoneticWords.length) return map;

        let pCursor = 0;
        for (let g = 0; g < geezWords.length && pCursor < phoneticWords.length; g++) {
            const gObj = toCanonicalAcousticSkeleton(geezWords[g]);
            if (!gObj.full && !gObj.consonants) continue;

            // Look ahead a bounded window in phoneticWords (handles Priest lines skipped by filterGeezPhoneticForPeople
            // and 6th-order Ge'ez epenthetic 'i'/'e' differences by matching consonant skeletons!)
            for (let p = pCursor; p < Math.min(phoneticWords.length, pCursor + 8); p++) {
                const pObj = toCanonicalAcousticSkeleton(phoneticWords[p]);
                if (!pObj.full && !pObj.consonants) continue;

                const exactFull = gObj.full && gObj.full === pObj.full;
                const exactCons = gObj.consonants.length >= 2 && gObj.consonants === pObj.consonants;
                const lenDiff = Math.abs(gObj.consonants.length - pObj.consonants.length);
                const subCons = lenDiff <= 1 && gObj.consonants.length >= 3 && pObj.consonants.length >= 3 &&
                    (pObj.consonants.includes(gObj.consonants) || gObj.consonants.includes(pObj.consonants));

                if (exactFull || exactCons || subCons) {
                    map[g] = p;
                    pCursor = p + 1;
                    break;
                }
            }
        }
        return map;
    }

    function wrapTextNodesWithWordSpans(rootEl, className, attrName) {
        if (!rootEl || typeof document === 'undefined') return [];

        const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                if (node.parentElement && (
                    (node.parentElement.closest('.geez-phonetic-append') && className !== 'mom-track-phon-word') ||
                    node.parentElement.closest('.zaima-word, .zaima-rt, .zaima-beit-margin, .zaima-speaker-rubric, .zaima-punct') ||
                    node.parentElement.tagName === 'SUP'
                )) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        });

        const textNodes = [];
        let cur;
        while ((cur = walker.nextNode())) textNodes.push(cur);

        for (const tNode of textNodes) {
            const parts = tNode.nodeValue.split(/(\s+)/);
            const frag = document.createDocumentFragment();
            for (const part of parts) {
                if (!part) continue;
                if (/^\s+$/.test(part) || /^[፠፨፡።፣፤፥፦፧.,;:!?()[\]—–-]+$/.test(part)) {
                    frag.appendChild(document.createTextNode(part));
                } else if (INLINE_SPEAKER_TOKEN_REGEX.test(part.trim())) {
                    // Do not wrap speaker rubrics as chanted words
                    frag.appendChild(document.createTextNode(part));
                } else {
                    const span = document.createElement('span');
                    span.className = className;
                    span.textContent = part;
                    frag.appendChild(span);
                }
            }
            if (tNode.parentNode) {
                tNode.parentNode.replaceChild(frag, tNode);
            }
        }

        // Mark any pre-rendered `.zaima-word` composite musical cells as atomic word units
        // so mixed Zaima + plain stanzas are collected in exact DOM document order!
        if (className === 'mom-track-word') {
            rootEl.querySelectorAll('.zaima-word').forEach(zw => {
                if (!zw.closest('.geez-phonetic-append')) {
                    zw.classList.add(className);
                }
            });
        }

        const orderedWords = Array.from(rootEl.querySelectorAll('.' + className)).filter(el => {
            if (className !== 'mom-track-phon-word' && el.closest('.geez-phonetic-append')) return false;
            return true;
        });
        orderedWords.forEach((el, idx) => el.setAttribute(attrName, String(idx)));
        return orderedWords;
    }

    function cleanupInstrumentedSlide() {
        if (!instrumentedCard || typeof document === 'undefined') return;
        const meta = instrumentedCard._momTrackerMeta;
        if (meta) {
            if (meta.activeWordEl) meta.activeWordEl.classList.remove('mom-word-active');
            if (meta.activePhonEl) meta.activePhonEl.classList.remove('mom-word-active');
            if (meta.dotLayer && meta.dotLayer.parentNode) meta.dotLayer.parentNode.removeChild(meta.dotLayer);
            delete instrumentedCard._momTrackerMeta;
        }
        instrumentedCard.querySelectorAll('.mom-red-dot-layer').forEach(el => el.remove());
        instrumentedCard.querySelectorAll('.mom-word-active').forEach(el => el.classList.remove('mom-word-active'));
        instrumentedCard.querySelectorAll('.mom-track-word, .mom-track-phon-word').forEach(span => {
            if (span.classList.contains('zaima-word')) {
                span.classList.remove('mom-track-word');
                span.removeAttribute('data-mom-w');
                return;
            }
            const txt = document.createTextNode(span.textContent || '');
            if (span.parentNode) {
                span.parentNode.replaceChild(txt, span);
            }
        });
        instrumentedCard.normalize();
        instrumentedCard = null;
    }

    function ensureSlideInstrumented(cardEl) {
        if (!cardEl || typeof document === 'undefined') return null;
        if (instrumentedCard === cardEl && cardEl._momTrackerMeta) {
            return cardEl._momTrackerMeta;
        }
        cleanupInstrumentedSlide();

        // CRITICAL: Never set inline `cardEl.style.position = 'relative'`!
        // In Slides Mode (`transition-fade` uses `position: absolute` and `transition-slide` uses
        // CSS `position: relative`), an inline `position: relative` overrides `transition-fade` and
        // stacks hidden inactive slides vertically (100vh each), pushing the active slide off-screen!
        const dotLayer = document.createElement('div');
        dotLayer.className = 'mom-red-dot-layer';
        dotLayer.setAttribute('aria-hidden', 'true');
        dotLayer.innerHTML =
            '<span class="mom-red-dot mom-red-dot-primary no-glide" style="opacity:0"></span>' +
            '<span class="mom-red-dot mom-red-dot-phonetic no-glide" style="opacity:0"></span>';
        cardEl.appendChild(dotLayer);

        const colSpans = {};
        let phoneticSpans = [];
        let geezToPhonMap = [];

        cardEl.querySelectorAll('.language-section').forEach(sec => {
            const langCls = Array.from(sec.classList).find(c => c.startsWith('lang-') && c !== 'lang-phonetic' && c !== 'lang-ethiopic-script');
            const langKey = langCls ? langCls.slice(5) : '';
            const pEl = sec.querySelector('.language-text');
            if (!langKey || !pEl) return;

            colSpans[langKey] = wrapTextNodesWithWordSpans(pEl, 'mom-track-word', 'data-mom-w');
            if (langKey === 'geez_script') {
                const phonAppend = pEl.querySelector('.geez-phonetic-append');
                if (phonAppend) {
                    phoneticSpans = wrapTextNodesWithWordSpans(phonAppend, 'mom-track-phon-word', 'data-mom-pw');
                    geezToPhonMap = computeGeezToPhoneticWordMap(
                        colSpans[langKey].map(s => s.getAttribute('data-zaima-base') || s.textContent || ''),
                        phoneticSpans.map(s => s.textContent || '')
                    );
                }
            }
        });

        const meta = {
            dotLayer,
            primaryDot: dotLayer.querySelector('.mom-red-dot-primary'),
            phoneticDot: dotLayer.querySelector('.mom-red-dot-phonetic'),
            colSpans,
            phoneticSpans,
            geezToPhonMap,
            activeWordEl: null,
            activePhonEl: null,
            lastRenderedLangKey: null
        };
        cardEl._momTrackerMeta = meta;
        instrumentedCard = cardEl;
        return meta;
    }

    function renderRedDotPosition(cardEl, langKey, wordIndex, intraFraction) {
        if (!cardEl || state.trackerStyle === 'off' || wordIndex < 0) return;
        const meta = ensureSlideInstrumented(cardEl);
        if (!meta) return;

        const spans = meta.colSpans[langKey] || [];
        if (!spans.length) {
            if (meta.activeWordEl) { meta.activeWordEl.classList.remove('mom-word-active'); meta.activeWordEl = null; }
            if (meta.activePhonEl) { meta.activePhonEl.classList.remove('mom-word-active'); meta.activePhonEl = null; }
            meta.primaryDot.style.opacity = '0';
            meta.phoneticDot.style.opacity = '0';
            return;
        }

        const clampedIdx = Math.min(spans.length - 1, Math.max(0, wordIndex));
        const targetSpan = spans[clampedIdx];
        if (!targetSpan) return;

        const phonIdx = (langKey === 'geez_script' && meta.phoneticSpans.length > 0 && meta.geezToPhonMap[clampedIdx] >= 0)
            ? meta.geezToPhonMap[clampedIdx]
            : -1;
        const phonSpan = phonIdx >= 0 ? meta.phoneticSpans[phonIdx] : null;

        // 1. READ PHASE FIRST: Read all layout geometry BEFORE mutating any DOM classes or styles
        //    so the browser never triggers a `[Violation] Forced reflow`!
        const cardRect = cardEl.getBoundingClientRect();
        const wordRect = targetSpan.getBoundingClientRect();
        const pRect = phonSpan ? phonSpan.getBoundingClientRect() : null;

        // 2. WRITE PHASE: Mutate classes and GPU-composited transforms in one clean batch
        if (meta.activeWordEl && meta.activeWordEl !== targetSpan) {
            meta.activeWordEl.classList.remove('mom-word-active');
            meta.activeWordEl = null;
        }
        if (state.trackerStyle === 'dot_plus_glow') {
            if (meta.activeWordEl !== targetSpan) {
                targetSpan.classList.add('mom-word-active');
                meta.activeWordEl = targetSpan;
            }
        }

        const isColumnChange = meta.lastRenderedLangKey !== langKey;
        meta.lastRenderedLangKey = langKey;

        if (cardRect.width > 0 && wordRect.width > 0) {
            const frac = Math.max(0.15, Math.min(0.85, intraFraction || 0.5));
            const x = (wordRect.left - cardRect.left) + wordRect.width * frac;
            const y = (wordRect.bottom - cardRect.top) + 2;
            if (isColumnChange) {
                meta.primaryDot.classList.add('no-glide');
            }
            meta.primaryDot.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
            meta.primaryDot.style.opacity = '1';
            if (isColumnChange && typeof requestAnimationFrame === 'function') {
                requestAnimationFrame(() => {
                    if (meta.primaryDot) meta.primaryDot.classList.remove('no-glide');
                });
            }
        }

        // Dual Ge'ez + Phonetic Congregation Chant Dot!
        if (phonSpan) {
            if (meta.activePhonEl && meta.activePhonEl !== phonSpan) {
                meta.activePhonEl.classList.remove('mom-word-active');
                meta.activePhonEl = null;
            }
            if (state.trackerStyle === 'dot_plus_glow' && meta.activePhonEl !== phonSpan) {
                phonSpan.classList.add('mom-word-active');
                meta.activePhonEl = phonSpan;
            }
            if (pRect && pRect.width > 0) {
                const frac = Math.max(0.15, Math.min(0.85, intraFraction || 0.5));
                const px = (pRect.left - cardRect.left) + pRect.width * frac;
                const py = (pRect.bottom - cardRect.top) + 2;
                if (isColumnChange) {
                    meta.phoneticDot.classList.add('no-glide');
                }
                meta.phoneticDot.style.transform = `translate3d(${Math.round(px)}px, ${Math.round(py)}px, 0)`;
                meta.phoneticDot.style.opacity = '1';
                if (isColumnChange && typeof requestAnimationFrame === 'function') {
                    requestAnimationFrame(() => {
                        if (meta.phoneticDot) meta.phoneticDot.classList.remove('no-glide');
                    });
                }
            }
        } else {
            if (meta.activePhonEl) {
                meta.activePhonEl.classList.remove('mom-word-active');
                meta.activePhonEl = null;
            }
            meta.phoneticDot.style.opacity = '0';
        }
    }

    // =========================================================================
    // 5. SANCTUARY ICON INTERLUDE, CO-PILOT TOAST & SLIDES FOOTER UI
    // =========================================================================

    function resolveIconPath(relPath) {
        return String(relPath || '').replace(/^\//, '');
    }

    function ensureOverlayDomElements() {
        if (typeof document === 'undefined') return;

        // 1. Sanctuary Icon Interlude (`Mary with Her Beloved Son`)
        if (!document.getElementById('slides-sanctuary-interlude')) {
            const interlude = document.createElement('div');
            interlude.id = 'slides-sanctuary-interlude';
            interlude.className = 'slides-sanctuary-interlude';
            interlude.setAttribute('aria-hidden', 'true');
            const primarySrc = resolveIconPath('img/With-her-beloved-Son.png');
            const fallbackSrc = resolveIconPath('img/Mary-with-her-beloved-Son.svg');
            interlude.innerHTML = `
                <div class="sanctuary-interlude-inner">
                    <div class="sanctuary-interlude-frame">
                        <img
                            id="sanctuary-interlude-img"
                            src="${primarySrc}"
                            alt="Mary with Her Beloved Son — ምስለ ፍቍር ወልዳ"
                            class="sanctuary-interlude-img"
                        />
                    </div>
                    <div class="sanctuary-interlude-caption">
                        <span class="ethiopic-label sanctuary-interlude-geez">ምስለ ፍቍር ወልዳ</span>
                        <span class="sanctuary-interlude-sep" aria-hidden="true">፨</span>
                        <span class="sanctuary-interlude-eng">With Her Beloved Son</span>
                    </div>
                    <div class="sanctuary-interlude-status">
                        <span class="sanctuary-listening-dot" aria-hidden="true"></span>
                        <span>Listening for next prayer in <i>Ḳidasé</i>…</span>
                    </div>
                </div>
            `;
            const imgEl = interlude.querySelector('#sanctuary-interlude-img');
            if (imgEl) {
                imgEl.addEventListener('error', () => {
                    if (imgEl.getAttribute('src') !== fallbackSrc) {
                        imgEl.setAttribute('src', fallbackSrc);
                    }
                }, { once: true });
            }
            interlude.addEventListener('click', () => {
                // Allow projectionist to dismiss interlude manually with a single click
                setSanctuaryInterludeVisible(false);
            });
            document.body.appendChild(interlude);
        }

        // 2. Co-Pilot 3-Second Auto-Confirm Toast Pill
        if (!document.getElementById('liturgy-copilot-toast')) {
            const toast = document.createElement('div');
            toast.id = 'liturgy-copilot-toast';
            toast.className = 'liturgy-copilot-toast';
            toast.style.display = 'none';
            document.body.appendChild(toast);
        }

        // 3. Scope Selector Popover ("Where are we in the service?")
        if (!document.getElementById('liturgy-scope-popover')) {
            const pop = document.createElement('div');
            pop.id = 'liturgy-scope-popover';
            pop.className = 'liturgy-scope-popover';
            pop.style.display = 'none';
            const itemsHtml = LITURGY_SCOPES.map(s => `
                <button type="button" class="liturgy-scope-option" data-scope-id="${s.id}">
                    <span class="liturgy-scope-opt-title">${s.label}</span>
                    <span class="liturgy-scope-opt-sub">${s.sub}</span>
                </button>
            `).join('');
            pop.innerHTML = `
                <div class="liturgy-scope-popover-header">
                    <div class="liturgy-scope-header-title">
                        <span>Where are we in the service?</span>
                        <span class="liturgy-scope-beta-pill" title="Audio Auto-Follow is currently a Beta feature">Beta</span>
                    </div>
                    <button type="button" class="liturgy-scope-close-btn" aria-label="Close">&times;</button>
                </div>
                <div class="liturgy-scope-beta-note">
                    <strong>Beta Feature:</strong> Live audio auto-follow &amp; word tracking are experimental.
                </div>
                <div class="liturgy-scope-options-list">${itemsHtml}</div>
                <div class="liturgy-scope-guide-footer">
                    <button type="button" class="liturgy-open-guide-btn">
                        <span>📖 Liturgy Map, Glossary &amp; Guide (መዝገበ ቅዳሴ)</span>
                    </button>
                </div>
            `;
            const guideBtn = pop.querySelector('.liturgy-open-guide-btn');
            if (guideBtn) {
                guideBtn.addEventListener('click', () => {
                    pop.style.display = 'none';
                    if (typeof window !== 'undefined' && typeof window.openLiturgyGuideModal === 'function') {
                        window.openLiturgyGuideModal();
                    }
                });
            }
            pop.querySelector('.liturgy-scope-close-btn').addEventListener('click', () => {
                pop.style.display = 'none';
            });
            pop.querySelectorAll('.liturgy-scope-option').forEach(btn => {
                btn.addEventListener('click', () => {
                    const scopeId = btn.getAttribute('data-scope-id') || 'anchor';
                    state.activeScope = scopeId;
                    pop.style.display = 'none';
                    updateAllFooterButtonsUI();
                    if (!state.isActive) {
                        startAutoFollow(scopeId);
                    }
                });
            });
            document.body.appendChild(pop);
        }
    }

    function setSanctuaryInterludeVisible(visible, onBeforeFadeOut = null) {
        if (typeof document === 'undefined') return;
        ensureOverlayDomElements();
        const el = document.getElementById('slides-sanctuary-interlude');
        if (!el) return;

        state.isSanctuaryInterludeVisible = Boolean(visible);
        if (visible) {
            el.setAttribute('aria-hidden', 'false');
            el.classList.add('is-visible');
        } else {
            if (typeof onBeforeFadeOut === 'function') {
                // Execute slide jump & dynamic font sizing while icon is STILL opaque!
                onBeforeFadeOut();
            }
            requestAnimationFrame(() => {
                el.classList.remove('is-visible');
                el.setAttribute('aria-hidden', 'true');
            });
        }
    }

    function dismissCopilotToast(suppressCurrent = false) {
        if (copilotTimerId) {
            clearTimeout(copilotTimerId);
            copilotTimerId = null;
        }
        if (copilotIntervalId) {
            clearInterval(copilotIntervalId);
            copilotIntervalId = null;
        }
        if (suppressCurrent && state.pendingCopilotAction && state.pendingCopilotAction.suppressionKey) {
            state.suppressedTargets.set(state.pendingCopilotAction.suppressionKey, Date.now() + 25000);
        }
        state.pendingCopilotAction = null;
        if (typeof document !== 'undefined') {
            const toast = document.getElementById('liturgy-copilot-toast');
            if (toast) toast.style.display = 'none';
        }
    }

    function executeCopilotDecision(decision) {
        if (!decision) return;
        dismissCopilotToast(false);

        if (decision.branchType === 'anaphora' && decision.anaphoraKey) {
            const sel = typeof document !== 'undefined' ? document.getElementById('anaphora-selector') : null;
            if (sel && sel.value !== decision.anaphoraKey) {
                sel.value = decision.anaphoraKey;
                sel.dispatchEvent(new Event('change', { bubbles: true }));
                setTimeout(() => {
                    rebuildActiveGraph();
                    jumpToCardIdInSlides(decision.cardId || (decision.anaphoraKey === 'mary' ? 'St.Mary-1' : 'Apostles-1'));
                }, 80);
                return;
            }
        }

        if (decision.branchType === 'kidase_day' && decision.day) {
            if (typeof window !== 'undefined' && typeof window.switchKidaseDayAndNavigate === 'function') {
                window.switchKidaseDayAndNavigate(decision.day, decision.cardId);
                setTimeout(() => rebuildActiveGraph(), 80);
                return;
            }
        }

        state.activeScope = 'anchor';
        if (typeof decision.targetSlideIndex === 'number' && decision.targetSlideIndex >= 0) {
            jumpToSlideIndex(decision.targetSlideIndex);
        } else if (decision.cardId) {
            jumpToCardIdInSlides(decision.cardId);
        }
        updateAllFooterButtonsUI();
    }

    function showCopilotPrompt(decision) {
        if (typeof document === 'undefined') return;
        if (state.pendingCopilotAction && state.pendingCopilotAction.suppressionKey === decision.suppressionKey) {
            return; // Already counting down for this exact target
        }
        dismissCopilotToast(false);
        ensureOverlayDomElements();

        const toast = document.getElementById('liturgy-copilot-toast');
        if (!toast) return;

        state.pendingCopilotAction = decision;
        const startedAt = Date.now();
        toast.innerHTML = `
            <div class="copilot-toast-body">
                <span class="copilot-toast-pulse" aria-hidden="true"></span>
                <span class="copilot-toast-text">Heard <strong>${decision.label || 'Next Section'}</strong> — jumping in <span id="copilot-sec-left">3</span>s</span>
                <button type="button" class="copilot-btn copilot-btn-confirm">Jump Now ↵</button>
                <button type="button" class="copilot-btn copilot-btn-cancel">Stay</button>
            </div>
            <div class="copilot-toast-progress"><div class="copilot-toast-bar" id="copilot-toast-bar"></div></div>
        `;
        toast.style.display = 'block';

        const bar = toast.querySelector('#copilot-toast-bar');
        if (bar) {
            requestAnimationFrame(() => { bar.style.width = '0%'; });
        }

        toast.querySelector('.copilot-btn-confirm').addEventListener('click', () => executeCopilotDecision(decision));
        toast.querySelector('.copilot-btn-cancel').addEventListener('click', () => dismissCopilotToast(true));

        copilotIntervalId = setInterval(() => {
            const rem = Math.max(1, Math.ceil((COPILOT_COUNTDOWN_MS - (Date.now() - startedAt)) / 1000));
            const secEl = document.getElementById('copilot-sec-left');
            if (secEl) secEl.textContent = String(rem);
        }, 250);

        copilotTimerId = setTimeout(() => {
            executeCopilotDecision(decision);
        }, COPILOT_COUNTDOWN_MS);
    }

    let _controlPrototype = null;
    let _delegatedFooterListenerBound = false;

    function ensureDelegatedFooterListeners() {
        if (_delegatedFooterListenerBound || typeof document === 'undefined') return;
        _delegatedFooterListenerBound = true;
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (!target || typeof target.closest !== 'function') return;

            const mainBtn = target.closest('.liturgy-autofollow-btn');
            if (mainBtn) {
                e.stopPropagation();
                toggleAutoFollow();
                return;
            }

            const scopeBtn = target.closest('.liturgy-scope-btn');
            if (scopeBtn) {
                e.stopPropagation();
                ensureOverlayDomElements();
                const pop = document.getElementById('liturgy-scope-popover');
                if (!pop) return;
                const isOpen = pop.style.display === 'block';
                if (isOpen) {
                    pop.style.display = 'none';
                    return;
                }
                pop.querySelectorAll('.liturgy-scope-option').forEach(opt => {
                    opt.classList.toggle('is-selected', opt.getAttribute('data-scope-id') === state.activeScope);
                });
                pop.style.display = 'block';
            }
        });
    }

    /**
     * Creates the Slides Mode footer control element placed immediately to the left
     * of `.share-btn` inside `.prayer-actions` using fast prototype cloning + event delegation.
     */
    function createSlideAutoFollowControl() {
        if (typeof document === 'undefined') return null;
        ensureDelegatedFooterListeners();

        if (!_controlPrototype) {
            const group = document.createElement('div');
            group.className = 'liturgy-autofollow-group';

            const mainBtn = document.createElement('button');
            mainBtn.type = 'button';
            mainBtn.className = 'liturgy-autofollow-btn';
            mainBtn.title = 'Auto-Follow Kidase Audio & Red-Dot Tracker';
            mainBtn.setAttribute('aria-label', 'Toggle Kidase Audio Auto-Follow');
            mainBtn.innerHTML =
                '<span class="autofollow-mic-dot" aria-hidden="true"></span>' +
                '<span class="autofollow-btn-label">Follow</span>';

            const scopeBtn = document.createElement('button');
            scopeBtn.type = 'button';
            scopeBtn.className = 'liturgy-scope-btn';
            scopeBtn.title = 'Choose where we are in the Divine Liturgy';
            scopeBtn.setAttribute('aria-label', 'Choose liturgical section or find place');
            scopeBtn.textContent = '▾';

            group.appendChild(mainBtn);
            group.appendChild(scopeBtn);
            _controlPrototype = group;
        }

        const inst = _controlPrototype.cloneNode(true);
        if (state.isActive) {
            syncSingleControlGroupUI(inst);
        }
        return inst;
    }

    function syncSingleControlGroupUI(groupEl) {
        if (!groupEl) return;
        groupEl.classList.toggle('is-active', state.isActive);
        const label = groupEl.querySelector('.autofollow-btn-label');
        if (!label) return;
        if (!state.isActive) {
            label.textContent = 'Follow';
        } else if (state.modelStatus === 'downloading') {
            label.textContent = `Model ${state.modelProgress}%`;
        } else if (state.activeScope === 'unknown') {
            label.textContent = 'Finding…';
        } else {
            label.textContent = 'Following';
        }
    }

    function updateAllFooterButtonsUI() {
        if (typeof document === 'undefined') return;
        document.querySelectorAll('.liturgy-autofollow-group').forEach(syncSingleControlGroupUI);
    }

    // =========================================================================
    // 6. SLIDE NAVIGATION & WEBWORKER / WEBAUDIO CAPTURE INTEGRATION
    // =========================================================================

    function getCurrentSlideIndexFromApp() {
        if (typeof window !== 'undefined' && window.__mountOfMercy) {
            const snap = window.__mountOfMercy.getActiveLectionaryReadingsSnapshot();
            if (snap && typeof snap.currentSlideIndex === 'number') {
                return snap.currentSlideIndex;
            }
        }
        if (typeof document !== 'undefined') {
            const slides = Array.from(document.querySelectorAll('#prayer-display .prayer-card, #prayer-display .section-title.collapsible'));
            const activeIdx = slides.findIndex(s => s.classList.contains('active-slide'));
            if (activeIdx !== -1) return activeIdx;
        }
        return 0;
    }

    function getActiveSlideElements() {
        if (typeof document === 'undefined') return [];
        const pd = document.getElementById('prayer-display');
        if (!pd) return [];
        return Array.from(pd.querySelectorAll('.prayer-card, .section-title.collapsible'));
    }

    function resetBuffersAfterSlideChange(newSlideIdx, preservePendingSeed = false) {
        rollingPhonemeStream = '';
        pcmRingFilled = Math.min(pcmRingFilled, Math.floor(TARGET_SAMPLE_RATE * 0.9));
        state._viterbiSession = null;
        if (!preservePendingSeed) {
            state._pendingNextSeed = null;
        }
        state.unmatchedVoicedMs = 0;
        state.endOfSlideSilentMs = 0;
        state._endOfSlideMeta = null;
        state.localSkipStreak = 0;
        state.localSkipCandidateIdx = -1;
        state._colChallenger = null;
        state._colChallengerStreak = 0;
        state.activeWordIndex = -1;
        state.activeWordFraction = 0;
        state.lastSlideAdvanceAt = Date.now();
        if (typeof newSlideIdx === 'number' && newSlideIdx >= 0) {
            state._lastObservedSlideIdx = newSlideIdx;
        }
    }

    function jumpToSlideIndex(targetIdx) {
        const slides = getActiveSlideElements();
        if (targetIdx < 0 || targetIdx >= slides.length) return;
        cleanupInstrumentedSlide();

        const curIdx = getCurrentSlideIndexFromApp();
        const delta = targetIdx - curIdx;
        if (delta === 1 && typeof window !== 'undefined' && window.__mountOfMercy && typeof window.__mountOfMercy.nextSlide === 'function') {
            window.__mountOfMercy.nextSlide();
        } else if (delta === -1 && typeof window !== 'undefined' && window.__mountOfMercy && typeof window.__mountOfMercy.prevSlide === 'function') {
            window.__mountOfMercy.prevSlide();
        } else if (typeof window !== 'undefined' && typeof window.jumpToSlideByIndex === 'function') {
            window.jumpToSlideByIndex(targetIdx);
        } else {
            const targetEl = slides[targetIdx];
            if (targetEl && targetEl.dataset && targetEl.dataset.cardId && typeof window.navigateToCard === 'function') {
                window.navigateToCard(targetEl.dataset.cardId);
            }
        }

        const hasSeedForTarget = Boolean(state._pendingNextSeed && state._pendingNextSeed.slideIdx === targetIdx);
        resetBuffersAfterSlideChange(targetIdx, hasSeedForTarget);
    }

    function jumpToCardIdInSlides(cardId) {
        if (!cardId) return;
        if (typeof window !== 'undefined' && typeof window.navigateToCard === 'function') {
            cleanupInstrumentedSlide();
            window.navigateToCard(cardId);
            resetBuffersAfterSlideChange(getCurrentSlideIndexFromApp(), false);
        }
    }

    function rebuildActiveGraph() {
        const slides = getActiveSlideElements();
        slideIndexData = buildLiturgicalSlideGraph(slides);
        const snap = (typeof window !== 'undefined' && window.__mountOfMercy)
            ? window.__mountOfMercy.getActiveLectionaryReadingsSnapshot()
            : {};
        const kData = typeof kidaseData !== 'undefined' ? kidaseData : (typeof window !== 'undefined' ? window.kidaseData : null);
        shadowBranchData = buildShadowLiturgicalBranches(kData, snap || {});
        return slideIndexData;
    }

    function ensureWorkerStarted() {
        if (acousticWorker || typeof Worker === 'undefined') return acousticWorker;
        try {
            const workerUrl = resolveIconPath('js/liturgy_acoustic_worker.js');
            acousticWorker = new Worker(workerUrl, { type: 'module' });
            acousticWorker.onmessage = (ev) => {
                const msg = ev.data || {};
                if (msg.type === 'model_status') {
                    state.modelStatus = msg.status || 'idle';
                    if (typeof msg.progress === 'number') state.modelProgress = msg.progress;
                    updateAllFooterButtonsUI();
                    return;
                }
                if (msg.type === 'infer_result') {
                    workerInferBusy = false;
                    if (state.isActive) {
                        handleWorkerInferenceResult(msg);
                        maybeDispatchAcousticHop();
                    }
                }
            };
            acousticWorker.postMessage({ type: 'warmup' });
        } catch (err) {
            console.warn('[LiturgyTracker] Could not initialize WebWorker:', err);
            acousticWorker = null;
        }
        return acousticWorker;
    }

    function appendStitchedHopSkeleton(prevStream, hopSkeleton, maxLen = 42) {
        if (!hopSkeleton) return prevStream;
        let out = prevStream || '';
        for (let i = 0; i < hopSkeleton.length; i++) {
            const ch = hopSkeleton[i];
            if (!out || out[out.length - 1] !== ch) {
                out += ch;
            }
        }
        return out.length > maxLen ? out.slice(-maxLen) : out;
    }

    function handleWorkerInferenceResult(msg) {
        if (!slideIndexData || slideIndexData.nodes.length === 0) {
            rebuildActiveGraph();
        }
        if (!slideIndexData || slideIndexData.nodes.length === 0) return;

        const nowMs = Date.now();
        const curIdx = getCurrentSlideIndexFromApp();

        // Detect external slide changes (clicker, touch swipe, button click, TOC jump)
        // and immediately purge old slide audio/phoneme state so stale audio never triggers jumps!
        if (state._lastObservedSlideIdx !== -1 && state._lastObservedSlideIdx !== curIdx) {
            resetBuffersAfterSlideChange(curIdx, false);
        }
        state._lastObservedSlideIdx = curIdx;

        // Stitch ONLY the non-overlapping hopSkeleton (zero 3.6s window echo!)
        if (typeof msg.hopSkeleton === 'string') {
            rollingPhonemeStream = appendStitchedHopSkeleton(rollingPhonemeStream, msg.hopSkeleton, 42);
        } else if (msg.ctcText) {
            rollingPhonemeStream = appendStitchedHopSkeleton('', msg.ctcText, 42);
        }

        const effectiveSkeletonText = rollingPhonemeStream.length >= 7
            ? rollingPhonemeStream
            : (msg.ctcText || rollingPhonemeStream);
        const obsProfile = createObservationProfile(effectiveSkeletonText);

        let decision = evaluateLiturgicalStep({
            obsProfile,
            rms: msg.rms || 0,
            phoneDensity: msg.phoneDensity || 0,
            hopPosteriors: msg.hopPosteriors || null,
            hopRms: msg.hopRms || null,
            windowDurationMs: msg.hopDurationMs || HOP_INTERVAL_MS,
            currentSlideIdx: curIdx,
            graph: slideIndexData,
            shadowBranches: shadowBranchData,
            trackerState: state,
            nowMs
        });

        // Post-advance settle guard (1.35s): allow Red-Dot tracking immediately on the newly
        // entered slide, while preventing residual room reverb from chain-jumping to a 2nd slide!
        if (decision && state.lastSlideAdvanceAt > 0 && (nowMs - state.lastSlideAdvanceAt) < 1350) {
            if (decision.action === 'advance_local' || decision.action === 'jump_global_immediate' || decision.action === 'prompt_copilot') {
                decision = {
                    action: decision.dotEval && decision.dotEval.wordIndex >= 0 ? 'track_current_slide' : 'listening_unmatched',
                    dotEval: decision.dotEval,
                    unmatchedVoicedMs: 0
                };
            }
        }

        applyTrackerDecisionToDom(decision, curIdx);
    }

    function applyTrackerDecisionToDom(decision, curIdx) {
        if (!decision) return;
        const slides = getActiveSlideElements();

        switch (decision.action) {
            case 'track_current_slide': {
                if (decision.dotEval && decision.dotEval.activeColumn && decision.dotEval.wordIndex >= 0) {
                    state.activeSpokenColumn = decision.dotEval.activeColumn;
                    state.activeWordIndex = decision.dotEval.wordIndex;
                    state.activeWordFraction = decision.dotEval.intraWordFraction;
                    renderRedDotPosition(
                        slides[curIdx],
                        state.activeSpokenColumn,
                        state.activeWordIndex,
                        state.activeWordFraction
                    );
                }
                break;
            }
            case 'advance_local':
            case 'jump_global_immediate': {
                dismissCopilotToast(false);
                jumpToSlideIndex(decision.targetSlideIndex);
                updateAllFooterButtonsUI();
                break;
            }
            case 'prompt_copilot': {
                showCopilotPrompt(decision);
                break;
            }
            case 'switch_anaphora_immediate':
            case 'switch_day_immediate': {
                executeCopilotDecision(decision);
                break;
            }
            case 'enter_sanctuary_interlude': {
                cleanupInstrumentedSlide();
                setSanctuaryInterludeVisible(true);
                break;
            }
            case 'exit_interlude_to_slide': {
                setSanctuaryInterludeVisible(false, () => {
                    jumpToSlideIndex(decision.targetSlideIndex);
                });
                break;
            }
            case 'exit_interlude_to_apostles_backbone': {
                setSanctuaryInterludeVisible(false, () => {
                    const sel = typeof document !== 'undefined' ? document.getElementById('anaphora-selector') : null;
                    if (sel && sel.value !== 'apostles') {
                        sel.value = 'apostles';
                        sel.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    jumpToCardIdInSlides(decision.cardId);
                });
                break;
            }
            default:
                break;
        }
    }

    function pushPcmSamples(float32Chunk, inputRate) {
        if (!float32Chunk || float32Chunk.length === 0) return;
        let resampled = float32Chunk;
        if (inputRate && inputRate !== TARGET_SAMPLE_RATE) {
            const ratio = inputRate / TARGET_SAMPLE_RATE;
            const outLen = Math.floor(float32Chunk.length / ratio);
            resampled = new Float32Array(outLen);
            for (let i = 0; i < outLen; i++) {
                resampled[i] = float32Chunk[Math.min(float32Chunk.length - 1, Math.floor(i * ratio))];
            }
        }

        const cap = pcmRingBuffer.length;
        if (resampled.length >= cap) {
            pcmRingBuffer.set(resampled.subarray(resampled.length - cap));
            pcmRingFilled = cap;
        } else {
            pcmRingBuffer.copyWithin(0, resampled.length);
            pcmRingBuffer.set(resampled, cap - resampled.length);
            pcmRingFilled = Math.min(cap, pcmRingFilled + resampled.length);
        }
        totalSamplesPushed += resampled.length;
    }

    function maybeDispatchAcousticHop() {
        if (!state.isActive || !acousticWorker || pcmRingFilled < TARGET_SAMPLE_RATE * 0.45) return;
        if (workerInferBusy) {
            if ((Date.now() - workerInferStartedAt) < 12000) return;
            workerInferBusy = false;
        }
        const newSamples = totalSamplesPushed - lastDispatchedSampleCount;
        const minHopSamples = Math.floor(TARGET_SAMPLE_RATE * 0.28);
        if (lastDispatchedSampleCount > 0 && newSamples < minHopSamples) return;

        const actualHopMs = lastDispatchedSampleCount > 0
            ? Math.min(2200, Math.max(280, Math.round((newSamples / TARGET_SAMPLE_RATE) * 1000)))
            : HOP_INTERVAL_MS;
        lastDispatchedSampleCount = totalSamplesPushed;
        workerInferBusy = true;
        workerInferStartedAt = Date.now();

        const useActiveWindow = !state.isSanctuaryInterludeVisible && (state.activeScope || 'anchor') === 'anchor';
        const targetWinSamples = useActiveWindow
            ? Math.min(pcmRingFilled, Math.floor(TARGET_SAMPLE_RATE * ACTIVE_TRACK_WINDOW_SEC))
            : pcmRingFilled;
        const slice = pcmRingBuffer.slice(pcmRingBuffer.length - targetWinSamples);
        const rms = computeFloat32Rms(slice.subarray(-Math.floor(TARGET_SAMPLE_RATE * 0.6)));
        acousticWorker.postMessage({
            type: 'infer',
            seq: ++inferSeq,
            windowStartMs: Date.now(),
            hopDurationMs: actualHopMs,
            rms,
            samples: slice
        }, [slice.buffer]);
    }

    function computeFloat32Rms(samples) {
        if (!samples || samples.length === 0) return 0;
        let sq = 0;
        for (let i = 0; i < samples.length; i++) sq += samples[i] * samples[i];
        return Math.sqrt(sq / samples.length);
    }

    async function startAutoFollow(scopeOverride = null) {
        if (scopeOverride) state.activeScope = scopeOverride;
        ensureOverlayDomElements();
        rebuildActiveGraph();
        ensureWorkerStarted();

        // Request Android WebView audio permission if running inside MainActivity.kt
        if (typeof window !== 'undefined' && window.AndroidTargumaBridge && typeof window.AndroidTargumaBridge.hasAudioPermission === 'function') {
            if (!window.AndroidTargumaBridge.hasAudioPermission()) {
                window.AndroidTargumaBridge.requestAudioPermission();
            }
            if (typeof window.AndroidTargumaBridge.setKeepScreenOn === 'function') {
                window.AndroidTargumaBridge.setKeepScreenOn(true);
            }
        }

        if (typeof navigator !== 'undefined' && navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: false,
                        noiseSuppression: false,
                        autoGainControl: true,
                        channelCount: 1
                    }
                });
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                audioContext = new AudioCtx();
                const src = audioContext.createMediaStreamSource(mediaStream);
                silentGainNode = audioContext.createGain();
                silentGainNode.gain.value = 0;

                let usedWorklet = false;
                if (audioContext.audioWorklet && typeof AudioWorkletNode !== 'undefined' && typeof Blob !== 'undefined' && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
                    try {
                        const workletCode = [
                            'class MomPcmCaptureProcessor extends AudioWorkletProcessor {',
                            '  constructor() { super(); this._buf = new Float32Array(2048); this._pos = 0; }',
                            '  process(inputs) {',
                            '    const chan = inputs && inputs[0] && inputs[0][0];',
                            '    if (chan && chan.length > 0) {',
                            '      let offset = 0;',
                            '      while (offset < chan.length) {',
                            '        const toCopy = Math.min(this._buf.length - this._pos, chan.length - offset);',
                            '        this._buf.set(chan.subarray(offset, offset + toCopy), this._pos);',
                            '        this._pos += toCopy; offset += toCopy;',
                            '        if (this._pos >= this._buf.length) {',
                            '          const out = this._buf.slice(0);',
                            '          this.port.postMessage(out, [out.buffer]);',
                            '          this._pos = 0;',
                            '        }',
                            '      }',
                            '    }',
                            '    return true;',
                            '  }',
                            '}',
                            "registerProcessor('mom-pcm-capture', MomPcmCaptureProcessor);"
                        ].join('\n');
                        const blob = new Blob([workletCode], { type: 'application/javascript' });
                        workletBlobUrl = URL.createObjectURL(blob);
                        await audioContext.audioWorklet.addModule(workletBlobUrl);
                        processorNode = new AudioWorkletNode(audioContext, 'mom-pcm-capture');
                        processorNode.port.onmessage = (ev) => {
                            if (!state.isActive || !audioContext) return;
                            if (ev.data instanceof Float32Array) {
                                pushPcmSamples(ev.data, audioContext.sampleRate);
                            }
                        };
                        src.connect(processorNode);
                        processorNode.connect(silentGainNode);
                        silentGainNode.connect(audioContext.destination);
                        usedWorklet = true;
                    } catch (_) {
                        usedWorklet = false;
                    }
                }

                if (!usedWorklet) {
                    processorNode = audioContext.createScriptProcessor(4096, 1, 1);
                    processorNode.onaudioprocess = (ev) => {
                        if (!state.isActive || !audioContext) return;
                        const chan = ev.inputBuffer.getChannelData(0);
                        pushPcmSamples(chan, audioContext.sampleRate);
                    };
                    src.connect(processorNode);
                    processorNode.connect(silentGainNode);
                    silentGainNode.connect(audioContext.destination);
                }
            } catch (err) {
                console.warn('[LiturgyTracker] Microphone access denied or unavailable:', err);
                stopAutoFollow();
                return false;
            }
        }

        state.isActive = true;
        state.unmatchedVoicedMs = 0;
        state.endOfSlideSilentMs = 0;
        state._endOfSlideMeta = null;
        state.localSkipStreak = 0;
        state.localSkipCandidateIdx = -1;
        state.lockedSpokenColumn = null;
        state._colLockCandidate = null;
        state._colLockStreak = 0;
        state._colChallenger = null;
        state._colChallengerStreak = 0;
        state.lastSlideAdvanceAt = 0;
        state._lastObservedSlideIdx = getCurrentSlideIndexFromApp();
        state._viterbiSession = null;
        state._pendingNextSeed = null;
        pcmRingFilled = 0;
        totalSamplesPushed = 0;
        lastDispatchedSampleCount = 0;
        workerInferBusy = false;
        workerInferStartedAt = 0;
        rollingPhonemeStream = '';
        updateAllFooterButtonsUI();

        if (hopTimer) clearInterval(hopTimer);
        hopTimer = setInterval(maybeDispatchAcousticHop, 100);

        return true;
    }

    function stopAutoFollow() {
        state.isActive = false;
        state.unmatchedVoicedMs = 0;
        state.endOfSlideSilentMs = 0;
        state._endOfSlideMeta = null;
        state.localSkipStreak = 0;
        state.localSkipCandidateIdx = -1;
        state.lockedSpokenColumn = null;
        state._colLockCandidate = null;
        state._colLockStreak = 0;
        state._colChallenger = null;
        state._colChallengerStreak = 0;
        state.lastSlideAdvanceAt = 0;
        state._lastObservedSlideIdx = -1;
        state.activeWordIndex = -1;
        state._viterbiSession = null;
        state._pendingNextSeed = null;
        pcmRingFilled = 0;
        totalSamplesPushed = 0;
        lastDispatchedSampleCount = 0;
        workerInferBusy = false;
        workerInferStartedAt = 0;
        rollingPhonemeStream = '';

        if (hopTimer) {
            clearInterval(hopTimer);
            hopTimer = null;
        }
        dismissCopilotToast(false);
        setSanctuaryInterludeVisible(false);
        cleanupInstrumentedSlide();

        if (processorNode) {
            try {
                if (processorNode.port) processorNode.port.onmessage = null;
                processorNode.disconnect();
            } catch (_) {}
            processorNode = null;
        }
        if (workletBlobUrl && typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
            try { URL.revokeObjectURL(workletBlobUrl); } catch (_) {}
            workletBlobUrl = null;
        }
        if (silentGainNode) {
            try { silentGainNode.disconnect(); } catch (_) {}
            silentGainNode = null;
        }
        if (audioContext) {
            try { audioContext.close(); } catch (_) {}
            audioContext = null;
        }
        if (mediaStream) {
            try { mediaStream.getTracks().forEach(t => t.stop()); } catch (_) {}
            mediaStream = null;
        }
        if (typeof window !== 'undefined' && window.AndroidTargumaBridge && typeof window.AndroidTargumaBridge.setKeepScreenOn === 'function') {
            window.AndroidTargumaBridge.setKeepScreenOn(false);
        }
        updateAllFooterButtonsUI();
    }

    function toggleAutoFollow() {
        if (state.isActive) {
            stopAutoFollow();
        } else {
            startAutoFollow(state.activeScope || 'anchor');
        }
    }

    function notifyManualSlideNavigation() {
        state.lastManualOverrideAt = Date.now();
        resetBuffersAfterSlideChange(getCurrentSlideIndexFromApp(), false);
        dismissCopilotToast(false);
        if (state.isSanctuaryInterludeVisible) {
            setSanctuaryInterludeVisible(false);
        }
        cleanupInstrumentedSlide();
    }

    function notifyPresentationModeChanged(isSlidesMode) {
        if (!isSlidesMode && state.isActive) {
            stopAutoFollow();
        } else if (isSlidesMode && state.isActive) {
            ensureOverlayDomElements();
            rebuildActiveGraph();
        } else if (!isSlidesMode) {
            slideIndexData = null;
            cleanupInstrumentedSlide();
        }
    }

    // Bind global keyboard shortcuts for Co-Pilot toast (`Enter` / `Escape`) & manual arrow re-anchoring
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        document.addEventListener('keydown', (e) => {
            if (state.pendingCopilotAction) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    executeCopilotDecision(state.pendingCopilotAction);
                    return;
                }
                if (e.key === 'Escape') {
                    e.preventDefault();
                    dismissCopilotToast(true);
                    return;
                }
            }
            if (state.isActive && (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'PageDown' || e.key === 'PageUp')) {
                notifyManualSlideNavigation();
            }
        });
    }

    // =========================================================================
    // 7. PUBLIC API EXPORTS (Browser Global + CommonJS for Vitest & Dry-Run)
    // =========================================================================

    function setTrackerStyle(style) {
        if (['dot_plus_glow', 'dot_only', 'off'].includes(style)) {
            state.trackerStyle = style;
            if (style === 'off') {
                cleanupInstrumentedSlide();
            } else if (style === 'dot_only' && instrumentedCard) {
                instrumentedCard.querySelectorAll('.mom-word-active').forEach(el => el.classList.remove('mom-word-active'));
            }
        }
    }

    function setAutonomyMode(mode) {
        if (['copilot', 'anchored', 'autonomous'].includes(mode)) {
            state.autonomyMode = mode;
        }
    }

    const LiturgyTrackerAPI = {
        get state() { return state; },
        LITURGY_SCOPES,
        OFFBOOK_ENTER_VOICED_MS,
        COPILOT_COUNTDOWN_MS,
        // Pure DSP / Linguistic / Graph functions
        transliterateEthiopicText,
        stripLiturgicalMarkup,
        normalizeLatinPhonetic,
        normalizeEnglishWordToPhonetic,
        toCanonicalAcousticSkeleton,
        extractShingles,
        buildColumnWordSequence,
        buildLiturgicalSlideGraph,
        buildShadowLiturgicalBranches,
        createObservationProfile,
        scoreObservationAgainstNode,
        alignObservationToColumnWords,
        evaluateMultiColumnRedDot,
        buildZemaPhonemeStates,
        updateOnlineCoupledViterbi,
        resolveLockedSpokenColumn,
        appendStitchedHopSkeleton,
        evaluateLiturgicalStep,
        computeGeezToPhoneticWordMap,
        // DOM & Runtime controls
        createSlideAutoFollowControl,
        ensureSlideInstrumented,
        renderRedDotPosition,
        cleanupInstrumentedSlide,
        setSanctuaryInterludeVisible,
        rebuildActiveGraph,
        startAutoFollow,
        stopAutoFollow,
        toggleAutoFollow,
        setTrackerStyle,
        setAutonomyMode,
        notifyManualSlideNavigation,
        notifyPresentationModeChanged,
        dismissCopilotToast
    };

    if (typeof globalThis !== 'undefined') {
        globalThis.liturgyTracker = LiturgyTrackerAPI;
    }
    if (typeof window !== 'undefined') {
        window.liturgyTracker = LiturgyTrackerAPI;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = LiturgyTrackerAPI;
    }
})();
