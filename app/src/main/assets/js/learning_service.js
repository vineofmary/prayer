// ============================================================================
// LEARNING & GAMES MODULE (ትምህርት ወተዋሥኦ) — Ge'ez Interlinear & Sunday School Games
// ============================================================================
// Features:
// 1. Sunday School Class / Age Selector:
//    - Hitsanat (ሕፃናት • Under 7)
//    - St. Arsema's Class (ቅድስት አርሴማ • Ages 7–9)
//    - St. John's Class (ቅዱስ ዮሐንስ ወንጌላዊ • Ages 10–12)
// 2. BibleHub-Style Ge'ez Interlinear Explorer:
//    - Word-by-word stacked cards (Ge'ez Script + Phonetic + English + Grammar/Root)
//    - Tap any word to open the Ge'ez Lexicon & Live Corpus Concordance Drawer
//    - Custom Stanza Explorer (inspect any prayer or Misbak from the app)
// 3. Individual & Class Games:
//    - Liturgical Phrase Matcher (with Phonetics toggle & Liturgical Context Notes)
//    - Qidase Scramble (Chronological ordering with theological "Why" explanations)
// 4. Classroom TV Mode (16:9 Big-Screen Optimized):
//    - Procedural Liturgical Jeopardy (with 30-day anti-repeat memory, Pick Categories
//      modal, "Include Today's Selected Readings" live lectionary generator, and 4-choice hint toggle)
//    - Liturgical Response Blitz (Drop-in continuous challenge for classroom play)
// ============================================================================

(function () {
    'use strict';

    const STORAGE_KEY_SETTINGS = 'mom_learning_settings_v1';
    const STORAGE_KEY_JEOPARDY_HISTORY = 'mom_jeopardy_played_clues_v1';
    const MAX_HISTORY_IDS = 120;

    const DEFAULT_TEAMS = [
        { name: 'Team #1', score: 0 },
        { name: 'Team #2', score: 0 },
        { name: 'Team #3', score: 0 },
        { name: 'Team #4', score: 0 }
    ];

    const state = {
        isActive: false,
        activeTab: 'blitz', // 'blitz' | 'jeopardy' | 'matcher' | 'interlinear'
        selectedClassId: 'st_michael', // 'st_kirkos' | 'st_arsema' | 'st_john' | 'st_michael'
        tvProjectionMode: false,
        hdmiConnected: false,
        teamCount: 2,
        gameTheme: 'default', // 'default' | 'st_john_meadow' | 'creation_sky' | 'oakland_plushy'
        celebrationEffects: true,
        pendingFx: null, // 'correct' | 'wrong' | 'entry' | null

        // Interlinear state
        selectedPassageId: 'trinitarian_invocation',
        customPrayerIndex: 0,
        useCustomPrayerStanza: false,
        showInterlinearPhonetics: true,
        showInterlinearGrammar: true,
        inspectedWordObj: null,

        // Phrase Matcher state
        selectedMatcherPackId: 'st_john_daily_prayer',
        showMatcherPhonetics: true,
        matcherCards: [],
        selectedLeftId: null,
        selectedRightId: null,
        matchedPairIds: [],
        matcherMistakes: 0,
        matcherMoves: 0,
        lastMatchedNote: '',

        // Qidase Scramble state
        selectedScramblePackId: 'lectionary_progression',
        scrambleItems: [],
        selectedScrambleIndex: null,
        scrambleChecked: false,
        scrambleIsCorrect: false,

        // Classroom Teams state
        teams: JSON.parse(JSON.stringify(DEFAULT_TEAMS)),
        activeTeamIndex: 0,

        // Jeopardy state
        selectedCategoryIds: ['active_lectionary', 'geez_vocab', 'qidase_responses', 'liturgy_order', 'loanwords'],
        prioritizeSelectedReadings: true,
        jeopardyBoard: [], // Array of { categoryId, title, ethiopic, clues: [...] }
        activeClue: null, // { colIdx, rowIdx, categoryTitle, clue, showOptions, revealedAnswer, pickedOption }
        showCategoryPickerModal: false,
        playedClueIds: [],

        // Liturgical Response Blitz state
        blitzQueue: [],
        blitzCurrentIndex: 0,
        blitzClueLevel: 1, // 1: Ge'ez + Choices, 2: Phonetic revealed
        blitzStreak: 0,
        blitzTotalSolved: 0,
        blitzAnsweredCurrent: false,
        blitzSelectedAnswer: null
    };

    function isExternalDisplayConnected() {
        if (state.hdmiConnected) return true;
        if (typeof window !== 'undefined' && window.screen && window.screen.isExtended === true) {
            return true;
        }
        return false;
    }

    function getLexicon() {
        if (typeof window !== 'undefined' && window.GeezLexiconService) {
            return window.GeezLexiconService;
        }
        return null;
    }

    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function shuffleArray(arr) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = copy[i];
            copy[i] = copy[j];
            copy[j] = temp;
        }
        return copy;
    }

    function loadLearningSettings() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.selectedClassId) state.selectedClassId = parsed.selectedClassId;
                if (parsed.activeTab) state.activeTab = parsed.activeTab;
                if (typeof parsed.showInterlinearPhonetics === 'boolean') state.showInterlinearPhonetics = parsed.showInterlinearPhonetics;
                if (typeof parsed.showInterlinearGrammar === 'boolean') state.showInterlinearGrammar = parsed.showInterlinearGrammar;
                if (typeof parsed.showMatcherPhonetics === 'boolean') state.showMatcherPhonetics = parsed.showMatcherPhonetics;
                if (typeof parsed.teamCount === 'number' && parsed.teamCount >= 1 && parsed.teamCount <= 4) {
                    state.teamCount = parsed.teamCount;
                }
                if (typeof parsed.gameTheme === 'string') {
                    state.gameTheme = parsed.gameTheme;
                }
                if (typeof parsed.celebrationEffects === 'boolean') {
                    state.celebrationEffects = parsed.celebrationEffects;
                }
                if (Array.isArray(parsed.teams) && parsed.teams.length >= 4) state.teams = parsed.teams;
                if (Array.isArray(parsed.selectedCategoryIds) && parsed.selectedCategoryIds.length >= 3) {
                    state.selectedCategoryIds = parsed.selectedCategoryIds;
                }
            }
            const rawHistory = localStorage.getItem(STORAGE_KEY_JEOPARDY_HISTORY);
            if (rawHistory) {
                const hist = JSON.parse(rawHistory);
                if (Array.isArray(hist)) state.playedClueIds = hist;
            }
        } catch (e) {}
    }

    function saveLearningSettings() {
        try {
            localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify({
                selectedClassId: state.selectedClassId,
                activeTab: state.activeTab,
                showInterlinearPhonetics: state.showInterlinearPhonetics,
                showInterlinearGrammar: state.showInterlinearGrammar,
                showMatcherPhonetics: state.showMatcherPhonetics,
                teamCount: state.teamCount,
                gameTheme: state.gameTheme,
                celebrationEffects: state.celebrationEffects,
                teams: state.teams,
                selectedCategoryIds: state.selectedCategoryIds
            }));
        } catch (e) {}
    }

    function recordPlayedClueId(clueId) {
        if (!clueId) return;
        state.playedClueIds = [clueId, ...state.playedClueIds.filter(id => id !== clueId)].slice(0, MAX_HISTORY_IDS);
        try {
            localStorage.setItem(STORAGE_KEY_JEOPARDY_HISTORY, JSON.stringify(state.playedClueIds));
        } catch (e) {}
    }

    function getCurrentClassMeta() {
        const lex = getLexicon();
        if (!lex) return { id: 'st_michael', name: "St. Michael's Kids", ageRange: 'Ages 13+', boardSize: 5, matcherPairs: 8, allowedTabs: ['blitz', 'jeopardy', 'matcher', 'interlinear'] };
        return lex.SUNDAY_SCHOOL_CLASSES.find(c => c.id === state.selectedClassId) || lex.SUNDAY_SCHOOL_CLASSES[3];
    }

    // ========================================================================
    // DYNAMIC CLUE GENERATOR FROM SELECTED LITURGICAL READINGS IN THE APP
    // ========================================================================
    function generateSelectedReadingsClues() {
        const clues = [];
        const appBridge = (typeof window !== 'undefined' && window.__mountOfMercy) ? window.__mountOfMercy : null;
        const snapshot = (appBridge && typeof appBridge.getActiveLectionaryReadingsSnapshot === 'function')
            ? appBridge.getActiveLectionaryReadingsSnapshot()
            : null;

        const refs = (snapshot && snapshot.kidaseLectionaryRefs) ? snapshot.kidaseLectionaryRefs : {
            pauline: 'Romans 9:17-30',
            universal: 'Jude 1:6-14',
            acts: 'Acts 10:3-9',
            psalm: 'Psalms 33:16-17',
            gospel: 'Luke 18:1-9',
            morningPsalm: 'Psalms 34:7-8',
            morningGospel: 'Matthew 24:30-36'
        };

        // 1. 100 pts: Holy Gospel Book & Evangelist identification
        const gospelRef = refs.gospel || 'Luke 18:1-9';
        const gospelBookMatch = gospelRef.match(/^(Matthew|Mark|Luke|John)/i);
        const gospelEvangelist = gospelBookMatch ? gospelBookMatch[1] : 'Luke';
        const allEvangelists = ['Matthew', 'Mark', 'Luke', 'John'];
        clues.push({
            id: 'dyn_gospel_' + gospelRef.replace(/\s+/g, '_'),
            points: 100,
            minTier: 'hitsanat',
            prompt: 'In today\'s selected Divine Liturgy readings (' + gospelRef + '), from which of the Four Evangelists is the Holy Gospel proclaimed?',
            answer: 'St. ' + gospelEvangelist + ' (' + gospelRef + ')',
            options: allEvangelists.map(ev => 'St. ' + ev + ' (' + gospelRef + ')'),
            insight: 'Today\'s appointed Liturgy Gospel reading in the app is ' + gospelRef + ', proclaimed from the Gospel according to St. ' + gospelEvangelist + '.'
        });

        // 2. 200 pts: Pauline Epistle Book identification
        const paulineRef = refs.pauline || 'Romans 9:17-30';
        const paulineBook = paulineRef.replace(/\s+\d+:.*$/, '').trim();
        const paulineDistractors = ['Romans', '1 Corinthians', 'Ephesians', 'Hebrews', 'Galatians', 'Philippians']
            .filter(b => b.toLowerCase() !== paulineBook.toLowerCase())
            .slice(0, 3);
        clues.push({
            id: 'dyn_pauline_' + paulineRef.replace(/\s+/g, '_'),
            points: 200,
            minTier: 'hitsanat',
            prompt: 'Today\'s selected Pauline Epistle reading is "' + paulineRef + '". To which church or recipient did St. Paul write this epistle, and when is it read in the Qidase?',
            answer: paulineBook + ' — Read as the 1st Scripture reading of the Divine Liturgy',
            options: shuffleArray([
                paulineBook + ' — Read as the 1st Scripture reading of the Divine Liturgy',
                ...paulineDistractors.map(d => d + ' — Read after the Gospel')
            ]),
            insight: 'St. Paul\'s Epistle (' + paulineRef + ') is always the first of the five lectionary readings in the Qidase.'
        });

        // 3. 300 pts: Universal Epistle Author Attribution
        const universalRef = refs.universal || 'Jude 1:6-14';
        const univBook = universalRef.replace(/\s+\d+:.*$/, '').trim();
        let univAuthor = 'Jude';
        if (appBridge && typeof appBridge.getUniversalEpistleAuthor === 'function') {
            const authorObj = appBridge.getUniversalEpistleAuthor(universalRef);
            if (authorObj && authorObj.english) univAuthor = authorObj.english;
        } else if (/Jude/i.test(univBook)) {
            univAuthor = 'Jude';
        } else if (/Peter/i.test(univBook)) {
            univAuthor = 'Peter';
        } else if (/John/i.test(univBook)) {
            univAuthor = 'John';
        } else if (/James/i.test(univBook)) {
            univAuthor = 'James';
        }
        const actsLabel = refs.acts || 'Acts';
        const univAnswer = 'Apostle ' + univAuthor + ' (' + universalRef + ') — followed by Acts (' + actsLabel + ')';
        clues.push({
            id: 'dyn_universal_' + universalRef.replace(/\s+/g, '_'),
            points: 300,
            minTier: 'st_arsema',
            prompt: 'Today\'s selected Universal (Catholic) Epistle is ' + universalRef + '. Which Apostle authored this epistle, and what comes immediately after it in the Liturgy?',
            answer: univAnswer,
            options: [
                univAnswer,
                'St. Paul — followed by the Prayer of the Covenant',
                'St. Luke — followed by the Dismissal Blessing',
                'King David — followed by the Nicene Creed'
            ],
            insight: 'The Universal Epistle (' + universalRef + ') is the 2nd reading of the Qidase and is followed immediately by Acts of the Apostles (' + actsLabel + ').'
        });

        // 4. 400 pts: Liturgy Psalm (Misbak) & LXX/MT Numbering
        const psalmRef = refs.psalm || 'Psalms 33:16-17';
        const psMatch = psalmRef.match(/Psalms?\s+(\d+):(\d+)(?:-(\d+))?/i);
        let lxxInfo = 'Chanted by the Deacon and repeated by the congregation before the Gospel';
        if (psMatch && appBridge && typeof appBridge.convertMtToLxx === 'function') {
            const mtCh = parseInt(psMatch[1], 10);
            const mtV = parseInt(psMatch[2], 10);
            const conv = appBridge.convertMtToLxx(mtCh, mtV);
            const lxxCh = (conv && typeof conv === 'object') ? conv.lxxChapter : conv;
            const geezNum = typeof appBridge.toGeezNumeral === 'function' ? appBridge.toGeezNumeral(lxxCh) : lxxCh;
            lxxInfo = 'Psalm ' + lxxCh + ' in Septuagint/Ge\'ez (መዝሙር ' + geezNum + ')';
        }

        let typicalIncipit = '';
        if (psMatch && typeof TYPICAL_PSALMS !== 'undefined' && Array.isArray(TYPICAL_PSALMS)) {
            const mtCh = parseInt(psMatch[1], 10);
            const mtStart = parseInt(psMatch[2], 10);
            const foundTyp = TYPICAL_PSALMS.find(p => p.mc === mtCh && p.ms === mtStart);
            if (foundTyp && foundTyp.g) {
                typicalIncipit = ' ("' + foundTyp.g.slice(0, 45) + '...")';
            }
        }

        const misbakAnswer = lxxInfo + ' — Chanted between Acts (' + actsLabel + ') and the Gospel (' + gospelRef + ')';
        clues.push({
            id: 'dyn_misbak_' + psalmRef.replace(/\s+/g, '_'),
            points: 400,
            minTier: 'st_john',
            prompt: 'Today\'s selected Liturgy Psalm (ምስባክ / Misbak) is ' + psalmRef + ' (NKJV)' + typicalIncipit + '. What is its Septuagint / Ge\'ez Psalm chapter number and liturgical role?',
            answer: misbakAnswer,
            options: [
                misbakAnswer,
                'Psalm 150 — Chanted only after Holy Communion',
                'Psalm 1 — Read silently by the Deacon before vesting',
                'Psalm 119 — Chanted only on Good Friday'
            ],
            insight: 'Today\'s Misbak is ' + psalmRef + ' (' + lxxInfo + '), chanted responsorially between the Deacon and People right before the Gospel.'
        });

        // 5. 500 pts: Selected Anaphora & Acts Reading synthesis
        const anaphoraName = snapshot && snapshot.selectedAnaphora === 'mary'
            ? 'The Anaphora of Our Lady Mary (ቅዳሴ ማርያም)'
            : 'The Anaphora of the Apostles (ቅዳሴ ሐዋርያት)';
        const actsRef = refs.acts || 'Acts 10:3-9';
        const synthAnswer = 'Read by the Assistant Priest (' + actsRef + ') • Selected Anaphora: ' + anaphoraName;
        clues.push({
            id: 'dyn_synthesis_' + actsRef.replace(/\s+/g, '_') + '_' + (snapshot ? snapshot.selectedAnaphora : 'apostles'),
            points: 500,
            minTier: 'st_john',
            prompt: 'In the app\'s current Liturgy configuration, the 3rd reading is ' + actsRef + ' (ግብረ ሐዋርያት). Who reads Acts of the Apostles in the Qidase, and which Anaphora (ፍሬ ቅዳሴ) is currently selected?',
            answer: synthAnswer,
            options: [
                synthAnswer,
                'Read by the Subdeacon • Selected Anaphora: Anaphora of St. Mark',
                'Chanted by the Choir • Selected Anaphora: Prayer of Manasseh',
                'Read by the Lay Reader • Selected Anaphora: Book of the Hours'
            ],
            insight: 'In the EOTC Qidase, the Assistant Priest reads Acts of the Apostles (' + actsRef + '), whereas the Deacons read the Pauline and Universal Epistles.'
        });

        return clues;
    }

    // ========================================================================
    // PROCEDURAL JEOPARDY BOARD BUILDER (WITH ANTI-REPEAT MEMORY)
    // ========================================================================
    function buildProceduralJeopardyBoard() {
        const lex = getLexicon();
        if (!lex) return [];

        const classMeta = getCurrentClassMeta();
        const gridCount = classMeta.boardSize || 5; // 3, 4, or 5 categories & rows
        const pointTiers = [100, 200, 300, 400, 500].slice(0, gridCount);

        let chosenCatIds = [...state.selectedCategoryIds];
        if (state.prioritizeSelectedReadings && !chosenCatIds.includes('active_lectionary')) {
            chosenCatIds.unshift('active_lectionary');
        }
        if (chosenCatIds.length < gridCount) {
            for (const meta of lex.JEOPARDY_CATEGORIES_META) {
                if (!chosenCatIds.includes(meta.id)) {
                    chosenCatIds.push(meta.id);
                }
                if (chosenCatIds.length >= gridCount) break;
            }
        }
        chosenCatIds = chosenCatIds.slice(0, gridCount);

        const playedSet = new Set(state.playedClueIds);
        const dynamicLectionaryClues = generateSelectedReadingsClues();

        const ddCatIdx = Math.floor(Math.random() * chosenCatIds.length);
        const ddRowIdx = Math.floor(Math.random() * pointTiers.length);

        const board = chosenCatIds.map((catId, catIdx) => {
            const meta = lex.JEOPARDY_CATEGORIES_META.find(m => m.id === catId) || {
                id: catId,
                title: 'Liturgical Knowledge',
                ethiopic: 'ትምህርተ ቤተ ክርስቲያን'
            };

            const sourcePool = catId === 'active_lectionary'
                ? dynamicLectionaryClues
                : (lex.CURATED_JEOPARDY_CLUES[catId] || []);

            const cluesForCategory = pointTiers.map((pts, rowIdx) => {
                let candidates = sourcePool.filter(c => c.points === pts);
                if (candidates.length === 0) {
                    candidates = sourcePool;
                }

                const unplayed = candidates.filter(c => !playedSet.has(c.id));
                const pickPool = unplayed.length > 0 ? unplayed : candidates;
                const chosen = pickPool[Math.floor(Math.random() * pickPool.length)] || sourcePool[rowIdx % sourcePool.length];

                return {
                    ...chosen,
                    points: pts,
                    isDailyDouble: (catIdx === ddCatIdx && rowIdx === ddRowIdx && pts >= 200),
                    answered: false,
                    options: shuffleArray(chosen.options || [chosen.answer])
                };
            });

            return {
                categoryId: meta.id,
                title: meta.title,
                ethiopic: meta.ethiopic,
                clues: cluesForCategory
            };
        });

        state.jeopardyBoard = board;
        state.activeClue = null;
        return board;
    }

    // ========================================================================
    // PHRASE MATCHER INITIALIZATION
    // ========================================================================
    function initMatcherRound(packId) {
        const lex = getLexicon();
        if (!lex) return;

        const targetPackId = packId || state.selectedMatcherPackId;
        const pack = lex.MATCHER_PACKS.find(p => p.id === targetPackId) || lex.MATCHER_PACKS[0];
        state.selectedMatcherPackId = pack.id;

        const classMeta = getCurrentClassMeta();
        const maxPairs = Math.min(pack.pairs.length, classMeta.matcherPairs || 6);
        const chosenPairs = shuffleArray(pack.pairs).slice(0, maxPairs);

        state.matcherCards = {
            left: shuffleArray(chosenPairs.map(p => ({ id: p.id, geez: p.geez, note: p.note }))),
            right: shuffleArray(chosenPairs.map(p => ({
                id: p.id,
                phonetic: p.phonetic,
                english: p.english,
                note: p.note
            })))
        };
        state.selectedLeftId = null;
        state.selectedRightId = null;
        state.matchedPairIds = [];
        state.matcherMistakes = 0;
        state.matcherMoves = 0;
        state.lastMatchedNote = 'Select a Ge\'ez word on the left and match it with its English meaning on the right.';
    }

    // ========================================================================
    // QIDASE SCRAMBLE INITIALIZATION
    // ========================================================================
    function initScrambleRound(packId) {
        const lex = getLexicon();
        if (!lex) return;

        const targetPackId = packId || state.selectedScramblePackId;
        const pack = lex.QIDASE_SCRAMBLE_PACKS.find(p => p.id === targetPackId) || lex.QIDASE_SCRAMBLE_PACKS[0];
        state.selectedScramblePackId = pack.id;

        let shuffled = shuffleArray(pack.steps);
        if (shuffled.every((s, idx) => s.order === idx + 1) && shuffled.length > 1) {
            shuffled = [shuffled[1], shuffled[0], ...shuffled.slice(2)];
        }

        state.scrambleItems = shuffled;
        state.selectedScrambleIndex = null;
        state.scrambleChecked = false;
        state.scrambleIsCorrect = false;
    }

    // ========================================================================
    // LITURGICAL RESPONSE BLITZ INITIALIZATION
    // ========================================================================
    function initBlitzQueue() {
        const lex = getLexicon();
        if (!lex) return;

        const allItems = [];
        lex.MATCHER_PACKS.forEach(pack => {
            pack.pairs.forEach(pair => {
                allItems.push({
                    id: 'blitz_' + pack.id + '_' + pair.id,
                    geez: pair.geez,
                    phonetic: pair.phonetic,
                    english: pair.english,
                    note: pair.note,
                    packTitle: pack.title
                });
            });
        });

        const shuffled = shuffleArray(allItems);
        state.blitzQueue = shuffled.map(item => {
            const distractors = shuffleArray(
                allItems.filter(other => other.english !== item.english).map(o => o.english)
            ).slice(0, 3);
            return {
                ...item,
                options: shuffleArray([item.english, ...distractors])
            };
        });
        state.blitzCurrentIndex = 0;
        state.blitzClueLevel = 1;
        state.blitzAnsweredCurrent = false;
        state.blitzSelectedAnswer = null;
    }

    // ========================================================================
    // DOM CREATION & RENDERING
    // ========================================================================
    function ensureLearningDOM() {
        let container = document.getElementById('learning-view');
        if (container) return container;

        const mainContentEl = document.querySelector('.main-content');
        if (!mainContentEl) return null;

        container = document.createElement('section');
        container.id = 'learning-view';
        container.className = 'learning-view hidden';
        container.setAttribute('aria-label', 'Learn Ge\'ez and Liturgical Games');

        const prayerDisplayEl = document.getElementById('prayer-display');
        if (prayerDisplayEl && prayerDisplayEl.parentNode) {
            prayerDisplayEl.parentNode.insertBefore(container, prayerDisplayEl);
        } else {
            mainContentEl.appendChild(container);
        }

        return container;
    }

    function triggerCelebrationFX(type) {
        if (!state.celebrationEffects) return;
        const container = document.getElementById('learning-view');
        if (!container) return;

        if (type === 'correct') {
            let fxLayer = container.querySelector('.learning-fx-layer');
            if (!fxLayer) {
                fxLayer = document.createElement('div');
                fxLayer.className = 'learning-fx-layer';
                fxLayer.setAttribute('aria-hidden', 'true');
                container.appendChild(fxLayer);
            }
            fxLayer.innerHTML = '';
            const colors = ['#f66d52', '#f5b841', '#14b8d4', '#4cd964', '#a779e9', '#ff9f1c'];
            const emojis = ['✨', '🎉', '⭐', '🎊', '🕊️', '🔥'];
            for (let i = 0; i < 26; i++) {
                const p = document.createElement('span');
                const isEmoji = i % 4 === 0;
                p.className = isEmoji ? 'fx-particle fx-emoji' : 'fx-particle fx-confetti';
                if (isEmoji) {
                    p.textContent = emojis[i % emojis.length];
                } else {
                    p.style.backgroundColor = colors[i % colors.length];
                }
                const angle = (Math.PI * 2 * i) / 26 + (Math.random() * 0.35 - 0.175);
                const dist = 70 + Math.random() * 160;
                const tx = Math.cos(angle) * dist;
                const ty = Math.sin(angle) * dist - 45;
                const rot = Math.round(Math.random() * 520 - 260);
                p.style.setProperty('--fx-tx', tx.toFixed(1) + 'px');
                p.style.setProperty('--fx-ty', ty.toFixed(1) + 'px');
                p.style.setProperty('--fx-rot', rot + 'deg');
                p.style.left = (42 + Math.random() * 16) + '%';
                p.style.top = (36 + Math.random() * 16) + '%';
                fxLayer.appendChild(p);
                if (typeof p.animate === 'function') {
                    p.animate([
                        { opacity: 1, transform: 'translate(0px, 0px) scale(0.5) rotate(0deg)' },
                        { opacity: 1, transform: 'translate(' + (tx * 0.75).toFixed(1) + 'px, ' + (ty * 0.75).toFixed(1) + 'px) scale(1.1) rotate(' + Math.round(rot * 0.7) + 'deg)', offset: 0.75 },
                        { opacity: 0, transform: 'translate(' + tx.toFixed(1) + 'px, ' + (ty + 35).toFixed(1) + 'px) scale(0.9) rotate(' + rot + 'deg)' }
                    ], { duration: 950, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' });
                }
            }
            const stageEl = container.querySelector('.blitz-stage-card, .jeopardy-clue-modal-card, .matcher-board-columns');
            if (stageEl) {
                stageEl.classList.remove('fx-correct-pop', 'fx-wrong-shake');
                void stageEl.offsetWidth;
                stageEl.classList.add('fx-correct-pop');
            }
            setTimeout(() => {
                if (fxLayer && fxLayer.parentNode) fxLayer.innerHTML = '';
            }, 1200);
        } else if (type === 'wrong') {
            const stageEl = container.querySelector('.blitz-stage-card, .jeopardy-clue-modal-card, .matcher-board-columns');
            if (stageEl) {
                stageEl.classList.remove('fx-correct-pop', 'fx-wrong-shake');
                void stageEl.offsetWidth;
                stageEl.classList.add('fx-wrong-shake');
            }
        }
    }

    function renderLearningView() {
        const container = ensureLearningDOM();
        if (!container) return;

        const lex = getLexicon();
        if (!lex) return;

        const classMeta = getCurrentClassMeta();
        container.classList.toggle('tv-projection-active', state.tvProjectionMode);
        container.setAttribute('data-game-theme', state.gameTheme || 'default');

        const allowedTabs = (classMeta && Array.isArray(classMeta.allowedTabs))
            ? classMeta.allowedTabs
            : ['blitz', 'jeopardy', 'matcher', 'interlinear'];
        if (!allowedTabs.includes(state.activeTab)) {
            state.activeTab = allowedTabs[0] || 'blitz';
        }

        const classOptionsHtml = lex.SUNDAY_SCHOOL_CLASSES.map(cls => {
            const selAttr = state.selectedClassId === cls.id ? 'selected' : '';
            return '<option value="' + escapeHtml(cls.id) + '" ' + selAttr + '>' +
                escapeHtml(cls.name) + ' (' + escapeHtml(cls.ageRange) + ')</option>';
        }).join('');

        const gameThemeOptionsHtml = [
            { id: 'default', label: '🎨 Vibe: App Theme' },
            { id: 'st_john_meadow', label: "🌿 Vibe: St. John's Class" },
            { id: 'creation_sky', label: '☁️ Vibe: Heavenly Clouds' },
            { id: 'oakland_plushy', label: '🏛️ Vibe: Oakland Plushy' }
        ].map(th => {
            const selAttr = (state.gameTheme || 'default') === th.id ? 'selected' : '';
            return '<option value="' + escapeHtml(th.id) + '" ' + selAttr + '>' + escapeHtml(th.label) + '</option>';
        }).join('');

        const allTabs = [
            { id: 'blitz', label: 'Trivia' },
            { id: 'jeopardy', label: 'Jeopardy' },
            { id: 'matcher', label: 'Match It' },
            { id: 'interlinear', label: "Ge'ez Reader" }
        ];

        const tabsNavHtml = allTabs
            .filter(t => allowedTabs.includes(t.id))
            .map(t => {
                const activeCls = state.activeTab === t.id ? 'active' : '';
                return '<button type="button" role="tab" class="learning-tab-btn ' + activeCls + '" data-tab="' + t.id + '">' +
                    '<span class="tab-label">' + escapeHtml(t.label) + '</span>' +
                '</button>';
            }).join('');

        const scoreboardBarHtml = (state.activeTab === 'jeopardy' || state.activeTab === 'blitz' || state.tvProjectionMode)
            ? renderTeamScoreboardHTML()
            : '';

        const stageBodyHtml = renderActiveTabContent(classMeta);
        const showTvBtn = isExternalDisplayConnected();
        const tvBtnHtml = showTvBtn
            ? `<button type="button" id="learning-tv-toggle-btn" class="learning-action-btn ${state.tvProjectionMode ? 'active' : ''}" title="Classroom TV Display" aria-label="Classroom TV Display">
                   <svg class="icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg>
               </button>`
            : '';

        container.innerHTML = `
            <div class="learning-header-bar">
                <div class="learning-header-top">
                    <div class="learning-brand">
                        <button type="button" id="learning-plushy-mascot-btn" class="learning-plushy-mascot-btn" title="Oakland Debre Mewi'e Kidus Michael EOTC — Tap to bounce!" aria-label="Parish Mascot">
                            <img src="img/oakland_dmkm-eotc.png" alt="Oakland Parish" class="learning-plushy-icon" />
                        </button>
                    </div>

                    <div class="learning-class-selector" role="group" aria-label="Select Sunday School Class">
                        <select id="learning-class-select" class="learning-select learning-class-select" aria-label="Select Sunday School Class">
                            ${classOptionsHtml}
                        </select>
                    </div>

                    <div class="learning-header-actions">
                        <select id="learning-vibe-select" class="learning-select learning-vibe-select" aria-label="Game Mode Vibe Theme" title="Choose Game Mode Visual Vibe">
                            ${gameThemeOptionsHtml}
                        </select>
                        <button type="button" id="learning-fx-toggle-btn" class="learning-action-btn learning-fx-toggle-btn ${state.celebrationEffects ? 'active' : ''}" title="${state.celebrationEffects ? 'Answer Animations: ON' : 'Answer Animations: OFF'}" aria-label="Toggle Answer Animations">
                            🎉
                        </button>
                        ${tvBtnHtml}
                        <button type="button" id="learning-exit-btn" class="learning-exit-btn" title="Return to Prayer Reader" aria-label="Exit Learning Mode">
                            ✕
                        </button>
                    </div>
                </div>

                <div class="learning-tabs-nav" role="tablist">
                    ${tabsNavHtml}
                </div>
            </div>

            <div class="learning-stage-body" id="learning-stage-body">
                ${stageBodyHtml}
            </div>

            ${scoreboardBarHtml}
        `;

        bindLearningEvents(container);

        if (state.pendingFx) {
            const fxToRun = state.pendingFx;
            state.pendingFx = null;
            triggerCelebrationFX(fxToRun);
        }
    }

    function renderTeamScoreboardHTML() {
        const visibleTeams = state.teams.slice(0, state.teamCount);
        const teamsListHtml = visibleTeams.map((team, idx) => {
            const activeTurnCls = state.activeTeamIndex === idx ? 'active-turn' : '';
            const turnBadge = state.activeTeamIndex === idx ? '<span class="team-turn-badge">Your Turn</span>' : '';
            return '<div class="scoreboard-team-card ' + activeTurnCls + '" data-team-idx="' + idx + '">' +
                '<div class="team-card-header">' +
                    '<input type="text" class="team-name-input" data-team-name-idx="' + idx + '" value="' + escapeHtml(team.name) + '" aria-label="Team ' + (idx + 1) + ' Name" />' +
                    turnBadge +
                '</div>' +
                '<div class="team-score-row">' +
                    '<button type="button" class="team-score-adj" data-team-adj-idx="' + idx + '" data-delta="-100" title="Subtract 100 pts">−100</button>' +
                    '<span class="team-score-value">' + team.score + '</span>' +
                    '<button type="button" class="team-score-adj" data-team-adj-idx="' + idx + '" data-delta="100" title="Add 100 pts">+100</button>' +
                '</div>' +
            '</div>';
        }).join('');

        return `
            <div class="learning-scoreboard-bar" aria-label="Classroom Team Scoreboard">
                <div class="scoreboard-teams-list">
                    ${teamsListHtml}
                </div>
                <div class="scoreboard-controls">
                    <div class="scoreboard-team-count-wrapper">
                        <label for="scoreboard-team-count">Teams:</label>
                        <select id="scoreboard-team-count" class="learning-select">
                            <option value="1" ${state.teamCount === 1 ? 'selected' : ''}>1</option>
                            <option value="2" ${state.teamCount === 2 ? 'selected' : ''}>2</option>
                            <option value="3" ${state.teamCount === 3 ? 'selected' : ''}>3</option>
                            <option value="4" ${state.teamCount === 4 ? 'selected' : ''}>4</option>
                        </select>
                    </div>
                    <button type="button" id="scoreboard-next-turn-btn" class="learning-mini-btn">Next Turn →</button>
                    <button type="button" id="scoreboard-reset-scores-btn" class="learning-mini-btn">Reset</button>
                </div>
            </div>
        `;
    }

    function renderActiveTabContent(classMeta) {
        switch (state.activeTab) {
            case 'interlinear':
                return renderInterlinearTab();
            case 'matcher':
                return renderMatcherTab(classMeta);
            case 'scramble':
                return renderScrambleTab();
            case 'jeopardy':
                return renderJeopardyTab(classMeta);
            case 'blitz':
                return renderBlitzTab(classMeta);
            default:
                return renderInterlinearTab();
        }
    }

    // ========================================================================
    // TAB 1: BIBLEHUB-STYLE GE'EZ INTERLINEAR EXPLORER
    // ========================================================================
    function renderInterlinearTab() {
        const lex = getLexicon();
        const passages = lex.INTERLINEAR_PASSAGES;

        const activePassage = passages.find(p => p.id === state.selectedPassageId) || passages[0];
        let wordsToRender = activePassage.words;
        let headerTitle = activePassage.title;
        let fullEnglish = activePassage.englishFull;
        let pedagogicalNote = activePassage.pedagogicalNote;

        const prayerList = (typeof prayers !== 'undefined' && Array.isArray(prayers))
            ? prayers.filter(p => p && p.geez_script && p.english).slice(0, 60)
            : [];

        if (state.useCustomPrayerStanza && prayerList.length > 0) {
            const pObj = prayerList[state.customPrayerIndex] || prayerList[0];
            headerTitle = (pObj.reference || 'Liturgical Prayer') + ' (Stanza ' + (pObj.stanza || 1) + ')';
            fullEnglish = pObj.english;
            pedagogicalNote = 'Dynamic Interlinear Mode: Tap any Ge\'ez word above to decompose its prefix, root, suffix, and see where else it appears in the Liturgy!';
            const rawTokens = pObj.geez_script.split(/\s+/).filter(Boolean);
            wordsToRender = rawTokens.map(tok => {
                const analyzed = lex.analyzeGeezWord(tok);
                return {
                    geez: tok,
                    phonetic: analyzed ? analyzed.phonetic : tok,
                    english: analyzed ? analyzed.meaning : '',
                    grammar: analyzed ? analyzed.breakdown : 'Ge\'ez Word'
                };
            });
        }

        const inspected = state.inspectedWordObj;
        const concordanceList = inspected ? lex.findWordConcordance(inspected.geez, 4) : [];

        const curatedOptionsHtml = passages.map(p => {
            const selAttr = (!state.useCustomPrayerStanza && state.selectedPassageId === p.id) ? 'selected' : '';
            return '<option value="' + escapeHtml(p.id) + '" ' + selAttr + '>' +
                escapeHtml(p.title) + '</option>';
        }).join('');

        let customOptionsGroupHtml = '';
        if (prayerList.length > 0) {
            const customOpts = prayerList.map((p, idx) => {
                const selAttr = (state.useCustomPrayerStanza && state.customPrayerIndex === idx) ? 'selected' : '';
                return '<option value="custom_' + idx + '" ' + selAttr + '>' +
                    escapeHtml(p.reference || p.chapter) + ' — ' + escapeHtml(p.geez_script.slice(0, 22)) + '…</option>';
            }).join('');
            customOptionsGroupHtml = '<optgroup label="Browse App Prayer Stanzas">' + customOpts + '</optgroup>';
        }

        const wordStacksHtml = wordsToRender.map((w, idx) => {
            const cleanW = w.geez.replace(/[፡።፣፤፥፦፧፨]/g, '').trim();
            const isSelected = inspected && inspected.geez === cleanW;
            const phonSpan = state.showInterlinearPhonetics ? '<span class="iw-phonetic">' + escapeHtml(w.phonetic) + '</span>' : '';
            const gramSpan = state.showInterlinearGrammar ? '<span class="iw-grammar">' + escapeHtml(w.grammar) + '</span>' : '';
            return '<button type="button" role="listitem" class="interlinear-word-stack ' + (isSelected ? 'selected' : '') + '" ' +
                'data-interlinear-word="' + escapeHtml(w.geez) + '" data-interlinear-idx="' + idx + '">' +
                phonSpan +
                '<span class="iw-geez ethiopic-label">' + escapeHtml(w.geez) + '</span>' +
                '<span class="iw-english">' + escapeHtml(w.english) + '</span>' +
                gramSpan +
                '</button>';
        }).join('');

        let concordanceSectionHtml = '<p class="concordance-empty">Tap another word above to search across Daily Prayer and the Divine Liturgy.</p>';
        if (concordanceList.length > 0) {
            const itemsHtml = concordanceList.map(c =>
                '<div class="concordance-item">' +
                    '<div class="concordance-source">' + escapeHtml(c.source) + '</div>' +
                    '<div class="concordance-geez ethiopic-label">' + escapeHtml(c.geez) + '</div>' +
                    '<div class="concordance-eng">' + escapeHtml(c.english) + '</div>' +
                '</div>'
            ).join('');
            concordanceSectionHtml = '<div class="concordance-list">' + itemsHtml + '</div>';
        }

        let inspectorHtml = '';
        if (inspected) {
            inspectorHtml = `
                <div class="interlinear-inspector-card" id="interlinear-inspector-card">
                    <div class="inspector-main-col">
                        <div class="inspector-word-header">
                            <div class="inspector-word-title-group">
                                <span class="inspector-geez ethiopic-label">${escapeHtml(inspected.geez)}</span>
                                <span class="inspector-phonetic">/${escapeHtml(inspected.phonetic)}/</span>
                                <span class="inspector-pos-badge">${escapeHtml(inspected.pos)}</span>
                            </div>
                            <button type="button" id="inspector-close-btn" class="inspector-close-btn" title="Close Root &amp; Concordance Drawer" aria-label="Close Inspector">✕</button>
                        </div>
                        <div class="inspector-meaning-row">
                            <strong>English Meaning:</strong> <span>${escapeHtml(inspected.meaning)}</span>
                        </div>
                        <div class="inspector-meta-grid">
                            <div class="inspector-meta-box">
                                <span class="meta-box-label">Root (ሥርወ ቃል)</span>
                                <span class="meta-box-val ethiopic-label">${escapeHtml(inspected.root)}</span>
                            </div>
                            <div class="inspector-meta-box">
                                <span class="meta-box-label">Morphological Breakdown</span>
                                <span class="meta-box-val ethiopic-label">${escapeHtml(inspected.breakdown)}</span>
                            </div>
                            <div class="inspector-meta-box">
                                <span class="meta-box-label">Amharic / Tigrinya / Semitic Cognates</span>
                                <span class="meta-box-val">${escapeHtml(inspected.cognates)}</span>
                            </div>
                        </div>
                        <p class="inspector-spiritual-note">${escapeHtml(inspected.note)}</p>
                    </div>

                    <div class="inspector-concordance-col">
                        <h4>Where Else Do We Pray "<span class="ethiopic-label">${escapeHtml(inspected.geez)}</span>"? (${concordanceList.length} matches)</h4>
                        ${concordanceSectionHtml}
                    </div>
                </div>
            `;
        }

        return `
            <div class="interlinear-workspace">
                <div class="interlinear-toolbar">
                    <div class="interlinear-selector-group">
                        <label for="interlinear-passage-select"><strong>Select Prayer Passage:</strong></label>
                        <select id="interlinear-passage-select" class="learning-select">
                            <optgroup label="Curated Word-by-Word Passages">
                                ${curatedOptionsHtml}
                            </optgroup>
                            ${customOptionsGroupHtml}
                        </select>
                    </div>

                    <div class="interlinear-toggles-group">
                        <label class="learning-checkbox-label">
                            <input type="checkbox" id="interlinear-phonetics-toggle" ${state.showInterlinearPhonetics ? 'checked' : ''} />
                            <span>Show Phonetics</span>
                        </label>
                        <label class="learning-checkbox-label">
                            <input type="checkbox" id="interlinear-grammar-toggle" ${state.showInterlinearGrammar ? 'checked' : ''} />
                            <span>Show Grammar</span>
                        </label>
                    </div>
                </div>

                <div class="interlinear-stanza-card">
                    <div class="interlinear-stanza-header">
                        <h3>${escapeHtml(headerTitle)}</h3>
                        <span class="interlinear-hint-pill">Tap any word for Root &amp; Concordance</span>
                    </div>

                    <div class="interlinear-words-grid" role="list">
                        ${wordStacksHtml}
                    </div>

                    <div class="interlinear-full-translation">
                        <span class="full-trans-label">Full Literary Translation:</span>
                        <p class="full-trans-text">${escapeHtml(fullEnglish)}</p>
                    </div>
                </div>

                ${inspectorHtml}

                <div class="interlinear-pedagogical-banner">
                    <strong>Note:</strong> ${escapeHtml(pedagogicalNote)}
                </div>
            </div>
        `;
    }

    // ========================================================================
    // TAB 2: LITURGICAL PHRASE & VOCABULARY MATCHER
    // ========================================================================
    function renderMatcherTab(classMeta) {
        const lex = getLexicon();
        if (!state.matcherCards || !state.matcherCards.left || state.matcherCards.left.length === 0) {
            initMatcherRound();
        }

        const totalPairs = state.matcherCards.left.length;
        const solvedCount = state.matchedPairIds.length;
        const isAllSolved = totalPairs > 0 && solvedCount === totalPairs;

        const packOptionsHtml = lex.MATCHER_PACKS.map(pack => {
            const selAttr = state.selectedMatcherPackId === pack.id ? 'selected' : '';
            return '<option value="' + escapeHtml(pack.id) + '" ' + selAttr + '>' +
                escapeHtml(pack.title) + ' (' + pack.pairs.length + ' terms)</option>';
        }).join('');

        const leftCardsHtml = state.matcherCards.left.map(card => {
            const isMatched = state.matchedPairIds.includes(card.id);
            const isSelected = state.selectedLeftId === card.id;
            const cls = 'matcher-card matcher-card-left' + (isMatched ? ' matched' : '') + (isSelected ? ' selected' : '');
            const checkSpan = isMatched ? '<span class="matcher-check">✓</span>' : '';
            return '<button type="button" class="' + cls + '" data-matcher-left="' + escapeHtml(card.id) + '" ' + (isMatched ? 'disabled' : '') + '>' +
                '<span class="matcher-geez-text ethiopic-label">' + escapeHtml(card.geez) + '</span>' +
                checkSpan + '</button>';
        }).join('');

        const rightCardsHtml = state.matcherCards.right.map(card => {
            const isMatched = state.matchedPairIds.includes(card.id);
            const isSelected = state.selectedRightId === card.id;
            const cls = 'matcher-card matcher-card-right' + (isMatched ? ' matched' : '') + (isSelected ? ' selected' : '');
            const phonSpan = state.showMatcherPhonetics ? '<span class="matcher-phon-text">' + escapeHtml(card.phonetic) + '</span>' : '';
            const checkSpan = isMatched ? '<span class="matcher-check">✓</span>' : '';
            return '<button type="button" class="' + cls + '" data-matcher-right="' + escapeHtml(card.id) + '" ' + (isMatched ? 'disabled' : '') + '>' +
                '<span class="matcher-eng-text">' + escapeHtml(card.english) + '</span>' +
                phonSpan + checkSpan + '</button>';
        }).join('');

        const bannerContentHtml = isAllSolved
            ? '<strong>🎉 Blessed Work (' + escapeHtml(classMeta.name) + ')!</strong> You matched all ' + totalPairs + ' liturgical terms! Tap "Shuffle New Round" to keep practicing!'
            : '<strong>Liturgical Insight:</strong> ' + escapeHtml(state.lastMatchedNote);

        return `
            <div class="matcher-workspace">
                <div class="matcher-context-banner ${isAllSolved ? 'completed' : ''}">
                    ${bannerContentHtml}
                </div>

                <div class="matcher-board-columns">
                    <div class="matcher-column">
                        <h3 class="matcher-col-title ethiopic-label">ግእዝ (Ge'ez Script)</h3>
                        <div class="matcher-cards-stack">
                            ${leftCardsHtml}
                        </div>
                    </div>

                    <div class="matcher-column">
                        <h3 class="matcher-col-title">English Meaning ${state.showMatcherPhonetics ? '&amp; Phonetics' : ''}</h3>
                        <div class="matcher-cards-stack">
                            ${rightCardsHtml}
                        </div>
                    </div>
                </div>

                <div class="game-top-controls matcher-bottom-controls">
                    <div class="game-pack-selector">
                        <label for="matcher-pack-select"><strong>Vocabulary Pack:</strong></label>
                        <select id="matcher-pack-select" class="learning-select">
                            ${packOptionsHtml}
                        </select>
                    </div>

                    <div class="game-stats-pills">
                        <label class="learning-checkbox-label">
                            <input type="checkbox" id="matcher-phonetics-toggle" ${state.showMatcherPhonetics ? 'checked' : ''} />
                            <span>Show Phonetic Hints</span>
                        </label>
                        <span class="stat-pill">Matched: <strong>${solvedCount}/${totalPairs}</strong></span>
                        <button type="button" id="matcher-new-round-btn" class="learning-action-btn">Shuffle New Round</button>
                    </div>
                </div>
            </div>
        `;
    }

    // ========================================================================
    // TAB 3: QIDASE SCRAMBLE (ORDER OF THE LITURGY SEQUENCING)
    // ========================================================================
    function renderScrambleTab() {
        const lex = getLexicon();
        if (!state.scrambleItems || state.scrambleItems.length === 0) {
            initScrambleRound();
        }
        const pack = lex.QIDASE_SCRAMBLE_PACKS.find(p => p.id === state.selectedScramblePackId) || lex.QIDASE_SCRAMBLE_PACKS[0];

        const packOptionsHtml = lex.QIDASE_SCRAMBLE_PACKS.map(p => {
            const selAttr = state.selectedScramblePackId === p.id ? 'selected' : '';
            return '<option value="' + escapeHtml(p.id) + '" ' + selAttr + '>' + escapeHtml(p.title) + '</option>';
        }).join('');

        let feedbackBannerHtml = '';
        if (state.scrambleChecked) {
            const msg = state.scrambleIsCorrect
                ? '<strong>✨ Correct Chronological Order!</strong> ' + escapeHtml(pack.pedagogicalSummary)
                : '<strong>Keep Adjusting:</strong> Steps highlighted in gold are in their rightful place; swap the remaining steps and tap "Check Order" again!';
            feedbackBannerHtml = '<div class="scramble-feedback-banner ' + (state.scrambleIsCorrect ? 'correct' : 'needs-work') + '">' + msg + '</div>';
        }

        const stepsHtml = state.scrambleItems.map((step, idx) => {
            const isSelected = state.selectedScrambleIndex === idx;
            const isPositionCorrect = state.scrambleChecked && step.order === idx + 1;
            const isPositionWrong = state.scrambleChecked && step.order !== idx + 1;
            const cls = 'scramble-step-card' +
                (isSelected ? ' selected' : '') +
                (isPositionCorrect ? ' correct-pos' : '') +
                (isPositionWrong ? ' wrong-pos' : '');
            const whyDiv = (state.scrambleChecked && isPositionCorrect)
                ? '<div class="scramble-step-why"><strong>Why at Step ' + step.order + ':</strong> ' + escapeHtml(step.why) + '</div>'
                : '';
            return '<div class="' + cls + '" data-scramble-idx="' + idx + '">' +
                '<div class="scramble-step-num">' + (idx + 1) + '</div>' +
                '<div class="scramble-step-body">' +
                    '<div class="scramble-step-title">' + escapeHtml(step.title) + '</div>' +
                    '<div class="scramble-step-geez">' +
                        '<span class="ethiopic-label">' + escapeHtml(step.ethiopic) + '</span> ' +
                        '<span class="scramble-step-phonetic">(' + escapeHtml(step.phonetic) + ')</span>' +
                    '</div>' +
                    whyDiv +
                '</div>' +
                '<div class="scramble-step-arrows">' +
                    '<button type="button" class="scramble-arrow-btn" data-scramble-move="' + idx + '" data-dir="-1" ' + (idx === 0 ? 'disabled' : '') + ' title="Move Up">▲</button>' +
                    '<button type="button" class="scramble-arrow-btn" data-scramble-move="' + idx + '" data-dir="1" ' + (idx === state.scrambleItems.length - 1 ? 'disabled' : '') + ' title="Move Down">▼</button>' +
                '</div>' +
            '</div>';
        }).join('');

        return `
            <div class="scramble-workspace">
                <div class="game-top-controls">
                    <div class="game-pack-selector">
                        <label for="scramble-pack-select"><strong>Liturgical Sequence Challenge:</strong></label>
                        <select id="scramble-pack-select" class="learning-select">
                            ${packOptionsHtml}
                        </select>
                    </div>

                    <div class="game-stats-pills">
                        <button type="button" id="scramble-check-btn" class="learning-primary-btn">Check Order</button>
                        <button type="button" id="scramble-reset-btn" class="learning-action-btn">Reshuffle</button>
                    </div>
                </div>

                <p class="scramble-instructions">
                    ${escapeHtml(pack.description)} <em>(Tap any two steps to swap their positions, or use the ▲ / ▼ arrows.)</em>
                </p>

                ${feedbackBannerHtml}

                <div class="scramble-steps-list">
                    ${stepsHtml}
                </div>
            </div>
        `;
    }

    // ========================================================================
    // TAB 4: CLASSROOM PROCEDURAL JEOPARDY (WITH SELECTED READINGS & PICKER)
    // ========================================================================
    function renderJeopardyTab(classMeta) {
        const lex = getLexicon();
        if (!state.jeopardyBoard || state.jeopardyBoard.length === 0) {
            buildProceduralJeopardyBoard();
        }

        const board = state.jeopardyBoard;
        const numCols = board.length;
        const numRows = board[0] ? board[0].clues.length : 0;

        let pickerModalHtml = '';
        if (state.showCategoryPickerModal) {
            const catOptsHtml = lex.JEOPARDY_CATEGORIES_META.map(cat => {
                const checked = state.selectedCategoryIds.includes(cat.id);
                return '<label class="cat-picker-option ' + (checked ? 'checked' : '') + '">' +
                    '<input type="checkbox" class="jeopardy-cat-checkbox" value="' + escapeHtml(cat.id) + '" ' + (checked ? 'checked' : '') + ' />' +
                    '<div>' +
                        '<div class="cat-opt-title">' + escapeHtml(cat.title) + ' <span class="ethiopic-label">(' + escapeHtml(cat.ethiopic) + ')</span></div>' +
                        '<div class="cat-opt-desc">' + escapeHtml(cat.description) + '</div>' +
                    '</div>' +
                '</label>';
            }).join('');

            pickerModalHtml = `
                <div class="jeopardy-category-picker-card">
                    <div class="cat-picker-header">
                        <h4>Select Categories for ${escapeHtml(classMeta.name)} (${classMeta.boardSize} columns)</h4>
                        <button type="button" id="jeopardy-apply-categories-btn" class="learning-primary-btn">Apply &amp; Build Board</button>
                    </div>
                    <div class="cat-picker-grid">
                        ${catOptsHtml}
                    </div>
                </div>
            `;
        }

        const activeClueModalHtml = state.activeClue ? renderJeopardyActiveClueModal() : '';

        const catHeadersHtml = board.map(col =>
            '<div class="jeopardy-cat-header">' +
                '<span class="j-cat-ethiopic ethiopic-label">' + escapeHtml(col.ethiopic) + '</span>' +
                '<span class="j-cat-title">' + escapeHtml(col.title) + '</span>' +
            '</div>'
        ).join('');

        const gridCellsHtml = Array.from({ length: numRows }).map((_, rowIdx) =>
            board.map((col, colIdx) => {
                const clue = col.clues[rowIdx];
                if (!clue) return '<div class="jeopardy-cell empty"></div>';
                const cls = 'jeopardy-cell' + (clue.answered ? ' answered' : '');
                return '<button type="button" class="' + cls + '" data-jeopardy-col="' + colIdx + '" data-jeopardy-row="' + rowIdx + '" ' + (clue.answered ? 'disabled' : '') + '>' +
                    '<span class="jeopardy-cell-points">' + (clue.answered ? '✓' : clue.points) + '</span>' +
                '</button>';
            }).join('')
        ).join('');

        return `
            <div class="jeopardy-workspace">
                <div class="game-top-controls">
                    <div class="game-stats-pills">
                        <label class="learning-checkbox-label" title="Include a category generated from the Scripture & Liturgy readings currently selected in the app">
                            <input type="checkbox" id="jeopardy-tailor-readings-toggle" ${state.prioritizeSelectedReadings ? 'checked' : ''} />
                            <span>Include Today's Selected Readings</span>
                        </label>
                        <button type="button" id="jeopardy-pick-categories-btn" class="learning-action-btn">
                            Pick Categories (${state.selectedCategoryIds.length})
                        </button>
                        <button type="button" id="jeopardy-new-board-btn" class="learning-primary-btn">
                            Generate New Board
                        </button>
                    </div>
                </div>

                ${pickerModalHtml}
                ${activeClueModalHtml}

                <div class="jeopardy-board-grid cols-${numCols}">
                    ${catHeadersHtml}
                    ${gridCellsHtml}
                </div>
            </div>
        `;
    }

    function renderJeopardyActiveClueModal() {
        const active = state.activeClue;
        if (!active || !active.clue) return '';
        const clue = active.clue;
        const activeTeam = state.teams[state.activeTeamIndex] || state.teams[0];
        const pointValue = clue.isDailyDouble ? clue.points * 2 : clue.points;

        let optionsGridHtml = '';
        if (active.showOptions) {
            const optButtons = (clue.options || []).map(opt => {
                const isCorrectOpt = active.revealedAnswer && opt === clue.answer;
                const isPickedOpt = active.pickedOption === opt;
                const cls = 'j-clue-option-btn' +
                    (isCorrectOpt ? ' correct-opt' : '') +
                    ((isPickedOpt && !isCorrectOpt && active.revealedAnswer) ? ' wrong-opt' : '');
                return '<button type="button" class="' + cls + '" data-jeopardy-opt="' + escapeHtml(opt) + '">' +
                    escapeHtml(opt) + '</button>';
            }).join('');
            optionsGridHtml = '<div class="j-clue-options-grid">' + optButtons + '</div>';
        }

        let answerBoxHtml = '';
        if (active.revealedAnswer) {
            answerBoxHtml = '<div class="j-clue-answer-box">' +
                '<div class="j-answer-headline"><strong>Answer:</strong> ' + escapeHtml(clue.answer) + '</div>' +
                '<div class="j-answer-insight">' + escapeHtml(clue.insight || '') + '</div>' +
            '</div>';
        }

        const showOptsBtnHtml = (!active.showOptions && !active.revealedAnswer)
            ? '<button type="button" id="j-clue-show-options-btn" class="learning-action-btn">Show 4 Multiple-Choice Options</button>'
            : '';

        const revealOrAwardHtml = !active.revealedAnswer
            ? '<button type="button" id="j-clue-reveal-btn" class="learning-primary-btn">Reveal Answer</button>'
            : '<div class="j-award-buttons">' +
                '<button type="button" id="j-clue-award-correct-btn" class="learning-primary-btn" data-pts="' + pointValue + '">✓ Award +' + pointValue + ' to ' + escapeHtml(activeTeam.name) + '</button>' +
                '<button type="button" id="j-clue-no-award-btn" class="learning-action-btn">Close (No Points)</button>' +
              '</div>';

        return `
            <div class="jeopardy-clue-modal-backdrop" id="jeopardy-clue-modal">
                <div class="jeopardy-clue-modal-card">
                    <div class="j-clue-top-bar">
                        <span class="j-clue-category">${escapeHtml(active.categoryTitle)} • <strong>${pointValue} Points</strong></span>
                        ${clue.isDailyDouble ? '<span class="j-daily-double-badge">✨ ዕጥፍ ጸጋ • DOUBLE GRACE CLUE (2× Points)!</span>' : ''}
                        <span class="j-clue-turn">Answering: <strong>${escapeHtml(activeTeam.name)}</strong></span>
                    </div>

                    <div class="j-clue-prompt-text">
                        ${escapeHtml(clue.prompt)}
                    </div>

                    ${optionsGridHtml}
                    ${answerBoxHtml}

                    <div class="j-clue-footer-actions">
                        ${showOptsBtnHtml}
                        ${revealOrAwardHtml}
                    </div>
                </div>
            </div>
        `;
    }

    // ========================================================================
    // TAB 5: LITURGICAL RESPONSE BLITZ (CONTINUOUS CLASS CHALLENGE)
    // ========================================================================
    function renderBlitzTab(classMeta) {
        if (!state.blitzQueue || state.blitzQueue.length === 0) {
            initBlitzQueue();
        }
        const item = state.blitzQueue[state.blitzCurrentIndex % state.blitzQueue.length];

        const phoneticClueHtml = state.blitzClueLevel >= 2
            ? '<div class="blitz-phonetic-clue">Phonetic: <strong>' + escapeHtml(item.phonetic) + '</strong></div>'
            : '<button type="button" id="blitz-reveal-phonetic-btn" class="learning-action-btn">Reveal Clue</button>';

        const optionsHtml = item.options.map(opt => {
            const isCorrect = opt === item.english;
            const isSelected = state.blitzSelectedAnswer === opt;
            let btnClass = 'blitz-option-btn';
            if (state.blitzAnsweredCurrent) {
                if (isCorrect) btnClass += ' correct';
                else if (isSelected) btnClass += ' wrong';
            }
            return '<button type="button" class="' + btnClass + '" data-blitz-opt="' + escapeHtml(opt) + '" ' +
                (state.blitzAnsweredCurrent ? 'disabled' : '') + '>' + escapeHtml(opt) + '</button>';
        }).join('');

        const noteHtml = state.blitzAnsweredCurrent
            ? '<div class="blitz-context-note"><strong>Liturgical Context:</strong> ' + escapeHtml(item.note) + '</div>'
            : '';

        return `
            <div class="blitz-workspace">
                <div class="game-top-controls">
                    <div class="game-stats-pills">
                        <span class="stat-pill">Class Streak: <strong>🔥 ${state.blitzStreak}</strong></span>
                        <span class="stat-pill">Solved: <strong>${state.blitzTotalSolved}</strong></span>
                        <button type="button" id="blitz-next-card-btn" class="learning-primary-btn">Next →</button>
                    </div>
                </div>

                <div class="blitz-stage-card">
                    <div class="blitz-geez-display ethiopic-label">${escapeHtml(item.geez)}</div>

                    ${phoneticClueHtml}

                    <div class="blitz-options-grid">
                        ${optionsHtml}
                    </div>

                    ${noteHtml}
                </div>
            </div>
        `;
    }

    // ========================================================================
    // EVENT BINDING & INTERACTION LOGIC
    // ========================================================================
    function applyClassSelection(newClassId) {
        state.selectedClassId = newClassId;
        if (newClassId === 'st_kirkos') {
            state.selectedMatcherPackId = 'hitsanat_foundations';
            state.selectedScramblePackId = 'lords_prayer_sequence';
        } else if (newClassId === 'st_arsema') {
            state.selectedMatcherPackId = 'arsema_responses';
            state.selectedScramblePackId = 'major_liturgy_pillars';
        } else {
            state.selectedMatcherPackId = 'st_john_daily_prayer';
            state.selectedScramblePackId = 'lectionary_progression';
        }
        initMatcherRound(state.selectedMatcherPackId);
        initScrambleRound(state.selectedScramblePackId);
        buildProceduralJeopardyBoard();
        saveLearningSettings();
        renderLearningView();
    }

    function bindLearningEvents(container) {
        const lex = getLexicon();

        const classSelect = container.querySelector('#learning-class-select');
        if (classSelect) {
            classSelect.value = state.selectedClassId;
            classSelect.addEventListener('change', () => {
                applyClassSelection(classSelect.value);
            });
        }

        container.querySelectorAll('[data-class-id]').forEach(btn => {
            btn.addEventListener('click', () => {
                applyClassSelection(btn.getAttribute('data-class-id'));
            });
        });

        const vibeSelect = container.querySelector('#learning-vibe-select');
        if (vibeSelect) {
            vibeSelect.value = state.gameTheme || 'default';
            vibeSelect.addEventListener('change', () => {
                state.gameTheme = vibeSelect.value || 'default';
                saveLearningSettings();
                renderLearningView();
            });
        }

        const fxBtn = container.querySelector('#learning-fx-toggle-btn');
        if (fxBtn) {
            fxBtn.addEventListener('click', () => {
                state.celebrationEffects = !state.celebrationEffects;
                saveLearningSettings();
                renderLearningView();
                if (state.celebrationEffects) {
                    triggerCelebrationFX('correct');
                }
            });
        }

        const mascotBtn = container.querySelector('#learning-plushy-mascot-btn');
        if (mascotBtn) {
            mascotBtn.addEventListener('click', () => {
                const img = mascotBtn.querySelector('.learning-plushy-icon');
                if (img) {
                    img.classList.remove('plushy-squish-anim');
                    void img.offsetWidth;
                    img.classList.add('plushy-squish-anim');
                }
            });
        }

        const tvBtn = container.querySelector('#learning-tv-toggle-btn');
        if (tvBtn) {
            tvBtn.addEventListener('click', () => {
                state.tvProjectionMode = !state.tvProjectionMode;
                renderLearningView();
            });
        }

        const exitBtn = container.querySelector('#learning-exit-btn');
        if (exitBtn) {
            exitBtn.addEventListener('click', () => {
                toggleLearningMode(false);
            });
        }

        container.querySelectorAll('[data-tab]').forEach(tabBtn => {
            tabBtn.addEventListener('click', () => {
                state.activeTab = tabBtn.getAttribute('data-tab');
                saveLearningSettings();
                renderLearningView();
            });
        });

        const teamCountSelect = container.querySelector('#scoreboard-team-count');
        if (teamCountSelect) {
            teamCountSelect.value = String(state.teamCount);
            teamCountSelect.addEventListener('change', () => {
                const count = parseInt(teamCountSelect.value, 10);
                if (count >= 1 && count <= 4) {
                    state.teamCount = count;
                    if (state.activeTeamIndex >= state.teamCount) {
                        state.activeTeamIndex = 0;
                    }
                    saveLearningSettings();
                    renderLearningView();
                }
            });
        }

        container.querySelectorAll('[data-team-name-idx]').forEach(input => {
            input.addEventListener('change', () => {
                const idx = parseInt(input.getAttribute('data-team-name-idx'), 10);
                if (state.teams[idx]) {
                    state.teams[idx].name = input.value.trim() || ('Team ' + (idx + 1));
                    saveLearningSettings();
                }
            });
        });

        container.querySelectorAll('[data-team-adj-idx]').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-team-adj-idx'), 10);
                const delta = parseInt(btn.getAttribute('data-delta'), 10);
                if (state.teams[idx]) {
                    state.teams[idx].score += delta;
                    saveLearningSettings();
                    renderLearningView();
                }
            });
        });

        const nextTurnBtn = container.querySelector('#scoreboard-next-turn-btn');
        if (nextTurnBtn) {
            nextTurnBtn.addEventListener('click', () => {
                state.activeTeamIndex = (state.activeTeamIndex + 1) % state.teamCount;
                renderLearningView();
            });
        }

        const resetScoresBtn = container.querySelector('#scoreboard-reset-scores-btn');
        if (resetScoresBtn) {
            resetScoresBtn.addEventListener('click', () => {
                state.teams.forEach(t => { t.score = 0; });
                state.activeTeamIndex = 0;
                saveLearningSettings();
                renderLearningView();
            });
        }

        const inspectorCloseBtn = container.querySelector('#inspector-close-btn');
        if (inspectorCloseBtn) {
            inspectorCloseBtn.addEventListener('click', () => {
                state.inspectedWordObj = null;
                renderLearningView();
            });
        }

        const passageSelect = container.querySelector('#interlinear-passage-select');
        if (passageSelect) {
            passageSelect.addEventListener('change', () => {
                const val = passageSelect.value;
                if (val.startsWith('custom_')) {
                    state.useCustomPrayerStanza = true;
                    state.customPrayerIndex = parseInt(val.replace('custom_', ''), 10) || 0;
                } else {
                    state.useCustomPrayerStanza = false;
                    state.selectedPassageId = val;
                }
                state.inspectedWordObj = null;
                renderLearningView();
            });
        }

        const interPhonToggle = container.querySelector('#interlinear-phonetics-toggle');
        if (interPhonToggle) {
            interPhonToggle.addEventListener('change', () => {
                state.showInterlinearPhonetics = interPhonToggle.checked;
                saveLearningSettings();
                renderLearningView();
            });
        }

        const interGramToggle = container.querySelector('#interlinear-grammar-toggle');
        if (interGramToggle) {
            interGramToggle.addEventListener('change', () => {
                state.showInterlinearGrammar = interGramToggle.checked;
                saveLearningSettings();
                renderLearningView();
            });
        }

        container.querySelectorAll('[data-interlinear-word]').forEach(wordBtn => {
            wordBtn.addEventListener('click', () => {
                const rawWord = wordBtn.getAttribute('data-interlinear-word');
                if (lex) {
                    state.inspectedWordObj = lex.analyzeGeezWord(rawWord);
                    renderLearningView();
                }
            });
        });

        const matcherPackSelect = container.querySelector('#matcher-pack-select');
        if (matcherPackSelect) {
            matcherPackSelect.addEventListener('change', () => {
                initMatcherRound(matcherPackSelect.value);
                renderLearningView();
            });
        }

        const matcherPhonToggle = container.querySelector('#matcher-phonetics-toggle');
        if (matcherPhonToggle) {
            matcherPhonToggle.addEventListener('change', () => {
                state.showMatcherPhonetics = matcherPhonToggle.checked;
                saveLearningSettings();
                renderLearningView();
            });
        }

        const matcherNewRoundBtn = container.querySelector('#matcher-new-round-btn');
        if (matcherNewRoundBtn) {
            matcherNewRoundBtn.addEventListener('click', () => {
                initMatcherRound(state.selectedMatcherPackId);
                renderLearningView();
            });
        }

        container.querySelectorAll('[data-matcher-left]').forEach(btn => {
            btn.addEventListener('click', () => {
                state.selectedLeftId = btn.getAttribute('data-matcher-left');
                evaluateMatcherSelection();
                renderLearningView();
            });
        });

        container.querySelectorAll('[data-matcher-right]').forEach(btn => {
            btn.addEventListener('click', () => {
                state.selectedRightId = btn.getAttribute('data-matcher-right');
                evaluateMatcherSelection();
                renderLearningView();
            });
        });

        const scramblePackSelect = container.querySelector('#scramble-pack-select');
        if (scramblePackSelect) {
            scramblePackSelect.addEventListener('change', () => {
                initScrambleRound(scramblePackSelect.value);
                renderLearningView();
            });
        }

        const scrambleCheckBtn = container.querySelector('#scramble-check-btn');
        if (scrambleCheckBtn) {
            scrambleCheckBtn.addEventListener('click', () => {
                state.scrambleChecked = true;
                state.scrambleIsCorrect = state.scrambleItems.every((item, idx) => item.order === idx + 1);
                renderLearningView();
            });
        }

        const scrambleResetBtn = container.querySelector('#scramble-reset-btn');
        if (scrambleResetBtn) {
            scrambleResetBtn.addEventListener('click', () => {
                initScrambleRound(state.selectedScramblePackId);
                renderLearningView();
            });
        }

        container.querySelectorAll('[data-scramble-move]').forEach(arrowBtn => {
            arrowBtn.addEventListener('click', (ev) => {
                ev.stopPropagation();
                const idx = parseInt(arrowBtn.getAttribute('data-scramble-move'), 10);
                const dir = parseInt(arrowBtn.getAttribute('data-dir'), 10);
                const targetIdx = idx + dir;
                if (targetIdx >= 0 && targetIdx < state.scrambleItems.length) {
                    const temp = state.scrambleItems[idx];
                    state.scrambleItems[idx] = state.scrambleItems[targetIdx];
                    state.scrambleItems[targetIdx] = temp;
                    state.selectedScrambleIndex = null;
                    state.scrambleChecked = false;
                    renderLearningView();
                }
            });
        });

        container.querySelectorAll('[data-scramble-idx]').forEach(cardEl => {
            cardEl.addEventListener('click', () => {
                const idx = parseInt(cardEl.getAttribute('data-scramble-idx'), 10);
                if (state.selectedScrambleIndex === null) {
                    state.selectedScrambleIndex = idx;
                } else if (state.selectedScrambleIndex === idx) {
                    state.selectedScrambleIndex = null;
                } else {
                    const prevIdx = state.selectedScrambleIndex;
                    const temp = state.scrambleItems[prevIdx];
                    state.scrambleItems[prevIdx] = state.scrambleItems[idx];
                    state.scrambleItems[idx] = temp;
                    state.selectedScrambleIndex = null;
                    state.scrambleChecked = false;
                }
                renderLearningView();
            });
        });

        const tailorToggle = container.querySelector('#jeopardy-tailor-readings-toggle');
        if (tailorToggle) {
            tailorToggle.addEventListener('change', () => {
                state.prioritizeSelectedReadings = tailorToggle.checked;
                if (state.prioritizeSelectedReadings && !state.selectedCategoryIds.includes('active_lectionary')) {
                    state.selectedCategoryIds = ['active_lectionary', ...state.selectedCategoryIds];
                } else if (!state.prioritizeSelectedReadings) {
                    state.selectedCategoryIds = state.selectedCategoryIds.filter(id => id !== 'active_lectionary');
                }
                buildProceduralJeopardyBoard();
                saveLearningSettings();
                renderLearningView();
            });
        }

        const pickCatBtn = container.querySelector('#jeopardy-pick-categories-btn');
        if (pickCatBtn) {
            pickCatBtn.addEventListener('click', () => {
                state.showCategoryPickerModal = !state.showCategoryPickerModal;
                renderLearningView();
            });
        }

        const applyCatBtn = container.querySelector('#jeopardy-apply-categories-btn');
        if (applyCatBtn) {
            applyCatBtn.addEventListener('click', () => {
                const checkedBoxes = Array.from(container.querySelectorAll('.jeopardy-cat-checkbox:checked'));
                const chosen = checkedBoxes.map(cb => cb.value);
                if (chosen.length >= 1) {
                    state.selectedCategoryIds = chosen;
                    state.prioritizeSelectedReadings = chosen.includes('active_lectionary');
                }
                state.showCategoryPickerModal = false;
                buildProceduralJeopardyBoard();
                saveLearningSettings();
                renderLearningView();
            });
        }

        const newBoardBtn = container.querySelector('#jeopardy-new-board-btn');
        if (newBoardBtn) {
            newBoardBtn.addEventListener('click', () => {
                buildProceduralJeopardyBoard();
                renderLearningView();
            });
        }

        container.querySelectorAll('[data-jeopardy-col]').forEach(cellBtn => {
            cellBtn.addEventListener('click', () => {
                const colIdx = parseInt(cellBtn.getAttribute('data-jeopardy-col'), 10);
                const rowIdx = parseInt(cellBtn.getAttribute('data-jeopardy-row'), 10);
                const col = state.jeopardyBoard[colIdx];
                if (col && col.clues[rowIdx]) {
                    const clue = col.clues[rowIdx];
                    state.activeClue = {
                        colIdx,
                        rowIdx,
                        categoryTitle: col.title,
                        clue,
                        showOptions: state.selectedClassId === 'st_kirkos',
                        revealedAnswer: false,
                        pickedOption: null
                    };
                    recordPlayedClueId(clue.id);
                    renderLearningView();
                }
            });
        });

        const showOptsBtn = container.querySelector('#j-clue-show-options-btn');
        if (showOptsBtn && state.activeClue) {
            showOptsBtn.addEventListener('click', () => {
                state.activeClue.showOptions = true;
                renderLearningView();
            });
        }

        container.querySelectorAll('[data-jeopardy-opt]').forEach(optBtn => {
            optBtn.addEventListener('click', () => {
                if (!state.activeClue) return;
                const picked = optBtn.getAttribute('data-jeopardy-opt');
                state.activeClue.pickedOption = picked;
                state.activeClue.revealedAnswer = true;
                state.pendingFx = (picked === state.activeClue.clue.answer) ? 'correct' : 'wrong';
                renderLearningView();
            });
        });

        const revealBtn = container.querySelector('#j-clue-reveal-btn');
        if (revealBtn && state.activeClue) {
            revealBtn.addEventListener('click', () => {
                state.activeClue.revealedAnswer = true;
                renderLearningView();
            });
        }

        const awardBtn = container.querySelector('#j-clue-award-correct-btn');
        if (awardBtn && state.activeClue) {
            awardBtn.addEventListener('click', () => {
                const pts = parseInt(awardBtn.getAttribute('data-pts'), 10) || 100;
                const team = state.teams[state.activeTeamIndex];
                if (team) team.score += pts;
                state.activeClue.clue.answered = true;
                state.activeTeamIndex = (state.activeTeamIndex + 1) % state.teamCount;
                state.activeClue = null;
                state.pendingFx = 'correct';
                saveLearningSettings();
                renderLearningView();
            });
        }

        const noAwardBtn = container.querySelector('#j-clue-no-award-btn');
        if (noAwardBtn && state.activeClue) {
            noAwardBtn.addEventListener('click', () => {
                state.activeClue.clue.answered = true;
                state.activeTeamIndex = (state.activeTeamIndex + 1) % state.teamCount;
                state.activeClue = null;
                renderLearningView();
            });
        }

        const blitzPhonBtn = container.querySelector('#blitz-reveal-phonetic-btn');
        if (blitzPhonBtn) {
            blitzPhonBtn.addEventListener('click', () => {
                state.blitzClueLevel = 2;
                renderLearningView();
            });
        }

        container.querySelectorAll('[data-blitz-opt]').forEach(optBtn => {
            optBtn.addEventListener('click', () => {
                const picked = optBtn.getAttribute('data-blitz-opt');
                const currentItem = state.blitzQueue[state.blitzCurrentIndex % state.blitzQueue.length];
                state.blitzSelectedAnswer = picked;
                state.blitzAnsweredCurrent = true;
                if (currentItem && picked === currentItem.english) {
                    state.blitzStreak += 1;
                    state.blitzTotalSolved += 1;
                    const activeTeam = state.teams[state.activeTeamIndex];
                    if (activeTeam) activeTeam.score += 100;
                    state.pendingFx = 'correct';
                } else {
                    state.blitzStreak = 0;
                    state.pendingFx = 'wrong';
                }
                saveLearningSettings();
                renderLearningView();
            });
        });

        const blitzNextBtn = container.querySelector('#blitz-next-card-btn');
        if (blitzNextBtn) {
            blitzNextBtn.addEventListener('click', () => {
                state.blitzCurrentIndex = (state.blitzCurrentIndex + 1) % state.blitzQueue.length;
                state.blitzClueLevel = 1;
                state.blitzAnsweredCurrent = false;
                state.blitzSelectedAnswer = null;
                state.activeTeamIndex = (state.activeTeamIndex + 1) % state.teamCount;
                renderLearningView();
            });
        }
    }

    function evaluateMatcherSelection() {
        if (!state.selectedLeftId || !state.selectedRightId) return;
        state.matcherMoves += 1;
        if (state.selectedLeftId === state.selectedRightId) {
            const matchedId = state.selectedLeftId;
            if (!state.matchedPairIds.includes(matchedId)) {
                state.matchedPairIds.push(matchedId);
            }
            const cardObj = state.matcherCards.left.find(c => c.id === matchedId);
            if (cardObj && cardObj.note) {
                state.lastMatchedNote = cardObj.note;
            }
            state.pendingFx = 'correct';
        } else {
            state.matcherMistakes += 1;
            state.lastMatchedNote = 'Not quite a match — look closely at the Ge\'ez root or phonetic hint and try again!';
            state.pendingFx = 'wrong';
        }
        state.selectedLeftId = null;
        state.selectedRightId = null;
    }

    // ========================================================================
    // MODE TOGGLE & HEADER INTEGRATION
    // ========================================================================
    function toggleLearningMode(forceState) {
        loadLearningSettings();
        const container = ensureLearningDOM();
        if (!container) return;

        const nextActive = typeof forceState === 'boolean' ? forceState : !state.isActive;
        state.isActive = nextActive;

        if (state.isActive) {
            if (typeof window.toggleTargumaMode === 'function') {
                window.toggleTargumaMode(false);
            }
            if (typeof collapseSidebar === 'function') {
                collapseSidebar();
            }
        }

        const prayerDisplayEl = document.getElementById('prayer-display');
        const headerBtn = document.getElementById('learning-mode-toggle-header');

        document.body.classList.toggle('learning-mode-active', state.isActive);
        container.classList.toggle('hidden', !state.isActive);

        if (prayerDisplayEl) {
            const targumaActive = document.body.classList.contains('targuma-mode-active');
            prayerDisplayEl.classList.toggle('hidden', state.isActive || targumaActive);
        }

        if (headerBtn) {
            headerBtn.classList.toggle('learning-header-active', state.isActive);
        }

        if (state.isActive) {
            if (!state.matcherCards || !state.matcherCards.left || state.matcherCards.left.length === 0) {
                initMatcherRound();
            }
            if (!state.scrambleItems || state.scrambleItems.length === 0) {
                initScrambleRound();
            }
            if (!state.jeopardyBoard || state.jeopardyBoard.length === 0) {
                buildProceduralJeopardyBoard();
            }
            if (!state.blitzQueue || state.blitzQueue.length === 0) {
                initBlitzQueue();
            }
            renderLearningView();
            const mascotImg = container.querySelector('.learning-plushy-icon');
            if (mascotImg) {
                mascotImg.classList.add('plushy-squish-anim');
            }
            window.scrollTo(0, 0);
        }
    }

    function initLearningFeature() {
        loadLearningSettings();
        const headerBtn = document.getElementById('learning-mode-toggle-header');
        if (headerBtn && !headerBtn.dataset.learningBound) {
            headerBtn.dataset.learningBound = 'true';
            headerBtn.addEventListener('click', () => {
                toggleLearningMode();
            });
        }
    }

    const LearningServiceAPI = {
        toggleLearningMode,
        initLearningFeature,
        buildProceduralJeopardyBoard,
        generateSelectedReadingsClues,
        initMatcherRound,
        initScrambleRound,
        getState: () => state
    };

    if (typeof window !== 'undefined') {
        window.toggleLearningMode = toggleLearningMode;
        window.initLearningFeature = initLearningFeature;
        window.MountOfMercyLearning = LearningServiceAPI;
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = LearningServiceAPI;
    }

    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initLearningFeature);
        } else {
            initLearningFeature();
        }
    }
})();
