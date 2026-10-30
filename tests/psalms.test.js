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

    it('organizes St. Athanasius and St. Cyril psalters into their respective PSALM_CATEGORIES with simplified titles', () => {
      const athCategory = app.PSALM_CATEGORIES.find(c => c.id === 'mysteries_athanasius');
      expect(athCategory).toBeDefined();
      expect(athCategory.label).toBe('Catechetical Psalters (St. Athanasius of Alexandria, Letter to Marcellinus, c. 360 AD)');
      const athMatch = athCategory.label.match(/^([^(]+)(?:\s+(\(.+\)))?$/);
      expect(athMatch[1].trim()).toBe('Catechetical Psalters');
      expect(athMatch[2]).toBe('(St. Athanasius of Alexandria, Letter to Marcellinus, c. 360 AD)');
      expect(athCategory.items).toEqual([
        'trinity_athanasius',
        'incarnation_athanasius',
        'penance_athanasius',
        'communion_athanasius',
        'resurrection_athanasius'
      ]);

      const cyrilCategory = app.PSALM_CATEGORIES.find(c => c.id === 'mysteries_cyril');
      expect(cyrilCategory).toBeDefined();
      expect(cyrilCategory.label).toBe('Mystagogical Psalters (St. Cyril of Jerusalem, Catechetical Lectures, c. 350 AD)');
      const cyrilMatch = cyrilCategory.label.match(/^([^(]+)(?:\s+(\(.+\)))?$/);
      expect(cyrilMatch[1].trim()).toBe('Mystagogical Psalters');
      expect(cyrilMatch[2]).toBe('(St. Cyril of Jerusalem, Catechetical Lectures, c. 350 AD)');
      expect(cyrilCategory.items).toEqual([
        'baptism_cyril',
        'chrismation_cyril',
        'communion_cyril'
      ]);

      // Verify entries omit "Mystery of..." in English title but retain "ምሥጢረ..." in Ge'ez subtitle
      expect(app.PSALM_COMBINATIONS.trinity_athanasius.dropdownLabel).toBe('Trinity | Mistire Silassie | ምሥጢረ ሥላሴ (44, 99, 109)');
      expect(app.PSALM_COMBINATIONS.incarnation_athanasius.dropdownLabel).toBe('Incarnation | Mistire Sigawe | ምሥጢረ ሥጋዌ (32, 44, 49, 86, 106, 109, 117)');
      expect(app.PSALM_COMBINATIONS.baptism_cyril.dropdownLabel).toBe('Baptism | Mistire Timqet | ምሥጢረ ጥምቀት (31, 45, 81, 138)');
      expect(app.PSALM_COMBINATIONS.chrismation_cyril.dropdownLabel).toBe('Chrismation | Mistire Meron | ምሥጢረ ሜሮን (44)');
      expect(app.PSALM_COMBINATIONS.communion_cyril.dropdownLabel).toBe('Communion | Mistire Qurban | ምሥጢረ ቁርባን (22, 26, 33, 103)');
    });

    it('orders PSALM_CATEGORIES with Nigus below General, Monthly below Weekly, and Coptic Agpeya below Hourly', () => {
      const categoryIds = app.PSALM_CATEGORIES.map(c => c.id);
      expect(categoryIds).toEqual([
        'general',
        'nigus',
        'desert_fathers',
        'weekly',
        'monthly',
        'hourly',
        'hourly_coptic',
        'feasts',
        'mysteries_athanasius',
        'mysteries_cyril'
      ]);
    });

    it('includes Coptic Agpeya Hours with Psalm 50 at the start of every hour, Ge\'ez titles, separate Midnight watches, and Veil', () => {
      const copticCategory = app.PSALM_CATEGORIES.find(c => c.id === 'hourly_coptic');
      expect(copticCategory).toBeDefined();
      expect(copticCategory.items).toEqual([
        'coptic_1st',
        'coptic_3rd',
        'coptic_6th',
        'coptic_9th',
        'coptic_11th',
        'coptic_12th',
        'coptic_veil',
        'coptic_midnight_1',
        'coptic_midnight_2',
        'coptic_midnight_3'
      ]);

      for (const key of copticCategory.items) {
        const combo = app.PSALM_COMBINATIONS[key];
        expect(combo).toBeDefined();
        expect(combo.psalms[0]).toBe(50);
      }

      expect(app.PSALM_COMBINATIONS.coptic_1st.name).toBe('Dawn / Prime (1st Hour) | ነግህ');
      expect(app.PSALM_COMBINATIONS.coptic_1st.psalms).toEqual([50, 1, 2, 3, 4, 5, 6, 8, 11, 12, 14, 15, 18, 24, 26, 62, 66, 69, 112, 142]);
      expect(app.PSALM_COMBINATIONS.coptic_3rd.psalms).toEqual([50, 19, 22, 23, 25, 28, 29, 33, 40, 42, 44, 45, 46]);
      expect(app.PSALM_COMBINATIONS.coptic_6th.psalms).toEqual([50, 53, 56, 60, 62, 66, 69, 83, 84, 85, 86, 90]);
      expect(app.PSALM_COMBINATIONS.coptic_9th.psalms).toEqual([50, 95, 96, 97, 98, 99, 100, 109, 110, 111, 112, 114, 115]);
      expect(app.PSALM_COMBINATIONS.coptic_11th.psalms).toEqual([50, 116, 117, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128]);
      expect(app.PSALM_COMBINATIONS.coptic_12th.psalms).toEqual([50, 129, 130, 131, 132, 133, 136, 137, 140, 141, 145, 146, 147]);
      expect(app.PSALM_COMBINATIONS.coptic_veil.verseRanges).toEqual({ 118: { start: 153, end: 176 } });
      expect(app.PSALM_COMBINATIONS.coptic_midnight_1.psalms).toEqual([50, 3, 6, 12, 69, 85, 90, 116, 117, 118]);
      expect(app.PSALM_COMBINATIONS.coptic_midnight_2.psalms).toEqual([50, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133]);
      expect(app.PSALM_COMBINATIONS.coptic_midnight_3.psalms).toEqual([50, 134, 135, 136, 137, 138, 139, 140, 141, 142, 144, 145, 146, 147, 148, 149, 150]);

      // Verify Ge'ez numeral formatting in Midnight watches (no Amharic -ኛ)
      expect(app.PSALM_COMBINATIONS.coptic_midnight_1.name).toBe('Midnight (1st Watch) | መንፈቀ ሌሊት (፩)');
      expect(app.PSALM_COMBINATIONS.coptic_midnight_1.dropdownLabel).toContain('መንፈቀ ሌሊት ፩');
      expect(app.PSALM_COMBINATIONS.coptic_midnight_1.dropdownLabel).not.toContain('፩ኛ');
      expect(app.PSALM_COMBINATIONS.coptic_midnight_2.name).toBe('Midnight (2nd Watch) | መንፈቀ ሌሊት (፪)');
      expect(app.PSALM_COMBINATIONS.coptic_midnight_2.dropdownLabel).toContain('መንፈቀ ሌሊት ፪');
      expect(app.PSALM_COMBINATIONS.coptic_midnight_2.dropdownLabel).not.toContain('፪ኛ');
      expect(app.PSALM_COMBINATIONS.coptic_midnight_3.name).toBe('Midnight (3rd Watch) | መንፈቀ ሌሊት (፫)');
      expect(app.PSALM_COMBINATIONS.coptic_midnight_3.dropdownLabel).toContain('መንፈቀ ሌሊት ፫');
      expect(app.PSALM_COMBINATIONS.coptic_midnight_3.dropdownLabel).not.toContain('፫ኛ');
    });

    it('includes the 30-day Monthly Psalter (60 entries) covering LXX Psalms 1-150 with Psalm 118 verse ranges', () => {
      const monthlyCategory = app.PSALM_CATEGORIES.find(c => c.id === 'monthly');
      expect(monthlyCategory).toBeDefined();
      expect(monthlyCategory.description).toContain('all 150 Psalms of David are prayed through within one month');
      expect(monthlyCategory.items).toHaveLength(60);

      // Verify all 150 LXX chapters are covered in ascending order across the 60 entries
      const uniqueChapters = [];
      for (const key of monthlyCategory.items) {
        const combo = app.PSALM_COMBINATIONS[key];
        expect(combo).toBeDefined();
        for (const ch of combo.psalms) {
          if (uniqueChapters[uniqueChapters.length - 1] !== ch) {
            uniqueChapters.push(ch);
          }
        }
      }
      expect(uniqueChapters).toEqual(Array.from({ length: 150 }, (_, i) => i + 1));

      // Verify LXX boundary conversions & Psalm 118 verse ranges
      expect(app.PSALM_COMBINATIONS.month_d2_morning.psalms).toEqual([9]); // MT 9-10 -> LXX 9
      expect(app.PSALM_COMBINATIONS.month_d23_evening.psalms).toEqual([110, 111, 112, 113]); // MT 111-115 -> LXX 110-113
      expect(app.PSALM_COMBINATIONS.month_d24_morning.psalms).toEqual([114, 115, 116, 117]); // MT 116-118 -> LXX 114-117
      expect(app.PSALM_COMBINATIONS.month_d24_evening.psalms).toEqual([118]);
      expect(app.PSALM_COMBINATIONS.month_d24_evening.verseRanges).toEqual({ 118: { start: 1, end: 56 } });
      expect(app.PSALM_COMBINATIONS.month_d25_morning.psalms).toEqual([118]);
      expect(app.PSALM_COMBINATIONS.month_d25_morning.verseRanges).toEqual({ 118: { start: 57, end: 112 } });
      expect(app.PSALM_COMBINATIONS.month_d25_evening.psalms).toEqual([118]);
      expect(app.PSALM_COMBINATIONS.month_d25_evening.verseRanges).toEqual({ 118: { start: 113, end: 176 } });
      expect(app.PSALM_COMBINATIONS.month_d30_morning.psalms).toEqual([144, 145, 146, 147]); // MT 145-147 -> LXX 144-147
      expect(app.PSALM_COMBINATIONS.month_d30_evening.psalms).toEqual([148, 149, 150]);

      // Verify all 60 entries have pure Ge'ez subtitles (ዕለት ... ነግህ/ሠርክ) and no Amharic -ኛ, ቀን, ጧት, ማታ
      for (let d = 1; d <= 30; d++) {
        const morningCombo = app.PSALM_COMBINATIONS[`month_d${d}_morning`];
        const eveningCombo = app.PSALM_COMBINATIONS[`month_d${d}_evening`];
        expect(morningCombo.name).toMatch(/\| ዕለት .+ ነግህ$/);
        expect(morningCombo.dropdownLabel).toMatch(/\| ዕለት .+ ነግህ \(/);
        expect(morningCombo.dropdownLabel).not.toContain('ኛ');
        expect(morningCombo.dropdownLabel).not.toContain('ቀን');
        expect(morningCombo.dropdownLabel).not.toContain('ጧት');

        expect(eveningCombo.name).toMatch(/\| ዕለት .+ ሠርክ$/);
        expect(eveningCombo.dropdownLabel).toMatch(/\| ዕለት .+ ሠርክ \(/);
        expect(eveningCombo.dropdownLabel).not.toContain('ኛ');
        expect(eveningCombo.dropdownLabel).not.toContain('ቀን');
        expect(eveningCombo.dropdownLabel).not.toContain('ማታ');
      }
    });

    it('distinguishes Psalm 118 sub-range presets when selecting combinations', () => {
      app.selectPsalmCombination('month_d24_evening');
      expect(app.getActiveLectionaryReadingsSnapshot().selectedPsalms).toEqual([118]);
      expect(app.getActiveLectionaryReadingsSnapshot().selectedPsalmVerseRanges).toEqual({ 118: { start: 1, end: 56 } });

      app.selectPsalmCombination('month_d25_morning');
      expect(app.getActiveLectionaryReadingsSnapshot().selectedPsalms).toEqual([118]);
      expect(app.getActiveLectionaryReadingsSnapshot().selectedPsalmVerseRanges).toEqual({ 118: { start: 57, end: 112 } });

      app.selectPsalmCombination('month_d25_evening');
      expect(app.getActiveLectionaryReadingsSnapshot().selectedPsalms).toEqual([118]);
      expect(app.getActiveLectionaryReadingsSnapshot().selectedPsalmVerseRanges).toEqual({ 118: { start: 113, end: 176 } });
    });
  });
});
