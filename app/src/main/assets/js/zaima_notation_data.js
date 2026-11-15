// ============================================================================
// MOUNT OF MERCY — St. Yared Zaima Musical Notation Dataset & Cell Renderer
//                  (የቅዱስ ያሬድ የዜማ ምልክቶች — ምልክት ወቅርጽ)
// ============================================================================
// Implements the W3C Ethiopic Zaima Cell Model (Daniel Yacob / GFF) and
// Shelemay, Jeffery & Monson (Early Music History 12) over certified Debre Abay
// Monastery liturgical chant compositions from Mäzgäbä Ḳidasé (መዝገበ ቅዳሴ).
//
// Architecture:
// - Zero sacred-text file mutations (`kidase.js` SHA-256 remains 100% untouched).
// - Supports 1 to 3+ interlinear rows above Ge'ez fidel cells (CSS `inline-grid`):
//     Row 1 (lowest above base): Ge'ez mode (`ግዕዝ`, black — ordinary days)
//     Row 2 (middle):            Izzel mode (`ዕዝል`, rubric red — fasts/vigils) or alt-1
//     Row 3 (highest):           Araray mode (`ዓራራይ`, black — major feasts) or alt-2
// - Supports `.zaima-stack` vertical tonal chords (up to 3 stacked Qirts, U+1390-U+1399),
//   rightward multi-fidel overhangs, marginal Beit (`ቤት`, `፩`, `ን`) house markers,
//   holy-word rubric highlighting, and interactive hover/tap Qirts tooltips.
// ============================================================================

(function (root) {
    'use strict';

    // 11 Canonical Conventional Tonal Signs (የፊደል ቅርጽ — YeFidel Qirts)
    const QIRTS_LEGEND = [
        { glyph: '\u1394', geez: 'ድፋት', name: 'Difat', role: 'Convex arched vocal drop / inflection downward' },
        { glyph: '\u1397', geez: 'ሂደት', name: 'Hīdet', role: 'Rapid, smooth sweeping run across multiple syllables' },
        { glyph: '\u1395', geez: 'ቅናት', name: 'Qinat', role: 'Upward melodic inflection at syllable release' },
        { glyph: '\u1390', geez: 'ይዘት', name: 'Yizet', role: 'Sustained hold or brief punctuating stop on one letter' },
        { glyph: '\u1399', geez: 'ቍርት', name: 'Qwirt', role: 'Crisp, decisive cutoff of the pitch' },
        { glyph: '\u1396', geez: 'ጭረት', name: 'Chiret', role: 'Melisma onset — extended florid vocalise on this syllable' },
        { glyph: '\u1393', geez: 'ርክርክ', name: 'Rikrik', role: 'Ornamented vocal slide / terraced microtonal oscillation' },
        { glyph: '\u1391', geez: 'ደረት', name: 'Deret', role: 'Resonant chest-voice lift / concave inflection' },
        { glyph: 'ርስ', geez: 'ድርስ', name: 'Dirs', role: 'Medial or final cadential melodic formula (G261)' },
        { glyph: 'ር', geez: 'አንብር', name: 'Anbir', role: 'Final returning-tone cadence (“place / set down”)' },
        { glyph: '\u1398', geez: 'ደረት፡ሂደት', name: 'Deret-Hīdet', role: 'Stacked chord of Deret (\u1391) over Hīdet (\u1397)' }
    ];

    const QIRTS_CHAR_LOOKUP = Object.create(null);
    for (const q of QIRTS_LEGEND) {
        if (q.glyph.length === 1) QIRTS_CHAR_LOOKUP[q.glyph] = q;
    }

    const MODE_META = {
        geez: { geez: 'ግዕዝ', name: 'Ge\'ez Mode', desc: 'First/base mode (black) — strong, plain melody for ordinary days' },
        izzel: { geez: 'ዕዝል', name: 'Izzel Mode', desc: 'Second mode (rubric red) — solemn, lower-register chant for fasts & vigils' },
        araray: { geez: 'ዓራራይ', name: 'Araray Mode', desc: 'Third mode (top black) — jubilant, higher-register chant for major feasts' },
        alt1: { geez: 'ምረጥ', name: 'Alternate Melodic Line', desc: 'Secondary Debre Abay melodic realization above primary Ge\'ez line' }
    };

    // Words denoting Holy Things traditionally rubricized in red in Mäzgäbä Ḳidasé
    const HOLY_RUBRIC_WORDS = new Set([
        'አሐዱ', 'አብ', 'ቅዱስ', 'ወልድ', 'መንፈስ', 'ለእግዚአብሔር', 'ዘእግዚአብሔር', 'እግዚአብሔር',
        'ለአብ', 'ወወልድ', 'ወመንፈስ', 'እግዚኦ', 'ቅድስት', 'ማርያም', 'ማዕጠንት', 'ዘወርቅ',
        'ፆርኪ', 'ፍሕመ', 'እሳት', 'እመቅደስ', 'ዘይሠሪ', 'ቃል', 'ክርስቶስ', 'ለከ', 'ንሰግድ'
    ]);

    /**
     * Compact per-word Zaima specification helper:
     *   w(baseWord, geezCells, upperRows?)
     * where `geezCells` is an array of strings aligned to the Ethiopic characters of `baseWord`
     * (if shorter, padded with ''; if 1 string with prefix `~`, spans across the whole word),
     * and `upperRows` is an optional array of `{ mode: 'izzel'|'araray'|'alt1', cells: [...] }`.
     */
    function w(base, geezCells, upperRows) {
        const rawParts = [...(geezCells || [])];
        if (Array.isArray(upperRows)) {
            for (const r of upperRows) {
                if (r && Array.isArray(r.cells)) rawParts.push(...r.cells);
            }
        }
        return {
            base,
            geez: geezCells || [],
            upper: upperRows || [],
            rawNotation: rawParts.join('')
        };
    }

    // =========================================================================
    // CERTIFIED DEBRE ABAY LITURGICAL CHANT ANNOTATIONS (Mäzgäbä Ḳidasé pp. 3-4)
    // =========================================================================
    const STANZA_ENTRIES = [
        // --- Page 3: Aḥadu (አሐዱ) — Order of the Liturgy 3:26 - 3:30 ---
        {
            cardId: '3-26',
            matchGeez: 'አሐዱ አብ ቅዱስ',
            title: 'አሐዱ (Aḥadu) — Praises of the Holy Trinity',
            words: [
                w('አሐዱ', ['᎑᎔᎓ሙስ᎖᎖᎓᎔', 'አአ', '᎑᎓ሣዕዑ'], [
                    { mode: 'izzel', cells: ['', '᎙ሙ', '᎖᎓'] },
                    { mode: 'araray', cells: ['', '᎑᎖᎔', '᎖᎖᎔᎓᎖ዑ'] }
                ]),
                w('አብ', ['፴', '᎓᎔'], [
                    { mode: 'izzel', cells: ['᎐', ''] }
                ]),
                w('ቅዱስ', ['ጎል', 'ፍዝ᎓', '᎑᎖'], [
                    { mode: 'izzel', cells: ['ነጽ', '᎗', 'ር'] }
                ]),
                w('አሐዱ', ['ጸና᎓᎖᎔᎖', '', '']),
                w('ወልድ', ['᎑', 'ህ', '']),
                w('ቅዱስ', ['᎖', '᎐', 'ቱ']),
                w('አሐዱ', ['᎘', '', '']),
                w('ውእቱ', ['᎓', '', '']),
                w('መንፈስ', ['', '', '᎐', '']),
                w('ቅዱስ', ['', '', 'ር'])
            ]
        },
        {
            cardId: '3-27',
            matchGeez: 'በአማን አብ ቅዱስ',
            title: 'በአማን (Be\'aman) — Congregational Trinitarian Response',
            words: [
                w('በአማን', ['᎘', 'ፀ', '᎔', '']),
                w('አብ', ['᎐', '᎐']),
                w('ቅዱስ', ['', '', 'ጽ']),
                w('በአማን', ['᎑', '', 'ደ᎓᎖', '']),
                w('ወልድ', ['᎖', '', 'ሳ']),
                w('ቅዱስ', ['᎘', 'ህ', '᎖']),
                w('በአማን', ['', '᎐', 'ቱ', '']),
                w('ውእቱ', ['᎗', '', '᎓']),
                w('መንፈስ', ['', '', '᎐', '']),
                w('ቅዱስ', ['', '', 'ር'])
            ]
        },
        {
            cardId: '3-28',
            matchGeez: 'ሰብሕዎ ለእግዚአብሔር',
            title: 'ሰብሕዎ (Sebḥwo) — Psalm 116 (117):1',
            words: [
                w('ሰብሕዎ', ['᎑', '᎓', '', 'ጠጠ']),
                w('ለእግዚአብሔር', ['መጽ', '', '', '᎐', '', '᎖', 'ቀ', '']),
                w('ኵልክሙ', ['', '᎐', '', '᎔']),
                w('አሕዛብ', ['', '', '', 'ር']),
                w('ወይሴብሕዎ', ['᎘', '', '᎐', '', '', 'ለኪ']),
                w('ኵሎሙ', ['', '', '᎖']),
                w('ሕዝብ', ['᎓', '', 'ስ'])
            ]
        },
        {
            cardId: '3-28',
            matchGeez: 'እስመ ጸንዐት',
            title: 'እስመ ጸንዐት (Isme tsen\'at) — Psalm 116 (117):2',
            words: [
                w('እስመ', ['᎑', '', 'ተ']),
                w('ጸንዐት', ['᎗', '', '᎘', 'እ']),
                w('ምሕረቱ', ['', '', '᎐', '']),
                w('ላዕሌነ', ['ኪ', '', '', '᎗']),
                w('ጽድቁሰ', ['', '', '᎓ጠጠ', '']),
                w('ለእግዚአብሔር', ['መጽ', '', '', '᎑', '', 'ህ', '', '᎗']),
                w('ይሄሉ', ['᎖', '᎐', 'ቱ']),
                w('ለዓለም', ['᎑', '᎐', '', 'ር'])
            ]
        },
        {
            cardId: '3-29',
            matchGeez: 'ስብሐት ለአብ',
            title: 'ስብሐት ለአብ (Sbḥat le\'Ab) — Trinitarian Doxology & Hallelujah',
            words: [
                w('ስብሐት', ['᎘', '', 'ዚአ', '']),
                w('ለአብ', ['᎑', '', 'ጸ᎓']),
                w('ወወልድ', ['᎖', '', '᎘', '']),
                w('ወመንፈስ', ['᎖', '', '', 'ሳ', '']),
                w('ቅዱስ', ['᎘', '', '']),
                w('ይእዜኒ', ['᎑ወአ', '', '᎓᎖', '᎓'], [
                    { mode: 'alt1', cells: ['᎑᎓᎖', '᎑', '᎓᎖', '᎑᎓'] }
                ]),
                w('ወዘልፈኒ', ['᎖᎔᎑᎖᎓᎖', '', '᎐', 'ድዕ', ''], [
                    { mode: 'alt1', cells: ['᎖᎔᎑᎖᎓᎖', '', '', '', ''] }
                ]),
                w('ወለዓለመ', ['᎗', '', 'ዊ᎓', '᎖', '᎑']),
                w('ዓለም', ['፴', '', '᎖']),
                w('አሜን', ['᎓᎑᎓ደ', 'ደ', '᎑']),
                w('ሃሌ', ['᎔ማ', 'ይ᎖᎔']),
                w('ሉያ', ['ዓ', 'ው'], [
                    { mode: 'izzel', cells: ['᎐', 'ር'] },
                    { mode: 'araray', cells: ['᎐', 'ር'] }
                ])
            ]
        },
        {
            cardId: '3-30',
            matchGeez: 'ተንሥኡ ለጸሎት',
            title: 'ተንሥኡ ለጸሎት (Tens\'u leTselot) — Liturgical Call to Stand',
            words: [
                w('ተንሥኡ', ['᎑', '', '᎓᎖', '᎓']),
                w('ለጸሎት', ['ደ', '᎖', '᎑', 'ር']),
                w('እግዚኦ', ['᎗', '᎘', 'ደ᎓', '᎖']),
                w('ተሣሃለነ', ['', '', '᎖᎑', '', 'ሳ'])
            ]
        },
        {
            cardId: '3-30',
            matchGeez: 'ሰላም ለኵልክሙ',
            title: 'ሰላም ለኵልክሙ (Selam lekwlkmu) — Salutation of Peace',
            words: [
                w('ሰላም', ['᎑᎓', '᎖᎓', 'ደ']),
                w('ለኵልክሙ', ['᎖', '', '', '᎖', 'ሳ']),
                w('ምስለ', ['᎘', '', '']),
                w('መንፈስከ', ['᎑', '᎖', '᎓', '', 'ስ'])
            ]
        },

        // --- Page 4: Nisgid (ንስግድ) & Antī w'itu (አንቲ ውእቱ) — 3:119 - 3:122 ---
        {
            cardId: '3-119',
            matchGeez: 'ንስግድ',
            title: 'ንስግድ (Nisgid) — Let Us Worship the Trinity',
            beit: { symbol: 'ን', rubric: false, title: 'Beit (ቤት): Nisgid Melodic Family' },
            words: [
                w('ንስግድ', ['᎑᎔᎖᎒', '᎖᎔᎒᎖', 'ረዩ', '᎓᎓᎔'], [
                    { mode: 'izzel', cells: ['᎙', '᎖᎓', '', 'ር'] }
                ]),
                w('ለአብ', ['᎑', '', 'ዑ']),
                w('ወወልድ', ['᎗', '᎑', 'ፅ᎖', '᎓']),
                w('ወመንፈስ', ['᎖᎓', '', '', '᎘', '']),
                w('ቅዱስ', ['᎖᎔', '᎐', 'ሌ']),
                w('እንዘ', ['᎘', '', '᎔']),
                w('ሠለስቱ', ['', '᎑', '', 'ው']),
                w('አሐዱ', ['', '᎐', 'ር'])
            ]
        },
        {
            cardId: '3-120',
            matchGeez: 'ሰላም ለኪ',
            title: 'ሰላም ለኪ (Selam lekī) — Salutation to the Holy Church',
            words: [
                w('ሰላም', ['᎓᎑', '᎑᎔᎖᎒', '᎖᎖᎔᎓'], [
                    { mode: 'alt1', cells: ['᎑', '', ''] }
                ]),
                w('ለኪ', ['᎔ግድ', '᎓᎓᎔']),
                w('ቅድስት', ['᎑', '', '᎔ው', '']),
                w('ቤተ', ['᎗', '']),
                w('ክርስቲያን', ['', '', '', '᎑᎓', '᎑', 'ሌ']),
                w('ማኅደረ', ['᎘', 'አክ', '᎖', '᎐']),
                w('መለኮት', ['', '᎐', '', 'ዕት'])
            ]
        },
        {
            cardId: '3-121',
            matchGeez: 'ሰአሊ ለነ',
            title: 'ሰአሊ ለነ ወአንቲ ውእቱ (Se\'alī lene & Antī w\'itu)',
            words: [
                w('ሰአሊ', ['᎑', '᎑᎔᎖᎒', '᎖᎖᎔᎓'], [
                    { mode: 'alt1', cells: ['᎓', '', ''] }
                ]),
                w('ለነ', ['᎔ግድ', '᎓᎓᎔']),
                w('ድንግል', ['᎑', '', '᎑᎔', ''], [
                    { mode: 'alt1', cells: ['', '', 'ው', ''] }
                ]),
                w('ማርያም', ['᎖', '', 'ሌ', '']),
                w('ወላዲተ', ['አክ', '', '᎐', '']),
                w('አምላክ', ['', '᎐', '', 'ዕት']),
                w('አንቲ', ['᎑᎔᎖᎒', '᎑᎖᎖᎖', '᎑᎖']),
                w('ውእቱ', ['᎑᎔', 'ግድ', '᎓᎓᎔'])
            ]
        },
        {
            cardId: '3-122',
            matchGeez: 'ማዕጠንት ዘወርቅ',
            title: 'ማዕጠንት ዘወርቅ (Ma\'iṭent zeWerḳ) — The Golden Censer',
            words: [
                w('ማዕጠንት', ['᎑', '᎖', 'ሜ᎖᎓', '', '']),
                w('ዘወርቅ', ['ፅ᎖᎓', '', '᎖᎓', '']),
                w('እንተ', ['᎗', '', '']),
                w('ፆርኪ', ['᎖መን', '', '']),
                w('ፍሕመ', ['', '᎐', '']),
                w('እሳት', ['᎖', '', 'ሁድ']),
                w('ቡሩክ', ['᎑', '᎖', 'ሀረ'], [
                    { mode: 'alt1', cells: ['᎔', '᎔', 'ት᎙'] }
                ]),
                w('ዘነስአ', ['᎑', 'ዘ', '', '᎗']),
                w('እመቅደስ', ['', '᎓ገብ᎙', '', '', '']),
                w('ዘይሠሪ', ['᎘', '', '᎖', ''], [
                    { mode: 'alt1', cells: ['᎑', '᎖በደ', 'ሃታ', ''] }
                ]),
                w('ኃጢአተ', ['', '', 'ቃ', ''], [
                    { mode: 'alt1', cells: ['᎖', '᎐', 'ቃ', ''] }
                ]),
                w('ወይደመስስ', ['᎖መን', '', '᎐', '', '᎗', '']),
                w('ጌጋየ', ['᎐', '', 'ሁድ'])
            ]
        },
        {
            cardId: '3-122',
            matchGeez: 'ዝውእቱ ዘእግዚአብሔር',
            title: 'ዝውእቱ (Zw\'itu) — God\'s Word Made Flesh',
            words: [
                w('ዝውእቱ', ['፴', '᎓', 'ዜኒ', ''], [
                    { mode: 'alt1', cells: ['᎑', '᎖', '᎓', '᎓'] }
                ]),
                w('ዘእግዚአብሔር', ['᎘', '', 'ዓይ᎗', '', '᎖', '', '', ''], [
                    { mode: 'alt1', cells: ['', '', '᎖᎔', '', '', '', '', ''] }
                ]),
                w('ቃል', ['᎑', '᎓ነፍ'], [
                    { mode: 'alt1', cells: ['᎑', '᎓ነፍ'] }
                ]),
                w('ዘተሰብአ', ['ይ', '᎐', '', '᎐ር', ''], [
                    { mode: 'alt1', cells: ['᎖᎔', '', '᎐', 'ር', ''] }
                ]),
                w('እምኔኪ', ['᎗', '', '᎑', 'ው'], [
                    { mode: 'alt1', cells: ['᎘᎑', 'ተጋዑ', 'ቡር', ''] }
                ]),
                w('ዘአዕረገ', ['᎘', '᎑ሢመ', '', '', ''], [
                    { mode: 'alt1', cells: ['᎓', 'ው᎔', '', '', ''] }
                ]),
                w('ለአቡሁ', ['᎓', '', 'ው', ''], [
                    { mode: 'alt1', cells: ['᎓', '', 'ው', ''] }
                ]),
                w('ርእሶ', ['ፅ᎖᎓', '', '᎖᎓']),
                w('ዕጣነ', ['᎖መን', '', '']),
                w('ወመሥዋዕተ', ['', '', '᎐', '', '', '']),
                w('ሥሙረ', ['᎖', '', 'ሁድ'])
            ]
        },
        {
            cardId: '3-122',
            matchGeez: 'ንሰግድ ለከ ክርስቶስ',
            title: 'ንሰግድ ለከ ክርስቶስ (Nisegid leke Kristos)',
            words: [
                w('ንሰግድ', ['ቃላ', '', 'ሆሙ', '']),
                w('ለከ', ['᎖', 'ር']),
                w('ክርስቶስ', ['᎘', '᎑', '', '᎑᎓', ''], [
                    { mode: 'alt1', cells: ['᎘', '', '', '᎑᎓', 'ፌ'] }
                ]),
                w('ምስለ', ['᎖ሀገሩ᎘', '', ''], [
                    { mode: 'alt1', cells: ['᎐ዓላ᎙', '', ''] }
                ]),
                w('አቡከ', ['᎑', '᎑᎓', '']),
                w('ኄር', ['ሌ', '']),
                w('ሰማያዊ', ['᎑', 'ቴታ', '', '']),
                w('ወመንፈስከ', ['᎘', '', '', '', '', '']),
                w('ቅዱስ', ['', '', 'ሌ']),
                w('ማሕየዊ', ['᎑', '', '', '']),
                w('እስመ', ['', '', '']),
                w('መጻእከ', ['', '', '', '']),
                w('ወአድኀንከነ', ['', '', '', '', '', '', '᎗ር'])
            ]
        }
    ];

    // Fast lookup map by `cardId` -> array of candidate stanza overlays
    const BY_CARD_ID = Object.create(null);
    for (const entry of STANZA_ENTRIES) {
        if (!BY_CARD_ID[entry.cardId]) BY_CARD_ID[entry.cardId] = [];
        BY_CARD_ID[entry.cardId].push(entry);
    }

    // Also expose single primary entry on `byCardId` for Zema Viterbi duration priors
    const PRIMARY_BY_CARD_ID = Object.create(null);
    for (const entry of STANZA_ENTRIES) {
        if (!PRIMARY_BY_CARD_ID[entry.cardId]) {
            PRIMARY_BY_CARD_ID[entry.cardId] = entry;
        } else {
            PRIMARY_BY_CARD_ID[entry.cardId] = {
                ...PRIMARY_BY_CARD_ID[entry.cardId],
                words: [...PRIMARY_BY_CARD_ID[entry.cardId].words, ...entry.words]
            };
        }
    }

    // Common responsive chant phrases that recur throughout Kidase
    const RECURRING_CHANT_WORDS = Object.create(null);
    for (const cid of ['3-30']) {
        for (const e of (BY_CARD_ID[cid] || [])) {
            for (const wd of e.words) {
                RECURRING_CHANT_WORDS[wd.base] = wd;
            }
        }
    }

    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /**
     * Builds human-readable tooltip describing every Qirts & Miliket in a notation cell.
     */
    function describeCellAnnotation(cellStr, modeKey) {
        if (!cellStr) return '';
        const modeInfo = MODE_META[modeKey] || MODE_META.geez;
        const foundQirts = [];
        let miliketLetters = '';

        if (cellStr === 'ር') {
            foundQirts.push('ር — አንብር (Anbir): Final cadence');
        } else if (cellStr === 'ርስ' || cellStr === 'ስ') {
            foundQirts.push(`${cellStr} — ድርስ (Dirs): Medial/final cadence`);
        } else {
            for (const ch of cellStr) {
                if (QIRTS_CHAR_LOOKUP[ch]) {
                    const q = QIRTS_CHAR_LOOKUP[ch];
                    const desc = `${q.glyph} ${q.geez} (${q.name}): ${q.role}`;
                    if (!foundQirts.includes(desc)) foundQirts.push(desc);
                } else if (/[\u1200-\u135A\u1369-\u137C]/.test(ch)) {
                    miliketLetters += ch;
                }
            }
        }

        const parts = [`[${modeInfo.geez} · ${modeInfo.name}]`];
        if (miliketLetters) {
            if (miliketLetters.includes('ረዩ')) {
                parts.push(`ሥረዩ (Sereyu): Exemplar melody reference`);
            } else {
                parts.push(`ምልክት (Miliket "${miliketLetters}"): Traditional melodic phrase cue`);
            }
        }
        parts.push(...foundQirts);
        return parts.join(' • ');
    }

    /**
     * Parses a Zaima cell into structured component rows for the interactive popover.
     */
    function parseCellBreakdown(cellStr, modeKey) {
        const modeInfo = MODE_META[modeKey] || MODE_META.geez;
        const items = [];
        let miliketLetters = '';

        if (cellStr === 'ር') {
            items.push({ glyph: 'ር', label: 'አንብር (Anbir)', role: 'Final returning-tone cadence (“set down”)' });
        } else if (cellStr === 'ርስ' || cellStr === 'ስ') {
            items.push({ glyph: cellStr, label: 'ድርስ (Dirs)', role: 'Medial or final cadential melodic formula' });
        } else {
            const seen = new Set();
            for (const ch of String(cellStr || '')) {
                if (QIRTS_CHAR_LOOKUP[ch]) {
                    const q = QIRTS_CHAR_LOOKUP[ch];
                    if (!seen.has(q.name)) {
                        seen.add(q.name);
                        items.push({ glyph: q.glyph, label: `${q.geez} (${q.name})`, role: q.role });
                    }
                } else if (/[\u1200-\u135A\u1369-\u137C]/.test(ch)) {
                    miliketLetters += ch;
                }
            }
        }

        if (miliketLetters) {
            if (miliketLetters.includes('ረዩ')) {
                items.unshift({
                    glyph: miliketLetters,
                    label: 'ሥረዩ (Sereyu)',
                    role: 'Authoritative exemplar hymn reference for this melody'
                });
            } else {
                items.unshift({
                    glyph: miliketLetters,
                    label: `ምልክት (Miliket “${miliketLetters}”)`,
                    role: 'Conventionalized melodic phrase cue from the Dəggwa tradition'
                });
            }
        }

        return { modeInfo, items };
    }

    /**
     * Formats consecutive tonal marks (`\u1390-\u1399`) into `.zaima-stack` vertical chords
     * when stacked (e.g. `᎑᎑` or `᎔᎔`), while rendering horizontal Qirts + Miliket cleanly.
     */
    function renderAnnotationCellInner(cellStr) {
        if (!cellStr) return '';
        const out = cellStr.replace(/([\u1390-\u1399])\1{1,2}/g, (m) => {
            if (m[0] === '\u1396' || m[0] === '\u1393') {
                return escapeHtml(m);
            }
            const chars = Array.from(m).map(c => `<span>${escapeHtml(c)}</span>`).join('');
            return `<span class="zaima-stack">${chars}</span>`;
        });
        return out;
    }

    /**
     * Renders a single Ethiopic base word into inline-block per-fidel columns (`.zaima-fidel-col`)
     * whose last line-box is always `.zaima-rb` (CSS 2.1 §10.8.1), guaranteeing that 1-row, 2-row,
     * 3-row, and plain words all sit on an exact straight horizontal baseline without tearing words apart.
     */
    function renderZaimaWordHtml(surfaceWord, punctSuffix, wordSpec, options = {}) {
        const chars = Array.from(surfaceWord);
        const nCols = Math.max(1, chars.length);
        const upperRows = Array.isArray(wordSpec.upper) ? wordSpec.upper : [];
        const geezCells = wordSpec.geez || [];
        const totalNotaRows = 1 + upperRows.length;
        const isHolyRubric = options.holyRubric !== false && HOLY_RUBRIC_WORDS.has(surfaceWord);

        const colHtmlParts = [];

        for (let c = 0; c < nCols; c++) {
            const stackHtml = [];
            let maxCellLen = 0;

            // Render upper rows from highest (top) down to Row 2
            for (let rIdx = upperRows.length - 1; rIdx >= 0; rIdx--) {
                const rowObj = upperRows[rIdx];
                const modeKey = rowObj.mode || 'alt1';
                const val = (rowObj.cells && rowObj.cells[c]) ? rowObj.cells[c] : '';
                if (!val) continue;
                if (val.length > maxCellLen) maxCellLen = val.length;
                const tip = describeCellAnnotation(val, modeKey);
                const rowNum = rIdx + 2;
                stackHtml.push(
                    `<span class="zaima-rt zaima-row-level-${rowNum} zaima-mode-${escapeHtml(modeKey)}"` +
                    ` data-zaima-tip="${escapeHtml(tip)}"` +
                    ` data-zaima-glyph="${escapeHtml(val)}"` +
                    ` data-zaima-mode="${escapeHtml(modeKey)}"` +
                    ` data-zaima-row="${rowNum}"` +
                    ` data-zaima-fidel="${escapeHtml(chars[c])}"` +
                    ` data-zaima-word="${escapeHtml(surfaceWord)}"` +
                    ` tabindex="0" role="button" aria-label="${escapeHtml(tip)}"` +
                    `>${renderAnnotationCellInner(val)}</span>`
                );
            }

            // Primary Ge'ez row (Row 1 — immediately above base letter)
            const gVal = geezCells[c] || '';
            if (gVal) {
                if (gVal.length > maxCellLen) maxCellLen = gVal.length;
                const gTip = describeCellAnnotation(gVal, 'geez');
                stackHtml.push(
                    `<span class="zaima-rt zaima-row-level-1 zaima-mode-geez"` +
                    ` data-zaima-tip="${escapeHtml(gTip)}"` +
                    ` data-zaima-glyph="${escapeHtml(gVal)}"` +
                    ` data-zaima-mode="geez"` +
                    ` data-zaima-row="1"` +
                    ` data-zaima-fidel="${escapeHtml(chars[c])}"` +
                    ` data-zaima-word="${escapeHtml(surfaceWord)}"` +
                    ` tabindex="0" role="button" aria-label="${escapeHtml(gTip)}"` +
                    `>${renderAnnotationCellInner(gVal)}</span>`
                );
            }

            // Base Ethiopic Fidel (`ዘር`) MUST be the last block child so CSS inline-block baseline
            // aligns 100% of base characters onto one flat horizontal line!
            stackHtml.push(
                `<span class="zaima-rb${isHolyRubric ? ' zaima-holy-word' : ''}">${escapeHtml(chars[c])}</span>`
            );

            let overhangCls = '';
            if (nCols > 1 && maxCellLen >= 4) {
                if (c === 0) overhangCls = ' is-lead-overhang';
                else if (c === nCols - 1) overhangCls = ' is-tail-overhang';
            }

            colHtmlParts.push(
                `<span class="zaima-fidel-col${overhangCls}">${stackHtml.join('')}</span>`
            );
        }

        return (
            `<span class="zaima-word zaima-rows-${totalNotaRows}" data-zaima-base="${escapeHtml(surfaceWord)}">` +
            colHtmlParts.join('') +
            `</span>` +
            (punctSuffix ? `<span class="zaima-punct">${escapeHtml(punctSuffix)}</span>` : '')
        );
    }

    function findMatchingStanzaOverlay(cardId, plainGeezText) {
        const candidates = BY_CARD_ID[cardId];
        if (candidates && candidates.length > 0) {
            if (candidates.length === 1) return candidates[0];
            for (const cand of candidates) {
                if (cand.matchGeez && plainGeezText.includes(cand.matchGeez)) {
                    return cand;
                }
            }
            return candidates[0];
        }
        return null;
    }

    /**
     * Quick O(1) check whether a Kidase card has St. Yared Zaima notation available.
     */
    function hasZaimaNotationForCard(cardId, rawGeezText = '') {
        if (BY_CARD_ID[cardId]) return true;
        if (!rawGeezText) return false;
        return /(?:ተንሥኡ\s+ለጸሎት|ሰላም\s+ለኵልክሙ)/.test(rawGeezText);
    }

    /**
     * Decorates a rendered Ge'ez HTML string with multi-row interlinear St. Yared Zaima
     * notation (`ምልክት` & `ቅርጽ`) while preserving speaker rubrics (`<strong>`), line breaks,
     * and any `<i class="geez-phonetic-append">` block untouched!
     */
    function decorateGeezHtmlWithZaima(rawHtml, cardId, options = {}) {
        if (!rawHtml) return rawHtml;
        ensureZaimaInspectorBound();

        // Split off `.geez-phonetic-append` if already appended so we NEVER touch phonetic Latin text
        let mainHtml = String(rawHtml);
        let phoneticTail = '';
        const phonIdx = mainHtml.indexOf('<i class="geez-phonetic-append"');
        if (phonIdx !== -1) {
            const brIdx = mainHtml.lastIndexOf('<br>', phonIdx);
            const splitAt = (brIdx !== -1 && phonIdx - brIdx <= 6) ? brIdx : phonIdx;
            phoneticTail = mainHtml.slice(splitAt);
            mainHtml = mainHtml.slice(0, splitAt);
        }

        const plainGeez = mainHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        const stanzaEntry = findMatchingStanzaOverlay(cardId, plainGeez);

        const wordQueues = Object.create(null);
        if (stanzaEntry && Array.isArray(stanzaEntry.words)) {
            for (const ws of stanzaEntry.words) {
                if (!wordQueues[ws.base]) wordQueues[ws.base] = [];
                wordQueues[ws.base].push(ws);
            }
        } else if (hasZaimaNotationForCard(cardId, plainGeez)) {
            for (const [k, ws] of Object.entries(RECURRING_CHANT_WORDS)) {
                wordQueues[k] = [ws];
            }
        } else {
            return rawHtml;
        }

        let decoratedAny = false;
        const parts = mainHtml.split(/(<[^>]+>)/g);
        let insideSup = false;

        for (let i = 0; i < parts.length; i++) {
            const seg = parts[i];
            if (!seg) continue;
            if (seg.startsWith('<')) {
                if (/^<sup\b/i.test(seg)) insideSup = true;
                else if (/^<\/sup>/i.test(seg)) insideSup = false;
                continue;
            }
            if (insideSup) continue;

            // Match Ethiopic syllable cores (`U+1200-U+135F`) separately from Ethiopic punctuation (`U+1360-U+1368`)!
            parts[i] = seg.replace(/([\u1200-\u135F\u1380-\u138F\u2D80-\u2DDF\uAB00-\uAB2F]+)([፠፡።፣፤፥፦፧፨.,;:!?]*)/g, (fullMatch, wordCore, punct) => {
                if (punct === '፤' && /^(?:ካህን|ዲያቆን|ሕዝብ|ኵሎሙ)$/.test(wordCore)) {
                    return `<span class="zaima-speaker-rubric">${escapeHtml(wordCore + punct)}</span>`;
                }
                const q = wordQueues[wordCore];
                if (q && q.length > 0) {
                    const spec = q.length > 1 ? q.shift() : q[0];
                    decoratedAny = true;
                    return renderZaimaWordHtml(wordCore, punct, spec, options);
                }
                if (options.holyRubric !== false && HOLY_RUBRIC_WORDS.has(wordCore)) {
                    return `<span class="zaima-plain-word zaima-holy-word">${escapeHtml(wordCore)}</span>${escapeHtml(punct)}`;
                }
                return fullMatch;
            });
        }

        if (!decoratedAny) return rawHtml;

        const beitHtml = (stanzaEntry && stanzaEntry.beit)
            ? `<span class="zaima-beit-margin${stanzaEntry.beit.rubric ? ' is-rubric' : ''}"` +
              ` data-zaima-tip="${escapeHtml(stanzaEntry.beit.title)}"` +
              ` data-zaima-glyph="${escapeHtml(stanzaEntry.beit.symbol)}"` +
              ` data-zaima-mode="beit"` +
              ` tabindex="0" role="button" aria-label="${escapeHtml(stanzaEntry.beit.title)}">` +
              `${escapeHtml(stanzaEntry.beit.symbol)}</span>`
            : '';

        return `<span class="zaima-line-wrap${beitHtml ? ' has-beit' : ''}">${beitHtml}${parts.join('')}</span>${phoneticTail}`;
    }

    // =========================================================================
    // INTERACTIVE FLOATING ZAIMA INSPECTOR POPOVER (Hover + Click/Tap Pinning)
    // =========================================================================
    let _inspectorBound = false;
    let _pinnedTarget = null;

    function getOrCreateInspectorPopover() {
        if (typeof document === 'undefined') return null;
        let pop = document.getElementById('zaima-inspector-popover');
        if (!pop) {
            pop = document.createElement('div');
            pop.id = 'zaima-inspector-popover';
            pop.className = 'zaima-inspector-popover';
            pop.setAttribute('role', 'tooltip');
            pop.setAttribute('aria-hidden', 'true');
            document.body.appendChild(pop);
        }
        return pop;
    }

    function renderInspectorContent(targetEl, isPinned) {
        const glyph = targetEl.getAttribute('data-zaima-glyph') || targetEl.textContent || '';
        const modeKey = targetEl.getAttribute('data-zaima-mode') || 'geez';
        const rowNum = targetEl.getAttribute('data-zaima-row') || '';
        const fidel = targetEl.getAttribute('data-zaima-fidel') || '';
        const word = targetEl.getAttribute('data-zaima-word') || '';
        const fallbackTip = targetEl.getAttribute('data-zaima-tip') || '';

        if (modeKey === 'beit') {
            return `
                <div class="zi-head">
                    <span class="zi-specimen is-izzel">${escapeHtml(glyph)}</span>
                    <div class="zi-meta">
                        <div class="zi-mode-badge is-izzel">ቤት · Beit (Melodic House)</div>
                        <div class="zi-context">Marginal section key</div>
                    </div>
                    ${isPinned ? '<button type="button" class="zi-close-btn" aria-label="Close">&times;</button>' : ''}
                </div>
                <div class="zi-items">
                    <div class="zi-item">
                        <div class="zi-item-desc">${escapeHtml(fallbackTip)}</div>
                    </div>
                </div>
            `;
        }

        const { modeInfo, items } = parseCellBreakdown(glyph, modeKey);
        const isIzzel = modeKey === 'izzel';
        const rowLabel = rowNum ? ` · Row ${escapeHtml(rowNum)}` : '';
        const contextLabel = fidel && word
            ? `Inflects syllable <strong>«${escapeHtml(fidel)}»</strong> in <strong>${escapeHtml(word)}</strong>`
            : 'St. Yared vocal inflection';

        const rowsHtml = items.map(it => `
            <div class="zi-item">
                <span class="zi-item-glyph${isIzzel ? ' is-izzel' : ''}">${escapeHtml(it.glyph)}</span>
                <div class="zi-item-body">
                    <div class="zi-item-title">${escapeHtml(it.label)}</div>
                    <div class="zi-item-desc">${escapeHtml(it.role)}</div>
                </div>
            </div>
        `).join('');

        return `
            <div class="zi-head">
                <span class="zi-specimen${isIzzel ? ' is-izzel' : ''}">${renderAnnotationCellInner(glyph)}</span>
                <div class="zi-meta">
                    <div class="zi-mode-badge${isIzzel ? ' is-izzel' : ''}">${escapeHtml(modeInfo.geez)} · ${escapeHtml(modeInfo.name)}${rowLabel}</div>
                    <div class="zi-context">${contextLabel}</div>
                </div>
                ${isPinned ? '<button type="button" class="zi-close-btn" aria-label="Close">&times;</button>' : ''}
            </div>
            <div class="zi-mode-sub">${escapeHtml(modeInfo.desc)}</div>
            <div class="zi-items">${rowsHtml}</div>
        `;
    }

    function positionInspectorPopover(pop, targetEl) {
        if (!pop || !targetEl || typeof window === 'undefined') return;
        const rect = targetEl.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return;

        pop.style.left = '0px';
        pop.style.top = '0px';
        const popRect = pop.getBoundingClientRect();
        const vw = window.innerWidth || 1024;
        const vh = window.innerHeight || 768;

        let left = rect.left + rect.width / 2 - popRect.width / 2;
        left = Math.max(10, Math.min(vw - popRect.width - 10, left));

        let top = rect.top - popRect.height - 10;
        if (top < 10) {
            top = Math.min(vh - popRect.height - 10, rect.bottom + 10);
        }

        pop.style.left = `${Math.round(left)}px`;
        pop.style.top = `${Math.round(top)}px`;
    }

    function showInspectorForTarget(targetEl, pin = false) {
        const pop = getOrCreateInspectorPopover();
        if (!pop || !targetEl) return;

        if (_pinnedTarget && _pinnedTarget !== targetEl) {
            _pinnedTarget.classList.remove('is-zaima-selected');
        }
        if (pin) {
            _pinnedTarget = targetEl;
            targetEl.classList.add('is-zaima-selected');
        }

        pop.innerHTML = renderInspectorContent(targetEl, pin);
        pop.classList.toggle('is-pinned', Boolean(pin));
        pop.classList.add('is-visible');
        pop.setAttribute('aria-hidden', 'false');
        positionInspectorPopover(pop, targetEl);

        const closeBtn = pop.querySelector('.zi-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (ev) => {
                ev.stopPropagation();
                hideInspectorPopover(true);
            });
        }
    }

    function hideInspectorPopover(clearPin = false) {
        if (_pinnedTarget && !clearPin) return;
        if (_pinnedTarget) {
            _pinnedTarget.classList.remove('is-zaima-selected');
            _pinnedTarget = null;
        }
        if (typeof document === 'undefined') return;
        const pop = document.getElementById('zaima-inspector-popover');
        if (pop) {
            pop.classList.remove('is-visible', 'is-pinned');
            pop.setAttribute('aria-hidden', 'true');
        }
    }

    function ensureZaimaInspectorBound() {
        if (_inspectorBound || typeof document === 'undefined') return;
        _inspectorBound = true;

        document.addEventListener('mouseover', (e) => {
            if (_pinnedTarget) return;
            const t = e.target && typeof e.target.closest === 'function'
                ? e.target.closest('.zaima-rt[data-zaima-tip], .zaima-beit-margin[data-zaima-tip]')
                : null;
            if (t) {
                showInspectorForTarget(t, false);
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (_pinnedTarget) return;
            const fromNota = e.target && typeof e.target.closest === 'function'
                ? e.target.closest('.zaima-rt[data-zaima-tip], .zaima-beit-margin[data-zaima-tip]')
                : null;
            if (!fromNota) return;
            const toNota = e.relatedTarget && typeof e.relatedTarget.closest === 'function'
                ? e.relatedTarget.closest('.zaima-rt[data-zaima-tip], .zaima-beit-margin[data-zaima-tip]')
                : null;
            if (toNota !== fromNota) {
                hideInspectorPopover(false);
            }
        });

        document.addEventListener('click', (e) => {
            const pop = document.getElementById('zaima-inspector-popover');
            if (pop && pop.contains(e.target)) return;

            const t = e.target && typeof e.target.closest === 'function'
                ? e.target.closest('.zaima-rt[data-zaima-tip], .zaima-beit-margin[data-zaima-tip]')
                : null;
            if (t) {
                e.stopPropagation();
                if (_pinnedTarget === t) {
                    hideInspectorPopover(true);
                } else {
                    showInspectorForTarget(t, true);
                }
                return;
            }
            if (_pinnedTarget) {
                hideInspectorPopover(true);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && _pinnedTarget) {
                hideInspectorPopover(true);
            }
        });
    }

    if (typeof document !== 'undefined') {
        ensureZaimaInspectorBound();
    }

    const ZAIMA_API = {
        QIRTS_LEGEND,
        MODE_META,
        STANZA_ENTRIES,
        byCardId: PRIMARY_BY_CARD_ID,
        entriesByCardId: BY_CARD_ID,
        hasZaimaNotationForCard,
        describeCellAnnotation,
        parseCellBreakdown,
        decorateGeezHtmlWithZaima,
        showInspectorForTarget,
        hideInspectorPopover
    };

    if (root) {
        root.ZAIMA_NOTATION_DATA = ZAIMA_API;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ZAIMA_API;
    }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
