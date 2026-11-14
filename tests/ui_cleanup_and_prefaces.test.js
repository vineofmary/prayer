import fs from 'fs';
import path from 'path';
import { describe, it, expect, beforeEach } from 'vitest';
import { loadApp } from './helpers/loadApp.js';

describe('UI Cleanup, Relocated Notes & Historical Prefaces', () => {
  let app;

  beforeEach(() => {
    const htmlPath = path.resolve(process.cwd(), 'app/src/main/assets/index.html');
    const rawHtml = fs.readFileSync(htmlPath, 'utf8');
    const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      const cleanHtml = bodyMatch[1].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      document.body.innerHTML = cleanHtml;
    }
    app = loadApp();
  });

  it('keeps script.js, style.css, and service-worker.js synchronized between public/ and app/src/main/assets/', () => {
    for (const rel of ['js/script.js', 'css/style.css', 'service-worker.js']) {
      const pubFile = path.resolve(process.cwd(), 'public', rel);
      const assetFile = path.resolve(process.cwd(), 'app/src/main/assets', rel);
      expect(fs.readFileSync(pubFile, 'utf8')).toBe(fs.readFileSync(assetFile, 'utf8'));
    }
  });

  it('updates About modal copy across General, Disclaimers, Translations, and Feedback tabs', () => {
    const generalText = document.getElementById('help-general').textContent.replace(/\s+/g, ' ');
    expect(generalText).toContain(
      "This web app is designed to help bring Orthodox Christians and catechumens towards a life of unceasing prayer. It provides access to essential daily prayers, Theotokia, Psalms, and the Divine Liturgy (Kidasé) with lectionary readings in multiple languages, including Amharic, Coptic, English, French, Ge'ez, Spanish, and Tigrinya with phonetic transliterations to assist in learning and pronunciation."
    );

    const auspicesText = document.getElementById('help-auspices').textContent.replace(/\s+/g, ' ');
    expect(auspicesText).toContain(
      'This app, Mount of Mercy (ደብረ ምሕረት), is prepared and maintained by servants of the Foundation of Life Sunday School (መሰረተ ሕይወት የሰንበት ትምህርት ቤት) at Oakland Debre Mihret Saint Michael Ethiopian Orthodox Tewahedo Church (DMKM EOTC), under the auspices of His Grace Archbishop Theophilus in the EOTC Diocese of Northern California, Nevada, and Arizona. We serve within the canonical hierarchy of the EOTC:'
    );

    const attributionText = document
      .querySelector('#help-auspices .spiritual-father-attribution-box')
      .textContent.replace(/\s+/g, ' ')
      .trim();
    expect(attributionText).toBe(
      'This spiritual service is made with love, for the glory of God and His saints, under the spiritual guidance of Liqe Siyuman Kesis Nebiyou Elias Abebe, by the sinful and weak servants, Gebre-Selassie, Atsede-Maryam, and Habte-Gabriel. To all previous servants who labored to preserve, compile, translate, and publish the prayers of the Church, we offer our gratitude.'
    );

    const translationsPane = document.getElementById('help-translations');
    const irenaeusBox = translationsPane.querySelector('.bible-verse-about.patristic-quote-about');
    expect(irenaeusBox).not.toBeNull();
    expect(irenaeusBox.textContent.replace(/\s+/g, ' ')).toContain(
      'Saint Irenaeus, Bishop of Lyons (“On the Apostolic Preaching” Preface, Section 3, c. 180 A.D.)'
    );

    const translationsText = translationsPane.textContent.replace(/\s+/g, ' ');
    expect(translationsText).toContain(
      "The English translations of the Daily Prayer and Theotokia in this app are a work-in-progress and not yet formally approved by clergy. They are rendered through a process of careful harmonization of the extant English, Ge'ez, Coptic, Amharic, Arabic, and Greek texts (listed below)—preferring to render the literal Ge'ez meaning in plain English wherever possible, so that we may simply 'believe what really is, as it is.' Upon completion, God willing, we hope to offer the Daily Prayer and Theotokia translations compiled in this app to our Bishop, Diocesan Fathers, and Scholars for formal approval."
    );
    expect(translationsText).toContain(
      'The liturgical texts are sourced from several authoritative editions (listed below), with only minor enhancements (e.g., improved punctuations, typo corrections).'
    );
    expect(translationsText).toContain(
      'If you are a scholar, deacon, priest, or coder who wish to collaborate in this liturgical scholarship, please contact us at KidaseCreator@gmail.com.'
    );

    const betaText = document.getElementById('help-beta').textContent.replace(/\s+/g, ' ');
    expect(betaText).not.toContain('managed by servants of the Oakland Debre Meheret');
  });

  it('collapses Historical Prefaces by default and supports English, Amharic, and Side-by-Side modes for both 1931 & 1938 texts', () => {
    expect(app.HISTORICAL_PREFACES_DATA).toBeDefined();
    expect(app.HISTORICAL_PREFACES_DATA.intro.blocks.length).toBeGreaterThan(10);
    expect(app.HISTORICAL_PREFACES_DATA.preface.blocks.length).toBeGreaterThan(8);

    const toggleBtn = document.getElementById('toggle-historical-prefaces');
    const contentPane = document.getElementById('historical-prefaces-content');
    const bodyEl = document.getElementById('historical-prefaces-body');
    const aiNoteEl = document.getElementById('historical-prefaces-ai-note');
    const helpModalContent = document.querySelector('#help-modal .modal-content');

    expect(toggleBtn.getAttribute('aria-expanded')).toBe('false');
    expect(contentPane.classList.contains('collapsed')).toBe(true);

    // Expand -> defaults to Introduction to the First Edition in AI-translated English
    toggleBtn.click();
    expect(toggleBtn.getAttribute('aria-expanded')).toBe('true');
    expect(contentPane.classList.contains('collapsed')).toBe(false);
    expect(bodyEl.textContent).toContain('Introduction to the First Edition');
    expect(bodyEl.textContent).toContain('Regarding the Order of Bible Reading.');
    expect(aiNoteEl.style.display).not.toBe('none');

    // Switch to Original Amharic -> hides AI note, renders Amharic text
    const amharicBtn = document.querySelector('.historical-lang-btn[data-preface-lang="amharic"]');
    amharicBtn.click();
    expect(aiNoteEl.style.display).toBe('none');
    expect(bodyEl.textContent).toContain('የመጀመሪያው ድርሰት መግቢያ።');
    expect(bodyEl.textContent).toContain('የመጽሐፍ ቅዱስ ንባብ');

    // Switch to Disclaimers tab, 1938 Preface & Side-by-Side -> widens modal and renders paired rows
    document.getElementById('help-auspices').classList.add('active');
    const prefaceDocBtn = document.querySelector('.historical-doc-tab[data-preface-doc="preface"]');
    const sbsBtn = document.querySelector('.historical-lang-btn[data-preface-lang="side-by-side"]');
    prefaceDocBtn.click();
    sbsBtn.click();

    expect(aiNoteEl.style.display).not.toBe('none');
    expect(bodyEl.querySelectorAll('.historical-preface-sbs-row').length).toBe(
      app.HISTORICAL_PREFACES_DATA.preface.blocks.length + 1
    );
    expect(bodyEl.textContent).toContain('Preface to the Second Edition');
    expect(bodyEl.textContent).toContain('የሁለተኛው ድርሰት መቅድም ።');
    expect(helpModalContent.classList.contains('wide-preface-modal')).toBe(true);

    // Collapse -> removes wide-preface-modal class
    toggleBtn.click();
    expect(contentPane.classList.contains('collapsed')).toBe(true);
    expect(helpModalContent.classList.contains('wide-preface-modal')).toBe(false);
  });

  it('orders Select Languages first in Left Sidebar, opens #select-languages-info-modal, updates share hints, and aligns Scribe Login with version', () => {
    const leftGroups = Array.from(document.querySelectorAll('#left-sidebar .settings-panel > .setting-group'));
    expect(leftGroups[0].querySelector('h3').textContent.trim()).toBe('Select Languages');
    expect(leftGroups[1].querySelector('h4').textContent.trim()).toBe('Language Order');
    expect(leftGroups[2].querySelector('h3').textContent.trim()).toBe('Customize Fonts');

    expect(document.getElementById('translations-notes-section')).toBeNull();

    const infoBtn = document.getElementById('select-languages-info-btn');
    const infoModal = document.getElementById('select-languages-info-modal');
    const closeInfoBtn = document.getElementById('close-select-languages-info-modal');
    expect(infoBtn).not.toBeNull();
    expect(infoModal).not.toBeNull();
    expect(infoModal.textContent.replace(/\s+/g, ' ')).toContain(
      '*Includes unofficial translations (generated from English) via Google Translate APIs'
    );

    infoBtn.click();
    expect(infoModal.style.display).toBe('block');
    closeInfoBtn.click();
    expect(infoModal.style.display).toBe('none');

    const shareHints = Array.from(document.querySelectorAll('#left-sidebar .share-hint')).map(el =>
      el.textContent.trim()
    );
    expect(shareHints).toEqual([
      'Copy link to current prayers',
      'Copy link to current prayers with readings',
    ]);

    const versionMetaRow = document.querySelector('#left-sidebar .app-version-meta-row');
    expect(versionMetaRow).not.toBeNull();
    expect(versionMetaRow.querySelector('#app-version-container')).not.toBeNull();
    expect(versionMetaRow.querySelector('#scribe-login-link')).not.toBeNull();
  });

  it('moves Right Sidebar Theotokia and Se’atat notes into their respective info modals', () => {
    const rightSidebarText = document.getElementById('right-sidebar').textContent.replace(/\s+/g, ' ');
    expect(rightSidebarText).not.toContain('Theotokia prayers listed are complete in Ge\'ez');
    expect(rightSidebarText).not.toContain('Debre Abay Abune Samuel Ze-Waldiba');
    expect(rightSidebarText).not.toContain('Scripture Readings*');

    const ephremModalNote = document.querySelector('#ephrem-story-modal .modal-top-note');
    expect(ephremModalNote).not.toBeNull();
    expect(ephremModalNote.textContent.replace(/\s+/g, ' ').trim()).toBe(
      "Note: Theotokia prayers listed are complete in Ge'ez, but are in-progress for other languages."
    );

    const seatatModalNote = document.querySelector('#seatat-info-modal .modal-top-note');
    expect(seatatModalNote).not.toBeNull();
    expect(seatatModalNote.textContent.replace(/\s+/g, ' ').trim()).toBe(
      "According to the certified Se'atat liturgical tradition of Debre Abay Abune Samuel Ze-Waldiba Monastery, for the Prayer—or Liturgy—of the Hours (ጸሎተ ሰዓታት)."
    );
  });
});
