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
});
