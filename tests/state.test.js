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

  describe('Liturgy Tab Default Collapse Profile', () => {
    it('collapses top-level pre-liturgy sections and keeps Matins & Kidase expanded one level with sub-sections collapsed', () => {
      const litProfile = app.getLiturgyTabDefaultProfile();
      expect(litProfile.areAllSectionsCollapsed).toBe(false);
      const cs = litProfile.collapsedSections;

      // Completely collapsed sections
      expect(cs['Daily Prayer | ዘዘወትር ጸሎት']).toBe(true);
      expect(cs['<i>Vespers</i> — Sunset Prayer | ጸሎተ ሠርክ']).toBe(true);
      expect(cs['Songs of the Prophets | መኃልየ ነቢያት']).toBe(true);
      expect(cs["<i>Se'atat</i> Readings | ምንባባተ ሰዓታት"]).toBe(true);
      expect(cs['Pre-Liturgy Psalms | መዝሙር ዘዳዊት ዘቅድመ ቅዳሴ']).toBe(true);

      // Expanded one level (parent expanded = false, sub-sections collapsed = true)
      expect(cs['<i>Matins</i> — Morning Prayer | ጸሎተ ነግህ']).toBe(false);
      expect(cs['<i>Matins</i> — Morning Prayer | ጸሎተ ነግህ::→ Prayer of the Gospel | ጸሎተ ወንጌል']).toBe(true);
      expect(cs['<i>Matins</i> — Morning Prayer | ጸሎተ ነግህ::→ <i>Kidan</i> — Prayer of the Covenant | ጸሎተ ኪዳን']).toBe(true);

      expect(cs['<i>Ḳidasé</i> — Liturgy | ቅዳሴ']).toBe(false);
      expect(cs['<i>Ḳidasé</i> — Liturgy | ቅዳሴ::→ Order of the Liturgy | ሥርዓተ ቅዳሴ']).toBe(true);
      expect(cs['<i>Ḳidasé</i> — Liturgy | ቅዳሴ::→ Anaphora of the Apostles | ቅዳሴ ሐዋርያት']).toBe(true);
      expect(cs['<i>Ḳidasé</i> — Liturgy | ቅዳሴ::→ Anaphora of Mary | ቅዳሴ ማርያም']).toBe(true);
    });
  });
});
