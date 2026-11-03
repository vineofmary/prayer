// ============================================================================
// GE'EZ LEXICON, INTERLINEAR ANNOTATIONS & SUNDAY SCHOOL CURRICULUM DATA
// ============================================================================
// Provides:
// 1. Sunday School Class / Age Tiers:
//    - Hitsanat (ሕፃናት • Under 7)
//    - St. Arsema's Class (ቅድስት አርሴማ • Ages 7–9)
//    - St. John's Class (ቅዱስ ዮሐንስ • Ages 10–12)
// 2. BibleHub-style Ge'ez Interlinear Stanzas with morphological prefix/root/suffix
//    breakdowns, Amharic/Tigrinya cognates, and live corpus concordance support.
// 3. Liturgical Phrase Matcher level packs, Qidase Scramble sequencing packs,
//    and Jeopardy category & clue banks.
// ============================================================================

(function () {
    'use strict';

    const SUNDAY_SCHOOL_CLASSES = [
        {
            id: 'st_kirkos',
            name: "St. Kirkos' Kids",
            ageRange: 'Under 7',
            patronSaint: 'St. Kirkos (Cyriacus)',
            boardSize: 3,
            matcherPairs: 4,
            allowedTabs: ['blitz', 'matcher'],
            description: 'Foundational Ge\'ez words, sacred icons, and joyful liturgical responses for young children.'
        },
        {
            id: 'st_arsema',
            name: "St. Arsema's Kids",
            ageRange: 'Ages 7–9',
            patronSaint: 'St. Arsema the Martyr',
            boardSize: 4,
            matcherPairs: 6,
            allowedTabs: ['blitz', 'jeopardy', 'matcher'],
            description: 'Core congregation responses, Divine Liturgy milestones, and daily prayer vocabulary.'
        },
        {
            id: 'st_john',
            name: "St. John's Kids",
            ageRange: 'Ages 10–12',
            patronSaint: 'St. John the Evangelist',
            boardSize: 5,
            matcherPairs: 8,
            allowedTabs: ['blitz', 'jeopardy', 'matcher'],
            description: 'Liturgical responses, Jeopardy, and vocabulary matching.'
        },
        {
            id: 'st_michael',
            name: "St. Michael's Kids",
            ageRange: 'Ages 13+',
            patronSaint: 'St. Michael the Archangel',
            boardSize: 5,
            matcherPairs: 8,
            allowedTabs: ['blitz', 'jeopardy', 'matcher', 'interlinear'],
            description: 'Full access to Trivia, Jeopardy, Match It, plus the word-by-word Ge\'ez Reader and concordance.'
        }
    ];

    // Ge'ez Morphological Prefixes & Suffixes for automatic word decomposition
    const GEEZ_PREFIX_RULES = [
        { prefix: 'ወበ', phonetic: 'webe-', meaning: 'and in / and by', grammar: 'Conj ወ + Prep በ' },
        { prefix: 'ወለ', phonetic: 'wele-', meaning: 'and to / and for', grammar: 'Conj ወ + Prep ለ' },
        { prefix: 'ወእም', phonetic: 'we\'im-', meaning: 'and from', grammar: 'Conj ወ + Prep እም' },
        { prefix: 'በእንተ', phonetic: 'be\'inte-', meaning: 'for the sake of / concerning', grammar: 'Compound Preposition' },
        { prefix: 'እስመ', phonetic: '\'isme-', meaning: 'for / because', grammar: 'Causal Conjunction' },
        { prefix: 'እምነ', phonetic: '\'imne-', meaning: 'from', grammar: 'Preposition' },
        { prefix: 'እም', phonetic: '\'im-', meaning: 'from / out of', grammar: 'Preposition' },
        { prefix: 'ዲበ', phonetic: 'dībe-', meaning: 'upon / over', grammar: 'Preposition' },
        { prefix: 'ምስለ', phonetic: 'msle-', meaning: 'with', grammar: 'Preposition' },
        { prefix: 'ቅድመ', phonetic: 'ḳdme-', meaning: 'before / in front of', grammar: 'Preposition' },
        { prefix: 'ኀበ', phonetic: 'habe-', meaning: 'unto / toward', grammar: 'Preposition' },
        { prefix: 'ከመ', phonetic: 'keme-', meaning: 'like / as / so that', grammar: 'Preposition / Conj' },
        { prefix: 'ዘበ', phonetic: 'zebe-', meaning: 'who is in', grammar: 'Rel ዘ + Prep በ' },
        { prefix: 'ወ', phonetic: 'we-', meaning: 'and', grammar: 'Conjunction' },
        { prefix: 'በ', phonetic: 'be-', meaning: 'in / by / with', grammar: 'Preposition' },
        { prefix: 'ለ', phonetic: 'le-', meaning: 'to / for', grammar: 'Preposition' },
        { prefix: 'ዘ', phonetic: 'ze-', meaning: 'who / which / of', grammar: 'Relative / Genitive Particle' }
    ];

    const GEEZ_SUFFIX_RULES = [
        { suffix: 'ክሙ', phonetic: '-kmu', meaning: 'your (plural)', grammar: '2nd Pers. Masc. Pl. Suffix' },
        { suffix: 'ሆሙ', phonetic: '-homu', meaning: 'their', grammar: '3rd Pers. Masc. Pl. Suffix' },
        { suffix: 'ነ', phonetic: '-ne', meaning: 'our / us', grammar: '1st Pers. Pl. Suffix' },
        { suffix: 'ከ', phonetic: '-ke', meaning: 'your (masc. sg.)', grammar: '2nd Pers. Masc. Sg. Suffix' },
        { suffix: 'ኪ', phonetic: '-kī', meaning: 'your (fem. sg.)', grammar: '2nd Pers. Fem. Sg. Suffix' },
        { suffix: 'የ', phonetic: '-ye', meaning: 'my', grammar: '1st Pers. Sg. Suffix' },
        { suffix: 'ሁ', phonetic: '-hu', meaning: 'his / its', grammar: '3rd Pers. Masc. Sg. Suffix' },
        { suffix: 'ሃ', phonetic: '-ha', meaning: 'her / its', grammar: '3rd Pers. Fem. Sg. Suffix' }
    ];

    // Core Ge'ez Root & Word Dictionary (used by Interlinear Explorer, Concordance & Games)
    const GEEZ_WORD_DICTIONARY = {
        'በስመ': {
            geez: 'በስመ',
            phonetic: 'besme',
            meaning: 'In the name of',
            root: 'ስም (sm)',
            pos: 'Prep + Noun (Construct)',
            breakdown: 'በ (in) + ስመ (name of)',
            cognates: 'Amharic: ስም (səm) • Tigrinya: ስም (səm) • Hebrew: שֵׁם (shem)',
            note: 'In Ge\'ez, the vowel -e at the end of ስመ puts the noun into the "construct state" ("name of...").'
        },
        'አብ': {
            geez: 'አብ',
            phonetic: '\'ab',
            meaning: 'the Father',
            root: 'አብ (\'ab)',
            pos: 'Noun (Masc. Sg.)',
            breakdown: 'አብ (Father)',
            cognates: 'Amharic: አባት (abbat) • Tigrinya: ኣቦ (abbo) • Aramaic: אַבָּא (Abba)',
            note: 'Designates God the Father, the unbegotten source of the Holy Trinity.'
        },
        'ወወልድ': {
            geez: 'ወወልድ',
            phonetic: 'weweld',
            meaning: 'and the Son',
            root: 'ወለደ (welede - to beget)',
            pos: 'Conj + Noun',
            breakdown: 'ወ (and) + ወልድ (Son)',
            cognates: 'Amharic: ወንድ / ልጅ • Tigrinya: ወዲ (wedi)',
            note: 'From the triliteral root ወ-ለ-ደ ("to beget / give birth"); refers to God the Son, eternally begotten of the Father.'
        },
        'ወመንፈስ': {
            geez: 'ወመንፈስ',
            phonetic: 'wemenfes',
            meaning: 'and the Spirit',
            root: 'ነፍሰ (nefse - to breathe)',
            pos: 'Conj + Noun',
            breakdown: 'ወ (and) + መንፈስ (Spirit / Breath)',
            cognates: 'Amharic: መንፈስ (menfes) • Tigrinya: መንፈስ (menfes)',
            note: 'Formed with the instrumental/nominal prefix መ- on the root ነ-ፍ-ሰ (breath/soul/wind).'
        },
        'ቅዱስ': {
            geez: 'ቅዱስ',
            phonetic: 'ḳdus',
            meaning: 'Holy',
            root: 'ቀደሰ (ḳedese - to sanctify)',
            pos: 'Adjective / Title',
            breakdown: 'ቅዱስ (Holy / Set apart)',
            cognates: 'Amharic: ቅዱስ (qəddus) • Tigrinya: ቅዱስ (qəddus) • Hebrew: קָדוֹשׁ (qadosh)',
            note: 'Chanted three times in the Trisagion and Keddase to honor the three Persons of the Holy Trinity.'
        },
        'አሐዱ': {
            geez: 'አሐዱ',
            phonetic: '\'aḥadu',
            meaning: 'One',
            root: 'አሐደ (\'aḥade - to unite)',
            pos: 'Numeral / Adjective',
            breakdown: 'አሐዱ (One / United)',
            cognates: 'Amharic: አንድ (and) • Tigrinya: ሓደ (ḥade) • Hebrew: אֶחָד (echad)',
            note: 'Confesses the unity of essence (Tewahedo / ህልውና) of the Father, Son, and Holy Spirit.'
        },
        'አምላክ': {
            geez: 'አምላክ',
            phonetic: '\'amlak',
            meaning: 'God / Sovereign Lord',
            root: 'መለከ (meleke - to rule/reign)',
            pos: 'Noun',
            breakdown: 'አምላክ (God / Ruler)',
            cognates: 'Amharic: አምላክ (amlak) • Tigrinya: ኣምላኽ (amlakh)',
            note: 'Proclaims that although the Persons are three, Their divine rule and Godhead is One.'
        },
        'አሜን': {
            geez: 'አሜን',
            phonetic: '\'amén',
            meaning: 'Amen / Truly / So be it',
            root: 'አምነ (\'amne - to believe/be true)',
            pos: 'Liturgical Seal',
            breakdown: 'አሜን (Verily / Let it be so)',
            cognates: 'Amharic: አሜን • Hebrew: אָמֵן (amen)',
            note: 'The congregation\'s seal of faith affirming every prayer offered in the Church.'
        },
        'አአትብ': {
            geez: 'አአትብ',
            phonetic: 'a\'atb',
            meaning: 'I seal / I sign with the Cross',
            root: 'ዐተበ (\'atebe - to sign with the Cross)',
            pos: 'Verb (1st Pers. Sg. Imperfect)',
            breakdown: 'አ- (I) + አትብ (seal with the Cross)',
            cognates: 'Amharic: አማትባለሁ (amatballehu) • Tigrinya: የማዕትብ (yema\'təb)',
            note: 'Spoken while tracing the Sign of the Cross from forehead to chest, and from left shoulder to right shoulder.'
        },
        'ገጽየ': {
            geez: 'ገጽየ',
            phonetic: 'getsye',
            meaning: 'my face',
            root: 'ገጽ (gets - face/countenance)',
            pos: 'Noun + Possessive Suffix',
            breakdown: 'ገጽ (face) + -የ (my)',
            cognates: 'Amharic: ገጽ (gäts - page/face) • Tigrinya: ገጽ (gäts - face)',
            note: 'In Ge\'ez, adding -የ (-ye) to any noun means "my" (e.g., አምላኪየ = my God, ገጽየ = my face).'
        },
        'ወኵለንታየ': {
            geez: 'ወኵለንታየ',
            phonetic: 'wekwlentaye',
            meaning: 'and my whole body / all of myself',
            root: 'ኵሉ (kwlu - all/whole)',
            pos: 'Conj + Noun + Suffix',
            breakdown: 'ወ (and) + ኵለንታ (entirety/whole self) + -የ (my)',
            cognates: 'Amharic: ሁለንተናዬ (hulentenaye) • Tigrinya: ኩለንትናይ',
            note: 'Shows that Orthodox worship sanctifies both soul and physical body.'
        },
        'በትእምርተ': {
            geez: 'በትእምርተ',
            phonetic: 'bet\'imrte',
            meaning: 'with the sign of',
            root: 'አመረ (\'amere - to show/signify)',
            pos: 'Prep + Noun (Construct)',
            breakdown: 'በ (with/by) + ትእምርተ (the sign/symbol of)',
            cognates: 'Amharic: ትእምርት (tə\'əmrət - sign/miracle) • ተአምር (miracle)',
            note: 'Shares the same root as ተአምር (Te\'amr — Miracle), because the Cross is the supreme sign of Christ\'s victory.'
        },
        'መስቀል': {
            geez: 'መስቀል',
            phonetic: 'mesḳel',
            meaning: 'the Cross',
            root: 'ሰቀለ (seḳele - to crucify / hang up)',
            pos: 'Noun',
            breakdown: 'መ- (instrument/place) + ስቀል (crucifixion)',
            cognates: 'Amharic: መስቀል (mesqel) • Tigrinya: መስቀል (mesqel)',
            note: 'The wood of peace and weapon of victory over Satan.'
        },
        'ነአኵተከ': {
            geez: 'ነአኵተከ',
            phonetic: 'ne\'akwteke',
            meaning: 'We thank You',
            root: 'አኰተ (\'akwete - to give thanks)',
            pos: 'Verb (1st Pl.) + Obj Suffix',
            breakdown: 'ነ- (we) + አኵት (thank) + -ከ (You)',
            cognates: 'Related to አኰቴተ ቍርባን (Akotetä Qurban — Eucharist / Thanksgiving)',
            note: 'Opening word of the Daily Prayer of Thanksgiving offered at every liturgical service.'
        },
        'እግዚኦ': {
            geez: 'እግዚኦ',
            phonetic: '\'igzī\'o',
            meaning: 'O Lord',
            root: 'እግዚእ (\'igzī\' - Lord/Master)',
            pos: 'Noun (Vocative)',
            breakdown: 'እግዚእ (Lord) + -ኦ (O! vocative ending)',
            cognates: 'Amharic: እግዚኦ (əgzi\'o) • Tigrinya: እግዚኦ',
            note: 'In Ge\'ez, the suffix -ኦ (-o) is the vocative of direct prayerful address ("O Lord!").'
        },
        'ወንሴብሐከ': {
            geez: 'ወንሴብሐከ',
            phonetic: 'wensébḥake',
            meaning: 'and we glorify You',
            root: 'ሰብሐ (sebḥa - to praise/glorify)',
            pos: 'Conj + Verb + Obj Suffix',
            breakdown: 'ወ (and) + ንሴብሕ (we glorify) + -ከ (You)',
            cognates: 'Noun form: ስብሐት (Səbḥat — Glory) • Amharic: ምስጋና',
            note: 'From the root ሰ-ብ-ሐ, which gives us "ስብሐት ለአብ..." (Glory to the Father...).'
        },
        'ንባርከከ': {
            geez: 'ንባርከከ',
            phonetic: 'nbarkeke',
            meaning: 'We bless You',
            root: 'ባረከ (bareke - to bless)',
            pos: 'Verb (1st Pl.) + Obj Suffix',
            breakdown: 'ን- (we) + ባርክ (bless) + -ከ (You)',
            cognates: 'Amharic: ባረከ (bareke) / በረከት (bereket - blessing) • Hebrew: בָּרַךְ (barakh)',
            note: 'Used both when the faithful bless God\'s name and when the priest blesses the people (ቡራኬ).'
        },
        'ወንትአመነከ': {
            geez: 'ወንትአመነከ',
            phonetic: 'went\'ameneke',
            meaning: 'and we trust in You',
            root: 'አምነ (\'amne - to believe/trust)',
            pos: 'Conj + Verb + Obj Suffix',
            breakdown: 'ወ (and) + ንትአመን (we trust/confide) + -ከ (in You)',
            cognates: 'Amharic: እንታመንብሃለን • Noun: እምነት (faith)',
            note: 'Shares the same root as አሜን (Amen) and ሃይማኖት (Haymanot - Faith).'
        },
        'ንስእለከ': {
            geez: 'ንስእለከ',
            phonetic: 'ns\'ileke',
            meaning: 'We ask / beseech You',
            root: 'ሰአለ (se\'ale - to ask/pray)',
            pos: 'Verb (1st Pl.) + Obj Suffix',
            breakdown: 'ን- (we) + ስእል (ask/entreat) + -ከ (You)',
            cognates: 'Noun: ስእለት (sə\'let - vow/petition)',
            note: 'Expresses humble petition before God.'
        },
        'ወናስተበቍአከ': {
            geez: 'ወናስተበቍአከ',
            phonetic: 'wenastebeḳw\'ake',
            meaning: 'and we beg / supplicate You',
            root: 'በቍዐ (beḳw\'a - to avail/implore)',
            pos: 'Conj + Causative-Reflexive Verb + Suffix',
            breakdown: 'ወ (and) + ናስተበቍዕ (we earnestly implore) + -ከ (You)',
            cognates: 'Used throughout the Litanies (ተስፋ / ምሕላ) of the Qidase.',
            note: 'One of the most frequent liturgical verbs of earnest supplication in the Anaphora.'
        },
        'አቡነ': {
            geez: 'አቡነ',
            phonetic: '\'abune',
            meaning: 'Our Father',
            root: 'አብ (\'ab - Father)',
            pos: 'Noun + 1st Pl. Suffix',
            breakdown: 'አቡ- (Father) + -ነ (our)',
            cognates: 'Amharic: አባታችን (abbatachin) • Tigrinya: ኣቦና (abbona)',
            note: 'First word of the Lord\'s Prayer taught by Jesus Christ in Matthew 6:9, and title of bishops/monks.'
        },
        'ዘበሰማያት': {
            geez: 'ዘበሰማያት',
            phonetic: 'zebesemayat',
            meaning: 'Who art in the heavens',
            root: 'ሰማይ (semay - heaven)',
            pos: 'Rel + Prep + Noun (Plural)',
            breakdown: 'ዘ (Who) + በ (in) + ሰማያት (heavens, pl.)',
            cognates: 'Amharic: በሰማያት የምትኖር • Tigrinya: ኣብ ሰማያት እትነብር',
            note: 'Notice how Ge\'ez combines three English words ("Who [is] in heavens") into one rhythmic word!'
        },
        'ይትቀደስ': {
            geez: 'ይትቀደስ',
            phonetic: 'ytḳedes',
            meaning: 'hallowed be / may it be sanctified',
            root: 'ቀደሰ (ḳedese - to be holy)',
            pos: 'Verb (Jussive Passive)',
            breakdown: 'ይት- (let it be) + ቀደስ (sanctified)',
            cognates: 'Amharic: ይቀደስ (yəqqäddäs) • Tigrinya: ይቀደስ',
            note: 'Jussive form praying that God\'s holy name be glorified in our lives.'
        },
        'ስምከ': {
            geez: 'ስምከ',
            phonetic: 'smke',
            meaning: 'Your name',
            root: 'ስም (sm - name)',
            pos: 'Noun + 2nd Masc. Sg. Suffix',
            breakdown: 'ስም (name) + -ከ (Your)',
            cognates: 'Amharic: ስምህ (səməh) • Tigrinya: ስምካ (səmka)',
            note: 'Compare በስመ (in the name of), ስምየ (my name), and ስምከ (Your name).'
        },
        'ትምጻእ': {
            geez: 'ትምጻእ',
            phonetic: 'tmtsa\'i',
            meaning: 'may it come',
            root: 'መጽአ (mets\'a - to come)',
            pos: 'Verb (3rd Fem. Sg. Jussive)',
            breakdown: 'ት- (let her/it) + ምጻእ (come)',
            cognates: 'Amharic: ትምጣ (təmṭa) • Tigrinya: ትምጻእ (təmṣa\')',
            note: 'Feminine verb agreeing with መንግሥትከ (Your Kingdom).'
        },
        'መንግሥትከ': {
            geez: 'መንግሥትከ',
            phonetic: 'mengstke',
            meaning: 'Your Kingdom',
            root: 'ነግሠ (negse - to reign as king)',
            pos: 'Noun + 2nd Masc. Sg. Suffix',
            breakdown: 'መንግሥት (Kingdom) + -ከ (Your)',
            cognates: 'Amharic: መንግሥትህ (mengəstəh) • Related to ንጉሥ (Nəgus - King)',
            note: 'Derived from ነግሠ (to reign); prays for Christ\'s reign in our hearts and the world to come.'
        },
        'ወይኩን': {
            geez: 'ወይኩን',
            phonetic: 'weykun',
            meaning: 'and may it be done',
            root: 'ኮነ (kone - to be/become)',
            pos: 'Conj + Verb (Jussive)',
            breakdown: 'ወ (and) + ይኩን (let it be)',
            cognates: 'Amharic: ይሁን (yəhun) • Tigrinya: ይኹን (yəkhun)',
            note: 'From ኮነ (to be/become); echoed by theVirgin Mary at the Annunciation ("ይኩነኒ በከመ ትቤለኒ").'
        },
        'ፈቃድከ': {
            geez: 'ፈቃድከ',
            phonetic: 'feḳadke',
            meaning: 'Your will',
            root: 'ፈቀደ (feḳede - to will/desire)',
            pos: 'Noun + 2nd Masc. Sg. Suffix',
            breakdown: 'ፈቃድ (will/desire) + -ከ (Your)',
            cognates: 'Amharic: ፈቃድህ (fäqadəh) • Tigrinya: ፍቓድካ (fəqadka)',
            note: 'Aligns our human will with the loving will of the Father.'
        },
        'በከመ': {
            geez: 'በከመ',
            phonetic: 'bekeme',
            meaning: 'as / just as',
            root: 'ከመ (keme - like/as)',
            pos: 'Compound Preposition',
            breakdown: 'በ (in) + ከመ (the manner of / as)',
            cognates: 'Amharic: እንደ (ənde) • Tigrinya: ከምቲ (kemti)',
            note: 'Links heaven and earth in the Lord\'s Prayer.'
        },
        'በሰማይ': {
            geez: 'በሰማይ',
            phonetic: 'besemay',
            meaning: 'in heaven',
            root: 'ሰማይ (semay - heaven)',
            pos: 'Prep + Noun',
            breakdown: 'በ (in) + ሰማይ (heaven)',
            cognates: 'Amharic: በሰማይ (bäsemay) • Tigrinya: ኣብ ሰማይ',
            note: 'Where the angels unceasingly fulfill God\'s will.'
        },
        'ከማሁ': {
            geez: 'ከማሁ',
            phonetic: 'kemahu',
            meaning: 'so also / likewise',
            root: 'ከመ (keme - like)',
            pos: 'Adverb',
            breakdown: 'ከመ (like) + -ሁ (it/so)',
            cognates: 'Amharic: እንዲሁም (əndihum) • Tigrinya: ከምኡ\'ውን',
            note: 'Also chanted by the Deacon before the Misbak: "ሕዝብ ከማሁ" (The people repeat likewise).'
        },
        'በምድር': {
            geez: 'በምድር',
            phonetic: 'bemdr',
            meaning: 'on earth',
            root: 'ምድር (mdr - earth/land)',
            pos: 'Prep + Noun',
            breakdown: 'በ (on/in) + ምድር (earth)',
            cognates: 'Amharic: በምድር (bämədər) • Tigrinya: ኣብ ምድሪ',
            note: 'Pairs with ሰማይ (heaven) to encompass all creation ("ሰማይ ወምድር").'
        },
        'እግዚአብሔር': {
            geez: 'እግዚአብሔር',
            phonetic: '\'igzī\'abḥér',
            meaning: 'God / Lord of the Universe',
            root: 'እግዚእ (Lord) + ብሔር (world/land)',
            pos: 'Compound Divine Name',
            breakdown: 'እግዚአ (Lord of) + ብሔር (the universe/creation)',
            cognates: 'Amharic: እግዚአብሔር • Tigrinya: እግዚኣብሔር',
            note: 'Literally "Master/Lord of the Universe"—a uniquely rich Ethiopic theological name for God.'
        },
        'ኃያል': {
            geez: 'ኃያል',
            phonetic: 'hayal',
            meaning: 'Mighty',
            root: 'ኀይለ (hayle - to be strong)',
            pos: 'Adjective',
            breakdown: 'ኃያል (Mighty / All-Powerful)',
            cognates: 'Amharic: ኃያል (hayyal) / ኃይል (power) • Tigrinya: ኃያል',
            note: 'Second title in the Trisagion ("ቅዱስ እግዚአብሔር ቅዱስ ኃያል — Holy God, Holy Mighty").'
        },
        'ሕያው': {
            geez: 'ሕያው',
            phonetic: 'ḥyaw',
            meaning: 'Living / Immortal',
            root: 'ሐይወ (ḥaywe - to live)',
            pos: 'Adjective',
            breakdown: 'ሕያው (Ever-Living)',
            cognates: 'Amharic: ሕያው (ḥəyyaw) / ሕይወት (life) • Hebrew: חַי (chai)',
            note: 'Third title in the Trisagion ("ቅዱስ ሕያው ዘኢይመውት — Holy Living, Immortal").'
        },
        'ዘኢይመውት': {
            geez: 'ዘኢይመውት',
            phonetic: 'ze\'īymewt',
            meaning: 'Who does not die / Immortal',
            root: 'ሞተ (mote - to die)',
            pos: 'Rel + Neg + Verb',
            breakdown: 'ዘ (Who) + ኢ- (not) + ይመውት (dies)',
            cognates: 'Amharic: የማይሞት (yemaymot) • Tigrinya: ዘይመውት',
            note: 'In Ge\'ez, the prefix ኢ- (\'ī-) negates any verb ("ኢይመውት" = He does not die).'
        },
        'ተሣሃለነ': {
            geez: 'ተሣሃለነ',
            phonetic: 'tesahalene',
            meaning: 'have mercy upon us',
            root: 'ሣህል (sahl - mercy/clemency)',
            pos: 'Verb (Imperative) + 1st Pl. Suffix',
            breakdown: 'ተሣሃል (have mercy) + -ነ (upon us)',
            cognates: 'Amharic: ይቅር በለን (yəqər bälen)',
            note: 'Chanted by the congregation in the Trisagion and throughout the Divine Liturgy ("እግዚኦ ተሣሃለነ").'
        },
        'ተንሥኡ': {
            geez: 'ተንሥኡ',
            phonetic: 'tens\'u',
            meaning: 'Stand up / Rise',
            root: 'ተንሥአ (tens\'a - to rise/resurrect)',
            pos: 'Verb (2nd Masc. Pl. Imperative)',
            breakdown: 'ተንሥኡ (Stand up, you pl.!)',
            cognates: 'Amharic: ተነሡ (tänäsu) • Noun: ትንሣኤ (Tənsa\'é - Resurrection)',
            note: 'Deacon\'s command ("ተንሥኡ ለጸሎት" — Stand up for prayer), sharing the root of ትንሣኤ (Resurrection)!'
        },
        'ለጸሎት': {
            geez: 'ለጸሎት',
            phonetic: 'letselot',
            meaning: 'for prayer',
            root: 'ጸለየ (tseleye - to pray)',
            pos: 'Prep + Noun',
            breakdown: 'ለ (for/to) + ጸሎት (prayer)',
            cognates: 'Amharic: ለጸሎት (läṣälot) • Tigrinya: ንጸሎት',
            note: 'Calls the faithful to attentive posture in body and spirit.'
        },
        'ሰላም': {
            geez: 'ሰላም',
            phonetic: 'selam',
            meaning: 'Peace',
            root: 'ሰለመ (selme - to be at peace/whole)',
            pos: 'Noun',
            breakdown: 'ሰላም (Peace)',
            cognates: 'Amharic: ሰላም (sälam) • Hebrew: שָׁלוֹם (shalom) • Arabic: سلام (salām)',
            note: 'Whenever the Priest turns and blesses the people with the Cross, he proclaims "ሰላም ለኵልክሙ" (Peace be unto you all).'
        },
        'ለኵልክሙ': {
            geez: 'ለኵልክሙ',
            phonetic: 'lekwlkmu',
            meaning: 'be unto you all',
            root: 'ኵሉ (kwlu - all)',
            pos: 'Prep + Noun + 2nd Pl. Suffix',
            breakdown: 'ለ (unto) + ኵል- (all of) + -ክሙ (you, pl.)',
            cognates: 'Amharic: ለሁላችሁ (lähullachəhu) • Tigrinya: ንኹልኹም',
            note: 'The suffix -ክሙ (-kmu) always means "you (plural)".'
        },
        'ምስለ': {
            geez: 'ምስለ',
            phonetic: 'msle',
            meaning: 'And with',
            root: 'ምስለ (msle - with)',
            pos: 'Preposition',
            breakdown: 'ምስለ (with / together with)',
            cognates: 'Amharic: ከ... ጋር • Noun: ምሳሌ (likeness)',
            note: 'First word of the congregation\'s response to the priest: "ምስለ መንፈስከ" (And with your spirit).'
        },
        'መንፈስከ': {
            geez: 'መንፈስከ',
            phonetic: 'menfeske',
            meaning: 'your spirit',
            root: 'ነፍሰ (nefse - spirit/breath)',
            pos: 'Noun + 2nd Masc. Sg. Suffix',
            breakdown: 'መንፈስ (spirit) + -ከ (your)',
            cognates: 'Amharic: ከመንፈስህ ጋር • Tigrinya: ምስ መንፈስካ',
            note: 'Acknowledges the grace of the Holy Spirit dwelling in the ordained priest.'
        },
        'ስብሐት': {
            geez: 'ስብሐት',
            phonetic: 'sbḥat',
            meaning: 'Glory / Praise',
            root: 'ሰብሐ (sebḥa - to glorify)',
            pos: 'Noun',
            breakdown: 'ስብሐት (Glory)',
            cognates: 'Amharic: ምስጋና / ክብር • Related to ምስባክ (Misbak)',
            note: 'Chanted in the minor doxology: "ስብሐት ለአብ ወወልድ ወመንፈስ ቅዱስ" (Glory to the Father, Son, and Holy Spirit).'
        },
        'ማርያም': {
            geez: 'ማርያም',
            phonetic: 'maryam',
            meaning: 'Mary (Our Lady)',
            root: 'ማርያም (Maryam)',
            pos: 'Proper Noun',
            breakdown: 'ማርያም (Beloved / Exalted Lady)',
            cognates: 'Hebrew: מִרְיָם (Miryam) • Amharic/Tigrinya: ማርያም',
            note: 'Honored in the EOTC as ወላዲተ አምላክ (Weladite Amlak — Mother/Bearer of God, Theotokos).'
        },
        'ድንግል': {
            geez: 'ድንግል',
            phonetic: 'dngl',
            meaning: 'Virgin',
            root: 'ድንግል (dngl)',
            pos: 'Noun / Title',
            breakdown: 'ድንግል (Perpetual Virgin)',
            cognates: 'Amharic: ድንግል (dəngəl) • Tigrinya: ድንግል',
            note: 'St. Mary is confessed as ድንግል በክልኤ (Virgin in both body and mind/spirit).'
        },
        'ወላዲተ': {
            geez: 'ወላዲተ',
            phonetic: 'weladīte',
            meaning: 'Bearer / Mother of',
            root: 'ወለደ (welede - to give birth)',
            pos: 'Fem. Active Participle (Construct)',
            breakdown: 'ወላዲት (she who gave birth) + -ተ (construct: "Mother of...")',
            cognates: 'Amharic: ወላዲተ አምላክ (Mother of God) • Related to ወልድ (Son)',
            note: 'Direct Ge\'ez equivalent of the Council of Ephesus title Theotokos (ወላዲተ አምላክ — Bearer of God).'
        },
        'ካህን': {
            geez: 'ካህን',
            phonetic: 'kahn',
            meaning: 'Priest',
            root: 'ተከህነ (tekehne - to serve as priest)',
            pos: 'Noun',
            breakdown: 'ካህን (Liturgical Priest)',
            cognates: 'Amharic: ካህን • Hebrew: כֹּהֵן (kohen)',
            note: 'Indicates the celebrant priest in the rubrics of the Divine Liturgy.'
        },
        'ዲያቆን': {
            geez: 'ዲያቆን',
            phonetic: 'dīyaḳon',
            meaning: 'Deacon',
            root: 'Greek: διάκονος (diakonos)',
            pos: 'Noun (Loanword)',
            breakdown: 'ዲያቆን (Servant / Liturgical Herald)',
            cognates: 'Native Ge\'ez synonym: ላእክ (La\'ik - minister/messenger)',
            note: 'The deacon leads the assembly\'s prayers and bridges the altar (መቅደስ) and congregation (ሕዝብ).'
        },
        'ሕዝብ': {
            geez: 'ሕዝብ',
            phonetic: 'ḥzb',
            meaning: 'The People / Congregation',
            root: 'ሕዝብ (ḥzb)',
            pos: 'Collective Noun',
            breakdown: 'ሕዝብ (The Laity / Assembly)',
            cognates: 'Amharic: ሕዝብ (ḥəzb) • Tigrinya: ህዝቢ (həzbi)',
            note: 'In the EOTC liturgy, the congregation (ሕዝብ) is an active concelebrant chanting responses alongside the clergy.'
        }
    };

    // Curated Interlinear Passages (BibleHub-style word-by-word stacks)
    const INTERLINEAR_PASSAGES = [
        {
            id: 'trinitarian_invocation',
            title: 'Trinitarian Invocation | በስመ አብ',
            category: 'Daily Prayer & Liturgy Opening',
            geezFull: 'በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ አሜን',
            phoneticFull: 'besme \'ab weweld wemenfes ḳdus \'aḥadu \'amlak \'amén',
            englishFull: 'In the Name of the Father, and of the Son, and of the Holy Spirit, One God, Amen.',
            pedagogicalNote: 'This invocation opens every Orthodox prayer and liturgy. Notice how Ge\'ez attaches prepositions (በ- = "in") and conjunctions (ወ- = "and") directly to the front of words!',
            words: [
                { geez: 'በስመ', phonetic: 'be-sme', english: 'In the name of', grammar: 'Prep በ + Noun ስም' },
                { geez: 'አብ', phonetic: '\'ab', english: 'the Father', grammar: 'Noun (Masc. Sg.)' },
                { geez: 'ወወልድ', phonetic: 'we-weld', english: 'and the Son', grammar: 'Conj ወ + Noun ወልድ' },
                { geez: 'ወመንፈስ', phonetic: 'we-menfes', english: 'and the Spirit', grammar: 'Conj ወ + Noun መንፈስ' },
                { geez: 'ቅዱስ', phonetic: 'ḳdus', english: 'Holy', grammar: 'Adjective' },
                { geez: 'አሐዱ', phonetic: '\'aḥadu', english: 'One', grammar: 'Numeral' },
                { geez: 'አምላክ', phonetic: '\'amlak', english: 'God', grammar: 'Noun' },
                { geez: 'አሜን', phonetic: '\'amén', english: 'Amen', grammar: 'Affirmation' }
            ]
        },
        {
            id: 'sign_of_the_cross',
            title: 'Sign of the Cross | አአትብ ገጽየ',
            category: 'Daily Prayer',
            geezFull: 'አአትብ ገጽየ ወኵለንታየ በትእምርተ መስቀል',
            phoneticFull: 'a\'atb getsye wekwlentaye bet\'imrte mesḳel',
            englishFull: 'I seal my face and all of myself with the sign of the Cross.',
            pedagogicalNote: 'Notice the possessive suffix -የ (-ye = "my") at the end of ገጽየ (my face) and ወኵለንታየ (and all of myself).',
            words: [
                { geez: 'አአትብ', phonetic: 'a\'atb', english: 'I seal / sign', grammar: '1st Sg. Verb (ዐተበ)' },
                { geez: 'ገጽየ', phonetic: 'gets-ye', english: 'my face', grammar: 'Noun ገጽ + -የ (my)' },
                { geez: 'ወኵለንታየ', phonetic: 'we-kwlenta-ye', english: 'and my whole self', grammar: 'Conj ወ + Noun + -የ' },
                { geez: 'በትእምርተ', phonetic: 'be-t\'imrte', english: 'with the sign of', grammar: 'Prep በ + Construct Noun' },
                { geez: 'መስቀል', phonetic: 'mesḳel', english: 'the Cross', grammar: 'Noun (Root: ሰቀለ)' }
            ]
        },
        {
            id: 'thanksgiving_opening',
            title: 'Prayer of Thanksgiving | ነአኵተከ እግዚኦ',
            category: 'Daily Prayer & Kidan',
            geezFull: 'ነአኵተከ እግዚኦ ወንሴብሐከ ንባርከከ እግዚኦ ወንትአመነከ ንስእለከ እግዚኦ ወናስተበቍአከ',
            phoneticFull: 'ne\'akwteke \'igzī\'o wensébḥake nbarkeke \'igzī\'o went\'ameneke ns\'ileke \'igzī\'o wenastebeḳw\'ake',
            englishFull: 'We thank You, O Lord, and we glorify You; we bless You, O Lord, and we trust You; we ask You, O Lord, and we beg You.',
            pedagogicalNote: 'Every verb in this prayer begins with ነ-/ን- ("we") and ends with -ከ ("You"), creating a poetic rhythm of communal worship!',
            words: [
                { geez: 'ነአኵተከ', phonetic: 'ne-\'akwte-ke', english: 'We thank You', grammar: 'ነ- (we) + Verb + -ከ (You)' },
                { geez: 'እግዚኦ', phonetic: '\'igzī\'o', english: 'O Lord', grammar: 'Vocative Noun' },
                { geez: 'ወንሴብሐከ', phonetic: 'we-nsébḥa-ke', english: 'and we glorify You', grammar: 'ወ + ን- (we) + Verb + -ከ' },
                { geez: 'ንባርከከ', phonetic: 'n-barke-ke', english: 'We bless You', grammar: 'ን- (we) + Verb + -ከ (You)' },
                { geez: 'እግዚኦ', phonetic: '\'igzī\'o', english: 'O Lord', grammar: 'Vocative Noun' },
                { geez: 'ወንትአመነከ', phonetic: 'we-nt\'amene-ke', english: 'and we trust You', grammar: 'ወ + ንት- + Verb + -ከ' },
                { geez: 'ንስእለከ', phonetic: 'n-s\'ile-ke', english: 'We ask You', grammar: 'ን- (we) + Verb + -ከ (You)' },
                { geez: 'እግዚኦ', phonetic: '\'igzī\'o', english: 'O Lord', grammar: 'Vocative Noun' },
                { geez: 'ወናስተበቍአከ', phonetic: 'we-nastebeḳw\'a-ke', english: 'and we beg You', grammar: 'ወ + ናስተ- + Verb + -ከ' }
            ]
        },
        {
            id: 'lords_prayer_opening',
            title: 'The Lord\'s Prayer (Part 1) | አቡነ ዘበሰማያት',
            category: 'Daily Prayer & Liturgy',
            geezFull: 'አቡነ ዘበሰማያት ይትቀደስ ስምከ ትምጻእ መንግሥትከ ወይኩን ፈቃድከ በከመ በሰማይ ከማሁ በምድር',
            phoneticFull: '\'abune zebesemayat ytḳedes smke tmtsa\'i mengstke weykun feḳadke bekeme besemay kemahu bemdr',
            englishFull: 'Our Father Who art in heaven, hallowed be Your name; Your kingdom come; Your will be done on earth as it is in heaven.',
            pedagogicalNote: 'Notice the three parallel possessions ending in -ከ (-ke = "Your"): ስምከ (Your name), መንግሥትከ (Your kingdom), and ፈቃድከ (Your will).',
            words: [
                { geez: 'አቡነ', phonetic: '\'abu-ne', english: 'Our Father', grammar: 'Noun አብ + -ነ (our)' },
                { geez: 'ዘበሰማያት', phonetic: 'ze-be-semayat', english: 'Who art in heaven', grammar: 'ዘ (Who) + በ (in) + Pl. Noun' },
                { geez: 'ይትቀደስ', phonetic: 'yt-ḳedes', english: 'hallowed be', grammar: 'Jussive Passive Verb' },
                { geez: 'ስምከ', phonetic: 'sm-ke', english: 'Your name', grammar: 'Noun ስም + -ከ (Your)' },
                { geez: 'ትምጻእ', phonetic: 't-mtsa\'i', english: 'may it come', grammar: 'Jussive Verb (መጽአ)' },
                { geez: 'መንግሥትከ', phonetic: 'mengst-ke', english: 'Your kingdom', grammar: 'Noun + -ከ (Your)' },
                { geez: 'ወይኩን', phonetic: 'we-ykun', english: 'and let be done', grammar: 'Conj ወ + Jussive (ኮነ)' },
                { geez: 'ፈቃድከ', phonetic: 'feḳad-ke', english: 'Your will', grammar: 'Noun ፈቃድ + -ከ (Your)' },
                { geez: 'በከመ', phonetic: 'be-keme', english: 'as it is', grammar: 'Prep በ + ከመ (as)' },
                { geez: 'በሰማይ', phonetic: 'be-semay', english: 'in heaven', grammar: 'Prep በ + Noun ሰማይ' },
                { geez: 'ከማሁ', phonetic: 'kema-hu', english: 'so also', grammar: 'Adverb' },
                { geez: 'በምድር', phonetic: 'be-mdr', english: 'on earth', grammar: 'Prep በ + Noun ምድር' }
            ]
        },
        {
            id: 'trisagion_kidan',
            title: 'The Trisagion (Kidan) | ቅዱስ እግዚአብሔር',
            category: 'Prayer of the Covenant',
            geezFull: 'ቅዱስ እግዚአብሔር ቅዱስ ኃያል ቅዱስ ሕያው ዘኢይመውት ዘተወልደ እማርያም እምቅድስት ድንግል ተሣሃለነ እግዚኦ',
            phoneticFull: 'ḳdus \'igzī\'abḥér ḳdus hayal ḳdus ḥyaw ze\'īymewt zetewelde \'imaryam \'imḳdst dngl tesahalene \'igzī\'o',
            englishFull: 'Holy God, Holy Mighty, Holy Living, Immortal, Who was born from Mary the Holy Virgin, have mercy upon us, O Lord.',
            pedagogicalNote: 'Chanted during the Prayer of the Covenant (ኪዳን) and Daily Prayer. Learn how ዘ- ("Who") and እም- ("from") explain the Incarnation!',
            words: [
                { geez: 'ቅዱስ', phonetic: 'ḳdus', english: 'Holy', grammar: 'Adjective' },
                { geez: 'እግዚአብሔር', phonetic: '\'igzī\'abḥér', english: 'God', grammar: 'Compound Divine Name' },
                { geez: 'ቅዱስ', phonetic: 'ḳdus', english: 'Holy', grammar: 'Adjective' },
                { geez: 'ኃያል', phonetic: 'hayal', english: 'Mighty', grammar: 'Adjective (ኀይለ)' },
                { geez: 'ቅዱስ', phonetic: 'ḳdus', english: 'Holy', grammar: 'Adjective' },
                { geez: 'ሕያው', phonetic: 'ḥyaw', english: 'Living', grammar: 'Adjective (ሐይወ)' },
                { geez: 'ዘኢይመውት', phonetic: 'ze-\'ī-ymewt', english: 'Who dies not', grammar: 'ዘ (Who) + ኢ (not) + Verb' },
                { geez: 'ዘተወልደ', phonetic: 'ze-tewelde', english: 'Who was born', grammar: 'ዘ (Who) + Passive Verb' },
                { geez: 'እማርያም', phonetic: '\'i-maryam', english: 'from Mary', grammar: 'Prep እም (from) + ማርያም' },
                { geez: 'እምቅድስት', phonetic: '\'im-ḳdst', english: 'from the Holy', grammar: 'Prep እም + Fem. Adj' },
                { geez: 'ድንግል', phonetic: 'dngl', english: 'Virgin', grammar: 'Noun' },
                { geez: 'ተሣሃለነ', phonetic: 'tesahale-ne', english: 'have mercy on us', grammar: 'Imperative + -ነ (us)' },
                { geez: 'እግዚኦ', phonetic: '\'igzī\'o', english: 'O Lord', grammar: 'Vocative Noun' }
            ]
        },
        {
            id: 'qidase_core_dialogue',
            title: 'Qidase Opening Dialogue | ተንሥኡ ለጸሎት',
            category: 'Divine Liturgy (Kidasé)',
            geezFull: 'ተንሥኡ ለጸሎት እግዚኦ ተሣሃለነ ሰላም ለኵልክሙ ምስለ መንፈስከ',
            phoneticFull: 'tens\'u letselot \'igzī\'o tesahalene selam lekwlkmu msle menfeske',
            englishFull: 'Stand up for prayer. Lord have mercy upon us. Peace be unto you all. And with your spirit.',
            pedagogicalNote: 'This four-part exchange between Deacon, People, and Priest is repeated throughout the Divine Liturgy!',
            words: [
                { geez: 'ተንሥኡ', phonetic: 'tens\'u', english: 'Stand up (Deacon)', grammar: '2nd Pl. Imperative' },
                { geez: 'ለጸሎት', phonetic: 'le-tselot', english: 'for prayer', grammar: 'Prep ለ + Noun ጸሎት' },
                { geez: 'እግዚኦ', phonetic: '\'igzī\'o', english: 'O Lord (People)', grammar: 'Vocative Noun' },
                { geez: 'ተሣሃለነ', phonetic: 'tesahale-ne', english: 'have mercy on us', grammar: 'Imperative + -ነ (us)' },
                { geez: 'ሰላም', phonetic: 'selam', english: 'Peace (Priest)', grammar: 'Noun' },
                { geez: 'ለኵልክሙ', phonetic: 'le-kwl-kmu', english: 'unto you all', grammar: 'ለ + ኵል + -ክሙ (you pl.)' },
                { geez: 'ምስለ', phonetic: 'msle', english: 'And with (People)', grammar: 'Preposition' },
                { geez: 'መንፈስከ', phonetic: 'menfes-ke', english: 'your spirit', grammar: 'Noun + -ከ (your)' }
            ]
        }
    ];

    // ========================================================================
    // GAME 1: LITURGICAL PHRASE & VOCABULARY MATCHER PACKS
    // ========================================================================
    const MATCHER_PACKS = [
        {
            id: 'hitsanat_foundations',
            title: 'Sacred Words & Symbols',
            recommendedClass: 'hitsanat',
            description: 'Essential Ge\'ez words every young child hears in church.',
            pairs: [
                { id: 'm1', geez: 'አብ', phonetic: '\'ab', english: 'Father', note: 'God the Father, first Person of the Holy Trinity.' },
                { id: 'm2', geez: 'ወልድ', phonetic: 'weld', english: 'Son', note: 'Jesus Christ, the eternal Son of God.' },
                { id: 'm3', geez: 'መንፈስ ቅዱስ', phonetic: 'menfes ḳdus', english: 'Holy Spirit', note: 'The Comforter (Paraclete), third Person of the Holy Trinity.' },
                { id: 'm4', geez: 'መስቀል', phonetic: 'mesḳel', english: 'The Cross', note: 'We trace the Sign of the Cross to bless ourselves.' },
                { id: 'm5', geez: 'ማርያም', phonetic: 'maryam', english: 'St. Mary', note: 'Our Lady the Virgin Mary, Mother of God (ወላዲተ አምላክ).' },
                { id: 'm6', geez: 'ሰላም', phonetic: 'selam', english: 'Peace', note: 'The Priest blesses the church with the Cross saying "Peace be unto you all."' },
                { id: 'm7', geez: 'አሜን', phonetic: '\'amén', english: 'Truly / So be it', note: 'Our faithful affirmation at the end of prayers.' },
                { id: 'm8', geez: 'ሃሌ ሉያ', phonetic: 'halé luya', english: 'Praise the Lord', note: 'Chanted with joy before the Psalms and Gospel.' }
            ]
        },
        {
            id: 'arsema_responses',
            title: 'Congregation Responses (ሕዝብ)',
            recommendedClass: 'st_arsema',
            description: 'Master the key responses chanted by the assembly during the Divine Liturgy.',
            pairs: [
                { id: 'r1', geez: 'ተንሥኡ ለጸሎት', phonetic: 'tens\'u letselot', english: 'Stand up for prayer', note: 'Chanted by the Deacon calling the people to stand reverently.' },
                { id: 'r2', geez: 'እግዚኦ ተሣሃለነ', phonetic: '\'igzī\'o tesahalene', english: 'Lord have mercy upon us', note: 'The people\'s immediate response whenever the Deacon says "Stand up for prayer."' },
                { id: 'r3', geez: 'ሰላም ለኵልክሙ', phonetic: 'selam lekwlkmu', english: 'Peace be unto you all', note: 'Chanted by the Priest while making the sign of the Cross over the people.' },
                { id: 'r4', geez: 'ምስለ መንፈስከ', phonetic: 'msle menfeske', english: 'And with your spirit', note: 'The people\'s response to the Priest\'s greeting of peace.' },
                { id: 'r5', geez: 'አሐዱ አብ ቅዱስ', phonetic: '\'aḥadu \'ab ḳdus', english: 'One is the Holy Father', note: 'Opening of the great Trinitarian acclamation of the Qidase.' },
                { id: 'r6', geez: 'አሐዱ ወልድ ቅዱስ', phonetic: '\'aḥadu weld ḳdus', english: 'One is the Holy Son', note: 'Second part of the Trinitarian acclamation.' },
                { id: 'r7', geez: 'ስብሐት ለአብ', phonetic: 'sbḥat le\'ab', english: 'Glory to the Father', note: 'Chanted at the conclusion of Psalms and hymns.' },
                { id: 'r8', geez: 'ኪርያላይሶን', phonetic: 'kīryalayson', english: 'Lord have mercy (Greek)', note: 'Ancient liturgical cry for God\'s mercy.' }
            ]
        },
        {
            id: 'st_john_daily_prayer',
            title: 'Daily Prayer & The Lord\'s Prayer',
            recommendedClass: 'st_john',
            description: 'Ge\'ez verbs, nouns, and suffixes from Daily Prayer and the Lord\'s Prayer.',
            pairs: [
                { id: 'j1', geez: 'አአትብ ገጽየ', phonetic: 'a\'atb getsye', english: 'I seal my face', note: 'Opens Daily Prayer with the Sign of the Cross.' },
                { id: 'j2', geez: 'ነአኵተከ እግዚኦ', phonetic: 'ne\'akwteke \'igzī\'o', english: 'We thank You, O Lord', note: 'Opening of the Prayer of Thanksgiving.' },
                { id: 'j3', geez: 'አቡነ ዘበሰማያት', phonetic: '\'abune zebesemayat', english: 'Our Father Who art in heaven', note: 'Opening of the Lord\'s Prayer (Matthew 6:9).' },
                { id: 'j4', geez: 'ይትቀደስ ስምከ', phonetic: 'ytḳedes smke', english: 'Hallowed be Your name', note: 'First petition of the Lord\'s Prayer.' },
                { id: 'j5', geez: 'ትምጻእ መንግሥትከ', phonetic: 'tmtsa\'i mengstke', english: 'Your kingdom come', note: 'Second petition of the Lord\'s Prayer.' },
                { id: 'j6', geez: 'ወይኩን ፈቃድከ', phonetic: 'weykun feḳadke', english: 'And Your will be done', note: 'Third petition of the Lord\'s Prayer.' },
                { id: 'j7', geez: 'ወላዲተ አምላክ', phonetic: 'weladīte \'amlak', english: 'Mother / Bearer of God', note: 'Theological title of St. Mary (Theotokos).' },
                { id: 'j8', geez: 'ቅዱስ ሕያው ዘኢይመውት', phonetic: 'ḳdus ḥyaw ze\'īymewt', english: 'Holy Living, Immortal', note: 'From the Trisagion hymn in the Prayer of the Covenant.' }
            ]
        },
        {
            id: 'st_john_loanwords',
            title: 'Ancient Loanwords in Ge\'ez',
            recommendedClass: 'st_john',
            description: 'Greek, Hebrew, Syriac, and Aramaic words preserved in Ethiopian liturgy.',
            pairs: [
                { id: 'l1', geez: 'ወንጌል', phonetic: 'wengél (from Greek εὐαγγέλιον)', english: 'Good News / Gospel', note: 'Native Ge\'ez equivalent is ብሥራት (Bisrat).' },
                { id: 'l2', geez: 'ጳራቅሊጦስ', phonetic: 'paraḳlīṭos (from Greek Παράκλητος)', english: 'Comforter / Advocate', note: 'Native Ge\'ez equivalent is ናዛዚ (Nazazi).' },
                { id: 'l3', geez: 'ታቦት', phonetic: 'tabot (from Hebrew תֵּיבָה)', english: 'Ark of the Covenant', note: 'Consecrated altar chest in the Holy of Holies (መቅደስ).' },
                { id: 'l4', geez: 'ኦሪት', phonetic: '\'orīt (from Aramaic אוֹרָיְתָא)', english: 'The Torah / Law (Octateuch)', note: 'Native Ge\'ez equivalent is ሕግ (Higg).' },
                { id: 'l5', geez: 'ጵርስፎራ', phonetic: 'prsfora (from Greek προσφορά)', english: 'Eucharistic Offering', note: 'Chanted by the Deacon before the Anaphora; native Ge\'ez is ቍርባን.' },
                { id: 'l6', geez: 'አውሎግዮስ', phonetic: '\'awlogyos (from Greek εὐλόγιος)', english: 'Blessed', note: 'Spoken quietly by the Priest; native Ge\'ez is ቡሩክ (Buruk).' },
                { id: 'l7', geez: 'አማኑኤል', phonetic: '\'amanu\'él (from Hebrew עִמָּנוּאֵל)', english: 'God with us', note: 'In Ge\'ez: እግዚአብሔር ምስሌነ (Igzi\'abher misléne).' },
                { id: 'l8', geez: 'ቀሲስ', phonetic: 'ḳesīs (from Syriac ܩܫܝܫܐ)', english: 'Elder / Priest', note: 'Native Ge\'ez equivalent is ካህን (Kahn).' }
            ]
        }
    ];

    // ========================================================================
    // GAME 2: QIDASE SCRAMBLE (CHRONOLOGICAL LITURGICAL SEQUENCING)
    // ========================================================================
    const QIDASE_SCRAMBLE_PACKS = [
        {
            id: 'lectionary_progression',
            title: 'Order of the Scripture Readings (ሥርዓተ ምንባባት)',
            recommendedClass: 'st_john',
            description: 'Arrange the five Scripture readings of the Divine Liturgy in the exact order they are read and chanted.',
            pedagogicalSummary: 'The readings ascend step-by-step toward Christ Himself: we begin with St. Paul\'s letters to the churches, widen to the Universal Epistles and Acts of the Apostles, chant King David\'s prophetic Psalm (Misbak), and finally stand with lighted tapers as Christ speaks directly to us in the Holy Gospel!',
            steps: [
                {
                    order: 1,
                    title: 'Pauline Epistle',
                    ethiopic: 'መልእክተ ጳውሎስ',
                    phonetic: 'Mel\'ikte Pawlos',
                    why: 'Read first from the letters of St. Paul, teaching the theology of grace and building up the local church.'
                },
                {
                    order: 2,
                    title: 'Universal (Catholic) Epistle',
                    ethiopic: 'መልእክተ ካልእ',
                    phonetic: 'Mel\'ikte Kal\'i',
                    why: 'Read second from St. Peter, St. John, St. James, or St. Jude, addressing the universal Church.'
                },
                {
                    order: 3,
                    title: 'Acts of the Apostles',
                    ethiopic: 'ግብረ ሐዋርያት',
                    phonetic: 'Gibre Hawaryat',
                    why: 'Read third by the Assistant Priest, showing how the Apostles lived out the Gospel through the Holy Spirit.'
                },
                {
                    order: 4,
                    title: 'Liturgy Psalm Chant (Misbak)',
                    ethiopic: 'ምስባክ ዘቅዳሴ',
                    phonetic: 'Misbak ze-Qidase',
                    why: 'Chanted fourth by the Deacon and repeated by the people, bridging the Old Testament prophecies of David to the Gospel.'
                },
                {
                    order: 5,
                    title: 'The Holy Gospel',
                    ethiopic: 'ወንጌል ቅዱስ',
                    phonetic: 'Wengél Qiddus',
                    why: 'Proclaimed fifth as the climax of the Liturgy of the Word, where Christ Himself speaks to His flock.'
                }
            ]
        },
        {
            id: 'anaphora_dialogue',
            title: 'The Eucharistic Dialogue (አኰቴተ ቍርባን)',
            recommendedClass: 'st_john',
            description: 'Put the ancient Anaphora dialogue between the Priest and People into chronological order.',
            pedagogicalSummary: 'Preserved since the Apostolic era (Hippolytus / Anaphora of the Apostles), this dialogue prepares our hearts to ascend to heaven before singing the angelic "Holy, Holy, Holy" (Qiddus).',
            steps: [
                {
                    order: 1,
                    title: 'Priest: "The Lord be with you all" • People: "And with your spirit"',
                    ethiopic: 'እግዚአብሔር ምስለ ኵልክሙ ፨ ምስለ መንፈስከ',
                    phonetic: '\'Igzī\'abḥér msle kwlkmu / Msle menfeske',
                    why: 'The Priest invokes God\'s presence upon the whole assembly before beginning the Eucharistic offering.'
                },
                {
                    order: 2,
                    title: 'Priest: "Give thanks unto our God" • People: "It is right, it is just"',
                    ethiopic: 'አእኵትዎ ለአምላክነ ፨ ርቱዕ ይደሉ',
                    phonetic: '\'A\'ikwtwo le\'amlakne / Rtu\'i ydelu',
                    why: 'The Priest invites the congregation\'s consent to offer the Eucharist (Thanksgiving), and the people affirm it is right and worthy.'
                },
                {
                    order: 3,
                    title: 'Priest: "Lift up your hearts" • People: "We have lifted them up unto the Lord our God"',
                    ethiopic: 'አንሥኡ አልባቢክሙ ፨ ብነ ኀበ እግዚአብሔር አምላክነ',
                    phonetic: '\'Ans\'u \'albabīkmu / Bne habe \'igzī\'abḥér \'amlakne',
                    why: 'Calls us to lay aside all earthly distractions so our minds and hearts stand in the heavenly sanctuary.'
                },
                {
                    order: 4,
                    title: 'The Sanctus: "Holy, Holy, Holy, Lord God of Sabaoth"',
                    ethiopic: 'ቅዱስ ቅዱስ ቅዱስ እግዚአብሔር ጸባዖት',
                    phonetic: 'Ḳdus, ḳdus, ḳdus \'Igzī\'abḥér Tseba\'ot',
                    why: 'Having lifted our hearts to heaven, the earthly congregation joins the Seraphim and Cherubim in their eternal hymn.'
                },
                {
                    order: 5,
                    title: 'Words of Institution & Epiclesis (Consecration of the Bread & Cup)',
                    ethiopic: 'ዝንቱ ውእቱ ሥጋየ ... ወዝንቱ ጽዋዕ ደምየ',
                    phonetic: 'Zntu w\'itu sgaye ... wezntu tswa\'i demye',
                    why: 'The Priest commemorates Christ\'s Last Supper and prays for the Holy Spirit to descend upon the offering.'
                }
            ]
        },
        {
            id: 'major_liturgy_pillars',
            title: 'Five Pillars of the Divine Liturgy',
            recommendedClass: 'st_arsema',
            description: 'Order the five major stages of Sunday morning worship from start to finish.',
            pedagogicalSummary: 'Understanding the big picture of the Qidase helps us always know where we are in the service and what we are preparing for.',
            steps: [
                {
                    order: 1,
                    title: 'Prayer of the Covenant (Kidan)',
                    ethiopic: 'ጸሎተ ኪዳን',
                    phonetic: 'Tselote Kidan',
                    why: 'Chanted before the Liturgy begins, praising the Holy Trinity with "Holy God, Holy Mighty, Holy Living, Immortal."'
                },
                {
                    order: 2,
                    title: 'Preparation of the Altar & Vessels (Ser\'ate Qidase)',
                    ethiopic: 'ሥርዓተ ቅዳሴ (ዝግጅት)',
                    phonetic: 'Ser\'ate Qidase',
                    why: 'The clergy vest, bless the altar vessels, and process around the offering bread (ሕብስት) and chalice (ጽዋዕ).'
                },
                {
                    order: 3,
                    title: 'Liturgy of the Word (Epistles, Misbak & Gospel)',
                    ethiopic: 'ምንባባት ወወንጌል',
                    phonetic: 'Minbabat we-Wengél',
                    why: 'Our minds are illuminated by the Scriptures and the Nicene Creed before approaching the altar.'
                },
                {
                    order: 4,
                    title: 'The Anaphora (Eucharistic Prayer & Consecration)',
                    ethiopic: 'አኰቴተ ቍርባን (ፍሬ ቅዳሴ)',
                    phonetic: 'Akotetä Qurban',
                    why: 'The central prayer of thanksgiving where the bread and wine become the Body and Blood of Christ.'
                },
                {
                    order: 5,
                    title: 'Holy Communion & Dismissal Blessing (Buraké)',
                    ethiopic: 'ቅዱስ ቍርባን ወቡራኬ',
                    phonetic: 'Qiddus Qurban we-Buraké',
                    why: 'The prepared faithful receive Holy Communion, give thanks ("Pilot of the Soul"), and depart in peace.'
                }
            ]
        },
        {
            id: 'lords_prayer_sequence',
            title: 'The Lord\'s Prayer in Ge\'ez (አቡነ ዘበሰማያት)',
            recommendedClass: 'hitsanat',
            description: 'Place the phrases of the Lord\'s Prayer in their proper order.',
            pedagogicalSummary: 'Jesus taught His disciples the Lord\'s Prayer in Matthew 6:9–13. Every phrase in Ge\'ez directly mirrors the English prayer we know by heart!',
            steps: [
                {
                    order: 1,
                    title: 'Our Father Who art in heaven',
                    ethiopic: 'አቡነ ዘበሰማያት',
                    phonetic: '\'abune zebesemayat',
                    why: 'We begin by calling upon God as our loving Father in heaven.'
                },
                {
                    order: 2,
                    title: 'Hallowed be Your name',
                    ethiopic: 'ይትቀደስ ስምከ',
                    phonetic: 'ytḳedes smke',
                    why: 'We pray that God\'s holy name be honored in all the world.'
                },
                {
                    order: 3,
                    title: 'Your kingdom come',
                    ethiopic: 'ትምጻእ መንግሥትከ',
                    phonetic: 'tmtsa\'i mengstke',
                    why: 'We ask for God\'s reign of peace and righteousness.'
                },
                {
                    order: 4,
                    title: 'Your will be done on earth as it is in heaven',
                    ethiopic: 'ወይኩን ፈቃድከ በከመ በሰማይ ከማሁ በምድር',
                    phonetic: 'weykun feḳadke bekeme besemay kemahu bemdr',
                    why: 'We pray to obey God on earth just as the angels obey Him in heaven.'
                },
                {
                    order: 5,
                    title: 'Give us today our daily bread',
                    ethiopic: 'ሲሳየነ ዘለለ ዕለትነ ሀበነ ዮም',
                    phonetic: 'sīsayene zelele \'iletne habene yom',
                    why: 'We depend on God daily for both physical food and the Bread of Life.'
                }
            ]
        }
    ];

    // ========================================================================
    // GAME 3: PROCEDURAL JEOPARDY CATEGORIES & CLUE GENERATORS
    // ========================================================================
    const JEOPARDY_CATEGORIES_META = [
        { id: 'geez_vocab', title: 'Ge\'ez Roots & Words', ethiopic: 'ቃላተ ግእዝ', description: 'Sacred Ge\'ez words, prefixes, suffixes, and meanings.' },
        { id: 'qidase_responses', title: 'Deacon & People', ethiopic: 'ተዋሥኦ ቅዳሴ', description: 'Call-and-response chants between the Priest, Deacon, and Congregation.' },
        { id: 'daily_prayers', title: 'Daily Prayers', ethiopic: 'ዘዘወትር ጸሎት', description: 'Lines and meanings from Daily Prayer, Our Father, and the Creed.' },
        { id: 'liturgy_order', title: 'Order of the Qidase', ethiopic: 'ሥርዓተ ቅዳሴ', description: 'Why and when key moments happen in the Divine Liturgy.' },
        { id: 'loanwords', title: 'Ancient Loanwords', ethiopic: 'ጥንታውያን ቃላት', description: 'Greek, Hebrew, Aramaic, and Syriac words in Ge\'ez.' },
        { id: 'sacred_icons', title: 'Icons & Manuscripts', ethiopic: 'ቅዱሳት ሥዕላት', description: 'Ethiopian manuscript illuminations, saints, and biblical scenes.' },
        { id: 'psalms_athanasius', title: 'Psalms & Numerals', ethiopic: 'መዝሙራት ወኍልቍ', description: 'St. Athanasius\' Psalm guide and Ethiopic numerals (፩ ፪ ፫).' },
        { id: 'active_lectionary', title: 'Today\'s Selected Readings', ethiopic: 'ምንባባተ ዕለቱ', description: 'Dynamically generated from the Bible & Liturgy readings currently selected in the app!' }
    ];

    // Static + Template Clue Bank (supplemented dynamically at runtime by live app datasets)
    const CURATED_JEOPARDY_CLUES = {
        geez_vocab: [
            {
                id: 'gv_100_1', points: 100, minTier: 'hitsanat',
                prompt: 'In the opening prayer "በስመ አብ ወወልድ ወመንፈስ ቅዱስ", what do the Ge\'ez words "አብ" (\'ab) and "ወልድ" (weld) mean in English?',
                answer: 'Father and Son',
                options: ['Father and Son', 'Heaven and Earth', 'Light and Life', 'Mercy and Peace'],
                insight: 'አብ (\'ab) means Father, and ወልድ (weld, from ወለደ) means Son.'
            },
            {
                id: 'gv_100_2', points: 100, minTier: 'hitsanat',
                prompt: 'When we trace the Sign of the Cross, we pray "በትእምርተ መስቀል" (bet\'imrte mesḳel). What does "መስቀል" (mesḳel) mean?',
                answer: 'The Cross',
                options: ['The Cross', 'The Altar', 'The Gospel', 'The Crown'],
                insight: 'መስቀል (mesḳel) comes from the root ሰቀለ (to hang up / crucify) and means the Holy Cross.'
            },
            {
                id: 'gv_200_1', points: 200, minTier: 'hitsanat',
                prompt: 'What does the Ge\'ez title "ወላዲተ አምላክ" (Weladīte \'Amlak), given to the Virgin Mary, mean in English?',
                answer: 'Mother / Bearer of God (Theotokos)',
                options: ['Mother / Bearer of God (Theotokos)', 'Gate of Light', 'Covenant of Mercy', 'Ark of Zion'],
                insight: 'ወላዲተ (Bearer/Mother of) + አምላክ (God) translates the Greek title Theotokos.'
            },
            {
                id: 'gv_200_2', points: 200, minTier: 'st_arsema',
                prompt: 'In the Lord\'s Prayer, three words end with the suffix "-ከ" (-ke): ስምከ (smke), መንግሥትከ (mengstke), and ፈቃድከ (feḳadke). What does the suffix "-ከ" mean?',
                answer: 'Your (singular)',
                options: ['Your (singular)', 'Our', 'My', 'Their'],
                insight: 'In Ge\'ez, -ከ (-ke) means "Your" (ስምከ = Your name, መንግሥትከ = Your kingdom, ፈቃድከ = Your will).'
            },
            {
                id: 'gv_300_1', points: 300, minTier: 'st_arsema',
                prompt: 'In "አቡነ" (\'abune = Our Father) and "አምላክነ" (\'amlakne = Our God), what does the suffix "-ነ" (-ne) mean at the end of a Ge\'ez noun?',
                answer: 'Our / Us',
                options: ['Our / Us', 'My', 'His', 'In Heaven'],
                insight: 'Adding -ነ (-ne) to a noun means "our" (አቡነ = our Father) and on a verb means "us" (ተሣሃለነ = have mercy on us).'
            },
            {
                id: 'gv_400_1', points: 400, minTier: 'st_john',
                prompt: 'In the Trisagion ("ቅዱስ ሕያው ዘኢይመውት" / ḳdus ḥyaw ze\'īymewt), how does Ge\'ez express "Who does NOT die"? Identify the relative prefix and negative prefix in "ዘኢይመውት".',
                answer: 'ዘ- (ze- = Who) + ኢ- (\'ī- = not)',
                options: ['ዘ- (ze- = Who) + ኢ- (\'ī- = not)', 'ወ- (we- = and) + በ- (be- = in)', 'ለ- (le- = to) + እም- (\'im- = from)', 'ከመ- (keme- = as) + ሁ (-hu = his)'],
                insight: 'ዘ- means "Who/which" and ኢ- negates any Ge\'ez verb: ዘ + ኢ + ይመውት = "Who does not die (Immortal)."'
            },
            {
                id: 'gv_500_1', points: 500, minTier: 'st_john',
                prompt: 'Break down the compound divine name "እግዚአብሔር" (\'Igzī\'abḥér) into its two Ge\'ez roots and state its literal meaning.',
                answer: 'እግዚእ (Lord/Master) + ብሔር (Universe/Land) = "Lord of the Universe"',
                options: [
                    'እግዚእ (Lord/Master) + ብሔር (Universe/Land) = "Lord of the Universe"',
                    'አብ (Father) + ኄር (Good) = "Good Father"',
                    'ቅዱስ (Holy) + ኃያል (Mighty) = "All-Mighty Holy One"',
                    'ንጉሥ (King) + ሰማይ (Heaven) = "King of Heaven"'
                ],
                insight: 'እግዚአብሔር combines እግዚአ (construct state of እግዚእ, Lord of) and ብሔር (land/world/universe).'
            }
        ],
        qidase_responses: [
            {
                id: 'qr_100_1', points: 100, minTier: 'hitsanat',
                prompt: 'When the Deacon chants "ተንሥኡ ለጸሎት" (Stand up for prayer), what does the congregation (ሕዝብ) immediately chant back?',
                answer: 'እግዚኦ ተሣሃለነ (Lord have mercy upon us)',
                options: [
                    'እግዚኦ ተሣሃለነ (Lord have mercy upon us)',
                    'ምስለ መንፈስከ (And with your spirit)',
                    'ቅዱስ ቅዱስ ቅዱስ (Holy, Holy, Holy)',
                    'ርቱዕ ይደሉ (It is right, it is just)'
                ],
                insight: 'Whenever the Deacon calls us to stand for prayer, we first ask for God\'s mercy: "እግዚኦ ተሣሃለነ" (\'igzī\'o tesahalene).'
            },
            {
                id: 'qr_200_1', points: 200, minTier: 'hitsanat',
                prompt: 'When the Priest turns to bless the congregation and says "ሰላም ለኵልክሙ" (Peace be unto you all), what do the people respond?',
                answer: 'ምስለ መንፈስከ (And with your spirit)',
                options: [
                    'ምስለ መንፈስከ (And with your spirit)',
                    'እግዚኦ ተሣሃለነ (Lord have mercy upon us)',
                    'አሜን ሃሌ ሉያ (Amen Alleluia)',
                    'ብነ ኀበ እግዚአብሔር (We have lifted them up)'
                ],
                insight: '"ምስለ መንፈስከ" (msle menfeske) honors the Holy Spirit working through the priest\'s blessing.'
            },
            {
                id: 'qr_300_1', points: 300, minTier: 'st_arsema',
                prompt: 'Before the Anaphora begins, the Priest says "አንሥኡ አልባቢክሙ" (\'Ans\'u \'albabīkmu). What is he asking the congregation to do?',
                answer: 'Lift up your hearts',
                options: [
                    'Lift up your hearts',
                    'Bow your heads before the Lord',
                    'Open the gates of the church',
                    'Light the candles for the Gospel'
                ],
                insight: 'አልባብ (\'albab) is the plural of ልብ (heart/mind). We respond: "ብነ ኀበ እግዚአብሔር አምላክነ" (We have lifted them up unto the Lord our God).'
            },
            {
                id: 'qr_400_1', points: 400, minTier: 'st_john',
                prompt: 'Complete the great Trinitarian response of the Qidase: "አሐዱ አብ ቅዱስ፣ አሐዱ ወልድ ቅዱስ፣ _______________"',
                answer: 'አሐዱ ውእቱ መንፈስ ቅዱስ (One is the Holy Spirit)',
                options: [
                    'አሐዱ ውእቱ መንፈስ ቅዱስ (One is the Holy Spirit)',
                    'ስብሐት ለአብ ወወልድ (Glory to the Father and the Son)',
                    'ቅዱስ እግዚአብሔር ጸባዖት (Holy Lord God of Sabaoth)',
                    'ለዓለመ ዓለም አሜን (Unto the age of ages, Amen)'
                ],
                insight: 'The clergy and people proclaim the holiness and unity of each Person of the Trinity before the readings.'
            },
            {
                id: 'qr_500_1', points: 500, minTier: 'st_john',
                prompt: 'When the Priest chants "አእኵትዎ ለአምላክነ" (Give thanks unto our God), the people respond "ርቱዕ ይደሉ" (Rtu\'i ydelu). What does "ርቱዕ ይደሉ" mean?',
                answer: 'It is right, it is just (fitting/worthy)',
                options: [
                    'It is right, it is just (fitting/worthy)',
                    'According to Your mercy, O Lord',
                    'Remember us in Your Kingdom',
                    'We believe in One God'
                ],
                insight: 'ርቱዕ (right/orthogonal—the root of "Orthodox" in Ge\'ez: ርቱዐ ሃይማኖት!) + ይደሉ (it is worthy/just).'
            }
        ],
        daily_prayers: [
            {
                id: 'dp_100_1', points: 100, minTier: 'hitsanat',
                prompt: 'Which daily prayer begins with the words "አአትብ ገጽየ ወኵለንታየ በትእምርተ መስቀል"?',
                answer: 'The Sign of the Cross (Daily Prayer opening)',
                options: [
                    'The Sign of the Cross (Daily Prayer opening)',
                    'The Nicene Creed (ጸሎተ ሃይማኖት)',
                    'The Praise of Mary (ውዳሴ ማርያም)',
                    'Sunset Prayer (ጸሎተ ሠርክ)'
                ],
                insight: '"I seal my face and all of myself with the sign of the Cross."'
            },
            {
                id: 'dp_200_1', points: 200, minTier: 'st_arsema',
                prompt: 'In Daily Prayer, before whom do we renounce Satan ("እክሕደከ ፀርየ ሰይጣን") as our mother and witness?',
                answer: 'This Holy Church, whose witness is Mary of Zion (ማርያም ጽዮን)',
                options: [
                    'This Holy Church, whose witness is Mary of Zion (ማርያም ጽዮን)',
                    'The Four Evangelists Matthew, Mark, Luke, and John',
                    'King David and King Solomon',
                    'The Nine Saints of Ethiopia'
                ],
                insight: '"በቅድመ ዛቲ እምየ ቅድስት ቤተ ክርስቲያን እንተ ይእቲ ስምዕየ ማርያም ጽዮን" — In front of my mother, this holy Church, who is my witness, Mary of Zion.'
            },
            {
                id: 'dp_300_1', points: 300, minTier: 'st_arsema',
                prompt: 'Which 4th-century Syrian saint is traditionally credited with composing the 7-day "Praise of Mary" (ውዳሴ ማርያም / Weddase Maryam)?',
                answer: 'St. Ephrem the Syrian (ቅዱስ ኤፍሬም ሶርያዊ)',
                options: [
                    'St. Ephrem the Syrian (ቅዱስ ኤፍሬም ሶርያዊ)',
                    'St. Yared the Melodist (ቅዱስ ያሬድ)',
                    'St. Athanasius of Alexandria (ቅዱስ አትናቴዎስ)',
                    'Abba Giyorgis of Gascha (አባ ጊዮርጊስ ዘጋሥጫ)'
                ],
                insight: 'Known as the "Harp of the Holy Spirit," St. Ephrem composed the daily praises of the Theotokos.'
            },
            {
                id: 'dp_400_1', points: 400, minTier: 'st_john',
                prompt: 'In the Nicene Creed (ጸሎተ ሃይማኖት), how do we confess the Son\'s relationship to the Father in Ge\'ez: "ብርሃን ዘእምብርሃን፣ አምላክ ዘእምአምላክ ዘበአማን"?',
                answer: 'Light from Light, True God from True God',
                options: [
                    'Light from Light, True God from True God',
                    'Creator of heaven and earth, visible and invisible',
                    'Who for us men and for our salvation came down',
                    'And we look for the resurrection of the dead'
                ],
                insight: 'ብርሃን (Light) + ዘእምብርሃን (which is from Light), confessing that Christ is consubstantial with the Father.'
            },
            {
                id: 'dp_500_1', points: 500, minTier: 'st_john',
                prompt: 'In the Lord\'s Prayer, what does "ኢትአብአነ እግዚኦ ውስተ መንሱት" (\'īt\'ab\'ane \'igzī\'o wste mensut) ask of God?',
                answer: 'Lead us not, O Lord, into temptation',
                options: [
                    'Lead us not, O Lord, into temptation',
                    'Forgive us our trespasses and sins',
                    'Give us today our daily bread',
                    'Deliver us from the evil one'
                ],
                insight: 'መንሱት (mensut) means temptation/trial, and ኢትአብአነ means "do not let us enter."'
            }
        ],
        liturgy_order: [
            {
                id: 'lo_100_1', points: 100, minTier: 'hitsanat',
                prompt: 'During the Divine Liturgy, for which Scripture reading do all the people stand while holding lighted candles/tapers as Christ\'s own words are proclaimed?',
                answer: 'The Holy Gospel (ወንጌል ቅዱስ)',
                options: [
                    'The Holy Gospel (ወንጌል ቅዱስ)',
                    'The Pauline Epistle (መልእክተ ጳውሎስ)',
                    'The Universal Epistle (መልእክተ ካልእ)',
                    'The Acts of the Apostles (ግብረ ሐዋርያት)'
                ],
                insight: 'Candles are lit during the Gospel to show that Christ is the Light of the World.'
            },
            {
                id: 'lo_200_1', points: 200, minTier: 'st_arsema',
                prompt: 'How many New Testament Epistles + Acts readings precede the Misbak Psalm and Gospel in every EOTC Divine Liturgy?',
                answer: 'Three readings (Pauline Epistle, Universal Epistle, and Acts of the Apostles)',
                options: [
                    'Three readings (Pauline Epistle, Universal Epistle, and Acts of the Apostles)',
                    'One reading (only the Pauline Epistle)',
                    'Two readings (Old Testament and Epistle)',
                    'Five readings'
                ],
                insight: 'Every Qidase includes the Pauline Epistle, Universal Epistle, and Acts before the Misbak and Gospel.'
            },
            {
                id: 'lo_300_1', points: 300, minTier: 'st_arsema',
                prompt: 'What is the "Misbak" (ምስባክ) in the Divine Liturgy?',
                answer: 'A prophetic Psalm chant (2–3 verses) sung between Acts and the Holy Gospel',
                options: [
                    'A prophetic Psalm chant (2–3 verses) sung between Acts and the Holy Gospel',
                    'The closing blessing given by the Priest at dismissal',
                    'The Eucharistic bread prepared in the Bethlehem house',
                    'The curtain of the sanctuary'
                ],
                insight: 'The Deacon chants the Misbak line-by-line from the Psalms of David, and the congregation repeats each line.'
            },
            {
                id: 'lo_400_1', points: 400, minTier: 'st_john',
                prompt: 'Which Anaphora (ፍሬ ቅዳሴ) is the foundational first Eucharistic prayer in the EOTC Liturgy book (መጽሐፈ ቅዳሴ)?',
                answer: 'The Anaphora of the Apostles (ቅዳሴ ሐዋርያት)',
                options: [
                    'The Anaphora of the Apostles (ቅዳሴ ሐዋርያት)',
                    'The Anaphora of St. Cyril (ቅዳሴ ቄርሎስ)',
                    'The Anaphora of St. Gregory (ቅዳሴ ጎርጎርዮስ)',
                    'The Anaphora of St. James of Serugh (ቅዳሴ ያዕቆብ ዘሥሩግ)'
                ],
                insight: 'The EOTC preserves 14 official Anaphoras, beginning with the Anaphora of the Apostles (ዘሐዋርያት).'
            },
            {
                id: 'lo_500_1', points: 500, minTier: 'st_john',
                prompt: 'Who composed the Anaphora of Our Lady Mary (ቅዳሴ ማርያም — "አኰቴተ ቍርባን ዘእግዝእትነ ማርያም") through the Holy Spirit?',
                answer: 'Abba Heryacos (Cyriacus), Bishop of the Province of Behnesa',
                options: [
                    'Abba Heryacos (Cyriacus), Bishop of the Province of Behnesa',
                    'St. Dioscorus of Alexandria',
                    'St. John Chrysostom',
                    'St. Basil the Great'
                ],
                insight: 'The opening stanza of Qidase Maryam explicitly names "አባ ሕርያቆስ ኤጲስቆጶስ ዘሀገረ ብህንሳ" (Abba Heryacos, Bishop of Behnesa).'
            }
        ],
        loanwords: [
            {
                id: 'lw_100_1', points: 100, minTier: 'hitsanat',
                prompt: 'The word "ሃሌ ሉያ" (Halé Luya) comes into Ge\'ez from Hebrew. What does it mean in English?',
                answer: 'Praise the Lord (ስብሐት ለእግዚአብሔር)',
                options: [
                    'Praise the Lord (ስብሐት ለእግዚአብሔር)',
                    'Lord have mercy (እግዚኦ ተሣሃለነ)',
                    'Peace be with you (ሰላም ለኵልክሙ)',
                    'God is with us (እግዚአብሔር ምስሌነ)'
                ],
                insight: 'In native Ge\'ez, "ሃሌ ሉያ" is translated as "ስብሐት ለእግዚአብሔር" (Glory/Praise to the Lord).'
            },
            {
                id: 'lw_200_1', points: 200, minTier: 'st_arsema',
                prompt: 'From which ancient language does the liturgical chant "ኪርያላይሶን" (Kyrie eleison — Lord have mercy) originate?',
                answer: 'Greek (Κύριε ἐλέησον)',
                options: ['Greek (Κύριε ἐλέησον)', 'Latin', 'Syriac', 'Sabaean'],
                insight: 'ኪርያላይሶን comes from Greek Κύριε ἐλέησον, corresponding to Ge\'ez "እግዚኦ ተሣሃለነ".'
            },
            {
                id: 'lw_300_1', points: 300, minTier: 'st_arsema',
                prompt: 'The Ge\'ez word "ወንጌል" (Wengél) comes from the Greek "εὐαγγέλιον" (evangelion). What is its native Ge\'ez equivalent meaning "Good News"?',
                answer: 'ብሥራት (Bsrat — Good News / Annunciation)',
                options: ['ብሥራት (Bsrat — Good News / Annunciation)', 'ሕግ (Ḥgg — Law)', 'መባዕ (Meba\' — Offering)', 'ናዛዚ (Nazazī — Comforter)'],
                insight: 'ብሥራት (Bsrat) is the native Ge\'ez word for Good News / Gospel.'
            },
            {
                id: 'lw_400_1', points: 400, minTier: 'st_john',
                prompt: 'In the Divine Liturgy, the Holy Spirit is called "ጳራቅሊጦስ" (Paraḳlīṭos, from Greek Παράκλητος). What is the native Ge\'ez word for the Comforter/Consoler?',
                answer: 'ናዛዚ (Nazazī)',
                options: ['ናዛዚ (Nazazī)', 'መድኃኒት (Medhanīt)', 'ሊቀ ካህናት (Līḳe Kahnat)', 'ጸባዖት (Tseba\'ot)'],
                insight: 'In Ge\'ez, ናዛዚ (Nazazī, from ነዘዘ - to comfort/console) translates Paraclete.'
            },
            {
                id: 'lw_500_1', points: 500, minTier: 'st_john',
                prompt: 'During the quiet prayers of the Qidase, the Priest says "አውሎግዮስ ጌርዮስ" (\'Awlogyos Géryos). What do these two Greek loanwords mean in Ge\'ez and English?',
                answer: 'ቡሩክ እግዚእ — Blessed Lord (εὐλόγιος κύριος)',
                options: [
                    'ቡሩክ እግዚእ — Blessed Lord (εὐλόγιος κύριος)',
                    'ቅዱስ አምላክ — Holy God (ἅγιος θεός)',
                    'ንጉሠ ነገሥት — King of Kings',
                    'አኰቴተ ቍርባን — Lifting up of the Offering'
                ],
                insight: 'አውሎግዮስ = εὐλόγιος (ቡሩክ / Blessed) and ጌርዮስ = κύριος (እግዚእ / Lord).'
            }
        ],
        sacred_icons: [
            {
                id: 'si_100_1', points: 100, minTier: 'hitsanat',
                prompt: 'What do we call the intricate interwoven vine-and-lace border design ("ሐረግ" / Ḥārag) that frames sacred icons and pages in Ethiopian manuscripts?',
                answer: 'Hareg (ሐረግ — meaning "Vine")',
                options: ['Hareg (ሐረግ — meaning "Vine")', 'Kabba (ካባ)', 'Tsentsel (ጸናጽል)', 'Meqamia (መቋሚያ)'],
                insight: 'ሐረግ (Hareg) means "vine," reminding us of Christ\'s words in John 15:5: "I am the vine, you are the branches."'
            },
            {
                id: 'si_200_1', points: 200, minTier: 'st_arsema',
                prompt: 'In Ethiopian Orthodox iconography of the "Covenant of Mercy" (ኪዳነ ምሕረት / Kidane Mihret), what promise is Jesus Christ giving to His Mother St. Mary?',
                answer: 'That whoever calls upon her name, commemorates her, or builds a church in her name will receive mercy',
                options: [
                    'That whoever calls upon her name, commemorates her, or builds a church in her name will receive mercy',
                    'That the Ark of the Covenant will travel to Aksum',
                    'That St. Yared will compose the three modes of chant',
                    'That the Jordan River will part in two'
                ],
                insight: 'Celebrated on Yekatit 16, Kidane Mihret (Covenant of Mercy) is a central pillar of Ethiopian Orthodox devotion.'
            },
            {
                id: 'si_300_1', points: 300, minTier: 'st_arsema',
                prompt: 'In the icon "Covenant of Mercy with Psalm 44," which Old Testament King and Psalmist is depicted playing the harp (በገና) beside St. Mary, quoting "Listen, my daughter, and see..."?',
                answer: 'King David (ንጉሥ ዳዊት)',
                options: ['King David (ንጉሥ ዳዊት)', 'Prophet Moses (ነቢይ ሙሴ)', 'Prophet Elijah (ነቢይ ኤልያስ)', 'King Ezana'],
                insight: 'King David, ancestor of the Virgin Mary, prophesies of her in Psalm 44:10–11 LXX (45:10–11 KJV): "ስምዒ ወለትየ ወርእዪ ወአጽምዒ እዝነኪ."'
            },
            {
                id: 'si_400_1', points: 400, minTier: 'st_john',
                prompt: 'In the Ethiopian icon of the Holy Trinity ("ሥላሴ ዘአብ ወወልድ ወመንፈስ ቅዱስ"), how is the mystery of the Trinity\'s Three-ness and Unity summarized in Ge\'ez/Amharic theology?',
                answer: 'Three in Person, Body, and Name (በገጽ በአካል በስም); One in Essence, Existence, and Divinity (በባሕርይ በህልውና በመለኮት)',
                options: [
                    'Three in Person, Body, and Name (በገጽ በአካል በስም); One in Essence, Existence, and Divinity (በባሕርይ በህልውና በመለኮት)',
                    'One Person appearing in three different historical ages',
                    'Three separate gods sharing one temple',
                    'Created one after another in time'
                ],
                insight: 'From the Silus Kidus caption: "ሦስትነታቸው በገጽ በአካል በስም ነው፤ አንድነታቸው በባሕርይ በህልውና በመለኮት ነው።"'
            },
            {
                id: 'si_500_1', points: 500, minTier: 'st_john',
                prompt: 'In the 18th-century Gondarine manuscript icon of St. Ephrem on Thursday, what humble profession is the Syrian saint next to St. Ephrem practicing?',
                answer: 'A potter making clay vessels ("The Syrian Potter\'s Poems")',
                options: [
                    'A potter making clay vessels ("The Syrian Potter\'s Poems")',
                    'A fisherman mending nets on the Sea of Galilee',
                    'A blacksmith forging iron crosses',
                    'A shepherd tending sheep in Bethlehem'
                ],
                insight: 'From PEMM Story ID 14: St. Ephrem meets a humble Syrian potter who composes hymns to Our Lady while shaping clay!'
            }
        ],
        psalms_athanasius: [
            {
                id: 'pa_100_1', points: 100, minTier: 'hitsanat',
                prompt: 'What number do the Ethiopic numerals "፩", "፪", and "፫" represent?',
                answer: '1, 2, and 3',
                options: ['1, 2, and 3', '10, 20, and 30', '5, 6, and 7', '100, 200, and 300'],
                insight: '፩ = 1, ፪ = 2, ፫ = 3, ፬ = 4, ፭ = 5, ፮ = 6, ፯ = 7, ፰ = 8, ፱ = 9, ፲ = 10.'
            },
            {
                id: 'pa_200_1', points: 200, minTier: 'st_arsema',
                prompt: 'According to St. Athanasius\' Guide to the Psalms, which famous Psalm of repentance did King David pray when he repented before God ("Have mercy upon me, O God, according to Your lovingkindness")?',
                answer: 'Psalm 50 LXX (Psalm 51 KJV)',
                options: ['Psalm 50 LXX (Psalm 51 KJV)', 'Psalm 1', 'Psalm 150', 'Psalm 100'],
                insight: 'Psalm 50 (LXX/Ge\'ez) — "ተሣሃለኒ እግዚኦ በከመ ዓቢይ ምሕረትከ" — is prayed daily in Morning Prayer!'
            },
            {
                id: 'pa_300_1', points: 300, minTier: 'st_arsema',
                prompt: 'What number does the Ethiopic numeral "፻" represent, and how many Psalms are in the Psalter of David ("መዝሙረ ዳዊት")?',
                answer: '፻ = 100 (and ፻፶ = 150 Psalms, plus Psalm 151 in the Ge\'ez/LXX canon!)',
                options: [
                    '፻ = 100 (and ፻፶ = 150 Psalms, plus Psalm 151 in the Ge\'ez/LXX canon!)',
                    '፻ = 50 (and 75 Psalms)',
                    '፻ = 10 (and 66 Psalms)',
                    '፻ = 1,000'
                ],
                insight: 'In Ge\'ez numerals, ፲ = 10, ፶ = 50, and ፻ = 100. The Ge\'ez Psalter includes Psalm 151 ("አነ ንኡስ እምአኃውየ").'
            },
            {
                id: 'pa_400_1', points: 400, minTier: 'st_john',
                prompt: 'For most Psalms between Psalm 10 and Psalm 146, how does the Septuagint / Ge\'ez (LXX) chapter number compare to the Masoretic / English (KJV/NKJV) chapter number?',
                answer: 'The Ge\'ez / Septuagint (LXX) number is 1 less than the English (KJV/NKJV) number (e.g., Psalm 22 LXX = Psalm 23 KJV)',
                options: [
                    'The Ge\'ez / Septuagint (LXX) number is 1 less than the English (KJV/NKJV) number (e.g., Psalm 22 LXX = Psalm 23 KJV)',
                    'The Ge\'ez number is 10 higher than the English number',
                    'They are always identical in every chapter',
                    'The Ge\'ez Psalter is numbered in reverse order'
                ],
                insight: 'Because the Septuagint and Ge\'ez Bible combine Psalms 9 and 10 into a single Psalm, LXX numbering is 1 behind MT from Psalm 10 to 146!'
            },
            {
                id: 'pa_500_1', points: 500, minTier: 'st_john',
                prompt: 'In Psalm 118:164 LXX (119:164 KJV) — the verse on the footer of Mount of Mercy ("ስብዐ ለዕለትየ እሴብሐከ") — how many times a day does the Psalmist praise God, inspiring the 7 canonical hours of prayer?',
                answer: 'Seven times a day ("ስብዐ ለዕለትየ")',
                options: [
                    'Seven times a day ("ስብዐ ለዕለትየ")',
                    'Three times a week',
                    'Once every month',
                    'Twelve times a year'
                ],
                insight: '"ስብዐ ለዕለትየ እሴብሐከ" — "Seven times a day I praise You" (Psalm 118:164 LXX).'
            }
        ]
    };

    // Extended liturgical Ge'ez vocabulary covering Daily Prayer, Nicene Creed, Magnificat & Monday Praise of Mary
    const GEEZ_EXTENDED_GLOSSES = {
        // Liturgical roles & particles
        'ኵሎሙ': ['All (everyone)', 'ኵሉ (kwlu - all)', 'Pronoun (3rd Masc. Pl.)', 'ኵል (all) + -ሆሙ (them)'],
        'መሪሕ': ['Leader', 'መርሐ (merḥa - to lead/guide)', 'Noun', 'መሪሕ (Liturgical Leader)'],
        'አንባቢ': ['Reader', 'ነበበ (nebebe - to read/speak)', 'Noun (Active Participle)', 'አንባቢ (Lector / Reader)'],
        'ኦ': ['O! (vocative)', 'ኦ (\'o)', 'Vocative Particle', 'ኦ (O!)'],
        'እንዘ': ['while / as', 'እንዘ (\'inze)', 'Circumstantial Conjunction', 'እንዘ (while / being)'],
        'ወእንዘ': ['and while / and being', 'እንዘ (\'inze)', 'Conj + Particle', 'ወ (and) + እንዘ (while)'],
        'እስመ': ['for / because', 'እስመ (\'isme)', 'Causal Conjunction', 'እስመ (for / because)'],
        'ከመ': ['that / so that / like', 'ከመ (keme)', 'Conjunction / Preposition', 'ከመ (that / as)'],
        'ከመዝ': ['thus / like this', 'ከመ (keme)', 'Demonstrative Adverb', 'ከመ (as) + -ዝ (this)'],
        'በእንተ': ['for the sake of / concerning', 'እንተ (\'inte)', 'Compound Preposition', 'በ (in) + እንተ (account of)'],
        'ወበእንተ': ['and for the sake of / therefore', 'እንተ (\'inte)', 'Conj + Preposition', 'ወ (and) + በእንተ (for the sake of)'],
        'በእንቲአነ': ['for our sake / on our behalf', 'እንተ (\'inte)', 'Prep + 1st Pl. Suffix', 'በእንቲአ- (for the sake of) + -ነ (us)'],
        'በእንቲኣነ': ['for our sake / on our behalf', 'እንተ (\'inte)', 'Prep + 1st Pl. Suffix', 'በእንቲኣ- (for the sake of) + -ነ (us)'],
        'ዘበእንቲአነ': ['Who for our sake', 'እንተ (\'inte)', 'Rel + Prep + Suffix', 'ዘ (Who) + በእንቲአነ (for our sake)'],
        'ቅድመ': ['before / in front of', 'ቀደመ (ḳedeme - to precede)', 'Preposition', 'ቅድመ (in the presence of)'],
        'በቅድመ': ['in front of / before', 'ቀደመ (ḳedeme)', 'Compound Preposition', 'በ (in) + ቅድመ (front of)'],
        'እምቅድመ': ['before (in time)', 'ቀደመ (ḳedeme)', 'Compound Preposition', 'እም (from) + ቅድመ (before)'],
        'ውስተ': ['into / in', 'ውስተ (wste)', 'Preposition', 'ውስተ (into / within)'],
        'ኀበ': ['unto / toward / where', 'ኀበ (habe)', 'Preposition', 'ኀበ (unto / to)'],
        'በኀቤኪ': ['in you / with you (fem.)', 'ኀበ (habe)', 'Prep + 2nd Fem. Suffix', 'በ (in) + ኀቤ- (with) + -ኪ (you)'],
        'በህየ': ['there / in that place', 'ህየ (hye)', 'Adverb', 'በ (in) + ህየ (there)'],
        'ላዕለ': ['upon / above / over', 'ልዕለ (l\'ile - to be high)', 'Preposition', 'ላዕለ (above / over)'],
        'ላዕሌሃ': ['upon her', 'ልዕለ (l\'ile)', 'Prep + 3rd Fem. Suffix', 'ላዕሌ- (upon) + -ሃ (her)'],
        'ላዕሌነ': ['upon us / among us', 'ልዕለ (l\'ile)', 'Prep + 1st Pl. Suffix', 'ላዕሌ- (upon) + -ነ (us)'],
        'እስከ': ['until / unto / even to', 'እስከ (\'iske)', 'Preposition', 'እስከ (until / up to)'],
        'አመ': ['when / on the day of', 'አመ (\'ame)', 'Temporal Conjunction', 'አመ (when / at the time of)'],
        'ሶበ': ['when / whenever', 'ሶበ (sobe)', 'Temporal Conjunction', 'ሶበ (when)'],
        'አላ': ['but / rather', 'አላ (\'ala)', 'Adversative Conjunction', 'አላ (but rather)'],
        'አኮ': ['not / is not', 'አኮ (\'ako)', 'Negative Particle', 'አኮ (not)'],
        'ወአኮ': ['and not', 'አኮ (\'ako)', 'Conj + Negative Particle', 'ወ (and) + አኮ (not)'],
        'አልቦ': ['there is not / none', 'አልቦ (\'albo)', 'Negative Existential', 'አል- (not) + ቦ (in it)'],
        'ወአልቦ': ['and there is no', 'አልቦ (\'albo)', 'Conj + Negative Existential', 'ወ (and) + አልቦ (there is no)'],
        'ዘእንበለ': ['without / apart from', 'እንበለ (\'inbele)', 'Compound Preposition', 'ዘእንበለ (without)'],
        'ወዘእንበሌሁሰ': ['and without Him', 'እንበለ (\'inbele)', 'Conj + Prep + Suffix', 'ወ + ዘእንበሌሁ (without Him) + -ሰ (indeed)'],
        'ወኢምንትኒ': ['not even one thing / nothing', 'ምንት (mnt - what/thing)', 'Conj + Neg + Pronoun', 'ወኢ- (and not) + ምንትኒ (anything)'],

        // Pronouns & Demonstratives
        'አንተ': ['You (masc. sg.)', 'አንተ (\'ante)', 'Independent Pronoun', 'አንተ (You)'],
        'አንቲ': ['You (fem. sg.)', 'አንቲ (\'antī)', 'Independent Pronoun', 'አንቲ (You, fem.)'],
        'አንትሙሰ': ['as for you (pl.)', 'አንትሙ (\'antmu)', 'Pronoun + Enclitic', 'አንትሙ (you pl.) + -ሰ (as for)'],
        'ውእቱ': ['He / it is', 'ውእቱ (w\'itu)', 'Pronoun / Copula (3rd Masc. Sg.)', 'ውእቱ (He / is)'],
        'ይእቲ': ['she / it is', 'ይእቲ (y\'itī)', 'Pronoun / Copula (3rd Fem. Sg.)', 'ይእቲ (she / is)'],
        'ንሕነሰ': ['but we / as for us', 'ንሕነ (nḥne - we)', 'Pronoun + Enclitic', 'ንሕነ (we) + -ሰ (but/indeed)'],
        'ንሕነኒ': ['we also', 'ንሕነ (nḥne - we)', 'Pronoun + Enclitic', 'ንሕነ (we) + -ኒ (also)'],
        'ዛቲ': ['this (fem.)', 'ዛቲ (zatī)', 'Demonstrative Pronoun', 'ዛቲ (this, fem.)'],
        'ዝንቱ': ['this (masc.)', 'ዝንቱ (zntu)', 'Demonstrative Pronoun', 'ዝንቱ (this, masc.)'],
        'ዘንተ': ['this (accusative)', 'ዝንቱ (zntu)', 'Demonstrative (Acc.)', 'ዘንተ (this)'],
        'እنت': ['who / which (fem.)', 'እንተ (\'inte)', 'Relative Pronoun (Fem.)', 'እንተ (who / which)'],
        'እንተ': ['who / which (fem.)', 'እንተ (\'inte)', 'Relative Pronoun (Fem.)', 'እንተ (who / which)'],
        'እለ': ['who / those who (pl.)', 'እለ (\'ile)', 'Relative Pronoun (Pl.)', 'እለ (those who)'],
        'ወእለ': ['and those who', 'እለ (\'ile)', 'Conj + Relative Pronoun', 'ወ (and) + እለ (those who)'],
        'ለእለ': ['to those who', 'እለ (\'ile)', 'Prep + Relative Pronoun', 'ለ (to) + እለ (those who)'],
        'ለከ': ['to You / unto You', 'ለ (le)', 'Prep + 2nd Masc. Suffix', 'ለ (to) + -ከ (You)'],
        'ወለከ': ['and to You', 'ለ (le)', 'Conj + Prep + Suffix', 'ወ (and) + ለከ (to You)'],
        'ዘለከ': ['to Whom (unto You)', 'ለ (le)', 'Rel + Prep + Suffix', 'ዘ (Who) + ለከ (to You)'],
        'ለኪ': ['to you (fem.)', 'ለ (le)', 'Prep + 2nd Fem. Suffix', 'ለ (to) + -ኪ (you, fem.)'],
        'ብኪ': ['in you (fem.)', 'በ (be)', 'Prep + 2nd Fem. Suffix', 'ብ- (in) + -ኪ (you, fem.)'],
        'እምኔኪ': ['from you (fem.)', 'እም (\'im)', 'Prep + 2nd Fem. Suffix', 'እምኔ- (from) + -ኪ (you, fem.)'],
        'ለነ': ['to us / for us', 'ለ (le)', 'Prep + 1st Pl. Suffix', 'ለ (to/for) + -ነ (us)'],
        'ሊተ': ['for me / to me', 'ለ (le)', 'Prep + 1st Sg. Suffix', 'ሊ- (for) + -ተ (me)'],
        'ሎቱ': ['to Him / unto Him', 'ለ (le)', 'Prep + 3rd Masc. Suffix', 'ሎ- (to) + -ቱ (Him)'],
        'ቦቱ': ['in Him / by Him', 'በ (be)', 'Prep + 3rd Masc. Suffix', 'ቦ- (in) + -ቱ (Him)'],
        'ዘቦቱ': ['by Whom / in Whom', 'በ (be)', 'Rel + Prep + Suffix', 'ዘ (Who) + ቦቱ (by Him)'],
        'ምስሌኪ': ['with you (fem.)', 'ምስለ (msle)', 'Prep + 2nd Fem. Suffix', 'ምስሌ- (with) + -ኪ (you, fem.)'],
        'ምስሌሁ': ['with Him', 'ምስለ (msle)', 'Prep + 3rd Masc. Suffix', 'ምስሌ- (with) + -ሁ (Him)'],
        'ዚአከ': ['Yours', 'ዚአ- (zī\'a - of)', 'Possessive Pronoun', 'ዚአ- (belonging to) + -ከ (You)'],

        // Core Nouns & Adjectives in Daily Prayer & Doxologies
        'ዓለም': ['world / age / forever', 'ዓለም (\'alem)', 'Noun', 'ዓለም (world / eternity)'],
        'ዓለመ': ['the age of / the world', 'ዓለም (\'alem)', 'Noun (Construct / Acc.)', 'ዓለመ (age of / world)'],
        'ለዓለም': ['forever / unto the age', 'ዓለም (\'alem)', 'Prep + Noun', 'ለ (unto) + ዓለም (the age / forever)'],
        'ለዓለመ': ['unto the age of', 'ዓለም (\'alem)', 'Prep + Construct Noun', 'ለ (unto) + ዓለመ (the age of)'],
        'ወለዓለመ': ['and unto the age of', 'ዓለም (\'alem)', 'Conj + Prep + Construct Noun', 'ወ (and) + ለ (unto) + ዓለመ (the age of)'],
        'ቅድስት': ['Holy (fem.)', 'ቀደሰ (ḳedese - to be holy)', 'Adjective (Fem. Sg.)', 'ቅድስት (Holy)'],
        'በቅድስት': ['In the Holy', 'ቀደሰ (ḳedese)', 'Prep + Fem. Adjective', 'በ (in) + ቅድስት (Holy)'],
        'እምቅድስት': ['from the Holy', 'ቀደሰ (ḳedese)', 'Prep + Fem. Adjective', 'እም (from) + ቅድስት (Holy)'],
        'ቅዱሳት': ['Holy (plural)', 'ቀደሰ (ḳedese)', 'Adjective (Pl.)', 'ቅዱሳት (Holy, pl.)'],
        'ቅድሳተ': ['the holiness of', 'ቀደሰ (ḳedese)', 'Noun (Construct)', 'ቅድሳተ (holiness of)'],
        'ሥላሴ': ['Trinity', 'ሠለሰ (selese - to be three)', 'Proper Collective Noun', 'ሥላሴ (The Holy Trinity)'],
        'ሠለስቱ': ['Three', 'ሠለሰ (selese)', 'Numeral', 'ሠለስቱ (Three)'],
        'ይሤለሱ': ['They are three / distinguished as three', 'ሠለሰ (selese)', 'Verb (3rd Masc. Pl.)', 'ይሤለሱ (They are three)'],
        'ወይትዋሐዱ': ['and They are united as One', 'አሐደ (\'aḥade - to unite)', 'Conj + Reflexive Verb', 'ወ (and) + ይትዋሐዱ (are united)'],
        'አካላት': ['Persons / hypostases', 'አካል (\'akal - person/body)', 'Noun (Plural)', 'አካላት (Persons)'],
        'በአካላት': ['in Persons', 'አካል (\'akal)', 'Prep + Plural Noun', 'በ (in) + አካላት (Persons)'],
        'መለኮት': ['Godhead / Divinity', 'መለከ (meleke - to rule)', 'Noun', 'መለኮት (Divinity / Godhead)'],
        'በመለኮት': ['in the Godhead / Divinity', 'መለከ (meleke)', 'Prep + Noun', 'በ (in) + መለኮት (Divinity)'],
        'በመለኮቱ': ['in His Divinity', 'መለከ (meleke)', 'Prep + Noun + Suffix', 'በ (in) + መለኮቱ (His Divinity)'],
        'አአምን': ['I believe', 'አምነ (\'amne - to believe)', 'Verb (1st Sg. Imperfect)', 'አ- (I) + አምን (believe)'],
        'ነአምን': ['We believe', 'አምነ (\'amne - to believe)', 'Verb (1st Pl. Imperfect)', 'ነ- (we) + አምን (believe)'],
        'ወነአምን': ['And we believe', 'አምነ (\'amne)', 'Conj + Verb (1st Pl.)', 'ወ (and) + ነአምን (we believe)'],
        'አመነ': ['we believed', 'አምነ (\'amne)', 'Verb (1st Pl. Perfect)', 'አመነ (we believed)'],
        'ዘየአምን': ['whoever believes', 'አምነ (\'amne)', 'Rel + Verb (3rd Sg.)', 'ዘ (who) + የአምን (believes)'],
        'ወእትመሐፀን': ['and I take refuge', 'መሐፀነ (meḥatsene - to take refuge)', 'Conj + Verb (1st Sg.)', 'ወ (and) + እትመሐፀን (I take refuge)'],
        'ተማሐፀነ': ['we take refuge', 'መሐፀነ (meḥatsene)', 'Verb (1st Pl.)', 'ተማሐፀነ (we take refuge)'],
        'እክሕደከ': ['I renounce you', 'ክሕደ (kḥde - to deny/renounce)', 'Verb (1st Sg.) + Suffix', 'እክሕድ (I renounce) + -ከ (you)'],
        'ክሕዱ': ['they denied', 'ክሕደ (kḥde)', 'Verb (3rd Pl. Perfect)', 'ክሕዱ (they denied)'],
        'ፀር': ['enemy / adversary', 'ፀረረ (tserere - to oppose)', 'Noun', 'ፀር (enemy)'],
        'ፀርየ': ['my enemy', 'ፀረረ (tserere)', 'Noun + 1st Sg. Suffix', 'ፀር (enemy) + -የ (my)'],
        'ጸላዒ': ['the enemy / adversary', 'ጸልአ (tsel\'a - to hate)', 'Noun (Participle)', 'ጸላዒ (hater / enemy)'],
        'ለጸላዒ': ['of the enemy', 'ጸልአ (tsel\'a)', 'Prep + Noun', 'ለ (of/to) + ጸላዒ (the enemy)'],
        'ሰይጣን': ['Satan', 'ሰይጣን (seyṭan)', 'Proper Noun', 'ሰይጣን (Adversary / Satan)'],
        'እም': ['Mother', 'እም (\'im - mother)', 'Noun', 'እም (Mother)'],
        'እመ': ['Mother of', 'እም (\'im - mother)', 'Noun (Construct)', 'እመ (Mother of)'],
        'እምየ': ['my mother', 'እም (\'im - mother)', 'Noun + 1st Sg. Suffix', 'እም (mother) + -የ (my)'],
        'እምነ': ['our Mother', 'እም (\'im - mother)', 'Noun + 1st Pl. Suffix', 'እም (Mother) + -ነ (our)'],
        'እምኪ': ['your mother', 'እም (\'im - mother)', 'Noun + 2nd Fem. Suffix', 'እም (mother) + -ኪ (your)'],
        'ቤተ': ['House of (Church)', 'ቤት (bét - house)', 'Noun (Construct)', 'ቤተ (House of)'],
        'ክርስቲያን': ['Christian / Church (with ቤተ)', 'ክርስቶስ (Krstos)', 'Noun', 'ቤተ ክርስቲያን (Church)'],
        'ስምዕ': ['witness / testimony', 'ሰምዐ (sem\'a - to hear/witness)', 'Noun', 'ስምዕ (witness)'],
        'ስምዕየ': ['my witness', 'ሰምዐ (sem\'a)', 'Noun + 1st Sg. Suffix', 'ስምዕ (witness) + -የ (my)'],
        'ጽዮን': ['Zion', 'ጽዮን (Tsyon)', 'Proper Noun', 'ጽዮን (Mount Zion / Mary of Zion)'],

        // Thanksgiving & Adoration (Daily Stanza 2)
        'ንገኒ': ['We submit / humble ourselves', 'ገንየ (genye - to bow/submit)', 'Verb (1st Pl.)', 'ን- (we) + ገኒ (submit)'],
        'ወንትቀነይ': ['and we serve', 'ተቀንየ (teḳenye - to serve)', 'Conj + Verb (1st Pl.)', 'ወ (and) + ንትቀነይ (we serve)'],
        'ይትቀነይ': ['will serve / give service', 'ተቀንየ (teḳenye)', 'Verb (3rd Masc. Sg.)', 'ይትቀነይ (serves)'],
        'ንሰግድ': ['We bow / worship', 'ሰገደ (segede - to bow/worship)', 'Verb (1st Pl.)', 'ን- (we) + ሰግድ (bow/worship)'],
        'ንስግድ': ['We worship / let us bow', 'ሰገደ (segede)', 'Verb (1st Pl. Jussive)', 'ንስግድ (we worship)'],
        'እሰግድ': ['I bow / I worship', 'ሰገደ (segede)', 'Verb (1st Sg.)', 'እ- (I) + ሰግድ (bow/worship)'],
        'ይሰግድ': ['will bow / bows', 'ሰገደ (segede)', 'Verb (3rd Masc. Sg.)', 'ይሰግድ (bows)'],
        'ስግደተ': ['prostration / bow', 'ሰገደ (segede)', 'Noun (Acc.)', 'ስግደተ (prostration)'],
        'አሐተ': ['one (fem. acc.)', 'አሐዱ (\'aḥadu - one)', 'Numeral (Fem. Acc.)', 'አሐተ (one)'],
        'አሐቲ': ['one (fem.)', 'አሐዱ (\'aḥadu - one)', 'Numeral (Fem.)', 'አሐቲ (one, fem.)'],
        'በአሐቲ': ['in one (fem.)', 'አሐዱ (\'aḥadu)', 'Prep + Numeral', 'በ (in) + አሐቲ (one)'],
        'ኵሉ': ['all / every', 'ኵሉ (kwlu)', 'Quantifier', 'ኵሉ (all / every)'],
        'ኲሉ': ['all / every', 'ኵሉ (kwlu)', 'Quantifier', 'ኲሉ (all / every)'],
        'ኩሉ': ['all / every', 'ኵሉ (kwlu)', 'Quantifier', 'ኩሉ (all / every)'],
        'ወኵሉ': ['and all / and every', 'ኵሉ (kwlu)', 'Conj + Quantifier', 'ወ (and) + ኵሉ (all)'],
        'ወኵሎ': ['and all (acc.)', 'ኵሉ (kwlu)', 'Conj + Quantifier', 'ወ (and) + ኵሎ (all)'],
        'ለኩሉ': ['of all / for all', 'ኵሉ (kwlu)', 'Prep + Quantifier', 'ለ (of/for) + ኩሉ (all)'],
        'በኲሉ': ['in all / at all', 'ኵሉ (kwlu)', 'Prep + Quantifier', 'በ (in) + ኲሉ (all)'],
        'ወበኲሉ': ['and in every / and at all', 'ኵሉ (kwlu)', 'Conj + Prep + Quantifier', 'ወ + በ + ኲሉ (and in all)'],
        'እምኵሉ': ['from all', 'ኵሉ (kwlu)', 'Prep + Quantifier', 'እም (from) + ኵሉ (all)'],
        'ወለኵላ': ['and of all (fem.)', 'ኵሉ (kwlu)', 'Conj + Prep + Quantifier', 'ወ + ለ + ኵላ (and for all)'],
        'ብርክ': ['knee', 'ብርክ (brk - knee)', 'Noun', 'ብርክ (knee)'],
        'ልሳን': ['tongue / language', 'ልሳን (lsan - tongue)', 'Noun', 'ልሳን (tongue)'],
        'አምላከ': ['God of', 'መለከ (meleke)', 'Noun (Construct)', 'አምላከ (God of)'],
        'አማልከት': ['gods', 'መለከ (meleke)', 'Noun (Plural)', 'አማልከት (gods)'],
        'እግዚእ': ['Lord / Master', 'እግዚእ (\'igzī\')', 'Noun', 'እግዚእ (Lord)'],
        'እግዚእነ': ['our Lord', 'እግዚእ (\'igzī\')', 'Noun + 1st Pl. Suffix', 'እግዚእ (Lord) + -ነ (our)'],
        'ለእግዚእነ': ['of our Lord / to our Lord', 'እግዚእ (\'igzī\')', 'Prep + Noun + Suffix', 'ለ (of/to) + እግዚእነ (our Lord)'],
        'ወእግዚአ': ['and Lord of', 'እግዚእ (\'igzī\')', 'Conj + Construct Noun', 'ወ (and) + እግዚአ (Lord of)'],
        'አጋእዝት': ['lords / masters', 'እግዚእ (\'igzī\')', 'Noun (Plural)', 'አጋእዝት (lords)'],
        'ንጉሥ': ['King', 'ነግሠ (negse - to reign)', 'Noun', 'ንጉሥ (King)'],
        'ወንጉሠ': ['and King of', 'ነግሠ (negse)', 'Conj + Construct Noun', 'ወ (and) + ንጉሠ (King of)'],
        'ነገሥት': ['kings', 'ነግሠ (negse)', 'Noun (Plural)', 'ነገሥት (kings)'],
        'ሥጋ': ['flesh / body', 'ሥጋ (sga - flesh)', 'Noun', 'ሥጋ (flesh / body)'],
        'በሥጋ': ['in the flesh', 'ሥጋ (sga)', 'Prep + Noun', 'በ (in) + ሥጋ (the flesh)'],
        'ዘሥጋ': ['of flesh', 'ሥጋ (sga)', 'Rel + Noun', 'ዘ (of) + ሥጋ (flesh)'],
        'በሥጋኪ': ['in your flesh / body', 'ሥጋ (sga)', 'Prep + Noun + Suffix', 'በ (in) + ሥጋኪ (your body)'],
        'ሥጋሁ': ['His Flesh', 'ሥጋ (sga)', 'Noun + 3rd Masc. Suffix', 'ሥጋ (Flesh) + -ሁ (His)'],
        'ነፍስ': ['soul / spirit', 'ነፍሰ (nefse)', 'Noun', 'ነፍስ (soul)'],
        'ዘነፍስ': ['of soul / spirit', 'ነፍሰ (nefse)', 'Rel + Noun', 'ዘ (of) + ነፍስ (soul)'],
        'ነፍስየ': ['my soul', 'ነፍሰ (nefse)', 'Noun + 1st Sg. Suffix', 'ነፍስ (soul) + -የ (my)'],
        'ነፍስነ': ['our souls', 'ነፍሰ (nefse)', 'Noun + 1st Pl. Suffix', 'ነፍስ (soul) + -ነ (our)'],
        'ነፍስተ': ['souls of', 'ነፍሰ (nefse)', 'Noun (Construct Pl.)', 'ነፍስተ (souls of)'],
        'ወንጼውዓከ': ['And we call upon You', 'ጸውዐ (tsew\'a - to call)', 'Conj + Verb + Suffix', 'ወ (and) + ንጼውዕ (we call) + -ከ (You)'],
        'መሀረነ': ['He taught us', 'መሀረ (mehare - to teach)', 'Verb (3rd Sg.) + Suffix', 'መሀረ (taught) + -ነ (us)'],
        'ወልድ': ['Son', 'ወለደ (welede - to beget)', 'Noun', 'ወልድ (Son)'],
        'ለወልድ': ['to the Son', 'ወለደ (welede)', 'Prep + Noun', 'ለ (to) + ወልድ (the Son)'],
        'ወልደ': ['Son of', 'ወለደ (welede)', 'Noun (Construct)', 'ወልደ (Son of)'],
        'ወልዶ': ['His Son (acc.)', 'ወለደ (welede)', 'Noun + 3rd Masc. Suffix', 'ወልድ (Son) + -ኦ (His)'],
        'ወልድከ': ['Your Son', 'ወለደ (welede)', 'Noun + 2nd Masc. Suffix', 'ወልድ (Son) + -ከ (Your)'],
        'ወልድኪ': ['your Son (fem.)', 'ወለደ (welede)', 'Noun + 2nd Fem. Suffix', 'ወልድ (Son) + -ኪ (your)'],
        'ይብል': ['He says / saying', 'ብህለ (bhle - to say)', 'Verb (3rd Masc. Sg.)', 'ይብል (He says)'],
        'ወይብሉ': ['and they say', 'ብህለ (bhle)', 'Conj + Verb (3rd Pl.)', 'ወ (and) + ይብሉ (they say)'],
        'በሉ': ['say! (imperative pl.)', 'ብህለ (bhle)', 'Verb (2nd Pl. Imperative)', 'በሉ (say!)'],
        'ዘይቤሎሙ': ['as He spoke to them', 'ብህለ (bhle)', 'Rel + Verb + Suffix', 'ዘ (which) + ይቤሎሙ (He spoke to them)'],
        'ንብለኪ': ['we say to you (fem.)', 'ብህለ (bhle)', 'Verb (1st Pl.) + Suffix', 'ንብል (we say) + -ኪ (to you)'],
        'ትጼልዩ': ['you pray (pl.)', 'ጸለየ (tseleye - to pray)', 'Verb (2nd Masc. Pl.)', 'ትጼልዩ (you pray)'],

        // The Lord's Prayer (Daily Stanza 3)
        'ሲሳይ': ['sustenance / daily bread', 'ሰሰየ (seseye - to nourish)', 'Noun', 'ሲሳይ (daily bread / food)'],
        'ሲሳየነ': ['our daily bread / sustenance', 'ሰሰየ (seseye)', 'Noun + 1st Pl. Suffix', 'ሲሳይ (bread) + -ነ (our)'],
        'ዘለለ': ['of each / daily (with ዕለትነ)', 'ለለ (lele - each)', 'Rel + Distributive', 'ዘ (of) + ለለ (each)'],
        'ዕለት': ['day', 'ዕለት (\'ilet - day)', 'Noun', 'ዕለት (day)'],
        'ዕለትነ': ['our day (daily)', 'ዕለት (\'ilet)', 'Noun + 1st Pl. Suffix', 'ዕለት (day) + -ነ (our)'],
        'በዕለተ': ['on the day of', 'ዕለት (\'ilet)', 'Prep + Construct Noun', 'በ (on) + ዕለተ (day of)'],
        'ዕለታት': ['days', 'ዕለት (\'ilet)', 'Noun (Plural)', 'ዕለታት (days)'],
        'ሀበነ': ['give us', 'ወሀበ (wehabe - to give)', 'Verb (Imperative) + Suffix', 'ሀብ (give) + -ነ (us)'],
        'ነሀብ': ['let us give', 'ወሀበ (wehabe)', 'Verb (1st Pl. Jussive)', 'ነሀብ (let us give)'],
        'ተውህበ': ['was given', 'ወሀበ (wehabe)', 'Verb (3rd Sg. Passive)', 'ተውህበ (was given)'],
        'ወወሀብከነ': ['and You gave us', 'ወሀበ (wehabe)', 'Conj + Verb + Suffix', 'ወ + ወሀብከ (You gave) + -ነ (us)'],
        'ወለዘወሀበነ': ['And to Him who gave us', 'ወሀበ (wehabe)', 'Conj + Prep + Rel + Verb + Suffix', 'ወለዘ (and to Him who) + ወሀበነ (gave us)'],
        'ዮም': ['today / this day', 'ዮም (yom - today)', 'Adverb', 'ዮም (today)'],
        'ኅድግ': ['forgive', 'ኅደገ (hdege - to forgive/leave)', 'Verb (Imperative)', 'ኅድግ (forgive)'],
        'ንኅድግ': ['we forgive', 'ኅደገ (hdege)', 'Verb (1st Pl.)', 'ን- (we) + ኅድግ (forgive)'],
        'አበሳ': ['trespass / fault', 'አበሰ (\'abese - to trespass)', 'Noun', 'አበሳ (trespass)'],
        'አበሳነ': ['our trespasses / sins', 'አበሰ (\'abese)', 'Noun + 1st Pl. Suffix', 'አበሳ (trespasses) + -ነ (our)'],
        'ለዘአበሰ': ['those who trespass', 'አበሰ (\'abese)', 'Prep + Rel + Verb', 'ለዘ (to him who) + አበሰ (trespassed)'],
        'ወጌጋየነ': ['and our transgressions', 'ጌገየ (gégeye - to err)', 'Conj + Noun + Suffix', 'ወ (and) + ጌጋይ (error) + -ነ (our)'],
        'ኢታብአነ': ['lead us not', 'ቦአ (bo\'a - to enter)', 'Neg + Causative Verb + Suffix', 'ኢ- (not) + ታብእ (bring in) + -ነ (us)'],
        'መንሱት': ['temptation / trial', 'ነሰወ (nesewe - to test)', 'Noun', 'መንሱት (temptation)'],
        'አድኅነነ': ['deliver us / save us', 'ድኅነ (dhne - to be saved)', 'Causative Imperative + Suffix', 'አድኅን (save) + -ነ (us)'],
        'ወአድኀነነ': ['and He saved us', 'ድኅነ (dhne)', 'Conj + Verb + Suffix', 'ወ (and) + አድኀነ (He saved) + -ነ (us)'],
        'ወአድኃንከነ': ['and You saved us', 'ድኅነ (dhne)', 'Conj + Verb + Suffix', 'ወ + አድኃንከ (You saved) + -ነ (us)'],
        'አድኀንኮ': ['You saved him', 'ድኅነ (dhne)', 'Verb (2nd Sg.) + Obj Suffix', 'አድኀንከ (You saved) + -ኦ (him)'],
        'ድኅነ': ['we were saved / is saved', 'ድኅነ (dhne)', 'Verb (Perfect)', 'ድኅነ (saved)'],
        'ወባልሐነ': ['and rescue us', 'ባልሐ (balḥa - to rescue)', 'Conj + Imperative + Suffix', 'ወ (and) + ባልሕ (rescue) + -ነ (us)'],
        'እኩይ': ['evil / the evil one', 'አከየ (\'akeye - to be evil)', 'Noun / Adjective', 'እኩይ (evil)'],
        'መንግሥት': ['Kingdom', 'ነግሠ (negse - to reign)', 'Noun', 'መንግሥት (Kingdom)'],
        'ለመንግሥቱ': ['to His Kingdom / reign', 'ነግሠ (negse)', 'Prep + Noun + Suffix', 'ለ (to) + መንግሥቱ (His Kingdom)'],
        'ኀይል': ['power / strength', 'ኀይለ (hayle - to be strong)', 'Noun', 'ኀይል (power)'],
        'ኃይል': ['power / strength', 'ኀይለ (hayle)', 'Noun', 'ኃይል (power)'],
        'ኀይለ': ['strength / power (acc.)', 'ኀይለ (hayle)', 'Noun (Construct / Acc.)', 'ኀይለ (strength / power)'],
        'በኃይለ': ['by the power of', 'ኀይለ (hayle)', 'Prep + Construct Noun', 'በ (by) + ኃይለ (power of)'],
        'ኃይልነ': ['our power', 'ኀይለ (hayle)', 'Noun + 1st Pl. Suffix', 'ኃይል (power) + -ነ (our)'],
        'ወስብሐት': ['and the glory', 'ሰብሐ (sebḥa - to glorify)', 'Conj + Noun', 'ወ (and) + ስብሐት (glory)'],
        'ስብሐተ': ['glory (acc. / construct)', 'ሰብሐ (sebḥa)', 'Noun (Construct / Acc.)', 'ስብሐተ (glory of)'],
        'ስብሐቲከ': ['Your glory', 'ሰብሐ (sebḥa)', 'Noun + 2nd Masc. Suffix', 'ስብሐት (glory) + -ከ (Your)'],
        'ስብሐቲሁ': ['His glory', 'ሰብሐ (sebḥa)', 'Noun + 3rd Masc. Suffix', 'ስብሐት (glory) + -ሁ (His)'],

        // Hail Mary (Salutation of Gabriel - Daily Stanza 4)
        'በሰላመ': ['With the greeting / peace of', 'ሰለመ (selme)', 'Prep + Construct Noun', 'በ (with) + ሰላመ (peace/greeting of)'],
        'ገብርኤል': ['Gabriel', 'ገብርኤል (Gebr\'él)', 'Proper Noun', 'ገብርኤል (Man/Might of God)'],
        'መልአክ': ['Angel', 'ለአከ (le\'ake - to send)', 'Noun', 'መልአክ (Angel / Messenger)'],
        'መላእክት': ['angels', 'ለአከ (le\'ake)', 'Noun (Plural)', 'መላእክት (angels)'],
        'መላእክቲከ': ['Your angels', 'ለአከ (le\'ake)', 'Noun (Pl.) + Suffix', 'መላእክት (angels) + -ከ (Your)'],
        'እግዝእት': ['Lady / Mistress', 'እግዚእ (\'igzī\')', 'Noun (Fem.)', 'እግዝእት (Lady)'],
        'እግዝእትየ': ['my Lady', 'እግዚእ (\'igzī\')', 'Noun + 1st Sg. Suffix', 'እግዝእት (Lady) + -የ (my)'],
        'እግዝእትነ': ['our Lady', 'እግዚእ (\'igzī\')', 'Noun + 1st Pl. Suffix', 'እግዝእት (Lady) + -ነ (our)'],
        'ለእግዝእትነ': ['to our Lady', 'እግዚእ (\'igzī\')', 'Prep + Noun + Suffix', 'ለ (to) + እግዝእትነ (our Lady)'],
        'ኅሊና': ['thought / mind / conscience', 'ኀለየ (haleye - to think)', 'Noun', 'ኅሊና (thought / mind)'],
        'ሕሊና': ['thought / imagination', 'ኀለየ (haleye)', 'Noun', 'ሕሊና (thought / mind)'],
        'በኅሊናኪ': ['in your thought / mind', 'ኀለየ (haleye)', 'Prep + Noun + Suffix', 'በ (in) + ኅሊናኪ (your mind)'],
        'ጸባኦት': ['of Hosts / Sabaoth', 'ጸባኦት (Tseba\'ot)', 'Divine Title (Loanword)', 'ጸባኦት (Lord of Hosts / Armies)'],
        'ቡርክት': ['Blessed (fem.)', 'ባረከ (bareke - to bless)', 'Passive Participle (Fem.)', 'ቡርክት (Blessed, fem.)'],
        'ቡሩክ': ['Blessed (masc.)', 'ባረከ (bareke)', 'Passive Participle (Masc.)', 'ቡሩክ (Blessed, masc.)'],
        'ወቡሩክ': ['and blessed', 'ባረከ (bareke)', 'Conj + Participle', 'ወ (and) + ቡሩክ (blessed)'],
        'አንስት': ['women', 'አንስት (\'anst)', 'Collective Noun (Fem. Pl.)', 'አንስት (women)'],
        'እምአንስት': ['among women', 'አንስት (\'anst)', 'Prep + Noun', 'እም (from/among) + አንስት (women)'],
        'ፍሬ': ['fruit', 'ፈረየ (fereye - to bear fruit)', 'Noun', 'ፍሬ (fruit)'],
        'ከርሥ': ['womb', 'ከርሥ (kers - womb/belly)', 'Noun', 'ከርሥ (womb)'],
        'ከርሥኪ': ['your womb', 'ከርሥ (kers)', 'Noun + 2nd Fem. Suffix', 'ከርሥ (womb) + -ኪ (your)'],
        'ተፈሥሒ': ['Rejoice! (fem. sg.)', 'ተፈሥሐ (tefesḥa - to rejoice)', 'Verb (2nd Fem. Sg. Imperative)', 'ተፈሥሒ (Rejoice!)'],
        'ተፈሣሕ': ['Rejoice! (masc. sg.)', 'ተፈሥሐ (tefesḥa)', 'Verb (2nd Masc. Sg. Imperative)', 'ተፈሣሕ (Rejoice!)'],
        'ተፈሥሐ': ['rejoiced', 'ተፈሥሐ (tefesḥa)', 'Verb (3rd Masc. Sg. Perfect)', 'ተፈሥሐ (rejoiced)'],
        'ትትፌሣሕ': ['let her/it rejoice', 'ተፈሥሐ (tefesḥa)', 'Verb (3rd Fem. Sg. Jussive)', 'ትትፌሣሕ (rejoices)'],
        'ፍሥሕት': ['joyful one (fem.)', 'ተፈሥሐ (tefesḥa)', 'Adjective (Fem.)', 'ፍሥሕት (joyful one)'],
        'ምልእተ': ['filled with / full of (fem.)', 'መልአ (mel\'a - to fill)', 'Adjective (Fem. Construct)', 'ምልእተ (full of)'],
        'ምሉእ': ['full / filled', 'መልአ (mel\'a)', 'Passive Participle', 'ምሉእ (filled)'],
        'ጸጋ': ['grace', 'ጸገወ (tsegewe - to grant grace)', 'Noun', 'ጸጋ (grace / gift)'],
        'ሰአሊ': ['Ask / pray (fem. sg.)', 'ሰአለ (se\'ale - to ask)', 'Verb (2nd Fem. Sg. Imperative)', 'ሰአሊ (Pray / intercede!)'],
        'ወጸልዪ': ['and pray (fem. sg.)', 'ጸለየ (tseleye - to pray)', 'Conj + Imperative (Fem.)', 'ወ (and) + ጸልዪ (pray!)'],
        'ምሕረት': ['mercy', 'ምሕረ (mḥre - to have mercy)', 'Noun', 'ምሕረት (mercy / compassion)'],
        'ምሕረቱ': ['His mercy', 'ምሕረ (mḥre)', 'Noun + 3rd Masc. Suffix', 'ምሕረት (mercy) + -ሁ (His)'],
        'በምሕረቱ': ['with His mercy', 'ምሕረ (mḥre)', 'Prep + Noun + Suffix', 'በ (with) + ምሕረቱ (His mercy)'],
        'ፍቁር': ['beloved', 'አፍቀረ (\'afḳere - to love)', 'Adjective / Participle', 'ፍቁር (beloved)'],
        'ኢየሱስ': ['Jesus', 'ኢየሱስ (\'Īyesus)', 'Proper Noun', 'ኢየሱስ (Jesus — Savior)'],
        'ክርስቶስ': ['Christ (The Anointed One)', 'Greek Χριστός', 'Loanword (Greek)', 'Native Ge\'ez: መሲሕ (Mesīḥ)'],
        'ይሥረይ': ['may He forgive', 'ሠረየ (sereye - to forgive)', 'Verb (3rd Masc. Sg. Jussive)', 'ይሥረይ (may He forgive)'],
        'ኃጢአት': ['sin / sins', 'ኃጥአ (haṭ\'a - to sin)', 'Noun', 'ኃጢአት (sin)'],
        'ኃጢአተነ': ['our sins', 'ኃጥአ (haṭ\'a)', 'Noun + 1st Pl. Suffix', 'ኃጢአት (sins) + -ነ (our)'],
        'ኃጣውኢነ': ['our sins (plural)', 'ኃጥአ (haṭ\'a)', 'Noun (Pl.) + 1st Pl. Suffix', 'ኃጣውእ (sins) + -ነ (our)'],

        // Nicene Creed (Daily Stanza 5)
        'አኃዜ': ['Holder / Ruler of (Almighty)', 'አኀዘ (\'ahaze - to hold)', 'Active Participle (Construct)', 'አኃዜ ኵሉ (Almighty / Ruler of all)'],
        'ገባሬ': ['Maker / Creator of', 'ገብረ (gebre - to make)', 'Active Participle (Construct)', 'ገባሬ (Creator of)'],
        'ሰማያት': ['heavens', 'ሰማይ (semay)', 'Noun (Plural)', 'ሰማያት (heavens)'],
        'በሰማያት': ['in the heavens', 'ሰማይ (semay)', 'Prep + Plural Noun', 'በ (in) + ሰማያት (the heavens)'],
        'እምሰማያት': ['from the heavens', 'ሰማይ (semay)', 'Prep + Plural Noun', 'እም (from) + ሰማያት (the heavens)'],
        'ዘበሰማይኒ': ['whether in heaven', 'ሰማይ (semay)', 'Rel + Prep + Noun + Particle', 'ዘበሰማይኒ (that is in heaven)'],
        'ምድር': ['earth', 'ምድር (mdr)', 'Noun', 'ምድር (earth)'],
        'ምድረ': ['the earth (acc.)', 'ምድር (mdr)', 'Noun (Acc.)', 'ምድረ (the earth)'],
        'ወምድር': ['and earth', 'ምድር (mdr)', 'Conj + Noun', 'ወ (and) + ምድር (earth)'],
        'እምድር': ['from the earth', 'ምድር (mdr)', 'Prep + Noun', 'እም (from) + ምድር (earth)'],
        'ወዘበምድርኒ': ['or on earth', 'ምድር (mdr)', 'Conj + Rel + Prep + Noun', 'ወዘበምድርኒ (and that is on earth)'],
        'ዘያስተርኢ': ['what is visible', 'ርእየ (r\'iye - to see)', 'Rel + Verb', 'ዘ (that which) + ያስተርኢ (is seen)'],
        'ወዘኢያስተርኢ': ['and what is invisible', 'ርእየ (r\'iye)', 'Conj + Rel + Neg + Verb', 'ወዘኢ- (and what is not) + ያስተርኢ (seen)'],
        'ዋሕድ': ['Only-Begotten / Unique', 'አሐደ (\'aḥade)', 'Adjective', 'ዋሕድ (Only-Begotten)'],
        'ዋህድ': ['Only-Begotten / Unique', 'አሐደ (\'aḥade)', 'Adjective', 'ዋህድ (Only-Begotten)'],
        'ዋህደ': ['Only-Begotten (acc.)', 'አሐደ (\'aḥade)', 'Adjective (Acc.)', 'ዋህደ (Only-Begotten)'],
        'ዘህልው': ['Who was existing / present', 'ሀለወ (halewe - to be/exist)', 'Rel + Verbal Adj', 'ዘ (Who) + ህልው (existing)'],
        'ይትፈጠር': ['was created', 'ፈጠረ (feṭere - to create)', 'Verb (Passive Imperfect)', 'ይትፈጠር (is/was created)'],
        'ፍጥረት': ['creation / creature', 'ፈጠረ (feṭere)', 'Noun', 'ፍጥረት (creation)'],
        'ብርሃን': ['Light', 'በርሀ (berha - to shine)', 'Noun', 'ብርሃን (Light)'],
        'ዘእምብርሃን': ['from Light', 'በርሀ (berha)', 'Rel + Prep + Noun', 'ዘእም (which is from) + ብርሃን (Light)'],
        'ዘእምአምላክ': ['from God', 'መለከ (meleke)', 'Rel + Prep + Noun', 'ዘእም (Who is from) + አምላክ (God)'],
        'ዘበአማን': ['True / in truth', 'አምነ (\'amne)', 'Rel + Prep + Noun', 'ዘበአማን (Who is in truth / True)'],
        'ተወልደ': ['was born / begotten', 'ወለደ (welede - to beget)', 'Verb (3rd Masc. Sg. Passive)', 'ተወልደ (was born)'],
        'ዘተወልደ': ['Who was begotten / born', 'ወለደ (welede)', 'Rel + Passive Verb', 'ዘ (Who) + ተወልደ (was born)'],
        'ዘተገብረ': ['made / created', 'ገብረ (gebre - to make)', 'Rel + Passive Verb', 'ዘ (who) + ተገብረ (was made)'],
        'ዘዕሩይ': ['Who is equal / co-equal', 'ዐረየ (\'areye - to be equal)', 'Rel + Adjective', 'ዘ (Who is) + ዕሩይ (co-equal / consubstantial)'],
        'ኮነ': ['became / was made', 'ኮነ (kone - to be/become)', 'Verb (3rd Masc. Sg. Perfect)', 'ኮነ (became / was)'],
        'ዘኮነ': ['what was made / Who became', 'ኮነ (kone)', 'Rel + Verb', 'ዘ (which) + ኮነ (was made)'],
        'ሰብእ': ['man / mankind / humanity', 'ሰብእ (seb\'i)', 'Collective Noun', 'ሰብእ (man / humanity)'],
        'ለሰብእ': ['for man / for mankind', 'ሰብእ (seb\'i)', 'Prep + Noun', 'ለ (for) + ሰብእ (mankind)'],
        'ተሰብአ': ['became man', 'ሰብእ (seb\'i)', 'Verb (3rd Masc. Sg.)', 'ተሰብአ (became man)'],
        'ዘተሰብአ': ['Who became man', 'ሰብእ (seb\'i)', 'Rel + Verb', 'ዘ (Who) + ተሰብአ (became man)'],
        'መድኃኒት': ['salvation', 'ድኅነ (dhne - to be saved)', 'Noun', 'መድኃኒት (salvation)'],
        'መድኃኒተ': ['salvation of', 'ድኅነ (dhne)', 'Noun (Construct)', 'መድኃኒተ (salvation of)'],
        'መድኃኒትነ': ['our salvation', 'ድኅነ (dhne)', 'Noun + 1st Pl. Suffix', 'መድኃኒት (salvation) + -ነ (our)'],
        'መድኀኒ': ['Savior', 'ድኅነ (dhne)', 'Noun (Active Participle)', 'መድኀኒ (Savior)'],
        'መድኃኒነ': ['our Savior', 'ድኅነ (dhne)', 'Noun + 1st Pl. Suffix', 'መድኃኒ (Savior) + -ነ (our)'],
        'ወመድኀኒየ': ['and my Savior', 'ድኅነ (dhne)', 'Conj + Noun + Suffix', 'ወ (and) + መድኀኒየ (my Savior)'],
        'ወረደ': ['came down / descended', 'ወረደ (werede - to descend)', 'Verb (3rd Masc. Sg. Perfect)', 'ወረደ (descended)'],
        'ወተሠገወ': ['and was incarnate', 'ተሠገወ (tesegewe - to take flesh)', 'Conj + Verb', 'ወ (and) + ተሠገወ (was incarnate)'],
        'እመንፈስ': ['from the Spirit', 'ነፍሰ (nefse)', 'Prep + Noun', 'እም (from) + መንፈስ (Spirit)'],
        'ወእማርያም': ['and from Mary', 'ማርያም (Maryam)', 'Conj + Prep + Noun', 'ወ + እም (from) + ማርያም (Mary)'],
        'ብእሲ': ['man / person', 'ብእሲ (b\'isī - man)', 'Noun', 'ብእሲ (man)'],
        'ብእሴ': ['a man (acc.)', 'ብእሲ (b\'isī)', 'Noun (Acc.)', 'ብእሴ (man)'],
        'ወተሰቅለ': ['and was crucified', 'ሰቀለ (seḳele - to crucify)', 'Conj + Passive Verb', 'ወ (and) + ተሰቅለ (was crucified)'],
        'በመዋዕለ': ['in the days of', 'ውዕለ (w\'ile - day)', 'Prep + Construct Pl. Noun', 'በ (in) + መዋዕለ (days of)'],
        'ጲላጦስ': ['Pilate', 'ጲላጦስ (P̣īlaṭos)', 'Proper Noun', 'ጲላጦስ (Pontius Pilate)'],
        'ጰንጤናዊ': ['Pontius', 'ጰንጤናዊ (P̣enṭénawī)', 'Proper Adjective', 'ጰንጤናዊ (Pontius)'],
        'ሐመ': ['suffered', 'ሐመ (ḥame - to suffer)', 'Verb (3rd Masc. Sg. Perfect)', 'ሐመ (He suffered)'],
        'ወሞተ': ['and died', 'ሞተ (mote - to die)', 'Conj + Verb', 'ወ (and) + ሞተ (He died)'],
        'ሞት': ['death', 'ሞተ (mote)', 'Noun', 'ሞት (death)'],
        'ወተቀብረ': ['and was buried', 'ቀበረ (ḳebere - to bury)', 'Conj + Passive Verb', 'ወ (and) + ተቀብረ (was buried)'],
        'ወተንሥአ': ['and rose again', 'ተንሥአ (tens\'a - to rise)', 'Conj + Verb', 'ወ (and) + ተንሥአ (He rose)'],
        'እሙታን': ['from the dead', 'ሞተ (mote)', 'Prep + Plural Noun', 'እም (from) + ሙታን (the dead)'],
        'ሙታን': ['the dead', 'ሞተ (mote)', 'Noun (Plural)', 'ሙታን (the dead)'],
        'ወሙታነ': ['and the dead (acc.)', 'ሞተ (mote)', 'Conj + Noun (Acc.)', 'ወ (and) + ሙታነ (the dead)'],
        'ሣልስት': ['third (fem.)', 'ሠለሰ (selese - three)', 'Ordinal Numeral', 'ሣልስት (third)'],
        'ጽሑፍ': ['written', 'ጸሐፈ (tseḥafe - to write)', 'Passive Participle', 'ጽሑፍ (written)'],
        'መጻሕፍት': ['Scriptures / books', 'ጸሐፈ (tseḥafe)', 'Noun (Plural)', 'መጻሕፍት (books / Scriptures)'],
        'መጽሐፈ': ['book / bill of', 'ጸሐፈ (tseḥafe)', 'Noun (Construct)', 'መጽሐፈ (book / record of)'],
        'ዐርገ': ['He ascended', 'ዐርገ (\'arge - to ascend)', 'Verb (3rd Masc. Sg. Perfect)', 'ዐርገ (He ascended)'],
        'ወነበረ': ['and sat', 'ነበረ (nebere - to sit/dwell)', 'Conj + Verb', 'ወ (and) + ነበረ (sat)'],
        'ይነብሩ': ['they dwell / sit', 'ነበረ (nebere)', 'Verb (3rd Pl.)', 'ይነብሩ (they dwell)'],
        'በየማነ': ['at the right hand of', 'የማን (yeman - right hand)', 'Prep + Construct Noun', 'በ (at) + የማነ (right hand of)'],
        'አቡሁ': ['His Father', 'አብ (\'ab - Father)', 'Noun + 3rd Masc. Suffix', 'አቡ- (Father) + -ሁ (His)'],
        'ለአቡሁ': ['of His Father', 'አብ (\'ab)', 'Prep + Noun + Suffix', 'ለ (of/to) + አቡሁ (His Father)'],
        'አቡከ': ['Your Father', 'አብ (\'ab)', 'Noun + 2nd Masc. Suffix', 'አቡ- (Father) + -ከ (Your)'],
        'አቡኪ': ['your father (fem.)', 'አብ (\'ab)', 'Noun + 2nd Fem. Suffix', 'አቡ- (father) + -ኪ (your)'],
        'ዳግመ': ['again / a second time', 'ደገመ (degeme - to repeat)', 'Adverb', 'ዳግመ (again / second time)'],
        'ዳግም': ['second', 'ደገመ (degeme)', 'Adjective', 'ዳግም (second)'],
        'ዳግማይ': ['Second', 'ደገመ (degeme)', 'Ordinal Adjective', 'ዳግማይ (Second)'],
        'ይመጽእ': ['He will come / comes', 'መጽአ (mets\'a - to come)', 'Verb (3rd Masc. Sg.)', 'ይመጽእ (He comes)'],
        'ዘይመጽእ': ['to come / which is to come', 'መጽአ (mets\'a)', 'Rel + Verb', 'ዘ (which) + ይመጽእ (comes)'],
        'ዘመጽአ': ['Who came', 'መጽአ (mets\'a)', 'Rel + Verb (Perfect)', 'ዘ (Who) + መጽአ (came)'],
        'መጻእከ': ['You came', 'መጽአ (mets\'a)', 'Verb (2nd Masc. Sg. Perfect)', 'መጻእከ (You came)'],
        'ምጽአቱ': ['His coming', 'መጽአ (mets\'a)', 'Noun + 3rd Masc. Suffix', 'ምጽአት (coming) + -ሁ (His)'],
        'በምጽአትከ': ['at Your coming', 'መጽአ (mets\'a)', 'Prep + Noun + Suffix', 'በ (at) + ምጽአትከ (Your coming)'],
        'ይኰንን': ['to judge', 'ኰነነ (kwenene - to judge)', 'Verb (3rd Masc. Sg.)', 'ይኰንን (He judges)'],
        'ሕያዋነ': ['the living (acc.)', 'ሐይወ (ḥaywe - to live)', 'Noun (Pl. Acc.)', 'ሕያዋነ (the living)'],
        'ምኅለቅት': ['end / limit', 'ኀልቀ (halḳe - to end)', 'Noun', 'ምኅለቅት (end)'],
        'ምኅየዊ': ['Life-Giver / life-giving', 'ሐይወ (ḥaywe - to live)', 'Participle', 'ምኅየዊ (Life-Giving)'],
        'ማኅየዊ': ['Life-Giver / life-giving', 'ሐይወ (ḥaywe)', 'Participle', 'ማኅየዊ (Life-Giving)'],
        'ዘሠረፀ': ['Who proceeds', 'ሠረፀ (seretse - to proceed/spring forth)', 'Rel + Verb', 'ዘ (Who) + ሠረፀ (proceeded)'],
        'ወንሰብሖ': ['and we glorify Him', 'ሰብሐ (sebḥa)', 'Conj + Verb + Obj Suffix', 'ወ + ንሰብሕ (we glorify) + -ኦ (Him)'],
        'ዘነበበ': ['Who spoke', 'ነበበ (nebebe - to speak)', 'Rel + Verb', 'ዘ (Who) + ነበበ (spoke)'],
        'ነቢይ': ['prophet', 'ነበየ (nebeye - to prophesy)', 'Noun', 'ነቢይ (prophet)'],
        'በነቢያት': ['by the prophets', 'ነበየ (nebeye)', 'Prep + Plural Noun', 'በ (by) + ነቢያት (the prophets)'],
        'ለነቢያት': ['of the prophets', 'ነበየ (nebeye)', 'Prep + Plural Noun', 'ለ (of/for) + ነቢያት (the prophets)'],
        'ጉባኤ': ['assembly / universal council', 'ገብአ (geb\'a - to gather)', 'Noun', 'ጉባኤ (catholic/universal assembly)'],
        'ዘሐዋርያት': ['apostolic / of the Apostles', 'ሐዋርያ (ḥawarya - apostle)', 'Rel + Plural Noun', 'ዘ (of) + ሐዋርያት (the Apostles)'],
        'ጥምቀት': ['baptism', 'ጠመቀ (ṭemeḳe - to baptize)', 'Noun', 'ጥምቀት (baptism)'],
        'ለሥርየተ': ['for the remission / forgiveness of', 'ሠረየ (sereye - to forgive)', 'Prep + Construct Noun', 'ለ (for) + ሥርየተ (remission of)'],
        'ወንሴፎ': ['and we look for / await in hope', 'ተሰፈወ (tesefewe - to hope)', 'Conj + Verb (1st Pl.)', 'ወ (and) + ንሴፎ (we hope for)'],
        'ትንሣኤ': ['resurrection', 'ተንሥአ (tens\'a - to rise)', 'Noun', 'ትንሣኤ (resurrection)'],
        'ወሕይወተ': ['and the life', 'ሐይወ (ḥaywe - to live)', 'Conj + Noun', 'ወ (and) + ሕይወተ (life)'],

        // Daily Prayer Stanzas 6, 7, 8, 9 & Magnificat (Stanza 10)
        'ፍጹም': ['perfect / completely', 'ፈጸመ (fetseme - to complete)', 'Adjective', 'ፍጹም (perfect)'],
        'ፍጹመ': ['perfect (acc.)', 'ፈጸመ (fetseme)', 'Adjective (Acc.)', 'ፍጹመ (perfect)'],
        'ኄር': ['Good / gracious', 'ኄር (hér - good)', 'Adjective', 'ኄር (Good)'],
        'ሰማያዊ': ['heavenly', 'ሰማይ (semay - heaven)', 'Adjective', 'ሰማያዊ (heavenly)'],
        '፫ተ': ['three (3x)', 'ሠለሰ (selese)', 'Numeral', '፫ተ (three)'],
        'ጊዜ': ['time / times', 'ጊዜ (gīzé - time)', 'Noun', 'ጊዜ (time / times)'],
        'ዘተቀደሰ': ['which was sanctified', 'ቀደሰ (ḳedese)', 'Rel + Passive Verb', 'ዘ (which) + ተቀደሰ (was sanctified)'],
        'በደሙ': ['with His Blood', 'ደም (dem - blood)', 'Prep + Noun + Suffix', 'በ (with) + ደሙ (His blood)'],
        'ወደሞ': ['and His Blood (acc.)', 'ደም (dem)', 'Conj + Noun + Suffix', 'ወ (and) + ደሞ (His blood)'],
        'ክቡር': ['precious / glorious / honored', 'ከብረ (kebre - to be honored)', 'Adjective', 'ክቡር (precious / glorious)'],
        'ክቡረ': ['precious (acc.)', 'ከብረ (kebre)', 'Adjective (Acc.)', 'ክቡረ (precious)'],
        'ጽንዕነ': ['our strength / firmness', 'ጸንዐ (tsen\'a - to be strong)', 'Noun + 1st Pl. Suffix', 'ጽንዕ (strength) + -ነ (our)'],
        'ቤዛነ': ['our ransom / redemption', 'ቤዘወ (bézewe - to redeem)', 'Noun + 1st Pl. Suffix', 'ቤዛ (redemption) + -ነ (our)'],
        'አይሁድ': ['the Jews', 'ይሁዳ (Yhuda)', 'Collective Noun', 'አይሁድ (the Jews)'],
        'መስቀሉ': ['His Cross', 'ሰቀለ (seḳele)', 'Noun + 3rd Masc. Suffix', 'መስቀል (Cross) + -ሁ (His)'],
        'ለመስቀለ': ['to the Cross of', 'ሰቀለ (seḳele)', 'Prep + Construct Noun', 'ለ (to) + መስቀለ (Cross of)'],
        'ወለመስቀሉ': ['and to His Cross', 'ሰቀለ (seḳele)', 'Conj + Prep + Noun + Suffix', 'ወ + ለ + መስቀሉ (and to His Cross)'],
        'ለመንፈስ': ['to the Spirit', 'ነፍሰ (nefse)', 'Prep + Noun', 'ለ (to) + መንፈስ (the Spirit)'],
        'በመንፈስ': ['in the Spirit', 'ነፍሰ (nefse)', 'Prep + Noun', 'በ (in) + መንፈስ (the Spirit)'],
        'በመንፈሰ': ['by the spirit of', 'ነፍሰ (nefse)', 'Prep + Construct Noun', 'በ (by) + መንፈሰ (spirit of)'],
        'መንፈስ': ['Spirit', 'ነፍሰ (nefse)', 'Noun', 'መንፈስ (Spirit)'],
        'መንፈስየ': ['my spirit', 'ነፍሰ (nefse)', 'Noun + 1st Sg. Suffix', 'መንፈስ (spirit) + -የ (my)'],
        'ይደልዎሙ': ['It is due / fitting for Them', 'ደለወ (delewe - to be worthy)', 'Verb + 3rd Pl. Suffix', 'ይደሉ (is worthy) + -ሆሙ (for Them)'],
        'ይደልዋ': ['It is due / fitting for her', 'ደለወ (delewe)', 'Verb + 3rd Fem. Suffix', 'ይደሉ (is worthy) + -ሃ (for her)'],
        'ይደልዎ': ['It is due / fitting for it/Him', 'ደለወ (delewe)', 'Verb + 3rd Masc. Suffix', 'ይደሉ (is worthy) + -ኦ (for it/Him)'],
        'ይዘከረነ': ['may He remember us', 'ዘከረ (zekere - to remember)', 'Verb + 1st Pl. Suffix', 'ይዘከር (may He remember) + -ነ (us)'],
        'ወተዘከረ': ['and He remembered', 'ዘከረ (zekere)', 'Conj + Verb (Perfect)', 'ወ (and) + ተዘከረ (remembered)'],
        'ኢያስተኀፍረነ': ['may He not put us to shame', 'ኀፍረ (hafre - to be ashamed)', 'Neg + Causative Verb + Suffix', 'ኢ- (not) + ያስተኀፍር (put to shame) + -ነ (us)'],
        'ለሰብሖተ': ['for the glorification of', 'ሰብሐ (sebḥa)', 'Prep + Construct Infinitive', 'ለ (for) + ሰብሖተ (glorifying of)'],
        'ስሙ': ['His Name', 'ስም (sm - name)', 'Noun + 3rd Masc. Suffix', 'ስም (name) + -ሁ (His)'],
        'ያንቅሀነ': ['may He awaken us', 'ነቅሀ (neḳha - to awake)', 'Causative Verb + Suffix', 'ያንቅህ (may He awaken) + -ነ (us)'],
        'ወበአምልኮቱ': ['and in His worship', 'መለከ (meleke)', 'Conj + Prep + Noun + Suffix', 'ወ + በ + አምልኮቱ (and in His worship)'],
        'ያጽንአነ': ['may He strengthen us', 'ጸንዐ (tsen\'a)', 'Causative Verb + Suffix', 'ያጽንእ (may He strengthen) + -ነ (us)'],
        'አዕርጊ': ['lift up / offer up (fem.)', 'ዐርገ (\'arge - to ascend)', 'Causative Imperative (Fem.)', 'አዕርጊ (lift up!)'],
        'ጸሎተ': ['Prayer of', 'ጸለየ (tseleye)', 'Noun (Construct)', 'ጸሎተ (Prayer of)'],
        'ጸሎተነ': ['our prayer', 'ጸለየ (tseleye)', 'Noun + 1st Pl. Suffix', 'ጸሎት (prayer) + -ነ (our)'],
        'ወአስተሥርዪ': ['and obtain forgiveness (fem.)', 'ሠረየ (sereye)', 'Conj + Causative Imperative', 'ወ + አስተሥርዪ (cause to be forgiven)'],
        'መንበሩ': ['His throne', 'ነበረ (nebere - to sit)', 'Noun + 3rd Masc. Suffix', 'መንበር (throne) + -ሁ (His)'],
        'እመናብርቲሆሙ': ['from their thrones', 'ነበረ (nebere)', 'Prep + Pl. Noun + Suffix', 'እም (from) + መናብርት (thrones) + -ሆሙ (their)'],
        'ለዘአብልዐነ': ['To Him who fed us', 'በልዐ (bel\'a - to eat)', 'Prep + Rel + Verb + Suffix', 'ለዘ (to Him who) + አብልዐነ (fed us)'],
        'ኅብስተ': ['bread', 'ኅብስት (hbst - bread)', 'Noun (Acc.)', 'ኅብስተ (bread)'],
        'ወለዘአስተየነ': ['And to Him who gave us to drink', 'ሰትየ (setye - to drink)', 'Conj + Prep + Rel + Verb + Suffix', 'ወለዘ (and to Him who) + አስተየነ (gave us to drink)'],
        'ጽዋዓ': ['cup / chalice', 'ጽዋዕ (tswa\'i - cup)', 'Noun (Acc.)', 'ጽዋዓ (cup)'],
        'ወለዘሠርዐ': ['And to Him who ordained / prepared', 'ሠርዐ (ser\'a - to ordain)', 'Conj + Prep + Rel + Verb', 'ወለዘ (and to Him who) + ሠርዐ (ordained)'],
        'ወአራዘነ': ['and our clothing', 'አራዝ (\'araz - clothing)', 'Conj + Noun + Suffix', 'ወ (and) + አራዝ (clothing) + -ነ (our)'],
        'ወለዘተዐገሠ': ['And to Him who was patient with', 'ተዐገሠ (te\'agese - to be patient)', 'Conj + Prep + Rel + Verb', 'ወለዘ + ተዐገሠ (was patient with)'],
        'ወለዘአብጽሐነ': ['And to Him who brought us', 'በጽሐ (betsḥa - to arrive/reach)', 'Conj + Prep + Rel + Verb + Suffix', 'ወለዘ + አብጽሐነ (brought us)'],
        'ሰዓት': ['hour', 'ሰዓት (se\'at - hour)', 'Noun', 'ሰዓት (hour)'],
        'ስዓት': ['hour', 'ሰዓት (se\'at - hour)', 'Noun', 'ስዓት (hour)'],
        'ወአኰቴተ': ['and thanksgiving', 'አኰተ (\'akwete - to thank)', 'Conj + Noun', 'ወ (and) + አኰቴተ (thanksgiving)'],
        'ልዑል': ['Most High', 'ልዕለ (l\'ile - to be high)', 'Adjective', 'ልዑል (Most High / Exalted)'],
        'ልዑለ': ['exalted (acc.)', 'ልዕለ (l\'ile)', 'Adjective (Acc.)', 'ልዑለ (exalted)'],
        'ወለወላዲቱ': ['and to His Mother (Bearer)', 'ወለደ (welede)', 'Conj + Prep + Noun + Suffix', 'ወ + ለ + ወላዲቱ (His Mother)'],
        'ይትአኰት': ['may it be thanked / praised', 'አኰተ (\'akwete)', 'Verb (Passive Jussive)', 'ይትአኰት (let it be thanked)'],
        'ወይሰባሕ': ['and may it be glorified', 'ሰብሐ (sebḥa)', 'Conj + Passive Jussive', 'ወ (and) + ይሰባሕ (be glorified)'],
        'ወትረ': ['always / continually', 'ወትረ (wetre)', 'Adverb', 'ወትረ (always)'],
        'ናስተበቍዐኪ': ['we beseech you (fem.)', 'በቍዐ (beḳw\'a)', 'Verb (1st Pl.) + 2nd Fem. Suffix', 'ናስተበቍዕ (we beseech) + -ኪ (you)'],
        'እምአርዌ': ['From the beast', 'አርዌ (\'arwé - beast)', 'Prep + Noun', 'እም (from) + አርዌ (beast)'],
        'ነዓዊ': ['ravenous / hunting', 'ነዐወ (ne\'awe - to hunt)', 'Active Participle', 'ነዓዊ (predatory / ravenous)'],
        'ሐና': ['Anne (St. Hannah)', 'ሐና (Ḥana)', 'Proper Noun', 'ሐና (St. Anne, mother of Mary)'],
        'ወኢያቄም': ['and Joachim', 'ኢያቄም (\'Īyaḳém)', 'Conj + Proper Noun', 'ወ (and) + ኢያቄም (St. Joachim)'],
        'ማኅበረነ': ['our congregation / community', 'ኀበረ (habere - to unite)', 'Noun + 1st Pl. Suffix', 'ማኅበር (congregation) + -ነ (our)'],
        'ባርኪ': ['bless! (fem. sg.)', 'ባረከ (bareke - to bless)', 'Verb (2nd Fem. Sg. Imperative)', 'ባርኪ (bless!)'],
        'ባርክኒ': ['bless me! (fem. sg.)', 'ባረከ (bareke)', 'Imperative (Fem.) + 1st Sg. Suffix', 'ባርኪ (bless) + -ኒ (me)'],
        'ባረኪዮ': ['you blessed him', 'ባረከ (bareke)', 'Verb (2nd Fem. Sg.) + Obj Suffix', 'ባረኪ (you blessed) + -ዮ (him)'],
        'ባረክናከ': ['we blessed You', 'ባረከ (bareke)', 'Verb (1st Pl.) + 2nd Masc. Suffix', 'ባረክና (we blessed) + -ከ (You)'],
        'ሉቃ': ['Luke', 'ሉቃስ (Luḳas)', 'Proper Noun (Abbrev.)', 'ሉቃስ (Gospel of St. Luke)'],
        '፩': ['1 (One)', 'አሐዱ (\'aḥadu)', 'Ethiopic Numeral', '፩ (1)'],
        '፵፮': ['46 (Forty-six)', 'አርብዓ ወስድስቱ', 'Ethiopic Numeral', '፵ (40) + ፮ (6)'],
        '፶፭': ['55 (Fifty-five)', 'ኃምሳ ወኃምስቱ', 'Ethiopic Numeral', '፶ (50) + ፭ (5)'],
        'ታዐብዮ': ['magnifies Him', 'ዐብየ (\'abye - to be great)', 'Causative Verb + Obj Suffix', 'ታዐቢ (she magnifies) + -ዮ (Him)'],
        'ወትትሐሠይ': ['and rejoices', 'ተሐሠየ (teḥaseye - to rejoice)', 'Conj + Verb (3rd Fem. Sg.)', 'ወ (and) + ትትሐሠይ (rejoices)'],
        'ወተሐሠይ': ['and be glad!', 'ተሐሠየ (teḥaseye)', 'Conj + Imperative', 'ወ (and) + ተሐሠይ (be glad!)'],
        'ርእየ': ['He regarded / saw', 'ርእየ (r\'iye - to see)', 'Verb (3rd Masc. Sg. Perfect)', 'ርእየ (He saw / looked upon)'],
        'ወርኢነ': ['and we saw', 'ርእየ (r\'iye)', 'Conj + Verb (1st Pl. Perfect)', 'ወ (and) + ርኢነ (we saw)'],
        'ሕማማ': ['her lowly state / affliction', 'ሐመ (ḥame)', 'Noun + 3rd Fem. Suffix', 'ሕማም (lowliness/suffering) + -ሃ (her)'],
        'ለሕማምኪ': ['your pain / sorrow', 'ሐመ (ḥame)', 'Prep + Noun + 2nd Fem. Suffix', 'ለ + ሕማምኪ (your pain)'],
        'ለአመቱ': ['of His maidservant / handmaid', 'አመት (\'amet - handmaid)', 'Prep + Noun + Suffix', 'ለ (of) + አመቱ (His handmaid)'],
        'ወናሁ': ['And behold', 'ናሁ (nahu - behold)', 'Conj + Interjection', 'ወ (and) + ናሁ (behold)'],
        'እምይእዜሰ': ['henceforth / from now on', 'ይእዜ (y\'izé - now)', 'Prep + Adverb + Enclitic', 'እም (from) + ይእዜ (now) + -ሰ'],
        'ያስተበጽዑኒ': ['will call me blessed', 'ብፁዕ (btsu\'i - blessed)', 'Verb (3rd Pl.) + 1st Sg. Suffix', 'ያስተበጽዑ (they call blessed) + -ኒ (me)'],
        'ትውልድ': ['generation / generations', 'ወለደ (welede)', 'Noun', 'ትውልድ (generation)'],
        'ለትውልደ': ['from generation (unto generation)', 'ወለደ (welede)', 'Prep + Construct Noun', 'ለ (unto) + ትውልደ (generation of)'],
        'ገብረ': ['He has done / made', 'ገብረ (gebre - to do/make)', 'Verb (3rd Masc. Sg. Perfect)', 'ገብረ (He did / made)'],
        'ወገብረ': ['And He has done / shown', 'ገብረ (gebre)', 'Conj + Verb (Perfect)', 'ወ (and) + ገብረ (He did)'],
        'ግብሩ': ['His work / deed', 'ገብረ (gebre)', 'Noun + 3rd Masc. Suffix', 'ግብር (work) + -ሁ (His)'],
        'ዐቢያተ': ['great things', 'ዐብየ (\'abye - to be great)', 'Adjective (Pl. Acc.)', 'ዐቢያተ (great things)'],
        'ወሣህሉኒ': ['And His mercy', 'ሣህል (sahl - mercy)', 'Conj + Noun + Suffix', 'ወ + ሣህሉ (His mercy) + -ኒ'],
        'ሣህሎ': ['His mercy (acc.)', 'ሣህል (sahl)', 'Noun + 3rd Masc. Suffix', 'ሣህል (mercy) + -ኦ (His)'],
        'ይፈርህዎ': ['they fear Him', 'ፈርሀ (ferha - to fear/revere)', 'Verb (3rd Pl.) + Obj Suffix', 'ይፈርሁ (they fear) + -ዎ (Him)'],
        'በመዝራዕቱ': ['with His arm', 'መዝራዕት (mezra\'it - arm)', 'Prep + Noun + Suffix', 'በ (with) + መዝራዕቱ (His arm)'],
        'መዝራዕቶ': ['His arm (acc.)', 'መዝራዕት (mezra\'it)', 'Noun + 3rd Masc. Suffix', 'መዝራዕት (arm) + -ኦ (His)'],
        'ወዘረዎሙ': ['and He scattered them', 'ዘረወ (zerewe - to scatter)', 'Conj + Verb + Obj Suffix', 'ወ + ዘረወ (scattered) + -ሆሙ (them)'],
        'ያዐብዩ': ['they exalt / are proud in', 'ዐብየ (\'abye)', 'Causative Verb (3rd Pl.)', 'ያዐብዩ (they magnify/exalt)'],
        'ልብ': ['heart', 'ልብ (lb - heart)', 'Noun', 'ልብ (heart)'],
        'ልቡ': ['His heart', 'ልብ (lb)', 'Noun + 3rd Masc. Suffix', 'ልብ (heart) + -ሁ (His)'],
        'ልቦሙ': ['their hearts', 'ልብ (lb)', 'Noun + 3rd Pl. Suffix', 'ልብ (heart) + -ሆሙ (their)'],
        'ወነሠቶሙ': ['And He put down / overthrew them', 'ነሠተ (nesete - to pull down)', 'Conj + Verb + Obj Suffix', 'ወ + ነሠተ (brought down) + -ሆሙ (them)'],
        'ወነሠተ': ['and demolished / overthrew', 'ነሠተ (nesete)', 'Conj + Verb (Perfect)', 'ወ (and) + ነሠተ (demolished)'],
        'ለኀያላን': ['the mighty', 'ኀይለ (hayle)', 'Prep + Plural Noun', 'ለ (obj.) + ኀያላን (the mighty)'],
        'ወአዕበዮሙ': ['and exalted them', 'ዐብየ (\'abye)', 'Conj + Causative Verb + Suffix', 'ወ + አዕበየ (exalted) + -ሆሙ (them)'],
        'ለትሑታን': ['the lowly / humble', 'ትሕተ (tḥte - to be humble)', 'Prep + Plural Noun', 'ለ (obj.) + ትሑታን (the humble)'],
        'ወአጽገቦሙ': ['And He filled / satisfied them', 'ጸግበ (tsegbe - to be full)', 'Conj + Causative Verb + Suffix', 'ወ + አጽገበ (filled) + -ሆሙ (them)'],
        'በረከቶ': ['His good things / blessing', 'ባረከ (bareke)', 'Noun + 3rd Masc. Suffix', 'በረከት (blessing) + -ኦ (His)'],
        'ለርኁባን': ['the hungry', 'ርኅበ (rhbe - to hunger)', 'Prep + Plural Noun', 'ለ (obj.) + ርኁባን (the hungry)'],
        'ወፈነዎሙ': ['and He sent them away', 'ፈነወ (fenewe - to send)', 'Conj + Verb + Obj Suffix', 'ወ + ፈነወ (sent) + -ሆሙ (them)'],
        'ፈነወ': ['He sent', 'ፈነወ (fenewe)', 'Verb (3rd Masc. Sg. Perfect)', 'ፈነወ (He sent)'],
        'ዕራቆሙ': ['empty', 'ዕራቅ (\'iraḳ - empty/naked)', 'Adverbial Noun + 3rd Pl. Suffix', 'ዕራቅ (empty) + -ሆሙ (them)'],
        'ለብዑላን': ['the rich', 'ብዕለ (b\'ile - to be rich)', 'Prep + Plural Noun', 'ለ (obj.) + ብዑላን (the rich)'],
        'ወተወክፎ': ['He helped / received him', 'ተወክፈ (tewekfe - to receive)', 'Conj + Verb + Obj Suffix', 'ወ + ተወክፈ (received) + -ኦ (him)'],
        'ለእስራኤል': ['Israel', 'እስራኤል (\'Isra\'él)', 'Prep + Proper Noun', 'ለ (obj.) + እስራኤል (Israel)'],
        'ቍልዔሁ': ['His servant / child', 'ቍልዔ (ḳwl\'é - servant/youth)', 'Noun + 3rd Masc. Suffix', 'ቍልዔ (servant) + -ሁ (His)'],
        'ለአበዊነ': ['to our fathers', 'አብ (\'ab - father)', 'Prep + Pl. Noun + Suffix', 'ለ (to) + አበው (fathers) + -ነ (our)'],
        'ለአብርሃም': ['to Abraham', 'አብርሃም (\'Abrham)', 'Prep + Proper Noun', 'ለ (to) + አብርሃም (Abraham)'],
        'ወለዘርኡ': ['and to his seed / descendants', 'ዘርእ (zer\'i - seed)', 'Conj + Prep + Noun + Suffix', 'ወ + ለ + ዘርኡ (his seed)'],

        // Intro & Monday Praise of Mary (Weddase Maryam - Stanzas 1 to 9)
        'ውዳሴ': ['Praise', 'ወደሰ (wedese - to praise)', 'Noun', 'ውዳሴ (Praise)'],
        'ውዳሴሃ': ['Her Praise (Praise of her)', 'ወደሰ (wedese)', 'Noun + 3rd Fem. Suffix', 'ውዳሴ (Praise) + -ሃ (her)'],
        'ዘ፯ቱ': ['of the seven (7)', 'ሰብዐቱ (seb\'atu - seven)', 'Rel + Numeral', 'ዘ (of) + ፯ቱ (the seven)'],
        'ዘደረሰ': ['which composed', 'ደረሰ (derese - to compose)', 'Rel + Verb (Perfect)', 'ዘ (which) + ደረሰ (composed)'],
        'ኤፍሬም': ['Ephrem (St. Ephraim)', 'ኤፍሬም (\'Éfrém)', 'Proper Noun', 'ቅዱስ ኤፍሬም (St. Ephrem)'],
        'ሶርያዊ': ['the Syrian', 'ሶርያ (Sorya - Syria)', 'Gentilic Adjective', 'ሶርያዊ (the Syrian)'],
        'ፍትሕኒ': ['loose me / set me free', 'ፈትሐ (fetḥa - to untie/judge)', 'Imperative (Fem.) + 1st Sg. Suffix', 'ፍትሒ (loose) + -ኒ (me)'],
        'እማዕሠረ': ['from the bonds of', 'አሠረ (\'asere - to bind)', 'Prep + Construct Noun', 'እም (from) + ማዕሠረ (bonds of)'],
        'ወወለተ': ['and daughter of', 'ወለደ (welede)', 'Conj + Construct Noun (Fem.)', 'ወ (and) + ወለተ (daughter of)'],
        'ወቀድስኒ': ['and sanctify me', 'ቀደሰ (ḳedese)', 'Conj + Imperative + Suffix', 'ወ (and) + ቀድስኒ (sanctify me)'],
        'ወአንጽሕኒ': ['and cleanse me', 'ነጽሐ (netsḥa - to be pure)', 'Conj + Causative Imperative + Suffix', 'ወ (and) + አንጽሕኒ (cleanse me)'],
        'ዘይትነበብ': ['which is read', 'ነበበ (nebebe - to read)', 'Rel + Passive Verb', 'ዘ (which) + ይትነበብ (is read)'],
        'ሰኑይ': ['Monday', 'ሰኑይ (senuy - Monday)', 'Noun', 'ዕለተ ሰኑይ (Monday)'],
        'ፈቀደ': ['desired / willed', 'ፈቀደ (feḳede - to desire/will)', 'Verb (3rd Masc. Sg. Perfect)', 'ፈቀደ (He desired)'],
        'ያግእዞ': ['to set him free', 'አግዐዘ (\'ag\'aze - to liberate)', 'Causative Subjunctive + Suffix', 'ያግእዝ (to set free) + -ኦ (him)'],
        'ወአግዓዛ': ['and He set her free', 'አግዐዘ (\'ag\'aze)', 'Conj + Verb + 3rd Fem. Suffix', 'ወ + አግዓዘ (set free) + -ሃ (her)'],
        'አግዓዝያነ': ['free (plural)', 'አግዐዘ (\'ag\'aze)', 'Adjective (Pl. Acc.)', 'አግዓዝያነ (free ones)'],
        'አግዓዚተ': ['free (fem.)', 'አግዐዘ (\'ag\'aze)', 'Adjective (Fem. Acc.)', 'አግዓዚተ (free woman)'],
        'አዳም': ['Adam', 'አዳም (\'Adam)', 'Proper Noun', 'አዳም (Adam, the first man)'],
        'ለአዳም': ['Adam (acc. / to Adam)', 'አዳም (\'Adam)', 'Prep + Proper Noun', 'ለ (obj./to) + አዳም (Adam)'],
        'ኅዙነ': ['sad / grieving', 'ኀዘነ (hazene - to be sad)', 'Adjective (Acc.)', 'ኅዙነ (sorrowful)'],
        'ወትኩዘ': ['and sorrowful / distressed of', 'ተከዘ (tekeze - to grieve)', 'Conj + Construct Adjective', 'ወ (and) + ትኩዘ (heavy-hearted)'],
        'ወያግብኦ': ['and to bring him back / restore him', 'ገብአ (geb\'a - to return)', 'Conj + Causative Verb + Suffix', 'ወ + ያግብኦ (bring him back)'],
        'ያግብኦ': ['to restore / bring him back', 'ገብአ (geb\'a)', 'Causative Subjunctive + Suffix', 'ያግብእ (bring back) + -ኦ (him)'],
        'ወትገብእ': ['and you shall return', 'ገብአ (geb\'a)', 'Conj + Verb (2nd Masc. Sg.)', 'ወ (and) + ትገብእ (you shall return)'],
        'ዘትካት': ['former / ancient / of old', 'ትካት (tkat - antiquity)', 'Rel + Noun', 'ዘ (of) + ትካት (former time)'],
        'ሠረቀ': ['He shone forth / dawned', 'ሠረቀ (sereḳe - to rise/shine)', 'Verb (3rd Masc. Sg. Perfect)', 'ሠረቀ (shone forth)'],
        'እምድንግል': ['from the Virgin', 'ድንግል (dngl)', 'Prep + Noun', 'እም (from) + ድንግል (the Virgin)'],
        'ዘርአ': ['seed of', 'ዘርእ (zer\'i - seed)', 'Noun (Construct)', 'ዘርአ (seed of)'],
        'ለሔዋን': ['Upon Eve / to Eve', 'ሔዋን (Ḥéwan - Eve)', 'Prep + Proper Noun', 'ለ (to/upon) + ሔዋን (Eve)'],
        'ወለሔዋን': ['and of Eve', 'ሔዋን (Ḥéwan)', 'Conj + Prep + Proper Noun', 'ወ + ለ + ሔዋን (and Eve)'],
        'አስሐታ': ['deceived her / led her astray', 'ስሕተ (sḥte - to err)', 'Causative Verb + 3rd Fem. Suffix', 'አስሐተ (deceived) + -ሃ (her)'],
        'እም스ህተት': ['from error', 'ስሕተ (sḥte)', 'Prep + Noun', 'እም (from) + ስሕተት (error)'],
        'እምስሕተት': ['from error', 'ስሕተ (sḥte)', 'Prep + Noun', 'እም (from) + ስሕተት (error)'],
        'ከይሲ': ['the serpent', 'ከይሲ (keysī - serpent)', 'Noun', 'ከይሲ (serpent)'],
        'ፈትሐ': ['passed judgment', 'ፈትሐ (fetḥa - to judge)', 'Verb (3rd Masc. Sg. Perfect)', 'ፈትሐ (judged)'],
        'ፍትሐ': ['the sentence / judgment of', 'ፈትሐ (fetḥa)', 'Noun (Construct)', 'ፍትሐ (judgment of)'],
        'ብዙኅ': ['greatly / much', 'በዝኀ (bezha - to abound)', 'Adjective / Adverb', 'ብዙኅ (much / greatly)'],
        'አበዝኆ': ['I will multiply it', 'በዝኀ (bezha)', 'Causative Verb (1st Sg.) + Suffix', 'አበዝኅ (I multiply) + -ኦ (it)'],
        'ብዝኅት': ['abundant / abounded', 'በዝኀ (bezha)', 'Adjective (Fem.)', 'ብዝኅት (abundant)'],
        'ትበዝኅ': ['abounds / abounded much more', 'በዝኀ (bezha)', 'Verb (3rd Fem. Sg.)', 'ትበዝኅ (abounds)'],
        'ወለፃዕርኪ': ['and your suffering / travail', 'ፃዕር (tsa\'ir - pain/travail)', 'Conj + Prep + Noun + Suffix', 'ወ + ለ + ፃዕርኪ (your pain)'],
        'እምጻዕረ': ['from the pain / pang of', 'ፃዕር (tsa\'ir)', 'Prep + Construct Noun', 'እም (from) + ጻዕረ (pain of)'],
        'ሠምረ': ['delighted / was pleased', 'ሠምረ (semre - to be pleased)', 'Verb (3rd Masc. Sg. Perfect)', 'ሠምረ (was pleased)'],
        'ሥምረቱ': ['His goodwill / good pleasure', 'ሠምረ (semre)', 'Noun + 3rd Masc. Suffix', 'ሥምረት (goodwill) + -ሁ (His)'],
        'ፍቅረ': ['the love of', 'አፍቀረ (\'afḳere - to love)', 'Noun (Construct)', 'ፍቅረ (love of)'],
        'አፍቀሮ': ['He loved it (the world)', 'አፍቀረ (\'afḳere)', 'Verb (3rd Sg.) + Obj Suffix', 'አፍቀረ (He loved) + -ኦ (it)'],
        'ቃል': ['the Word (Logos)', 'ቃል (ḳal - Word)', 'Noun', 'ቃል (The Divine Word / Logos)'],
        'ወኀደረ': ['and dwelt / tabernacled', 'ኀደረ (hadere - to dwell)', 'Conj + Verb (Perfect)', 'ወ (and) + ኀደረ (dwelt)'],
        'ይሣሃለነ': ['to have mercy on us', 'ሣህል (sahl - mercy)', 'Verb (Subjunctive) + Suffix', 'ይሣሃል (have mercy) + -ነ (on us)'],
        'ኢሳይያስ': ['Isaiah', 'ኢሳይያስ (\'Īsayyas)', 'Proper Noun', 'ነቢይ ኢሳይያስ (Prophet Isaiah)'],
        'ትንቢት': ['prophecy', 'ነበየ (nebeye)', 'Noun', 'ትንቢት (prophecy)'],
        'ምሥጢሮ': ['the mystery of Him', 'ምሥጢር (msṭīr - mystery)', 'Noun + 3rd Masc. Suffix', 'ምሥጢር (mystery) + -ኦ (of Him)'],
        'ለዐማኑኤል': ['of Emmanuel', 'ዐማኑኤል (\'Amanu\'él)', 'Prep + Proper Noun', 'ለ (of) + ዐማኑኤል (Emmanuel — God with us)'],
        'ጸርሐ': ['he cried out', 'ጸርሐ (tserḥa - to cry out)', 'Verb (3rd Masc. Sg. Perfect)', 'ጸርሐ (cried out)'],
        'ይጸርሑ': ['they cry out', 'ጸርሐ (tserḥa)', 'Verb (3rd Masc. Pl.)', 'ይጸርሑ (they cry out)'],
        'ሕፃን': ['a Child / Infant', 'ሕፃን (ḥtsan - child)', 'Noun', 'ሕፃን (Child)'],
        'ዘመደ': ['O race / family of', 'ዘመድ (zemed - kin/race)', 'Noun (Construct)', 'ዘመደ (race/offspring of)'],
        'ዕጓለ': ['children / offspring of (with እመሕያው)', 'ዕጓል (\'igwal - offspring)', 'Noun (Construct)', 'ዕጓለ እመሕያው (mankind / children of Eve)'],
        'እመሕያው': ['mother of the living (Eve)', 'እም (mother) + ሕያው (living)', 'Compound Title', 'ዕጓለ እመሕያው (children of the mother of the living)'],
        'ወመጠወ': ['and He gave / handed over', 'መጠወ (meṭewe - to give)', 'Conj + Verb (Perfect)', 'ወ (and) + መጠወ (He gave)'],
        'ይህየው': ['may live', 'ሐይወ (ḥaywe - to live)', 'Verb (3rd Masc. Sg. Subjunctive)', 'ይህየው (may live)'],
        'ዘሀሎ': ['He Who is / was', 'ሀለወ (halewe - to be)', 'Rel + Verb', 'ዘ (Who) + ሀሎ (is/was)'],
        'ሀለወት': ['was / existed (fem.)', 'ሀለወ (halewe)', 'Verb (3rd Fem. Sg. Perfect)', 'ሀለወት (existed)'],
        'ወይሄሉ': ['and Who ever lives / remains', 'ሀለወ (halewe)', 'Conj + Verb (Imperfect)', 'ወ (and) + ይሄሉ (abides forever)'],
        'ወካዕበ': ['and again', 'ካዕበ (ka\'ibe - again)', 'Conj + Adverb', 'ወ (and) + ካዕበ (again)'],
        'ውላጤ': ['alteration / change', 'ወለጠ (weleṭe - to change)', 'Noun', 'ውላጤ (change / alteration)'],
        'ኢተበዐደ': ['was not divided / alienated', 'በዐደ (be\'ade - to separate)', 'Neg + Passive Verb', 'ኢ- (not) + ተበዐደ (divided)'],
        'ወኢተፈልጠ': ['and was not separated', 'ፈለጠ (feleṭe - to separate)', 'Conj + Neg + Passive Verb', 'ወኢ- (and not) + ተፈልጠ (separated)'],
        'ራእይ': ['Form / Person (prosōpon)', 'ርእየ (r\'iye)', 'Noun', 'ራእይ (Form / aspect)'],
        'ህላዌ': ['Being / Essence (hypostasis)', 'ሀለወ (halewe)', 'Noun', 'ህላዌ (Essence / Being)'],
        'ልሔም': ['Bethlehem (with ቤተ)', 'ቤተ ልሔም (Béte Lḥém)', 'Proper Noun', 'ቤተ ልሔም (Bethlehem — House of Bread)'],
        'ሀገሮሙ': ['their city', 'ሀገር (hager - city)', 'Noun + 3rd Pl. Suffix', 'ሀገር (city) + -ሆሙ (their)'],
        'በሀገረ': ['in the city of', 'ሀገር (hager)', 'Prep + Construct Noun', 'በ (in) + ሀገረ (city of)'],
        'ቀዳሚ': ['the first', 'ቀደመ (ḳedeme)', 'Adjective', 'ቀዳሚ (first / primal)'],
        'ገነት': ['Paradise / Garden', 'ገነት (genet - garden)', 'Noun', 'ገነት (Paradise)'],
        'ይስዐር': ['to abolish / annul', 'ሰዐረ (se\'are - to abolish)', 'Verb (Subjunctive)', 'ይስዐር (to abolish)'],
        'ሰዐረ': ['He abolished', 'ሰዐረ (se\'are)', 'Verb (3rd Masc. Sg. Perfect)', 'ሰዐረ (He abolished)'],
        'መሬት': ['dust / earth', 'መሬት (merét - dust/soil)', 'Noun', 'መሬት (dust)'],
        'ይሴብሕዎ': ['they praise Him', 'ሰብሐ (sebḥa)', 'Verb (3rd Pl.) + Obj Suffix', 'ይሴብሑ (they praise) + -ዎ (Him)'],
        'ምክሮ': ['his plot / counsel', 'መከረ (mekere - to plot/counsel)', 'Noun + 3rd Masc. Suffix', 'ምክር (counsel/plot) + -ኦ (his)'],
        'ወሠጠጠ': ['And He tore up', 'ሠጠጠ (seṭeṭe - to tear/rend)', 'Conj + Verb (Perfect)', 'ወ (and) + ሠጠጠ (tore up)'],
        'ዕዳሆሙ': ['their debt', 'ዕዳ (\'ida - debt)', 'Noun + 3rd Pl. Suffix', 'ዕዳ (debt) + -ሆሙ (their)'],
        'ወረሰዮሙ': ['and He made them', 'ረሰየ (reseye - to make/render)', 'Conj + Verb + Obj Suffix', 'ወ + ረሰየ (made) + -ሆሙ (them)'],
        'ወረሰይካ': ['and You made her', 'ረሰየ (reseye)', 'Conj + Verb (2nd Sg.) + Suffix', 'ወ + ረሰይከ (You made) + -ሃ (her)'],
        'ዳዊት': ['David (King David)', 'ዳዊት (Dawīt)', 'Proper Noun', 'ንጉሥ ዳዊት (King David)'],
        'ዘያበርህ': ['Who enlightens / shines upon', 'በርሀ (berha - to shine)', 'Rel + Causative Verb', 'ዘ (Who) + ያበርህ (enlightens)'],
        'ልደት': ['sonship / birth', 'ወለደ (welede)', 'Noun', 'መንፈስ ልደት (spirit of sonship / adoption)']
    };

    Object.keys(GEEZ_EXTENDED_GLOSSES).forEach(wordKey => {
        if (!GEEZ_WORD_DICTIONARY[wordKey]) {
            const [meaning, root, pos, breakdown] = GEEZ_EXTENDED_GLOSSES[wordKey];
            GEEZ_WORD_DICTIONARY[wordKey] = {
                geez: wordKey,
                phonetic: wordKey,
                meaning,
                root,
                pos,
                breakdown: breakdown || wordKey,
                cognates: 'Root: ' + root,
                note: 'Used in Daily Prayer and the Praises of Our Lady Mary (ውዳሴ ማርያም).'
            };
        }
    });

    function getWordPhonetic(word, fallback) {
        if (typeof window !== 'undefined' && window.__mountOfMercy && typeof window.__mountOfMercy.transliterateGeezToPhonetic === 'function') {
            return window.__mountOfMercy.transliterateGeezToPhonetic(word);
        }
        if (typeof window !== 'undefined' && typeof window.transliterateGeezToPhonetic === 'function') {
            return window.transliterateGeezToPhonetic(word);
        }
        return fallback || word;
    }

    // Helper: Decompose any Ge'ez word into prefix + stem + suffix using morphological rules
    function analyzeGeezWord(rawWord) {
        if (!rawWord) return null;
        const clean = rawWord.replace(/[፡።፣፤፥፦፧፨"“”'’()[\]]/g, '').trim();
        if (!clean) return null;

        // 1. Direct hit in curated dictionary
        if (GEEZ_WORD_DICTIONARY[clean]) {
            const entry = GEEZ_WORD_DICTIONARY[clean];
            return {
                ...entry,
                phonetic: entry.phonetic === clean ? getWordPhonetic(clean, entry.phonetic) : entry.phonetic,
                isCurated: true
            };
        }

        // 2. Check global LOANWORD_MAPPING if available
        if (typeof window !== 'undefined' && window.LOANWORD_MAPPING && window.LOANWORD_MAPPING[clean]) {
            const lw = window.LOANWORD_MAPPING[clean];
            return {
                geez: clean,
                phonetic: lw.phonetic,
                meaning: lw.meaning,
                root: `${lw.lang} ${lw.original}`,
                pos: `Loanword (${lw.lang})`,
                breakdown: `Native Ge'ez: ${lw.geez}`,
                cognates: `Origin: ${lw.lang} ${lw.original}`,
                note: `Ancient ${lw.lang} liturgical loanword preserved in Ge'ez texts.`,
                isCurated: true
            };
        }

        // 3. Morphological prefix/suffix stripping to find known stem
        let detectedPrefix = null;
        let detectedSuffix = null;
        let stem = clean;

        for (const pRule of GEEZ_PREFIX_RULES) {
            if (stem.startsWith(pRule.prefix) && stem.length >= pRule.prefix.length + 2) {
                const candidate = stem.slice(pRule.prefix.length);
                if (GEEZ_WORD_DICTIONARY[candidate]) {
                    const base = GEEZ_WORD_DICTIONARY[candidate];
                    return {
                        geez: clean,
                        phonetic: getWordPhonetic(clean, `${pRule.phonetic}${base.phonetic}`),
                        meaning: `${pRule.meaning} ${base.meaning}`,
                        root: base.root,
                        pos: `${pRule.grammar} + ${base.pos}`,
                        breakdown: `${pRule.prefix}- (${pRule.meaning}) + ${candidate} (${base.meaning})`,
                        cognates: base.cognates,
                        note: base.note,
                        isCurated: true
                    };
                }
                if (typeof window !== 'undefined' && window.LOANWORD_MAPPING && window.LOANWORD_MAPPING[candidate]) {
                    const lw = window.LOANWORD_MAPPING[candidate];
                    return {
                        geez: clean,
                        phonetic: getWordPhonetic(clean, `${pRule.phonetic}${lw.phonetic}`),
                        meaning: `${pRule.meaning} ${lw.meaning}`,
                        root: `${lw.lang} ${lw.original}`,
                        pos: `${pRule.grammar} + Loanword (${lw.lang})`,
                        breakdown: `${pRule.prefix}- (${pRule.meaning}) + ${candidate} (${lw.meaning})`,
                        cognates: `Origin: ${lw.lang} ${lw.original}`,
                        note: `Ancient ${lw.lang} liturgical loanword with prefix '${pRule.prefix}-'. Native Ge'ez: ${lw.geez}`,
                        isCurated: true
                    };
                }
                detectedPrefix = pRule;
                stem = candidate;
                break;
            }
        }

        for (const sRule of GEEZ_SUFFIX_RULES) {
            if (stem.endsWith(sRule.suffix) && stem.length >= sRule.suffix.length + 2) {
                const candidate = stem.slice(0, -sRule.suffix.length);
                detectedSuffix = sRule;
                if (GEEZ_WORD_DICTIONARY[candidate]) {
                    const base = GEEZ_WORD_DICTIONARY[candidate];
                    const prefixMeaning = detectedPrefix ? `${detectedPrefix.meaning} ` : '';
                    const prefixBreakdown = detectedPrefix ? `${detectedPrefix.prefix}- (${detectedPrefix.meaning}) + ` : '';
                    return {
                        geez: clean,
                        phonetic: getWordPhonetic(clean, base.phonetic),
                        meaning: `${prefixMeaning}${sRule.meaning} ${base.meaning}`,
                        root: base.root,
                        pos: `${base.pos} + ${sRule.grammar}`,
                        breakdown: `${prefixBreakdown}${candidate} (${base.meaning}) + -${sRule.suffix} (${sRule.meaning})`,
                        cognates: base.cognates,
                        note: base.note,
                        isCurated: true
                    };
                }
                if (typeof window !== 'undefined' && window.LOANWORD_MAPPING && window.LOANWORD_MAPPING[candidate]) {
                    const lw = window.LOANWORD_MAPPING[candidate];
                    const prefixMeaning = detectedPrefix ? `${detectedPrefix.meaning} ` : '';
                    const prefixBreakdown = detectedPrefix ? `${detectedPrefix.prefix}- (${detectedPrefix.meaning}) + ` : '';
                    return {
                        geez: clean,
                        phonetic: getWordPhonetic(clean, lw.phonetic),
                        meaning: `${prefixMeaning}${sRule.meaning} ${lw.meaning}`,
                        root: `${lw.lang} ${lw.original}`,
                        pos: `Loanword (${lw.lang}) + ${sRule.grammar}`,
                        breakdown: `${prefixBreakdown}${candidate} (${lw.meaning}) + -${sRule.suffix} (${sRule.meaning})`,
                        cognates: `Origin: ${lw.lang} ${lw.original}`,
                        note: `Ancient ${lw.lang} liturgical loanword with suffix '-${sRule.suffix}'. Native Ge'ez: ${lw.geez}`,
                        isCurated: true
                    };
                }
                stem = candidate;
                break;
            }
        }

        // 4. Fallback algorithmic breakdown
        const phonetic = getWordPhonetic(clean, clean);

        const parts = [];
        if (detectedPrefix) parts.push(`${detectedPrefix.prefix}- (${detectedPrefix.meaning})`);
        parts.push(stem);
        if (detectedSuffix) parts.push(`-${detectedSuffix.suffix} (${detectedSuffix.meaning})`);

        return {
            geez: clean,
            phonetic,
            meaning: detectedPrefix || detectedSuffix
                ? `${detectedPrefix ? detectedPrefix.meaning + ' ' : ''}${stem}${detectedSuffix ? ' (' + detectedSuffix.meaning + ')' : ''}`
                : 'Liturgical Ge\'ez term',
            root: stem,
            pos: detectedPrefix || detectedSuffix ? 'Inflected Ge\'ez Form' : 'Ge\'ez Word',
            breakdown: parts.join(' + '),
            cognates: 'Tap concordance below to see full sentences containing this word across the prayers.',
            note: 'Examine the surrounding English and Amharic stanzas in the concordance to see how this root is used in context.',
            isCurated: false
        };
    }

    // Live Corpus Concordance Search across prayers.js and kidase.js
    function findWordConcordance(geezWord, maxResults = 5) {
        if (!geezWord) return [];
        const clean = geezWord.replace(/[፡።፣፤፥፦፧፨"“”'’()[\]]/g, '').trim();
        if (!clean) return [];

        const matches = [];
        const prayerPool = (typeof prayers !== 'undefined' && Array.isArray(prayers)) ? prayers : [];

        for (let i = 0; i < prayerPool.length && matches.length < maxResults; i++) {
            const p = prayerPool[i];
            if (p && p.geez_script && p.geez_script.includes(clean) && p.english) {
                matches.push({
                    source: p.reference || p.chapter || 'Daily Prayer',
                    geez: p.geez_script,
                    phonetic: p.geez_phonetic || '',
                    english: p.english
                });
            }
        }

        if (matches.length < maxResults && typeof kidaseData !== 'undefined' && kidaseData && Array.isArray(kidaseData.order)) {
            for (let i = 0; i < kidaseData.order.length && matches.length < maxResults; i++) {
                const k = kidaseData.order[i];
                if (k && k.geez_script && k.geez_script.includes(clean) && k.english) {
                    matches.push({
                        source: `Order of the Liturgy (Stanza ${k.stanza || i + 1})`,
                        geez: k.geez_script,
                        phonetic: k.geez_phonetic || '',
                        english: k.english
                    });
                }
            }
        }

        return matches;
    }

    const GeezLexiconService = {
        SUNDAY_SCHOOL_CLASSES,
        GEEZ_PREFIX_RULES,
        GEEZ_SUFFIX_RULES,
        GEEZ_WORD_DICTIONARY,
        INTERLINEAR_PASSAGES,
        MATCHER_PACKS,
        QIDASE_SCRAMBLE_PACKS,
        JEOPARDY_CATEGORIES_META,
        CURATED_JEOPARDY_CLUES,
        analyzeGeezWord,
        findWordConcordance
    };

    if (typeof window !== 'undefined') {
        window.GeezLexiconService = GeezLexiconService;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = GeezLexiconService;
    }
})();
