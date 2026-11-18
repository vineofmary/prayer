import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { loadApp } from './helpers/loadApp.js';

describe('Miracles of Mary (ተአምረ ማርያም) Catalog Integrity, Liturgical Framing & Card Rendering', () => {
  let app;
  let miracles;

  beforeAll(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    const miraclesPath = path.resolve(process.cwd(), 'app/src/main/assets/js/miracles_of_mary.js');
    const miraclesCode = fs.readFileSync(miraclesPath, 'utf8');
    window.MIRACLES_OF_MARY = new Function(`${miraclesCode}\nreturn MIRACLES_OF_MARY;`)();
    miracles = window.MIRACLES_OF_MARY;
    app = loadApp();
  });

  beforeEach(() => {
    app.setDisplayedLanguages({
      geez_script: true,
      geez_phonetic: false,
      amharic_script: true,
      tigrinya_script: true,
      english: true,
    });
  });

  describe('Catalog Completeness, Canonical Alignment & Formatting Hygiene', () => {
    it('keeps miracles_of_mary.js and script.js 100% byte-identical between Android and Web', () => {
      const androidMiracles = fs.readFileSync(path.resolve(process.cwd(), 'app/src/main/assets/js/miracles_of_mary.js'), 'utf8');
      const webMiracles = fs.readFileSync(path.resolve(process.cwd(), 'public/js/miracles_of_mary.js'), 'utf8');
      expect(androidMiracles).toBe(webMiracles);

      const androidScript = fs.readFileSync(path.resolve(process.cwd(), 'app/src/main/assets/js/script.js'), 'utf8');
      const webScript = fs.readFileSync(path.resolve(process.cwd(), 'public/js/script.js'), 'utf8');
      expect(androidScript).toBe(webScript);
    });

    it('contains over 800 complete canonical Ge’ez stories and excludes all Arabic-only stories (5000–5004)', () => {
      expect(Array.isArray(miracles)).toBe(true);
      expect(miracles.length).toBeGreaterThanOrEqual(800);

      const ids = new Set(miracles.map(m => m.id));
      expect(ids.size).toBe(miracles.length);
      for (const arabicId of ['5000', '5001', '5002', '5003', '5004']) {
        expect(ids.has(arabicId)).toBe(false);
      }
      // Excluded bibliographic stubs
      for (const stubId of ['223', '292', '373', '374']) {
        expect(ids.has(stubId)).toBe(false);
      }
    });

    it('aligns canonical PEMM story IDs accurately with titles, incipits, and full story bodies', () => {
      const byId = Object.fromEntries(miracles.map(m => [m.id, m]));

      // #13: Bishop Ildefonsus (Daqseyos / Daqsis / Dexius) of Toledo
      expect(byId['13']).toBeDefined();
      expect(byId['13'].title.toLowerCase()).toMatch(/ildefonsus|daqseyos|dexius/);
      expect(byId['13'].translations[0].text.toLowerCase()).toMatch(/dexius|daqsis|daqseyos|toledo|tolaytelya|teltelya/);

      // #33: French artist/painter on the scaffolding saved by Mary's hand
      expect(byId['33']).toBeDefined();
      expect(byId['33'].title.toLowerCase()).toMatch(/artist|painted|painter/);
      expect(byId['33'].translations[0].text.toLowerCase()).toMatch(/paint|artist/);

      // #80: Complete Dabra Qwesqwam Holy Week story (782 words, no longer truncated to ~150 words)
      expect(byId['80']).toBeDefined();
      expect(byId['80'].title.toLowerCase()).toContain('qwesqwam');
      expect(byId['80'].translations[0].text.split(/\s+/).length).toBeGreaterThan(700);

      // #125: Cannibal of Qemer who ate 78 people
      expect(byId['125']).toBeDefined();
      expect(byId['125'].translations[0].text.toLowerCase()).toMatch(/seventy-eight|78/);

      // #162: Monastic scribe who wrote Mary's name in golden ink
      expect(byId['162']).toBeDefined();
      expect(byId['162'].translations[0].text.toLowerCase()).toContain('gold');

      // #236: Woman who gave a thirsty dog water in her shoe
      expect(byId['236']).toBeDefined();
      expect(byId['236'].translations[0].text.toLowerCase()).toContain('dog');
    });

    it('excludes unedited rough drafts when a polished translation exists and disambiguates multi-manuscript authors', () => {
      const byId = Object.fromEntries(miracles.map(m => [m.id, m]));
      for (const id of ['142', '279', '424', '427', '470', '1139']) {
        const story = byId[id];
        expect(story).toBeDefined();
        for (const tr of story.translations) {
          expect(tr.text.toLowerCase()).not.toContain('rough draft');
          expect(tr.text.toLowerCase()).not.toContain('unedited translation');
        }
      }

      // Check unique author labels within any multi-translation story
      for (const m of miracles) {
        if (m.translations.length > 1) {
          const authors = m.translations.map(t => t.author);
          expect(new Set(authors).size).toBe(authors.length);
        }
      }
    });

    it('has zero single-card monoliths, zero unescaped HTML entities, zero MSO footnotes, and balanced card lengths', () => {
      for (const m of miracles) {
        expect(m.title).not.toContain('??');
        expect(m.incipit || '').not.toMatch(/,\s*from\s+EMML/i);

        for (const tr of m.translations) {
          expect(tr.text).not.toMatch(/&(rsquo|lsquo|rdquo|ldquo|nbsp|ndash|mdash|amp|#\d+);/i);
          expect(tr.text).not.toMatch(/mso-footnote|_ftnref|_ftn\d/i);
          expect(tr.text).not.toMatch(/Note:\s*This English translation/i);
          expect(tr.text).not.toMatch(/View a \w+ translation of this story/i);
          expect(tr.text.toLowerCase()).not.toContain('summary to come');

          const paras = app.extractMiracleNarrativeParagraphs(tr.text);
          expect(paras.length).toBeGreaterThanOrEqual(2);

          for (const p of paras) {
            const plain = p.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
            const wc = plain.split(/\s+/).filter(Boolean).length;
            expect(wc).toBeLessThanOrEqual(150);
          }
        }
      }
    });
  });

  describe('Liturgical Framing Cards & Card UI Rendering', () => {
    it('renders segmented narrative cards with header on Miracle-1 and appends Sebhat Leki Maryam without synthetic opening/closing blessing cards', () => {
      app.setMiracleSelectionState('125', 0, 'matins');
      const titles = [];
      let renderedCards = [];
      app.renderSelectedMiracle(
        (t) => titles.push(t),
        (cards) => { renderedCards = cards; }
      );

      expect(titles).toEqual(['→ Miracle of Mary | ተአምረ ማርያም']);
      expect(renderedCards.length).toBeGreaterThanOrEqual(3);

      // Card 1: First narrative card carries Miracle-1 jump target & visible header
      const firstCard = renderedCards[0];
      expect(firstCard.chapter).toBe('Miracle');
      expect(firstCard.stanza).toBe('1');
      expect(firstCard._isMiracleHeader).toBe(true);
      expect(firstCard._isMiracleNarrative).toBe(true);
      expect(renderedCards.some(c => c._isMiracleFraming === 'opening')).toBe(false);
      expect(renderedCards.some(c => c._isMiracleFraming === 'closing_blessing')).toBe(false);

      // Narrative cards (including authentic manuscript opening & closing paragraphs)
      const narratives = renderedCards.slice(0, -1);
      expect(narratives.length).toBeGreaterThanOrEqual(2);
      expect(narratives.every(c => c._isMiracleNarrative === true)).toBe(true);

      // Final card: Appended Sebhat Leki Maryam Congregational Praise
      const closingHymn = renderedCards[renderedCards.length - 1];
      expect(closingHymn._isMiracleFraming).toBe('closing_hymn');
      expect(closingHymn.geez_script).toContain('ስብሐት ለኪ ማርያም በኁልቈ መላእክት ዘአርያም');
      expect(closingHymn.amharic_script).toContain('ማርያም ሆይ በአርያም ባሉ መላእክት ቍጥር');
      expect(closingHymn.english).toContain('Glory to you, O Mary, according to the number of the angels');
    });

    it('surfaces a visible .miracle-translation-select dropdown on multi-translation miracles without polluting .prayer-label', () => {
      const multiMiracle = miracles.find(m => m.translations.length > 1);
      expect(multiMiracle).toBeDefined();

      app.setMiracleSelectionState(multiMiracle.id, 0, 'anaphora');
      let renderedCards = [];
      app.renderSelectedMiracle(() => {}, (cards) => { renderedCards = cards; });

      const headerCardEl = app.createPrayerCardElement(renderedCards[0], 0, '', true);
      const headerBar = headerCardEl.querySelector('.miracle-card-header');
      expect(headerBar).not.toBeNull();

      const selectEl = headerBar.querySelector('select.miracle-translation-select');
      expect(selectEl).not.toBeNull();
      expect(selectEl.options.length).toBe(multiMiracle.translations.length);

      const footerLabel = headerCardEl.querySelector('.prayer-label');
      expect(footerLabel.textContent).not.toContain('<select');
      expect(footerLabel.textContent).not.toContain('<div');
    });

    it('falls back to English on narrative cards when English is unchecked globally so cards are never blank', () => {
      app.setDisplayedLanguages({
        geez_script: true,
        amharic_script: true,
        tigrinya_script: false,
        english: false,
      });

      app.setMiracleSelectionState('13', 0, 'matins');
      let renderedCards = [];
      app.renderSelectedMiracle(() => {}, (cards) => { renderedCards = cards; });

      // Narrative cards (including Card 1) fall back to English (1 section) instead of rendering 0 sections!
      const narrativeEl = app.createPrayerCardElement(renderedCards[0], 0, '', true);
      expect(narrativeEl.querySelectorAll('.language-section').length).toBe(1);
      expect(narrativeEl.querySelector('.lang-english')).not.toBeNull();
      expect(narrativeEl.querySelector('.language-text').textContent.trim().length).toBeGreaterThan(20);

      // Final Sebhat Leki Maryam hymn card still honors displayedLanguages (Ge'ez + Amharic, no English)
      const hymnEl = app.createPrayerCardElement(renderedCards[renderedCards.length - 1], renderedCards.length - 1, '', true);
      expect(hymnEl.querySelectorAll('.language-section').length).toBe(2);
      expect(hymnEl.querySelector('.lang-english')).toBeNull();
    });

    it('matches miracles by official Amharic title in matchMiraclesByText', () => {
      const sampleWithAmharic = miracles.find(m => m.title_amharic && m.id === '125');
      expect(sampleWithAmharic).toBeDefined();
      const results = app.matchMiraclesByText('እፍኝ ውኃ ሰጥቶ');
      expect(results.some(r => r.id === '125')).toBe(true);
    });
  });
});
