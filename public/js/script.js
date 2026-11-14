// --- DOM Elements ---
const body = document.body;
// --- Firebase Configuration ---
const firebaseConfig = {
    apiKey: "AIzaSyAu50q3NfDNaZUWsxU0-YIlql3bQsc6_QQ",
    authDomain: "mount-of-mercy.firebaseapp.com",
    projectId: "mount-of-mercy",
    storageBucket: "mount-of-mercy.firebasestorage.app",
    messagingSenderId: "974361367981",
    appId: "1:974361367981:web:752f9a6fb815e208f4fd24",
    measurementId: "G-2B968Y7B26"
};

// Initialize Firebase (Compat)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let analytics = null;
try {
    if (window.location.protocol.startsWith('http') && typeof firebase.analytics === 'function') {
        analytics = firebase.analytics();
    } else {
        console.warn("Firebase Analytics is blocked by ad-blocker or not in http/https environment. Skipping.");
    }
} catch (e) {
    console.warn("Firebase Analytics initialization failed:", e);
}

// --- Application Logic ---

// --- DOM Element References ---
let header, leftSidebar, rightSidebar, mainContent, sidebarToggle, prayersPanelToggle, sidebarBackdrop,
    themeToggle, paletteSelector, geezFontSizeSlider, englishFontSizeSlider, lockFontSizesToggle,
    boldTextToggle, ethiopicFontSelect, englishFontSelect, languageTogglesDiv, unofficialLanguageTogglesDiv,
    unofficialLanguagesSection, prayerDisplay, languageOrderList, copyNotification, presentationModeToggleHeader,
    presModeIconSlides, presModeIconScroll, layoutToggleHeader, layoutIconColumn, layoutIconRow,
    showLanguageLabelsToggle, showSpeakerLabelsToggle, paragraphModeToggle, showRubricationToggle,
    languageColorCodingSelect, dynamicFontSizingLabel, dynamicFontSizingToggle, forceUniformFontSizeLabel,
    forceUniformFontSizeToggle, slideTransitionSelect, searchContainer, searchToggle, searchClose,
    searchInput, searchCount, searchPrev, searchNext, helpButton, showSupplicationsToggle,
    showDailyPrayerToggle, showGateOfLightToggle, showYewediswaMelaektToggle, showGeezPhoneticChantsToggle,
    showLoanwordOriginsToggle, useExternalBibleAPIToggle, useExternalBibleAPILabel,
    globalEnglishTranslationSelect, globalAmharicTranslationSelect, globalGeezTranslationSelect,
    bibleTranslationsInfoBtn, bibleTranslationsInfoModal, closeBibleTranslationsInfoModal,
    expandCollapseAllButton, expandCollapseAllLabel, prayerFloatingControls, bottomNavBar,
    headerSubtitleAttribution, liturgicalCalendarBar, headerFeastMobileLine, calendarInfoModal, closeCalendarInfoModal,
    calendarInfoTitle, calendarInfoBody, showHaregOrnamentToggle, showTrinitarianInvocationToggle, showPrepPsalmsToggle,
    searchScopeSelect, searchResultsDrawer, miracleVoiceDetectBtn, miracleVoiceStatus, miracleVoiceSuggestions,
    feedbackButton, helpModal, feedbackModal, ephremStoryModal, ephremStoryInfoBtn, closeEphremModal,
    eusebiusModal, eusebiusInfoBtn, closeEusebiusModal, psalmCombinationsBtn, psalmCombinationsModal,
    closePsalmCombinationsModal, psalmCombinationsAccordion, typicalPsalmsModal, closeTypicalPsalmsModalBtn,
    typicalPsalmsSearchInput, typicalPsalmsResultsCount, typicalPsalmsList, scribeLoginModal, scribeEditorModal, changelogModal, changelogList, closeChangelogModal,
    athanasiusModal, athanasiusGuideBtn, closeAthanasiusModal, athanasiusSearchInput, athanasiusCategoryChips,
    athanasiusResultsCount, athanasiusPrescriptionsList, appVersionContainer, modalBackdrop,
    sendFeedbackButtonHelp, sendFeedbackButtonModal, fontPreview, psalmSelectorContainer, psalmSummary,
    clearPsalmsButton, prophetSongsSelectorContainer, prophetSongsSummary, clearProphetSongsButton,
    kidaseGatedSection, kidaseModeToggle, kidaseSettings, showMatinsToggle, showTeklilToggle,
    teklilNamesSettings, bridegroomNameInput, brideNameInput, morningPsalmGospelSettings,
    morningPsalmRefContainer, morningGospelRefContainer, vespersPsalmGospelSettings,
    eveningPsalmRefContainer, eveningGospelRefContainer, anaphoraSelector, showAnaphoraToggle,
    anaphoraSettings, showVespersToggle, kidaseDaySelector, covenantPrayerSelector,
    hideQuietPrayersToggle, openMiracleModalBtn, miracleModal, closeMiracleModalBtn,
    miracleSearchInput, miracleMostReadToggle, miracleListContainer, selectedMiracleText,
    miraclePositionContainer, miraclePositionRadios, holyFiftyDaysToggle, servantNameInput,
    shareLinkButton, shareScripturesButton, patriarchNameInput, bishopNameInput, attendingBishopsInput,
    churchNameInput, countryNameInput, headOfStateInput, anglicizeNamesToggle, bibleVerseSidebar,
    kidasePaulineRefContainer, kidaseUniversalRefContainer, kidaseActsRefContainer,
    kidasePsalmRefContainer, kidaseGospelRefContainer, hardRefreshButton;

// Scribe State
let isScribeLoggedIn = false;
let isScribeModeActive = false;
let currentScribeUser = null;
let prayersFromFirestore = []; // Cache for Firestore data

function bindDOMElements() {
    header = document.querySelector('header');
    leftSidebar = document.getElementById('left-sidebar');
    rightSidebar = document.getElementById('right-sidebar');
    mainContent = document.querySelector('.main-content');
    sidebarToggle = document.getElementById('sidebar-toggle');
    prayersPanelToggle = document.getElementById('prayers-panel-toggle');
    sidebarBackdrop = document.getElementById('sidebar-backdrop');
    themeToggle = document.getElementById('theme-toggle');
    paletteSelector = document.getElementById('palette-selector');
    geezFontSizeSlider = document.getElementById('geez-font-size-slider');
    englishFontSizeSlider = document.getElementById('english-font-size-slider');
    lockFontSizesToggle = document.getElementById('lock-font-sizes');
    boldTextToggle = document.getElementById('bold-text-toggle');
    ethiopicFontSelect = document.getElementById('ethiopic-font-select');
    englishFontSelect = document.getElementById('english-font-select');
    languageTogglesDiv = document.getElementById('language-toggles');
    unofficialLanguageTogglesDiv = document.getElementById('unofficial-language-toggles');
    unofficialLanguagesSection = document.getElementById('unofficial-languages-section');
    prayerDisplay = document.getElementById('prayer-display');
    languageOrderList = document.getElementById('language-order-list');
    copyNotification = document.getElementById('copy-notification');
    presentationModeToggleHeader = document.getElementById('presentation-mode-toggle-header');
    if (presentationModeToggleHeader) {
        presModeIconSlides = presentationModeToggleHeader.querySelector('.pres-mode-icon-slides');
        presModeIconScroll = presentationModeToggleHeader.querySelector('.pres-mode-icon-scroll');
    }
    layoutToggleHeader = document.getElementById('layout-toggle-header');
    if (layoutToggleHeader) {
        layoutIconColumn = layoutToggleHeader.querySelector('.layout-icon-column');
        layoutIconRow = layoutToggleHeader.querySelector('.layout-icon-row');
    }

    showLanguageLabelsToggle = document.getElementById('show-language-labels');
    showSpeakerLabelsToggle = document.getElementById('show-speaker-labels');
    paragraphModeToggle = document.getElementById('paragraph-mode');
    showRubricationToggle = document.getElementById('show-rubrication');
    languageColorCodingSelect = document.getElementById('language-color-coding-select');
    dynamicFontSizingLabel = document.getElementById('dynamic-font-sizing-label');
    dynamicFontSizingToggle = document.getElementById('dynamic-font-sizing');
    forceUniformFontSizeLabel = document.getElementById('force-uniform-font-size-label');
    forceUniformFontSizeToggle = document.getElementById('force-uniform-font-size');
    slideTransitionSelect = document.getElementById('slide-transition-select');
    searchContainer = document.getElementById('search-container');
    searchToggle = document.getElementById('search-toggle');
    searchClose = document.getElementById('search-close');
    searchInput = document.getElementById('search-input');
    searchCount = document.getElementById('search-count');
    searchPrev = document.getElementById('search-prev');
    searchNext = document.getElementById('search-next');
    searchScopeSelect = document.getElementById('search-scope-select');
    searchResultsDrawer = document.getElementById('search-results-drawer');
    helpButton = document.getElementById('help-button');
    showSupplicationsToggle = document.getElementById('show-supplications-toggle');
    showDailyPrayerToggle = document.getElementById('show-daily-prayer-toggle');
    showGateOfLightToggle = document.getElementById('show-gate-of-light-toggle');
    showYewediswaMelaektToggle = document.getElementById('show-yewediswa-melaekt-toggle');
    showGeezPhoneticChantsToggle = document.getElementById('show-geez-phonetic-chants');
    showLoanwordOriginsToggle = document.getElementById('show-loanword-origins');
    showHaregOrnamentToggle = document.getElementById('show-hareg-ornament-toggle');
    showTrinitarianInvocationToggle = document.getElementById('show-trinitarian-invocation-toggle');
    showPrepPsalmsToggle = document.getElementById('show-prep-psalms-toggle');
    useExternalBibleAPIToggle = document.getElementById('use-external-bible-api');
    useExternalBibleAPILabel = document.getElementById('external-bible-api-label');
    globalEnglishTranslationSelect = document.getElementById('global-english-translation-select');
    globalAmharicTranslationSelect = document.getElementById('global-amharic-translation-select');
    globalGeezTranslationSelect = document.getElementById('global-geez-translation-select');
    bibleTranslationsInfoBtn = document.getElementById('bible-translations-info-btn');
    bibleTranslationsInfoModal = document.getElementById('bible-translations-info-modal');
    closeBibleTranslationsInfoModal = document.getElementById('close-bible-translations-info-modal');
    expandCollapseAllButton = document.getElementById('expand-collapse-all-button');
    expandCollapseAllLabel = document.getElementById('expand-collapse-all-label');
    prayerFloatingControls = document.getElementById('prayer-floating-controls');
    bottomNavBar = document.getElementById('bottom-nav-bar');
    headerSubtitleAttribution = document.getElementById('header-subtitle-attribution');
    liturgicalCalendarBar = document.getElementById('liturgical-calendar-bar');
    headerFeastMobileLine = document.getElementById('header-feast-mobile-line');
    calendarInfoModal = document.getElementById('calendar-info-modal');
    closeCalendarInfoModal = document.getElementById('close-calendar-info-modal');
    calendarInfoTitle = document.getElementById('calendar-info-title');
    calendarInfoBody = document.getElementById('calendar-info-body');
    miracleVoiceDetectBtn = document.getElementById('miracle-voice-detect-btn');
    miracleVoiceStatus = document.getElementById('miracle-voice-status');
    miracleVoiceSuggestions = document.getElementById('miracle-voice-suggestions');
    feedbackButton = document.getElementById('feedback-button');
    helpModal = document.getElementById('help-modal');
    feedbackModal = document.getElementById('feedback-modal');
    ephremStoryModal = document.getElementById('ephrem-story-modal');
    ephremStoryInfoBtn = document.getElementById('ephrem-story-info-btn');
    closeEphremModal = document.getElementById('close-ephrem-modal');
    eusebiusModal = document.getElementById('eusebius-modal');
    eusebiusInfoBtn = document.getElementById('eusebius-info-btn');
    closeEusebiusModal = document.getElementById('close-eusebius-modal');
    psalmCombinationsBtn = document.getElementById('psalm-combinations-btn');
    psalmCombinationsModal = document.getElementById('psalm-combinations-modal');
    closePsalmCombinationsModal = document.getElementById('close-psalm-combinations-modal');
    psalmCombinationsAccordion = document.getElementById('psalm-combinations-accordion');
    typicalPsalmsModal = document.getElementById('typical-psalms-modal');
    closeTypicalPsalmsModalBtn = document.getElementById('close-typical-psalms-modal');
    typicalPsalmsSearchInput = document.getElementById('typical-psalms-search-input');
    typicalPsalmsResultsCount = document.getElementById('typical-psalms-results-count');
    typicalPsalmsList = document.getElementById('typical-psalms-list');
    scribeLoginModal = document.getElementById('scribe-login-modal');
    scribeEditorModal = document.getElementById('scribe-editor-modal');
    changelogModal = document.getElementById('changelog-modal');
    changelogList = document.getElementById('changelog-list');
    closeChangelogModal = document.getElementById('close-changelog-modal');
    athanasiusModal = document.getElementById('athanasius-modal');
    athanasiusGuideBtn = document.getElementById('athanasius-guide-btn');
    closeAthanasiusModal = document.getElementById('close-athanasius-modal');
    athanasiusSearchInput = document.getElementById('athanasius-search-input');
    athanasiusCategoryChips = document.getElementById('athanasius-category-chips');
    athanasiusResultsCount = document.getElementById('athanasius-results-count');
    athanasiusPrescriptionsList = document.getElementById('athanasius-prescriptions-list');
    appVersionContainer = document.getElementById('app-version-container');
    modalBackdrop = document.getElementById('modal-backdrop');

    sendFeedbackButtonHelp = document.getElementById('send-feedback-button-help');
    sendFeedbackButtonModal = document.getElementById('send-feedback-button');
    fontPreview = document.getElementById('font-preview');
    psalmSelectorContainer = document.getElementById('psalm-selector-container');
    psalmSummary = document.getElementById('psalm-summary');
    clearPsalmsButton = document.getElementById('clear-psalms-button');

    prophetSongsSelectorContainer = document.getElementById('prophet-songs-selector-container');
    prophetSongsSummary = document.getElementById('prophet-songs-summary');
    clearProphetSongsButton = document.getElementById('clear-prophet-songs-button');
    kidaseGatedSection = document.getElementById('kidase-gated-section');
    kidaseModeToggle = document.getElementById('kidase-mode-toggle');
    kidaseSettings = document.getElementById('kidase-settings');
    showMatinsToggle = document.getElementById('show-matins');
    showTeklilToggle = document.getElementById('show-teklil');
    teklilNamesSettings = document.getElementById('teklil-names-settings');
    bridegroomNameInput = document.getElementById('bridegroom-name-input');
    brideNameInput = document.getElementById('bride-name-input');
    morningPsalmGospelSettings = document.getElementById('morning-psalm-gospel-settings');
    morningPsalmRefContainer = document.getElementById('morning-psalm-ref-container');
    morningGospelRefContainer = document.getElementById('morning-gospel-ref-container');
    vespersPsalmGospelSettings = document.getElementById('vespers-psalm-gospel-settings');
    eveningPsalmRefContainer = document.getElementById('evening-psalm-ref-container');
    eveningGospelRefContainer = document.getElementById('evening-gospel-ref-container');
    anaphoraSelector = document.getElementById('anaphora-selector');
    showAnaphoraToggle = document.getElementById('show-anaphora-toggle');
    anaphoraSettings = document.getElementById('anaphora-settings');
    showVespersToggle = document.getElementById('show-vespers');
    kidaseDaySelector = document.getElementById('kidase-day-selector');
    covenantPrayerSelector = document.getElementById('covenant-prayer-selector');
    hideQuietPrayersToggle = document.getElementById('hide-quiet-prayers');
    openMiracleModalBtn = document.getElementById('open-miracle-modal-btn');
    miracleModal = document.getElementById('miracle-modal');
    closeMiracleModalBtn = document.getElementById('close-miracle-modal');
    miracleSearchInput = document.getElementById('miracle-search-input');
    miracleMostReadToggle = document.getElementById('miracle-most-read-toggle');
    miracleListContainer = document.getElementById('miracle-list-container');
    selectedMiracleText = document.getElementById('selected-miracle-text');

    miraclePositionContainer = document.getElementById('miracle-position-container');
    miraclePositionRadios = document.getElementsByName('miracle-position');
    holyFiftyDaysToggle = document.getElementById('holy-fifty-days-toggle');
    servantNameInput = document.getElementById('servant-name-input');
    shareLinkButton = document.getElementById('share-link-button');
    shareScripturesButton = document.getElementById('share-scriptures-button');
    patriarchNameInput = document.getElementById('patriarch-name-input');
    bishopNameInput = document.getElementById('bishop-name-input');
    attendingBishopsInput = document.getElementById('attending-bishops-input');
    churchNameInput = document.getElementById('church-name-input');
    countryNameInput = document.getElementById('country-name-input');
    headOfStateInput = document.getElementById('head-of-state-input');
    anglicizeNamesToggle = document.getElementById('anglicize-names-toggle');
    bibleVerseSidebar = document.querySelector('.bible-verse-sidebar');

    kidasePaulineRefContainer = document.getElementById('kidase-pauline-ref-container');
    kidaseUniversalRefContainer = document.getElementById('kidase-universal-ref-container');
    kidaseActsRefContainer = document.getElementById('kidase-acts-ref-container');
    kidasePsalmRefContainer = document.getElementById('kidase-psalm-ref-container');
    kidaseGospelRefContainer = document.getElementById('kidase-gospel-ref-container');
    hardRefreshButton = document.getElementById('hard-refresh-button');
}
const PSALM_COMBINATIONS = {
    'daily': {
        name: 'Daily Prayer',
        psalms: [12, 15, 22, 50, 90, 102, 135]
    },
    'all': {
        name: 'All | ኵሉ',
        dropdownLabel: 'All | ኵሉ (1-150)',
        psalms: Array.from({length: 150}, (_, i) => i + 1),
        prophetSongs: []
    },
    'monday': {
        name: 'Monday | ሰኑይ',
        dropdownLabel: 'Monday | ሰኑይ (1-30)',
        psalms: Array.from({length: 30}, (_, i) => i + 1),
        prophetSongs: []
    },
    'tuesday': {
        name: 'Tuesday | ሠሉስ',
        dropdownLabel: 'Tuesday | ሠሉስ (31-60)',
        psalms: Array.from({length: 30}, (_, i) => i + 31),
        prophetSongs: []
    },
    'wednesday': {
        name: 'Wednesday | ረቡዕ',
        dropdownLabel: 'Wednesday | ረቡዕ (61-80)',
        psalms: Array.from({length: 20}, (_, i) => i + 61),
        prophetSongs: []
    },
    'thursday': {
        name: 'Thursday | ሐሙስ',
        dropdownLabel: 'Thursday | ሐሙስ (81-110)',
        psalms: Array.from({length: 30}, (_, i) => i + 81),
        prophetSongs: []
    },
    'friday': {
        name: 'Friday | ዓርብ',
        dropdownLabel: 'Friday | ዓርብ (111-130)',
        psalms: Array.from({length: 20}, (_, i) => i + 111),
        prophetSongs: []
    },
    'saturday': {
        name: 'Saturday | ቀዳሚት',
        dropdownLabel: 'Saturday | ቀዳሚት (131-150, Song of Songs 1-5)',
        psalms: Array.from({length: 20}, (_, i) => i + 131),
        prophetSongs: ['songOfSongs']
    },
    'sunday': {
        name: 'Sunday | እሁድ',
        dropdownLabel: 'Sunday | እሁድ (Songs of the Prophets: Moses, Hannah, Hezekiah, Manasseh, Jonah, Three Youths, Habakkuk, Isaiah, Mary, Zachariah, Simeon)',
        psalms: [],
        prophetSongs: [
            'firstSongOfMoses',
            'secondSongOfMoses',
            'thirdSongOfMoses',
            'prayerOfHannah',
            'prayerOfHezekiah',
            'prayerOfManasseh',
            'firstPrayerOfThreeYouths',
            'secondPrayerOfThreeYouths',
            'thirdPrayerOfThreeYouths',
            'prayerOfHabakkuk',
            'prayerOfIsaiah',
            'prayerOfMary',
            'songOfZachariah',
            'prayerOfSimeon',
            'prayerOfJonah'
        ]
    },
    'nigus1': {
        name: 'Nigus #1',
        dropdownLabel: 'Nigus #1: Fikarie Zetsadiqan Wezehatian… | ፍካሬ ዘጻድቃን ወዘኃጥኣን… | The exposition of the righteous and of the sinners… (1-10)',
        psalms: Array.from({length: 10}, (_, i) => i + 1),
        prophetSongs: []
    },
    'nigus2': {
        name: 'Nigus #2',
        dropdownLabel: 'Nigus #2: Adihineni Egzio… | አድኅነኒ እግዚኦ… | Help, Lord… (11-20)',
        psalms: Array.from({length: 10}, (_, i) => i + 11),
        prophetSongs: []
    },
    'nigus3': {
        name: 'Nigus #3',
        dropdownLabel: 'Nigus #3: Amlakiye Amlakiye… | አምላኪየ አምላኪየ… | My God, My God… (21-30)',
        psalms: Array.from({length: 10}, (_, i) => i + 21),
        prophetSongs: []
    },
    'nigus4': {
        name: 'Nigus #4',
        dropdownLabel: 'Nigus #4: Bitsuan Ele… | ብፁዓን እለ… | Blessed are those… (31-40)',
        psalms: Array.from({length: 10}, (_, i) => i + 31),
        prophetSongs: []
    },
    'nigus5': {
        name: 'Nigus #5',
        dropdownLabel: 'Nigus #5: Keme Yafeqir Hayel… | ከመ ያፈቅር ኀየል… | As the deer pants… (41-50)',
        psalms: Array.from({length: 10}, (_, i) => i + 41),
        prophetSongs: []
    },
    'nigus6': {
        name: 'Nigus #6',
        dropdownLabel: 'Nigus #6: Lemint Yiziehar… | ለምንት ይዜኃር… | Why do you boast… (51-60)',
        psalms: Array.from({length: 10}, (_, i) => i + 51),
        prophetSongs: []
    },
    'nigus7': {
        name: 'Nigus #7',
        dropdownLabel: 'Nigus #7: Akonu LeEgziabihier Tigeni Nefsiye… | አኮኑ ለእግዚአብሔር ትገኒ ነፍስየ… | Truly… (61-70)',
        psalms: Array.from({length: 10}, (_, i) => i + 61),
        prophetSongs: []
    },
    'nigus8': {
        name: 'Nigus #8',
        dropdownLabel: 'Nigus #8: Egzio Kuneneke Habo LeNigus… | እግዚኦ ኵነኔከ ሀቦ ለንጉሥ… | Give the king Your judgments, O God… (71-80)',
        psalms: Array.from({length: 10}, (_, i) => i + 71),
        prophetSongs: []
    },
    'nigus9': {
        name: 'Nigus #9',
        dropdownLabel: 'Nigus #9: Egziabihier Qome… | እግዚአብሔር ቆመ… | God stands… (81-90)',
        psalms: Array.from({length: 10}, (_, i) => i + 81),
        prophetSongs: []
    },
    'nigus10': {
        name: 'Nigus #10',
        dropdownLabel: 'Nigus #10: Yihieyis Teamino BeEgziabihier… | ይኄይስ ተአምኖ በእግዚአብሔር… | It is good to give thanks to the Lord… (91-100)',
        psalms: Array.from({length: 10}, (_, i) => i + 91),
        prophetSongs: []
    },
    'nigus11': {
        name: 'Nigus #11',
        dropdownLabel: 'Nigus #11: Simeani Egzio Tselotiye… | ስምዓኒ እግዚኦ ጸሎትየ… | Hear my prayer, O Lord… (101-110)',
        psalms: Array.from({length: 10}, (_, i) => i + 101),
        prophetSongs: []
    },
    'nigus12': {
        name: 'Nigus #12',
        dropdownLabel: 'Nigus #12: Bitsui Beisi Zeyiferho LeEgziabihier… | ብፁዕ ብእሲ ዘይፈርሆ ለእግዚአብሔር… | Blessed is the man who fears the Lord… (111-120)',
        psalms: Array.from({length: 10}, (_, i) => i + 111),
        prophetSongs: []
    },
    'nigus13': {
        name: 'Nigus #13',
        dropdownLabel: 'Nigus #13: Tefesahiku Isme Yibeluni… | ተፈሣሕኩ እስመ ይቤሉኒ… | I was glad when they said to me… (121-130)',
        psalms: Array.from({length: 10}, (_, i) => i + 121),
        prophetSongs: []
    },
    'nigus14': {
        name: 'Nigus #14',
        dropdownLabel: 'Nigus #14: Tezekero Egzio LeDawit… | ተዘከሮ እግዚኦ ለዳዊት… | Lord, remember David… (131-140)',
        psalms: Array.from({length: 10}, (_, i) => i + 131),
        prophetSongs: []
    },
    'nigus15': {
        name: 'Nigus #15',
        dropdownLabel: 'Nigus #15: Qaliye Habe Egziabihier Tserahku… | ቃልየ ኀበ እግዚአብሔር ጸራኅኩ… | I cry out to the Lord with my voice… (141-150)',
        psalms: Array.from({length: 10}, (_, i) => i + 141),
        prophetSongs: []
    },
    'dawn': {
        name: 'Dawn (1st Hour) | ነግህ',
        dropdownLabel: 'Dawn (1st Hour) | Negih | ነግህ (62, 50, 112, 110, 99, Prayer of Zachariah)',
        psalms: [62, 50, 112, 110, 99],
        prophetSongs: ['songOfZachariah']
    },
    'sunset': {
        name: 'Sunset (11th Hour) | ሠርክ',
        dropdownLabel: 'Sunset (11th Hour) | Serk | ሠርክ (23, 140, 14, 145, 66, Prayer of Simeon)',
        psalms: [23, 140, 14, 145, 66],
        prophetSongs: ['prayerOfSimeon']
    },
    'coptic_1st': {
        name: 'Dawn / Prime (1st Hour) | ነግህ',
        dropdownLabel: 'Dawn / Prime (1st Hour) | Negih | ነግህ (50, 1-6, 8, 11, 12, 14, 15, 18, 24, 26, 62, 66, 69, 112, 142)',
        psalms: [50, 1, 2, 3, 4, 5, 6, 8, 11, 12, 14, 15, 18, 24, 26, 62, 66, 69, 112, 142],
        prophetSongs: []
    },
    'coptic_3rd': {
        name: 'Terce (3rd Hour) | ሠለስት',
        dropdownLabel: 'Terce (3rd Hour) | Selest | ሠለስት (50, 19, 22, 23, 25, 28, 29, 33, 40, 42, 44-46)',
        psalms: [50, 19, 22, 23, 25, 28, 29, 33, 40, 42, 44, 45, 46],
        prophetSongs: []
    },
    'coptic_6th': {
        name: 'Midday / Sext (6th Hour) | ቀትር',
        dropdownLabel: 'Midday / Sext (6th Hour) | Qetir | ቀትር (50, 53, 56, 60, 62, 66, 69, 83-86, 90)',
        psalms: [50, 53, 56, 60, 62, 66, 69, 83, 84, 85, 86, 90],
        prophetSongs: []
    },
    'coptic_9th': {
        name: 'None (9th Hour) | ተሲያት',
        dropdownLabel: 'None (9th Hour) | Tesiyat | ተሲያት (50, 95-100, 109-112, 114, 115)',
        psalms: [50, 95, 96, 97, 98, 99, 100, 109, 110, 111, 112, 114, 115],
        prophetSongs: []
    },
    'coptic_11th': {
        name: 'Evening / Vespers (11th Hour) | ሠርክ',
        dropdownLabel: 'Evening / Vespers (11th Hour) | Serk | ሠርክ (50, 116, 117, 119-128)',
        psalms: [50, 116, 117, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128],
        prophetSongs: []
    },
    'coptic_12th': {
        name: 'Sleep / Compline (12th Hour) | ንዋም',
        dropdownLabel: 'Sleep / Compline (12th Hour) | Niwam | ንዋም (50, 129-133, 136, 137, 140, 141, 145-147)',
        psalms: [50, 129, 130, 131, 132, 133, 136, 137, 140, 141, 145, 146, 147],
        prophetSongs: []
    },
    'coptic_veil': {
        name: 'Veil (Monastic) | ጸሎተ መንጦላዕት',
        dropdownLabel: 'Prayer of the Veil | Tselote Mentola\'it | ጸሎተ መንጦላዕት (50, 4, 6, 12, 15, 24, 26, 66, 69, 22, 29, 42, 56, 85, 90, 96, 109, 114, 115, 120, 128-133, 136, 140, 145, 118:153-176)',
        psalms: [50, 4, 6, 12, 15, 24, 26, 66, 69, 22, 29, 42, 56, 85, 90, 96, 109, 114, 115, 120, 128, 129, 130, 131, 132, 133, 136, 140, 145, 118],
        verseRanges: { 118: { start: 153, end: 176 } },
        prophetSongs: []
    },
    'coptic_midnight_1': {
        name: 'Midnight (1st Watch) | መንፈቀ ሌሊት (፩)',
        dropdownLabel: 'Midnight (1st Watch) | Menfeqe Lelit | መንፈቀ ሌሊት ፩ (50, 3, 6, 12, 69, 85, 90, 116-118)',
        psalms: [50, 3, 6, 12, 69, 85, 90, 116, 117, 118],
        prophetSongs: []
    },
    'coptic_midnight_2': {
        name: 'Midnight (2nd Watch) | መንፈቀ ሌሊት (፪)',
        dropdownLabel: 'Midnight (2nd Watch) | Menfeqe Lelit | መንፈቀ ሌሊት ፪ (50, 119-133)',
        psalms: [50, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133],
        prophetSongs: []
    },
    'coptic_midnight_3': {
        name: 'Midnight (3rd Watch) | መንፈቀ ሌሊት (፫)',
        dropdownLabel: 'Midnight (3rd Watch) | Menfeqe Lelit | መንፈቀ ሌሊት ፫ (50, 134-142, 144-150)',
        psalms: [50, 134, 135, 136, 137, 138, 139, 140, 141, 142, 144, 145, 146, 147, 148, 149, 150],
        prophetSongs: []
    },
    'month_d1_morning': {
        name: 'Morning of the 1st Day | ዕለት ፩ ነግህ',
        dropdownLabel: 'Morning of the 1st Day | ዕለት ፩ ነግህ (1-4)',
        psalms: [1, 2, 3, 4],
        prophetSongs: []
    },
    'month_d1_evening': {
        name: 'Evening of the 1st Day | ዕለት ፩ ሠርክ',
        dropdownLabel: 'Evening of the 1st Day | ዕለት ፩ ሠርክ (5-8)',
        psalms: [5, 6, 7, 8],
        prophetSongs: []
    },
    'month_d2_morning': {
        name: 'Morning of the 2nd Day | ዕለት ፪ ነግህ',
        dropdownLabel: 'Morning of the 2nd Day | ዕለት ፪ ነግህ (9)',
        psalms: [9],
        prophetSongs: []
    },
    'month_d2_evening': {
        name: 'Evening of the 2nd Day | ዕለት ፪ ሠርክ',
        dropdownLabel: 'Evening of the 2nd Day | ዕለት ፪ ሠርክ (10-13)',
        psalms: [10, 11, 12, 13],
        prophetSongs: []
    },
    'month_d3_morning': {
        name: 'Morning of the 3rd Day | ዕለት ፫ ነግህ',
        dropdownLabel: 'Morning of the 3rd Day | ዕለት ፫ ነግህ (14-16)',
        psalms: [14, 15, 16],
        prophetSongs: []
    },
    'month_d3_evening': {
        name: 'Evening of the 3rd Day | ዕለት ፫ ሠርክ',
        dropdownLabel: 'Evening of the 3rd Day | ዕለት ፫ ሠርክ (17)',
        psalms: [17],
        prophetSongs: []
    },
    'month_d4_morning': {
        name: 'Morning of the 4th Day | ዕለት ፬ ነግህ',
        dropdownLabel: 'Morning of the 4th Day | ዕለት ፬ ነግህ (18-19)',
        psalms: [18, 19],
        prophetSongs: []
    },
    'month_d4_evening': {
        name: 'Evening of the 4th Day | ዕለት ፬ ሠርክ',
        dropdownLabel: 'Evening of the 4th Day | ዕለት ፬ ሠርክ (20-21)',
        psalms: [20, 21],
        prophetSongs: []
    },
    'month_d5_morning': {
        name: 'Morning of the 5th Day | ዕለት ፭ ነግህ',
        dropdownLabel: 'Morning of the 5th Day | ዕለት ፭ ነግህ (22-24)',
        psalms: [22, 23, 24],
        prophetSongs: []
    },
    'month_d5_evening': {
        name: 'Evening of the 5th Day | ዕለት ፭ ሠርክ',
        dropdownLabel: 'Evening of the 5th Day | ዕለት ፭ ሠርክ (25-28)',
        psalms: [25, 26, 27, 28],
        prophetSongs: []
    },
    'month_d6_morning': {
        name: 'Morning of the 6th Day | ዕለት ፮ ነግህ',
        dropdownLabel: 'Morning of the 6th Day | ዕለት ፮ ነግህ (29-30)',
        psalms: [29, 30],
        prophetSongs: []
    },
    'month_d6_evening': {
        name: 'Evening of the 6th Day | ዕለት ፮ ሠርክ',
        dropdownLabel: 'Evening of the 6th Day | ዕለት ፮ ሠርክ (31-32)',
        psalms: [31, 32],
        prophetSongs: []
    },
    'month_d7_morning': {
        name: 'Morning of the 7th Day | ዕለት ፯ ነግህ',
        dropdownLabel: 'Morning of the 7th Day | ዕለት ፯ ነግህ (33-34)',
        psalms: [33, 34],
        prophetSongs: []
    },
    'month_d7_evening': {
        name: 'Evening of the 7th Day | ዕለት ፯ ሠርክ',
        dropdownLabel: 'Evening of the 7th Day | ዕለት ፯ ሠርክ (35-36)',
        psalms: [35, 36],
        prophetSongs: []
    },
    'month_d8_morning': {
        name: 'Morning of the 8th Day | ዕለት ፰ ነግህ',
        dropdownLabel: 'Morning of the 8th Day | ዕለት ፰ ነግህ (37-38)',
        psalms: [37, 38],
        prophetSongs: []
    },
    'month_d8_evening': {
        name: 'Evening of the 8th Day | ዕለት ፰ ሠርክ',
        dropdownLabel: 'Evening of the 8th Day | ዕለት ፰ ሠርክ (39-40)',
        psalms: [39, 40],
        prophetSongs: []
    },
    'month_d9_morning': {
        name: 'Morning of the 9th Day | ዕለት ፱ ነግህ',
        dropdownLabel: 'Morning of the 9th Day | ዕለት ፱ ነግህ (41-43)',
        psalms: [41, 42, 43],
        prophetSongs: []
    },
    'month_d9_evening': {
        name: 'Evening of the 9th Day | ዕለት ፱ ሠርክ',
        dropdownLabel: 'Evening of the 9th Day | ዕለት ፱ ሠርክ (44-45)',
        psalms: [44, 45],
        prophetSongs: []
    },
    'month_d10_morning': {
        name: 'Morning of the 10th Day | ዕለት ፲ ነግህ',
        dropdownLabel: 'Morning of the 10th Day | ዕለት ፲ ነግህ (46-48)',
        psalms: [46, 47, 48],
        prophetSongs: []
    },
    'month_d10_evening': {
        name: 'Evening of the 10th Day | ዕለት ፲ ሠርክ',
        dropdownLabel: 'Evening of the 10th Day | ዕለት ፲ ሠርክ (49-51)',
        psalms: [49, 50, 51],
        prophetSongs: []
    },
    'month_d11_morning': {
        name: 'Morning of the 11th Day | ዕለት ፲፩ ነግህ',
        dropdownLabel: 'Morning of the 11th Day | ዕለት ፲፩ ነግህ (52-54)',
        psalms: [52, 53, 54],
        prophetSongs: []
    },
    'month_d11_evening': {
        name: 'Evening of the 11th Day | ዕለት ፲፩ ሠርክ',
        dropdownLabel: 'Evening of the 11th Day | ዕለት ፲፩ ሠርክ (55-57)',
        psalms: [55, 56, 57],
        prophetSongs: []
    },
    'month_d12_morning': {
        name: 'Morning of the 12th Day | ዕለት ፲፪ ነግህ',
        dropdownLabel: 'Morning of the 12th Day | ዕለት ፲፪ ነግህ (58-59)',
        psalms: [58, 59],
        prophetSongs: []
    },
    'month_d12_evening': {
        name: 'Evening of the 12th Day | ዕለት ፲፪ ሠርክ',
        dropdownLabel: 'Evening of the 12th Day | ዕለት ፲፪ ሠርክ (60-62)',
        psalms: [60, 61, 62],
        prophetSongs: []
    },
    'month_d13_morning': {
        name: 'Morning of the 13th Day | ዕለት ፲፫ ነግህ',
        dropdownLabel: 'Morning of the 13th Day | ዕለት ፲፫ ነግህ (63-65)',
        psalms: [63, 64, 65],
        prophetSongs: []
    },
    'month_d13_evening': {
        name: 'Evening of the 13th Day | ዕለት ፲፫ ሠርክ',
        dropdownLabel: 'Evening of the 13th Day | ዕለት ፲፫ ሠርክ (66-67)',
        psalms: [66, 67],
        prophetSongs: []
    },
    'month_d14_morning': {
        name: 'Morning of the 14th Day | ዕለት ፲፬ ነግህ',
        dropdownLabel: 'Morning of the 14th Day | ዕለት ፲፬ ነግህ (68-69)',
        psalms: [68, 69],
        prophetSongs: []
    },
    'month_d14_evening': {
        name: 'Evening of the 14th Day | ዕለት ፲፬ ሠርክ',
        dropdownLabel: 'Evening of the 14th Day | ዕለት ፲፬ ሠርክ (70-71)',
        psalms: [70, 71],
        prophetSongs: []
    },
    'month_d15_morning': {
        name: 'Morning of the 15th Day | ዕለት ፲፭ ነግህ',
        dropdownLabel: 'Morning of the 15th Day | ዕለት ፲፭ ነግህ (72-73)',
        psalms: [72, 73],
        prophetSongs: []
    },
    'month_d15_evening': {
        name: 'Evening of the 15th Day | ዕለት ፲፭ ሠርክ',
        dropdownLabel: 'Evening of the 15th Day | ዕለት ፲፭ ሠርክ (74-76)',
        psalms: [74, 75, 76],
        prophetSongs: []
    },
    'month_d16_morning': {
        name: 'Morning of the 16th Day | ዕለት ፲፮ ነግህ',
        dropdownLabel: 'Morning of the 16th Day | ዕለት ፲፮ ነግህ (77)',
        psalms: [77],
        prophetSongs: []
    },
    'month_d16_evening': {
        name: 'Evening of the 16th Day | ዕለት ፲፮ ሠርክ',
        dropdownLabel: 'Evening of the 16th Day | ዕለት ፲፮ ሠርክ (78)',
        psalms: [78],
        prophetSongs: []
    },
    'month_d17_morning': {
        name: 'Morning of the 17th Day | ዕለት ፲፯ ነግህ',
        dropdownLabel: 'Morning of the 17th Day | ዕለት ፲፯ ነግህ (79-81)',
        psalms: [79, 80, 81],
        prophetSongs: []
    },
    'month_d17_evening': {
        name: 'Evening of the 17th Day | ዕለት ፲፯ ሠርክ',
        dropdownLabel: 'Evening of the 17th Day | ዕለት ፲፯ ሠርክ (82-84)',
        psalms: [82, 83, 84],
        prophetSongs: []
    },
    'month_d18_morning': {
        name: 'Morning of the 18th Day | ዕለት ፲፰ ነግህ',
        dropdownLabel: 'Morning of the 18th Day | ዕለት ፲፰ ነግህ (85-87)',
        psalms: [85, 86, 87],
        prophetSongs: []
    },
    'month_d18_evening': {
        name: 'Evening of the 18th Day | ዕለት ፲፰ ሠርክ',
        dropdownLabel: 'Evening of the 18th Day | ዕለት ፲፰ ሠርክ (88)',
        psalms: [88],
        prophetSongs: []
    },
    'month_d19_morning': {
        name: 'Morning of the 19th Day | ዕለት ፲፱ ነግህ',
        dropdownLabel: 'Morning of the 19th Day | ዕለት ፲፱ ነግህ (89-91)',
        psalms: [89, 90, 91],
        prophetSongs: []
    },
    'month_d19_evening': {
        name: 'Evening of the 19th Day | ዕለት ፲፱ ሠርክ',
        dropdownLabel: 'Evening of the 19th Day | ዕለት ፲፱ ሠርክ (92-94)',
        psalms: [92, 93, 94],
        prophetSongs: []
    },
    'month_d20_morning': {
        name: 'Morning of the 20th Day | ዕለት ፳ ነግህ',
        dropdownLabel: 'Morning of the 20th Day | ዕለት ፳ ነግህ (95-97)',
        psalms: [95, 96, 97],
        prophetSongs: []
    },
    'month_d20_evening': {
        name: 'Evening of the 20th Day | ዕለት ፳ ሠርክ',
        dropdownLabel: 'Evening of the 20th Day | ዕለት ፳ ሠርክ (98-101)',
        psalms: [98, 99, 100, 101],
        prophetSongs: []
    },
    'month_d21_morning': {
        name: 'Morning of the 21st Day | ዕለት ፳፩ ነግህ',
        dropdownLabel: 'Morning of the 21st Day | ዕለት ፳፩ ነግህ (102-103)',
        psalms: [102, 103],
        prophetSongs: []
    },
    'month_d21_evening': {
        name: 'Evening of the 21st Day | ዕለት ፳፩ ሠርክ',
        dropdownLabel: 'Evening of the 21st Day | ዕለት ፳፩ ሠርክ (104)',
        psalms: [104],
        prophetSongs: []
    },
    'month_d22_morning': {
        name: 'Morning of the 22nd Day | ዕለት ፳፪ ነግህ',
        dropdownLabel: 'Morning of the 22nd Day | ዕለት ፳፪ ነግህ (105)',
        psalms: [105],
        prophetSongs: []
    },
    'month_d22_evening': {
        name: 'Evening of the 22nd Day | ዕለት ፳፪ ሠርክ',
        dropdownLabel: 'Evening of the 22nd Day | ዕለት ፳፪ ሠርክ (106)',
        psalms: [106],
        prophetSongs: []
    },
    'month_d23_morning': {
        name: 'Morning of the 23rd Day | ዕለት ፳፫ ነግህ',
        dropdownLabel: 'Morning of the 23rd Day | ዕለት ፳፫ ነግህ (107-109)',
        psalms: [107, 108, 109],
        prophetSongs: []
    },
    'month_d23_evening': {
        name: 'Evening of the 23rd Day | ዕለት ፳፫ ሠርክ',
        dropdownLabel: 'Evening of the 23rd Day | ዕለት ፳፫ ሠርክ (110-113)',
        psalms: [110, 111, 112, 113],
        prophetSongs: []
    },
    'month_d24_morning': {
        name: 'Morning of the 24th Day | ዕለት ፳፬ ነግህ',
        dropdownLabel: 'Morning of the 24th Day | ዕለት ፳፬ ነግህ (114-117)',
        psalms: [114, 115, 116, 117],
        prophetSongs: []
    },
    'month_d24_evening': {
        name: 'Evening of the 24th Day | ዕለት ፳፬ ሠርክ',
        dropdownLabel: 'Evening of the 24th Day | ዕለት ፳፬ ሠርክ (118:1-56)',
        psalms: [118],
        verseRanges: { 118: { start: 1, end: 56 } },
        prophetSongs: []
    },
    'month_d25_morning': {
        name: 'Morning of the 25th Day | ዕለት ፳፭ ነግህ',
        dropdownLabel: 'Morning of the 25th Day | ዕለት ፳፭ ነግህ (118:57-112)',
        psalms: [118],
        verseRanges: { 118: { start: 57, end: 112 } },
        prophetSongs: []
    },
    'month_d25_evening': {
        name: 'Evening of the 25th Day | ዕለት ፳፭ ሠርክ',
        dropdownLabel: 'Evening of the 25th Day | ዕለት ፳፭ ሠርክ (118:113-176)',
        psalms: [118],
        verseRanges: { 118: { start: 113, end: 176 } },
        prophetSongs: []
    },
    'month_d26_morning': {
        name: 'Morning of the 26th Day | ዕለት ፳፮ ነግህ',
        dropdownLabel: 'Morning of the 26th Day | ዕለት ፳፮ ነግህ (119-123)',
        psalms: [119, 120, 121, 122, 123],
        prophetSongs: []
    },
    'month_d26_evening': {
        name: 'Evening of the 26th Day | ዕለት ፳፮ ሠርክ',
        dropdownLabel: 'Evening of the 26th Day | ዕለት ፳፮ ሠርክ (124-127)',
        psalms: [124, 125, 126, 127],
        prophetSongs: []
    },
    'month_d27_morning': {
        name: 'Morning of the 27th Day | ዕለት ፳፯ ነግህ',
        dropdownLabel: 'Morning of the 27th Day | ዕለት ፳፯ ነግህ (128-131)',
        psalms: [128, 129, 130, 131],
        prophetSongs: []
    },
    'month_d27_evening': {
        name: 'Evening of the 27th Day | ዕለት ፳፯ ሠርክ',
        dropdownLabel: 'Evening of the 27th Day | ዕለት ፳፯ ሠርክ (132-134)',
        psalms: [132, 133, 134],
        prophetSongs: []
    },
    'month_d28_morning': {
        name: 'Morning of the 28th Day | ዕለት ፳፰ ነግህ',
        dropdownLabel: 'Morning of the 28th Day | ዕለት ፳፰ ነግህ (135-136)',
        psalms: [135, 136],
        prophetSongs: []
    },
    'month_d28_evening': {
        name: 'Evening of the 28th Day | ዕለት ፳፰ ሠርክ',
        dropdownLabel: 'Evening of the 28th Day | ዕለት ፳፰ ሠርክ (137-138)',
        psalms: [137, 138],
        prophetSongs: []
    },
    'month_d29_morning': {
        name: 'Morning of the 29th Day | ዕለት ፳፱ ነግህ',
        dropdownLabel: 'Morning of the 29th Day | ዕለት ፳፱ ነግህ (139-141)',
        psalms: [139, 140, 141],
        prophetSongs: []
    },
    'month_d29_evening': {
        name: 'Evening of the 29th Day | ዕለት ፳፱ ሠርክ',
        dropdownLabel: 'Evening of the 29th Day | ዕለት ፳፱ ሠርክ (142-143)',
        psalms: [142, 143],
        prophetSongs: []
    },
    'month_d30_morning': {
        name: 'Morning of the 30th Day | ዕለት ፴ ነግህ',
        dropdownLabel: 'Morning of the 30th Day | ዕለት ፴ ነግህ (144-147)',
        psalms: [144, 145, 146, 147],
        prophetSongs: []
    },
    'month_d30_evening': {
        name: 'Evening of the 30th Day | ዕለት ፴ ሠርክ',
        dropdownLabel: 'Evening of the 30th Day | ዕለት ፴ ሠርክ (148-150)',
        psalms: [148, 149, 150],
        prophetSongs: []
    },
    'nativity': {
        name: 'Nativity | ልደት',
        dropdownLabel: 'Nativity | Lidet | ልደት (19, 45, 85, 89, 110, 132)',
        psalms: [19, 45, 85, 89, 110, 132],
        prophetSongs: []
    },
    'baptism': {
        name: 'Baptism | ጥምቀት',
        dropdownLabel: 'Baptism | Timqet | ጥምቀት (42, 77, 114, 74, 85, 118)',
        psalms: [42, 77, 114, 74, 85, 118],
        prophetSongs: []
    },
    'crucifixion': {
        name: 'Crucifixion | ስቅለት',
        dropdownLabel: 'Crucifixion | Siqlet | ስቅለት (22, 40, 54, 69, 88)',
        psalms: [22, 40, 54, 69, 88],
        prophetSongs: []
    },
    'resurrection': {
        name: 'Resurrection | ትንሥኤ',
        dropdownLabel: 'Resurrection | Tinsaie | ትንሥኤ (2, 57, 111, 113, 114, 118)',
        psalms: [2, 57, 111, 113, 114, 118],
        prophetSongs: []
    },
    'ascension': {
        name: 'Ascension | እርገት',
        dropdownLabel: 'Ascension | Irget | እርገት (8, 15, 21, 24, 47, 108)',
        psalms: [8, 15, 21, 24, 47, 108],
        prophetSongs: []
    },
    'pentecost': {
        name: 'Pentecost | ጰራቅሊቶስ',
        dropdownLabel: 'Pentecost | Peraqlitos | ጰራቅሊቶስ (48, 68, 104, 145)',
        psalms: [48, 68, 104, 145],
        prophetSongs: []
    },
    'trinity_athanasius': {
        name: 'Trinity (St. Athanasius) | ምሥጢረ ሥላሴ',
        dropdownLabel: 'Trinity | Mistire Silassie | ምሥጢረ ሥላሴ (44, 99, 109)',
        psalms: [44, 99, 109],
        prophetSongs: []
    },
    'incarnation_athanasius': {
        name: 'Incarnation (St. Athanasius) | ምሥጢረ ሥጋዌ',
        dropdownLabel: 'Incarnation | Mistire Sigawe | ምሥጢረ ሥጋዌ (32, 44, 49, 86, 106, 109, 117)',
        psalms: [32, 44, 49, 86, 106, 109, 117],
        prophetSongs: []
    },
    'penance_athanasius': {
        name: 'Penance (St. Athanasius) | ምሥጢረ ንስሐ',
        dropdownLabel: 'Penance | Mistire Nisiha | ምሥጢረ ንስሐ (9, 50, 74, 91, 104-107, 110, 117, 135, 137)',
        psalms: [9, 50, 74, 91, 104, 105, 106, 107, 110, 117, 135, 137],
        prophetSongs: []
    },
    'communion_athanasius': {
        name: 'Communion (St. Athanasius) | ምሥጢረ ቁርባን',
        dropdownLabel: 'Communion | Mistire Qurban | ምሥጢረ ቁርባን (2, 21, 68, 71, 87, 137)',
        psalms: [2, 21, 68, 71, 87, 137],
        prophetSongs: []
    },
    'resurrection_athanasius': {
        name: 'Resurrection (St. Athanasius) | ምሥጢረ ትንሣኤ',
        dropdownLabel: 'Resurrection | Mistire Tinsaie | ምሥጢረ ትንሣኤ (9, 15, 23, 46, 49, 65, 71, 81, 109)',
        psalms: [9, 15, 23, 46, 49, 65, 71, 81, 109],
        prophetSongs: []
    },
    'baptism_cyril': {
        name: 'Baptism (St. Cyril) | ምሥጢረ ጥምቀት',
        dropdownLabel: 'Baptism | Mistire Timqet | ምሥጢረ ጥምቀት (31, 45, 81, 138)',
        psalms: [31, 45, 81, 138],
        prophetSongs: []
    },
    'chrismation_cyril': {
        name: 'Chrismation (St. Cyril) | ምሥጢረ ሜሮን',
        dropdownLabel: 'Chrismation | Mistire Meron | ምሥጢረ ሜሮን (44)',
        psalms: [44],
        prophetSongs: []
    },
    'communion_cyril': {
        name: 'Communion (St. Cyril) | ምሥጢረ ቁርባን',
        dropdownLabel: 'Communion | Mistire Qurban | ምሥጢረ ቁርባን (22, 26, 33, 103)',
        psalms: [22, 26, 33, 103],
        prophetSongs: []
    }
};

const PSALM_CATEGORIES = [
    {
        id: 'general',
        label: 'General Psalters',
        items: ['daily']
    },
    {
        id: 'nigus',
        label: 'Nigus / Sibhat Psalter (St. Yared of Aksum, c. 6th century)',
        items: ['nigus1', 'nigus2', 'nigus3', 'nigus4', 'nigus5', 'nigus6', 'nigus7', 'nigus8', 'nigus9', 'nigus10', 'nigus11', 'nigus12', 'nigus13', 'nigus14', 'nigus15']
    },
    {
        id: 'desert_fathers',
        label: 'Daily Psalter (Desert Fathers & Mothers, c. 4th century)',
        items: ['all']
    },
    {
        id: 'weekly',
        label: 'Weekly Psalter (St. Yared of Aksum, c. 6th century)',
        items: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    {
        id: 'monthly',
        label: 'Monthly Psalter (Echegé Gebre-Giyorgis of Debre Libanos, 1938 AD)',
        description: 'The Psalms of David to be recited at morning and evening prayer are written below; they are arranged so that all 150 Psalms of David are prayed through within one month. The division of the Psalms follows the order of the Holy Bible.',
        items: Array.from({ length: 30 }, (_, i) => [`month_d${i + 1}_morning`, `month_d${i + 1}_evening`]).flat()
    },
    {
        id: 'hourly',
        label: 'Hourly Psalters (Echegé Gebre-Giyorgis of Debre Libanos, 1938 AD)',
        items: ['dawn', 'sunset']
    },
    {
        id: 'hourly_coptic',
        label: 'Hourly Psalters (Coptic Agpeya, c. 11th century)',
        items: ['coptic_1st', 'coptic_3rd', 'coptic_6th', 'coptic_9th', 'coptic_11th', 'coptic_12th', 'coptic_veil', 'coptic_midnight_1', 'coptic_midnight_2', 'coptic_midnight_3']
    },
    {
        id: 'feasts',
        label: 'Feast Day Psalters (Echegé Gebre-Giyorgis of Debre Libanos, 1938 AD)',
        items: ['nativity', 'baptism', 'crucifixion', 'resurrection', 'ascension', 'pentecost']
    },
    {
        id: 'mysteries_athanasius',
        label: 'Catechetical Psalters (St. Athanasius of Alexandria, Letter to Marcellinus, c. 360 AD)',
        items: ['trinity_athanasius', 'incarnation_athanasius', 'penance_athanasius', 'communion_athanasius', 'resurrection_athanasius']
    },
    {
        id: 'mysteries_cyril',
        label: 'Mystagogical Psalters (St. Cyril of Jerusalem, Catechetical Lectures, c. 350 AD)',
        items: ['baptism_cyril', 'chrismation_cyril', 'communion_cyril']
    }
];
// --- State Variables ---
const SETTINGS_VERSION = '4.5.5'; // Update this to force refresh load settings
const APP_VERSION = '0.9.0-beta';
const STATIC_CHANGELOG = [
    { date: '2026-10-30', message: 'feat: add 5-tab navigation, Ethiopian calendar & liturgical hours, and Pray/Liturgy workflows', author: 'vineofmary' },
    { date: '2026-10-17', message: 'feat: add Puerto Rican Spanish liturgy translation and update refresh button', author: 'vineofmary' },
    { date: '2026-04-26', message: 'fix: clear verse prayer content when language data is empty', author: 'vineofmary' },
    { date: '2026-04-26', message: 'fix: constrain language-specific rubrication colors to legacy theme', author: 'vineofmary' },
    { date: '2026-04-26', message: 'feat: add interactive navigation to jump to prayer cards', author: 'vineofmary' },
    { date: '2026-04-26', message: 'refactor: optimize layout and font-size scaling for presentation mode', author: 'vineofmary' },
    { date: '2026-04-26', message: 'feat: add toggle setting for Ge\'ez phonetics for chants', author: 'vineofmary' }
];
const PREP_PSALMS_LIST = [24, 60, 101, 102, 129, 130];
let activePrimaryTab = 'pray'; // 'pray' | 'liturgy' | 'learn' | 'targuma' | 'search'
let prayTabProfile = null;
let liturgyTabProfile = null;
let currentTheme = {};
let isLeftSidebarCollapsed = false;
let isRightSidebarCollapsed = true;
let isServantsCornerActive = false;
let displayOptions = {};
let displayedLanguages = {};
let fontSizes = {};
let selectedPsalms = [];
let selectedPsalmVerseRanges = {};
let selectedProphetSongs = [];
let selectedSeatatLectionaryDay = 'None';
let selectedWidaseMaryamDay = 'monday';
let isKidaseModeActive = false;
let selectedAnaphora = 'apostles';
let selectedMiracleId = 'none';
let miraclePosition = 'anaphora';
let selectedMiracleTranslationIndex = 0;
let showSeatatReadings = false;
let showDailyLectionary = true;
let showPrepPsalms = false;
let showMatins = false;
let showTeklil = false;
let bridegroomName = '';
let brideName = '';
let showVespers = false;
let selectedKidaseDay = 'sunday';
let selectedCovenantPrayer = 'morning';
let showAnaphora = false;
let hideQuietPrayers = false;
let isHolyFiftyDays = false;
let useExternalBibleAPI = true;
let globalEnglishTranslation = 'nkjv';
let globalAmharicTranslation = 'am-2000';
let globalGeezTranslation = 'gez-1980';
let customDateTimeOverride = null; // ISO string when manually overridden, or null for live clock
let selectedKidaseReadingSetIndex = 0;

const DEFAULT_KIDASE_LECTIONARY_REFS = {
    morningPsalm: 'Psalms 34:7-8',
    morningGospel: 'Matthew 24:30-36',
    eveningPsalm: 'Psalms 141:1-2',
    eveningGospel: 'Matthew 14:15-21',
    pauline: 'Romans 9:17-30',
    universal: 'Jude 1:6-14',
    acts: 'Acts 10:3-9',
    psalm: 'Psalms 33:16-17',
    gospel: 'Luke 18:1-9'
};

const PSALM_READING_KEYS = new Set(['morningPsalm', 'eveningPsalm', 'psalm', 'psalmsOfDavid']);
const PROPHET_SONGS_READING_KEYS = new Set(['prophetSongs']);
const NT_READING_KEYS = new Set(['morningGospel', 'eveningGospel', 'pauline', 'universal', 'acts', 'gospel', 'dailyLectionary']);

function getDefaultReadingTranslationOverrides(engCode = 'nkjv', amCode = 'am-2000', geezCode = 'gez-1980') {
    const ntGeez = (geezCode === 'gez-2014' || geezCode === 'gez-1980') ? geezCode : 'gez-1980';
    return {
        morningPsalm: { english: engCode, amharic: amCode, geez: 'gez-1980-formatted' },
        morningGospel: { english: engCode, amharic: amCode, geez: ntGeez },
        eveningPsalm: { english: engCode, amharic: amCode, geez: 'gez-1980-formatted' },
        eveningGospel: { english: engCode, amharic: amCode, geez: ntGeez },
        pauline: { english: engCode, amharic: amCode, geez: ntGeez },
        universal: { english: engCode, amharic: amCode, geez: ntGeez },
        acts: { english: engCode, amharic: amCode, geez: ntGeez },
        psalm: { english: engCode, amharic: amCode, geez: 'gez-1980-formatted' },
        gospel: { english: engCode, amharic: amCode, geez: ntGeez },
        psalmsOfDavid: { english: engCode, amharic: amCode, geez: 'gez-1980-formatted' },
        prophetSongs: { english: engCode, amharic: amCode, geez: 'gez-1980-formatted' }
    };
}

let readingTranslationOverrides = getDefaultReadingTranslationOverrides();
let isInitializing = true;
let kidaseLectionaryRefs = { ...DEFAULT_KIDASE_LECTIONARY_REFS };
let selectedTypicalPsalmIds = {};
let currentTypicalPsalmsSearchQuery = '';
let customNames = {};
let bibleData = { nkjv: null, kjv: null, am54: null, rgv: null, geez_psalms: null, coptic: null, loaded: false };

// --- Language Registry ---
const LANGUAGE_REGISTRY = {
    // Main Section
    'english': { name: 'English', category: 'main', isAuto: false },
    'geez_script': { name: 'ግእዝ (Ge\'ez)', category: 'main', isAuto: false, isEthiopic: true },
    'geez_phonetic': { name: 'Ge\'ez Phonetic', category: 'main', isAuto: false },
    'amharic_script': { name: 'አማርኛ (Amharic)', category: 'main', isAuto: false, isEthiopic: true },
    'amharic_phonetic': { name: 'Amharic Phonetic', category: 'main', isAuto: false },
    'oromoo': { name: 'ኦሮምኛ (Oromo)', category: 'unofficial', isAuto: false, isEthiopic: true, isSeekingScribe: true },
    'tigrinya_script': { name: 'ትግርኛ (Tigrinya)', category: 'main', isAuto: false, isEthiopic: true },
    'tigrinya_phonetic': { name: 'Tigrinya Phonetic', category: 'main', isAuto: false },
    'spanish_pr': { name: 'Español - Puerto Rico (Spanish)', category: 'main', isAuto: false },
    'spanish': { name: 'Español - General (Spanish)*', category: 'main', isAuto: true },
    'french': { name: 'Français (French)*', category: 'main', isAuto: true },
    'coptic': { name: 'ϯⲙⲉⲧⲣⲉⲙⲛ̀ⲭⲏⲙⲓ (Coptic)', category: 'main', isAuto: false },
    'syriac': { name: 'ܣܘܪܝܝܐ (Syriac)', category: 'unofficial', isAuto: false, isSeekingScribe: true },
    'armenian': { name: 'Հայերեն (Armenian)', category: 'unofficial', isAuto: false, isSeekingScribe: true },

    // Phonetics (Main Section)
    // (Note: Already moved above for grouping but keeping IDs consistent)

    // Unofficial Section (Advanced)
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
    'spanish_pr', 'spanish', 'french', 'arabic', 'greek', 'hebrew', 'malayalam',
    'syriac', 'armenian', 'coptic',
    'geez_phonetic', 'amharic_phonetic', 'tigrinya_phonetic'
];
let searchMatches = [];
let currentMatchIndex = -1;
let currentSlideIndex = 0;
let _pendingSlideSignature = null; // Persists target slide identity across async re-renders
let _pendingSlideId = null; // Used for jump-to buttons that trigger a DOM rebuild
let _pendingSlidePredicate = null;
let _pendingSlideReadingType = null; // Persists target reading opening slide across async re-renders
let areAllSectionsCollapsed = true;
let dailyLectionaryPeriodOverride = null; // null = auto (< 17:00 -> 'morning', >= 17:00 -> 'sunset'), or 'morning' | 'sunset'
let dailyLectionaryDayOffset = 0;         // integer day offset scoped to the Daily Readings section

function getEffectiveDate() {
    if (customDateTimeOverride) {
        const parsed = new Date(customDateTimeOverride);
        if (!isNaN(parsed.getTime())) {
            return parsed;
        }
    }
    return new Date();
}

function getLiturgicalDateObject(dateObj = getEffectiveDate()) {
    const d = new Date(dateObj.getTime());
    if (d.getHours() >= 18) {
        d.setDate(d.getDate() + 1);
    }
    return d;
}

function getSeatatLiturgicalDay(dateObj = getEffectiveDate()) {
    const litDate = getLiturgicalDateObject(dateObj);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[litDate.getDay()];
}

function getActiveEotcLectionaryLookup(ethMonth, ethDay) {
    if (typeof window !== 'undefined' && typeof window.getEotcLectionaryEntry === 'function') {
        return window.getEotcLectionaryEntry(ethMonth, ethDay);
    }
    if (typeof getEotcLectionaryEntry === 'function') {
        return getEotcLectionaryEntry(ethMonth, ethDay);
    }
    return null;
}

function getActiveEotcFeastLookup(ethMonth, ethDay) {
    if (typeof window !== 'undefined' && typeof window.getEotcFeastInfo === 'function') {
        return window.getEotcFeastInfo(ethMonth, ethDay);
    }
    if (typeof getEotcFeastInfo === 'function') {
        return getEotcFeastInfo(ethMonth, ethDay);
    }
    return null;
}

function convertLxxRefHelper(psalmLxxStr) {
    if (!psalmLxxStr) return null;
    if (typeof window !== 'undefined' && typeof window.convertLxxPsalmRefToMt === 'function') {
        return window.convertLxxPsalmRefToMt(psalmLxxStr, getMtFromLxx);
    }
    if (typeof convertLxxPsalmRefToMt === 'function') {
        return convertLxxPsalmRefToMt(psalmLxxStr, getMtFromLxx);
    }
    return null;
}

function getDefaultKidaseRefsAndAnaphoraForDate(dateObj = getEffectiveDate(), setIndex = 0) {
    const eth = computeEthiopianDate(dateObj);
    const entry = getActiveEotcLectionaryLookup(eth.ethMonth, eth.ethDay);
    const refs = { ...DEFAULT_KIDASE_LECTIONARY_REFS };
    let anaphoraKey = 'apostles';
    let totalSets = 1;
    let clampedSetIndex = 0;

    if (entry) {
        if (entry.matins) {
            if (entry.matins.psalmLxx) {
                const mtMorningPs = convertLxxRefHelper(entry.matins.psalmLxx);
                if (mtMorningPs) refs.morningPsalm = mtMorningPs;
            }
            if (entry.matins.gospel) {
                refs.morningGospel = entry.matins.gospel;
            }
        }
        if (entry.qidase) {
            const sets = Array.isArray(entry.qidase.sets) && entry.qidase.sets.length > 0 ? entry.qidase.sets : [];
            totalSets = Math.max(1, sets.length);
            clampedSetIndex = Math.max(0, Math.min(totalSets - 1, Number(setIndex) || 0));
            const chosenSet = sets[clampedSetIndex] || sets[0] || {};
            if (chosenSet.pauline || entry.qidase.pauline) refs.pauline = chosenSet.pauline || entry.qidase.pauline;
            if (chosenSet.universal || entry.qidase.universal) refs.universal = chosenSet.universal || entry.qidase.universal;
            if (chosenSet.acts || entry.qidase.acts) refs.acts = chosenSet.acts || entry.qidase.acts;
            if (chosenSet.psalmLxx) {
                const mtPs = convertLxxRefHelper(chosenSet.psalmLxx);
                if (mtPs) refs.psalm = mtPs;
            }
            if (chosenSet.gospel) {
                refs.gospel = chosenSet.gospel;
            }
            if (typeof window !== 'undefined' && typeof window.resolveAppAnaphoraKey === 'function') {
                anaphoraKey = window.resolveAppAnaphoraKey(entry.qidase.anaphora);
            } else if (typeof resolveAppAnaphoraKey === 'function') {
                anaphoraKey = resolveAppAnaphoraKey(entry.qidase.anaphora);
            } else {
                anaphoraKey = entry.qidase.anaphora === 4 ? 'mary' : 'apostles';
            }
        }
    }

    const litDayName = getSeatatLiturgicalDay(dateObj);
    const kidaseDay = litDayName === 'Sunday' ? 'sunday' : (litDayName === 'Saturday' ? 'saturday' : 'weekday');
    const h = dateObj.getHours();
    const covenantTime = h < 6 ? 'midnight' : (h < 15 ? 'morning' : 'afternoon');

    return {
        eth,
        entry,
        refs,
        anaphoraKey,
        kidaseDay,
        covenantTime,
        litDayName,
        setIndex: clampedSetIndex,
        totalSets
    };
}

function syncLiturgicalSelectionsToEffectiveDate({ render = true } = {}) {
    const effDate = getEffectiveDate();
    const computed = getDefaultKidaseRefsAndAnaphoraForDate(effDate, 0);

    selectedKidaseReadingSetIndex = 0;
    dailyLectionaryPeriodOverride = null;
    dailyLectionaryDayOffset = 0;
    kidaseLectionaryRefs = { ...computed.refs };
    selectedTypicalPsalmIds = {};
    selectedKidaseDay = computed.kidaseDay;
    selectedCovenantPrayer = computed.covenantTime;
    selectedSeatatLectionaryDay = computed.litDayName;
    selectedAnaphora = computed.anaphoraKey;

    if (prayTabProfile) {
        prayTabProfile.selectedWidaseMaryamDay = computed.litDayName;
        prayTabProfile.selectedSeatatLectionaryDay = computed.litDayName;
        prayTabProfile.selectedProphetSongs = getDefaultProphetSongForTimeOfDay(effDate);
        prayTabProfile.selectedAnaphora = computed.anaphoraKey;
        localStorage.setItem('prayTabProfile', JSON.stringify(prayTabProfile));
    }
    if (liturgyTabProfile) {
        liturgyTabProfile.selectedSeatatLectionaryDay = computed.litDayName;
        liturgyTabProfile.selectedAnaphora = computed.anaphoraKey;
        localStorage.setItem('liturgyTabProfile', JSON.stringify(liturgyTabProfile));
    }

    if (activePrimaryTab === 'pray') {
        selectedWidaseMaryamDay = computed.litDayName;
        selectedProphetSongs = getDefaultProphetSongForTimeOfDay(effDate);
    }

    localStorage.setItem('lastAutoLectionaryDateKey', `${computed.eth.ethMonth}/${computed.eth.ethDay}`);

    if (typeof refreshLectionaryPickers === 'function') {
        refreshLectionaryPickers();
    }
    if (typeof updateProphetSongsSummary === 'function') {
        updateProphetSongsSummary();
    }
    if (typeof updateAllTogglesInSettingsPanel === 'function') {
        updateAllTogglesInSettingsPanel();
    }
    if (typeof renderLiturgicalCalendarBar === 'function') {
        renderLiturgicalCalendarBar();
    }
    saveSettings();
    if (render && typeof renderPrayers === 'function') {
        renderPrayers();
    }
}

function setCustomDateTimeOverride(dateOrIso, { render = true } = {}) {
    if (!dateOrIso) {
        return clearCustomDateTimeOverride({ render });
    }
    const parsed = (dateOrIso instanceof Date) ? new Date(dateOrIso.getTime()) : new Date(dateOrIso);
    if (isNaN(parsed.getTime())) return false;
    customDateTimeOverride = parsed.toISOString();
    localStorage.setItem('customDateTimeOverride', customDateTimeOverride);
    syncLiturgicalSelectionsToEffectiveDate({ render });
    return true;
}

function clearCustomDateTimeOverride({ render = true } = {}) {
    customDateTimeOverride = null;
    localStorage.removeItem('customDateTimeOverride');
    syncLiturgicalSelectionsToEffectiveDate({ render });
    return true;
}

function selectKidaseReadingSet(setIndex, { render = true } = {}) {
    const computed = getDefaultKidaseRefsAndAnaphoraForDate(getEffectiveDate(), setIndex);
    selectedKidaseReadingSetIndex = computed.setIndex;
    kidaseLectionaryRefs.pauline = computed.refs.pauline;
    kidaseLectionaryRefs.universal = computed.refs.universal;
    kidaseLectionaryRefs.acts = computed.refs.acts;
    kidaseLectionaryRefs.psalm = computed.refs.psalm;
    kidaseLectionaryRefs.gospel = computed.refs.gospel;
    delete selectedTypicalPsalmIds.psalm;
    if (typeof refreshLectionaryPickers === 'function') {
        refreshLectionaryPickers();
    }
    saveSettings();
    if (render && typeof renderPrayers === 'function') {
        renderPrayers();
    }
}

const BIBLE_BOOK_MAPPING = {
    'Matthew': { kjv: 40, nkjv: 40, am54: 'የማቴዎስ ወንጌል', rgv: 'Mateo', geez: 'ማቴዎስ' },
    'Mark': { kjv: 41, nkjv: 41, am54: 'የማርቆስ ወንጌል', rgv: 'Marcos', geez: 'ማርቆስ' },
    'Luke': { kjv: 42, nkjv: 42, am54: 'የሉቃስ ወንጌል', rgv: 'Lucas', geez: 'ሉቃስ' },
    'John': { kjv: 43, nkjv: 43, am54: 'የዮሐንስ ወንጌል', rgv: 'Juan', geez: 'ዮሐንስ' },
    'Acts': { kjv: 44, nkjv: 44, am54: 'የሐዋርያት ሥራ', rgv: 'Hechos', geez: 'ግብረ ሐዋርያት' },
    'Romans': { kjv: 45, nkjv: 45, am54: 'ወደ ሮሜ ሰዎች', rgv: 'Romanos', geez: 'ሮሜ' },
    '1 Corinthians': { kjv: 46, nkjv: 46, am54: '1ኛ ወደ ቆሮንቶስ ሰዎች', rgv: '1 Corintios', geez: 'ቆሮንቶስ ቀዳማዊ' },
    '2 Corinthians': { kjv: 47, nkjv: 47, am54: '2ኛ ወደ ቆሮንቶስ ሰዎች', rgv: '2 Corintios', geez: 'ቆሮንቶስ ዳግማዊ' },
    'Galatians': { kjv: 48, nkjv: 48, am54: 'ወደ ገላትያ ሰዎች', rgv: 'Gálatas', geez: 'ገላትያ' },
    'Ephesians': { kjv: 49, nkjv: 49, am54: 'ወደ ኤፌሶን ሰዎች', rgv: 'Efesios', geez: 'ኤፌሶን' },
    'Philippians': { kjv: 50, nkjv: 50, am54: 'ወደ ፊልጵስዩስ ሰዎች', rgv: 'Filipenses', geez: 'ፊልጵስዩስ' },
    'Colossians': { kjv: 51, nkjv: 51, am54: 'ወደ ቆላስይስ ሰዎች', rgv: 'Colosenses', geez: 'ቆላስይስ' },
    '1 Thessalonians': { kjv: 52, nkjv: 52, am54: '1ኛ ወደ ተሰሎንቄ ሰዎች', rgv: '1 Tesalonicenses', geez: 'ተሰሎንቄ ቀዳማዊ' },
    '2 Thessalonians': { kjv: 53, nkjv: 53, am54: '2ኛ ወደ ተሰሎንቄ ሰዎች', rgv: '2 Tesalonicenses', geez: 'ተሰሎንቄ ዳግማዊ' },
    '1 Timothy': { kjv: 54, nkjv: 54, am54: '1ኛ ወደ ጢሞቴዎስ', rgv: '1 Timoteo', geez: 'ጢሞቴዎስ ቀዳማዊ' },
    '2 Timothy': { kjv: 55, nkjv: 55, am54: '2ኛ ወደ ጢሞቴዎስ', rgv: '2 Timoteo', geez: 'ጢሞቴዎስ ዳግማዊ' },
    'Titus': { kjv: 56, nkjv: 56, am54: 'ወደ ቲቶ', rgv: 'Tito', geez: 'ቲቶ' },
    'Philemon': { kjv: 57, nkjv: 57, am54: 'ወደ ፊልሞና', rgv: 'Filemón', geez: 'ፊልሞና' },
    'Hebrews': { kjv: 58, nkjv: 58, am54: 'ወደ ዕብራውያን', rgv: 'Hebreos', geez: 'ዕብራውያን' },
    'James': { kjv: 59, nkjv: 59, am54: 'የያዕቆብ መልእክት', rgv: 'Santiago', geez: 'ያዕቆብ' },
    '1 Peter': { kjv: 60, nkjv: 60, am54: '1ኛ የጴጥሮስ መልእክት', rgv: '1 Pedro', geez: 'ጴጥሮስ ቀዳማዊ' },
    '2 Peter': { kjv: 61, nkjv: 61, am54: '2ኛ የጴጥሮስ መልእክት', rgv: '2 Pedro', geez: 'ጴጥሮስ ዳግማዊ' },
    '1 John': { kjv: 62, nkjv: 62, am54: '1ኛ የዮሐንስ መልእክት', rgv: '1 Juan', geez: 'ዮሐንስ ቀዳማዊ' },
    '2 John': { kjv: 63, nkjv: 63, am54: '2ኛ የዮሐንስ መልእክት', rgv: '2 Juan', geez: 'ዮሐንስ ዳግማዊ' },
    '3 John': { kjv: 64, nkjv: 64, am54: '3ኛ የዮሐንስ መልእክት', rgv: '3 Juan', geez: 'ዮሐንስ ሣልሳዊ' },
    'Jude': { kjv: 65, nkjv: 65, am54: 'የይሁዳ መልእክት', rgv: 'Judas', geez: 'ይሁዳ' },
    'Revelation': { kjv: 66, nkjv: 66, am54: 'የዮሐንስ ራእይ', rgv: 'Apocalipsis', geez: 'ራእይ' },
    'Psalms': { kjv: 19, nkjv: 19, am54: 'መዝሙረ ዳዊት', rgv: 'Salmos', geez: 'መዝሙረ ዳዊት' },
    'Psalm': { kjv: 19, nkjv: 19, am54: 'መዝሙረ ዳዊት', rgv: 'Salmos', geez: 'መዝሙረ ዳዊት' },
    'Genesis': { kjv: 1, nkjv: 1, am54: 'ኦሪት ዘፍጥረት', rgv: 'Génesis', geez: 'ዘፍጥረት' },
    'Exodus': { kjv: 2, nkjv: 2, am54: 'ኦሪት ዘጸአት', rgv: 'Éxodo', geez: 'ዘጸአት' },
    'Leviticus': { kjv: 3, nkjv: 3, am54: 'ኦሪት ዘሌዋውያን', rgv: 'Levítico', geez: 'ዘሌዋውያን' },
    'Numbers': { kjv: 4, nkjv: 4, am54: 'ኦሪት ዘኍልቍ', rgv: 'Números', geez: 'ዘኍልቍ' },
    'Deuteronomy': { kjv: 5, nkjv: 5, am54: 'ኦሪት ዘዳግም', rgv: 'Deuteronomio', geez: 'ዘዳግም' },
    'Joshua': { kjv: 6, nkjv: 6, am54: 'መጽሐፈ ኢያሱ ወልደ ነዌ', rgv: 'Josué', geez: 'ኢያሱ' },
    'Judges': { kjv: 7, nkjv: 7, am54: 'መጽሐፈ መሳፍንት', rgv: 'Jueces', geez: 'መሳፍንት' },
    'Ruth': { kjv: 8, nkjv: 8, am54: 'መጽሐፈ ሩት', rgv: 'Rut', geez: 'ሩት' },
    '1 Samuel': { kjv: 9, nkjv: 9, am54: 'መጽሐፈ ሳሙኤል ቀዳማዊ', rgv: '1 Samuel', geez: 'ሳሙኤል ቀዳማዊ' },
    '2 Samuel': { kjv: 10, nkjv: 10, am54: 'መጽሐፈ ሳሙኤል ካልዕ', rgv: '2 Samuel', geez: 'ሳሙኤል ካልዕ' },
    '1 Kings': { kjv: 11, nkjv: 11, am54: 'መጽሐፈ ነገሥት ቀዳማዊ', rgv: '1 Reyes', geez: 'ነገሥት ቀዳማዊ' },
    '2 Kings': { kjv: 12, nkjv: 12, am54: 'መጽሐፈ ነገሥት ካልዕ', rgv: '2 Reyes', geez: 'ነገሥት ካልዕ' },
    '1 Chronicles': { kjv: 13, nkjv: 13, am54: 'መጽሐፈ ዜና መዋዕል ቀዳማዊ', rgv: '1 Crónicas', geez: 'ዜና መዋዕል ቀዳማዊ' },
    '2 Chronicles': { kjv: 14, nkjv: 14, am54: 'መጽሐፈ ዜና መዋዕል ካልዕ', rgv: '2 Crónicas', geez: 'ዜና መዋዕል ካልዕ' },
    'Ezra': { kjv: 15, nkjv: 15, am54: 'መጽሐፈ ዕዝራ', rgv: 'Esdras', geez: 'ዕዝራ' },
    'Nehemiah': { kjv: 16, nkjv: 16, am54: 'መጽሐፈ ነህምያ', rgv: 'Nehemías', geez: 'ነህምያ' },
    'Esther': { kjv: 17, nkjv: 17, am54: 'መጽሐፈ አስቴር', rgv: 'Ester', geez: 'አስቴር' },
    'Job': { kjv: 18, nkjv: 18, am54: 'መጽሐፈ ኢዮብ', rgv: 'Job', geez: 'ኢዮብ' },
    'Proverbs': { kjv: 20, nkjv: 20, am54: 'መጽሐፈ ምሳሌ', rgv: 'Proverbios', geez: 'ምሳሌ' },
    'Book of Admonition': { kjv: null, nkjv: null, am54: 'መጽሐፈ ተግሣጽ', rgv: 'Proverbios', geez: 'ተግሣጽ' },
    'Ecclesiastes': { kjv: 21, nkjv: 21, am54: 'መጽሐፈ መክብብ', rgv: 'Eclesiastés', geez: 'መክብብ' },
    'Song of Solomon': { kjv: 22, nkjv: 22, am54: 'መኃልየ መኃልይ ዘሰሎሞን', rgv: 'Cantares', geez: 'መኃልየ መኃልይ' },
    'Isaiah': { kjv: 23, nkjv: 23, am54: 'ትንቢተ ኢሳይያስ', rgv: 'Isaías', geez: 'ኢሳይያስ' },
    'Jeremiah': { kjv: 24, nkjv: 24, am54: 'ትንቢተ ኤርምያስ', rgv: 'Jeremías', geez: 'ኤርምያስ' },
    'Lamentations': { kjv: 25, nkjv: 25, am54: 'ሰቆቃወ ኤርምያስ', rgv: 'Lamentaciones', geez: 'ሰቆቃወ ኤርምያስ' },
    'Ezekiel': { kjv: 26, nkjv: 26, am54: 'ትንቢተ ሕዝቅኤል', rgv: 'Ezequiel', geez: 'ሕዝቅኤል' },
    'Daniel': { kjv: 27, nkjv: 27, am54: 'ትንቢተ ዳንኤል', rgv: 'Daniel', geez: 'ዳንኤል' },
    'Hosea': { kjv: 28, nkjv: 28, am54: 'ትንቢተ ሆሴዕ', rgv: 'Oseas', geez: 'ሆሴዕ' },
    'Joel': { kjv: 29, nkjv: 29, am54: 'ትንቢተ ኢዩኤል', rgv: 'Joel', geez: 'ኢዩኤል' },
    'Amos': { kjv: 30, nkjv: 30, am54: 'ትንቢተ አሞጽ', rgv: 'Amós', geez: 'አሞጽ' },
    'Obadiah': { kjv: 31, nkjv: 31, am54: 'ትንቢተ አብድዩ', rgv: 'Abdías', geez: 'አብድዩ' },
    'Jonah': { kjv: 32, nkjv: 32, am54: 'ትንቢተ ዮናስ', rgv: 'Jonás', geez: 'ዮናስ' },
    'Micah': { kjv: 33, nkjv: 33, am54: 'ትንቢተ ሚክያስ', rgv: 'Miqueas', geez: 'ሚክያስ' },
    'Nahum': { kjv: 34, nkjv: 34, am54: 'ትንቢተ ናሆም', rgv: 'Nahúm', geez: 'ናሆም' },
    'Habakkuk': { kjv: 35, nkjv: 35, am54: 'ትንቢተ ዕንባቆም', rgv: 'Habacuc', geez: 'ዕንባቆም' },
    'Zephaniah': { kjv: 36, nkjv: 36, am54: 'ትንቢተ ሶፎንያስ', rgv: 'Sofonías', geez: 'ሶፎንያስ' },
    'Haggai': { kjv: 37, nkjv: 37, am54: 'ትንቢተ ሐጌ', rgv: 'Hageo', geez: 'ሐጌ' },
    'Zechariah': { kjv: 38, nkjv: 38, am54: 'ትንቢተ ዘካርያስ', rgv: 'Zacarías', geez: 'ዘካርያስ' },
    'Malachi': { kjv: 39, nkjv: 39, am54: 'ትንቢተ ሚልክያስ', rgv: 'Malaquías', geez: 'ሚልክያስ' },
    'Tobit': { kjv: null, nkjv: null, am54: 'መጽሐፈ ጦቢት', rgv: 'Tobías', geez: 'ጦቢት' },
    'Judith': { kjv: null, nkjv: null, am54: 'መጽሐፈ ዮዲት', rgv: 'Judit', geez: 'ዮዲት' },
    'Wisdom of Solomon': { kjv: null, nkjv: null, am54: 'መጽሐፈ ጥበብ', rgv: 'Sabiduría', geez: 'ጥበብ' },
    'Sirach': { kjv: null, nkjv: null, am54: 'መጽሐፈ ሲራክ', rgv: 'Eclesiástico', geez: 'ሲራክ' },
    'Baruch': { kjv: null, nkjv: null, am54: 'መጽሐፈ ባሮክ', rgv: 'Baruc', geez: 'ባሮክ' },
    'Rest of Jeremiah': { kjv: null, nkjv: null, am54: 'ተረፈ ኤርምያስ', rgv: 'Carta de Jeremías', geez: 'ተረፈ ኤርምያስ' },
    'Susanna': { kjv: null, nkjv: null, am54: 'ሶስና', rgv: 'Susana', geez: 'ሶስና' },
    'Bel and the Dragon': { kjv: null, nkjv: null, am54: 'ተረፈ ዳንኤል', rgv: 'Bel y el Dragón', geez: 'ተረፈ ዳንኤል' },
    'Rest of Daniel': { kjv: null, nkjv: null, am54: 'ተረፈ ዳንኤል', rgv: 'Bel y el Dragón', geez: 'ተረፈ ዳንኤል' },
    'Azariah': { kjv: null, nkjv: null, am54: 'ጸሎተ ሠለስቱ ደቂቅ', rgv: 'Oración de Azarías', geez: 'ጸሎተ ሠለስቱ ደቂቅ' },
    'Song of the Three Holy Children': { kjv: null, nkjv: null, am54: 'ጸሎተ ሠለስቱ ደቂቅ', rgv: 'Cántico de los Tres Jóvenes', geez: 'ጸሎተ ሠለስቱ ደቂቅ' },
    'Prayer of Manasseh': { kjv: null, nkjv: null, am54: 'ጸሎተ ምናሴ', rgv: 'Oración de Manasés', geez: 'ጸሎተ ምናሴ' }
};

// TYPICAL_PSALMS moved to js/typical_psalms.js

const BIBLE_METADATA = {
    'Genesis': { chapters: 50, maxVerses: 80 },
    'Exodus': { chapters: 40, maxVerses: 60 },
    'Leviticus': { chapters: 27, maxVerses: 65 },
    'Numbers': { chapters: 36, maxVerses: 90 },
    'Deuteronomy': { chapters: 34, maxVerses: 70 },
    'Joshua': { chapters: 24, maxVerses: 65 },
    'Judges': { chapters: 21, maxVerses: 60 },
    'Ruth': { chapters: 4, maxVerses: 25 },
    '1 Samuel': { chapters: 31, maxVerses: 60 },
    '2 Samuel': { chapters: 24, maxVerses: 55 },
    '1 Kings': { chapters: 22, maxVerses: 70 },
    '2 Kings': { chapters: 25, maxVerses: 45 },
    '1 Chronicles': { chapters: 29, maxVerses: 85 },
    '2 Chronicles': { chapters: 36, maxVerses: 45 },
    'Ezra': { chapters: 10, maxVerses: 75 },
    'Nehemiah': { chapters: 13, maxVerses: 75 },
    'Esther': { chapters: 11, maxVerses: 45 },
    'Job': { chapters: 42, maxVerses: 45 },
    'Proverbs': { chapters: 31, maxVerses: 40 },
    'Ecclesiastes': { chapters: 12, maxVerses: 30 },
    'Song of Solomon': { chapters: 8, maxVerses: 20 },
    'Isaiah': { chapters: 66, maxVerses: 40 },
    'Jeremiah': { chapters: 52, maxVerses: 65 },
    'Lamentations': { chapters: 5, maxVerses: 70 },
    'Ezekiel': { chapters: 48, maxVerses: 65 },
    'Daniel': { chapters: 14, maxVerses: 100 },
    'Hosea': { chapters: 14, maxVerses: 25 },
    'Joel': { chapters: 3, maxVerses: 35 },
    'Amos': { chapters: 9, maxVerses: 30 },
    'Obadiah': { chapters: 1, maxVerses: 25 },
    'Jonah': { chapters: 4, maxVerses: 20 },
    'Micah': { chapters: 7, maxVerses: 25 },
    'Nahum': { chapters: 3, maxVerses: 20 },
    'Habakkuk': { chapters: 3, maxVerses: 25 },
    'Zephaniah': { chapters: 3, maxVerses: 25 },
    'Haggai': { chapters: 2, maxVerses: 25 },
    'Zechariah': { chapters: 14, maxVerses: 25 },
    'Malachi': { chapters: 4, maxVerses: 25 },
    'Tobit': { chapters: 14, maxVerses: 25 },
    'Judith': { chapters: 16, maxVerses: 40 },
    'Wisdom of Solomon': { chapters: 19, maxVerses: 35 },
    'Sirach': { chapters: 51, maxVerses: 55 },
    'Baruch': { chapters: 6, maxVerses: 75 },
    'Rest of Jeremiah': { chapters: 1, maxVerses: 75 },
    'Susanna': { chapters: 1, maxVerses: 65 },
    'Bel and the Dragon': { chapters: 1, maxVerses: 45 },
    'Rest of Daniel': { chapters: 1, maxVerses: 45 },
    'Azariah': { chapters: 1, maxVerses: 70 },
    'Song of the Three Holy Children': { chapters: 1, maxVerses: 70 },
    'Matthew': { chapters: 28, maxVerses: 80 },
    'Mark': { chapters: 16, maxVerses: 80 },
    'Luke': { chapters: 24, maxVerses: 80 },
    'John': { chapters: 21, maxVerses: 80 },
    'Acts': { chapters: 28, maxVerses: 60 },
    'Romans': { chapters: 16, maxVerses: 40 },
    '1 Corinthians': { chapters: 16, maxVerses: 40 },
    '2 Corinthians': { chapters: 13, maxVerses: 35 },
    'Galatians': { chapters: 6, maxVerses: 35 },
    'Ephesians': { chapters: 6, maxVerses: 35 },
    'Philippians': { chapters: 4, maxVerses: 35 },
    'Colossians': { chapters: 4, maxVerses: 35 },
    '1 Thessalonians': { chapters: 5, maxVerses: 35 },
    '2 Thessalonians': { chapters: 3, maxVerses: 35 },
    '1 Timothy': { chapters: 6, maxVerses: 35 },
    '2 Timothy': { chapters: 4, maxVerses: 35 },
    'Titus': { chapters: 3, maxVerses: 35 },
    'Philemon': { chapters: 1, maxVerses: 35 },
    'Hebrews': { chapters: 13, maxVerses: 45 },
    'James': { chapters: 5, maxVerses: 30 },
    '1 Peter': { chapters: 5, maxVerses: 30 },
    '2 Peter': { chapters: 3, maxVerses: 30 },
    '1 John': { chapters: 5, maxVerses: 30 },
    '2 John': { chapters: 1, maxVerses: 30 },
    '3 John': { chapters: 1, maxVerses: 30 },
    'Jude': { chapters: 1, maxVerses: 25 },
    'Revelation': { chapters: 22, maxVerses: 35 },
    'Psalms': { chapters: 151, maxVerses: 176 }
};

const SEATAT_LECTIONARY_DATA = {
    'Monday': [
        { type: 'Pauline Epistle (1 Thessalonians 4:15-18) | መልእክተ ጳውሎስ ዘሰዓታት', book: '1 Thessalonians', chapter: 4, verses: '15-18' },
        { type: 'Universal Epistle (1 Peter 5:5-12) | መልእክተ ካልእ ዘሰዓታት', book: '1 Peter', chapter: 5, verses: '5-12' },
        { type: 'Acts of the Apostles (Acts 16:25-35) | ግብረ ሐዋርያት ዘሰዓታት', book: 'Acts', chapter: 16, verses: '25-35' },
        { type: 'Psalm (Psalm 1:2-3) | ምስባክ ዘሰዓታት', book: 'Psalms', chapter: 1, verses: '2-3', customEnglish: '[2] And in His law he meditates day and night. [3] He shall be like a tree planted by the rivers of water, that brings forth its fruit in its season.', customGeez: '[2] ወዘሕጎ ያነብብ መዕልተ ወሌሊተ። [3] ወየከውን ከመ ዕፅ እንተ ትክልት ኀበ ሙሓዘ ማይ፤ እንተ ትሁብ ፍሬሃ በበጊዜሃ；' },
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
        { type: 'Psalm (Psalm 87:1-2) | ምስባክ ዘሰዓታት', book: 'Psalms', chapter: 87, verses: '1-2', customEnglish: '[1] O Lord, God of my salvation, I have cried out day and night before You. [2] Let my prayer come before You...', customGeez: '[1] እግዚአብሔር አምላከ መድኀኒትየ፤ ዕለትየ ጸራኅኩ ኀቤከ ወሌሊትየኒ ቅድሜከ። [2] ለትባእ ጸሎትየ ቅድሜከ；' },
        { type: 'Gospel (Matt 24:36-51) | ወንጌል ዘሰዓታት', book: 'Matthew', chapter: 24, verses: '36-51' }
    ],
    'Friday': [
        { type: 'Pauline Epistle (Romans 13:11-14) | መልእክተ ጳውሎስ ዘሰዓታት', book: 'Romans', chapter: 13, verses: '11-14' },
        { type: 'Universal Epistle (2 Peter 3:8-14) | መልእክተ ካልእ ዘሰዓታት', book: '2 Peter', chapter: 3, verses: '8-14' },
        { type: 'Acts of the Apostles (Acts 8:26-40) | ግብረ ሐዋርያት ዘሰዓታት', book: 'Acts', chapter: 8, verses: '26-40' },
        { type: 'Psalm (Psalm 118:55-56) | ምስባክ ዘሰዓታት', book: 'Psalms', chapter: 118, verses: '55-56', customEnglish: '[55] I remember Your name in the night, O Lord, And I keep Your law. [56] This has become mine...', customGeez: '[55] ተዘከርኩ በሌሊት ስመከ እግዚኦ፤ ወዐቀብኩ ሕገከ። [56] ወይእቲ ኮነተኒ；' },
        { type: 'Gospel (Luke 12:35-49) | ወንጌል ዘሰዓታት', book: 'Luke', chapter: 12, verses: '35-49' }
    ],
    'Saturday': [
        { type: 'Torah (Leviticus 23:1-4) | ኦሪት ዘሰዓታት', book: 'Leviticus', chapter: 23, verses: '1-4' },
        { type: 'Prophecy (Jeremiah 17:26-27) | ትንቢት ዘሰዓታት', book: 'Jeremiah', chapter: 17, verses: '26-27' },
        { type: 'Acts of the Apostles (Acts 17:2-5) | ግብረ ሐዋርያት ዘሰዓታት', book: 'Acts', chapter: 17, verses: '2-5' },
        { type: 'Psalm (Psalm 133:2-3) | ምስባክ ዘሰዓታት', book: 'Psalms', chapter: 133, verses: '2-3', customEnglish: '[2] Lift up your hands in the sanctuary, and bless the Lord. [3] The Lord who made heaven and earth bless you from Zion!', customGeez: '[2] በሌሊት አንሥኡ እደዊክሙ በቤተ መቅደስ፤ ወባርክዎ ለእግዚአብሔር። [3] ይባርከከ እግዚአብሔር እምጽዮን；' },
        { type: 'Gospel (John 5:5-23) | ወንጌል ዘሰዓታት', book: 'John', chapter: 5, verses: '5-23' }
    ],
    'Sunday': [
        { type: 'Pauline Epistle (1 Corinthians 15:51-16:3) | መልእክተ ጳውሎስ ዘሰዓታት', book: '1 Corinthians', chapter: 15, verses: '51-58', extra: { book: '1 Corinthians', chapter: 16, verses: '1-3' } },
        { type: 'Universal Epistle (1 John 1:1-10) | መልእክተ ካልእ ዘሰዓታት', book: '1 John', chapter: 1, verses: '1-10' },
        { type: 'Acts of the Apostles (Acts 20:7-12) | ግብረ ሐዋርያት ዘሰዓታት', book: 'Acts', chapter: 20, verses: '7-12' },
        { type: 'Psalm (Psalm 125:2) | ምስባክ ዘሰዓታት', book: 'Psalms', chapter: 125, verses: '2', customEnglish: 'Then our mouth was filled with laughter, And our tongue with singing. Then they said among the nations...', customGeez: 'አሜሃ መልአ ፍሥሓ አፉነ፤ ወተሐሥየ ልሳንነ； አሜሃ ይቤሉ አሕዛብ፦' },
        { type: 'Gospel (John 3:1-22) | ወንጌል ዘሰዓታት', book: 'John', chapter: 3, verses: '1-22' }
    ]
};

const prophetSongs = [
    { key: 'songOfSongs', author: 'Solomon', name: 'Prayer of Songs of King Solomon | ማሓለየ ማሓለይ ዘሰሎሞን', verseRange: '(Songs of Songs 1:1-5:16)', time: 'Saturday', purpose: 'Spiritual communion and expression of divine love.', refs: { kjv: { book: 22, bookName: 'Song of Solomon', chapters: [1, 2, 3, 4, 5] }, rgv: { book: 'Canción de canciones', chapters: [1, 2, 3, 4, 5] }, am54: { book: 'መኃልየ መኃልይ ዘሰሎሞን', chapters: ['1', '2', '3', '4', '5'] } } },
    { key: 'firstSongOfMoses', author: 'Moses', name: 'First Prayer of Moses the Prophet | ጸሎተ ሙሴ ቀዳማዊ', verseRange: '(Exodus 15:1–19)', time: 'Monday – 9 a.m.', purpose: 'For sickness, hopelessness, and feeling of weakness.', refs: { kjv: { book: 2, bookName: 'Exodus', chapter: 15, verses: { start: 1, end: 19 } }, rgv: { book: 'Éxodo', chapter: 15, verses: { start: 1, end: 19 } }, am54: { book: 'ኦሪት ዘጸአት', chapter: '15', verses: { start: 1, end: 19 } } } },
    { key: 'secondSongOfMoses', author: 'Moses', name: 'Second Prayer of Moses the Prophet | ጸሎተ ሙሴ ካልእ', verseRange: '(Deuteronomy 32:1–21)', time: 'Monday – Noon', purpose: 'For sickness, hopelessness, and feeling of weakness.', refs: { kjv: { book: 5, bookName: 'Deuteronomy', chapter: 32, verses: { start: 1, end: 21 } }, rgv: { book: 'Deuteronomio', chapter: 32, verses: { start: 1, end: 21 } }, am54: { book: 'ኦሪት ዘዳግም', chapter: '32', verses: { start: 1, end: 21 } } } },
    { key: 'thirdSongOfMoses', author: 'Moses', name: 'Third Prayer of Moses the Prophet | ጸሎተ ሙሴ ሣልስ', verseRange: '(Deuteronomy 32:22–43)', time: 'Monday – 3 p.m.', purpose: 'For sickness, hopelessness, feeling of weakness; also for safe maternity.', refs: { kjv: { book: 5, bookName: 'Deuteronomy', chapter: 32, verses: { start: 22, end: 43 } }, rgv: { book: 'Deuteronomio', chapter: 32, verses: { start: 22, end: 43 } }, am54: { book: 'ኦሪት ዘዳግም', chapter: '32', verses: { start: 22, end: 43 } } } },
    { key: 'prayerOfHannah', author: 'Hannah', name: 'Prayer of Hannah the Mother of Samuel the Prophet | ጸሎተ ሐና እመ ሳሙኤል ነቢይ', verseRange: '(1 Kingdoms 2:1-10 LXX, 1 Samuel 2:1–10 KJV)', time: 'Tuesday – 9 a.m.', purpose: 'For safe maternity and for sudden sickness.', refs: { kjv: { book: 9, bookName: '1 Samuel', chapter: 2, verses: { start: 1, end: 10 } }, rgv: { book: '1 Samuel', chapter: 2, verses: { start: 1, end: 10 } }, am54: { book: 'መጽሐፈ ሳሙኤል ቀዳማዊ', chapter: '2', verses: { start: 1, end: 10 } } } },
    { key: 'prayerOfHezekiah', author: 'Hezekiah', name: 'Prayer of King Hezekiah | ጸሎተ ሕዝቅያስ', verseRange: '(Isaiah 38:10–20)', time: 'Tuesday – Noon', purpose: 'For sudden sickness, for safe maternity, and for trouble in finding missing property or ideas.', refs: { kjv: { book: 23, bookName: 'Isaiah', chapter: 38, verses: { start: 10, end: 20 } }, rgv: { book: 'Isaías', chapter: 38, verses: { start: 10, end: 20 } }, am54: { book: 'ትንቢተ ኢሳይያስ', chapter: '38', verses: { start: 10, end: 20 } } } },
    { key: 'prayerOfManasseh', author: 'Manasseh', name: 'Prayer of King Manasseh | ጸሎተ ምናሴ', verseRange: '(2 Chronicles 36 LXX)', time: 'Tuesday – 3 p.m.', purpose: 'For sickness or trouble in finding missing property or ideas.', refs: { prayerKey: 'Manasseh' } },
    { key: 'prayerOfJonah', author: 'Jonah', name: 'Prayer of Jonah the Prophet | ጸሎተ ዮናስ ነቢይ', verseRange: '(Jonah 2:2–9)', time: 'Wednesday – 9 a.m.', purpose: 'For sickness or trouble in finding missing property or ideas.', refs: { prayerKey: 'Jonah' } },
    { key: 'firstPrayerOfThreeYouths', author: 'Three Youths', name: 'First Prayer of the Three Youths | ጸሎተ ፫ ደቂቅ ቀዳማዊ', verseRange: '(Daniel 3:26–45 LXX)', aka: 'The Prayer/Song of Azarias', time: 'Wednesday – Noon', purpose: 'For protecting oneself and wealth from evil.', refs: { prayerKey: 'ThreeYouths1' } },
    { key: 'secondPrayerOfThreeYouths', author: 'Three Youths', name: 'Second Prayer of the Three Youths | ጸሎተ ፫ ደቂቅ ካልእ', verseRange: '(Daniel 3:52–56 LXX)', aka: 'The Blessing of Ananias, Azarias, and Misael', time: 'Thursday – 9 a.m.', purpose: 'Used during moments of frustration.', refs: { prayerKey: 'ThreeYouths2' } },
    { key: 'thirdPrayerOfThreeYouths', author: 'Three Youths', name: 'Third Prayer of the Three Youths | ጸሎተ ፫ ደቂቅ ሣልስ', verseRange: '(Daniel 3:57–88 LXX)', aka: 'The Song of the Three Holy Children', time: 'Wednesday – 3 p.m.', purpose: 'Used during moments of frustration.', refs: { prayerKey: 'ThreeYouths3' } },
    { key: 'prayerOfHabakkuk', author: 'Habakkuk', name: 'Prayer of Habakkuk the Prophet | ጸሎተ ዕንባቆም ነቢይ', verseRange: '(Habakkuk 3:1–19)', time: 'Thursday – Noon', purpose: 'For finding missing property or ideas.', refs: { kjv: { book: 35, bookName: 'Habakkuk', chapter: 3, verses: { start: 1, end: 19 } }, rgv: { book: 'Habacuc', chapter: 3, verses: { start: 1, end: 19 } }, am54: { book: 'ትንቢተ ዕንባቆም', chapter: '3', verses: { start: 1, end: 19 } } } },
    { key: 'prayerOfIsaiah', author: 'Isaiah', name: 'Prayer of Isaiah the Prophet | ጸሎተ ኢሳይያስ ነቢይ', verseRange: '(Isaiah 26:9–20)', time: 'Thursday – 3 p.m.', purpose: 'For achieving a brighter tomorrow.', refs: { kjv: { book: 23, bookName: 'Isaiah', chapter: 26, verses: { start: 9, end: 20 } }, rgv: { book: 'Isaías', chapter: 26, verses: { start: 9, end: 20 } }, am54: { book: 'ትንቢተ ኢሳይያስ', chapter: '26', verses: { start: 9, end: 20 } } } },
    { key: 'prayerOfMary', author: 'Mary', name: 'Prayer of Mary the Bearer of God | ጸሎተ ማርያም ወላዲተ አምላክ', verseRange: '(Luke 1:46–55)', aka: 'The Magnificat', time: 'Friday – 9 a.m.', purpose: 'For those who are grieving.', refs: { kjv: { book: 42, bookName: 'Luke', chapter: 1, verses: { start: 46, end: 55 } }, rgv: { book: 'Lucas', chapter: 1, verses: { start: 46, end: 55 } }, am54: { book: 'የሉቃስ ወንጌል', chapter: '1', verses: { start: 46, end: 55 } } } },
    { key: 'songOfZachariah', author: 'Zachariah', name: 'Prayer of Zachariah the Prophet | ጸሎተ ዘካርያስ ነቢይ', verseRange: '(Luke 1:68–79)', aka: 'The Benedictus', time: 'Friday – Noon', purpose: 'For offering a worthy service to God.', refs: { kjv: { book: 42, bookName: 'Luke', chapter: 1, verses: { start: 68, end: 79 } }, rgv: { book: 'Lucas', chapter: 1, verses: { start: 68, end: 79 } }, am54: { book: 'የሉቃስ ወንጌል', chapter: '1', verses: { start: 68, end: 79 } } } },
    { key: 'prayerOfSimeon', author: 'Simeon', name: 'Prayer of Simeon the Elder | ጸሎተ ስምዖን አረጋዊ', verseRange: '(Luke 2:29–32)', aka: 'Nunc dimittis', time: 'Friday – 3 p.m.', purpose: 'For building up faith in God.', refs: { kjv: { book: 42, bookName: 'Luke', chapter: 2, verses: { start: 29, end: 32 } }, rgv: { book: 'Lucas', chapter: 2, verses: { start: 29, end: 32 } }, am54: { book: 'የሉቃስ ወንጌል', chapter: '2', verses: { start: 29, end: 32 } } } },
];


const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zM2 13h2v-2H2v2zm18 0h2v-2h-2v2zM11 2v2h2V2h-2zm0 18v2h2v-2h-2zM4.22 5.64l1.42-1.42L7.05 5.64 5.64 7.05 4.22 5.64zM16.95 18.36l1.42-1.42L19.78 18.36l-1.41 1.41-1.42-1.41zM18.36 5.64l1.42 1.41L18.36 8.46l-1.42-1.41L18.36 5.64zM5.64 18.36l1.41 1.41L8.46 18.36l-1.41-1.42L5.64 18.36z"/></svg>`;
const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 2c-1.82 0-3.53.5-5 1.35 2.99 1.73 5 4.95 5 8.65s-2.01 6.92-5 8.65C6.47 21.5 8.18 22 10 22c5.52 0 10-4.48 10-10S15.52 2 10 2z"/></svg>`;
const shareIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"></path></svg>`;

function getDefaultProphetSongsForCurrentTime(dateObj = getEffectiveDate()) {
    const litDate = getLiturgicalDateObject(dateObj);
    const day = litDate.getDay(); // 0 = Sunday, 1 = Monday, ...
    const hour = dateObj.getHours();

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

const LOANWORD_MAPPING = {
    "አውሎግዮስ": { lang: "Greek", original: "(\u03b5\u03c5\u03bb\u03cc\u03b3\u03b9\u03bf\u03c2)", phonetic: "ev-lo-gi-os", meaning: "Blessed", geez: "ቡሩክ" },
    "ጌርዮስ": { lang: "Greek", original: "(\u03ba\u03cd\u03c1\u03b9\u03bf\u03c2)", phonetic: "ky-ri-os", meaning: "Lord", geez: "እግዚእ" },
    "አግዮስ": { lang: "Greek", original: "(\u1f03\u03b3\u03b9\u03bf\u03c2)", phonetic: "ha-gi-os", meaning: "Holy", geez: "ቅዱስ" },
    "ማንጦን": { lang: "Greek", original: "(\u03c0\u03ac\u03bd\u03c4\u03c9\u03bd)", phonetic: "pan-ton", meaning: "of all", geez: "ዘኵሉ" },
    "ፖንዋማንጦን": { lang: "Greek", original: "(\u03c0\u03bd\u03b5\u03c5\u03bc\u03ac\u03c4\u03c9\u03bd)", phonetic: "pnev-ma-ton", meaning: "of spirits", geez: "ዘመንፈሳት" },
    "አላቲኖን": { lang: "Greek", original: "(\u1f00\u03bb\u03b7\u03b8\u03b9\u03bd\u03cc\u03bd)", phonetic: "a-le-thi-non", meaning: "True", geez: "አማናዊ (በአማን)" },
    "ኪርያላይሶን": { lang: "Greek", original: "(\u039a\u03cd\u03c1\u03b9\u03b5 \u1f10\u03bb\u03ad\u03b7\u03c3\u03bf\u03bd)", phonetic: "ky-ri-e e-le-i-son", meaning: "Lord have mercy", geez: "እግዚኦ ተሣሃለነ" },
    "ጵርስፎራ": { lang: "Greek", original: "(\u03c0\u03c1\u03bf\u03c3\u03c6\u03bf\u03c1\u03ac)", phonetic: "pros-fo-ra", meaning: "The Sacrificial/Eucharistic Offering", geez: "ቍርባን (መባዕ)" },
    "እንፎራ": { lang: "Greek", original: "(\u1f00\u03bd\u03b1\u03c6\u03bf\u03c1\u03ac)", phonetic: "a-na-fo-ra", meaning: "The Lifting Up (of the offering)", geez: "አኰቴተ ቍርባን" },
    "ጳራቅሊጦስ": { lang: "Greek", original: "(\u03a0\u03b1\u03c1\u03ac\u03ba\u03bb\u03b7\u03c4\u03bf\u03c2)", phonetic: "pa-ra-kli-tos", meaning: "Paraclete (Advocate, Helper, Comforter)", geez: "ናዛዚ" },
    "አምንስቲቲ ሙኪርያ": { lang: "Greek", original: "(\u039c\u03bd\u03ae\u03c3\u03b8\u03b7\u03c4\u03af \u03bc\u03bf\u03c5, \u039a\u03cd\u03c1\u03b9\u03b5)", phonetic: "mni-sthi-ti mou ky-ri-e", meaning: "Remember me, O Lord", geez: "ተዘከረኒ እግዚኦ" },
    "አንቲ ፋሲልያሱ": { lang: "Greek", original: "(\u1f10\u03bd \u03c4\u1fc7 \u03b2\u03b1\u03c3\u03b9\u03bb\u03b5\u03af\u1fb3 \u03c3\u03bf\u03c5)", phonetic: "en ti va-si-li-a sou", meaning: "in your kingdom", geez: "በመንግሥትከ" },

    // Additional Liturgical & Theological Terms
    "ሃሌ ሉያ": { lang: "Hebrew", original: "(\u05d4\u05b7\u05dc\u05b0\u05dc\u05d5\u05bc-\u05d9\u05b8\u05d4\u05bc)", phonetic: "ha-le-lu-yah", meaning: "Praise the Lord", geez: "ስብሐት ለእግዚአብሔር" },
    "ሃሌሉያ": { lang: "Hebrew", original: "(\u05d4\u05b7\u05dc\u05b0\u05dc\u05d5\u05bc-\u05d9\u05b8\u05d4\u05bc)", phonetic: "ha-le-lu-yah", meaning: "Praise the Lord", geez: "ስብሐት ለእግዚአብሔር" },
    "አሜን": { lang: "Hebrew", original: "(\u05d0\u05b8\u05de\u05b5\u05df)", phonetic: "a-men", meaning: "Verily / So be it", geez: "ለይኩን (በአማን)" },
    "ወንጌል": { lang: "Greek", original: "(\u03b5\u1f50\u03b1\u03b3\u03b3\u03ad\u03bb\u03b9\u03bf\u03bd)", phonetic: "ev-an-ge-li-on", meaning: "Good News / Gospel", geez: "ብሥራት" },
    "ወንጌለ": { lang: "Greek", original: "(\u03b5\u1f50\u03b1\u03b3\u03b3\u03ad\u03bb\u03b9\u03bf\u03bd)", phonetic: "ev-an-ge-li-on", meaning: "Good News / Gospel (construct/accusative)", geez: "ብሥራት" },
    "ኦሪት": { lang: "Aramaic", original: "(\u05d0\u05d5\u05b9\u05e8\u05b8\u05d9\u05b0\u05ea\u05b8\u05d0)", phonetic: "o-ray-ta", meaning: "Law / Instruction", geez: "ሕግ" },
    "ኦሪተ": { lang: "Aramaic", original: "(\u05d0\u05d5\u05b9\u05e8\u05b8\u05d9\u05b0\u05ea\u05b8\u05d0)", phonetic: "o-ray-ta", meaning: "Law / Instruction (construct/accusative)", geez: "ሕግ" },
    "ታቦት": { lang: "Hebrew", original: "(\u05ea\u05bc\u05b5\u05d9\u05d1\u05b8\u05d4)", phonetic: "tey-vah", meaning: "Ark / Chest", geez: "ሣጥን (ማኅደር)" },
    "ታቦተ": { lang: "Hebrew", original: "(\u05ea\u05bc\u05b5\u05d9\u05d1\u05b8\u05d4)", phonetic: "tey-vah", meaning: "Ark / Chest (construct/accusative)", geez: "ሣጥን (ማኅደር)" },
    "መሲሕ": { lang: "Hebrew", original: "(\u05de\u05b8\u05e9\u05b4\u05c1\u05d9\u05d7\u05b7)", phonetic: "ma-shi-ach", meaning: "Anointed One", geez: "ቅቡዕ" },
    "መሲሐ": { lang: "Hebrew", original: "(\u05de\u05b8\u05e9\u05b4\u05c1\u05d9\u05d7\u05b7)", phonetic: "ma-shi-ach", meaning: "Anointed One (accusative)", geez: "ቅቡዕ" },
    "ሰይጣን": { lang: "Hebrew", original: "(\u05e9\u05c2\u05b8\u05d8\u05b8\u05df)", phonetic: "sa-tan", meaning: "Adversary / Accuser", geez: "ጸላኢ (ጋኔን)" },
    "ቀሲስ": { lang: "Syriac", original: "(\u072a\u072b\u072a\u072b\u0710)", phonetic: "qa-shshi-sha", meaning: "Elder / Priest", geez: "ካህን (ሊቅ)" },
    "ዲያቆን": { lang: "Greek", original: "(\u03b4\u03b9\u03ac\u03ba\u03bf\u03bd\u03bf\u03c2)", phonetic: "di-a-ko-nos", meaning: "Servant / Minister", geez: "ላእክ" },
    "ኤጲስ ቆጶስ": { lang: "Greek", original: "(\u1f10\u03c0\u03af\u03c3\u03ba\u03bf\u03c0\u03bf\u03c2)", phonetic: "e-pis-ko-pos", meaning: "Overseer / Bishop", geez: "ጳጳስ (ሐዋርያ)" },
    "ኤጲስቆጶስ": { lang: "Greek", original: "(\u1f10\u03c0\u03af\u03c3\u03ba\u03bf\u03c0\u03bf\u03c2)", phonetic: "e-pis-ko-pos", meaning: "Overseer / Bishop", geez: "ጳጳስ (ሐዋርያ)" },
    "ፓትርያርክ": { lang: "Greek", original: "(\u03c0\u03b1\u03c4\u03c1\u03b9\u03ac\u03c1\u03c7\u03b7\u03c2)", phonetic: "pa-tri-ar-khes", meaning: "Chief Father / Patriarch", geez: "ርእሰ አበው" },
    "ጳጳስ": { lang: "Greek", original: "(πάππας)", phonetic: "pap-pas", meaning: "Father / Pope / Metropolitan", geez: "አባት" },
    "ሰንበት": { lang: "Hebrew", original: "(\u05e9\u05b7\u05c1\u05d1\u05b8\u05bc\u05ea)", phonetic: "shab-bat", meaning: "Cessation / Sabbath Rest", geez: "ዕረፍት" },
    "ፋሲካ": { lang: "Aramaic", original: "(\u05e4\u05b7\u05bc\u05e1\u05b0\u05d7\u05b8\u05d0)", phonetic: "pas-kha", meaning: "Passover / Pascha", geez: "ዕልፈት" },

    // Names & Entities
    "አዳም": { lang: "Hebrew", original: "(\u05d0\u05b8\u05d3\u05b8\u05dd)", phonetic: "a-dam", meaning: "Man / Earthborn", geez: "ቀዳሚ ብእሲ" },
    "ሔዋን": { lang: "Hebrew", original: "(\u05d7\u05b7\u05d5\u05b8\u05bc\u05d4)", phonetic: "cha-vah", meaning: "Life / Mother of all living", geez: "ሕይወት" },
    "ኢየሱስ": { lang: "Hebrew", original: "(\u05d9\u05b5\u05e9\u05c1\u05d5\u05bc\u05e2\u05b7)", phonetic: "ye-shu-a", meaning: "Yahweh is Salvation", geez: "መድኃኒት" },
    "ክርስቶስ": { lang: "Greek", original: "(\u03a7\u03c1\u03b9\u03c3\u03c4\u03cc\u03c2)", phonetic: "khris-tos", meaning: "Anointed One", geez: "መሲሕ (ቅቡዕ)" },
    "አማኑኤል": { lang: "Hebrew", original: "(\u05e2\u05b4\u05de\u05bc\u05b8\u05e0\u05d5\u05bc\u05d0\u05b5\u05dc)", phonetic: "im-ma-nu-el", meaning: "God with us", geez: "እግዚአብሔር ምስሌነ" },
    "ማርያም": { lang: "Hebrew", original: "(\u05de\u05b4\u05e8\u05b0\u05d9\u05b8\u05dd)", phonetic: "mir-yam", meaning: "Beloved / Exalted One", geez: "እግዝእት" },
    "ሚካኤል": { lang: "Hebrew", original: "(\u05de\u05b4\u05d9\u05db\u05b8\u05d0\u05b5\u05dc)", phonetic: "mi-kha-el", meaning: "Who is like God?", geez: "መኑ ከመ እግዚአብሔር" },
    "ገብርኤል": { lang: "Hebrew", original: "(\u05d2\u05bc\u05b7\u05d1\u05b0\u05e8\u05b4\u05d9\u05d0\u05b5\u05dc)", phonetic: "gav-ri-el", meaning: "God is my strength", geez: "ኃይሌ እግዚአብሔር" },
    "ሱራፌል": { lang: "Hebrew", original: "(\u05e9\u05c2\u05b0\u05e8\u05b8\u05e4\u05b4\u05d9\u05dd)", phonetic: "se-ra-fim", meaning: "Burning Ones", geez: "መላእክት" },
    "ኪሩቤል": { lang: "Hebrew", original: "(\u05db\u05bc\u05b0\u05e8\u05d5\u05bc\u05d1\u05b4\u05d9\u05dd)", phonetic: "ke-ru-vim", meaning: "Guardian Ones", geez: "መላእክት" },
    "ጽዮን": { lang: "Hebrew", original: "(\u05e6\u05b4\u05d9\u05bc\u05d5\u05b9\u05df)", phonetic: "tsi-yon", meaning: "Fortress", geez: "አምባ" },

    // Notable Figures
    "አቤል": { lang: "Hebrew", original: "(\u05d4\u05b6\u05d1\u05b6\u05dc)", phonetic: "he-vel", meaning: "Breath / Vanity", geez: "ትነት" },
    "ኖኅ": { lang: "Hebrew", original: "(\u05e0\u05b9\u05d7\u05b7)", phonetic: "no-ach", meaning: "Rest", geez: "ዕረፍት" },
    "አብርሃም": { lang: "Hebrew", original: "(\u05d0\u05b7\u05d1\u05b0\u05e8\u05b8\u05d4\u05b8\u05dd)", phonetic: "av-ra-ham", meaning: "Father of a Multitude", geez: "አበ ብዙኃን" },
    "ይስሐቅ": { lang: "Hebrew", original: "(\u05d9\u05b4\u05e6\u05b0\u05d7\u05b8\u05e7)", phonetic: "yits-chak", meaning: "He will laugh", geez: "ስሕቅ" },
    "ያዕቆብ": { lang: "Hebrew", original: "(\u05d9\u05b7\u05e2\u05b2\u05e7\u05b9\u05d1)", phonetic: "ya-a-kov", meaning: "Supplanter", geez: "አታላይ" },
    "ሙሴ": { lang: "Hebrew", original: "(\u05de\u05b4\u05e9\u05b6\u05c1\u05d4)", phonetic: "mo-sheh", meaning: "Drawn out (of the water)", geez: "ዘተስሕበ እማይ" },
    "አሮን": { lang: "Hebrew", original: "(\u05d0\u05b7\u05d4\u05b2\u05e8\u05b9\u05df)", phonetic: "a-ha-ron", meaning: "Exalted / Light-bringer", geez: "ካህን" },
    "መልከ ጼዴቅ": { lang: "Hebrew", original: "(\u05de\u05b7\u05dc\u05b0\u05db\u05b4\u05bc\u05d9-\u05e6\u05b6\u05d3\u05b6\u05e7)", phonetic: "mal-ki-tse-dek", meaning: "King of Righteousness", geez: "ንጉሠ ጽድቅ" },
    "መልከጼዴቅ": { lang: "Hebrew", original: "(\u05de\u05b7\u05dc\u05b0\u05db\u05b4\u05bc\u05d9-\u05e6\u05b6\u05d3\u05b6\u05e7)", phonetic: "mal-ki-tse-dek", meaning: "King of Righteousness", geez: "ንጉሠ ጽድቅ" },
    "ዮሴፍ": { lang: "Hebrew", original: "(\u05d9\u05d5\u05b9\u05e1\u05b5\u05e3)", phonetic: "yo-sef", meaning: "He will add", geez: "ይስክ (ይጨምር)" },
    "ዳዊት": { lang: "Hebrew", original: "(\u05d3\u05bc\u05b8\u05d5\u05b4\u05d3)", phonetic: "da-vid", meaning: "Beloved", geez: "ፍቁር" },
    "ሰሎሞን": { lang: "Hebrew", original: "(\u05e9\u05b0\u05c1\u05dc\u05b9\u05de\u05b9\u05d4)", phonetic: "shlo-mo", meaning: "Peaceable", geez: "ሰላማዊ" },
    "ዮሐንስ": { lang: "Hebrew", original: "(\u05d9\u05d5\u05b9\u05d7\u05b8\u05e0\u05b8\u05df)", phonetic: "yo-cha-nan", meaning: "Yahweh is Gracious", geez: "ጸጋ እግዚአብሔር" },
    "ዘካርያስ": { lang: "Hebrew", original: "(\u05d6\u05b0\u05db\u05b4\u05e8\u05b0\u05d9\u05b8\u05d4)", phonetic: "ze-khar-yah", meaning: "Yahweh Remembers", geez: "ተዘከረ እግዚአብሔር" },
    "ኤልሳቤጥ": { lang: "Hebrew", original: "(\u05d0\u05b1\u05dc\u05b4\u05d9\u05e9\u05b6\u05c1\u05d1\u05b7\u05e2)", phonetic: "e-li-she-va", meaning: "God is my Oath", geez: "መሐላየ እግዚአብሔር" },
    "እስጢፋኖስ": { lang: "Greek", original: "(Στέφανος)", phonetic: "ste-pha-nos", meaning: "Crown / Wreath", geez: "አክሊል" },
    "ጳውሎስ": { lang: "Latin", original: "(Paulus)", phonetic: "pau-lus", meaning: "Small / Humble", geez: "ንኡስ (ትሑት)" },
    "ጴጥሮስ": { lang: "Greek", original: "(\u03a0\u03ad\u03c4\u03c1\u03bf\u03c2)", phonetic: "pe-tros", meaning: "Rock / Stone", geez: "ኰኵሕ (ዕብን)" }
};

// Expose globally so geez_lexicon.js can look up loanwords
if (typeof window !== 'undefined') {
    window.LOANWORD_MAPPING = LOANWORD_MAPPING;
}

function applyLoanwordOrigins(text, langKey) {
    const isEnabled = (typeof window !== 'undefined' && window.displayOptions && window.displayOptions.showLoanwordOrigins !== undefined)
        ? window.displayOptions.showLoanwordOrigins
        : (typeof displayOptions !== 'undefined' && displayOptions.showLoanwordOrigins);
    if (!isEnabled || (langKey !== 'geez_script' && langKey !== 'geez_phonetic' && langKey !== 'geez_psalms')) {
        return text;
    }

    let transformedText = text;

    // Build a single regex to match all loanwords in one pass to avoid nested replacements
    // Allow space or Ge'ez word divider '፡' within multi-word loanwords
    const sortedKeys = Object.keys(LOANWORD_MAPPING).sort((a, b) => b.length - a.length);
    const pattern = sortedKeys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '[\\s፡]')).join('|');
    const regex = new RegExp(`(${pattern})([\\s\\:\\፡\\፡\\፤\\፨\\።]?)`, 'g');

    transformedText = transformedText.replace(regex, (match, p1, p2) => {
        const lookupKey = p1.replace(/፡/g, ' ');
        const data = LOANWORD_MAPPING[p1] || LOANWORD_MAPPING[lookupKey] || LOANWORD_MAPPING[p1.replace(/\s+/g, '')];
        if (!data) return match;
        return `<span class="loanword-origin" 
            data-word="${p1}" 
            data-lang="${data.lang}"
            data-original="${data.original.replace(/[()]/g, '')}" 
            data-phonetic="${data.phonetic}" 
            data-meaning="${data.meaning}" 
            data-geez="${data.geez}">${p1} ${data.original}</span>${p2}`;
    });

    return transformedText;
}

function createLoanwordTooltip() {
    let tooltip = document.querySelector('.loanword-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'loanword-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-title"></div>
            <div class="tooltip-phonetic"></div>
            <div class="tooltip-row">
                <div class="tooltip-label">English</div>
                <div class="tooltip-value tooltip-meaning"></div>
            </div>
            <div class="tooltip-row">
                <div class="tooltip-label tooltip-lang-label">Original</div>
                <div class="tooltip-value tooltip-original"></div>
            </div>
            <div class="tooltip-row">
                <div class="tooltip-label">Ge'ez</div>
                <div class="tooltip-value tooltip-geez"></div>
            </div>
        `;
        document.body.appendChild(tooltip);
    }
    return tooltip;
}

function showLoanwordTooltip(element) {
    const tooltip = createLoanwordTooltip();
    const word = element.getAttribute('data-word');
    const lang = element.getAttribute('data-lang');
    const original = element.getAttribute('data-original');
    const phonetic = element.getAttribute('data-phonetic');
    const meaning = element.getAttribute('data-meaning');
    const geez = element.getAttribute('data-geez');

    tooltip.querySelector('.tooltip-title').textContent = word;
    tooltip.querySelector('.tooltip-phonetic').innerHTML = `From ${lang}, <i>${phonetic}</i>`;
    tooltip.querySelector('.tooltip-meaning').textContent = meaning;
    tooltip.querySelector('.tooltip-original').textContent = original;
    tooltip.querySelector('.tooltip-geez').textContent = geez;
    tooltip.querySelector('.tooltip-lang-label').textContent = lang.toUpperCase();

    // Show but keep transparent to measure
    tooltip.style.display = 'block';
    tooltip.style.opacity = '0';
    tooltip.style.visibility = 'visible';
    tooltip.classList.remove('active'); // Ensure no transition yet

    // Positioning
    const rect = element.getBoundingClientRect();
    const tooltipHeight = tooltip.offsetHeight;
    const tooltipWidth = tooltip.offsetWidth;

    let top = rect.top - tooltipHeight - 15;
    let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);

    // Boundary checks
    if (top < 10) {
        top = rect.bottom + 15;
    }

    if (left < 10) left = 10;
    if (left + tooltipWidth > window.innerWidth - 10) {
        left = window.innerWidth - tooltipWidth - 10;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;

    // Clean up manual styles and let CSS transition take over
    tooltip.style.display = '';
    tooltip.style.opacity = '';
    tooltip.style.visibility = '';

    // Force reflow
    void tooltip.offsetWidth;

    tooltip.classList.add('active');
}

function hideLoanwordTooltip() {
    const tooltip = document.querySelector('.loanword-tooltip');
    if (tooltip) {
        tooltip.classList.remove('active');
    }
}

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
        "In the Name of the Father, and of the Son, and of the Holy Spirit, One God, Amen", "I seal my face", "Father", "Son", "Son's", "Son of God", "Son of the Highest", "Holy Spirit", "Holy One", "One God",
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
        "በስመ አብ ወወልድ ወመንፈስ ቅዱስ", "አአትብ ገጽየ", "አብ", "ወልድ", "ወወልድ", "መንፈስ ቅዱስ", "አሐዱ አምላክ", "አሐዱ አምላክ，",
        "ሥላሴ", "ነአኵተከ እግዚኦ", "እግዚ", "እግዚእ", "እግዚኦ", "እግዚአብሔር", "እግዚአ", "አምላክ", "ንጉሥ", "ንጉሠ", "ወንጉሠ", "አቡነ ዘበሰማያት",
        "በሰላመ ቅዱስ ገብርኤል መልአክ", "እግዚአብሔር ጸባዖት", "እግዚአብሔር ጸባዖት", "ኢየሱስ ክርስቶስ",
        "ንኣምን በአሐዱ አምላክ", "ነአምን በአሐዱ አምላክ", "አምላክ ዘእምአምላክ ዘበአማን", "ድንግል ማርያም", "ማርያም ድንግል", "አሜን", "ቅዱስ ቅዱስ ቅዱስ እግዚአብሔር ጸባኦት",
        "ቅዱስ ቅዱስ ቅዱስ እግዚአብሔር ጸባዖት", "ቅዱስ ቅዱስ ቅዱስ", "ቅዱስ， ቅዱስ， ቅዱስ", "ክርስቶስ", "እሰግድ ለአብ ወወልድ ወመንፈስ ቅዱስ አሐቲ ስግደት。", "መለኮት",
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
    ],
    spanish_pr: [
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
        "María de Sión", "Nuestra Señora María", "Virgen Madre de Dios", "Santa Virgen María", "Santa Virgen", "Santa María", "María la Virgen", "Llena de gracia"
    ],
    spanish_pr: [
        "María de Sión", "Nuestra Señora María", "Virgen Madre de Dios", "Santa Virgen María", "Santa Virgen", "Santa María", "María la Virgen", "Llena de gracia"
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
    spanish_pr: buildRegex(rubricRedWords.spanish_pr),
};
const rubricGoldRegex = {
    english: buildRegex(rubricGoldWords.english),
    geez_script: buildRegex(rubricGoldWords.geez_script, true),
    spanish: buildRegex(rubricGoldWords.spanish),
    spanish_pr: buildRegex(rubricGoldWords.spanish_pr),
};


// --- Speaker Label Data ---
const speakerKeywords = {
    english: ["Deacon or Priest", "Priest or Deacon", "Asst. Priest", "Asst Priest", "Asst. Priests", "Asst. Deacon", "Asst Deacon", "Priest", "Deacon", "Subdeacon", "People", "Clergy", "All", "ALL", "Leader", "Reader", "Bridegroom", "Bride"],
    geez_script: ["ካህን ንፍቅ", "ንፍቅ ካህን", "ንፍቀ ዲያቆን", "ንፍቅ ዲያቆን", "ዲያቆን ንፍቅ", "ን.ዲያቆን", "ን. ዲያቆን", "ካህናት", "ካህን", "ዲያቆን", "ሕዝብ", "ኵሎሙ", "መሪሕ", "አንባቢ", "ሙሽራው", "ሙሽራዋ"],
    amharic_script: ["ካህን ንፍቅ", "ንፍቅ ካህን", "ንፍቀ ዲያቆን", "ንፍቅ ዲያቆን", "ዲያቆን ንፍቅ", "ን.ዲያቆን", "ን. ዲያቆን", "ካህናት", "ካህን", "ዲያቆን", "ሕዝብ", "ሁሉም", "መሪ", "አንባቢ", "ሙሽራው", "ሙሽራዋ"],
    amharic_phonetic: ["kahn nfḳ", "nfḳ kahn", "nfḳe dīyaḳon", "nfḳ dīyaḳon", "dīyaḳon nfḳ", "n.dīyaḳon", "n. dīyaḳon", "kahnat", "kahn", "kahin", "dīyaḳon", "dīyakon", "diyakon", "ḥizb", "hizb", "ḥzb", "hzb", "hulumu", "hulum", "meri", "merī", "anbabi", "anbabī", "Asst. Priest", "Asst Priest", "Asst. Priests", "Subdeacon", "Priest", "Deacon", "People", "All", "ALL", "Leader"],
    oromoo: ["Lubbuu", "Luba", "Diyaaqonii", "Uummata", "Hunda", "Garsee"],
    tigrinya_script: ["ካህን ንፍቅ", "ንፍቅ ካህን", "ንፍቀ ዲያቆን", "ንፍቅ ዲያቆን", "ዲያቆን ንፍቅ", "ን.ዲያቆን", "ን. ዲያቆን", "ካህናት", "ካህን", "ዲያቆን", "ሕዝብ", "ኩሉኹም", "መራሒ", "ነባቢ", "መርዓዊ", "መርዓት"],
    tigrinya_phonetic: ["kahn nfḳ", "nfḳ kahn", "nfḳe dīyaḳon", "nfḳ dīyaḳon", "dīyaḳon nfḳ", "n.dīyaḳon", "n. dīyaḳon", "kahnat", "kahn", "kahin", "dīyaḳon", "dīyakon", "diyakon", "ḥizb", "hizb", "ḥzb", "hzb", "kulukhum", "merahi", "meraḥī", "nebabi", "nebabī", "Asst. Priest", "Asst Priest", "Subdeacon", "Priest", "Deacon", "People", "All", "ALL", "Leader"],
    spanish: ["Sacerdote Asistente y Pueblo", "Asistente. Sacerdote", "Asistente. Diácono", "Diácono o Sacerdote", "Sacerdote o Diácono", "Sacerdotes auxiliares", "Sacerdote Asistente", "Sacerdote asistente", "Sacerdote auxiliar", "Sacerdote Celebrante", "Sacerdote celebrante", "Diácono Asistente", "Diácono asistente", "Diácono auxiliar", "Asistente del diácono", "Obispo/Patriarca", "Clérigos", "Clero", "Sacerdotes", "Sacerdote", "Diácono", "Pueblo", "Subdiácono", "Todos", "TODOS", "Líder", "Gente", "Lector", "Novio", "Novia"],
    spanish_pr: ["Sacerdote Asistente y Pueblo", "Asistente. Sacerdote", "Asistente. Diácono", "Diácono o Sacerdote", "Sacerdote o Diácono", "Sacerdotes auxiliares", "Sacerdote Asistente", "Sacerdote asistente", "Sacerdote auxiliar", "Sacerdote Celebrante", "Sacerdote celebrante", "Diácono Asistente", "Diácono asistente", "Diácono auxiliar", "Asistente del diácono", "Obispo/Patriarca", "Clérigos", "Clero", "Sacerdotes", "Sacerdote", "Diácono", "Pueblo", "Subdiácono", "Todos", "TODOS", "Líder", "Gente", "Lector", "Novio", "Novia"],
    french: ["Prêtre", "Diacre", "Peuple", "Sous-diacre", "Tous", "Leader", "Lecteur", "Marié", "Mariée"],
    arabic: ["الكاهن", "الشعب", "الشماس", "القارئ", "الجميع", "الرب", "الناس"],
    greek: ["Ιερέας", "Διάκονος", "Λαός", "Λαοί", "Όλοι", "Αναγνώστης"],
    hebrew: ["כהן", "כוهاء", "עם", "אנשים", "דיאקון"],
    malayalam: ["ഡീക്കൺ അല്ലെങ്കിൽ പുരോഹിതൻ", "അസിസ്റ്റന്റ് പുരോഹിതൻ", "അസി. പുരോഹിതൻ", "പുരോഹിതൻ", "ജനതകൾ", "ആളുകൾ", "ജനങ്ങൾ", "ശെമ്മാശൻ"],
    geez_phonetic: ["kahn nfḳ", "nfḳ kahn", "nfḳe dīyaḳon", "nfḳ dīyaḳon", "dīyaḳon nfḳ", "n.dīyaḳon", "n. dīyaḳon", "kahnat", "kwlomu", "ḥzb", "hzb", "merīḥ", "meriḥ", "merih", "kahn", "kahin", "dīyaḳon", "diyakon", "dīyakon", "ḥizb", "hizb", "kwllomu", "kullomu", "meraḥi", "meraḥī", "anbabi", "anbabī", "nebabi", "nebabī", "Kahn", "Kahin", "Asst. Kahn", "Diyakon", "Dīyakon", "Nfq Diyakon", "Ḥizb", "Hizb", "Kwllomu", "Kullomu", "Kwlomu", "Merīḥ", "Meriḥ", "Merih", "Meraḥi", "Meraḥī", "Anbabi", "Anbabī", "Nebabi", "Nebabī", "Priest", "Asst. Priest", "Asst Priest", "Asst. Priests", "Deacon", "People", "Subdeacon", "All", "ALL", "Leader", "Reader", "Bridegroom", "Bride"]
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
    const psalmSequenceInput = document.getElementById('psalm-sequence-input');
    if (psalmSequenceInput) {
        psalmSequenceInput.value = selectedPsalms.map(p => {
            const range = selectedPsalmVerseRanges && selectedPsalmVerseRanges[p];
            return range ? `${p}:${range.start}-${range.end}` : String(p);
        }).join(', ');
    }
    syncPsalmCombinationsButton();
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
    syncPsalmCombinationsButton();
}

function syncPsalmCombinationsButton() {
    let matchedCombination = "";
    const stringifiedSelectedPsalms = JSON.stringify(selectedPsalms);
    const stringifiedSelectedProphetSongs = JSON.stringify(selectedProphetSongs);
    const stringifiedSelectedVerseRanges = JSON.stringify(selectedPsalmVerseRanges || {});

    if (selectedPsalms.length > 0 || selectedProphetSongs.length > 0) {
        for (const [key, combo] of Object.entries(PSALM_COMBINATIONS)) {
            if (JSON.stringify(combo.psalms || []) === stringifiedSelectedPsalms && 
                JSON.stringify(combo.prophetSongs || []) === stringifiedSelectedProphetSongs &&
                JSON.stringify(combo.verseRanges || {}) === stringifiedSelectedVerseRanges) {
                matchedCombination = key;
                break;
            }
        }
    }
    if (psalmCombinationsBtn) {
        if (matchedCombination && PSALM_COMBINATIONS[matchedCombination]) {
            psalmCombinationsBtn.textContent = PSALM_COMBINATIONS[matchedCombination].name;
        } else {
            psalmCombinationsBtn.textContent = 'Typical Psalm Combinations...';
        }
        
        // Update selected state in the modal
        document.querySelectorAll('.combo-option').forEach(opt => {
            if (opt.dataset.value === matchedCombination) {
                opt.classList.add('selected');
            } else {
                opt.classList.remove('selected');
            }
        });
    }
}




// --- NEW: Debounce Utility Function ---
// Delays invoking a function until after 'wait' ms have passed since the last time it was invoked.
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}


function applyRubrication(text, langKey, isFirstLanguage, chapter = null) {
    if (!displayOptions.showRubrication) return text;

    let isColored = false;
    if (displayOptions.languageColors !== 'off') {
        if (currentTheme.palette === 'legacy') {
            // Legacy palette: only Ge'ez, Amharic, Tigrinya are colored. 
            // Others like English, Spanish are white/black.
            const coloredLegacyLangs = ['geez_script', 'geez_phonetic', 'amharic_script', 'amharic_phonetic', 'tigrinya_script', 'tigrinya_phonetic'];
            if (coloredLegacyLangs.includes(langKey)) {
                isColored = true;
            }
        } else {
            // Standard palettes: only the first language is white/black (base color).
            if (!isFirstLanguage) {
                isColored = true;
            }
        }
    }

    if (isColored) return text;

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
        forceUniformFontSizeLabel.style.display = 'block';
    } else {
        dynamicFontSizingLabel.style.display = 'none';
        forceUniformFontSizeLabel.style.display = 'none';
    }

    // Handle sidebar state
    if (leftSidebar) {
        if (isLeftSidebarCollapsed) {
            leftSidebar.classList.add('collapsed');
            body.classList.remove('sidebar-left-open');
            header.classList.remove('sidebar-visible-in-mobile');
        } else {
            leftSidebar.classList.remove('collapsed');
            body.classList.add('sidebar-left-open');
            header.classList.add('sidebar-visible-in-mobile');
        }
    }

    if (rightSidebar) {
        if (isRightSidebarCollapsed) {
            rightSidebar.classList.add('collapsed');
            body.classList.remove('sidebar-right-open');
        } else {
            rightSidebar.classList.remove('collapsed');
            body.classList.add('sidebar-right-open');
        }
    }

    if (!isLeftSidebarCollapsed || !isRightSidebarCollapsed) {
        body.classList.add('sidebar-open');
    } else {
        body.classList.remove('sidebar-open');
    }

    // Handle rubrication state
    if (!displayOptions.showRubrication) {
        body.classList.add('rubrication-disabled');
    }

    // Handle bold text state
    if (displayOptions.boldText) {
        body.classList.add('bold-text');
    }

    // Handle Traditional Vine Header (Hareg) visibility immediately
    const showHareg = displayOptions.showHaregOrnament !== undefined ? displayOptions.showHaregOrnament : (window.innerWidth < 900);
    body.classList.toggle('hide-hareg-ornament', !showHareg);
    document.querySelectorAll('.hareg-ornament, .hareg-header, .hareg-footer').forEach(el => {
        el.style.display = showHareg ? '' : 'none';
    });

    // Handle Paragraph Mode
    const activeLanguageCount = Object.values(displayedLanguages).filter(Boolean).length;
    if (displayOptions.paragraphMode && activeLanguageCount === 1 && displayOptions.presentationMode === 'scroll') {
        body.classList.add('paragraph-mode');
    }

    if (themeToggle) {
        const modeLabel = currentTheme.mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
        const modeIcon = currentTheme.mode === 'light' ? moonIcon : sunIcon;
        themeToggle.innerHTML = `<span class="theme-toggle-icon">${modeIcon}</span><span class="theme-toggle-label">${modeLabel}</span>`;
        themeToggle.title = modeLabel;
    }
}

// --- Deep Hashing (URL State Persistence) ---

// Unicode-safe Base64 encoding
function toBase64(str) {
    try {
        return btoa(new TextEncoder().encode(str).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    } catch (e) {
        console.error("Base64 encoding failed:", e);
        return "";
    }
}

// Unicode-safe Base64 decoding
function fromBase64(str) {
    try {
        return new TextDecoder().decode(Uint8Array.from(atob(str), c => c.charCodeAt(0)));
    } catch (e) {
        console.error("Base64 decoding failed:", e);
        return "";
    }
}

function buildUrlStateObject(forShortLink = false) {
    return {
        v: '2', // State Version
        sv_ver: forShortLink ? undefined : SETTINGS_VERSION,
        tab: activePrimaryTab,
        k: isKidaseModeActive,
        skd: selectedKidaseDay,
        sa: showAnaphora,
        a: selectedAnaphora,
        ssr: showSeatatReadings,
        sdl: showDailyLectionary,
        spp: showPrepPsalms,
        dt: customDateTimeOverride || undefined,
        krsi: selectedKidaseReadingSetIndex || undefined,
        mi: selectedMiracleId,
        mp: miraclePosition,
        mit: selectedMiracleTranslationIndex,
        c: selectedCovenantPrayer,
        hq: hideQuietPrayers,
        h50: isHolyFiftyDays,
        ps: selectedPsalms,
        pvr: selectedPsalmVerseRanges,
        ss: selectedProphetSongs,
        sd: selectedSeatatLectionaryDay,
        wd: selectedWidaseMaryamDay,
        lr: kidaseLectionaryRefs,
        tpi: (selectedTypicalPsalmIds && Object.keys(selectedTypicalPsalmIds).length > 0) ? selectedTypicalPsalmIds : undefined,
        sm: showMatins,
        st: showTeklil,
        bgn: bridegroomName,
        bn: brideName,
        sv: showVespers,
        l: Object.keys(displayedLanguages).filter(lang => displayedLanguages[lang]),
        t: currentTheme,
        do: displayOptions,
        fs: fontSizes,
        ef: ethiopicFontSelect ? ethiopicFontSelect.value : undefined,
        enf: englishFontSelect ? englishFontSelect.value : undefined,
        lo: languageOrder,
        cn: customNames,
        get: globalEnglishTranslation,
        gat: globalAmharicTranslation,
        ggt: globalGeezTranslation,
        ge: globalEnglishTranslation,
        ga: globalAmharicTranslation,
        gg: globalGeezTranslation,
        rto: readingTranslationOverrides,
        cs: forShortLink ? {} : serializeCollapsedSections(),
        ac: forShortLink ? true : areAllSectionsCollapsed,
        lm: Boolean(window.learningService && window.learningService.isLearningMode),
        lt: (window.learningService && typeof window.learningService.getState === 'function' && window.learningService.getState())
            ? window.learningService.getState().activeTab
            : undefined
    };
}

function syncStateToUrl() {
    if (isInitializing) return;
    try {
        const state = buildUrlStateObject(false);
        const encoded = toBase64(JSON.stringify(state));
        if (encoded) {
            history.replaceState(null, null, "#s=" + encoded);
        }
    } catch (e) {
        console.error("Failed to sync state to URL:", e);
    }
}
window.syncStateToUrl = syncStateToUrl;

const SECTION_SLUGS = {
    "Daily Prayer | ዘዘወትር ጸሎት": "dp",
    "Prayer of Saint Ephraim: The Praises of Mary (Theotokia) | ውዳሴ ማርያም": "pm",
    "Opening Prayer for the Psalms and the Songs of the Prophets | ነዓ ኀቤየ ዳዊት": "ps_in",
    "Closing Prayer for the Psalms and Songs of the Prophets | ሰአሊ ለነ ማርያም": "ps_out",
    "Prayer of Abba Giyorgis: The Angels Praise Mary | ይዌድስዋ መላእክት ለማርያም": "ap",
    "Order of the Liturgy | ሥርዐተ ቅዳሴ": "ok",
    "Anaphora of the Apostles | አኰቴተ ቍርባን ዘሐዋርያት": "aa",
    "Anaphora of Our Lady Mary | አኰቴተ ቍርባን ዘእግዝእትነ ማርያም": "am",
    "Daily Readings | ምንባባት ዘለለዕለቱ": "dr",
    "Morning Readings | ምንባባት ዘነግህ": "dr",
    "Sunset Readings | ምንባባት ዘሠርክ": "dr",
    "Daily Lectionary | ምንባባት ዘየዕለቱ": "dr",
    "Sunday | ዘእሁድ": "d_sun",
    "Monday | ዘሰኑይ": "d_mon",
    "Tuesday | ዘሠሉስ": "d_tue",
    "Wednesday | ዘረቡዕ": "d_wed",
    "Thursday | ዘሐሙስ": "d_thu",
    "Friday | ዘዓርብ": "d_fri",
    "Saturday | ዘቀዳሚት": "d_sat"
};

function slugifyTitle(title) {
    if (!title) return "";
    if (SECTION_SLUGS[title]) return SECTION_SLUGS[title];
    if (title.includes('::')) {
        const [parentPart, childPart] = title.split('::');
        return `${slugifyTitle(parentPart)}__${slugifyTitle(childPart)}`;
    }
    return title.split('|')[0].trim().toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 12);
}

function serializeCollapsedSections() {
    if (areAllSectionsCollapsed) return {}; // No need to list them all if ac flag is true
    const serialized = {};
    Object.entries(collapsedSections).forEach(([title, isCollapsed]) => {
        if (typeof isCollapsed === 'boolean') {
            serialized[slugifyTitle(title)] = isCollapsed;
        }
    });
    return serialized;
}

function deserializeCollapsedSections(serialized, version) {
    const deserialized = {};
    if (!serialized) return deserialized;

    if (version === '1') return serialized; // Legacy version

    // Version 2: Map slugs back to titles (or at least keep slugs as keys)
    // Actually, since we render titles dynamically, we need to make sure 
    // addSectionTitle can find its state.
    return serialized;
}

async function loadStateFromUrl(isVersionMismatch = false) {
    const hash = window.location.hash;
    if (!hash) return false;

    try {
        let state = null;
        let v = '1';

        if (hash.startsWith('#s=')) {
            const encoded = hash.substring(3);
            const jsonStr = fromBase64(encoded);
            if (!jsonStr) return false;
            state = JSON.parse(jsonStr);
            v = state.v || '1';
            // If settings version was bumped, ignore stale auto-synced #s= URL hashes from older app versions
            if (isVersionMismatch && state.sv_ver !== SETTINGS_VERSION) {
                if (typeof history !== 'undefined' && typeof history.replaceState === 'function') {
                    history.replaceState(null, null, window.location.pathname + window.location.search);
                }
                return false;
            }
        } else if (hash.startsWith('#id=')) {
            const id = hash.substring(4);
            const doc = await db.collection('short_links').doc(id).get();
            if (doc.exists) {
                state = JSON.parse(doc.data().state);
                v = state.v || '2';
            } else {
                console.warn("Short link not found");
                return false;
            }
        } else {
            return false;
        }

        if (!state) return false;

        if (state.k !== undefined) isKidaseModeActive = state.k;
        if (state.skd !== undefined) selectedKidaseDay = state.skd;
        if (state.sa !== undefined) showAnaphora = state.sa;
        if (state.a !== undefined) selectedAnaphora = state.a;
        if (state.dt !== undefined) customDateTimeOverride = state.dt || null;
        if (state.krsi !== undefined) selectedKidaseReadingSetIndex = Number(state.krsi) || 0;
        if (state.ssr !== undefined) showSeatatReadings = state.ssr;
        if (state.sdl !== undefined) showDailyLectionary = state.sdl;
        if (state.spp !== undefined) showPrepPsalms = state.spp;
        if (state.mi !== undefined) selectedMiracleId = state.mi;
        if (state.mp !== undefined) miraclePosition = state.mp;
        if (state.mit !== undefined) selectedMiracleTranslationIndex = state.mit;
        if (state.c !== undefined) selectedCovenantPrayer = state.c;
        if (state.hq !== undefined) hideQuietPrayers = state.hq;
        if (state.h50 !== undefined) isHolyFiftyDays = state.h50;
        if (state.ps !== undefined) selectedPsalms = state.ps;
        if (state.pvr !== undefined) {
            selectedPsalmVerseRanges = state.pvr || {};
        } else if (state.ps !== undefined) {
            selectedPsalmVerseRanges = {};
        }
        if (state.ss !== undefined) selectedProphetSongs = state.ss;
        if (state.sd !== undefined) selectedSeatatLectionaryDay = state.sd;
        if (state.wd !== undefined) selectedWidaseMaryamDay = state.wd;
        if (state.lr !== undefined) kidaseLectionaryRefs = { ...kidaseLectionaryRefs, ...state.lr };
        if (state.tpi !== undefined) {
            selectedTypicalPsalmIds = state.tpi || {};
        } else if (state.lr !== undefined) {
            selectedTypicalPsalmIds = {};
        }
        if (state.sm !== undefined) showMatins = state.sm;
        if (state.st !== undefined) showTeklil = state.st;
        if (state.bgn !== undefined) bridegroomName = state.bgn;
        if (state.bn !== undefined) brideName = state.bn;
        if (state.sv !== undefined) showVespers = state.sv;

        if (state.tab === 'pray' || state.tab === 'liturgy') {
            activePrimaryTab = state.tab;
        } else if (state.k !== undefined || state.sa !== undefined) {
            activePrimaryTab = (isKidaseModeActive || showAnaphora) ? 'liturgy' : 'pray';
        }

        if (state.l !== undefined && Array.isArray(state.l)) {
            Object.keys(displayedLanguages).forEach(lang => displayedLanguages[lang] = state.l.includes(lang));
        }

        if (state.t !== undefined) currentTheme = { ...currentTheme, ...state.t };
        if (state.do !== undefined) displayOptions = { ...displayOptions, ...state.do };
        if (state.fs !== undefined) fontSizes = { ...fontSizes, ...state.fs };
        if (state.ef !== undefined && ethiopicFontSelect) ethiopicFontSelect.value = state.ef;
        if (state.enf !== undefined && englishFontSelect) englishFontSelect.value = state.enf;
        if (state.lo !== undefined && Array.isArray(state.lo)) {
            const missing = languageOrder.filter(k => !state.lo.includes(k));
            languageOrder = [...state.lo.filter(k => languageOrder.includes(k)), ...missing];
        }
        if (state.cn !== undefined) customNames = { ...customNames, ...state.cn };

        const rawGet = state.get !== undefined ? state.get : state.ge;
        const rawGat = state.gat !== undefined ? state.gat : state.ga;
        const rawGgt = state.ggt !== undefined ? state.ggt : state.gg;
        if (rawGet !== undefined) globalEnglishTranslation = (rawGet === 'kjv' || rawGet === 'nkjv') ? rawGet : 'nkjv';
        if (rawGat !== undefined) globalAmharicTranslation = rawGat;
        if (rawGgt !== undefined) globalGeezTranslation = (rawGgt === 'gez-1988-formatted') ? 'gez-1980' : rawGgt;
        const baseDefaults = getDefaultReadingTranslationOverrides(globalEnglishTranslation, globalAmharicTranslation, globalGeezTranslation);
        if (state.rto !== undefined && typeof state.rto === 'object') {
            const mergedRto = { ...baseDefaults };
            Object.keys(baseDefaults).forEach(k => {
                if (state.rto[k] && typeof state.rto[k] === 'object') {
                    let gVal = state.rto[k].geez || baseDefaults[k].geez;
                    if (gVal === 'gez-1988-formatted') gVal = 'gez-1980-formatted';
                    const eVal = (state.rto[k].english === 'kjv' || state.rto[k].english === 'nkjv')
                        ? state.rto[k].english
                        : baseDefaults[k].english;
                    mergedRto[k] = {
                        english: eVal,
                        amharic: state.rto[k].amharic || baseDefaults[k].amharic,
                        geez: gVal
                    };
                }
            });
            readingTranslationOverrides = mergedRto;
        } else if (rawGet !== undefined || rawGat !== undefined || rawGgt !== undefined) {
            readingTranslationOverrides = baseDefaults;
        }

        if (state.ac !== undefined) areAllSectionsCollapsed = state.ac;
        if (state.cs !== undefined && typeof state.cs === 'object' && Object.keys(state.cs).length > 0) {
            const deserializedCs = deserializeCollapsedSections(state.cs, v);
            if (activePrimaryTab === 'liturgy') {
                collapsedSections = {
                    ...getLiturgyTabDefaultProfile().collapsedSections,
                    ...deserializedCs
                };
            } else {
                collapsedSections = deserializedCs;
            }
        } else if (activePrimaryTab === 'liturgy' && liturgyTabProfile && liturgyTabProfile.collapsedSections) {
            collapsedSections = JSON.parse(JSON.stringify(liturgyTabProfile.collapsedSections));
            areAllSectionsCollapsed = liturgyTabProfile.areAllSectionsCollapsed !== undefined ? liturgyTabProfile.areAllSectionsCollapsed : true;
        }

        if (activePrimaryTab === 'liturgy') {
            liturgyTabProfile = captureCurrentTabProfile();
        } else if (activePrimaryTab === 'pray') {
            prayTabProfile = captureCurrentTabProfile();
        }

        if (state.lm === true && window.learningService && typeof window.learningService.openLearnFromUrlRoute === 'function') {
            window.learningService.openLearnFromUrlRoute(state.lt);
        }

        console.log("State successfully loaded from URL (V" + v + ")");
        return true;
    } catch (e) {
        console.error("Failed to load state from URL:", e);
        return false;
    }
}

async function createShortLinkUrl() {
    const state = buildUrlStateObject(true);
    const stateJson = JSON.stringify(state);
    const isLocalOrWebView = window.location.hostname === 'appassets.androidplatform.net' || window.location.protocol === 'file:';
    const baseUrl = isLocalOrWebView
        ? 'https://mount-of-mercy-974361367981.us-west1.run.app/'
        : `${window.location.origin}${window.location.pathname}`;

    try {
        const docRef = await db.collection('short_links').add({
            state: stateJson,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return `${baseUrl}#id=${docRef.id}`;
    } catch (e) {
        console.warn("Firestore short link creation failed, falling back to inline state hash:", e);
        return `${baseUrl}#s=${toBase64(stateJson)}`;
    }
}

async function generateShortLink() {
    if (!shareLinkButton) return;
    const originalContent = shareLinkButton.innerHTML;
    shareLinkButton.innerHTML = '<span>Generating...</span>';
    shareLinkButton.disabled = true;

    try {
        const shortUrl = await createShortLinkUrl();
        await navigator.clipboard.writeText(shortUrl);
        showCopyNotification('Short link copied to clipboard!');
    } catch (e) {
        console.error("Failed to generate short link:", e);
        showCopyNotification('Failed to generate link.', 3000);
    } finally {
        shareLinkButton.innerHTML = originalContent;
        shareLinkButton.disabled = false;
    }
}

async function shareScriptures() {
    if (!shareScripturesButton) return;
    const originalContent = shareScripturesButton.innerHTML;
    shareScripturesButton.innerHTML = '<span>Generating...</span>';
    shareScripturesButton.disabled = true;

    try {
        if (!bibleData.loaded) {
            await loadBibleData();
        }
        
        const shortUrl = await createShortLinkUrl();
        
        let text = "";
        const readings = [];
        
        if (showVespers) {
            readings.push({ key: 'eveningPsalm', title: '፨ Sunset Psalm | ምስባክ ዘሠርክ', isPsalm: true });
            readings.push({ key: 'eveningGospel', title: '፨ Sunset Gospel | ወንጌል ዘሠርክ', isPsalm: false });
        }

        if (showMatins) {
            readings.push({ key: 'morningPsalm', title: '፨ Morning Psalm | ምስባክ ዘነግህ', isPsalm: true });
            readings.push({ key: 'morningGospel', title: '፨ Morning Gospel | ወንጌል ዘነግህ', isPsalm: false });
        }
        
        if (isKidaseModeActive) {
            readings.push({ key: 'pauline', title: '፨ Liturgy Pauline Epistle | መልእክተ ጳውሎስ', isPsalm: false });
            readings.push({ key: 'universal', title: '፨ Liturgy Universal Epistle | መልእክተ ካልእ', isPsalm: false });
            readings.push({ key: 'acts', title: '፨ Liturgy Acts of the Apostles | ግብረ ሐዋርያት', isPsalm: false });
            readings.push({ key: 'psalm', title: '፨ Liturgy Psalm | ምስባክ ዘቅዳሴ', isPsalm: true });
            readings.push({ key: 'gospel', title: '፨ Liturgy Gospel | ወንጌል ዘቅዳሴ', isPsalm: false });
        }
        
        for (const r of readings) {
            const refStr = kidaseLectionaryRefs[r.key];
            if (!refStr) continue;
            
            const match = refStr.match(/(.+) (\d+):(.+)/);
            if (!match) continue;
            
            let book = match[1];
            let chapter = parseInt(match[2]);
            let versesStr = match[3];
            
            let lookupName = book;
            if (book === 'Psalm') lookupName = 'Psalms';
            
            let startVerse = 1;
            let endVerse = 1;
            if (versesStr.includes('-')) {
                const parts = versesStr.split('-');
                startVerse = parseInt(parts[0]);
                if (parts[1].toLowerCase() === 'end') {
                    endVerse = getActualVerseCount(lookupName, chapter) || 999;
                } else {
                    endVerse = parseInt(parts[1]);
                }
            } else {
                startVerse = endVerse = parseInt(versesStr);
            }
            const actualEndVerse = (startVerse !== endVerse) ? `${startVerse}-${endVerse}` : `${startVerse}`;
            
            const bookCfg = BIBLE_BOOK_MAPPING[lookupName];
            let geezBook = bookCfg ? bookCfg.geez : book;
            
            const engVerCode = getReadingTranslationOverride(r.key, 'english');
            const engVerLabel = engVerCode === 'kjv' ? 'KJV' : 'NKJV';
            const engRef = `${book} ${chapter}:${actualEndVerse} (${engVerLabel})`;
            let citationLine = engRef;
            
            let misbak = null;
            if (r.isPsalm && typeof TYPICAL_PSALMS !== 'undefined') {
                misbak = findTypicalPsalm(book, chapter, startVerse, endVerse, r.key);
            }
            
            if (r.isPsalm) {
                if (misbak) {
                    const osbEndVerse = (misbak.ls !== misbak.le) ? `${misbak.ls}-${misbak.le}` : `${misbak.ls}`;
                    const osbRef = `Psalms ${misbak.lc}:${osbEndVerse} (OSB)`;
                    
                    const endGeez = (misbak.ls !== misbak.le) ? '-' + toGeezNumeral(misbak.le) : '';
                    const geezRef = `${geezBook} ${toGeezNumeral(misbak.lc)}፡${toGeezNumeral(misbak.ls)}${endGeez} (ግእዝ)`;
                    
                    citationLine = `${engRef} | ${osbRef} | ${geezRef}`;
                } else {
                    citationLine = engRef;
                }
            } else {
                const endGeez = (startVerse !== endVerse) ? '-' + toGeezNumeral(endVerse) : '';
                const geezRef = `${geezBook} ${toGeezNumeral(chapter)}፡${toGeezNumeral(startVerse)}${endGeez}`;
                citationLine = `${engRef} | ${geezRef}`;
            }
            
            if (text !== "") {
                text += `\n`;
            }
            text += `${r.title}\n`;
            text += `${citationLine}\n`;
            
            if (r.isPsalm) {
                if (misbak) {
                    text += `${misbak.g}\n`;
                }
                
                const engTextArray = [];
                const englishBible = engVerCode === 'kjv' ? (bibleData.kjv || bibleData.nkjv) : (bibleData.nkjv || bibleData.kjv);
                const engBookName = bookCfg ? (bookCfg.nkjv || bookCfg.kjv) : 19;
                if (englishBible) {
                    for (let vNum = startVerse; vNum <= endVerse; vNum++) {
                        const v = englishBible.find(v => (v.book === engBookName || v.book === 19 || v.book === "Psalms") && v.chapter === chapter && v.verse === vNum);
                        if (v) {
                            engTextArray.push(String(v.text).replace(/<[^>]+>/g, ''));
                        }
                    }
                }
                const engText = engTextArray.join(' ');
                if (engText) {
                    text += `${engText}\n`;
                }
            } else {
                const engVerses = getSeatatBibleVerses(lookupName, chapter, actualEndVerse, null, null, r.key);
                if (engVerses && engVerses.length > 0) {
                    const firstVerseText = engVerses.map(v => String(v.english).replace(/<[^>]+>/g, '')).filter(Boolean).join(' ');
                    if (firstVerseText) {
                        const words = firstVerseText.split(/\s+/);
                        const incipit = words.slice(0, 15).join(' ') + (words.length > 15 ? '...' : '');
                        text += `"${incipit}"\n`;
                    }
                }
            }
        }
        
        text += `\n${shortUrl}`;
        
        await navigator.clipboard.writeText(text.trim());
        showCopyNotification('Link and scriptures copied!');
    } catch (e) {
        console.error("Failed to generate scriptures text:", e);
        showCopyNotification('Failed to copy.', 3000);
    } finally {
        shareScripturesButton.innerHTML = originalContent;
        shareScripturesButton.disabled = false;
    }
}

function getDefaultProphetSongForTimeOfDay(dateObj = getEffectiveDate()) {
    const hour = dateObj.getHours();
    // Morning/daytime (< 17:00) defaults to Prayer of Zechariah (Benedictus); Evening (>= 17:00) defaults to Prayer of Simeon (Nunc Dimittis)
    return hour < 17 ? ['songOfZachariah'] : ['prayerOfSimeon'];
}

function getPrayTabDefaultProfile() {
    const effDate = getEffectiveDate();
    const computed = getDefaultKidaseRefsAndAnaphoraForDate(effDate, 0);
    return {
        showDailyPrayer: true,
        selectedWidaseMaryamDay: getSeatatLiturgicalDay(effDate),
        showGateOfLight: false,
        showYewediswaMelaekt: true,
        selectedPsalms: [50],
        selectedPsalmVerseRanges: {},
        selectedProphetSongs: getDefaultProphetSongForTimeOfDay(effDate),
        showDailyLectionary: true,
        showSeatatReadings: false,
        selectedSeatatLectionaryDay: getSeatatLiturgicalDay(effDate),
        showVespers: false,
        showPrepPsalms: false,
        showMatins: false,
        isKidaseModeActive: false,
        showAnaphora: false,
        selectedAnaphora: computed.anaphoraKey || 'apostles',
        selectedMiracleId: 'none',
        showSupplications: false,
        showGeezPhoneticChants: false,
        areAllSectionsCollapsed: true,
        collapsedSections: {}
    };
}

function getLiturgyTabDefaultProfile() {
    const effDate = getEffectiveDate();
    const computed = getDefaultKidaseRefsAndAnaphoraForDate(effDate, 0);
    const all15ProphetSongs = (typeof PSALM_COMBINATIONS !== 'undefined' && PSALM_COMBINATIONS.sunday && PSALM_COMBINATIONS.sunday.prophetSongs)
        ? [...PSALM_COMBINATIONS.sunday.prophetSongs]
        : ['firstSongOfMoses', 'secondSongOfMoses', 'thirdSongOfMoses', 'prayerOfHannah', 'prayerOfHezekiah', 'prayerOfManasseh', 'prayerOfJonah', 'firstSongOfThreeYouths', 'secondSongOfThreeYouths', 'thirdSongOfThreeYouths', 'prayerOfHabakkuk', 'prayerOfIsaiah', 'magnificat', 'songOfZachariah', 'prayerOfSimeon'];
    return {
        showDailyPrayer: true,
        selectedWidaseMaryamDay: 'None',
        showGateOfLight: false,
        showYewediswaMelaekt: false,
        selectedPsalms: [],
        selectedPsalmVerseRanges: {},
        selectedProphetSongs: all15ProphetSongs,
        showDailyLectionary: false,
        showSeatatReadings: true,
        selectedSeatatLectionaryDay: getSeatatLiturgicalDay(effDate),
        showVespers: true,
        showPrepPsalms: true,
        showMatins: true,
        isKidaseModeActive: true,
        showAnaphora: true,
        selectedAnaphora: computed.anaphoraKey || 'apostles',
        selectedMiracleId: 'none',
        showSupplications: false,
        showGeezPhoneticChants: true,
        areAllSectionsCollapsed: true,
        collapsedSections: {
            "Daily Prayer | ዘዘወትር ጸሎት": true,
            "<i>Vespers</i> — Sunset Prayer | ጸሎተ ሠርክ": true,
            "Songs of the Prophets | መኃልየ ነቢያት": true,
            "Psalms | መዝሙር ዘዳዊት": true,
            "Daily Readings | ምንባባት ዘለለዕለቱ": true,
            "Morning Readings | ምንባባት ዘነግህ": true,
            "Sunset Readings | ምንባባት ዘሠርክ": true,
            "<i>Se'atat</i> Readings | ምንባባተ ሰዓታት": true,
            "Pre-Liturgy Psalms | መዝሙር ዘዳዊት ዘቅድመ ቅዳሴ": true,
            "<i>Matins</i> — Morning Prayer | ጸሎተ ነግህ": true,
            "<i>Matins</i> — Morning Prayer | ጸሎተ ነግህ::→ Prayer of the Gospel | ጸሎተ ወንጌል": true,
            "<i>Matins</i> — Morning Prayer | ጸሎተ ነግህ::→ <i>Kidan</i> — Prayer of the Covenant | ጸሎተ ኪዳን": true,
            "→ Prayer of the Gospel | ጸሎተ ወንጌል": true,
            "→ <i>Kidan</i> — Prayer of the Covenant | ጸሎተ ኪዳን": true,
            "<i>Ḳidasé</i> — Liturgy | ቅዳሴ": true,
            "<i>Ḳidasé</i> — Liturgy | ቅዳሴ::→ Order of the Liturgy | ሥርዓተ ቅዳሴ": true,
            "<i>Ḳidasé</i> — Liturgy | ቅዳሴ::→ Anaphora of the Apostles | ቅዳሴ ሐዋርያት": true,
            "<i>Ḳidasé</i> — Liturgy | ቅዳሴ::→ Anaphora of Mary | ቅዳሴ ማርያም": true,
            "→ Order of the Liturgy | ሥርዓተ ቅዳሴ": true,
            "→ Anaphora of the Apostles | ቅዳሴ ሐዋርያት": true,
            "→ Anaphora of Mary | ቅዳሴ ማርያም": true
        }
    };
}

function captureCurrentTabProfile() {
    return {
        showDailyPrayer: displayOptions.showDailyPrayer,
        selectedWidaseMaryamDay,
        showGateOfLight: displayOptions.showGateOfLight,
        showYewediswaMelaekt: displayOptions.showYewediswaMelaekt,
        selectedPsalms: [...selectedPsalms],
        selectedPsalmVerseRanges: JSON.parse(JSON.stringify(selectedPsalmVerseRanges || {})),
        selectedProphetSongs: [...selectedProphetSongs],
        showDailyLectionary,
        showSeatatReadings,
        selectedSeatatLectionaryDay,
        showVespers,
        showPrepPsalms,
        showMatins,
        isKidaseModeActive,
        showAnaphora,
        selectedAnaphora,
        selectedMiracleId,
        showSupplications: displayOptions.showSupplications,
        showGeezPhoneticChants: displayOptions.showGeezPhoneticChants,
        areAllSectionsCollapsed,
        collapsedSections: JSON.parse(JSON.stringify(collapsedSections || {}))
    };
}

function applyTabProfile(profile) {
    if (!profile) return;
    displayOptions.showDailyPrayer = profile.showDailyPrayer !== undefined ? profile.showDailyPrayer : true;
    selectedWidaseMaryamDay = profile.selectedWidaseMaryamDay || 'None';
    displayOptions.showGateOfLight = !!profile.showGateOfLight;
    displayOptions.showYewediswaMelaekt = profile.showYewediswaMelaekt !== false;
    selectedPsalms = Array.isArray(profile.selectedPsalms) ? [...profile.selectedPsalms] : [];
    selectedPsalmVerseRanges = profile.selectedPsalmVerseRanges ? JSON.parse(JSON.stringify(profile.selectedPsalmVerseRanges)) : {};
    selectedProphetSongs = Array.isArray(profile.selectedProphetSongs) ? [...profile.selectedProphetSongs] : [];
    showDailyLectionary = profile.showDailyLectionary !== undefined ? !!profile.showDailyLectionary : !(profile.isKidaseModeActive || profile.showAnaphora);
    showSeatatReadings = !!profile.showSeatatReadings;
    selectedSeatatLectionaryDay = profile.selectedSeatatLectionaryDay || getSeatatLiturgicalDay();
    showVespers = !!profile.showVespers;
    showPrepPsalms = !!profile.showPrepPsalms;
    showMatins = !!profile.showMatins;
    isKidaseModeActive = !!profile.isKidaseModeActive;
    showAnaphora = !!profile.showAnaphora;
    selectedAnaphora = profile.selectedAnaphora || 'apostles';
    selectedMiracleId = profile.selectedMiracleId || 'none';
    displayOptions.showSupplications = !!profile.showSupplications;
    displayOptions.showGeezPhoneticChants = !!profile.showGeezPhoneticChants;
    const defaultLitCollapsed = getLiturgyTabDefaultProfile().collapsedSections;
    if (profile.isKidaseModeActive || profile.showAnaphora) {
        areAllSectionsCollapsed = profile.areAllSectionsCollapsed !== undefined ? profile.areAllSectionsCollapsed : true;
        collapsedSections = (profile.collapsedSections && Object.keys(profile.collapsedSections).length > 0)
            ? { ...defaultLitCollapsed, ...JSON.parse(JSON.stringify(profile.collapsedSections)) }
            : JSON.parse(JSON.stringify(defaultLitCollapsed));
    } else {
        areAllSectionsCollapsed = profile.areAllSectionsCollapsed !== undefined ? profile.areAllSectionsCollapsed : true;
        collapsedSections = profile.collapsedSections ? JSON.parse(JSON.stringify(profile.collapsedSections)) : {};
    }

    // Sync checkboxes in Psalm & Prophet Songs selectors
    if (psalmSelectorContainer) {
        psalmSelectorContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            if (cb.id === 'select-all-psalms') {
                cb.checked = selectedPsalms.length === 150;
            } else {
                cb.checked = selectedPsalms.includes(Number(cb.value));
            }
        });
    }
    if (prophetSongsSelectorContainer && typeof prophetSongs !== 'undefined') {
        prophetSongsSelectorContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            if (cb.id === 'select-all-prophet-songs') {
                cb.checked = selectedProphetSongs.length === prophetSongs.length;
            } else {
                cb.checked = selectedProphetSongs.includes(cb.value);
            }
        });
    }
    updatePsalmSummary();
    updateProphetSongsSummary();
    updateSelectedMiracleUI();
    updateAllTogglesInSettingsPanel();
}

function updatePrimaryNavTabsUI(tabOverride) {
    const isLearnOpen = Boolean(window.learningService && window.learningService.isLearningMode);
    const isTargumaOpen = Boolean(window.targumaService && window.targumaService.isTargumaMode);
    const targetTab = tabOverride || (isLearnOpen ? 'learn' : (isTargumaOpen ? 'targuma' : activePrimaryTab));
    document.querySelectorAll('.primary-nav-tab, .header-nav-tab, .bottom-nav-item').forEach(btn => {
        const navTarget = btn.getAttribute('data-nav-tab');
        if (!navTarget) return;
        const isActive = navTarget === targetTab;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    if (prayerFloatingControls) {
        const showFloating = (targetTab === 'pray' || targetTab === 'liturgy') && !isServantsCornerActive && !isLearnOpen && !isTargumaOpen;
        prayerFloatingControls.style.display = showFloating ? 'flex' : 'none';
    }
}

function syncPrimaryNavTabIndicators(tabOverride) {
    updatePrimaryNavTabsUI(tabOverride);
}

function syncActiveTabFromLiturgyToggles() {
    const anyLiturgyCoreActive = Boolean(
        isKidaseModeActive ||
        showAnaphora ||
        (kidaseModeToggle && kidaseModeToggle.checked) ||
        (showAnaphoraToggle && showAnaphoraToggle.checked)
    );
    if (activePrimaryTab === 'pray' && anyLiturgyCoreActive) {
        activePrimaryTab = 'liturgy';
        updatePrimaryNavTabsUI('liturgy');
        localStorage.setItem('activePrimaryTab', activePrimaryTab);
    } else if (activePrimaryTab === 'liturgy' && !anyLiturgyCoreActive) {
        activePrimaryTab = 'pray';
        updatePrimaryNavTabsUI('pray');
        localStorage.setItem('activePrimaryTab', activePrimaryTab);
    }
}

function switchPrimaryTab(tabName) {
    if (!tabName) return;

    const isOverlayOpen = Boolean(
        (window.learningService && window.learningService.isLearningMode) ||
        (window.targumaService && window.targumaService.isTargumaMode) ||
        (header && header.classList.contains('search-active'))
    );
    const isReclickingActiveTab = !isOverlayOpen && activePrimaryTab === tabName;

    // Save current Pray or Liturgy profile before leaving it (unless re-clicking active tab to reset it)
    if (!isReclickingActiveTab) {
        if (activePrimaryTab === 'pray') {
            prayTabProfile = captureCurrentTabProfile();
            localStorage.setItem('prayTabProfile', JSON.stringify(prayTabProfile));
        } else if (activePrimaryTab === 'liturgy') {
            liturgyTabProfile = captureCurrentTabProfile();
            localStorage.setItem('liturgyTabProfile', JSON.stringify(liturgyTabProfile));
        }
    }

    // Close active overlay modes if switching to Pray or Liturgy
    if (tabName === 'pray' || tabName === 'liturgy') {
        if (window.learningService && window.learningService.isLearningMode && typeof window.learningService.exitLearningMode === 'function') {
            window.learningService.exitLearningMode();
        }
        if (window.targumaService && window.targumaService.isTargumaMode && typeof window.targumaService.exitTargumaMode === 'function') {
            window.targumaService.exitTargumaMode();
        }
        if (header && header.classList.contains('search-active')) {
            closeSearch(true);
        }

        activePrimaryTab = tabName;
        localStorage.setItem('activePrimaryTab', activePrimaryTab);

        if (tabName === 'pray') {
            if (isReclickingActiveTab || !prayTabProfile) {
                dailyLectionaryPeriodOverride = null;
                dailyLectionaryDayOffset = 0;
                prayTabProfile = getPrayTabDefaultProfile();
                localStorage.setItem('prayTabProfile', JSON.stringify(prayTabProfile));
            }
            applyTabProfile(prayTabProfile);
        } else {
            if (isReclickingActiveTab || !liturgyTabProfile) {
                liturgyTabProfile = getLiturgyTabDefaultProfile();
                localStorage.setItem('liturgyTabProfile', JSON.stringify(liturgyTabProfile));
            }
            applyTabProfile(liturgyTabProfile);
        }

        updatePrimaryNavTabsUI();
        saveSettings();
        if (isReclickingActiveTab && typeof window.scrollTo === 'function') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        renderPrayers();
        return;
    }

    if (tabName === 'learn') {
        if (window.targumaService && window.targumaService.isTargumaMode && typeof window.targumaService.exitTargumaMode === 'function') {
            window.targumaService.exitTargumaMode();
        }
        if (header && header.classList.contains('search-active')) {
            closeSearch(true);
        }
        if (window.learningService && typeof window.learningService.toggleLearningMode === 'function') {
            window.learningService.toggleLearningMode();
        }
        const isLearnActive = !!(window.learningService && window.learningService.isLearningMode);
        updatePrimaryNavTabsUI(isLearnActive ? 'learn' : activePrimaryTab);
        return;
    }

    if (tabName === 'targuma') {
        if (window.learningService && window.learningService.isLearningMode && typeof window.learningService.exitLearningMode === 'function') {
            window.learningService.exitLearningMode();
        }
        if (header && header.classList.contains('search-active')) {
            closeSearch(true);
        }
        if (window.targumaService && typeof window.targumaService.toggleTargumaMode === 'function') {
            window.targumaService.toggleTargumaMode();
        }
        const isTargumaActive = !!(window.targumaService && window.targumaService.isTargumaMode);
        updatePrimaryNavTabsUI(isTargumaActive ? 'targuma' : activePrimaryTab);
        return;
    }

    if (tabName === 'search') {
        if (window.learningService && window.learningService.isLearningMode && typeof window.learningService.exitLearningMode === 'function') {
            window.learningService.exitLearningMode();
        }
        if (window.targumaService && window.targumaService.isTargumaMode && typeof window.targumaService.exitTargumaMode === 'function') {
            window.targumaService.exitTargumaMode();
        }
        if (header) {
            const isSearchOpen = header.classList.toggle('search-active');
            if (isSearchOpen) {
                header.classList.remove('header-hidden');
                updatePrimaryNavTabsUI('search');
                if (searchInput) searchInput.focus();
            } else {
                closeSearch();
            }
        }
        return;
    }
}

function saveSettings() {
    if (isInitializing) return;
    localStorage.setItem('settingsVersion', SETTINGS_VERSION);
    localStorage.setItem('theme', JSON.stringify(currentTheme));
    localStorage.setItem('sidebarLeftCollapsed', isLeftSidebarCollapsed);
    localStorage.setItem('sidebarRightCollapsed', isRightSidebarCollapsed);
    localStorage.setItem('displayOptions', JSON.stringify(displayOptions));
    localStorage.setItem('fontSizes', JSON.stringify(fontSizes));
    localStorage.setItem('ethiopicFont', ethiopicFontSelect.value);
    localStorage.setItem('englishFont', englishFontSelect.value);
    localStorage.setItem('displayedLanguages', JSON.stringify(displayedLanguages));
    localStorage.setItem('languageOrder', JSON.stringify(languageOrder));
    localStorage.setItem('selectedPsalms', JSON.stringify(selectedPsalms));
    localStorage.setItem('selectedPsalmVerseRanges', JSON.stringify(selectedPsalmVerseRanges));
    localStorage.setItem('selectedProphetSongs', JSON.stringify(selectedProphetSongs));
    localStorage.setItem('selectedSeatatLectionaryDay', selectedSeatatLectionaryDay);
    localStorage.setItem('selectedWidaseMaryamDay', selectedWidaseMaryamDay);
    localStorage.setItem('isKidaseModeActive', isKidaseModeActive);
    localStorage.setItem('selectedAnaphora', selectedAnaphora);
    localStorage.setItem('selectedMiracleId', selectedMiracleId);
    localStorage.setItem('miraclePosition', miraclePosition);
    localStorage.setItem('selectedMiracleTranslationIndex', selectedMiracleTranslationIndex);
    localStorage.setItem('showAnaphora', showAnaphora);
    localStorage.setItem('showDailyLectionary', showDailyLectionary);
    localStorage.setItem('showSeatatReadings', showSeatatReadings);
    localStorage.setItem('showPrepPsalms', showPrepPsalms);
    localStorage.setItem('showMatins', showMatins);
    localStorage.setItem('showTeklil', showTeklil);
    localStorage.setItem('useExternalBibleAPI', useExternalBibleAPI);
    localStorage.setItem('globalEnglishTranslation', globalEnglishTranslation);
    localStorage.setItem('globalAmharicTranslation', globalAmharicTranslation);
    localStorage.setItem('globalGeezTranslation', globalGeezTranslation);
    localStorage.setItem('readingTranslationOverrides', JSON.stringify(readingTranslationOverrides));
    localStorage.setItem('bridegroomName', bridegroomName);
    localStorage.setItem('brideName', brideName);
    localStorage.setItem('showVespers', showVespers);
    localStorage.setItem('selectedKidaseDay', selectedKidaseDay);
    localStorage.setItem('selectedCovenantPrayer', selectedCovenantPrayer);
    localStorage.setItem('hideQuietPrayers', hideQuietPrayers);
    localStorage.setItem('isHolyFiftyDays', isHolyFiftyDays);
    localStorage.setItem('kidaseLectionaryRefs', JSON.stringify(kidaseLectionaryRefs));
    localStorage.setItem('selectedTypicalPsalmIds', JSON.stringify(selectedTypicalPsalmIds || {}));
    localStorage.setItem('selectedKidaseReadingSetIndex', String(selectedKidaseReadingSetIndex || 0));
    if (customDateTimeOverride) {
        localStorage.setItem('customDateTimeOverride', customDateTimeOverride);
    } else {
        localStorage.removeItem('customDateTimeOverride');
    }
    localStorage.setItem('customNames', JSON.stringify(customNames));
    localStorage.setItem('collapsedSections', JSON.stringify(collapsedSections));
    localStorage.setItem('areAllSectionsCollapsed', areAllSectionsCollapsed);
    if (activePrimaryTab === 'pray' || activePrimaryTab === 'liturgy') {
        localStorage.setItem('activePrimaryTab', activePrimaryTab);
        if (activePrimaryTab === 'pray') {
            prayTabProfile = captureCurrentTabProfile();
            localStorage.setItem('prayTabProfile', JSON.stringify(prayTabProfile));
        } else if (activePrimaryTab === 'liturgy') {
            liturgyTabProfile = captureCurrentTabProfile();
            localStorage.setItem('liturgyTabProfile', JSON.stringify(liturgyTabProfile));
        }
    }
    syncStateToUrl();
}


async function loadSettings() {
    const isMobile = window.innerWidth < 900;
    const savedVersion = localStorage.getItem('settingsVersion');

    const savedDtOverride = localStorage.getItem('customDateTimeOverride');
    if (savedDtOverride && !isNaN(new Date(savedDtOverride).getTime())) {
        customDateTimeOverride = savedDtOverride;
    } else {
        customDateTimeOverride = null;
    }

    const effDate = getEffectiveDate();
    const initialComputed = getDefaultKidaseRefsAndAnaphoraForDate(effDate, 0);
    const currentEthDateKey = `${initialComputed.eth.ethMonth}/${initialComputed.eth.ethDay}`;

    // For all new users (both mobile and desktop), default to English and Ge'ez side-by-side (English first)
    const defaultLanguages = {};
    Object.keys(LANGUAGE_REGISTRY).forEach(id => {
        defaultLanguages[id] = (id === 'english' || id === 'geez_script');
    });

    const defaultSettings = {
        sidebarCollapsed: isMobile,
        theme: { palette: 'legacy', mode: 'dark' },
        displayOptions: {
            presentationMode: 'scroll',
            viewMode: 'card',
            layout: 'column',
            horizontalScroll: false,
            showPrayerLabels: true,
            showLanguageLabels: false,
            showSpeakerLabels: true,
            showRubrication: true,
            dynamicFontSizing: true,
            forceUniformFontSize: false,
            paragraphMode: false,
            slideTransition: 'fade',
            languageColors: 'vibrant',
            boldText: false,
            anglicizeNames: false,
            showSupplications: false,
            showDailyPrayer: true,
            showTrinitarianInvocation: false,
            showGeezPhoneticChants: false,
            showLoanwordOrigins: false,
            showHaregOrnament: isMobile,
            showGateOfLight: false,
            showYewediswaMelaekt: true
        },
        displayedLanguages: defaultLanguages,
        fontSizes: {
            geez: 16,
            english: 16,
            locked: true
        },
        ethiopicFont: "'Noto Sans Ethiopic', sans-serif",
        englishFont: "'Merriweather', serif",
        selectedPsalms: [50], // Default Pray Tab Psalm: Psalm 50
        selectedPsalmVerseRanges: {},
        selectedProphetSongs: getDefaultProphetSongForTimeOfDay(effDate),
        selectedSeatatLectionaryDay: getSeatatLiturgicalDay(effDate),
        selectedWidaseMaryamDay: getSeatatLiturgicalDay(effDate),
        isKidaseModeActive: false,
        selectedAnaphora: initialComputed.anaphoraKey || 'apostles',
        showDailyLectionary: true,
        showSeatatReadings: false,
        showPrepPsalms: false,
        showMatins: false,
        useExternalBibleAPI: true,
        globalEnglishTranslation: 'nkjv',
        globalAmharicTranslation: 'am-2000',
        globalGeezTranslation: 'gez-1980',
        readingTranslationOverrides: getDefaultReadingTranslationOverrides('nkjv', 'am-2000', 'gez-1980'),
        showTeklil: false,
        bridegroomName: '',
        brideName: '',
        showVespers: false,
        selectedKidaseDay: initialComputed.kidaseDay || 'sunday',
        selectedCovenantPrayer: initialComputed.covenantTime || 'morning',
        showAnaphora: false,
        selectedMiracleId: 'none',
        miraclePosition: 'anaphora',
        selectedMiracleTranslationIndex: 0,
        hideQuietPrayers: false,
        isHolyFiftyDays: false,
        areAllSectionsCollapsed: true,
        // Default Custom Names
        customNames: {
            servant: '{Names}',
            patriarch: 'Abba Mathias I (አባ ማትያስ ቀዳማዊ)',
            bishop: 'Abba Theophilus (አባ ቴዎፍሎስ)',
            country: 'Ethiopia, Eritrea, and America',
            headOfState: '...'
        },
        collapsedSections: {},
        kidaseLectionaryRefs: { ...initialComputed.refs }
    };

    if (savedVersion !== SETTINGS_VERSION) {
        // Clear old settings and start fresh if version mismatch
        isLeftSidebarCollapsed = defaultSettings.sidebarCollapsed;
        isRightSidebarCollapsed = true;
        currentTheme = defaultSettings.theme;
        displayOptions = defaultSettings.displayOptions;
        displayedLanguages = defaultSettings.displayedLanguages;
        fontSizes = defaultSettings.fontSizes;
        ethiopicFontSelect.value = defaultSettings.ethiopicFont;
        englishFontSelect.value = defaultSettings.englishFont;
        selectedPsalms = defaultSettings.selectedPsalms;
        selectedPsalmVerseRanges = defaultSettings.selectedPsalmVerseRanges;
        selectedProphetSongs = defaultSettings.selectedProphetSongs;
        selectedSeatatLectionaryDay = defaultSettings.selectedSeatatLectionaryDay;
        selectedWidaseMaryamDay = defaultSettings.selectedWidaseMaryamDay;
        isKidaseModeActive = defaultSettings.isKidaseModeActive;
        selectedAnaphora = defaultSettings.selectedAnaphora;
        showDailyLectionary = defaultSettings.showDailyLectionary;
        showSeatatReadings = defaultSettings.showSeatatReadings;
        showPrepPsalms = defaultSettings.showPrepPsalms;
        showMatins = defaultSettings.showMatins;
        showVespers = defaultSettings.showVespers;
        showAnaphora = defaultSettings.showAnaphora;
        selectedKidaseDay = defaultSettings.selectedKidaseDay;
        selectedCovenantPrayer = defaultSettings.selectedCovenantPrayer;
        hideQuietPrayers = defaultSettings.hideQuietPrayers;
        isHolyFiftyDays = defaultSettings.isHolyFiftyDays;
        useExternalBibleAPI = defaultSettings.useExternalBibleAPI;
        globalEnglishTranslation = defaultSettings.globalEnglishTranslation;
        globalAmharicTranslation = defaultSettings.globalAmharicTranslation;
        globalGeezTranslation = defaultSettings.globalGeezTranslation;
        readingTranslationOverrides = defaultSettings.readingTranslationOverrides;
        kidaseLectionaryRefs = { ...defaultSettings.kidaseLectionaryRefs };
        selectedTypicalPsalmIds = {};
        selectedKidaseReadingSetIndex = 0;
        customNames = defaultSettings.customNames; // Use defaults
        collapsedSections = defaultSettings.collapsedSections;
        areAllSectionsCollapsed = defaultSettings.areAllSectionsCollapsed;
        activePrimaryTab = 'pray';
        prayTabProfile = getPrayTabDefaultProfile();
        liturgyTabProfile = getLiturgyTabDefaultProfile();
        localStorage.setItem('lastAutoLectionaryDateKey', currentEthDateKey);
    } else {
        // Load saved settings and merge with defaults to ensure all keys exist
        currentTheme = JSON.parse(localStorage.getItem('theme')) || defaultSettings.theme;
        isLeftSidebarCollapsed = localStorage.getItem('sidebarLeftCollapsed') !== null 
            ? localStorage.getItem('sidebarLeftCollapsed') === 'true' 
            : (localStorage.getItem('sidebarCollapsed') !== null ? localStorage.getItem('sidebarCollapsed') === 'true' : isMobile);
        isRightSidebarCollapsed = localStorage.getItem('sidebarRightCollapsed') !== null 
            ? localStorage.getItem('sidebarRightCollapsed') === 'true' 
            : true;
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
            if (Array.isArray(loadedOrder)) {
                const missing = languageOrder.filter(k => !loadedOrder.includes(k));
                languageOrder = [...loadedOrder.filter(k => languageOrder.includes(k)), ...missing];
            }
        }

        const lastDateKey = localStorage.getItem('lastAutoLectionaryDateKey');
        const isNewLiturgicalDay = lastDateKey !== currentEthDateKey;

        selectedPsalms = JSON.parse(localStorage.getItem('selectedPsalms')) || defaultSettings.selectedPsalms;
        selectedPsalmVerseRanges = JSON.parse(localStorage.getItem('selectedPsalmVerseRanges')) || defaultSettings.selectedPsalmVerseRanges;
        selectedProphetSongs = JSON.parse(localStorage.getItem('selectedProphetSongs')) || defaultSettings.selectedProphetSongs;
        selectedSeatatLectionaryDay = isNewLiturgicalDay
            ? defaultSettings.selectedSeatatLectionaryDay
            : (localStorage.getItem('selectedSeatatLectionaryDay') || defaultSettings.selectedSeatatLectionaryDay);
        selectedWidaseMaryamDay = isNewLiturgicalDay
            ? defaultSettings.selectedWidaseMaryamDay
            : (localStorage.getItem('selectedWidaseMaryamDay') || defaultSettings.selectedWidaseMaryamDay);
        isKidaseModeActive = localStorage.getItem('isKidaseModeActive') === 'true';
        selectedAnaphora = isNewLiturgicalDay
            ? defaultSettings.selectedAnaphora
            : (localStorage.getItem('selectedAnaphora') || defaultSettings.selectedAnaphora);
        showDailyLectionary = localStorage.getItem('showDailyLectionary') !== null
            ? localStorage.getItem('showDailyLectionary') === 'true'
            : defaultSettings.showDailyLectionary;
        showSeatatReadings = localStorage.getItem('showSeatatReadings') === 'true';
        showPrepPsalms = localStorage.getItem('showPrepPsalms') === 'true';
        showMatins = localStorage.getItem('showMatins') !== null ? localStorage.getItem('showMatins') === 'true' : defaultSettings.showMatins;
        useExternalBibleAPI = localStorage.getItem('useExternalBibleAPI') !== null ? localStorage.getItem('useExternalBibleAPI') === 'true' : defaultSettings.useExternalBibleAPI;
        globalEnglishTranslation = localStorage.getItem('globalEnglishTranslation') || defaultSettings.globalEnglishTranslation;
        globalAmharicTranslation = localStorage.getItem('globalAmharicTranslation') || defaultSettings.globalAmharicTranslation;
        globalGeezTranslation = localStorage.getItem('globalGeezTranslation') || defaultSettings.globalGeezTranslation;
        const savedOverrides = JSON.parse(localStorage.getItem('readingTranslationOverrides')) || {};
        const baseOverrides = getDefaultReadingTranslationOverrides(globalEnglishTranslation, globalAmharicTranslation, globalGeezTranslation);
        readingTranslationOverrides = { ...baseOverrides };
        Object.keys(savedOverrides).forEach(k => {
            if (savedOverrides[k]) {
                readingTranslationOverrides[k] = { ...baseOverrides[k], ...savedOverrides[k] };
            }
        });
        showTeklil = localStorage.getItem('showTeklil') === 'true';
        bridegroomName = localStorage.getItem('bridegroomName') || defaultSettings.bridegroomName;
        brideName = localStorage.getItem('brideName') || defaultSettings.brideName;
        showVespers = localStorage.getItem('showVespers') === 'true';
        selectedKidaseDay = isNewLiturgicalDay
            ? defaultSettings.selectedKidaseDay
            : (localStorage.getItem('selectedKidaseDay') || defaultSettings.selectedKidaseDay);
        selectedCovenantPrayer = isNewLiturgicalDay
            ? defaultSettings.selectedCovenantPrayer
            : (localStorage.getItem('selectedCovenantPrayer') || defaultSettings.selectedCovenantPrayer);
        showAnaphora = localStorage.getItem('showAnaphora') !== null ? localStorage.getItem('showAnaphora') === 'true' : defaultSettings.showAnaphora;
        hideQuietPrayers = localStorage.getItem('hideQuietPrayers') !== null ? localStorage.getItem('hideQuietPrayers') === 'true' : defaultSettings.hideQuietPrayers;
        isHolyFiftyDays = localStorage.getItem('isHolyFiftyDays') !== null ? localStorage.getItem('isHolyFiftyDays') === 'true' : defaultSettings.isHolyFiftyDays;
        if (isNewLiturgicalDay && initialComputed.entry) {
            kidaseLectionaryRefs = { ...defaultSettings.kidaseLectionaryRefs };
            selectedTypicalPsalmIds = {};
            selectedKidaseReadingSetIndex = 0;
        } else {
            const savedKidaseLectionaryRefs = JSON.parse(localStorage.getItem('kidaseLectionaryRefs')) || {};
            kidaseLectionaryRefs = { ...defaultSettings.kidaseLectionaryRefs, ...savedKidaseLectionaryRefs };
            selectedTypicalPsalmIds = JSON.parse(localStorage.getItem('selectedTypicalPsalmIds')) || {};
            selectedKidaseReadingSetIndex = parseInt(localStorage.getItem('selectedKidaseReadingSetIndex') || '0', 10) || 0;
        }
        const savedCustomNames = JSON.parse(localStorage.getItem('customNames')) || {};
        customNames = { ...defaultSettings.customNames, ...savedCustomNames };
        collapsedSections = JSON.parse(localStorage.getItem('collapsedSections')) || defaultSettings.collapsedSections;
        areAllSectionsCollapsed = localStorage.getItem('areAllSectionsCollapsed') !== null
            ? localStorage.getItem('areAllSectionsCollapsed') === 'true'
            : defaultSettings.areAllSectionsCollapsed;
        const savedActiveTab = localStorage.getItem('activePrimaryTab');
        activePrimaryTab = (savedActiveTab === 'liturgy' || savedActiveTab === 'pray')
            ? savedActiveTab
            : ((isKidaseModeActive || showAnaphora) ? 'liturgy' : 'pray');
        try {
            prayTabProfile = JSON.parse(localStorage.getItem('prayTabProfile')) || getPrayTabDefaultProfile();
            if (isNewLiturgicalDay) {
                prayTabProfile.selectedWidaseMaryamDay = defaultSettings.selectedWidaseMaryamDay;
                prayTabProfile.selectedSeatatLectionaryDay = defaultSettings.selectedSeatatLectionaryDay;
                prayTabProfile.selectedProphetSongs = defaultSettings.selectedProphetSongs;
                prayTabProfile.selectedAnaphora = defaultSettings.selectedAnaphora;
            }
        } catch (e) {
            prayTabProfile = getPrayTabDefaultProfile();
        }
        try {
            liturgyTabProfile = JSON.parse(localStorage.getItem('liturgyTabProfile')) || getLiturgyTabDefaultProfile();
            if (isNewLiturgicalDay) {
                liturgyTabProfile.selectedSeatatLectionaryDay = defaultSettings.selectedSeatatLectionaryDay;
                liturgyTabProfile.selectedAnaphora = defaultSettings.selectedAnaphora;
            }
        } catch (e) {
            liturgyTabProfile = getLiturgyTabDefaultProfile();
        }
        if (isNewLiturgicalDay) {
            localStorage.setItem('lastAutoLectionaryDateKey', currentEthDateKey);
        }
        if (activePrimaryTab === 'liturgy') {
            applyTabProfile(liturgyTabProfile);
        } else {
            applyTabProfile(prayTabProfile);
        }
    }

    // Override settings from URL if present
    await loadStateFromUrl(savedVersion !== SETTINGS_VERSION);

    // Set UI elements from the loaded/default settings
    servantNameInput.value = customNames.servant;
    patriarchNameInput.value = customNames.patriarch;
    bishopNameInput.value = customNames.bishop;
    attendingBishopsInput.value = customNames.attendingBishops || '';
    churchNameInput.value = customNames.churchName || '';
    countryNameInput.value = customNames.country;
    headOfStateInput.value = customNames.headOfState;

    initializeLectionaryPickers();
    updatePsalmHeaderLabels();

    showTeklilToggle.checked = showTeklil;
    bridegroomNameInput.value = bridegroomName;
    brideNameInput.value = brideName;
    teklilNamesSettings.style.display = showTeklil ? 'block' : 'none';

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
    renderPsalmCombinationsModal();
    populateProphetSongsSelector();
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
    if (!layoutIconColumn || !layoutIconRow) return;
    const isRowLayout = displayOptions.layout === 'row';
    if (isRowLayout) {
        layoutIconColumn.style.display = 'none';
        layoutIconRow.style.display = 'block';
    } else {
        layoutIconColumn.style.display = 'block';
        layoutIconRow.style.display = 'none';
    }
    const labelEl = document.getElementById('layout-toggle-label');
    if (labelEl) {
        labelEl.textContent = isRowLayout ? 'Layout: Row (Click for Column)' : 'Layout: Column (Click for Row)';
    }
}

function updatePresentationModeToggleIcon() {
    if (!presModeIconSlides || !presModeIconScroll) return;
    const isSlidesMode = displayOptions.presentationMode === 'slides';
    if (isSlidesMode) {
        presModeIconSlides.style.display = 'none';
        presModeIconScroll.style.display = 'block';
    } else {
        presModeIconSlides.style.display = 'block';
        presModeIconScroll.style.display = 'none';
    }
    const labelEl = document.getElementById('presentation-mode-label') || document.getElementById('presentation-mode-toggle-label');
    if (labelEl) {
        labelEl.textContent = isSlidesMode ? 'Scroll' : 'Slides';
    }
}

function updateExpandCollapseAllIcon(syncFromDom = false) {
    if (!expandCollapseAllButton) return;
    const collapseIcon = expandCollapseAllButton.querySelector('.icon-collapse-all');
    const expandIcon = expandCollapseAllButton.querySelector('.icon-expand-all');

    // Only sync state from live collapsible section headers after a render or user click
    if (syncFromDom && prayerDisplay) {
        const collapsibleHeaders = prayerDisplay.querySelectorAll('.section-title.collapsible');
        if (collapsibleHeaders.length > 0) {
            const allCurrentlyCollapsed = Array.from(collapsibleHeaders).every(el => el.classList.contains('collapsed'));
            areAllSectionsCollapsed = allCurrentlyCollapsed;
        }
    }

    if (areAllSectionsCollapsed) {
        if (collapseIcon) collapseIcon.style.display = 'none';
        if (expandIcon) expandIcon.style.display = 'block';
        expandCollapseAllButton.title = 'Expand All Sections';
        if (expandCollapseAllLabel) expandCollapseAllLabel.textContent = 'Expand All';
    } else {
        if (collapseIcon) collapseIcon.style.display = 'block';
        if (expandIcon) expandIcon.style.display = 'none';
        expandCollapseAllButton.title = 'Collapse All Sections';
        if (expandCollapseAllLabel) expandCollapseAllLabel.textContent = 'Collapse All';
    }
}


function updateAllTogglesInSettingsPanel() {
    showLanguageLabelsToggle.checked = displayOptions.showLanguageLabels;
    showSpeakerLabelsToggle.checked = displayOptions.showSpeakerLabels;
    paragraphModeToggle.checked = displayOptions.paragraphMode;
    const activeLanguageCount = Object.values(displayedLanguages).filter(Boolean).length;
    paragraphModeToggle.parentElement.style.display = (activeLanguageCount === 1 && displayOptions.presentationMode === 'scroll') ? 'block' : 'none';
    showRubricationToggle.checked = displayOptions.showRubrication;
    languageColorCodingSelect.value = displayOptions.languageColors;
    dynamicFontSizingToggle.checked = displayOptions.dynamicFontSizing;
    forceUniformFontSizeToggle.checked = displayOptions.forceUniformFontSize;
    slideTransitionSelect.value = displayOptions.slideTransition;
    boldTextToggle.checked = displayOptions.boldText;
    anglicizeNamesToggle.checked = displayOptions.anglicizeNames;
    showSupplicationsToggle.checked = displayOptions.showSupplications;
    showDailyPrayerToggle.checked = displayOptions.showDailyPrayer;
    if (showTrinitarianInvocationToggle) showTrinitarianInvocationToggle.checked = !!displayOptions.showTrinitarianInvocation;
    if (showGateOfLightToggle) showGateOfLightToggle.checked = displayOptions.showGateOfLight;
    if (showYewediswaMelaektToggle) showYewediswaMelaektToggle.checked = displayOptions.showYewediswaMelaekt !== false;
    if (showGeezPhoneticChantsToggle) showGeezPhoneticChantsToggle.checked = displayOptions.showGeezPhoneticChants;
    if (showLoanwordOriginsToggle) showLoanwordOriginsToggle.checked = displayOptions.showLoanwordOrigins;
    if (showHaregOrnamentToggle) showHaregOrnamentToggle.checked = displayOptions.showHaregOrnament !== undefined ? displayOptions.showHaregOrnament : (window.innerWidth < 900);
    if (showPrepPsalmsToggle) showPrepPsalmsToggle.checked = showPrepPsalms;

    // Apply Traditional Vine (Hareg) visibility
    const showHareg = displayOptions.showHaregOrnament !== undefined ? displayOptions.showHaregOrnament : (window.innerWidth < 900);
    body.classList.toggle('hide-hareg-ornament', !showHareg);
    document.querySelectorAll('.hareg-ornament, .hareg-header, .hareg-footer').forEach(el => {
        el.style.display = showHareg ? '' : 'none';
    });

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
        kidaseGatedSection.style.display = 'block';
    }
    kidaseModeToggle.checked = isKidaseModeActive;
    kidaseSettings.style.display = isKidaseModeActive ? 'block' : 'none';
    anaphoraSelector.value = selectedAnaphora;
    const showAnaphoraToggleEl = document.getElementById('show-anaphora-toggle');
    const anaphoraSettingsEl = document.getElementById('anaphora-settings');
    if (showAnaphoraToggleEl) showAnaphoraToggleEl.checked = showAnaphora;
    if (anaphoraSettingsEl) anaphoraSettingsEl.style.display = showAnaphora ? 'block' : 'none';
    const showDailyLectionaryToggleEl = document.getElementById('show-daily-lectionary-toggle');
    if (showDailyLectionaryToggleEl) showDailyLectionaryToggleEl.checked = !!showDailyLectionary;
    const showDailyLectionaryToggle = document.getElementById('show-daily-lectionary-toggle');
    if (showDailyLectionaryToggle) {
        safeOn(showDailyLectionaryToggle, 'change', () => {
            showDailyLectionary = showDailyLectionaryToggle.checked;
            localStorage.setItem('showDailyLectionary', showDailyLectionary);
            saveSettings();
            renderPrayers();
        });
    }

    const showSeatatReadingsToggle = document.getElementById('show-seatat-readings-toggle');
    const seatatReadingsSettings = document.getElementById('seatat-readings-settings');
    if (showSeatatReadingsToggle) showSeatatReadingsToggle.checked = showSeatatReadings;
    if (seatatReadingsSettings) seatatReadingsSettings.style.display = showSeatatReadings ? 'block' : 'none';
    if (typeof renderSidebarKidaseReadingSetPill === 'function') {
        renderSidebarKidaseReadingSetPill();
    }
    showMatinsToggle.checked = showMatins;
    if (useExternalBibleAPIToggle) useExternalBibleAPIToggle.checked = useExternalBibleAPI;
    if (useExternalBibleAPILabel) useExternalBibleAPILabel.style.display = '';
    if (globalEnglishTranslationSelect) globalEnglishTranslationSelect.value = globalEnglishTranslation;
    if (globalAmharicTranslationSelect) globalAmharicTranslationSelect.value = globalAmharicTranslation;
    if (globalGeezTranslationSelect) globalGeezTranslationSelect.value = globalGeezTranslation;
    showVespersToggle.checked = showVespers;
    morningPsalmGospelSettings.style.display = showMatins ? 'block' : 'none';
    vespersPsalmGospelSettings.style.display = showVespers ? 'block' : 'none';
    if (kidaseDaySelector) kidaseDaySelector.value = selectedKidaseDay;
    covenantPrayerSelector.value = selectedCovenantPrayer;
    updatePrimaryNavTabsUI();
    updatePresentationModeToggleIcon();
    updateExpandCollapseAllIcon();
    hideQuietPrayersToggle.checked = hideQuietPrayers;
    if (holyFiftyDaysToggle) holyFiftyDaysToggle.checked = isHolyFiftyDays;

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
            const hasTranslations = (typeof prayers !== 'undefined' && Array.isArray(prayers) && prayers.some(p => p[id] && p[id].trim())) ||
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
            updateTranslationOverrideVisibility();
            checkAndEnforceLayoutRules();
            saveSettings();
            renderPrayers();
        });
    });

    updateTranslationOverrideVisibility();
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

function getSusannaVersesFallback(langCode, startVerse = 1, endVerse = 999) {
    const bibleSvc = typeof window !== 'undefined' ? window.WeahaduBibleService : null;
    if (!bibleSvc || !bibleSvc.cache || typeof bibleSvc.cache.get !== 'function') return null;
    const key = `${langCode}-48-susanna.json`;
    const bookData = bibleSvc.cache.get(key);
    if (!bookData || !bookData.chapters || !bookData.chapters[0]) return null;
    const chVerses = bookData.chapters[0].verses || [];
    const out = [];
    chVerses.forEach((v, idx) => {
        const vNum = v.n != null ? parseInt(v.n, 10) : (idx + 1);
        const text = (v.t || '').trim();
        if (text && vNum >= startVerse && vNum <= endVerse) {
            out.push({ verseNum: vNum, text });
        }
    });
    return out.length > 0 ? out : null;
}

function getAzariahPrayersFallback(startVerse, endVerse, langKey) {
    const songsList = (typeof window !== 'undefined' && Array.isArray(window.songs))
        ? window.songs
        : (typeof songs !== 'undefined' && Array.isArray(songs) ? songs : null);
    if (!songsList) return null;
    const targetStanzas = startVerse <= 34 ? ['ThreeYouths1', 'ThreeYouths2'] : ['ThreeYouths3'];
    const matching = songsList.filter(p => p.chapter === 'ProphetSong' && targetStanzas.includes(p.stanza) && p[langKey]);
    if (matching.length === 0) return null;
    return matching.map((p, idx) => ({
        verseNum: startVerse + idx,
        text: String(p[langKey]).replace(/<[^>]+>/g, '').trim()
    })).filter(v => v.text);
}

function expandReadingRefForPreload(ref) {
    if (!ref) return [];
    const trimmed = String(ref).trim();
    if (BIBLE_BOOK_MAPPING[trimmed]) {
        return expandReadingRefForPreload(`${trimmed} 1`);
    }
    const commaChMatch = trimmed.match(/^(.+?)\s+(\d+(?:\s*,\s*\d+)+)$/);
    if (commaChMatch) {
        const book = commaChMatch[1];
        return commaChMatch[2].split(',').map(s => `${book} ${parseInt(s.trim(), 10)}:1-End`);
    }
    const crossMatch = trimmed.match(/^(.+?)\s+(\d+):(\d+)-(\d+):(End|\d+)$/i);
    if (crossMatch) {
        return [`${crossMatch[1]} ${crossMatch[2]}:${crossMatch[3]}-End`, `${crossMatch[1]} ${crossMatch[4]}:1-${crossMatch[5]}`];
    }
    const multiChMatch = trimmed.match(/^(.+?)\s+(\d+)-(\d+)$/);
    if (multiChMatch) {
        const book = multiChMatch[1];
        const c1 = parseInt(multiChMatch[2], 10);
        const c2 = parseInt(multiChMatch[3], 10);
        const out = [];
        for (let c = c1; c <= c2; c++) out.push(`${book} ${c}:1-End`);
        return out;
    }
    const wholeChMatch = trimmed.match(/^(.+?)\s+(\d+)$/);
    if (wholeChMatch) {
        const b = wholeChMatch[1];
        const c = parseInt(wholeChMatch[2], 10);
        const out = [`${b} ${c}:1-End`];
        if (b === 'Proverbs' && c >= 25 && c <= 29) out.push(`Book of Admonition ${c - 24}:1-End`);
        if (b === 'Proverbs' && c === 30) out.push('Proverbs 24:28-72');
        if (b === 'Proverbs' && c === 31) {
            out.push('Proverbs 24:73-81');
            out.push('Book of Admonition 6:1-End');
        }
        if (b === 'Baruch' && c === 6) out.push('Rest of Jeremiah 1:1-End');
        if (b === 'Susanna') out.push('Daniel 13:1-End');
        if (b === 'Bel and the Dragon') {
            out.push('Rest of Daniel 1:1-End');
            out.push('Daniel 14:1-End');
        }
        return out;
    }
    if (trimmed.startsWith('Azariah ')) {
        return ['Song of the Three Holy Children 1:1-End', 'Daniel 3:24-90'];
    }
    return [trimmed];
}

function getBibleVersesFromRef(ref, readingKey = null) {
    const bibleSvc = typeof window !== 'undefined' ? window.WeahaduBibleService : null;
    if (!ref || (!bibleData.loaded && !(bibleSvc && bibleSvc.canon))) return null;
    const trimmedRef = String(ref).trim();

    // 0. Single-chapter book-only citation (e.g., "Susanna", "Bel and the Dragon", "Obadiah", "Philemon", "Jude")
    if (BIBLE_BOOK_MAPPING[trimmedRef]) {
        return getBibleVersesFromRef(`${trimmedRef} 1:1-End`, readingKey);
    }

    // 0b. Comma-separated chapters: "Book Ch1, Ch2" (e.g., "Genesis 9, 10")
    const commaChMatch = trimmedRef.match(/^(.+?)\s+(\d+(?:\s*,\s*\d+)+)$/);
    if (commaChMatch) {
        const book = commaChMatch[1];
        const chs = commaChMatch[2].split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        const combined = {};
        for (const ch of chs) {
            const subRes = getBibleVersesFromRef(`${book} ${ch}:1-End`, readingKey);
            if (subRes) {
                Object.entries(subRes).forEach(([lang, arr]) => {
                    if (!Array.isArray(arr) || arr.length === 0) return;
                    if (!combined[lang]) combined[lang] = [];
                    arr.forEach(v => combined[lang].push({ verseNum: `${ch}:${v.verseNum}`, text: v.text }));
                });
            }
        }
        return Object.keys(combined).length > 0 ? combined : null;
    }

    // 1. Cross-chapter verse range: "Book Ch1:V1-Ch2:V2" (e.g., "1 John 2:28-3:10", "Mark 8:34-9:2")
    const crossMatch = trimmedRef.match(/^(.+?)\s+(\d+):(\d+)-(\d+):(End|\d+)$/i);
    if (crossMatch) {
        const book = crossMatch[1];
        const ch1 = parseInt(crossMatch[2], 10);
        const v1 = crossMatch[3];
        const ch2 = parseInt(crossMatch[4], 10);
        const v2 = crossMatch[5];
        const combined = {};
        for (let ch = ch1; ch <= ch2; ch++) {
            const subRef = ch === ch1
                ? `${book} ${ch}:${v1}-End`
                : (ch === ch2 ? `${book} ${ch}:1-${v2}` : `${book} ${ch}:1-End`);
            const subRes = getBibleVersesFromRef(subRef, readingKey);
            if (subRes) {
                Object.entries(subRes).forEach(([lang, arr]) => {
                    if (!Array.isArray(arr) || arr.length === 0) return;
                    if (!combined[lang]) combined[lang] = [];
                    arr.forEach(v => combined[lang].push({ verseNum: `${ch}:${v.verseNum}`, text: v.text }));
                });
            }
        }
        return Object.keys(combined).length > 0 ? combined : null;
    }

    // 2. Multi-chapter range without verses: "Book Ch1-Ch2" (e.g., "Genesis 9-10", "Acts 22-23")
    const multiChMatch = trimmedRef.match(/^(.+?)\s+(\d+)-(\d+)$/);
    if (multiChMatch) {
        const book = multiChMatch[1];
        const ch1 = parseInt(multiChMatch[2], 10);
        const ch2 = parseInt(multiChMatch[3], 10);
        const combined = {};
        for (let ch = ch1; ch <= ch2; ch++) {
            const subRes = getBibleVersesFromRef(`${book} ${ch}:1-End`, readingKey);
            if (subRes) {
                Object.entries(subRes).forEach(([lang, arr]) => {
                    if (!Array.isArray(arr) || arr.length === 0) return;
                    if (!combined[lang]) combined[lang] = [];
                    arr.forEach(v => combined[lang].push({ verseNum: `${ch}:${v.verseNum}`, text: v.text }));
                });
            }
        }
        return Object.keys(combined).length > 0 ? combined : null;
    }

    // 3. Whole single chapter: "Book Ch" (e.g., "Sirach 42", "John 3")
    const wholeChMatch = trimmedRef.match(/^(.+?)\s+(\d+)$/);
    if (wholeChMatch) {
        return getBibleVersesFromRef(`${wholeChMatch[1]} ${wholeChMatch[2]}:1-End`, readingKey);
    }

    // 4. Standard single-chapter parser: "Book Chapter:Verse-Verse" or "Book Chapter:Verse"
    const match = trimmedRef.match(/^(.+?)\s+(\d+):(\d+)(?:-(End|\d+))?$/i);
    if (!match) return null;

    const bookName = match[1];
    const chapterNum = parseInt(match[2], 10);
    const startVerse = parseInt(match[3], 10);
    let endVerse = startVerse;
    if (match[4]) {
        endVerse = match[4].toLowerCase() === 'end' ? 999 : parseInt(match[4], 10);
    }
    const normalizedRef = `${bookName} ${chapterNum}:${startVerse}${endVerse !== startVerse ? '-' + (endVerse === 999 ? 'End' : endVerse) : ''}`;

    const bookCfg = BIBLE_BOOK_MAPPING[bookName];
    const results = {};
    const engOverride = getReadingTranslationOverride(readingKey, 'english');
    const amOverride = getReadingTranslationOverride(readingKey, 'amharic');
    const geezOverride = getReadingTranslationOverride(readingKey, 'geez');

    if (useExternalBibleAPI && bibleSvc && bibleSvc.canon) {
        // Deuterocanonical edition-specific reference resolution
        let engRef = normalizedRef;
        let amRef = normalizedRef;
        let gezRef = normalizedRef;

        if (bookName === 'Proverbs' && chapterNum >= 25 && chapterNum <= 29) {
            amRef = `Book of Admonition ${chapterNum - 24}:${startVerse}${endVerse !== startVerse ? '-' + (endVerse === 999 ? 'End' : endVerse) : ''}`;
        } else if (bookName === 'Proverbs' && chapterNum === 30) {
            amRef = 'Proverbs 24:28-72';
        } else if (bookName === 'Baruch' && chapterNum === 6) {
            amRef = `Rest of Jeremiah 1:${startVerse}${endVerse !== startVerse ? '-' + (endVerse === 999 ? 'End' : endVerse) : ''}`;
            gezRef = amRef;
        } else if (bookName === 'Susanna') {
            amRef = `Daniel 13:${startVerse}${endVerse !== startVerse ? '-' + (endVerse === 999 ? 'End' : endVerse) : ''}`;
        } else if (bookName === 'Bel and the Dragon') {
            amRef = `Daniel 14:${startVerse}${endVerse !== startVerse ? '-' + (endVerse === 999 ? 'End' : endVerse) : ''}`;
            gezRef = `Rest of Daniel 1:${startVerse}${endVerse !== startVerse ? '-' + (endVerse === 999 ? 'End' : endVerse) : ''}`;
        } else if (bookName === 'Azariah') {
            if (startVerse <= 34) {
                amRef = 'Daniel 3:24-57';
                gezRef = 'Song of the Three Holy Children 1:1-33';
            } else {
                amRef = 'Daniel 3:58-90';
                gezRef = 'Song of the Three Holy Children 1:34-66';
            }
        }

        const isDeuterocanonKjvOnly = !bookCfg || (!bookCfg.kjv && !bookCfg.nkjv);
        const noMonolithicEngLoaded = !bibleData.nkjv && !bibleData.kjv;
        let kjv = (engOverride === 'kjv' || isDeuterocanonKjvOnly || noMonolithicEngLoaded)
            ? bibleSvc.getVersesSync('en-kjv', engRef)
            : null;
        if (kjv && kjv.every(v => !v.t || !String(v.t).trim())) {
            kjv = null;
        }
        if (!kjv && bookName === 'Susanna') {
            const susEn = getSusannaVersesFallback('en-kjv', startVerse, endVerse);
            if (susEn) results.english = susEn;
        }

        let lxxRef = gezRef;
        if (bookName === 'Psalms' || bookName === 'Psalm') {
            const exactTypical = findTypicalPsalm(bookName, chapterNum, startVerse, endVerse, readingKey);
            if (exactTypical) {
                const amEnd = (exactTypical.ls !== exactTypical.le) ? `-${exactTypical.le}` : '';
                lxxRef = `Psalms ${exactTypical.lc}:${exactTypical.ls}${amEnd}`;
            } else if (typeof convertMtToLxx === 'function') {
                const lxxStart = convertMtToLxx(chapterNum, startVerse);
                const lxxCh = typeof lxxStart === 'object' ? lxxStart.lxxChapter : lxxStart;
                const lxxStartV = typeof lxxStart === 'object' ? lxxStart.lxxVerse : startVerse;
                let amEnd = '';
                if (startVerse !== endVerse) {
                    if (endVerse === 999) {
                        amEnd = '-End';
                    } else {
                        const lxxEnd = convertMtToLxx(chapterNum, endVerse);
                        const lxxEndV = typeof lxxEnd === 'object' ? lxxEnd.lxxVerse : endVerse;
                        amEnd = `-${lxxEndV}`;
                    }
                }
                lxxRef = `Psalms ${lxxCh}:${lxxStartV}${amEnd}`;
            }
        }

        const amRefToUse = (amOverride === 'am54') ? amRef : ((bookName === 'Psalms' || bookName === 'Psalm') ? lxxRef : amRef);
        let amVerses = null;
        if (bookName === 'Proverbs' && chapterNum === 31 && amOverride !== 'am54') {
            const p1 = bibleSvc.getVersesSync(amOverride, 'Proverbs 24:73-81') || [];
            const p2 = bibleSvc.getVersesSync(amOverride, 'Book of Admonition 6:1-22') || [];
            const combined = [
                ...p1.map((v, i) => ({ n: i + 1, t: v.t })),
                ...p2.map((v, i) => ({ n: i + 10, t: v.t }))
            ].filter(v => v.n >= startVerse && v.n <= endVerse);
            if (combined.length > 0) amVerses = combined;
        } else {
            amVerses = bibleSvc.getVersesSync(amOverride, amRefToUse);
        }

        const geezRefToUse = ((bookName === 'Psalms' || bookName === 'Psalm') && (geezOverride === 'gez-1980-formatted' || geezOverride === 'gez-1694')) ? lxxRef : gezRef;
        let geezVerses = bibleSvc.getVersesSync(geezOverride, geezRefToUse);
        if ((!geezVerses || geezVerses.length === 0) && geezOverride !== 'gez-1980') {
            geezVerses = bibleSvc.getVersesSync('gez-1980', gezRef);
        }
        const ti1997 = bibleSvc.getVersesSync('ti-1997', normalizedRef);

        if (kjv && kjv.length > 0 && !results.english) {
            results.english = kjv.filter(v => v.t && String(v.t).trim()).map((v, idx) => ({ verseNum: v.n != null ? parseInt(v.n, 10) : (startVerse + idx), text: v.t }));
        }
        if (amVerses && amVerses.length > 0) {
            results.amharic_script = amVerses.filter(v => v.t && String(v.t).trim()).map((v, idx) => ({ verseNum: v.n != null ? parseInt(v.n, 10) : (startVerse + idx), text: v.t }));
        }
        if (geezVerses && geezVerses.length > 0) {
            results.geez_script = geezVerses.filter(v => v.t && String(v.t).trim()).map((v, idx) => ({ verseNum: v.n != null ? parseInt(v.n, 10) : (startVerse + idx), text: v.t }));
        }
        if (ti1997 && ti1997.length > 0) {
            results.tigrinya_script = ti1997.filter(v => v.t && String(v.t).trim()).map((v, idx) => ({ verseNum: v.n != null ? parseInt(v.n, 10) : (startVerse + idx), text: v.t }));
        }
    }

    if (bookName === 'Azariah') {
        if (!results.english || results.english.length === 0) {
            const azEn = getAzariahPrayersFallback(startVerse, endVerse, 'english');
            if (azEn) results.english = azEn;
        }
        if (!results.geez_script || results.geez_script.length === 0) {
            const azGz = getAzariahPrayersFallback(startVerse, endVerse, 'geez_script');
            if (azGz) results.geez_script = azGz;
        }
        if (!results.amharic_script || results.amharic_script.length === 0) {
            const azAm = getAzariahPrayersFallback(startVerse, endVerse, 'amharic_script');
            if (azAm) results.amharic_script = azAm;
        }
    }

    // 1. English (NKJV or KJV) - Flat list
    const englishBible = engOverride === 'kjv'
        ? (bibleData.kjv || bibleData.nkjv)
        : (bibleData.nkjv || bibleData.kjv);
    if ((!results.english || results.english.length === 0) && bookCfg && (bookCfg.nkjv || bookCfg.kjv) && englishBible) {
        const engBookId = bookCfg.nkjv || bookCfg.kjv;
        results.english = englishBible
            .filter(v => v.book === engBookId && v.chapter === chapterNum && v.verse >= startVerse && v.verse <= endVerse)
            .map(v => ({ verseNum: v.verse, text: v.text }));
    }

    // 1b. Spanish (RGV) - Flat list in .verses
    if ((!results.spanish || !results.spanish_pr) && bookCfg && bibleData.rgv && bibleData.rgv.verses) {
        const rgvMapped = bibleData.rgv.verses
            .filter(v => v.book_name === bookCfg.rgv && v.chapter === chapterNum && v.verse >= startVerse && v.verse <= endVerse)
            .map(v => ({ verseNum: v.verse, text: v.text }));
        if (!results.spanish) results.spanish = rgvMapped;
        if (!results.spanish_pr) results.spanish_pr = rgvMapped;
    }

    // 2. Amharic (am54) - Nested structure
    if ((!results.amharic_script || results.amharic_script.length === 0) && bookCfg && bibleData.am54 && bibleData.am54.books) {
        const amBook = bibleData.am54.books.find(b => b.title === bookCfg.am54);
        if (amBook) {
            let amChapter = amBook.chapters.find(ch => {
                const chNum = parseInt(ch.chapter);
                return !isNaN(chNum) && chNum === chapterNum;
            });

            if (!amChapter && amBook.chapters[chapterNum - 1]) {
                amChapter = amBook.chapters[chapterNum - 1];
            }

            if (amChapter && amChapter.verses) {
                results.amharic_script = [];
                for (let v = startVerse; v <= endVerse; v++) {
                    const verseText = amChapter.verses[v - 1];
                    if (verseText) {
                        results.amharic_script.push({ verseNum: v, text: verseText });
                    }
                }
            }
        }
    }

    // 3. Ge'ez Psalms - Nested structure
    if ((!results.geez_script || results.geez_script.length === 0) && (bookName === 'Psalms' || bookName === 'Psalm') && bibleData.geez_psalms) {
        const lxxStart = typeof convertMtToLxx === 'function' ? convertMtToLxx(chapterNum, startVerse) : null;
        const lxxCh = typeof lxxStart === 'object' ? lxxStart.lxxChapter : (typeof convertMtToLxx === 'function' ? convertMtToLxx(chapterNum) : chapterNum);
        const lxxStartV = typeof lxxStart === 'object' ? lxxStart.lxxVerse : startVerse;
        const lxxEnd = typeof convertMtToLxx === 'function' ? convertMtToLxx(chapterNum, endVerse) : null;
        const lxxEndV = typeof lxxEnd === 'object' ? lxxEnd.lxxVerse : endVerse;
        const chapter = bibleData.geez_psalms.find(ch => ch.id === lxxCh);
        if (chapter && chapter.verses) {
            results.geez_script = chapter.verses
                .filter(v => v.verse_number >= lxxStartV && v.verse_number <= lxxEndV)
                .map(v => ({ verseNum: v.verse_number, text: v.text }));
        }
    }

    return results;
}

function setSelectedTypicalPsalmId(readingKey, chantId) {
    if (!readingKey) return;
    if (!selectedTypicalPsalmIds) selectedTypicalPsalmIds = {};
    if (chantId) {
        selectedTypicalPsalmIds[readingKey] = chantId;
    } else {
        delete selectedTypicalPsalmIds[readingKey];
    }
}

function findTypicalPsalm(book, chapter, start, end, readingKey = null) {
    if ((book !== 'Psalms' && book !== 'Psalm') || typeof TYPICAL_PSALMS === 'undefined') return null;
    if (readingKey && selectedTypicalPsalmIds && selectedTypicalPsalmIds[readingKey]) {
        const preferred = TYPICAL_PSALMS.find(p =>
            p.id === selectedTypicalPsalmIds[readingKey] &&
            p.mc === chapter &&
            p.ms === start &&
            (p.me === end || end === 999 || Math.abs(p.me - end) <= 1)
        );
        if (preferred) return preferred;
    }
    const exact = TYPICAL_PSALMS.find(p => p.mc === chapter && p.ms === start && p.me === end);
    if (exact) return exact;
    return TYPICAL_PSALMS.find(p =>
        p.mc === chapter && (
            (p.ms === start && Math.abs(p.me - end) <= 1) ||
            (p.ms >= start && p.me <= end) ||
            (start >= p.ms && end <= p.me && (p.me - p.ms) <= 2)
        )
    ) || null;
}

function getPsalmVerses(chapterNum, start, end, langKey) {
    // This is now redundant with getBibleVersesFromRef but keeping for backwards compat if needed elsewhere
    if (!bibleData.geez_psalms) return "";
    const chapter = bibleData.geez_psalms.find(ch => ch.id === chapterNum);
    if (!chapter) return "";

    const verses = chapter.verses.filter(v => v.verse_number >= start && v.verse_number <= end);
    return verses.map(v => `[${v.verse_number}] ${v.text}`).join(" ");
}

// --- Liturgy Lectionary Config ---
const LITURGY_LECTIONARY_CONFIG = [
    {
        id: 'pauline',
        ref: () => kidaseLectionaryRefs.pauline,
        placeholders: {
            english: '{{TODAY\'S PAULINE EPISTLE READING}}',
            geez_script: '{{ዮም አንበበ መልእክተ ጳውሎስ}}',
            amharic_script: '{{የዛሬው የቅዱስ ጳውሎስ መልእክት ይነበባል}}',
            tigrinya_script: '{{ናይ ሎሚ ንባብ መልእኽቲ ጳውሎስ}}',
            spanish: '{{LECTURA DE LA EPÍSTOLA PAULINA DE HOY}}',
            spanish_pr: '{{LECTURA DE LA EPÍSTOLA PAULINA DE HOY}}'
        },
        prefixes: {
            english: 'Epistle: ',
            amharic_script: 'መልእክት፤ ',
            geez_script: 'መልእክት፤ ',
            spanish: 'Epístola: ',
            spanish_pr: 'Epístola: '
        }
    },
    {
        id: 'universal',
        ref: () => kidaseLectionaryRefs.universal,
        placeholders: {
            english: '{{TODAY\'S UNIVERSAL EPISTLE READING}}',
            geez_script: '{{ዮም አንበበ መልእክተ ካቶሊካ}}',
            amharic_script: '{{የዛሬው የሁለተኛው መልእክት ይነበባል}}',
            tigrinya_script: '{{ናይ ሎሚ ካልኣይ ንባብ መልእኽቲ}}',
            spanish: '{{LECTURA DE LA EPÍSTOLA UNIVERSAL DE HOY}}',
            spanish_pr: '{{LECTURA DE LA EPÍSTOLA UNIVERSAL DE HOY}}'
        },
        prefixes: {
            english: 'Epistle: ',
            amharic_script: 'መልእክት፤ ',
            geez_script: 'መልእክት፤ ',
            spanish: 'Epístola: ',
            spanish_pr: 'Epístola: '
        }
    },
    {
        id: 'acts',
        ref: () => kidaseLectionaryRefs.acts,
        placeholders: {
            english: '{{TODAY\'S ACTS READING}}',
            geez_script: '{{ዮም አንበበ ግብረ ሐዋርያት}}',
            amharic_script: '{{የዛሬው የሐዋርያት ስራ ንባብ}}',
            tigrinya_script: '{{ናይ ሎሚ ግብሪ ሃዋርያት ንባብ}}',
            spanish: '{{LECTURA DE ACTOS DE HOY}}',
            spanish_pr: '{{LECTURA DE ACTOS DE HOY}}'
        },
        prefixes: {}
    },
    {
        id: 'psalm',
        ref: () => kidaseLectionaryRefs.psalm,
        placeholders: {
            english: '{{TODAY\'S PSALMS READING}}',
            geez_script: '{{ዮም ምስባክ}}',
            amharic_script: '{{የዛሬው ምስባክ}}',
            tigrinya_script: '{{ናይ ሎሚ ንባብ መዝሙር ዳዊት}}',
            spanish: '{{LECTURA DE LOS SALMOS DE HOY}}',
            spanish_pr: '{{LECTURA DE LOS SALMOS DE HOY}}'
        },
        prefixes: {
            amharic_script: 'ምስባክ፤ ',
            geez_script: 'ምስባክ፤ '
        }
    },
    {
        id: 'gospel',
        ref: () => kidaseLectionaryRefs.gospel,
        placeholders: {
            english: '{{TODAY\'S GOSPEL READING}}',
            geez_script: '{{ዮም አንበበ ወንጌል}}',
            amharic_script: '{{የዛሬው ወንጌል ንባብ}}',
            tigrinya_script: '{{ናይ ሎሚ ንባብ ወንጌል}}',
            spanish: '{{LECTURA DEL EVANGELIO DE HOY}}',
            spanish_pr: '{{LECTURA DEL EVANGELIO DE HOY}}'
        },
        prefixes: {
            english: 'Gospel of ',
            spanish: 'Evangelio de ',
            spanish_pr: 'Evangelio de '
        }
    },
    {
        id: 'morningPsalm',
        ref: () => kidaseLectionaryRefs.morningPsalm,
        placeholders: {
            english: '{{MORNING PSALMS READING}}',
            geez_script: '{{ዮም ምስባክ ዘነግህ}}',
            amharic_script: '{{የዛሬው ምስባክ ዘነግህ}}',
            tigrinya_script: '{{ናይ ንግሆ ንባብ መዝሙር ዳዊት}}',
            spanish: '{{LECTURA DE LOS SALMOS DE LA MAÑANA}}',
            spanish_pr: '{{LECTURA DE LOS SALMOS DE LA MAÑANA}}'
        },
        prefixes: {
            amharic_script: 'ምስባክ፤ ',
            geez_script: 'ምስባክ፤ '
        }
    },
    {
        id: 'morningGospel',
        ref: () => kidaseLectionaryRefs.morningGospel,
        placeholders: {
            english: '{{MORNING GOSPEL READING}}',
            geez_script: '{{ዮም አንበበ ወንጌል ዘነግህ}}',
            amharic_script: '{{የዛሬው ወንጌል ዘነግህ ንባብ}}',
            tigrinya_script: '{{ናይ ንግሆ ንባብ ወንጌል}}',
            spanish: '{{LECTURA DEL EVANGELIO DE LA MAÑANA}}',
            spanish_pr: '{{LECTURA DEL EVANGELIO DE LA MAÑANA}}'
        },
        prefixes: {
            english: 'Gospel of ',
            spanish: 'Evangelio de ',
            spanish_pr: 'Evangelio de '
        }
    },
    {
        id: 'eveningPsalm',
        ref: () => kidaseLectionaryRefs.eveningPsalm,
        placeholders: {
            english: '{{EVENING PSALMS READING}}',
            geez_script: '{{ዮም ምስባክ ዘሠርክ}}',
            amharic_script: '{{የዛሬው ምስባክ ዘሠርክ}}',
            tigrinya_script: '{{ናይ ምሸት ንባብ መዝሙር ዳዊት}}',
            spanish: '{{LECTURA DE LOS SALMOS DE LA TARDE}}',
            spanish_pr: '{{LECTURA DE LOS SALMOS DE LA TARDE}}'
        },
        prefixes: {
            amharic_script: 'ምስባክ፤ ',
            geez_script: 'ምስባክ፤ '
        }
    },
    {
        id: 'eveningGospel',
        ref: () => kidaseLectionaryRefs.eveningGospel,
        placeholders: {
            english: '{{EVENING GOSPEL READING}}',
            geez_script: '{{ዮም አንበበ ወንጌል ዘሠርክ}}',
            amharic_script: '{{የዛሬው ወንጌል ዘሠርክ ንባብ}}',
            tigrinya_script: '{{ናይ ምሸት ንባብ ወንጌል}}',
            spanish: '{{LECTURA DEL EVANGELIO DE LA TARDE}}',
            spanish_pr: '{{LECTURA DEL EVANGELIO DE LA TARDE}}'
        },
        prefixes: {
            english: 'Gospel of ',
            spanish: 'Evangelio de ',
            spanish_pr: 'Evangelio de '
        }
    }
];

function getActualVerseCount(bookName, chapterNum) {
    if (!bibleData.loaded) return null;

    let lookupName = bookName;
    if (bookName === 'Psalm') lookupName = 'Psalms';

    const bookCfg = BIBLE_BOOK_MAPPING[lookupName];
    if (!bookCfg) return null;

    // Try KJV (flat array)
    const englishBible = bibleData.kjv || bibleData.nkjv;
    if (englishBible) {
        const engName = bookCfg.kjv || bookCfg.nkjv;
        const chapterVerses = englishBible.filter(v => v.book === engName && v.chapter === chapterNum);
        if (chapterVerses.length > 0) {
            return Math.max(...chapterVerses.map(v => v.verse));
        }
    }

    // Try AM54 (structured)
    if (bibleData.am54 && bibleData.am54.books) {
        const am54Name = bookCfg.am54;
        const book = bibleData.am54.books.find(b => b.title === am54Name);
        if (book && book.chapters && book.chapters[chapterNum - 1]) {
            return book.chapters[chapterNum - 1].verses.length;
        }
    }

    // Try WeahaduBibleService cache
    if (window.WeahaduBibleService && window.WeahaduBibleService.canon) {
        for (const ed of ['en-kjv', 'am-2000', 'gez-1980', 'gez-2014', 'ti-1997']) {
            const verses = window.WeahaduBibleService.getVersesSync(ed, `${lookupName} ${chapterNum}:1-999`);
            if (verses && verses.length > 0) {
                return Math.max(...verses.map(v => parseInt(v.n, 10)).filter(n => !isNaN(n)));
            }
        }
    }

    return null;
}

function toGeezNumeral(n) {
    if (n === 0) return "";
    const ones = ["", "፩", "፪", "፫", "፬", "፭", "፮", "፯", "፰", "፱"];
    const tens = ["", "፲", "፳", "፴", "፵", "፶", "፷", "፸", "፹", "፺"];

    let result = "";
    if (n >= 100) {
        let hundreds = Math.floor(n / 100);
        if (hundreds > 1) result += toGeezNumeral(hundreds);
        result += "፻";
        n %= 100;
    }

    if (n >= 10) {
        result += tens[Math.floor(n / 10)];
        n %= 10;
    }

    if (n > 0) {
        result += ones[n];
    }

    return result;
}

const GEEZ_PHONETIC_CHAR_MAP = {
    "፣": ",", "።": ".", "፤": ":", "፥": ";", "፦": ":", "፧": "?", "፡": " ",
    "፩": "ahadu", "፪": "kil'etu", "፫": "selestu", "፬": "arba'tu", "፭": "hamistu",
    "፮": "sidistu", "፯": "seb'atu", "፰": "semantu", "፱": "tes'atu", "፲": "asertu",
    "፳": "isra", "፴": "selasa", "፵": "arb'a", "፶": "hamsa", "፷": "sidsa",
    "፸": "seb'a", "፹": "semanya", "፺": "tese'a", "፻": "mi't", "፼": "asertu mi't",
    "ሀ": "ha", "ሁ": "hu", "ሂ": "hī", "ሃ": "ha", "ሄ": "hé", "ህ": "h", "ሆ": "ho",
    "ለ": "le", "ሉ": "lu", "ሊ": "lī", "ላ": "la", "ሌ": "lé", "ል": "l", "ሎ": "lo", "ሏ": "lwa",
    "ሐ": "ḥa", "ሑ": "ḥu", "ሒ": "ḥī", "ሓ": "ḥa", "ሔ": "ḥé", "ሕ": "ḥ", "ሖ": "ḥo", "ሗ": "ḥwa",
    "መ": "me", "ሙ": "mu", "ሚ": "mī", "ማ": "ma", "ሜ": "mé", "ም": "m", "ሞ": "mo", "ሟ": "mwa", "ፙ": "mya",
    "ሠ": "se", "ሡ": "su", "ሢ": "sī", "ሣ": "sa", "ሤ": "sé", "ሥ": "s", "ሦ": "so", "ሧ": "swa",
    "ረ": "re", "ሩ": "ru", "ሪ": "rī", "ራ": "ra", "ሬ": "ré", "ር": "r", "ሮ": "ro", "ሯ": "rwa", "ፘ": "rya",
    "ሰ": "se", "ሱ": "su", "ሲ": "sī", "ሳ": "sa", "ሴ": "sé", "ስ": "s", "ሶ": "so", "ሷ": "swa",
    "ቀ": "ḳe", "ቁ": "ḳu", "ቂ": "ḳī", "ቃ": "ḳa", "ቄ": "ḳé", "ቅ": "ḳ", "ቆ": "ḳo", "ቇ": "ḳwa",
    "በ": "be", "ቡ": "bu", "ቢ": "bī", "ባ": "ba", "ቤ": "bé", "ብ": "b", "ቦ": "bo", "ቧ": "bwa",
    "ተ": "te", "ቱ": "tu", "ቲ": "tī", "ታ": "ta", "ቴ": "té", "ት": "t", "ቶ": "to", "ቷ": "twa",
    "ኀ": "ha", "ኁ": "hu", "ኂ": "hī", "ኃ": "ha", "ኄ": "hé", "ኅ": "h", "ኆ": "ho", "ኇ": "hwa",
    "ነ": "ne", "ኑ": "nu", "ኒ": "nī", "ና": "na", "ኔ": "né", "ን": "n", "ኖ": "no", "ኗ": "nwa",
    "አ": "'a", "ኡ": "'u", "ኢ": "'ī", "ኣ": "'a", "ኤ": "'é", "እ": "'i", "ኦ": "'o", "ኧ": "'wa",
    "ከ": "ke", "ኩ": "ku", "ኪ": "kī", "ካ": "ka", "ኬ": "ké", "ክ": "k", "ኮ": "ko", "ኯ": "kwa",
    "ወ": "we", "ዉ": "wu", "ዊ": "wī", "ዋ": "wa", "ዌ": "wé", "ው": "w", "ዎ": "wo", "ዏ": "wua",
    "ዐ": "'a", "ዑ": "'u", "ዒ": "'ī", "ዓ": "'a", "ዔ": "'é", "ዕ": "'i", "ዖ": "'o",
    "ዘ": "ze", "ዙ": "zu", "ዚ": "zī", "ዛ": "za", "ዜ": "zé", "ዝ": "z", "ዞ": "zo", "ዟ": "zwa",
    "የ": "ye", "ዩ": "yu", "ዪ": "yī", "ያ": "ya", "ዬ": "yé", "ይ": "y", "ዮ": "yo", "ዯ": "ywa",
    "ደ": "de", "ዱ": "du", "ዲ": "dī", "ዳ": "da", "ዴ": "dé", "ድ": "d", "ዶ": "do", "ዷ": "dwa",
    "ገ": "ge", "ጉ": "gu", "ጊ": "gī", "ጋ": "ga", "ጌ": "gé", "ግ": "g", "ጎ": "go", "ጏ": "gwa",
    "ጠ": "ṭe", "ጡ": "ṭu", "ጢ": "ṭī", "ጣ": "ṭa", "ጤ": "ṭé", "ጥ": "ṭ", "ጦ": "ṭo", "ጧ": "ṭwa",
    "ጰ": "p̣e", "ጱ": "p̣u", "ጲ": "p̣ī", "ጳ": "p̣a", "ጴ": "p̣é", "ጵ": "p̣", "ጶ": "p̣o", "ጷ": "p̣wa",
    "ጸ": "tse", "ጹ": "tsu", "ጺ": "tsī", "ጻ": "tsa", "ጼ": "tsé", "ጽ": "ts", "ጾ": "tso", "ጿ": "tswa",
    "ፀ": "tse", "ፁ": "tsu", "ፂ": "tsī", "ፃ": "tsa", "ፄ": "tsé", "ፅ": "ts", "ፆ": "tso", "ፇ": "tswa",
    "ፈ": "fe", "ፉ": "fu", "ፊ": "fī", "ፋ": "fa", "ፌ": "fé", "ፍ": "f", "ፎ": "fo", "ፏ": "fwa", "ፚ": "fya",
    "ፐ": "pe", "ፑ": "pu", "ፒ": "pī", "ፓ": "pa", "ፔ": "pé", "ፕ": "p", "ፖ": "po", "ፗ": "pwa",
    "ቈ": "ḳwe", "ቊ": "ḳwī", "ቋ": "ḳwa", "ቌ": "ḳwé", "ቍ": "ḳw",
    "ቘ": "ḳhwe", "ቚ": "ḳhwī", "ቛ": "ḳhwa", "ቜ": "ḳhwé", "ቝ": "ḳhw",
    "ኈ": "hwe", "ኊ": "hwī", "ኋ": "hwa", "ኌ": "hwé", "ኍ": "hw",
    "ኰ": "kwe", "ኲ": "kwī", "ኳ": "kwa", "ኴ": "kwé", "ኵ": "kw",
    "ጐ": "gwe", "ጒ": "gwī", "ጓ": "gwa", "ጔ": "gwé", "ጕ": "gw",
    "ቐ": "qhe", "ቑ": "qhu", "ቒ": "qhī", "ቓ": "qha", "ቔ": "qhé", "ቕ": "qh", "ቖ": "qho",
    "ቸ": "che", "ቹ": "chu", "ቺ": "chī", "ቻ": "cha", "ቼ": "ché", "ች": "ch", "ቾ": "cho",
    "ኘ": "ñe", "ኙ": "ñu", "ኚ": "ñī", "ኛ": "ña", "ኜ": "ñé", "ኝ": "ñ", "ኞ": "ño",
    "ኸ": "khe", "ኹ": "khu", "ኺ": "khī", "ኻ": "kha", "ኼ": "khé", "ኽ": "kh", "ኾ": "kho",
    "ዠ": "zhe", "ዡ": "zhu", "ዢ": "zhī", "ዣ": "zha", "ዤ": "zhé", "ዥ": "zh", "ዦ": "zho",
    "ጀ": "je", "ጁ": "ju", "ጂ": "jī", "ጃ": "ja", "ጄ": "jé", "ጅ": "j", "ጆ": "jo",
    "ጨ": "che", "ጩ": "chu", "ጪ": "chī", "ጫ": "cha", "ጬ": "ché", "ጭ": "ch", "ጮ": "cho",
    "ቨ": "ve", "ቩ": "vu", "ቪ": "vī", "ቫ": "va", "ቬ": "vé", "ቭ": "v", "ቮ": "vo",
    "ዧ": "zhwa", "ጯ": "chwa", "ቿ": "chwa", "ጇ": "jwa", "ኟ": "ñwa",
    "ሸ": "she", "ሹ": "shu", "ሺ": "shī", "ሻ": "sha", "ሼ": "shé", "ሽ": "sh", "ሾ": "sho", "ሿ": "shwa"
};

function transliterateGeezToPhonetic(text) {
    if (!text) return '';
    let result = '';
    for (const char of text) {
        if (GEEZ_PHONETIC_CHAR_MAP[char] !== undefined) {
            result += GEEZ_PHONETIC_CHAR_MAP[char];
        } else {
            result += char;
        }
    }
    return result;
}

function syncAllLectionaryPickers(lectionaryKey, originContainer = null) {
    document.querySelectorAll(`.lectionary-picker-container[data-lectionary-key="${lectionaryKey}"]`).forEach(c => {
        if (c !== originContainer && typeof c.syncPicker === 'function') {
            c.syncPicker(true);
        }
    });
}

function getEnglishEditionCitation(engCode) {
    return engCode === 'kjv' ? 'KJV' : 'NKJV';
}

function getAmharicEditionCitation(amCode) {
    return amCode === 'am54' ? 'አም1954' : 'አም2000';
}

function getGeezEditionCitation(geezCode) {
    if (geezCode === 'gez-2014') return `ግእዝ${toGeezNumeral(2014)}`;
    if (geezCode === 'gez-1694') return `ግእዝ${toGeezNumeral(1694)}`;
    if (geezCode === 'gez-1845') return `ግእዝ${toGeezNumeral(1845)}`;
    return `ግእዝ${toGeezNumeral(1980)}`;
}

function getReadingGeezOptions(readingKey) {
    if (PSALM_READING_KEYS.has(readingKey)) {
        return [
            { value: 'gez-1980-formatted', label: 'ግእዝ1980 (Septuagint)' },
            { value: 'gez-1980', label: 'ግእዝ1980 (Masoretic)' },
            { value: 'gez-1694', label: 'ግእዝ1694' }
        ];
    }
    if (PROPHET_SONGS_READING_KEYS.has(readingKey)) {
        return [
            { value: 'gez-1980-formatted', label: 'ግእዝ1980 (Septuagint)' },
            { value: 'gez-1980', label: 'ግእዝ1980 (Masoretic)' },
            { value: 'gez-1845', label: 'ግእዝ1845' }
        ];
    }
    return [
        { value: 'gez-1980', label: 'ግእዝ1980' },
        { value: 'gez-2014', label: 'ግእዝ2014' }
    ];
}

function getReadingTranslationOverride(readingKey, langType) {
    const ov = readingKey && readingTranslationOverrides && readingTranslationOverrides[readingKey];
    if (langType === 'english') {
        return (ov && ov.english) ? ov.english : (globalEnglishTranslation || 'nkjv');
    }
    if (langType === 'amharic') {
        return (ov && ov.amharic) ? ov.amharic : (globalAmharicTranslation || 'am-2000');
    }
    if (langType === 'geez') {
        if (ov && ov.geez) return ov.geez;
        if (readingKey && (PSALM_READING_KEYS.has(readingKey) || PROPHET_SONGS_READING_KEYS.has(readingKey))) {
            return 'gez-1980-formatted';
        }
        return globalGeezTranslation || 'gez-1980';
    }
    return null;
}

function updateTranslationOverrideVisibility(targetRow = null) {
    const showEng = Boolean(displayedLanguages && displayedLanguages.english);
    const showAm = Boolean(displayedLanguages && displayedLanguages.amharic_script);
    const showGz = Boolean(displayedLanguages && displayedLanguages.geez_script);
    const rows = targetRow ? [targetRow] : document.querySelectorAll('.reading-translation-overrides');
    rows.forEach(row => {
        const engPill = row.querySelector('[data-override-lang-pill="english"]');
        const amPill = row.querySelector('[data-override-lang-pill="amharic"]');
        const gzPill = row.querySelector('[data-override-lang-pill="geez"]');
        if (engPill) engPill.style.display = showEng ? '' : 'none';
        if (amPill) amPill.style.display = showAm ? '' : 'none';
        if (gzPill) gzPill.style.display = showGz ? '' : 'none';
        row.style.display = (showEng || showAm || showGz) ? '' : 'none';
    });
}

function createTranslationOverrideRow(readingKey, options = {}) {
    const { isCardInline = false, onPendingChange = null } = options;
    const row = document.createElement('div');
    row.className = 'reading-translation-overrides';
    row.dataset.readingKey = readingKey;

    const engPill = document.createElement('div');
    engPill.className = 'translation-override-pill';
    engPill.dataset.overrideLangPill = 'english';
    const engLabel = document.createElement('span');
    engLabel.className = 'translation-override-pill-label';
    engLabel.textContent = 'English';
    const engSelect = document.createElement('select');
    engSelect.className = 'translation-override-select settings-select';
    engSelect.dataset.overrideLang = 'english';
    [
        { value: 'nkjv', label: 'NKJV1982' },
        { value: 'kjv', label: 'KJV1611' }
    ].forEach(optData => {
        const opt = document.createElement('option');
        opt.value = optData.value;
        opt.textContent = optData.label;
        engSelect.appendChild(opt);
    });
    engSelect.value = getReadingTranslationOverride(readingKey, 'english');
    engPill.appendChild(engLabel);
    engPill.appendChild(engSelect);

    const amPill = document.createElement('div');
    amPill.className = 'translation-override-pill';
    amPill.dataset.overrideLangPill = 'amharic';
    const amLabel = document.createElement('span');
    amLabel.className = 'translation-override-pill-label ethiopic-label';
    amLabel.textContent = 'አማርኛ';
    const amSelect = document.createElement('select');
    amSelect.className = 'translation-override-select settings-select ethiopic-label';
    amSelect.dataset.overrideLang = 'amharic';
    [
        { value: 'am-2000', label: 'አም2000' },
        { value: 'am54', label: 'አም1954' }
    ].forEach(optData => {
        const opt = document.createElement('option');
        opt.value = optData.value;
        opt.textContent = optData.label;
        amSelect.appendChild(opt);
    });
    amSelect.value = getReadingTranslationOverride(readingKey, 'amharic');
    amPill.appendChild(amLabel);
    amPill.appendChild(amSelect);

    const geezPill = document.createElement('div');
    geezPill.className = 'translation-override-pill';
    geezPill.dataset.overrideLangPill = 'geez';
    const geezLabel = document.createElement('span');
    geezLabel.className = 'translation-override-pill-label ethiopic-label';
    geezLabel.textContent = 'ግእዝ';
    const geezSelect = document.createElement('select');
    geezSelect.className = 'translation-override-select settings-select ethiopic-label';
    geezSelect.dataset.overrideLang = 'geez';
    getReadingGeezOptions(readingKey).forEach(optData => {
        const opt = document.createElement('option');
        opt.value = optData.value;
        opt.textContent = optData.label;
        geezSelect.appendChild(opt);
    });
    geezSelect.value = getReadingTranslationOverride(readingKey, 'geez');
    geezPill.appendChild(geezLabel);
    geezPill.appendChild(geezSelect);

    row.hasPendingChanges = () => (
        engSelect.value !== getReadingTranslationOverride(readingKey, 'english') ||
        amSelect.value !== getReadingTranslationOverride(readingKey, 'amharic') ||
        geezSelect.value !== getReadingTranslationOverride(readingKey, 'geez')
    );

    row.commitOverrides = () => {
        if (!readingTranslationOverrides[readingKey]) {
            readingTranslationOverrides[readingKey] = {};
        }
        readingTranslationOverrides[readingKey].english = engSelect.value;
        readingTranslationOverrides[readingKey].amharic = amSelect.value;
        readingTranslationOverrides[readingKey].geez = geezSelect.value;
        syncAllTranslationOverrideRows(readingKey, row);
    };

    const handleChange = () => {
        if (isCardInline) {
            if (typeof onPendingChange === 'function') {
                onPendingChange();
            }
            return;
        }
        row.commitOverrides();
        saveSettings();

        const targetCard = row.closest('.prayer-card');
        const targetReadingType = targetCard ? targetCard.dataset.readingType : readingKey;
        if (displayOptions.presentationMode === 'slides' && targetReadingType) {
            _pendingSlideReadingType = targetReadingType;
            _pendingSlideSignature = null;
            _pendingSlideId = null;
            _pendingSlidePredicate = null;
        }
        renderPrayers();
        if (targetCard && targetReadingType && displayOptions.presentationMode !== 'slides') {
            setTimeout(() => {
                const reRenderedCard = document.querySelector(`.prayer-card[data-reading-type="${targetReadingType}"]`);
                if (reRenderedCard) {
                    reRenderedCard.scrollIntoView({ block: 'center', behavior: 'instant' });
                }
            }, 50);
        }
    };

    engSelect.addEventListener('change', handleChange);
    amSelect.addEventListener('change', handleChange);
    geezSelect.addEventListener('change', handleChange);

    row.appendChild(engPill);
    row.appendChild(amPill);
    row.appendChild(geezPill);
    updateTranslationOverrideVisibility(row);
    return row;
}

function updatePsalmHeaderLabels() {
    const psalmHeadings = [
        { selector: 'h5[data-reading-target="eveningPsalm"]', readingKey: 'eveningPsalm', prefix: 'Evening Psalm', suffix: 'ምስባክ ዘሠርክ' },
        { selector: 'h5[data-reading-target="morningPsalm"]', readingKey: 'morningPsalm', prefix: 'Morning Psalm', suffix: 'ምስባክ ዘነግህ' },
        { selector: 'h5[data-reading-target="psalm"]', readingKey: 'psalm', prefix: 'Liturgy Psalm', suffix: 'ምስባክ ዘቅዳሴ' }
    ];
    psalmHeadings.forEach(({ selector, readingKey, prefix, suffix }) => {
        const el = document.querySelector(selector);
        if (el) {
            const engVer = getReadingTranslationOverride(readingKey, 'english') === 'kjv' ? 'KJV' : 'NKJV';
            el.textContent = `${prefix} (${engVer}) | ${suffix}`;
        }
    });
}

function syncAllTranslationOverrideRows(readingKey = null, originRow = null) {
    const selector = readingKey
        ? `.reading-translation-overrides[data-reading-key="${readingKey}"]`
        : '.reading-translation-overrides';
    document.querySelectorAll(selector).forEach(row => {
        if (row === originRow) return;
        const parentPicker = row.closest('.lectionary-picker-container');
        if (parentPicker && parentPicker.dataset.hasPendingChanges === 'true') return;
        const rKey = row.dataset.readingKey;
        const enSel = row.querySelector('select[data-override-lang="english"]');
        const amSel = row.querySelector('select[data-override-lang="amharic"]');
        const gzSel = row.querySelector('select[data-override-lang="geez"]');
        if (enSel) enSel.value = getReadingTranslationOverride(rKey, 'english');
        if (amSel) amSel.value = getReadingTranslationOverride(rKey, 'amharic');
        if (gzSel) gzSel.value = getReadingTranslationOverride(rKey, 'geez');
    });
    updateTranslationOverrideVisibility();
    updatePsalmHeaderLabels();
}

function createLectionaryPicker(containerOrId, lectionaryKey, bookOptions = [], typicalPsalms = null) {
    const container = (typeof containerOrId === 'string') ? document.getElementById(containerOrId) : containerOrId;
    if (!container) return;

    container.classList.add('lectionary-picker-container');
    container.dataset.lectionaryKey = lectionaryKey;
    container.dataset.hasPendingChanges = 'false';

    container.innerHTML = ''; // Clear

    const isCardInline = container.classList.contains('card-inline-lectionary-picker');

    let typicalBtn = null;
    let bookSelect = null;
    let goBtn = null;
    let overrideRow = null;

    const createField = (label, className) => {
        const field = document.createElement('div');
        field.className = `picker-field ${className}`;
        const lbl = document.createElement('label');
        lbl.textContent = label;
        const sel = document.createElement('select');
        sel.className = 'settings-select';
        field.appendChild(lbl);
        field.appendChild(sel);
        return { field, sel };
    };

    const chapterField = createField('Ch', 'chapter-field');
    const startField = createField('Start', 'start-field');
    const endField = createField('End', 'end-field');

    if (isCardInline) {
        // --- Single Horizontal Row for Card Footer ---
        const pickerRow = document.createElement('div');
        pickerRow.className = 'lectionary-picker-single-row';

        if (lectionaryKey === 'psalm') {
            const nkjvLabel = document.createElement('span');
            nkjvLabel.className = 'psalm-nkjv-label';
            nkjvLabel.textContent = 'KJV';
            pickerRow.appendChild(nkjvLabel);
        } else if (bookOptions.length > 1) {
            bookSelect = document.createElement('select');
            bookSelect.className = 'lectionary-picker-book-select settings-select';
            bookOptions.forEach(bookName => {
                const opt = document.createElement('option');
                opt.value = bookName;
                const bookCfg = BIBLE_BOOK_MAPPING[bookName];
                const geezName = bookCfg ? bookCfg.geez : "";
                opt.textContent = geezName ? `${bookName} | ${geezName}` : bookName;
                bookSelect.appendChild(opt);
            });
            pickerRow.appendChild(bookSelect);
        }

        pickerRow.appendChild(chapterField.field);
        pickerRow.appendChild(startField.field);
        pickerRow.appendChild(endField.field);

        goBtn = document.createElement('button');
        goBtn.type = 'button';
        goBtn.className = 'settings-button lectionary-go-btn';
        goBtn.innerHTML = `<span>Go</span><svg class="lectionary-go-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
        goBtn.title = 'Load and present selected Bible passage';
        goBtn.setAttribute('aria-label', 'Go to selected Bible passage');
        goBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            updateRefs(false);
        });
        pickerRow.appendChild(goBtn);

        if (typicalPsalms) {
            typicalBtn = document.createElement('button');
            typicalBtn.className = 'settings-button typical-psalms-btn';
            typicalBtn.textContent = 'Typical Psalms...';
            typicalBtn.title = 'Select a Typical Psalm Chant';
            typicalBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openTypicalPsalmsModal((idx) => {
                    const data = typicalPsalms[idx];
                    if (bookSelect) bookSelect.value = "Psalms";

                    const metadata = BIBLE_METADATA["Psalms"];
                    populateSelect(chapterField.sel, metadata.chapters, data.mc);
                    populateSelect(startField.sel, metadata.maxVerses, data.ms);
                    populateSelect(endField.sel, metadata.maxVerses, data.me, true);
                    setSelectedTypicalPsalmId(lectionaryKey, data && data.id ? data.id : null);

                    updateRefs(false, { preserveChantId: true });
                    syncPicker(true);
                });
            });
            pickerRow.appendChild(typicalBtn);

            const clearChantBtn = document.createElement('button');
            clearChantBtn.className = 'settings-button clear-psalm-chant-btn';
            clearChantBtn.textContent = 'Clear';
            clearChantBtn.title = 'Clear Psalm Chant';
            clearChantBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (bookSelect) bookSelect.value = 'Psalms';
                const metadata = BIBLE_METADATA['Psalms'];
                populateSelect(chapterField.sel, metadata.chapters, 1);
                populateSelect(startField.sel, metadata.maxVerses, 1);
                populateSelect(endField.sel, metadata.maxVerses, 'End', true);
                setSelectedTypicalPsalmId(lectionaryKey, null);
                updateRefs(false);
                typicalBtn.textContent = 'Typical Psalms...';
                typicalBtn.classList.remove('selected');
            });
            pickerRow.appendChild(clearChantBtn);
        }

        container.appendChild(pickerRow);
    } else {
        // --- Original 2-Row Layout for Settings Panel ---
        if (bookOptions.length > 1) {
            bookSelect = document.createElement('select');
            bookSelect.className = 'lectionary-picker-book-select settings-select';
            bookOptions.forEach(bookName => {
                const opt = document.createElement('option');
                opt.value = bookName;
                const bookCfg = BIBLE_BOOK_MAPPING[bookName];
                const geezName = bookCfg ? bookCfg.geez : "";
                opt.textContent = geezName ? `${bookName} | ${geezName}` : bookName;
                bookSelect.appendChild(opt);
            });
            container.appendChild(bookSelect);
        }

        const row = document.createElement('div');
        row.className = 'lectionary-picker-row';
        row.appendChild(chapterField.field);
        row.appendChild(startField.field);
        row.appendChild(endField.field);
        container.appendChild(row);

        if (typicalPsalms) {
            const typicalContainer = document.createElement('div');
            typicalContainer.className = 'typical-psalms-container';
            typicalContainer.style.marginTop = '0.5rem';

            typicalBtn = document.createElement('button');
            typicalBtn.className = 'settings-button typical-psalms-btn';
            typicalBtn.textContent = 'Typical Psalm Chants...';
            typicalBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openTypicalPsalmsModal((idx) => {
                    const data = typicalPsalms[idx];
                    if (bookSelect) bookSelect.value = "Psalms";

                    const metadata = BIBLE_METADATA["Psalms"];
                    populateSelect(chapterField.sel, metadata.chapters, data.mc);
                    populateSelect(startField.sel, metadata.maxVerses, data.ms);
                    populateSelect(endField.sel, metadata.maxVerses, data.me, true);
                    setSelectedTypicalPsalmId(lectionaryKey, data && data.id ? data.id : null);

                    updateRefs(false, { preserveChantId: true });
                    syncPicker();
                });
            });
            typicalContainer.appendChild(typicalBtn);

            const clearChantBtn = document.createElement('button');
            clearChantBtn.className = 'settings-button clear-psalm-chant-btn';
            clearChantBtn.textContent = 'Clear Psalm Chant';
            clearChantBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (bookSelect) bookSelect.value = 'Psalms';
                const metadata = BIBLE_METADATA['Psalms'];
                populateSelect(chapterField.sel, metadata.chapters, 1);
                populateSelect(startField.sel, metadata.maxVerses, 1);
                populateSelect(endField.sel, metadata.maxVerses, 'End', true);
                setSelectedTypicalPsalmId(lectionaryKey, null);
                updateRefs(false);
                typicalBtn.innerHTML = 'Typical Psalm Chants...';
                typicalBtn.classList.remove('selected');
            });
            typicalContainer.appendChild(clearChantBtn);
            container.appendChild(typicalContainer);
        }
    }

    overrideRow = createTranslationOverrideRow(lectionaryKey, {
        isCardInline,
        onPendingChange: () => updateRefs(true)
    });
    container.appendChild(overrideRow);

    const updateRefs = (skipReRender = false, { preserveChantId = false } = {}) => {
        const book = bookOptions.length === 1 ? bookOptions[0] : (bookSelect ? bookSelect.value : bookOptions[0]);
        const ch = parseInt(chapterField.sel.value);
        const start = startField.sel.value;
        const end = endField.sel.value;
        const candidateRef = `${book} ${ch}:${start}-${end}`;

        // Sync "End" option display text
        const endOptions = endField.sel.options;
        const endOpt = endOptions[endOptions.length - 1];
        if (endOpt && endOpt.value === 'End') {
            const actualMax = getActualVerseCount(book, ch);
            if (actualMax) {
                if (end === 'End') {
                    endOpt.textContent = `${actualMax}  ${toGeezNumeral(actualMax)}`;
                } else {
                    endOpt.textContent = `End (${actualMax}) | ፍጻሜ (${toGeezNumeral(actualMax)})`;
                }
            } else {
                endOpt.textContent = 'End | ፍጻሜ';
            }
        }

        if (isCardInline && goBtn) {
            const savedRaw = kidaseLectionaryRefs[lectionaryKey] || '';
            const savedMatch = savedRaw.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+|End))?$/);
            const normalizedSaved = savedMatch ? `${savedMatch[1].trim()} ${parseInt(savedMatch[2], 10)}:${savedMatch[3]}-${savedMatch[4] || 'End'}` : savedRaw;
            const refChanged = candidateRef !== normalizedSaved;
            const overridesChanged = Boolean(overrideRow && typeof overrideRow.hasPendingChanges === 'function' && overrideRow.hasPendingChanges());
            const hasPending = refChanged || overridesChanged;
            goBtn.classList.toggle('has-pending-changes', hasPending);
            container.dataset.hasPendingChanges = hasPending ? 'true' : 'false';
        }

        if (skipReRender) return;

        if (!preserveChantId) {
            setSelectedTypicalPsalmId(lectionaryKey, null);
        }

        container.dataset.hasPendingChanges = 'false';
        if (goBtn) {
            goBtn.classList.remove('has-pending-changes');
        }
        if (overrideRow && typeof overrideRow.commitOverrides === 'function') {
            overrideRow.commitOverrides();
        }

        kidaseLectionaryRefs[lectionaryKey] = candidateRef;
        if (isCardInline && prayerDisplay) {
            prayerDisplay.querySelectorAll('.section-title.collapsible').forEach(hdr => {
                const hdrKey = hdr.dataset.stateKey;
                if (hdrKey) {
                    collapsedSections[hdrKey] = hdr.classList.contains('collapsed');
                }
            });
        }
        saveSettings();
        syncAllLectionaryPickers(lectionaryKey, container);

        const targetCard = container.closest('.prayer-card');
        const targetReadingType = (targetCard && targetCard.dataset.readingType) ? targetCard.dataset.readingType : lectionaryKey;

        if (displayOptions.presentationMode === 'slides') {
            _pendingSlideReadingType = targetReadingType;
            _pendingSlideSignature = null;
            _pendingSlideId = null;
            _pendingSlidePredicate = null;
        }

        const renderPromise = renderPrayers();

        const finalizeNavigation = () => {
            if (displayOptions.presentationMode === 'slides') {
                const reRenderedCard = prayerDisplay ? prayerDisplay.querySelector(`.prayer-card[data-reading-type="${targetReadingType}"]`) : null;
                if (reRenderedCard) {
                    const allSlides = Array.from(prayerDisplay.querySelectorAll('.prayer-card, .section-title.collapsible'));
                    const idx = allSlides.indexOf(reRenderedCard);
                    if (idx !== -1 && currentSlideIndex !== idx) {
                        currentSlideIndex = idx;
                        showSlide(currentSlideIndex);
                    }
                }
            } else if (isCardInline && targetReadingType) {
                const reRenderedCard = document.querySelector(`.prayer-card[data-reading-type="${targetReadingType}"]`);
                if (reRenderedCard) {
                    reRenderedCard.scrollIntoView({ block: 'center', behavior: 'instant' });
                }
            }
        };

        finalizeNavigation();
        if (renderPromise && typeof renderPromise.then === 'function') {
            renderPromise.then(finalizeNavigation);
        }
    };

    const populateSelect = (select, max, selected, isEndField = false) => {
        select.innerHTML = '';

        let cappedSelected = selected;
        if (selected !== 'End' && !isNaN(parseInt(selected)) && parseInt(selected) > max) {
            cappedSelected = max;
        }

        for (let i = 1; i <= max; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = `${i}  ${toGeezNumeral(i)}`;
            select.appendChild(opt);
            if (i == cappedSelected) opt.selected = true;
        }

        if (isEndField) {
            const endOpt = document.createElement('option');
            endOpt.value = 'End';
            endOpt.textContent = 'End | ፍጻሜ';
            select.appendChild(endOpt);
            if (selected === 'End') endOpt.selected = true;
        }

        const targetVal = (isEndField && selected === 'End') ? 'End' : String(cappedSelected);
        if (targetVal) {
            select.value = targetVal;
        }
    };

    // Listeners
    if (bookSelect) {
        bookSelect.addEventListener('change', () => {
            const book = bookSelect.value;
            const metadata = BIBLE_METADATA[book] || { chapters: 50, maxVerses: 100 };
            const actualMax = getActualVerseCount(book, 1) || metadata.maxVerses;

            populateSelect(chapterField.sel, metadata.chapters, 1);
            populateSelect(startField.sel, actualMax, 1);
            populateSelect(endField.sel, actualMax, 'End', true);

            if (isCardInline && useExternalBibleAPI && window.WeahaduBibleService) {
                const langs = ['en-kjv', globalAmharicTranslation || 'am-2000', 'gez-1980', globalGeezTranslation || 'gez-1980', 'ti-1997'];
                window.WeahaduBibleService.preloadBooks(langs, [`${book} 1:1`]).catch(() => {});
            }

            updateRefs(isCardInline);
        });
    }

    chapterField.sel.addEventListener('change', () => {
        const book = bookOptions.length === 1 ? bookOptions[0] : (bookSelect ? bookSelect.value : bookOptions[0]);
        const ch = parseInt(chapterField.sel.value);
        const metadata = BIBLE_METADATA[book] || { chapters: 50, maxVerses: 100 };
        const actualMax = getActualVerseCount(book, ch) || metadata.maxVerses;

        const currentStart = startField.sel.value;
        const currentEnd = endField.sel.value;

        populateSelect(startField.sel, actualMax, currentStart);
        populateSelect(endField.sel, actualMax, currentEnd, true);

        const sVal = parseInt(startField.sel.value, 10);
        const eVal = endField.sel.value === 'End' ? Infinity : parseInt(endField.sel.value, 10);
        if (!isNaN(sVal) && !isNaN(eVal) && sVal > eVal) {
            endField.sel.value = String(sVal);
        }

        updateRefs(isCardInline);
    });

    startField.sel.addEventListener('change', () => {
        const sVal = parseInt(startField.sel.value, 10);
        const eVal = endField.sel.value === 'End' ? Infinity : parseInt(endField.sel.value, 10);
        if (!isNaN(sVal) && !isNaN(eVal) && sVal > eVal) {
            endField.sel.value = String(sVal);
        }
        updateRefs(isCardInline);
    });

    endField.sel.addEventListener('change', () => {
        const sVal = parseInt(startField.sel.value, 10);
        const eVal = endField.sel.value === 'End' ? Infinity : parseInt(endField.sel.value, 10);
        if (!isNaN(sVal) && !isNaN(eVal) && eVal < sVal) {
            startField.sel.value = String(eVal);
        }
        updateRefs(isCardInline);
    });

    // Restore full "End" text when the user clicks to choose
    endField.sel.addEventListener('mousedown', () => {
        const book = bookOptions.length === 1 ? bookOptions[0] : (bookSelect ? bookSelect.value : bookOptions[0]);
        const ch = parseInt(chapterField.sel.value);
        const endOptions = endField.sel.options;
        const endOpt = endOptions[endOptions.length - 1];
        if (endOpt && endOpt.value === 'End') {
            const actualMax = getActualVerseCount(book, ch);
            if (actualMax) {
                endOpt.textContent = `End (${actualMax}) | ፍጻሜ (${toGeezNumeral(actualMax)})`;
            } else {
                endOpt.textContent = 'End | ፍጻሜ';
            }
        }
    });

    // Restore shortened text on blur if End is still selected
    endField.sel.addEventListener('blur', () => updateRefs(true));

    const syncPicker = (skipUpdateRefs = false) => {
        const currentRef = kidaseLectionaryRefs[lectionaryKey] || "";
        const match = currentRef.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+|End))?$/i);
        const crossMatch = !match ? currentRef.match(/^(.+?)\s+(\d+):(\d+)-(\d+):(\d+|End)$/i) : null;

        let book = bookOptions[0];
        let ch = 1;
        let start = 1;
        let end = 'End';

        if (match) {
            book = match[1].trim();
            ch = parseInt(match[2], 10);
            start = match[3];
            end = match[4] || 'End';
        } else if (crossMatch) {
            book = crossMatch[1].trim();
            ch = parseInt(crossMatch[2], 10);
            start = crossMatch[3];
            end = 'End';
        }

        if (bookSelect) {
            for (let i = 0; i < bookSelect.options.length; i++) {
                if (bookSelect.options[i].value === book) {
                    bookSelect.selectedIndex = i;
                    break;
                }
            }
        }

        let metadataKey = (book === 'Psalm') ? 'Psalms' : book;
        const metadata = BIBLE_METADATA[metadataKey] || { chapters: 50, maxVerses: 100 };
        const actualMax = getActualVerseCount(book, ch) || metadata.maxVerses;

        populateSelect(chapterField.sel, metadata.chapters, ch);
        populateSelect(startField.sel, actualMax, start);
        populateSelect(endField.sel, actualMax, end, true);

        if (typicalBtn && typicalPsalms) {
            const numericEnd = (end === 'End') ? actualMax : parseInt(end);
            const preferredId = selectedTypicalPsalmIds && selectedTypicalPsalmIds[lectionaryKey];
            let foundIdx = -1;
            if ((book === 'Psalms' || book === 'Psalm') && preferredId) {
                foundIdx = typicalPsalms.findIndex(p =>
                    p.id === preferredId && p.mc === ch && p.ms === parseInt(start) && p.me === numericEnd
                );
            }
            if (foundIdx === -1) {
                foundIdx = typicalPsalms.findIndex(p =>
                    (book === 'Psalms' || book === 'Psalm') &&
                    p.mc === ch && p.ms === parseInt(start) && p.me === numericEnd
                );
            }
            if (foundIdx !== -1) {
                const chantMatch = typicalPsalms[foundIdx];
                typicalBtn.innerHTML = `<span class="chant-btn-phonetic">${chantMatch.p.split(/\s+/).slice(0, 4).join(' ')}...</span><span class="chant-btn-geez ethiopic-label">${chantMatch.g.split(/\s+/).slice(0, 4).join(' ')}...</span>`;
                typicalBtn.title = `Typical Psalm Chant: ${chantMatch.p} (${chantMatch.g})`;
                typicalBtn.classList.add('selected');
            } else {
                typicalBtn.textContent = isCardInline ? 'Typical Psalms...' : 'Typical Psalm Chants...';
                typicalBtn.title = 'Select a Typical Psalm Chant';
                typicalBtn.classList.remove('selected');
            }
        }

        if (!skipUpdateRefs) {
            updateRefs(true);
        }
        container.dataset.hasPendingChanges = 'false';
        if (goBtn) {
            goBtn.classList.remove('has-pending-changes');
        }
    };

    // Initial sync
    syncPicker();

    // Store sync function on container for external calls
    container.syncPicker = syncPicker;
}

function initializeLectionaryPickers() {
    const tp = typeof TYPICAL_PSALMS !== 'undefined' ? TYPICAL_PSALMS : null;
    createLectionaryPicker('morning-psalm-ref-container', 'morningPsalm', ['Psalms'], tp);
    createLectionaryPicker('morning-gospel-ref-container', 'morningGospel', ['Matthew', 'Mark', 'Luke', 'John']);
    createLectionaryPicker('evening-psalm-ref-container', 'eveningPsalm', ['Psalms'], tp);
    createLectionaryPicker('evening-gospel-ref-container', 'eveningGospel', ['Matthew', 'Mark', 'Luke', 'John']);
    createLectionaryPicker('kidase-pauline-ref-container', 'pauline', ['Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews']);
    createLectionaryPicker('kidase-universal-ref-container', 'universal', ['James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation']);
    createLectionaryPicker('kidase-acts-ref-container', 'acts', ['Acts']);
    createLectionaryPicker('kidase-psalm-ref-container', 'psalm', ['Psalms'], tp);
    createLectionaryPicker('kidase-gospel-ref-container', 'gospel', ['Matthew', 'Mark', 'Luke', 'John']);
}

function replaceKidasePlaceholders(text, langKey, isFirstLanguage) {
    let processed = text;

    for (const cfg of LITURGY_LECTIONARY_CONFIG) {
        // Check all language placeholders for this config
        for (const [pLang, placeholder] of Object.entries(cfg.placeholders)) {
            if (processed.includes(placeholder)) {
                // If we get here, it means the main card renderer didn't split it (e.g. static view)
                // We provide a fallback or simple label.
                if (isFirstLanguage) {
                    const results = getBibleVersesFromRef(cfg.ref(), cfg.id);
                    if (results && results[langKey]) {
                        const prefix = (cfg.prefixes && cfg.prefixes[langKey]) || "";
                        const headerText = `${prefix}${cfg.ref()}`.trim();
                        const formattedBody = results[langKey].map(v => {
                            let dVN = v.verseNum;
                            if (langKey === 'geez_script' || langKey === 'geez_psalms') {
                                dVN = String(dVN).split('-').map(n => toGeezNumeral(parseInt(n, 10))).join('-');
                            }
                            return `<sup>${dVN}</sup> ${v.text}`;
                        }).join(" ");
                        return processed.replace(placeholder, `<span class="speaker-label">${headerText}</span><br>${formattedBody}`);
                    }
                    return processed.replace(placeholder, `[Bible Reading]`);
                } else {
                    return ""; // Keep other columns clean if not first
                }
            }
        }
    }
    return processed;
}


const ETHIOPIAN_MONTHS_INFO = [
    { num: 1, name: 'Meskerem', geez: 'መስከረም', westernRange: 'Sep 11 – Oct 10 (Sep 12 in leap year)', meaning: 'Beginning of the New Year (Enkutatash) and end of the rainy season; celebrates the Feast of the Finding of the True Cross (Meskel on Meskerem 17).' },
    { num: 2, name: 'Tikimt', geez: 'ጥቅምት', westernRange: 'Oct 11 – Nov 9 (Oct 12 in leap year)', meaning: 'Season of flowers (Tsige), commemorating the Flight of the Holy Family into Egypt.' },
    { num: 3, name: 'Hidar', geez: 'ኅዳር', westernRange: 'Nov 10 – Dec 9 (Nov 11 in leap year)', meaning: 'Month of the Fast of the Prophets (Tsome Nebiyat) beginning Hidar 15 and Hidar Tsion (Hidar 21).' },
    { num: 4, name: 'Tahsas', geez: 'ታኅሣሥ', westernRange: 'Dec 10 – Jan 8 (Dec 11 in leap year)', meaning: 'Month of Advent culminating in the glorious Feast of the Nativity of Our Lord (Genna on Tahsas 29 /28).' },
    { num: 5, name: 'Tir', geez: 'ጥር', westernRange: 'Jan 9 – Feb 7 (Jan 10 in leap year)', meaning: 'Month of the Baptism of Our Lord (Timkat on Tir 11), Wedding at Cana (Tir 12), and Dormition of St. Mary (Asterio Maryam on Tir 21).' },
    { num: 6, name: 'Yekatit', geez: 'የካቲት', westernRange: 'Feb 8 – Mar 9', meaning: 'Season often marking the beginning of the Fast of Nineveh and the Great Fast (Abiy Tsom), and the Covenant of Mercy (Kidane Mihret on Yekatit 16).' },
    { num: 7, name: 'Megabit', geez: 'መጋቢት', westernRange: 'Mar 10 – Apr 8', meaning: 'Heart of the Great Fast (Lent) and the Feast of the Annunciation & Glorious Cross (Megabit 29 & 10).' },
    { num: 8, name: 'Miazia', geez: 'ሚያዝያ', westernRange: 'Apr 9 – May 8', meaning: 'Paschal season of Holy Week (Himamat), the Resurrection (Fasika), and St. George the Martyr (Miazia 23).' },
    { num: 9, name: 'Ginbot', geez: 'ግንቦት', westernRange: 'May 9 – Jun 7', meaning: 'Joyous Season of the Nativity of the Blessed Virgin Mary (Lideta on Ginbot 1) and the Ascension & Pentecost.' },
    { num: 10, name: 'Sene', geez: 'ሰኔ', westernRange: 'Jun 8 – Jul 7', meaning: 'Month of the Fast of the Apostles (Tsome Hawaryat) and the Dedication of the Church of St. Mary (Sene 20/21).' },
    { num: 11, name: 'Hamle', geez: 'ሐምሌ', westernRange: 'Jul 8 – Aug 6', meaning: 'Rainy season (Kiremt); Feast of Sts. Peter and Paul (Hamle 5) and Holy Trinity (Hamle 7).' },
    { num: 12, name: 'Nehase', geez: 'ነሐሴ', westernRange: 'Aug 7 – Sep 5', meaning: 'Month of the Fast of the Assumption (Filseta, Nehase 1–15), the Transfiguration on Mount Tabor (Debre Tabor on Nehase 13), and the Assumption of St. Mary (Nehase 16).' },
    { num: 13, name: 'Pagumen', geez: 'ጳጕሜን', westernRange: 'Sep 6 – Sep 10 (Sep 11 in leap year)', meaning: 'The 13th month ("Epagomenal days") consisting of 5 days (6 days every 4th year in the Year of St. Luke), dedicated to eschatological remembrance and preparation for the New Year.' }
];

// Monthly Feasts (1–30) of the Ethiopian Orthodox Tewahedo Church (sourced from geez.org/Calendars/)
const ETHIOPIAN_MONTHLY_FEASTS = [
    { day: 1, geezDay: '፩', name: 'Nativity of St. Mary, St. Raguel, Prophet Elijah & St. Bartholomew', geez: 'ልደታ ለማርያም፣ ቅዱስ ራጉኤል፣ ኤልያስ ነቢይ' },
    { day: 2, geezDay: '፪', name: 'St. Thaddaeus the Apostle, Abba Guba & Walka Michael', geez: 'ታዴዎስ ሐዋርያ፣ አባ ጉባ' },
    { day: 3, geezDay: '፫', name: 'Entrance of St. Mary into the Temple, St. Phanuel & Abune Zena Markos', geez: 'በዓታ ለማርያም፣ ቅዱስ ፋኑኤል፣ አቡነ ዜና ማርቆስ' },
    { day: 4, geezDay: '፬', name: 'St. John, Son of Thunder & St. Andrew the Apostle', geez: 'ዮሐንስ ወልደ ነጎድጓድ፣ እንድርያስ ሐዋርያ' },
    { day: 5, geezDay: '፭', name: 'Sts. Peter & Paul & Abune Gebre Menfes Kidus', geez: 'ጴጥሮስ ወጳውሎስ፣ አቡነ ገብረ መንፈስ ቅዱስ' },
    { day: 6, geezDay: '፮', name: 'Return of the Holy Family from Egypt (Debre Quesquam) & St. Arsema', geez: 'ቁስቋም ማርያም፣ ቅድስት አርሴማ' },
    { day: 7, geezDay: '፯', name: 'The Holy Trinity', geez: 'ቅድስት ሥላሴ' },
    { day: 8, geezDay: '፰', name: 'The Four Heavenly Animals & Abba Kiros', geez: 'አርባዕቱ እንስሳ፣ አባ ኪሮስ' },
    { day: 9, geezDay: '፱', name: 'St. Thomas the Apostle, the 318 Nicene Fathers & the Nine Saints', geez: 'ቶማስ ሐዋርያ፣ ሠለስቱ ምዕት፣ ተሰዓቱ ቅዱሳን' },
    { day: 10, geezDay: '፲', name: 'Feast of the Cross of Our Lord', geez: 'በዓለ መስቀሉ ለእግዚእነ' },
    { day: 11, geezDay: '፲፩', name: 'Sts. Anna & Joachim, St. Yared & St. Fasilides', geez: 'ሐና ወኢያቄም፣ ቅዱስ ያሬድ፣ ቅዱስ ፋሲለደስ' },
    { day: 12, geezDay: '፲፪', name: 'St. Michael, St. Matthew the Evangelist & St. Kristos Semra', geez: 'ቅዱስ ሚካኤል፣ ማቴዎስ ወንጌላዊ፣ ቅድስት ክርስቶስ ሠምራ' },
    { day: 13, geezDay: '፲፫', name: 'God the Father, St. Ruphael & the Myriad Angels', geez: 'እግዚአብሔር አብ፣ ቅዱስ ሩፋኤል፣ አእላፍ መላእክት' },
    { day: 14, geezDay: '፲፬', name: 'Abune Aregawi & St. Gebre Kristos', geez: 'አቡነ አረጋዊ፣ ቅዱስ ገብረ ክርስቶስ' },
    { day: 15, geezDay: '፲፭', name: 'St. Cyriacus & His Mother St. Julitta', geez: 'ቅዱስ ቂርቆስ ወእሙ ኢየሉጣ' },
    { day: 16, geezDay: '፲፮', name: 'Covenant of Mercy (Our Lady Mary)', geez: 'ኪዳነ ምሕረት' },
    { day: 17, geezDay: '፲፯', name: 'St. Stephen & Abba Gerima', geez: 'ቅዱስ እስጢፋኖስ፣ አባ ገሪማ' },
    { day: 18, geezDay: '፲፰', name: 'St. Philip the Apostle & Abune Ewostatewos', geez: 'ፊልጶስ ሐዋርያ፣ አቡነ ኤዎስጣቴዎስ' },
    { day: 19, geezDay: '፲፱', name: 'St. Gabriel the Archangel', geez: 'ቅዱስ ገብርኤል ሊቀ መላእክት' },
    { day: 20, geezDay: '፳', name: 'Building of the Church (First Church of St. Mary) & Prophet Elisha', geez: 'ሕንፀታ ለቤተ ክርስቲያን፣ ኤልሳዕ ነቢይ' },
    { day: 21, geezDay: '፳፩', name: 'Our Lady Mary, Mother of God', geez: 'እግዝእትነ ማርያም ወላዲተ አምላክ' },
    { day: 22, geezDay: '፳፪', name: 'St. Urael, St. Deksios & St. Luke the Evangelist', geez: 'ቅዱስ ዑራኤል፣ ቅዱስ ደቅስዮስ፣ ሉቃስ ወንጌላዊ' },
    { day: 23, geezDay: '፳፫', name: 'St. George, Chief of Martyrs', geez: 'ቅዱስ ጊዮርጊስ ሊቀ ሰማዕታት' },
    { day: 24, geezDay: '፳፬', name: 'Abune Tekle Haymanot & the 24 Priests of Heaven', geez: 'አቡነ ተክለ ሃይማኖት፣ ካህናተ ሰማይ' },
    { day: 25, geezDay: '፳፭', name: 'St. Merkorios', geez: 'ቅዱስ መርቆሬዎስ' },
    { day: 26, geezDay: '፳፮', name: 'St. Joseph the Elder & Abba Salama, Revealer of Light', geez: 'ቅዱስ ዮሴፍ አረጋዊ፣ አባ ሰላማ ከሣቴ ብርሃን' },
    { day: 27, geezDay: '፳፯', name: 'Savior of the World (Crucifixion of Our Lord)', geez: 'መድኃኔ ዓለም' },
    { day: 28, geezDay: '፳፰', name: 'Emmanuel & Abraham, Isaac, and Jacob', geez: 'አማኑኤል፣ አብርሃም ይስሐቅ ወያዕቆብ' },
    { day: 29, geezDay: '፳፱', name: 'Feast of God the Son (Incarnation, Nativity & Resurrection)', geez: 'በዓለ ወልድ' },
    { day: 30, geezDay: '፴', name: 'St. Mark the Evangelist & St. John the Baptist', geez: 'ማርቆስ ወንጌላዊ፣ ዮሐንስ መጥምቅ' }
];

const LITURGICAL_HOURS_GUIDE = [
    {
        canonicalHour: '1st Hour (Prime / ነግህ)',
        copticKey: 'coptic_1st',
        ethiopianKey: 'dawn',
        rangeLabel: '6:00 AM – 9:00 AM',
        mystery: 'Our Lord Jesus Christ was bound and led from Caiaphas to stand before Pontius Pilate at daybreak; it also commemorates His glorious Resurrection at dawn and the creation of light.',
        geezTerm: 'ጸሎተ ነግህ (፩ ሰዓት)'
    },
    {
        canonicalHour: '3rd Hour (Terce / ሠለስት)',
        copticKey: 'coptic_3rd',
        ethiopianKey: 'dawn',
        rangeLabel: '9:00 AM – 12:00 PM',
        mystery: 'At the Third Hour (9:00 AM), Our Lord was condemned and scourged by Pilate\'s soldiers, and on the Day of Pentecost the Holy Spirit descended upon the Apostles in the Upper Room of Zion.',
        geezTerm: 'ጸሎተ ሠለስት (፫ ሰዓት)'
    },
    {
        canonicalHour: '6th Hour (Sext / ቀትር)',
        copticKey: 'coptic_6th',
        ethiopianKey: 'dawn',
        rangeLabel: '12:00 PM – 3:00 PM',
        mystery: 'At the Sixth Hour (12:00 Noon), Our Lord Jesus Christ was nailed to the Holy Cross at Golgotha for our salvation, and darkness covered the whole earth from the sixth hour until the ninth hour.',
        geezTerm: 'ጸሎተ ቀትር (፮ ሰዓት)'
    },
    {
        canonicalHour: '9th Hour (None / ተሰዓት)',
        copticKey: 'coptic_9th',
        ethiopianKey: 'sunset',
        rangeLabel: '3:00 PM – 5:00 PM',
        mystery: 'At the Ninth Hour (3:00 PM), Our Lord cried out on the Cross, bowed His head, and yielded up His spirit in the flesh, opening the gates of Paradise to the penitent thief.',
        geezTerm: 'ጸሎተ ተሰዓት (፱ ሰዓት)'
    },
    {
        canonicalHour: '11th Hour (Vespers / ሠርክ)',
        copticKey: 'coptic_11th',
        ethiopianKey: 'sunset',
        rangeLabel: '5:00 PM – 6:00 PM',
        mystery: 'At the Eleventh Hour (5:00 PM), Righteous Joseph of Arimathea and Nicodemus took down the holy Body of Our Lord from the Cross, wrapped Him in pure linen with spices, and gave thanks.',
        geezTerm: 'ጸሎተ ሠርክ (፲፩ ሰዓት)'
    },
    {
        canonicalHour: '12th Hour (Compline / ንዋም)',
        copticKey: 'coptic_12th',
        ethiopianKey: 'sunset',
        rangeLabel: '6:00 PM – 12:00 AM',
        mystery: 'At the Twelfth Hour (6:00 PM), Our Lord\'s body was laid in the new tomb and a great stone was rolled across the entrance; we remember our own repose and pray for forgiveness before sleep.',
        geezTerm: 'ጸሎተ ንዋም (፲፪ ሰዓት)'
    },
    {
        canonicalHour: 'Midnight (Nocturns / መንፈቀ ሌሊት)',
        copticKey: 'coptic_midnight_1',
        ethiopianKey: 'dawn',
        rangeLabel: '12:00 AM – 6:00 AM',
        mystery: 'At Midnight, the Bridegroom comes (Matthew 25:6); we keep vigil with the angels and praise Our Lord who rose from the dead in the stillness of the night.',
        geezTerm: 'ጸሎተ መንፈቀ ሌሊት'
    }
];

function computeEthiopianDate(dateObj = getEffectiveDate(), { civilDateOnly = false } = {}) {
    const isWazemaEvening = !civilDateOnly && dateObj.getHours() >= 18;
    const targetDate = isWazemaEvening ? getLiturgicalDateObject(dateObj) : dateObj;

    // Convert Gregorian Date to Julian Day Number (JDN), then to Ethiopian Calendar
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1; // 1-12
    const day = targetDate.getDate();

    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

    // Ethiopic epoch JDN = 1723856
    const r = (jdn - 1723856) % 1461;
    const n = (r % 365) + 365 * Math.floor(r / 1460);
    const ethYear = 4 * Math.floor((jdn - 1723856) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
    const ethMonth = Math.floor(n / 30) + 1; // 1-13
    const ethDay = (n % 30) + 1; // 1-30

    const monthInfo = ETHIOPIAN_MONTHS_INFO[ethMonth - 1] || ETHIOPIAN_MONTHS_INFO[0];
    const evangelists = [
        { name: 'Yohannes (St. John)', geez: 'ዘዮሐንስ' },
        { name: 'Mateos (St. Matthew)', geez: 'ዘማቴዎስ' },
        { name: 'Markos (St. Mark)', geez: 'ዘማርቆስ' },
        { name: 'Luqas (St. Luke — Leap Year)', geez: 'ዘሉቃስ' }
    ];
    const ameteAlem = ethYear + 5500;
    const evangelist = evangelists[ameteAlem % 4];
    const dayOfWeekNamesGeez = ['እሑድ', 'ሰኑይ', 'ሠሉስ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቀዳሚት'];

    return {
        ethYear,
        ethMonth,
        ethDay,
        ameteAlem,
        evangelist,
        isWazemaEvening,
        monthName: monthInfo.name,
        geezMonth: monthInfo.geez,
        geezDate: toGeezNumeral(ethDay),
        geezYear: toGeezNumeral(ethYear),
        dayOfWeekGeez: dayOfWeekNamesGeez[targetDate.getDay()],
        month: monthInfo.name,
        date: String(ethDay),
        year: String(ethYear)
    };
}

function getGeezDateInfo() {
    return computeEthiopianDate(getEffectiveDate());
}

function getOrdinalSuffix(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function getLiturgicalHourInfo(dateObj = getEffectiveDate()) {
    const h = dateObj.getHours();
    // Liturgical day hours: 6:00 AM is the start of the 1st Hour; 6:00 PM is the start of the 1st Night Watch
    let hourNum = ((h - 6 + 24) % 12) + 1;
    const isDaytime = h >= 6 && h < 18;
    const hourLabel = (h >= 0 && h < 6)
        ? `Night Watch (${getOrdinalSuffix(hourNum)} Hr)`
        : `${getOrdinalSuffix(hourNum)} Hour`;

    // Determine primary and adjacent canonical hours for "Pray Now" buttons
    let primaryCanonical = LITURGICAL_HOURS_GUIDE[0];
    let secondaryCanonical = null;

    if (h >= 6 && h < 9) {
        primaryCanonical = LITURGICAL_HOURS_GUIDE[0]; // 1st Hour
        if (h >= 7) secondaryCanonical = LITURGICAL_HOURS_GUIDE[1]; // 3rd Hour next
    } else if (h >= 9 && h < 12) {
        primaryCanonical = LITURGICAL_HOURS_GUIDE[1]; // 3rd Hour
        if (h >= 10) secondaryCanonical = LITURGICAL_HOURS_GUIDE[2]; // 6th Hour next
    } else if (h >= 12 && h < 15) {
        primaryCanonical = LITURGICAL_HOURS_GUIDE[2]; // 6th Hour
        if (h >= 13) secondaryCanonical = LITURGICAL_HOURS_GUIDE[3]; // 9th Hour next
    } else if (h >= 15 && h < 17) {
        primaryCanonical = LITURGICAL_HOURS_GUIDE[3]; // 9th Hour
        if (h >= 16) secondaryCanonical = LITURGICAL_HOURS_GUIDE[4]; // 11th Hour next
    } else if (h >= 17 && h < 18) {
        primaryCanonical = LITURGICAL_HOURS_GUIDE[4]; // 11th Hour (Vespers)
        secondaryCanonical = LITURGICAL_HOURS_GUIDE[5]; // 12th Hour next
    } else if (h >= 18 && h < 24) {
        primaryCanonical = LITURGICAL_HOURS_GUIDE[5]; // 12th Hour (Compline)
        secondaryCanonical = LITURGICAL_HOURS_GUIDE[6]; // Midnight next
    } else {
        primaryCanonical = LITURGICAL_HOURS_GUIDE[6]; // Midnight
        secondaryCanonical = LITURGICAL_HOURS_GUIDE[0]; // 1st Hour next
    }

    return {
        hourNum,
        isDaytime,
        hourLabel,
        primaryCanonical,
        secondaryCanonical
    };
}

function renderLiturgicalCalendarBar() {
    if (!liturgicalCalendarBar) return;
    const now = getEffectiveDate();
    const eth = computeEthiopianDate(now);
    const hrInfo = getLiturgicalHourInfo(now);
    const isOverridden = Boolean(customDateTimeOverride);

    const westernDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const westernMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const wDayName = westernDays[now.getDay()];
    const wMonthName = westernMonths[now.getMonth()];
    const wDayNum = now.getDate();
    const wYear = now.getFullYear();
    const formattedOverrideStr = isOverridden ? now.toLocaleString() : '';
    const clockTooltip = isOverridden
        ? `Custom liturgical date & time active (${formattedOverrideStr}) — click to adjust or reset`
        : 'Override date & time for liturgical prayers and lectionary';
    const feastInfo = getActiveEotcFeastLookup(eth.ethMonth, eth.ethDay);
    const feastDisplayStr = feastInfo ? `${feastInfo.english} | ${feastInfo.geez}` : '';
    const desktopFeastHtml = feastDisplayStr
        ? `
        <span class="cal-dot cal-feast-desktop-sep">•</span>
        <span class="cal-feast-desktop" title="${feastDisplayStr}">${feastDisplayStr}</span>`
        : '';

    liturgicalCalendarBar.innerHTML = `
        <button type="button" class="calendar-chip-link" data-cal-action="hour" title="Click to view the mystery of this Liturgical Hour and pray its Psalms">${hrInfo.hourLabel}</button>
        <span class="cal-dot">•</span>
        <button type="button" class="calendar-chip-link" data-cal-action="month" title="Click to learn about the Ethiopian Calendar months">${eth.monthName}</button>
        <button type="button" class="calendar-chip-link" data-cal-action="feast" title="Click to view today's & monthly Feast Days (1–30)">${eth.ethDay}</button><span class="cal-sep">,</span>
        <button type="button" class="calendar-chip-link" data-cal-action="year" title="Click to learn about Year of Mercy (Amete Mihret)">${eth.ethYear}<span class="cal-year-mercy-label"> Year of Mercy</span></button>
        <button type="button" class="calendar-chip-link cal-datetime-override-btn${isOverridden ? ' is-overridden' : ''}" data-cal-action="datetime" aria-label="Override liturgical date and time" title="${clockTooltip}"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><polyline points="12 7 12 12 15.5 14"></polyline></svg></button>
        <span class="cal-dot cal-western-date-sep">•</span>
        <span class="cal-western-date">${wDayName}, ${wMonthName} ${wDayNum}, ${wYear}</span>${desktopFeastHtml}
    `;

    let mobileFeastEl = document.getElementById('header-feast-mobile-line') || headerFeastMobileLine;
    if (!mobileFeastEl && liturgicalCalendarBar.parentElement) {
        mobileFeastEl = document.createElement('div');
        mobileFeastEl.id = 'header-feast-mobile-line';
        mobileFeastEl.className = 'header-feast-mobile-line';
        mobileFeastEl.setAttribute('aria-label', 'Liturgical Feast Day');
        liturgicalCalendarBar.insertAdjacentElement('afterend', mobileFeastEl);
        headerFeastMobileLine = mobileFeastEl;
    }
    if (mobileFeastEl) {
        if (feastDisplayStr) {
            mobileFeastEl.textContent = feastDisplayStr;
            mobileFeastEl.title = feastDisplayStr;
            mobileFeastEl.hidden = false;
        } else {
            mobileFeastEl.textContent = '';
            mobileFeastEl.removeAttribute('title');
            mobileFeastEl.hidden = true;
        }
    }

    liturgicalCalendarBar.querySelectorAll('.calendar-chip-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openCalendarInfoModal(btn.getAttribute('data-cal-action'));
        });
    });
}

function openCalendarInfoModal(actionType) {
    if (!calendarInfoModal || !calendarInfoTitle || !calendarInfoBody) return;
    const now = getEffectiveDate();
    const eth = computeEthiopianDate(now);
    const hrInfo = getLiturgicalHourInfo(now);

    if (actionType === 'datetime') {
        calendarInfoTitle.innerHTML = `Liturgical Date & Time | ዕለት ወሰዓት`;
        const pad2 = n => String(n).padStart(2, '0');
        const toDateInputVal = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
        const toTimeInputVal = d => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

        const monthOptsHtml = ETHIOPIAN_MONTHS_INFO.map(m =>
            `<option value="${m.num}" ${m.num === eth.ethMonth ? 'selected' : ''}>${m.num}. ${m.name} (${m.geez})</option>`
        ).join('');
        const dayOptsHtml = Array.from({ length: 30 }, (_, i) => i + 1).map(d =>
            `<option value="${d}" ${d === eth.ethDay ? 'selected' : ''}>${d} (${toGeezNumeral(d)})</option>`
        ).join('');

        const scanPages = (typeof window !== 'undefined' && Array.isArray(window.EOTC_1938_SCAN_PAGES))
            ? window.EOTC_1938_SCAN_PAGES
            : (typeof EOTC_1938_SCAN_PAGES !== 'undefined' && Array.isArray(EOTC_1938_SCAN_PAGES) ? EOTC_1938_SCAN_PAGES : []);
        const resolveScanPageForMonth = (mNum) => {
            if (typeof window !== 'undefined' && typeof window.get1938ScanPageForMonth === 'function') {
                return window.get1938ScanPageForMonth(mNum);
            }
            if (typeof get1938ScanPageForMonth === 'function') {
                return get1938ScanPageForMonth(mNum);
            }
            return mNum === 13 ? 150 : Math.min(150, Math.max(139, 138 + (parseInt(mNum, 10) || 1)));
        };
        const initialScanPage = resolveScanPageForMonth(eth.ethMonth);
        const scanOptsHtml = scanPages.map(sp =>
            `<option value="${sp.bookPage}" ${sp.bookPage === initialScanPage ? 'selected' : ''}>${sp.label}</option>`
        ).join('');

        calendarInfoBody.innerHTML = `
            <p class="cal-dt-intro-copy">
                Select any date and hour to preview or pray its appointed prayers and Scripture readings. Note: each day at 6:00 PM, the Church's liturgical day advances to the next day.
            </p>
            <div id="cal-dt-preview-banner" class="cal-hour-card active-hour-card cal-dt-banner"></div>
            <div class="cal-dt-grid">
                <div class="cal-dt-field">
                    <label for="cal-dt-greg-date">Gregorian Date</label>
                    <input type="date" id="cal-dt-greg-date" value="${toDateInputVal(now)}">
                </div>
                <div class="cal-dt-field">
                    <label for="cal-dt-time">Time of Day</label>
                    <input type="time" id="cal-dt-time" value="${toTimeInputVal(now)}">
                </div>
            </div>
            <div class="cal-dt-eth-row">
                <div class="cal-dt-field">
                    <label for="cal-dt-eth-month">Ethiopian Month</label>
                    <select id="cal-dt-eth-month">${monthOptsHtml}</select>
                </div>
                <div class="cal-dt-field">
                    <label for="cal-dt-eth-day">Day</label>
                    <select id="cal-dt-eth-day">${dayOptsHtml}</select>
                </div>
                <div class="cal-dt-field">
                    <label for="cal-dt-eth-year">Year (ዓ.ም.)</label>
                    <input type="number" id="cal-dt-eth-year" min="1900" max="2200" value="${eth.ethYear}">
                </div>
            </div>
            <div class="cal-dt-actions">
                <button type="button" id="cal-dt-apply-btn" class="cal-dt-primary-btn">Apply Date &amp; Time</button>
                <button type="button" id="cal-dt-reset-btn" class="cal-dt-secondary-btn" ${customDateTimeOverride ? '' : 'disabled'}>Reset to Live</button>
            </div>
            <div class="cal-dt-transparency-footer">
                Notice any issues with the lectionary? You can always refer to the original text <a href="#" id="cal-dt-toggle-scans-link" class="cal-dt-inline-link" aria-expanded="false">here</a> or let us know what looks wrong in the feedback section <a href="#" id="cal-dt-open-feedback-link" class="cal-dt-inline-link">here</a>.
            </div>
            <div id="cal-dt-scans-drawer" class="cal-dt-scans-drawer" hidden>
                <div class="cal-dt-scans-toolbar">
                    <button type="button" id="cal-dt-scan-prev" class="cal-dt-scan-nav-btn" aria-label="Previous scan page" title="Previous page">&#8249;</button>
                    <select id="cal-dt-scan-page-select" aria-label="Select 1938 AD Lectionary page">${scanOptsHtml}</select>
                    <button type="button" id="cal-dt-scan-next" class="cal-dt-scan-nav-btn" aria-label="Next scan page" title="Next page">&#8250;</button>
                </div>
                <div class="cal-dt-scan-caption">
                    <span>1938 AD <i>Yä-Betä Krəstiyan Ṣälot</i> (የቤተ ክርስቲያን ጸሎት)</span>
                    <span id="cal-dt-scan-pdf-meta"></span>
                </div>
                <div id="cal-dt-scan-img-wrap" class="cal-dt-scan-img-wrap" title="Click scan to toggle zoom">
                    <img id="cal-dt-scan-img" alt="1938 AD EOTC Lectionary Page Scan" loading="lazy">
                </div>
            </div>
        `;

        const gregDateInput = calendarInfoBody.querySelector('#cal-dt-greg-date');
        const timeInput = calendarInfoBody.querySelector('#cal-dt-time');
        const ethMonthSel = calendarInfoBody.querySelector('#cal-dt-eth-month');
        const ethDaySel = calendarInfoBody.querySelector('#cal-dt-eth-day');
        const ethYearInput = calendarInfoBody.querySelector('#cal-dt-eth-year');
        const previewBanner = calendarInfoBody.querySelector('#cal-dt-preview-banner');
        const toggleScansLink = calendarInfoBody.querySelector('#cal-dt-toggle-scans-link');
        const openFeedbackLink = calendarInfoBody.querySelector('#cal-dt-open-feedback-link');
        const scansDrawer = calendarInfoBody.querySelector('#cal-dt-scans-drawer');
        const scanPageSelect = calendarInfoBody.querySelector('#cal-dt-scan-page-select');
        const scanPrevBtn = calendarInfoBody.querySelector('#cal-dt-scan-prev');
        const scanNextBtn = calendarInfoBody.querySelector('#cal-dt-scan-next');
        const scanImgWrap = calendarInfoBody.querySelector('#cal-dt-scan-img-wrap');
        const scanImg = calendarInfoBody.querySelector('#cal-dt-scan-img');
        const scanPdfMeta = calendarInfoBody.querySelector('#cal-dt-scan-pdf-meta');

        const renderScanPage = (bookPageNum) => {
            if (!scanImg || !scanPageSelect) return;
            const pNum = Math.max(139, Math.min(164, parseInt(bookPageNum, 10) || 139));
            scanPageSelect.value = String(pNum);
            const meta = scanPages.find(sp => sp.bookPage === pNum);
            scanImg.src = `img/lectionary-1938/p${pNum}.webp`;
            scanImg.alt = meta ? `1938 AD EOTC Lectionary — ${meta.label}` : `1938 AD EOTC Lectionary — Book p. ${pNum}`;
            if (scanPdfMeta) {
                scanPdfMeta.textContent = meta ? `Book p. ${meta.bookPage} (PDF p. ${meta.pdfPage}) · Tap scan to zoom` : `Book p. ${pNum}`;
            }
            if (scanPrevBtn) scanPrevBtn.disabled = pNum <= 139;
            if (scanNextBtn) scanNextBtn.disabled = pNum >= 164;
        };

        const buildCandidateDateFromGreg = () => {
            const [y, m, d] = (gregDateInput.value || toDateInputVal(now)).split('-').map(Number);
            const [hh, mm] = (timeInput.value || '08:00').split(':').map(Number);
            return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
        };

        const updateBannerAndSyncEth = (syncEthControls = true) => {
            const cand = buildCandidateDateFromGreg();
            const candEth = computeEthiopianDate(cand);
            const candHr = getLiturgicalHourInfo(cand);
            const candDay = getSeatatLiturgicalDay(cand);
            if (syncEthControls) {
                ethMonthSel.value = String(candEth.ethMonth);
                ethDaySel.value = String(candEth.ethDay);
                ethYearInput.value = String(candEth.ethYear);
            }
            if (scansDrawer && !scansDrawer.hidden) {
                renderScanPage(resolveScanPageForMonth(candEth.ethMonth));
            }
            const wazemaBadge = candEth.isWazemaEvening
                ? `<span class="cal-dt-wazema-pill">ዋዜማ • After 6:00 PM → Next Liturgical Day</span>`
                : '';
            previewBanner.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 0.5rem; flex-wrap: wrap;">
                    <strong>${candDay} (${candEth.dayOfWeekGeez}) — ${candEth.monthName} ${candEth.ethDay}, ${candEth.ethYear} ዓ.ም.</strong>
                    <span style="font-size: 0.8rem; opacity: 0.85;">${candHr.hourLabel}</span>
                </div>
                ${wazemaBadge ? `<div style="margin-top: 0.28rem;">${wazemaBadge}</div>` : ''}
            `;
        };

        const syncGregFromEth = () => {
            const convFn = (typeof window !== 'undefined' && window.ethiopianToGregorian) || (typeof ethiopianToGregorian === 'function' ? ethiopianToGregorian : null);
            if (!convFn) return;
            const [hh] = (timeInput.value || '08:00').split(':').map(Number);
            const eY = parseInt(ethYearInput.value, 10) || eth.ethYear;
            const eM = parseInt(ethMonthSel.value, 10) || 1;
            let eD = parseInt(ethDaySel.value, 10) || 1;
            if (eM === 13) {
                const maxP = ((eY + 5500) % 4 === 3) ? 6 : 5;
                if (eD > maxP) {
                    eD = maxP;
                    ethDaySel.value = String(eD);
                }
            }
            const greg = convFn(eY, eM, eD, { forWazemaEvening: (hh || 0) >= 18 });
            gregDateInput.value = `${greg.year}-${pad2(greg.month)}-${pad2(greg.day)}`;
            updateBannerAndSyncEth(false);
        };

        gregDateInput.addEventListener('change', () => updateBannerAndSyncEth(true));
        timeInput.addEventListener('change', () => updateBannerAndSyncEth(true));
        ethMonthSel.addEventListener('change', syncGregFromEth);
        ethDaySel.addEventListener('change', syncGregFromEth);
        ethYearInput.addEventListener('change', syncGregFromEth);

        if (toggleScansLink && scansDrawer) {
            toggleScansLink.addEventListener('click', (e) => {
                e.preventDefault();
                const willOpen = scansDrawer.hidden;
                scansDrawer.hidden = !willOpen;
                toggleScansLink.setAttribute('aria-expanded', String(willOpen));
                if (willOpen) {
                    const activeMonthNum = parseInt(ethMonthSel.value, 10) || eth.ethMonth;
                    renderScanPage(resolveScanPageForMonth(activeMonthNum));
                    if (typeof scansDrawer.scrollIntoView === 'function') {
                        setTimeout(() => scansDrawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 40);
                    }
                }
            });
        }

        if (scanPageSelect) {
            scanPageSelect.addEventListener('change', () => {
                if (scanImgWrap) scanImgWrap.classList.remove('is-zoomed');
                renderScanPage(scanPageSelect.value);
            });
        }
        if (scanPrevBtn) {
            scanPrevBtn.addEventListener('click', () => {
                if (scanImgWrap) scanImgWrap.classList.remove('is-zoomed');
                renderScanPage((parseInt(scanPageSelect.value, 10) || 139) - 1);
            });
        }
        if (scanNextBtn) {
            scanNextBtn.addEventListener('click', () => {
                if (scanImgWrap) scanImgWrap.classList.remove('is-zoomed');
                renderScanPage((parseInt(scanPageSelect.value, 10) || 139) + 1);
            });
        }
        if (scanImgWrap) {
            scanImgWrap.addEventListener('click', () => {
                scanImgWrap.classList.toggle('is-zoomed');
            });
        }

        if (openFeedbackLink) {
            openFeedbackLink.addEventListener('click', (e) => {
                e.preventDefault();
                closeModal();
                const fbModal = feedbackModal || document.getElementById('feedback-modal');
                if (fbModal) {
                    openModal(fbModal);
                    const fbInput = document.getElementById('feedback-textarea');
                    if (fbInput && typeof fbInput.focus === 'function') {
                        setTimeout(() => fbInput.focus(), 60);
                    }
                }
            });
        }

        calendarInfoBody.querySelector('#cal-dt-apply-btn').addEventListener('click', () => {
            const chosen = buildCandidateDateFromGreg();
            setCustomDateTimeOverride(chosen);
            closeModal();
        });

        calendarInfoBody.querySelector('#cal-dt-reset-btn').addEventListener('click', () => {
            clearCustomDateTimeOverride();
            closeModal();
        });

        updateBannerAndSyncEth(true);
        openModal(calendarInfoModal);
        return;
    }

    if (actionType === 'hour') {
        calendarInfoTitle.innerHTML = `Liturgical Hour: ${hrInfo.hourLabel}`;
        const pCan = hrInfo.primaryCanonical;
        const sCan = hrInfo.secondaryCanonical;
        let actionBtnsHtml = `
            <div class="cal-modal-action-box">
                <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; opacity: 0.9;"><strong>Ready to pray the Psalms of this hour?</strong></p>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    <button type="button" class="settings-button cal-pray-hour-btn" data-combo-key="${pCan.copticKey}" style="background-color: var(--primary-color); color: var(--bg-color); font-weight: 600;">
                        Pray ${pCan.canonicalHour} Now
                    </button>
                    ${sCan ? `<button type="button" class="settings-button cal-pray-hour-btn" data-combo-key="${sCan.copticKey}">
                        Pray ${sCan.canonicalHour}
                    </button>` : ''}
                </div>
            </div>
        `;

        const hoursListHtml = LITURGICAL_HOURS_GUIDE.map(item => {
            const isCurrent = item.canonicalHour === pCan.canonicalHour;
            return `
                <div class="cal-hour-card ${isCurrent ? 'active-hour-card' : ''}">
                    <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 0.5rem; flex-wrap: wrap;">
                        <strong>${item.canonicalHour}</strong>
                        <span style="font-size: 0.8rem; opacity: 0.75;">${item.rangeLabel} • ${item.geezTerm}</span>
                    </div>
                    <p style="margin: 0.35rem 0 0 0; font-size: 0.9rem; line-height: 1.45;">${item.mystery}</p>
                </div>
            `;
        }).join('');

        calendarInfoBody.innerHTML = `
            ${actionBtnsHtml}
            <p style="font-size: 0.92rem; line-height: 1.5; margin-bottom: 0.75rem;">
                In the Orthodox Tewahedo tradition, the liturgical day is measured from sunrise (6:00 AM = 1st Hour) and sanctifies every watch of the day by remembering the saving Passion, Death, and Resurrection of Our Lord Jesus Christ, alongside the descent of the Holy Spirit.
            </p>
            <div class="cal-hours-list">${hoursListHtml}</div>
        `;

        calendarInfoBody.querySelectorAll('.cal-pray-hour-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const comboKey = btn.getAttribute('data-combo-key');
                if (activePrimaryTab !== 'pray') {
                    switchPrimaryTab('pray');
                }
                selectPsalmCombination(comboKey);
                closeModal();
                setTimeout(() => {
                    const psalmsHeader = Array.from(prayerDisplay.querySelectorAll('.section-title')).find(h => h.textContent.includes('Psalms | መዝሙር ዘዳዊት'));
                    if (psalmsHeader) {
                        psalmsHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 250);
            });
        });
    } else if (actionType === 'month') {
        const currentMonthObj = ETHIOPIAN_MONTHS_INFO[eth.ethMonth - 1] || ETHIOPIAN_MONTHS_INFO[0];
        calendarInfoTitle.innerHTML = `Ethiopian Month: ${currentMonthObj.name} (${currentMonthObj.geez})`;
        const monthsRows = ETHIOPIAN_MONTHS_INFO.map(m => {
            const isCurrent = m.num === eth.ethMonth;
            return `
                <div class="cal-hour-card ${isCurrent ? 'active-hour-card' : ''}">
                    <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap;">
                        <strong>${m.num}. ${m.name} (${m.geez})</strong>
                        <span style="font-size: 0.8rem; opacity: 0.75;">${m.westernRange}</span>
                    </div>
                    <p style="margin: 0.3rem 0 0 0; font-size: 0.88rem; line-height: 1.4;">${m.meaning}</p>
                </div>
            `;
        }).join('');
        calendarInfoBody.innerHTML = `
            <p style="font-size: 0.92rem; line-height: 1.5; margin-bottom: 0.75rem;">
                The Ge'ez (Ethiopian) Calendar preserves the ancient Alexandrian solar-liturgical reckoning of <strong>13 months</strong>: twelve months of exactly <strong>30 days each</strong>, followed by <strong>Pagumen (ጳጉሜን)</strong>—a 13th month of 5 days (or 6 days in a leap year). New Year begins on <strong>Meskerem 1</strong> (September 11, or September 12 preceding a Gregorian leap year).
            </p>
            <div class="cal-hours-list">${monthsRows}</div>
        `;
    } else if (actionType === 'feast') {
        const todayFeast = ETHIOPIAN_MONTHLY_FEASTS.find(f => f.day === eth.ethDay) || ETHIOPIAN_MONTHLY_FEASTS[0];
        calendarInfoTitle.innerHTML = `Monthly Feast Days — Day ${eth.ethDay} (${eth.geezDate})`;
        const allFeastsHtml = ETHIOPIAN_MONTHLY_FEASTS.map(f => {
            const isToday = f.day === eth.ethDay;
            return `
                <div class="cal-hour-card ${isToday ? 'active-hour-card' : ''}">
                    <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 0.5rem;">
                        <strong>Day ${f.day} (${f.geezDay}) — ${f.name}</strong>
                    </div>
                    <div style="font-size: 0.85rem; opacity: 0.85; margin-top: 0.2rem;">${f.geez}</div>
                </div>
            `;
        }).join('');
        calendarInfoBody.innerHTML = `
            <div class="cal-today-feast-highlight">
                <div class="feast-icon-placeholder">
                    <span>Icon coming soon</span>
                </div>
                <div class="feast-today-details">
                    <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.8;">Today's Commemoration (${eth.monthName} ${eth.ethDay})</div>
                    <h4 style="margin: 0.25rem 0; color: var(--primary-color);">${todayFeast.name}</h4>
                    <div style="font-size: 0.95rem; margin-bottom: 0.35rem;">${todayFeast.geez}</div>
                    <p style="margin: 0; font-size: 0.85rem; opacity: 0.85;">You may remember today's saint(s) and feast in your personal supplications and intercessions.</p>
                </div>
            </div>
            <h4 style="margin: 1rem 0 0.5rem 0;">All 30 Monthly Commemorations (ወርኃዊ በዓላት)</h4>
            <div class="cal-hours-list">${allFeastsHtml}</div>
        `;
    } else if (actionType === 'year') {
        calendarInfoTitle.innerHTML = `${eth.ethYear} Year of Mercy (ዓመተ ምሕረት)`;
        calendarInfoBody.innerHTML = `
            <div class="cal-hour-card active-hour-card" style="margin-bottom: 0.85rem;">
                <strong>Current Liturgical Year: ${eth.ethYear} Amete Mihret (${eth.geezYear} ዓ.ም.)</strong>
                <div style="margin-top: 0.3rem; font-size: 0.9rem;">
                    • <strong>Evangelist of the Year:</strong> ${eth.evangelist.name} (${eth.evangelist.geez})<br>
                    • <strong>Amete Alem (Era of the World):</strong> ${eth.ameteAlem} A.A. (5500 years before Christ + ${eth.ethYear})
                </div>
            </div>
            <p style="font-size: 0.92rem; line-height: 1.55;">
                <strong>What does "Year of Mercy" (ዓመተ ምሕረት / Amete Mihret) mean?</strong><br>
                <em>Amete Mihret</em> literally translates to <strong>"Year of Mercy"</strong> (referencing Isaiah 61:2 and Luke 4:19, <em>"to proclaim the acceptable year of the Lord"</em>). While before the Incarnation of Christ humanity counted 5,500 years of <em>Amete Alem</em> / <em>Amete Fida</em> (Years of Judgment/Debt), from the saving Incarnation of Our Lord Jesus Christ we count the <strong>Years of Mercy</strong>.
            </p>
            <p style="font-size: 0.92rem; line-height: 1.55;">
                <strong>Why is the Ethiopian Calendar 7–8 years behind the Western Calendar?</strong><br>
                The Ethiopian Orthodox Tewahedo Church preserves the ancient Alexandrian calculation of Julius Africanus and Annianus of Alexandria, which places the Annunciation and Incarnation of Christ 7 to 8 years later than the calculation revised in 525 AD by the Roman monk Dionysius Exiguus (which became the Western Gregorian calendar). Because the Ethiopian New Year begins in September (Meskerem 1), the difference is <strong>7 years</strong> from September 11 to December 31, and <strong>8 years</strong> from January 1 to September 10.
            </p>
            <p style="font-size: 0.92rem; line-height: 1.55;">
                <strong>The Four-Year Evangelist Cycle:</strong><br>
                Each year in the 4-year cycle is dedicated to one of the four Gospel writers in canonical order: <strong>Matthew (ማቴዎስ)</strong>, <strong>Mark (ማርቆስ)</strong>, <strong>Luke (ሉቃስ)</strong>, and <strong>John (ዮሐንስ)</strong>. Every fourth year—the Year of St. Luke—adds a 6th day to Pagumen.
            </p>
        `;
    }

    const wipDisclaimerHtml = `
        <div class="calendar-modal-wip-badge" style="background: rgba(218, 165, 32, 0.12); border: 1px dashed var(--accent-color); border-radius: 6px; padding: 0.5rem 0.75rem; margin-bottom: 0.85rem; font-size: 0.82rem; line-height: 1.4; color: var(--text-color); display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.1rem; flex-shrink: 0;">⚠️</span>
            <span><strong>Work in Progress:</strong> The contents and explanations in this guide are actively being curated and are currently incomplete.</span>
        </div>
    `;
    calendarInfoBody.insertAdjacentHTML('afterbegin', wipDisclaimerHtml);

    openModal(calendarInfoModal);
}

function getUniversalEpistleAuthor(langKey) {
    const currentRef = kidaseLectionaryRefs.universal || "1 Peter 1:1-End";
    const match = currentRef.match(/^(.+?)\s+\d+:/);
    const book = match ? match[1].trim() : "1 Peter";

    let authorKey = 'Peter';
    if (book === 'James') {
        authorKey = 'James';
    } else if (book === '1 Peter' || book === '2 Peter') {
        authorKey = 'Peter';
    } else if (book === '1 John' || book === '2 John' || book === '3 John' || book === 'Revelation') {
        authorKey = 'John';
    } else if (book === 'Jude') {
        authorKey = 'Jude';
    }

    const AUTHORS = {
        James: {
            english: 'James',
            geez_script: 'ያዕቆብ',
            geez_phonetic: "Yā'iḳob",
            amharic_script: 'ያዕቆብ',
            amharic_phonetic: "Yā'iḳob",
            tigrinya_script: 'ያዕቆብ',
            tigrinya_phonetic: "Yā'iḳob",
            spanish: 'Santiago',
            spanish_pr: 'Santiago',
            french: 'Jacques',
            arabic: 'يعقوب',
            greek: 'Ιακώβου',
            hebrew: 'יעקב',
            malayalam: 'യാക്കോബ്'
        },
        Peter: {
            english: 'Peter',
            geez_script: 'ጴጥሮስ',
            geez_phonetic: "Péṭros",
            amharic_script: 'ጴጥሮስ',
            amharic_phonetic: "Péṭros",
            tigrinya_script: 'ጴጥሮስ',
            tigrinya_phonetic: "Péṭros",
            spanish: 'Pedro',
            spanish_pr: 'Pedro',
            french: 'Pierre',
            arabic: 'بطرس',
            greek: 'Πέτρου',
            hebrew: 'פטרוס',
            malayalam: 'പത്രോസ്'
        },
        John: {
            english: 'John',
            geez_script: 'ዮሐንስ',
            geez_phonetic: 'Yōḥannes',
            amharic_script: 'ዮሐንስ',
            amharic_phonetic: 'Yōḥannes',
            tigrinya_script: 'ዮሐንስ',
            tigrinya_phonetic: 'Yōḥannes',
            spanish: 'Juan',
            spanish_pr: 'Juan',
            french: 'Jean',
            arabic: 'يوحنا',
            greek: 'Ιωάννη',
            hebrew: 'יוחנן',
            malayalam: 'യോഹന്നാൻ'
        },
        Jude: {
            english: 'Jude',
            geez_script: 'ይሁዳ',
            geez_phonetic: 'Yhuda',
            amharic_script: 'ይሁዳ',
            amharic_phonetic: 'Yhuda',
            tigrinya_script: 'ይሁዳ',
            tigrinya_phonetic: 'Yhuda',
            spanish: 'Judas',
            spanish_pr: 'Judas',
            french: 'Jude',
            arabic: 'يهوذا',
            greek: 'Ιούዳ',
            hebrew: 'יהודה',
            malayalam: 'യൂദാ'
        }
    };

    const authorObj = AUTHORS[authorKey] || AUTHORS.Peter;
    return authorObj[langKey] || authorObj.english;
}

function getGospelAuthor(langKey, lectionaryKey = 'gospel') {
    const currentRef = kidaseLectionaryRefs[lectionaryKey] || "Matthew 1:1-End";
    const match = currentRef.match(/^(.+?)\s+\d+:/);
    const book = match ? match[1].trim() : "Matthew";

    let authorKey = 'Matthew';
    if (book.includes('Mark')) authorKey = 'Mark';
    else if (book.includes('Luke')) authorKey = 'Luke';
    else if (book.includes('John')) authorKey = 'John';

    const AUTHORS = {
        Matthew: {
            english: 'Matthew',
            geez_script: 'ማቴዎስ',
            geez_phonetic: 'Mātéwos',
            amharic_script: 'ማቴዎስ',
            amharic_phonetic: 'Mātéwos',
            tigrinya_script: 'ማቴዎስ',
            tigrinya_phonetic: 'Mātéwos',
            spanish: 'Mateo',
            spanish_pr: 'Mateo',
            french: 'Matthieu',
            arabic: 'متى',
            greek: 'Ματθαίον',
            hebrew: 'מתי',
            malayalam: 'മത്തായി'
        },
        Mark: {
            english: 'Mark',
            geez_script: 'ማርቆስ',
            geez_phonetic: 'Mārḳos',
            amharic_script: 'ማርቆስ',
            amharic_phonetic: 'Mārḳos',
            tigrinya_script: 'ማርቆስ',
            tigrinya_phonetic: 'Mārḳos',
            spanish: 'Marcos',
            spanish_pr: 'Marcos',
            french: 'Marc',
            arabic: 'مرقس',
            greek: 'Μάρκον',
            hebrew: 'מרקוס',
            malayalam: 'മർക്കോസ്'
        },
        Luke: {
            english: 'Luke',
            geez_script: 'ሉቃስ',
            geez_phonetic: 'Luḳās',
            amharic_script: 'ሉቃስ',
            amharic_phonetic: 'Luḳās',
            tigrinya_script: 'ሉቃስ',
            tigrinya_phonetic: 'Luḳās',
            spanish: 'Lucas',
            spanish_pr: 'Lucas',
            french: 'Luc',
            arabic: 'لوقا',
            greek: 'Loukan',
            hebrew: 'לוקס',
            malayalam: 'ലൂക്കോസ്'
        },
        John: {
            english: 'John',
            geez_script: 'ዮሐንስ',
            geez_phonetic: 'Yōḥannes',
            amharic_script: 'ዮሐንስ',
            amharic_phonetic: 'Yōḥannes',
            tigrinya_script: 'ዮሐንስ',
            tigrinya_phonetic: 'Yōḥannes',
            spanish: 'Juan',
            spanish_pr: 'Juan',
            french: 'Jean',
            arabic: 'يوحنا',
            greek: 'Ιωάννη',
            hebrew: 'יוחנן',
            malayalam: 'യോഹന്നാൻ'
        }
    };

    const authorObj = AUTHORS[authorKey] || AUTHORS.Matthew;
    return authorObj[langKey] || authorObj.english;
}

function applyParentheticalFormatting(text) {
    if (!text) return text;
    return text.replace(/\([^)]+\)/g, (match, offset, fullString) => {
        const before = fullString.substring(Math.max(0, offset - 25), offset);
        if (match === '(Mary)' && /O\s+holy\s+one\s*$/i.test(before)) {
            return match;
        }
        return `<span class="parenthetical-text">${match}</span>`;
    });
}

function formatPrayerText(text, langKey, query, isFirstLanguage, chapter = null, verseNum = null) {
    let processedText = text;

    // Apply parenthetical text formatting (greys out additional context, excluding refrain)
    processedText = applyParentheticalFormatting(processedText);

    // Replace Kidase placeholders
    processedText = replaceKidasePlaceholders(processedText, langKey, isFirstLanguage);

    // Convert bracketed verse numbers [1], [2] to superscripted tags <sup>1</sup>, <sup>2</sup>
    processedText = processedText.replace(/\[(\d+)\]/g, '<sup>$1</sup>');

    // Replace Date placeholders
    const geezDateInfo = getGeezDateInfo();
    processedText = processedText.replace(/\{\{GE'EZ MONTH\}\}/g, geezDateInfo.month);
    processedText = processedText.replace(/\{\{GE'EZ DATE\}\}/g, geezDateInfo.date);
    processedText = processedText.replace(/\{\{GE'EZ YEAR\}\}/g, geezDateInfo.year);
    processedText = processedText.replace(/\{\{ዕለት ዘሰሙን\}\}/g, geezDateInfo.dayOfWeekGeez);
    processedText = processedText.replace(/\{\{ወርኅ\}\}/g, geezDateInfo.geezMonth);
    processedText = processedText.replace(/\{\{ዕለት\}\}/g, geezDateInfo.geezDate);
    processedText = processedText.replace(/\{\{ዓመት\}\}/g, geezDateInfo.geezYear);

    // Replace Universal Epistle & Gospel Author placeholders
    if (processedText.includes('{{UNIVERSAL EPISTLE AUTHOR}}') ||
        processedText.includes('{{AUTOR DE LA EPÍSTOLA UNIVERSAL}}') ||
        processedText.includes('{{AUTEUR DE L’ÉPÎTRE UNIVERSEL}}') ||
        processedText.includes('{{مؤلف الرسالة العالمية}}') ||
        processedText.includes('{{ΣΥΓΓΡΑΦΕΑ ΠΑΓΚΟΣΜΙΩΝ ΕΠİΣΤΟΛΩΝ}}') ||
        processedText.includes('{{מחבר האיגרת האוניبرסלית}}')) {
        const universalAuthor = getUniversalEpistleAuthor(langKey);
        processedText = processedText.replace(/\{\{UNIVERSAL EPISTLE AUTHOR\}\}/gi, universalAuthor);
        processedText = processedText.replace(/\{\{AUTOR DE LA EPÍSTOLA UNIVERSAL\}\}/gi, universalAuthor);
        processedText = processedText.replace(/\{\{AUTEUR DE L’ÉPÎTRE UNIVERSEL\}\}/gi, universalAuthor);
        processedText = processedText.replace(/\{\{مؤلف الرسالة العالمية\}\}/gi, universalAuthor);
        processedText = processedText.replace(/\{\{ΣΥΓΓΡΑΦΕΑ ΠΑΓΚΟΣΜΙΩΝ ΕΠİΣΤΟΛΩΝ\}\}/gi, universalAuthor);
        processedText = processedText.replace(/\{\{מחבר האיגרת האוניبرסלית\}\}/gi, universalAuthor);
    }

    if (processedText.includes('{{GOSPEL AUTHOR}}') || processedText.includes('{{AUTOR DEL EVANGELIO}}')) {
        const gospelAuthor = getGospelAuthor(langKey, 'gospel');
        processedText = processedText.replace(/\{\{GOSPEL AUTHOR\}\}/gi, gospelAuthor);
        processedText = processedText.replace(/\{\{AUTOR DEL EVANGELIO\}\}/gi, gospelAuthor);
    }

    if (processedText.includes('{{MORNING GOSPEL AUTHOR}}') || processedText.includes('{{AUTOR DEL EVANGELIO DE LA MAÑANA}}')) {
        const morningGospelAuthor = getGospelAuthor(langKey, 'morningGospel');
        processedText = processedText.replace(/\{\{MORNING GOSPEL AUTHOR\}\}/gi, morningGospelAuthor);
        processedText = processedText.replace(/\{\{AUTOR DEL EVANGELIO DE LA MAÑANA\}\}/gi, morningGospelAuthor);
    }

    // Apply superscription formatting for Psalms, Songs of the Prophets, and Lectionary readings
    if (chapter === 'Psalms' || chapter === 'ProphetSong' || chapter === 'SeatatLectionary') {
        let displayVerseNum = verseNum;
        if (displayVerseNum && (langKey === 'geez_script' || langKey === 'geez_psalms')) {
            displayVerseNum = String(displayVerseNum).split('-').map(n => toGeezNumeral(parseInt(n, 10))).join('-');
        }
        const supTag = displayVerseNum ? `<sup>${displayVerseNum}</sup> ` : '';

        if (langKey === 'spanish' || langKey === 'spanish_pr') {
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
            // Handles nested <i> tags and stray trailing </i> tags found in some KJV data
            const nkjvSuperscriptionRegex = /^((?:<i>(?:<i>.*?<\/i>|.)*?<\/i>(?:\s*<\/i>)*\s*)+)/;
            if (Number(verseNum) === 1 && nkjvSuperscriptionRegex.test(processedText)) {
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

    // Apply Loanword Origins
    processedText = applyLoanwordOrigins(processedText, langKey);

    // Replace custom name placeholders
    processedText = processedText.replace(/\{\{Servant's Names\}\}/g, customNames.servant || '');
    processedText = processedText.replace(/\{\{(?:PATRIARCH NAME|NOMBRE DEL PATRIARCA)\}\}/gi, customNames.patriarch || '');
    processedText = processedText.replace(/\{\{(?:BISHOP NAME|NOMBRE DEL OBISPO)\}\}/gi, customNames.bishop || '');
    processedText = processedText.replace(/\{\{(?:COUNTRY|PAÍS)\}\}/gi, customNames.country || '');
    processedText = processedText.replace(/\{\{Leader \/ President \/ Emperor\}\}/g, customNames.headOfState || '');
    processedText = processedText.replace(/\{\{(?:BISHOP\(S\) IN ATTENDANCE|OBISPO\(S\) PRESENTE\(S\))\}\}/gi, customNames.attendingBishops || '');
    processedText = processedText.replace(/\{\{(?:CHURCH NAME|NOMBRE DE LA IGLESIA)\}\}/gi, customNames.churchName || '');

    // Format enclosed prayer titles / references on their own line (e.g. ፨ THE SALUTATION OF SAINT GABRIEL ፨ or (Psalms 117:1))
    const innerTitleRegex = /^\s*(?:<[^>]+>)*\s*(?:(፨\s*[^፨\n\r]+?\s*፨)|(\({1,2}\s*[^()\n\r]+?\s*\){1,2}))\s*(?:<[^>]+>)*\s*(?:\r?\n|<br\s*\/?>|$)/i;
    if (innerTitleRegex.test(processedText)) {
        processedText = processedText.replace(innerTitleRegex, (match, titleMatch1, titleMatch2) => {
            const titleMatch = titleMatch1 || titleMatch2;
            if (displayOptions.showSpeakerLabels) {
                return `<span class="speaker-label">${titleMatch}</span><br>`;
            }
            return '';
        }).trim();
    }

    // Format standalone Scripture / Psalm headers on top line (e.g. Psalm 33:16-17 (KJV) or መዝሙር ዘዳዊት ፴፫፥፲፮-፲፯ (ግእዝ፲፱፻፹))
    const scriptureHeaderRegex = /^\s*(?:<[^>]+>)*\s*((?:Psalm|Psalms|መዝሙር|መዝሙረ|Salmo|Salmos)\s+[^<\n\r]+?\((?:KJV|NKJV|OSB|አም\d+|ግእዝ\d+|RVG|VRG|GNT)\))\s*(?:<[^>]+>)*\s*(?:\r?\n|<br\s*\/?>|$)/i;
    if (scriptureHeaderRegex.test(processedText)) {
        processedText = processedText.replace(scriptureHeaderRegex, (match, headerMatch) => {
            if (displayOptions.showSpeakerLabels) {
                return `<span class="speaker-label">${headerMatch}</span><br>`;
            }
            return '';
        }).trim();
    }

    const keywords = speakerKeywords[langKey];

    if (keywords) {
        const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);
        const escapedKeywords = sortedKeywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const keywordUnion = escapedKeywords.join('|');
        const lineStartPrefix = `(?:^|(?:\\r?\\n|<br\\s*\\/?>)\\s*)(?:(?:<span[^>]*>\\{[^}]*\\}<\\/span>|\\{[^}]*\\})\\s*)*`;
        const speakerBody = `(?:፨\\s*)?(?:${keywordUnion})(?:\\s*(?:or|and|ወይም|ወ|o|y|ou|et|\\/|-)\\s*(?:${keywordUnion}))*(?:\\s*(?:<span class="parenthetical-text">)?\\([^)]*\\)(?:<\\/span>)?)*(?:\\s*(?:<span[^>]*>)?\\{[^}]*\\}(?:<\\/span>)?)*[:፡፤፣]`;
        const explicitEthiopicPrefixSpeaker = `፨\\s*(?:${keywordUnion})(?:\\s*(?:or|and|ወይም|ወ|o|y|ou|et|\\/|-)\\s*(?:${keywordUnion}))*(?:\\s*(?:<span class="parenthetical-text">)?\\([^)]*\\)(?:<\\/span>)?)*(?:\\s*(?:<span[^>]*>)?\\{[^}]*\\}(?:<\\/span>)?)*[:፡፤፣]`;
        const regex = new RegExp(`(${lineStartPrefix})(${speakerBody})|()(${explicitEthiopicPrefixSpeaker})`, 'gi');
        processedText = processedText.replace(regex, (match, prefix1, body1, prefix2, body2) => {
            const prefix = prefix1 ?? prefix2 ?? '';
            const body = body1 || body2;
            if (displayOptions.showSpeakerLabels) {
                const cleanBody = body.replace(/<\/?span[^>]*>/g, '');
                return `${prefix}<span class="speaker-label">${cleanBody}</span>`;
            }
            return prefix;
        }).trim();
    }

    // Format instructions enclosed in triple asterisks (e.g. ***ALL SHALL NOW PROSTRATE (BOW DOWN)***)
    processedText = processedText.replace(/\*{3}\s*([^\*\n\r]+?)\s*\*{3}/g, (match) => {
        if (displayOptions.showSpeakerLabels) {
            return `<span class="speaker-label">${match}</span>`;
        }
        return '';
    });

    // Specific formatting: Place English Psalm 135, Three Holy Youth, and Praise of Mary refrains on a new line
    if ((chapter === 'Psalms' || chapter === 'ProphetSong' || chapter === 'Thurs') && langKey === 'english') {
        // Find refrains (with or without the red span) and insert a line break before them.
        // Handles "For His mercy endures forever", the Three Holy Youth variations, 
        // and "O holy one (Mary), pray for us."
        const refrainRegex = /\s*(<span class="rubric-red">)?(For His mercy|And (?:sing a hymn|let it sing a hymn)|O holy one)/gi;
        processedText = processedText.replace(refrainRegex, (match) => {
            return '<br>' + match.trim();
        });
    }

    return highlightText(processedText, query);
}

function getPrayerLabel(prayer, isKidase = false) {
    // Detect Kidase prayers (Liturgy)
    const kidaseChapters = ['Kidan', 'order', 'Apostles', 'St.Mary', 'Chrysostom', 'The300', 'mary', 'apostles'];
    const chapter = prayer.chapter || '';
    const isNumericChapter = /^\d+$/.test(chapter);
    const isKidaseChapter = isKidase || isNumericChapter || kidaseChapters.some(c => c.toLowerCase() === chapter.toLowerCase());

    if (isKidaseChapter && (chapter || prayer.stanza)) {
        let chapterPrefix = chapter;
        if (isNumericChapter) {
            chapterPrefix = chapter; // Keep number as per user request
        } else if (chapter.toLowerCase() === 'st.mary' || chapter.toLowerCase() === 'mary') {
            chapterPrefix = 'Mary';
        } else if (chapter.toLowerCase() === 'apostles') {
            chapterPrefix = 'Apostles';
        } else if (!chapter && isKidase) {
            chapterPrefix = 'Liturgy';
        }

        const source = prayer.stanza ? `${chapterPrefix}-${prayer.stanza}` : chapterPrefix;
        const reference = (prayer.reference && prayer.reference.trim() && prayer.reference.trim().toLowerCase() !== 'n/a') ? prayer.reference.trim() : "";
        const rawInstruction = (prayer.instruction && prayer.instruction.trim() && prayer.instruction.trim().toLowerCase() !== 'n/a') ? prayer.instruction.trim() : "";
        const instruction = rawInstruction.includes("ALL SHALL STAND IN THE FEAR OF GOD") ? "" : rawInstruction;

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
        "Daily-11": "→ Prayer of Saint Ephraim: The Praises of Mary | ውዳሴ ማርያም",
        "Daily-12": "→ Prayer of Saint Ephraim: The Praises of Mary | ውዳሴ ማርያም - O my Lady, loose me...",
        "Personal-0": "Prayer"
    };

    const dayTitles = {
        'Sun': '→ → → Sunday | ዘእሁድ',
        'Mon': '→ → → Monday | ዘሰኑይ',
        'Tue': '→ → → Tuesday | ዘሠሉስ',
        'Wed': '→ → → Wednesday | ዘረቡዕ',
        'Thurs': '→ → → Thursday | ዘሐሙስ',
        'Fri': '→ → → Friday | ዘዓርብ',
        'Sat': '→ → → Saturday | ዘቀዳሚት'
    };

    if (customLabels[prayerKey]) {
        return customLabels[prayerKey];
    } else if (prayer.chapter === 'SeatatLectionary' || prayer.chapter === 'DailyLectionary') {
        return prayer.reference || '';
    } else if (dayTitles[prayer.chapter]) {
        return dayTitles[prayer.chapter];
    } else if (prayer.chapter === 'Angels') {
        return '→ Prayer of Abba Giyorgis: The Angels Praise Mary | ይዌድስዋ መላእክት ለማርያም';
    } else if (prayer.chapter === 'Anqetse Birhan') {
        return '→ Prayer of Saint Yared: The Gate of Light | አንቀጸ ብርሃን';
    } else if (prayer.chapter === 'Psalms' && prayer.stanza === 'Intro') {
        return '→ Opening Prayer | ነዓ ኀቤየ ዳዊት';
    } else if (prayer.chapter === 'Psalms' && prayer.stanza === 'Closing') {
        return '→ Closing Prayer | ሰአሊ ለነ ማርያም';
    }
    return prayer.reference; // Default fallback
}

function getSectionTitle(prayer) {
    const label = getPrayerLabel(prayer);
    if (label.startsWith("Daily Prayer | ዘዘወትር ጸሎት - ")) {
        return "Daily Prayer | ዘዘወትር ጸሎት";
    } else if (label === "Trinitarian Invocation") {
        return "";
    } else if (label.startsWith("→ Prayer of Saint Ephraim: The Praises of Mary | ውዳሴ ማርያም") && (selectedWidaseMaryamDay === 'None')) {
        // Hide the section title if None is selected
        return "";
    }
    return label.replace(/ - .*/, '');
}

function hasActualContent(text, langKey) {
    if (!text || !text.trim()) return false;

    // If it contains a placeholder, it has content
    if (text.includes('{{') && text.includes('}}')) return true;

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

function isChantStanza(prayer) {
    if (!prayer) return false;

    const PEOPLE_LABEL_REGEX = /^(?:፨\s*)?(?:People|ALL|All|Pueblo|Todos|Gente|ሕዝብ|ኵሎሙ|ሁሉም|ኩሉኹም|Ḥizb|Hizb|Kwllomu|Kullomu|Kwlomu|Hizbi|Ḥizbi|(?:Priest|Asst\.\s*Priest|Deacon|Subdeacon|Leader|Reader|Bridegroom|Bride|ካህን|ካህን\s*ንፍቅ|ዲያቆን|ንፍቀ\s*ዲያቆን|መሪሕ|መሪ|መራሒ|አንባቢ|ነባቢ|ሙሽራው|ሙሽራዋ|መርዓዊ|መርዓት|Sacerdote|Diácono|Subdiácono|Líder|Lector|Novio|Novia|Merīḥ|Meriḥ|Merih|Kahn|Kahin|Diyakon|Dīyakon|Meraḥi|Meraḥī)\s*\([^)]*(?:People|repeat|ከምኡ|ይበሉ|መልሰው|repite|kem'u)[^)]*\))(?:\s*\([^)]*\))?[:፡።፤፣]/i;

    for (const langKey of ['english', 'geez_script', 'amharic_script', 'tigrinya_script', 'spanish', 'spanish_pr', 'geez_phonetic']) {
        if (prayer[langKey]) {
            const lines = prayer[langKey].split(/(?:<br\s*\/?>|\n)+/);
            for (let line of lines) {
                if (PEOPLE_LABEL_REGEX.test(line.trim())) {
                    return true;
                }
            }
        }
    }
    return false;
}

function filterGeezPhoneticForPeople(phoneticText, prayer) {
    if (!phoneticText || !phoneticText.trim()) return '';

    const INNER_TITLE_LINE_REGEX = /^\s*(?:፨\s*[^፨\n\r]+?\s*፨|\({1,2}\s*[^()\n\r]+?\s*\){1,2})\s*$/i;
    const PEOPLE_LABEL_REGEX = /^(?:፨\s*)?(?:People|ALL|All|Pueblo|Todos|Gente|ሕዝብ|ኵሎሙ|ሁሉም|ኩሉኹም|Ḥizb|Hizb|Kwllomu|Kullomu|Kwlomu|Hizbi|Ḥizbi|(?:Priest|Asst\.\s*Priest|Deacon|Subdeacon|Leader|Reader|Bridegroom|Bride|ካህን|ካህን\s*ንፍቅ|ዲያቆን|ንፍቀ\s*ዲያቆን|መሪሕ|መሪ|መራሒ|አንባቢ|ነባቢ|ሙሽራው|ሙሽራዋ|መርዓዊ|መርዓት|Sacerdote|Diácono|Subdiácono|Líder|Lector|Novio|Novia|Merīḥ|Meriḥ|Merih|Kahn|Kahin|Diyakon|Dīyakon|Meraḥi|Meraḥī)\s*\([^)]*(?:People|repeat|ከምኡ|ይበሉ|መልሰው|repite|kem'u)[^)]*\))(?:\s*\([^)]*\))?[:፡።፤፣]/i;
    const LEADER_LABEL_REGEX = /^(?:፨\s*)?(?:Priest|Asst\.\s*Priest|Deacon|Subdeacon|Leader|Reader|Bridegroom|Bride|ካህን|ካህን\s*ንፍቅ|ዲያቆን|ንፍቀ\s*ዲያቆን|መሪሕ|መሪ|መራሒ|አንባቢ|ነባቢ|ሙሽራው|ሙሽራዋ|መርዓዊ|መርዓት|Sacerdote|Diácono|Subdiácono|Líder|Lector|Novio|Novia|Merīḥ|Meriḥ|Merih|Kahn|Kahin|Diyakon|Dīyakon|Meraḥi|Meraḥī)(?:\s*\([^)]*\))?[:፡።፤፣]/i;

    const filterTitleLines = (text) => {
        if (!text) return [];
        return text.split(/(?:<br\s*\/?>|\n)+/).map(p => p.trim()).filter(p => p && !INNER_TITLE_LINE_REGEX.test(p));
    };

    // Filter out top inner title/reference header lines first across all language paragraph lists for index alignment
    const paragraphs = filterTitleLines(phoneticText);
    if (paragraphs.length === 0) return '';

    const checkStringForLeader = (str) => {
        if (!str) return false;
        const lines = filterTitleLines(str);
        return lines.some(line => LEADER_LABEL_REGEX.test(line));
    };
    const hasLeaderLabel = checkStringForLeader(phoneticText) ||
                           checkStringForLeader(prayer?.geez_script) ||
                           checkStringForLeader(prayer?.english) ||
                           checkStringForLeader(prayer?.amharic_script);

    // If there is no leader label anywhere in the card, return all non-title paragraphs
    if (!hasLeaderLabel) {
        const delimiter = phoneticText.includes('<br>') ? '<br><br>' : '\n\n';
        return paragraphs.join(delimiter);
    }

    const geezScriptParagraphs = filterTitleLines(prayer?.geez_script);
    const englishParagraphs = filterTitleLines(prayer?.english);
    const amharicParagraphs = filterTitleLines(prayer?.amharic_script);

    const keptParagraphs = [];
    let currentSpeakerIsPeople = false;

    paragraphs.forEach((para, index) => {
        const trimmedPara = para.trim();
        if (!trimmedPara) return;

        const geezPara = (geezScriptParagraphs[index] || '').trim();
        const engPara = (englishParagraphs[index] || '').trim();
        const amhPara = (amharicParagraphs[index] || '').trim();

        if (PEOPLE_LABEL_REGEX.test(trimmedPara) || PEOPLE_LABEL_REGEX.test(geezPara) || PEOPLE_LABEL_REGEX.test(engPara) || PEOPLE_LABEL_REGEX.test(amhPara)) {
            currentSpeakerIsPeople = true;
        } else if (LEADER_LABEL_REGEX.test(trimmedPara) || LEADER_LABEL_REGEX.test(geezPara) || LEADER_LABEL_REGEX.test(engPara) || LEADER_LABEL_REGEX.test(amhPara)) {
            currentSpeakerIsPeople = false;
        }

        if (currentSpeakerIsPeople) {
            keptParagraphs.push(para);
        }
    });

    // Deduplicate identical People phonetic responses (e.g. repeated "Amen" / "፨ ḥzb: 'amén.")
    const uniqueParagraphs = [];
    const seenNormalized = new Set();

    keptParagraphs.forEach(para => {
        const norm = para.replace(/<[^>]*>?/g, '')
                        .replace(PEOPLE_LABEL_REGEX, '')
                        .replace(/[^a-zA-Z'ĀāĒēĪīŌōŪū\u1200-\u137F0-9]/g, '')
                        .trim()
                        .toLowerCase();

        if (!norm || !seenNormalized.has(norm)) {
            if (norm) seenNormalized.add(norm);
            uniqueParagraphs.push(para);
        }
    });

    const delimiter = phoneticText.includes('<br>') ? '<br><br>' : '\n\n';
    return uniqueParagraphs.join(delimiter);
}

function createPrayerCardElement(prayer, prayerIndex, isKidase = false) {
    const searchQuery = searchInput.value;

    const kidaseChapters = ['Kidan', 'order', 'Apostles', 'St.Mary', 'Chrysostom', 'The300', 'mary', 'apostles'];
    const chapterStr = prayer.chapter || '';
    const isNumericChapter = /^\d+$/.test(chapterStr);
    const isKidaseCard = isKidase || isNumericChapter || kidaseChapters.some(c => c.toLowerCase() === chapterStr.toLowerCase());

    const isTheotokiaPlaceholderEligible = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Anqetse Birhan', 'Angels'].includes(prayer.chapter);

    const getCardLangText = (langKey) => {
        if (!isKidaseCard && langKey === 'spanish_pr') {
            return prayer.spanish_pr || prayer.spanish;
        }
        const val = prayer[langKey];
        if (langKey === 'english' && isTheotokiaPlaceholderEligible && (!val || !val.trim())) {
            return '<i class="coming-soon-placeholder">English coming soon</i>';
        }
        return val;
    };

    // Filter languages that actually have content for THIS specific card
    let seenNonKidaseSpanish = false;
    const languagesToDisplay = languageOrder.filter(langKey => {
        const langCfg = LANGUAGE_REGISTRY[langKey] || { name: langKey, isAuto: false, category: 'main' };

        // Basic global visibility checks
        if (!displayedLanguages[langKey]) return false;
        if (langCfg.category === 'unofficial' && !isScribeLoggedIn) return false;

        const rawCardText = getCardLangText(langKey);
        if (!rawCardText || !rawCardText.trim()) return false;

        // Smart content check: hide if it ONLY contains speaker keywords
        if (!hasActualContent(rawCardText, langKey)) return false;

        // For non-Kidase prayers, deduplicate if both Spanish options are enabled
        if (!isKidaseCard && (langKey === 'spanish' || langKey === 'spanish_pr')) {
            if (seenNonKidaseSpanish) return false;
            seenNonKidaseSpanish = true;
        }

        return true;
    });

    const cardVisibleLanguageCount = languagesToDisplay.length;

    const prayerCard = document.createElement('div');
    prayerCard.classList.add('prayer-card');
    prayerCard.dataset.prayerIndex = prayerIndex;

    // Store card identity for cross-card navigation (e.g. creed jump buttons)
    if (prayer.chapter && prayer.stanza) {
        prayerCard.dataset.cardId = `${prayer.chapter}-${prayer.stanza}`;
    } else if (prayer.chapter && prayer.verseNum) {
        prayerCard.dataset.cardId = `${prayer.chapter}-${prayer.verseNum}`;
    } else if (prayer.reference) {
        prayerCard.dataset.cardId = prayer.reference;
    }

    // Unique prayer signature for exact 1-to-1 card matching between scroll and slides mode
    const sigText = (prayer.english || prayer.geez_script || prayer.amharic_script || '').replace(/\s+/g, ' ').trim().slice(0, 50);
    prayerCard.dataset.prayerSignature = `${prayer.chapter || ''}_${prayer.stanza || ''}_${prayer.verseNum || ''}_${sigText}`;

    // Handle initial collapse state (from renderPrayers context)
    // IMPORTANT: Do not hide cards in slides mode even if the section is collapsed
    if (window.isRenderingCollapsed && displayOptions.presentationMode !== 'slides') {
        prayerCard.style.display = 'none';
    }

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
            window.openScribeEditor(prayer);
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
        langSection.classList.add('language-section', `lang-${langKey}`);
        if (langKey.includes('phonetic')) {
            langSection.classList.add('lang-phonetic');
        }

        const langHeader = document.createElement('h4');
        let labelText = langCfg.name.replace(/\*+$/, '');
        if (!isKidaseCard && (langKey === 'spanish' || langKey === 'spanish_pr')) {
            labelText = 'Español (Spanish)';
        }

        let isOfficial;
        if (prayer[`${langKey}_is_official`] !== undefined) {
            isOfficial = prayer[`${langKey}_is_official`];
        } else if (langKey === 'spanish' || langKey === 'french') {
            isOfficial = !isKidaseCard;
        } else {
            isOfficial = !langCfg.isAuto;
        }

        if (!isOfficial) {
            if (labelText.endsWith(')')) {
                labelText = labelText.slice(0, -1) + ', Unofficial Translation)';
            } else {
                labelText += ' (Unofficial Translation)';
            }
        }

        langHeader.textContent = labelText;

        // Force header visibility for Spanish and French in Kidase prayers regardless of setting
        const isForcedKidaseLabel = isKidaseCard && (langKey === 'spanish' || langKey === 'french');
        if (!displayOptions.showLanguageLabels && !isForcedKidaseLabel) langHeader.classList.add('hidden');

        const langText = document.createElement('p');
        langText.classList.add('language-text');

        let content = formatPrayerText(getCardLangText(langKey), langKey, searchQuery, isFirstLanguage, prayer.chapter, prayer.verseNum);

        // Append Ge'ez Phonetics to Ge'ez Script if setting is active and this is a chant
        if (langKey === 'geez_script' && displayOptions.showGeezPhoneticChants && isChantStanza(prayer)) {
            const rawPhoneticText = prayer['geez_phonetic'];
            if (rawPhoneticText && rawPhoneticText.trim()) {
                const phoneticText = filterGeezPhoneticForPeople(rawPhoneticText, prayer);
                if (phoneticText && phoneticText.trim()) {
                    const formattedPhonetic = formatPrayerText(phoneticText, 'geez_phonetic', searchQuery, false, prayer.chapter, prayer.verseNum);
                    content += `<br><i class="geez-phonetic-append">${formattedPhonetic}</i>`;
                }
            }
        }

        langText.innerHTML = content;

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
    prayerLabel.textContent = (getPrayerLabel(prayer, isKidase) || '').replace(/→\s*/g, '');
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
        const signature = clickedCard.dataset.prayerSignature;
        const cardId = clickedCard.dataset.cardId;
        const prayerIdx = clickedCard.dataset.prayerIndex;
        const readingType = clickedCard.dataset.readingType;
        togglePresentationMode({ signature, cardId, prayerIndex: prayerIdx, readingType });
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
    const isKidaseChapter = /^\d+$/.test(prayer.chapter) || ['Kidan', 'order', 'Apostles', 'St.Mary', 'Chrysostom', 'The300', 'mary', 'apostles'].some(c => c.toLowerCase() === (prayer.chapter || '').toLowerCase());
    const isKidasePrayer = isKidase || (isKidaseChapter && prayer.chapter && prayer.stanza);

    if (!isKidasePrayer || prayer._isMiracle) {
        if (prayer.reference) {
            infoHTML = `<p><strong>Reference:</strong> ${prayer.reference}</p>`;
        }
        if (prayer.instruction && prayer.instruction.trim().toLowerCase() !== 'n/a') {
            infoHTML += `<p><strong>Instruction:</strong> ${prayer.instruction}</p>`;
        }
        if (prayer._isMiracle && prayer._miracleData) {
            infoHTML += `<p><strong>Citation:</strong> Princeton Ethiopian, Eritrean, and Egyptian Miracles of Mary (PEMM) Project.</p>`;
            if (prayer._miracleData.incipit) {
                infoHTML += `<p><strong>Ge'ez Incipit:</strong> <span class="geez-font">${prayer._miracleData.incipit}</span></p>`;
            }
        }
    }

    infoPanelContent.innerHTML = infoHTML;
    infoPanel.appendChild(infoPanelContent);
    prayerCard.appendChild(infoPanel);

    infoToggle.addEventListener('click', () => infoPanel.classList.toggle('active'));

    return prayerCard;
}


function getSupplicatoryPrayers() {
    return [
        {
            instruction: "Repeated 3 times.",
            reference: "Supplications | ምሕላ",
            chapter: "Supplications",
            stanza: "1",
            geez_script: "መሪሕ: እግዚኦ መሐረነ ክርስቶስ<br><br>፨ ሕዝብ: እግዚኦ መሐረነ ክርስቶስ (፫)",
            geez_phonetic: "Merīḥ: 'Igzī'o meḥarene Krstos<br><br>፨ Ḥizb: 'Igzī'o meḥarene Krstos (3x)",
            english: "Leader: O Lord, have compassion upon us, O Christ.<br><br>፨ People: O Lord, have compassion upon us, O Christ. (3x)",
            amharic_script: "መሪ: አቤቱ ክርስቶስ ሆይ ማረን።<br><br>፨ ሕዝብ: አቤቱ ክርስቶስ ሆይ ማረን። (፫)",
            tigrinya_script: "መራሒ: ጐይታይ ክርስቶስ መሓረና።<br><br>፨ ሕዝብ: ጐይታይ ክርስቶስ መሓረና። (፫)"
        },
        {
            instruction: "Repeated 3 times.",
            reference: "Supplications | ምሕላ",
            chapter: "Supplications",
            stanza: "2",
            geez_script: "መሪሕ: በእንተ ማርያም መሐረነ ክርስቶስ<br><br>፨ ሕዝብ: በእንተ ማርያም መሐረነ ክርስቶስ (፫)",
            geez_phonetic: "Merīḥ: Be'inte Maryam meḥarene Krstos<br><br>፨ Ḥizb: Be'inte Maryam meḥarene Krstos (3x)",
            english: "Leader: For the sake of Mary, have compassion upon us, O Christ.<br><br>፨ People: For the sake of Mary, have compassion upon us, O Christ. (3x)",
            amharic_script: "መሪ: ስለ ማርያም ብለህ ክርስቶስ ሆይ ማረን።<br><br>፨ ሕዝብ: ስለ ማርያም ብለህ ክርስቶስ ሆይ ማረን። (፫)",
            tigrinya_script: "መራሒ: ምእንቲ ማርያም ኢልካ ክርስቶስ መሓረና።<br><br>፨ ሕዝብ: ምእንቲ ማርያም ኢልካ ክርስቶስ መሓረና። (፫)"
        },
        {
            instruction: "Repeated 3 times.",
            reference: "Supplications | ምሕላ",
            chapter: "Supplications",
            stanza: "3",
            geez_script: "መሪሕ: ኪርያላይሶን<br><br>፨ ሕዝብ: ኪርያላይሶን (፫)",
            geez_phonetic: "Merīḥ: Kīryalayson<br><br>፨ Ḥizb: Kīryalayson (3x)",
            english: "Leader: Lord, have mercy.<br><br>፨ People: Lord, have mercy. (3x)",
            amharic_script: "መሪ: ጌታ ሆይ ማረን (ኪርያላይሶን)።<br><br>፨ ሕዝብ: ጌታ ሆይ ማረን (ኪርያላይሶን)። (፫)",
            tigrinya_script: "መራሒ: ጐይታይ መሓረና (ኪርያላይሶን)።<br><br>፨ ሕዝብ: ጐይታይ መሓረና (ኪርያላይሶን)። (፫)"
        },
        {
            instruction: "Repeated 3 times.",
            reference: "Supplications | ምሕላ",
            chapter: "Supplications",
            stanza: "4",
            geez_script: "መሪሕ: ኦ አምላክ<br><br>፨ ሕዝብ: ኦ አምላክ (፫)",
            geez_phonetic: "Merīḥ: 'O 'Amlak<br><br>፨ Ḥizb: 'O 'Amlak (3x)",
            english: "Leader: O God.<br><br>፨ People: O God. (3x)",
            amharic_script: "መሪ: አምላክ ሆይ።<br><br>፨ ሕዝብ: አምላክ ሆይ። (፫)",
            tigrinya_script: "መራሒ: ኦ ኣምላኽ።<br><br>፨ ሕዝብ: ኦ ኣምላኽ። (፫)"
        },
        {
            instruction: "Repeated 3 times.",
            reference: "Supplications | ምሕላ",
            chapter: "Supplications",
            stanza: "5",
            geez_script: "መሪሕ: ኦ ክርስቶስ<br><br>፨ ሕዝብ: ኦ ክርስቶስ (፫)",
            geez_phonetic: "Merīḥ: 'O Krstos<br><br>፨ Ḥizb: 'O Krstos (3x)",
            english: "Leader: O Christ.<br><br>፨ People: O Christ. (3x)",
            amharic_script: "መሪ: ክርስቶስ ሆይ።<br><br>፨ ሕዝብ: ክርስቶስ ሆይ። (፫)",
            tigrinya_script: "መራሒ: ኦ ክርስቶስ።<br><br>፨ ሕዝብ: ኦ ክርስቶስ። (፫)"
        },
        {
            instruction: "Repeated 3 times.",
            reference: "Supplications | ምሕላ",
            chapter: "Supplications",
            stanza: "6",
            geez_script: "መሪሕ: ያድኅነነ እመዓቱ ይሰውረነ በምሕረቱ በእንተ ማርያም ወላዲቱ<br><br>፨ ሕዝብ: ያድኅነነ እመዓቱ ይሰውረነ በምሕረቱ በእንተ ማርያም ወላዲቱ (፫)",
            geez_phonetic: "Merīḥ: Yadḥnene 'ime'atu, yisewrene bemiḥretu, be'inte Maryam weladītu.<br><br>፨ Ḥizb: Yadḥnene 'ime'atu, yisewrene bemiḥretu, be'inte Maryam weladītu. (3x)",
            english: "Leader: May He save us from His wrath and shield us with His mercy, for the sake of Mary, His mother.<br><br>፨ People: May He save us from His wrath and shield us with His mercy, for the sake of Mary, His mother. (3x)",
            amharic_script: "መሪ: ከቁጣው ያድነን፣ በምሕረቱ ይሰውረን፣ ስለ ወለደችው ስለ ማርያም።<br><br>፨ ሕዝብ: ከቁጣው ያድነን፣ በምሕረቱ ይሰውረን፣ ስለ ወለደችው ስለ ማርያም። (፫)",
            tigrinya_script: "መራሒ: ካብ ቚጥዓኡ የድሕነና፡ ብምሕረቱ ይሰውረና፡ ምእንቲታ ዝወለደቶ ማርያም።<br><br>፨ ሕዝብ: ካብ ቚጥዓኡ የድሕነና፡ ብምሕረቱ ይሰውረና፡ ምእንቲታ ዝወለደቶ ማርያም። (፫)"
        },
        {
            instruction: "Repeated 3 times.",
            reference: "Supplications | ምሕላ",
            chapter: "Supplications",
            stanza: "7",
            geez_script: "መሪሕ: ስማዐነ አምላክነ ወመድኃኒነ<br><br>፨ ሕዝብ: ስማዐነ አምላክነ ወመድኃኒነ (፫)",
            geez_phonetic: "Merīḥ: Sma'ane 'Amlakine wemedḥanīne.<br><br>፨ Ḥizb: Sma'ane 'Amlakine wemedḥanīne. (3x)",
            english: "Leader: Hear us, our God and our Savior.<br><br>፨ People: Hear us, our God and our Savior. (3x)",
            amharic_script: "መሪ: አምላካችንና መድኃኒታችን ሆይ ስማን።<br><br>፨ ሕዝብ: አምላካችንና መድኃኒታችን ሆይ ስማን። (፫)",
            tigrinya_script: "መራሒ: ኣምላኽናን መድሓኒናን ስምዓና።<br><br>፨ ሕዝብ: ኣምላኽናን መድሓኒናን ስምዓና። (፫)"
        },
        {
            instruction: "",
            reference: "Supplications | ምሕላ",
            chapter: "Supplications",
            stanza: "8",
            geez_script: "፨ ኵሎሙ: ሰአሊ ለነ ማርያም ምሕረተ ወልድኪ የሐውጸነ እምአርያም።",
            geez_phonetic: "፨ Kwllomu: Se'alī lene Maryam mḥrete weldkī yeḥewtsene 'im'aryam.",
            english: "፨ ALL: Pray for us, Mary, that the mercy of your Son may visit us from the highest heaven.",
            amharic_script: "፨ ሁሉም: ማርያም ሆይ ለምኚልን፣ የልጅሽ ምሕረት ከአርያም ይጎበኘን ዘንድ።",
            tigrinya_script: "፨ ኩሉኹም: ማርያም ለምንልና፡ ምሕረት ወድኺ ካብ ኣርያም ምእንቲ ክበጽሓና።"
        },
        {
            instruction: "",
            reference: "Supplications | ምሕላ",
            chapter: "Supplications",
            stanza: "9",
            geez_script: "፨ ኵሎሙ: ሰአሊ ለነ ማርያም ለለሰዓቱ፣ ተግባረ እደዊሁ ለወልድኪ ኢንጥፋእ በከንቱ።",
            geez_phonetic: "፨ Kwllomu: Se'alī lene Maryam lelese'atu, tigbare 'idewīhu leweldkī īnṭfa' bekentu.",
            english: "፨ ALL: Pray for us, Mary, at every hour, that we, the work of your Son's hands, may not perish in vain.",
            amharic_script: "፨ ሁሉም: ማርያም ሆይ በየሰዓቱ ለምኚልን፣ የልጅሽ የእጆቹ ሥራ የሆንን እኛ በከንቱ እንዳንጠፋ።",
            tigrinya_script: "፨ ኩሉኹም: ማርያም ኣብ ኵሉ ሰዓት ለምንልና፡ ንሕና ግብሪ ኣእዳው ወድኺ ዝኾንና ብኸንቱ ምእንቲ ኸይነጥፍእ።"
        },
        {
            instruction: "",
            reference: "Supplications | ምሕላ",
            chapter: "Supplications",
            stanza: "10",
            geez_script: "፨ ኵሎሙ: ኵሎ መዓልተ ወኵሎ ሌሊተ ብዙኃ ኃጢአተ ዘገበርነ፣ በእንተ ማርያም እምከ ተማኅፀነ። ስምዐነ እግዚኦ ከመ ታድኅነነ።",
            geez_phonetic: "፨ Kwllomu: Kwllo me'alte wekwllo lēlīte bizuḫa ḫaṭī'ate zegeberne, be'inte Maryam 'imike temaḫtsenne. Sim'ane 'Igzī'o keme tadḥnene.",
            english: "፨ ALL: All day and all night, the many sins we have committed, for the sake of Mary Your mother we take refuge. Hear us, O Lord, that You may save us.",
            amharic_script: "፨ ሁሉም: ቀኑን ሁሉና ሌሊቱን ሁሉ የሠራነውን ብዙ ኃጢአት (ይቅር ትለን ዘንድ)፣ ስለ እናትህ ስለ ማርያም ተማጸንን። አቤቱ ጌታ ሆይ ታድነን ዘንድ ስማን።",
            tigrinya_script: "፨ ኩሉኹም: ምሉእ መዓልትን ምሉእ ለይትን ዝገበርናዮ ብዙሕ ኃጢኣት፡ ምእንቲ ኣዴኻ ማርያም ኢልና ተማሕጸንና። ኦ ጐይታ ከተድሕነና ስምዓና።"
        }
    ];
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
        spanish: "[Oración]",
        spanish_pr: "[Oración]"
    };
    const lordsPrayerParts = prayers.filter(p => p.chapter === 'Daily' && p.stanza === '3');
    const gabrielGreetingParts = prayers.filter(p => p.chapter === 'Daily' && p.stanza === '4');

    return [personalPrayer, ...lordsPrayerParts, ...gabrielGreetingParts];
}

window.updateMiracleTranslation = function(idx) {
    selectedMiracleTranslationIndex = parseInt(idx);
    saveSettings();
    // Re-render prayers to show new translation
    if (typeof _renderPrayersSync === 'function') {
        _renderPrayersSync();
    } else {
        renderPrayers();
    }
};

function renderSelectedMiracle(addSectionTitleCallback, renderKidaseSectionCallback) {
    if (selectedMiracleId === 'none' || typeof MIRACLES_OF_MARY === 'undefined') return;
    
    const miracle = MIRACLES_OF_MARY.find(m => m.id === selectedMiracleId);
    if (!miracle || !miracle.translations || miracle.translations.length === 0) return;
    
    const translationIndex = Math.min(selectedMiracleTranslationIndex || 0, miracle.translations.length - 1);
    const translation = miracle.translations[translationIndex];
    
    addSectionTitleCallback("→ Miracle of Mary | ተአምረ ማርያም");
    
    const miracleCards = [];
    
    let textToSplit = translation.text.replace(/<br\s*\/?>/gi, '\n');
    textToSplit = textToSplit.replace(/<\/p>\s*<p>/gi, '\n\n');
    textToSplit = textToSplit.replace(/<[^>]+>/g, ''); 
    
    const paragraphs = textToSplit.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    paragraphs.forEach((pText, i) => {
        let reference = `Miracles of Mary`;
        let instructionHtml = "";
        let englishText = pText.trim();
        let geezText = "";
        
        if (i === 0) {
            reference = `Miracle: ${miracle.title || miracle.id} (Translated by ${translation.author})`;
            if (miracle.translations.length > 1) {
                instructionHtml = `
                    <div style="margin-bottom: 0.5rem; text-align: center;">
                        <label style="font-size: 0.8rem; opacity: 0.8;">Translation Version:</label>
                        <select onchange="window.updateMiracleTranslation(this.value)" class="settings-select" style="display: inline-block; width: auto; padding: 2px 5px; font-size: 0.8rem; margin-left: 5px; min-width: 150px;">
                            ${miracle.translations.map((t, idx) => `<option value="${idx}" ${idx === translationIndex ? 'selected' : ''}>${t.author}</option>`).join('')}
                        </select>
                    </div>
                `;
            }
        }
        
        miracleCards.push({
            chapter: "Miracle",
            stanza: `${i + 1}`,
            english: pText.trim(),
            geez_script: i === 0 ? (miracle.incipit || '') : '',
            reference: reference,
            instruction: instructionHtml,
            _isMiracle: true,
            _miracleData: miracle
        });
    });
    
    renderKidaseSectionCallback(miracleCards);
}

let collapsedSections = {};

function renderSelectedKidase(addSectionTitleCallback, options = {}) {
    if (typeof kidaseData === 'undefined') return;
    const renderVespersHere = !options.skipVespers && showVespers;
    const renderPostSeatatHere = !options.onlyVespers && (showPrepPsalms || showMatins || showTeklil || isKidaseModeActive || showAnaphora);
    if (!renderVespersHere && !renderPostSeatatHere) return;

    const allOrderPrayers = kidaseData.order;

    // 1. Find dynamic markers to divide the sequence
    // Morning Gospel Section starts specifically at 3-179
    const mGospelIdx = allOrderPrayers.findIndex(p => p.chapter === '3' && p.stanza === '179');

    // Pre-Liturgy Kidan starts at the first occurrence of Chapter "Kidan"
    const kStartIdx = allOrderPrayers.findIndex(p => p.chapter === 'Kidan');

    // Order of the Liturgy starts at the specific "Start of the Liturgy of the Word" marker
    const lStartIdx = allOrderPrayers.findIndex(p => p.reference && p.reference.includes("Start of the Liturgy of the Word"));

    // Default fallbacks for safety if markers are missing
    const mGospelStart = mGospelIdx !== -1 ? mGospelIdx : 476;
    const kidanStart = kStartIdx !== -1 ? kStartIdx : 549;
    const liturgyStart = lStartIdx !== -1 ? lStartIdx : 650;

    // 2. Prepare chunks
    const morningGospelChunk = allOrderPrayers.slice(mGospelStart, kidanStart);
    const preLiturgyKidanChunk = allOrderPrayers.slice(kidanStart, liturgyStart);

    // "Order of the Liturgy" is the catch-all for everything else (Prep + Main Liturgy)
    const mainLiturgyArray = [];

    // Add Preparatory prayers (everything before Morning Gospel start 3-179)
    mainLiturgyArray.push(...allOrderPrayers.slice(0, mGospelStart));

    // 3. Render Sections

    // A. Vespers (Evening Prayers)
    if (renderVespersHere) {
        addSectionTitleCallback("<i>Vespers</i> — Sunset Prayer | ጸሎተ ሠርክ", true, null, { isParentGroup: true, defaultCollapsed: true });
        addSectionTitleCallback("→ Prayer of the Gospel | ጸሎተ ወንጌል", true, null, { defaultCollapsed: true });
        
        // Deep clone the chunk and swap morning placeholders for evening placeholders
        const eveningGospelChunk = JSON.parse(JSON.stringify(morningGospelChunk)).map(p => {
            const keys = ['english', 'geez_script', 'amharic_script', 'tigrinya_script', 'spanish', 'spanish_pr'];
            keys.forEach(k => {
                if (p[k]) {
                    p[k] = p[k].replace('{{MORNING PSALMS READING}}', '{{EVENING PSALMS READING}}');
                    p[k] = p[k].replace('{{MORNING GOSPEL READING}}', '{{EVENING GOSPEL READING}}');
                    p[k] = p[k].replace('{{ዮም ምስባክ ዘነግህ}}', '{{ዮም ምስባክ ዘሠርክ}}');
                    p[k] = p[k].replace('{{ዮም አንበበ ወንጌል ዘነግህ}}', '{{ዮም አንበበ ወንጌል ዘሠርክ}}');
                    p[k] = p[k].replace('{{የዛሬው ምስባክ ዘነግህ}}', '{{የዛሬው ምስባክ ዘሠርክ}}');
                    p[k] = p[k].replace('{{የዛሬው ወንጌል ዘነግህ ንባብ}}', '{{የዛሬው ወንጌል ዘሠርክ ንባብ}}');
                    p[k] = p[k].replace('{{ናይ ንግሆ ንባብ መዝሙር ዳዊት}}', '{{ናይ ምሸት ንባብ መዝሙር ዳዊት}}');
                    p[k] = p[k].replace('{{ናይ ንግሆ ንባብ ወንጌል}}', '{{ናይ ምሸት ንባብ ወንጌል}}');
                    p[k] = p[k].replace('{{LECTURA DE LOS SALMOS DE LA MAÑANA}}', '{{LECTURA DE LOS SALMOS DE LA TARDE}}');
                    p[k] = p[k].replace('{{LECTURA DEL EVANGELIO DE LA MAÑANA}}', '{{LECTURA DEL EVANGELIO DE LA TARDE}}');
                }
            });
            
            if (p.reference) {
                p.reference = p.reference.replace(/Morning/g, 'Sunset');
            }
            
            return p;
        });

        renderKidaseSection(eveningGospelChunk);
        addSectionTitleCallback("→ <i>Kidan</i> — Prayer of the Covenant | ጸሎተ ኪዳን", true, null, { defaultCollapsed: true });
        renderKidaseSection(preLiturgyKidanChunk);
    }

    if (options.onlyVespers) return;

    // A2. Pre-Liturgy Psalms before Liturgy (መዝሙር ዘዳዊት ዘቅድመ ቅዳሴ: LXX Psalms 24, 60, 101, 102, 129, 130)
    if (showPrepPsalms && bibleData.loaded) {
        addSectionTitleCallback("Pre-Liturgy Psalms | መዝሙር ዘዳዊት ዘቅድመ ቅዳሴ", true, null, { isParentGroup: true, defaultCollapsed: true });
        renderSelectedPsalmsWithDoxology((psalmNum) => {
            addSectionTitleCallback(`→ Psalm ${psalmNum} | መዝሙር ዘዳዊት ${toGeez(psalmNum)}`, true, null, { defaultCollapsed: true });
        }, PREP_PSALMS_LIST);
    }

    // B. Crowning (Matrimony / Teklil) - Render standalone if Matins is not active
    if (showTeklil && !showMatins && typeof teklilData !== 'undefined') {
        addSectionTitleCallback("<i>Teklil</i> — Crowning (Matrimony) | ተክሊል", false, null, { resetParentGroup: true });
        
        // 1. Render main block of Teklil (up to Thanksgiving) - Stanzas 1 to 75
        const mainTeklil = teklilData.prayers.filter(p => parseInt(p.stanza) <= 75);
        renderKidaseSection(mainTeklil);
        
        // 2. Fetch Thanksgiving (3-31 to 3-39)
        const thanksgiving = allOrderPrayers.filter(p => p.chapter === '3' && parseInt(p.stanza) >= 31 && parseInt(p.stanza) <= 39);
        renderKidaseSection(thanksgiving);

        // 3. Stand up for prayer / Peace be unto you (3-118)
        const standUp = allOrderPrayers.filter(p => p.chapter === '3' && parseInt(p.stanza) === 118);
        renderKidaseSection(standUp);

        // 4. Fetch Oblation (3-41 to 3-44)
        const oblation = allOrderPrayers.filter(p => p.chapter === '3' && parseInt(p.stanza) >= 41 && parseInt(p.stanza) <= 44);
        renderKidaseSection(oblation);

        // 5. Fetch "Let us worship" sequence (3-119 to 3-122)
        const worshipSequence = allOrderPrayers.filter(p => {
            if (p.chapter !== '3') return false;
            const s = parseInt(p.stanza);
            if (s === 119) return p.english.toLowerCase().includes("worship");
            return s >= 120 && s <= 122;
        });
        renderKidaseSection(worshipSequence);

        // 6. Deacon Intro to Ephesians
        const ephesiansIntroCard = {
            chapter: "Ephesians",
            stanza: "Intro",
            instruction: "",
            reference: "Epistle to the Ephesians",
            english: "DEACON: A reading from the Epistle of St. Paul to the Ephesians, chapter 5, verses 25-33. May his prayer and blessing be with us all. Amen."
        };
        renderKidaseSection([ephesiansIntroCard]);
        
        // 7. Fetch Ephesians 5:25-33
        const ephesiansVerses = getBibleVersesFromRef('Ephesians 5:25-33');
        if (ephesiansVerses) {
            const verseCounts = Object.values(ephesiansVerses).map(arr => arr.length);
            const maxVerses = Math.max(0, ...verseCounts);
            
            for (let i = 0; i < maxVerses; i++) {
                const versePrayer = {
                    english: ephesiansVerses['english']?.[i]?.text || '',
                    geez_script: ephesiansVerses['geez_script']?.[i]?.text || '',
                    amharic_script: ephesiansVerses['amharic_script']?.[i]?.text || '',
                    tigrinya_script: ephesiansVerses['tigrinya_script']?.[i]?.text || '',
                    spanish: ephesiansVerses['spanish']?.[i]?.text || '',
                    spanish_pr: ephesiansVerses['spanish_pr']?.[i]?.text || '',
                    chapter: "Ephesians",
                    stanza: "5:" + (25 + i),
                    reference: "Ephesians 5:25-33",
                    instruction: ""
                };
                renderKidaseSection([versePrayer]);
            }
        }
        
        // 8. Fetch Blessing (3-136 to 3-137)
        const blessing = allOrderPrayers.filter(p => 
            p.chapter === '3' && 
            (parseInt(p.stanza) === 136 || parseInt(p.stanza) === 137) &&
            !p.english.includes("{{TODAY'S PAULINE EPISTLE READING}}")
        );
        renderKidaseSection(blessing);

        addSectionTitleCallback("→ <i>Teklil</i> — Exhortation | ምክር");
        const exhortationLiturgy = allOrderPrayers.filter(p => 
            (p.chapter === '4' && parseInt(p.stanza) >= 6 && parseInt(p.stanza) <= 12) ||
            (p.chapter === '4' && parseInt(p.stanza) >= 23 && parseInt(p.stanza) <= 31) ||
            (p.chapter === 'The300' && parseInt(p.stanza) >= 1 && parseInt(p.stanza) <= 10)
        );
        renderKidaseSection(exhortationLiturgy, false, true); 
        const exhortationTeklil = teklilData.prayers.filter(p => parseInt(p.stanza) >= 76);
        renderKidaseSection(exhortationTeklil);
    }

    // C. Matins (Morning Prayers)
    if (showMatins) {
        addSectionTitleCallback("<i>Matins</i> — Morning Prayer | ጸሎተ ነግህ", true, null, { isParentGroup: true, defaultCollapsed: true });

        if (miraclePosition === 'matins') {
            renderSelectedMiracle(addSectionTitleCallback, renderKidaseSection);
        }

        if (showTeklil && typeof teklilData !== 'undefined') {
            addSectionTitleCallback("→ <i>Teklil</i> — Crowning (Matrimony) | ተክሊል", true, null, { defaultCollapsed: false });
            
            // 1. Render main block of Teklil (up to Thanksgiving) - Stanzas 1 to 75
            const mainTeklil = teklilData.prayers.filter(p => parseInt(p.stanza) <= 75);
            renderKidaseSection(mainTeklil);
            
            // 2. Fetch Thanksgiving (3-31 to 3-39)
            const thanksgiving = allOrderPrayers.filter(p => p.chapter === '3' && parseInt(p.stanza) >= 31 && parseInt(p.stanza) <= 39);
            renderKidaseSection(thanksgiving);

            // 3. Stand up for prayer / Peace be unto you (3-118)
            const standUp = allOrderPrayers.filter(p => p.chapter === '3' && parseInt(p.stanza) === 118);
            renderKidaseSection(standUp);

            // 4. Fetch Oblation (3-41 to 3-44)
            const oblation = allOrderPrayers.filter(p => p.chapter === '3' && parseInt(p.stanza) >= 41 && parseInt(p.stanza) <= 44);
            renderKidaseSection(oblation);

            // 5. Fetch "Let us worship" sequence (3-119 to 3-122). Note: 3-119 has two variants, we want the Sunday one containing "worship" in english
            const worshipSequence = allOrderPrayers.filter(p => {
                if (p.chapter !== '3') return false;
                const s = parseInt(p.stanza);
                if (s === 119) return p.english.toLowerCase().includes("worship");
                return s >= 120 && s <= 122;
            });
            renderKidaseSection(worshipSequence);

            // 6. Deacon Intro to Ephesians
            const ephesiansIntroCard = {
                chapter: "Ephesians",
                stanza: "Intro",
                instruction: "",
                reference: "Epistle to the Ephesians",
                english: "DEACON: A reading from the Epistle of St. Paul to the Ephesians, chapter 5, verses 25-33. May his prayer and blessing be with us all. Amen."
            };
            renderKidaseSection([ephesiansIntroCard]);
            
            // 7. Fetch Ephesians 5:25-33
            const ephesiansVerses = getBibleVersesFromRef('Ephesians 5:25-33');
            if (ephesiansVerses) {
                const verseCounts = Object.values(ephesiansVerses).map(arr => arr.length);
                const maxVerses = Math.max(0, ...verseCounts);
                
                for (let i = 0; i < maxVerses; i++) {
                    const versePrayer = {
                        english: ephesiansVerses['english']?.[i]?.text || '',
                        geez_script: ephesiansVerses['geez_script']?.[i]?.text || '',
                        amharic_script: ephesiansVerses['amharic_script']?.[i]?.text || '',
                        tigrinya_script: ephesiansVerses['tigrinya_script']?.[i]?.text || '',
                        spanish: ephesiansVerses['spanish']?.[i]?.text || '',
                        spanish_pr: ephesiansVerses['spanish_pr']?.[i]?.text || '',
                        chapter: "Ephesians",
                        stanza: "5:" + (25 + i),
                        reference: "Ephesians 5:25-33",
                        instruction: ""
                    };
                    renderKidaseSection([versePrayer]);
                }
            }
            
            // 8. Fetch Blessing (3-136 to 3-137)
            const blessing = allOrderPrayers.filter(p => 
                p.chapter === '3' && 
                (parseInt(p.stanza) === 136 || parseInt(p.stanza) === 137) &&
                !p.english.includes("{{TODAY'S PAULINE EPISTLE READING}}")
            );
            renderKidaseSection(blessing);
        }

        addSectionTitleCallback("→ Prayer of the Gospel | ጸሎተ ወንጌል", true, null, { defaultCollapsed: true });
        renderKidaseSection(morningGospelChunk);
        addSectionTitleCallback("→ <i>Kidan</i> — Prayer of the Covenant | ጸሎተ ኪዳን", true, null, { defaultCollapsed: true });
        renderKidaseSection(preLiturgyKidanChunk);

        if (showTeklil && typeof teklilData !== 'undefined') {
            addSectionTitleCallback("→ <i>Teklil</i> — Exhortation | ምክር", true, null, { defaultCollapsed: true });
            
            // 5. Exhortation specific liturgy insertions (4-6 to 4-12, 4-23 to 4-31, The300-1 to 10)
            const exhortationLiturgy = allOrderPrayers.filter(p => 
                (p.chapter === '4' && parseInt(p.stanza) >= 6 && parseInt(p.stanza) <= 12) ||
                (p.chapter === '4' && parseInt(p.stanza) >= 23 && parseInt(p.stanza) <= 31) ||
                (p.chapter === 'The300' && parseInt(p.stanza) >= 1 && parseInt(p.stanza) <= 10)
            );
            renderKidaseSection(exhortationLiturgy, false, true); 
            
            // 6. Concluding Teklil prayers
            const exhortationTeklil = teklilData.prayers.filter(p => parseInt(p.stanza) >= 76);
            renderKidaseSection(exhortationTeklil);
        }
    }

    let hasRenderedLiturgyParentTitle = false;
    const ensureLiturgyParentTitle = () => {
        if (!hasRenderedLiturgyParentTitle) {
            addSectionTitleCallback("<i>Ḳidasé</i> — Liturgy | ቅዳሴ", true, null, { isParentGroup: true, resetParentGroup: true, defaultCollapsed: true });
            hasRenderedLiturgyParentTitle = true;
        }
    };

    // D. Order of the Liturgy | ሥርዓተ ቅዳሴ
    if (isKidaseModeActive) {
        ensureLiturgyParentTitle();
        addSectionTitleCallback("→ Order of the Liturgy | ሥርዓተ ቅዳሴ", true, null, { defaultCollapsed: true });
        mainLiturgyArray.push(...allOrderPrayers.slice(liturgyStart));
        renderKidaseSection(mainLiturgyArray, true); // true means apply version filtering to any embedded Kidan
    }

    // E. Eucharistic Prayer | አኰቴተ ቍርባን (Anaphora)
    if (showAnaphora) {
        const anaphoraMap = {
            'apostles': { name: '→ Anaphora of the Apostles | ቅዳሴ ሐዋርያት', data: kidaseData.apostles },
            'mary': { name: '→ Anaphora of Mary | ቅዳሴ ማርያም', data: kidaseData.mary }
        };

        const anaphora = anaphoraMap[selectedAnaphora];
        if (anaphora) {
            ensureLiturgyParentTitle();
            addSectionTitleCallback(anaphora.name, true, null, { defaultCollapsed: true });
            renderKidaseSection(anaphora.data);
        }

        if (miraclePosition === 'anaphora') {
            renderSelectedMiracle(addSectionTitleCallback, renderKidaseSection);
        }
    }

    // Helper to render a chunk of kidase prayers with current filters
    function renderKidaseSection(prayers, isLiturgyCore = false, overrideQuietFilter = false) {
        let filtered = prayers;

        // Apply Liturgy-embedded Covenant Prayer filtering (only for Core) BEFORE hideQuietPrayers
        if (isLiturgyCore) {
            filtered = filtered.filter((p) => {
                if (p.chapter === 'Kidan') {
                    if (selectedCovenantPrayer === 'none') return false;
                    if (p.stanza === 'Part1' && selectedCovenantPrayer !== 'midnight') return false;
                    if (p.stanza === 'Part2' && selectedCovenantPrayer !== 'morning') return false;
                    if (p.stanza === 'Part3' && selectedCovenantPrayer !== 'afternoon') return false;
                }
                return true;
            });
        }

        if (!hideQuietPrayers && !overrideQuietFilter) {
            filtered = filtered.filter(p => {
                if (p.instruction && p.instruction.includes("Inaudible Prayer")) return false;
                return true;
            });
        }

        // Apply Liturgy Day filtering (Chapter 2 & Chapter 3 day variants) ONLY in slides mode
        if (displayOptions.presentationMode === 'slides') {
            filtered = filtered.filter(p => {
                if (p.chapter === '2') {
                    if (p.stanza === '73' && selectedKidaseDay !== 'weekday') return false;
                    if (p.stanza === '74' && selectedKidaseDay !== 'saturday') return false;
                    if (p.stanza === '75' && selectedKidaseDay !== 'sunday') return false;
                }
                if (p.chapter === '3') {
                    const s = parseInt(p.stanza);
                    if (s === 119) {
                        const isSundayNisgid = p.english && p.english.toLowerCase().includes("worship");
                        if (selectedKidaseDay === 'sunday' && !isSundayNisgid) return false;
                        if (selectedKidaseDay !== 'sunday' && isSundayNisgid) return false;
                    }
                    if (s >= 120 && s <= 122) {
                        // 3-120 to 3-122 are only for Sunday / Major Feasts
                        if (selectedKidaseDay !== 'sunday') return false;
                    }
                }
                return true;
            });
        }

        // Apply Holy 50 Days filtering (3-160..3-172 vs 3-173)
        filtered = filtered.filter(p => {
            if (p.chapter === '3' && p.stanza) {
                const sNum = parseInt(p.stanza);
                if (isHolyFiftyDays) {
                    // When ON: hide cards 3-160 through 3-172
                    if (!isNaN(sNum) && sNum >= 160 && sNum <= 172) return false;
                } else {
                    // When OFF (default): hide card 3-173
                    if (!isNaN(sNum) && sNum === 173) return false;
                }
            }
            return true;
        });

        // Apply Gospel Conclusion/Response filtering (3-213..3-216)
        // Each gospel book has its own conclusion & response cards:
        //   Matthew → 3-213, Mark → 3-214, Luke → 3-215, John → 3-216
        const GOSPEL_STANZA_MAP = { 'Matthew': 213, 'Mark': 214, 'Luke': 215, 'John': 216 };
        const gospelRef = kidaseLectionaryRefs.gospel || '';
        const gospelBookMatch = gospelRef.match(/^(\w+)\s/);
        const selectedGospelBook = gospelBookMatch ? gospelBookMatch[1] : '';
        const activeGospelStanza = GOSPEL_STANZA_MAP[selectedGospelBook];

        filtered = filtered.filter(p => {
            if (p.chapter === '3' && p.stanza) {
                const sNum = parseInt(p.stanza);
                if (!isNaN(sNum) && sNum >= 213 && sNum <= 216) {
                    // Only show the stanza matching the selected gospel book
                    return sNum === activeGospelStanza;
                }
            }
            return true;
        });

        filtered.forEach((pOriginal, relativeIdx) => {
            const p = { ...pOriginal }; // clone to avoid modifying original array

            // Replace Teklil placeholders if they exist
            if (showTeklil) {
                const keys = ['english', 'geez_script', 'amharic_script', 'tigrinya_script', 'spanish', 'spanish_pr'];
                const groom = bridegroomName.trim() || "Bridegroom";
                const bride = brideName.trim() || "Bride";
                keys.forEach(k => {
                    if (p[k]) {
                        p[k] = p[k].replace(/\{\{BRIDEGROOM_NAME\}\}/g, groom);
                        p[k] = p[k].replace(/\{\{BRIDE_NAME\}\}/g, bride);
                    }
                });
            }

            // Check if this prayer contains a reading placeholder from the config
            let activeCfg = null;
            for (const cfg of LITURGY_LECTIONARY_CONFIG) {
                const hasPlaceholder = Object.values(cfg.placeholders).some(ph =>
                    (p.english && p.english.includes(ph)) ||
                    (p.geez_script && p.geez_script.includes(ph)) ||
                    (p.amharic_script && p.amharic_script.includes(ph))
                );

                if (hasPlaceholder) {
                    activeCfg = cfg;
                    break;
                }
            }

            if (activeCfg) {
                const bibleResults = getBibleVersesFromRef(activeCfg.ref(), activeCfg.id);
                const engCitation = getReadingTranslationOverride(activeCfg.id, 'english') === 'kjv' ? 'KJV' : 'NKJV';
                const amCitation = getAmharicEditionCitation(getReadingTranslationOverride(activeCfg.id, 'amharic'));
                const geezCitation = getGeezEditionCitation(getReadingTranslationOverride(activeCfg.id, 'geez'));
                if (bibleResults) {
                    const verseCounts = Object.values(bibleResults).map(arr => arr.length);
                    const maxVerses = Math.max(0, ...verseCounts);

                    if (maxVerses > 0) {
                        const refStr = activeCfg.ref();
                        const match = refStr.match(/^(.+?)\s+(\d+):(\d+)(?:-(End|\d+))?$/i);
                        const crossMatch = !match ? refStr.match(/^(.+?)\s+(\d+):(\d+)-(\d+):(End|\d+)$/i) : null;
                        const bookName = match ? match[1] : (crossMatch ? crossMatch[1] : "");
                        const chapter = match ? parseInt(match[2], 10) : (crossMatch ? parseInt(crossMatch[2], 10) : 0);
                        const start = match ? parseInt(match[3], 10) : (crossMatch ? parseInt(crossMatch[3], 10) : 0);
                        const end = match ? (match[4] && match[4].toLowerCase() === 'end' ? 999 : (match[4] ? parseInt(match[4], 10) : start)) : 999;

                        if (bookName === 'Psalms' || bookName === 'Psalm') {
                            // Combine all verses into one card for Psalm chants
                            const versePrayer = { ...p };
                            const typical = findTypicalPsalm(bookName, chapter, start, end, activeCfg.id);
                            const geezOverride = getReadingTranslationOverride(activeCfg.id, 'geez');
                            const useTypicalGeezChant = typical && geezOverride === 'gez-1980-formatted';

                            // Only populate languages that are currently enabled
                            const visibleLangs = languageOrder.filter(id => displayedLanguages[id]);

                            // Always pre-compute phonetic raw text so showGeezPhoneticChants can append it
                            // under the Ge'ez script column even if geez_phonetic column is not displayed
                            let psalmPhoneticRaw = '';
                            if (useTypicalGeezChant && typical.g) {
                                psalmPhoneticRaw = transliterateGeezToPhonetic(typical.g);
                            } else if (bibleResults['geez_script']) {
                                const rawGeez = bibleResults['geez_script'].map(v => v.text).join("\n");
                                psalmPhoneticRaw = transliterateGeezToPhonetic(rawGeez);
                            } else if (typical && typical.p) {
                                psalmPhoneticRaw = typical.p;
                            }

                            visibleLangs.forEach(langKey => {
                                const langPlaceholder = activeCfg.placeholders[langKey] || activeCfg.placeholders.english;
                                let combinedText = "";

                                if (langKey === 'geez_script' && useTypicalGeezChant) {
                                    combinedText = typical.g;
                                } else if (langKey === 'geez_phonetic') {
                                    if (useTypicalGeezChant && typical.g) {
                                        combinedText = transliterateGeezToPhonetic(typical.g);
                                    } else if (bibleResults['geez_script']) {
                                        const rawGeez = bibleResults['geez_script'].map(v => v.text).join("\n");
                                        combinedText = transliterateGeezToPhonetic(rawGeez);
                                    } else if (typical && typical.p) {
                                        combinedText = typical.p;
                                    }
                                } else if (bibleResults[langKey]) {
                                    // Remove verse numbers in brackets for Psalm chants
                                    combinedText = bibleResults[langKey].map(v => v.text).join("\n");
                                }

                                // Construct localized header
                                let header = refStr;
                                const bookCfg = BIBLE_BOOK_MAPPING[bookName];
                                const rangeSuffix = `${start}${end !== start && end !== 999 ? '-' + end : (end === 999 ? '-End' : '')}`;

                                if (langKey === 'geez_script') {
                                    let gCh = chapter, gS = start, gE = end;
                                    if (typical) {
                                        gCh = typical.lc; gS = typical.ls; gE = typical.le;
                                    } else if (typeof convertMtToLxx === 'function') {
                                        const lS = convertMtToLxx(chapter, start);
                                        const lE = end !== 999 ? convertMtToLxx(chapter, end) : null;
                                        if (lS && typeof lS === 'object') {
                                            gCh = lS.lxxChapter;
                                            gS = lS.lxxVerse;
                                            gE = lE && typeof lE === 'object' ? lE.lxxVerse : end;
                                        }
                                    }
                                    const chG = toGeezNumeral(gCh);
                                    const sG = toGeezNumeral(gS);
                                    const eG = (gE !== gS && gE !== 999) ? '-' + toGeezNumeral(gE) : (gE === 999 ? '-ፍጻሜ' : '');
                                    header = `መዝሙር ዘዳዊት ${chG}፥${sG}${eG} (${geezCitation})`;
                                } else if (langKey === 'geez_phonetic') {
                                    if (typical) {
                                        const lxxRange = `${typical.ls}${typical.le !== typical.ls ? '-' + typical.le : ''}`;
                                        const mcRange = `${typical.ms}${typical.me !== typical.ms ? '-' + typical.me : ''}`;
                                        header = `Mezmure Dawīt ${typical.lc}:${lxxRange} OSB (${typical.mc}:${mcRange} ${engCitation})`;
                                    } else {
                                        header = `Mezmure Dawīt ${chapter}:${rangeSuffix} (Ge'ez Phonetic)`;
                                    }
                                } else if (langKey === 'english') {
                                    if (typical) {
                                        const lxxRange = `${typical.ls}${typical.le !== typical.ls ? '-' + typical.le : ''}`;
                                        const mcRange = `${typical.ms}${typical.me !== typical.ms ? '-' + typical.me : ''}`;
                                        header = `Psalm ${typical.lc}:${lxxRange} OSB (${typical.mc}:${mcRange} ${engCitation})`;
                                    } else {
                                        header = `Psalm ${chapter}:${rangeSuffix} (${engCitation})`;
                                    }
                                } else if (bookCfg) {
                                    if (langKey === 'amharic_script') {
                                        header = `${bookCfg.am54} ${chapter}:${rangeSuffix} (${amCitation})`;
                                    } else if (langKey === 'spanish' || langKey === 'spanish_pr') {
                                        header = `${bookCfg.rgv} ${chapter}:${rangeSuffix} (RVG)`;
                                    }
                                }

                                // For Psalm chants, we replace the entire card content to remove the Deacon prompt
                                // But only if we have actual content for this language
                                if (combinedText && combinedText.trim()) {
                                    versePrayer[langKey] = `<span class="speaker-label">${header}</span><br>${combinedText}`;
                                } else {
                                    versePrayer[langKey] = "";
                                }
                            });

                            // Ensure geez_phonetic raw text is always available for
                            // the "showGeezPhoneticChants" append feature (appended under Ge'ez script column),
                            // even when the geez_phonetic language column is not displayed.
                            if (!displayedLanguages['geez_phonetic'] && psalmPhoneticRaw) {
                                versePrayer['geez_phonetic'] = psalmPhoneticRaw;
                            }

                            const card = createPrayerCardElement(versePrayer, -1, true);
                            card.dataset.readingType = activeCfg.id;

                            const pickerFooter = document.createElement('div');
                            pickerFooter.classList.add('card-inline-lectionary-picker');
                            const setPill = createKidaseReadingSetPillElement(activeCfg.id);
                            if (setPill) pickerFooter.appendChild(setPill);
                            createLectionaryPicker(pickerFooter, activeCfg.id, ['Psalms'], TYPICAL_PSALMS);
                            if (setPill && !pickerFooter.contains(setPill)) {
                                pickerFooter.insertBefore(setPill, pickerFooter.firstChild);
                            }
                            const pFooter = card.querySelector('.prayer-footer');
                            const pActions = card.querySelector('.prayer-actions');
                            if (pFooter && pActions) {
                                pFooter.insertBefore(pickerFooter, pActions);
                            } else {
                                card.appendChild(pickerFooter);
                            }

                            prayerDisplay.appendChild(card);
                        } else {
                            // Split into multiple cards for Gospel/Epistles
                            for (let i = 0; i < maxVerses; i++) {
                                const versePrayer = { ...p };
                                const visibleLangs = languageOrder.filter(id => displayedLanguages[id]);
                                visibleLangs.forEach(langKey => {
                                    const langPlaceholder = activeCfg.placeholders[langKey] || activeCfg.placeholders.english;

                                    if (bibleResults[langKey] && bibleResults[langKey][i]) {
                                        const v = bibleResults[langKey][i];
                                        let dVN = v.verseNum;
                                        if (langKey === 'geez_script' || langKey === 'geez_psalms') {
                                            dVN = String(dVN).split(':').map(part =>
                                                part.split('-').map(n => toGeezNumeral(parseInt(n, 10))).join('-')
                                            ).join('፥');
                                        }
                                        const verseText = `<sup>${dVN}</sup> ${v.text}`;
                                        if (i === 0) {
                                            // Construct localized header
                                            const range = match
                                                ? match[2] + ":" + match[3] + (match[4] ? "-" + match[4] : "")
                                                : (crossMatch ? `${crossMatch[2]}:${crossMatch[3]}-${crossMatch[4]}:${crossMatch[5]}` : "");
                                            let header = refStr;
                                            const bookCfg = BIBLE_BOOK_MAPPING[bookName];
                                            if (bookCfg) {
                                                if (langKey === 'geez_script') {
                                                    header = `${bookCfg.am54} ${range} (${geezCitation})`;
                                                } else if (langKey === 'amharic_script') {
                                                    header = `${bookCfg.am54} ${range} (${amCitation})`;
                                                } else if (langKey === 'english') {
                                                    header = `${bookName} ${range} (${engCitation})`;
                                                } else if (langKey === 'spanish' || langKey === 'spanish_pr') {
                                                    header = `${bookCfg.rgv} ${range} (RVG)`;
                                                }
                                            }
                                            const prefix = (activeCfg.prefixes && activeCfg.prefixes[langKey]) || "";
                                            const headerText = `${prefix}${header}`.trim();
                                            const fullText = `<span class="speaker-label">${headerText}</span><br>${verseText}`;

                                            // Replace the language-specific placeholder
                                            if (p[langKey]) {
                                                versePrayer[langKey] = p[langKey].replace(langPlaceholder, fullText);
                                            } else {
                                                versePrayer[langKey] = fullText;
                                            }
                                        } else {
                                            versePrayer[langKey] = verseText;
                                        }
                                    } else {
                                        // If no results for this language, clear it so it doesn't show placeholders/empty columns
                                        versePrayer[langKey] = "";
                                    }
                                });
                                const card = createPrayerCardElement(versePrayer, -1, true);
                                if (i === 0) {
                                    card.dataset.readingType = activeCfg.id;
                                    const pickerFooter = document.createElement('div');
                                    pickerFooter.classList.add('card-inline-lectionary-picker');

                                    const bookOpts = (activeCfg.id === 'pauline') ? ['Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews']
                                        : (activeCfg.id === 'universal') ? ['James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation']
                                        : (activeCfg.id === 'acts') ? ['Acts']
                                        : ['Matthew', 'Mark', 'Luke', 'John'];

                                    const setPill = createKidaseReadingSetPillElement(activeCfg.id);
                                    createLectionaryPicker(pickerFooter, activeCfg.id, bookOpts, null);
                                    if (setPill) {
                                        pickerFooter.insertBefore(setPill, pickerFooter.firstChild);
                                    }
                                    const pFooter = card.querySelector('.prayer-footer');
                                    const pActions = card.querySelector('.prayer-actions');
                                    if (pFooter && pActions) {
                                        pFooter.insertBefore(pickerFooter, pActions);
                                    } else {
                                        card.appendChild(pickerFooter);
                                    }
                                }
                                prayerDisplay.appendChild(card);
                            }
                        }
                        return;
                    }
                }
            }

            const card = createPrayerCardElement(p, -1, true);
            if (activeCfg) {
                card.dataset.readingType = activeCfg.id;
                const pickerFooter = document.createElement('div');
                pickerFooter.classList.add('card-inline-lectionary-picker');

                const bookOpts = (activeCfg.id === 'pauline') ? ['Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews']
                    : (activeCfg.id === 'universal') ? ['James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation']
                    : (activeCfg.id === 'acts') ? ['Acts']
                    : ['Matthew', 'Mark', 'Luke', 'John'];

                createLectionaryPicker(pickerFooter, activeCfg.id, bookOpts, null);
                const pFooter = card.querySelector('.prayer-footer');
                const pActions = card.querySelector('.prayer-actions');
                if (pFooter && pActions) {
                    pFooter.insertBefore(pickerFooter, pActions);
                } else {
                    card.appendChild(pickerFooter);
                }
            }

            // Add cross-navigation buttons for creed cards & day-variant liturgy chants
            const cardId = `${p.chapter}-${p.stanza}`;
            const jumpIconSVG = `<svg class="creed-nav-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`;

            if (cardId === '4-33' || cardId === 'The300-1') {
                const navBtn = document.createElement('button');
                navBtn.className = 'settings-button creed-nav-btn';
                if (cardId === '4-33') {
                    navBtn.innerHTML = `${jumpIconSVG} <span>NICENE CREED | ጸሎተ ሐይማኖት</span>`;
                    navBtn.title = 'Jump to the Nicene Creed (The 300)';
                    navBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        navigateToCard('The300-1');
                    });
                } else {
                    navBtn.innerHTML = `${jumpIconSVG} <span>APOSTLE'S CREED | አመክንዮ ዘሐዋርያት</span>`;
                    navBtn.title = "Jump to the Apostle's Creed";
                    navBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        navigateToCard('4-33');
                    });
                }

                const pFooter = card.querySelector('.prayer-footer');
                const pActions = card.querySelector('.prayer-actions');
                if (pFooter && pActions) {
                    pFooter.insertBefore(navBtn, pActions);
                }
            } else if (p.chapter === '2' && (p.stanza === '73' || p.stanza === '74' || p.stanza === '75')) {
                // Only attach navigation buttons to the first 2-75 card if multiple 2-75 cards exist
                const isFirstStanza75 = p.stanza !== '75' || (p.english && p.english.includes("Blessed is he who does blessed deeds and honors the Sabbath. Let him not question"));
                if (isFirstStanza75) {
                    const navGroup = document.createElement('div');
                    navGroup.className = 'day-nav-group';

                    if (p.stanza === '75') {
                        // On Sunday chant (ኵሉ ዘገብራ): provide Saturday and Weekday options
                        const btnSat = document.createElement('button');
                        btnSat.className = 'settings-button day-nav-btn';
                        btnSat.innerHTML = `${jumpIconSVG} <span>SATURDAY | ዘቀዳሚት (መስቀል አብርሃ)</span>`;
                        btnSat.title = 'Switch to Saturday Liturgy chant (መስቀል አብርሃ)';
                        btnSat.addEventListener('click', (e) => {
                            e.preventDefault();
                            switchKidaseDayAndNavigate('saturday', '2-74');
                        });
                        navGroup.appendChild(btnSat);

                        const btnWk = document.createElement('button');
                        btnWk.className = 'settings-button day-nav-btn';
                        btnWk.innerHTML = `${jumpIconSVG} <span>WEEKDAY | ዘሰኑይ–ዓርብ (እምነ በሀ)</span>`;
                        btnWk.title = 'Switch to Weekday Liturgy chant (እምነ በሀ)';
                        btnWk.addEventListener('click', (e) => {
                            e.preventDefault();
                            switchKidaseDayAndNavigate('weekday', '2-73');
                        });
                        navGroup.appendChild(btnWk);
                    } else if (p.stanza === '74') {
                        // On Saturday chant (መስቀል አብርሃ): provide Sunday and Weekday options
                        const btnSun = document.createElement('button');
                        btnSun.className = 'settings-button day-nav-btn';
                        btnSun.innerHTML = `${jumpIconSVG} <span>SUNDAY | ዘእሁድ (ኵሉ ዘገብራ)</span>`;
                        btnSun.title = 'Switch to Sunday Liturgy chant (ኵሉ ዘገብራ)';
                        btnSun.addEventListener('click', (e) => {
                            e.preventDefault();
                            switchKidaseDayAndNavigate('sunday', '2-75');
                        });
                        navGroup.appendChild(btnSun);

                        const btnWk = document.createElement('button');
                        btnWk.className = 'settings-button day-nav-btn';
                        btnWk.innerHTML = `${jumpIconSVG} <span>WEEKDAY | ዘሰኑይ–ዓርብ (እምነ በሀ)</span>`;
                        btnWk.title = 'Switch to Weekday Liturgy chant (እምነ በሀ)';
                        btnWk.addEventListener('click', (e) => {
                            e.preventDefault();
                            switchKidaseDayAndNavigate('weekday', '2-73');
                        });
                        navGroup.appendChild(btnWk);
                    } else if (p.stanza === '73') {
                        // On Weekday chant (እምነ በሀ): provide Sunday and Saturday options
                        const btnSun = document.createElement('button');
                        btnSun.className = 'settings-button day-nav-btn';
                        btnSun.innerHTML = `${jumpIconSVG} <span>SUNDAY | ዘእሁድ (ኵሉ ዘገብራ)</span>`;
                        btnSun.title = 'Switch to Sunday Liturgy chant (ኵሉ ዘገብራ)';
                        btnSun.addEventListener('click', (e) => {
                            e.preventDefault();
                            switchKidaseDayAndNavigate('sunday', '2-75');
                        });
                        navGroup.appendChild(btnSun);

                        const btnSat = document.createElement('button');
                        btnSat.className = 'settings-button day-nav-btn';
                        btnSat.innerHTML = `${jumpIconSVG} <span>SATURDAY | ዘቀዳሚት (መስቀል አብርሃ)</span>`;
                        btnSat.title = 'Switch to Saturday Liturgy chant (መስቀል አብርሃ)';
                        btnSat.addEventListener('click', (e) => {
                            e.preventDefault();
                            switchKidaseDayAndNavigate('saturday', '2-74');
                        });
                        navGroup.appendChild(btnSat);
                    }

                    const pFooter = card.querySelector('.prayer-footer');
                    const pActions = card.querySelector('.prayer-actions');
                    if (pFooter && pActions) {
                        pFooter.insertBefore(navGroup, pActions);
                    }
                }
            } else if (p.chapter === '3' && p.stanza === '119') {
                const isSundayNisgid = p.english && p.english.toLowerCase().includes("worship");
                const navBtn = document.createElement('button');
                navBtn.className = 'settings-button day-nav-btn';

                if (isSundayNisgid) {
                    navBtn.innerHTML = `${jumpIconSVG} <span>GOLDEN CENSER | ማዕጠንት ዘወርቅ (Mon–Sat)</span>`;
                    navBtn.title = 'Switch to Mon–Sat Golden Censer chant (አንቲ ውእቱ ማዕጠንት ዘወርቅ)';
                    navBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        switchKidaseDayAndNavigate('saturday', '3-119');
                    });
                } else {
                    navBtn.innerHTML = `${jumpIconSVG} <span>LET US WORSHIP | ንስግድ (Sunday / Feasts)</span>`;
                    navBtn.title = 'Switch to Sunday Nisgid chant (ካህን፤ ንስግድ / Priest: Let us worship)';
                    navBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        switchKidaseDayAndNavigate('sunday', '3-119');
                    });
                }

                const pFooter = card.querySelector('.prayer-footer');
                const pActions = card.querySelector('.prayer-actions');
                if (pFooter && pActions) {
                    pFooter.insertBefore(navBtn, pActions);
                }
            }

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


let isRendering = false;
let pendingRender = false;

async function renderPrayers() {
    if (isServantsCornerActive) return;
    
    if (isRendering) {
        pendingRender = true;
        return;
    }
    isRendering = true;

    try {
        if (prayerDisplay && (prayerDisplay.children.length === 0 || bibleData.loaded)) {
            _renderPrayersSync();
        }

        await ensureActiveBibleDataLoaded();

        if (useExternalBibleAPI && window.WeahaduBibleService) {
            const refsToPreload = [];
            if (isKidaseModeActive || showMatins || showVespers) {
                for (const key in kidaseLectionaryRefs) {
                    if (!showMatins && (key === 'morningPsalm' || key === 'morningGospel')) continue;
                    if (!showVespers && (key === 'vespersPsalm' || key === 'vespersGospel' || key === 'eveningPsalm' || key === 'eveningGospel')) continue;
                    if (kidaseLectionaryRefs[key]) {
                        expandReadingRefForPreload(kidaseLectionaryRefs[key]).forEach(r => refsToPreload.push(r));
                    }
                }
            }
            if (showDailyLectionary) {
                const ethNow = computeEthiopianDate(getEffectiveDate());
                const lecEntry = getActiveEotcLectionaryLookup(ethNow.ethMonth, ethNow.ethDay);
                if (lecEntry) {
                    (lecEntry.morning || []).forEach(ref => expandReadingRefForPreload(ref).forEach(r => refsToPreload.push(r)));
                    (lecEntry.evening || []).forEach(ref => expandReadingRefForPreload(ref).forEach(r => refsToPreload.push(r)));
                    if (lecEntry.matins) {
                        if (lecEntry.matins.psalmLxx) {
                            const mtPs = convertLxxRefHelper(lecEntry.matins.psalmLxx);
                            if (mtPs) refsToPreload.push(mtPs);
                        }
                        if (lecEntry.matins.gospel) {
                            expandReadingRefForPreload(lecEntry.matins.gospel).forEach(r => refsToPreload.push(r));
                        }
                    }
                }
            }
            if (typeof selectedProphetSongs !== 'undefined' && selectedProphetSongs.length > 0) {
                selectedProphetSongs.forEach(songKey => {
                    const song = typeof prophetSongs !== 'undefined' ? prophetSongs.find(s => s.key === songKey) : null;
                    const engSongRef = song?.refs?.kjv || song?.refs?.nkjv;
                    if (song && !song.refs?.prayerKey && engSongRef) {
                        const bookName = engSongRef.bookName || engSongRef.book;
                        refsToPreload.push(`${bookName} 1:1`);
                    } else if (song && song.refs?.prayerKey) {
                        const pk = song.refs.prayerKey;
                        if (pk === 'Manasseh') {
                            refsToPreload.push('Prayer of Manasseh 1:1');
                            refsToPreload.push('2 Chronicles 33:14');
                        } else if (pk === 'Jonah') {
                            refsToPreload.push('Jonah 2:2');
                        } else if (pk === 'ThreeYouths1' || pk === 'ThreeYouths2' || pk === 'ThreeYouths3') {
                            refsToPreload.push('Daniel 3:26');
                        }
                    }
                });
            }
            if (typeof BIBLE_BOOK_MAPPING !== 'undefined' && ((selectedPsalms && selectedPsalms.length > 0) || (isKidaseModeActive && showPrepPsalms))) {
                refsToPreload.push("Psalms 1:1");
            }
            if (showSeatatReadings && selectedSeatatLectionaryDay !== 'None' && typeof SEATAT_LECTIONARY_DATA !== 'undefined' && SEATAT_LECTIONARY_DATA[selectedSeatatLectionaryDay]) {
                SEATAT_LECTIONARY_DATA[selectedSeatatLectionaryDay].forEach(r => {
                    if (r && r.book && r.chapter && r.verses) {
                        refsToPreload.push(`${r.book} ${r.chapter}:${r.verses}`);
                    }
                    if (r && r.extra && r.extra.book && r.extra.chapter && r.extra.verses) {
                        refsToPreload.push(`${r.extra.book} ${r.extra.chapter}:${r.extra.verses}`);
                    }
                });
            }

            const langsToPreload = new Set();
            const wantEng = Boolean(displayedLanguages.english);
            const wantAm = Boolean(displayedLanguages.amharic_script || displayedLanguages.amharic_phonetic);
            const wantGez = Boolean(displayedLanguages.geez_script || displayedLanguages.geez_phonetic);
            const wantTi = Boolean(displayedLanguages.tigrinya_script || displayedLanguages.tigrinya_phonetic);

            if (wantEng) {
                langsToPreload.add('en-kjv');
            }
            if (wantAm) {
                langsToPreload.add(globalAmharicTranslation || 'am-2000');
            }
            if (wantGez) {
                langsToPreload.add('gez-1980');
                langsToPreload.add('gez-1980-formatted');
                if (globalGeezTranslation) langsToPreload.add(globalGeezTranslation);
            }
            if (wantTi) {
                langsToPreload.add('ti-1997');
            }
            if (readingTranslationOverrides) {
                Object.values(readingTranslationOverrides).forEach(ov => {
                    if (wantAm && ov && ov.amharic) langsToPreload.add(ov.amharic);
                    if (wantGez && ov && ov.geez) langsToPreload.add(ov.geez);
                });
            }

            if (langsToPreload.size > 0 && refsToPreload.length > 0) {
                await WeahaduBibleService.preloadBooks(Array.from(langsToPreload), refsToPreload);
            }
        }
    } catch (e) {
        console.error("Failed to preload Weahadu books", e);
    }

    try {
        _renderPrayersSync();
    } catch (err) {
        console.error("Error during _renderPrayersSync:", err);
    } finally {
        isRendering = false;
        if (pendingRender) {
            pendingRender = false;
            renderPrayers();
        } else {
            _pendingSlideSignature = null;
            _pendingSlideId = null;
            _pendingSlidePredicate = null;
            _pendingSlideReadingType = null;
        }
    }
}

function getActivePrayerViewPresetSummary() {
    if (activePrimaryTab === 'pray') {
        const def = getPrayTabDefaultProfile();
        const isDefaultPrayView =
            Boolean(displayOptions && displayOptions.showDailyPrayer) === Boolean(def.showDailyPrayer) &&
            selectedWidaseMaryamDay === def.selectedWidaseMaryamDay &&
            Boolean(displayOptions && displayOptions.showGateOfLight) === Boolean(def.showGateOfLight) &&
            Boolean(displayOptions && displayOptions.showYewediswaMelaekt !== false) === Boolean(def.showYewediswaMelaekt) &&
            JSON.stringify(selectedPsalms || []) === JSON.stringify(def.selectedPsalms || []) &&
            JSON.stringify(selectedPsalmVerseRanges || {}) === JSON.stringify(def.selectedPsalmVerseRanges || {}) &&
            JSON.stringify(selectedProphetSongs || []) === JSON.stringify(def.selectedProphetSongs || []) &&
            Boolean(showDailyLectionary) === Boolean(def.showDailyLectionary) &&
            Boolean(showSeatatReadings) === Boolean(def.showSeatatReadings) &&
            Boolean(showVespers) === Boolean(def.showVespers) &&
            Boolean(showPrepPsalms) === Boolean(def.showPrepPsalms) &&
            Boolean(showMatins) === Boolean(def.showMatins) &&
            Boolean(showTeklil) === false &&
            Boolean(isKidaseModeActive) === Boolean(def.isKidaseModeActive) &&
            Boolean(showAnaphora) === Boolean(def.showAnaphora) &&
            (selectedMiracleId || 'none') === (def.selectedMiracleId || 'none') &&
            Boolean(displayOptions && displayOptions.showSupplications) === Boolean(def.showSupplications);

        if (!isDefaultPrayView) return null;
        return 'Preset for Prayer: Daily Prayer, Theotokia, Psalter, Readings';
    }

    if (activePrimaryTab === 'liturgy') {
        const def = getLiturgyTabDefaultProfile();
        const isDefaultLiturgyView =
            Boolean(displayOptions && displayOptions.showDailyPrayer) === Boolean(def.showDailyPrayer) &&
            selectedWidaseMaryamDay === def.selectedWidaseMaryamDay &&
            Boolean(displayOptions && displayOptions.showGateOfLight) === Boolean(def.showGateOfLight) &&
            Boolean(displayOptions && displayOptions.showYewediswaMelaekt !== false) === Boolean(def.showYewediswaMelaekt) &&
            JSON.stringify(selectedPsalms || []) === JSON.stringify(def.selectedPsalms || []) &&
            JSON.stringify(selectedPsalmVerseRanges || {}) === JSON.stringify(def.selectedPsalmVerseRanges || {}) &&
            JSON.stringify(selectedProphetSongs || []) === JSON.stringify(def.selectedProphetSongs || []) &&
            Boolean(showDailyLectionary) === Boolean(def.showDailyLectionary) &&
            Boolean(showSeatatReadings) === Boolean(def.showSeatatReadings) &&
            selectedSeatatLectionaryDay === def.selectedSeatatLectionaryDay &&
            Boolean(showVespers) === Boolean(def.showVespers) &&
            Boolean(showPrepPsalms) === Boolean(def.showPrepPsalms) &&
            Boolean(showMatins) === Boolean(def.showMatins) &&
            Boolean(showTeklil) === false &&
            Boolean(isKidaseModeActive) === Boolean(def.isKidaseModeActive) &&
            Boolean(showAnaphora) === Boolean(def.showAnaphora) &&
            selectedAnaphora === def.selectedAnaphora &&
            (selectedMiracleId || 'none') === (def.selectedMiracleId || 'none') &&
            Boolean(displayOptions && displayOptions.showSupplications) === Boolean(def.showSupplications);

        if (!isDefaultLiturgyView) return null;
        const anaphoraLabel = def.selectedAnaphora === 'mary' ? 'Anaphora of Mary' : 'Anaphora of the Apostles';
        return `Preset for Liturgy: Daily Prayer, Vespers, Songs of the Prophets, Se\u2019atat Readings, Pre-Liturgy Psalms, Matins, Order of the Liturgy, ${anaphoraLabel}`;
    }

    return null;
}

function _renderPrayersSync() {
    if (!prayerDisplay || typeof prayers === 'undefined' || !Array.isArray(prayers)) return;
    if (displayOptions.presentationMode === 'slides' && !_pendingSlideReadingType && !_pendingSlideSignature && !_pendingSlideId) {
        const existingSlides = prayerDisplay.querySelectorAll('.prayer-card, .section-title.collapsible');
        const currentSlide = existingSlides[currentSlideIndex];
        if (currentSlide && currentSlide.dataset) {
            if (currentSlide.dataset.readingType) {
                _pendingSlideReadingType = currentSlide.dataset.readingType;
            } else if (currentSlide.dataset.prayerSignature) {
                _pendingSlideSignature = currentSlide.dataset.prayerSignature;
            }
        }
    }
    prayerDisplay.innerHTML = '';
    const activeLanguageCount = Object.values(displayedLanguages).filter(Boolean).length;
    if (activeLanguageCount === 0) {
        prayerDisplay.innerHTML = `<div class="empty-state-message"><p>Please select a language from the settings panel to begin.</p></div>`;
        return;
    }

    const presetSummaryText = getActivePrayerViewPresetSummary();
    if (presetSummaryText && displayOptions.presentationMode !== 'slides') {
        const presetSummaryEl = document.createElement('div');
        presetSummaryEl.className = 'section-metadata prayer-view-preset-summary';
        presetSummaryEl.innerHTML = `<i>${presetSummaryText}</i>`;
        prayerDisplay.appendChild(presetSummaryEl);
    }

    let lastSectionTitle = null;
    let currentNonCollapsibleTitleHtml = null;
    let currentParentGroupKey = null;
    let isCurrentParentGroupCollapsed = false;

    const addSectionTitle = (title, isCollapsible = true, metadata = null, options = {}) => {
        if (title && title !== lastSectionTitle) {
            if (title === "→ Prayer of Saint Ephraim: The Praises of Mary | ውዳሴ ማርያም") {
                hasRenderedPraiseOfMaryMainTitle = true;
            }
            const titleEl = document.createElement('h2');
            titleEl.classList.add('section-title');
            
            let actualTitle = title;
            let indentLevel = 0;
            if (actualTitle.startsWith("→ → → ")) {
                indentLevel = 3;
                actualTitle = actualTitle.substring(6);
            } else if (actualTitle.startsWith("→ → ")) {
                indentLevel = 2;
                actualTitle = actualTitle.substring(4);
            } else if (actualTitle.startsWith("→ ")) {
                indentLevel = 1;
                actualTitle = actualTitle.substring(2);
            }
            if (options && typeof options.indentLevel === 'number') {
                indentLevel = options.indentLevel;
            }

            if (indentLevel === 0 || (options && options.resetParentGroup)) {
                if (options && options.isParentGroup) {
                    currentParentGroupKey = title;
                } else {
                    currentParentGroupKey = null;
                    isCurrentParentGroupCollapsed = false;
                }
            }

            const stateKey = (indentLevel > 0 && currentParentGroupKey)
                ? `${currentParentGroupKey}::${title}`
                : title;

            titleEl.dataset.indentLevel = String(indentLevel);
            titleEl.dataset.stateKey = stateKey;
            if (options && options.isParentGroup) {
                titleEl.classList.add('parent-section-group');
                titleEl.dataset.isParentGroup = 'true';
            }
            
            const titleContent = document.createElement('div');
            titleContent.classList.add('sub-title-content');
            let formattedActualTitle = actualTitle.replace(/\(Theotokia\)/g, '<i>(Theotokia)</i>');
            const betaTheotokiaDays = ['Monday | ዘሰኑይ', 'Tuesday | ዘሠሉስ', 'Wednesday | ዘረቡዕ', 'Thursday | ዘሐሙስ', 'Friday | ዘዓርብ', 'Saturday | ዘቀዳሚት'];
            if (betaTheotokiaDays.includes(actualTitle) || actualTitle.includes('Anqetse Birhan')) {
                formattedActualTitle += ' <span class="theotokia-beta-badge" title="English translation in progress">BETA</span>';
            }
            if (options && options.feastBadgeLabel) {
                const badgeTitleAttr = options.feastBadgeTitle ? ` title="${String(options.feastBadgeTitle).replace(/"/g, '&quot;')}"` : '';
                formattedActualTitle += ` <span class="theotokia-beta-badge festal-reading-badge"${badgeTitleAttr}>${options.feastBadgeLabel}</span>`;
            }
            titleContent.innerHTML = formattedActualTitle;

            if (!isCollapsible) {
                titleEl.classList.add('non-collapsible');
                currentNonCollapsibleTitleHtml = formattedActualTitle;
                titleEl.appendChild(titleContent);
            } else {
                titleEl.classList.add('collapsible');
                if (currentNonCollapsibleTitleHtml && !(options && options.isParentGroup)) {
                    const parentHeader = document.createElement('div');
                    parentHeader.classList.add('parent-title-header');
                    parentHeader.innerHTML = currentNonCollapsibleTitleHtml;
                    titleEl.appendChild(parentHeader);
                    currentNonCollapsibleTitleHtml = null;
                }
                titleEl.appendChild(titleContent);
            }
            
            const subSections = [
                "Sunday | ዘእሁድ", "Monday | ዘሰኑይ", "Tuesday | ዘሠሉስ", 
                "Wednesday | ዘረቡዕ", "Thursday | ዘሐሙስ", "Friday | ዘዓርብ", 
                "Saturday | ዘቀዳሚት"
            ];
            const isPsalm = /^Psalm \d+/.test(actualTitle);
            const isProphetSong = typeof prophetSongs !== 'undefined' && prophetSongs.some(s => actualTitle.startsWith(s.name));
            if (indentLevel === 3) {
                titleEl.classList.add('sub-sub-sub-section-title');
            } else if (indentLevel === 2) {
                titleEl.classList.add('sub-sub-section-title');
            } else if (indentLevel === 1 || subSections.includes(actualTitle) || isPsalm || isProphetSong) {
                titleEl.classList.add('sub-section-title');
            }

            const slug = slugifyTitle(stateKey);
            const legacySlug = slugifyTitle(title);
            let isInitiallyCollapsed;
            if (typeof collapsedSections[stateKey] === 'boolean') {
                isInitiallyCollapsed = collapsedSections[stateKey];
            } else if (typeof collapsedSections[title] === 'boolean') {
                isInitiallyCollapsed = collapsedSections[title];
            } else if (typeof collapsedSections[slug] === 'boolean') {
                isInitiallyCollapsed = collapsedSections[slug];
            } else if (typeof collapsedSections[legacySlug] === 'boolean') {
                isInitiallyCollapsed = collapsedSections[legacySlug];
            } else if (options && typeof options.defaultCollapsed === 'boolean') {
                isInitiallyCollapsed = options.defaultCollapsed;
            } else {
                isInitiallyCollapsed = Boolean(areAllSectionsCollapsed);
            }

            if (options && options.isParentGroup) {
                isCurrentParentGroupCollapsed = isInitiallyCollapsed;
            }

            if (isCollapsible) {
                if (isInitiallyCollapsed) {
                    titleEl.classList.add('collapsed');
                }
                titleEl.addEventListener('click', () => {
                    // Do not allow collapsing/expanding in slides mode
                    if (displayOptions.presentationMode === 'slides') {
                        return;
                    }

                    const isCollapsed = titleEl.classList.toggle('collapsed');
                    if (prayerDisplay) {
                        prayerDisplay.querySelectorAll('.section-title.collapsible').forEach(hdr => {
                            const hdrKey = hdr.dataset.stateKey;
                            if (hdrKey) {
                                collapsedSections[hdrKey] = hdr.classList.contains('collapsed');
                            }
                        });
                    }
                    collapsedSections[stateKey] = isCollapsed;
                    if (stateKey === title) {
                        collapsedSections[title] = isCollapsed;
                    }
                    if (!isCollapsed) {
                        areAllSectionsCollapsed = false;
                    }
                    saveSettings();

                    if (titleEl.dataset.isParentGroup === 'true') {
                        let nextEl = titleEl.nextElementSibling;
                        let currentChildSeen = false;
                        let currentChildCollapsed = false;
                        while (nextEl) {
                            if (nextEl.classList.contains('section-title')) {
                                const nextIndent = parseInt(nextEl.dataset.indentLevel || '0', 10);
                                if (nextIndent === 0) break;
                                currentChildSeen = true;
                                currentChildCollapsed = nextEl.classList.contains('collapsed');
                                nextEl.style.display = isCollapsed ? 'none' : '';
                            } else {
                                if (currentChildSeen) {
                                    nextEl.style.display = (isCollapsed || currentChildCollapsed) ? 'none' : '';
                                } else {
                                    nextEl.style.display = isCollapsed ? 'none' : '';
                                }
                            }
                            nextEl = nextEl.nextElementSibling;
                        }
                    } else {
                        let nextEl = titleEl.nextElementSibling;
                        while (nextEl && !nextEl.classList.contains('section-title')) {
                            if (nextEl.classList.contains('expand-daily-prayer-preview-btn')) {
                                nextEl.style.display = isCollapsed ? '' : 'none';
                            } else if (nextEl.dataset && nextEl.dataset.dailyPreviewRole === 'first' && activePrimaryTab === 'pray') {
                                nextEl.style.display = '';
                            } else if (nextEl.dataset && nextEl.dataset.dailyPreviewRole === 'sneak-peek' && activePrimaryTab === 'pray') {
                                nextEl.style.display = '';
                                nextEl.classList.toggle('daily-prayer-sneak-peek-card', isCollapsed);
                            } else {
                                nextEl.style.display = isCollapsed ? 'none' : '';
                            }
                            nextEl = nextEl.nextElementSibling;
                        }
                    }
                    updateExpandCollapseAllIcon(true);
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

            if (indentLevel > 0 && isCurrentParentGroupCollapsed && displayOptions.presentationMode !== 'slides') {
                titleEl.style.display = 'none';
            }

            prayerDisplay.appendChild(titleEl);

            // This is a marker to help createPrayerCardElement know if it should be hidden
            const effectiveCollapsed = (indentLevel > 0 && isCurrentParentGroupCollapsed) || isInitiallyCollapsed;
            titleEl.dataset.isCollapsed = effectiveCollapsed;

            if (metadata) {
                const metadataEl = document.createElement('div');
                metadataEl.className = 'section-metadata';

                if (metadata.customElement) {
                    metadataEl.classList.add('section-metadata-interactive');
                    metadataEl.addEventListener('click', (e) => e.stopPropagation());
                    metadataEl.appendChild(metadata.customElement);
                } else {
                    let parts = [];
                    if (metadata.date) parts.push(metadata.date);
                    if (metadata.aka) parts.push(`Commonly known as: ${metadata.aka}`);
                    if (metadata.time) parts.push(`Time: ${metadata.time}`);
                    if (metadata.purpose) parts.push(`Purpose: ${metadata.purpose}`);

                    metadataEl.innerHTML = parts.join('<br>');
                }
                titleEl.appendChild(metadataEl);
            }

            if (title === "Daily Prayer | ዘዘወትር ጸሎት") {
                const iconImg = document.createElement('img');
                iconImg.src = 'img/Silus-Kidus.svg';
                iconImg.alt = 'Holy Trinity Icon';
                iconImg.classList.add('holy-trinity-icon'); // Add a class for styling
                if (effectiveCollapsed) iconImg.style.display = 'none';
                prayerDisplay.appendChild(iconImg);
            } else if (title === "→ Prayer of Saint Ephraim: The Praises of Mary | ውዳሴ ማርያም") {
                const iconImg = document.createElement('img');
                iconImg.src = 'img/Mary-Blesses-Ephraim.svg';
                iconImg.alt = 'Mary Blesses Ephraim Icon';
                iconImg.classList.add('section-icon');
                if (effectiveCollapsed) iconImg.style.display = 'none';
                prayerDisplay.appendChild(iconImg);
            } else if (title === "→ → → Thursday | ዘሐሙስ") {
                const iconImg = document.createElement('img');
                iconImg.src = 'img/Ephraim-and-Mary-on-Thursday.svg';
                iconImg.alt = 'Ephraim and Mary on Thursday Icon';
                iconImg.classList.add('section-icon');
                if (effectiveCollapsed) iconImg.style.display = 'none';
                prayerDisplay.appendChild(iconImg);
            } else if (title === "→ Prayer of Abba Giyorgis: The Angels Praise Mary | ይዌድስዋ መላእክት ለማርያም") {
                const iconImg = document.createElement('img');
                iconImg.src = 'img/Mary-with-her-beloved-Son.svg';
                iconImg.alt = 'Mary with her beloved Son Icon';
                iconImg.classList.add('section-icon');
                if (effectiveCollapsed) iconImg.style.display = 'none';
                prayerDisplay.appendChild(iconImg);
            } else if (title === "→ Opening Prayer | ነዓ ኀቤየ ዳዊት") {
                const iconImg = document.createElement('img');
                iconImg.src = 'img/Covenant-of-Mercy.svg';
                iconImg.alt = 'Covenant of Mercy Icon';
                iconImg.classList.add('section-icon');
                if (effectiveCollapsed) iconImg.style.display = 'none';
                prayerDisplay.appendChild(iconImg);
            } else if (title === "→ Closing Prayer | ሰአሊ ለነ ማርያም") {
                const iconImg = document.createElement('img');
                iconImg.src = 'img/Covenant-of-Mercy-with-Psalm.svg';
                iconImg.alt = 'Covenant of Mercy with Psalm Icon';
                iconImg.classList.add('section-icon');
                if (effectiveCollapsed) iconImg.style.display = 'none';
                prayerDisplay.appendChild(iconImg);
            }
            lastSectionTitle = stateKey;
            window.isRenderingCollapsed = effectiveCollapsed;
        }
    };

    const addSectionTitleIfNeeded = (prayer) => {
        const title = getSectionTitle(prayer);
        addSectionTitle(title, true, null, { defaultCollapsed: true });
    };

    // Reset rendering context at start of renderPrayers
    window.isRenderingCollapsed = false;

    const renderSequence = () => {
        const prayerSequence = getStandardPrayerSequence();
        prayerSequence.forEach(p => {
            const prayerCard = createPrayerCardElement(p, -1);
            prayerDisplay.appendChild(prayerCard);
        });
    };

    // Render main prayers (non-Psalms, non-Prophet Songs)
    const widaseMaryamChapters = {
        'Sunday': ['Sun', 'Anqetse Birhan', 'Angels'],
        'Monday': ['Mon', 'Anqetse Birhan', 'Angels'],
        'Tuesday': ['Tue', 'Anqetse Birhan', 'Angels'],
        'Wednesday': ['Wed', 'Anqetse Birhan', 'Angels'],
        'Thursday': ['Thurs', 'Anqetse Birhan', 'Angels'],
        'Friday': ['Fri', 'Anqetse Birhan', 'Angels'],
        'Saturday': ['Sat', 'Anqetse Birhan', 'Angels']
    };

    const mainPrayers = prayers.filter(p => {
        if (p.chapter === 'Psalms' || p.chapter === 'ProphetSong') return false;

        // Hide Trinitarian Invocation card (Daily-0) by default unless explicitly toggled on in Advanced Display Options
        if (p.chapter === 'Daily' && String(p.stanza) === '0') {
            return Boolean(displayOptions.showTrinitarianInvocation);
        }

        // Include Daily stanzas 11 and 12 (Praise of Mary intro cards) if any Praise of Mary day is selected
        if (p.chapter === 'Daily' && (p.stanza === '11' || p.stanza === '12')) {
            return selectedWidaseMaryamDay !== 'None';
        }

        // Always include Daily prayers (stanzas 0-10)
        if (p.chapter === 'Daily') return displayOptions.showDailyPrayer;

        if (p.chapter === 'Anqetse Birhan' && !displayOptions.showGateOfLight) return false;
        if (p.chapter === 'Angels' && displayOptions.showYewediswaMelaekt === false) return false;

        // Filter Praise of Mary (and related) based on selection
        if (selectedWidaseMaryamDay === 'None') return false;
        if (selectedWidaseMaryamDay === 'All') return true;

        const targetChapters = widaseMaryamChapters[selectedWidaseMaryamDay] || [];
        return targetChapters.includes(p.chapter);
    });

    // Traditional liturgical ordering: Gate of Light (Anqetse Birhan) ALWAYS before The Angels Praise Mary (Angels)
    const chapterOrder = {
        'Daily': 1,
        'Mon': 2,
        'Tue': 3,
        'Wed': 4,
        'Thurs': 5,
        'Fri': 6,
        'Sat': 7,
        'Sun': 8,
        'Anqetse Birhan': 9,
        'Angels': 10
    };
    
    const mapped = mainPrayers.map((el, i) => {
        let ch = (el.chapter || '').trim();
        if (ch === 'Thursday') ch = 'Thurs';
        return { index: i, value: el, order: chapterOrder[ch] || 99 };
    });
    
    mapped.sort((a, b) => {
        if (a.order !== b.order) {
            return a.order - b.order;
        }
        return a.index - b.index; // Guaranteed stable sort
    });
    
    mainPrayers.length = 0;
    mapped.forEach(item => mainPrayers.push(item.value));

    let hasRenderedTheotokiaTitle = false;
    let hasRenderedPraiseOfMaryMainTitle = false;

    mainPrayers.forEach((prayer, prayerIndex) => {
        const isTheotokia = (prayer.chapter === 'Daily' && (prayer.stanza === '11' || prayer.stanza === '12')) || 
                            ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Angels', 'Anqetse Birhan'].includes(prayer.chapter);

        const isPraiseOfMaryDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'].includes(prayer.chapter);

        if (isTheotokia && !hasRenderedTheotokiaTitle && selectedWidaseMaryamDay !== 'None') {
            addSectionTitle("<i>Theotokia</i> — The Praises of the Mother of God", false, null, { resetParentGroup: true });
            hasRenderedTheotokiaTitle = true;
        }

        if (isPraiseOfMaryDay && !hasRenderedPraiseOfMaryMainTitle && selectedWidaseMaryamDay !== 'None') {
            addSectionTitle("→ Prayer of Saint Ephraim: The Praises of Mary | ውዳሴ ማርያም", true, null, { defaultCollapsed: true });
            hasRenderedPraiseOfMaryMainTitle = true;
        }

        if (prayer.chapter === 'Daily' && prayer.stanza === '0') {
            const prayerCard = createPrayerCardElement(prayer, prayerIndex);
            prayerDisplay.appendChild(prayerCard);
            addSectionTitleIfNeeded(prayer);
        } else {
            addSectionTitleIfNeeded(prayer);
            const prayerCard = createPrayerCardElement(prayer, prayerIndex);
            prayerDisplay.appendChild(prayerCard);

            const isDailyFirstCard = prayer.chapter === 'Daily' && prayer.stanza === '1' && (prayer.english || '').includes('I seal my face');
            const isDailySneakPeekCard = prayer.chapter === 'Daily' && prayer.stanza === '1' && (prayer.english || '').startsWith('In the Holy Trinity');
            if (isDailyFirstCard) {
                prayerCard.dataset.dailyPreviewRole = 'first';
            } else if (isDailySneakPeekCard) {
                prayerCard.dataset.dailyPreviewRole = 'sneak-peek';
            }

            const isCurrentSectionCollapsed = Boolean(window.isRenderingCollapsed);
            if (displayOptions.presentationMode !== 'slides' && isCurrentSectionCollapsed) {
                // On the Pray tab, keep the 1st Daily card ("I seal my face...") visible and the 2nd ("In the Holy Trinity...") as a sneak peek
                if (isDailyFirstCard && activePrimaryTab === 'pray') {
                    prayerCard.style.display = '';
                } else if (isDailySneakPeekCard && activePrimaryTab === 'pray') {
                    prayerCard.style.display = '';
                    prayerCard.classList.add('daily-prayer-sneak-peek-card');
                    const expandPreviewBtn = document.createElement('button');
                    expandPreviewBtn.type = 'button';
                    expandPreviewBtn.className = 'expand-daily-prayer-preview-btn';
                    expandPreviewBtn.textContent = 'Expand Full Daily Prayer';
                    expandPreviewBtn.addEventListener('click', () => {
                        let prev = expandPreviewBtn.previousElementSibling;
                        while (prev && !prev.classList.contains('section-title')) {
                            prev = prev.previousElementSibling;
                        }
                        if (prev && prev.classList.contains('collapsed')) {
                            prev.click();
                        }
                    });
                    prayerDisplay.appendChild(expandPreviewBtn);
                } else {
                    prayerCard.style.display = 'none';
                }
            }
        }
    });

    // Render Vespers (Sunset Prayer) BEFORE Songs of the Prophets & Se'atat when toggled ON
    if (showVespers) {
        renderSelectedKidase(addSectionTitle, { onlyVespers: true });
    }

    // Conditionally render Psalm-related prayers
    const psalmsRendered = selectedPsalms.length > 0 && bibleData.loaded;
    const prophetSongsRendered = selectedProphetSongs.length > 0;

    if (psalmsRendered || prophetSongsRendered) {
        const psalmsOrProphetsTitle = (!psalmsRendered && prophetSongsRendered)
            ? "Songs of the Prophets | መኃልየ ነቢያት"
            : "Psalms | መዝሙር ዘዳዊት";
        const isProphetsOnlyGroup = (!psalmsRendered && prophetSongsRendered);
        addSectionTitle(psalmsOrProphetsTitle, isProphetsOnlyGroup, null, isProphetsOnlyGroup ? { isParentGroup: true, defaultCollapsed: true } : { resetParentGroup: true });

        // Inject preset combination subtitle if matched
        const stringifiedSelectedPsalms = JSON.stringify(selectedPsalms);
        const stringifiedSelectedProphetSongs = JSON.stringify(selectedProphetSongs);
        const stringifiedSelectedVerseRanges = JSON.stringify(selectedPsalmVerseRanges || {});
        let matchedCombinationName = null;
        for (const [key, combo] of Object.entries(PSALM_COMBINATIONS)) {
            if (JSON.stringify(combo.psalms || []) === stringifiedSelectedPsalms && 
                JSON.stringify(combo.prophetSongs || []) === stringifiedSelectedProphetSongs &&
                JSON.stringify(combo.verseRanges || {}) === stringifiedSelectedVerseRanges) {
                matchedCombinationName = combo.name;
                break;
            }
        }
        
        if (matchedCombinationName) {
            const subtitleEl = document.createElement('div');
            subtitleEl.classList.add('section-metadata');
            subtitleEl.style.marginTop = '-0.25rem';
            subtitleEl.style.marginBottom = '1.5rem';
            subtitleEl.style.color = 'var(--speaker-label-color)';
            subtitleEl.innerHTML = `<i>Preset: ${matchedCombinationName}</i>`;
            if (isCurrentParentGroupCollapsed && displayOptions.presentationMode !== 'slides') {
                subtitleEl.style.display = 'none';
            }
            prayerDisplay.appendChild(subtitleEl);
        }

        const psalmIntroPrayers = prayers.filter(p => p.chapter === 'Psalms' && p.stanza === 'Intro');
        if (psalmIntroPrayers.length > 0) {
            addSectionTitle(getSectionTitle(psalmIntroPrayers[0]), true, null, { defaultCollapsed: true });
            psalmIntroPrayers.forEach(prayer => {
                const prayerCard = createPrayerCardElement(prayer, -1);
                prayerDisplay.appendChild(prayerCard);
                if (displayOptions.presentationMode !== 'slides' && window.isRenderingCollapsed) {
                    prayerCard.style.display = 'none';
                }
            });
        }
    }

    if (psalmsRendered) {
        renderSelectedPsalmsWithDoxology((psalmNum, verseRange) => {
            let athMetadata = null;
            if (typeof ST_ATHANASIUS_PSALMS_GUIDE !== 'undefined') {
                const athEntries = ST_ATHANASIUS_PSALMS_GUIDE.filter(e => e.psalms.includes(psalmNum));
                if (athEntries.length > 0) {
                    const descList = athEntries.map(e => e.prescription).join(' ');
                    athMetadata = { athanasius: descList };
                }
            }
            const engRangeSuffix = verseRange ? `:${verseRange.start}-${verseRange.end}` : '';
            const geezRangeSuffix = verseRange ? `፥${toGeez(verseRange.start)}-${toGeez(verseRange.end)}` : '';
            addSectionTitle(`→ Psalm ${psalmNum}${engRangeSuffix} | መዝሙር ዘዳዊት ${toGeez(psalmNum)}${geezRangeSuffix}`, true, athMetadata, { defaultCollapsed: true });
        });
    }

    // Conditionally render Prophet Songs
    if (prophetSongsRendered) {
        renderSelectedProphetSongs((song) => {
            const title = `→ ${song.name} ${song.verseRange || ''}`;
            addSectionTitle(title, true, { aka: song.aka, time: song.time, purpose: song.purpose }, { defaultCollapsed: true });
        });
    }

    // Render Conclusion if Psalms or Prophet Songs were rendered
    if (psalmsRendered || prophetSongsRendered) {
        const closingPrayers = prayers.filter(p => p.chapter === 'Psalms' && p.stanza === 'Closing');
        if (closingPrayers.length > 0) {
            addSectionTitle(getSectionTitle(closingPrayers[0]), true, null, { defaultCollapsed: true });
            closingPrayers.forEach(prayer => {
                const prayerCard = createPrayerCardElement(prayer, -1);
                prayerDisplay.appendChild(prayerCard);
                if (displayOptions.presentationMode !== 'slides' && window.isRenderingCollapsed) {
                    prayerCard.style.display = 'none';
                }
            });
        }
    }

    // Render Daily Lectionary immediately after the Psalms section (before Supplications & Se'atat)
    renderDailyLectionarySection(addSectionTitle);

    // Render Supplicatory Prayers immediately at the end of the Closing Prayer of the Psalms (before Se'atat & Liturgy sections)
    if (displayOptions.showSupplications) {
        const supplications = getSupplicatoryPrayers();
        addSectionTitle("Supplications | ምሕላ", true, null, { resetParentGroup: true, defaultCollapsed: true });
        supplications.forEach((prayer, index) => {
            const prayerCard = createPrayerCardElement(prayer, index);
            prayerDisplay.appendChild(prayerCard);
            if (displayOptions.presentationMode !== 'slides' && window.isRenderingCollapsed) {
                prayerCard.style.display = 'none';
            }
        });
    }

    // Render Se'atat Lectionary Scripture Readings
    renderSelectedSeatatLectionary(addSectionTitle);

    // Render Preparatory Psalms, Matins, Order of the Liturgy, and Anaphora (Vespers already rendered above)
    renderSelectedKidase(addSectionTitle, { skipVespers: true });

    // Always render the standard prayer sequence at the very end
    renderSequence();

    // Final setup for slides and search
    if (displayOptions.presentationMode === 'slides') {
        setupSlides();
        adjustSlideFontSize();
    } else {
        removeSlides();
    }
    updateExpandCollapseAllIcon(true);
    updateSearchMatches();
}


function smoothRender(callback) {
    prayerDisplay.classList.add('is-transitioning');
    setTimeout(() => {
        renderPrayers();
        if (callback) callback();
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
    const kidaseChapters = ['Kidan', 'order', 'Apostles', 'St.Mary', 'Chrysostom', 'The300', 'mary', 'apostles'];
    const chapterStr = prayer.chapter || '';
    const isNumericChapter = /^\d+$/.test(chapterStr);
    const isKidaseCard = isNumericChapter || kidaseChapters.some(c => c.toLowerCase() === chapterStr.toLowerCase());
    let seenNonKidaseSpanish = false;

    languageOrder.forEach(langKey => {
        const langCfg = LANGUAGE_REGISTRY[langKey] || { category: 'main' };
        if (langCfg.category === 'unofficial' && !isScribeLoggedIn) return;

        let rawText = (!isKidaseCard && langKey === 'spanish_pr') ? (prayer.spanish_pr || prayer.spanish) : prayer[langKey];
        if (displayedLanguages[langKey] && rawText && rawText.trim()) {
            // Check for actual content
            if (!hasActualContent(rawText, langKey)) return;

            if (!isKidaseCard && (langKey === 'spanish' || langKey === 'spanish_pr')) {
                if (seenNonKidaseSpanish) return;
                seenNonKidaseSpanish = true;
            }

            const headerLabel = (!isKidaseCard && (langKey === 'spanish' || langKey === 'spanish_pr'))
                ? 'Español (Spanish)'
                : languageLabels[langKey];
            textToCopy += `--- ${headerLabel} ---\n`;
            // Format for clipboard: replace <br> with newlines, strip HTML and replace placeholders
            let cleanText = rawText.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>?/gm, '');
            cleanText = formatPrayerText(cleanText, langKey, null, false, prayer.chapter, prayer.stanza);

            cleanText = cleanText.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>?/gm, '');

            // Append Ge'ez Phonetics for chants if option is on
            if (langKey === 'geez_script' && displayOptions.showGeezPhoneticChants && isChantStanza(prayer)) {
                const rawPhoneticText = prayer['geez_phonetic'];
                if (rawPhoneticText && rawPhoneticText.trim()) {
                    const phoneticText = filterGeezPhoneticForPeople(rawPhoneticText, prayer);
                    if (phoneticText && phoneticText.trim()) {
                        let cleanPhonetic = phoneticText.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>?/gm, '');
                        cleanPhonetic = formatPrayerText(cleanPhonetic, 'geez_phonetic', null, false, prayer.chapter, prayer.stanza);
                        cleanPhonetic = cleanPhonetic.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>?/gm, '');
                        cleanText += `\n(${cleanPhonetic})`;
                    }
                }
            }

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
    if (lxxChapter === 151) {
        labelText = `Psalm 151:${verse.verseNum}`;
    } else if (lxxChapter == verse.mtChapter && (!verse.mtVerseNum || verse.verseNum == verse.mtVerseNum)) {
        labelText = `Psalm ${lxxChapter}:${verse.verseNum}`;
    } else if (lxxChapter == verse.mtChapter) {
        labelText = `Psalm ${lxxChapter}:${verse.verseNum} (${verse.mtVerseNum})`;
    } else if (!verse.mtVerseNum || verse.verseNum == verse.mtVerseNum) {
        labelText = `Psalm ${lxxChapter} (${verse.mtChapter}):${verse.verseNum}`;
    } else {
        labelText = `Psalm ${lxxChapter}:${verse.verseNum} (${verse.mtChapter}:${verse.mtVerseNum})`;
    }

    textToCopy += `፨ ${labelText} ፨\n\n`;

    if (displayedLanguages.english && (verse.kjv || verse.nkjv)) {
        textToCopy += `--- English ---\n`;
        textToCopy += `[${verse.verseNum}] ${verse.kjv || verse.nkjv}\n\n`;
    }
    if (displayedLanguages.geez_script && verse.geez_psalms) {
        textToCopy += `--- ግእዝ ---\n`;
        textToCopy += `[${verse.verseNum}] ${verse.geez_psalms}\n\n`;
    }
    if (displayedLanguages.amharic_script && verse.am54) {
        textToCopy += `--- አማርኛ ---\n`;
        textToCopy += `[${verse.verseNum}] ${verse.am54}\n\n`;
    }
    if (displayedLanguages.tigrinya_script && verse.tigrinya_script) {
        textToCopy += `--- ትግርኛ ---\n`;
        textToCopy += `[${verse.verseNum}] ${verse.tigrinya_script}\n\n`;
    }
    if (displayedLanguages.coptic && verse.coptic) {
        textToCopy += `--- ϯⲙⲉⲧⲣⲉⲙⲛ̀ⲭⲏⲙⲓ ---\n`;
        textToCopy += `[${verse.verseNum}] ${verse.coptic}\n\n`;
    }
    if ((displayedLanguages.spanish || displayedLanguages.spanish_pr) && verse.rgv) {
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
    // If a pending slide target was set (e.g. from "Enter Slides" button or Lectionary "Go" button),
    // resolve it so it survives DOM rebuilds from async re-renders.
    if (_pendingSlideReadingType) {
        const targetCard = prayerDisplay.querySelector(`.prayer-card[data-reading-type="${_pendingSlideReadingType}"]`);
        if (targetCard) {
            const allSlides = Array.from(prayerDisplay.querySelectorAll('.prayer-card, .section-title.collapsible'));
            const idx = allSlides.indexOf(targetCard);
            if (idx !== -1) {
                currentSlideIndex = idx;
            }
        }
    } else if (_pendingSlideSignature) {
        const allSlides = Array.from(prayerDisplay.querySelectorAll('.prayer-card, .section-title.collapsible'));
        const targetCard = allSlides.find(c => c.dataset && c.dataset.prayerSignature === _pendingSlideSignature);
        if (targetCard) {
            const idx = allSlides.indexOf(targetCard);
            if (idx !== -1) {
                currentSlideIndex = idx;
            }
        }
    } else if (_pendingSlideId) {
        let targetCard = null;
        if (_pendingSlidePredicate && typeof _pendingSlidePredicate === 'function') {
            const matchingCards = Array.from(prayerDisplay.querySelectorAll(`.prayer-card[data-card-id="${_pendingSlideId}"]`));
            targetCard = matchingCards.find(_pendingSlidePredicate) || matchingCards[0];
        } else {
            targetCard = prayerDisplay.querySelector(`.prayer-card[data-card-id="${_pendingSlideId}"]`);
        }
        if (targetCard) {
            const allSlides = Array.from(prayerDisplay.querySelectorAll('.prayer-card, .section-title.collapsible'));
            const idx = allSlides.indexOf(targetCard);
            if (idx !== -1) {
                currentSlideIndex = idx;
            }
        }
    }
    showSlide(currentSlideIndex);
}

function removeSlides() {
    prayerDisplay.style.transform = '';
    prayerDisplay.className = '';
    document.querySelectorAll('.prayer-card, .section-title.collapsible').forEach(el => el.classList.remove('active-slide'));
    document.querySelectorAll('.language-text').forEach(p => p.style.fontSize = '');
}

function showSlide(index) {
    const slides = prayerDisplay.querySelectorAll('.prayer-card, .section-title.collapsible');
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
    _pendingSlideSignature = null;
    _pendingSlideReadingType = null;
    _pendingSlideId = null;
    _pendingSlidePredicate = null;
    const slides = prayerDisplay.querySelectorAll('.prayer-card, .section-title.collapsible');
    if (slides.length > 0) {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        showSlide(currentSlideIndex);
    }
}

function prevSlide() {
    _pendingSlideSignature = null;
    _pendingSlideReadingType = null;
    _pendingSlideId = null;
    _pendingSlidePredicate = null;
    const slides = prayerDisplay.querySelectorAll('.prayer-card, .section-title.collapsible');
    if (slides.length > 0) {
        currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
        showSlide(currentSlideIndex);
    }
}

/**
 * Switch the Liturgy Day setting and navigate directly to a target prayer card.
 * @param {string} newDay - 'sunday' | 'saturday' | 'weekday'
 * @param {string} targetCardId - e.g. '2-74', '2-75', '3-119'
 * @param {Function} [predicate] - Optional filter function for matching cards
 */
function switchKidaseDayAndNavigate(newDay, targetCardId, predicate) {
    selectedKidaseDay = newDay;
    if (kidaseDaySelector) {
        kidaseDaySelector.value = newDay;
    }

    if (displayOptions.presentationMode === 'slides') {
        _pendingSlideSignature = null;
        _pendingSlideReadingType = null;
        _pendingSlideId = targetCardId;
        _pendingSlidePredicate = predicate;
    }

    saveSettings();
    smoothRender(() => {
        if (displayOptions.presentationMode !== 'slides') {
            navigateToCard(targetCardId, predicate);
        }
    });
}

/**
 * Navigate to a prayer card by its chapter-stanza ID (e.g. 'The300-1', '4-33').
 * Works in both scroll mode (scrollIntoView) and slides mode (jump to slide).
 * @param {string} targetCardId - e.g. '2-74', '2-75', '3-119'
 * @param {Function} [predicate] - Optional filter function for disambiguating multiple matching cards
 */
function navigateToCard(targetCardId, predicate) {
    let targetCard = null;
    if (predicate && typeof predicate === 'function') {
        const matchingCards = Array.from(prayerDisplay.querySelectorAll(`.prayer-card[data-card-id="${targetCardId}"]`));
        targetCard = matchingCards.find(predicate) || matchingCards[0];
    } else {
        targetCard = prayerDisplay.querySelector(`.prayer-card[data-card-id="${targetCardId}"]`);
    }
    if (!targetCard) return;

    if (displayOptions.presentationMode === 'slides') {
        _pendingSlideSignature = null;
        _pendingSlideReadingType = null;
        // In slides mode: find the slide index and jump to it
        const allSlides = Array.from(prayerDisplay.querySelectorAll('.prayer-card, .section-title.collapsible'));
        const slideIdx = allSlides.indexOf(targetCard);
        if (slideIdx !== -1) {
            currentSlideIndex = slideIdx;
            showSlide(currentSlideIndex);
        }
    } else {
        // In scroll mode: expand collapsed sections, unhide card, scroll to it
        // Ensure the target card's section is expanded
        if (targetCard.style.display === 'none') {
            // Find the parent section title and expand it
            let prev = targetCard.previousElementSibling;
            while (prev && !prev.classList.contains('section-title')) {
                prev = prev.previousElementSibling;
            }
            if (prev && prev.classList.contains('collapsible') && prev.classList.contains('collapsed')) {
                prev.click(); // Expand the section
            }
        }
        // Small delay to allow DOM to settle after expansion
        requestAnimationFrame(() => {
            targetCard.scrollIntoView({ block: 'center', behavior: 'smooth' });
            // Brief highlight effect
            targetCard.classList.add('nav-highlight');
            setTimeout(() => targetCard.classList.remove('nav-highlight'), 1500);
        });
    }
}

let slideFontSizeCache = new Map();
let presizeIdleCallbackId = null;
let resizeDebounceTimer = null;

/**
 * Cancels any pending background pre-sizing work.
 */
function cancelPendingPresize() {
    if (presizeIdleCallbackId !== null) {
        if (typeof cancelIdleCallback === 'function') {
            cancelIdleCallback(presizeIdleCallbackId);
        } else {
            clearTimeout(presizeIdleCallbackId);
        }
        presizeIdleCallbackId = null;
    }
}

/**
 * Pre-sizes nearby slides in the background using requestIdleCallback.
 * Expands outward from the current index: +1, -1, +2, -2, ...
 * Each callback sizes one card to avoid blocking the main thread.
 */
function presizeNearbySlides(slides, centerIndex) {
    // Build the list of card indices to pre-size, expanding outward
    const toPresize = [];
    for (let offset = 1; offset < slides.length; offset++) {
        const ahead = centerIndex + offset;
        const behind = centerIndex - offset;
        if (ahead < slides.length) toPresize.push(ahead);
        if (behind >= 0) toPresize.push(behind);
    }

    let queueIndex = 0;

    function presizeNext(deadline) {
        // Process cards while we have idle time (or at least one per callback)
        while (queueIndex < toPresize.length) {
            const card = slides[toPresize[queueIndex]];
            queueIndex++;

            // Only size prayer cards (skip section titles)
            if (!card || !card.classList.contains('prayer-card')) continue;
            if (card.style.display === 'none') continue;

            // Skip if already cached
            if (slideFontSizeCache.has(card)) continue;

            sizeOneCard(card);

            // If we've used our idle time, yield and come back
            if (typeof deadline !== 'undefined' && deadline.timeRemaining() < 5) {
                presizeIdleCallbackId = requestIdleCallbackCompat(presizeNext);
                return;
            }
        }
        // All done
        presizeIdleCallbackId = null;
    }

    presizeIdleCallbackId = requestIdleCallbackCompat(presizeNext);
}

/**
 * requestIdleCallback with setTimeout fallback for older browsers.
 */
function requestIdleCallbackCompat(callback) {
    if (typeof requestIdleCallback === 'function') {
        return requestIdleCallback(callback, { timeout: 2000 });
    }
    // Fallback: use setTimeout with a fake deadline
    return setTimeout(() => {
        callback({ timeRemaining: () => 50 });
    }, 50);
}

/**
 * Main orchestrator: sizes the active card synchronously, then pre-sizes
 * nearby slides in the background. Replaces the old all-at-once approach.
 */
function adjustSlideFontSize() {
    if (displayOptions.presentationMode !== 'slides' || !displayOptions.dynamicFontSizing) {
        document.querySelectorAll('.language-text').forEach(p => { p.style.fontSize = ''; });
        return;
    }

    // Cancel any pending background pre-sizing
    cancelPendingPresize();

    // Size ONLY the active card synchronously
    const slides = prayerDisplay.querySelectorAll('.prayer-card, .section-title.collapsible');
    const activeCard = slides[currentSlideIndex];
    if (activeCard && activeCard.classList.contains('prayer-card')) {
        sizeOneCard(activeCard);
    }

    // Pre-size nearby slides in background during idle time
    presizeNearbySlides(slides, currentSlideIndex);
}

/**
 * Clears the font size cache. Called on resize, re-render, or settings changes.
 */
function clearSlideFontSizeCache() {
    slideFontSizeCache = new Map();
}

/**
 * Sizes a single prayer card using the original binary search algorithm.
 * Checks the cache first; stores results in cache after computation.
 * This is synchronous — ~280ms per card is acceptable for the active card.
 */
function sizeOneCard(card) {
    // Cache hit — apply cached sizes and return immediately
    if (slideFontSizeCache.has(card)) {
        const cached = slideFontSizeCache.get(card);
        cached.sizes.forEach(item => {
            item.textP.style.fontSize = item.size + 'px';
        });
        return;
    }

    const prayerContent = card.querySelector('.prayer-content');
    if (!prayerContent) return;

    const langSections = card.querySelectorAll('.language-section');
    if (langSections.length === 0) return;

    // Reset sizes
    langSections.forEach(section => {
        const textP = section.querySelector('p.language-text');
        if (textP) textP.style.fontSize = '12px';
    });

    const isColumn = prayerContent.classList.contains('layout-column');
    let bestSizes = [];

    const isCompactLandscape = typeof window !== 'undefined' && window.innerHeight <= 550 && window.innerWidth > window.innerHeight;
    const HEIGHT_BUFFER = isCompactLandscape ? 10 : 48; // Pixels buffer to prevent clipping descenders/labels

    if (isColumn) {
        // Column Layout: Each column is independent
        let minOverallBest = 250;
        langSections.forEach(section => {
            const textP = section.querySelector('p.language-text');
            if (!textP) return;

            let minSize = 12, maxSize = 250, bestSize = minSize;
            while (minSize <= maxSize) {
                let midSize = Math.floor((minSize + maxSize) / 2);
                textP.style.fontSize = midSize + 'px';
                if (textP.scrollHeight <= (prayerContent.clientHeight - HEIGHT_BUFFER) && textP.scrollWidth <= section.clientWidth) {
                    bestSize = midSize;
                    minSize = midSize + 1;
                } else {
                    maxSize = midSize - 1;
                }
            }
            bestSizes.push({ textP, size: bestSize });
            if (bestSize < minOverallBest) minOverallBest = bestSize;
        });

        if (displayOptions.forceUniformFontSize) {
            bestSizes.forEach(item => { item.size = minOverallBest; item.textP.style.fontSize = minOverallBest + 'px'; });
        } else {
            bestSizes.forEach(item => item.textP.style.fontSize = item.size + 'px');
        }

    } else {
        // Row Layout: Packed together, maximize to fill container height
        if (displayOptions.forceUniformFontSize) {
            let minSize = 12, maxSize = 250, bestSize = minSize;
            while (minSize <= maxSize) {
                let midSize = Math.floor((minSize + maxSize) / 2);
                langSections.forEach(s => {
                    const p = s.querySelector('p.language-text');
                    if (p) p.style.fontSize = midSize + 'px';
                });

                const widthOverflow = Array.from(langSections).some(s => {
                    const p = s.querySelector('p.language-text');
                    return p && p.scrollWidth > s.clientWidth;
                });
                const heightOverflow = prayerContent.scrollHeight > (prayerContent.clientHeight - HEIGHT_BUFFER);

                if (!widthOverflow && !heightOverflow) {
                    bestSize = midSize;
                    minSize = midSize + 1;
                } else {
                    maxSize = midSize - 1;
                }
            }
            langSections.forEach(s => {
                const p = s.querySelector('p.language-text');
                if (p) {
                    p.style.fontSize = bestSize + 'px';
                    bestSizes.push({ textP: p, size: bestSize });
                }
            });
        } else {
            // Independent Growth Loop for rows to maximize space usage
            let currentSizes = new Array(langSections.length).fill(12);
            let growing = true;
            const maxAvailableHeight = prayerContent.clientHeight;

            if (maxAvailableHeight > 0) {
                while (growing) {
                    growing = false;
                    for (let i = 0; i < langSections.length; i++) {
                        const section = langSections[i];
                        const textP = section.querySelector('p.language-text');
                        if (!textP) continue;

                        if (currentSizes[i] >= 300) continue;

                        const nextSize = currentSizes[i] + 1;
                        textP.style.fontSize = nextSize + 'px';

                        // Check if this section overflows its width or the total container overflows height
                        // Use a small buffer to prevent clipping of labels and descenders
                        if (textP.scrollWidth <= section.clientWidth && prayerContent.scrollHeight <= (maxAvailableHeight - HEIGHT_BUFFER)) {
                            currentSizes[i] = nextSize;
                            growing = true;
                        } else {
                            textP.style.fontSize = currentSizes[i] + 'px'; // Revert
                        }
                    }
                }
            }
            // Store final sizes for cache
            for (let i = 0; i < langSections.length; i++) {
                const textP = langSections[i].querySelector('p.language-text');
                if (textP) bestSizes.push({ textP, size: currentSizes[i] });
            }
        }
    }

    // Store in cache
    slideFontSizeCache.set(card, { sizes: bestSizes });
}

// --- Search Functionality ---
function updateSearchMatches() {
    searchMatches = prayerDisplay.querySelectorAll('.highlight');
    if (searchCount) {
        searchCount.textContent = searchMatches.length > 0 ? `${currentMatchIndex + 1}/${searchMatches.length}` : '0/0';
    }

    searchMatches.forEach((match, index) => {
        match.classList.toggle('current', index === currentMatchIndex);
    });

    if (currentMatchIndex > -1 && searchMatches[currentMatchIndex]) {
        const currentEl = searchMatches[currentMatchIndex];
        const parentCard = currentEl.closest('.prayer-card');
        if (parentCard && parentCard.style.display === 'none') {
            parentCard.style.display = '';
        }
        currentEl.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

function renderGlobalCorpusSearchResults(query) {
    if (!searchResultsDrawer) return;
    const trimmed = (query || '').trim().toLowerCase();
    if (!trimmed || (searchScopeSelect && searchScopeSelect.value !== 'all')) {
        searchResultsDrawer.style.display = 'none';
        searchResultsDrawer.innerHTML = '';
        return;
    }

    const tokens = trimmed.split(/\s+/).filter(Boolean);
    const results = [];
    const maxResults = 35;

    if (typeof prayers !== 'undefined' && Array.isArray(prayers)) {
        for (const p of prayers) {
            const combined = `${p.english || ''} ${p.geez_script || ''} ${p.amharic_script || ''} ${p.reference || ''} ${p.chapter || ''}`.toLowerCase();
            if (tokens.every(tok => combined.includes(tok))) {
                results.push({
                    category: p.chapter === 'Daily' ? 'Daily Prayer' : `Theotokia (${p.chapter})`,
                    title: p.reference || `${p.chapter} ${p.stanza || ''}`,
                    snippet: (p.english || p.geez_script || p.amharic_script || '').substring(0, 140),
                    action: () => {
                        if (p.chapter === 'Daily') {
                            displayOptions.showDailyPrayer = true;
                        } else if (['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'].includes(p.chapter)) {
                            selectedWidaseMaryamDay = p.chapter;
                        } else if (p.chapter === 'Angels') {
                            displayOptions.showYewediswaMelaekt = true;
                        } else if (p.chapter === 'Anqetse Birhan') {
                            displayOptions.showGateOfLight = true;
                        }
                        areAllSectionsCollapsed = false;
                        collapsedSections = {};
                        updateAllTogglesInSettingsPanel();
                        saveSettings();
                        renderPrayers();
                        updateSearchMatches();
                        searchResultsDrawer.style.display = 'none';
                    }
                });
                if (results.length >= maxResults) break;
            }
        }
    }

    if (results.length < maxResults && typeof MIRACLES_OF_MARY !== 'undefined') {
        for (const m of MIRACLES_OF_MARY) {
            const trText = (m.translations || []).map(t => t.text).join(' ');
            const combined = `${m.title || ''} ${m.incipit || ''} ${trText}`.toLowerCase();
            if (tokens.every(tok => combined.includes(tok))) {
                results.push({
                    category: `Miracle of Mary #${m.id}`,
                    title: m.title || `Miracle ${m.id}`,
                    snippet: (m.translations && m.translations[0] ? m.translations[0].text : '').substring(0, 140),
                    action: () => {
                        selectedMiracleId = m.id;
                        areAllSectionsCollapsed = false;
                        collapsedSections = {};
                        updateSelectedMiracleUI();
                        saveSettings();
                        renderPrayers();
                        updateSearchMatches();
                        searchResultsDrawer.style.display = 'none';
                    }
                });
                if (results.length >= maxResults) break;
            }
        }
    }

    if (results.length < maxResults && typeof kidaseData !== 'undefined' && Array.isArray(kidaseData.order)) {
        for (const k of kidaseData.order) {
            const combined = `${k.english || ''} ${k.geez_script || ''} ${k.amharic_script || ''} ${k.reference || ''}`.toLowerCase();
            if (tokens.every(tok => combined.includes(tok))) {
                results.push({
                    category: 'Divine Liturgy (Kidase)',
                    title: k.reference || `Kidase ${k.chapter}:${k.stanza}`,
                    snippet: (k.english || k.geez_script || '').substring(0, 140),
                    action: () => {
                        isKidaseModeActive = true;
                        areAllSectionsCollapsed = false;
                        collapsedSections = {};
                        updateAllTogglesInSettingsPanel();
                        saveSettings();
                        renderPrayers();
                        updateSearchMatches();
                        searchResultsDrawer.style.display = 'none';
                    }
                });
                if (results.length >= maxResults) break;
            }
        }
    }

    searchResultsDrawer.style.display = 'block';
    if (results.length === 0) {
        searchResultsDrawer.innerHTML = `<div class="search-drawer-empty">No matches found across the entire app for "${query}".</div>`;
        return;
    }

    searchResultsDrawer.innerHTML = `<div class="search-drawer-header">Entire App Results (${results.length}${results.length >= maxResults ? '+' : ''}) — Click to open &amp; jump:</div>`;
    results.forEach(r => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'search-drawer-item';
        item.innerHTML = `
            <div class="search-drawer-item-top">
                <span class="search-drawer-cat">${r.category}</span>
                <span class="search-drawer-title">${r.title}</span>
            </div>
            <div class="search-drawer-snippet">${r.snippet}...</div>
        `;
        item.addEventListener('click', r.action);
        searchResultsDrawer.appendChild(item);
    });
}

function performSearch() {
    currentMatchIndex = -1;
    renderPrayers();
    if (searchInput && searchInput.value) {
        currentMatchIndex = 0;
        renderGlobalCorpusSearchResults(searchInput.value);
    } else if (searchResultsDrawer) {
        searchResultsDrawer.style.display = 'none';
        searchResultsDrawer.innerHTML = '';
    }
    updateSearchMatches();
}

function closeSearch(skipPerformSearch) {
    if (header) header.classList.remove('search-active');
    if (searchInput) searchInput.value = '';
    if (searchResultsDrawer) {
        searchResultsDrawer.classList.add('hidden');
        searchResultsDrawer.style.display = 'none';
        searchResultsDrawer.innerHTML = '';
    }
    if (activePrimaryTab !== 'pray' && activePrimaryTab !== 'liturgy') {
        activePrimaryTab = (isKidaseModeActive || showAnaphora) ? 'liturgy' : 'pray';
    }
    updatePrimaryNavTabsUI(activePrimaryTab);
    if (!skipPerformSearch) {
        performSearch();
    }
}

// --- Sidebar Helpers ---
function openLeftSidebar() {
    isLeftSidebarCollapsed = false;
    isRightSidebarCollapsed = true;
    applyTheme();
    saveSettings();
}

function collapseLeftSidebar() {
    isLeftSidebarCollapsed = true;
    applyTheme();
    saveSettings();
}

function toggleLeftSidebar() {
    if (isLeftSidebarCollapsed) {
        openLeftSidebar();
    } else {
        collapseLeftSidebar();
    }
}

function openRightSidebar() {
    isRightSidebarCollapsed = false;
    isLeftSidebarCollapsed = true;
    applyTheme();
    saveSettings();
}

function collapseRightSidebar() {
    isRightSidebarCollapsed = true;
    isLeftSidebarCollapsed = true;
    applyTheme();
    saveSettings();
}

function toggleRightSidebar() {
    if (isRightSidebarCollapsed) {
        openRightSidebar();
    } else {
        collapseRightSidebar();
    }
}

function collapseSidebar() {
    isLeftSidebarCollapsed = true;
    isRightSidebarCollapsed = true;
    applyTheme();
    saveSettings();
}

// --- Psalm Functions ---
const BIBLE_FILE_SOURCES = {
    nkjv: 'bible/NKJV_New_King_James_English_Bible_1982AD.json',
    kjv: 'bible/KJV_King_James_English_Bible.json',
    am54: 'bible/አም54_Haile_Selassie_Amharic_Bible_1962AD_1954EC.json',
    rgv: 'bible/RGV_Reina_Valera_Gomez_Bible_2010AD.json',
    geez_psalms: 'bible/ግእዝ_Psalms_1-151_with_Songs_of_the_Prophets.json',
    coptic: 'bible/COPTIC2025_Psalms_Bohairic_Coptic_Scriptorium_Corpora_2025.json'
};

const _bibleFileLoadPromises = {};

async function loadSingleBibleFile(key) {
    if (bibleData[key]) return true;
    if (key === 'am54' && window.WeahaduBibleService && window.WeahaduBibleService.am54Raw) {
        bibleData.am54 = window.WeahaduBibleService.am54Raw;
        return true;
    }
    if (_bibleFileLoadPromises[key]) {
        return await _bibleFileLoadPromises[key];
    }
    const url = BIBLE_FILE_SOURCES[key];
    if (!url) return false;

    _bibleFileLoadPromises[key] = (async () => {
        try {
            const fetchFn = (typeof window !== 'undefined' && typeof window.fetch === 'function')
                ? window.fetch.bind(window)
                : fetch;
            const response = await fetchFn(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            bibleData[key] = (typeof data === 'string') ? JSON.parse(data) : data;

            if (key === 'am54' && window.WeahaduBibleService) {
                window.WeahaduBibleService.am54Raw = bibleData.am54;
            }
            if (key === 'geez_psalms' && window.WeahaduBibleService) {
                window.WeahaduBibleService.geezPsalmsFormattedRaw = bibleData.geez_psalms;
            }

            // Clean up RGV text formatting once at load time
            if (key === 'rgv' && bibleData[key] && bibleData[key].verses) {
                bibleData[key].verses.forEach(v => {
                    if (v.text) {
                        v.text = v.text.replace(/[‹›]/g, '').replace(/\[(.*?)\]/g, '<i>$1</i>');
                    }
                });
            }

            console.log(`${key} Bible data loaded successfully.`);
            return true;
        } catch (error) {
            console.error(`Failed to load ${key} Bible data from ${url}:`, error);
            bibleData[key] = null;
            return false;
        } finally {
            delete _bibleFileLoadPromises[key];
        }
    })();

    return await _bibleFileLoadPromises[key];
}

async function ensureActiveBibleDataLoaded() {
    const keysToLoad = new Set(['geez_psalms']);

    const needsEnglish = Boolean(displayedLanguages.english);
    if (needsEnglish) {
        let wantKjv = (globalEnglishTranslation === 'kjv');
        let wantNkjv = (globalEnglishTranslation !== 'kjv');
        if (readingTranslationOverrides) {
            Object.values(readingTranslationOverrides).forEach(ov => {
                if (ov && ov.english === 'kjv') wantKjv = true;
                if (ov && ov.english === 'nkjv') wantNkjv = true;
            });
        }
        if (wantNkjv) keysToLoad.add('nkjv');
        if (wantKjv) keysToLoad.add('kjv');
        if (!wantNkjv && !wantKjv) keysToLoad.add('nkjv');
    }

    if (displayedLanguages.amharic_script || displayedLanguages.amharic_phonetic) {
        keysToLoad.add('am54');
    }
    if (displayedLanguages.spanish || displayedLanguages.spanish_pr) {
        keysToLoad.add('rgv');
    }
    if (displayedLanguages.coptic) {
        keysToLoad.add('coptic');
    }

    // Load sequentially so mobile Safari never holds multiple un-GC'd multi-MB JSON strings at once
    const results = [];
    for (const k of keysToLoad) {
        results.push(await loadSingleBibleFile(k));
    }

    if (results.some(res => res === true) || bibleData.geez_psalms || bibleData.nkjv || bibleData.kjv) {
        bibleData.loaded = true;
        refreshLectionaryPickers();
    } else if (!bibleData.loaded) {
        bibleData.loaded = false;
    }
}

async function loadBibleData() {
    await ensureActiveBibleDataLoaded();
}

function createKidaseReadingSetPillElement(readingKey = null) {
    const eth = computeEthiopianDate(getEffectiveDate());
    const entry = getActiveEotcLectionaryLookup(eth.ethMonth, eth.ethDay);
    if (!entry || !entry.qidase || !Array.isArray(entry.qidase.sets) || entry.qidase.sets.length <= 1) {
        return null;
    }
    const sets = entry.qidase.sets;
    if (readingKey) {
        const variesPauline = sets.some(s => s.pauline && s.pauline !== sets[0].pauline);
        const variesPsalm = sets.some(s => s.psalmLxx && s.psalmLxx !== sets[0].psalmLxx);
        const variesGospel = sets.some(s => s.gospel && s.gospel !== sets[0].gospel);
        const isRelevant = (readingKey === 'psalm' && (variesPsalm || variesGospel))
            || (readingKey === 'gospel' && (variesGospel || variesPsalm))
            || (readingKey === 'pauline' && variesPauline);
        if (!isRelevant) return null;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'lectionary-set-pill';
    wrapper.setAttribute('role', 'tablist');
    wrapper.setAttribute('aria-label', 'Appointed Reading Sets');

    const labelSpan = document.createElement('span');
    labelSpan.className = 'lectionary-set-pill-label';
    labelSpan.textContent = 'Reading Set:';
    wrapper.appendChild(labelSpan);

    sets.forEach((s, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isActive = idx === (selectedKidaseReadingSetIndex || 0);
        btn.className = `lectionary-set-pill-btn${isActive ? ' active' : ''}`;
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        btn.dataset.setIndex = String(idx);
        const summaryParts = [];
        if (s.pauline) summaryParts.push(s.pauline);
        if (s.psalmLxx) summaryParts.push(`Ps ${s.psalmLxx} LXX`);
        if (s.gospel) summaryParts.push(s.gospel);
        btn.title = summaryParts.join(' • ');
        btn.textContent = `Set ${idx + 1}`;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            selectKidaseReadingSet(idx);
        });
        wrapper.appendChild(btn);
    });

    return wrapper;
}

function renderSidebarKidaseReadingSetPill() {
    const container = document.getElementById('kidase-reading-set-container');
    if (!container) return;
    container.innerHTML = '';
    const pill = createKidaseReadingSetPillElement(null);
    if (pill) {
        container.appendChild(pill);
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
    }
}

function formatLocalizedReadingLabel(refStr, officeEn = '', officeGeez = '') {
    const trimmed = String(refStr || '').trim();
    if (!trimmed) return trimmed;
    const normalizedOfficeEn = officeEn === 'Evening' ? 'Sunset' : officeEn;
    const enPrefix = normalizedOfficeEn ? `${normalizedOfficeEn}: ` : '';
    const gzPrefix = officeGeez ? `${officeGeez}፥ ` : '';

    // Handle book-only citations (e.g. 'Susanna', 'Bel and the Dragon')
    if (BIBLE_BOOK_MAPPING[trimmed] && BIBLE_BOOK_MAPPING[trimmed].geez) {
        return `${enPrefix}${trimmed} | ${gzPrefix}${BIBLE_BOOK_MAPPING[trimmed].geez}`;
    }

    const match = trimmed.match(/^(.+?)\s+([\d:,\s\-End]+)$/i);
    if (!match) {
        return normalizedOfficeEn && officeGeez ? `${enPrefix}${trimmed} | ${officeGeez}` : trimmed;
    }
    const bookName = match[1].trim();
    const range = match[2].trim();
    const bookCfg = BIBLE_BOOK_MAPPING[bookName];
    if (!bookCfg || !bookCfg.geez) {
        return normalizedOfficeEn && officeGeez ? `${enPrefix}${trimmed} | ${officeGeez}` : trimmed;
    }

    // Convert Masoretic Psalm citation back to Ge'ez/Septuagint numbering for the Ge'ez label
    const psMatch = /^Psalms?$/i.test(bookName) && range.match(/^(\d+):(\d+)(?:-(\d+|End))?$/i);
    if (psMatch && typeof convertMtToLxx === 'function') {
        const mtCh = parseInt(psMatch[1], 10);
        const mtStart = parseInt(psMatch[2], 10);
        const startLxx = convertMtToLxx(mtCh, mtStart);
        let geezPsRef = `${toGeezNumeral(startLxx.lxxChapter)}፥${toGeezNumeral(startLxx.lxxVerse)}`;
        if (psMatch[3]) {
            if (psMatch[3].toLowerCase() === 'end') {
                geezPsRef += '-ፍጻሜ';
            } else {
                const endLxx = convertMtToLxx(mtCh, parseInt(psMatch[3], 10));
                geezPsRef += (endLxx.lxxChapter !== startLxx.lxxChapter)
                    ? `-${toGeezNumeral(endLxx.lxxChapter)}፥${toGeezNumeral(endLxx.lxxVerse)}`
                    : `-${toGeezNumeral(endLxx.lxxVerse)}`;
            }
        }
        return `${enPrefix}${trimmed} | ${gzPrefix}${bookCfg.geez} ${geezPsRef}`;
    }

    const geezRange = range.split(/\s*,\s*/).map(seg =>
        seg.split(':').map(part =>
            part.split('-').map(tok => {
                const t = tok.trim();
                if (t.toLowerCase() === 'end') return 'ፍጻሜ';
                const n = parseInt(t, 10);
                return !isNaN(n) ? toGeezNumeral(n) : t;
            }).join('-')
        ).join('፥')
    ).join('፣ ');
    return `${enPrefix}${trimmed} | ${gzPrefix}${bookCfg.geez} ${geezRange}`;
}

function resolveDisplayScriptureRef(refStr) {
    let display = String(refStr || '').trim().replace(/^Psalms\s+/i, 'Psalm ');
    const endMatch = display.match(/^(.+?)\s+(\d+):(\d+)-End$/i);
    if (endMatch && bibleData && bibleData['en-kjv'] && bibleData['en-kjv'].books) {
        const rawBook = endMatch[1].trim();
        const lookupBook = rawBook === 'Psalm' ? 'Psalms' : rawBook;
        const chNum = parseInt(endMatch[2], 10);
        const startV = parseInt(endMatch[3], 10);
        const bookCfg = BIBLE_BOOK_MAPPING[lookupBook];
        const bookObj = bibleData['en-kjv'].books.find(b =>
            (bookCfg && b.book_number === bookCfg.kjv) ||
            (b.book_name && b.book_name.toLowerCase() === lookupBook.toLowerCase())
        );
        const chObj = bookObj && Array.isArray(bookObj.chapters)
            ? bookObj.chapters.find(c => Number(c.chapter_number) === chNum)
            : null;
        if (chObj && Array.isArray(chObj.verses) && chObj.verses.length > 0) {
            const maxV = chObj.verses[chObj.verses.length - 1].verse_number || chObj.verses.length;
            display = maxV > startV ? `${rawBook} ${chNum}:${startV}-${maxV}` : `${rawBook} ${chNum}:${startV}`;
        }
    }
    return display;
}

const DAILY_READING_TORAH_BOOKS = new Set([
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'
]);
const DAILY_READING_KINGDOMS_BOOKS = new Set([
    '1 Samuel', '2 Samuel', '1 Kings', '2 Kings'
]);
const DAILY_READING_HISTORY_BOOKS = new Set([
    'Joshua', 'Judges', 'Ruth', '1 Chronicles', '2 Chronicles',
    'Ezra', 'Nehemiah', 'Esther', 'Tobit', 'Judith', '1 Maccabees', '2 Maccabees', '3 Maccabees'
]);
const DAILY_READING_WISDOM_BOOKS = new Set([
    'Job', 'Proverbs', 'Book of Admonition', 'Ecclesiastes',
    'Song of Solomon', 'Wisdom of Solomon', 'Sirach'
]);
const DAILY_READING_PROPHECY_BOOKS = new Set([
    'Isaiah', 'Jeremiah', 'Lamentations', 'Baruch', 'Rest of Jeremiah',
    'Ezekiel', 'Daniel', 'Susanna', 'Bel and the Dragon', 'Rest of Daniel',
    'Azariah', 'Song of the Three Holy Children',
    'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah',
    'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
]);
const DAILY_READING_PAULINE_BOOKS = new Set([
    'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
    'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
    '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews'
]);
const DAILY_READING_UNIVERSAL_BOOKS = new Set([
    'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'
]);
const DAILY_READING_GOSPEL_BOOKS = new Set([
    'Matthew', 'Mark', 'Luke', 'John'
]);

function formatDailyReadingSubsectionTitle(refStr, period = 'morning', { isMatins = false } = {}) {
    const trimmed = String(refStr || '').trim();
    if (!trimmed) return trimmed;
    const periodGeez = period === 'sunset' ? 'ዘሠርክ' : 'ዘነግህ';
    const displayRef = resolveDisplayScriptureRef(trimmed);

    if (isMatins) {
        if (/^Psalms?\b/i.test(trimmed)) {
            return `<i>Matins</i> (${displayRef}) | ምስባክ ዘነግህ`;
        }
        return `<i>Matins</i> (${displayRef}) | ወንጌል ዘነግህ`;
    }

    let bookName = trimmed;
    if (!BIBLE_BOOK_MAPPING[bookName]) {
        const match = trimmed.match(/^(.+?)\s+[\d:,\s\-End]+$/i);
        if (match) bookName = match[1].trim();
    }

    if (DAILY_READING_TORAH_BOOKS.has(bookName)) {
        return `Torah (${displayRef}) | ኦሪት ${periodGeez}`;
    }
    if (DAILY_READING_PROPHECY_BOOKS.has(bookName)) {
        return `Prophecy (${displayRef}) | ትንቢት ${periodGeez}`;
    }
    if (DAILY_READING_WISDOM_BOOKS.has(bookName)) {
        return `Wisdom (${displayRef}) | ጥበብ ${periodGeez}`;
    }
    if (DAILY_READING_KINGDOMS_BOOKS.has(bookName)) {
        return `History (${displayRef}) | ነገሥት ${periodGeez}`;
    }
    if (DAILY_READING_HISTORY_BOOKS.has(bookName)) {
        return `History (${displayRef}) | ታሪክ ${periodGeez}`;
    }
    if (bookName === 'Acts') {
        return `Acts of the Apostles (${displayRef}) | ግብረ ሐዋርያት ${periodGeez}`;
    }
    if (DAILY_READING_PAULINE_BOOKS.has(bookName)) {
        return `Pauline Epistle (${displayRef}) | መልእክተ ጳውሎስ ${periodGeez}`;
    }
    if (DAILY_READING_UNIVERSAL_BOOKS.has(bookName)) {
        return `Universal Epistle (${displayRef}) | መልእክተ ካልእ ${periodGeez}`;
    }
    if (DAILY_READING_GOSPEL_BOOKS.has(bookName)) {
        return `Gospel (${displayRef}) | ወንጌል ${periodGeez}`;
    }
    return `${displayRef} | ምንባብ ${periodGeez}`;
}

function getEffectiveDailyLectionaryPeriod(dateObj = getEffectiveDate()) {
    if (dailyLectionaryPeriodOverride === 'morning' || dailyLectionaryPeriodOverride === 'sunset') {
        return dailyLectionaryPeriodOverride;
    }
    return dateObj.getHours() >= 17 ? 'sunset' : 'morning';
}

function setDailyLectionaryPeriod(period, { keepExpanded = false, render = true } = {}) {
    dailyLectionaryPeriodOverride = (period === 'sunset' || period === 'morning') ? period : null;
    if (keepExpanded) {
        collapsedSections["Morning Readings | ምንባባት ዘነግህ"] = false;
        collapsedSections["Sunset Readings | ምንባባት ዘሠርክ"] = false;
        collapsedSections["Daily Readings | ምንባባት ዘለለዕለቱ"] = false;
        areAllSectionsCollapsed = false;
    }
    if (render && typeof renderPrayers === 'function') {
        renderPrayers();
    }
}

function stepDailyLectionaryDayOffset(delta, { reset = false, keepExpanded = false, render = true } = {}) {
    dailyLectionaryDayOffset = reset ? 0 : (dailyLectionaryDayOffset + (parseInt(delta, 10) || 0));
    if (keepExpanded) {
        collapsedSections["Morning Readings | ምንባባት ዘነግህ"] = false;
        collapsedSections["Sunset Readings | ምንባባት ዘሠርክ"] = false;
        collapsedSections["Daily Readings | ምንባባት ዘለለዕለቱ"] = false;
        areAllSectionsCollapsed = false;
    }
    if (render && typeof renderPrayers === 'function') {
        renderPrayers();
    }
}

function appendDailyLectionaryReadingCards(refStr, period, { isMatins = false, feastInfo = null } = {}, addSectionTitleCallback) {
    const labelStr = formatDailyReadingSubsectionTitle(refStr, period, { isMatins });
    const childTitle = `→ ${labelStr}`;
    const titleOpts = { defaultCollapsed: true };
    if (isMatins) {
        titleOpts.feastBadgeLabel = 'FEAST';
        titleOpts.feastBadgeTitle = feastInfo
            ? `Appointed for today's Feast: ${feastInfo.english} | ${feastInfo.geez}`
            : 'Appointed Festal Matins reading';
    }
    addSectionTitleCallback(childTitle, true, null, titleOpts);

    const bibleResults = getBibleVersesFromRef(refStr, 'dailyLectionary');
    if (!bibleResults) return;
    const verseCounts = Object.values(bibleResults).map(arr => Array.isArray(arr) ? arr.length : 0);
    const maxVerses = Math.max(0, ...verseCounts);
    if (maxVerses === 0) return;

    const isPsalm = /^Psalms?\s+/i.test(refStr);
    if (isPsalm) {
        const combined = {
            chapter: 'DailyLectionary',
            stanza: refStr
        };
        Object.entries(bibleResults).forEach(([langKey, arr]) => {
            if (!Array.isArray(arr) || arr.length === 0) return;
            combined[langKey] = arr.map(v => v.text).join('\n');
        });
        if (combined.geez_script && typeof transliterateGeezToPhonetic === 'function') {
            combined.geez_phonetic = transliterateGeezToPhonetic(combined.geez_script);
        }
        const card = createPrayerCardElement(combined, -1, false);
        prayerDisplay.appendChild(card);
        if (displayOptions.presentationMode !== 'slides' && window.isRenderingCollapsed) {
            card.style.display = 'none';
        }
        return;
    }

    for (let i = 0; i < maxVerses; i++) {
        const prayerData = {
            chapter: 'DailyLectionary',
            stanza: `${refStr}-${i + 1}`,
            reference: refStr
        };
        Object.entries(bibleResults).forEach(([langKey, arr]) => {
            if (!Array.isArray(arr) || !arr[i]) return;
            const v = arr[i];
            let dVN = v.verseNum;
            if (langKey === 'geez_script') {
                dVN = String(dVN).split(':').map(part =>
                    part.split('-').map(n => toGeezNumeral(parseInt(n, 10))).join('-')
                ).join('፥');
                if (typeof transliterateGeezToPhonetic === 'function') {
                    prayerData.geez_phonetic = `<sup>${v.verseNum}</sup> ${transliterateGeezToPhonetic(v.text)}`;
                }
            }
            prayerData[langKey] = `<sup>${dVN}</sup> ${v.text}`;
        });
        const card = createPrayerCardElement(prayerData, -1, false);
        prayerDisplay.appendChild(card);
        if (displayOptions.presentationMode !== 'slides' && window.isRenderingCollapsed) {
            card.style.display = 'none';
        }
    }
}

function renderDailyLectionarySection(addSectionTitleCallback) {
    if (!showDailyLectionary) return;
    const baseDate = getEffectiveDate();
    const targetDate = new Date(baseDate.getTime());
    if (dailyLectionaryDayOffset !== 0) {
        targetDate.setDate(targetDate.getDate() + dailyLectionaryDayOffset);
    }
    const eth = computeEthiopianDate(targetDate);
    const entry = getActiveEotcLectionaryLookup(eth.ethMonth, eth.ethDay);
    if (!entry) return;

    const hasMorning = Array.isArray(entry.morning) && entry.morning.length > 0;
    const hasMatins = Boolean(entry.matins && (entry.matins.psalmLxx || entry.matins.gospel));
    const hasEvening = Array.isArray(entry.evening) && entry.evening.length > 0;
    if (!hasMorning && !hasMatins && !hasEvening) return;

    const period = getEffectiveDailyLectionaryPeriod(baseDate);
    const sectionTitle = period === 'sunset'
        ? "Sunset Readings | ምንባባት ዘሠርክ"
        : "Morning Readings | ምንባባት ዘነግህ";
    const dateDesc = `${eth.monthName} ${eth.ethDay}, ${eth.ethYear} ዓ.ም. | ${eth.geezMonth} ${eth.geezDate}፣ ${eth.geezYear} ዓ.ም.`;
    const feastInfo = hasMatins ? getActiveEotcFeastLookup(eth.ethMonth, eth.ethDay) : null;

    const metaWrap = document.createElement('div');
    metaWrap.className = 'daily-readings-meta-wrap';

    const topRow = document.createElement('div');
    topRow.className = 'daily-readings-meta-row';

    const dateNavGroup = document.createElement('div');
    dateNavGroup.className = 'daily-readings-date-nav';

    const prevDayBtn = document.createElement('button');
    prevDayBtn.type = 'button';
    prevDayBtn.className = 'daily-readings-day-arrow';
    prevDayBtn.setAttribute('aria-label', 'Previous day readings');
    prevDayBtn.title = 'Previous day readings';
    prevDayBtn.innerHTML = '&#8249;';
    prevDayBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        stepDailyLectionaryDayOffset(-1, { keepExpanded: true, render: true });
    });

    const dateLabel = document.createElement('span');
    dateLabel.className = 'daily-readings-date-label';
    dateLabel.textContent = dateDesc;

    const nextDayBtn = document.createElement('button');
    nextDayBtn.type = 'button';
    nextDayBtn.className = 'daily-readings-day-arrow';
    nextDayBtn.setAttribute('aria-label', 'Next day readings');
    nextDayBtn.title = 'Next day readings';
    nextDayBtn.innerHTML = '&#8250;';
    nextDayBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        stepDailyLectionaryDayOffset(1, { keepExpanded: true, render: true });
    });

    dateNavGroup.appendChild(prevDayBtn);
    dateNavGroup.appendChild(dateLabel);
    dateNavGroup.appendChild(nextDayBtn);

    if (dailyLectionaryDayOffset !== 0) {
        const resetDayBtn = document.createElement('button');
        resetDayBtn.type = 'button';
        resetDayBtn.className = 'daily-readings-today-chip';
        resetDayBtn.textContent = 'Today';
        resetDayBtn.title = 'Return to current liturgical day';
        resetDayBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            stepDailyLectionaryDayOffset(0, { reset: true, keepExpanded: true, render: true });
        });
        dateNavGroup.appendChild(resetDayBtn);
    }

    const periodPill = document.createElement('div');
    periodPill.className = 'daily-readings-period-pill';
    periodPill.setAttribute('role', 'group');
    periodPill.setAttribute('aria-label', 'Toggle Morning or Sunset readings');

    ['morning', 'sunset'].forEach(pKey => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `daily-readings-period-btn${period === pKey ? ' is-active' : ''}`;
        btn.dataset.period = pKey;
        btn.setAttribute('aria-pressed', String(period === pKey));
        btn.textContent = pKey === 'morning' ? 'Morning' : 'Sunset';
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (period !== pKey) {
                setDailyLectionaryPeriod(pKey, { keepExpanded: true, render: true });
            }
        });
        periodPill.appendChild(btn);
    });

    topRow.appendChild(dateNavGroup);
    topRow.appendChild(periodPill);
    metaWrap.appendChild(topRow);

    if (feastInfo) {
        const feastLine = document.createElement('div');
        feastLine.className = 'daily-readings-feast-subtitle';
        feastLine.textContent = `${feastInfo.english} | ${feastInfo.geez}`;
        metaWrap.appendChild(feastLine);
    }

    addSectionTitleCallback(
        sectionTitle,
        true,
        { date: dateDesc, feast: feastInfo ? `${feastInfo.english} | ${feastInfo.geez}` : null, customElement: metaWrap },
        { isParentGroup: true, resetParentGroup: true, defaultCollapsed: true }
    );

    if (period === 'sunset') {
        if (hasEvening) {
            entry.evening.forEach(ref => appendDailyLectionaryReadingCards(ref, 'sunset', { isMatins: false }, addSectionTitleCallback));
        } else {
            const noteCard = createPrayerCardElement({
                chapter: 'DailyLectionary',
                stanza: 'ParamonyNote',
                english: '<i>Continuous sunset readings are omitted on this Paramony (ገሀድ); toggle to Morning to view the appointed festal readings.</i>',
                amharic_script: '<i>በዚህ የገሀድ ዕለት የተከታታይ የሠርክ ምንባባት አይነበቡም፤ የዕለቱን የነግህ ምንባባት ለመመልከት ወደ Morning ይቀይሩ።</i>',
                geez_script: '<i>በዛቲ ዕለተ ገሀድ ምንባባት ዘሠርክ ኢይትነበቡ።</i>'
            }, -1, false);
            prayerDisplay.appendChild(noteCard);
            if (displayOptions.presentationMode !== 'slides' && window.isRenderingCollapsed) {
                noteCard.style.display = 'none';
            }
        }
    } else {
        if (hasMorning) {
            entry.morning.forEach(ref => appendDailyLectionaryReadingCards(ref, 'morning', { isMatins: false }, addSectionTitleCallback));
        }
        if (hasMatins) {
            if (entry.matins.psalmLxx) {
                const mtPs = convertLxxRefHelper(entry.matins.psalmLxx);
                if (mtPs) appendDailyLectionaryReadingCards(mtPs, 'morning', { isMatins: true, feastInfo }, addSectionTitleCallback);
            }
            if (entry.matins.gospel) {
                appendDailyLectionaryReadingCards(entry.matins.gospel, 'morning', { isMatins: true, feastInfo }, addSectionTitleCallback);
            }
        }
    }
}

function refreshLectionaryPickers() {
    renderSidebarKidaseReadingSetPill();
    document.querySelectorAll('.lectionary-picker-container').forEach(container => {
        if (typeof container.syncPicker === 'function') {
            container.syncPicker();
        }
    });
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
    if (lxxChapter === 151) return [151];
    return []; // Should not happen
}

function getMtFromLxx(lxxChapter, lxxVerse = 1) {
    const v = Number(lxxVerse) || 1;
    if (lxxChapter >= 1 && lxxChapter <= 8) return { mtChapter: lxxChapter, mtVerse: v };
    if (lxxChapter === 9) return v <= 20 ? { mtChapter: 9, mtVerse: v } : { mtChapter: 10, mtVerse: v - 20 };
    if (lxxChapter >= 10 && lxxChapter <= 112) return { mtChapter: lxxChapter + 1, mtVerse: v };
    if (lxxChapter === 113) return v <= 8 ? { mtChapter: 114, mtVerse: v } : { mtChapter: 115, mtVerse: v - 8 };
    if (lxxChapter === 114) return { mtChapter: 116, mtVerse: v };
    if (lxxChapter === 115) return { mtChapter: 116, mtVerse: v + 9 };
    if (lxxChapter >= 116 && lxxChapter <= 145) return { mtChapter: lxxChapter + 1, mtVerse: v };
    if (lxxChapter === 146) return { mtChapter: 147, mtVerse: v };
    if (lxxChapter === 147) return { mtChapter: 147, mtVerse: v + 11 };
    if (lxxChapter >= 148 && lxxChapter <= 150) return { mtChapter: lxxChapter, mtVerse: v };
    if (lxxChapter === 151) return { mtChapter: 151, mtVerse: v };
    return { mtChapter: lxxChapter, mtVerse: v };
}

function convertMtToLxx(mtChapter, mtVerse) {
    const hasVerse = (mtVerse !== undefined && mtVerse !== null && !isNaN(Number(mtVerse)));
    const v = hasVerse ? Number(mtVerse) : 1;

    let lxxChapter = mtChapter;
    let lxxVerse = v;

    if (mtChapter >= 1 && mtChapter <= 8) {
        lxxChapter = mtChapter;
        lxxVerse = v;
    } else if (mtChapter === 9) {
        lxxChapter = 9;
        lxxVerse = v;
    } else if (mtChapter === 10) {
        lxxChapter = 9;
        lxxVerse = v + 20;
    } else if (mtChapter >= 11 && mtChapter <= 113) {
        lxxChapter = mtChapter - 1;
        lxxVerse = v;
    } else if (mtChapter === 114) {
        lxxChapter = 113;
        lxxVerse = v;
    } else if (mtChapter === 115) {
        lxxChapter = 113;
        lxxVerse = v + 8;
    } else if (mtChapter === 116) {
        if (!hasVerse || v <= 9) {
            lxxChapter = 114;
            lxxVerse = v;
        } else {
            lxxChapter = 115;
            lxxVerse = v - 9;
        }
    } else if (mtChapter >= 117 && mtChapter <= 146) {
        lxxChapter = mtChapter - 1;
        lxxVerse = v;
    } else if (mtChapter === 147) {
        if (!hasVerse || v <= 11) {
            lxxChapter = 146;
            lxxVerse = v;
        } else {
            lxxChapter = 147;
            lxxVerse = v - 11;
        }
    } else if (mtChapter >= 148 && mtChapter <= 150) {
        lxxChapter = mtChapter;
        lxxVerse = v;
    } else if (mtChapter === 151) {
        lxxChapter = 151;
        lxxVerse = v;
    }

    if (!hasVerse) {
        return lxxChapter;
    }
    return { lxxChapter, lxxVerse };
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

    const psalmsOverrideContainer = document.getElementById('psalms-translation-override-container');
    if (psalmsOverrideContainer) {
        psalmsOverrideContainer.innerHTML = '';
        psalmsOverrideContainer.appendChild(createTranslationOverrideRow('psalmsOfDavid'));
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

    const prophetOverrideContainer = document.getElementById('prophet-songs-translation-override-container');
    if (prophetOverrideContainer) {
        prophetOverrideContainer.innerHTML = '';
        prophetOverrideContainer.appendChild(createTranslationOverrideRow('prophetSongs'));
    }

    updateProphetSongsSummary();
}

// WeakMap cache so we never re-flatten 81-book Bibles on every renderPrayers() call
const _psalmsChapterIndexCache = new WeakMap();

function getIndexedPsalmsForBible(data, formatType) {
    if (!data || typeof data !== 'object') return new Map();
    if (_psalmsChapterIndexCache.has(data)) {
        return _psalmsChapterIndexCache.get(data);
    }

    const byChapter = new Map();
    const pushVerse = (chNum, verseObj) => {
        const c = Number(chNum);
        if (!byChapter.has(c)) byChapter.set(c, []);
        byChapter.get(c).push(verseObj);
    };

    if (formatType === 'nkjv' && Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            const v = data[i];
            if (v && v.book === 19) {
                pushVerse(v.chapter, v);
            }
        }
    } else if (formatType === 'am54' && data.books && Array.isArray(data.books)) {
        const psalmsBook = data.books.find(b => b.title === 'መዝሙረ ዳዊት');
        if (psalmsBook && Array.isArray(psalmsBook.chapters)) {
            for (const ch of psalmsBook.chapters) {
                const chNum = Number(ch.chapter);
                const verses = ch.verses || [];
                for (let idx = 0; idx < verses.length; idx++) {
                    pushVerse(chNum, {
                        book: 'መዝሙረ ዳዊት',
                        chapter: chNum,
                        verse: idx + 1,
                        text: verses[idx]
                    });
                }
            }
        }
    } else if (formatType === 'rgv' && data.verses && Array.isArray(data.verses)) {
        for (let i = 0; i < data.verses.length; i++) {
            const v = data.verses[i];
            if (v && v.book_name === 'Salmos') {
                pushVerse(v.chapter, v);
            }
        }
    } else if (formatType === 'weahadu' && data.chapters && Array.isArray(data.chapters)) {
        for (const ch of data.chapters) {
            const chNum = Number(ch.n);
            const verses = ch.verses || [];
            for (let i = 0; i < verses.length; i++) {
                const v = verses[i];
                pushVerse(chNum, {
                    chapter: chNum,
                    verse: parseInt(v.n, 10),
                    text: v.t
                });
            }
        }
    }

    _psalmsChapterIndexCache.set(data, byChapter);
    return byChapter;
}

function renderSelectedPsalmsWithDoxology(addSectionTitleCallback, customPsalmsList = null) {
    const psalmsToRender = customPsalmsList || selectedPsalms;
    if (psalmsToRender.length === 0 || !bibleData.loaded) return;

    const engOverride = getReadingTranslationOverride('psalmsOfDavid', 'english');
    const amOverride = getReadingTranslationOverride('psalmsOfDavid', 'amharic');
    const geezOverride = getReadingTranslationOverride('psalmsOfDavid', 'geez');

    const wantEnglish = Boolean(displayedLanguages.english);
    const wantAmharic = Boolean(displayedLanguages.amharic_script || displayedLanguages.amharic_phonetic);
    const wantSpanish = Boolean(displayedLanguages.spanish || displayedLanguages.spanish_pr);
    const wantTigrinya = Boolean(displayedLanguages.tigrinya_script || displayedLanguages.tigrinya_phonetic);
    const wantGeez = Boolean(displayedLanguages.geez_script || displayedLanguages.geez_phonetic);
    const wantCoptic = Boolean(displayedLanguages.coptic);

    const selectedEngBible = engOverride === 'kjv'
        ? (bibleData.kjv || bibleData.nkjv)
        : (bibleData.nkjv || bibleData.kjv);

    let nkjvByChapter = wantEnglish
        ? getIndexedPsalmsForBible(selectedEngBible, 'nkjv')
        : getIndexedPsalmsForBible(bibleData.nkjv || bibleData.kjv, 'nkjv');
    const am54ByChapter = wantAmharic ? getIndexedPsalmsForBible(bibleData.am54, 'am54') : new Map();
    const rgvByChapter = wantSpanish ? getIndexedPsalmsForBible(bibleData.rgv, 'rgv') : new Map();
    const geezPsalmsAll = Array.isArray(bibleData.geez_psalms) ? bibleData.geez_psalms : [];
    const copticPsalmsAll = (wantCoptic && Array.isArray(bibleData.coptic)) ? bibleData.coptic : [];

    let tigrinyaByChapter = new Map();
    let am2000ByChapter = new Map();
    let gezWeahaduByChapter = new Map();
    let gezLudolfByChapter = new Map();

    if (useExternalBibleAPI && window.WeahaduBibleService && WeahaduBibleService.canon) {
        if (wantEnglish && engOverride === 'kjv') {
            const weahaduNkjv = WeahaduBibleService.cache.get('en-kjv-19-psalms.json');
            if (weahaduNkjv) {
                nkjvByChapter = getIndexedPsalmsForBible(weahaduNkjv, 'weahadu');
            }
        }
        if (wantAmharic) {
            const weahaduAm = WeahaduBibleService.cache.get('am-2000-19-psalms.json');
            if (weahaduAm) {
                am2000ByChapter = getIndexedPsalmsForBible(weahaduAm, 'weahadu');
            }
        }
        if (wantGeez) {
            const weahaduGez = WeahaduBibleService.cache.get('gez-1980-19-psalms.json');
            if (weahaduGez) {
                gezWeahaduByChapter = getIndexedPsalmsForBible(weahaduGez, 'weahadu');
            }
            const weahaduLudolf = WeahaduBibleService.cache.get('gez-1694-19-psalms.json');
            if (weahaduLudolf) {
                gezLudolfByChapter = getIndexedPsalmsForBible(weahaduLudolf, 'weahadu');
            }
        }
        if (wantTigrinya) {
            const weahaduTi = WeahaduBibleService.cache.get('ti-1997-19-psalms.json');
            if (weahaduTi) {
                tigrinyaByChapter = getIndexedPsalmsForBible(weahaduTi, 'weahadu');
            }
        }
    }

    const doxologyPrayer = prayers.find(p => p.chapter === 'Psalms' && p.stanza === 'Response');

    for (const lxxChapter of psalmsToRender) {
        const verseRange = (!customPsalmsList && selectedPsalmVerseRanges && selectedPsalmVerseRanges[lxxChapter]) || null;
        addSectionTitleCallback(lxxChapter, verseRange);
        let allVerses = [];

        const geezPsalmChapter = geezPsalmsAll.find(c => c.id === lxxChapter);
        const geezVerses = geezPsalmChapter ? geezPsalmChapter.verses : [];
        const copticPsalmChapter = copticPsalmsAll.find(c => c.chapter === lxxChapter);
        const copticVerses = copticPsalmChapter ? copticPsalmChapter.verses : [];
        const am2000ChVerses = am2000ByChapter.get(lxxChapter) || [];
        const ludolfChVerses = gezLudolfByChapter.get(lxxChapter) || [];

        let maxVerseNum = 0;
        if (lxxChapter === 9) {
            maxVerseNum = 38;
        } else if (lxxChapter === 113) {
            maxVerseNum = 26;
        } else if (lxxChapter === 114) {
            maxVerseNum = 9;
        } else if (lxxChapter === 115) {
            maxVerseNum = 10;
        } else if (lxxChapter === 146) {
            maxVerseNum = 11;
        } else if (lxxChapter === 147) {
            maxVerseNum = 9;
        } else if (lxxChapter === 151) {
            maxVerseNum = 8;
        } else {
            const { mtChapter } = getMtFromLxx(lxxChapter, 1);
            const nkjvCh = nkjvByChapter.get(mtChapter) || [];
            const am54Ch = am54ByChapter.get(mtChapter) || [];
            const rgvCh = rgvByChapter.get(mtChapter) || [];
            const tiCh = tigrinyaByChapter.get(mtChapter) || [];
            [...nkjvCh, ...am54Ch, ...rgvCh, ...tiCh].forEach(v => {
                if (v && v.verse) {
                    const verseParts = String(v.verse).split('-').map(Number);
                    const endVerse = verseParts.length > 1 ? verseParts[1] : verseParts[0];
                    if (endVerse > maxVerseNum) maxVerseNum = endVerse;
                }
            });
        }

        if (geezVerses.length > 0) {
            const maxG = Math.max(...geezVerses.map(v => v.verse_number));
            if (maxG > maxVerseNum) maxVerseNum = maxG;
        }
        if (ludolfChVerses.length > 0) {
            const maxL = Math.max(...ludolfChVerses.map(v => v.verse));
            if (maxL > maxVerseNum) maxVerseNum = maxL;
        }
        if (copticVerses.length > 0) {
            const maxC = Math.max(...copticVerses.map(v => Number(v.verse)));
            if (maxC > maxVerseNum) maxVerseNum = maxC;
        }
        if (useExternalBibleAPI && amOverride === 'am-2000' && am2000ChVerses.length > 0) {
            const maxAm = Math.max(...am2000ChVerses.map(v => v.verse));
            if (maxAm > maxVerseNum) maxVerseNum = maxAm;
        }

        const findVerse = (verses, vNum, key = 'verse') => verses.find(v => {
            if (!v || v[key] === undefined) return false;
            const val = v[key];
            const parts = String(val).split('-').map(Number);
            return vNum >= parts[0] && vNum <= (parts.length > 1 ? parts[1] : parts[0]);
        });

        const getFormattedGeezPsalmVerse = (i) => {
            if (geezVerses.length === 0) return '';
            if (lxxChapter === 115) {
                if (i <= 4) {
                    const gV = findVerse(geezVerses, i, 'verse_number');
                    return gV ? gV.text : '';
                } else if (i === 5) {
                    return 'ወእሁብ ብፅአትየ ለእግዚአብሔር፤ በቅድመ ኵሉ ሕዝብ።';
                } else if (i === 6) {
                    const gV = findVerse(geezVerses, 5, 'verse_number');
                    return gV ? gV.text : '';
                } else if (i === 7) {
                    const v6 = findVerse(geezVerses, 6, 'verse_number');
                    const v7 = findVerse(geezVerses, 7, 'verse_number');
                    return [v6?.text, v7?.text].filter(Boolean).join(' ');
                } else if (i === 8) {
                    return 'ለከ እሠውዕ መሥዋዕተ ስብሓት፤';
                } else if (i === 9) {
                    return 'ወእሁብ ብፅአትየ ለእግዚአብሔር፤ በቅድመ ኵሉ ሕዝብ።';
                } else if (i === 10) {
                    const gV = findVerse(geezVerses, 9, 'verse_number');
                    return gV ? gV.text : '';
                }
                return '';
            }
            const gV = findVerse(geezVerses, i, 'verse_number');
            return gV ? gV.text : '';
        };

        const getUnformattedGeez1980PsalmVerse = (i, mtChapter, mtVerseNum) => {
            if (gezWeahaduByChapter.size === 0) return '';
            let gezCh = mtChapter;
            let gezV = mtVerseNum;
            if (lxxChapter === 113) { gezCh = 114; gezV = i; }
            else if (lxxChapter === 114) { gezCh = 115; gezV = i; }
            else if (lxxChapter === 115) { gezCh = 116; gezV = i; }
            else if (lxxChapter === 146) { gezCh = 147; gezV = i; }
            else if (lxxChapter === 147) { gezCh = 148; gezV = i; }
            else if (lxxChapter >= 148 && lxxChapter <= 150) { gezCh = lxxChapter + 1; gezV = i; }
            const gV = findVerse(gezWeahaduByChapter.get(gezCh) || [], gezV);
            return gV ? gV.text : '';
        };

        const startVerseNum = verseRange && verseRange.start ? Math.max(1, verseRange.start) : 1;
        const endVerseNum = verseRange && verseRange.end ? Math.min(maxVerseNum, verseRange.end) : maxVerseNum;

        for (let i = startVerseNum; i <= endVerseNum; i++) {
            const { mtChapter, mtVerse: mtVerseNum } = getMtFromLxx(lxxChapter, i);
            let verseData = { verseNum: i, mtChapter: mtChapter, mtVerseNum: mtVerseNum };

            if (lxxChapter !== 151) {
                if (wantEnglish) {
                    const nkjvVerse = findVerse(nkjvByChapter.get(mtChapter) || [], mtVerseNum);
                    if (nkjvVerse) { verseData.nkjv = nkjvVerse.text; verseData.kjv = nkjvVerse.text; }
                }

                if (wantSpanish) {
                    const rgvVerse = findVerse(rgvByChapter.get(mtChapter) || [], mtVerseNum);
                    if (rgvVerse) verseData.rgv = rgvVerse.text;
                }

                if (wantAmharic) {
                    if (useExternalBibleAPI && amOverride === 'am-2000' && am2000ChVerses.length > 0) {
                        const amVerse = findVerse(am2000ChVerses, i);
                        if (amVerse) verseData.am54 = amVerse.text;
                    } else {
                        const amVerse = findVerse(am54ByChapter.get(mtChapter) || [], mtVerseNum);
                        if (amVerse) verseData.am54 = amVerse.text;
                    }
                }

                if (wantTigrinya) {
                    const tiChVerses = tigrinyaByChapter.get(mtChapter) || [];
                    let tiVerse = findVerse(tiChVerses, mtVerseNum);
                    if (!tiVerse && mtChapter === 116 && mtVerseNum === 19) {
                        tiVerse = findVerse(tiChVerses, 18);
                    }
                    if (tiVerse) verseData.tigrinya_script = tiVerse.text;
                }
            }

            if (wantGeez) {
                let geezVerseText = '';
                if (geezOverride === 'gez-1694' && ludolfChVerses.length > 0) {
                    const lV = findVerse(ludolfChVerses, i);
                    if (lV) geezVerseText = lV.text;
                } else if (geezOverride === 'gez-1980' && useExternalBibleAPI && gezWeahaduByChapter.size > 0) {
                    geezVerseText = getUnformattedGeez1980PsalmVerse(i, mtChapter, mtVerseNum);
                } else {
                    geezVerseText = getFormattedGeezPsalmVerse(i);
                }
                if (!geezVerseText) {
                    geezVerseText = getFormattedGeezPsalmVerse(i) || getUnformattedGeez1980PsalmVerse(i, mtChapter, mtVerseNum);
                }
                if (geezVerseText) verseData.geez_psalms = geezVerseText;
            }

            if (wantCoptic && copticVerses.length > 0) {
                const copticVerse = findVerse(copticVerses, String(i), 'verse');
                if (copticVerse) verseData.coptic = copticVerse.text_coptic;
            }

            if (verseData.nkjv || verseData.rgv || verseData.am54 || verseData.tigrinya_script || verseData.geez_psalms || verseData.coptic) {
                allVerses.push(verseData);
            }
        }

        allVerses.forEach(verse => {
            const activePsalmTranslations = {
                english: displayedLanguages.english && verse.nkjv,
                amharic_script: displayedLanguages.amharic_script && verse.am54,
                spanish: displayedLanguages.spanish && verse.rgv,
                spanish_pr: !displayedLanguages.spanish && displayedLanguages.spanish_pr && verse.rgv,
                tigrinya_script: displayedLanguages.tigrinya_script && verse.tigrinya_script,
                geez_script: displayedLanguages.geez_script && verse.geez_psalms,
                coptic: displayedLanguages.coptic && verse.coptic
            };

            const activeLanguageCount = Object.values(activePsalmTranslations).filter(Boolean).length;
            if (activeLanguageCount === 0) return;

            const prayerCard = document.createElement('div');
            prayerCard.classList.add('prayer-card', 'psalm-card');
            prayerCard.dataset.cardId = `Psalms-${lxxChapter}:${verse.verseNum}`;
            prayerCard.dataset.prayerSignature = `Psalms_${lxxChapter}_${verse.verseNum}_${(verse.nkjv || verse.geez_psalms || '').replace(/\s+/g, ' ').trim().slice(0, 50)}`;

            // Handle initial collapse state
            if (window.isRenderingCollapsed && displayOptions.presentationMode !== 'slides') {
                prayerCard.style.display = 'none';
            }

            const prayerCardMainContent = document.createElement('div');
            prayerCardMainContent.classList.add('prayer-card-main-content');

            const prayerContent = document.createElement('div');
            prayerContent.classList.add('prayer-content', displayOptions.layout === 'row' ? 'layout-row' : 'layout-column');
            if (displayOptions.languageColors !== 'off') {
                prayerContent.classList.add('colored-languages');
            }
            prayerContent.dataset.activeColumns = activeLanguageCount;

            const langKeyToPsalmVerseProp = {
                'english': 'nkjv', 'amharic_script': 'am54', 'spanish': 'rgv', 'spanish_pr': 'rgv', 'tigrinya_script': 'tigrinya_script', 'geez_script': 'geez_psalms', 'coptic': 'coptic'
            };
            const langKeyToIsEthiopic = {
                'english': false, 'amharic_script': true, 'spanish': false, 'spanish_pr': false, 'geez_script': true, 'coptic': false
            };
            const langKeyToLangName = {
                'english': 'English', 'amharic_script': 'አማርኛ', 'spanish': 'Español', 'spanish_pr': 'Español', 'geez_script': 'ግእዝ', 'coptic': 'ϯⲙⲉⲧⲣⲉⲙⲛ̀ⲭⲏⲙⲓ'
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
            if (lxxChapter === 151) {
                labelText = `Psalm 151:${verse.verseNum}`;
            } else if (lxxChapter == verse.mtChapter && (!verse.mtVerseNum || verse.verseNum == verse.mtVerseNum)) {
                labelText = `Psalm ${lxxChapter}:${verse.verseNum}`;
            } else if (lxxChapter == verse.mtChapter) {
                labelText = `Psalm ${lxxChapter}:${verse.verseNum} (${verse.mtVerseNum})`;
            } else if (!verse.mtVerseNum || verse.verseNum == verse.mtVerseNum) {
                labelText = `Psalm ${lxxChapter} (${verse.mtChapter}):${verse.verseNum}`;
            } else {
                labelText = `Psalm ${lxxChapter}:${verse.verseNum} (${verse.mtChapter}:${verse.mtVerseNum})`;
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
                const signature = clickedCard.dataset.prayerSignature;
                const cardId = clickedCard.dataset.cardId;
                togglePresentationMode({ signature, cardId });
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

    const engOverride = getReadingTranslationOverride('prophetSongs', 'english');
    const amOverride = getReadingTranslationOverride('prophetSongs', 'amharic');
    const geezOverride = getReadingTranslationOverride('prophetSongs', 'geez');
    const doxologyPrayer = prayers.find(p => p.chapter === 'Psalms' && p.stanza === 'Response');

    selectedProphetSongs.forEach(songKey => {
        const song = prophetSongs.find(s => s.key === songKey);
        if (!song) return;

        addSectionTitleCallback(song);

        if (song.refs.prayerKey) {
            // This is a manually added prayer from songs.js, supplemented dynamically with Ge'ez / Amharic Bible translations
            if (typeof songs !== 'undefined') {
                const pk = song.refs.prayerKey;
                const songVerses = songs.filter(p => p.chapter === 'ProphetSong' && p.stanza === pk);

                let dynamicGeezVerses = null;
                let dynamicAmVerses = null;
                let dynamicTiVerses = null;

                if (useExternalBibleAPI && window.WeahaduBibleService && WeahaduBibleService.canon) {
                    const geezLangToUse = (geezOverride === 'gez-1980' || geezOverride === 'gez-1980-formatted') ? 'gez-1980' : 'gez-1980';
                    if (pk === 'Manasseh') {
                        dynamicGeezVerses = WeahaduBibleService.getVersesSync(geezLangToUse, 'Prayer of Manasseh 1:1-13');
                        if (amOverride === 'am-2000') {
                            dynamicAmVerses = WeahaduBibleService.getVersesSync('am-2000', '2 Chronicles 33:14-26');
                        }
                    } else if (pk === 'Jonah') {
                        dynamicGeezVerses = WeahaduBibleService.getVersesSync(geezLangToUse, 'Jonah 2:2-10');
                        dynamicAmVerses = WeahaduBibleService.getVersesSync(amOverride, amOverride === 'am54' ? 'Jonah 2:2-9' : 'Jonah 2:2-10');
                        dynamicTiVerses = WeahaduBibleService.getVersesSync('ti-1997', 'Jonah 2:2-9');
                    } else if (pk === 'ThreeYouths1') {
                        dynamicGeezVerses = WeahaduBibleService.getVersesSync(geezLangToUse, 'Daniel 3:26-45');
                        if (amOverride === 'am-2000') {
                            dynamicAmVerses = WeahaduBibleService.getVersesSync('am-2000', 'Daniel 3:26-45');
                        }
                    } else if (pk === 'ThreeYouths2') {
                        dynamicGeezVerses = WeahaduBibleService.getVersesSync(geezLangToUse, 'Daniel 3:52-56');
                        if (amOverride === 'am-2000') {
                            dynamicAmVerses = WeahaduBibleService.getVersesSync('am-2000', 'Daniel 3:52-56');
                        }
                    } else if (pk === 'ThreeYouths3') {
                        dynamicGeezVerses = WeahaduBibleService.getVersesSync(geezLangToUse, 'Daniel 3:57-88');
                        if (amOverride === 'am-2000') {
                            dynamicAmVerses = WeahaduBibleService.getVersesSync('am-2000', 'Daniel 3:58-88');
                        }
                    }
                }

                if (songVerses && songVerses.length > 0) {
                    songVerses.forEach((verseData, idx) => {
                        const dynGeez = (dynamicGeezVerses && dynamicGeezVerses[idx]) ? dynamicGeezVerses[idx].t : '';
                        const dynAm = (dynamicAmVerses && dynamicAmVerses[idx]) ? dynamicAmVerses[idx].t : '';
                        const dynTi = (dynamicTiVerses && dynamicTiVerses[idx]) ? dynamicTiVerses[idx].t : '';

                        const versePrayer = {
                            english: verseData.english || '',
                            spanish: verseData.spanish || '',
                            spanish_pr: verseData.spanish_pr || verseData.spanish || '',
                            amharic_script: verseData.amharic_script || dynAm || '',
                            geez_script: verseData.geez_script || dynGeez || '',
                            geez_phonetic: verseData.geez_phonetic || '',
                            tigrinya_script: verseData.tigrinya_script || dynTi || '',
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
            const nkjvRef = song.refs.kjv || song.refs.nkjv;
            const rgvRef = song.refs.rgv;
            const am54Ref = song.refs.am54;

            const englishBible = engOverride === 'kjv'
                ? (bibleData.kjv || bibleData.nkjv)
                : (bibleData.nkjv || bibleData.kjv);
            let nkjvVerses = englishBible ? englishBible.filter(v => {
                if (!nkjvRef) return false;
                if (nkjvRef.chapters) {
                    return v.book === nkjvRef.book && nkjvRef.chapters.includes(v.chapter);
                } else if (nkjvRef.chapter && nkjvRef.verses) {
                    return v.book === nkjvRef.book && v.chapter === nkjvRef.chapter && v.verse >= nkjvRef.verses.start && v.verse <= nkjvRef.verses.end;
                }
                return false;
            }) : [];

            let rgvVerses = bibleData.rgv?.verses ? bibleData.rgv.verses.filter(v => {
                if (!rgvRef) return false;
                if (rgvRef.chapters) {
                    return v.book_name === rgvRef.book && rgvRef.chapters.includes(v.chapter);
                } else if (rgvRef.chapter && rgvRef.verses) {
                    return v.book_name === rgvRef.book && v.chapter === rgvRef.chapter && v.verse >= rgvRef.verses.start && v.verse <= rgvRef.verses.end;
                }
                return false;
            }) : [];

            let am54Verses = [];
            let geezVerses = [];
            let tiVerses = [];

            const loadAm54Local = () => {
                if (bibleData.am54?.books && am54Ref) {
                    const am54Book = bibleData.am54.books.find(b => b.title === am54Ref.book);
                    if (am54Book?.chapters) {
                        return am54Book.chapters
                            .filter(c => (am54Ref.chapters && am54Ref.chapters.includes(c.chapter)) || c.chapter === am54Ref.chapter)
                            .flatMap(c => (c.verses || []).map((text, verseIndex) => ({
                                verse: verseIndex + 1,
                                text: text,
                                chapter: c.chapter
                            })))
                            .filter(v => !am54Ref.verses || (v.verse >= am54Ref.verses.start && v.verse <= am54Ref.verses.end));
                    }
                }
                return [];
            };

            if (useExternalBibleAPI && window.WeahaduBibleService && WeahaduBibleService.canon && nkjvRef) {
                const bookName = nkjvRef.bookName || nkjvRef.book;
                const bookFile = WeahaduBibleService.getBookFile(bookName);
                let chArray = nkjvRef.chapters || [nkjvRef.chapter];
                let startV = nkjvRef.verses ? nkjvRef.verses.start : 1;
                let endV = nkjvRef.verses ? nkjvRef.verses.end : 999;

                const processWeahaduBook = (bookData) => {
                    if (!bookData || !bookData.chapters) return [];
                    return bookData.chapters
                        .filter(ch => chArray.includes(ch.n))
                        .flatMap(ch => ch.verses
                            .filter(v => parseInt(v.n) >= startV && parseInt(v.n) <= endV)
                            .map(v => ({ book: nkjvRef.book, chapter: ch.n, verse: parseInt(v.n), text: v.t }))
                        );
                };

                if (engOverride === 'kjv') {
                    let weahaduNkjv = processWeahaduBook(WeahaduBibleService.cache.get(`en-kjv-${bookFile}`));
                    if (weahaduNkjv.length > 0) nkjvVerses = weahaduNkjv;
                }

                if (amOverride === 'am54') {
                    am54Verses = loadAm54Local();
                    if (am54Verses.length === 0) {
                        am54Verses = processWeahaduBook(WeahaduBibleService.cache.get(`am54-${bookFile}`));
                    }
                } else {
                    let weahaduAm = processWeahaduBook(WeahaduBibleService.cache.get(`am-2000-${bookFile}`));
                    if (weahaduAm.length > 0) am54Verses = weahaduAm;
                    else am54Verses = loadAm54Local();
                }

                if (geezOverride === 'gez-1845') {
                    geezVerses = processWeahaduBook(WeahaduBibleService.cache.get(`gez-1845-${bookFile}`));
                }
                if (geezVerses.length === 0) {
                    geezVerses = processWeahaduBook(WeahaduBibleService.cache.get(`gez-1980-${bookFile}`));
                }
                tiVerses = processWeahaduBook(WeahaduBibleService.cache.get(`ti-1997-${bookFile}`));
            } else {
                am54Verses = loadAm54Local();
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
            populateMap(geezVerses, 'geez_script');
            populateMap(tiVerses, 'tigrinya_script');

            allVerses = Array.from(verseMap.values()).sort((a, b) => a.chapter - b.chapter || a.verseNum - b.verseNum);

            // Render verse cards
            allVerses.forEach(verse => {
                if (!verse.nkjv && !verse.rgv && !verse.am54 && !verse.geez_script && !verse.tigrinya_script) return;
                const versePrayer = {
                    english: verse.nkjv || '',
                    spanish: verse.rgv || '',
                    spanish_pr: verse.rgv || '',
                    amharic_script: verse.am54 || '',
                    geez_script: verse.geez_script || '',
                    geez_phonetic: '',
                    tigrinya_script: verse.tigrinya_script || '',
                    tigrinya_phonetic: '',
                    verseNum: verse.verseNum,
                    reference: `${nkjvRef.bookName || nkjvRef.book} ${verse.chapter}:${verse.verseNum}`,
                    chapter: 'ProphetSong',
                    stanza: song.key
                };

                const prayerCard = createPrayerCardElement(versePrayer, -1);
                prayerDisplay.appendChild(prayerCard);
            });
        }

        // Render doxology (Conclusion/response) after each Song of the Prophets
        if (doxologyPrayer) {
            const doxologyCard = createPrayerCardElement(doxologyPrayer, -1);
            prayerDisplay.appendChild(doxologyCard);
        }
    });
}


function createPsalmVerseSection(langName, text, verseNum, isEthiopic = false, langKey, isFirstLanguage = false) {
    const langSection = document.createElement('div');
    langSection.classList.add('language-section', `lang-${langKey}`);
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

function getSeatatBibleVerses(bookKey, chapter, rangeString, customEnglish = null, customGeez = null, readingKey = null) {
    if (!bibleData.loaded) return [];

    const mapping = BIBLE_BOOK_MAPPING[bookKey];
    if (!mapping) return [];
    const engOverride = getReadingTranslationOverride(readingKey, 'english');
    const amOverride = getReadingTranslationOverride(readingKey, 'amharic');
    const geezOverride = getReadingTranslationOverride(readingKey, 'geez');

    let startVerse = 1, endVerse = 1;
    if (String(rangeString).includes('-')) {
        [startVerse, endVerse] = String(rangeString).split('-').map(Number);
    } else {
        startVerse = endVerse = Number(rangeString);
    }

    // Query WeahaduBibleService for full multi-language coverage (Ge'ez, Amharic, Tigrinya, English)
    const refStr = `${bookKey} ${chapter}:${rangeString}`;
    let weahaduGeezMap = {};
    let weahaduAmMap = {};
    let weahaduTiMap = {};
    let weahaduEngMap = {};

    if (useExternalBibleAPI && window.WeahaduBibleService && WeahaduBibleService.canon) {
        const mtStart = (bookKey === 'Psalms') ? getMtFromLxx(chapter, startVerse) : { mtChapter: chapter, mtVerse: startVerse };
        const mtEnd = (bookKey === 'Psalms') ? getMtFromLxx(chapter, endVerse) : { mtChapter: chapter, mtVerse: endVerse };
        const mtRef = (mtStart.mtVerse !== mtEnd.mtVerse)
            ? `${bookKey} ${mtStart.mtChapter}:${mtStart.mtVerse}-${mtEnd.mtVerse}`
            : `${bookKey} ${mtStart.mtChapter}:${mtStart.mtVerse}`;
        const lxxRef = `${bookKey} ${chapter}:${rangeString}`;

        const geezRefToUse = (bookKey === 'Psalms' && (geezOverride === 'gez-1980-formatted' || geezOverride === 'gez-1694')) ? lxxRef : mtRef;
        const amRefToUse = (amOverride === 'am54') ? mtRef : lxxRef;

        const gVerses = WeahaduBibleService.getVersesSync(geezOverride || 'gez-1980', geezRefToUse) || WeahaduBibleService.getVersesSync('gez-1980', mtRef);
        const aVerses = WeahaduBibleService.getVersesSync(amOverride || 'am-2000', amRefToUse) || WeahaduBibleService.getVersesSync('am-2000', mtRef);
        const tVerses = WeahaduBibleService.getVersesSync('ti-1997', mtRef);
        const eVerses = (engOverride === 'kjv') ? WeahaduBibleService.getVersesSync('en-kjv', mtRef) : null;

        if (Array.isArray(gVerses)) gVerses.forEach((v, idx) => { weahaduGeezMap[startVerse + idx] = v.t; weahaduGeezMap[parseInt(v.n, 10)] = v.t; });
        if (Array.isArray(aVerses)) aVerses.forEach((v, idx) => { weahaduAmMap[startVerse + idx] = v.t; weahaduAmMap[parseInt(v.n, 10)] = v.t; });
        if (Array.isArray(tVerses)) tVerses.forEach((v, idx) => { weahaduTiMap[startVerse + idx] = v.t; weahaduTiMap[parseInt(v.n, 10)] = v.t; });
        if (Array.isArray(eVerses)) eVerses.forEach((v, idx) => { weahaduEngMap[startVerse + idx] = v.t; weahaduEngMap[parseInt(v.n, 10)] = v.t; });
    }

    const verseResults = [];

    for (let vNum = startVerse; vNum <= endVerse; vNum++) {
        const { mtChapter, mtVerse } = (bookKey === 'Psalms') ? getMtFromLxx(chapter, vNum) : { mtChapter: chapter, mtVerse: vNum };

        const verseObj = {
            verseNum: vNum,
            chapter: chapter,
            book: bookKey,
            reference: `${bookKey} ${chapter}:${vNum}`,
            english: weahaduEngMap[vNum] || weahaduEngMap[mtVerse] || '',
            amharic_script: weahaduAmMap[vNum] || weahaduAmMap[mtVerse] || '',
            spanish: '',
            spanish_pr: '',
            geez_script: weahaduGeezMap[vNum] || weahaduGeezMap[mtVerse] || '',
            geez_phonetic: '',
            coptic: '',
            tigrinya_script: weahaduTiMap[vNum] || weahaduTiMap[mtVerse] || ''
        };

        // English (NKJV or KJV)
        const englishBible = engOverride === 'kjv'
            ? (bibleData.kjv || bibleData.nkjv)
            : (bibleData.nkjv || bibleData.kjv);
        if (!verseObj.english && englishBible) {
            const engBookId = mapping.nkjv || mapping.kjv;
            const v = englishBible.find(v => v.book === engBookId && v.chapter === mtChapter && v.verse === mtVerse);
            if (v) verseObj.english = v.text;
        }

        // AM54 fallback
        if (!verseObj.amharic_script && bibleData.am54 && bibleData.am54.books) {
            const book = bibleData.am54.books.find(b => b.title === mapping.am54);
            if (book && book.chapters) {
                const ch = book.chapters.find(c => Number(c.chapter) === mtChapter) || book.chapters[mtChapter - 1];
                if (ch && ch.verses && ch.verses[mtVerse - 1]) {
                    verseObj.amharic_script = ch.verses[mtVerse - 1];
                }
            }
        }

        // RGV (Spanish)
        if (bibleData.rgv && bibleData.rgv.verses) {
            const v = bibleData.rgv.verses.find(v => v.book_name === mapping.rgv && v.chapter === mtChapter && v.verse === mtVerse);
            if (v) {
                verseObj.spanish = v.text;
                verseObj.spanish_pr = v.text;
            }
        }

        // Coptic Psalms
        if (bookKey === 'Psalms' && bibleData.coptic) {
            const copticCh = bibleData.coptic.find(c => Number(c.chapter) === chapter);
            if (copticCh && Array.isArray(copticCh.verses)) {
                const cv = copticCh.verses.find(v => Number(v.verse) === vNum);
                if (cv && cv.text) verseObj.coptic = cv.text;
            }
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
            } else if (!verseObj.geez_script) {
                const ch = bibleData.geez_psalms.find(c => c.id === chapter);
                if (ch && ch.verses) {
                    if (chapter === 115) {
                        if (vNum <= 4) {
                            const v = ch.verses.find(gv => gv.verse_number === vNum);
                            if (v) verseObj.geez_script = v.text;
                        } else if (vNum === 5) {
                            verseObj.geez_script = 'ወእሁብ ብፅአትየ ለእግዚአብሔር፤ በቅድመ ኵሉ ሕዝብ።';
                        } else if (vNum === 6) {
                            const v = ch.verses.find(gv => gv.verse_number === 5);
                            if (v) verseObj.geez_script = v.text;
                        } else if (vNum === 7) {
                            const v6 = ch.verses.find(gv => gv.verse_number === 6);
                            const v7 = ch.verses.find(gv => gv.verse_number === 7);
                            verseObj.geez_script = [v6?.text, v7?.text].filter(Boolean).join(' ');
                        } else if (vNum === 8) {
                            verseObj.geez_script = 'ለከ እሠውዕ መሥዋዕተ ስብሓት፤';
                        } else if (vNum === 9) {
                            verseObj.geez_script = 'ወእሁብ ብፅአትየ ለእግዚአብሔር፤ በቅድመ ኵሉ ሕዝብ።';
                        } else if (vNum === 10) {
                            const v = ch.verses.find(gv => gv.verse_number === 9);
                            if (v) verseObj.geez_script = v.text;
                        }
                    } else {
                        const v = ch.verses.find(gv => gv.verse_number === vNum);
                        if (v) verseObj.geez_script = v.text;
                    }
                }
            }
        }

        // Handle Custom English for Psalms portions
        if (bookKey === 'Psalms' && customEnglish) {
            const regex = new RegExp(`\\[${vNum}\\]\\s*([^\\[]+)`);
            const match = customEnglish.match(regex);
            if (match && match[1]) {
                verseObj.english = match[1].trim();
            } else if (!customEnglish.includes('[')) {
                verseObj.english = customEnglish;
            }
        }

        if (verseObj.geez_script && typeof transliterateGeezToPhonetic === 'function') {
            verseObj.geez_phonetic = transliterateGeezToPhonetic(verseObj.geez_script);
        }

        if (verseObj.english || verseObj.geez_script || verseObj.amharic_script || verseObj.tigrinya_script || verseObj.spanish || verseObj.spanish_pr) {
            verseResults.push(verseObj);
        }
    }
    return verseResults;
}

function renderSelectedSeatatLectionary(addSectionTitleCallback) {
    if (!showSeatatReadings || selectedSeatatLectionaryDay === 'None' || !SEATAT_LECTIONARY_DATA[selectedSeatatLectionaryDay]) return;

    const readings = SEATAT_LECTIONARY_DATA[selectedSeatatLectionaryDay];
    addSectionTitleCallback("<i>Se'atat</i> Readings | ምንባባተ ሰዓታት", true, null, { isParentGroup: true, defaultCollapsed: true });

    readings.forEach(reading => {
        const childTitle = reading.type.startsWith('→ ') ? reading.type : `→ ${reading.type}`;
        addSectionTitleCallback(childTitle, true, null, { defaultCollapsed: true });

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
                reference: verses[0].reference + (verses.length > 1 ? '-' + verses[verses.length - 1].verseNum : ''),
                english: verses.map(v => reading.customEnglish && reading.customEnglish.includes('[') ? v.english : (v.english ? `<sup>${v.verseNum}</sup> ${v.english}` : '')).filter(Boolean).join(' '),
                geez_script: verses.map(v => reading.customGeez && reading.customGeez.includes('[') ? v.geez_script : (v.geez_script ? `<sup>${toGeezNumeral(v.verseNum)}</sup> ${v.geez_script}` : '')).filter(Boolean).join(' '),
                geez_phonetic: verses.map(v => v.geez_phonetic ? `<sup>${v.verseNum}</sup> ${v.geez_phonetic}` : '').filter(Boolean).join(' '),
                amharic_script: verses.map(v => v.amharic_script ? `<sup>${v.verseNum}</sup> ${v.amharic_script}` : '').filter(Boolean).join(' '),
                tigrinya_script: verses.map(v => v.tigrinya_script ? `<sup>${v.verseNum}</sup> ${v.tigrinya_script}` : '').filter(Boolean).join(' '),
                spanish: verses.map(v => v.spanish ? `<sup>${v.verseNum}</sup> ${v.spanish}` : '').filter(Boolean).join(' '),
                spanish_pr: verses.map(v => v.spanish_pr ? `<sup>${v.verseNum}</sup> ${v.spanish_pr}` : '').filter(Boolean).join(' '),
                coptic: verses.map(v => v.coptic ? `<sup>${v.verseNum}</sup> ${v.coptic}` : '').filter(Boolean).join(' ')
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


function safeOn(el, event, handler, opts) {
    if (!el) return;
    if (typeof el.addEventListener === 'function') {
        el.addEventListener(event, handler, opts);
    } else if (el.length !== undefined) {
        Array.from(el).forEach(node => {
            if (node && typeof node.addEventListener === 'function') {
                node.addEventListener(event, handler, opts);
            }
        });
    }
}

// --- Miracles of Mary Modal Setup ---
function updateSelectedMiracleUI() {
    if (!selectedMiracleText) return;
    if (selectedMiracleId === 'none') {
        selectedMiracleText.textContent = 'None selected';
        miraclePositionContainer.style.display = 'none';
        const clearMiracleBtn = document.getElementById('clear-miracle-btn');
        if (clearMiracleBtn) clearMiracleBtn.style.display = 'none';
    } else {
        const miracle = MIRACLES_OF_MARY?.find(m => m.id === selectedMiracleId);
        if (miracle) {
            let html = miracle.title;
            if (miracle.incipit) {
                const words = miracle.incipit.split(' ');
                const first15 = words.slice(0, 15).join(' ');
                const suffix = words.length > 15 ? '...' : '';
                html += `<br><span class="geez-font" style="font-size: 1.1em; opacity: 0.8; display: block; margin-top: 4px;">${first15}${suffix}</span>`;
            }
            selectedMiracleText.innerHTML = html;
            miraclePositionContainer.style.display = 'block';
            const clearMiracleBtn = document.getElementById('clear-miracle-btn');
            if (clearMiracleBtn) clearMiracleBtn.style.display = 'block';
        } else {
            selectedMiracleText.textContent = 'None selected';
            miraclePositionContainer.style.display = 'none';
            const clearMiracleBtn = document.getElementById('clear-miracle-btn');
            if (clearMiracleBtn) clearMiracleBtn.style.display = 'none';
        }
    }
}

const MIRACLE_BILINGUAL_KEYWORDS = {
    'ውሻ': ['dog', 'dogs', 'thirst', 'water', 'shoe'],
    'ከልብ': ['dog', 'dogs', 'water'],
    'ውሃ': ['water', 'thirst', 'river', 'drink'],
    'ማይ': ['water', 'thirst', 'river'],
    'ስዕል': ['icon', 'picture', 'image', 'painting'],
    'ሥዕል': ['icon', 'picture', 'image', 'painting'],
    'በላዕተ': ['cannibal', 'belate', 'seb', 'souls', 'sinner'],
    'ሰብእ': ['cannibal', 'souls'],
    'ደቅስዮስ': ['deqseyos', 'dexius', 'ildefonsus', 'toledo', 'vestment', 'throne'],
    'ቶሌዶ': ['toledo', 'deqseyos', 'dexius'],
    'መነኩሴ': ['monk', 'abbot', 'monastery'],
    'መነኮስ': ['monk', 'abbot', 'monastery'],
    'ሽፍታ': ['robber', 'thief', 'bandit', 'highwayman'],
    'ሌባ': ['robber', 'thief', 'bandit'],
    'ፈረስ': ['horse', 'knight', 'cavalry'],
    'እሳት': ['fire', 'flame', 'burn'],
    'ባሕር': ['sea', 'ocean', 'ship', 'drown', 'boat'],
    'መርከብ': ['ship', 'boat', 'sea', 'sailor'],
    'አንበሳ': ['lion', 'beast'],
    'እባብ': ['serpent', 'snake', 'dragon'],
    'ዘንዶ': ['dragon', 'serpent'],
    'ካህን': ['priest', 'cleric', 'bishop'],
    'ዲያቆን': ['deacon']
};

function matchMiraclesByText(rawQuery, showMostReadOnly = false) {
    if (typeof MIRACLES_OF_MARY === 'undefined') return [];
    const trimmed = (rawQuery || '').trim().toLowerCase();
    if (!trimmed) {
        return MIRACLES_OF_MARY.filter(m => !showMostReadOnly || m.most_read);
    }

    const rawTokens = trimmed.split(/[\s,.;:!?()]+/).filter(Boolean);
    const expandedTokenGroups = rawTokens.map(tok => {
        const group = [tok];
        Object.entries(MIRACLE_BILINGUAL_KEYWORDS).forEach(([ethKey, engList]) => {
            if (tok.includes(ethKey) || ethKey.includes(tok)) {
                group.push(...engList);
            }
        });
        return group;
    });

    const scored = [];
    for (const m of MIRACLES_OF_MARY) {
        if (showMostReadOnly && !m.most_read) continue;
        const titleLower = (m.title || '').toLowerCase();
        const incipitLower = (m.incipit || '').toLowerCase();
        const trLower = (m.translations || []).map(t => (t.text || '').toLowerCase()).join(' ');
        const fullHaystack = `${m.id || ''} ${titleLower} ${incipitLower} ${trLower}`;

        let matchedGroups = 0;
        let score = 0;
        for (const group of expandedTokenGroups) {
            const groupMatched = group.some(term => fullHaystack.includes(term));
            if (groupMatched) {
                matchedGroups++;
                if (group.some(term => titleLower.includes(term))) score += 5;
                if (group.some(term => incipitLower.includes(term))) score += 3;
                score += 1;
            }
        }

        if (matchedGroups === expandedTokenGroups.length || (expandedTokenGroups.length >= 4 && matchedGroups >= Math.ceil(expandedTokenGroups.length * 0.6))) {
            scored.push({ miracle: m, score: score + matchedGroups * 2 });
        }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.map(s => s.miracle);
}
window.matchMiraclesByText = matchMiraclesByText;

function renderMiracleModalList() {
    if (!miracleListContainer || typeof MIRACLES_OF_MARY === 'undefined') return;
    
    const query = (miracleSearchInput.value || '').trim();
    const showMostReadOnly = miracleMostReadToggle.checked;
    
    miracleListContainer.innerHTML = '';
    
    // Add "None" option first
    const noneBtn = document.createElement('button');
    noneBtn.className = 'settings-button';
    noneBtn.style.textAlign = 'left';
    noneBtn.style.width = '100%';
    noneBtn.style.padding = '10px';
    noneBtn.style.border = selectedMiracleId === 'none' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)';
    noneBtn.style.marginBottom = '5px';
    noneBtn.textContent = 'None selected';
    safeOn(noneBtn, 'click', () => {
        selectedMiracleId = 'none';
        updateSelectedMiracleUI();
        saveSettings();
        smoothRender();
        miracleModal.style.display = 'none';
    });
    miracleListContainer.appendChild(noneBtn);

    const filtered = matchMiraclesByText(query, showMostReadOnly);
    
    const countContainer = document.getElementById('miracle-count-text');
    if (countContainer) {
        countContainer.textContent = `${filtered.length} stories available`;
    }

    filtered.forEach(miracle => {
        const btn = document.createElement('button');
        btn.className = 'settings-button';
        btn.style.textAlign = 'left';
        btn.style.width = '100%';
        btn.style.padding = '10px';
        btn.style.border = selectedMiracleId === miracle.id ? '2px solid var(--primary-color)' : '1px solid var(--border-color)';
        btn.style.marginBottom = '5px';
        btn.style.display = 'block';
        
        // Intentionally omit Ge'ez incipit in the pop-up list per user feedback to prevent visual clutter
        btn.innerHTML = `<div style="font-weight: 600; font-size: 1.05rem; color: var(--primary-color); display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
                        <span>${miracle.title || 'Untitled'}</span>
                        <span style="font-size: 0.75rem; font-weight: normal; opacity: 0.6; white-space: nowrap;">ID: ${miracle.id}</span>
                    </div>`;

        safeOn(btn, 'click', () => {
            selectedMiracleId = miracle.id;
            selectedMiracleTranslationIndex = 0; // Reset translation index when a new miracle is picked
            updateSelectedMiracleUI();
            saveSettings();
            smoothRender();
            miracleModal.style.display = 'none';
        });
        
        miracleListContainer.appendChild(btn);
    });
}


function toggleLayout() {
    displayOptions.layout = (displayOptions.layout === 'row') ? 'column' : 'row';
    updateAllTogglesInSettingsPanel();
    smoothRender();
    saveSettings();
}

function togglePresentationMode(targetCardIdentifier) {
    const isEnteringSlides = displayOptions.presentationMode !== 'slides';
    displayOptions.presentationMode = isEnteringSlides ? 'slides' : 'scroll';

    if (isEnteringSlides) {
        displayOptions.showPrayerLabels = true; // Ensure labels are on for context
        collapseSidebar();
        // Set pending target BEFORE renderPrayers so that setupSlides() can use it
        if (targetCardIdentifier) {
            if (targetCardIdentifier.readingType) {
                _pendingSlideReadingType = targetCardIdentifier.readingType;
            }
            if (targetCardIdentifier.signature) {
                _pendingSlideSignature = targetCardIdentifier.signature;
            }
        }
    } else {
        _pendingSlideSignature = null;
        _pendingSlideReadingType = null;
    }

    applyTheme();
    renderPrayers();
    updateAllTogglesInSettingsPanel();
    saveSettings();

    if (isEnteringSlides) {
        // setupSlides() inside renderPrayers() already resolved the target.
        // But do a final verification here in case it didn't find the target.
        if (targetCardIdentifier) {
            let targetCard = null;
            if (targetCardIdentifier.readingType) {
                targetCard = prayerDisplay.querySelector(`.prayer-card[data-reading-type="${targetCardIdentifier.readingType}"]`);
            }
            if (!targetCard && targetCardIdentifier.signature) {
                targetCard = Array.from(prayerDisplay.querySelectorAll('.prayer-card'))
                    .find(c => c.dataset.prayerSignature === targetCardIdentifier.signature);
            }
            if (!targetCard && targetCardIdentifier.cardId) {
                targetCard = prayerDisplay.querySelector(`.prayer-card[data-card-id="${targetCardIdentifier.cardId}"]`);
            } else if (!targetCard && targetCardIdentifier.prayerIndex !== undefined && targetCardIdentifier.prayerIndex !== '-1' && targetCardIdentifier.prayerIndex !== -1) {
                targetCard = prayerDisplay.querySelector(`.prayer-card[data-prayer-index="${targetCardIdentifier.prayerIndex}"]`);
            }
            if (targetCard) {
                const allSlides = Array.from(prayerDisplay.querySelectorAll('.prayer-card, .section-title.collapsible'));
                const slideIdx = allSlides.indexOf(targetCard);
                if (slideIdx !== -1) {
                    currentSlideIndex = slideIdx;
                    showSlide(currentSlideIndex);
                    return;
                }
            }
        }
        showSlide(currentSlideIndex);
    } else {
        _pendingSlideSignature = null;
        _pendingSlideReadingType = null;
        // Exiting slides mode: scroll to the previously active card
        setTimeout(() => {
            const allSlides = Array.from(prayerDisplay.querySelectorAll('.prayer-card, .section-title.collapsible'));
            const cardToView = allSlides[currentSlideIndex];
            if (cardToView) {
                cardToView.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100); // A slight delay ensures the DOM is ready
    }
}

// --- Custom Psalm Combinations Modal Logic ---
function renderPsalmCombinationsModal() {
    if (!psalmCombinationsAccordion) return;
    psalmCombinationsAccordion.innerHTML = '';
    
    PSALM_CATEGORIES.forEach(category => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'accordion-item';
        
        // Split title and citation: e.g. "Weekly Psalter (St. Yared...)" -> Title: "Weekly Psalter", Citation: "(St. Yared...)"
        const match = category.label.match(/^([^(]+)(?:\s+(\(.+\)))?$/);
        const titleText = match ? match[1].trim() : category.label;
        const citationText = match && match[2] ? match[2] : '';

        const headerDiv = document.createElement('div');
        headerDiv.className = 'accordion-header';
        headerDiv.innerHTML = `
            <div class="accordion-header-text">
                <span class="accordion-title">${titleText}</span>
                ${citationText ? `<span class="accordion-citation">${citationText}</span>` : ''}
            </div>
            <span class="accordion-icon">▼</span>
        `;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'accordion-content';
        
        const innerDiv = document.createElement('div');
        innerDiv.className = 'accordion-content-inner';

        if (category.description) {
            const descDiv = document.createElement('div');
            descDiv.className = 'accordion-category-description';
            descDiv.textContent = category.description;
            innerDiv.appendChild(descDiv);
        }

        category.items.forEach(comboKey => {
            const combo = PSALM_COMBINATIONS[comboKey];
            if (!combo) return;
            
            // Format dropdown label for rich display: "English Title | Transliteration | Ge'ez Title (Chapters)"
            const parts = combo.dropdownLabel ? combo.dropdownLabel.split(' | ') : [combo.name];
            const title = parts[0];
            
            let translit = '';
            let geezTitle = '';
            let chaptersText = '';

            let rawChapters = '';
            if (parts.length === 3) {
                translit = parts[1];
                const geezAndChapters = parts[2].split(' (');
                geezTitle = geezAndChapters[0];
                rawChapters = geezAndChapters.length > 1 ? geezAndChapters[1] : '';
            } else if (parts.length === 2) {
                // If it's "Title | Ge'ez (Chapters)"
                const geezAndChapters = parts[1].split(' (');
                geezTitle = geezAndChapters[0];
                rawChapters = geezAndChapters.length > 1 ? geezAndChapters[1] : '';
            } else {
                // Fallback if no dropdownLabel or standard split
                const nameParts = combo.name.split(' | ');
                geezTitle = nameParts.length > 1 ? nameParts[1] : '';
                
                const first = combo.psalms[0];
                const last = combo.psalms[combo.psalms.length - 1];
                const isContiguous = combo.psalms.length === (last - first + 1);
                
                rawChapters = combo.psalms.length > 0 
                    ? (isContiguous ? `${first}-${last}` : `${combo.psalms.join(', ')}`) 
                    : 'Songs of the Prophets';
            }

            // Remove trailing ')' if present
            if (rawChapters.endsWith(')')) {
                rawChapters = rawChapters.slice(0, -1);
            }

            // Format chapters string
            if (rawChapters) {
                if (rawChapters === 'Songs of the Prophets') {
                    chaptersText = rawChapters;
                } else if (/^\d+(?::\d+-\d+)?$/.test(rawChapters.trim())) {
                    chaptersText = `Psalm ${rawChapters.trim()}`;
                } else {
                    chaptersText = `Psalms ${rawChapters}`;
                }
            }

            const optionDiv = document.createElement('div');
            optionDiv.className = 'combo-option';
            optionDiv.dataset.value = comboKey;
            
            optionDiv.innerHTML = `
                <div class="combo-header-row">
                    <span class="combo-title">${title}</span>
                    <span class="combo-chapters">${chaptersText}</span>
                </div>
                ${geezTitle ? `<span class="combo-geez ethiopic-label">${geezTitle}</span>` : ''}
                ${translit ? `<span class="combo-translit">${translit}</span>` : ''}
            `;
            
            safeOn(optionDiv, 'click', () => {
                selectPsalmCombination(comboKey);
                closeModal();
            });
            
            innerDiv.appendChild(optionDiv);
        });
        
        contentDiv.appendChild(innerDiv);
        itemDiv.appendChild(headerDiv);
        itemDiv.appendChild(contentDiv);
        
        // Accordion toggle logic
        safeOn(headerDiv, 'click', () => {
            const isActive = itemDiv.classList.contains('active');
            
            // Close all other accordions
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.accordion-content').style.maxHeight = null;
            });
            
            if (!isActive) {
                itemDiv.classList.add('active');
                contentDiv.style.maxHeight = contentDiv.scrollHeight + "px";
            }
        });
        
        psalmCombinationsAccordion.appendChild(itemDiv);
    });
}

function selectPsalmCombination(comboKey) {
    if (comboKey && PSALM_COMBINATIONS[comboKey]) {
        const combo = PSALM_COMBINATIONS[comboKey];
        
        // Update Psalms and optional verse ranges
        selectedPsalms = [...(combo.psalms || [])];
        selectedPsalmVerseRanges = combo.verseRanges ? JSON.parse(JSON.stringify(combo.verseRanges)) : {};
        const psalmCheckboxes = psalmSelectorContainer.querySelectorAll('input[type="checkbox"]');
        psalmCheckboxes.forEach(cb => {
            cb.checked = selectedPsalms.includes(Number(cb.value));
        });
        const selectAllPsalmCheckbox = document.getElementById('select-all-psalms');
        if (selectAllPsalmCheckbox) {
            selectAllPsalmCheckbox.checked = selectedPsalms.length === 150;
        }
        updatePsalmSummary();

        // Update Prophet Songs
        if (combo.prophetSongs !== undefined) {
            selectedProphetSongs = [...combo.prophetSongs];
            const prophetCheckboxes = prophetSongsSelectorContainer.querySelectorAll('input[type="checkbox"]');
            prophetCheckboxes.forEach(cb => {
                cb.checked = selectedProphetSongs.includes(cb.value);
            });
            const selectAllProphetCheckbox = document.getElementById('select-all-prophet-songs');
            if (selectAllProphetCheckbox) {
                selectAllProphetCheckbox.checked = selectedProphetSongs.length === prophetSongs.length;
            }
            updateProphetSongsSummary();
        }

        saveSettings();
        smoothRender();
    }
}

// Modal Listeners
function openModal(modal) {
    if (!modal) return;
    if (window.innerWidth <= 900 && typeof collapseSidebar === 'function') {
        collapseSidebar();
    }
    modal.style.display = 'block';
    modal.style.zIndex = '3000';
    if (modalBackdrop) {
        modalBackdrop.style.display = 'block';
        modalBackdrop.style.zIndex = '2999';
    }
    body.style.overflow = 'hidden';
}

function closeModal() {
    closeHierarchyPortraitLightbox();
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
        modal.style.zIndex = '';
    });
    if (modalBackdrop) {
        modalBackdrop.style.display = 'none';
        modalBackdrop.style.zIndex = '';
    }
    body.style.overflow = 'auto';
}

let _lastHierarchyPortraitTrigger = null;

function openHierarchyPortraitLightbox(src, titleText = '', roleText = '', altText = '', triggerEl = null) {
    if (!src || typeof document === 'undefined') return false;
    const lightbox = document.getElementById('hierarchy-photo-lightbox');
    const lightboxImg = document.getElementById('hierarchy-lightbox-img');
    const lightboxTitle = document.getElementById('hierarchy-lightbox-title');
    const lightboxRole = document.getElementById('hierarchy-lightbox-role');
    if (!lightbox || !lightboxImg) return false;

    _lastHierarchyPortraitTrigger = triggerEl || null;
    lightboxImg.setAttribute('src', src);
    lightboxImg.alt = altText || (titleText ? `Portrait of ${titleText}` : 'Expanded portrait');

    if (lightboxTitle) {
        lightboxTitle.textContent = titleText || '';
        lightboxTitle.style.display = titleText ? '' : 'none';
    }
    if (lightboxRole) {
        lightboxRole.textContent = roleText || '';
        lightboxRole.style.display = roleText ? '' : 'none';
    }

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');

    const closeBtn = document.getElementById('close-hierarchy-lightbox');
    if (closeBtn && typeof closeBtn.focus === 'function') {
        closeBtn.focus();
    }
    return true;
}

function closeHierarchyPortraitLightbox() {
    if (typeof document === 'undefined') return false;
    const lightbox = document.getElementById('hierarchy-photo-lightbox');
    if (!lightbox || !lightbox.classList.contains('is-open')) return false;

    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');

    const lightboxImg = document.getElementById('hierarchy-lightbox-img');
    if (lightboxImg) {
        lightboxImg.removeAttribute('src');
        lightboxImg.alt = '';
    }

    if (
        _lastHierarchyPortraitTrigger &&
        typeof _lastHierarchyPortraitTrigger.focus === 'function' &&
        document.contains(_lastHierarchyPortraitTrigger)
    ) {
        _lastHierarchyPortraitTrigger.focus();
    }
    _lastHierarchyPortraitTrigger = null;
    return true;
}

function bindHierarchyPortraitLightboxEvents() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (window._hierarchyPortraitLightboxBound) return;
    window._hierarchyPortraitLightboxBound = true;

    document.addEventListener('click', (e) => {
        const target = e.target;
        if (!target || typeof target.closest !== 'function') return;

        if (target.closest('#close-hierarchy-lightbox')) {
            e.preventDefault();
            closeHierarchyPortraitLightbox();
            return;
        }

        const openLightbox = document.getElementById('hierarchy-photo-lightbox');
        if (
            openLightbox &&
            openLightbox.classList.contains('is-open') &&
            target.closest('#hierarchy-photo-lightbox') &&
            !target.closest('.hierarchy-lightbox-img, .hierarchy-lightbox-caption')
        ) {
            closeHierarchyPortraitLightbox();
            return;
        }

        const portraitWrap = target.closest('.hierarchy-portrait-wrap, .auspices-portrait-wrap');
        if (portraitWrap) {
            const img = portraitWrap.querySelector('img');
            const src = portraitWrap.getAttribute('data-portrait-src') || (img ? img.getAttribute('src') : '');
            if (!src) return;
            const card = portraitWrap.closest('.hierarchy-card, .auspices-leader-card');
            const titleEl = card ? card.querySelector('.hierarchy-card-title, .auspices-leader-name') : null;
            const roleEl = card ? card.querySelector('.hierarchy-card-role, .auspices-leader-role') : null;
            const titleText = portraitWrap.getAttribute('data-portrait-title') || (titleEl ? titleEl.textContent.trim() : '');
            const roleText = portraitWrap.getAttribute('data-portrait-role') || (roleEl ? roleEl.textContent.trim() : '');
            const altText = img ? (img.getAttribute('alt') || '') : '';
            openHierarchyPortraitLightbox(src, titleText, roleText, altText, portraitWrap);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const lightbox = document.getElementById('hierarchy-photo-lightbox');
            if (lightbox && lightbox.classList.contains('is-open')) {
                e.preventDefault();
                e.stopPropagation();
                closeHierarchyPortraitLightbox();
            }
        }
    });
}

const HISTORICAL_PREFACES_DATA = {
    intro: {
        titleEn: 'Introduction to the First Edition',
        titleAm: 'የመጀመሪያው ድርሰት መግቢያ።',
        blocks: [
            {
                type: 'heading',
                en: 'Regarding the Order of the Church.',
                am: 'ስለ ቤተ ክርስቲያን ሥርዓት።'
            },
            {
                type: 'paragraph',
                en: '"Church" means a gathering place for Christians, a single congregation. In the Church, the Holy Scriptures are read, the Gospel is preached; the mysteries of Baptism and the Eucharist are all performed according to the order of the Gospel; and all priests and laity, with one heart and one spirit, praise their Heavenly Father through Christ (Colossians 3:16).',
                am: 'ቤተ ክርስቲያን ማለት የክርስቲያን መሰብሰቢያ አንዲት ጉባኤ ማለት ነው። በቤተ ክርስቲያን ቅዱሳት መጻሕፍት ይነበቡባታል፣ ወንጌል ይሰበክባታል፤ ምሥጢራተ ጥምቀትና ምሥጢራተ ቍርባን ሁሉ እንደ ወንጌል ሥርዓት ይሠሩባታል፤ ካህናትም ምእመናንም ሁሉ በአንድ ልብ በአንድ መንፈስ ሆነው ሰማያዊ አባታቸውን እግዚአብሔርን በክርስቶስ ያመሰግኑባታል (ቈላ. ፫፥፲፮)።'
            },
            {
                type: 'paragraph',
                en: 'This is the benefit of priests and laity gathering and serving in unity in the Church. Our Lord Jesus Christ gave us hope, saying, "Where two or three are gathered together in my name, there am I in the midst of them" (Matthew 18:20). Therefore, the Church is where corporate prayer and corporate thanksgiving are offered; we have not found it written in the books that every person should enter the Church to pray their own individual prayer publicly while others are watching. Therefore, it is written in the Gospel of Matthew: "And when you pray, you shall not be like the hypocrites. For they love to pray standing in the synagogues and on the corners of the streets, that they may be seen by men. Assuredly, I say to you, they have their reward. But you, when you pray, go into your room, pray to your Father who is in the secret place; and your Father who sees in secret will reward you openly." (Matt. 6:5-6). This instructs that one\'s personal prayer should be prayed at home.',
                am: 'ካህናትና ምእመናን አንድነት በቤተ ክርስቲያን በመሰብሰባቸው በማገልገላቸው የሚያራት ጥቅም ይህ ነው። "ሁለት ወይም ሶስት ሆነው በስሜ ወደተከማቹበት እኔ ከዚያ በመካከላቸው እሆናለሁ" ብሎ ጌታችን ኢየሱስ ክርስቶስ ተስፋ ሰጥቶናል (ማቴ. ፲፰፥፳)። እንኪያስ ቤተ ክርስቲያን የጉባኤ ጸሎትና የጉባኤ ምስጋና ይደረግባታል እንጂ፣ ሰው ሁሉ ለየራሱ ከቤተ ክርስቲያን ገብቶ ሰው እያየው በጉባኤ ሊጸልይ እንዲገባው ከመጻሕፍት ተጽፎ አላገኘንም። ስለዚህም በማቴዎስ ወንጌል እንዲህ ተብሎ ተጽፎአል፤ ‹በጸለይህም ጊዜ እንደ ግብዞች አትሁን በጉባኤ በአደባባይ ማዕዘን ቆመው ይጸልዩ ዘንድ ይወዳሉና ለሰው ሊታዩ ፤ እውነት እነግራችኋለሁ ዋጋቸውን እንደወሰዱ አንተ ግን በጸለይህ ጊዜ ወደ ቤትህ ግባ ደጅህንም ዝጋ ፤ በሥውር ለሚያይህ ለአባትህ ጸልይ በሥውር የሚያይህም አባትህ ዋጋህን በግልጽ ይሰጥሃል።› ብሏል (ማቴ. ፮፥፭-፮)። ይህም የራስን ጸሎት በቤት መጸለይ እንዲገባ ያስረዳል።'
            },
            {
                type: 'paragraph',
                en: 'In the Ethiopian Church, due to the Ge\'ez language, for a long time, the priests and the people have lived separated in prayer and thanksgiving within the Church. Because all the books were written in the Ge\'ez language, which they did not understand, the people, lacking someone to open it for them, would enter the church and depart praying their own individual prayers. This Ge\'ez language became a reason why the people could not praise with one heart and one mouth, could not hear the reading of the scriptures, could not grow in spiritual knowledge, and could not know the taste of its fruit.',
                am: 'በኢትዮጵያ ቤተ ክርስቲያን በግዕዝ ቋንቋ ምክንያት ከብዙ ዘመን ጀምሮ ካህናቱና ሕዝቡ በቤተ ክርስቲያን ውስጥ በጸሎትና በምስጋና ተለይተው ይኖራሉ። ሕዝቡ ከካህናቱ ጋራ እግዚአብሔርን እንዳይለምኑና እንዳያመሰግኑ መጻሕፍቱ ሁሉ የተጻፉት በማያውቁት በግዕዝ ቋንቋ ስለ ነበረ የሚከፍትላቸው አጥተው ሕዝቡ ሁሉ ከቤተ ክርስቲያን ገብተው የራሳቸውን ጸሎት እየጸለዩ ይሄዳሉ። ይኸውም ግዕዝ ቋንቋ ሕዝቡ አንድ ልብ አንድ አፍ ሆነው እንዳያመሰግኑ ፤ የመጻሕፍቱንም ንባብ እንዳይሰሙና በመንፈሳዊ አእምሮ እንዳያድጉ የፍሬውንም ጣዕም እንዳያውቁ ምክንያት ሆኖ ይኖር ነበርና ነው።'
            },
            {
                type: 'paragraph',
                en: 'Our most beloved and honored fathers and brothers, the priests, you know what St. Paul said: that even now, if a language the people do not understand is spoken in the church, it is of no benefit. "How will he who occupies the place of the uninformed say \'Amen\' at your giving of thanks, since he does not understand what you say? For you indeed give thanks well, but the other is not edified." (1 Cor. 14:16-17).',
                am: 'እጅግ የተወደዳችሁ ክቡራን አባቶቻችንና ወንድሞቻችን ካህናት አሁንም ቢሆን ሕዝብ የማይሰማው ቋንቋ ከቤተ ክርስቲያን ቢነገር ምንም ጥቅም እንደሌለው ቅዱስ ጳውሎስ የተናገረውን ታውቃላችሁ። "ባጠገብህ ቆሞ ያለው ሰው ያልተማረ ስለ ሆነ በአንተ ምስጋና ላይ እንዴት አሜን ይላል የምትለውን አያውቅምና እንድታመሰግንም አልገባውምና እነሆ አንተስ መልካም ታመሰግናለህ የዚያ ሰው ልቡ ግን እንዴት ይረዳል ።" (፩ ቆሮ. ፲፬፥፲፮-፲፯)'
            },
            {
                type: 'paragraph',
                en: 'Therefore, priests ought to pray, praise, preach, and teach in a language the people understand. The people should also follow the priests in praying and praising. Because the Church is one body and one spirit, there is no separation between the priests and the laity. We are all children of the priesthood and the kingdom. We have all tasted one heavenly grace. St. Peter also said: "But you are a chosen generation, a royal priesthood, a holy nation, His own special people, that you may proclaim the praises of Him who called you out of darkness into His marvelous light" (1 Pet. 2:9).',
                am: 'ስለዚህም ካህናት ሕዝቡ በሚሰማው ቋንቋ ሊጸልዩና ሊያመሰግኑ ሊሰብኩና ሊያስተምሩ ይገባቸዋል። ሕዝቡም ቀሳውስቱን እየተከተሉ ሊጸልዩና ሊያመሰግኑ ይገባቸዋል። ቤተ ክርስቲያን አንድ አካል አንድ መንፈስ ስለ ሆነች በካህናትና በምእመናን መካከል መለያየት የለም። ሁላችን የክህነትና የመንግሥተ ልጆች ነን። ሁላችን አንዲት ሰማያዊት ጸጋን ቀምሰናል። ቅዱስ ጴጥሮስም እንዲህ ብሏል ፤ «እላንት ግን የተመረጠ የመንግሥትና የክህነት ወገን ናችሁ ፤ የተቀደሰች ዘር ፣ ለርስት የተለየ ሕዝብ ፤ ከጨለማ ወደማይነገር ወደ ብርሃኑ የጠራችሁን የእርሱን ሥራ ትገልጹ ዘንድ ።» (፩ ጴጥ. ፪፥፱)'
            },
            {
                type: 'paragraph',
                en: 'Therefore, there is no difference between the laity and the priests. "To Him who loved us and washed us from our sins in His own blood, and has made us kings and priests to His God and Father, to Him be glory and dominion forever and ever. Amen." (Rev. 1:6).',
                am: 'ስለዚህም በምእመናንና በካህናት መካከል ልዩነት የለም። «ነገሥታትና ካህናት ያደረገን ፤ ለአባቱ ለእግዚአብሔር ለርሱም ክብር ምስጋና ይሁን ችሎታም ከዘላላም እስከ ዘላላም ድረስ አሜን ።» (ራእ. ፩፥፮)'
            },
            {
                type: 'heading',
                en: 'Regarding the Order of Bible Reading.',
                am: 'ስለ መጽሐፍ ቅዱስ ንባብ ሥርዓት።'
            },
            {
                type: 'paragraph',
                en: 'We have divided the Bible reading into three parts so that it may be read daily, morning and evening, amidst the prayer. The division is as written below:',
                am: 'የመጽሐፍ ቅዱስ ንባብ በየቀኑ ጧትና ማታ በጸሎት መካከል ገብቶ እንዲነበብ በሶስት ክፍል አድርገን ከፍለነዋል። አከፋፈሉም ከዚህ በታች እንደ ተጻፈው ነው።'
            },
            {
                type: 'list',
                ordered: false,
                en: [
                    'Books of the Old Testament for the first reading,',
                    'Books of the New Testament for the second reading,',
                    'The Gospel for the third reading.'
                ],
                am: [
                    'መጻሕፍተ ብሉያትን ለመጀመሪያ ንባብ፣',
                    'መጻሕፍተ ሐዲሳትን ለሁለተኛ ንባብ፣',
                    'ወንጌልን ለሶስተኛ ንባብ፣'
                ]
            },
            {
                type: 'paragraph',
                en: 'Observe their arrangement as written below. The Old Testament books are grouped together, and by reading their major sections every morning and evening, the entire set is completed once a year. The New Testament books are also grouped together, and by reading their major sections every morning and evening, they are completed four times a year. The Gospel, read every morning and evening, is completed seven times a year.',
                am: 'አድርገን ከፍለናቸዋል። የነዚህንም አሠራራቸውን ከዚህ በታች እንደ ተጻፈው ተመልከት። መጻሕፍተ ብሉያት አንድ ወገን ሆነው ታላላቅ ክፍላቸው ጧትና ማታ ዘወትር እየተነበበ ባመት አንድ ጊዜ ይወጣል። መጻሕፍተ ሐዲሳትም አንድ ወገን ሆነው ታላላቅ ክፍላቸው ጧትና ማታ ዘወትር እየተነበበ ባመት አራት ጊዜ ይወጣል። ወንጌል ጧትና ማታ ዘወትር እየተነበበ ባመት ሰባት ጊዜ ይወጣል።'
            },
            {
                type: 'paragraph',
                en: 'What we call the New Testament books are:',
                am: 'መጻሕፍተ ሐዲሳትም ያልናቸው፦'
            },
            {
                type: 'list',
                ordered: false,
                en: [
                    'The Acts of the Apostles (Gibre Hawaryat)',
                    'The 14 Epistles of Paul',
                    'The 1 Epistle of James',
                    'The 2 Epistles of Peter',
                    'The 3 Epistles of John',
                    'The 1 Epistle of Jude'
                ],
                am: [
                    'የሐዋርያት ሥራ (ግብረ ሐዋርያት)',
                    'የጳውሎስ ፲፬ መልእክቶች፣',
                    'የያዕቆብ ፩ መልእክት፣',
                    'የጴጥሮስ ፪ መልእክቶች፣',
                    'የዮሐንስ ፫ መልእክቶች፣',
                    'የይሁዳ ፩ መልእክት - ናቸው።'
                ]
            },
            {
                type: 'paragraph',
                en: 'We have arranged these as one group. The Revelation of John, however, we have selectively extracted portions from it to be read on various specific feasts; we did not assign it to be read regularly alongside the New Testament books. However, we have arranged for its entire section to be read on Holy Saturday (Qedame S\'ur) according to the order established in the Gibre Himamat (Book of the Passion).',
                am: 'እሊህን አንድ ወገን አድርገን ሠርተናቸዋል። የዮሐንስ ራእይ ግን ለልዩ ልዩ በዓላት ይነበብ ዘንድ ከውስጡ ለቅመን አውጥተንለታል እንጂ፣ ዘወትር ከመጻሕፍተ ሐዲሳት ጋራ ሆኖ ይነበብ ዘንድ አልመደብነውም። ነገር ግን መላው ክፍሉ በቅዳሜ ስዑር እንዲነበብ በግብረ ሕማማት እንደ ተሠራው ሥርዓት አድርገን ሠርተነዋል።'
            },
            {
                type: 'paragraph',
                en: 'If you wish to know the Sunday readings, look at the Sunday readings section. There you will find the chapter and verse of the Bible to be read morning and evening; also, you will find the Misbak (chanted Psalm verse) to be preached on Sunday morning, with the chapter and verse of the Psalm.',
                am: 'የእሑድ ንባብንም ታውቅ ዘንድ ብትወድ በእሑድ ንባብ ላይ ተመልከት። ከዚያ ጧትና ማታ የሚነበበውን የመጽሐፍ ቅዱስ ምዕራፍና ቁጥር ታገኛለህ፤ ደግሞ እሑድ ጧት የሚሰበከውን ምስባክ፣ የመዝሙሩን ምዕራፍና ቁጥር ታገኛለህ።'
            },
            {
                type: 'paragraph',
                en: 'If you wish to know the readings for the Holidays, look at the Holiday reading index. You will also find the Misbak preached for each holiday there. You will find the readings for the ordinary days in the daily reading index.',
                am: 'የበዓላትንም ንባብ ታውቅ ዘንድ ብትወድ በበዓላት ንባብ ማውጫ ተመልከት። በየበዓላቱ የሚሰበከውንም ምስባክ ከዚያ ታገኘዋለህ። የዕለታትንም ንባብ በዕለታት ንባብ ማውጫ ታገኘዋለህ።'
            },
            {
                type: 'paragraph',
                en: 'Since the order of this book is very clear, it is not difficult to understand; to ensure there is no difficulty in finding the Bible readings, we have extracted and written a reading index for you.',
                am: 'የዚህ መጽሐፍ ሥርዓቱ በጣም የተገለጸ ስለ ሆነ ማወቁ አያስቸግርም፤ የመጽሐፍ ቅዱስንም ንባብ ለማግኘት እንዳያስቸግር የንባብ ማውጫ አውጥተን ጽፈንላችኋል።'
            },
            {
                type: 'paragraph',
                en: 'We have done this to the extent that God gave us the strength and ability so that the Bible reading proceeds accurately.',
                am: 'የመጽሐፍ ቅዱስ ንባብ በትክክል እንዲሄድ እግዚአብሔር ኃይልንና ችሎታን በሰጠን መጠን አደረግን።'
            },
            {
                type: 'paragraph',
                en: 'From the Psalms of David, without being excessive, readings are done in the morning and evening amidst the prayers. According to the established order, three Psalms or four Psalms should be read. We did this so that the order of prayer would proceed properly.',
                am: 'ከዳዊትም መዝሙር ሳይበዛ ጧትና ማታ በጸሎት መካከል ይነበባል። እንደ ተወሰነው ሥርዓት ሦስት ሦስት መዝሙር፣ ወይም አራት አራት መዝሙር ይነበብ። እንዲህም ማድረጋችን የጸሎቱ ሥርዓት በትክክል እንዲሄድ ብለን ነው።'
            },
            {
                type: 'paragraph',
                en: 'Regarding hope and love for our country, Ethiopia, we have selected and extracted psalms written in the Bible and written them for you. Especially, so that our children will not forget our country, Ethiopia, and as a reminder for all priests and laity to remember her in their prayers when they gather in the church for prayer, we have taken the 136th Psalm of David (Psalm 137), which says "By the rivers of Babylon," and made it a psalm for Ethiopia. We have done this because all that was done before has become an example for us. Therefore, listen to what St. Paul said: "For whatever things were written before were written for our learning, that we through the patience and comfort of the Scriptures might have hope" (Romans 15:4). We have written this for you to the extent of the strength and ability God has given us, so behold, receive it in love.',
                am: 'ስለ ተስፋና ስለ ሀገራችን ፍቅር ስለ ኢትዮጵያም መዝሙር በመጽሐፍ ቅዱስ ተጽፎ ያገኘነውን ለቅመን አውጥተን ጽፈንላችኋል። ይልቁንም ሀገራችንን ኢትዮጵያን ልጆቻችን ሁሉ እንዳይረሱዋት ቀሳውስትና ምእመናን ሁሉ በቤተ ክርስቲያን ስለ ጸሎት በተሰበሰቡ ጊዜ በጸሎታቸው እንዲያስቡዋት ለማሳሰቢያ እንዲሆን ብለን ከዳዊት መዝሙር ፻፴፮ኛውን (መዝ. ፻፴፯) "ውስተ አፍላገ ባቢሎን" የሚለውን ለኢትዮጵያ መዝሙር አድርገን ሠርተነዋል። ይህንንም ማድረጋችን አስቀድሞ የተደረገው ሁሉ ለኛ ምሳሌ ሆኗልና ነው። ስለዚህም ቅዱስ ጳውሎስ የተናገረውን ስሙ፤ «አስቀድሞ የተጻፈው ሁሉ ለእኛ ትምህርት ሊሆን ተጽፎአል፤ በትዕግሥትና በመጻሕፍት ቃል በመጽናናት ተስፋን እናገኝ ዘንድ» ብሏል (ሮሜ ፲፭፥፬)። እኛም ኃይልንና ችሎታን እግዚአብሔር በሰጠን መጠን ጽፈንላችኋልና እነሆ በፍቅር ተቀበሉት።'
            },
            {
                type: 'heading',
                en: 'The Reading Order Established for the Passion Week (Gibre Himamat).',
                am: 'በግብረ ሕማማት የተሠራ የንባብ ሥርዓት።'
            },
            {
                type: 'paragraph',
                en: 'To know the readings of the Passion Week, we have created a Passion Week reading index (Gitzawe) to guide you. From Hosanna (Palm Sunday) to the feast of the Resurrection, we have extracted everything to be read daily and hourly from the Bible and written them by chapter and verse; it can be found there in the Passion Week reading index (Gitzawe). The person looking for it will find the chapter and verse written down. That chapter and verse will lead them to the Bible reading. The Misbak preached from the Psalms of David is also found written in sequence daily and hourly alongside the Passion Week reading.',
                am: 'የግብረ ሕማማትንም ንባብ ለማወቅ የሚመራ የግብረ ሕማማት ንባብ ማውጫ (ግጻዌ) ሠርተናል። ከሆሳዕና ጀምሮ እስከ ትንሣኤ በዓል በየቀኑ በየሰዓቱ የሚነበበውን ሁሉ ከመጽሐፍ ቅዱስ ውስጥ ለቅመን አውጥተን በየምዕራፉና በየቁጥሩ ጽፈነዋልና፤ ከዚያ ከግብረ ሕማማት ንባብ ማውጫ (ግጻዌ) ይገኛል። የሚመለከተው ሰውም ምዕራፉንና ቁጥሩን ተጽፎ ያገኘዋል። ያም ምዕራፍና ቁጥር ወደ መጽሐፍ ቅዱስ ንባብ ይመራዋል። ከዳዊት መዝሙር የሚሰበከውም ምስባክ በየቀኑ በየሰዓቱ ከግብረ ሕማማት ንባብ ጋራ በተራ ተጽፎ ይገኛል።'
            },
            {
                type: 'paragraph',
                en: 'The readings for the Monday and Tuesday feasts of Ma\'edot (the days following Easter) are found written in the Passion Week reading index. We made the readings of the Passion Week to be read in Amharic so that our Church might hear and understand the suffering, death, and resurrection that our Lord Jesus Christ accepted on Friday to save the world that was dead in sin, and so that, burning with the love of Christ, she might grow in spiritual knowledge and the true faith.',
                am: 'ከትንሣኤም በኋላ የሚከተለው የማዕዶት ሰኞና የማክሰኞ በዓል ንባብ በግብረ ሕማማት ንባብ ማውጫ ተጽፎ ይገኛል። የግብረ ሕማማቱም ንባብ ባማርኛ እንዲነበብ ማድረጋችን ጌታችን ኢየሱስ ክርስቶስ በኃጢአት ሞቶ ይኖር የነበረውን ዓለም ለማዳን ብሎ በዕለተ ዓርብ የተቀበለውን መከራውንና ሞቱን ትንሣኤውን ቤተ ክርስቲያናችን እንድትሰማውና እንድታስተውለው በክርስቶስ ፍቅር እየተቃጠለች በመንፈሳዊ ዕውቀትና በእውነተኛው ሃይማኖት እንድታድግ ብለን ነው።'
            },
            {
                type: 'paragraph',
                en: 'Since the Passion Week reading index is very clear, it is easy to understand and is not difficult. Moreover, there are many admonitions and many homilies ordered to be read within the Passion Week order. These are the books of John Chrysostom. There are also homilies and admonitions of other scholars, and all these should be read during the Passion Week.',
                am: 'የግብረ ሕማማቱም ንባብ ማውጫ በጣም የተገለጸ ስለ ሆነ ለማስተዋል ቀላል ነውና የሚያስቸግር አይደለም። ደግሞ በግብረ ሕማማት ሥርዓት ውስጥ እንዲነበቡ የታዘዙ ብዙ ተግሣጾች ብዙ ድርሳኖች አሉ። እሊህም የዮሐንስ አፈ ወርቅ መጻሕፍት ናቸው። ደግሞም የሌሎች ሊቃውንት ድርሳኖችና ተግሣጾች ይገኛሉና እሊህ ሁሉ በሰሙነ ሕማማት ሊነበቡ ይገባቸዋል።'
            },
            {
                type: 'heading',
                en: 'Notice Regarding Holidays.',
                am: 'ስለ በዓላት ማስታወቂያ።'
            },
            {
                type: 'paragraph',
                en: 'So that everyone may know the dates on which the holidays fall, we have extracted them from the Synaxarium (Senksar) according to its written order and written them by their names in the holidays section. On the day of a holiday, the ordinary reading is not assigned. This is because the holiday reading has been specially written along with its Misbak, with the intention that the holiday reading should be read. However, in the holiday index, if there is no specific reading assigned for the holiday, the reading from the ordinary daily index is read for it.',
                am: 'በዓላት የሚውሉበትን ቀን ሰው ሁሉ እንዲያውቀው በማለት በስንክሳር እንደ ተጻፈው ሥርዓት ከስንክሳር ውስጥ ለቅመን አውጥተን በበዓላት ክፍል ውስጥ በየስማቸው ጽፈናቸዋል። በዓል በሆነበት ቀን የዘወትር ንባብ አልተሠራም። ምክንያቱም የበዓላት ንባብ ከነምስባኩ በተለይ ተጽፎአልና የበዓሉ ንባብ እንዲነበብ በማለት ነው። ነገር ግን በበዓላት ግጻዌ ለበዓሉ በተለይ የተሠራለት ምንባብ ባልኖረ ጊዜ ከዘወትሩ የዕለታት ግጻዌ ይነበብለታል።'
            }
        ]
    },
    preface: {
        titleEn: 'Preface to the Second Edition',
        titleAm: 'የሁለተኛው ድርሰት መቅድም ።',
        blocks: [
            {
                type: 'paragraph',
                page: 'Page 5',
                en: 'Preface to the Second Edition. This prayer book has been compiled according to the law of the Fathers, so that the faithful may pray the morning and evening prayers in the church. Prayer means the word by which a person communicates with their Creator in faith, praising their Creator and begging for the forgiveness of sins. (Fetha Negest, Article 14, page 105).',
                am: 'የሁለተኛው ድርሰት መቅድም። ይህ የጸሎት መጽሐፍ እንደ አበው ሕግ፣ ምእመናን የጧቱንና የማታውን ጸሎት በቤተ ክርስቲያን እንዲጸልዩበት ተሠርቷል። ጸሎት ማለት፣ ሰው ፈጣሪውን እያመሰገነና ሥርየተ ኃጢኣትን እየለመነ በሃይማኖት ከፈጣሪው ጋር የሚነጋገርበት ቃል ነው። (ፍ. ነገ. አን. ፲፬ ገጽ ፻፭።)'
            },
            {
                type: 'paragraph',
                en: 'The ancient fathers established an order for the faithful to pray every day at the 7 hours. The 7 hours are Negih (Morning), Selest (Third Hour), Keter (Noon), Tesiyat (Ninth Hour), Serk (Evening), Niwam (Compline/Sleep), and Menfeke Lelit (Midnight). Separated from these, it is permitted for the faithful to offer the prayer in the morning (Negih) and in the evening (Serk) in their homes or at the places where they hold their duties. For the priests, apart from this, there is another specially commanded order of prayer. Therefore, this book has been prepared to be a prayer manual for the laity.',
                am: 'ምእመናን ሁለቀን በ፯ቱ ጊዜያት እንዲጸልዩ የቀድሞ አባቶች ሥርዓት ሠርተዋል። ፯ቱ ጊዜያት የሚባሉትም ነግህ፣ ሠለስት፣ ቀትር፣ ተሲያት፣ ሠርክ፣ ንዋም፣ መንፈቀ ሌሊት ናቸው። ከነዚህም ተለይቶ በነግህና በሠርክ ግን ምእመናን በቤታቸው፣ ወይም ተግባር በያዙላት ሥፍራ ሆነው ጸሎቱን (አቈጻሮውን) እንዲያደርሱ ተፈቅዷል። ለካህናትም ከዚህ በቀር ሌላ በተለይ የታዘዘ የጸሎት ሥርዓት አላቸው። ስለዚህም ይህ መጽሐፍ ለምእመናን መጸለያ እንዲሆን ተሠርቷል።'
            },
            {
                type: 'paragraph',
                en: 'The origin of this matter is as follows. In the year 1928 A.M. [1935/1936 AD] (which was the 6th year of the reign of Haile Selassie I), the Italian government, transgressing international law, unjustly initiated a war of aggression against Ethiopia. The Ethiopians, saying "Our God is our strength and our refuge," after the aggressive government (Italy) brought weapons that fly in the sky and roll on the ground and fought for 7 months... unable to succeed, began an illegal war, scattering poison gas prohibited by international law.',
                am: 'የዚህም ጥንተ ነገሩ እንደሚከተለው ነው። በ፲፱፻፳፰ ዓ. ም. (ይኸውም ፮ኛ የቀዳማዊ ኃይለ ሥላሴ ዘመነ መንግሥት ነው።) የኢጣልያ መንግሥት ከዓለም ሕግ ተላልፎ በኢትዮጵያ ላይ ያለፍትሕ በግፍ ጦርነት አነሣ። ኢትዮጵያውያንም አምላክነሰ ኃይልነ ወፀወንነ እያሉ በግፍ የተነሣው መንግሥት (ኢጣልያ) በሰማይ የሚበረውን በምድር የሚሽከረከረውን መሣሪያ አምጥቶ ፯ ወር ከተዋጋ በኋላ ለማድረግ ባይሆንለት በዓለም ሕግ የተከለከለውን የመርዝ ጭስ እየበተነ የሕገ ወጥነት ጦርነት ያደርግ ጀመረ።'
            },
            {
                type: 'paragraph',
                en: 'As a result, when the attacks of the lawless enemy increased, to make the governments of the world aware of the injustice, the Emperor, taking a few of the nobles and scholars, crossed over to England. The rest of the Ethiopian people, organizing various leaders, began to defend their faith and freedom from the valleys and hills. The remaining people in the countryside and the city, due to old age or weakness, lived fighting an internal struggle, serving through prayer, counsel, and compassion.',
                am: 'ከዚህ የተነሣ የዐላዊው ጠላት አጥቂነት ቢበዛ ግፉን ለዓለም መንግሥታት ለማስገንዘብ ንጉሠ ነገሥቱ ከባላባቶችና ከሊቃውንቱ ጥቂቶቹን ይዘው ወደ እንግሊዝ አገር ተሻገሩ። የቀረውም የኢትዮጵያ ሕዝብ አንዳንድ መሪ እያበጀ በየሸለቆውና በየኮረብታው ሆኖ ለሃይማኖቱና ለነፃነቱ ይከራከር ጀመር። በአርጅና ወይም በድካም ከገጠርና ከከተማ የቀረውም ሕዝብ በጸሎት፣ በምክር፣ በእዝናት እያገለገሉ ውስጣዊ ተጋድሎ ሲጋደሉ ኖሩ።'
            },
            {
                type: 'paragraph',
                en: 'The invading government began to advance and continue its atrocities only in areas accessible by motor roads. Because of this, churches were burned, and priests and laity were killed by bombs and bullets.',
                am: 'ወራሪው መንግሥት የመኪና መንገድ በሚገኝባቸው አገሮች ብቻ ገብቶ የግፍ ሥራውን እየቀጠለ ይሄድ ጀመር። ከዚህም የተነሣ አብያተ ክርስቲያናት ተቃጠሉ፣ ካህናትና ምእመናን በቦምብ በጥይት ተገደሉ።'
            },
            {
                type: 'paragraph',
                page: 'Page 6',
                en: 'Especially on Yekatit 12, 1929 A.M. [February 19, 1937 AD], an unprecedented massacre of people took place. The lawless (cursed) Graziani gathered the city\'s population in Addis Ababa by decree, and finding an excuse like the ancient Caesar Nero, began to have all the people slaughtered. The blood of innocent people flowed like a flood; and he burned the city. Because he ordered the people of the provinces to be killed, priests, deacons, children, elders, women, and widows were indiscriminately massacred everywhere; mothers and fathers with their children, teachers with their disciples were killed.',
                am: 'ይልቁንም በየካቲት ፲፪ ቀን ፲፱፻፳፱ ዓ.ም. ከልክ ያለፈ የሰው እልቂት ተደረገ። ዕልው (ርጉም) ግራዚያኒ በአዲስ አበባ ላይ የከተማውን ሕዝብ በዓዋጅ ሰብስቦ እንደ ዱሮው እንደ ኔሮን ቄሣር ሰበብ ፈልጎ ሕዝቡን ሁሉ ያስፈጅ ጀመረ። የንጹሕ ሕዝብ ደም እንደ ጐርፍ ፈሰሰ ፤ ከተማውንም አቃጠለው። የየአውራጃውም ሕዝብ እንዲገደል ስላዘዘ ቄስ፣ ዲያቆን፣ ሕፃን፣ ሸማግሌ፣ ሴት፣ ባልቴት ፤ ሳይመረጥ በያለበት ይጨፈጨፍ ጀመር ፤ እናትና አባት ከነልጆቻቸው ፤ መምህራን ከነደቃ መዛሙርቶቻቸው ተገደሉ።'
            },
            {
                type: 'paragraph',
                en: 'Half were burned in the fire with their house doors locked. Half were torn apart by bombs wherever they were. Those who survived death were taken to exile where they lived in agony.',
                am: 'ግማሹ በየቤቱ በር እየተዘጋበት በእሳት ነደደ። ግማሹም ደግሞ በያለበት በቦምብ ተቀረደደ። ከሞት የተረፈውም በሥቃይ ወደሚኖርበት ወደ ግዞት ተወሰደ።'
            },
            {
                type: 'paragraph',
                en: 'The number of Ethiopians killed everywhere by the order of the lawless government is estimated at up to 150,000. As an example, we will write below a few of the martyrs killed during this era of the lawless:',
                am: 'በዐላዊው መንግሥት ትእዛዝ በያገሩ የተገደሉት የኢትዮጵያውያን ቁጥር እስከ ፻፶ ሺህ ድረስ ተሸልጓል። በዚሁ በዘመነ ዐላውያን የተገደሉትን ሰማዕታት ለምሳሌ ጥቂቶቹን ከዚህ ቀጥለን እንጽፋቸዋለን።'
            },
            {
                type: 'list',
                ordered: false,
                en: [
                    'On Hamle 22, 1928 A.M. [July 29, 1936 AD], the Bishop of Wollo, Abune Petros, witnessing to his Orthodox faith, was martyred in the market in Addis Ababa where the people were gathered.',
                    'On Hidar 21, 1929 A.M. [November 30, 1936 AD], the Bishop of Illubabor, Abune Mikael, was killed while teaching the Gospel in his diocese in Gore.',
                    'On Ginbot 12, 1929 A.M. [May 20, 1937 AD], the monks of Debre Libanos, saying "We believe in Christ our God" and witnessing to their faith, were crowned with martyrdom. The monastery was also looted.',
                    'On Ginbot 28, 1929 A.M. [June 5, 1937 AD], the priests of Debre Bisrat Zena Markos were martyred. The Abbot, Memhir Wolde Mikael, was also killed within the church compound while teaching the Gospel. The survivors were taken to a harsh place of exile and tortured.',
                    'On Sene 24, 1929 A.M. [July 1, 1937 AD], the Asebot Monastery was looted. The monks were killed and tortured. Those who survived death were taken to a harsh place of exile.',
                    'On Hidar 25, 1930 A.M. [December 4, 1937 AD], the priests of Addis Alem were killed. The rest of Graziani\'s deeds and the atrocities of the Italians are found written in the chronicles of Ethiopian history.'
                ],
                am: [
                    'ሐምሌ ፳፪ ቀን ፲፱፻፳፰ ዓ. ም. የወሎ ጳጳስ አቡነ ጴጥሮስ ኦርቶዶክሳዊት ሃይማኖታቸውን እየመሰከሩ ሕዝብ በተሰበሰበበት በአዲስ አበባ ገበያ ውስጥ በሰማዕትነት ተገደሉ።',
                    'በኅዳር ፳፩ ቀን ፲፱፻፳፱ ዓ. ም. የኢሉባቡር ጳጳስ አቡነ ሚካኤል በሀገረ ስብከታቸው በጎሬ ወንጌልን ሲያስተምሩ ተገደሉ።',
                    'በግንቦት ፲፪ ቀን ፲፱፻፳፱ ዓ. ም. የደብረ ሊባኖስ መነኰሳት ነአምን በክርስቶስ አምላክነ እያሉ ሃይማኖታቸውን እየመሰከሩ በሰማዕትነት ተከለሉ። ገዳሙም ተበረበረ።',
                    'በግንቦት ፳፰ ቀን ፲፱፻፳፱ ዓ. ም. የደብረ ብሥራት ዚና ማርቆስ ካህናት በሰማዕትነት ተገደሉ። አበ ምኔቱ መምህር ወልደ ሚካኤልም ወንጌልን ሲያስተምሩ በቤተ ክርስቲያኑ ቅጽር ውስጥ ተገደሉ። የተረፉትም ወደ ክፉ የግዞት ቦታ ተወስደው ተሣቀዩ።',
                    'በሰኔ ፳፬ ቀን ፲፱፻፳፱ ዓ. ም. የአሰቦት ገዳም ተበረበረ። መነኮሳቱ ተገደሉ፣ ተሣቀዩ። ከሞት የተረፉትም ወደ ክፉ የግዞት ቦታ ተወሰዱ።',
                    'በኀዳር ፳፭ ቀን ፲፱፻፴ ዓ. ም. የአዲስ ዓለም ካህናት ተገደሉ። የቀረው የግራዚያኒ ሥራውና የኢጣሊያኖች ግፍ በኢትዮጵያ ዜና ዘመን ተጽፎ የሚገኝ ነው።'
                ]
            },
            {
                type: 'paragraph',
                en: 'Now let us return to our original topic. After His Imperial Majesty Emperor Haile Selassie I went to England, the order of prayer and the Eucharist that used to be performed in Ethiopia...',
                am: 'እንግዴህ ወደ ጥንተ ነገራችን እንመለስ። ግርማዊ ንጉሠ ነገሥት ቀዳማዊ አጼ ኃይለ ሥላሴ ወደ እንግሊዝ አገር ከሄዱ በኋላ በኢትዮጵያ ይደረግ የነበረው ሥርዓተ ጸሎትና ቊርባን...'
            },
            {
                type: 'paragraph',
                page: 'Page 7',
                en: '...because of His thought that [the prayers] and Eucharist should not be lacking, even though it was a time of exile, since exile and distress, pain and death, sorrow and imprisonment, war and plague cannot hinder the love of Christ, so that the exiled faithful, remaining steadfast in His love, might continue to beseech Christ the God of peace just as they did in times of peace, saying "Stir up Your power, and come and save us, O God of hosts, restore us," and be comforted from their tribulation, He [the Emperor] wrote the following message by his own hand and sent it to Jerusalem to His Beatitude Echege Gebre Giorgis. The word is as follows:',
                am: '...እንዳይጐድል ከማሰባቸው የተነሣ ምንም እንኳ የስደት ጊዜ ቢሆን የክርስቶስን ፍቅር ስደትና ጭንቀት፣ ሕማምና ሞት፣ ኀዘንና እሥራት ጦርና መቅሠፍት ሊያግደው አይችልምና በዚያ የተሰደዱ ምእመናን በፍቅሩ ጸንተው በሰላም ጊዜ ይለምኑት የነበረውን አምላከ ሰላም ክርስቶስን እንዲሁ በስደታቸው ጊዜ “አንሥእ ኃይለከ ወነዓ አድኅነነ አምላከ ኃያላን ሚጠነ” እያሉ እንዲለምኑና ከመከራቸውም እንዲጽናኑበት ስላሰቡ ከዚህ የሚከተለውን መልእክት በጃቸው ጽፈው ወደ ኢየሩሳሌም ለብፁዕ እጨጌ ገብረ ጊዮርጊስ ላኩላቸው። ቃሉም ይህ የሚከተለው ነው።'
            },
            {
                type: 'note',
                en: '(His Majesty\'s message was written only in Amharic. But now, we have translated it into Ge\'ez and written it together to honor the language of the clergy and for the sake of remembrance.)',
                am: '(የግርማዊነታቸው መልእክት የተጻፈው በአማርኛ ብቻ ነበር። አሁን ግን ወደ ግዕዝ ተርጕመን በአንድነት መጻፋችን የቤተ ክህነትን ቋንቋ ስለ ማክበርና ለዝክረ ነገር እንዲሆን በማለት ነው።)'
            },
            {
                type: 'paragraph',
                en: 'Conquering Lion of the Tribe of Judah, Haile Selassie I, Elect of God, King of Kings of Ethiopia. May it reach my blessed father, Echege Gebre Giorgis.',
                am: 'ሞዓ አንበሳ ዘእምነገደ ይሁዳ ቀዳማዊ ኃይለ ሥላሴ ሥዩመ እግዚአብሔር ንጉሠ ነገሥት ዘኢትዮጵያ። ይድረስ ከብፁዕ አባቴ ከእጨጌ ገብረ ጊዮርጊስ። (ለአብ ብፁዕ እጨጌ ገብረ ጊዮርጊስ።)'
            },
            {
                type: 'paragraph',
                en: 'How have you been? We, thank God, are well. As for our current situation, we are thinking of you, there is nothing causing us worry here. Rather, our presence here—sending our envoys to the meetings held from time to time in Geneva as permitted to us—is our main aid for the cause for which we came. Having understood that it is necessary to stay here and listen until the judgment of our Creator concludes the Ethiopian cause, we have determined to remain here in England until we know the definitive judgment of our Creator.',
                am: 'እንደምን ሰንብተዋል እኛ እግዚአብሔር ይመስገን ደኅና ነን። (ሰላም ለከ፤ ወንሕነኒ ንሀሉ በሰላም ስብሐት ለእግዚአብሔር።) እስካሁንም ባለነው አኳኋን የምናስበው ለናንተ ነው እንጂ ወደኛ ምንም የሚያሳስብ የለም። (ወበእንተ ሀልዎትነሂ ዘይእዜ አልቦ ጻሕቅ በኀቤነ ዘእንበለ ዳዕሙ ንጽሕቅ ለክሙ።) ይልቁንም የኛ እዚህ መሆን በየጊዜው ጀኔቭ በሚደረገው ስብሰባ በፈቀድልን የኛን መልእክተኞቻችንን መላክ ለመጣንበት ጕዳይ ዋና ረዳታችን ስለ ሆነ (ወሀልዎትነሂ ዘዝየ እመ ተበዋሕነ ወእመኒ ኢተበዊሕነ ከመ ንፈኑ መልእክተነ ውስተ ዘጉባኤ ዘይትገበር በበጊዜሁ በጀኔቭ ባቁዕ ጥቀ ለግብረ ነገር ዘመጻእነ ቦቱ።) የፈጣሪያችን ፍርድ የኢትዮጵያን ጕዳይ እስካጠቃለለልን ድረስ እዚሁ ሆኖ ማዳመጥ የሚያስፈልግ መሆኑን ስለ ተረዳነው የፈጣሪያችንን ቁርጥ ፍርድ እስክናውቅ ድረስ በዚሁ በእንግሊዝ አገር ለመቆየት ቈርጠናል። (ወበእንተዝ በዘአእመርነ ከመ ጥቀ መፍቅድ ንንበር ዝየ ወናጽምዕ ዘይከውን፤ ዐቀምነ ምክረ ኅሉቀ ወምቱረ ለነቢር በዛቲ ሀገር ዘእንግልጣር፤ እስከ አመ ይትከሠት ውሳኔ ምክሩ ለአምላክነ፤ ወዓዲ እስከ አመ ያስተራትዕ ለነ ኵሎ መፍቅዳ ለኢትዮጵያ ፍትሐ መዊዖቱ ለአምላክነ።)'
            },
            {
                type: 'paragraph',
                page: 'Page 8',
                en: 'Until the day the grace of God permits and releases us to come to Jerusalem, so that we may not suffer spiritual hardship and so that our growing children may not lose the foundation of their faith, I have sent Abba Hanna to bring one Tabot of the Covenant and 5 monks, along with the necessary sacred vessels and books given to him. Consult with Memhir Gerima and ensure they are sent to us so that they arrive before the beginning of the Great Lent.',
                am: 'የእግዚአብሔርም ቸርነት ፈቅዶልንና አሰናብቶን ወደ ኢየሩሳሌም እስከምንመጣበት ቀን ድረስ የሃይማኖት ችግር እንዳያገኘን የሚያድጉትም ልጆቻችን የሃይማኖታቸውን መሠረት እንዳያጡት አስበን አንድ የኪዳን ጽላትና ፭ መነኰሳት የሚያስፈልጉትን ንዋየ ቅድሳትና መጻሕፍት ሰጥተውት ይዞ እንዲመጣ አባ ሐናን ልኬዋለሁና ከመምህር ገሪማ ጋር ተመካክራችሁ ዐቢይ ጾም ሳይገባ እንዲደርስ አድርጋችሁ እንድትልኩልን ይሁን። (ወናሁ ፈነውክዎ ለአባ ሐና ከመ ያምጽእ ለነ ፩ደ ጽላተ ሕግ ዘኪዳን ምስለ ፭ቱ መነኰሳት፤ ወዓዲ መጻሕፍተ ወንዋየ ቅድሳት በእንተ ዘጽሕቅነ ከመ ኢይብጻሕ ብነ ዕፀበ ሃይማኖት፤ ወደቂቅነሂ ወራዙት ከመ ኢያንቀልቅሉ እመሠረተ ሃይማኖቶሙ፤ እስከ ዕለት ዘንበጽሕ ባቲ ኀበ ኢየሩሳሌም በሠርሖተ ፈቃዱ ለእግዚአብሔር፤ ወበተሰናእዎትከ ምስለ አባ ገሪማ አስተፋጥን ከመ ትፈኑ ለነ እምቅድመ በእተ ጾም ዐቢይ።)'
            },
            {
                type: 'paragraph',
                en: 'For our people who are exiled along our borders in foreign territories, it is likely necessary to send someone likewise; so consult on this, select a willing monk, and wait until we notify you. Tir 13, 1929 A.M. [January 21, 1937 AD], London.',
                am: 'በየጠረፋችንም ተሰደው በሰው ግዛት ላሉትም ሰዎቻችን እንደዚሁ ሰው መላክ አስፈላጊ ሳይሆን አይቀርምና እየተመካከራችሁበትና ፈቃዱ የሚሆን መነኵሴ እየመረጣችሁ እስክናስታውቃችሁ ድረስ መጠበቅ ነው። (ወከማሁ ለሕዝብነሂ ስዱዳን እለ ውስተ ብሔረ ባዕድ ዮጊ ይትፈቀድ ከመ ንፈኑ ሎሙ ብእሴ መምህረ። ወበእንተዝ ኅረዩ መነኰሰ ፈቃዳዌ በሥምረት ወበተሰናእም፤ ወእምከመ ረትዐትክሙ ይደሉ ትጽንሕዋ ለመልእክት ዘንሕነ ናኤምረክሙ።) ጥር ፲፫ ቀን ፲፱፻፳፱ ዓ. ም. ሎንዶን። (ተጽሕፈ አመ ፲ወ፫ ለጥር በ፲፻ወ፱፻፳ወ፱ ዓ.ም. ሎንዶን።)'
            },
            {
                type: 'paragraph',
                en: 'After His Beatitude Echege Gebre Giorgis received this message from His Imperial Majesty, he entrusted a Tabot named after the Savior of the World (Medhane Alem) into the hands of five monks, added the sacred vessels and books necessary for the Eucharist and prayer, and immediately sent them with haste to England. The names of the five monks are as follows:',
                am: 'ብፁዕ እጨጌ ገብረ ጊዮርጊስም ይህ የግርማዊ ጃንሆይ መልእክት ከደረሰላቸው በኋላ በስመ መድኃኔ ዓለም የተጠራ ጽላት በአምስት መነኰሳት እጅ አስይዘው ለቍርባንና ለጸሎት የሚያስፈልጉትን ንዋያተ ቅድሳትና መጻሕፍት ጨምረው ወዲያው አፍጥነው ወደ እንግሊዝ አገር ላኩ። የአምስቱ መነኰሳትም ስም የሚከተለው ነው።'
            },
            {
                type: 'list',
                ordered: true,
                en: [
                    'Memhir Gebre Iyesus, monk and Qomos.',
                    'Abba Hanna, monk.',
                    'Abba Markos, monk.',
                    'Abba Haile Buruk, monk.',
                    'Abba Gebre Maryam, monk.'
                ],
                am: [
                    '፩ኛ መምሕር ገብረ ኢየሱስ መነኰስ ወቆሞስ ።',
                    '፪ኛ አባ ሐና መነኰስ ።',
                    '፫ኛ አባ ማርቆስ መነኰስ ።',
                    '፬ኛ አባ ኃይሌ ቡሩክ መነኰስ ።',
                    '፭ኛ አባ ገብረ ማርያም መነኰስ ።'
                ]
            },
            {
                type: 'paragraph',
                en: 'After these monks arrived in England, they blessed a prayer house and began to perform the order of prayer and the Eucharist according to the law of the Ethiopians. As a result, that church...',
                am: 'እነዚህ መነኰሳት ወደ እንግሊዝ አገር ከደረሱ በኋላ አንድ የጸሎት ቤት ባርከው እንደ ኢትዮጵያውያን ሕግ የጸሎትና የቍርባን ሥርዓት ያደርጉ ጀመር። ከዚህም የተነሣ ያች ቤተ ክርስቲያን «በስደት ያለች ኦር...'
            },
            {
                type: 'paragraph',
                page: 'Page 9',
                en: '...began to be called "The Exiled Orthodox Ethiopian Church." It started to expand and conduct its spiritual work. The faithful who were in exile in that country, continually hearing of the atrocities being committed in Ethiopia and living in sorrow, did not cease to remember their country in prayer. However, because there was no corporate prayer written in the Amharic language, it was a difficulty.',
                am: '...ቶዶክሳዊት የኢትዮጵያ ቤተ ክርስቲያን» ተብላ ትጠራ ጀመር። መንፈሳዊ ሥራዋንም እያስፋፋች መሥራት ጀመርች። በዚያ አገር በስደት የነበሩት ምእመናንም በኢትዮጵያ ላይ ይደረግ የነበረውን ግፍ በየጊዜው እየሰሙ በኀዘን ስለሚኖሩ አገራቸውን በጸሎት ከማሰብ አያቋርጡም ነበር። ዳሩ ግን በአማርኛ ቋንቋ የተጻፈ ጸሎተ ማኅበር ስላልነበረ ችግር ሆነ።'
            },
            {
                type: 'paragraph',
                en: 'After this, His Imperial Majesty Emperor Haile Selassie I, with boundless diligence, to alleviate the difficulty of the faithful, ordered that a prayer book be compiled and prepared in appropriate measure from the Holy Scriptures according to the order of the Ethiopian Church. Abba Markos worked diligently, and this prayer book was quickly written and released. Immediately, the faithful began gathering in the church and praying the morning and evening prayers with it.',
                am: 'ከዚህም በኋላ ግርማዊ ንጉሠ ነገሥት ቀዳማዊ አጼ ኃይለ ሥላሴ በማይወሰን ትጋታቸው የምእመናንን ችግር ለማቅለል ሲሉ አንድ የጸሎት መጽሐፍ እንደ ኢትዮጵያ ቤተ ክርስቲያን ሥርዓት ከቅዱሳት መጻሕፍት ተወጣጥቶ በመጠን ሆኖ እንዲሰናዳ አዘዙ። አባ ማርቆስ በትጋት ሠርተው ይህ የጸሎት መጽሐፍ በቶሎ ተጽፎ ወጣ። ወዲያው ምእመናን በቤተ ክርስቲያን እየተሰበሰቡ የጧቱንና የማታውን ጸሎት ይጸልዩበት ጀመር።'
            },
            {
                type: 'paragraph',
                en: 'Because the handwritten book could not reach everyone, in 1931 A.M. [1938/39 AD], the manuscript was reproduced using a lithograph machine. It was sent to those scattered in exile wherever they were. Even so, the faithful lived praying with this book, waiting at the gates for the mercy of God and the restoration of Ethiopia. When the time arrived, the light of freedom was revealed; the enemy\'s power was crushed. On Miyazya 28, 1933 A.M. [May 6, 1941 AD] (which is the 11th year of the reign of Emperor Haile Selassie I), His Imperial Majesty Emperor Haile Selassie I, holding the flag of freedom, returned in great majesty and sat upon his royal throne.',
                am: 'በእጅ ተጽፎ የነበረው መጽሐፍ ለሁሉ የማያዳርስ ስለ ሆነ በ፲፱፻፴፩ ዓ. ም. የእጅ ጽሕፈቱ በሊቶግራፍ መኪና እንዲባዛ ተደረገ። በስደትም ለተበተኑት በያሉበት ተላከ። እንዲህም ሆኖ ምእመናን በዚህ መጽሐፍ እየጸለዩ የአግዚአብሔርን ምሕረት፣ የኢትዮጵያን ሚጠት እየጠበቁ ደጅ ሲጠኑ ኖሩ። ጊዜው ሲደርስ የነፃነት ብርሃን ተገለጸ ፤ የጠላት ኃይል ተደመሰሰ። ሚያዝያ ፳፰ ቀን ፲፱፻፴፫ ዓ. ም. (ይኸውም ፲፩ኛ የቀዳማዊ አጼ ኃይለ ሥላሴ ዘመነ መንግሥት) ግርማዊ ንጉሠ ነገሥት ቀዳማዊ አጼ ኃይለ ሥላሴ የነፃነትን ሰንደቅ ዓላማ ይዘው በታላቅ ግርማ ተመልሰው በመንበረ መንግሥትዎ ተቀመጡ።'
            },
            {
                type: 'paragraph',
                en: 'The exiled Orthodox Ethiopian Church also returned to her inheritance. The Tabot of Medhane Alem (Savior of the World), which was the altar of prayer and sacrifice during the era of exile, entered Addis Ababa on Nehasse 23, 1933 A.M. [August 29, 1941 AD], together with Her Imperial Majesty Empress Menen when she returned from England. Later, on Miyazya 27, 1941 A.M. [May 5, 1949 AD], it was planted in the church built in the compound of the Haile Selassie I Hospital, named Miskaye Hizunan Medhane Alem (Refuge of the Sorrowful, Savior of the World). Because the Ethiopian Church prayer book from the era of exile stands as a useful memorial for the faithful, it was examined by scholars to be printed and used as before.',
                am: 'በስደት የነበረች ኦርቶዶክሳዊት የኢትዮጵያ ቤተ ክርስቲያንም ወደ ርስትዋ ተመለሰች። በዘመነ ስደት ምዕራገ ጸሎት ወመሥዋዕት የነበረው ታቦተ መድኃኔ ዓለም በነሐሴ ፳፫ ቀን ፲፱፻፴፫ ዓ. ም. ግርማዊት እቴጌ መነን ከእንግሊዝ አገር ወደ አዲስ አበባ በገቡበት ቀን አብሮ ገባ። ከዚያም በኋላ ሚያዝያ ፳፯ ቀን ፲፱፻፵፩ ዓ. ም. ምስካየ ኅዙናን መድኃኔ ዓለም ተብሎ በቀዳማዊ ኃይለ ሥላሴ ሆስፕታል ግቢ በታነጸው ቤተ ክርስቲያን ተተከለ። በዘመነ ስደት የነበረው የኢትዮጵያ ቤተ ክርስቲያን የጸሎት መጽሐፍ ለምእመናን ጠቃሚ መታሰቢያነቱ ቀዋሚ ስለ ሆነ በሊቃውንት ተመርምሮ እንዲታተምና እንደ ቀድሞው እንዲሠራበት ተደረገ።'
            },
            {
                type: 'paragraph',
                en: 'The first edition was translated from Ge\'ez and was in Amharic only. But now, it has been arranged to be written with the Ge\'ez included side-by-side. The book is divided into 14 sections. Up to the 10th section, it is written in both Ge\'ez and Amharic. What is beyond the 11th section, however, being the words of preaching and counsel... the reading index and various notices, is written in Amharic only.',
                am: 'የመጀመሪያው ድርሰት ግዕዙ ተተርጕሞ በአማርኛ ብቻ ነበር። አሁን ግን ግዕዙ ሳይቀር በየወገኑ እንዲጻፍ ተደርጓል። መጽሐፉ በ፲፬ ክፍሎች ተመድቦ ተከፍሏል። እስከ ፲ኛው ክፍል ድረስ በግዕዝም በአማርኛም ተጽፏል። ከ፲፩ኛው ክፍል በላይ የሆነው ግን የስብከትና የምክር ቃል የንባብ ማውጫና ልዩ ልዩ ማስታወቂያ ስለሆነ በአማርኛ ብቻ ተጽፏል።'
            },
            {
                type: 'paragraph',
                page: 'Page 10',
                en: 'And since the words of preaching and counsel are cited from the respective books; the location where they are found, the chapter and verse, are found written in each place.',
                am: 'ይኸውም የስብከትና የምክር ቃል ከየመጻሕፍቱ የተጠቀሰ ስለ ሆነ ፤ የሚገኝበት ስፍራ ምዕራፉና ቁጥሩ በየቦታው ተጽፎ ይገኛል።'
            },
            {
                type: 'paragraph',
                en: 'The honored fathers, who are the pillars of the Church, have examined, adjusted, and corrected the words and the order of this book. They have testified and confirmed that it is appropriate for the prayer of the faithful. They are the following:',
                am: 'የዚህንም መጽሐፍ ቃሉንና ሥርዓቱን የቤተ ክርስቲያን አዕማድ የሆኑ ክቡራን አባቶች እየመረመሩ አስተካክለው አርመውታል። ለምእመናን ጸሎት የሚገባ መሆኑንም መስክረው አጽንተውታል። እነርሱም የሚከተሉት ናቸው።'
            },
            {
                type: 'list',
                ordered: false,
                en: [
                    'His Beatitude Echege Gebre Giorgis; who was on the throne of Abune Tekle Haymanot.',
                    'Liqe Liqawnt Gebre Meskel; of Ta\'eka Negest (Ba\'eta).',
                    'Aleqa Heruy Eshetu; teacher and interpreter of the region of Gondar.',
                    'Memhir Mel\'iktu; of Mekane Selassie. (Addis Ababa.)'
                ],
                am: [
                    'ብፁዕ እጨጌ ገብረ ጊዮርጊስ ፤ ዘነበረ በመንበረ አቡነ ተክለ ሃይማኖት ።',
                    'ሊቀ ሊቃውንት ገብረ መስቀል ፤ ዘታዕካ ነገሥት ።',
                    'አለቃ ኅሩይ እሸቱ ፤ መምህር ወመፈክር ዘብሔረ ጎንደር ።',
                    'መምህር መልእክቱ ፤ ዘመካነ ሥላሴ ። (አዲስ አበባ ።)'
                ]
            },
            {
                type: 'paragraph',
                en: 'Because His Majesty Emperor Haile Selassie I, in his vast generosity, had this book written and printed for us, we offer our petition to God, saying \'Protect his reign and his army, subdue his enemies and adversaries.\'',
                am: 'ይህን መጽሐፍ ጃንሆይ ቀዳማዊ አጼ ኃይለ ሥላሴ በሰፊው ችሮታቸው ስላጻፉልንና ስላሳተሙልን \'ዕቀብ ንግሦ ወሠራዊቶ ፣ አግርር ፀሮ ወጸላእቶ\' እያልን ልመናችንን ወደ እግዚአብሔር እናቀርባለን።'
            },
            {
                type: 'paragraph',
                en: 'To Abba Markos, who labored to prepare the first edition, and to all those who have now helped us in this work; we offer our gratitude.',
                am: 'የመጀመሪያውን ድርሰት ለማስረዳት ለደከሙት ለአባ ማርቆስና አሁን ደግሞ በዚህ ሥራ ለረዱን ሁሉ ፤ ምስጋናችንን እናቀርባለን ።'
            }
        ]
    }
};

let activeHistoricalPrefaceDoc = 'intro';
let activeHistoricalPrefaceLang = 'english';

function createPrefaceBlockElement(block, lang) {
    const isAmharic = lang === 'amharic';
    const content = isAmharic ? block.am : block.en;

    if (block.type === 'heading') {
        const h4 = document.createElement('h4');
        h4.className = 'historical-preface-subheading' + (isAmharic ? ' ethiopic-label' : '');
        h4.textContent = content;
        return h4;
    }

    if (block.type === 'list' && Array.isArray(content)) {
        const listEl = document.createElement(block.ordered ? 'ol' : 'ul');
        listEl.className = 'historical-preface-list' + (isAmharic ? ' ethiopic-label' : '');
        if (isAmharic && block.ordered) {
            listEl.style.listStyleType = 'none';
            listEl.style.paddingLeft = '0.5rem';
        }
        content.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            listEl.appendChild(li);
        });
        return listEl;
    }

    const p = document.createElement('p');
    p.className = 'historical-preface-paragraph'
        + (block.type === 'note' ? ' historical-preface-note' : '')
        + (isAmharic ? ' ethiopic-label' : '');

    if (block.page) {
        const badge = document.createElement('span');
        badge.className = 'historical-preface-page-badge';
        badge.textContent = `[${block.page}]`;
        p.appendChild(badge);
        p.appendChild(document.createTextNode(' '));
    }

    p.appendChild(document.createTextNode(content));
    return p;
}

function updateHelpModalPrefaceWidth() {
    if (typeof document === 'undefined') return;
    const helpModalEl = document.getElementById('help-modal');
    if (!helpModalEl) return;
    const modalContentEl = helpModalEl.querySelector('.modal-content');
    const auspicesPane = document.getElementById('help-auspices');
    const prefacesPane = document.getElementById('historical-prefaces-content');
    if (!modalContentEl) return;

    const shouldBeWide = Boolean(
        activeHistoricalPrefaceLang === 'side-by-side' &&
        auspicesPane &&
        auspicesPane.classList.contains('active') &&
        prefacesPane &&
        !prefacesPane.classList.contains('collapsed')
    );
    modalContentEl.classList.toggle('wide-preface-modal', shouldBeWide);
}

function renderHistoricalPrefaces(docKey, langMode) {
    if (docKey && HISTORICAL_PREFACES_DATA[docKey]) {
        activeHistoricalPrefaceDoc = docKey;
    }
    if (langMode && ['english', 'amharic', 'side-by-side'].includes(langMode)) {
        activeHistoricalPrefaceLang = langMode;
    }

    if (typeof document === 'undefined') return;
    const container = document.getElementById('historical-prefaces-body');
    if (!container) return;

    const aiNote = document.getElementById('historical-prefaces-ai-note');
    if (aiNote) {
        aiNote.style.display = activeHistoricalPrefaceLang === 'amharic' ? 'none' : '';
    }

    document.querySelectorAll('.historical-doc-tab').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-preface-doc') === activeHistoricalPrefaceDoc);
    });
    document.querySelectorAll('.historical-lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-preface-lang') === activeHistoricalPrefaceLang);
    });

    const docData = HISTORICAL_PREFACES_DATA[activeHistoricalPrefaceDoc];
    container.innerHTML = '';
    container.setAttribute('data-lang-mode', activeHistoricalPrefaceLang);

    if (activeHistoricalPrefaceLang === 'side-by-side') {
        const headerRow = document.createElement('div');
        headerRow.className = 'historical-preface-sbs-row historical-preface-sbs-header';
        const hEn = document.createElement('h4');
        hEn.className = 'historical-preface-doc-title';
        hEn.textContent = docData.titleEn;
        const hAm = document.createElement('h4');
        hAm.className = 'historical-preface-doc-title ethiopic-label';
        hAm.textContent = docData.titleAm;
        headerRow.appendChild(hEn);
        headerRow.appendChild(hAm);
        container.appendChild(headerRow);

        docData.blocks.forEach(block => {
            const row = document.createElement('div');
            row.className = 'historical-preface-sbs-row';
            const colEn = document.createElement('div');
            colEn.className = 'historical-preface-sbs-col';
            colEn.appendChild(createPrefaceBlockElement(block, 'english'));
            const colAm = document.createElement('div');
            colAm.className = 'historical-preface-sbs-col';
            colAm.appendChild(createPrefaceBlockElement(block, 'amharic'));
            row.appendChild(colEn);
            row.appendChild(colAm);
            container.appendChild(row);
        });
    } else {
        const isAm = activeHistoricalPrefaceLang === 'amharic';
        const titleEl = document.createElement('h4');
        titleEl.className = 'historical-preface-doc-title' + (isAm ? ' ethiopic-label' : '');
        titleEl.textContent = isAm ? docData.titleAm : docData.titleEn;
        container.appendChild(titleEl);

        docData.blocks.forEach(block => {
            container.appendChild(createPrefaceBlockElement(block, activeHistoricalPrefaceLang));
        });
    }

    updateHelpModalPrefaceWidth();
}

function bindHistoricalPrefacesAndInfoModalEvents() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (window._historicalPrefacesClickListener) {
        document.removeEventListener('click', window._historicalPrefacesClickListener);
    }

    window._historicalPrefacesClickListener = (e) => {
        const target = e.target;
        if (!target || typeof target.closest !== 'function') return;

        const toggleBtn = target.closest('#toggle-historical-prefaces');
        if (toggleBtn) {
            e.preventDefault();
            const pane = document.getElementById('historical-prefaces-content');
            if (pane) {
                const isCollapsed = pane.classList.toggle('collapsed');
                toggleBtn.classList.toggle('active', !isCollapsed);
                toggleBtn.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
                if (!isCollapsed) {
                    renderHistoricalPrefaces();
                } else {
                    updateHelpModalPrefaceWidth();
                }
            }
            return;
        }

        const docTab = target.closest('.historical-doc-tab');
        if (docTab) {
            e.preventDefault();
            const docKey = docTab.getAttribute('data-preface-doc');
            renderHistoricalPrefaces(docKey, null);
            return;
        }

        const langBtn = target.closest('.historical-lang-btn');
        if (langBtn) {
            e.preventDefault();
            const langKey = langBtn.getAttribute('data-preface-lang');
            renderHistoricalPrefaces(null, langKey);
            return;
        }

        const helpTabBtn = target.closest('.help-tab-btn');
        if (helpTabBtn) {
            setTimeout(updateHelpModalPrefaceWidth, 0);
        }

        const selectLangInfoBtn = target.closest('#select-languages-info-btn');
        if (selectLangInfoBtn) {
            e.preventDefault();
            e.stopPropagation();
            const modalEl = document.getElementById('select-languages-info-modal');
            if (modalEl) openModal(modalEl);
            return;
        }

        const closeSelectLangModalBtn = target.closest('#close-select-languages-info-modal');
        if (closeSelectLangModalBtn) {
            e.preventDefault();
            closeModal();
        }
    };

    document.addEventListener('click', window._historicalPrefacesClickListener);
}

let currentTypicalPsalmCallback = null;
let _typicalPsalmsSearchBound = false;

function normalizeGeezSearchHomophones(str) {
    return String(str || '')
        .replace(/[።፡፥፤፣፦፧፨:\-\n\r\t.,;!?'"«»“”]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/[ሐኀ]/g, 'ሀ').replace(/[ሑኁ]/g, 'ሁ').replace(/[ሒኂ]/g, 'ሂ').replace(/[ሓኃ]/g, 'ሃ').replace(/[ሔኄ]/g, 'ሄ').replace(/[ሕኅ]/g, 'ህ').replace(/[ሖኆ]/g, 'ሆ')
        .replace(/ሠ/g, 'ሰ').replace(/ሡ/g, 'ሱ').replace(/ሢ/g, 'ሲ').replace(/ሣ/g, 'ሳ').replace(/ሤ/g, 'ሴ').replace(/ሥ/g, 'ስ').replace(/ሦ/g, 'ሶ')
        .replace(/[ዐ]/g, 'አ').replace(/ዑ/g, 'ኡ').replace(/ዒ/g, 'ኢ').replace(/[ዓኣ]/g, 'አ').replace(/ዔ/g, 'ኤ').replace(/ዕ/g, 'እ').replace(/ዖ/g, 'ኦ')
        .replace(/ፀ/g, 'ጸ').replace(/ፁ/g, 'ጹ').replace(/ጺ/g, 'ጺ').replace(/ፃ/g, 'ጻ').replace(/ፄ/g, 'ጼ').replace(/ፅ/g, 'ጽ').replace(/ፆ/g, 'ጾ')
        .replace(/ኵ/g, 'ኩ').replace(/ኰ/g, 'ኮ').replace(/ቍ/g, 'ቁ').replace(/ቈ/g, 'ቆ').replace(/ጐ/g, 'ጎ').replace(/ጕ/g, 'ጉ');
}

function filterTypicalPsalms(query = '') {
    if (typeof TYPICAL_PSALMS === 'undefined' || !Array.isArray(TYPICAL_PSALMS)) return [];
    const rawQ = String(query || '').trim();
    if (!rawQ) {
        return TYPICAL_PSALMS.map((p, idx) => ({ item: p, index: idx }));
    }
    const qLower = rawQ.toLowerCase();
    const refStripped = qLower
        .replace(/^(?:psalms?|ps\.?|መዝሙረ\s*ዳዊት|መዝሙር|መዝ)\s*/i, '')
        .replace(/\s*(?:kjv|nkjv|osb|lxx|mt|ግእዝ)\s*$/i, '')
        .trim();
    const qGeezHomo = normalizeGeezSearchHomophones(rawQ);
    const isNumericChapterOnly = /^\d+$/.test(refStripped);

    const results = [];
    TYPICAL_PSALMS.forEach((p, idx) => {
        const masoretic = `${p.mc}:${p.ms}${p.me !== p.ms ? '-' + p.me : ''}`;
        const lxx = `${p.lc}:${p.ls}${p.le !== p.ls ? '-' + p.le : ''}`;
        const geezLxxColon = `${toGeezNumeral(p.lc)}:${toGeezNumeral(p.ls)}${p.le !== p.ls ? '-' + toGeezNumeral(p.le) : ''}`;
        const geezLxxEth = `${toGeezNumeral(p.lc)}፥${toGeezNumeral(p.ls)}${p.le !== p.ls ? '-' + toGeezNumeral(p.le) : ''}`;
        const geezChOnly = toGeezNumeral(p.lc);

        if (isNumericChapterOnly) {
            const chNum = parseInt(refStripped, 10);
            if (p.mc === chNum || p.lc === chNum) {
                results.push({ item: p, index: idx });
                return;
            }
        }

        if (refStripped && (
            masoretic.startsWith(refStripped) ||
            lxx.startsWith(refStripped) ||
            `${p.mc}:${p.ms}-${p.me}`.startsWith(refStripped) ||
            `${p.lc}:${p.ls}-${p.le}`.startsWith(refStripped) ||
            geezLxxColon.includes(refStripped) ||
            geezLxxEth.includes(refStripped) ||
            geezChOnly === refStripped
        )) {
            results.push({ item: p, index: idx });
            return;
        }

        if (p.p && p.p.toLowerCase().includes(qLower)) {
            results.push({ item: p, index: idx });
            return;
        }

        if (p.g && (p.g.includes(rawQ) || (qGeezHomo && normalizeGeezSearchHomophones(p.g).includes(qGeezHomo)))) {
            results.push({ item: p, index: idx });
            return;
        }

        if (p.g && typeof transliterateGeezToPhonetic === 'function') {
            const fullPhon = transliterateGeezToPhonetic(p.g).toLowerCase();
            if (fullPhon.includes(qLower)) {
                results.push({ item: p, index: idx });
            }
        }
    });
    return results;
}

function ensureTypicalPsalmsSearchBound() {
    const searchEl = document.getElementById('typical-psalms-search-input') || typicalPsalmsSearchInput;
    if (!searchEl || searchEl.dataset.boundTypicalSearch === 'true') return searchEl;
    searchEl.dataset.boundTypicalSearch = 'true';
    searchEl.addEventListener('input', (e) => {
        currentTypicalPsalmsSearchQuery = e.target.value;
        renderTypicalPsalmsModal(currentTypicalPsalmsSearchQuery);
    });
    _typicalPsalmsSearchBound = true;
    return searchEl;
}

function openTypicalPsalmsModal(callback) {
    currentTypicalPsalmCallback = callback;
    currentTypicalPsalmsSearchQuery = '';
    const modalEl = document.getElementById('typical-psalms-modal') || typicalPsalmsModal;
    openModal(modalEl);
    if (modalBackdrop) modalBackdrop.style.zIndex = '1000';
    if (modalEl) modalEl.style.zIndex = '1001';
    const searchEl = ensureTypicalPsalmsSearchBound();
    if (searchEl) {
        searchEl.value = '';
    }
    renderTypicalPsalmsModal('');
}

function renderTypicalPsalmsModal(queryOverride) {
    const listEl = document.getElementById('typical-psalms-list') || typicalPsalmsList;
    if (!listEl) return;
    ensureTypicalPsalmsSearchBound();
    if (typeof queryOverride === 'string') {
        currentTypicalPsalmsSearchQuery = queryOverride;
    }
    listEl.innerHTML = '';

    const totalCount = (typeof TYPICAL_PSALMS !== 'undefined' && Array.isArray(TYPICAL_PSALMS)) ? TYPICAL_PSALMS.length : 0;
    const filtered = filterTypicalPsalms(currentTypicalPsalmsSearchQuery);
    const countEl = document.getElementById('typical-psalms-results-count') || typicalPsalmsResultsCount;
    if (countEl) {
        countEl.textContent = currentTypicalPsalmsSearchQuery.trim()
            ? `Showing ${filtered.length} of ${totalCount} chants`
            : `${totalCount} liturgical Psalm chants (Misbak)`;
    }

    if (filtered.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'typical-psalms-empty';
        emptyDiv.textContent = 'No matching Psalm chants found.';
        listEl.appendChild(emptyDiv);
        return;
    }

    filtered.forEach(({ item: p, index: idx }) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'typical-psalm-option';
        optionDiv.dataset.index = idx;
        if (p.id) optionDiv.dataset.chantId = p.id;

        // Format citations
        const masoretic = `${p.mc}:${p.ms}${p.me !== p.ms ? '-' + p.me : ''}`;
        const lxx = `${p.lc}:${p.ls}${p.le !== p.ls ? '-' + p.le : ''}`;
        const geezLxx = `${toGeezNumeral(p.lc)}:${toGeezNumeral(p.ls)}${p.le !== p.ls ? '-' + toGeezNumeral(p.le) : ''}`;

        // Split Ge'ez to first 5 words as incipit
        const geezWords = p.g.split(/\s+/);
        const geezIncipit = geezWords.slice(0, 5).join(' ');
        const gDisplay = geezWords.length > 5 ? `${geezIncipit}...` : p.g;

        optionDiv.innerHTML = `
            <div class="typical-psalm-row">
                <div class="typical-psalm-left">
                    <span class="typical-psalm-phonetic">${p.p}...</span>
                    <span class="typical-psalm-geez ethiopic-label">${gDisplay}</span>
                </div>
                <div class="typical-psalm-right">
                    <span class="typical-psalm-ref-nkjv">${masoretic} KJV</span>
                    <span class="typical-psalm-ref-lxx">${lxx} OSB</span>
                    <span class="typical-psalm-ref-geez ethiopic-label">${geezLxx} ግእዝ</span>
                </div>
            </div>
        `;

        safeOn(optionDiv, 'click', () => {
            if (currentTypicalPsalmCallback) {
                currentTypicalPsalmCallback(idx);
            }
            closeModal();
        });

        listEl.appendChild(optionDiv);
    });
}


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
        safeOn(item, 'dragstart', handleDragStart, false);
        safeOn(item, 'dragenter', handleDragEnter, false);
        safeOn(item, 'dragover', handleDragOver, false);
        safeOn(item, 'dragleave', handleDragLeave, false);
        safeOn(item, 'drop', handleDrop, false);
        safeOn(item, 'dragend', handleDragEnd, false);
    });
}


// --- Swipe Gestures & Taps for Navigation ---
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function handleTouchStart(e) {
    if (e.target && e.target.closest && e.target.closest('select, option, button, label, .card-inline-lectionary-picker')) {
        touchStartX = 0;
        touchStartY = 0;
        return;
    }
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
    if (e.target && e.target.closest && e.target.closest('select, option, button, label, .card-inline-lectionary-picker')) {
        touchStartX = 0;
        touchStartY = 0;
        return;
    }
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
    const swipeThreshold = 70;

    // Ensure horizontal movement is dominant and exceeds threshold
    if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5 && Math.abs(deltaX) > swipeThreshold) {
        if (deltaX < -swipeThreshold) { // Swipe Left
            if (!isLeftSidebarCollapsed) {
                collapseLeftSidebar();
            } else if (isRightSidebarCollapsed) {
                openRightSidebar();
            }
        } else if (deltaX > swipeThreshold) { // Swipe Right
            if (!isRightSidebarCollapsed) {
                collapseRightSidebar();
            } else if (isLeftSidebarCollapsed) {
                openLeftSidebar();
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



// Global Window Exposures
if (typeof window !== 'undefined') {
    window.togglePresentationMode = togglePresentationMode;
    window.renderPsalmCombinationsModal = renderPsalmCombinationsModal;
    window.toggleLayout = toggleLayout;
    window.updateSelectedMiracleUI = updateSelectedMiracleUI;
    window.renderMiracleModalList = renderMiracleModalList;
    window.selectPsalmCombination = selectPsalmCombination;
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.openTypicalPsalmsModal = openTypicalPsalmsModal;
    window.renderTypicalPsalmsModal = renderTypicalPsalmsModal;
    window.executeHardRefresh = executeHardRefresh;
}
async function executeHardRefresh(btn) {
        if (!btn) return;
        btn.disabled = true;
        btn.classList.add('updating');
        const labelSpan = btn.querySelector('span');
        const originalText = labelSpan ? labelSpan.textContent : 'Check for Updates';
        if (labelSpan) labelSpan.textContent = 'Updating...';

        try {
            // 1. Tell all active/waiting/installing Service Workers to skipWaiting and update
            if ('serviceWorker' in navigator) {
                try {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    for (const reg of registrations) {
                        if (reg.waiting) reg.waiting.postMessage('skipWaiting');
                        if (reg.installing) reg.installing.postMessage('skipWaiting');
                        await reg.update().catch(() => {});
                        await reg.unregister().catch(() => {});
                    }
                } catch (swErr) {
                    console.warn('Service worker update/unregister error:', swErr);
                }
            }

            // 2. Clear all browser CacheStorage instances (purges all cached HTML, JS, CSS, JSON)
            if ('caches' in window) {
                try {
                    const cacheNames = await caches.keys();
                    await Promise.all(cacheNames.map(name => caches.delete(name)));
                    console.log('Cleared CacheStorage:', cacheNames);
                } catch (cacheErr) {
                    console.warn('CacheStorage deletion error:', cacheErr);
                }
            }

            if (labelSpan) labelSpan.textContent = 'Reloading...';

            // 3. Force reload with cache-busting timestamp parameter to bypass HTTP disk cache
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('_t', Date.now().toString());
            window.location.replace(currentUrl.toString());
        } catch (err) {
            console.error('Hard refresh failed:', err);
            if (labelSpan) labelSpan.textContent = originalText;
            btn.disabled = false;
            btn.classList.remove('updating');
            window.location.reload();
        }
    }

    

function setupEventListeners() {
    safeOn(hardRefreshButton, 'click', async () => { await executeHardRefresh(hardRefreshButton); });

safeOn(sidebarToggle, 'click', toggleLeftSidebar);
if (prayersPanelToggle) {
    safeOn(prayersPanelToggle, 'click', toggleRightSidebar);
}
safeOn(sidebarBackdrop, 'click', collapseSidebar);

// --- Prevent sliders from closing sidebar when dragging ---
const stopSliderEventPropagation = (event) => {
    event.stopPropagation();
};

// We define the events and attach them with the passive option.
['mousedown', 'pointerdown'].forEach(eventType => {
    safeOn(geezFontSizeSlider, eventType, stopSliderEventPropagation);
    safeOn(englishFontSizeSlider, eventType, stopSliderEventPropagation);
});
safeOn(geezFontSizeSlider, 'touchstart', stopSliderEventPropagation, { passive: true });
safeOn(englishFontSizeSlider, 'touchstart', stopSliderEventPropagation, { passive: true });

// For touchmove, we add the { passive: true } option to resolve the violation.
// This tells the browser our listener won't block scrolling, fixing the conflict.
['touchmove', 'pointermove'].forEach(eventType => {
    safeOn(geezFontSizeSlider, eventType, stopSliderEventPropagation, { passive: true });
    safeOn(englishFontSizeSlider, eventType, stopSliderEventPropagation, { passive: true });
});



safeOn(themeToggle, 'click', () => {
    currentTheme.mode = currentTheme.mode === 'light' ? 'dark' : 'light';
    applyTheme();
    saveSettings();
});

safeOn(paletteSelector, 'change', (event) => {
    currentTheme.palette = event.target.value;
    applyTheme();
    saveSettings();
});

safeOn(geezFontSizeSlider, 'input', () => {
    fontSizes.geez = geezFontSizeSlider.value;
    if (fontSizes.locked) {
        fontSizes.english = geezFontSizeSlider.value;
        englishFontSizeSlider.value = geezFontSizeSlider.value;
    }
    updateFontStylesAndPreview();
    clearTimeout(geezFontSizeSlider.timer);
    geezFontSizeSlider.timer = setTimeout(saveSettings, 300);
});

safeOn(englishFontSizeSlider, 'input', () => {
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
safeOn(geezFontSizeSlider, 'input', debounce(handleGeezFontChange, 50));
safeOn(englishFontSizeSlider, 'input', debounce(handleEnglishFontChange, 50));



safeOn(lockFontSizesToggle, 'change', () => {
    fontSizes.locked = lockFontSizesToggle.checked;
    saveSettings();
});

safeOn(boldTextToggle, 'change', () => {
    displayOptions.boldText = boldTextToggle.checked;
    body.classList.toggle('bold-text', displayOptions.boldText);
    saveSettings();
});

safeOn(ethiopicFontSelect, 'change', () => {
    updateFontStylesAndPreview();
    saveSettings();
});

safeOn(englishFontSelect, 'change', () => {
    updateFontStylesAndPreview();
    saveSettings();
});

safeOn(servantNameInput, 'input', () => {
    customNames.servant = servantNameInput.value;
    saveSettings();
    renderPrayers();
});

safeOn(patriarchNameInput, 'input', () => {
    customNames.patriarch = patriarchNameInput.value;
    saveSettings();
    renderPrayers();
});

safeOn(bishopNameInput, 'input', () => {
    customNames.bishop = bishopNameInput.value;
    saveSettings();
    renderPrayers();
});

safeOn(attendingBishopsInput, 'input', () => {
    customNames.attendingBishops = attendingBishopsInput.value;
    saveSettings();
    renderPrayers();
});

safeOn(churchNameInput, 'input', () => {
    customNames.churchName = churchNameInput.value;
    saveSettings();
    renderPrayers();
});

safeOn(countryNameInput, 'input', () => {
    customNames.country = countryNameInput.value;
    saveSettings();
    renderPrayers();
});

safeOn(headOfStateInput, 'input', () => {
    customNames.headOfState = headOfStateInput.value;
    saveSettings();
    renderPrayers();
});


// --- Kidase (Liturgy) Event Listeners ---
safeOn(kidaseModeToggle, 'change', () => {
    isKidaseModeActive = kidaseModeToggle.checked;
    kidaseSettings.style.display = isKidaseModeActive ? 'block' : 'none';
    syncActiveTabFromLiturgyToggles();
    saveSettings();
    smoothRender();
});

if (showPrepPsalmsToggle) {
    safeOn(showPrepPsalmsToggle, 'change', () => {
        showPrepPsalms = showPrepPsalmsToggle.checked;
        saveSettings();
        smoothRender();
    });
}

safeOn(showMatinsToggle, 'change', () => {
    showMatins = showMatinsToggle.checked;
    morningPsalmGospelSettings.style.display = showMatins ? 'block' : 'none';

    saveSettings();
    smoothRender();
});

safeOn(showTeklilToggle, 'change', () => {
    showTeklil = showTeklilToggle.checked;
    teklilNamesSettings.style.display = showTeklil ? 'block' : 'none';
    
    if (showTeklil) {
        // Default Matins lectionary when Teklil is toggled ON
        kidaseLectionaryRefs.morningPsalm = 'Psalms 19:5-5'; // 18:5 in Orthodox is 19:5 in KJV
        kidaseLectionaryRefs.morningGospel = 'Matthew 9:1-13';
        
        // Re-initialize pickers to update the UI with new defaults
        initializeLectionaryPickers();
    }

    saveSettings();
    smoothRender();
});

safeOn(bridegroomNameInput, 'input', () => {
    bridegroomName = bridegroomNameInput.value;
    saveSettings();
    renderPrayers();
});

safeOn(brideNameInput, 'input', () => {
    brideName = brideNameInput.value;
    saveSettings();
    renderPrayers();
});



safeOn(anaphoraSelector, 'change', () => {
    selectedAnaphora = anaphoraSelector.value;
    saveSettings();
    smoothRender();
});



if (openMiracleModalBtn && miracleModal && closeMiracleModalBtn) {
    updateSelectedMiracleUI(); // Initial UI update
    
    safeOn(openMiracleModalBtn, 'click', () => {
        miracleModal.style.display = 'block';
        renderMiracleModalList();
    });
    
    safeOn(closeMiracleModalBtn, 'click', () => {
        miracleModal.style.display = 'none';
    });
    
    safeOn(miracleSearchInput, 'input', renderMiracleModalList);
    safeOn(miracleMostReadToggle, 'change', renderMiracleModalList);
}

if (miracleVoiceDetectBtn) {
    safeOn(miracleVoiceDetectBtn, 'click', () => {
        if (window.targumaService && typeof window.targumaService.toggleMiracleLiveIdentification === 'function') {
            window.targumaService.toggleMiracleLiveIdentification();
        } else {
            showCopyNotification('Starting Targuma AI Live Miracle Identification...', 2500);
        }
    });
}

if (miraclePositionRadios) {
    miraclePositionRadios.forEach(radio => {
        if (radio.value === miraclePosition) {
            radio.checked = true;
        }
        safeOn(radio, 'change', (e) => {
            if (e.target.checked) {
                miraclePosition = e.target.value;
                saveSettings();
                smoothRender();
            }
        });
    });
}
// ------------------------------

const showAnaphoraToggleEl = document.getElementById('show-anaphora-toggle');
if (showAnaphoraToggleEl) {
    safeOn(showAnaphoraToggleEl, 'change', () => {
        showAnaphora = showAnaphoraToggleEl.checked;
        const anaphoraSettingsEl = document.getElementById('anaphora-settings');
        if (anaphoraSettingsEl) {
            anaphoraSettingsEl.style.display = showAnaphora ? 'block' : 'none';
        }
        syncActiveTabFromLiturgyToggles();
        localStorage.setItem('showAnaphora', showAnaphora);
        saveSettings();
        smoothRender();
    });
}

const showSeatatReadingsToggle = document.getElementById('show-seatat-readings-toggle');
if (showSeatatReadingsToggle) {
    safeOn(showSeatatReadingsToggle, 'change', () => {
        showSeatatReadings = showSeatatReadingsToggle.checked;
        const seatatReadingsSettings = document.getElementById('seatat-readings-settings');
        if (seatatReadingsSettings) {
            seatatReadingsSettings.style.display = showSeatatReadings ? 'block' : 'none';
        }
        localStorage.setItem('showSeatatReadings', showSeatatReadings);
        saveSettings();
        smoothRender();
    });
}

safeOn(showVespersToggle, 'change', () => {
    showVespers = showVespersToggle.checked;
    vespersPsalmGospelSettings.style.display = showVespers ? 'block' : 'none';
    saveSettings();
    smoothRender();
});

if (kidaseDaySelector) {
    safeOn(kidaseDaySelector, 'change', () => {
        selectedKidaseDay = kidaseDaySelector.value;
        saveSettings();
        smoothRender();
    });
}

safeOn(covenantPrayerSelector, 'change', () => {
    selectedCovenantPrayer = covenantPrayerSelector.value;
    saveSettings();
    smoothRender();
});

safeOn(hideQuietPrayersToggle, 'change', () => {
    hideQuietPrayers = hideQuietPrayersToggle.checked;
    saveSettings();
    smoothRender();
});

if (holyFiftyDaysToggle) {
    safeOn(holyFiftyDaysToggle, 'change', () => {
        isHolyFiftyDays = holyFiftyDaysToggle.checked;
        saveSettings();
        smoothRender();
    });
}



safeOn(languageTogglesDiv, 'change', (event) => {
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




// Psalm Selector Listener using event delegation
safeOn(psalmSelectorContainer, 'change', (event) => {
    if (event.target.type === 'checkbox') {
        selectedPsalmVerseRanges = {};
        if (event.target.id === 'select-all-psalms') {
            const isChecked = event.target.checked;
            const checkboxes = psalmSelectorContainer.querySelectorAll('input[type="checkbox"]');
            
            if (isChecked) {
                selectedPsalms = Array.from({length: 150}, (_, i) => i + 1);
            } else {
                selectedPsalms = [];
            }

            checkboxes.forEach(cb => {
                if (cb.id !== 'select-all-psalms') {
                    cb.checked = isChecked;
                }
            });
        } else {
            const psalmNum = Number(event.target.value);
            if (!isNaN(psalmNum)) {
                if (event.target.checked) {
                    if (!selectedPsalms.includes(psalmNum)) {
                        selectedPsalms.push(psalmNum);
                    }
                } else {
                    selectedPsalms = selectedPsalms.filter(p => p !== psalmNum);
                }
            }
        }

        updatePsalmSummary();
        saveSettings();
        smoothRender();
    }
});

const psalmSequenceInput = document.getElementById('psalm-sequence-input');
if (psalmSequenceInput) {
    safeOn(psalmSequenceInput, 'change', (e) => {
        const rawText = e.target.value;
        const newSequence = [];
        const newRanges = {};
        rawText.split(',').forEach(part => {
            const trimmed = part.trim();
            if (!trimmed) return;
            const rangeMatch = trimmed.match(/^(\d+):(\d+)-(\d+)$/);
            if (rangeMatch) {
                const ch = Number(rangeMatch[1]);
                const start = Number(rangeMatch[2]);
                const end = Number(rangeMatch[3]);
                if (ch > 0 && ch <= 150 && start > 0 && end >= start) {
                    newSequence.push(ch);
                    newRanges[ch] = { start, end };
                }
            } else {
                const n = Number(trimmed);
                if (!isNaN(n) && n > 0 && n <= 150) {
                    newSequence.push(n);
                }
            }
        });
        
        selectedPsalms = newSequence;
        selectedPsalmVerseRanges = newRanges;

        const checkboxes = psalmSelectorContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            if (cb.id !== 'select-all-psalms') {
                cb.checked = selectedPsalms.includes(Number(cb.value));
            }
        });
        
        const selectAllPsalmCheckbox = document.getElementById('select-all-psalms');
        if (selectAllPsalmCheckbox) {
            selectAllPsalmCheckbox.checked = selectedPsalms.length === 150;
        }

        updatePsalmSummary(); // To format it cleanly if they typed weird spaces
        saveSettings();
        smoothRender();
    });
}



// Modal open/close listeners
if (psalmCombinationsBtn) {
    safeOn(psalmCombinationsBtn, 'click', () => {
        console.log('psalmCombinationsBtn clicked!');
        console.log('psalmCombinationsModal:', psalmCombinationsModal);
        openModal(psalmCombinationsModal);
        // Ensure backdrop is under this modal (openModal handles basic display)
        modalBackdrop.style.zIndex = '1000'; 
        psalmCombinationsModal.style.zIndex = '1001';
    });
}

if (closePsalmCombinationsModal) {
    safeOn(closePsalmCombinationsModal, 'click', () => {
        closeModal();
    });
}

if (closeTypicalPsalmsModalBtn) {
    safeOn(closeTypicalPsalmsModalBtn, 'click', () => {
        closeModal();
    });
}

safeOn(clearPsalmsButton, 'click', () => {
    selectedPsalms = [];
    selectedPsalmVerseRanges = {};
    document.querySelectorAll('#psalm-selector-container input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    if (psalmCombinationsBtn) psalmCombinationsBtn.textContent = 'Typical Psalm Combinations...';
    updatePsalmSummary();
    saveSettings();
    renderPrayers();
});

safeOn(prophetSongsSelectorContainer, 'change', (event) => {
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
            .filter(value => value !== 'on' && value !== 'auto-select'); // Filter out helper checkboxes

        updateProphetSongsSummary();
        saveSettings();
        smoothRender();
    }
});

safeOn(clearProphetSongsButton, 'click', () => {
    selectedProphetSongs = [];
    document.querySelectorAll('#prophet-songs-selector-container input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    updateProphetSongsSummary();
    saveSettings();
    renderPrayers();
});


// Display Options Listeners
safeOn(presentationModeToggleHeader, 'click', () => {
    currentSlideIndex = 0; // Reset to start when using the header toggle
    togglePresentationMode();
});
safeOn(layoutToggleHeader, 'click', toggleLayout);

safeOn(expandCollapseAllButton, 'click', () => {
    const sections = document.querySelectorAll('.section-title.collapsible');
    let anyExpanded = false;
    sections.forEach(s => {
        if (!s.classList.contains('collapsed')) anyExpanded = true;
    });
    const shouldCollapseAll = anyExpanded;
    areAllSectionsCollapsed = shouldCollapseAll;
    if (!shouldCollapseAll) {
        collapsedSections = {};
    }
    let withinParentGroup = false;
    sections.forEach(section => {
        const stateKey = section.dataset.stateKey || section.textContent;
        const indentLevel = parseInt(section.dataset.indentLevel || '0', 10);
        if (indentLevel === 0) {
            withinParentGroup = section.dataset.isParentGroup === 'true';
        }
        section.classList.toggle('collapsed', shouldCollapseAll);
        collapsedSections[stateKey] = shouldCollapseAll;
        if (indentLevel > 0 && withinParentGroup) {
            section.style.display = shouldCollapseAll ? 'none' : '';
        }

        let nextEl = section.nextElementSibling;
        while (nextEl && !nextEl.classList.contains('section-title')) {
            if (nextEl.classList.contains('expand-daily-prayer-preview-btn')) {
                nextEl.style.display = (shouldCollapseAll && activePrimaryTab === 'pray') ? '' : 'none';
            } else if (nextEl.dataset && nextEl.dataset.dailyPreviewRole === 'first' && activePrimaryTab === 'pray') {
                nextEl.style.display = '';
            } else if (nextEl.dataset && nextEl.dataset.dailyPreviewRole === 'sneak-peek' && activePrimaryTab === 'pray') {
                nextEl.style.display = '';
                nextEl.classList.toggle('daily-prayer-sneak-peek-card', shouldCollapseAll);
            } else {
                nextEl.classList.remove('daily-prayer-sneak-peek-card');
                nextEl.style.display = shouldCollapseAll ? 'none' : '';
            }
            nextEl = nextEl.nextElementSibling;
        }
    });
    updateExpandCollapseAllIcon(true);
    saveSettings();
});

if (shareLinkButton) {
    safeOn(shareLinkButton, 'click', generateShortLink);
}

if (shareScripturesButton) {
    safeOn(shareScripturesButton, 'click', shareScriptures);
}

safeOn(showLanguageLabelsToggle, 'change', () => {
    displayOptions.showLanguageLabels = showLanguageLabelsToggle.checked;
    renderPrayers();
    saveSettings();
});

safeOn(showSpeakerLabelsToggle, 'change', () => {
    displayOptions.showSpeakerLabels = showSpeakerLabelsToggle.checked;
    renderPrayers();
    saveSettings();
});

safeOn(paragraphModeToggle, 'change', () => {
    displayOptions.paragraphMode = paragraphModeToggle.checked;
    applyTheme();
    renderPrayers();
    saveSettings();
});

safeOn(showRubricationToggle, 'change', () => {
    displayOptions.showRubrication = showRubricationToggle.checked;
    applyTheme();
    renderPrayers();
    saveSettings();
});

safeOn(languageColorCodingSelect, 'change', () => {
    displayOptions.languageColors = languageColorCodingSelect.value;
    applyTheme();
    renderPrayers();
    saveSettings();
});


safeOn(dynamicFontSizingToggle, 'change', () => {
    displayOptions.dynamicFontSizing = dynamicFontSizingToggle.checked;
    if (displayOptions.presentationMode === 'slides') {
        renderPrayers();
    }
    saveSettings();
});

safeOn(forceUniformFontSizeToggle, 'change', () => {
    displayOptions.forceUniformFontSize = forceUniformFontSizeToggle.checked;
    if (displayOptions.presentationMode === 'slides') {
        adjustSlideFontSize();
    }
    saveSettings();
});

safeOn(slideTransitionSelect, 'change', () => {
    displayOptions.slideTransition = slideTransitionSelect.value;
    if (displayOptions.presentationMode === 'slides') {
        setupSlides(); // Re-apply slide classes
    }
    saveSettings();
});

safeOn(anglicizeNamesToggle, 'change', () => {
    displayOptions.anglicizeNames = anglicizeNamesToggle.checked;
    renderPrayers();
    saveSettings();
});

safeOn(showSupplicationsToggle, 'change', () => {
    displayOptions.showSupplications = showSupplicationsToggle.checked;
    smoothRender();
    saveSettings();
});


safeOn(showDailyPrayerToggle, 'change', () => {
    displayOptions.showDailyPrayer = showDailyPrayerToggle.checked;
    smoothRender();
    saveSettings();
});

if (showTrinitarianInvocationToggle) {
    safeOn(showTrinitarianInvocationToggle, 'change', () => {
        displayOptions.showTrinitarianInvocation = showTrinitarianInvocationToggle.checked;
        smoothRender();
        saveSettings();
    });
}

if (showGateOfLightToggle) {
    safeOn(showGateOfLightToggle, 'change', () => {
        displayOptions.showGateOfLight = showGateOfLightToggle.checked;
        smoothRender();
        saveSettings();
    });
}

if (showYewediswaMelaektToggle) {
    safeOn(showYewediswaMelaektToggle, 'change', () => {
        displayOptions.showYewediswaMelaekt = showYewediswaMelaektToggle.checked;
        smoothRender();
        saveSettings();
    });
}

document.querySelectorAll('input[name="praise-of-mary-day"]').forEach(radio => {
    safeOn(radio, 'change', (e) => {
        if (e.target.checked) {
            selectedWidaseMaryamDay = e.target.value;
            saveSettings();
            smoothRender();
        }
    });
});

document.querySelectorAll('input[name="seatat-lectionary-day"]').forEach(radio => {
    safeOn(radio, 'change', (e) => {
        if (e.target.checked) {
            selectedSeatatLectionaryDay = e.target.value;
            saveSettings();
            smoothRender();
        }
    });
});

if (showGeezPhoneticChantsToggle) {
    safeOn(showGeezPhoneticChantsToggle, 'change', () => {
        displayOptions.showGeezPhoneticChants = showGeezPhoneticChantsToggle.checked;
        smoothRender();
        saveSettings();
    });
}

if (showLoanwordOriginsToggle) {
    safeOn(showLoanwordOriginsToggle, 'change', () => {
        displayOptions.showLoanwordOrigins = showLoanwordOriginsToggle.checked;
        renderPrayers();
        saveSettings();
    });
}

if (useExternalBibleAPIToggle) {
    safeOn(useExternalBibleAPIToggle, 'change', () => {
        useExternalBibleAPI = useExternalBibleAPIToggle.checked;
        if (!bulkUpdatingSettings) {
            saveSettings();
            renderPrayers();
        }
    });
}

if (globalEnglishTranslationSelect) {
    safeOn(globalEnglishTranslationSelect, 'change', () => {
        globalEnglishTranslation = globalEnglishTranslationSelect.value;
        Object.keys(readingTranslationOverrides).forEach(rKey => {
            if (!readingTranslationOverrides[rKey]) readingTranslationOverrides[rKey] = {};
            readingTranslationOverrides[rKey].english = globalEnglishTranslation;
        });
        syncAllTranslationOverrideRows();
        if (!bulkUpdatingSettings) {
            saveSettings();
            renderPrayers();
        }
    });
}

if (globalAmharicTranslationSelect) {
    safeOn(globalAmharicTranslationSelect, 'change', () => {
        globalAmharicTranslation = globalAmharicTranslationSelect.value;
        Object.keys(readingTranslationOverrides).forEach(rKey => {
            if (!readingTranslationOverrides[rKey]) readingTranslationOverrides[rKey] = {};
            readingTranslationOverrides[rKey].amharic = globalAmharicTranslation;
        });
        syncAllTranslationOverrideRows();
        if (!bulkUpdatingSettings) {
            saveSettings();
            renderPrayers();
        }
    });
}

if (globalGeezTranslationSelect) {
    safeOn(globalGeezTranslationSelect, 'change', () => {
        globalGeezTranslation = globalGeezTranslationSelect.value;
        Object.keys(readingTranslationOverrides).forEach(rKey => {
            if (!readingTranslationOverrides[rKey]) readingTranslationOverrides[rKey] = {};
            const validOpts = getReadingGeezOptions(rKey).map(o => o.value);
            if (PSALM_READING_KEYS.has(rKey) || PROPHET_SONGS_READING_KEYS.has(rKey)) {
                readingTranslationOverrides[rKey].geez = validOpts.includes(globalGeezTranslation)
                    ? globalGeezTranslation
                    : 'gez-1980-formatted';
            } else {
                readingTranslationOverrides[rKey].geez = validOpts.includes(globalGeezTranslation)
                    ? globalGeezTranslation
                    : 'gez-1980';
            }
        });
        syncAllTranslationOverrideRows();
        if (!bulkUpdatingSettings) {
            saveSettings();
            renderPrayers();
        }
    });
}

if (bibleTranslationsInfoBtn && bibleTranslationsInfoModal) {
    safeOn(bibleTranslationsInfoBtn, 'click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openModal(bibleTranslationsInfoModal);
    });
}
if (closeBibleTranslationsInfoModal) {
    safeOn(closeBibleTranslationsInfoModal, 'click', () => {
        closeModal();
    });
}

if (showHaregOrnamentToggle) {
    safeOn(showHaregOrnamentToggle, 'change', () => {
        displayOptions.showHaregOrnament = showHaregOrnamentToggle.checked;
        applyTheme();
        saveSettings();
    });
}

if (closeCalendarInfoModal) {
    safeOn(closeCalendarInfoModal, 'click', () => {
        closeModal();
    });
}

// Header Subtitle Attribution -> Opens Help Modal on Auspices & Disclaimer Tab
if (headerSubtitleAttribution && helpModal) {
    safeOn(headerSubtitleAttribution, 'click', () => {
        openModal(helpModal);
        const auspicesTabBtn = helpModal.querySelector('.help-tab-btn[data-tab="auspices"], .tab-button[data-tab="auspices"]');
        if (auspicesTabBtn) {
            auspicesTabBtn.click();
        }
    });
}

// Primary 5-Destination Navigation Bar (Desktop Header + Mobile Bottom Bar)
document.querySelectorAll('.primary-nav-tab, .header-nav-tab, .bottom-nav-item').forEach(btn => {
    safeOn(btn, 'click', (e) => {
        e.preventDefault();
        const navTarget = btn.getAttribute('data-nav-tab');
        if (navTarget) {
            switchPrimaryTab(navTarget);
        }
    });
});

// Search Listeners
safeOn(searchClose, 'click', () => closeSearch());
safeOn(searchInput, 'input', performSearch);
if (searchScopeSelect) {
    safeOn(searchScopeSelect, 'change', performSearch);
}

safeOn(searchNext, 'click', () => {
    if (searchMatches.length === 0) return;
    currentMatchIndex = (currentMatchIndex + 1) % searchMatches.length;
    updateSearchMatches();
});

safeOn(searchPrev, 'click', () => {
    if (searchMatches.length === 0) return;
    currentMatchIndex = (currentMatchIndex - 1 + searchMatches.length) % searchMatches.length;
    updateSearchMatches();
});



// Global listener for closing modals when clicking outside modal-content
safeOn(document, 'click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal();
    }

    // Loanword Origin Tooltip Handling
    const loanwordEl = e.target.closest('.loanword-origin');
    if (loanwordEl) {
        e.preventDefault();
        e.stopPropagation();
        showLoanwordTooltip(loanwordEl);
    } else if (!e.target.closest('.loanword-tooltip')) {
        hideLoanwordTooltip();
    }
});

safeOn(helpButton, 'click', () => openModal(helpModal));
safeOn(feedbackButton, 'click', () => openModal(feedbackModal));
safeOn(modalBackdrop, 'click', closeModal);
document.querySelectorAll('.close-button').forEach(btn => safeOn(btn, 'click', closeModal));

// Help Modal Feedback
if (sendFeedbackButtonHelp) {
    safeOn(sendFeedbackButtonHelp, 'click', () => {
        const feedbackText = document.getElementById('feedback-textarea-help').value;
        if (feedbackText.trim()) {
            const mailtoLink = `mailto:vineofmary@gmail.com?subject=Feedback for Prayer App&body=${encodeURIComponent(feedbackText)}`;
            window.location.href = mailtoLink;
            showCopyNotification('Feedback sent!', 3000);
            closeModal();
        } else {
            alert('Please enter your feedback before sending.');
        }
    });
}

// Feedback Modal Feedback
if (sendFeedbackButtonModal) {
    safeOn(sendFeedbackButtonModal, 'click', () => {
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
}



safeOn(mainContent, 'click', (e) => {
    if (displayOptions.presentationMode !== 'slides') return;
    if (e.target.closest('button, a, select, option, label, .info-panel, .info-toggle, .share-btn, .language-order-handle, .card-inline-lectionary-picker')) return;

    const rect = mainContent.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const oneThirdWidth = rect.width / 3;

    if (clickX < oneThirdWidth) {
        prevSlide();
    } else if (clickX > oneThirdWidth * 2) {
        nextSlide();
    }
});

safeOn(document, 'keydown', (e) => {
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

safeOn(document, 'touchstart', handleTouchStart, { passive: true });
safeOn(document, 'touchend', handleTouchEnd, { passive: true });


// --- Hide Header, Mobile Bottom Nav Bar, and Floating Controls on Scroll ---
let lastScrollTop = 0;
safeOn(window, 'scroll', function () {
    if (displayOptions.presentationMode === 'slides') {
        header.classList.remove('header-hidden');
        if (bottomNavBar) bottomNavBar.classList.remove('nav-hidden');
        if (prayerFloatingControls) prayerFloatingControls.classList.remove('floating-hidden');
        return;
    }

    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const isScrollingDown = scrollTop > lastScrollTop && scrollTop > header.offsetHeight;
    if (isScrollingDown) {
        header.classList.add('header-hidden');
        if (bottomNavBar) bottomNavBar.classList.add('nav-hidden');
        if (prayerFloatingControls) prayerFloatingControls.classList.add('floating-hidden');
    } else {
        header.classList.remove('header-hidden');
        if (bottomNavBar) bottomNavBar.classList.remove('nav-hidden');
        if (prayerFloatingControls) prayerFloatingControls.classList.remove('floating-hidden');
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, false);


}
// --- Initial Load ---

async function initApp() {

    const splashScreen = document.getElementById('splash-screen');
    const appContainer = document.getElementById('app-container');
    const isDirectLearnRoute = (window.learningService && typeof window.learningService.isLearnUrlRoute === 'function' && window.learningService.isLearnUrlRoute()) ||
        /^\/learn(\/|$)/i.test(window.location.pathname || '') ||
        /^#\/?learn(\?|$)/i.test(window.location.hash || '');

    if (isDirectLearnRoute || sessionStorage.getItem('splashShown')) {
        if (splashScreen) splashScreen.classList.add('hidden');
        if (appContainer) appContainer.classList.remove('hidden');
        sessionStorage.setItem('splashShown', 'true');
    } else {
        splashScreen.addEventListener('transitionend', () => {
            splashScreen.classList.add('hidden');
            appContainer.classList.remove('hidden');
            sessionStorage.setItem('splashShown', 'true');
        }, { once: true });

        splashScreen.style.opacity = '0';
    }

    await loadSettings(); // Ensure settings are loaded before anything else

    renderLiturgicalCalendarBar();
    setInterval(renderLiturgicalCalendarBar, 60000);

    await loadBibleData(); // Load data on startup

    isInitializing = false;
    saveSettings();
    syncStateToUrl();
    updatePsalmSummary();
    updateProphetSongsSummary();
    updateLanguageOrderList();
    applyTheme(); // Explicitly apply theme after settings are loaded
    renderPrayers();

    if (isDirectLearnRoute && window.learningService && typeof window.learningService.openLearnFromUrlRoute === 'function') {
        window.learningService.openLearnFromUrlRoute();
    }

    window.addEventListener('resize', () => {
        checkAndEnforceLayoutRules();
        if (displayOptions.presentationMode === 'slides') {
            adjustSlideFontSize();
        }
    });

    // Setup Bible Reading Navigation from Settings
    document.querySelectorAll('.clickable-reading-title').forEach(title => {
        title.addEventListener('click', () => {
            const targetId = title.dataset.readingTarget;
            if (!targetId) return;

            // 1. Collapse sidebar first
            collapseSidebar();

            // 2. Wait for sidebar to close (300ms) and layout to settle
            setTimeout(() => {
                const card = document.querySelector(`.prayer-card[data-reading-type="${targetId}"]`);
                if (card) {
                    // 3. Ensure the section containing the card is expanded
                    let prev = card.previousElementSibling;
                    while (prev) {
                        if (prev.classList.contains('section-title')) {
                            if (prev.classList.contains('collapsed')) {
                                prev.click(); // Trigger expansion
                            }
                            break;
                        }
                        prev = prev.previousElementSibling;
                    }

                    // 4. Perform the scroll in the next tick to ensure visibility shift is accounted for
                    requestAnimationFrame(() => {
                        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        card.classList.add('highlight-reading');
                        setTimeout(() => card.classList.remove('highlight-reading'), 2000);
                    });
                } else {
                    // Feedback if not found
                    const kidaseToggle = document.getElementById('kidase-mode-toggle');
                    if (kidaseToggle && !kidaseToggle.checked) {
                        showCopyNotification("Please enable 'Liturgy Mode' first.", 3000);
                    } else {
                        showCopyNotification("Reading card not found. Ensure it is enabled in settings.", 3000);
                    }
                }
            }, 500);
        });
    });

    // Setup Eucharist Settings Navigation
    function attachSectionTitleJumpListeners() {
        const anaphoraBtn = document.getElementById('anaphora-title-btn');
        const melkaBtn = document.getElementById('melka-title-btn');
        const miracleBtn = document.getElementById('miracle-title-btn');

        function jumpToCard(cardId) {
            collapseSidebar();
            setTimeout(() => {
                const card = document.querySelector(`.prayer-card[data-card-id="${cardId}"]`);
                if (card) {
                    let prev = card.previousElementSibling;
                    while (prev) {
                        if (prev.classList.contains('section-title')) {
                            if (prev.classList.contains('collapsed')) {
                                prev.click();
                            }
                            break;
                        }
                        prev = prev.previousElementSibling;
                    }

                    requestAnimationFrame(() => {
                        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        card.classList.add('highlight-reading');
                        setTimeout(() => card.classList.remove('highlight-reading'), 2000);
                    });
                } else {
                    const kidaseToggle = document.getElementById('kidase-mode-toggle');
                    if (kidaseToggle && !kidaseToggle.checked) {
                        showCopyNotification("Please enable 'Order of the Liturgy' first.", 3000);
                    } else {
                        showCopyNotification("Section not found in current view.", 3000);
                    }
                }
            }, 500);
        }

        function getAnaphoraChapter() {
            const anaphoraSelector = document.getElementById('anaphora-selector');
            const val = anaphoraSelector ? anaphoraSelector.value : 'apostles';
            return val === 'mary' ? 'St.Mary' : 'Apostles';
        }

        if (anaphoraBtn) {
            anaphoraBtn.addEventListener('click', () => {
                const chapter = getAnaphoraChapter();
                jumpToCard(`${chapter}-1`);
            });
        }

        if (melkaBtn) {
            melkaBtn.addEventListener('click', () => {
                const chapter = getAnaphoraChapter();
                jumpToCard(`${chapter}-Melk’aKwirban-1`);
            });
        }

        if (miracleBtn) {
            miracleBtn.addEventListener('click', () => {
                if (selectedMiracleId && selectedMiracleId !== 'none') {
                    jumpToCard('Miracle-1');
                } else {
                    showCopyNotification("Please select a Miracle first.", 3000);
                }
            });
        }
        
        const theotokiaBtn = document.getElementById('theotokia-title-btn');
        if (theotokiaBtn) {
            theotokiaBtn.addEventListener('click', () => {
                jumpToCard('Daily-11');
            });
        }

        const psalmsBtn = document.getElementById('psalms-title-btn');
        if (psalmsBtn) {
            psalmsBtn.addEventListener('click', () => {
                jumpToCard('Psalms-Intro');
            });
        }

        const prophetsBtn = document.getElementById('prophets-title-btn');
        if (prophetsBtn) {
            prophetsBtn.addEventListener('click', () => {
                if (selectedProphetSongs && selectedProphetSongs.length > 0) {
                    const firstSongKey = selectedProphetSongs[0];
                    const song = prophetSongs.find(s => s.key === firstSongKey);
                    if (song) {
                        let card = null;
                        if (song.refs && song.refs.prayerKey) {
                             card = document.querySelector(`.prayer-card[data-card-id^="ProphetSong-${song.refs.prayerKey}"]`);
                        } 
                        if (!card) {
                             card = document.querySelector(`.prayer-card[data-card-id^="${song.key}-"]`);
                        }
                        
                        if (card) {
                            jumpToCard(card.dataset.cardId);
                        } else {
                            showCopyNotification("Reading card not found. Ensure it is enabled in settings.", 3000);
                        }
                    }
                } else {
                    showCopyNotification("Please select a Song of the Prophets first.", 3000);
                }
            });
        }
    }
    attachSectionTitleJumpListeners();

    // Clear Miracle logic
    const clearMiracleBtn = document.getElementById('clear-miracle-btn');
    if (clearMiracleBtn) {
        clearMiracleBtn.addEventListener('click', () => {
            selectedMiracleId = 'none';
            localStorage.setItem('selectedMiracleId', 'none');
            const selectedMiracleText = document.getElementById('selected-miracle-text');
            if (selectedMiracleText) selectedMiracleText.textContent = 'None selected';
            clearMiracleBtn.style.display = 'none';
            renderPrayers();
        });
    }

    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then(reg => {
                    console.log('Service worker registered successfully', reg);

                    // Check for updates
                    reg.onupdatefound = () => {
                        const installingWorker = reg.installing;
                        if (!installingWorker) return;
                        installingWorker.onstatechange = () => {
                            if (installingWorker.state === 'installed') {
                                if (navigator.serviceWorker.controller) {
                                    console.log('New content is available; please refresh.');
                                } else {
                                    console.log('Content is cached for offline use.');
                                }
                            }
                        };
                    };
                })
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

            if (isScribeModeActive) {
                const editBtnCorner = document.createElement('button');
                editBtnCorner.classList.add('edit-stanza-btn');
                editBtnCorner.style.display = 'flex';
                editBtnCorner.innerHTML = '&#9998;';
                editBtnCorner.title = 'Edit Servant Prayer';
                editBtnCorner.addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.openScribeEditor(prayer);
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
            if (typeof updateAllTogglesInSettingsPanel === 'function') updateAllTogglesInSettingsPanel();
            // Restore kidase mode visibility in settings (state is already managed by loadSettings)
            if (kidaseGatedSection) kidaseGatedSection.style.display = 'block';

            renderPrayers();
        } else {
            isScribeLoggedIn = false;
            isScribeModeActive = false;
            currentScribeUser = null;
            scribeLoginLink.textContent = 'Scribe Login';
            document.body.classList.remove('scribe-mode-active');

            // Preserve kidase mode visibility for all users
            if (kidaseGatedSection) kidaseGatedSection.style.display = 'block';

            // Re-subscribe with normal permissions (published only)
            subscribeToPrayers();
            subscribeToIconMetadata();

            // Refresh UI immediately
            updateLanguageToggles();
            if (typeof updateAllTogglesInSettingsPanel === 'function') updateAllTogglesInSettingsPanel();
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

    var unsubscribePrayers = null;

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

    function generateDocId(p) {
        const chapter = p.chapter || 'Servant';
        const stanza = p.stanza || p.title || 'stanza';
        const ref = p.reference || 'ref';
        const contentText = p.english || p.geez_script || p.amharic_script || '';
        
        let hash = 0;
        for (let i = 0; i < contentText.length; i++) {
            const char = contentText.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit int
        }
        const contentHash = Math.abs(hash).toString(36);
        
        const rawId = `${chapter}_${stanza}_${ref}_${contentHash}`;
        return rawId.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 100);
    }

    function updateLocalPrayers() {
        if (!prayersFromFirestore.length) return;

        prayersFromFirestore.forEach(fsItem => {
            const updateAllMatches = (array, criteria) => {
                const matches = array.filter(criteria);
                matches.forEach(m => Object.assign(m, fsItem));
            };

            if (fsItem.chapter === 'Servant') {
                updateAllMatches(servantsPrayers, p => generateDocId(p) === fsItem.id);
            } else if (fsItem.chapter === 'Psalms' || fsItem.chapter === 'ProphetSong' || fsItem.chapter === 'Bible') {
                updateAllMatches(songs, p =>
                    p.chapter === fsItem.chapter &&
                    p.stanza == fsItem.stanza &&
                    (generateDocId(p) === fsItem.id ||
                     (p.reference && fsItem.reference && p.reference.trim() === fsItem.reference.trim()) ||
                     songs.filter(s => s.chapter === fsItem.chapter && s.stanza == fsItem.stanza).length === 1)
                );
            } else {
                const criteria = p => generateDocId(p) === fsItem.id;

                updateAllMatches(prayers, criteria);

                // Sync translated liturgy/Kidase data from Firestore
                if (typeof kidaseData !== 'undefined') {
                    updateAllMatches(kidaseData.order, criteria);
                    updateAllMatches(kidaseData.apostles, criteria);
                    updateAllMatches(kidaseData.mary, criteria);
                }
                
                // Sync Teklil data from Firestore
                if (typeof teklilData !== 'undefined') {
                    updateAllMatches(teklilData.prayers, criteria);
                }
            }
        });
    }

    // Subscriptions are managed via auth.onAuthStateChanged above

    // Surgical Editor: Open Modal
    window.openScribeEditor = function (prayer) {
        console.log('Opening editor for:', prayer.chapter, prayer.stanza);

        if (!prayer) {
            console.warn('Scribe Error: Prayer not provided.');
            return;
        }

        scribeEditorRef.textContent = `Editing: ${prayer.chapter} - ${prayer.stanza}`;
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
        scribeSaveBtn.dataset.docId = prayer.id || generateDocId(prayer);

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

    window.openIconMetadata = function (iconKey) {
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
                await db.collection('prayers').doc(docId).set(updatedData, { merge: true });
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

    // App Version & Changelog Logic
    if (appVersionContainer) {
        appVersionContainer.textContent = APP_VERSION;
        appVersionContainer.addEventListener('click', () => {
            openModal(changelogModal);
            fetchGithubCommits();
        });
    }

    async function fetchGithubCommits() {
        if (!changelogList) return;

        // Show loading state
        changelogList.innerHTML = '<div class="changelog-loading">Fetching recent updates...</div>';

        try {
            const response = await fetch('https://api.github.com/repos/vineofmary/prayer/commits?per_page=10');
            if (!response.ok) throw new Error('Private repository or API limit');

            const commits = await response.json();
            renderChangelog(commits.map(c => ({
                date: c.commit.author.date,
                message: c.commit.message.split('\n')[0],
                author: c.commit.author.name,
                url: c.html_url
            })));
        } catch (error) {
            console.warn('GitHub API unavailable, using static fallback:', error);
            renderChangelog(STATIC_CHANGELOG);
        }
    }

    function renderChangelog(commits) {
        if (!changelogList) return;
        changelogList.innerHTML = '';

        commits.forEach(commit => {
            const date = new Date(commit.date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            const item = document.createElement('div');
            item.classList.add('changelog-item');

            const dateEl = document.createElement('span');
            dateEl.classList.add('commit-date');
            dateEl.textContent = date;

            const messageEl = document.createElement('div');
            messageEl.classList.add('commit-message');
            messageEl.textContent = commit.message;

            const authorEl = document.createElement('div');
            authorEl.classList.add('commit-author');
            authorEl.textContent = `by ${commit.author}`;

            item.appendChild(dateEl);
            item.appendChild(messageEl);
            item.appendChild(authorEl);

            if (commit.url) {
                item.style.cursor = 'pointer';
                item.addEventListener('click', () => {
                    window.open(commit.url, '_blank');
                });
            }

            changelogList.appendChild(item);
        });
    }

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

    // Help Tabs Logic
    const helpTabBtns = document.querySelectorAll('.help-tab-btn');
    const helpTabPanes = document.querySelectorAll('.help-pane');

    helpTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');

            // Toggle buttons
            helpTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Toggle panes
            helpTabPanes.forEach(p => p.classList.remove('active'));
            document.getElementById(`help-${tab}`).classList.add('active');
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

    // Se'atat Info Modal Logic
    const seatatInfoBtn = document.getElementById('seatat-info-btn');
    const seatatInfoModal = document.getElementById('seatat-info-modal');
    const closeSeatatModal = document.getElementById('close-seatat-modal');
    if (seatatInfoBtn && seatatInfoModal) {
        seatatInfoBtn.addEventListener('click', () => {
            openModal(seatatInfoModal);
        });
    }

    // Modal Close Buttons
    ['close-help-modal', 'close-feedback-modal', 'close-ephrem-modal', 'close-scribe-login-modal', 'close-scribe-editor-modal', 'close-icon-metadata-modal', 'close-scribe-icon-editor-modal', 'close-eusebius-modal', 'close-seatat-modal'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', closeModal);
    });

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

    // (openTypicalPsalmsModal and renderTypicalPsalmsModal moved to global scope)

    // Technical Context Collapsible Logic
    const techToggleBtn = document.getElementById('toggle-technical-context');
    const techContent = document.getElementById('technical-context-content');
    if (techToggleBtn && techContent) {
        techToggleBtn.addEventListener('click', () => {
            const isCollapsed = techContent.classList.toggle('collapsed');
            techToggleBtn.classList.toggle('active', !isCollapsed);
        });
    }

    // Handle back/forward and manual hash changes
    window.addEventListener('hashchange', () => {
        if (loadStateFromUrl()) {
            applyTheme();
            updateLanguageToggles();
            updateAllTogglesInSettingsPanel();
            renderPrayers();
            // Update UI inputs
            servantNameInput.value = customNames.servant || '';
            patriarchNameInput.value = customNames.patriarch || '';
            bishopNameInput.value = customNames.bishop || '';
            countryNameInput.value = customNames.country || '';
            headOfStateInput.value = customNames.headOfState || '';
            geezFontSizeSlider.value = fontSizes.geez || 16;
            englishFontSizeSlider.value = fontSizes.english || 16;
            lockFontSizesToggle.checked = fontSizes.locked;
        }
    });

    initAthanasiusModal();
}

// St. Athanasius Psalter Guide Modal Logic
let currentAthanasiusCategory = 'all';
let currentAthanasiusQuery = '';

function initAthanasiusModal() {
    const btn = document.getElementById('athanasius-guide-btn') || athanasiusGuideBtn;
    const modal = document.getElementById('athanasius-modal') || athanasiusModal;
    if (!btn || !modal) return;

    const handleOpen = (e) => {
        if (e) {
            e.stopPropagation();
        }

        openModal(modal);
        renderAthanasiusModal();
    };

    btn.addEventListener('click', handleOpen);

    const searchInputEl = document.getElementById('athanasius-search-input') || athanasiusSearchInput;
    if (searchInputEl) {
        searchInputEl.addEventListener('input', (e) => {
            currentAthanasiusQuery = e.target.value.trim().toLowerCase();
            renderAthanasiusPrescriptionsList();
        });
    }
}

function renderAthanasiusModal() {
    renderAthanasiusCategoryChips();
    renderAthanasiusPrescriptionsList();
}

function renderAthanasiusCategoryChips() {
    if (!athanasiusCategoryChips || typeof ST_ATHANASIUS_CATEGORIES === 'undefined') return;

    athanasiusCategoryChips.innerHTML = '';
    ST_ATHANASIUS_CATEGORIES.forEach(cat => {
        const chip = document.createElement('button');
        chip.classList.add('athanasius-chip');
        if (cat.id === currentAthanasiusCategory) {
            chip.classList.add('active');
        }
        chip.innerHTML = `${cat.icon} ${cat.name}`;
        chip.addEventListener('click', () => {
            currentAthanasiusCategory = cat.id;
            renderAthanasiusCategoryChips();
            renderAthanasiusPrescriptionsList();
        });
        athanasiusCategoryChips.appendChild(chip);
    });
}

function renderAthanasiusPrescriptionsList() {
    if (!athanasiusPrescriptionsList || typeof ST_ATHANASIUS_PSALMS_GUIDE === 'undefined') return;

    athanasiusPrescriptionsList.innerHTML = '';

    const filtered = ST_ATHANASIUS_PSALMS_GUIDE.filter(item => {
        // Category filter
        if (currentAthanasiusCategory !== 'all' && item.category !== currentAthanasiusCategory) {
            return false;
        }

        // Search query filter
        if (currentAthanasiusQuery) {
            const query = currentAthanasiusQuery;
            const matchTitle = item.title.toLowerCase().includes(query);
            const matchQuote = item.prescription.toLowerCase().includes(query);
            const matchTags = item.tags && item.tags.some(t => t.toLowerCase().includes(query));
            const matchPsalms = item.psalms && item.psalms.some(p => p.toString() === query || `psalm ${p}`.includes(query) || `ps ${p}`.includes(query));
            return matchTitle || matchQuote || matchTags || matchPsalms;
        }

        return true;
    });

    if (athanasiusResultsCount) {
        athanasiusResultsCount.innerHTML = `
            <span>Showing ${filtered.length} prescription${filtered.length === 1 ? '' : 's'}</span>
            ${filtered.length > 2 ? '<span class="athanasius-scroll-hint">Scroll down for more ↓</span>' : ''}
        `;
    }

    if (filtered.length === 0) {
        athanasiusPrescriptionsList.innerHTML = '<div style="padding: 2rem; text-align: center; opacity: 0.7;">No prescriptions found matching your search.</div>';
        return;
    }

    filtered.forEach(entry => {
        const card = document.createElement('div');
        card.classList.add('athanasius-card');

        const psalmsPillsHtml = entry.psalms.map(p => `<span class="athanasius-psalm-badge">${p}</span>`).join(' ');

        card.innerHTML = `
            <div class="athanasius-card-header">
                <div class="athanasius-card-title">${entry.title}</div>
            </div>
            <div class="athanasius-card-quote">"${entry.prescription}"</div>
            <div class="athanasius-card-footer">
                <div class="athanasius-psalms-pills">
                    <span class="athanasius-psalms-label">Prescribed Psalms:</span>
                    ${psalmsPillsHtml}
                </div>
                <div class="athanasius-actions">
                    <button class="ath-btn ath-set-btn" title="Set as current prayer and jump to prayer view">Pray Now</button>
                    <button class="ath-btn ath-add-btn" title="Add these psalms to your active sequence">Add to Prayers</button>
                </div>
            </div>
        `;

        const setBtn = card.querySelector('.ath-set-btn');
        const addBtn = card.querySelector('.ath-add-btn');

        setBtn.addEventListener('click', () => {
            applyAthanasiusPsalms(entry.psalms, 'set', setBtn);
        });

        addBtn.addEventListener('click', () => {
            applyAthanasiusPsalms(entry.psalms, 'add', addBtn);
        });

        athanasiusPrescriptionsList.appendChild(card);
    });
}

function applyAthanasiusPsalms(psalmsList, mode, btnElement) {
    if (mode === 'add') {
        let newSequence = [...selectedPsalms];
        psalmsList.forEach(p => {
            if (!newSequence.includes(p)) {
                newSequence.push(p);
            }
        });

        selectedPsalms = newSequence;
        selectedPsalmVerseRanges = {};

        const psalmSequenceInput = document.getElementById('psalm-sequence-input');
        if (psalmSequenceInput) {
            psalmSequenceInput.value = selectedPsalms.join(', ');
        }

        const psalmSelectorContainer = document.getElementById('psalm-selector-container');
        if (psalmSelectorContainer) {
            const checkboxes = psalmSelectorContainer.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => {
                if (cb.id !== 'select-all-psalms') {
                    cb.checked = selectedPsalms.includes(Number(cb.value));
                }
            });
            const selectAllPsalmCheckbox = document.getElementById('select-all-psalms');
            if (selectAllPsalmCheckbox) {
                selectAllPsalmCheckbox.checked = selectedPsalms.length === 150;
            }
        }

        updatePsalmSummary();
        saveSettings();
        smoothRender();

        // Feedback: Keep modal open & display confirmation toast
        if (btnElement) {
            const originalText = btnElement.textContent;
            btnElement.textContent = '✓ Added!';
            btnElement.style.background = 'var(--accent-color)';
            btnElement.style.color = '#fff';
            setTimeout(() => {
                btnElement.textContent = originalText;
                btnElement.style.background = '';
                btnElement.style.color = '';
            }, 1500);
        }

        if (typeof showCopyNotification === 'function') {
            showCopyNotification(`Added Psalm(s) ${psalmsList.join(', ')} to your prayers`, 2500);
        }

    } else if (mode === 'set') {
        // "Pray Now" mode: set exclusive sequence, deselect Liturgy mode if active, close modal, and scroll to Psalms
        selectedPsalms = [...psalmsList];
        selectedPsalmVerseRanges = {};

        const psalmSequenceInput = document.getElementById('psalm-sequence-input');
        if (psalmSequenceInput) {
            psalmSequenceInput.value = selectedPsalms.join(', ');
        }

        const psalmSelectorContainer = document.getElementById('psalm-selector-container');
        if (psalmSelectorContainer) {
            const checkboxes = psalmSelectorContainer.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => {
                if (cb.id !== 'select-all-psalms') {
                    cb.checked = selectedPsalms.includes(Number(cb.value));
                }
            });
            const selectAllPsalmCheckbox = document.getElementById('select-all-psalms');
            if (selectAllPsalmCheckbox) {
                selectAllPsalmCheckbox.checked = selectedPsalms.length === 150;
            }
        }

        // Deselect Liturgy Mode if active
        if (typeof isKidaseModeActive !== 'undefined' && isKidaseModeActive) {
            isKidaseModeActive = false;
            const kidaseToggle = document.getElementById('kidase-mode-toggle');
            if (kidaseToggle) {
                kidaseToggle.checked = false;
            }
            if (typeof kidaseSettings !== 'undefined' && kidaseSettings) {
                kidaseSettings.style.display = 'none';
            }
        }

        updatePsalmSummary();
        saveSettings();
        smoothRender();

        closeModal();

        // Open/scroll directly to Psalms list in reader view
        setTimeout(() => {
            const targetEl = document.querySelector('.psalm-card') || document.querySelector('.sub-section-title');
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 150);
    }
}

window.initMountOfMercyEngine = async function() {
    if (window._mountOfMercyInitialized) return;
    window._mountOfMercyInitialized = true;
    bindDOMElements();
    bindHierarchyPortraitLightboxEvents();
    bindHistoricalPrefacesAndInfoModalEvents();
    renderHistoricalPrefaces();
    setupEventListeners();
    await initApp();
    if (typeof window.initTargumaFeature === 'function') {
        window.initTargumaFeature();
    }
    if (typeof window.initLearningFeature === 'function') {
        window.initLearningFeature();
    }
};

// Autostart if DOM is already ready and prayer data scripts are present
if (typeof document !== 'undefined') {
    bindDOMElements();
    bindHierarchyPortraitLightboxEvents();
    bindHistoricalPrefacesAndInfoModalEvents();
    renderHistoricalPrefaces();
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        if (typeof prayers !== 'undefined' && document.getElementById('prayer-display')) {
            window.initMountOfMercyEngine();
        }
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof prayers !== 'undefined' && document.getElementById('prayer-display')) {
                window.initMountOfMercyEngine();
            }
        });
    }
}

// --- Testing & Debugging Export Bridge ---
const appCoreExports = {
    PSALM_COMBINATIONS,
    PSALM_CATEGORIES,
    selectPsalmCombination,
    renderPsalmCombinationsModal,
    renderSelectedPsalmsWithDoxology,
    toGeez,
    toGeezNumeral,
    convertLxxToMt,
    getMtFromLxx,
    convertMtToLxx,
    getEnglishEditionCitation,
    getAmharicEditionCitation,
    getGeezEditionCitation,
    slugifyTitle,
    toBase64,
    fromBase64,
    serializeCollapsedSections,
    deserializeCollapsedSections,
    applyLoanwordOrigins,
    LOANWORD_MAPPING,
    applyAnglicization,
    applyRubrication,
    filterGeezPhoneticForPeople,
    hasActualContent,
    isChantStanza,
    getUniversalEpistleAuthor,
    getGospelAuthor,
    getSeatatLiturgicalDay,
    getEffectiveDate,
    getLiturgicalDateObject,
    setCustomDateTimeOverride,
    clearCustomDateTimeOverride,
    syncLiturgicalSelectionsToEffectiveDate,
    getDefaultKidaseRefsAndAnaphoraForDate,
    selectKidaseReadingSet,
    getDefaultReadingTranslationOverrides,
    transliterateGeezToPhonetic,
    getBibleVersesFromRef,
    computeEthiopianDate,
    getLiturgicalHourInfo,
    ETHIOPIAN_MONTHLY_FEASTS,
    ETHIOPIAN_MONTHS_INFO,
    matchMiraclesByText,
    getPrayTabDefaultProfile,
    getLiturgyTabDefaultProfile,
    captureCurrentTabProfile,
    applyTabProfile,
    switchPrimaryTab,
    togglePresentationMode,
    nextSlide,
    prevSlide,
    renderPrayers,
    _renderPrayersSync,
    renderDailyLectionarySection,
    formatLocalizedReadingLabel,
    formatDailyReadingSubsectionTitle,
    getEffectiveDailyLectionaryPeriod,
    setDailyLectionaryPeriod,
    stepDailyLectionaryDayOffset,
    getActivePrayerViewPresetSummary,
    createLectionaryPicker,
    refreshLectionaryPickers,
    findTypicalPsalm,
    setSelectedTypicalPsalmId,
    filterTypicalPsalms,
    openTypicalPsalmsModal,
    renderTypicalPsalmsModal,
    renderLiturgicalCalendarBar,
    openCalendarInfoModal,
    openHierarchyPortraitLightbox,
    closeHierarchyPortraitLightbox,
    HISTORICAL_PREFACES_DATA,
    renderHistoricalPrefaces,
    loadSettings,
    saveSettings,
    buildUrlStateObject,
    syncStateToUrl,
    loadStateFromUrl,
    getActiveLectionaryReadingsSnapshot: () => ({
        activePrimaryTab,
        customDateTimeOverride,
        selectedKidaseReadingSetIndex,
        dailyLectionaryPeriodOverride,
        dailyLectionaryDayOffset,
        presentationMode: displayOptions ? displayOptions.presentationMode : 'scroll',
        currentSlideIndex,
        areAllSectionsCollapsed,
        collapsedSections: JSON.parse(JSON.stringify(collapsedSections || {})),
        isKidaseModeActive,
        showMatins,
        showVespers,
        showDailyLectionary,
        showSeatatReadings,
        showPrepPsalms,
        selectedKidaseDay,
        selectedCovenantPrayer,
        selectedSeatatLectionaryDay,
        selectedWidaseMaryamDay,
        selectedAnaphora,
        kidaseLectionaryRefs: { ...kidaseLectionaryRefs },
        selectedTypicalPsalmIds: { ...(selectedTypicalPsalmIds || {}) },
        readingTranslationOverrides: JSON.parse(JSON.stringify(readingTranslationOverrides || {})),
        selectedPsalms: Array.isArray(selectedPsalms) ? [...selectedPsalms] : [],
        selectedPsalmVerseRanges: selectedPsalmVerseRanges ? JSON.parse(JSON.stringify(selectedPsalmVerseRanges)) : {}
    })
};

if (typeof window !== 'undefined') {
    window.__mountOfMercy = appCoreExports;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = appCoreExports;
}

