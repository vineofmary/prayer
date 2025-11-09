// --- DOM Elements ---
const body = document.body;
const header = document.querySelector('header');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarBackdrop = document.getElementById('sidebar-backdrop');
const themeToggle = document.getElementById('theme-toggle');
const paletteSelector = document.getElementById('palette-selector');
const geezFontSizeSlider = document.getElementById('geez-font-size-slider');
const englishFontSizeSlider = document.getElementById('english-font-size-slider');
const lockFontSizesToggle = document.getElementById('lock-font-sizes');
const boldTextToggle = document.getElementById('bold-text-toggle');
const ethiopicFontSelect = document.getElementById('ethiopic-font-select');
const englishFontSelect = document.getElementById('english-font-select');
const languageTogglesDiv = document.getElementById('language-toggles');
const prayerDisplay = document.getElementById('prayer-display');
const languageOrderList = document.getElementById('language-order-list');
const copyNotification = document.getElementById('copy-notification');
const presentationModeToggleHeader = document.getElementById('presentation-mode-toggle-header');
const presModeIconSlides = presentationModeToggleHeader.querySelector('.pres-mode-icon-slides');
const presModeIconScroll = presentationModeToggleHeader.querySelector('.pres-mode-icon-scroll');
const layoutToggleHeader = document.getElementById('layout-toggle-header');
const layoutIconColumn = layoutToggleHeader.querySelector('.layout-icon-column');
const layoutIconRow = layoutToggleHeader.querySelector('.layout-icon-row');
const showPrayerLabelsToggle = document.getElementById('show-prayer-labels');
const showLanguageLabelsToggle = document.getElementById('show-language-labels');
const showSpeakerLabelsToggle = document.getElementById('show-speaker-labels');
const showRubricationToggle = document.getElementById('show-rubrication');
const languageColorCodingSelect = document.getElementById('language-color-coding-select');
const dynamicFontSizingLabel = document.getElementById('dynamic-font-sizing-label');
const dynamicFontSizingToggle = document.getElementById('dynamic-font-sizing');
const slideTransitionSelect = document.getElementById('slide-transition-select');
const searchContainer = document.getElementById('search-container');
const searchToggle = document.getElementById('search-toggle');
const searchClose = document.getElementById('search-close');
const searchInput = document.getElementById('search-input');
const searchCount = document.getElementById('search-count');
const searchPrev = document.getElementById('search-prev');
const searchNext = document.getElementById('search-next');
const helpButton = document.getElementById('help-button');
const expandCollapseAllButton = document.getElementById('expand-collapse-all-button');
const feedbackButton = document.getElementById('feedback-button');
const helpModal = document.getElementById('help-modal');
const feedbackModal = document.getElementById('feedback-modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const sendFeedbackButton = document.getElementById('send-feedback-button');
const fontPreview = document.getElementById('font-preview');
const psalmSelectorContainer = document.getElementById('psalm-selector-container');
const psalmSummary = document.getElementById('psalm-summary');
const clearPsalmsButton = document.getElementById('clear-psalms-button');
const prophetSongsSelectorContainer = document.getElementById('prophet-songs-selector-container');
const clearProphetSongsButton = document.getElementById('clear-prophet-songs-button');
const servantNameInput = document.getElementById('servant-name-input');
const patriarchNameInput = document.getElementById('patriarch-name-input');
const bishopNameInput = document.getElementById('bishop-name-input');
const countryNameInput = document.getElementById('country-name-input');
const headOfStateInput = document.getElementById('head-of-state-input');
const anglicizeNamesToggle = document.getElementById('anglicize-names-toggle');
const bibleVerseSidebar = document.querySelector('.bible-verse-sidebar');


// --- State Variables ---
const SETTINGS_VERSION = '4.1.9'; // Update this to force refresh load settings
let currentTheme = {};
let isSidebarCollapsed = false;
let isServantsCornerActive = false;
let displayOptions = {};
let displayedLanguages = {};
let fontSizes = {};
let selectedPsalms = [];
let selectedProphetSongs = [];
let customNames = {};
let bibleData = { nkjv: null, am54: null, rgv: null, loaded: false };

let languageOrder = [
    'english', 'spanish', 'geez_script', 'geez_phonetic',
    'amharic_script', 'amharic_phonetic',
    'tigrinya_script', 'tigrinya_phonetic'
];
let searchMatches = [];
let currentMatchIndex = -1;
let currentSlideIndex = 0;
let areAllSectionsCollapsed = false;


const languageLabels = {
    english: 'English',
    spanish: 'Español',
    geez_script: 'ግእዝ',
    geez_phonetic: 'Ge\'ez',
    amharic_script: 'አማርኛ',
    amharic_phonetic: 'Amharic',
    tigrinya_script: 'ትግርኛ',
    tigrinya_phonetic: 'Tigrinya'
};

const prophetSongs = [
    { key: 'songOfSongs', name: 'Song of Songs of King Solomon | ማሓለየ ማሓለይ ዘሰሎሞን', verseRange: '(Songs of Songs 1:1-5:16)', refs: { nkjv: { book: 22, bookName: 'Song of Solomon', chapters: [1, 2, 3, 4, 5] }, rgv: { book: 'Canción de canciones', chapters: [1, 2, 3, 4, 5] }, am54: { book: 'መኃልየ መኃልይ ዘሰሎሞን', chapters: ['1', '2', '3', '4', '5'] } } },
    { key: 'firstSongOfMoses', name: 'First Song of Moses the Prophet | ጸሎተ ሙሴ ቀዳማዊ', verseRange: '(Exodus 15:1–19)', refs: { nkjv: { book: 2, bookName: 'Exodus', chapter: 15, verses: { start: 1, end: 19 } }, rgv: { book: 'Éxodo', chapter: 15, verses: { start: 1, end: 19 } }, am54: { book: 'ኦሪት ዘጸአት', chapter: '15', verses: { start: 1, end: 19 } } } },
    { key: 'secondSongOfMoses', name: 'Second Song of Moses the Prophet | ጸሎተ ሙሴ ካልእ', verseRange: '(Deuteronomy 32:1–21)', refs: { nkjv: { book: 5, bookName: 'Deuteronomy', chapter: 32, verses: { start: 1, end: 21 } }, rgv: { book: 'Deuteronomio', chapter: 32, verses: { start: 1, end: 21 } }, am54: { book: 'ኦሪት ዘዳግም', chapter: '32', verses: { start: 1, end: 21 } } } },
    { key: 'thirdSongOfMoses', name: 'Third Song of Moses the Prophet | ጸሎተ ሙሴ ሣልስ', verseRange: '(Deuteronomy 32:22–43)', refs: { nkjv: { book: 5, bookName: 'Deuteronomy', chapter: 32, verses: { start: 22, end: 43 } }, rgv: { book: 'Deuteronomio', chapter: 32, verses: { start: 22, end: 43 } }, am54: { book: 'ኦሪት ዘዳግም', chapter: '32', verses: { start: 22, end: 43 } } } },
    { key: 'prayerOfHannah', name: 'Prayer of Hannah the Mother of Samuel the Prophet | ጸሎተ ሐና እመ ሳሙኤል ነቢይ', verseRange: '(1 Kingdoms 2:1-10 LXX, 1 Samuel 2:1–10 NKJV)', refs: { nkjv: { book: 9, bookName: '1 Samuel', chapter: 2, verses: { start: 1, end: 10 } }, rgv: { book: '1 Samuel', chapter: 2, verses: { start: 1, end: 10 } }, am54: { book: 'መጽሐፈ ሳሙኤል ቀዳማዊ', chapter: '2', verses: { start: 1, end: 10 } } } },
    { key: 'prayerOfHezekiah', name: 'Prayer of King Hezekiah | ጸሎተ ሕዝቅያስ', verseRange: '(Isaiah 38:10–20)', refs: { nkjv: { book: 23, bookName: 'Isaiah', chapter: 38, verses: { start: 10, end: 20 } }, rgv: { book: 'Isaías', chapter: 38, verses: { start: 10, end: 20 } }, am54: { book: 'ትንቢተ ኢሳይያስ', chapter: '38', verses: { start: 10, end: 20 } } } },
    { key: 'prayerOfManasseh', name: 'Prayer of King Manasseh | ጸሎተ ምናሴ', verseRange: '(2 Chronicles 36 LXX)', refs: { prayerKey: 'Manasseh' } },
    { key: 'firstPrayerOfThreeYouths', name: 'First Prayer of the Three Youths | ጸሎተ ፫ ደቂቅ ቀዳማዊ', verseRange: '(Daniel 3:26–45 LXX)', refs: { prayerKey: 'ThreeYouths1' } },
    { key: 'secondPrayerOfThreeYouths', name: 'Second Prayer of the Three Youths | ጸሎተ ፫ ደቂቅ ካልእ', verseRange: '(Daniel 3:52–56 LXX)', refs: { prayerKey: 'ThreeYouths2' } },
    { key: 'thirdPrayerOfThreeYouths', name: 'Third Prayer of the Three Youths | ጸሎተ ፫ ደቂቅ ሣልስ', verseRange: '(Daniel 3:57–88 LXX)', refs: { prayerKey: 'ThreeYouths3' } },
    { key: 'prayerOfHabakkuk', name: 'Prayer of Habakkuk the Prophet | ጸሎተ ዕንባቆም ነቢይ', verseRange: '(Habakkuk 3:1–19)', refs: { nkjv: { book: 35, bookName: 'Habakkuk', chapter: 3, verses: { start: 1, end: 19 } }, rgv: { book: 'Habacuc', chapter: 3, verses: { start: 1, end: 19 } }, am54: { book: 'ትንቢተ ዕንባቆም', chapter: '3', verses: { start: 1, end: 19 } } } },
    { key: 'prayerOfIsaiah', name: 'Prayer of Isaiah the Prophet | ጸሎተ ኢሳይያስ ነቢይ', verseRange: '(Isaiah 26:9–20)', refs: { nkjv: { book: 23, bookName: 'Isaiah', chapter: 26, verses: { start: 9, end: 20 } }, rgv: { book: 'Isaías', chapter: 26, verses: { start: 9, end: 20 } }, am54: { book: 'ትንቢተ ኢሳይያስ', chapter: '26', verses: { start: 9, end: 20 } } } },
    { key: 'prayerOfMary', name: 'Prayer of Mary the Bearer of God | ጸሎተ ማርያም ወላዲተ አምላክ', verseRange: '(Luke 1:46–55)', refs: { nkjv: { book: 42, bookName: 'Luke', chapter: 1, verses: { start: 46, end: 55 } }, rgv: { book: 'Lucas', chapter: 1, verses: { start: 46, end: 55 } }, am54: { book: 'የሉቃስ ወንጌል', chapter: '1', verses: { start: 46, end: 55 } } } },
    { key: 'songOfZachariah', name: 'Song of Zachariah the Prophet | ጸሎተ ዘካርያስ ነቢይ', verseRange: '(Luke 1:68–79)', refs: { nkjv: { book: 42, bookName: 'Luke', chapter: 1, verses: { start: 68, end: 79 } }, rgv: { book: 'Lucas', chapter: 1, verses: { start: 68, end: 79 } }, am54: { book: 'የሉቃስ ወንጌል', chapter: '1', verses: { start: 68, end: 79 } } } },
    { key: 'prayerOfSimeon', name: 'Prayer of Simeon the Elder | ጸሎተ ስምዖን አረጋዊ', verseRange: '(Luke 2:29–32)', refs: { nkjv: { book: 42, bookName: 'Luke', chapter: 2, verses: { start: 29, end: 32 } }, rgv: { book: 'Lucas', chapter: 2, verses: { start: 29, end: 32 } }, am54: { book: 'የሉቃስ ወንጌል', chapter: '2', verses: { start: 29, end: 32 } } } },
];


const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zM2 13h2v-2H2v2zm18 0h2v-2h-2v2zM11 2v2h2V2h-2zm0 18v2h2v-2h-2zM4.22 5.64l1.42-1.42L7.05 5.64 5.64 7.05 4.22 5.64zM16.95 18.36l1.42-1.42L19.78 18.36l-1.41 1.41-1.42-1.41zM18.36 5.64l1.42 1.41L18.36 8.46l-1.42-1.41L18.36 5.64zM5.64 18.36l1.41 1.41L8.46 18.36l-1.41-1.42L5.64 18.36z"/></svg>`;
const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 2c-1.82 0-3.53.5-5 1.35 2.99 1.73 5 4.95 5 8.65s-2.01 6.92-5 8.65C6.47 21.5 8.18 22 10 22c5.52 0 10-4.48 10-10S15.52 2 10 2z"/></svg>`;
const shareIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"></path></svg>`;

// --- Anglicization Data ---
const anglicizedNameMap = {
    "Mary": "Maryam",
    "Zion": "Tsion",
    "Mary of Zion": "Maryam Tsion",
    "Jesus Christ": "Iyesus Kristos",
    "Jesus": "Iyesus",
    "Christ": "Kristos",
    "Pontius Pilate": "Pontios Pilatos",
    "Church": "Béte Kristiyan",
    "Bearer of God": "Theotokos",
    "Mother of God": "Theotokos",
//    "Amen": "Amén",
    "Anne": "Hanna",
    "Joachim": "Iyaqém",
    "Moses": "Musé",
    "Eve": "Héwan",
    "Joseph": "Yoséf",
    "Emmanuel": "Amanuel",
    "David": "Dawit",
    "Ephrata": "Efrata",
    "Jacob": "Ya'qob",
    "Bethlehem": "Bételehém",
    "Judah": "Yihuda",
    "Galilee": "Gelila",
    "Nazareth": "Nazrét",
    "Elizabeth": "Elsabét",
    "Stephen": "Estifanos",
    "John": "Yohannes",
    "Seventh Heaven": "Aryam",
    "the Seventh Heaven": "Aryam",
};

function applyAnglicization(text, langKey) {
    if (langKey !== 'english' || !displayOptions.anglicizeNames) {
        return text;
    }

    let processedText = text;
    // Sort keys by length descending to match longer phrases first
    const sortedKeys = Object.keys(anglicizedNameMap).sort((a, b) => b.length - a.length);

    sortedKeys.forEach(nameToReplace => {
        const anglicizedName = anglicizedNameMap[nameToReplace];
        // Use a regex to replace whole words only, case-insensitively
        const regex = new RegExp(`\\b${nameToReplace}\\b`, 'gi');
        processedText = processedText.replace(regex, `<i class="anglicized-name">${anglicizedName}</i>`);
    });

    return processedText;
}

// --- Rubrication Data ---
const rubricRedWords = {
    english: [
        "In the Name of the Father, and of the Son, and of the Holy Spirit, One God, Amen", "I seal my face", "Father", "Son", "Holy Spirit", "One God",
        "Holy Trinity", "We thank You, Lord", "Lord", "God", "King", "Our Father in Heaven",
        "With the Greeting of Saint Gabriel", "Lord God of hosts", "Jesus Christ", "Iyesus Kristos", "Iyesus", "We believe in one God", "one God",
        "Light", "True God from True God", "Virgin Mary", "Amen", "Holy, holy, holy, is the Lord of hosts", "Holy, holy, holy", "Holy, Holy, Holy", "Christ",
        "I worship the Father, and the Son, and the Holy Spirit", "Godhead", "Glory to the Father, glory to the Son, glory to the Holy Spirit",
        "Most High God", "Greetings to you, we say as we bow to you", "Prayer of Our Lady Mary, Virgin Bearer of God",
        "Savior", "My soul magnifies the Lord", "Glory to the Father, to the Son, and to the Holy Spirit, forever and to the age of ages",
        "Praises for Our Lady Mary, Virgin, Bearer of God", "O holy one, pray for us.", "Son of Man", "Only-begotten", "only-begotten", "Lover", "Good",
        "Word of God", "Emmanuel", "Amanuel", "Word", "God the Word", "One Spirit", "Good Father", "The Angels Praise Mary",
        "And now in the sixth month", "peace to you", "Peace to you", "peace be unto you", "Peace be unto you", "Most High",
        "Glory be to the Father, and to the Son, and to the Holy Spirit, forever and to the age of ages.",
        "Come to me, David, King of Israel", "Ask for us, Mary"
    ],
    geez_script: [
        "በስመ አብ ወወልድ ወመንፈስ ቅዱስ", "አአትብ ገጽየ", "አብ", "ወልድ", "ወወልድ", "መንፈስ ቅዱስ", "አሐዱ አምላክ", "አሐዱ አምላክ፣",
        "ሥላሴ", "ነአኵተከ እግዚኦ", "እግዚ", "እግዚእ", "እግዚኦ", "እግዚአብሔር", "እግዚአ", "አምላክ", "ንጉሥ", "ንጉሠ", "ወንጉሠ", "አቡነ ዘበሰማያት",
        "በሰላመ ቅዱስ ገብርኤል መልአክ", "እግዚአብሔር ጸባዖት", "እግዚአብሔር ጸባዖት", "ኢየሱስ ክርስቶስ",
        "ንኣምን በአሐዱ አምላክ", "ነአምን በአሐዱ አምላክ", "አምላክ ዘእምአምላክ ዘበአማን", "ድንግል ማርያም", "ማርያም ድንግል", "አሜን", "ቅዱስ ቅዱስ ቅዱስ እግዚአብሔር ጸባኦት",
        "ቅዱስ ቅዱስ ቅዱስ እግዚአብሔር ጸባዖት", "ቅዱስ ቅዱስ ቅዱስ", "ቅዱስ፣ ቅዱስ፣ ቅዱስ", "ክርስቶስ", "እሰግድ ለአብ ወወልድ ወመንፈስ ቅዱስ አሐቲ ስግደት።", "መለኮት",
        "ስብሐት ለአብ ወወልድ ወመንፈስ ቅዱስ", "ልዑል እግዚአብሔር", "እግዚአብሔር ልዑል", "ሰላም ለኪ እንዘ ንሰግድ ንብለኪ", "ሰላም ለኪ",
        "ጸሎተ እግዝእትነ ማርያም ድንግል ወላዲተ አምላክ", "መድኀኒየ", "ወመድኀኒየ", "ታዐብዮ ነፍስየ ለእግዚአብሔር",
        "ስብሐት ለአብ ወወልድ ወመንፈስ ቅዱስ ለዓለም ወለዓለመ ዓለም", "ውዳሴሃ ለእግዝእትነ ማርያም ድንግል ወላዲተ አምላክ", "ይዌድስዋ መላእክት ለማርያም",
        "ወበሳድስ ወርኅ", "ሰላም ለከ", "ሰላም ለኪ", "ልዑል", "ንዒ ኀቤየ ኦ ዳዊት ንጉሠ እስራኤል", "ነዓ ኀቤየ ዳዊት ንጉሠ እሥራኤል", "ሰአሊ ለነ ማርያም",
        "ወእግዚአ", "አምላከ", "ወልድከ"
    ]
};

const rubricGoldWords = {
    english: [
        "Mary of Zion", "Lady Mary", "Virgin Mother of God", "Virgin Bearer of God", "God-bearer", "Theotokos",
        "Lady", "Holy Virgin", "Mary the Virgin", "Mary, the holy one", "Mary, the praised", "Mary, the pure",
        "Mary, the joyous", "Mary, the beatific", "Mary, the blessed", "The dwelling place of the Godhead",
        "The perfect Tabernacle", "Sister of the angels", "mother of all people", "Peaceful one", "Mary, the embellished",
        "The gate of the East and the Mother of Light", "Mary, the chosen and honored one", "Mary", "Mariam"
    ],
    geez_script: [
        "ማርያም ጽዮን", "እግዝእትነ ማርያም", "እግዝእትየ ማርያም", "ድንግል ወላዲተ አምላክ", "ወላዲተ አምላክ", "እግዝእትየ", "እግዝእትነ",
        "ቅድስት ድንግል", "ማርያም ድንግል", "ማርያም ቅድስት", "ማርያም ውድስት", "ማርያም ንጽሕት", "ማርያም ፍሥሕት", "ማርያም ብጽዕት", "ማርያም ብፅዕት", "ማርያም ቡርክት",
        "ማኅደረ መለኮት", "ደብተራ ፍጽምት", "እኅተ መላእክት", "ወእመ ኵሉ ሕዝብ", "ሰላማዊት", "ማርያም ሥርጉት",
        "ኆኅተ ምሥራቅ ወእሙ ለብርሃን", "ማርያም ኅሪት ወክብርት", "마리아"
    ]
};

function buildRegex(words, isGeez = false) {
    // Sort words by length, descending, to match longer phrases first
    const sortedWords = words.sort((a, b) => b.length - a.length)
        .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); // Escape regex special chars

    const regexString = sortedWords.join('|');

    if (isGeez) {
        // For Ge'ez, handle optional prefixes (ወ, ለ, እም) and ensure it's not part of a larger word.
        // The regex uses a lookahead to ensure the match is followed by a boundary character.
        return new RegExp(`(^|\\s|\\()((?:ወ|ለ|እም)?)(${regexString})(?=[\\s.,:;!?\\)]|$)`, 'g');
    }
    // For English, match whole words or phrases, ensuring they are bounded by spaces or punctuation.
    return new RegExp(`(^|\\s|\\()(${regexString})(?=[\\s.,:;!?\\)]|$)`, 'gi');
}

const rubricRedRegex = {
    english: buildRegex(rubricRedWords.english),
    geez_script: buildRegex(rubricRedWords.geez_script, true),
};
const rubricGoldRegex = {
    english: buildRegex(rubricGoldWords.english),
    geez_script: buildRegex(rubricGoldWords.geez_script, true),
};


// --- Speaker Label Data ---
const speakerKeywords = {
    english: ["Priest", "People", "All", "Leader"],
    geez_script: ["ካህን", "ሕዝብ", "ኵሎሙ", "መሪሕ"],
    amharic_script: ["ካህን", "ሕዝብ", "ሁሉም", "መሪ"],
    tigrinya_script: ["ካህን", "ሕዝብ", "ኩሉኹም", "መራሒ"],
    spanish: ["Sacerdote", "Pueblo", "Todos", "Líder", "Gente"],
};

function toGeez(n) {
    if (n <= 0) return "";
    const geezMap = {
        1: "፩", 2: "፪", 3: "፫", 4: "፬", 5: "፭",
        6: "፮", 7: "፯", 8: "፰", 9: "፱", 10: "፲",
        20: "፳", 30: "፴", 40: "፵", 50: "፶",
        60: "፷", 70: "፸", 80: "፹", 90: "፺", 100: "፻"
    };
    if (geezMap[n]) return geezMap[n];

    if (n > 100) {
        const hundreds = Math.floor(n / 100);
        const remainder = n % 100;
        if (hundreds > 1) {
            return toGeez(hundreds) + geezMap[100] + toGeez(remainder);
        } else {
            return geezMap[100] + toGeez(remainder);
        }
    } else if (n > 10) {
        const tens = Math.floor(n / 10) * 10;
        const ones = n % 10;
        return geezMap[tens] + toGeez(ones);
    }
    return ""; // Should not be reached for n > 0
}

// --- Functions ---
function updatePsalmSummary() {
    if (selectedPsalms.length > 0) {
        psalmSummary.textContent = `Selected Psalms: ${selectedPsalms.sort((a, b) => a - b).join(', ')}`;
    } else {
        psalmSummary.textContent = 'Selected Psalms: None';
    }
}




// --- NEW: Debounce Utility Function ---
// Delays invoking a function until after 'wait' ms have passed since the last time it was invoked.
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}


function applyRubrication(text, langKey, isFirstLanguage) {
    if (!displayOptions.showRubrication || (displayOptions.languageColors !== 'off' && !isFirstLanguage)) {
        return text;
    }
    let processedText = text;

    // Apply Gold Rubrication first
    const goldRegex = rubricGoldRegex[langKey];
    if (goldRegex) {
        processedText = processedText.replace(goldRegex, (match, p1, p2, p3) => {
            if (langKey === 'geez_script') {
                // p1 is the leading boundary, p2 is the optional prefix, p3 is the word
                return `${p1}${p2}<span class="rubric-gold">${p3}</span>`;
            }
            // p1 is the leading boundary, p2 is the word
            return `${p1}<span class="rubric-gold">${p2}</span>`;
        });
    }

    // Apply Red Rubrication second
    const redRegex = rubricRedRegex[langKey];
    if (redRegex) {
        processedText = processedText.replace(redRegex, (match, p1, p2, p3) => {
            if (langKey === 'geez_script') {
                return `${p1}${p2}<span class="rubric-red">${p3}</span>`;
            }
            return `${p1}<span class="rubric-red">${p2}</span>`;
        });
    }

    return processedText;
}


function applyTheme() {
    body.className = ''; // Clear all classes first

    // Add theme and mode
    body.classList.add(`theme-${currentTheme.palette}-${currentTheme.mode}`);

    // Add view mode
    body.classList.add(`view-mode-${displayOptions.viewMode}`);

    // Add language color class if active
    if (displayOptions.languageColors !== 'off') {
        body.classList.add(`language-colors-${displayOptions.languageColors}`);
    }

    // Add presentation mode
    if (displayOptions.presentationMode === 'slides') {
        body.classList.add('presentation-mode-slides');
        dynamicFontSizingLabel.style.display = 'block';
    } else {
        dynamicFontSizingLabel.style.display = 'none';
    }

    // Handle sidebar state
    if (isSidebarCollapsed) {
        sidebar.classList.add('collapsed');
        body.classList.remove('sidebar-open');
        header.classList.remove('sidebar-visible-in-mobile');
    } else {
        sidebar.classList.remove('collapsed');
        body.classList.add('sidebar-open');
        header.classList.add('sidebar-visible-in-mobile');
    }

    // Handle rubrication state
    if (!displayOptions.showRubrication) {
        body.classList.add('rubrication-disabled');
    }

    // Handle bold text state
    if (displayOptions.boldText) {
        body.classList.add('bold-text');
    }

    themeToggle.innerHTML = currentTheme.mode === 'light' ? moonIcon : sunIcon;
    themeToggle.title = currentTheme.mode === 'light' ? 'Toggle Dark Mode' : 'Toggle Light Mode';
}

function saveSettings() {
    localStorage.setItem('settingsVersion', SETTINGS_VERSION);
    localStorage.setItem('theme', JSON.stringify(currentTheme));
    localStorage.setItem('sidebarCollapsed', isSidebarCollapsed);
    localStorage.setItem('displayOptions', JSON.stringify(displayOptions));
    localStorage.setItem('fontSizes', JSON.stringify(fontSizes));
    localStorage.setItem('ethiopicFont', ethiopicFontSelect.value);
    localStorage.setItem('englishFont', englishFontSelect.value);
    localStorage.setItem('displayedLanguages', JSON.stringify(displayedLanguages));
    localStorage.setItem('languageOrder', JSON.stringify(languageOrder));
    localStorage.setItem('selectedPsalms', JSON.stringify(selectedPsalms));
    localStorage.setItem('selectedProphetSongs', JSON.stringify(selectedProphetSongs));
    localStorage.setItem('customNames', JSON.stringify(customNames));
    localStorage.setItem('collapsedSections', JSON.stringify(collapsedSections));
}


function loadSettings() {
    const isMobile = window.innerWidth < 900;
    const savedVersion = localStorage.getItem('settingsVersion');
    const defaultSettings = {
        sidebarCollapsed: isMobile,
        theme: { palette: 'traditional', mode: 'dark' },
        displayOptions: {
            presentationMode: 'scroll',
            viewMode: 'card',
            layout: 'column',
            horizontalScroll: true,
            showPrayerLabels: true,
            showLanguageLabels: true,
            showSpeakerLabels: true,
            showRubrication: true,
            dynamicFontSizing: true,
            slideTransition: 'fade',
            languageColors: 'off',
            boldText: false,
            anglicizeNames: false
        },
        displayedLanguages: {
            english: true,
            spanish: !isMobile,
            geez_script: true,
            geez_phonetic: false,
            amharic_script: !isMobile,
            amharic_phonetic: false,
            tigrinya_script: !isMobile,
            tigrinya_phonetic: false
        },
        fontSizes: {
            geez: 16,
            english: 16,
            locked: true
        },
        ethiopicFont: "'Noto Sans Ethiopic', sans-serif",
        englishFont: "'Merriweather', serif",
        selectedPsalms: [12, 15, 22, 50, 90, 102, 135], // Default LXX Psalms
        selectedProphetSongs: [],
        // Default Custom Names
        customNames: {
            servant: '{Names}',
            patriarch: 'Abba Mathias I (አባ ማትያስ ቀዳማዊ)',
            bishop: 'Abba Theophilus (አባ ቴዎፍሎስ)',
            country: 'Ethiopia, Eritrea, and America',
            headOfState: '...'
        },
        collapsedSections: {}
    };

    if (savedVersion !== SETTINGS_VERSION) {
        // Clear old settings and start fresh if version mismatch
        isSidebarCollapsed = defaultSettings.sidebarCollapsed;
        currentTheme = defaultSettings.theme;
        displayOptions = defaultSettings.displayOptions;
        displayedLanguages = defaultSettings.displayedLanguages;
        fontSizes = defaultSettings.fontSizes;
        ethiopicFontSelect.value = defaultSettings.ethiopicFont;
        englishFontSelect.value = defaultSettings.englishFont;
        selectedPsalms = defaultSettings.selectedPsalms;
        selectedProphetSongs = defaultSettings.selectedProphetSongs;
        customNames = defaultSettings.customNames; // Use defaults
        collapsedSections = defaultSettings.collapsedSections;
    } else {
        // Load saved settings and merge with defaults to ensure all keys exist
        currentTheme = JSON.parse(localStorage.getItem('theme')) || defaultSettings.theme;
        isSidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        const savedDisplayOptions = JSON.parse(localStorage.getItem('displayOptions')) || {};
        displayOptions = { ...defaultSettings.displayOptions, ...savedDisplayOptions };
        const savedDisplayedLanguages = JSON.parse(localStorage.getItem('displayedLanguages')) || {};
        displayedLanguages = { ...defaultSettings.displayedLanguages, ...savedDisplayedLanguages };
        const savedFontSizes = JSON.parse(localStorage.getItem('fontSizes')) || {};
        fontSizes = { ...defaultSettings.fontSizes, ...savedFontSizes };
        ethiopicFontSelect.value = localStorage.getItem('ethiopicFont') || defaultSettings.ethiopicFont;
        englishFontSelect.value = localStorage.getItem('englishFont') || defaultSettings.englishFont;

        const savedLanguageOrder = localStorage.getItem('languageOrder');
        if (savedLanguageOrder) {
            const loadedOrder = JSON.parse(savedLanguageOrder);
            if (Array.isArray(loadedOrder) && loadedOrder.length === languageOrder.length) {
                languageOrder = loadedOrder;
            }
        }

        selectedPsalms = JSON.parse(localStorage.getItem('selectedPsalms')) || defaultSettings.selectedPsalms;
        selectedProphetSongs = JSON.parse(localStorage.getItem('selectedProphetSongs')) || defaultSettings.selectedProphetSongs;
        const savedCustomNames = JSON.parse(localStorage.getItem('customNames')) || {};
        customNames = { ...defaultSettings.customNames, ...savedCustomNames };
        collapsedSections = JSON.parse(localStorage.getItem('collapsedSections')) || defaultSettings.collapsedSections;
    }

    // Set UI elements from the loaded/default settings
    servantNameInput.value = customNames.servant;
    patriarchNameInput.value = customNames.patriarch;
    bishopNameInput.value = customNames.bishop;
    countryNameInput.value = customNames.country;
    headOfStateInput.value = customNames.headOfState;

    geezFontSizeSlider.value = fontSizes.geez;
    englishFontSizeSlider.value = fontSizes.english;
    lockFontSizesToggle.checked = fontSizes.locked;

    applyTheme();
    paletteSelector.value = currentTheme.palette;
    updateFontStylesAndPreview();
    updateLanguageToggles();
    checkAndEnforceLayoutRules();
    updateAllTogglesInSettingsPanel();
    populatePsalmSelector();
    populateProphetSongsSelector();
    renderPrayers();
}

function checkAndEnforceLayoutRules() {
    const activeLanguageCount = Object.values(displayedLanguages).filter(Boolean).length;
    const isNarrowScreen = window.innerWidth <= 900;

    if (activeLanguageCount >= 4) {
        displayOptions.horizontalScroll = true;
    } else {
        displayOptions.horizontalScroll = false;
    }

    if (isNarrowScreen) {
        if (activeLanguageCount >= 4 && !displayOptions.horizontalScroll) {
            if (displayOptions.layout !== 'row') {
                displayOptions.layout = 'row';
            }
        }
    }
    updateAllTogglesInSettingsPanel();
}


function updateLayoutToggleIcon() {
    const isRowLayout = displayOptions.layout === 'row';
    if (isRowLayout) {
        layoutIconColumn.style.display = 'none';
        layoutIconRow.style.display = 'block';
    } else {
        layoutIconColumn.style.display = 'block';
        layoutIconRow.style.display = 'none';
    }
}

function updatePresentationModeToggleIcon() {
    const isSlidesMode = displayOptions.presentationMode === 'slides';
    if (isSlidesMode) {
        presModeIconSlides.style.display = 'none';
        presModeIconScroll.style.display = 'block';
    } else {
        presModeIconSlides.style.display = 'block';
        presModeIconScroll.style.display = 'none';
    }
}

function updateExpandCollapseAllIcon() {
    const collapseIcon = expandCollapseAllButton.querySelector('.icon-collapse-all');
    const expandIcon = expandCollapseAllButton.querySelector('.icon-expand-all');
    if (areAllSectionsCollapsed) {
        collapseIcon.style.display = 'none';
        expandIcon.style.display = 'block';
        expandCollapseAllButton.title = 'Expand All';
    } else {
        collapseIcon.style.display = 'block';
        expandIcon.style.display = 'none';
        expandCollapseAllButton.title = 'Collapse All';
    }
}


function updateAllTogglesInSettingsPanel() {
    showPrayerLabelsToggle.checked = displayOptions.showPrayerLabels;
    showLanguageLabelsToggle.checked = displayOptions.showLanguageLabels;
    showSpeakerLabelsToggle.checked = displayOptions.showSpeakerLabels;
    showRubricationToggle.checked = displayOptions.showRubrication;
    languageColorCodingSelect.value = displayOptions.languageColors;
    dynamicFontSizingToggle.checked = displayOptions.dynamicFontSizing;
    slideTransitionSelect.value = displayOptions.slideTransition;
    boldTextToggle.checked = displayOptions.boldText;
    anglicizeNamesToggle.checked = displayOptions.anglicizeNames;

    updateLayoutToggleIcon();
    updatePresentationModeToggleIcon();
    updateExpandCollapseAllIcon();
}

function updateLanguageToggles() {
    languageTogglesDiv.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (displayedLanguages.hasOwnProperty(checkbox.value)) {
            checkbox.checked = displayedLanguages[checkbox.value];
        }
    });
}

function updateLanguageOrderList() {
    languageOrderList.innerHTML = '';
    languageOrder.forEach(langKey => {
        if (displayedLanguages[langKey]) {
            const li = document.createElement('li');
            li.draggable = true;
            li.dataset.langKey = langKey;
            li.innerHTML = `<span>${languageLabels[langKey] || langKey}</span> <span class="language-order-handle">⠿</span>`;

            if (langKey.includes('_script')) {
                li.querySelector('span').classList.add('ethiopic-label');
            }
            if (langKey.includes('_phonetic')) {
                li.querySelector('span').style.fontStyle = 'italic';
            }
            languageOrderList.appendChild(li);
        }
    });
    addDragAndDropListeners();
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
    return text.replace(regex, '<mark class="highlight">$1</mark>');
}

function formatPrayerText(text, langKey, query, isFirstLanguage) {
    let processedText = text;

    // Apply Anglicization first
    processedText = applyAnglicization(processedText, langKey);

    // Replace custom name placeholders
    processedText = processedText.replace(/\{\{Servant's Names\}\}/g, customNames.servant || '');
    processedText = processedText.replace(/\{\{PATRIARCH NAME\}\}/g, customNames.patriarch || '');
    processedText = processedText.replace(/\{\{BISHOP NAME\}\}/g, customNames.bishop || '');
    processedText = processedText.replace(/\{\{COUNTRY\}\}/g, customNames.country || '');
    processedText = processedText.replace(/\{\{Leader \/ President \/ Emperor\}\}/g, customNames.headOfState || '');

    const keywords = speakerKeywords[langKey];

    if (keywords) {
        const regex = new RegExp(`(፨ )?(${keywords.join('|')})([:፤፣])`, 'g');
        processedText = processedText.replace(regex, (match) => {
            if (displayOptions.showSpeakerLabels) {
                return `<span class="speaker-label">${match}</span>`;
            }
            return '';
        }).trim();
    }

    processedText = applyRubrication(processedText, langKey, isFirstLanguage);
    return highlightText(processedText, query);
}

function getPrayerLabel(prayer) {
    const prayerKey = `${prayer.chapter}-${prayer.stanza}`;
    const customLabels = {
        "Daily-0": "",
        "Daily-1": "Daily Prayer | ዘዘወትር ጸሎት - I Seal My Face...",
        "Daily-2": "Daily Prayer | ዘዘወትር ጸሎት - We Thank You, Lord...",
        "Daily-3": "Daily Prayer | ዘዘወትር ጸሎት - Lord's Prayer",
        "Daily-4": "Daily Prayer | ዘዘወትር ጸሎት - Greeting of Saint Gabriel",
        "Daily-5": "Daily Prayer | ዘዘወትር ጸሎት - Prayer of the Faith (Creed)",
        "Daily-6": "Daily Prayer | ዘዘወትር ጸሎት - Holy, Holy, Holy... (Seraphic Hymn)",
        "Daily-7": "Daily Prayer | ዘዘወትር ጸሎት - I worship...",
        "Daily-8": "Daily Prayer | ዘዘወትር ጸሎት - Glory...",
        "Daily-9": "Daily Prayer | ዘዘወትር ጸሎት - Greetings to You, [Mary]...",
        "Daily-10": "Daily Prayer | ዘዘወትር ጸሎት - Prayer of Our Lady Mary",
        "Daily-11": "Prayer of Saint Ephraim: Praise of Mary | ውዳሴ ማርያም",
        "Daily-12": "Prayer of Saint Ephraim: Praise of Mary | ውዳሴ ማርያም - O my Lady, loose me...",
        "Personal-0": "Prayer"
    };

    if (customLabels[prayerKey]) {
        return customLabels[prayerKey];
    } else if (prayer.chapter === 'Thurs') {
        return 'Thursday | ሐሙስ';
    } else if (prayer.chapter === 'Angels') {
        return 'Prayer of Abba Giyorgis: The Angels Praise Mary | ይዌድስዋ መላእክት ለማርያም';
    } else if (prayer.chapter === 'Psalms' && prayer.stanza === 'Intro') {
        return 'Opening Prayer for the Psalms and the Songs of the Prophets | ነዓ ኀቤየ ዳዊት';
    } else if (prayer.chapter === 'Psalms' && prayer.stanza === 'Closing') {
        return 'Closing Prayer for the Psalms and Songs of the Prophets | ሰአሊ ለነ ማርያም';
    }
    return prayer.reference; // Default fallback
}

function getSectionTitle(prayer) {
    const label = getPrayerLabel(prayer);
    if (label.startsWith("Daily Prayer | ዘዘወትር ጸሎት - ")) {
        return "Daily Prayer | ዘዘወትር ጸሎት";
    } else if (label === "Trinitarian Invocation") {
        return "";
    }
    return label.replace(/ - .*/, '');
}

function createPrayerCardElement(prayer, prayerIndex) {
    const searchQuery = searchInput.value;
    const activeLanguageCount = Object.values(displayedLanguages).filter(Boolean).length;
    const prayerCard = document.createElement('div');
    prayerCard.classList.add('prayer-card');
    prayerCard.dataset.prayerIndex = prayerIndex;

    const prayerCardMainContent = document.createElement('div');
    prayerCardMainContent.classList.add('prayer-card-main-content');

    const prayerContent = document.createElement('div');
    prayerContent.classList.add('prayer-content', displayOptions.layout === 'row' ? 'layout-row' : 'layout-column');

    if (displayOptions.languageColors !== 'off') {
        prayerContent.classList.add('colored-languages');
    }

    if (displayOptions.layout === 'column' && activeLanguageCount > 3 && displayOptions.horizontalScroll) {
        prayerContent.classList.add('horizontal-scroll');
    }
    prayerContent.dataset.activeColumns = activeLanguageCount;

    let isFirstLanguage = true;
    languageOrder.forEach(langKey => {
        if (displayedLanguages[langKey] && prayer[langKey] && prayer[langKey].trim()) {
            const langSection = document.createElement('div');
            langSection.classList.add('language-section');
            if (langKey.includes('phonetic')) {
                langSection.classList.add('lang-phonetic');
            }

            const langHeader = document.createElement('h4');
            langHeader.textContent = languageLabels[langKey];
            if (!displayOptions.showLanguageLabels) langHeader.classList.add('hidden');

            const langText = document.createElement('p');
            langText.classList.add('language-text');
            // MODIFIED: Check for verse number in the prayer object itself
            if (prayer.verseNum) {
                const sup = document.createElement('sup');
                sup.textContent = prayer.verseNum;
                langText.appendChild(sup);
            }
            langText.innerHTML += formatPrayerText(prayer[langKey], langKey, searchQuery, isFirstLanguage);

            if (langKey.includes('_script')) {
                langHeader.classList.add('ethiopic-label');
                langText.classList.add('lang-ethiopic-script');
            }

            langSection.appendChild(langHeader);
            langSection.appendChild(langText);
            prayerContent.appendChild(langSection);
            isFirstLanguage = false;
        }
    });

    prayerCardMainContent.appendChild(prayerContent);

    const prayerFooter = document.createElement('div');
    prayerFooter.classList.add('prayer-footer');

    const prayerLabel = document.createElement('div');
    prayerLabel.classList.add('prayer-label');
    if (!displayOptions.showPrayerLabels) prayerLabel.classList.add('hidden');
    prayerLabel.textContent = getPrayerLabel(prayer);
    prayerFooter.appendChild(prayerLabel);

    const prayerActions = document.createElement('div');
    prayerActions.classList.add('prayer-actions');

    const infoToggle = document.createElement('button');
    infoToggle.classList.add('info-toggle');
    infoToggle.innerHTML = '&#9432;';
    infoToggle.title = 'Show/Hide Details';
    prayerActions.appendChild(infoToggle);

    const copyButton = document.createElement('button');
    copyButton.classList.add('share-btn');
    copyButton.innerHTML = shareIconSVG;
    copyButton.title = 'Copy visible languages';
    copyButton.addEventListener('click', () => copyPrayer(prayer));
    prayerActions.appendChild(copyButton);

    const enterSlidesBtn = document.createElement('button');
    enterSlidesBtn.classList.add('enter-slides-mode-btn');
    enterSlidesBtn.innerHTML = `<svg class="pres-mode-icon-slides" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg>`;
    enterSlidesBtn.title = 'Enter Slides Mode';
    enterSlidesBtn.addEventListener('click', (event) => {
        const clickedCard = event.currentTarget.closest('.prayer-card');
        const allCards = Array.from(prayerDisplay.querySelectorAll('.prayer-card, .section-title'));
        const cardIndex = allCards.indexOf(clickedCard);
        if (cardIndex !== -1) {
            currentSlideIndex = cardIndex;
            togglePresentationMode();
        }
    });
    prayerActions.appendChild(enterSlidesBtn);

    const exitSlidesBtn = document.createElement('button');
    exitSlidesBtn.classList.add('exit-slides-mode-btn');
    exitSlidesBtn.innerHTML = '&times;';
    exitSlidesBtn.title = 'Exit Slides Mode';
    exitSlidesBtn.addEventListener('click', togglePresentationMode);
    prayerActions.appendChild(exitSlidesBtn);

    prayerFooter.appendChild(prayerActions);
    prayerCardMainContent.appendChild(prayerFooter);
    prayerCard.appendChild(prayerCardMainContent);

    const infoPanel = document.createElement('div');
    infoPanel.classList.add('info-panel');
    const infoPanelContent = document.createElement('div');
    infoPanelContent.classList.add('info-panel-content');
    let infoHTML = `<p><strong>Reference:</strong> ${prayer.reference}</p>`;
    if (prayer.instruction && prayer.instruction.trim().toLowerCase() !== 'n/a') {
        infoHTML += `<p><strong>Instruction:</strong> ${prayer.instruction}</p>`;
    }
    infoPanelContent.innerHTML = infoHTML;
    infoPanel.appendChild(infoPanelContent);
    prayerCard.appendChild(infoPanel);

    infoToggle.addEventListener('click', () => infoPanel.classList.toggle('active'));

    return prayerCard;
}


function getStandardPrayerSequence() {
    const personalPrayer = {
        instruction: "The leader or priest offers a personal prayer or benediction here.",
        reference: "Personal Prayer",
        chapter: "Personal",
        stanza: "0",
        english: "[Prayer]",
        geez_script: "[ጸሎት]",
        geez_phonetic: "[tselot]",
        amharic_script: "[ጸሎት]",
        amharic_phonetic: "[tselot]",
        tigrinya_script: "[ጸሎት]",
        tigrinya_phonetic: "[tselot]",
        spanish: "[Oración]"
    };
    const lordsPrayerParts = prayers.filter(p => p.chapter === 'Daily' && p.stanza === '3');
    const gabrielGreetingParts = prayers.filter(p => p.chapter === 'Daily' && p.stanza === '4');

    return [personalPrayer, ...lordsPrayerParts, ...gabrielGreetingParts];
}

let collapsedSections = {};

function renderPrayers() {
    if (isServantsCornerActive) return;
    prayerDisplay.innerHTML = '';
    const activeLanguageCount = Object.values(displayedLanguages).filter(Boolean).length;
    if (activeLanguageCount === 0) {
        prayerDisplay.innerHTML = `<div class="empty-state-message"><p>Please select a language from the settings panel to begin.</p></div>`;
        return;
    }

    let lastSectionTitle = null;
    const addSectionTitle = (title, isCollapsible = true) => {
        if (title && title !== lastSectionTitle) {
            const titleEl = document.createElement('h2');
            titleEl.classList.add('section-title');
            titleEl.textContent = title;

            if (isCollapsible) {
                titleEl.classList.add('collapsible');
                if (collapsedSections[title]) {
                    titleEl.classList.add('collapsed');
                }
                titleEl.addEventListener('click', () => {
                    // Do not allow collapsing/expanding in slides mode
                    if (displayOptions.presentationMode === 'slides') {
                        return;
                    }

                    // The button's own listener will stop propagation
                    const isCollapsed = titleEl.classList.toggle('collapsed');
                    collapsedSections[title] = isCollapsed;
                    saveSettings();

                    let nextEl = titleEl.nextElementSibling;
                    while (nextEl && !nextEl.classList.contains('section-title')) {
                        nextEl.style.display = isCollapsed ? 'none' : '';
                        nextEl = nextEl.nextElementSibling;
                    }
                });
            }

            // Add action buttons for slide mode functionality
            const exitSlidesBtn = document.createElement('button');
            exitSlidesBtn.classList.add('exit-slides-mode-btn', 'section-title-exit-btn');
            exitSlidesBtn.innerHTML = '&times;';
            exitSlidesBtn.title = 'Exit Slides Mode';
            exitSlidesBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent the h2's click listener from firing
                togglePresentationMode();
            });
            titleEl.appendChild(exitSlidesBtn);

            prayerDisplay.appendChild(titleEl);
            if (title === "Daily Prayer | ዘዘወትር ጸሎት") {
                const iconImg = document.createElement('img');
                iconImg.src = 'img/Silus-Kidus.svg';
                iconImg.alt = 'Holy Trinity Icon';
                iconImg.classList.add('holy-trinity-icon'); // Add a class for styling
                prayerDisplay.appendChild(iconImg);
            } else if (title === "Prayer of Saint Ephraim: Praise of Mary | ውዳሴ ማርያም") {
                const iconImg = document.createElement('img');
                iconImg.src = 'img/Mary-Blesses-Ephraim.svg';
                iconImg.alt = 'Mary Blesses Ephraim Icon';
                iconImg.classList.add('section-icon');
                prayerDisplay.appendChild(iconImg);
            } else if (title === "Thursday | ሐሙስ") {
                const iconImg = document.createElement('img');
                iconImg.src = 'img/Ephraim-and-Mary-on-Thursday.svg';
                iconImg.alt = 'Ephraim and Mary on Thursday Icon';
                iconImg.classList.add('section-icon');
                prayerDisplay.appendChild(iconImg);
            } else if (title === "Prayer of Abba Giyorgis: The Angels Praise Mary | ይዌድስዋ መላእክት ለማርያም") {
                const iconImg = document.createElement('img');
                iconImg.src = 'img/Mary-with-her-beloved-Son.svg';
                iconImg.alt = 'Mary with her beloved Son Icon';
                iconImg.classList.add('section-icon');
                prayerDisplay.appendChild(iconImg);
            } else if (title === "Opening Prayer for the Psalms and the Songs of the Prophets | ነዓ ኀቤየ ዳዊት") {
                const iconImg = document.createElement('img');
                iconImg.src = 'img/Covenant-of-Mercy.svg';
                iconImg.alt = 'Covenant of Mercy Icon';
                iconImg.classList.add('section-icon');
                prayerDisplay.appendChild(iconImg);
            } else if (title === "Closing Prayer for the Psalms and Songs of the Prophets | ሰአሊ ለነ ማርያም") {
                const iconImg = document.createElement('img');
                iconImg.src = 'img/Covenant-of-Mercy-with-Psalm.svg';
                iconImg.alt = 'Covenant of Mercy with Psalm Icon';
                iconImg.classList.add('section-icon');
                prayerDisplay.appendChild(iconImg);
            }
            lastSectionTitle = title;
        }
    };

    const addSectionTitleIfNeeded = (prayer) => {
        const title = getSectionTitle(prayer);
        addSectionTitle(title, true);
    };

    const renderSequence = () => {
        const prayerSequence = getStandardPrayerSequence();
        prayerSequence.forEach(p => {
            const prayerCard = createPrayerCardElement(p, -1);
            prayerDisplay.appendChild(prayerCard);
        });
    };

    // Render main prayers (non-Psalms, non-Prophet Songs)
    const mainPrayers = prayers.filter(p => p.chapter !== 'Psalms' && p.chapter !== 'ProphetSong');
    mainPrayers.forEach((prayer, prayerIndex) => {
        if (prayer.chapter === 'Daily' && prayer.stanza === '0') {
            const prayerCard = createPrayerCardElement(prayer, prayerIndex);
            prayerDisplay.appendChild(prayerCard);
            addSectionTitleIfNeeded(prayer);
        } else {
            addSectionTitleIfNeeded(prayer);
            const prayerCard = createPrayerCardElement(prayer, prayerIndex);
            prayerDisplay.appendChild(prayerCard);

            // Apply initial collapsed state after the card is added
            if (displayOptions.presentationMode !== 'slides' && lastSectionTitle && collapsedSections[lastSectionTitle]) {
                prayerCard.style.display = 'none';
            }
        }
    });

    // Conditionally render Psalm-related prayers
    const psalmsRendered = selectedPsalms.length > 0 && bibleData.loaded;
    const prophetSongsRendered = selectedProphetSongs.length > 0;

    if (psalmsRendered || prophetSongsRendered) {
        const psalmIntroPrayers = prayers.filter(p => p.chapter === 'Psalms' && p.stanza === 'Intro');
        if (psalmIntroPrayers.length > 0) {
            addSectionTitleIfNeeded(psalmIntroPrayers[0]);
            psalmIntroPrayers.forEach(prayer => {
                const prayerCard = createPrayerCardElement(prayer, -1);
                prayerDisplay.appendChild(prayerCard);
                if (displayOptions.presentationMode !== 'slides' && lastSectionTitle && collapsedSections[lastSectionTitle]) {
                    prayerCard.style.display = 'none';
                }
            });
        }
    }

    if (psalmsRendered) {
        renderSelectedPsalmsWithDoxology((psalmNum) => {
            addSectionTitle(`Psalm ${psalmNum} | መዝሙር ዘዳዊት ${toGeez(psalmNum)}`);
        });
    }

    // Conditionally render Prophet Songs
    if (prophetSongsRendered) {
        renderSelectedProphetSongs((songName, verseRange) => {
            const title = `${songName} ${verseRange}`;
            addSectionTitle(title);
        });
    }

    // Render Conclusion if Psalms or Prophet Songs were rendered
    if (psalmsRendered || prophetSongsRendered) {
        const closingPrayers = prayers.filter(p => p.chapter === 'Psalms' && p.stanza === 'Closing');
        if (closingPrayers.length > 0) {
            addSectionTitleIfNeeded(closingPrayers[0]);
            closingPrayers.forEach(prayer => {
                const prayerCard = createPrayerCardElement(prayer, -1);
                prayerDisplay.appendChild(prayerCard);
                if (displayOptions.presentationMode !== 'slides' && lastSectionTitle && collapsedSections[lastSectionTitle]) {
                    prayerCard.style.display = 'none';
                }
            });
        }
    }

    // Always render the standard prayer sequence at the very end
    renderSequence();

    // Final setup for slides and search
    if (displayOptions.presentationMode === 'slides') {
        setupSlides();
        adjustSlideFontSize();
    } else {
        removeSlides();
    }
    updateSearchMatches();
}


function smoothRender(callback) {
    prayerDisplay.classList.add('is-transitioning');
    setTimeout(() => {
        if (callback) callback();
        renderPrayers();
        prayerDisplay.classList.remove('is-transitioning');
    }, 150);
}


let notificationTimeout;
function showCopyNotification(message = 'Prayer copied to clipboard!', duration = 2000) {
    clearTimeout(notificationTimeout);
    copyNotification.textContent = message;
    copyNotification.classList.add('show');
    notificationTimeout = setTimeout(() => {
        copyNotification.classList.remove('show');
    }, duration);
}


function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopyNotification();
        } else {
            showCopyNotification('Failed to copy!', 3000);
        }
    } catch (err) {
        showCopyNotification('Failed to copy!', 3000);
    }
    document.body.removeChild(textArea);
}

function copyPrayer(prayer) {
    let textToCopy = ``;
    textToCopy += `፨ ${getPrayerLabel(prayer)} ፨\n\n`;
    languageOrder.forEach(langKey => {
        if (displayedLanguages[langKey] && prayer[langKey] && prayer[langKey].trim()) {
            textToCopy += `--- ${languageLabels[langKey]} ---\n`;
            const rawText = prayer[langKey];
            textToCopy += `${rawText}\n\n`;
        }
    });

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showCopyNotification();
        }).catch(err => {
            console.error('Async clipboard API failed, trying fallback: ', err);
            fallbackCopyTextToClipboard(textToCopy);
        });
    } else {
        fallbackCopyTextToClipboard(textToCopy);
    }
}

function copyPsalm(verse, lxxChapter) {
    let textToCopy = ``;
    let labelText;
    if (lxxChapter == verse.mtChapter) {
        labelText = `Psalm ${lxxChapter}:${verse.verseNum}`;
    } else {
        labelText = `Psalm ${lxxChapter} (${verse.mtChapter}):${verse.verseNum}`;
    }

    textToCopy += `፨ ${labelText} ፨\n\n`;

    if (displayedLanguages.english && verse.nkjv) {
        textToCopy += `--- English ---\n`;
        textToCopy += `[${verse.verseNum}] ${verse.nkjv}\n\n`;
    }
    if (displayedLanguages.amharic_script && verse.am54) {
        textToCopy += `--- አማርኛ ---\n`;
        textToCopy += `[${verse.verseNum}] ${verse.am54}\n\n`;
    }
    if (displayedLanguages.spanish && verse.rgv) {
        textToCopy += `--- Español ---\n`;
        // The rgv text can have HTML, need to strip it
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = verse.rgv;
        const spanishText = tempDiv.textContent || tempDiv.innerText || "";
        textToCopy += `[${verse.verseNum}] ${spanishText}\n\n`;
    }

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showCopyNotification();
        }).catch(err => {
            console.error('Async clipboard API failed, trying fallback: ', err);
            fallbackCopyTextToClipboard(textToCopy);
        });
    } else {
        fallbackCopyTextToClipboard(textToCopy);
    }
}


function updateFontStylesAndPreview() {
    const ethiopicFont = ethiopicFontSelect.value;
    const englishFont = englishFontSelect.value;

    document.documentElement.style.setProperty('--geez-font-size', `${fontSizes.geez}px`);
    document.documentElement.style.setProperty('--english-font-size', `${fontSizes.english}px`);
    document.documentElement.style.setProperty('--ethiopic-font-family', ethiopicFont);
    document.documentElement.style.setProperty('--english-font-family', englishFont);

    const previewEnglish = fontPreview.querySelector('.preview-english');
    const previewGeez = fontPreview.querySelector('.preview-geez');
    const previewPhonetic = fontPreview.querySelector('.preview-phonetic');

    previewEnglish.style.fontFamily = englishFont;
    previewEnglish.style.fontSize = `${fontSizes.english}px`;
    previewGeez.style.fontFamily = ethiopicFont;
    previewGeez.style.fontSize = `${fontSizes.geez}px`;
    previewPhonetic.style.fontFamily = englishFont;
    previewPhonetic.style.fontSize = `${fontSizes.english}px`;
}

// --- Slides Mode Functionality ---
function setupSlides() {
    prayerDisplay.className = ''; // Clear existing classes
    prayerDisplay.classList.add(`transition-${displayOptions.slideTransition}`);
    showSlide(currentSlideIndex);
}

function removeSlides() {
    prayerDisplay.style.transform = '';
    prayerDisplay.className = '';
    document.querySelectorAll('.prayer-card, .section-title').forEach(el => el.classList.remove('active-slide'));
    document.querySelectorAll('.language-text').forEach(p => p.style.fontSize = '');
}

function showSlide(index) {
    const slides = prayerDisplay.querySelectorAll('.prayer-card, .section-title');
    if (index >= slides.length) currentSlideIndex = 0;
    if (index < 0) currentSlideIndex = slides.length - 1;

    if (displayOptions.slideTransition === 'fade' || displayOptions.slideTransition === 'none') {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active-slide', i === currentSlideIndex);
        });
    } else { // Default is 'slide'
        prayerDisplay.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    }
    adjustSlideFontSize();
}

function nextSlide() {
    const slides = prayerDisplay.querySelectorAll('.prayer-card, .section-title');
    if (slides.length > 0) {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        showSlide(currentSlideIndex);
    }
}

function prevSlide() {
    const slides = prayerDisplay.querySelectorAll('.prayer-card, .section-title');
    if (slides.length > 0) {
        currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
        showSlide(currentSlideIndex);
    }
}

function adjustSlideFontSize() {
    if (displayOptions.presentationMode !== 'slides' || !displayOptions.dynamicFontSizing) {
        document.querySelectorAll('.language-text').forEach(p => { p.style.fontSize = ''; });
        return;
    }

    const prayerCards = prayerDisplay.querySelectorAll('.prayer-card');
    prayerCards.forEach(card => {
        // Use a small timeout to ensure the DOM is ready for measurement
        setTimeout(() => {
            const prayerContent = card.querySelector('.prayer-content');
            if (!prayerContent) return;

            const langSections = card.querySelectorAll('.language-section');
            if (langSections.length === 0) return;

            // Reset all font sizes first to get accurate measurements
            langSections.forEach(section => {
                const textP = section.querySelector('p.language-text');
                if (textP) textP.style.fontSize = '';
            });

            let finalSize = 12; // Default minimum size

            // Check if we are in column layout
            if (prayerContent.classList.contains('layout-column')) {
                let minBestSize = 250; // Start with a large potential font size

                // Find the best font size for each column and take the minimum
                langSections.forEach(section => {
                    const textP = section.querySelector('p.language-text');
                    if (!textP) return;

                    let minSize = 12, maxSize = 250, bestSize = minSize;
                    const availableHeight = prayerContent.clientHeight;

                    while (minSize <= maxSize) {
                        let midSize = Math.floor((minSize + maxSize) / 2);
                        textP.style.fontSize = midSize + 'px';

                        // Check if the text overflows its container's height or width, with a small buffer
                        if (textP.scrollHeight <= availableHeight && textP.scrollWidth <= section.clientWidth) {
                            bestSize = midSize; // This size fits
                            minSize = midSize + 1; // Try for a larger size
                        } else {
                            maxSize = midSize - 1; // Too big, try smaller
                        }
                    }
                    // Keep track of the smallest font size that fits any column
                    if (bestSize < minBestSize) {
                        minBestSize = bestSize;
                    }
                });

                finalSize = Math.floor(minBestSize);

            } else { // This is the original logic for 'row' layout
                let minSize = 12, maxSize = 250, bestSize = minSize;

                while (minSize <= maxSize) {
                    let midSize = Math.floor((minSize + maxSize) / 2);

                    // Apply the test font size to all sections
                    langSections.forEach(section => {
                        const textP = section.querySelector('p.language-text');
                        if (textP) textP.style.fontSize = midSize + 'px';
                    });

                    // Check if the container overflows
                    if (prayerContent.scrollHeight <= prayerContent.clientHeight && prayerContent.scrollWidth <= prayerContent.clientWidth) {
                        bestSize = midSize;
                        minSize = midSize + 1;
                    } else {
                        maxSize = midSize - 1;
                    }
                }
                finalSize = Math.floor(bestSize);
            }

            // Apply the final calculated font size to all sections for uniformity
            langSections.forEach(section => {
                const textP = section.querySelector('p.language-text');
                if (textP) textP.style.fontSize = finalSize + 'px';
            });

        }, 50); // End of setTimeout
    });
}

// --- Search Functionality ---
function updateSearchMatches() {
    searchMatches = prayerDisplay.querySelectorAll('.highlight');
    searchCount.textContent = `${currentMatchIndex + 1}/${searchMatches.length}`;

    searchMatches.forEach((match, index) => {
        match.classList.toggle('current', index === currentMatchIndex);
    });

    if (currentMatchIndex > -1 && searchMatches[currentMatchIndex]) {
        searchMatches[currentMatchIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

function performSearch() {
    currentMatchIndex = -1;
    renderPrayers();
    if (searchInput.value) {
        currentMatchIndex = 0;
    }
    updateSearchMatches();
}

function closeSearch() {
    header.classList.remove('search-active');
    searchInput.value = '';
    performSearch();
}

// --- Sidebar Helper ---
function collapseSidebar() {
    if (!isSidebarCollapsed) {
        isSidebarCollapsed = true;
        sidebar.classList.add('collapsed');
        applyTheme();
        saveSettings();
    }
}

// --- Psalm Functions ---
async function loadBibleData() {
    const loadFile = async (url, key) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            bibleData[key] = (typeof data === 'string') ? JSON.parse(data) : data;
            console.log(`${key} Bible data loaded successfully.`);
            return true;
        } catch (error) {
            console.error(`Failed to load ${key} Bible data from ${url}:`, error);
            bibleData[key] = null;
            return false;
        }
    };

    const results = await Promise.all([
        loadFile('bible/NKJV_New_King_James_English_Bible_1982AD.json', 'nkjv'),
        loadFile('bible/አም54_Haile_Selassie_Amharic_Bible_1962AD_1954EC.json', 'am54'),
        loadFile('bible/RGV_Reina_Valera_Gomez_Bible_2010AD.json', 'rgv')
    ]);

    if (results.some(res => res === true)) {
        bibleData.loaded = true;
    } else {
        bibleData.loaded = false;
        console.error("All Bible data files failed to load.");
    }
}

function convertLxxToMt(lxxChapter) {
    if (lxxChapter >= 1 && lxxChapter <= 8) return [lxxChapter];
    if (lxxChapter === 9) return [9, 10];
    if (lxxChapter >= 10 && lxxChapter <= 112) return [lxxChapter + 1];
    if (lxxChapter === 113) return [114, 115];
    if (lxxChapter === 114 || lxxChapter === 115) return [116];
    if (lxxChapter >= 116 && lxxChapter <= 145) return [lxxChapter + 1];
    if (lxxChapter === 146 || lxxChapter === 147) return [147];
    if (lxxChapter >= 148 && lxxChapter <= 150) return [lxxChapter];
    return []; // Should not happen
}

function populatePsalmSelector() {
    psalmSelectorContainer.innerHTML = '';

    const selectAllLabel = document.createElement('label');
    selectAllLabel.style.fontWeight = 'bold';
    const selectAllCheckbox = document.createElement('input');
    selectAllCheckbox.type = 'checkbox';
    selectAllCheckbox.id = 'select-all-psalms';
    selectAllLabel.appendChild(selectAllCheckbox);
    selectAllLabel.append(' Select All');
    psalmSelectorContainer.appendChild(selectAllLabel);

    const separator = document.createElement('hr');
    separator.style.margin = '0.5rem 0';
    psalmSelectorContainer.appendChild(separator);

    for (let i = 1; i <= 150; i++) {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = i;
        checkbox.id = `psalm-${i}`;
        if (selectedPsalms.includes(i)) {
            checkbox.checked = true;
        }
        label.appendChild(checkbox);
        label.append(` Psalm ${i} | መዝሙር ዘዳዊት ${toGeez(i)}`);
        psalmSelectorContainer.appendChild(label);
    }
}

function populateProphetSongsSelector() {
    prophetSongsSelectorContainer.innerHTML = '';

    const selectAllLabel = document.createElement('label');
    selectAllLabel.style.fontWeight = 'bold';
    const selectAllCheckbox = document.createElement('input');
    selectAllCheckbox.type = 'checkbox';
    selectAllCheckbox.id = 'select-all-prophet-songs';
    selectAllLabel.appendChild(selectAllCheckbox);
    selectAllLabel.append(' Select All');
    prophetSongsSelectorContainer.appendChild(selectAllLabel);

    const separator = document.createElement('hr');
    separator.style.margin = '0.5rem 0';
    prophetSongsSelectorContainer.appendChild(separator);

    prophetSongs.forEach(song => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = song.key;
        checkbox.id = `prophet-song-${song.key}`;
        if (selectedProphetSongs.includes(song.key)) {
            checkbox.checked = true;
        }
        label.appendChild(checkbox);
        label.append(` ${song.name}`);
        prophetSongsSelectorContainer.appendChild(label);
    });
}

function renderSelectedPsalmsWithDoxology(addSectionTitleCallback) {
    if (selectedPsalms.length === 0 || !bibleData.loaded) return;

    const getVerses = (data, isStructured) => {
        if (!data) return [];
        if (isStructured) {
            if (data.books && Array.isArray(data.books)) {
                return data.books.flatMap(book =>
                book.chapters ? book.chapters.flatMap(ch => (ch.verses || []).map((verseText, index) => ({
                    book: book.title,
                    chapter: ch.chapter,
                    verse: index + 1,
                    text: verseText
                }))) : []
                );
            }
            if (data.verses && Array.isArray(data.verses)) {
                return data.verses;
            }
        }
        return Array.isArray(data) ? data : [];
    };

    const nkjvVersesAll = getVerses(bibleData.nkjv, false);
    const am54VersesAll = getVerses(bibleData.am54, true);
    const rgvVersesAll = getVerses(bibleData.rgv, true);

    const psalmBookData = {
        nkjv: { name: 19, bookKey: 'book' },
        am54: { name: 'መዝሙረ ዳዊት', bookKey: 'book' },
        rgv: { name: 'Salmos', bookKey: 'book_name' }
    };

    const nkjvPsalms = nkjvVersesAll.filter(v => v[psalmBookData.nkjv.bookKey] === psalmBookData.nkjv.name);
    const am54Psalms = am54VersesAll.filter(v => v[psalmBookData.am54.bookKey] === psalmBookData.am54.name);
    const rgvPsalms = rgvVersesAll.filter(v => v[psalmBookData.rgv.bookKey] === psalmBookData.rgv.name);

    const doxologyPrayer = prayers.find(p => p.chapter === 'Psalms' && p.stanza === 'Response');

    for (const lxxChapter of selectedPsalms.sort((a, b) => a - b)) {
        addSectionTitleCallback(lxxChapter);
        const mtChapters = convertLxxToMt(lxxChapter);

        let allVerses = [];

        mtChapters.forEach(mtChapter => {
            const nkjvVerses = nkjvPsalms.filter(v => v.chapter == mtChapter);
            const am54Verses = am54Psalms.filter(v => v.chapter == mtChapter);
            const rgvVerses = rgvPsalms.filter(v => v.chapter == mtChapter);

            let maxVerseNum = 0;
            [...nkjvVerses, ...am54Verses, ...rgvVerses].forEach(v => {
                if (v && v.verse) {
                    const verseParts = String(v.verse).split('-').map(Number);
                    const endVerse = verseParts.length > 1 ? verseParts[1] : verseParts[0];
                    if (endVerse > maxVerseNum) maxVerseNum = endVerse;
                }
            });

            for (let i = 1; i <= maxVerseNum; i++) {
                const findVerse = (verses, verseNum) => verses.find(v => {
                    if (!v || !v.verse) return false;
                    const parts = String(v.verse).split('-').map(Number);
                    return verseNum >= parts[0] && verseNum <= (parts.length > 1 ? parts[1] : parts[0]);
                });

                let verseData = { verseNum: i, mtChapter: mtChapter };
                const nkjvVerse = findVerse(nkjvVerses, i);
                if (nkjvVerse) verseData.nkjv = nkjvVerse.text;

                const rgvVerse = findVerse(rgvVerses, i);
                if (rgvVerse) {
                    verseData.rgv = rgvVerse.text.replace(/«/g, '<i>').replace(/»/g, '</i><br>');
                }

                const am54Verse = findVerse(am54Verses, i);
                if (am54Verse) {
                    verseData.am54 = am54Verse.text;
                }

                if (verseData.nkjv || verseData.rgv || verseData.am54) {
                    allVerses.push(verseData);
                }
            }
        });

        allVerses.forEach(verse => {
            const activePsalmTranslations = {
                english: displayedLanguages.english && verse.nkjv,
                amharic_script: displayedLanguages.amharic_script && verse.am54,
                spanish: displayedLanguages.spanish && verse.rgv
            };
            const activeLanguageCount = Object.values(activePsalmTranslations).filter(Boolean).length;
            if (activeLanguageCount === 0) return;

            const prayerCard = document.createElement('div');
            prayerCard.classList.add('prayer-card', 'psalm-card');

            const prayerCardMainContent = document.createElement('div');
            prayerCardMainContent.classList.add('prayer-card-main-content');

            const prayerContent = document.createElement('div');
            prayerContent.classList.add('prayer-content', displayOptions.layout === 'row' ? 'layout-row' : 'layout-column');
            if (displayOptions.languageColors !== 'off') {
                prayerContent.classList.add('colored-languages');
            }
            prayerContent.dataset.activeColumns = activeLanguageCount;

            const langKeyToPsalmVerseProp = {
                'english': 'nkjv',
                'amharic_script': 'am54',
                'spanish': 'rgv'
            };
            const langKeyToIsEthiopic = {
                'english': false,
                'amharic_script': true,
                'spanish': false
            };
            const langKeyToLangName = {
                'english': 'English',
                'amharic_script': 'አማርኛ',
                'spanish': 'Español'
            };

            languageOrder.forEach(langKey => {
                const prop = langKeyToPsalmVerseProp[langKey];
                if (prop && activePsalmTranslations[langKey]) {
                    prayerContent.appendChild(createPsalmVerseSection(langKeyToLangName[langKey], verse[prop], verse.verseNum, langKeyToIsEthiopic[langKey], langKey));
                }
            });

            prayerCardMainContent.appendChild(prayerContent);

            const prayerFooter = document.createElement('div');
            prayerFooter.classList.add('prayer-footer');

            const prayerLabel = document.createElement('div');
            prayerLabel.classList.add('prayer-label');
            let labelText;
            if (lxxChapter == verse.mtChapter) {
                labelText = `Psalm ${lxxChapter}:${verse.verseNum}`;
            } else {
                labelText = `Psalm ${lxxChapter} (${verse.mtChapter}):${verse.verseNum}`;
            }
            prayerLabel.textContent = labelText;
            prayerFooter.appendChild(prayerLabel);

            const prayerActions = document.createElement('div');
            prayerActions.classList.add('prayer-actions');

            const copyButton = document.createElement('button');
            copyButton.classList.add('share-btn');
            copyButton.innerHTML = shareIconSVG;
            copyButton.title = 'Copy visible languages';
            copyButton.addEventListener('click', () => copyPsalm(verse, lxxChapter));
            prayerActions.appendChild(copyButton);

            const enterSlidesBtn = document.createElement('button');
            enterSlidesBtn.classList.add('enter-slides-mode-btn');
            enterSlidesBtn.innerHTML = `<svg class="pres-mode-icon-slides" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg>`;
            enterSlidesBtn.title = 'Enter Slides Mode';
            enterSlidesBtn.addEventListener('click', (event) => {
                const clickedCard = event.currentTarget.closest('.prayer-card');
                const allCards = Array.from(prayerDisplay.querySelectorAll('.prayer-card, .section-title'));
                const cardIndex = allCards.indexOf(clickedCard);
                if (cardIndex !== -1) {
                    currentSlideIndex = cardIndex;
                    togglePresentationMode();
                }
            });
            prayerActions.appendChild(enterSlidesBtn);

            const exitSlidesBtn = document.createElement('button');
            exitSlidesBtn.classList.add('exit-slides-mode-btn');
            exitSlidesBtn.innerHTML = '&times;';
            exitSlidesBtn.title = 'Exit Slides Mode';
            exitSlidesBtn.addEventListener('click', togglePresentationMode);
            prayerActions.appendChild(exitSlidesBtn);

            prayerFooter.appendChild(prayerActions);
            prayerCardMainContent.appendChild(prayerFooter);
            prayerCard.appendChild(prayerCardMainContent);
            prayerDisplay.appendChild(prayerCard);
        });

        // After rendering all verses for a psalm, add the doxology response
        if (doxologyPrayer) {
            const doxologyCard = createPrayerCardElement(doxologyPrayer, -1);
            prayerDisplay.appendChild(doxologyCard);
        }
    }
}


/**
 * Renders the selected Songs of the Prophets.
 * This function is now more robust and handles different Bible data structures and reference types.
 */
function renderSelectedProphetSongs(addSectionTitleCallback) {
    if (selectedProphetSongs.length === 0) return;

    selectedProphetSongs.forEach(songKey => {
        const song = prophetSongs.find(s => s.key === songKey);
        if (!song) return;

        addSectionTitleCallback(song.name, song.verseRange || '');

        if (song.refs.prayerKey) {
            // This is a manually added prayer from songs.js
            if (typeof songs !== 'undefined') {
                const songVerses = songs.filter(p => p.chapter === 'ProphetSong' && p.stanza === song.refs.prayerKey);

                if (songVerses && songVerses.length > 0) {
                    songVerses.forEach(verseData => {
                        const versePrayer = {
                            english: verseData.english || '',
                            spanish: verseData.spanish || '',
                            amharic_script: verseData.amharic_script || '',
                            geez_script: verseData.geez_script || '',
                            geez_phonetic: verseData.geez_phonetic || '',
                            tigrinya_script: verseData.tigrinya_script || '',
                            tigrinya_phonetic: verseData.tigrinya_phonetic || '',
                            reference: verseData.reference,
                            chapter: verseData.chapter,
                            stanza: verseData.stanza,
                            instruction: verseData.instruction
                        };

                        // Extract verse number from the 'reference' string
                        const verseMatch = (versePrayer.reference || '').match(/:(\d+)$/);
                        if (verseMatch && verseMatch[1]) {
                            versePrayer.verseNum = verseMatch[1];
                        }

                        const prayerCard = createPrayerCardElement(versePrayer, -1);
                        prayerDisplay.appendChild(prayerCard);
                    });
                }
            } else {
                console.error("The 'songs.js' file is not loaded. Cannot render this prayer.");
            }

        } else if (bibleData.loaded) {
            // This is a song from the Bible, requires fetching verses
            let allVerses = [];
            const nkjvRef = song.refs.nkjv;
            const rgvRef = song.refs.rgv;
            const am54Ref = song.refs.am54;

            const nkjvVerses = bibleData.nkjv ? bibleData.nkjv.filter(v => {
                if (!nkjvRef) return false;
                if (nkjvRef.chapters) {
                    return v.book === nkjvRef.book && nkjvRef.chapters.includes(v.chapter);
                } else if (nkjvRef.chapter && nkjvRef.verses) {
                    return v.book === nkjvRef.book && v.chapter === nkjvRef.chapter && v.verse >= nkjvRef.verses.start && v.verse <= nkjvRef.verses.end;
                }
                return false;
            }) : [];

            const rgvVerses = bibleData.rgv?.verses ? bibleData.rgv.verses.filter(v => {
                if (!rgvRef) return false;
                if (rgvRef.chapters) {
                    return v.book_name === rgvRef.book && rgvRef.chapters.includes(v.chapter);
                } else if (rgvRef.chapter && rgvRef.verses) {
                    return v.book_name === rgvRef.book && v.chapter === rgvRef.chapter && v.verse >= rgvRef.verses.start && v.verse <= rgvRef.verses.end;
                }
                return false;
            }) : [];

            let am54Verses = [];
            if (bibleData.am54?.books && am54Ref) {
                const am54Book = bibleData.am54.books.find(b => b.title === am54Ref.book);
                if (am54Book?.chapters) {
                    am54Verses = am54Book.chapters
                        .filter(c => (am54Ref.chapters && am54Ref.chapters.includes(c.chapter)) || c.chapter === am54Ref.chapter)
                        .flatMap(c => (c.verses || []).map((text, verseIndex) => ({
                        verse: verseIndex + 1,
                        text: text,
                        chapter: c.chapter
                    })))
                        .filter(v => !am54Ref.verses || (v.verse >= am54Ref.verses.start && v.verse <= am54Ref.verses.end));
                }
            }
            // Merge verses from different translations
            const verseMap = new Map();

            const populateMap = (verses, langKey) => {
                if (!verses) return;
                verses.forEach(v => {
                    const uniqueKey = `${v.chapter}-${v.verse}`;
                    if (!verseMap.has(uniqueKey)) {
                        verseMap.set(uniqueKey, { verseNum: v.verse, chapter: v.chapter });
                    }
                    verseMap.get(uniqueKey)[langKey] = v.text;
                });
            };

            populateMap(nkjvVerses, 'nkjv');
            populateMap(rgvVerses, 'rgv');
            populateMap(am54Verses, 'am54');

            allVerses = Array.from(verseMap.values()).sort((a, b) => a.chapter - b.chapter || a.verseNum - b.verseNum);

            // Render verse cards
            allVerses.forEach(verse => {
                if (!verse.nkjv && !verse.rgv && !verse.am54) return;
                const versePrayer = {
                    english: verse.nkjv || '',
                    spanish: verse.rgv || '',
                    amharic_script: verse.am54 || '',
                    geez_script: '',
                    geez_phonetic: '',
                    tigrinya_script: '',
                    tigrinya_phonetic: '',
                    verseNum: verse.verseNum,
                    reference: `${nkjvRef.bookName} ${verse.chapter}:${verse.verseNum}`,
                    chapter: 'ProphetSong',
                    stanza: song.key
                };

                const prayerCard = createPrayerCardElement(versePrayer, -1);
                prayerDisplay.appendChild(prayerCard);
            });
        }
    });
}


function createPsalmVerseSection(langName, text, verseNum, isEthiopic = false, langKey) {
    const langSection = document.createElement('div');
    langSection.classList.add('language-section');
    langSection.dataset.langKey = langKey;

    const langHeader = document.createElement('h4');
    langHeader.textContent = langName;
    if (isEthiopic) langHeader.classList.add('ethiopic-label');
    if (!displayOptions.showLanguageLabels) langHeader.classList.add('hidden');

    const langText = document.createElement('p');
    langText.classList.add('language-text');
    if (isEthiopic) langText.classList.add('lang-ethiopic-script');

    const sup = document.createElement('sup');
    sup.textContent = verseNum;
    langText.appendChild(sup);
    langText.innerHTML += ` ${text || ''}`;

    langSection.appendChild(langHeader);
    langSection.appendChild(langText);

    return langSection;
}


// --- Event Listeners ---
sidebarToggle.addEventListener('click', () => {
    isSidebarCollapsed = !isSidebarCollapsed;
    sidebar.classList.toggle('collapsed');
    applyTheme();
    saveSettings();
});

sidebarBackdrop.addEventListener('click', collapseSidebar);

// --- Prevent sliders from closing sidebar when dragging ---
const stopSliderEventPropagation = (event) => {
    event.stopPropagation();
};

// We define the events and attach them with the passive option.
['mousedown', 'pointerdown'].forEach(eventType => {
    geezFontSizeSlider.addEventListener(eventType, stopSliderEventPropagation);
    englishFontSizeSlider.addEventListener(eventType, stopSliderEventPropagation);
});
geezFontSizeSlider.addEventListener('touchstart', stopSliderEventPropagation, { passive: true });
englishFontSizeSlider.addEventListener('touchstart', stopSliderEventPropagation, { passive: true });

// For touchmove, we add the { passive: true } option to resolve the violation.
// This tells the browser our listener won't block scrolling, fixing the conflict.
['touchmove', 'pointermove'].forEach(eventType => {
    geezFontSizeSlider.addEventListener(eventType, stopSliderEventPropagation, { passive: true });
    englishFontSizeSlider.addEventListener(eventType, stopSliderEventPropagation, { passive: true });
});



themeToggle.addEventListener('click', () => {
    currentTheme.mode = currentTheme.mode === 'light' ? 'dark' : 'light';
    applyTheme();
    saveSettings();
});

paletteSelector.addEventListener('change', (event) => {
    currentTheme.palette = event.target.value;
    applyTheme();
    saveSettings();
});

geezFontSizeSlider.addEventListener('input', () => {
    fontSizes.geez = geezFontSizeSlider.value;
    if (fontSizes.locked) {
        fontSizes.english = geezFontSizeSlider.value;
        englishFontSizeSlider.value = geezFontSizeSlider.value;
    }
    updateFontStylesAndPreview();
    clearTimeout(geezFontSizeSlider.timer);
    geezFontSizeSlider.timer = setTimeout(saveSettings, 300);
});

englishFontSizeSlider.addEventListener('input', () => {
    fontSizes.english = englishFontSizeSlider.value;
    if (fontSizes.locked) {
        fontSizes.geez = englishFontSizeSlider.value;
        geezFontSizeSlider.value = englishFontSizeSlider.value;
    }
    updateFontStylesAndPreview();
    clearTimeout(englishFontSizeSlider.timer);
    englishFontSizeSlider.timer = setTimeout(saveSettings, 300);
});


// --- Font Size Sliders ---
const handleGeezFontChange = (event) => {
    const newSize = event.target.value;
    document.documentElement.style.setProperty('--geez-font-size', `${newSize}px`);
    fontSizes.geez = newSize;
    if (fontSizes.locked) {
        document.documentElement.style.setProperty('--english-font-size', `${newSize}px`);
        englishFontSizeSlider.value = newSize;
        fontSizes.english = newSize;
    }
    saveSettings();
};

const handleEnglishFontChange = (event) => {
    const newSize = event.target.value;
    document.documentElement.style.setProperty('--english-font-size', `${newSize}px`);
    fontSizes.english = newSize;
    if (fontSizes.locked) {
        document.documentElement.style.setProperty('--geez-font-size', `${newSize}px`);
        geezFontSizeSlider.value = newSize;
        fontSizes.geez = newSize;
    }
    saveSettings();
};

// Apply debounce with a 50ms delay
geezFontSizeSlider.addEventListener('input', debounce(handleGeezFontChange, 50));
englishFontSizeSlider.addEventListener('input', debounce(handleEnglishFontChange, 50));



lockFontSizesToggle.addEventListener('change', () => {
    fontSizes.locked = lockFontSizesToggle.checked;
    saveSettings();
});

boldTextToggle.addEventListener('change', () => {
    displayOptions.boldText = boldTextToggle.checked;
    body.classList.toggle('bold-text', displayOptions.boldText);
    saveSettings();
});

ethiopicFontSelect.addEventListener('change', () => {
    updateFontStylesAndPreview();
    saveSettings();
});

englishFontSelect.addEventListener('change', () => {
    updateFontStylesAndPreview();
    saveSettings();
});

servantNameInput.addEventListener('input', () => {
    customNames.servant = servantNameInput.value;
    saveSettings();
    renderPrayers();
});

patriarchNameInput.addEventListener('input', () => {
    customNames.patriarch = patriarchNameInput.value;
    saveSettings();
    renderPrayers();
});

bishopNameInput.addEventListener('input', () => {
    customNames.bishop = bishopNameInput.value;
    saveSettings();
    renderPrayers();
});

countryNameInput.addEventListener('input', () => {
    customNames.country = countryNameInput.value;
    saveSettings();
    renderPrayers();
});

headOfStateInput.addEventListener('input', () => {
    customNames.headOfState = headOfStateInput.value;
    saveSettings();
    renderPrayers();
});


languageTogglesDiv.addEventListener('change', (event) => {
    if (event.target.type === 'checkbox') {
        const langKey = event.target.value;
        if (displayedLanguages.hasOwnProperty(langKey)) {
            displayedLanguages[langKey] = event.target.checked;
        }
        checkAndEnforceLayoutRules();
        saveSettings();
        updateLanguageOrderList();
        smoothRender();
    }
});


function toggleLayout() {
    displayOptions.layout = (displayOptions.layout === 'row') ? 'column' : 'row';
    updateAllTogglesInSettingsPanel();
    smoothRender();
    saveSettings();
}

function togglePresentationMode() {
    const isEnteringSlides = displayOptions.presentationMode !== 'slides';
    displayOptions.presentationMode = isEnteringSlides ? 'slides' : 'scroll';

    if (isEnteringSlides) {
        displayOptions.showPrayerLabels = true; // Ensure labels are on for context
        collapseSidebar();
    }

    applyTheme();
    renderPrayers();
    updateAllTogglesInSettingsPanel();
    saveSettings();

    if (!isEnteringSlides) {
        // Exiting slides mode: scroll to the previously active card
        setTimeout(() => {
            const cardToView = prayerDisplay.querySelector(`.prayer-card[data-prayer-index="${currentSlideIndex}"]`);
            if (cardToView) {
                cardToView.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100); // A slight delay ensures the DOM is ready
    }
}


// Psalm Selector Listener using event delegation
psalmSelectorContainer.addEventListener('change', (event) => {
    if (event.target.type === 'checkbox') {
        if (event.target.id === 'select-all-psalms') {
            const isChecked = event.target.checked;
            const checkboxes = psalmSelectorContainer.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => {
                if (cb.id !== 'select-all-psalms') {
                    cb.checked = isChecked;
                }
            });
        }

        selectedPsalms = Array.from(psalmSelectorContainer.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => Number(cb.value))
            .filter(value => !isNaN(value) && value > 0); // Filter out NaN from select-all

        updatePsalmSummary();
        saveSettings();
        smoothRender();
    }
});

clearPsalmsButton.addEventListener('click', () => {
    selectedPsalms = [];
    document.querySelectorAll('#psalm-selector-container input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    updatePsalmSummary();
    saveSettings();
    renderPrayers();
});

prophetSongsSelectorContainer.addEventListener('change', (event) => {
    if (event.target.type === 'checkbox') {
        if (event.target.id === 'select-all-prophet-songs') {
            const isChecked = event.target.checked;
            const checkboxes = prophetSongsSelectorContainer.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => {
                if (cb.id !== 'select-all-prophet-songs') {
                    cb.checked = isChecked;
                }
            });
        }

        selectedProphetSongs = Array.from(prophetSongsSelectorContainer.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.value)
            .filter(value => value !== 'on'); // Filter out the 'on' value from the select-all checkbox

        saveSettings();
        smoothRender();
    }
});

clearProphetSongsButton.addEventListener('click', () => {
    selectedProphetSongs = [];
    document.querySelectorAll('#prophet-songs-selector-container input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    saveSettings();
    renderPrayers();
});


// Display Options Listeners
presentationModeToggleHeader.addEventListener('click', () => {
    currentSlideIndex = 0; // Reset to start when using the header toggle
    togglePresentationMode();
});
layoutToggleHeader.addEventListener('click', toggleLayout);

expandCollapseAllButton.addEventListener('click', () => {
    areAllSectionsCollapsed = !areAllSectionsCollapsed;
    const sections = document.querySelectorAll('.section-title.collapsible');
    sections.forEach(section => {
        const title = section.textContent;
        const isCollapsed = areAllSectionsCollapsed;
        section.classList.toggle('collapsed', isCollapsed);
        collapsedSections[title] = isCollapsed;

        let nextEl = section.nextElementSibling;
        while (nextEl && !nextEl.classList.contains('section-title')) {
            nextEl.style.display = isCollapsed ? 'none' : '';
            nextEl = nextEl.nextElementSibling;
        }
    });
    updateExpandCollapseAllIcon();
    saveSettings();
});

showPrayerLabelsToggle.addEventListener('change', () => {
    displayOptions.showPrayerLabels = showPrayerLabelsToggle.checked;
    renderPrayers();
    saveSettings();
});

showLanguageLabelsToggle.addEventListener('change', () => {
    displayOptions.showLanguageLabels = showLanguageLabelsToggle.checked;
    renderPrayers();
    saveSettings();
});

showSpeakerLabelsToggle.addEventListener('change', () => {
    displayOptions.showSpeakerLabels = showSpeakerLabelsToggle.checked;
    renderPrayers();
    saveSettings();
});

showRubricationToggle.addEventListener('change', () => {
    displayOptions.showRubrication = showRubricationToggle.checked;
    applyTheme();
    renderPrayers();
    saveSettings();
});

languageColorCodingSelect.addEventListener('change', () => {
    displayOptions.languageColors = languageColorCodingSelect.value;
    applyTheme();
    renderPrayers();
    saveSettings();
});


dynamicFontSizingToggle.addEventListener('change', () => {
    displayOptions.dynamicFontSizing = dynamicFontSizingToggle.checked;
    if (displayOptions.presentationMode === 'slides') {
        renderPrayers();
    }
    saveSettings();
});

slideTransitionSelect.addEventListener('change', () => {
    displayOptions.slideTransition = slideTransitionSelect.value;
    if (displayOptions.presentationMode === 'slides') {
        setupSlides(); // Re-apply slide classes
    }
    saveSettings();
});

anglicizeNamesToggle.addEventListener('change', () => {
    displayOptions.anglicizeNames = anglicizeNamesToggle.checked;
    renderPrayers();
    saveSettings();
});

// Search Listeners
searchToggle.addEventListener('click', () => {
    header.classList.add('search-active');
    searchInput.focus();
});
searchClose.addEventListener('click', closeSearch);
searchInput.addEventListener('input', performSearch);

searchNext.addEventListener('click', () => {
    if (searchMatches.length === 0) return;
    currentMatchIndex = (currentMatchIndex + 1) % searchMatches.length;
    updateSearchMatches();
});

searchPrev.addEventListener('click', () => {
    if (searchMatches.length === 0) return;
    currentMatchIndex = (currentMatchIndex - 1 + searchMatches.length) % searchMatches.length;
    updateSearchMatches();
});


// Modal Listeners
function openModal(modal) {
    modal.style.display = 'block';
    modalBackdrop.style.display = 'block';
    body.style.overflow = 'hidden';
}

function closeModal() {
    helpModal.style.display = 'none';
    feedbackModal.style.display = 'none';
    modalBackdrop.style.display = 'none';
    body.style.overflow = 'auto';
}

helpButton.addEventListener('click', () => openModal(helpModal));
feedbackButton.addEventListener('click', () => openModal(feedbackModal));
modalBackdrop.addEventListener('click', closeModal);
document.querySelectorAll('.close-button').forEach(btn => btn.addEventListener('click', closeModal));

sendFeedbackButton.addEventListener('click', () => {
    const feedbackText = document.getElementById('feedback-textarea').value;
    if (feedbackText.trim()) {
        const mailtoLink = `mailto:vineofmary@gmail.com?subject=Feedback for Prayer App&body=${encodeURIComponent(feedbackText)}`;
        window.location.href = mailtoLink;
        showCopyNotification('Feedback sent!', 3000);
        closeModal();
    } else {
        alert('Please enter your feedback before sending.');
    }
});


// --- Drag and Drop Logic ---
let dragSrcEl = null;

function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.dataset.langKey);
    this.classList.add('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over');
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    languageOrderList.querySelectorAll('li').forEach(item => item.classList.remove('over'));
}

function handleDrop(e) {
    e.stopPropagation();
    if (dragSrcEl !== this) {
        const dragLangKey = e.dataTransfer.getData('text/plain');
        const dropLangKey = this.dataset.langKey;

        const currentVisibleOrder = languageOrder.filter(key => displayedLanguages[key]);
        const fromIndex = currentVisibleOrder.indexOf(dragLangKey);
        const toIndex = currentVisibleOrder.indexOf(dropLangKey);

        currentVisibleOrder.splice(fromIndex, 1);
        currentVisibleOrder.splice(toIndex, 0, dragLangKey);

        const newFullOrder = [...currentVisibleOrder];
        languageOrder.forEach(key => {
            if (!displayedLanguages[key]) newFullOrder.push(key);
        });

        languageOrder = newFullOrder;
        saveSettings();
        updateLanguageOrderList();
        smoothRender();
    }
    this.classList.remove('over');
    return false;
}


function addDragAndDropListeners() {
    languageOrderList.querySelectorAll('li').forEach(item => {
        item.addEventListener('dragstart', handleDragStart, false);
        item.addEventListener('dragenter', handleDragEnter, false);
        item.addEventListener('dragover', handleDragOver, false);
        item.addEventListener('dragleave', handleDragLeave, false);
        item.addEventListener('drop', handleDrop, false);
        item.addEventListener('dragend', handleDragEnd, false);
    });
}


// --- Swipe Gestures & Taps for Navigation ---
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e) {
    if (displayOptions.presentationMode === 'slides' && !e.target.closest('.sidebar')) {
        touchStartX = e.changedTouches[0].screenX;
        return;
    }
    if (e.target.closest('.sidebar:not(.collapsed)')) return;
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    if (touchStartX === 0) return;
    touchEndX = e.changedTouches[0].screenX;

    if (displayOptions.presentationMode === 'slides' && !e.target.closest('.sidebar')) {
        handleSlideSwipe();
    } else {
        handleSidebarSwipe();
    }
    touchStartX = 0;
    touchEndX = 0;
}

function handleSidebarSwipe() {
    if (touchEndX < touchStartX && (touchStartX - touchEndX) > 50) { // Swipe Left
        collapseSidebar();
    }
    if (touchEndX > touchStartX && (touchEndX - touchStartX) > 50) { // Swipe Right
        if (isSidebarCollapsed) {
            isSidebarCollapsed = false;
            sidebar.classList.remove('collapsed');
            applyTheme();
            saveSettings();
        }
    }
}

function handleSlideSwipe() {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
        nextSlide();
    } else if (touchEndX - touchStartX > swipeThreshold) {
        prevSlide();
    }
}

mainContent.addEventListener('click', (e) => {
    if (displayOptions.presentationMode !== 'slides') return;
    if (e.target.closest('button, a, .info-panel, .info-toggle, .share-btn, .language-order-handle')) return;

    const rect = mainContent.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const oneThirdWidth = rect.width / 3;

    if (clickX < oneThirdWidth) {
        prevSlide();
    } else if (clickX > oneThirdWidth * 2) {
        nextSlide();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && displayOptions.presentationMode === 'slides') {
        togglePresentationMode();
        return;
    }

    if (displayOptions.presentationMode === 'slides') {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            prevSlide();
        }
    }
});

document.addEventListener('touchstart', handleTouchStart, { passive: true });
document.addEventListener('touchend', handleTouchEnd, { passive: true });


// --- Hide Header on Scroll ---
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    if (displayOptions.presentationMode === 'slides') {
        header.classList.remove('header-hidden');
        return;
    }

    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
        header.classList.add('header-hidden');
    } else {
        header.classList.remove('header-hidden');
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, false);

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', async () => {
    const splashScreen = document.getElementById('splash-screen');
    const appContainer = document.getElementById('app-container');

    if (sessionStorage.getItem('splashShown')) {
        splashScreen.classList.add('hidden');
        appContainer.classList.remove('hidden');
    } else {
        splashScreen.addEventListener('transitionend', () => {
            splashScreen.classList.add('hidden');
            appContainer.classList.remove('hidden');
            sessionStorage.setItem('splashShown', 'true');
        }, { once: true });

        splashScreen.style.opacity = '0';
    }

    await loadSettings(); // Ensure settings are loaded before anything else
    await loadBibleData(); // Load data on startup

    updatePsalmSummary();
    updateLanguageOrderList();
    applyTheme(); // Explicitly apply theme after settings are loaded
    renderPrayers();

    window.addEventListener('resize', () => {
        checkAndEnforceLayoutRules();
        if (displayOptions.presentationMode === 'slides') {
            adjustSlideFontSize();
        }
    });

    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then(reg => console.log('Service worker registered successfully', reg))
                .catch(err => console.log('Service worker registration failed: ', err));
        });
    }

    function renderServantsCorner() {
        // Force exit from slide mode to ensure this view is always a scrollable list
        if (displayOptions.presentationMode === 'slides') {
            displayOptions.presentationMode = 'scroll';
            applyTheme();
            updateAllTogglesInSettingsPanel();
            saveSettings();
        }
        // It's also crucial to clean up any lingering slide-specific classes/styles
        removeSlides();

        isServantsCornerActive = true;
        prayerDisplay.innerHTML = '';

        const headerContent = document.querySelector('.header-content');
        const headerActions = document.querySelector('.header-actions');

        // Hide original header content, but store it
        headerContent.style.display = 'none';
        headerActions.style.display = 'none';

        // Create a new temporary header
        const servantsHeader = document.createElement('div');
        servantsHeader.id = 'servants-header';
        servantsHeader.style.display = 'flex';
        servantsHeader.style.justifyContent = 'space-between';
        servantsHeader.style.alignItems = 'center';
        servantsHeader.style.width = '100%';
        servantsHeader.style.padding = '0 1rem';


        const backButton = document.createElement('button');
        backButton.innerHTML = '←';
        backButton.style.fontSize = '1rem';
        backButton.style.fontWeight = 'bold';
        backButton.style.cursor = 'pointer';
        backButton.style.border = 'none';
        backButton.style.background = 'none';
        backButton.style.color = 'var(--text-color)';
        backButton.addEventListener('click', goBackToMainView);

        const newTitle = document.createElement('h1');
        newTitle.textContent = "Prayers for Servants | ጸሎታት ለአግብርት";
        newTitle.classList.add('ethiopic-label');


        servantsHeader.appendChild(backButton);
        servantsHeader.appendChild(newTitle);
        
        // Add a placeholder on the right to keep title centered
        const placeholder = document.createElement('div');
        placeholder.style.width = backButton.offsetWidth + 'px';
        servantsHeader.appendChild(placeholder);


        header.insertBefore(servantsHeader, header.firstChild);


        servantsPrayers.forEach(prayer => {
            const prayerCard = document.createElement('div');
            prayerCard.classList.add('prayer-card');

            const prayerCardMainContent = document.createElement('div');
            prayerCardMainContent.classList.add('prayer-card-main-content');

            const prayerContent = document.createElement('div');
            prayerContent.classList.add('prayer-content', 'layout-row');

            const langSection = document.createElement('div');
            langSection.classList.add('language-section');

            const langHeader = document.createElement('h4');
            langHeader.textContent = prayer.title;
            langHeader.style.borderBottom = 'none';
            langHeader.style.marginBottom = '1.5rem'; // Increased margin
            langHeader.style.fontSize = '1.2rem'; // Larger font size
            langHeader.style.fontWeight = 'bold'; // Bold text
            langHeader.style.color = 'var(--accent-color)'; // Accent color


            const langText = document.createElement('p');
            langText.classList.add('language-text');
            langText.style.whiteSpace = 'pre-wrap';
            langText.textContent = prayer.prayer.join('\n\n');

            const reference = document.createElement('p');
            reference.style.fontSize = '0.8rem';
            reference.style.fontStyle = 'italic';
            reference.style.opacity = '0.7';
            reference.style.marginTop = '1rem';
            reference.textContent = prayer.reference;

            langSection.appendChild(langHeader);
            langSection.appendChild(langText);
            langSection.appendChild(reference);
            prayerContent.appendChild(langSection);
            prayerCardMainContent.appendChild(prayerContent);
            prayerCard.appendChild(prayerCardMainContent);
            prayerDisplay.appendChild(prayerCard);
        });
    }

    function goBackToMainView() {
        isServantsCornerActive = false;

        const servantsHeader = document.getElementById('servants-header');
        if (servantsHeader) {
            servantsHeader.remove();
        }

        document.querySelector('.header-content').style.display = 'flex';
        document.querySelector('.header-actions').style.display = 'flex';

        renderPrayers();
    }


    bibleVerseSidebar.addEventListener('click', () => {
        collapseSidebar();
        setTimeout(renderServantsCorner, 350);
    });
});