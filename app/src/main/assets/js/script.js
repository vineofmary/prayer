// --- DOM Elements ---
const body = document.body;
// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyAu50q3NfDNaZUWsxU0-YIlql3bQsc6_QQ",
  authDomain: "mount-of-mercy.firebaseapp.com",
  projectId: "mount-of-mercy",
  storageBucket: "mount-of-mercy.firebasestorage.app",
  messagingSenderId: "974361367981",
  appId: "1:974361367981:web:752f9a6fb815e208f4fd24"
};

// Initialize Firebase (Compat)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- Application Logic ---
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
const unofficialLanguageTogglesDiv = document.getElementById('unofficial-language-toggles');
const unofficialLanguagesSection = document.getElementById('unofficial-languages-section');
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
const paragraphModeToggle = document.getElementById('paragraph-mode');
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
const ephremStoryModal = document.getElementById('ephrem-story-modal');
const ephremStoryInfoBtn = document.getElementById('ephrem-story-info-btn');
const closeEphremModal = document.getElementById('close-ephrem-modal');
const eusebiusModal = document.getElementById('eusebius-modal');
const eusebiusInfoBtn = document.getElementById('eusebius-info-btn');
const closeEusebiusModal = document.getElementById('close-eusebius-modal');
const scribeLoginModal = document.getElementById('scribe-login-modal');
const scribeEditorModal = document.getElementById('scribe-editor-modal');
const modalBackdrop = document.getElementById('modal-backdrop');

// Scribe State
let isScribeLoggedIn = false;
let isScribeModeActive = false;
let currentScribeUser = null;
let prayersFromFirestore = []; // Cache for Firestore data
const sendFeedbackButton = document.getElementById('send-feedback-button');
const fontPreview = document.getElementById('font-preview');
const psalmSelectorContainer = document.getElementById('psalm-selector-container');
const psalmSummary = document.getElementById('psalm-summary');
const clearPsalmsButton = document.getElementById('clear-psalms-button');
const prophetSongsSelectorContainer = document.getElementById('prophet-songs-selector-container');
const prophetSongsSummary = document.getElementById('prophet-songs-summary');
const clearProphetSongsButton = document.getElementById('clear-prophet-songs-button');
const kidaseGatedSection = document.getElementById('kidase-gated-section');
const kidaseModeToggle = document.getElementById('kidase-mode-toggle');
const kidaseSettings = document.getElementById('kidase-settings');
const anaphoraSelector = document.getElementById('anaphora-selector');
const covenantPrayerSelector = document.getElementById('covenant-prayer-selector');
const quietPrayersVisibilitySelector = document.getElementById('quiet-prayers-visibility');
const roleHighlightingSelector = document.getElementById('role-highlighting');
const servantNameInput = document.getElementById('servant-name-input');
const patriarchNameInput = document.getElementById('patriarch-name-input');
const bishopNameInput = document.getElementById('bishop-name-input');
const attendingBishopsInput = document.getElementById('attending-bishops-input');
const churchNameInput = document.getElementById('church-name-input');
const countryNameInput = document.getElementById('country-name-input');
const headOfStateInput = document.getElementById('head-of-state-input');
const anglicizeNamesToggle = document.getElementById('anglicize-names-toggle');
const bibleVerseSidebar = document.querySelector('.bible-verse-sidebar');

// Kidase Lectionary Inputs
const kidasePaulineRefInput = document.getElementById('kidase-pauline-ref');
const kidaseUniversalRefInput = document.getElementById('kidase-universal-ref');
const kidaseActsRefInput = document.getElementById('kidase-acts-ref');
const kidasePsalmRefInput = document.getElementById('kidase-psalm-ref');
const kidaseGospelRefInput = document.getElementById('kidase-gospel-ref');
const setTodayKidaseReadingsButton = document.getElementById('set-today-kidase-readings');


// --- State Variables ---
const SETTINGS_VERSION = '4.2.0'; // Update this to force refresh load settings
let currentTheme = {};
let isSidebarCollapsed = false;
let isServantsCornerActive = false;
let displayOptions = {};
let displayedLanguages = {};
let fontSizes = {};
let selectedPsalms = [];
let selectedProphetSongs = [];
let selectedSeatatLectionaryDay = 'None';
let selectedWidaseMaryamDay = 'All';
let isKidaseModeActive = false;
let selectedAnaphora = 'apostles';
let selectedCovenantPrayer = 'none';
let quietPrayersVisibility = 'all';
let roleHighlighting = 'none';
let kidaseLectionaryRefs = {
    pauline: 'Romans 1:1-7',
    universal: '1 Peter 1:1-5',
    acts: 'Acts 1:1-8',
    psalm: 'Psalm 1:1-2',
    gospel: 'John 1:1-5'
};
let customNames = {};
let bibleData = { nkjv: null, am54: null, rgv: null, geez_psalms: null, coptic: null, loaded: false };

// --- Language Registry ---
const LANGUAGE_REGISTRY = {
    // Main Section
    'english': { name: 'English', category: 'main', isAuto: false },
    'geez_script': { name: 'ግእዝ (Ge\'ez)', category: 'main', isAuto: false, isEthiopic: true },
    'geez_phonetic': { name: 'Ge\'ez Phonetic', category: 'main', isAuto: false },
    'amharic_script': { name: 'አማርኛ (Amharic)', category: 'main', isAuto: false, isEthiopic: true },
    'amharic_phonetic': { name: 'Amharic Phonetic', category: 'main', isAuto: false },
    'oromoo': { name: 'ኦሮምኛ (Oromo)**', category: 'main', isAuto: false, isEthiopic: true, isSeekingScribe: true },
    'tigrinya_script': { name: 'ትግርኛ (Tigrinya)', category: 'main', isAuto: false, isEthiopic: true },
    'tigrinya_phonetic': { name: 'Tigrinya Phonetic', category: 'main', isAuto: false },
    'spanish': { name: 'Español (Spanish)*', category: 'main', isAuto: true }, 
    'coptic': { name: 'ϯⲙⲉⲧⲣⲉⲙⲛ̀ⲭⲏⲙⲓ (Coptic)', category: 'main', isAuto: false },
    'syriac': { name: 'ܣܘܪܝܝܐ (Syriac)**', category: 'main', isAuto: false, isSeekingScribe: true },
    'armenian': { name: 'Հայերեն (Armenian)**', category: 'main', isAuto: false, isSeekingScribe: true },
    
    // Phonetics (Main Section)
    // (Note: Already moved above for grouping but keeping IDs consistent)

    // Unofficial Section (Advanced)
    'french': { name: 'Français (French)*', category: 'unofficial', isAuto: true },
    'arabic': { name: 'العربية (Arabic)*', category: 'unofficial', isAuto: true },
    'greek': { name: 'Ελληνικά (Greek)*', category: 'unofficial', isAuto: true },
    'hebrew': { name: 'עברית (Hebrew)*', category: 'unofficial', isAuto: true },
    'malayalam': { name: 'മലയാളം (Malayalam)*', category: 'unofficial', isAuto: true }
};

const languageLabels = Object.fromEntries(
    Object.entries(LANGUAGE_REGISTRY).map(([id, cfg]) => [id, cfg.name])
);

let languageOrder = [
    'english', 'geez_script', 'amharic_script', 'oromoo', 'tigrinya_script', 
    'spanish', 'french', 'arabic', 'greek', 'hebrew', 'malayalam',
    'syriac', 'armenian', 'coptic',
    'geez_phonetic', 'amharic_phonetic', 'tigrinya_phonetic'
];
let searchMatches = [];
let currentMatchIndex = -1;
let currentSlideIndex = 0;
let areAllSectionsCollapsed = false;

function getSeatatLiturgicalDay() {
    const now = new Date();
    const hours = now.getHours();
    let dayIndex = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Liturgical day starts at 6 PM (18:00)
    if (hours >= 18) {
        dayIndex = (dayIndex + 1) % 7;
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
}

const BIBLE_BOOK_MAPPING = {
    '1 Thessalonians': { nkjv: 52, am54: '1ኛ ወደ ተሰሎንቄ ሰዎች', rgv: '1 Tesalonicenses' },
    '1 Peter': { nkjv: 60, am54: '1ኛ የጴጥሮስ መልእክት', rgv: '1 Pedro' },
    'Acts': { nkjv: 44, am54: 'የሐዋርያት ሥራ', rgv: 'Hechos' },
    'Matthew': { nkjv: 40, am54: 'የማቴዎስ ወንጌል', rgv: 'Mateo' },
    'Galatians': { nkjv: 48, am54: 'ወደ ገላትያ ሰዎች', rgv: 'Gálatas' },
    'Mark': { nkjv: 41, am54: 'የማርቆስ ወንጌል', rgv: 'Marcos' },
    'Ephesians': { nkjv: 49, am54: 'ወደ ኤፌሶን ሰዎች', rgv: 'Efesios' },
    '2 Peter': { nkjv: 61, am54: '2ኛ የጴጥሮስ መልእክት', rgv: '2 Pedro' },
    'Luke': { nkjv: 42, am54: 'የሉቃስ ወንጌል', rgv: 'Lucas' },
    '2 Corinthians': { nkjv: 47, am54: '2ኛ ወደ ቆሮንቶስ ሰዎች', rgv: '2 Corintios' },
    'Romans': { nkjv: 45, am54: 'ወደ ሮሜ ሰዎች', rgv: 'Romanos' },
    'Leviticus': { nkjv: 3, am54: 'ኦሪት ዘሌዋውያን', rgv: 'Levítico' },
    'Jeremiah': { nkjv: 24, am54: 'ትንቢተ ኤርምያስ', rgv: 'Jeremías' },
    'John': { nkjv: 43, am54: 'የዮሐንስ ወንጌል', rgv: 'Juan' },
    '1 Corinthians': { nkjv: 46, am54: '1ኛ ወደ ቆሮንቶስ ሰዎች', rgv: '1 Corintios' },
    '1 John': { nkjv: 62, am54: '1ኛ የዮሐንስ መልእክት', rgv: '1 Juan' },
    'Psalms': { nkjv: 19, am54: 'መዝሙረ ዳዊት', rgv: 'Salmos' }
};

const SEATAT_LECTIONARY_DATA = {
    'Monday': [
        { type: 'Pauline Epistle (1 Thessalonians 4:15-18) | መልእክተ ጳውሎስ ዘሰዓታት', book: '1 Thessalonians', chapter: 4, verses: '15-18' },
        { type: 'Universal Epistle (1 Peter 5:5-12) | መልእክተ ካልእ ዘሰዓታት', book: '1 Peter', chapter: 5, verses: '5-12' },
        { type: 'Acts of the Apostles (Acts 16:25-35) | ግብረ ሐዋርያት ዘሰዓታት', book: 'Acts', chapter: 16, verses: '25-35' },
        { type: 'Psalm (Psalm 1:2-3) | ምስባክ ዘሰዓታት', book: 'Psalms', chapter: 1, verses: '2-3', customEnglish: '[2] And in His law he meditates day and night. [3] He shall be like a tree planted by the rivers of water, that brings forth its fruit in its season.', customGeez: '[2] ወዘሕጎ ያነብብ መዕልተ ወሌሊተ። [3] ወየከውን ከመ ዕፅ እንተ ትክልት ኀበ ሙሓዘ ማይ፤ እንተ ትሁብ ፍሬሃ በበጊዜሃ፤' },
        { type: 'Gospel (Matthew 25:1-14) | ወንጌል ዘሰዓታት', book: 'Matthew', chapter: 25, verses: '1-14' }
    ],
    'Tuesday': [
        { type: 'Pauline Epistle (Galations 5:13-26) | መልእክተ ጳውሎስ ዘሰዓታት', book: 'Galatians', chapter: 5, verses: '13-26' },
        { type: 'Universal Epistle (1 Peter 1:13-25) | መልእክተ ካልእ ዘሰዓታት', book: '1 Peter', chapter: 1, verses: '13-25' },
        { type: 'Acts of the Apostles (Acts 5:17-31) | ግብረ ሐዋርያት ዘሰዓታት', book: 'Acts', chapter: 5, verses: '17-31' },
        { type: 'Psalm (Psalm 118:62-63) | ምስባክ ዘሰዓታት', book: 'Psalms', chapter: 118, verses: '62-63', customEnglish: '[62] At midnight I will rise to give thanks to You, Because of Your righteous judgments. [63] I am a companion of all who fear You...', customGeez: '[62] መንፍቀ ሌሊት እትነሣእ ከመ እግነይ ለከ፤ በእንተ ኵነኔ ጽድቅከ። [63] ከማሆሙ አነ ለኵሎሙ እለ ይፈርሁከ፤' },
        { type: 'Gospel (Mark 13:32-37) | ወንጌል ዘሰዓታት', book: 'Mark', chapter: 13, verses: '32-37' }
    ],
    'Wednesday': [
        { type: 'Pauline Epistle (Ephesians 6:10-21) | መልእክተ ጳውሎስ ዘሰዓታት', book: 'Ephesians', chapter: 6, verses: '10-21' },
        { type: 'Universal Epistle (2 Peter 2:9-22) | መልእክተ ካልእ ዘሰዓታት', book: '2 Peter', chapter: 2, verses: '9-22' },
        { type: 'Acts of the Apostles (Acts 12:1-12) | ግብረ ሐዋርያት ዘሰዓታት', book: 'Acts', chapter: 12, verses: '1-12' },
        { type: 'Psalm (Psalm 138:12) | ምስባክ ዘሰዓታት', book: 'Psalms', chapter: 138, verses: '12', customEnglish: 'Indeed, the darkness shall not hide from You, But the night shines as the day; The darkness and the light are both alike to You.', customGeez: 'እስመ ጽልመትኒ ኢይጸልም በኀቤከ፤ ወሌሊትኒ ብሩህ ከመ መዐልት፤ በአምጣነ ጽልመታ ከማሁ ብርሃነ።' },
        { type: 'Gospel (Luke 13:23-31) | ወንጌል ዘሰዓታት', book: 'Luke', chapter: 13, verses: '23-31' }
    ],
    'Thursday': [
        { type: 'Pauline Epistle (2 Corinthians 8:1-16) | መልእክተ ጳውሎስ ዘሰዓታት', book: '2 Corinthians', chapter: 8, verses: '1-16' },
        { type: 'Universal Epistle (1 Peter 4:12-19) | መልእክተ ካልእ ዘሰዓታት', book: '1 Peter', chapter: 4, verses: '12-19' },
        { type: 'Acts of the Apostles (Acts 16:35-40) | ግብረ ሐዋርያት ዘሰዓታት', book: 'Acts', chapter: 16, verses: '35-40' },
        { type: 'Psalm (Psalm 87:1-2) | ምስባክ ዘሰዓታት', book: 'Psalms', chapter: 87, verses: '1-2', customEnglish: '[1] O Lord, God of my salvation, I have cried out day and night before You. [2] Let my prayer come before You...', customGeez: '[1] እግዚአብሔር አምላከ መድኀኒትየ፤ ዕለትየ ጸራኅኩ ኀቤከ ወሌሊትየኒ ቅድሜከ። [2] ለትባእ ጸሎትየ ቅድሜከ፤' },
        { type: 'Gospel (Matt 24:36-51) | ወንጌል ዘሰዓታት', book: 'Matthew', chapter: 24, verses: '36-51' }
    ],
    'Friday': [
        { type: 'Pauline Epistle (Romans 13:11-14) | መልእክተ ጳውሎስ ዘሰዓታት', book: 'Romans', chapter: 13, verses: '11-14' },
        { type: 'Universal Epistle (2 Peter 3:8-14) | መልእክተ ካልእ ዘሰዓታት', book: '2 Peter', chapter: 3, verses: '8-14' },
        { type: 'Acts of the Apostles (Acts 8:26-40) | ግብረ ሐዋርያት ዘሰዓታት', book: 'Acts', chapter: 8, verses: '26-40' },
        { type: 'Psalm (Psalm 118:55-56) | ምስባክ ዘሰዓታት', book: 'Psalms', chapter: 118, verses: '55-56', customEnglish: '[55] I remember Your name in the night, O Lord, And I keep Your law. [56] This has become mine...', customGeez: '[55] ተዘከርኩ በሌሊት ስመከ እግዚኦ፤ ወዐቀብኩ ሕገከ። [56] ወይእቲ ኮነተኒ፤' },
        { type: 'Gospel (Luke 12:35-49) | ወንጌል ዘሰዓታት', book: 'Luke', chapter: 12, verses: '35-49' }
    ],
    'Saturday': [
        { type: 'Torah (Leviticus 23:1-4) | ኦሪት ዘሰዓታት', book: 'Leviticus', chapter: 23, verses: '1-4' },
        { type: 'Prophecy (Jeremiah 17:26-27) | ትንቢት ዘሰዓታት', book: 'Jeremiah', chapter: 17, verses: '26-27' },
        { type: 'Acts of the Apostles (Acts 17:2-5) | ግብረ ሐዋርያት ዘሰዓታት', book: 'Acts', chapter: 17, verses: '2-5' },
        { type: 'Psalm (Psalm 133:2-3) | ምስባክ ዘሰዓታት', book: 'Psalms', chapter: 133, verses: '2-3', customEnglish: '[2] Lift up your hands in the sanctuary, and bless the Lord. [3] The Lord who made heaven and earth bless you from Zion!', customGeez: '[2] በሌሊት አንሥኡ እደዊክሙ በቤተ መቅደስ፤ ወባርክዎ ለእግዚአብሔር። [3] ይባርከከ እግዚአብሔር እምጽዮን፤' },
        { type: 'Gospel (John 5:5-23) | ወንጌል ዘሰዓታት', book: 'John', chapter: 5, verses: '5-23' }
    ],
    'Sunday': [
        { type: 'Pauline Epistle (1 Corinthians 15:51-16:3) | መልእክተ ጳውሎስ ዘሰዓታት', book: '1 Corinthians', chapter: 15, verses: '51-58', extra: { book: '1 Corinthians', chapter: 16, verses: '1-3' } },
        { type: 'Universal Epistle (1 John 1:1-10) | መልእክተ ካልእ ዘሰዓታት', book: '1 John', chapter: 1, verses: '1-10' },
        { type: 'Acts of the Apostles (Acts 20:7-12) | ግብረ ሐዋርያት ዘሰዓታት', book: 'Acts', chapter: 20, verses: '7-12' },
        { type: 'Psalm (Psalm 125:2) | ምስባክ ዘሰዓታት', book: 'Psalms', chapter: 125, verses: '2', customEnglish: 'Then our mouth was filled with laughter, And our tongue with singing. Then they said among the nations...', customGeez: 'አሜሃ መልአ ፍሥሓ አፉነ፤ ወተሐሥየ ልሳንነ፤ አሜሃ ይቤሉ አሕዛብ፦' },
        { type: 'Gospel (John 3:1-22) | ወንጌል ዘሰዓታት', book: 'John', chapter: 3, verses: '1-22' }
    ]
};

const prophetSongs = [
    { key: 'songOfSongs', author: 'Solomon', name: 'Song of Songs of King Solomon | ማሓለየ ማሓለይ ዘሰሎሞን', verseRange: '(Songs of Songs 1:1-5:16)', time: 'Saturday', purpose: 'Spiritual communion and expression of divine love.', refs: { nkjv: { book: 22, bookName: 'Song of Solomon', chapters: [1, 2, 3, 4, 5] }, rgv: { book: 'Canción de canciones', chapters: [1, 2, 3, 4, 5] }, am54: { book: 'መኃልየ መኃልይ ዘሰሎሞን', chapters: ['1', '2', '3', '4', '5'] } } },
    { key: 'firstSongOfMoses', author: 'Moses', name: 'First Song of Moses the Prophet | ጸሎተ ሙሴ ቀዳማዊ', verseRange: '(Exodus 15:1–19)', time: 'Monday – 9 a.m.', purpose: 'For sickness, hopelessness, and feeling of weakness.', refs: { nkjv: { book: 2, bookName: 'Exodus', chapter: 15, verses: { start: 1, end: 19 } }, rgv: { book: 'Éxodo', chapter: 15, verses: { start: 1, end: 19 } }, am54: { book: 'ኦሪት ዘጸአት', chapter: '15', verses: { start: 1, end: 19 } } } },
    { key: 'secondSongOfMoses', author: 'Moses', name: 'Second Song of Moses the Prophet | ጸሎተ ሙሴ ካልእ', verseRange: '(Deuteronomy 32:1–21)', time: 'Monday – Noon', purpose: 'For sickness, hopelessness, and feeling of weakness.', refs: { nkjv: { book: 5, bookName: 'Deuteronomy', chapter: 32, verses: { start: 1, end: 21 } }, rgv: { book: 'Deuteronomio', chapter: 32, verses: { start: 1, end: 21 } }, am54: { book: 'ኦሪት ዘዳግም', chapter: '32', verses: { start: 1, end: 21 } } } },
    { key: 'thirdSongOfMoses', author: 'Moses', name: 'Third Song of Moses the Prophet | ጸሎተ ሙሴ ሣልስ', verseRange: '(Deuteronomy 32:22–43)', time: 'Monday – 3 p.m.', purpose: 'For sickness, hopelessness, feeling of weakness; also for safe maternity.', refs: { nkjv: { book: 5, bookName: 'Deuteronomy', chapter: 32, verses: { start: 22, end: 43 } }, rgv: { book: 'Deuteronomio', chapter: 32, verses: { start: 22, end: 43 } }, am54: { book: 'ኦሪት ዘዳግም', chapter: '32', verses: { start: 22, end: 43 } } } },
    { key: 'prayerOfHannah', author: 'Hannah', name: 'Prayer of Hannah the Mother of Samuel the Prophet | ጸሎተ ሐና እመ ሳሙኤል ነቢይ', verseRange: '(1 Kingdoms 2:1-10 LXX, 1 Samuel 2:1–10 NKJV)', time: 'Tuesday – 9 a.m.', purpose: 'For safe maternity and for sudden sickness.', refs: { nkjv: { book: 9, bookName: '1 Samuel', chapter: 2, verses: { start: 1, end: 10 } }, rgv: { book: '1 Samuel', chapter: 2, verses: { start: 1, end: 10 } }, am54: { book: 'መጽሐፈ ሳሙኤል ቀዳማዊ', chapter: '2', verses: { start: 1, end: 10 } } } },
    { key: 'prayerOfHezekiah', author: 'Hezekiah', name: 'Prayer of King Hezekiah | ጸሎተ ሕዝቅያስ', verseRange: '(Isaiah 38:10–20)', time: 'Tuesday – Noon', purpose: 'For sudden sickness, for safe maternity, and for trouble in finding missing property or ideas.', refs: { nkjv: { book: 23, bookName: 'Isaiah', chapter: 38, verses: { start: 10, end: 20 } }, rgv: { book: 'Isaías', chapter: 38, verses: { start: 10, end: 20 } }, am54: { book: 'ትንቢተ ኢሳይያስ', chapter: '38', verses: { start: 10, end: 20 } } } },
    { key: 'prayerOfManasseh', author: 'Manasseh', name: 'Prayer of King Manasseh | ጸሎተ ምናሴ', verseRange: '(2 Chronicles 36 LXX)', time: 'Tuesday – 3 p.m.', purpose: 'For sickness or trouble in finding missing property or ideas.', refs: { prayerKey: 'Manasseh' } },
    { key: 'firstPrayerOfThreeYouths', author: 'Three Youths', name: 'First Prayer of the Three Youths | ጸሎተ ፫ ደቂቅ ቀዳማዊ', verseRange: '(Daniel 3:26–45 LXX)', aka: 'The Prayer/Song of Azarias', time: 'Wednesday – Noon', purpose: 'For protecting oneself and wealth from evil.', refs: { prayerKey: 'ThreeYouths1' } },
    { key: 'secondPrayerOfThreeYouths', author: 'Three Youths', name: 'Second Prayer of the Three Youths | ጸሎተ ፫ ደቂቅ ካልእ', verseRange: '(Daniel 3:52–56 LXX)', aka: 'The Blessing of Ananias, Azarias, and Misael', time: 'Thursday – 9 a.m.', purpose: 'Used during moments of frustration.', refs: { prayerKey: 'ThreeYouths2' } },
    { key: 'thirdPrayerOfThreeYouths', author: 'Three Youths', name: 'Third Prayer of the Three Youths | ጸሎተ ፫ ደቂቅ ሣልስ', verseRange: '(Daniel 3:57–88 LXX)', aka: 'The Song of the Three Holy Children', time: 'Wednesday – 3 p.m.', purpose: 'Used during moments of frustration.', refs: { prayerKey: 'ThreeYouths3' } },
    { key: 'prayerOfHabakkuk', author: 'Habakkuk', name: 'Prayer of Habakkuk the Prophet | ጸሎተ ዕንባቆም ነቢይ', verseRange: '(Habakkuk 3:1–19)', time: 'Thursday – Noon', purpose: 'For finding missing property or ideas.', refs: { nkjv: { book: 35, bookName: 'Habakkuk', chapter: 3, verses: { start: 1, end: 19 } }, rgv: { book: 'Habacuc', chapter: 3, verses: { start: 1, end: 19 } }, am54: { book: 'ትንቢተ ዕንባቆም', chapter: '3', verses: { start: 1, end: 19 } } } },
    { key: 'prayerOfIsaiah', author: 'Isaiah', name: 'Prayer of Isaiah the Prophet | ጸሎተ ኢሳይያስ ነቢይ', verseRange: '(Isaiah 26:9–20)', time: 'Thursday – 3 p.m.', purpose: 'For achieving a brighter tomorrow.', refs: { nkjv: { book: 23, bookName: 'Isaiah', chapter: 26, verses: { start: 9, end: 20 } }, rgv: { book: 'Isaías', chapter: 26, verses: { start: 9, end: 20 } }, am54: { book: 'ትንቢተ ኢሳይያስ', chapter: '26', verses: { start: 9, end: 20 } } } },
    { key: 'prayerOfMary', author: 'Mary', name: 'Prayer of Mary the Bearer of God | ጸሎተ ማርያም ወላዲተ አምላክ', verseRange: '(Luke 1:46–55)', aka: 'The Magnificat', time: 'Friday – 9 a.m.', purpose: 'For those who are grieving.', refs: { nkjv: { book: 42, bookName: 'Luke', chapter: 1, verses: { start: 46, end: 55 } }, rgv: { book: 'Lucas', chapter: 1, verses: { start: 46, end: 55 } }, am54: { book: 'የሉቃስ ወንጌል', chapter: '1', verses: { start: 46, end: 55 } } } },
    { key: 'songOfZachariah', author: 'Zachariah', name: 'Song of Zachariah the Prophet | ጸሎተ ዘካርያስ ነቢይ', verseRange: '(Luke 1:68–79)', aka: 'The Benedictus', time: 'Friday – Noon', purpose: 'For offering a worthy service to God.', refs: { nkjv: { book: 42, bookName: 'Luke', chapter: 1, verses: { start: 68, end: 79 } }, rgv: { book: 'Lucas', chapter: 1, verses: { start: 68, end: 79 } }, am54: { book: 'የሉቃስ ወንጌል', chapter: '1', verses: { start: 68, end: 79 } } } },
    { key: 'prayerOfSimeon', author: 'Simeon', name: 'Prayer of Simeon the Elder | ጸሎተ ስምዖን አረጋዊ', verseRange: '(Luke 2:29–32)', aka: 'Nunc dimittis', time: 'Friday – 3 p.m.', purpose: 'For building up faith in God.', refs: { nkjv: { book: 42, bookName: 'Luke', chapter: 2, verses: { start: 29, end: 32 } }, rgv: { book: 'Lucas', chapter: 2, verses: { start: 29, end: 32 } }, am54: { book: 'የሉቃስ ወንጌል', chapter: '2', verses: { start: 29, end: 32 } } } },
    { key: 'prayerOfJonah', author: 'Jonah', name: 'The Prayer of Jonah the Prophet | ጸሎተ ዮናስ ነቢይ', verseRange: '(Jonah 2:2–9)', time: 'Wednesday – 9 a.m.', purpose: 'For sickness or trouble in finding missing property or ideas.', refs: { prayerKey: 'Jonah' } },
];


const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zM2 13h2v-2H2v2zm18 0h2v-2h-2v2zM11 2v2h2V2h-2zm0 18v2h2v-2h-2zM4.22 5.64l1.42-1.42L7.05 5.64 5.64 7.05 4.22 5.64zM16.95 18.36l1.42-1.42L19.78 18.36l-1.41 1.41-1.42-1.41zM18.36 5.64l1.42 1.41L18.36 8.46l-1.42-1.41L18.36 5.64zM5.64 18.36l1.41 1.41L8.46 18.36l-1.41-1.42L5.64 18.36z"/></svg>`;
const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 2c-1.82 0-3.53.5-5 1.35 2.99 1.73 5 4.95 5 8.65s-2.01 6.92-5 8.65C6.47 21.5 8.18 22 10 22c5.52 0 10-4.48 10-10S15.52 2 10 2z"/></svg>`;
const shareIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"></path></svg>`;

function getDefaultProphetSongsForCurrentTime() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ...
    const hour = now.getHours();

    if (day === 0) { // Sunday
        return prophetSongs.map(s => s.key);
    }
    if (day === 6) { // Saturday
        return ['songOfSongs'];
    }

    const is9am = hour >= 6 && hour < 12; // Broadened to include early morning until noon
    const isNoon = hour >= 12 && hour < 15;
    const is3pm = hour >= 15 || hour < 6; // Afternoon until early morning next day

    if (day === 1) { // Monday
        if (is9am) return ['firstSongOfMoses'];
        if (isNoon) return ['secondSongOfMoses'];
        if (is3pm) return ['thirdSongOfMoses'];
    }
    if (day === 2) { // Tuesday
        if (is9am) return ['prayerOfHannah'];
        if (isNoon) return ['prayerOfHezekiah'];
        if (is3pm) return ['prayerOfManasseh'];
    }
    if (day === 3) { // Wednesday
        if (is9am) return ['prayerOfJonah'];
        if (isNoon) return ['firstPrayerOfThreeYouths'];
        if (is3pm) return ['thirdPrayerOfThreeYouths'];
    }
    if (day === 4) { // Thursday
        if (is9am) return ['secondPrayerOfThreeYouths'];
        if (isNoon) return ['prayerOfHabakkuk'];
        if (is3pm) return ['prayerOfIsaiah'];
    }
    if (day === 5) { // Friday
        if (is9am) return ['prayerOfMary'];
        if (isNoon) return ['songOfZachariah'];
        if (is3pm) return ['prayerOfSimeon'];
    }

    return [];
}

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
        "In the Name of the Father, and of the Son, and of the Holy Spirit, One God, Amen", "I seal my face", "Father", "Son", "Son of God", "Son of the Highest", "Holy Spirit", "Holy One", "One God",
        "Holy Trinity", "We thank You, Lord", "Lord", "God", "King", "Jesus", "Our Father in Heaven",
        "With the Greeting of Saint Gabriel", "Lord God of hosts", "Jesus Christ", "Iyesus Kristos", "Iyesus", "We believe in one God", "one God",
        "Light", "True God from True God", "Amen", "Holy, holy, holy, is the Lord of hosts", "Holy, holy, holy", "Holy, Holy, Holy", "Christ",
        "I worship the Father, and the Son, and the Holy Spirit", "Godhead", "Glory to the Father, glory to the Son, glory to the Holy Spirit",
        "Most High God", "Greetings to you, we say as we bow to you", "Prayer of Our Lady Mary, Virgin Bearer of God",
        "Savior", "My soul magnifies the Lord", "Glory to the Father, to the Son, and to the Holy Spirit, forever and to the age of ages",
        "Praises for Our Lady Mary, Virgin, Bearer of God", "O holy one (", "), pray for us.", "Son of Man", "Only-begotten", "only-begotten",
        "Word of God", "Emmanuel", "Amanuel", "Word", "God the Word", "One Spirit", "Good Father", "The Angels Praise Mary",
        "And now in the sixth month", "peace to you", "Peace to you", "peace be unto you", "Peace be unto you", "Most High",
        "Glory be to the Father, and to the Son, and to the Holy Spirit, forever and to the age of ages.",
        "Come to me, David, King of Israel", "Ask for us, Mary", "For His mercy endures forever", "For His mercy <i>endures</i> forever", "LORD",
        "And sing a hymn to Him, And exalt Him beyond measure unto the ages.",
        "And sing a hymn to the Lord, And exalt Him beyond measure unto the ages.",
        "And let it sing a hymn to Him, And exalt Him beyond measure unto the ages."
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
    ],
    spanish: [
        "En el nombre del Padre, del Hijo y del Espíritu Santo, un solo Dios, Amén", "Padre", "Hijo", "Espíritu Santo", "un solo Dios",
        "Santísima Trinidad", "Te damos gracias, Señor", "Señor", "Dios", "Rey", "Padre nuestro que estás en los cielos",
        "Jesucristo", "Amén", "Santo, santo, santo", "Cristo", "Salvador", "Virgen María", "María",
        "porque para siempre es su misericordia", "porque para siempre [es] su misericordia"
    ]
};

const rubricGoldWords = {
    english: [
        "Virgin Mary", "Mary of Zion", "Lady Mary", "Virgin Mother of God", "Virgin Bearer of God", "God-bearer", "Theotokos",
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
    ],
    spanish: [
        "María de Sión", "Nuestra Señora María", "Virgen Madre de Dios", "Santa Virgen", "María la Virgen", "Llena de gracia"
    ]
};

function buildRegex(words, isGeez = false) {
    // Sort words by length, descending, to match longer phrases first
    const sortedWords = words.sort((a, b) => b.length - a.length)
        .map(word => word.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&')); // Escape regex special chars including /

    const regexString = sortedWords.join('|');
    
    // Improved boundary pattern: space, start of line, or common punctuation
    // leadBoundary matches character before word (e.g. > in <i>Word)
    // trailBoundary looks ahead for character after word (e.g. < in Word</i>)
    // Added em-dash (—), en-dash (–), and hyphen (-) to boundaries
    const leadBoundary = '(?:^|[\\s\\(\\)\\[\\]\\{\\}.,:;!?፨።፤፣፥<>—–-])';
    const trailBoundary = '(?=[\\s\\(\\)\\[\\]\\{\\}.,:;!?፨።፤፣፥<>—–-]|$)';

    if (isGeez) {
        return new RegExp(`(${leadBoundary})((?:ወ|ለ|እም)?)(?:${regexString})${trailBoundary}`, 'g');
    }
    // No 'i' flag here to ensure case-sensitivity for English/Spanish
    return new RegExp(`(${leadBoundary})(${regexString})${trailBoundary}`, 'g');
}

const rubricRedRegex = {
    english: buildRegex(rubricRedWords.english),
    geez_script: buildRegex(rubricRedWords.geez_script, true),
    spanish: buildRegex(rubricRedWords.spanish),
};
const rubricGoldRegex = {
    english: buildRegex(rubricGoldWords.english),
    geez_script: buildRegex(rubricGoldWords.geez_script, true),
    spanish: buildRegex(rubricGoldWords.spanish),
};


// --- Speaker Label Data ---
const speakerKeywords = {
    english: ["Priest", "Asst. Priest", "Deacon", "People", "Subdeacon", "All", "ALL", "Leader", "Reader"],
    geez_script: ["ካህን", "ካህን ንፍቅ", "ዲያቆን", "ሕዝብ", "ንፍቀ ዲያቆን", "ኵሎሙ", "መሪሕ", "አንባቤ"],
    amharic_script: ["ካህን", "ካህን ንፍቅ", "ዲያቆን", "ሕዝብ", "ንፍቀ ዲያቆን", "ሁሉም", "መሪ", "አንባቢ"],
    tigrinya_script: ["ካህን", "ካህን ንፍቅ", "ዲያቆን", "ሕዝብ", "ንፍቀ ዲያቆን", "ኩሉኹም", "መራሒ", "ነባቢ"],
    spanish: ["Sacerdote", "Diácono", "Pueblo", "Subdiácono", "Todos", "Líder", "Gente", "Lector"],
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

function updateProphetSongsSummary() {
    if (selectedProphetSongs.length > 0) {
        // Map keys to authors and get unique ones in the order they appear in prophetSongs
        const selectedAuthors = [];
        prophetSongs.forEach(song => {
            if (selectedProphetSongs.includes(song.key) && !selectedAuthors.includes(song.author)) {
                selectedAuthors.push(song.author);
            }
        });
        prophetSongsSummary.textContent = `Selected Songs: ${selectedAuthors.join(', ')}`;
    } else {
        prophetSongsSummary.textContent = 'Selected Songs: None';
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


function applyRubrication(text, langKey, isFirstLanguage, chapter = null) {
    if (!displayOptions.showRubrication || (displayOptions.languageColors !== 'off' && !isFirstLanguage)) {
        return text;
    }

    // Disable rubrication for Ge'ez Psalms and Se'atat Lectionary as requested
    if (langKey === 'geez_script' && (chapter === 'Psalms' || chapter === 'SeatatLectionary')) {
        return text;
    }

    let processedText = text;

    // Apply Gold Rubrication first
    const goldRegex = rubricGoldRegex[langKey];
    if (goldRegex) {
        processedText = processedText.replace(goldRegex, (fullMatch, p1, p2) => {
            // Find which word from the list matched
            const matchIndex = fullMatch.indexOf(p2, p1.length);
            const actualMatchedWord = fullMatch.substring(p1.length);
            
            if (langKey === 'geez_script') {
                // p1 is leading boundary, p2 is prefix
                // actualMatchedWord includes prefix + root
                return `${p1}<span class="rubric-gold">${actualMatchedWord}</span>`;
            }
            // p1 is leading boundary, p2 is main word
            return `${p1}<span class="rubric-gold">${p2}</span>`;
        });
    }

    // Apply Red Rubrication second
    const redRegex = rubricRedRegex[langKey];
    if (redRegex) {
        processedText = processedText.replace(redRegex, (fullMatch, p1, p2) => {
            const actualMatchedWord = fullMatch.substring(p1.length);
            if (langKey === 'geez_script') {
                return `${p1}<span class="rubric-red">${actualMatchedWord}</span>`;
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

    // Preserve Scribe Mode
    if (isScribeModeActive) {
        body.classList.add('scribe-mode-active');
    }

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

    // Handle Paragraph Mode
    const activeLanguageCount = Object.values(displayedLanguages).filter(Boolean).length;
    if (displayOptions.paragraphMode && activeLanguageCount === 1 && displayOptions.presentationMode === 'scroll') {
        body.classList.add('paragraph-mode');
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
    localStorage.setItem('selectedSeatatLectionaryDay', selectedSeatatLectionaryDay);
    localStorage.setItem('selectedWidaseMaryamDay', selectedWidaseMaryamDay);
    localStorage.setItem('isKidaseModeActive', isKidaseModeActive);
    localStorage.setItem('selectedAnaphora', selectedAnaphora);
    localStorage.setItem('selectedCovenantPrayer', selectedCovenantPrayer);
    localStorage.setItem('quietPrayersVisibility', quietPrayersVisibility);
    localStorage.setItem('roleHighlighting', roleHighlighting);
    localStorage.setItem('kidaseLectionaryRefs', JSON.stringify(kidaseLectionaryRefs));
    localStorage.setItem('customNames', JSON.stringify(customNames));
    localStorage.setItem('collapsedSections', JSON.stringify(collapsedSections));
}


function loadSettings() {
    const isMobile = window.innerWidth < 900;
    const savedVersion = localStorage.getItem('settingsVersion');
    
    // Auto-generate default languages from the registry
    const defaultLanguages = {};
    Object.keys(LANGUAGE_REGISTRY).forEach(id => {
        const cfg = LANGUAGE_REGISTRY[id];
        // By default, turn on main scripts but leave auto-translations and phonetics off for new users
        if (cfg.category === 'main' && !cfg.isAuto && !id.includes('phonetic')) {
            defaultLanguages[id] = true;
        } else if (id === 'spanish') {
            defaultLanguages[id] = !isMobile;
        } else {
            defaultLanguages[id] = false;
        }
    });

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
            paragraphMode: false,
            slideTransition: 'fade',
            languageColors: 'off',
            boldText: false,
            anglicizeNames: false
        },
        displayedLanguages: defaultLanguages,
        fontSizes: {
            geez: 16,
            english: 16,
            locked: true
        },
        ethiopicFont: "'Noto Sans Ethiopic', sans-serif",
        englishFont: "'Merriweather', serif",
        selectedPsalms: [12, 15, 22, 50, 90, 102, 135], // Default LXX Psalms
        selectedProphetSongs: [],
        selectedSeatatLectionaryDay: getSeatatLiturgicalDay(),
        selectedWidaseMaryamDay: getSeatatLiturgicalDay(),
        isKidaseModeActive: false,
        selectedAnaphora: 'apostles',
        selectedCovenantPrayer: 'none',
        quietPrayersVisibility: 'all',
        roleHighlighting: 'none',
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
        selectedSeatatLectionaryDay = defaultSettings.selectedSeatatLectionaryDay;
        selectedWidaseMaryamDay = defaultSettings.selectedWidaseMaryamDay;
        isKidaseModeActive = defaultSettings.isKidaseModeActive;
        selectedAnaphora = defaultSettings.selectedAnaphora;
        selectedCovenantPrayer = defaultSettings.selectedCovenantPrayer;
        quietPrayersVisibility = defaultSettings.quietPrayersVisibility;
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
        selectedSeatatLectionaryDay = localStorage.getItem('selectedSeatatLectionaryDay') || defaultSettings.selectedSeatatLectionaryDay;
        selectedWidaseMaryamDay = localStorage.getItem('selectedWidaseMaryamDay') || defaultSettings.selectedWidaseMaryamDay;
        isKidaseModeActive = localStorage.getItem('isKidaseModeActive') === 'true';
        selectedAnaphora = localStorage.getItem('selectedAnaphora') || defaultSettings.selectedAnaphora;
        selectedCovenantPrayer = localStorage.getItem('selectedCovenantPrayer') || defaultSettings.selectedCovenantPrayer;
        quietPrayersVisibility = localStorage.getItem('quietPrayersVisibility') || defaultSettings.quietPrayersVisibility;
        roleHighlighting = localStorage.getItem('roleHighlighting') || defaultSettings.roleHighlighting;
        const savedKidaseLectionaryRefs = JSON.parse(localStorage.getItem('kidaseLectionaryRefs')) || {};
        kidaseLectionaryRefs = { ...defaultSettings.kidaseLectionaryRefs, ...savedKidaseLectionaryRefs };
        const savedCustomNames = JSON.parse(localStorage.getItem('customNames')) || {};
        customNames = { ...defaultSettings.customNames, ...savedCustomNames };
        collapsedSections = JSON.parse(localStorage.getItem('collapsedSections')) || defaultSettings.collapsedSections;
    }

    // Set UI elements from the loaded/default settings
    servantNameInput.value = customNames.servant;
    patriarchNameInput.value = customNames.patriarch;
    bishopNameInput.value = customNames.bishop;
    attendingBishopsInput.value = customNames.attendingBishops || '';
    churchNameInput.value = customNames.churchName || '';
    countryNameInput.value = customNames.country;
    headOfStateInput.value = customNames.headOfState;

    kidasePaulineRefInput.value = kidaseLectionaryRefs.pauline;
    kidaseUniversalRefInput.value = kidaseLectionaryRefs.universal;
    kidaseActsRefInput.value = kidaseLectionaryRefs.acts;
    kidasePsalmRefInput.value = kidaseLectionaryRefs.psalm;
    kidaseGospelRefInput.value = kidaseLectionaryRefs.gospel;

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
    applyTheme();
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
    paragraphModeToggle.checked = displayOptions.paragraphMode;
    const activeLanguageCount = Object.values(displayedLanguages).filter(Boolean).length;
    paragraphModeToggle.parentElement.style.display = (activeLanguageCount === 1 && displayOptions.presentationMode === 'scroll') ? 'block' : 'none';
    showRubricationToggle.checked = displayOptions.showRubrication;
    languageColorCodingSelect.value = displayOptions.languageColors;
    dynamicFontSizingToggle.checked = displayOptions.dynamicFontSizing;
    slideTransitionSelect.value = displayOptions.slideTransition;
    boldTextToggle.checked = displayOptions.boldText;
    anglicizeNamesToggle.checked = displayOptions.anglicizeNames;

    // Seatat Lectionary Selector
    const lectionaryRadios = document.querySelectorAll('input[name="seatat-lectionary-day"]');
    lectionaryRadios.forEach(radio => {
        if (radio.value === selectedSeatatLectionaryDay) {
            radio.checked = true;
        }
    });

    const maryRadios = document.querySelectorAll('input[name="praise-of-mary-day"]');
    maryRadios.forEach(radio => {
        if (radio.value === selectedWidaseMaryamDay) {
            radio.checked = true;
        }
    });

    // Kidase Settings
    if (kidaseGatedSection) {
        kidaseGatedSection.style.display = isScribeLoggedIn ? 'block' : 'none';
    }
    kidaseModeToggle.checked = isKidaseModeActive;
    kidaseSettings.style.display = isKidaseModeActive ? 'block' : 'none';
    anaphoraSelector.value = selectedAnaphora;
    covenantPrayerSelector.value = selectedCovenantPrayer;
    quietPrayersVisibilitySelector.value = quietPrayersVisibility;
    roleHighlightingSelector.value = roleHighlighting;

    updateLayoutToggleIcon();
    updatePresentationModeToggleIcon();
    updateExpandCollapseAllIcon();
}

function updateLanguageToggles() {
    languageTogglesDiv.innerHTML = '';
    unofficialLanguageTogglesDiv.innerHTML = '';
    
    // Toggle visibility of the unofficial section container
    if (unofficialLanguagesSection) {
        unofficialLanguagesSection.style.display = isScribeLoggedIn ? 'block' : 'none';
    }

    Object.entries(LANGUAGE_REGISTRY).forEach(([id, cfg]) => {
        const label = document.createElement('label');
        if (cfg.isEthiopic) label.classList.add('ethiopic-label');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = id;
        checkbox.checked = displayedLanguages[id] || false;
        
        const span = document.createElement('span');
        if (id.includes('phonetic')) {
            const italic = document.createElement('i');
            italic.textContent = cfg.name;
            span.appendChild(italic);
        } else {
            span.textContent = cfg.name;
        }

        // Handle "Seeking Scribes" graying out
        if (cfg.isSeekingScribe) {
            // Check if there is ANY translation for this language in the current view
            const hasTranslations = prayers.some(p => p[id] && p[id].trim()) || 
                                    prayersFromFirestore.some(p => p[id] && p[id].trim());
            
            if (!hasTranslations) {
                // If no translations and not a scribe, hide it entirely
                if (!isScribeLoggedIn) return;
                
                label.style.opacity = '0.5';
                // label.title = 'No translations yet. Seeking Scribes!';
            }
        }

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' '));
        label.appendChild(span);

        // Sort into respective containers
        if (cfg.category === 'unofficial') {
            // Extra safety: only show unofficial languages if scribe is logged in
            if (!isScribeLoggedIn) return;
            
            label.style.display = 'block'; // One per line
            unofficialLanguageTogglesDiv.appendChild(label);
        } else {
            languageTogglesDiv.appendChild(label);
        }

        checkbox.addEventListener('change', () => {
            displayedLanguages[id] = checkbox.checked;
            updateLanguageOrderList();
            saveSettings();
            renderPrayers();
        });
    });
}

function updateLanguageOrderList() {
    languageOrderList.innerHTML = '';
    languageOrder.forEach(langKey => {
        const langCfg = LANGUAGE_REGISTRY[langKey] || { category: 'main' };
        
        // Skip unofficial languages for non-scribes
        if (langCfg.category === 'unofficial' && !isScribeLoggedIn) return;

        // Skip empty 'seeking scribe' languages for non-scribes
        if (langCfg.isSeekingScribe && !isScribeLoggedIn) {
            const hasTranslations = prayers.some(p => p[langKey] && p[langKey].trim()) || 
                                    prayersFromFirestore.some(p => p[langKey] && p[langKey].trim());
            if (!hasTranslations) return;
        }

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

function getBibleVersesFromRef(ref, langKey) {
    if (!ref || !bibleData.loaded) return "";
    
    // Simple parser for "Book Chapter:Verse-Verse" or "Book Chapter:Verse"
    const match = ref.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
    if (!match) return "";
    
    const bookName = match[1];
    const chapterNum = parseInt(match[2]);
    const startVerse = parseInt(match[3]);
    const endVerse = match[4] ? parseInt(match[4]) : startVerse;
    
    const bookCfg = BIBLE_BOOK_MAPPING[bookName];
    if (!bookCfg) {
        // Fallback for Psalms if not in mapping or specified as "Psalm"
        if (bookName.toLowerCase().startsWith("psalm")) {
            return getPsalmVerses(chapterNum, startVerse, endVerse, langKey);
        }
        return "";
    }
    
    let verses = [];
    if (langKey === 'english' && bibleData.nkjv) {
        verses = bibleData.nkjv.filter(v => v.book === bookCfg.nkjv && v.chapter === chapterNum && v.verse >= startVerse && v.verse <= endVerse);
    } else if (langKey === 'amharic_script' && bibleData.am54) {
        verses = bibleData.am54.filter(v => v.book === bookCfg.am54 && v.chapter === chapterNum && v.verse >= startVerse && v.verse <= endVerse);
    } else if (langKey === 'geez_script' && bookName === 'Psalms' && bibleData.geez_psalms) {
        return getPsalmVerses(chapterNum, startVerse, endVerse, 'geez_script');
    }
    
    return verses.map(v => `[${v.verse}] ${v.text}`).join(" ");
}

function getPsalmVerses(chapterNum, start, end, langKey) {
    if (!bibleData.geez_psalms) return "";
    const chapter = bibleData.geez_psalms.find(ch => ch.id === chapterNum);
    if (!chapter) return "";
    
    const verses = chapter.verses.filter(v => v.verse_number >= start && v.verse_number <= end);
    return verses.map(v => `[${v.verse_number}] ${v.text}`).join(" ");
}

function replaceKidasePlaceholders(text, langKey) {
    let processed = text;
    const mapping = {
        '{{TODAY\'S PAULINE EPISTLE READING}}': kidaseLectionaryRefs.pauline,
        '{{TODAY\'S UNIVERSAL EPISTLE READING}}': kidaseLectionaryRefs.universal,
        '{{TODAY\'S ACTS READING}}': kidaseLectionaryRefs.acts,
        '{{TODAY\'S PSALMS READING}}': kidaseLectionaryRefs.psalm,
        '{{TODAY\'S GOSPEL READING}}': kidaseLectionaryRefs.gospel,
        '{{MORNING PSALMS READING}}': kidaseLectionaryRefs.psalm, // Reusing for now
        '{{MORNING GOSPEL READING}}': kidaseLectionaryRefs.gospel  // Reusing for now
    };
    
    for (const [placeholder, ref] of Object.entries(mapping)) {
        if (processed.includes(placeholder)) {
            const versesText = getBibleVersesFromRef(ref, langKey);
            processed = processed.replace(placeholder, versesText || `[Reading: ${ref}]`);
        }
    }
    return processed;
}


function getGeezDateInfo() {
    // Basic implementation for now - could be expanded with a real calendar conversion
    return {
        month: "Current",
        date: "Today",
        year: "Year",
        dayOfWeekGeez: "ዕለተ",
        geezMonth: "ወርኅ",
        geezDate: "ዕለት",
        geezYear: "ዓመት"
    };
}

function formatPrayerText(text, langKey, query, isFirstLanguage, chapter = null, verseNum = null) {
    let processedText = text;

    // Replace Kidase placeholders
    processedText = replaceKidasePlaceholders(processedText, langKey);

    // Replace Date placeholders
    const geezDateInfo = getGeezDateInfo();
    processedText = processedText.replace(/\{\{GE'EZ MONTH\}\}/g, geezDateInfo.month);
    processedText = processedText.replace(/\{\{GE'EZ DATE\}\}/g, geezDateInfo.date);
    processedText = processedText.replace(/\{\{GE'EZ YEAR\}\}/g, geezDateInfo.year);
    processedText = processedText.replace(/\{\{ዕለት ዘሰሙን\}\}/g, geezDateInfo.dayOfWeekGeez);
    processedText = processedText.replace(/\{\{ወርኅ\}\}/g, geezDateInfo.geezMonth);
    processedText = processedText.replace(/\{\{ዕለት\}\}/g, geezDateInfo.geezDate);
    processedText = processedText.replace(/\{\{ዓመት\}\}/g, geezDateInfo.geezYear);

    // Apply superscription formatting for Psalms, Songs of the Prophets, and Lectionary readings
    if (chapter === 'Psalms' || chapter === 'ProphetSong' || chapter === 'SeatatLectionary') {
        const supTag = verseNum ? `<sup>${verseNum}</sup> ` : '';
        
        if (langKey === 'spanish') {
            // Match leading Spanish superscriptions (using both literal « and Unicode \u00ab, and handle variations)
            // Some entries might use literal characters or escaped sequences.
            const rgvSuperscriptionRegex = /^([«\u00ab](.*?)[»\u00bb])/;
            if (rgvSuperscriptionRegex.test(processedText)) {
                // Use $2 to capture only the text content, effectively removing the markers
                processedText = processedText.replace(rgvSuperscriptionRegex, '<span class="psalm-superscription">$2</span><br>' + supTag);
            } else {
                processedText = supTag + processedText;
            }
        } else if (langKey === 'english') {
            // Match leading English superscriptions for Psalms and specific other categories
            // Restricted to verse 1 to avoid misidentifying leading italicized words in later verses
            // Handles nested <i> tags and stray trailing </i> tags found in some NKJV data
            const nkjvSuperscriptionRegex = /^((?:<i>(?:<i>.*?<\/i>|.)*?<\/i>(?:\s*<\/i>)*\s*)+)/;
            if (verseNum === 1 && nkjvSuperscriptionRegex.test(processedText)) {
                processedText = processedText.replace(nkjvSuperscriptionRegex, '<span class="psalm-superscription">$1</span><br>' + supTag);
            } else {
                processedText = supTag + processedText;
            }
        } else {
            // For other languages, just prepend the verse number if provided
            processedText = supTag + processedText;
        }
    }

    // Apply Rubrication before Anglicization to ensure fixed sacred phrases match correctly
    processedText = applyRubrication(processedText, langKey, isFirstLanguage, chapter);

    // Apply Anglicization
    processedText = applyAnglicization(processedText, langKey);

    // Replace custom name placeholders
    processedText = processedText.replace(/\{\{Servant's Names\}\}/g, customNames.servant || '');
    processedText = processedText.replace(/\{\{PATRIARCH NAME\}\}/g, customNames.patriarch || '');
    processedText = processedText.replace(/\{\{BISHOP NAME\}\}/g, customNames.bishop || '');
    processedText = processedText.replace(/\{\{COUNTRY\}\}/g, customNames.country || '');
    processedText = processedText.replace(/\{\{Leader \/ President \/ Emperor\}\}/g, customNames.headOfState || '');
    processedText = processedText.replace(/\{\{BISHOP(S) IN ATTENDANCE\}\}/g, customNames.attendingBishops || '');
    processedText = processedText.replace(/\{\{CHURCH NAME\}\}/g, customNames.churchName || '');

    const keywords = speakerKeywords[langKey];

    if (keywords) {
        const regex = new RegExp(`(፨ )?(${keywords.join('|')})([:፤፣])`, 'g');
        processedText = processedText.replace(regex, (match, p1, speaker) => {
            const isTarget = roleHighlighting !== 'none' && speaker.toLowerCase().includes(roleHighlighting.toLowerCase());
            const highlightClass = isTarget ? 'role-highlight' : '';
            if (displayOptions.showSpeakerLabels) {
                return `<span class="speaker-label ${highlightClass}">${match}</span>`;
            }
            return '';
        }).trim();
    }

    // Specific formatting: Place English Psalm 135, Three Holy Youth, and Praise of Mary refrains on a new line
    if ((chapter === 'Psalms' || chapter === 'ProphetSong' || chapter === 'Thurs') && langKey === 'english') {
        // Find refrains (with or without the red span) and insert a line break before them.
        // Handles "For His mercy endures forever", the Three Holy Youth variations, 
        // and "O holy one (Mary), pray for us."
        const refrainRegex = /\s*(<span class="rubric-red">)?(For His mercy|And (?:sing a hymn|let it sing a hymn)|O holy one)/gi;
        processedText = processedText.replace(refrainRegex, (match, p1, p2) => {
            // p1 is the optional span tag, p2 is the matched start of the refrain
            return '<br>' + (p1 || '') + match.trim();
        });
    }

    return highlightText(processedText, query);
}

function getPrayerLabel(prayer) {
    // Detect Kidase prayers (Liturgy)
    const isKidaseChapter = /^\d+$/.test(prayer.chapter) || ['Kidan', 'order', 'apostles', 'mary'].includes(prayer.chapter);
    
    if (isKidaseChapter && prayer.chapter && prayer.stanza) {
        const source = `${prayer.chapter}-${prayer.stanza}`;
        const reference = (prayer.reference && prayer.reference.trim() && prayer.reference.trim().toLowerCase() !== 'n/a') ? prayer.reference.trim() : "";
        const instruction = (prayer.instruction && prayer.instruction.trim() && prayer.instruction.trim().toLowerCase() !== 'n/a') ? prayer.instruction.trim() : "";
        
        let label = source;
        if (reference) label += ` ፨ ${reference}`;
        if (instruction) label += ` ፨ ${instruction}`;
        return label;
    }

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

    const dayTitles = {
        'Sun': 'Sunday | ዘእሁድ',
        'Mon': 'Monday | ዘሰኑይ',
        'Tue': 'Tuesday | ዘሠሉስ',
        'Wed': 'Wednesday | ዘረቡዕ',
        'Thurs': 'Thursday | ዘሐሙስ',
        'Fri': 'Friday | ዘዓርብ',
        'Sat': 'Saturday | ዘቀዳሚት'
    };

    if (customLabels[prayerKey]) {
        return customLabels[prayerKey];
    } else if (prayer.chapter === 'SeatatLectionary') {
        return prayer.reference;
    } else if (dayTitles[prayer.chapter]) {
        return dayTitles[prayer.chapter];
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
    } else if (label.startsWith("Prayer of Saint Ephraim: Praise of Mary | ውዳሴ ማርያም") && (selectedWidaseMaryamDay === 'None' || selectedWidaseMaryamDay === 'All')) {
        // Hide the section title if None is selected (or All, until we have multiple days)
        return "";
    }
    return label.replace(/ - .*/, '');
}

function hasActualContent(text, langKey) {
    if (!text || !text.trim()) return false;
    
    let cleanText = text.replace(/<[^>]*>?/gm, ''); // Strip HTML
    
    // Remove speaker keywords for this language
    let keywords = speakerKeywords[langKey];
    if (keywords) {
        // Sort keywords by length descending to match longer phrases first (e.g. "ካህን ንፍቅ" before "ካህን")
        const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);
        // Create regex to match keywords followed by common separators (including Ethiopic ones)
        const regex = new RegExp(`(፨ )?(${sortedKeywords.join('|')})([:፡።፤፣\\s]*)`, 'g');
        cleanText = cleanText.replace(regex, '');
    }
    
    // Remove other common structural characters and whitespace
    // Added Ethiopic full stop (።) and word separator (፡)
    cleanText = cleanText.replace(/[፨:፡።፤፣\\s\\.\\!\\?\\-]/g, '').trim();
    
    return cleanText.length > 0;
}

function createPrayerCardElement(prayer, prayerIndex, isKidase = false) {
    const searchQuery = searchInput.value;
    
    // Filter languages that actually have content for THIS specific card
    const languagesToDisplay = languageOrder.filter(langKey => {
        const langCfg = LANGUAGE_REGISTRY[langKey] || { name: langKey, isAuto: false, category: 'main' };
        
        // Basic global visibility checks
        if (!displayedLanguages[langKey]) return false;
        if (langCfg.category === 'unofficial' && !isScribeLoggedIn) return false;
        if (!prayer[langKey] || !prayer[langKey].trim()) return false;
        
        // Smart content check: hide if it ONLY contains speaker keywords
        return hasActualContent(prayer[langKey], langKey);
    });

    const cardVisibleLanguageCount = languagesToDisplay.length;
    
    const prayerCard = document.createElement('div');
    prayerCard.classList.add('prayer-card');
    prayerCard.dataset.prayerIndex = prayerIndex;

    // Scribe Edit Button (Only for Scribable content)
    const isScribable = prayer.chapter !== 'Psalms' && 
                        prayer.chapter !== 'Bible' && 
                        prayer.chapter !== 'SeatatLectionary' &&
                        (prayer.chapter !== 'ProphetSong' || prayer.stanza === 'Manasseh');

    if (isScribeModeActive && isScribable) {
        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-stanza-btn');
        editBtn.innerHTML = '&#9998;'; // Pencil icon
        editBtn.title = 'Edit Stanza (Scribe Mode)';
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.openScribeEditor(prayer.stanza, prayer.chapter);
        });
        prayerCard.appendChild(editBtn);
    }

    const prayerCardMainContent = document.createElement('div');
    prayerCardMainContent.classList.add('prayer-card-main-content');

    const prayerContent = document.createElement('div');
    prayerContent.classList.add('prayer-content', displayOptions.layout === 'row' ? 'layout-row' : 'layout-column');

    if (displayOptions.languageColors !== 'off') {
        prayerContent.classList.add('colored-languages');
    }

    if (displayOptions.layout === 'column' && cardVisibleLanguageCount > 3 && displayOptions.horizontalScroll) {
        prayerContent.classList.add('horizontal-scroll');
    }
    prayerContent.dataset.activeColumns = cardVisibleLanguageCount;

    let isFirstLanguage = true;
    languagesToDisplay.forEach(langKey => {
        const langCfg = LANGUAGE_REGISTRY[langKey];
        
        const langSection = document.createElement('div');
        langSection.classList.add('language-section');
        if (langKey.includes('phonetic')) {
            langSection.classList.add('lang-phonetic');
        }

        const langHeader = document.createElement('h4');
        let labelText = langCfg.name.replace(/\*+$/, '');
        
        const isOfficial = prayer[`${langKey}_is_official`] !== undefined ? 
                           prayer[`${langKey}_is_official`] : !langCfg.isAuto;

        if (langCfg.isAuto && !isOfficial) {
            labelText += ' [Unofficial Translation]';
        }

        langHeader.textContent = labelText;
        if (!displayOptions.showLanguageLabels) langHeader.classList.add('hidden');

        const langText = document.createElement('p');
        langText.classList.add('language-text');
        
        langText.innerHTML = formatPrayerText(prayer[langKey], langKey, searchQuery, isFirstLanguage, prayer.chapter, prayer.verseNum);

        if (langCfg.isEthiopic) {
            langHeader.classList.add('ethiopic-label');
            langText.classList.add('lang-ethiopic-script');
        }

        langSection.appendChild(langHeader);
        langSection.appendChild(langText);
        prayerContent.appendChild(langSection);
        isFirstLanguage = false;
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
    
    let infoHTML = "";
    const isKidaseChapter = /^\d+$/.test(prayer.chapter) || ['Kidan', 'order', 'apostles', 'mary'].includes(prayer.chapter);
    const isKidasePrayer = isKidase || (isKidaseChapter && prayer.chapter && prayer.stanza);

    if (!isKidasePrayer) {
        infoHTML = `<p><strong>Reference:</strong> ${prayer.reference}</p>`;
        if (prayer.instruction && prayer.instruction.trim().toLowerCase() !== 'n/a') {
            infoHTML += `<p><strong>Instruction:</strong> ${prayer.instruction}</p>`;
        }
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

function renderSelectedKidase(addSectionTitleCallback) {
    if (!isKidaseModeActive || typeof kidaseData === 'undefined') return;

    // 1. Order of the Liturgy
    const titleContainer = addSectionTitleCallback("Order of the Liturgy | ሥርዓተ ቅዳሴ");
    
    // Add "Copy Entire Liturgy" button next to the first section title
    if (titleContainer) {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-section-button';
        copyBtn.innerHTML = shareIconSVG;
        copyBtn.title = 'Copy Entire Liturgy';
        copyBtn.style.marginLeft = '1rem';
        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            copyEntireLiturgy();
        });
        titleContainer.appendChild(copyBtn);
    }
    
    let orderPrayers = kidaseData.order;
    
    // Filtering for Quiet Prayers
    if (quietPrayersVisibility === 'congregation') {
        orderPrayers = orderPrayers.filter(p => !p.instruction.toLowerCase().includes("inaudible"));
    }

    orderPrayers.forEach(p => {
        // Handle Covenant Prayer selection
        if (p.chapter === 'Kidan') {
            if (selectedCovenantPrayer === 'none') return;
            // Part1: Midnight, Part2: Morning, Part3: Afternoon
            if (p.stanza === 'Part1' && selectedCovenantPrayer !== 'midnight') return;
            if (p.stanza === 'Part2' && selectedCovenantPrayer !== 'morning') return;
            if (p.stanza === 'Part3' && selectedCovenantPrayer !== 'afternoon') return;
            // Intro is included for any selection
        }
        
        const card = createPrayerCardElement(p, -1, true);
        prayerDisplay.appendChild(card);
    });

    // 2. Anaphora
    const anaphoraMap = {
        'apostles': { name: 'Anaphora of the Apostles | ቅዳሴ ሐዋርያት', data: kidaseData.apostles },
        'mary': { name: 'Anaphora of Our Lady Mary | ቅዳሴ ማርያም', data: kidaseData.mary }
    };

    const anaphora = anaphoraMap[selectedAnaphora];
    if (anaphora) {
        addSectionTitleCallback(anaphora.name);
        let anaphoraPrayers = anaphora.data;
        if (quietPrayersVisibility === 'congregation') {
            anaphoraPrayers = anaphoraPrayers.filter(p => !p.instruction.toLowerCase().includes("inaudible"));
        }
        anaphoraPrayers.forEach(p => {
            const card = createPrayerCardElement(p, -1, true);
            prayerDisplay.appendChild(card);
        });
    }
}


function renderSequence() {
    const sequence = getStandardPrayerSequence();
    sequence.forEach(p => {
        const card = createPrayerCardElement(p, -1, false);
        prayerDisplay.appendChild(card);
    });
}


function renderPrayers() {
    if (isServantsCornerActive) return;
    prayerDisplay.innerHTML = '';
    const activeLanguageCount = Object.values(displayedLanguages).filter(Boolean).length;
    if (activeLanguageCount === 0) {
        prayerDisplay.innerHTML = `<div class="empty-state-message"><p>Please select a language from the settings panel to begin.</p></div>`;
        return;
    }

    let lastSectionTitle = null;
    const addSectionTitle = (title, isCollapsible = true, metadata = null) => {
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

            if (metadata) {
                const metadataEl = document.createElement('div');
                metadataEl.className = 'section-metadata';

                let parts = [];
                if (metadata.aka) parts.push(`Commonly known as: ${metadata.aka}`);
                if (metadata.time) parts.push(`Time: ${metadata.time}`);
                if (metadata.purpose) parts.push(`Purpose: ${metadata.purpose}`);
                
                metadataEl.innerHTML = parts.join('<br>');
                titleEl.appendChild(metadataEl);
            }

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
            } else if (title === "Thursday | ዘሐሙስ") {
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
    const widaseMaryamChapters = {
        'Sunday': ['Sun'],
        'Monday': ['Mon'],
        'Tuesday': ['Tue'],
        'Wednesday': ['Wed'],
        'Thursday': ['Thurs', 'Angels'],
        'Friday': ['Fri'],
        'Saturday': ['Sat']
    };

    const mainPrayers = prayers.filter(p => {
        if (p.chapter === 'Psalms' || p.chapter === 'ProphetSong') return false;
        
        // Always include Daily prayers
        if (p.chapter === 'Daily') return true;

        // Filter Praise of Mary (and related) based on selection
        if (selectedWidaseMaryamDay === 'None') return false;
        if (selectedWidaseMaryamDay === 'All') return true;
        
        const targetChapters = widaseMaryamChapters[selectedWidaseMaryamDay] || [];
        return targetChapters.includes(p.chapter);
    });

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
        renderSelectedProphetSongs((song) => {
            const title = `${song.name} ${song.verseRange || ''}`;
            addSectionTitle(title, true, { aka: song.aka, time: song.time, purpose: song.purpose });
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

    // Render Se'atat Lectionary Scripture Readings
    renderSelectedSeatatLectionary(addSectionTitle);

    // Render Kidase (Divine Liturgy)
    renderSelectedKidase(addSectionTitle);

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

function copyEntireLiturgy() {
    let textToCopy = `፨ DIVINE LITURGY (ቅዳሴ) ፨\n\n`;
    const visibleLangs = languageOrder.filter(id => displayedLanguages[id]);

    const formatEntry = (p) => {
        let entryText = "";
        visibleLangs.forEach(langKey => {
            if (p[langKey]) {
                // Skip if only speaker keywords
                if (!hasActualContent(p[langKey], langKey)) return;

                const langCfg = LANGUAGE_REGISTRY[langKey];
                const label = langCfg ? langCfg.name : langKey;
                let rawText = p[langKey];
                // Strip HTML and replace placeholders
                let cleanText = rawText.replace(/<[^>]*>?/gm, '');
                cleanText = formatPrayerText(cleanText, langKey, null, false);
                entryText += `--- ${label} ---\n${cleanText}\n\n`;
            }
        });
        return entryText;
    };

    // 1. Order
    textToCopy += `### Order of the Liturgy | ሥርዓተ ቅዳሴ ###\n\n`;
    let orderPrayers = kidaseData.order;
    if (quietPrayersVisibility === 'congregation') {
        orderPrayers = orderPrayers.filter(p => !p.instruction.toLowerCase().includes("inaudible"));
    }
    orderPrayers.forEach(p => {
        if (p.chapter === 'Kidan') {
            if (selectedCovenantPrayer === 'none') return;
            if (p.stanza === 'Part1' && selectedCovenantPrayer !== 'midnight') return;
            if (p.stanza === 'Part2' && selectedCovenantPrayer !== 'morning') return;
            if (p.stanza === 'Part3' && selectedCovenantPrayer !== 'afternoon') return;
        }
        textToCopy += formatEntry(p);
    });

    // 2. Anaphora
    const anaphoraMap = {
        'apostles': { name: 'Anaphora of the Apostles | ቅዳሴ ሐዋርያት', data: kidaseData.apostles },
        'mary': { name: 'Anaphora of Our Lady Mary | ቅዳሴ ማርያም', data: kidaseData.mary }
    };
    const anaphora = anaphoraMap[selectedAnaphora];
    if (anaphora) {
        textToCopy += `### ${anaphora.name} ###\n\n`;
        let anaphoraPrayers = anaphora.data;
        if (quietPrayersVisibility === 'congregation') {
            anaphoraPrayers = anaphoraPrayers.filter(p => !p.instruction.toLowerCase().includes("inaudible"));
        }
        anaphoraPrayers.forEach(p => {
            textToCopy += formatEntry(p);
        });
    }

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showCopyNotification('Entire Liturgy copied to clipboard!');
        });
    } else {
        fallbackCopyTextToClipboard(textToCopy);
    }
}


function copyPrayer(prayer) {
    let textToCopy = ``;
    textToCopy += `፨ ${getPrayerLabel(prayer)} ፨\n\n`;
    languageOrder.forEach(langKey => {
        const langCfg = LANGUAGE_REGISTRY[langKey] || { category: 'main' };
        if (langCfg.category === 'unofficial' && !isScribeLoggedIn) return;

        if (displayedLanguages[langKey] && prayer[langKey] && prayer[langKey].trim()) {
            // Check for actual content
            if (!hasActualContent(prayer[langKey], langKey)) return;

            textToCopy += `--- ${languageLabels[langKey]} ---\n`;
            let rawText = prayer[langKey];
            // Format for clipboard: strip HTML and replace placeholders
            let cleanText = rawText.replace(/<[^>]*>?/gm, '');
            cleanText = formatPrayerText(cleanText, langKey, null, false, prayer.chapter, prayer.stanza);
            textToCopy += `${cleanText}\n\n`;
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
    if (displayedLanguages.geez_script && verse.geez_psalms) {
        textToCopy += `--- ግእዝ ---\n`;
        textToCopy += `[${verse.verseNum}] ${verse.geez_psalms}\n\n`;
    }
    if (displayedLanguages.amharic_script && verse.am54) {
        textToCopy += `--- አማርኛ ---\n`;
        textToCopy += `[${verse.verseNum}] ${verse.am54}\n\n`;
    }
    if (displayedLanguages.coptic && verse.coptic) {
        textToCopy += `--- ϯⲙⲉⲧⲣⲉⲙⲛ̀ⲭⲏⲙⲓ ---\n`;
        textToCopy += `[${verse.verseNum}] ${verse.coptic}\n\n`;
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
        loadFile('bible/RGV_Reina_Valera_Gomez_Bible_2010AD.json', 'rgv'),
        loadFile('bible/ግእዝ_Psalms_1-151_with_Songs_of_the_Prophets.json', 'geez_psalms'),
        loadFile('bible/COPTIC2025_Psalms_Bohairic_Coptic_Scriptorium_Corpora_2025.json', 'coptic')
//        loadFile('bible/ግእዝ1988_Psalms_1-150_Geez_Bible_1988AD_1980EC_Corrected_Formatted.json', 'geez_psalms')
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

    const autoSelectLabel = document.createElement('label');
    autoSelectLabel.style.fontWeight = 'bold';
    autoSelectLabel.style.color = 'var(--accent-color)';
    const autoSelectCheckbox = document.createElement('input');
    autoSelectCheckbox.type = 'checkbox';
    autoSelectCheckbox.id = 'auto-select-prophet-songs';
    autoSelectLabel.appendChild(autoSelectCheckbox);
    autoSelectLabel.append(' Auto-Select (Sync with Current Time)');
    prophetSongsSelectorContainer.appendChild(autoSelectLabel);

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

    updateProphetSongsSummary();
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
    const geezPsalmsAll = getVerses(bibleData.geez_psalms, true);
    const copticPsalmsAll = getVerses(bibleData.coptic, true);

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
        let allVerses = [];

        // Special handling for LXX Psalm 9
        if (lxxChapter === 9) {
            const nkjv9 = nkjvPsalms.filter(v => v.chapter == 9);
            const nkjv10 = nkjvPsalms.filter(v => v.chapter == 10);
            const am54_9 = am54Psalms.filter(v => v.chapter == 9);
            const am54_10 = am54Psalms.filter(v => v.chapter == 10);
            const rgv9 = rgvPsalms.filter(v => v.chapter == 9);
            const rgv10 = rgvPsalms.filter(v => v.chapter == 10);
            const geezPsalmChapter = geezPsalmsAll.find(c => c.id === 9);
            const geezVerses = geezPsalmChapter ? geezPsalmChapter.verses : [];
            const copticPsalmChapter = copticPsalmsAll.find(c => c.chapter === 9);
            const copticVerses = copticPsalmChapter ? copticPsalmChapter.verses : [];

            for (let lxxVerseNum = 1; lxxVerseNum <= 38; lxxVerseNum++) {
                let mtChapter, mtVerseNum;
                let nkjvSrc, am54Src, rgvSrc;

                if (lxxVerseNum <= 20) {
                    mtChapter = 9;
                    mtVerseNum = lxxVerseNum;
                    nkjvSrc = nkjv9;
                    am54Src = am54_9;
                    rgvSrc = rgv9;
                } else {
                    mtChapter = 10;
                    mtVerseNum = lxxVerseNum - 20;
                    nkjvSrc = nkjv10;
                    am54Src = am54_10;
                    rgvSrc = rgv10;
                }

                const findVerse = (verses, verseNum, key = 'verse') => verses.find(v => v && v[key] == verseNum);

                const nkjvVerse = findVerse(nkjvSrc, mtVerseNum);
                const am54Verse = findVerse(am54Src, mtVerseNum);
                const rgvVerse = findVerse(rgvSrc, mtVerseNum);
                const geezVerse = findVerse(geezVerses, lxxVerseNum, 'verse_number');
                const copticVerse = findVerse(copticVerses, String(lxxVerseNum), 'verse');

                if (nkjvVerse || am54Verse || rgvVerse || geezVerse || copticVerse) {
                    allVerses.push({
                        verseNum: lxxVerseNum, // LXX verse number
                        mtChapter: mtChapter,
                        mtVerseNum: mtVerseNum,
                        nkjv: nkjvVerse ? nkjvVerse.text : '',
                        am54: am54Verse ? am54Verse.text : '',
                        rgv: rgvVerse ? rgvVerse.text : '',
                        geez_psalms: geezVerse ? geezVerse.text : '',
                        coptic: copticVerse ? copticVerse.text_coptic : '',
                    });
                }
            }
        } else {
            // Original logic for all other psalms
            const mtChapters = convertLxxToMt(lxxChapter);
            const geezPsalmChapter = geezPsalmsAll.find(c => c.id === lxxChapter);
            const geezVerses = geezPsalmChapter ? geezPsalmChapter.verses : [];
            const copticPsalmChapter = copticPsalmsAll.find(c => c.chapter === lxxChapter);
            const copticVerses = copticPsalmChapter ? copticPsalmChapter.verses : [];

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

                // If maxVerseNum is still 0 but we have geezVerses or copticVerses, use that
                if (maxVerseNum === 0) {
                    if (geezVerses.length > 0) {
                        maxVerseNum = Math.max(...geezVerses.map(v => v.verse_number));
                    } else if (copticVerses.length > 0) {
                        maxVerseNum = Math.max(...copticVerses.map(v => Number(v.verse)));
                    }
                }

                for (let i = 1; i <= maxVerseNum; i++) {
                    const findVerse = (verses, verseNum) => verses.find(v => {
                        if (!v || !v.verse) return false;
                        const parts = String(v.verse).split('-').map(Number);
                        return verseNum >= parts[0] && verseNum <= (parts.length > 1 ? parts[1] : parts[0]);
                    });

                    let verseData = { verseNum: i, mtChapter: mtChapter, mtVerseNum: i };
                    const nkjvVerse = findVerse(nkjvVerses, i);
                    if (nkjvVerse) verseData.nkjv = nkjvVerse.text;

                    const rgvVerse = findVerse(rgvVerses, i);
                    if (rgvVerse) {
                        verseData.rgv = rgvVerse.text;
                    }

                    const am54Verse = findVerse(am54Verses, i);
                    if (am54Verse) {
                        verseData.am54 = am54Verse.text;
                    }

                    const geezVerse = geezVerses.find(v => v.verse_number == i);
                    if (geezVerse) {
                        verseData.geez_psalms = geezVerse.text;
                    }

                    const copticVerse = copticVerses.find(v => v.verse == String(i));
                    if (copticVerse) {
                        verseData.coptic = copticVerse.text_coptic;
                    }

                    if (verseData.nkjv || verseData.rgv || verseData.am54 || verseData.geez_psalms || verseData.coptic) {
                        allVerses.push(verseData);
                    }
                }
            });
        }

        allVerses.forEach(verse => {
            const activePsalmTranslations = {
                english: displayedLanguages.english && verse.nkjv,
                amharic_script: displayedLanguages.amharic_script && verse.am54,
                spanish: displayedLanguages.spanish && verse.rgv,
                geez_script: displayedLanguages.geez_script && verse.geez_psalms,
                coptic: displayedLanguages.coptic && verse.coptic
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
                'english': 'nkjv', 'amharic_script': 'am54', 'spanish': 'rgv', 'geez_script': 'geez_psalms', 'coptic': 'coptic'
            };
            const langKeyToIsEthiopic = {
                'english': false, 'amharic_script': true, 'spanish': false, 'geez_script': true, 'coptic': false
            };
            const langKeyToLangName = {
                'english': 'English', 'amharic_script': 'አማርኛ', 'spanish': 'Español', 'geez_script': 'ግእዝ', 'coptic': 'ϯⲙⲉⲧⲣⲉⲙⲛ̀ⲭⲏⲙⲓ'
            };

            const firstVisibleLang = languageOrder.find(langKey => activePsalmTranslations[langKey]);

            languageOrder.forEach(langKey => {
                const prop = langKeyToPsalmVerseProp[langKey];
                if (prop && activePsalmTranslations[langKey]) {
                    const isFirstLanguage = (langKey === firstVisibleLang);
                    prayerContent.appendChild(createPsalmVerseSection(langKeyToLangName[langKey], verse[prop], verse.verseNum, langKeyToIsEthiopic[langKey], langKey, isFirstLanguage));
                }
            });
            prayerCardMainContent.appendChild(prayerContent);
            const prayerFooter = document.createElement('div');
            prayerFooter.classList.add('prayer-footer');
            const prayerLabel = document.createElement('div');
            prayerLabel.classList.add('prayer-label');
            
            let labelText;
            if (lxxChapter === 9) {
                if (verse.mtChapter === 9) {
                    labelText = `Psalm 9:${verse.verseNum}`;
                } else { // mtChapter is 10
                    labelText = `Psalm 9:${verse.verseNum} (10:${verse.mtVerseNum})`;
                }
            } else {
                if (lxxChapter == verse.mtChapter) {
                    labelText = `Psalm ${lxxChapter}:${verse.verseNum}`;
                } else {
                    labelText = `Psalm ${lxxChapter} (${verse.mtChapter}):${verse.verseNum}`;
                }
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

        addSectionTitleCallback(song);

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

                        const prayerCard = createPrayerCardElement(versePrayer, -1, false);
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


function createPsalmVerseSection(langName, text, verseNum, isEthiopic = false, langKey, isFirstLanguage = false) {
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

    // We pass the verseNum to formatPrayerText so it can intelligently place it (after superscription if one exists)
    const formattedText = formatPrayerText(text || '', langKey, searchInput.value, isFirstLanguage, 'Psalms', verseNum);
    langText.innerHTML = formattedText;

    langSection.appendChild(langHeader);
    langSection.appendChild(langText);

    return langSection;
}

function getSeatatBibleVerses(bookKey, chapter, rangeString, customEnglish = null, customGeez = null) {
    if (!bibleData.loaded) return [];
    
    const mapping = BIBLE_BOOK_MAPPING[bookKey];
    if (!mapping) return [];

    let startVerse = 1, endVerse = 1;
    if (String(rangeString).includes('-')) {
        [startVerse, endVerse] = String(rangeString).split('-').map(Number);
    } else {
        startVerse = endVerse = Number(rangeString);
    }

    const verseResults = [];
    const mtChapters = (bookKey === 'Psalms') ? convertLxxToMt(chapter) : [chapter];

    for (let vNum = startVerse; vNum <= endVerse; vNum++) {
        const verseObj = { 
            verseNum: vNum, 
            chapter: chapter, 
            book: bookKey,
            reference: `${bookKey} ${chapter}:${vNum}`,
            english: '',
            amharic_script: '',
            spanish: '',
            geez_script: '', // Usually empty for NT
            coptic: '',
            tigrinya_script: ''
        };

        const mtChapter = mtChapters[0];

        // NKJV
        if (bibleData.nkjv) {
            const v = bibleData.nkjv.find(v => v.book === mapping.nkjv && v.chapter === mtChapter && v.verse === vNum);
            if (v) verseObj.english = v.text;
        }

        // AM54
        if (bibleData.am54 && bibleData.am54.books) {
            const book = bibleData.am54.books.find(b => b.title === mapping.am54);
            if (book && book.chapters) {
                const ch = book.chapters.find(c => Number(c.chapter) === mtChapter);
                if (ch && ch.verses && ch.verses[vNum - 1]) {
                    verseObj.amharic_script = ch.verses[vNum - 1];
                }
            }
        }

        // RGV
        if (bibleData.rgv && bibleData.rgv.verses) {
            const v = bibleData.rgv.verses.find(v => v.book_name === mapping.rgv && v.chapter === mtChapter && v.verse === vNum);
            if (v) verseObj.spanish = v.text;
        }

        // Ge'ez Psalms
        if (bookKey === 'Psalms' && bibleData.geez_psalms) {
            if (customGeez) {
                const regex = new RegExp(`\\[${vNum}\\]\\s*([^\\[]+)`);
                const match = customGeez.match(regex);
                if (match && match[1]) {
                    verseObj.geez_script = match[1].trim();
                } else if (!customGeez.includes('[')) {
                    verseObj.geez_script = customGeez;
                }
            } else {
                const ch = bibleData.geez_psalms.find(c => c.id === chapter);
                if (ch && ch.verses) {
                    const v = ch.verses.find(gv => gv.verse_number === vNum);
                    if (v) verseObj.geez_script = v.text;
                }
            }
        }

        // Handle Custom English for Psalms portions
        if (bookKey === 'Psalms' && customEnglish) {
            // If customEnglish contains bracketed numbers, extract the right one
            const regex = new RegExp(`\\[${vNum}\\]\\s*([^\\[]+)`);
            const match = customEnglish.match(regex);
            if (match && match[1]) {
                verseObj.english = match[1].trim();
            } else if (!customEnglish.includes('[')) {
                // If no brackets, assume the whole string is for this verse (if it's a single verse range)
                verseObj.english = customEnglish;
            }
        }

        if (verseObj.english || verseObj.amharic_script || verseObj.spanish) {
            verseResults.push(verseObj);
        }
    }
    return verseResults;
}

function renderSelectedSeatatLectionary(addSectionTitleCallback) {
    if (selectedSeatatLectionaryDay === 'None' || !SEATAT_LECTIONARY_DATA[selectedSeatatLectionaryDay]) return;

    const readings = SEATAT_LECTIONARY_DATA[selectedSeatatLectionaryDay];
    
    readings.forEach(reading => {
        addSectionTitleCallback(reading.type);
        
        let verses = getSeatatBibleVerses(reading.book, reading.chapter, reading.verses, reading.customEnglish, reading.customGeez);
        
        // Handle Sunday special case for 1 Cor 16:1-3
        if (reading.extra) {
            const extraVerses = getSeatatBibleVerses(reading.extra.book, reading.extra.chapter, reading.extra.verses);
            verses = [...verses, ...extraVerses];
        }

        if (reading.book === 'Psalms' && verses.length > 0) {
            // Combine all Psalm verses into one card for Se'atat lectionary
            const combined = {
                chapter: 'SeatatLectionary',
                stanza: reading.type,
                reference: verses[0].reference + (verses.length > 1 ? '-' + verses[verses.length-1].verseNum : ''),
                english: verses.map(v => reading.customEnglish && reading.customEnglish.includes('[') ? v.english : `<sup>${v.verseNum}</sup> ${v.english}`).join(' '),
                geez_script: verses.map(v => reading.customGeez && reading.customGeez.includes('[') ? v.geez_script : `<sup>${v.verseNum}</sup> ${v.geez_script}`).join(' '),
                amharic_script: verses.map(v => `<sup>${v.verseNum}</sup> ${v.amharic_script}`).join(' '),
                spanish: verses.map(v => `<sup>${v.verseNum}</sup> ${v.spanish}`).join(' '),
                coptic: '',
                tigrinya_script: ''
            };
            // If custom text already had [n] markers, we don't add <sup> tags to avoid duplication
            if (reading.customEnglish && reading.customEnglish.includes('[')) {
                combined.english = reading.customEnglish;
            }
            if (reading.customGeez && reading.customGeez.includes('[')) {
                combined.geez_script = reading.customGeez;
            }

            const card = createPrayerCardElement(combined, -1);
            prayerDisplay.appendChild(card);
        } else {
            verses.forEach(v => {
                // Map keys for createPrayerCardElement
                const prayerData = {
                    ...v,
                    chapter: 'SeatatLectionary',
                    stanza: reading.type
                };
                const card = createPrayerCardElement(prayerData, -1, false);
                prayerDisplay.appendChild(card);
            });
        }
    });
}


// --- Event Listeners ---
document.querySelectorAll('input[name="seatat-lectionary-day"]').forEach(radio => {
    radio.addEventListener('change', (event) => {
        selectedSeatatLectionaryDay = event.target.value;
        saveSettings();
        renderPrayers();
    });
});

document.querySelectorAll('input[name="praise-of-mary-day"]').forEach(radio => {
    radio.addEventListener('change', (event) => {
        selectedWidaseMaryamDay = event.target.value;
        saveSettings();
        renderPrayers();
    });
});

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

attendingBishopsInput.addEventListener('input', () => {
    customNames.attendingBishops = attendingBishopsInput.value;
    saveSettings();
    renderPrayers();
});

churchNameInput.addEventListener('input', () => {
    customNames.churchName = churchNameInput.value;
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


// --- Kidase (Liturgy) Event Listeners ---
kidaseModeToggle.addEventListener('change', () => {
    isKidaseModeActive = kidaseModeToggle.checked;
    kidaseSettings.style.display = isKidaseModeActive ? 'block' : 'none';
    saveSettings();
    smoothRender();
});

anaphoraSelector.addEventListener('change', () => {
    selectedAnaphora = anaphoraSelector.value;
    saveSettings();
    smoothRender();
});

covenantPrayerSelector.addEventListener('change', () => {
    selectedCovenantPrayer = covenantPrayerSelector.value;
    saveSettings();
    smoothRender();
});

quietPrayersVisibilitySelector.addEventListener('change', () => {
    quietPrayersVisibility = quietPrayersVisibilitySelector.value;
    saveSettings();
    smoothRender();
});

roleHighlightingSelector.addEventListener('change', () => {
    roleHighlighting = roleHighlightingSelector.value;
    saveSettings();
    renderPrayers();
});

kidasePaulineRefInput.addEventListener('input', () => {
    kidaseLectionaryRefs.pauline = kidasePaulineRefInput.value;
    saveSettings();
    renderPrayers();
});

kidaseUniversalRefInput.addEventListener('input', () => {
    kidaseLectionaryRefs.universal = kidaseUniversalRefInput.value;
    saveSettings();
    renderPrayers();
});

kidaseActsRefInput.addEventListener('input', () => {
    kidaseLectionaryRefs.acts = kidaseActsRefInput.value;
    saveSettings();
    renderPrayers();
});

kidasePsalmRefInput.addEventListener('input', () => {
    kidaseLectionaryRefs.psalm = kidasePsalmRefInput.value;
    saveSettings();
    renderPrayers();
});

kidaseGospelRefInput.addEventListener('input', () => {
    kidaseLectionaryRefs.gospel = kidaseGospelRefInput.value;
    saveSettings();
    renderPrayers();
});

setTodayKidaseReadingsButton.addEventListener('click', () => {
    const day = getSeatatLiturgicalDay();
    const readings = SEATAT_LECTIONARY_DATA[day];
    if (readings) {
        // Map Seatat readings to Kidase lectionary refs
        // This is a heuristic mapping
        kidaseLectionaryRefs.pauline = `${readings[0].book} ${readings[0].chapter}:${readings[0].verses}`;
        kidaseLectionaryRefs.universal = `${readings[1].book} ${readings[1].chapter}:${readings[1].verses}`;
        kidaseLectionaryRefs.acts = `${readings[2].book} ${readings[2].chapter}:${readings[2].verses}`;
        kidaseLectionaryRefs.psalm = `${readings[3].book} ${readings[3].chapter}:${readings[3].verses}`;
        kidaseLectionaryRefs.gospel = `${readings[4].book} ${readings[4].chapter}:${readings[4].verses}`;

        // Update UI
        kidasePaulineRefInput.value = kidaseLectionaryRefs.pauline;
        kidaseUniversalRefInput.value = kidaseLectionaryRefs.universal;
        kidaseActsRefInput.value = kidaseLectionaryRefs.acts;
        kidasePsalmRefInput.value = kidaseLectionaryRefs.psalm;
        kidaseGospelRefInput.value = kidaseLectionaryRefs.gospel;

        saveSettings();
        renderPrayers();
        showCopyNotification('Kidase readings set to Today!');
    }
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
                if (cb.id !== 'select-all-prophet-songs' && cb.id !== 'auto-select-prophet-songs') {
                    cb.checked = isChecked;
                }
            });
        } else if (event.target.id === 'auto-select-prophet-songs') {
            if (event.target.checked) {
                selectedProphetSongs = getDefaultProphetSongsForCurrentTime();
                const checkboxes = prophetSongsSelectorContainer.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(cb => {
                    if (cb.id !== 'select-all-prophet-songs' && cb.id !== 'auto-select-prophet-songs') {
                        cb.checked = selectedProphetSongs.includes(cb.value);
                    }
                });
                // Uncheck auto-select after it's applied to keep it as a one-time reset action
                // OR keep it checked? Let's uncheck it after a moment for better UX feedback
                setTimeout(() => { event.target.checked = false; }, 500);
            }
        }

        selectedProphetSongs = Array.from(prophetSongsSelectorContainer.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.value)
            .filter(value => value !== 'on' && value !== 'auto-select'); // Filter out helper checkboxes

        updateProphetSongsSummary();
        saveSettings();
        smoothRender();
    }
});

clearProphetSongsButton.addEventListener('click', () => {
    selectedProphetSongs = [];
    document.querySelectorAll('#prophet-songs-selector-container input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    updateProphetSongsSummary();
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

paragraphModeToggle.addEventListener('change', () => {
    displayOptions.paragraphMode = paragraphModeToggle.checked;
    applyTheme();
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
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    modalBackdrop.style.display = 'none';
    body.style.overflow = 'auto';
}

// Global listener for closing modals when clicking outside modal-content
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal();
    }
});

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
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function handleTouchStart(e) {
    const touch = e.changedTouches[0];
    if (displayOptions.presentationMode === 'slides' && !e.target.closest('.sidebar')) {
        touchStartX = touch.screenX;
        touchStartY = touch.screenY;
        return;
    }
    if (e.target.closest('.sidebar:not(.collapsed)')) return;
    touchStartX = touch.screenX;
    touchStartY = touch.screenY;
}

function handleTouchEnd(e) {
    if (touchStartX === 0) return;
    const touch = e.changedTouches[0];
    touchEndX = touch.screenX;
    touchEndY = touch.screenY;

    if (displayOptions.presentationMode === 'slides' && !e.target.closest('.sidebar')) {
        handleSlideSwipe();
    } else {
        handleSidebarSwipe();
    }
    touchStartX = 0;
    touchStartY = 0;
    touchEndX = 0;
    touchEndY = 0;
}

function handleSidebarSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const swipeThreshold = 70; // Increased from 50 for sidebar

    // Ensure horizontal movement is dominant and exceeds threshold
    if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5 && Math.abs(deltaX) > swipeThreshold) {
        if (deltaX < -swipeThreshold) { // Swipe Left
            collapseSidebar();
        } else if (deltaX > swipeThreshold) { // Swipe Right
            if (isSidebarCollapsed) {
                isSidebarCollapsed = false;
                sidebar.classList.remove('collapsed');
                applyTheme();
                saveSettings();
            }
        }
    }
}

function handleSlideSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const swipeThreshold = 50;

    // Ensure horizontal movement is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5 && Math.abs(deltaX) > swipeThreshold) {
        if (deltaX < -swipeThreshold) { // Swipe Left (next)
            nextSlide();
        } else if (deltaX > swipeThreshold) { // Swipe Right (prev)
            prevSlide();
        }
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
    
    // Default Prophet Songs based on current day and time if nothing else selected
    if (!localStorage.getItem('selectedProphetSongs') || selectedProphetSongs.length === 0) {
        selectedProphetSongs = getDefaultProphetSongsForCurrentTime();
    }
    
    await loadBibleData(); // Load data on startup

    updatePsalmSummary();
    updateProphetSongsSummary();
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
                .then(reg => {
                    console.log('Service worker registered successfully', reg);
                    
                    // Check for updates
                    reg.onupdatefound = () => {
                        const installingWorker = reg.installing;
                        installingWorker.onstatechange = () => {
                            if (installingWorker.state === 'installed') {
                                if (navigator.serviceWorker.controller) {
                                    // New content is available; please refresh.
                                    console.log('New content is available; please refresh.');
                                    // We could trigger a UI notification here
                                } else {
                                    // Content is cached for offline use.
                                    console.log('Content is cached for offline use.');
                                }
                            }
                        };
                    };
                })
                .catch(err => console.log('Service worker registration failed: ', err));
        });

        // Handle the case where the service worker controller changes (e.g. after skipWaiting)
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                window.location.reload();
                refreshing = true;
            }
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

            if (isScribeModeActive) {
                const editBtnCorner = document.createElement('button');
                editBtnCorner.classList.add('edit-stanza-btn');
                editBtnCorner.style.display = 'flex';
                editBtnCorner.innerHTML = '&#9998;';
                editBtnCorner.title = 'Edit Servant Prayer';
                editBtnCorner.addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.openScribeEditor(prayer.title, 'Servant');
                });
                prayerCard.appendChild(editBtnCorner);
            }

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

        if (isScribeModeActive) {
            document.body.classList.add('scribe-mode-active');
        }

        renderPrayers();
    }


    bibleVerseSidebar.addEventListener('click', () => {
        collapseSidebar();
        setTimeout(renderServantsCorner, 350);
    });

    // --- Scribe System Logic ---
    const scribeLoginLink = document.getElementById('scribe-login-link');
    const scribeLoginBtn = document.getElementById('scribe-login-btn');
    const scribeEmailInput = document.getElementById('scribe-email');
    const scribePasswordInput = document.getElementById('scribe-password');
    const scribeLoginError = document.getElementById('scribe-login-error');
    const scribeEditorRef = document.getElementById('scribe-editor-ref');
    const scribeEditorFields = document.getElementById('scribe-editor-fields');
    const scribeSaveBtn = document.getElementById('scribe-save-btn');
    const scribeStatusSelect = document.getElementById('scribe-status-select');

    // Handle Login Click
    scribeLoginLink.addEventListener('click', (e) => {
        console.log('Scribe Login link clicked');
        e.preventDefault();
        if (isScribeLoggedIn) {
            if (confirm('Logout from Scribe Mode?')) {
                auth.signOut();
            }
        } else {
            console.log('Opening scribe login modal');
            openModal(scribeLoginModal);
        }
    });

    const scribeLoginForm = document.getElementById('scribe-login-form');

    // Handle Login Submission
    if (scribeLoginForm) {
        scribeLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = scribeEmailInput.value;
            const password = scribePasswordInput.value;
            scribeLoginError.classList.add('hidden');

            try {
                await auth.signInWithEmailAndPassword(email, password);
                closeModal();
                scribeEmailInput.value = '';
                scribePasswordInput.value = '';
            } catch (error) {
                scribeLoginError.textContent = error.message;
                scribeLoginError.classList.remove('hidden');
            }
        });
    }

    // Listen for Auth State Changes
    auth.onAuthStateChanged(user => {
        if (user) {
            isScribeLoggedIn = true;
            currentScribeUser = user;
            scribeLoginLink.textContent = 'Scribe Logout (' + user.email.split('@')[0] + ')';
            document.body.classList.add('scribe-mode-active');
            isScribeModeActive = true;
            
            // Check if user is a verified Scribe in the database
            checkScribePermissions(user.uid);
            
            // Re-subscribe with Scribe permissions (includes drafts)
            subscribeToPrayers();
            subscribeToIconMetadata();

            // Refresh UI immediately
            updateLanguageToggles();
            if (kidaseGatedSection) kidaseGatedSection.style.display = 'block';
            
            // Restore kidase mode from localStorage if it was active
            isKidaseModeActive = localStorage.getItem('isKidaseModeActive') === 'true';
            
            renderPrayers();
            } else {
            isScribeLoggedIn = false;
            isScribeModeActive = false;
            currentScribeUser = null;
            scribeLoginLink.textContent = 'Scribe Login';
            document.body.classList.remove('scribe-mode-active');

            if (kidaseGatedSection) kidaseGatedSection.style.display = 'none';
            // Also turn off kidase mode if it was active to be safe
            isKidaseModeActive = false;

            // Re-subscribe with normal permissions (published only)
            subscribeToPrayers();
            subscribeToIconMetadata();

            // Refresh UI immediately
            updateLanguageToggles();
            renderPrayers();
            }

    });

    async function checkScribePermissions(uid) {
        try {
            const scribeDoc = await db.collection('scribes').doc(uid).get();
            if (!scribeDoc.exists) {
                console.warn('User is not a verified Scribe. View-only mode.');
            }
        } catch (e) {
            console.error('Error checking scribe permissions:', e);
        }
    }

    let unsubscribePrayers = null;

    // Live Subscription to Firestore Prayers
    function subscribeToPrayers() {
        // Cancel existing subscription if any
        if (unsubscribePrayers) unsubscribePrayers();

        unsubscribePrayers = db.collection('prayers')
          .where('status', 'in', isScribeModeActive ? ['published', 'draft'] : ['published'])
          .onSnapshot(snapshot => {
            prayersFromFirestore = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            // Merge firestore data into our local arrays
            updateLocalPrayers();
            updateLanguageToggles(); // Refresh sidebar indicators (Verified/Scribe status)
            renderPrayers();
          }, err => {
            console.error('Firestore subscription error:', err);
          });
    }

    function updateLocalPrayers() {
        if (!prayersFromFirestore.length) return;

        prayersFromFirestore.forEach(fsItem => {
            const updateAllMatches = (array, criteria) => {
                const matches = array.filter(criteria);
                matches.forEach(m => Object.assign(m, fsItem));
            };

            if (fsItem.chapter === 'Servant') {
                updateAllMatches(servantsPrayers, p => p.title === fsItem.stanza);
            } else if (fsItem.chapter === 'Psalms' || fsItem.chapter === 'ProphetSong' || fsItem.chapter === 'Bible') {
                updateAllMatches(songs, p => 
                    p.chapter === fsItem.chapter && 
                    p.stanza == fsItem.stanza && 
                    p.reference === fsItem.reference &&
                    p.english === fsItem.english
                );
            } else {
                updateAllMatches(prayers, p => 
                    p.chapter === fsItem.chapter && 
                    p.stanza == fsItem.stanza && 
                    p.reference === fsItem.reference &&
                    p.english === fsItem.english
                );
            }
        });
    }

    // Initial subscription for all users
    subscribeToPrayers();
    subscribeToIconMetadata();

    // Surgical Editor: Open Modal
    window.openScribeEditor = function(stanzaId, chapter) {
        console.log('Opening editor for:', chapter, stanzaId);
        
        // Comprehensive search across all possible sources
        const prayer = 
            prayersFromFirestore.find(p => p.stanza == stanzaId && p.chapter == chapter) ||
            prayers.find(p => p.chapter === chapter && p.stanza == stanzaId) || 
            songs.find(p => p.chapter === chapter && p.stanza == stanzaId) ||
            (chapter === 'Servant' ? servantsPrayers.find(p => p.title == stanzaId) : null);
        
        if (!prayer) {
            console.warn('Scribe Error: Prayer not found in any source.');
            return;
        }

        scribeEditorRef.textContent = `Editing: ${chapter} - ${stanzaId}`;
        scribeEditorFields.innerHTML = '';

        // Populate Metadata Fields
        document.getElementById('edit-chapter').value = prayer.chapter || '';
        document.getElementById('edit-stanza').value = prayer.stanza || '';
        document.getElementById('edit-reference').value = prayer.reference || '';
        document.getElementById('edit-instruction').value = prayer.instruction || '';

        // Generate fields for all languages
        const languages = [
            'english', 'geez_script', 'geez_phonetic', 
            'amharic_script', 'amharic_phonetic', 
            'tigrinya_script', 'tigrinya_phonetic', 
            'spanish', 'french', 'arabic', 'greek', 'hebrew', 'malayalam',
            'oromoo', 'syriac', 'armenian', 'coptic'
        ];

        languages.forEach(lang => {
            if (prayer.hasOwnProperty(lang)) {
                const group = document.createElement('div');
                group.classList.add('editor-field-group');
                
                const headerRow = document.createElement('div');
                headerRow.classList.add('editor-field-header');
                
                const label = document.createElement('label');
                label.textContent = lang.replace('_', ' ').toUpperCase();
                
                // Add Official/Verified Toggle for manual control
                if (lang !== 'english') {
                    const verifiedLabel = document.createElement('label');
                    verifiedLabel.classList.add('verified-toggle-label');
                    
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `verify-${lang}`;
                    checkbox.checked = prayer[`${lang}_is_official`] === true;
                    
                    verifiedLabel.appendChild(checkbox);
                    verifiedLabel.appendChild(document.createTextNode(' Verified'));
                    headerRow.appendChild(label);
                    headerRow.appendChild(verifiedLabel);
                } else {
                    headerRow.appendChild(label);
                }
                
                const textarea = document.createElement('textarea');
                textarea.id = `edit-${lang}`;
                textarea.value = prayer[lang];
                
                group.appendChild(headerRow);
                group.appendChild(textarea);
                scribeEditorFields.appendChild(group);
            }
        });

        scribeStatusSelect.value = prayer.status || 'published';
        
        // Store current IDs for the save handler
        scribeSaveBtn.dataset.docId = prayer.id || ''; 

        openModal(scribeEditorModal);
    };

    // --- Icon Metadata Logic ---
    const iconMetadataModal = document.getElementById('icon-metadata-modal');
    const scribeIconEditorModal = document.getElementById('scribe-icon-editor-modal');
    const iconScribeEditSection = document.getElementById('icon-scribe-edit-section');
    const editIconBtn = document.getElementById('edit-icon-btn');
    const scribeSaveIconBtn = document.getElementById('scribe-save-icon-btn');

    let currentIconKey = null;
    let iconsFromFirestore = {};

    // Event delegation for icon clicks (handles static and dynamic icons)
    document.addEventListener('click', (e) => {
        const icon = e.target.closest('.holy-trinity-icon, .section-icon, .hareg-ornament');
        if (icon) {
            const src = icon.getAttribute('src');
            if (!src) return;
            const iconFileName = src.split('/').pop();
            console.log('Icon clicked:', iconFileName);
            openIconMetadata(iconFileName);
        }
    });

    // Subscribe to Icon Metadata in Firestore
    function subscribeToIconMetadata() {
        db.collection('icon_metadata').onSnapshot(snapshot => {
            snapshot.docs.forEach(doc => {
                iconsFromFirestore[doc.id] = doc.data();
            });
        });
    }

    window.openIconMetadata = function(iconKey) {
        console.log('Opening icon metadata for:', iconKey);
        currentIconKey = iconKey;
        const baseData = ICON_METADATA[iconKey];
        
        if (!baseData) {
            console.warn('Metadata not found for key:', iconKey);
            return;
        }

        const firestoreData = iconsFromFirestore[baseData.id || iconKey.replace(/\./g, '_')] || {};
        const data = { ...baseData, ...firestoreData };

        // Populate Modal
        document.getElementById('icon-title-geez').textContent = data.title?.geez || '';
        document.getElementById('icon-title-translit').textContent = data.title?.transliteration || '';
        document.getElementById('icon-title-english').textContent = data.title?.english || '';
        
        // Populate Images
        const imagesContainer = document.getElementById('icon-original-images-container');
        imagesContainer.innerHTML = ''; // Clear previous images
        
        const imagePaths = Array.isArray(data.originalImage) ? data.originalImage : (data.originalImage ? [data.originalImage] : []);
        
        if (imagePaths.length > 0) {
            imagePaths.forEach(path => {
                const img = document.createElement('img');
                img.src = path;
                img.alt = data.title?.english || 'Original Icon Image';
                img.className = 'metadata-original-img';
                imagesContainer.appendChild(img);
            });
            imagesContainer.style.display = 'flex';
        } else {
            imagesContainer.style.display = 'none';
        }

        document.getElementById('icon-desc-amharic').textContent = data.description?.amharic || '';
        document.getElementById('icon-desc-english').textContent = data.description?.english || '';

        // Bible References
        const bibleRefsContainer = document.getElementById('icon-bible-refs');
        bibleRefsContainer.innerHTML = '';
        if (data.bibleReferences && data.bibleReferences.length > 0) {
            const label = document.createElement('strong');
            label.textContent = 'Bible References: ';
            bibleRefsContainer.appendChild(label);
            bibleRefsContainer.append(data.bibleReferences.join(', '));
            bibleRefsContainer.style.display = 'block';
        } else {
            bibleRefsContainer.style.display = 'none';
        }

        // Source Citation with technical formatting and links
        const sourceContainer = document.getElementById('icon-source-citation');
        sourceContainer.innerHTML = '<strong>Source:</strong> ';
        if (data.source) {
            let sourceText = data.source;
            if (data.link) {
                const link = document.createElement('a');
                link.href = data.link;
                link.target = '_blank';
                link.textContent = ' [Link]';
                sourceContainer.append(sourceText);
                sourceContainer.appendChild(link);
            } else {
                sourceContainer.append(sourceText);
            }
        }

        // Show/Hide Scribe Edit Section
        if (isScribeModeActive) {
            iconScribeEditSection.classList.remove('hidden');
        } else {
            iconScribeEditSection.classList.add('hidden');
        }

        openModal(iconMetadataModal);
    };

    editIconBtn.addEventListener('click', () => {
        const baseData = ICON_METADATA[currentIconKey];
        const firestoreData = iconsFromFirestore[baseData?.id || currentIconKey] || {};
        const data = { ...baseData, ...firestoreData };

        document.getElementById('edit-icon-desc-amharic').value = data.description?.amharic || '';
        document.getElementById('edit-icon-desc-english').value = data.description?.english || '';
        document.getElementById('edit-icon-source').value = data.source || '';

        closeModal();
        setTimeout(() => openModal(scribeIconEditorModal), 300);
    });

    scribeSaveIconBtn.addEventListener('click', async () => {
        const baseData = ICON_METADATA[currentIconKey];
        const docId = baseData?.id || currentIconKey.replace(/\./g, '_');
        
        const updatedData = {
            description: {
                amharic: document.getElementById('edit-icon-desc-amharic').value,
                english: document.getElementById('edit-icon-desc-english').value
            },
            source: document.getElementById('edit-icon-source').value,
            lastEditedBy: currentScribeUser?.uid || 'unknown',
            lastEditedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        scribeSaveIconBtn.disabled = true;
        scribeSaveIconBtn.textContent = 'Saving...';

        try {
            await db.collection('icon_metadata').doc(docId).set(updatedData, { merge: true });
            closeModal();
            showCopyNotification('Icon metadata updated successfully!');
        } catch (error) {
            alert('Error saving icon metadata: ' + error.message);
        } finally {
            scribeSaveIconBtn.disabled = false;
            scribeSaveIconBtn.textContent = 'Save Icon Metadata';
        }
    });

    // Save Changes to Firestore
    scribeSaveBtn.addEventListener('click', async () => {
        const docId = scribeSaveBtn.dataset.docId;
        
        const updatedData = {
            chapter: document.getElementById('edit-chapter').value,
            stanza: document.getElementById('edit-stanza').value,
            reference: document.getElementById('edit-reference').value,
            instruction: document.getElementById('edit-instruction').value,
            status: scribeStatusSelect.value,
            lastEditedBy: currentScribeUser.uid,
            lastEditedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        const languages = [
            'english', 'geez_script', 'geez_phonetic', 
            'amharic_script', 'amharic_phonetic', 
            'tigrinya_script', 'tigrinya_phonetic', 'spanish', 'coptic',
            'french', 'arabic', 'greek', 'hebrew', 'malayalam', 'oromoo', 'syriac', 'armenian'
        ];

        languages.forEach(lang => {
            const el = document.getElementById(`edit-${lang}`);
            if (el) {
                updatedData[lang] = el.value;
                // Read the manual checkbox state
                const verifyCheckbox = document.getElementById(`verify-${lang}`);
                if (verifyCheckbox) {
                    updatedData[`${lang}_is_official`] = verifyCheckbox.checked;
                }
            }
        });

        scribeSaveBtn.disabled = true;
        scribeSaveBtn.textContent = 'Saving...';

        try {
            if (docId) {
                await db.collection('prayers').doc(docId).update(updatedData);
            } else {
                // Use metadata values for the new document ID
                const customId = `${updatedData.chapter}_${updatedData.stanza}_${updatedData.reference}`.replace(/[^a-zA-Z0-9]/g, '_');
                await db.collection('prayers').doc(customId).set(updatedData);
            }
            closeModal();
            showCopyNotification('Scribe changes saved live!');
        } catch (error) {
            alert('Error saving: ' + error.message);
        } finally {
            scribeSaveBtn.disabled = false;
            scribeSaveBtn.textContent = 'Save Changes';
        }
    });

    // Close Modals on close button click
    document.getElementById('close-help-modal').addEventListener('click', closeModal);
    document.getElementById('close-feedback-modal').addEventListener('click', closeModal);
    document.getElementById('close-ephrem-modal').addEventListener('click', closeModal);
    document.getElementById('close-scribe-login-modal').addEventListener('click', closeModal);
    document.getElementById('close-scribe-editor-modal').addEventListener('click', closeModal);
    document.getElementById('close-icon-metadata-modal').addEventListener('click', closeModal);
    document.getElementById('close-scribe-icon-editor-modal').addEventListener('click', closeModal);
    document.getElementById('close-eusebius-modal').addEventListener('click', closeModal);

    // Eusebius Modal Logic
    if (eusebiusInfoBtn) {
        eusebiusInfoBtn.addEventListener('click', () => {
            openModal(eusebiusModal);
        });
    }

    // Eusebius Tabs Logic
    const eusebiusTabBtns = document.querySelectorAll('.modal-tab-btn');
    const eusebiusTabPanes = document.querySelectorAll('.modal-pane');

    eusebiusTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            
            // Toggle buttons
            eusebiusTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Toggle panes
            eusebiusTabPanes.forEach(p => p.classList.remove('active'));
            document.getElementById(`eusebius-${lang}`).classList.add('active');
        });
    });

    // Ephrem Story Modal Logic
    if (ephremStoryInfoBtn) {
        ephremStoryInfoBtn.addEventListener('click', () => {
            // Update all servant name placeholders in the story modal
            const storyNameSpans = ephremStoryModal.querySelectorAll('.story-servant-name');
            storyNameSpans.forEach(span => {
                span.textContent = customNames.servant || '{Names}';
            });
            openModal(ephremStoryModal);
        });
    }

    // Story Tabs Logic
    const tabBtns = document.querySelectorAll('.story-tab-btn');
    const tabPanes = document.querySelectorAll('.story-day-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const day = btn.getAttribute('data-day');
            
            // Toggle buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Toggle panes
            tabPanes.forEach(p => p.classList.remove('active'));
            document.getElementById(`story-${day}`).classList.add('active');
        });
    });

    // Technical Context Collapsible Logic
    const techToggleBtn = document.getElementById('toggle-technical-context');
    const techContent = document.getElementById('technical-context-content');
    if (techToggleBtn && techContent) {
        techToggleBtn.addEventListener('click', () => {
            const isCollapsed = techContent.classList.toggle('collapsed');
            techToggleBtn.classList.toggle('active', !isCollapsed);
        });
    }
});