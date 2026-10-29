import { describe, it, expect, beforeAll } from 'vitest';
import { loadApp } from './helpers/loadApp.js';

describe('State Serialization & Unicode URL Encoding', () => {
  let app;

  beforeAll(() => {
    app = loadApp();
  });

  describe('toBase64 & fromBase64 (Unicode Safe)', () => {
    it('round-trips ASCII strings cleanly', () => {
      const ascii = 'The Mount of Mercy - Liturgical Prayer Service';
      const encoded = app.toBase64(ascii);
      expect(encoded).toBeTruthy();
      expect(app.fromBase64(encoded)).toBe(ascii);
    });

    it('round-trips Ge\'ez and Amharic Unicode script without mojibake', () => {
      const ethiopic = 'በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ አሜን።';
      const encoded = app.toBase64(ethiopic);
      expect(encoded).toBeTruthy();
      expect(app.fromBase64(encoded)).toBe(ethiopic);
    });

    it('round-trips Tigrinya text accurately', () => {
      const tigrinya = 'ቅዳሴ ጎይታናን መድሓኒናን ኢየሱስ ክርስቶስ';
      const encoded = app.toBase64(tigrinya);
      expect(app.fromBase64(encoded)).toBe(tigrinya);
    });

    it('round-trips complex JSON objects as state payload', () => {
      const stateObj = {
        v: '2',
        k: true,
        skd: 'Sunday',
        selectedPsalms: [1, 23, 50, 118, 150],
        bgn: 'ገብረ መስቀል',
        bn: 'ወለተ ማርያም',
      };
      const jsonStr = JSON.stringify(stateObj);
      const encoded = app.toBase64(jsonStr);
      const decodedJson = JSON.parse(app.fromBase64(encoded));
      expect(decodedJson).toEqual(stateObj);
    });
  });

  describe('slugifyTitle', () => {
    it('returns official short slugs for known liturgical sections', () => {
      expect(app.slugifyTitle('Daily Prayer | ዘዘወትር ጸሎት')).toBe('dp');
      expect(app.slugifyTitle('Order of the Liturgy | ሥርዐተ ቅዳሴ')).toBe('ok');
      expect(app.slugifyTitle('Anaphora of the Apostles | አኰቴተ ቍርባን ዘሐዋርያት')).toBe('aa');
      expect(app.slugifyTitle('Anaphora of Our Lady Mary | አኰቴተ ቍርባን ዘእግዝእትነ ማርያም')).toBe('am');
      expect(app.slugifyTitle('Sunday | ዘእሁድ')).toBe('d_sun');
    });

    it('handles dynamic titles by slugifying the primary language section', () => {
      expect(app.slugifyTitle('Vespers Prayer | ጸሎተ ሠርክ')).toBe('vesperspraye');
      expect(app.slugifyTitle('')).toBe('');
      expect(app.slugifyTitle(null)).toBe('');
    });
  });
});
