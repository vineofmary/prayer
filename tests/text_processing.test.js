import { describe, it, expect, beforeAll } from 'vitest';
import { loadApp } from './helpers/loadApp.js';

describe('Text Processing & Liturgical Formatting', () => {
  let app;

  beforeAll(() => {
    app = loadApp();
  });

  describe('hasActualContent', () => {
    it('detects when text contains meaningful content', () => {
      expect(app.hasActualContent('በስመ አብ ወወልድ', 'geez_script')).toBe(true);
      expect(app.hasActualContent('Glory to God in the highest', 'english')).toBe(true);
    });

    it('returns false for empty or rubric-only placeholders', () => {
      expect(app.hasActualContent('', 'english')).toBe(false);
      expect(app.hasActualContent('   ', 'english')).toBe(false);
      expect(app.hasActualContent(null, 'english')).toBe(false);
    });
  });

  describe('isChantStanza', () => {
    it('correctly identifies chant stanzas with assembly / People responses in English', () => {
      const chantPrayer = {
        english: 'People: Blessed be the Lord God of Israel',
      };
      expect(app.isChantStanza(chantPrayer)).toBe(true);
    });

    it('correctly identifies chant stanzas with Ge\'ez assembly markers', () => {
      const chantPrayerGeez = {
        geez_script: 'ሕዝብ፡ ይትባረክ እግዚአብሔር አምላከ እስራኤል',
      };
      expect(app.isChantStanza(chantPrayerGeez)).toBe(true);
    });

    it('returns false for priestly solo prayers without people chants', () => {
      const soloPrayer = {
        english: 'Priest: Peace be unto you all.',
      };
      expect(app.isChantStanza(soloPrayer)).toBe(false);
    });
  });

  describe('filterGeezPhoneticForPeople', () => {
    it('returns chant text when People chant toggle is enabled', () => {
      const prayer = {
        english: 'People: Amen',
      };
      const phoneticText = 'People: Amen';
      const filtered = app.filterGeezPhoneticForPeople(phoneticText, prayer);
      expect(filtered).toBeTruthy();
    });
  });

  describe('applyLoanwordOrigins & LOANWORD_MAPPING', () => {
    it('exports LOANWORD_MAPPING and sets window.LOANWORD_MAPPING', () => {
      expect(app.LOANWORD_MAPPING).toBeDefined();
      expect(window.LOANWORD_MAPPING).toBeDefined();
      expect(app.LOANWORD_MAPPING['ክርስቶስ']).toBeDefined();
      expect(app.LOANWORD_MAPPING['ክርስቶስ'].lang).toBe('Greek');
      expect(app.LOANWORD_MAPPING['ኢየሱስ'].meaning).toContain('Salvation');
      expect(app.LOANWORD_MAPPING['ሃሌ ሉያ'].lang).toBe('Hebrew');
      expect(app.LOANWORD_MAPPING['ሃሌሉያ']).toBeDefined();
      expect(app.LOANWORD_MAPPING['ወንጌለ']).toBeDefined();
      expect(app.LOANWORD_MAPPING['ታቦተ']).toBeDefined();
      expect(app.LOANWORD_MAPPING['መልከ ጼዴቅ']).toBeDefined();
      expect(app.LOANWORD_MAPPING['ሙሴ']).toBeDefined();
    });

    it('wraps loanwords with tooltip markup and data attributes in Ge\'ez text', () => {
      // Simulate showLoanwordOrigins enabled in global settings
      window.displayOptions = { showLoanwordOrigins: true };

      const sampleText = 'ዲያቆን፤ ሃሌ ሉያ ቁሙ ወአጽምኡ ወንጌለ ቅዱሰ፥ ዜናሁ ለእግዚእነ ወመድኃኒነ ኢየሱስ ክርስቶስ።';
      const result = app.applyLoanwordOrigins(sampleText, 'geez_script');

      expect(result).toContain('data-word="ክርስቶስ"');
      expect(result).toContain('data-word="ኢየሱስ"');
      expect(result).toContain('data-word="ሃሌ ሉያ"');
      expect(result).toContain('data-word="ወንጌለ"');
      expect(result).toContain('loanword-origin');
    });

    it('matches single-word compound variants like ሃሌሉያ and ኤጲስቆጶስ', () => {
      window.displayOptions = { showLoanwordOrigins: true };

      const sample1 = 'ሃሌሉያ ዮሴፍ ወኒቆዲሞስ ገነዝዎ ለኢየሱስ';
      const result1 = app.applyLoanwordOrigins(sample1, 'geez_script');
      expect(result1).toContain('data-word="ሃሌሉያ"');

      const sample2 = 'ኤጲስቆጶስ እንደ እግዚአብሔር መጋቢ';
      const result2 = app.applyLoanwordOrigins(sample2, 'geez_script');
      expect(result2).toContain('data-word="ኤጲስቆጶስ"');
    });

    it('processes geez_psalms language key when enabled', () => {
      window.displayOptions = { showLoanwordOrigins: true };

      const psalmVerse = 'መዝሙር ዘዳዊት ሃሌ ሉያ።';
      const result = app.applyLoanwordOrigins(psalmVerse, 'geez_psalms');
      expect(result).toContain('data-word="ዳዊት"');
      expect(result).toContain('data-word="ሃሌ ሉያ"');
    });
  });
});

