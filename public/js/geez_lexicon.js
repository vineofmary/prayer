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

    // Helper: Decompose any Ge'ez word into prefix + stem + suffix using morphological rules
    function analyzeGeezWord(rawWord) {
        if (!rawWord) return null;
        const clean = rawWord.replace(/[፡።፣፤፥፦፧፨"“”'’()[\]]/g, '').trim();
        if (!clean) return null;

        // 1. Direct hit in curated dictionary
        if (GEEZ_WORD_DICTIONARY[clean]) {
            return { ...GEEZ_WORD_DICTIONARY[clean], isCurated: true };
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
            if (stem.startsWith(pRule.prefix) && stem.length > pRule.prefix.length + 1) {
                const candidate = stem.slice(pRule.prefix.length);
                if (GEEZ_WORD_DICTIONARY[candidate]) {
                    const base = GEEZ_WORD_DICTIONARY[candidate];
                    return {
                        geez: clean,
                        phonetic: (typeof window.transliterateGeezToPhonetic === 'function')
                            ? window.transliterateGeezToPhonetic(clean)
                            : `${pRule.phonetic}${base.phonetic}`,
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
                        phonetic: (typeof window.transliterateGeezToPhonetic === 'function')
                            ? window.transliterateGeezToPhonetic(clean)
                            : `${pRule.phonetic}${lw.phonetic}`,
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
            if (stem.endsWith(sRule.suffix) && stem.length > sRule.suffix.length + 1) {
                const candidate = stem.slice(0, -sRule.suffix.length);
                detectedSuffix = sRule;
                if (GEEZ_WORD_DICTIONARY[candidate]) {
                    const base = GEEZ_WORD_DICTIONARY[candidate];
                    const prefixMeaning = detectedPrefix ? `${detectedPrefix.meaning} ` : '';
                    const prefixBreakdown = detectedPrefix ? `${detectedPrefix.prefix}- (${detectedPrefix.meaning}) + ` : '';
                    return {
                        geez: clean,
                        phonetic: (typeof window.transliterateGeezToPhonetic === 'function')
                            ? window.transliterateGeezToPhonetic(clean)
                            : base.phonetic,
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
                        phonetic: (typeof window.transliterateGeezToPhonetic === 'function')
                            ? window.transliterateGeezToPhonetic(clean)
                            : lw.phonetic,
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
        const phonetic = (typeof window !== 'undefined' && window.__mountOfMercy && typeof window.__mountOfMercy.transliterateGeezToPhonetic === 'function')
            ? window.__mountOfMercy.transliterateGeezToPhonetic(clean)
            : clean;

        const parts = [];
        if (detectedPrefix) parts.push(`${detectedPrefix.prefix}- (${detectedPrefix.meaning})`);
        parts.push(stem);
        if (detectedSuffix) parts.push(`-${detectedSuffix.suffix} (${detectedSuffix.meaning})`);

        return {
            geez: clean,
            phonetic,
            meaning: detectedPrefix || detectedSuffix
                ? `${detectedPrefix ? detectedPrefix.meaning + ' ' : ''}[${stem}]${detectedSuffix ? ' (' + detectedSuffix.meaning + ')' : ''}`
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
