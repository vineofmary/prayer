/**
 * Mount of Mercy — Heavenly Liturgy Guide, 11-Station Map, St. Yared Zaima Glossary & 100-Word Lexicon
 * (`መዝገበ ቅዳሴ ወመርሐ ሥርዓተ ቅዳሴ`)
 *
 * Synthesized from:
 *  1. "Heavenly Liturgy: Experience Overview of the Ge'ez Rite" — Bay Area Bible Society,
 *     approved by Liqe Syuman Kesis Nebiyou Elias of Oakland Debre Meheret Kidus Michael EOTC (2025).
 *  2. "Treasure of the Divine Liturgy — መዝገበ ቅዳሴ (Mäzgäbä Ḳidasé)" — Bay Area Bible Society /
 *     Oakland Debre Meheret Kidus Michael EOTC (Debre Abay Monastery certified tradition, 2025),
 *     citing Tensae Publishing House ("መጽሐፈ ቅዳሴ") and Wolf Leslau ("Comparative Dictionary of Ge'ez").
 *  3. Daniel Yacob — W3C Internationalization "What is Zaima?" & "Zaima Annotation" specifications.
 *  4. Kay Kaufman Shelemay, Peter Jeffery, and Ingrid Monson — "Oral and Written Transmission in
 *     Ethiopian Christian Chant", Early Music History 12 (Cambridge University Press, 1993), pp. 55–117.
 */
(function (root) {
    'use strict';

    const LITURGY_MAP_STATIONS = [
        {
            number: 1,
            title: 'Pre-Liturgy Services',
            geez: 'ማሕሌት ወጸሎተ ኪዳን',
            phonetic: 'Maḥlét we-Tselote Kīdan',
            summary: 'Before the sun rises, clergy and chanters sing ancient St. Yared hymns (Mahlet & Seatat), read Psalms and Scripture, and pray the Prayer of the Covenant (Tselote Kidan) to prepare for communion with God. Then, the Divine Liturgy begins with the cry of a ringing bell.',
            scripture: 'Psalm 119:62, 147–148',
            cardCandidates: ['Kidan-Intro', '2-1', '3-1'],
            geezMatch: 'ጸሎተ ኪዳን'
        },
        {
            number: 2,
            title: 'Pot of Pure Gold',
            geez: 'አንቲ ውእቱ መሶበ ወርቅ ንጹሕ',
            phonetic: "Antī w'itu Mesobe Werḳ Nitsuḥ",
            summary: 'The priest invokes the Holy Trinity ("How awesome is this day..."), followed by the congregation’s chants culminating in praise to the Virgin Mary: "You are the pot of pure gold in which is hidden the manna, the bread which came down from heaven and gives life to all the world."',
            scripture: 'John 6:30–33; Exodus 16:33; Hebrews 9:4',
            cardCandidates: ['3-8', '3-1'],
            geezMatch: 'መሶበ ወርቅ ንጹሕ'
        },
        {
            number: 3,
            title: "LORD's Prayer",
            geez: 'አቡነ ዘበሰማያት',
            phonetic: 'Abune Zebe-Semayat',
            summary: 'Clergy and faithful chant the Lord’s Prayer ("Our Father in heaven...") together, followed by the salutation of Our Lady, Virgin Mary ("With the salutation of Saint Gabriel the Angel...").',
            scripture: 'Matthew 6:9–13; Luke 1:28–42',
            cardCandidates: ['Apostles-60', '3-24', '3-25'],
            geezMatch: 'አቡነ ዘበሰማያት'
        },
        {
            number: 4,
            title: 'Praises of the TRINITY',
            geez: 'አሐዱ',
            phonetic: 'Aḥadu Ab Ḳidus',
            summary: 'Clergy and congregation exchange solemn Debre Abay Zema chants praising the Holy Trinity ("One is the Holy Father, one is the Holy Son, one is the Holy Spirit"), chant Psalm 117 ("Sebḥwo"), are called to "Arise for prayer" (ተንሥኡ ለጸሎት), beg "Lord have mercy on us", and exchange salutations of peace.',
            scripture: 'Psalm 117:1–2; 2 Timothy 4:22',
            cardCandidates: ['3-26', '3-27'],
            geezMatch: 'አሐዱ አብ ቅዱስ',
            hasZaima: true
        },
        {
            number: 5,
            title: 'Prayers & Petitions',
            geez: 'ጸሎታት ወመስተብቍዕ',
            phonetic: "Tselotat we-Mestebḳw'i",
            summary: 'We pray St. Basil’s Prayer of Thanksgiving, the Prayer of Oblation for all offerings brought to God, Prayers of Absolution for release from sin, and the Diaconal Litanies (Mestebḳw’i petitions) for peace, the Church, clergy, rulers, travelers, the sick, and the whole world.',
            scripture: '1 Timothy 2:1–4',
            cardCandidates: ['3-31', '3-82'],
            geezMatch: 'ጸሎተ አኰቴት ዘቅዱስ ባስልዮስ'
        },
        {
            number: 6,
            title: 'Epistles & Acts',
            geez: 'መልእክታት ወግብረ ሐዋርያት',
            phonetic: "Mel'iktat we-Gibre Ḥawaryat",
            summary: 'Deacons and assistant priests read appointed passages from the Holy Bible in Ge’ez and the vernacular: the Pauline Epistle, the Universal (Catholic) Epistle, and the Acts of the Apostles. The congregation responds to each reading with hymns of praise and intercession, including the Golden Censer hymn (Antī w’itu Ma’iṭent ze-Werḳ).',
            scripture: '1 Timothy 4:13; Revelation 8:3–5',
            cardCandidates: ['3-119', '3-125', '3-140'],
            readingType: 'pauline',
            geezMatch: 'አንቲ ውእቱ ማዕጠንት ዘወርቅ',
            hasZaima: true
        },
        {
            number: 7,
            title: 'Thrice Holy (Trisagion)',
            geez: 'ቅዱስ',
            phonetic: "Ḳidus Igzī'abḥér",
            summary: 'The congregation chants the angelic hymn to Jesus Christ: "Holy God, Holy Mighty, Holy Living, Immortal — Who was born from the Holy Virgin Mary, baptized in the Jordan, crucified on the Cross, and rose on the third day — have mercy upon us, Lord."',
            scripture: 'Isaiah 6:3; Revelation 4:8',
            cardCandidates: ['Chrysostom-64', '3-180'],
            geezMatch: 'ቅዱስ እግዚአብሔር ቅዱስ ኃያል'
        },
        {
            number: 8,
            title: 'Psalm, Gospel, Creed',
            geez: 'ምስባክ ወወንጌል ወጸሎተ ሃይማኖት',
            phonetic: 'Misbak, Wengél we-Tselote Haymanot',
            summary: 'Clergy chant the responsorial Misbak Psalm and process with candles and umbrellas to proclaim the Holy Gospel. After the dismissal of catechumens, all confess the Nicene-Constantinopolitan Creed ("We believe in one God..."), wash hands in purity, and exchange the apostolic Greeting of Peace.',
            scripture: 'Romans 16:16; Acts 15:6–21',
            cardCandidates: ['The300-1', '4-1', '4-33'],
            readingType: 'psalm',
            geezMatch: 'ጸሎተ ሐይማኖት'
        },
        {
            number: 9,
            title: 'Institution & Invocation (Anaphora)',
            geez: 'ጸሎተ ሥርዓት ወምሕልላ (አኰቴተ ቍርባን)',
            phonetic: 'Akwetéte Ḳwrban',
            summary: 'Entering the Eucharistic Prayer (one of the 14 EOTC Anaphoras, such as the Apostles, St. Mary, or St. Jacob of Serug), we lift up our hearts to the Lord ("Sursum Corda"), chant the Sanctus, commemorate Christ’s Institution of the Eucharist ("Take, eat; this is My body..."), and invoke the Holy Spirit (Epiclesis) to descend upon the bread and cup.',
            scripture: 'Matthew 26:26–30; 1 Corinthians 11:23–26',
            cardCandidates: ['Apostles-1', 'St.Mary-1', 'St.Jacob-1', 'Apostles-26'],
            geezMatch: 'አኰቴተ ቍርባን'
        },
        {
            number: 10,
            title: 'Prayers of Penitence',
            geez: 'ጸሎተ ንስሐ',
            phonetic: 'Tselote Nisiḥa',
            summary: 'Following the Fraction and prayers of repentance (Pilot / Nisiḥa) by the celebrant priest, clergy and congregation solemnly chant 41 times in supplication: "O Lord Christ, have compassion upon us" (እግዚኦ መሐረነ ክርስቶስ).',
            scripture: 'Matthew 9:36; Luke 18:13',
            cardCandidates: ['Apostles-93', 'Apostles-82', 'St.Mary-118', 'St.Jacob-80'],
            geezMatch: 'እግዚኦ መሐረነ ክርስቶስ'
        },
        {
            number: 11,
            title: 'Holy Communion & Thanksgiving',
            geez: 'ቅዱስ ቁርባን',
            phonetic: 'Ḳidus Ḳwrban',
            summary: 'The climax of the Divine Liturgy: baptized and prepared faithful partake of the true Body and Blood of Christ to abide in Him ("Holy things for the holy"), followed by Post-Communion Thanksgiving hymns, the laying-on of hands (Buraké), and dismissal in peace.',
            scripture: 'John 6:53–56; Psalm 116:13',
            cardCandidates: ['Apostles-125', 'Apostles-119', 'Apostles-140'],
            geezMatch: 'ጽዋዐ ሕይወት'
        }
    ];

    const ESSENTIAL_PRAYERS = [
        {
            geez: 'እግዚኦ መሐረነ ክርስቶስ።',
            phonetic: "Igzī'o meḥarene Kristos.",
            english: 'O Lord, have compassion on us, Christ.',
            refs: 'Matthew 9:36, 15:32; Mark 1:41, 6:34, 8:2; Luke 7:13'
        },
        {
            geez: 'በእንተ ማርያም መሐረነ ክርስቶስ።',
            phonetic: "Be'inte Maryam meḥarene Kristos.",
            english: 'For the sake of Mary, have compassion on us, Christ.',
            refs: 'John 2:1–3, 19:26–27'
        },
        {
            geez: 'እግዚኦ ተሣሃለነ።',
            phonetic: "Igzī'o tesahalene.",
            english: 'O Lord, have mercy on us.',
            refs: 'Psalm 123:3, 16:10 (Acts 2:27); Isaiah 33:2; Matthew 9:27, 20:30–31; Luke 17:13'
        },
        {
            geez: 'ምስለ መንፈስከ።',
            phonetic: 'Misle menfeske.',
            english: '[And] with Your Spirit.',
            refs: '2 Timothy 4:22'
        },
        {
            geez: 'ኪያከ ንሴብሕ እግዚኦ። ኪያከ ንዌድስ እግዚኦ።',
            phonetic: "Kīyake nisébḥ Igzī'o; Kīyake niwédis Igzī'o.",
            english: 'O Lord, we glorify You. O Lord, we praise You.',
            refs: '1 Chronicles 29:13; Psalm 21:13, 63:3–4, 86:12; 1 Corinthians 6:20'
        },
        {
            geez: 'ቅዱስ እግዚአብሔር ቅዱስ ኃያል ቅዱስ ሕያው ዘኢይመውት።',
            phonetic: "Ḳidus Igzī'abḥér, Ḳidus Hayal, Ḳidus Ḥiyaw Ze'īymewut.",
            english: 'Holy God, Holy Mighty, Holy Immortal.',
            refs: 'Isaiah 6:3'
        }
    ];

    // All 100 Essential Words from "Treasure of the Divine Liturgy — መዝገበ ቅዳሴ" (p. 1)
    const ESSENTIAL_100_WORDS = [
        ['AB', 'አብ', '[God the] Father'],
        ['ABUHU', 'አቡሁ', '[God] the Father (His Father)'],
        ['ABUNE', 'አቡነ', 'Our Father'],
        ['ADHANKENE', 'አድኀንከነ', 'You did save us (masculine)'],
        ['ADHNENE', 'አድኅነነ', 'Save us'],
        ['AḤADU', 'አሐዱ', 'One (masculine)'],
        ['AḤATĪ', 'አሐቲ', 'One (feminine)'],
        ['AHAWĪNE', 'አኀዊነ', 'Our brothers'],
        ['ALBABĪNE', 'አልባቢነ', 'Our hearts'],
        ['ALEM', 'ዓለም', 'Eternity, age; world'],
        ['AMÉN', 'አሜን', "Amen (meaning 'so be it')"],
        ['AMLAK', 'አምላክ', 'God'],
        ['AMLAKNE', 'አምላክነ', 'Our God'],
        ['ANTE', 'አንተ', 'You (masculine, formal)'],
        ['BARK', 'ባርክ', 'Bless (verb, masculine)'],
        ['BE-INTE', 'በእንተ', 'For the sake of...'],
        ['BEREKET', 'በረከት', 'Blessing'],
        ["BE-RIT'IT", 'በርትዕት', 'In the Orthodox [faith]'],
        ['BE-SELAM', 'በሰላም', 'In peace'],
        ['BÉTE', 'ቤተ', 'House of...'],
        ["BTSU'I", 'ብፁዕ', 'Blessed (as in a bishop)'],
        ['BURKT', 'ቡርክት', 'Blessed (feminine)'],
        ['BURUK', 'ቡሩክ', 'Blessed (masculine)'],
        ['DAGME', 'ዳግመ', 'Again, for a second time'],
        ['DĪYAḲON', 'ዲያቆን', 'Deacon'],
        ['DNGL', 'ድንግል', 'Virgin'],
        ['FEḲADKE', 'ፈቃድከ', 'Your Will (masculine)'],
        ['GEBARÉ', 'ገባሬ', 'Maker, creator'],
        ['HABE', 'ኀበ', 'Towards'],
        ['HABENE', 'ሀበነ', 'Give us'],
        ['HALÉ LUYA', 'ሃሌ ሉያ', "Hallelujah (meaning 'praise the Lord')"],
        ["HAṬAW'ĪNE", 'ኃጣውኢነ', 'Our sins'],
        ["HAṬĪ'AT", 'ኃጢአት', 'Sins'],
        ['ḤAWARYAT', 'ሐዋርያት', 'Apostles'],
        ['HAYAL', 'ኃያል', 'Mighty, powerful'],
        ['HAYL', 'ኀይል', 'Power'],
        ['HAYMANOT', 'ሃይማኖት', 'Faith; Belief; Religion'],
        ['HĪRUTKE', 'ኂሩትከ', 'Your goodness (masculine)'],
        ['ḤYAW', 'ሕያው', 'Living'],
        ['ḤYWETE', 'ሕይወተ', 'Life of...'],
        ['ḤZB', 'ሕዝብ', 'People'],
        ["IGZĪ'ABḤÉR", 'እግዚአብሔር', 'Lord of the World; God'],
        ["IGZĪ'INE", 'እግዚእነ', 'Our Lord'],
        ["IGZĪ'O", 'እግዚኦ', 'O Lord'],
        ['IKUY', 'እኩይ', 'Evil'],
        ['IME', 'እመ', 'Mother of...'],
        ['IMUTAN', 'እሙታን', '...from the dead'],
        ['IṬAN', 'ዕጣን', 'Incense'],
        ["ĪTAB'ANE", 'ኢታብአነ', 'Lead us not...'],
        ['ĪYESUS', 'ኢየሱስ', 'Jesus'],
        ['KAHN', 'ካህን', 'Priest'],
        ['KAHN NFḲ', 'ካህን ንፍቅ', 'Assistant Priest'],
        ['ḲAL', 'ቃል', 'Word'],
        ['ḲALE', 'ቃለ', 'The Word of...'],
        ['ḲIDASÉ', 'ቅዳሴ', 'Divine Liturgy; sanctifying'],
        ['ḲIDIST', 'ቅድስት', 'Holy (feminine); female saint'],
        ['ḲIDUS', 'ቅዱስ', 'Holy (masculine); male saint'],
        ['ḲIDUSAN', 'ቅዱሳን', 'Saints'],
        ['KERSKĪ', 'ከርሥኪ', 'Your womb (feminine)'],
        ['KĪRYALAYSON', 'ኪርያላይሶን', "Kyrie Eleison ('have mercy on us')"],
        ['KĪYAKE', 'ኪያከ', 'You (masculine, with emphasis)'],
        ['KRISTĪYAN', 'ክርስቲያን', 'Christian'],
        ['KRISTOS', 'ክርስቶስ', 'Christ'],
        ['KWLNE', 'ኵልነ', '...of us all'],
        ['ḲWRBANE', 'ቍርባነ', 'The offering of...; our offering'],
        ["LA'ILÉNE", 'ላዕሌነ', 'Upon us; towards us'],
        ['LEYKUN', 'ለይኩን', 'So be it; Amen'],
        ['MARYAM', 'ማርያም', 'Mary'],
        ['MEDHANĪNE', 'መድኃኒነ', 'Our Savior'],
        ['MENFES', 'መንፈስ', 'Spirit; Soul'],
        ['MENGSTKE', 'መንግሥትከ', 'Your Kingdom (masculine)'],
        ["MESWA'ITE", 'መሥዋዕተ', 'Sacrifice of...'],
        ["METSA'IKE", 'መጻእከ', 'You did come (masculine)'],
        ['MIDIR', 'ምድር', 'Earth; dirt, ground'],
        ['MIḤRET', 'ምሕረት', 'Mercy'],
        ["NASTEBEḲW'I", 'ናስተበቍዕ', 'We beseech; we supplicate'],
        ["NE'AMN", 'ነአምን', 'We believe'],
        ['NIFÉNU', 'ንፌኑ', 'We offer [up] (plural)'],
        ['NISÉBḤ', 'ንሴብሕ', 'We glorify...'],
        ['NISÉBḤAKE', 'ንሴብሐከ', 'We glorify You (masculine)'],
        ['NITSUḤ', 'ንጹሕ', 'Pure'],
        ['NIWÉDS', 'ንዌድስ', 'We praise...'],
        ['P̣AP̣ASAT', 'ጳጳሳት', 'Bishops'],
        ["RIT'IT", 'ርትዕት', 'Orthodoxy; upright, straight (feminine)'],
        ["RTU'I", 'ርቱዕ', 'Right, meet, proper, just'],
        ['SIBḤAT', 'ስብሐት', 'Glory'],
        ["SE'ALĪ", 'ሰአሊ', 'Ask; beseech, intercede'],
        ["SE'AT", 'ሰዓት', 'Hour; time'],
        ["SEB'I", 'ሰብእ', 'Man; Mankind, humankind'],
        ['SELAM', 'ሰላም', 'Peace; Salutation'],
        ['SEMAYAT', 'ሰማያት', 'Heavens; skies'],
        ['SENAYE', 'ሠናየ', 'Good (masculine)'],
        ['SIMKE', 'ስምከ', 'Your name (masculine)'],
        ["TENS'U", 'ተንሥኡ', 'Arise (plural)'],
        ['TESAHALENE', 'ተሣሃለነ', 'Have mercy on us'],
        ['TEWEKEF', 'ተወከፍ', 'Accept'],
        ['TEWHBO', 'ተውህቦ', '...was given...'],
        ['TEZEKER', 'ተዘከር', 'Remember'],
        ['TSEGA', 'ጸጋ', 'Grace'],
        ['TSELOTE', 'ጸሎተ', 'Prayer of...'],
        ['TSELOTENE', 'ጸሎተነ', 'Our prayer'],
        ['TSELYU', 'ጸልዩ', 'All you pray (plural)'],
        ['WAḤID', 'ዋሕድ', 'Only-begotten; Only'],
        ["WE'ALBO", 'ወአልቦ', 'And nothing...; and never...; and neither...'],
        ['WELD', 'ወልድ', '[God the] Son'],
        ['WENGÉL', 'ወንጌል', 'Gospel'],
        ["Y'ITĪ", 'ይእቲ', 'This (feminine)'],
        ['ZE-KONE', 'ዘኮነ', 'Who became...; whomsoever is...'],
        ['ZE-TEWELDE', 'ዘተወልደ', 'Begotten; born']
    ];

    const ZAIMA_QIRTS_TABLE = [
        { glyph: '᎔', code: 'U+1394', name: 'Difat', geez: 'ድፋት', role: 'Voice drops / bends downward into a lower pitch contour.' },
        { glyph: '᎗', code: 'U+1397', name: 'Hīdet', geez: 'ሂደት', role: 'Smooth horizontal glide connecting rapid consecutive syllables in one breath.' },
        { glyph: '᎕', code: 'U+1395', name: 'Qinat', geez: 'ቅናት', role: 'Upward melodic inflection rising at the syllable.' },
        { glyph: '᎐', code: 'U+1390', name: 'Yizet', geez: 'ይዘት', role: 'Staccato hold / sustained stop on a single letter ("hold your voice on one letter").' },
        { glyph: '᎙', code: 'U+1399', name: 'Qwirt', geez: 'ቍርት', role: 'Decisive cut-off / abrupt vocal termination of a note.' },
        { glyph: '᎖', code: 'U+1396', name: 'Chiret', geez: 'ጭረት', role: 'Marks the exact syllable on which an extended descending/ornamented melisma begins.' },
        { glyph: '᎓', code: 'U+1393', name: 'Rikrik', geez: 'ርክርክ', role: 'Vibrato / undulating step-wise vocal slide across micro-intervals.' },
        { glyph: '᎒', code: 'U+1392', name: 'Deret', geez: 'ደረት', role: 'Chest-resonant low-register projection.' },
        { glyph: '᎑', code: 'U+1391', name: 'Deret (Arc)', geez: 'ደረት', role: 'Broad curved chest-voice inflection (frequently stacked in chords).' },
        { glyph: 'ርስ', code: 'Syllabic', name: 'Dirs', geez: 'ድርስ', role: 'Phrase-ending cadential resolution formula (equivalent to Miliket G261).' },
        { glyph: 'ር', code: 'Syllabic', name: 'Anbir', geez: 'አንብር', role: 'Final returning-tone cadence ("place/settle the voice" on the modal final).' },
        { glyph: '᎘', code: 'U+1398', name: 'Deret-Hīdet', geez: 'ደረት፡ሂደት', role: 'Fused composite stack of Deret above Hīdet (chest-tone attack into smooth glide).' }
    ];

    const ZAIMA_CONCEPTS = [
        {
            term: 'Three Modes — ስልት (Səlt)',
            geez: 'ግእዝ ፨ ዕዝል ፨ ዓራራይ',
            detail: 'St. Yared († A.D. 505–571) organized all sacred chant into three modes symbolizing the Holy Trinity: (1) Ge’ez (ግእዝ, "First", Father) — rendered in black on Row 1 immediately above the base text, strong and plain for ordinary days, built on a chain-of-thirds pitch set; (2) Izzel / Izil (ዕዝል, Son) — rendered in crimson rubric red on Row 2, solemn, lower-register pentatonic chant for fasts, vigils, funerals, and solemn Sundays; (3) Araray (ዓራራይ, Holy Spirit) — rendered in black on Row 3 (highest level), jubilant, soaring high-register chant for major feasts.'
        },
        {
            term: 'Miliket & Sereyu — ምልክት ወሥረዩ',
            geez: '፭፻፶፰+ ምልክቶች',
            detail: 'Alongside the atomic Qirts curves, over 558 syllabic abbreviations (287 in Ge’ez, 129 in Izzel, 142 in Araray) index canonical melodic phrases from the Dəggwa (ድጓ). Each Miliket derives from a specific exemplar hymn phrase called its Sereyu (ሥረዩ, marked "ረዩ" in manuscripts) — encoding an entire multi-note melodic contour in 1 to 3 Ethiopic characters.'
        },
        {
            term: 'Beit ("House"), Medgam & Miret — ቤት ፨ መድጋም ፨ ምረጥ',
            geez: '፩ ፨ ን ፨ ፴',
            detail: 'Marginal signs govern macro-structure: Beit (ቤት, e.g., ፩ on Aḥadu or ን on Nisgid) identifies the melodic family ("house" of 114 incipit families) and Hallelujah formula (አንቀጸ ሃሌታ); Medgam (መድጋም) signals repetition with prayer staff (መቋሚያ), sistrum (ጸናጽል), and drum (ከበሮ); Miret (ምረጥ) indicates alternate melodic rows above the base.'
        },
        {
            term: 'Living Monastic Schools — ዘደብረ ዓባይ ወቤተ ልሔም',
            geez: 'ደብረ ዓባይ ፨ ቤተ ልሔም ፨ ቆማ ፨ አጫበር',
            detail: 'Preserved after the 16th-century revival under Azzaj Gera and Azzaj Ragu’el, Zaima is transmitted orally and in parchment manuscripts across classical schools: Bethlehem (South Gondar, Dəggwa), Debre Abay (Tigray, authoritative for Mäzgäbä Ḳidasé liturgical chant), Qoma, and Achaber.'
        }
    ];

    const SANCTUARY_AND_POSTURE = [
        {
            category: 'Entering & Sacred Attire',
            items: [
                { title: 'Where You Stand is Holy Ground', geez: 'ምድር ቅድስት', ref: 'Exodus 3:5', desc: 'Following Moses before the Burning Bush, faithful remove their shoes before stepping into the sanctuary carpet of the Holy Church.' },
                { title: 'Clothed in White Garments (Netela)', geez: 'ነጠላ (ልብሰ ብርሃን)', ref: 'Matthew 5:14; Revelation 3:4–5, 4:4', desc: 'White cotton Netela garments are worn draped in the sign of the Cross (ጥበብ crossed over the shoulders during Kidase) as a sign of light, purity, and eternal life.' },
                { title: 'Under the Shadow (Ceremonial Umbrellas)', geez: 'ድባብ / ጃንጥላ', ref: 'Numbers 9:15–23', desc: 'Ornate liturgical umbrellas shelter the Gospel, Cross, and Tabot processions, recalling the pillar of cloud of God’s protective presence over Israel.' }
            ]
        },
        {
            category: 'Postures of Liturgical Prayer',
            items: [
                { title: 'Arise for Prayer ("Tens’u le-Tselot")', geez: 'ተንሥኡ ለጸሎት', ref: 'Nehemiah 9:2–5', desc: 'When the Deacon proclaims "Stand up for prayer," the congregation stands attentively with stillness and reverence (as each is physically able) in living sacrifice to God.' },
                { title: 'Raise Up Your Hands', geez: 'አንሥኡ እደዊክሙ', ref: 'Psalm 141:2; 1 Timothy 2:8', desc: 'Open palms lifted modestly heavenward offer personal supplication as an evening and morning sacrifice before the Lord.' },
                { title: 'Worship the Lord with Fear (Bow & Prostrate)', geez: 'ስግዱ ለእግዚአብሔር በፍርሃት', ref: 'Genesis 17:3, 18:2, 24:26', desc: 'During "Nisgid" (Let us worship), Penitence, and the Epiclesis, faithful bow deeply or prostrate (ስግደት) in humility; on Sundays and the Holy 50 Days of Pascha, full kneeling prostrations give way to reverent bows honoring the Resurrection.' }
            ]
        },
        {
            category: 'Sanctuary, Tabot & Sacred Vessels',
            items: [
                { title: 'Holy of Holies, Altar & Ark (Tabot)', geez: 'ቅዱሰ ቅዱሳን ፨ መንበር ፨ ታቦት', ref: 'Exodus 20:24; 2 Samuel 6:1–5; 1 Kings 8:1–9; Hebrews 13:10', desc: 'The church is arranged in three concentric courts (Qəne Mahlet, Qəddəst, and Mäqdäs / Holy of Holies), enshrining the consecrated Tabot (Ark tablet of the Covenant) upon the altar (Mänbär).' },
                { title: 'Pot of Pure Gold & Chalice (Mesobe Werq & Ts’iwa)', geez: 'መሶበ ወርቅ ወጽዋዕ', ref: 'John 6:53–56; Psalm 116:13', desc: 'The Eucharistic bread (Ḥibist, stamped with 13 cross squares) is carried in the Mesobe Werq ("Golden Basket", type of the Theotokos) and consecrated with the wine in the Chalice (Ts’iwa) using the Eucharistic spoon (Ǝrfä Mäsqäl).' },
                { title: 'Sweet Incense, Holy Water & Bells', geez: 'ማዕጠንት ዘወርቅ ፨ ማየ ጸሎት ፨ ቃጭል', ref: 'Revelation 8:3–5; Ezekiel 36:25; John 1:23, 19:25', desc: 'In Orthodox typology, St. Mary is the Golden Censer (Ma’iṭent) and Jesus Christ is the live Coal of Fire (Fəḥmä Ǝsat) united with humanity; bells (Qaçil) signify St. John’s prophetic voice and lamentation at the Cross.' },
                { title: 'Partaking of Holy Communion', geez: 'ቅዱስ ቁርባን', ref: '1 Corinthians 11:27–32; 2 Corinthians 13:5', desc: 'All baptized and received Christians of the Oriental Orthodox Communion who have examined themselves through confession, repentance, prayer, and complete fasting (no food or water before Communion) are invited to partake. Note: No food, beverages, or active bleeding are permitted inside the Church.' }
            ]
        }
    ];

    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /**
     * Jumps directly to one of the 11 Liturgy Map stations in either Scroll Mode or Slides Mode,
     * automatically activating the Liturgy view if the user is currently on Daily Prayers.
     */
    function jumpToLiturgyStation(stationNumber) {
        const station = LITURGY_MAP_STATIONS.find(s => s.number === Number(stationNumber));
        if (!station || typeof document === 'undefined') return false;

        // Close modal first so viewport scroll/slide transition is visible
        closeLiturgyGuideModal();

        const attemptJump = () => {
            let targetCard = null;

            // 1. Try explicit cardId candidates (respecting active Anaphora for Station 9)
            for (const cid of (station.cardCandidates || [])) {
                const el = document.querySelector(`.prayer-card[data-card-id="${cid}"]`);
                if (el) {
                    targetCard = el;
                    break;
                }
            }

            // 2. Try readingType attribute (e.g., Pauline Epistle or Misbak Psalm)
            if (!targetCard && station.readingType) {
                targetCard = document.querySelector(`.prayer-card[data-reading-type="${station.readingType}"]`);
            }

            // 3. Fallback: search Ge'ez text across rendered cards
            if (!targetCard && station.geezMatch) {
                const cards = document.querySelectorAll('.prayer-card');
                for (const c of cards) {
                    if ((c.textContent || '').includes(station.geezMatch)) {
                        targetCard = c;
                        break;
                    }
                }
            }

            if (!targetCard) return false;

            // If in Slides Mode, navigate the slide deck directly to this card!
            const isSlidesMode = document.body.classList.contains('presentation-mode') ||
                document.body.classList.contains('view-mode-slides');
            if (isSlidesMode) {
                const allSlideCards = Array.from(document.querySelectorAll('#prayer-display .prayer-card'));
                const targetIdx = allSlideCards.indexOf(targetCard);
                if (targetIdx !== -1) {
                    // Dispatch ArrowLeft/ArrowRight or click slide nav until synced, or use liturgyTracker / showSlide
                    const currentActiveIdx = allSlideCards.findIndex(c => c.classList.contains('active-slide'));
                    if (currentActiveIdx !== -1 && currentActiveIdx !== targetIdx) {
                        const delta = targetIdx - currentActiveIdx;
                        const stepKey = delta > 0 ? 'ArrowRight' : 'ArrowLeft';
                        const steps = Math.min(Math.abs(delta), 600);
                        for (let i = 0; i < steps; i++) {
                            document.dispatchEvent(new KeyboardEvent('keydown', { key: stepKey, bubbles: true }));
                        }
                    }
                    return true;
                }
            }

            // Scroll Mode: uncollapse parent section if needed and smooth-scroll to card
            let prev = targetCard.previousElementSibling;
            while (prev) {
                if (prev.classList && prev.classList.contains('section-header-collapsible')) {
                    if (prev.classList.contains('collapsed')) {
                        prev.click();
                    }
                    break;
                }
                prev = prev.previousElementSibling;
            }
            targetCard.style.display = '';
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetCard.classList.add('liturgy-station-highlight');
            setTimeout(() => targetCard.classList.remove('liturgy-station-highlight'), 2400);
            return true;
        };

        if (attemptJump()) return true;

        // If Kidase cards weren't rendered yet, switch to the Liturgy tab and retry!
        const liturgyTabBtn = document.getElementById('liturgy-tab-header') || document.getElementById('bottom-nav-liturgy');
        if (liturgyTabBtn && !liturgyTabBtn.classList.contains('active')) {
            liturgyTabBtn.click();
            setTimeout(() => { attemptJump(); }, 280);
            return true;
        }
        const kidaseToggle = document.getElementById('kidase-mode-toggle');
        if (kidaseToggle && !kidaseToggle.checked) {
            kidaseToggle.click();
            setTimeout(() => { attemptJump(); }, 280);
            return true;
        }
        return false;
    }

    function renderMapTabHtml() {
        const cardsHtml = LITURGY_MAP_STATIONS.map(st => `
            <div class="lg-station-card">
                <div class="lg-station-header">
                    <span class="lg-station-badge">${st.number}</span>
                    <div class="lg-station-titles">
                        <div class="lg-station-geez ethiopic-label">${escapeHtml(st.geez)}</div>
                        <h4 class="lg-station-title">${escapeHtml(st.title)} <span class="lg-station-phonetic">(${escapeHtml(st.phonetic)})</span></h4>
                    </div>
                    <button type="button" class="lg-jump-btn" data-station-jump="${st.number}" title="Jump to Station ${st.number} in Kidase">
                        Jump →
                    </button>
                </div>
                <p class="lg-station-summary">${escapeHtml(st.summary)}</p>
                <div class="lg-station-meta">
                    <span class="lg-scripture-pill">📖 ${escapeHtml(st.scripture)}</span>
                    ${st.hasZaima ? '<span class="lg-zaima-pill">🎼 St. Yared Zaima Notation Available</span>' : ''}
                </div>
            </div>
        `).join('');

        return `
            <div class="lg-intro-banner">
                <div class="lg-intro-quote">
                    “Enter into the Church and wash away your sins. For here is a hospital for sinners and not a court of law.”
                    <span class="lg-quote-author">— St. John Chrysostom</span>
                </div>
                <div class="lg-things-to-know">
                    <span>⏰ Most Sunday Kidase services begin by <strong>6:00 AM</strong></span>
                    <span>🗣️ Chanted in ancient <strong>Ge’ez</strong> + vernacular</span>
                    <span>🙏 Select any station below to jump directly to its place</span>
                </div>
            </div>
            <div class="lg-stations-grid">${cardsHtml}</div>
        `;
    }

    function renderZaimaTabHtml() {
        const isScribe = (typeof document !== 'undefined') && document.body.classList.contains('scribe-mode-active');
        const isZaimaOn = isScribe && !!(document.getElementById('show-zaima-notation-toggle')?.checked);
        const sampleWordHtml = (root.ZAIMA_NOTATION_DATA && root.ZAIMA_NOTATION_DATA.decorateGeezHtmlWithZaima)
            ? root.ZAIMA_NOTATION_DATA.decorateGeezHtmlWithZaima(
                'ካህን፤ አሐዱ አብ ቅዱስ አሐዱ ወልድ ቅዱስ አሐዱ ውእቱ መንፈስ ቅዱስ።',
                '3-26'
            )
            : 'ካህን፤ አሐዱ አብ ቅዱስ አሐዱ ወልድ ቅዱስ አሐዱ ውእቱ መንፈስ ቅዱስ።';

        const qirtsRows = ZAIMA_QIRTS_TABLE.map(q => `
            <tr>
                <td class="lg-qirts-glyph ethiopic-label">${escapeHtml(q.glyph)}</td>
                <td><strong>${escapeHtml(q.name)}</strong><br><span class="ethiopic-label lg-muted">${escapeHtml(q.geez)}</span></td>
                <td><code class="lg-code">${escapeHtml(q.code)}</code></td>
                <td>${escapeHtml(q.role)}</td>
            </tr>
        `).join('');

        const conceptsHtml = ZAIMA_CONCEPTS.map(c => `
            <div class="lg-concept-card">
                <div class="lg-concept-head">
                    <h4>${escapeHtml(c.term)}</h4>
                    <span class="ethiopic-label lg-concept-geez">${escapeHtml(c.geez)}</span>
                </div>
                <p>${escapeHtml(c.detail)}</p>
            </div>
        `).join('');

        const toggleActionBtnHtml = isScribe
            ? `<button type="button" id="lg-toggle-zaima-btn" class="lg-primary-action-btn">
                    ${isZaimaOn ? '✓ Zaima Notation Enabled' : 'Enable Zaima Notation in Kidase (Beta)'}
               </button>`
            : '';

        return `
            <div class="lg-zaima-hero">
                <div class="lg-zaima-hero-top">
                    <div>
                        <h4 style="margin:0 0 0.25rem 0;">Live Multi-Row Interlinear Preview (Debre Abay Tradition)</h4>
                        <p style="margin:0; font-size:0.84rem; opacity:0.85;">
                            Hover or tap any interlinear symbol (<span class="ethiopic-label">ምልክት / ቅርጽ</span>) to inspect its chanting mode and vocal articulation.
                            <strong style="color:#b91c1c;">Red</strong> marks <em>Izzel</em> (ዕዝል) mode or holy names; <strong>Black</strong> marks <em>Ge’ez</em> (Row 1) and <em>Araray</em> (Row 3).
                        </p>
                    </div>
                    <div class="lg-zaima-actions">
                        ${toggleActionBtnHtml}
                        <button type="button" class="lg-jump-btn" data-station-jump="4">View on Aḥadu (3:26) →</button>
                    </div>
                </div>
                <div class="lg-zaima-live-specimen lang-ethiopic-script ethiopic-label">
                    ${sampleWordHtml}
                </div>
            </div>

            <div class="lg-concepts-grid">${conceptsHtml}</div>

            <h4 class="lg-section-heading">The Conventional Vocal Inflection Signs — የፊደል ቅርጽ (YeFidel Qirts)</h4>
            <div class="lg-table-scroll">
                <table class="lg-qirts-table">
                    <thead>
                        <tr>
                            <th>Sign</th>
                            <th>Name</th>
                            <th>Unicode</th>
                            <th>Vocal Inflection &amp; Articulation</th>
                        </tr>
                    </thead>
                    <tbody>${qirtsRows}</tbody>
                </table>
            </div>
        `;
    }

    function renderLexiconTabHtml() {
        const prayersHtml = ESSENTIAL_PRAYERS.map(p => `
            <div class="lg-prayer-response-card">
                <div class="lg-pr-geez ethiopic-label">${escapeHtml(p.geez)}</div>
                <div class="lg-pr-phonetic">${escapeHtml(p.phonetic)}</div>
                <div class="lg-pr-eng">${escapeHtml(p.english)}</div>
                <div class="lg-pr-ref">📖 ${escapeHtml(p.refs)}</div>
            </div>
        `).join('');

        const wordRowsHtml = ESSENTIAL_100_WORDS.map(([phon, geez, eng]) => `
            <tr class="lg-lex-row" data-search="${escapeHtml((phon + ' ' + geez + ' ' + eng).toLowerCase())}">
                <td class="lg-lex-phon">${escapeHtml(phon)}</td>
                <td class="lg-lex-geez ethiopic-label">${escapeHtml(geez)}</td>
                <td class="lg-lex-eng">${escapeHtml(eng)}</td>
            </tr>
        `).join('');

        return `
            <h4 class="lg-section-heading" style="margin-top:0;">Essential Congregational Responses &amp; Biblical Roots</h4>
            <div class="lg-responses-grid">${prayersHtml}</div>

            <div class="lg-lexicon-header-bar">
                <h4 class="lg-section-heading" style="margin:0;">100 Essential Words from the Divine Liturgy (መዝገበ ቃላት)</h4>
                <input type="search" id="lg-lexicon-search" class="lg-search-input" placeholder="Filter Ge'ez, phonetic, or English (e.g. ቅዱስ, mercy, kahn)..." aria-label="Filter 100 Essential Words" />
            </div>
            <div class="lg-table-scroll lg-lexicon-scroll">
                <table class="lg-qirts-table lg-lexicon-table">
                    <thead>
                        <tr>
                            <th>Ge’ez (Phonetic)</th>
                            <th>ግእዝ</th>
                            <th>English Meaning</th>
                        </tr>
                    </thead>
                    <tbody id="lg-lexicon-tbody">${wordRowsHtml}</tbody>
                </table>
            </div>
        `;
    }

    function renderSanctuaryTabHtml() {
        return SANCTUARY_AND_POSTURE.map(sec => `
            <h4 class="lg-section-heading">${escapeHtml(sec.category)}</h4>
            <div class="lg-concepts-grid">
                ${sec.items.map(item => `
                    <div class="lg-concept-card">
                        <div class="lg-concept-head">
                            <h4>${escapeHtml(item.title)}</h4>
                            <span class="ethiopic-label lg-concept-geez">${escapeHtml(item.geez)}</span>
                        </div>
                        <p>${escapeHtml(item.desc)}</p>
                        <div class="lg-station-meta"><span class="lg-scripture-pill">📖 ${escapeHtml(item.ref)}</span></div>
                    </div>
                `).join('')}
            </div>
        `).join('') + `
            <div class="lg-attribution-footer">
                Compiled from <em>Heavenly Liturgy</em> &amp; <em>Treasure of the Divine Liturgy (መዝገበ ቅዳሴ)</em> —
                Bay Area Bible Society &amp; Oakland Debre Meheret Kidus Michael EOTC (Debre Abay Monastery chant certification),
                with musicological notes from St. Yared’s <em>Dəggwa</em>, W3C Ethiopic Zaima Layout, and Shelemay, Jeffery &amp; Monson (1993).
            </div>
        `;
    }

    let modalEl = null;

    function ensureLiturgyGuideModal() {
        if (typeof document === 'undefined') return null;
        if (modalEl && document.body.contains(modalEl)) return modalEl;

        modalEl = document.createElement('div');
        modalEl.id = 'liturgy-guide-modal';
        modalEl.className = 'modal liturgy-guide-modal';
        modalEl.setAttribute('role', 'dialog');
        modalEl.setAttribute('aria-modal', 'true');
        modalEl.setAttribute('aria-labelledby', 'liturgy-guide-modal-title');

        modalEl.innerHTML = `
            <div class="modal-content liturgy-guide-modal-content">
                <div class="lg-modal-top">
                    <div>
                        <div class="lg-modal-eyebrow ethiopic-label">መዝገበ ቅዳሴ ወመርሐ ሥርዓተ ቅዳሴ</div>
                        <h2 id="liturgy-guide-modal-title" class="lg-modal-title">Heavenly Liturgy Map, St. Yared Zaima &amp; Guide</h2>
                    </div>
                    <button type="button" class="lg-close-btn" id="close-liturgy-guide-modal" aria-label="Close Liturgy Guide">&times;</button>
                </div>

                <div class="lg-tabs-bar" role="tablist" aria-label="Liturgy Guide Sections">
                    <button type="button" class="lg-tab-btn active" role="tab" aria-selected="true" data-lg-tab="map">🗺️ 11-Station Map</button>
                    <button type="button" class="lg-tab-btn" role="tab" aria-selected="false" data-lg-tab="zaima">🎼 St. Yared Zaima (ምልክት)</button>
                    <button type="button" class="lg-tab-btn" role="tab" aria-selected="false" data-lg-tab="lexicon">📜 100 Essential Words</button>
                    <button type="button" class="lg-tab-btn" role="tab" aria-selected="false" data-lg-tab="sanctuary">⛪ Sanctuary &amp; Posture</button>
                </div>

                <div class="lg-tab-panel" id="lg-tab-panel"></div>
            </div>
        `;

        document.body.appendChild(modalEl);

        const switchTab = (tabId) => {
            modalEl.querySelectorAll('.lg-tab-btn').forEach(btn => {
                const active = btn.dataset.lgTab === tabId;
                btn.classList.toggle('active', active);
                btn.setAttribute('aria-selected', active ? 'true' : 'false');
            });
            const panel = modalEl.querySelector('#lg-tab-panel');
            if (!panel) return;
            if (tabId === 'zaima') panel.innerHTML = renderZaimaTabHtml();
            else if (tabId === 'lexicon') panel.innerHTML = renderLexiconTabHtml();
            else if (tabId === 'sanctuary') panel.innerHTML = renderSanctuaryTabHtml();
            else panel.innerHTML = renderMapTabHtml();

            panel.scrollTop = 0;

            // Wire dynamic controls inside panel
            panel.querySelectorAll('[data-station-jump]').forEach(btn => {
                btn.addEventListener('click', () => {
                    jumpToLiturgyStation(Number(btn.dataset.stationJump));
                });
            });

            const toggleZaimaBtn = panel.querySelector('#lg-toggle-zaima-btn');
            if (toggleZaimaBtn) {
                toggleZaimaBtn.addEventListener('click', () => {
                    const checkbox = document.getElementById('show-zaima-notation-toggle');
                    if (checkbox) {
                        checkbox.checked = !checkbox.checked;
                        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                        toggleZaimaBtn.textContent = checkbox.checked
                            ? '✓ Zaima Notation Enabled'
                            : 'Enable Zaima Notation in Kidase (Beta)';
                    }
                });
            }

            const lexSearch = panel.querySelector('#lg-lexicon-search');
            if (lexSearch) {
                lexSearch.addEventListener('input', () => {
                    const q = lexSearch.value.trim().toLowerCase();
                    panel.querySelectorAll('.lg-lex-row').forEach(row => {
                        const hay = row.dataset.search || '';
                        row.style.display = (!q || hay.includes(q)) ? '' : 'none';
                    });
                });
            }
        };

        modalEl._switchTab = switchTab;

        modalEl.querySelectorAll('.lg-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.lgTab));
        });

        modalEl.querySelector('#close-liturgy-guide-modal')?.addEventListener('click', closeLiturgyGuideModal);
        modalEl.addEventListener('click', (e) => {
            if (e.target === modalEl) closeLiturgyGuideModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalEl && modalEl.style.display === 'flex') {
                closeLiturgyGuideModal();
            }
        });

        return modalEl;
    }

    function openLiturgyGuideModal(initialTab = 'map') {
        const modal = ensureLiturgyGuideModal();
        if (!modal) return;
        modal._switchTab(initialTab || 'map');
        modal.style.display = 'flex';
    }

    function closeLiturgyGuideModal() {
        if (modalEl) {
            modalEl.style.display = 'none';
        }
    }

    const GUIDE_API = {
        LITURGY_MAP_STATIONS,
        ESSENTIAL_PRAYERS,
        ESSENTIAL_100_WORDS,
        ZAIMA_QIRTS_TABLE,
        ZAIMA_CONCEPTS,
        SANCTUARY_AND_POSTURE,
        openLiturgyGuideModal,
        closeLiturgyGuideModal,
        jumpToLiturgyStation
    };

    if (root) {
        root.LITURGY_GUIDE_DATA = GUIDE_API;
        root.openLiturgyGuideModal = openLiturgyGuideModal;
        root.closeLiturgyGuideModal = closeLiturgyGuideModal;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = GUIDE_API;
    }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
