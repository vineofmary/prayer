import { describe, it, expect, beforeAll } from 'vitest';
import { loadApp } from './helpers/loadApp.js';

describe('Ge\'ez Numerals & Date Conversion', () => {
  let app;

  beforeAll(() => {
    app = loadApp();
  });

  describe('toGeezNumeral', () => {
    it('returns empty string for 0 or negative values', () => {
      expect(app.toGeezNumeral(0)).toBe('');
    });

    it('formats single digits (1 to 9)', () => {
      const digits = ['፩', '፪', '፫', '፬', '፭', '፮', '፯', '፰', '፱'];
      for (let i = 1; i <= 9; i++) {
        expect(app.toGeezNumeral(i)).toBe(digits[i - 1]);
      }
    });

    it('formats tens (10, 20, ..., 90)', () => {
      const tens = {
        10: '፲',
        20: '፳',
        30: '፴',
        40: '፵',
        50: '፶',
        60: '፷',
        70: '፸',
        80: '፹',
        90: '፺',
      };
      Object.entries(tens).forEach(([num, expected]) => {
        expect(app.toGeezNumeral(Number(num))).toBe(expected);
      });
    });

    it('formats compound numbers (11 to 99)', () => {
      expect(app.toGeezNumeral(11)).toBe('፲፩');
      expect(app.toGeezNumeral(19)).toBe('፲፱');
      expect(app.toGeezNumeral(25)).toBe('፳፭');
      expect(app.toGeezNumeral(99)).toBe('፺፱');
    });

    it('formats hundreds (100, 101, 150, 151)', () => {
      expect(app.toGeezNumeral(100)).toBe('፻');
      expect(app.toGeezNumeral(101)).toBe('፻፩');
      expect(app.toGeezNumeral(118)).toBe('፻፲፰');
      expect(app.toGeezNumeral(150)).toBe('፻፶');
      expect(app.toGeezNumeral(151)).toBe('፻፶፩');
      expect(app.toGeezNumeral(200)).toBe('፪፻');
    });

    it('formats major Ethiopian calendar years accurately', () => {
      // 1980 E.C. (1988 AD Ge'ez Bible edition) -> 19 * 100 + 80 = ፲፱፻፹
      expect(app.toGeezNumeral(1980)).toBe('፲፱፻፹');
      // 2014 E.C. -> 20 * 100 + 14 = ፳፻፲፬
      expect(app.toGeezNumeral(2014)).toBe('፳፻፲፬');
    });
  });

  describe('toGeez', () => {
    it('converts common prayer and chapter numbers accurately', () => {
      expect(app.toGeez(1)).toBe('፩');
      expect(app.toGeez(7)).toBe('፯'); // 7 days of Weddase Maryam
      expect(app.toGeez(12)).toBe('፲፪'); // 12 hours of the day
      expect(app.toGeez(24)).toBe('፳፬'); // 24 Heavenly Priests
      expect(app.toGeez(150)).toBe('፻፶'); // 150 Psalms
    });

    it('returns empty string on non-positive input', () => {
      expect(app.toGeez(0)).toBe('');
      expect(app.toGeez(-5)).toBe('');
    });
  });
});
