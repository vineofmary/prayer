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
const feedbackButton = document.getElementById('feedback-button');
const helpModal = document.getElementById('help-modal');
const feedbackModal = document.getElementById('feedback-modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const sendFeedbackButton = document.getElementById('send-feedback-button');
const fontPreview = document.getElementById('font-preview');
const psalmSelectorContainer = document.getElementById('psalm-selector-container');


// --- State Variables ---
const SETTINGS_VERSION = '3.7'; // Updated for Bible data structure fix
let currentTheme = {};
let isSidebarCollapsed = false;
let displayOptions = {};
let displayedLanguages = {};
let fontSizes = {};
let selectedPsalms = [];
let bibleData = { nkjv: null, am54: null, rgv: null, loaded: false };

let languageOrder = [
    'english', 'spanish', 'geez_script', 'geez_phonetic',
    'amharic_script', 'amharic_phonetic',
    'tigrinya_script', 'tigrinya_phonetic'
];
let searchMatches = [];
let currentMatchIndex = -1;
let currentSlideIndex = 0;


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

const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45 1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zM18.36 16.95c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zM19.42 5.99c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>`;
const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 2c-1.82 0-3.53.5-5 1.35 2.99 1.73 5 4.95 5 8.65s-2.01 6.92-5 8.65C6.47 21.5 8.18 22 10 22c5.52 0 10-4.48 10-10S15.52 2 10 2z"/></svg>`;
const shareIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"></path></svg>`;


// --- Rubrication Data ---
const rubricGodNames = {
    english: ["Jesus Christ", "Holy Trinity", "Holy Spirit", "Almighty", "God", "Lord", "Father", "Son"],
    geez_script: ["ኢየሱስ ክርስቶስ", "ቅድስት ሥላሴ", "መንፈስ ቅዱስ", "አብ", "ወልድ", "እግዚአብሔር", "እግዚኦ", "ሥሉስ"],
    phonetic: ["Iyesus Kristos", "Kidist Silase", "Menfes Kidus", "Ab", "Weld", "Igziabher", "Igzi'o", "Silus"]
};
const rubricMaryNames = {
    english: ["Holy Virgin Mary", "Lady Mary", "Mary"],
    geez_script: ["ማርያም እምቅድስት ድንግል", "እግዝእትየ ማርያም", "ማርያም", "ድንግል"],
    phonetic: ["Maryam im-Kidist Dingil", "Igz'itye Maryam", "Maryam", "Dingil"]
};
const buildRegex = (words) => new RegExp(`\\b(${words.join('|')})\\b`, 'gi');
const rubricGodRegex = {
    english: buildRegex(rubricGodNames.english),
    geez_script: new RegExp(`(${rubricGodNames.geez_script.join('|')})`, 'g'),
    phonetic: buildRegex(rubricGodNames.phonetic)
};
const rubricMaryRegex = {
    english: buildRegex(rubricMaryNames.english),
    geez_script: new RegExp(`(${rubricMaryNames.geez_script.join('|')})`, 'g'),
    phonetic: buildRegex(rubricMaryNames.phonetic)
};


// --- Speaker Label Data ---
const speakerKeywords = {
    english: ["Priest", "People", "All"],
    geez_script: ["ካህን", "ሕዝብ", "ኵሎሙ"],
    amharic_script: ["ካህን", "ሕዝብ", "ሁሉም"],
    tigrinya_script: ["ካህን", "ሕዝብ", "ኩሉኹም"],
};

// --- Functions ---

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
    if (!displayOptions.showRubrication) return text;
    if (displayOptions.languageColors !== 'off' && !isFirstLanguage) return text;

    let processedText = text;
    const lang = langKey.split('_')[0];
    const isPhonetic = langKey.includes('phonetic');

    const godRegex = isPhonetic ? rubricGodRegex.phonetic : rubricGodRegex[lang];
    const maryRegex = isPhonetic ? rubricMaryRegex.phonetic : rubricMaryRegex[lang];

    if (godRegex) {
        processedText = processedText.replace(godRegex, '<span class="rubric-god">$&</span>');
    }
    if (maryRegex) {
        processedText = processedText.replace(maryRegex, '<span class="rubric-mary">$&</span>');
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
        body.classList.remove('sidebar-open');
        header.classList.remove('sidebar-visible-in-mobile');
    } else {
        body.classList.add('sidebar-open');
        header.classList.add('sidebar-visible-in-mobile');
    }
    // Handle rubrication state
    if (!displayOptions.showRubrication) {
        body.classList.add('rubrication-disabled');
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
}

function loadSettings() {
    const savedVersion = localStorage.getItem('settingsVersion');

    const defaultSettings = {
        sidebarCollapsed: window.innerWidth < 900,
        theme: { palette: 'traditional', mode: 'light' },
        displayOptions: {
            presentationMode: 'scroll', viewMode: 'card', layout: 'column',
            horizontalScroll: true, showPrayerLabels: false, showLanguageLabels: true,
            showSpeakerLabels: true, showRubrication: true, dynamicFontSizing: true,
            slideTransition: 'slide', languageColors: 'off'
        },
        displayedLanguages: {
            english: true, spanish: false, geez_script: true, geez_phonetic: true,
            amharic_script: false, amharic_phonetic: false,
            tigrinya_script: false, tigrinya_phonetic: false
        },
        fontSizes: { geez: 16, english: 16, locked: true },
        ethiopicFont: "'Noto Sans Ethiopic', sans-serif",
        englishFont: "'Merriweather', serif",
        selectedPsalms: [12, 15, 22, 50, 90, 102, 135] // Default LXX Psalms
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
    }

    if (isSidebarCollapsed) {
        sidebar.classList.add('collapsed');
    }

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


function updateAllTogglesInSettingsPanel() {
    showPrayerLabelsToggle.checked = displayOptions.showPrayerLabels;
    showLanguageLabelsToggle.checked = displayOptions.showLanguageLabels;
    showSpeakerLabelsToggle.checked = displayOptions.showSpeakerLabels;
    showRubricationToggle.checked = displayOptions.showRubrication;
    languageColorCodingSelect.value = displayOptions.languageColors;
    dynamicFontSizingToggle.checked = displayOptions.dynamicFontSizing;
    slideTransitionSelect.value = displayOptions.slideTransition;
    updateLayoutToggleIcon();
    updatePresentationModeToggleIcon();
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
    const lang = langKey.split('_')[0];
    const keywords = speakerKeywords[lang];

    if (keywords) {
        const regex = new RegExp(`(፨ )?(${keywords.join('|')})([:፤])`, 'g');
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

function renderPrayers() {
    prayerDisplay.innerHTML = '';
    const activeLanguageCount = Object.values(displayedLanguages).filter(Boolean).length;
    const searchQuery = searchInput.value;

    if (activeLanguageCount === 0) {
        prayerDisplay.innerHTML = `<div class="empty-state-message"><p>Please select a language from the settings panel to begin.</p></div>`;
        return;
    }

    prayers.forEach(prayer => {
        const prayerCard = document.createElement('div');
        prayerCard.classList.add('prayer-card');

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
                langText.innerHTML = formatPrayerText(prayer[langKey], langKey, searchQuery, isFirstLanguage);

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
        prayerLabel.textContent = `${prayer.chapter} - ${prayer.stanza}`;
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
        if(prayer.instruction && prayer.instruction.trim().toLowerCase() !== 'n/a') {
            infoHTML += `<p><strong>Instruction:</strong> ${prayer.instruction}</p>`;
        }
        infoPanelContent.innerHTML = infoHTML;
        infoPanel.appendChild(infoPanelContent);
        prayerCard.appendChild(infoPanel);

        infoToggle.addEventListener('click', () => infoPanel.classList.toggle('active'));

        prayerDisplay.appendChild(prayerCard);
    });

    renderSelectedPsalms();

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
    let textToCopy = `Share with a Friend:\n\n`;
    textToCopy += `፨ ${prayer.chapter} - ${prayer.stanza} ፨\n\n`;

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
    document.querySelectorAll('.prayer-card').forEach(card => card.classList.remove('active-slide'));
    document.querySelectorAll('.language-text').forEach(p => p.style.fontSize = '');
}


function showSlide(index) {
    const slides = prayerDisplay.querySelectorAll('.prayer-card');
    if (index >= slides.length) currentSlideIndex = 0;
    if (index < 0) currentSlideIndex = slides.length - 1;

    if (displayOptions.slideTransition === 'fade' || displayOptions.slideTransition === 'none') {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active-slide', i === currentSlideIndex);
        });
    } else { // Default is 'slide'
        prayerDisplay.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    }
}

function nextSlide() {
    const slides = prayerDisplay.querySelectorAll('.prayer-card');
    if (slides.length > 0) {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        showSlide(currentSlideIndex);
    }
}

function prevSlide() {
    const slides = prayerDisplay.querySelectorAll('.prayer-card');
    if (slides.length > 0) {
        currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
        showSlide(currentSlideIndex);
    }
}

function adjustSlideFontSize() {
    if (displayOptions.presentationMode !== 'slides' || !displayOptions.dynamicFontSizing) {
        document.querySelectorAll('.language-text').forEach(p => {
            p.style.fontSize = '';
        });
        return;
    }

    const prayerCards = prayerDisplay.querySelectorAll('.prayer-card');
    prayerCards.forEach(card => {
        setTimeout(() => {
            const langSections = card.querySelectorAll('.language-section');
            if (langSections.length === 0) return;

            const prayerContent = card.querySelector('.prayer-content');
            if (!prayerContent) return;

            const verticalPadding = 10;
            const availableContentHeight = prayerContent.clientHeight - verticalPadding;

            langSections.forEach(section => {
                const textP = section.querySelector('p.language-text');
                const headerH4 = section.querySelector('h4');
                if (!textP || !headerH4) return;

                textP.style.fontSize = '';

                const availableWidth = section.clientWidth;
                const sectionAvailableHeight = availableContentHeight - headerH4.offsetHeight;

                let minSize = 12, maxSize = 250, bestSize = minSize;

                while (minSize <= maxSize) {
                    let midSize = Math.floor((minSize + maxSize) / 2);
                    textP.style.fontSize = midSize + 'px';

                    if (textP.scrollHeight <= sectionAvailableHeight && textP.scrollWidth <= availableWidth) {
                        bestSize = midSize;
                        minSize = midSize + 1;
                    } else {
                        maxSize = midSize - 1;
                    }
                }
                textP.style.fontSize = bestSize + 'px';
            });
        }, 50);
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
        label.append(` Psalm ${i}`);
        psalmSelectorContainer.appendChild(label);
    }
}

function renderSelectedPsalms() {
    if (selectedPsalms.length === 0 || !bibleData.loaded) return;
    // Do not clear the prayerDisplay here, as it removes the main prayers.
    // Instead, we will clear only the old psalm cards.
    document.querySelectorAll('.psalm-card').forEach(card => card.remove());


    const getVerses = (data, isStructured) => {
        if (!data) return [];
        if (isStructured) {
            // This handles the nested structure of am54 JSON file
            if (data.books && Array.isArray(data.books)) {
                return data.books.flatMap(book =>
                    book.chapters ? book.chapters.flatMap(ch =>
                        (ch.verses || []).map((verseText, index) => ({
                            book: book.title,
                            chapter: ch.chapter,
                            verse: index + 1,
                            text: verseText
                        }))
                    ) : []
                );
            }
            // This handles the flat structure for the RGV bible data
            if (data.verses && Array.isArray(data.verses)) {
                 return data.verses;
            }
        }
        // This handles the flat structure of the nkjv JSON file
        return Array.isArray(data) ? data : [];
    };

    const nkjvVersesAll = getVerses(bibleData.nkjv, false);
    const am54VersesAll = getVerses(bibleData.am54, true);
    const rgvVersesAll = getVerses(bibleData.rgv, true);

    const psalmBookData = {
        // Corrected: The NKJV JSON uses the book number `19` for Psalms.
        nkjv: { name: 19, bookKey: 'book' },
        am54: { name: 'መዝሙረ ዳዊት', bookKey: 'book' },
        rgv: { name: 'Salmos', bookKey: 'book_name' }
    };

    const nkjvPsalms = nkjvVersesAll.filter(v => v[psalmBookData.nkjv.bookKey] === psalmBookData.nkjv.name);
    const am54Psalms = am54VersesAll.filter(v => v[psalmBookData.am54.bookKey] === psalmBookData.am54.name);
    const rgvPsalms = rgvVersesAll.filter(v => v[psalmBookData.rgv.bookKey] === psalmBookData.rgv.name);


    for (const lxxChapter of selectedPsalms.sort((a, b) => a - b)) {
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

                let verseData = { verseNum: i };
                const nkjvVerse = findVerse(nkjvVerses, i);
                if (nkjvVerse) verseData.nkjv = nkjvVerse.text;

                const rgvVerse = findVerse(rgvVerses, i);
                if (rgvVerse) {
                    // Replace « and » with <i> and </i>, and add a line break after.
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
            const hasEnglish = displayedLanguages.english && verse.nkjv;
            const hasAmharic = displayedLanguages.amharic_script && verse.am54;
            const hasSpanish = displayedLanguages.spanish && verse.rgv;

            if (!hasEnglish && !hasAmharic && !hasSpanish) {
                return;
            }

            const prayerCard = document.createElement('div');
            prayerCard.classList.add('prayer-card', 'psalm-card');

            const prayerCardMainContent = document.createElement('div');
            prayerCardMainContent.classList.add('prayer-card-main-content');

            const prayerContent = document.createElement('div');
            prayerContent.classList.add('prayer-content', 'layout-column');

            if (hasEnglish) {
                prayerContent.appendChild(createPsalmVerseSection('English', verse.nkjv, verse.verseNum));
            }
            if (hasAmharic) {
                prayerContent.appendChild(createPsalmVerseSection('አማርኛ', verse.am54, verse.verseNum, true));
            }
            if (hasSpanish) {
                prayerContent.appendChild(createPsalmVerseSection('Español', verse.rgv, verse.verseNum));
            }

            prayerCardMainContent.appendChild(prayerContent);

            const prayerFooter = document.createElement('div');
            prayerFooter.classList.add('prayer-footer');
            const prayerLabel = document.createElement('div');
            prayerLabel.classList.add('prayer-label');
            prayerLabel.textContent = `Psalm ${lxxChapter}:${verse.verseNum} (LXX)`;
            prayerFooter.appendChild(prayerLabel);

            prayerCardMainContent.appendChild(prayerFooter);
            prayerCard.appendChild(prayerCardMainContent);
            prayerDisplay.appendChild(prayerCard);
        });
    }
}


function createPsalmVerseSection(langName, text, verseNum, isEthiopic = false) {
    const langSection = document.createElement('div');
    langSection.classList.add('language-section');

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

    // Use innerHTML to parse the <i> tags for italicization
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
['mousedown', 'touchstart', 'pointerdown'].forEach(eventType => {
    geezFontSizeSlider.addEventListener(eventType, stopSliderEventPropagation);
    englishFontSizeSlider.addEventListener(eventType, stopSliderEventPropagation);
});

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

ethiopicFontSelect.addEventListener('change', () => {
    updateFontStylesAndPreview();
    saveSettings();
});
englishFontSelect.addEventListener('change', () => {
    updateFontStylesAndPreview();
    saveSettings();
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
    displayOptions.presentationMode = (displayOptions.presentationMode === 'slides') ? 'scroll' : 'slides';
    currentSlideIndex = 0; // Reset index when toggling

    if (displayOptions.presentationMode === 'slides') {
        displayOptions.showPrayerLabels = true;
        collapseSidebar();
    } else {
        displayOptions.showPrayerLabels = false;
    }

    applyTheme();
    renderPrayers();
    updateAllTogglesInSettingsPanel();
    saveSettings();
}

// Psalm Selector Listener using event delegation
psalmSelectorContainer.addEventListener('change', (event) => {
    if (event.target.type === 'checkbox') {
        selectedPsalms = Array.from(psalmSelectorContainer.querySelectorAll('input:checked'))
                               .map(cb => Number(cb.value));
        saveSettings();
        smoothRender();
    }
});

// Display Options Listeners
presentationModeToggleHeader.addEventListener('click', togglePresentationMode);
layoutToggleHeader.addEventListener('click', toggleLayout);

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
        renderPrayers(); // Re-render to apply new transition classes
    }
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
    dragSrcEl = this; e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.dataset.langKey); this.classList.add('dragging');
}
function handleDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }
function handleDragEnter(e) { this.classList.add('over'); }
function handleDragLeave(e) { this.classList.remove('over'); }
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
    touchStartX = 0; touchEndX = 0;
}

function handleSidebarSwipe() {
    if (touchEndX < touchStartX && (touchStartX - touchEndX) > 50) { // Swipe Left
        collapseSidebar();
    }
    if (touchEndX > touchStartX && (touchEndX - touchStartX) > 50) { // Swipe Right
        if (isSidebarCollapsed) {
            isSidebarCollapsed = false;
            sidebar.classList.remove('collapsed');
            applyTheme(); saveSettings();
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
        }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
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
    if (displayOptions.presentationMode !== 'slides' && !isSidebarCollapsed) {
        collapseSidebar();
    }

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
    await loadBibleData(); // Load data on startup
    loadSettings();
    updateLanguageOrderList();
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
});