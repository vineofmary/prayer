import { describe, it, expect, beforeAll } from 'vitest';
import { loadApp } from './helpers/loadApp.js';

describe('Liturgical Edition Citations & Author Attributions', () => {
  let app;

  beforeAll(() => {
    app = loadApp();
  });

  describe('Edition Citations', () => {
    it('returns concise English edition citation', () => {
      expect(app.getEnglishEditionCitation('kjv')).toBe('KJV');
      expect(app.getEnglishEditionCitation('nkjv')).toBe('NKJV');
      expect(app.getEnglishEditionCitation('unknown')).toBe('NKJV');
    });

    it('returns concise Amharic edition citation', () => {
      expect(app.getAmharicEditionCitation('am54')).toBe('አም1954');
      expect(app.getAmharicEditionCitation('am-2000')).toBe('አም2000');
    });

    it('returns Ge\'ez edition citations with Ethiopic numerals', () => {
      expect(app.getGeezEditionCitation('gez-2014')).toBe('ግእዝ፳፻፲፬');
      expect(app.getGeezEditionCitation('gez-1694')).toBe('ግእዝ፲፮፻፺፬');
      expect(app.getGeezEditionCitation('gez-1845')).toBe('ግእዝ፲፰፻፵፭');
      expect(app.getGeezEditionCitation('gez-1980')).toBe('ግእዝ፲፱፻፹');
    });
  });

  describe('Author Attributions', () => {
    it('provides multi-lingual author naming for Universal Epistle', () => {
      expect(app.getUniversalEpistleAuthor('english')).toBeTruthy();
      expect(app.getUniversalEpistleAuthor('geez_script')).toBeTruthy();
      expect(app.getUniversalEpistleAuthor('amharic_script')).toBeTruthy();
    });

    it('provides multi-lingual author naming for Gospel reading', () => {
      expect(app.getGospelAuthor('english', 'gospel')).toBeTruthy();
      expect(app.getGospelAuthor('geez_script', 'gospel')).toBeTruthy();
      expect(app.getGospelAuthor('amharic_script', 'gospel')).toBeTruthy();
    });
  });
});
