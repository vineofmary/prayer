import { describe, it, expect, beforeAll } from 'vitest';
import { loadApp } from './helpers/loadApp.js';

describe('Psalter & Canon Mapping (Septuagint LXX <-> Masoretic MT)', () => {
  let app;

  beforeAll(() => {
    app = loadApp();
  });

  describe('convertLxxToMt (Chapter level)', () => {
    it('maps Psalms 1-8 1:1 to MT 1-8', () => {
      for (let ch = 1; ch <= 8; ch++) {
        expect(app.convertLxxToMt(ch)).toEqual([ch]);
      }
    });

    it('maps LXX Psalm 9 to MT Psalms 9 and 10', () => {
      expect(app.convertLxxToMt(9)).toEqual([9, 10]);
    });

    it('maps LXX Psalms 10-112 to MT Psalms 11-113 (+1 offset)', () => {
      expect(app.convertLxxToMt(10)).toEqual([11]);
      expect(app.convertLxxToMt(22)).toEqual([23]); // Famous Psalm 22 (LXX) = Psalm 23 (The Lord is my Shepherd)
      expect(app.convertLxxToMt(50)).toEqual([51]); // Miserere: Psalm 50 (LXX) = Psalm 51 (MT)
      expect(app.convertLxxToMt(112)).toEqual([113]);
    });

    it('maps LXX Psalm 113 to MT Psalms 114 and 115', () => {
      expect(app.convertLxxToMt(113)).toEqual([114, 115]);
    });

    it('maps LXX Psalms 114 and 115 to MT Psalm 116', () => {
      expect(app.convertLxxToMt(114)).toEqual([116]);
      expect(app.convertLxxToMt(115)).toEqual([116]);
    });

    it('maps LXX Psalms 116-145 to MT Psalms 117-146 (+1 offset)', () => {
      expect(app.convertLxxToMt(116)).toEqual([117]);
      expect(app.convertLxxToMt(118)).toEqual([119]); // The Great Psalm (118 in LXX = 119 in MT)
      expect(app.convertLxxToMt(145)).toEqual([146]);
    });

    it('maps LXX Psalms 146 and 147 to MT Psalm 147', () => {
      expect(app.convertLxxToMt(146)).toEqual([147]);
      expect(app.convertLxxToMt(147)).toEqual([147]);
    });

    it('maps LXX Psalms 148-150 to MT Psalms 148-150', () => {
      expect(app.convertLxxToMt(148)).toEqual([148]);
      expect(app.convertLxxToMt(149)).toEqual([149]);
      expect(app.convertLxxToMt(150)).toEqual([150]);
    });

    it('preserves Psalm 151 in broader canon', () => {
      expect(app.convertLxxToMt(151)).toEqual([151]);
    });
  });

  describe('getMtFromLxx (Verse level)', () => {
    it('correctly maps boundary split in LXX 9 (MT 9 & 10)', () => {
      expect(app.getMtFromLxx(9, 1)).toEqual({ mtChapter: 9, mtVerse: 1 });
      expect(app.getMtFromLxx(9, 20)).toEqual({ mtChapter: 9, mtVerse: 20 });
      expect(app.getMtFromLxx(9, 21)).toEqual({ mtChapter: 10, mtVerse: 1 });
      expect(app.getMtFromLxx(9, 38)).toEqual({ mtChapter: 10, mtVerse: 18 });
    });

    it('correctly maps boundary split in LXX 113 (MT 114 & 115)', () => {
      expect(app.getMtFromLxx(113, 1)).toEqual({ mtChapter: 114, mtVerse: 1 });
      expect(app.getMtFromLxx(113, 8)).toEqual({ mtChapter: 114, mtVerse: 8 });
      expect(app.getMtFromLxx(113, 9)).toEqual({ mtChapter: 115, mtVerse: 1 });
      expect(app.getMtFromLxx(113, 26)).toEqual({ mtChapter: 115, mtVerse: 18 });
    });

    it('correctly maps LXX 114 & 115 into MT 116', () => {
      expect(app.getMtFromLxx(114, 1)).toEqual({ mtChapter: 116, mtVerse: 1 });
      expect(app.getMtFromLxx(114, 9)).toEqual({ mtChapter: 116, mtVerse: 9 });
      expect(app.getMtFromLxx(115, 1)).toEqual({ mtChapter: 116, mtVerse: 10 });
      expect(app.getMtFromLxx(115, 10)).toEqual({ mtChapter: 116, mtVerse: 19 });
    });

    it('correctly maps LXX 146 & 147 into MT 147', () => {
      expect(app.getMtFromLxx(146, 1)).toEqual({ mtChapter: 147, mtVerse: 1 });
      expect(app.getMtFromLxx(146, 11)).toEqual({ mtChapter: 147, mtVerse: 11 });
      expect(app.getMtFromLxx(147, 1)).toEqual({ mtChapter: 147, mtVerse: 12 });
      expect(app.getMtFromLxx(147, 9)).toEqual({ mtChapter: 147, mtVerse: 20 });
    });
  });

  describe('convertMtToLxx (Reverse mapping)', () => {
    it('reverses MT 10 back to LXX 9 with verse offset', () => {
      expect(app.convertMtToLxx(10, 1)).toEqual({ lxxChapter: 9, lxxVerse: 21 });
    });

    it('reverses MT 115 back to LXX 113 with verse offset', () => {
      expect(app.convertMtToLxx(115, 1)).toEqual({ lxxChapter: 113, lxxVerse: 9 });
    });

    it('reverses MT 116 verses back to LXX 114 or 115', () => {
      expect(app.convertMtToLxx(116, 5)).toEqual({ lxxChapter: 114, lxxVerse: 5 });
      expect(app.convertMtToLxx(116, 10)).toEqual({ lxxChapter: 115, lxxVerse: 1 });
    });

    it('reverses MT 147 verses back to LXX 146 or 147', () => {
      expect(app.convertMtToLxx(147, 5)).toEqual({ lxxChapter: 146, lxxVerse: 5 });
      expect(app.convertMtToLxx(147, 12)).toEqual({ lxxChapter: 147, lxxVerse: 1 });
    });

    it('supports chapter-only lookup without verse', () => {
      expect(app.convertMtToLxx(23)).toBe(22);
      expect(app.convertMtToLxx(51)).toBe(50);
      expect(app.convertMtToLxx(119)).toBe(118);
    });
  });

  describe('Catechetical & Mystagogical Psalters (PSALM_COMBINATIONS & PSALM_CATEGORIES)', () => {
    it('includes St. Athanasius Catechetical Psalter combinations with exact LXX numbers', () => {
      expect(app.PSALM_COMBINATIONS.trinity_athanasius.psalms).toEqual([44, 99, 109]);
      expect(app.PSALM_COMBINATIONS.incarnation_athanasius.psalms).toEqual([32, 44, 49, 86, 106, 109, 117]);
      expect(app.PSALM_COMBINATIONS.penance_athanasius.psalms).toEqual([9, 50, 74, 91, 104, 105, 106, 107, 110, 117, 135, 137]);
      expect(app.PSALM_COMBINATIONS.communion_athanasius.psalms).toEqual([2, 21, 68, 71, 87, 137]);
      expect(app.PSALM_COMBINATIONS.resurrection_athanasius.psalms).toEqual([9, 15, 23, 46, 49, 65, 71, 81, 109]);
    });

    it('includes St. Cyril of Jerusalem Mystagogical Psalter combinations with exact LXX numbers', () => {
      expect(app.PSALM_COMBINATIONS.baptism_cyril.psalms).toEqual([31, 45, 81, 138]);
      expect(app.PSALM_COMBINATIONS.chrismation_cyril.psalms).toEqual([44]);
      expect(app.PSALM_COMBINATIONS.communion_cyril.psalms).toEqual([22, 26, 33, 103]);
    });

    it('preserves EOTC 1938 AD Feast Day Psalter combinations', () => {
      expect(app.PSALM_COMBINATIONS.nativity.psalms).toEqual([19, 45, 85, 89, 110, 132]);
      expect(app.PSALM_COMBINATIONS.baptism.psalms).toEqual([42, 77, 114, 74, 85, 118]);
      expect(app.PSALM_COMBINATIONS.crucifixion.psalms).toEqual([22, 40, 54, 69, 88]);
      expect(app.PSALM_COMBINATIONS.resurrection.psalms).toEqual([2, 57, 111, 113, 114, 118]);
      expect(app.PSALM_COMBINATIONS.ascension.psalms).toEqual([8, 15, 21, 24, 47, 108]);
      expect(app.PSALM_COMBINATIONS.pentecost.psalms).toEqual([48, 68, 104, 145]);
    });

    it('organizes St. Athanasius and St. Cyril psalters into their respective PSALM_CATEGORIES', () => {
      const athCategory = app.PSALM_CATEGORIES.find(c => c.id === 'mysteries_athanasius');
      expect(athCategory).toBeDefined();
      expect(athCategory.items).toEqual([
        'trinity_athanasius',
        'incarnation_athanasius',
        'penance_athanasius',
        'communion_athanasius',
        'resurrection_athanasius'
      ]);

      const cyrilCategory = app.PSALM_CATEGORIES.find(c => c.id === 'mysteries_cyril');
      expect(cyrilCategory).toBeDefined();
      expect(cyrilCategory.items).toEqual([
        'baptism_cyril',
        'chrismation_cyril',
        'communion_cyril'
      ]);
    });
  });
});
