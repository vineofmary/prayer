import fs from 'fs';
import path from 'path';
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { loadApp } from './helpers/loadApp.js';

function loadBrowserScriptIntoWindow(relPath) {
  const fullPath = path.resolve(process.cwd(), relPath);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const fn = new Function('window', 'document', `${raw}\n` +
    `if (typeof WeahaduBibleService !== 'undefined') { window.WeahaduBibleService = WeahaduBibleService; globalThis.WeahaduBibleService = WeahaduBibleService; }\n` +
    `if (typeof typicalPsalms !== 'undefined') { window.typicalPsalms = typicalPsalms; globalThis.typicalPsalms = typicalPsalms; }\n` +
    `if (typeof TYPICAL_PSALMS !== 'undefined') { window.TYPICAL_PSALMS = TYPICAL_PSALMS; globalThis.TYPICAL_PSALMS = TYPICAL_PSALMS; }\n` +
    `if (typeof prayers !== 'undefined') { window.prayers = prayers; globalThis.prayers = prayers; }\n` +
    `if (typeof songs !== 'undefined') { window.songs = songs; globalThis.songs = songs; }\n` +
    `if (typeof kidaseData !== 'undefined') { window.kidaseData = kidaseData; globalThis.kidaseData = kidaseData; }\n`
  );
  fn(window, document);
}

describe('Canonical 1938 AD EOTC Annual Lectionary (All 13 Months / 366 Days)', () => {
  let app;

  beforeAll(async () => {
    const assetsRoot = path.resolve(process.cwd(), 'app/src/main/assets');
    globalThis.fetch = async (urlStr) => {
      let cleanRel = String(urlStr);
      try {
        if (/^https?:\/\//i.test(cleanRel)) {
          const parsed = new URL(cleanRel);
          cleanRel = parsed.pathname;
        }
      } catch (_) {}
      cleanRel = decodeURIComponent(cleanRel.replace(/^\.?\/+/, '').split('?')[0]);
      // Serve only canon.json and modular per-book JSON files (skip huge 40MB+ monolithic root bible/*.json files)
      const isAllowedModularFile =
        cleanRel === 'bible/canon.json' ||
        /^bible\/[^/]+\/(?:books\/)?[^/]+\.json$/i.test(cleanRel);
      const targetPath = path.join(assetsRoot, cleanRel);
      if (!isAllowedModularFile || !fs.existsSync(targetPath)) {
        return { ok: false, status: 404, json: async () => null };
      }
      const txt = fs.readFileSync(targetPath, 'utf8');
      return {
        ok: true,
        status: 200,
        json: async () => JSON.parse(txt),
      };
    };
    window.fetch = globalThis.fetch;

    loadBrowserScriptIntoWindow('app/src/main/assets/js/prayers.js');
    loadBrowserScriptIntoWindow('app/src/main/assets/js/songs.js');
    loadBrowserScriptIntoWindow('app/src/main/assets/js/typical_psalms.js');
    loadBrowserScriptIntoWindow('app/src/main/assets/js/eotc_lectionary.js');
    loadBrowserScriptIntoWindow('app/src/main/assets/js/bible_service.js');
    app = loadApp();
    await window.WeahaduBibleService.init();
  });

  afterEach(() => {
    app.clearCustomDateTimeOverride({ render: false });
  });

  function ethToGregDate(ethY, ethM, ethD, { forWazemaEvening = false, hours = 8, minutes = 0 } = {}) {
    const g = window.ethiopianToGregorian(ethY, ethM, ethD, { forWazemaEvening });
    return new Date(g.year, g.month - 1, g.day, hours, minutes, 0);
  }

  describe('Dataset Completeness & 1938 AD Scan Verification (All 366 Days: 1/1–13/6)', () => {
    it('contains all 366 Ethiopian calendar days across all 13 months (Meskerem 1 through Pagumen 6)', () => {
      const keys = Object.keys(window.EOTC_LECTIONARY);
      expect(keys).toHaveLength(366);

      for (let m = 1; m <= 12; m++) {
        for (let d = 1; d <= 30; d++) {
          const entry = window.getEotcLectionaryEntry(m, d);
          expect(entry, `Missing entry for ${m}/${d}`).toBeTruthy();
          expect(entry.qidase, `Missing qidase for ${m}/${d}`).toBeTruthy();
          expect(entry.qidase.sets.length).toBeGreaterThanOrEqual(1);
        }
      }
      for (let d = 1; d <= 6; d++) {
        const entry = window.getEotcLectionaryEntry(13, d);
        expect(entry, `Missing entry for 13/${d}`).toBeTruthy();
        expect(entry.qidase.sets.length).toBeGreaterThanOrEqual(1);
      }
    });

    it('validates all ~4,145 Scripture & LXX Psalm references across all 366 days', () => {
      for (const [dayKey, entry] of Object.entries(window.EOTC_LECTIONARY)) {
        for (const r of entry.morning) {
          expect(typeof r).toBe('string');
          expect(r.trim().length).toBeGreaterThan(2);
        }
        if (entry.matins) {
          if (entry.matins.psalmLxx !== null) {
            const mt = window.convertLxxPsalmRefToMt(entry.matins.psalmLxx, app.getMtFromLxx);
            expect(mt, `Invalid matins.psalmLxx on ${dayKey}: ${entry.matins.psalmLxx}`).toMatch(/^Psalms \d+:\d+/);
          }
          if (entry.matins.gospel !== null) {
            expect(entry.matins.gospel).toMatch(/^(?:Matthew|Mark|Luke|John)\s+\d+:\d+/);
          }
        }
        for (const field of ['pauline', 'universal', 'acts']) {
          expect(typeof entry.qidase[field], `Missing qidase.${field} on ${dayKey}`).toBe('string');
          expect(entry.qidase[field].trim().length).toBeGreaterThan(3);
        }
        for (const s of entry.qidase.sets) {
          const mt = window.convertLxxPsalmRefToMt(s.psalmLxx, app.getMtFromLxx);
          expect(mt, `Invalid qidase psalmLxx on ${dayKey}: ${s.psalmLxx}`).toMatch(/^Psalms \d+:\d+/);
          expect(s.gospel, `Invalid qidase gospel on ${dayKey}: ${s.gospel}`).toMatch(/^(?:Matthew|Mark|Luke|John)\s+\d+:\d+/);
        }
        for (const r of entry.evening) {
          expect(typeof r).toBe('string');
          expect(r.trim().length).toBeGreaterThan(2);
        }
      }
    });

    it('includes authoritative 1938 AD Yä-Betä Krəstiyan Ṣälot scan corrections across all 13 months', () => {
      // Sep–Nov (Book pp. 139–141)
      expect(window.getEotcLectionaryEntry(1, 3).morning).toContain('Acts 2:22-47');
      expect(window.getEotcLectionaryEntry(1, 13).evening).toContain('Acts 16:1-15');
      expect(window.getEotcLectionaryEntry(1, 16).morning).toContain('Matthew 22');
      expect(window.getEotcLectionaryEntry(1, 16).evening).toContain('Matthew 23');
      expect(window.getEotcLectionaryEntry(1, 17).matins.gospel).toBe('Matthew 5:1-17');
      expect(window.getEotcLectionaryEntry(1, 20).evening).toContain('Matthew 28');
      expect(window.getEotcLectionaryEntry(1, 25).evening).toContain('Romans 8:18-39');
      expect(window.getEotcLectionaryEntry(2, 4).morning).toContain('Exodus 16');
      expect(window.getEotcLectionaryEntry(2, 9).evening).toContain('1 Corinthians 15:33-End');
      expect(window.getEotcLectionaryEntry(2, 10).qidase.sets[0].gospel).toBe('Mark 13:9-End');
      expect(window.getEotcLectionaryEntry(2, 12).matins.psalmLxx).toBe('88:9-10');
      expect(window.getEotcLectionaryEntry(2, 16).morning).toContain('John 3');
      expect(window.getEotcLectionaryEntry(2, 17).morning).toContain('John 5');
      expect(window.getEotcLectionaryEntry(2, 20).morning).toContain('John 11');
      expect(window.getEotcLectionaryEntry(2, 25).qidase.pauline).toBe('Ephesians 6:14-End');
      expect(window.getEotcLectionaryEntry(2, 25).qidase.sets[0].gospel).toBe('Matthew 5:1-17');
      expect(window.getEotcLectionaryEntry(3, 18).qidase.pauline).toBe('Titus 2:1-End');
      expect(window.getEotcLectionaryEntry(3, 20).qidase.universal).toBe('1 Peter 5:1-End');
      expect(window.getEotcLectionaryEntry(3, 20).evening).toContain('Hebrews 12');

      // Dec–Aug (Book pp. 141–150 & Festal Tables pp. 159–164)
      expect(window.getEotcLectionaryEntry(3, 22).evening).toContain('Mark 10');
      expect(window.getEotcLectionaryEntry(3, 26).evening).toContain('1 Peter 4:12-19');
      expect(window.getEotcLectionaryEntry(4, 23).matins.gospel).toBe('Matthew 22:41-End'); // King David Matins Gospel restored
      expect(window.getEotcLectionaryEntry(4, 27).qidase.pauline).toBe('Romans 16:17-End');
      expect(window.getEotcLectionaryEntry(4, 29).qidase.anaphora).toBe(14); // Genna: St. Gregory II
      expect(window.getEotcLectionaryEntry(5, 5).morning).toEqual(['1 Samuel 6', '1 Corinthians 2', 'Matthew 22']);
      expect(window.getEotcLectionaryEntry(5, 7).evening).toEqual(['1 Samuel 10', '1 Corinthians 6', 'Matthew 26']);
      expect(window.getEotcLectionaryEntry(5, 11).qidase.anaphora).toBe(9); // Timket: St. Epiphanius
      expect(window.getEotcLectionaryEntry(5, 21).matins.gospel).toBe('Luke 1:39-57'); // Aster'eyo Maryam Matins Gospel restored
      expect(window.getEotcLectionaryEntry(5, 22).qidase.pauline).toBe('Ephesians 6:10-End');
      expect(window.getEotcLectionaryEntry(6, 14).evening).toContain('2 Kings 1');
      expect(window.getEotcLectionaryEntry(6, 18).morning).toContain('2 Kings 7');
      expect(window.getEotcLectionaryEntry(6, 28).qidase.pauline).toBe('Hebrews 11:8-22');
      expect(window.getEotcLectionaryEntry(7, 2).qidase.sets[0].psalmLxx).toBe('36:30-31');
      expect(window.getEotcLectionaryEntry(7, 7).qidase.universal).toBe('1 John 2:14-20');
      expect(window.getEotcLectionaryEntry(8, 3).qidase.pauline).toBe('Galatians 1:20-2:6');
      expect(window.getEotcLectionaryEntry(8, 23).evening).toContain('Ecclesiastes 9');
      expect(window.getEotcLectionaryEntry(8, 25).morning).toContain('Ecclesiastes 12');
      expect(window.getEotcLectionaryEntry(8, 25).evening).toContain('Jeremiah 1');
      expect(window.getEotcLectionaryEntry(9, 8).evening).toContain('Jeremiah 25');
      expect(window.getEotcLectionaryEntry(9, 25).qidase.sets[0].gospel).toBe('Mark 15:40-42');
      expect(window.getEotcLectionaryEntry(9, 28).morning).toContain('Ezekiel 7');
      expect(window.getEotcLectionaryEntry(10, 15).qidase.pauline).toBe('Ephesians 6:10-End');
      expect(window.getEotcLectionaryEntry(10, 23).morning).toContain('Luke 12:1-31');
      expect(window.getEotcLectionaryEntry(10, 23).evening).toContain('Luke 12:32-59');
      expect(window.getEotcLectionaryEntry(10, 28).qidase.sets[0].gospel).toBe('Mark 3:23-32');
      expect(window.getEotcLectionaryEntry(11, 1).qidase.acts).toBe('Acts 9:36-End');
      expect(window.getEotcLectionaryEntry(11, 24).morning).toContain('Judith 16');
      expect(window.getEotcLectionaryEntry(11, 24).evening).toContain('Wisdom of Solomon 1');
      expect(window.getEotcLectionaryEntry(11, 26).evening).toContain('Galatians 6');
      expect(window.getEotcLectionaryEntry(12, 3).evening).toContain('Colossians 4');
      expect(window.getEotcLectionaryEntry(12, 10).evening).toContain('2 Timothy 2');
      expect(window.getEotcLectionaryEntry(12, 11).evening).toContain('2 Timothy 4');
      expect(window.getEotcLectionaryEntry(12, 22).evening).toContain('Hebrews 12');
    });

    it('maps Anaphora 4 (St. Mary) to "mary", Anaphora 12 (St. Jacob of Serug) to "jacob", and defaults unbundled Anaphoras to "apostles"', () => {
      expect(window.resolveAppAnaphoraKey(4)).toBe('mary');
      expect(window.resolveAppAnaphoraKey(12)).toBe('jacob');
      expect(window.resolveAppAnaphoraKey(1)).toBe('apostles');
      expect(window.resolveAppAnaphoraKey(null)).toBe('apostles');
      for (const id of [2, 3, 5, 6, 7, 8, 9, 10, 11, 13, 14]) {
        expect(window.resolveAppAnaphoraKey(id)).toBe('apostles');
      }
      // Feast of St. Michael the Archangel (Megabit 12 = 7/12) and Meskerem 3 (1/3) appoint Anaphora 12 (St. Jacob of Serug)
      expect(window.getEotcLectionaryEntry(7, 12).qidase.anaphora).toBe(12);
      expect(window.resolveAppAnaphoraKey(window.getEotcLectionaryEntry(7, 12).qidase.anaphora)).toBe('jacob');
      expect(window.getEotcLectionaryEntry(1, 3).qidase.anaphora).toBe(12);
    });
  });

  describe('LXX -> MT Psalm Conversion & 6:00 PM (Wazema) Liturgical Day Transition', () => {
    it('converts Septuagint Misbak references accurately to NKJV/MT numbering', () => {
      expect(window.convertLxxPsalmRefToMt('83:6-7', app.getMtFromLxx)).toBe('Psalms 84:6-7');
      expect(window.convertLxxPsalmRefToMt('113:22-23', app.getMtFromLxx)).toBe('Psalms 115:14-15');
      expect(window.convertLxxPsalmRefToMt('115:6-7', app.getMtFromLxx)).toBe('Psalms 116:15-16');
      expect(window.convertLxxPsalmRefToMt('147:1-2', app.getMtFromLxx)).toBe('Psalms 147:12-13');
      expect(window.convertLxxPsalmRefToMt('1:2-3', app.getMtFromLxx)).toBe('Psalms 1:2-3');
    });

    it('treats 6:00 PM (18:00) as the start of the next liturgical day across Calendar, Wudasie, Se\'atat, and Qidase', () => {
      // Saturday, Sep 26, 2026 at 5:59 PM -> still Saturday (Meskerem 16 = 1/16, 2014 Gitsawe A-2 Our Lord -> defaults to 'apostles')
      const satBefore6pm = new Date(2026, 8, 26, 17, 59, 0);
      app.setCustomDateTimeOverride(satBefore6pm);

      const ethBefore = app.computeEthiopianDate(app.getEffectiveDate());
      expect(ethBefore.ethMonth).toBe(1);
      expect(ethBefore.ethDay).toBe(16);
      expect(ethBefore.isWazemaEvening).toBe(false);

      let snap = app.getActiveLectionaryReadingsSnapshot();
      expect(snap.selectedAnaphora).toBe('apostles'); // 2014 1/16 is A-2 (Anaphora of Our Lord -> 'apostles' fallback)
      expect(snap.kidaseLectionaryRefs.pauline).toBe('1 Corinthians 3:10-18');
      expect(snap.kidaseLectionaryRefs.gospel).toBe('John 9:1-12');

      // Saturday, Sep 26, 2026 at 6:01 PM -> Sunday (Meskerem 17 = 1/17 Meskel!, A-10 -> defaults to 'apostles')
      const satAfter6pm = new Date(2026, 8, 26, 18, 1, 0);
      app.setCustomDateTimeOverride(satAfter6pm);

      const ethAfter = app.computeEthiopianDate(app.getEffectiveDate());
      expect(ethAfter.ethMonth).toBe(1);
      expect(ethAfter.ethDay).toBe(17);
      expect(ethAfter.isWazemaEvening).toBe(true);

      const litDay = app.getLiturgicalDateObject(app.getEffectiveDate());
      expect(litDay.getDay()).toBe(0); // Sunday!

      snap = app.getActiveLectionaryReadingsSnapshot();
      expect(snap.selectedAnaphora).toBe('apostles'); // 1/17 is A-10 -> defaults to 'apostles'
      expect(snap.kidaseLectionaryRefs.morningPsalm).toBe('Psalms 60:4-5'); // 2014 Matins Ps 59:4-5 LXX
      expect(snap.kidaseLectionaryRefs.morningGospel).toBe('John 3:14-22');
      expect(snap.kidaseLectionaryRefs.pauline).toBe('1 Timothy 5:9-16');
      expect(snap.kidaseLectionaryRefs.gospel).toBe('Matthew 8:16-28');
      expect(snap.kidaseLectionaryRefs.eveningPsalm).toBe('Psalms 56:6-7'); // 2014 Vespers Ps 55:6-7 LXX
      expect(snap.kidaseLectionaryRefs.eveningGospel).toBe('John 7:1-6');
    });

    it('round-trips Ethiopian <-> Gregorian dates before and after 6:00 PM across the full year', () => {
      for (const [m, d] of [[1, 17], [4, 29], [5, 11], [8, 23], [11, 24], [12, 16]]) {
        const gregDay = ethToGregDate(2019, m, d, { forWazemaEvening: false, hours: 9, minutes: 0 });
        const backDay = app.computeEthiopianDate(gregDay);
        expect(backDay.ethYear).toBe(2019);
        expect(backDay.ethMonth).toBe(m);
        expect(backDay.ethDay).toBe(d);

        const gregEve = ethToGregDate(2019, m, d, { forWazemaEvening: true, hours: 19, minutes: 30 });
        const backEve = app.computeEthiopianDate(gregEve);
        expect(backEve.ethYear).toBe(2019);
        expect(backEve.ethMonth).toBe(m);
        expect(backEve.ethDay).toBe(d);
        expect(backEve.isWazemaEvening).toBe(true);
      }
    });
  });

  describe('Ordinary Matins Fallback, Multi-Reading Set Switcher & Header Clock UI', () => {
    it('populates full 2013/14 Patriarchate Matins, Qidase & Vespers readings on ordinary weekdays (e.g. 1/3 in 2018 E.C.)', () => {
      // Meskerem 3, 2018 E.C. is Saturday (ordinary fixed day -> Daily 2014 is primary)
      const greg = ethToGregDate(2018, 1, 3, { forWazemaEvening: false, hours: 7, minutes: 30 });
      app.setCustomDateTimeOverride(greg);

      const snap = app.getActiveLectionaryReadingsSnapshot();
      expect(snap.kidaseLectionaryRefs.morningPsalm).toBe('Psalms 4:2-3');
      expect(snap.kidaseLectionaryRefs.morningGospel).toBe('Matthew 3:7-10');
      expect(snap.kidaseLectionaryRefs.pauline).toBe('2 Thessalonians 3:13-End');
      expect(snap.kidaseLectionaryRefs.gospel).toBe('Matthew 18:18-23');
      expect(snap.kidaseLectionaryRefs.eveningPsalm).toBe('Psalms 55:17-18');
      expect(snap.kidaseLectionaryRefs.eveningGospel).toBe('Matthew 11:15-20');
    });

    it('switches Qidase reading profiles cleanly on multi-reading feast & Sunday days (e.g. 1/17 Meskel & 2/6)', () => {
      // Meskerem 17, 2019 E.C. is a Sunday Meskel -> exposes Meskel (2014), Alternate (ዓዲ), Sunday (Meskel Sunday), and 1938 Ed.
      const meskelGreg = ethToGregDate(2019, 1, 17, { forWazemaEvening: false, hours: 8, minutes: 0 });
      app.setCustomDateTimeOverride(meskelGreg);

      const meskelProfiles = app.getActiveKidaseProfilesForDate();
      expect(meskelProfiles.map(p => p.shortLabel)).toEqual(
        expect.arrayContaining(['Meskel (2014)', 'Alternate (ዓዲ)', 'Sunday (Meskel Sunday)'])
      );

      let snap = app.getActiveLectionaryReadingsSnapshot();
      expect(snap.kidaseLectionaryRefs.psalm).toBe('Psalms 60:4-5');
      expect(snap.kidaseLectionaryRefs.gospel).toBe('Matthew 8:16-28');

      // Switch to Alternate (ዓዲ) on Meskel (1/17) -> Ps 131:6-7 LXX (Psalms 132:6-7) & John 19:25-28
      app.selectKidaseReadingSet(1);
      snap = app.getActiveLectionaryReadingsSnapshot();
      expect(snap.selectedKidaseReadingSetIndex).toBe(1);
      expect(snap.kidaseLectionaryRefs.psalm).toBe('Psalms 132:6-7');
      expect(snap.kidaseLectionaryRefs.gospel).toBe('John 19:25-28');

      // Switch to Meskel Sunday seasonal profile -> 1 Corinthians 1:10-End & Mark 8:27-End
      app.selectKidaseReadingSet(2);
      snap = app.getActiveLectionaryReadingsSnapshot();
      expect(snap.selectedKidaseReadingSetIndex).toBe(2);
      expect(snap.kidaseLectionaryRefs.pauline).toBe('1 Corinthians 1:10-End');
      expect(snap.kidaseLectionaryRefs.gospel).toBe('Mark 8:27-End');

      // Check Tikimt 6 = 2/6 (2014 Primary A-4 St. Mary + 1938 Legacy alternates)
      const tikimt6Greg = ethToGregDate(2019, 2, 6, { forWazemaEvening: false, hours: 8, minutes: 0 });
      app.setCustomDateTimeOverride(tikimt6Greg);
      snap = app.getActiveLectionaryReadingsSnapshot();
      expect(snap.selectedAnaphora).toBe('mary');
      expect(snap.kidaseLectionaryRefs.pauline).toBe('1 Timothy 5:5-10');
      expect(snap.kidaseLectionaryRefs.gospel).toBe('Matthew 10:32-End');

      const tikimt6Profiles = app.getActiveKidaseProfilesForDate();
      // 1938 Legacy Set 2 for Prophetess Hannah on Tikimt 6 -> Ps 112:9 LXX (Psalms 113:9) & Luke 2:36-39
      const legacySet2Idx = tikimt6Profiles.findIndex(p => p.shortLabel === '1938 Ed. (2)');
      expect(legacySet2Idx).toBeGreaterThan(0);
      app.selectKidaseReadingSet(legacySet2Idx);
      snap = app.getActiveLectionaryReadingsSnapshot();
      expect(snap.selectedKidaseReadingSetIndex).toBe(legacySet2Idx);
      expect(snap.kidaseLectionaryRefs.psalm).toBe('Psalms 113:9');
      expect(snap.kidaseLectionaryRefs.gospel).toBe('Luke 2:36-39');

      // 1938 Legacy Set 3 is also preserved -> Psalms 102:3-5 & Luke 2:36-39
      const legacySet3Idx = tikimt6Profiles.findIndex(p => p.refs.psalm === 'Psalms 102:3-5');
      expect(legacySet3Idx).toBeGreaterThan(legacySet2Idx);
      app.selectKidaseReadingSet(legacySet3Idx);
      snap = app.getActiveLectionaryReadingsSnapshot();
      expect(snap.selectedKidaseReadingSetIndex).toBe(legacySet3Idx);
      expect(snap.kidaseLectionaryRefs.psalm).toBe('Psalms 102:3-5');
      expect(snap.kidaseLectionaryRefs.gospel).toBe('Luke 2:36-39');
    });

    it('renders minimal icon-only clock button right of Year in #liturgical-calendar-bar', () => {
      app.renderLiturgicalCalendarBar();
      const bar = document.getElementById('liturgical-calendar-bar');
      expect(bar).toBeTruthy();

      const yearBtn = bar.querySelector('[data-cal-action="year"]');
      const clockBtn = bar.querySelector('[data-cal-action="datetime"]');
      expect(yearBtn).toBeTruthy();
      expect(clockBtn).toBeTruthy();
      expect(clockBtn.textContent.trim()).toBe(''); // icon-only, no word text
      expect(clockBtn.querySelector('svg')).toBeTruthy();
      expect(yearBtn.nextElementSibling).toBe(clockBtn);
      expect(clockBtn.classList.contains('is-overridden')).toBe(false);

      // Activate override -> adds .is-overridden state
      app.setCustomDateTimeOverride(new Date(2026, 9, 15, 9, 0, 0));
      const clockBtnAfter = bar.querySelector('[data-cal-action="datetime"]');
      expect(clockBtnAfter.classList.contains('is-overridden')).toBe(true);

      // Ordinary day (Tikimt 5, 2019 ዓ.ም.) -> no feast day line in header
      const ordinaryDay = ethToGregDate(2019, 2, 5, { forWazemaEvening: false, hours: 9, minutes: 0 });
      app.setCustomDateTimeOverride(ordinaryDay);
      expect(bar.querySelector('.cal-feast-desktop')).toBeNull();
      const mobileFeastOrd = document.getElementById('header-feast-mobile-line');
      expect(mobileFeastOrd).toBeTruthy();
      expect(mobileFeastOrd.hidden).toBe(true);

      // Feast day (Tikimt 29, 2019 ዓ.ም.) -> displays "Feast of God the Son | በዓለ ወልድ" in desktop & mobile header elements
      const tikimt29 = ethToGregDate(2019, 2, 29, { forWazemaEvening: false, hours: 9, minutes: 0 });
      app.setCustomDateTimeOverride(tikimt29);
      const desktopFeastEl = bar.querySelector('.cal-feast-desktop');
      expect(desktopFeastEl).toBeTruthy();
      expect(desktopFeastEl.textContent).toBe('Feast of God the Son | በዓለ ወልድ');
      const mobileFeastEl = document.getElementById('header-feast-mobile-line');
      expect(mobileFeastEl.hidden).toBe(false);
      expect(mobileFeastEl.textContent).toBe('Feast of God the Son | በዓለ ወልድ');
    });

    it('renders Morning/Sunset Daily Readings with 5 PM auto-switch, pill toggle, day arrows, Ge\'ez year, Feast subtitle, and Se\'atat-style subsection titles', async () => {
      const toggleLabel = document.querySelector('#show-daily-lectionary-toggle')?.parentElement?.textContent || '';
      expect(toggleLabel).toContain('Daily Readings | ምንባባት ዘለለዕለቱ');
      expect(toggleLabel).not.toContain('ዘየዕለቱ');

      // 1. Before 5:00 PM (8:00 AM on Meskerem 1, 2019 ዓ.ም. — Feast of Ethiopian New Year / St. John the Baptist)
      const meskerem1Morning = ethToGregDate(2019, 1, 1, { forWazemaEvening: false, hours: 8, minutes: 0 });
      app.setCustomDateTimeOverride(meskerem1Morning, { render: false });
      app.setDailyLectionaryPeriod(null, { render: false });
      app.stepDailyLectionaryDayOffset(0, { reset: true, render: false });

      expect(app.getEffectiveDailyLectionaryPeriod()).toBe('morning');
      const morningCalls = [];
      app.renderDailyLectionarySection((title, isCollapsible, meta, options) => morningCalls.push({ title, isCollapsible, meta, options }));

      expect(morningCalls[0].title).toBe('Morning Readings | ምንባባት ዘነግህ');
      expect(morningCalls[0].meta.date).toBe('Meskerem 1, 2019 ዓ.ም. | መስከረም ፩፣ ፳፻፲፱ ዓ.ም.');
      expect(morningCalls[0].meta.feast).toBe('Head of the Year (New Year) & St. John the Baptist | ርእሰ ዐውደ ዓመት ወዮሐንስ መጥምቅ');
      expect(morningCalls[0].meta.customElement).toBeTruthy();

      const morningTitles = morningCalls.map(c => c.title);
      expect(morningTitles).toContain('→ <i>Matins</i> (Psalm 65:11) | ምስባክ ዘነግህ');
      expect(morningTitles).toContain('→ <i>Matins</i> (Luke 4:16-23) | ወንጌል ዘነግህ');
      expect(morningCalls[1].options?.feastBadgeLabel).toBe('FEAST');
      expect(morningCalls[2].options?.feastBadgeLabel).toBe('FEAST');
      expect(morningTitles.some(t => t.includes('ዘሠርክ'))).toBe(false);

      // Verify actual rendered DOM on a day with BOTH continuous Morning Readings and Festal Matins (Tikimt 29)
      const tikimt29Morning = ethToGregDate(2019, 2, 29, { forWazemaEvening: false, hours: 8, minutes: 0 });
      app.setCustomDateTimeOverride(tikimt29Morning, { render: false });
      await app.renderPrayers();
      const renderedSubsections = Array.from(document.querySelectorAll('#prayer-display .section-title.sub-section-title'));
      const matinsHeaders = renderedSubsections.filter(el => el.innerHTML.includes('<i>Matins</i>'));
      expect(matinsHeaders.length).toBeGreaterThanOrEqual(2);
      for (const mh of matinsHeaders) {
        const badge = mh.querySelector('.festal-reading-badge');
        expect(badge).toBeTruthy();
        expect(badge.textContent).toBe('FEAST');
      }

      // 2. At/after 5:00 PM (5:15 PM local on Hidar 2, 2019 ዓ.ም.) -> auto-selects Sunset Readings
      const hidar2At515Pm = ethToGregDate(2019, 3, 2, { forWazemaEvening: false, hours: 17, minutes: 15 });
      app.setCustomDateTimeOverride(hidar2At515Pm);
      expect(app.getEffectiveDailyLectionaryPeriod()).toBe('sunset');

      const sunsetCalls = [];
      app.renderDailyLectionarySection((title, isCollapsible, meta) => sunsetCalls.push({ title, isCollapsible, meta }));
      expect(sunsetCalls[0].title).toBe('Sunset Readings | ምንባባት ዘሠርክ');
      expect(sunsetCalls[0].meta.date).toBe('Hidar 2, 2019 ዓ.ም. | ኅዳር ፪፣ ፳፻፲፱ ዓ.ም.');
      const sunsetTitles = sunsetCalls.map(c => c.title);
      expect(sunsetTitles).toContain('→ Torah (Deuteronomy 18:13-22) | ኦሪት ዘሠርክ');
      expect(sunsetTitles).toContain('→ Pauline Epistle (1 Thessalonians 4:13-18) | መልእክተ ጳውሎስ ዘሠርክ');
      expect(sunsetTitles).toContain('→ Gospel (Matthew 12:9-21) | ወንጌል ዘሠርክ');
      expect(sunsetTitles.some(t => t.includes('ዘነግህ'))).toBe(false);
      expect(app.formatDailyReadingSubsectionTitle('Isaiah 40', 'sunset')).toBe('Prophecy (Isaiah 40) | ትንቢት ዘሠርክ');

      // 3. Manual Morning/Sunset pill override & Day offset stepping
      app.setDailyLectionaryPeriod('morning', { render: false });
      expect(app.getEffectiveDailyLectionaryPeriod()).toBe('morning');
      const hidar2MorningCalls = [];
      app.renderDailyLectionarySection((title) => hidar2MorningCalls.push(title));
      expect(hidar2MorningCalls[0]).toBe('Morning Readings | ምንባባት ዘነግህ');
      expect(hidar2MorningCalls).toContain('→ Torah (Deuteronomy 18:1-12) | ኦሪት ዘነግህ');

      app.stepDailyLectionaryDayOffset(1, { render: false });
      const hidar3Calls = [];
      app.renderDailyLectionarySection((title, _c, meta) => hidar3Calls.push({ title, meta }));
      expect(hidar3Calls[0].meta.date).toBe('Hidar 3, 2019 ዓ.ም. | ኅዳር ፫፣ ፳፻፲፱ ዓ.ም.');
      expect(hidar3Calls[0].meta.customElement.querySelector('.daily-readings-today-chip')).toBeTruthy();

      app.stepDailyLectionaryDayOffset(0, { reset: true, render: false });
      app.setDailyLectionaryPeriod(null, { render: false });

      // 4. Updated colon/comma format without middle dot in formatLocalizedReadingLabel
      expect(app.formatLocalizedReadingLabel('Deuteronomy 18:13-22', 'Sunset', 'ዘሠርክ')).toBe('Sunset: Deuteronomy 18:13-22 | ዘሠርክ፥ ዘዳግም ፲፰፥፲፫-፳፪');
      expect(app.formatLocalizedReadingLabel('Deuteronomy 18:1-12', 'Morning', 'ዘነግህ')).toBe('Morning: Deuteronomy 18:1-12 | ዘነግህ፥ ዘዳግም ፲፰፥፩-፲፪');
      expect(app.formatLocalizedReadingLabel('Tobit 1', 'Sunset', 'ዘሠርክ')).toBe('Sunset: Tobit 1 | ዘሠርክ፥ ጦቢት ፩');
      expect(app.formatLocalizedReadingLabel('Judith 16', 'Morning', 'ዘነግህ')).toBe('Morning: Judith 16 | ዘነግህ፥ ዮዲት ፲፮');
    });

    it('renders updated Liturgical Date & Time modal without preset pills/badge and with collapsible 1938 AD scan viewer + feedback link', () => {
      const hidar2 = ethToGregDate(2019, 3, 2, { forWazemaEvening: false, hours: 9, minutes: 0 });
      app.setCustomDateTimeOverride(hidar2);
      app.openCalendarInfoModal('datetime');

      const body = document.getElementById('calendar-info-body');
      expect(body).toBeTruthy();
      expect(body.textContent).toContain("Select any date and hour to preview or pray its appointed prayers and Scripture readings. Note: each day at 6:00 PM, the Church's liturgical day advances to the next day.");
      expect(body.querySelector('.cal-dt-presets')).toBeNull();
      expect(body.textContent).not.toContain('Appointed Readings Available');
      expect(body.textContent).not.toContain('Matins · 7 AM');

      // Transparency footer & collapsible 1938 AD scans drawer (hidden by default)
      const scansToggle = body.querySelector('#cal-dt-toggle-scans-link');
      const feedbackLink = body.querySelector('#cal-dt-open-feedback-link');
      const scansDrawer = body.querySelector('#cal-dt-scans-drawer');
      expect(scansToggle).toBeTruthy();
      expect(feedbackLink).toBeTruthy();
      expect(scansDrawer).toBeTruthy();
      expect(scansDrawer.hidden).toBe(true);

      // Click first "here" -> reveals 1938 AD scan synced to Hidar (Book p. 141)
      scansToggle.click();
      expect(scansDrawer.hidden).toBe(false);
      const scanImg = scansDrawer.querySelector('#cal-dt-scan-img');
      expect(scanImg?.getAttribute('src')).toContain('img/lectionary-1938/p141.webp');

      // Click second "here" -> closes Date/Time modal and opens #feedback-modal
      feedbackLink.click();
      const calModal = document.getElementById('calendar-info-modal');
      const feedbackModal = document.getElementById('feedback-modal');
      expect(calModal?.style.display).toBe('none');
      expect(feedbackModal?.style.display).toBe('block');
    });
  });

  describe('Scripture Reference Parser & 81-Canon / Deuterocanonical Resolution Across All 366 Days', () => {
    it('resolves multi-chapter, cross-chapter, OT historical/prophetic, Proverbs 25–31 (Admonition), and Deuterocanonical books', async () => {
      const booksToLoad = [
        'Genesis', '1 John', 'Mark', 'Sirach', 'Baruch', 'Rest of Jeremiah',
        'Susanna', 'Daniel', 'Bel and the Dragon', 'Rest of Daniel',
        'Azariah', 'Song of the Three Holy Children', 'Ephesians', 'Matthew',
        'Tobit', 'Judith', 'Wisdom of Solomon', 'Ecclesiastes', 'Proverbs',
        'Book of Admonition', 'Ruth', 'Malachi', 'Galatians'
      ];
      for (const b of booksToLoad) {
        await window.WeahaduBibleService.fetchBook('en-kjv', b);
        await window.WeahaduBibleService.fetchBook('am-2000', b);
        await window.WeahaduBibleService.fetchBook('gez-2014', b);
        await window.WeahaduBibleService.fetchBook('gez-1980', b);
      }

      // Multi-chapter & Cross-chapter (including 8/3 Galatians 1:20-2:6)
      expect(app.getBibleVersesFromRef('Genesis 9-10')?.english?.length).toBeGreaterThan(45);
      expect(app.getBibleVersesFromRef('1 John 2:28-3:10')?.english?.length).toBe(12);
      expect(app.getBibleVersesFromRef('Mark 8:34-9:2')?.english?.length).toBe(7);
      expect(app.getBibleVersesFromRef('Galatians 1:20-2:6')?.english?.length).toBe(11);

      // Dec–Aug OT & Deuterocanonical books across English, Amharic, and Ge'ez (with gez-2014 -> gez-1980 fallback)
      for (const ref of ['Tobit 1', 'Judith 16', 'Wisdom of Solomon 1', 'Ecclesiastes 9', 'Ruth 1', 'Malachi 4']) {
        const res = app.getBibleVersesFromRef(ref);
        expect(res?.english?.length, `${ref} English`).toBeGreaterThan(4);
        expect(res?.amharic_script?.length, `${ref} Amharic`).toBeGreaterThan(4);
        expect(res?.geez_script?.length, `${ref} Ge'ez`).toBeGreaterThan(4);
      }

      // Proverbs 25–31 EOTC 81-canon alignment (Book of Admonition 1–6 + LXX Proverbs 24:28-81)
      for (const ref of ['Proverbs 25', 'Proverbs 30', 'Proverbs 31']) {
        const res = app.getBibleVersesFromRef(ref);
        expect(res?.english?.length, `${ref} English`).toBeGreaterThan(20);
        expect(res?.amharic_script?.length, `${ref} Amharic`).toBeGreaterThan(20);
        expect(res?.geez_script?.length, `${ref} Ge'ez`).toBeGreaterThan(20);
      }
      expect(app.getBibleVersesFromRef('Proverbs 31')?.amharic_script?.length).toBe(31);

      // Pagumen Deuterocanonical books
      expect(app.getBibleVersesFromRef('Sirach 42')?.english?.length).toBeGreaterThan(15);
      expect(app.getBibleVersesFromRef('Baruch 6')?.amharic_script?.length).toBeGreaterThan(50);
      expect(app.getBibleVersesFromRef('Susanna 1')?.english?.length).toBeGreaterThan(50);
      expect(app.getBibleVersesFromRef('Susanna 1')?.amharic_script?.length).toBeGreaterThan(50);
      expect(app.getBibleVersesFromRef('Bel and the Dragon 1')?.amharic_script?.length).toBeGreaterThan(30);
      expect(app.getBibleVersesFromRef('Bel and the Dragon 1')?.geez_script?.length).toBeGreaterThan(30);
      expect(app.getBibleVersesFromRef('Azariah 1:1-34')?.english?.length).toBeGreaterThan(15);
      expect(app.getBibleVersesFromRef('Azariah 1:35-68')?.geez_script?.length).toBeGreaterThan(10);
    });
  });

  describe('Expanded Typical Psalm Chants (Misbak) Alignment, Disambiguation & Instant Search', () => {
    it('expands TYPICAL_PSALMS to 350+ compact single-line Ge\'ez chants with 100% Bible alignment across English, Amharic, Ge\'ez & Tigrinya', async () => {
      await window.WeahaduBibleService.fetchBook('en-kjv', 'Psalms');
      await window.WeahaduBibleService.fetchBook('am-2000', 'Psalms');
      await window.WeahaduBibleService.fetchBook('gez-1980', 'Psalms');
      await window.WeahaduBibleService.fetchBook('ti-1997', 'Psalms');

      const tp = window.TYPICAL_PSALMS;
      expect(Array.isArray(tp)).toBe(true);
      expect(tp.length).toBeGreaterThanOrEqual(350);

      const seenIds = new Set();
      const seenGeez = new Set();

      for (const entry of tp) {
        expect(entry.id).toBeTruthy();
        expect(seenIds.has(entry.id), `Duplicate Misbak id: ${entry.id}`).toBe(false);
        seenIds.add(entry.id);

        // Compact single-paragraph Ge'ez chant text (no multi-line newline breaks)
        expect(entry.g).toBeTruthy();
        expect(entry.g.includes('\n'), `Unexpected newline in Misbak ${entry.id}`).toBe(false);
        expect(seenGeez.has(entry.g), `Duplicate Ge'ez text in Misbak ${entry.id}`).toBe(false);
        seenGeez.add(entry.g);

        // Valid LXX <-> MT Psalm chapter mapping (no unmapped lc === mc copy-paste bugs in Psalms 10..146)
        const sMt = app.getMtFromLxx(entry.lc, entry.ls);
        expect(entry.mc, `Chapter mismatch on ${entry.id}`).toBe(sMt.mtChapter);
        expect(entry.ms).toBeLessThanOrEqual(entry.me);
        expect(entry.ls).toBeLessThanOrEqual(entry.le);

        // Every Misbak entry must resolve non-empty verses across app Bibles
        const ref = `Psalms ${entry.mc}:${entry.ms}-${entry.me}`;
        app.setSelectedTypicalPsalmId('psalm', entry.id);
        const resolved = app.getBibleVersesFromRef(ref, 'psalm');
        expect(resolved?.english?.length, `Empty English for ${entry.id} (${ref})`).toBeGreaterThan(0);
        expect(resolved?.amharic_script?.length, `Empty Amharic for ${entry.id} (LXX ${entry.lc}:${entry.ls}-${entry.le})`).toBeGreaterThan(0);
        expect(resolved?.tigrinya_script?.length, `Empty Tigrinya for ${entry.id} (${ref})`).toBeGreaterThan(0);
      }
      app.setSelectedTypicalPsalmId('psalm', null);
    });

    it('achieves 100% coverage across all 490 Matins & Qidase Psalm references in the 366-day EOTC Lectionary', () => {
      let totalRefs = 0;
      let coveredRefs = 0;

      for (const [dayKey, entry] of Object.entries(window.EOTC_LECTIONARY)) {
        const lxxRefs = [];
        if (entry.matins?.psalmLxx) lxxRefs.push(entry.matins.psalmLxx);
        if (entry.qidase?.sets) {
          for (const s of entry.qidase.sets) {
            if (s.psalmLxx) lxxRefs.push(s.psalmLxx);
          }
        }
        for (const r of lxxRefs) {
          totalRefs++;
          const mtRef = window.convertLxxPsalmRefToMt(r, app.getMtFromLxx);
          const m = mtRef.match(/^Psalms\s+(\d+):(\d+)(?:-(\d+))?$/);
          expect(m, `Failed to parse MT ref ${mtRef} on ${dayKey}`).toBeTruthy();
          const ch = parseInt(m[1], 10);
          const start = parseInt(m[2], 10);
          const end = m[3] ? parseInt(m[3], 10) : start;
          const found = app.findTypicalPsalm('Psalms', ch, start, end);
          expect(found, `Uncovered lectionary Psalm ${r} (${mtRef}) on ${dayKey}`).toBeTruthy();
          if (found) coveredRefs++;
        }
      }

      expect(totalRefs).toBe(490);
      expect(coveredRefs).toBe(490);
    });

    it('disambiguates distinct Misbak chants that share the same verse range (e.g. Psalms 51:11-12 & Psalms 139:7-8)', () => {
      const shared51 = window.TYPICAL_PSALMS.filter(p => p.mc === 51 && p.ms === 11 && p.me === 12);
      expect(shared51.length).toBeGreaterThanOrEqual(2);
      const [first51, second51] = shared51;
      expect(first51.id).not.toBe(second51.id);
      expect(first51.g).not.toBe(second51.g);

      // Default lookup without preferred id returns first match
      app.setSelectedTypicalPsalmId('psalm', null);
      expect(app.findTypicalPsalm('Psalms', 51, 11, 12, 'psalm')?.id).toBe(first51.id);

      // Selecting the second chant preserves its exact id & Ge'ez text
      app.setSelectedTypicalPsalmId('psalm', second51.id);
      const picked = app.findTypicalPsalm('Psalms', 51, 11, 12, 'psalm');
      expect(picked?.id).toBe(second51.id);
      expect(picked?.g).toBe(second51.g);

      // URL state round-trip preserves selectedTypicalPsalmIds
      const urlState = app.buildUrlStateObject();
      expect(urlState.tpi?.psalm).toBe(second51.id);

      // Clearing resets back to default
      app.setSelectedTypicalPsalmId('psalm', null);
      expect(app.findTypicalPsalm('Psalms', 51, 11, 12, 'psalm')?.id).toBe(first51.id);
    });

    it('filters Typical Psalms modal instantaneously by phonetic incipit, Ge\'ez homophones, LXX/OSB ref, Ge\'ez numerals, and KJV ref', () => {
      let chosenIdx = -1;
      app.openTypicalPsalmsModal((idx) => { chosenIdx = idx; });

      const searchInput = document.getElementById('typical-psalms-search-input');
      const countEl = document.getElementById('typical-psalms-results-count');
      const listEl = document.getElementById('typical-psalms-list');
      expect(searchInput).toBeTruthy();
      expect(countEl?.textContent).toContain(`${window.TYPICAL_PSALMS.length}`);
      expect(listEl?.querySelectorAll('.typical-psalm-option').length).toBe(window.TYPICAL_PSALMS.length);

      // 1. Filter by phonetic incipit
      searchInput.value = 'Menfesike Qidus';
      searchInput.dispatchEvent(new window.Event('input', { bubbles: true }));
      const phonMatches = listEl.querySelectorAll('.typical-psalm-option');
      expect(phonMatches.length).toBeGreaterThanOrEqual(1);
      expect(phonMatches.length).toBeLessThan(10);
      expect(countEl.textContent).toContain('Showing');

      // 2. Filter by Ge'ez script (with homophone tolerance: አድህነኒ -> አድኅነኒ)
      searchInput.value = 'አድህነኒ እምእለ';
      searchInput.dispatchEvent(new window.Event('input', { bubbles: true }));
      const geezMatches = listEl.querySelectorAll('.typical-psalm-option');
      expect(geezMatches.length).toBeGreaterThanOrEqual(1);
      expect(geezMatches[0].textContent).toContain('142:6-7 KJV');

      // 3. Filter by LXX/OSB reference & Ge'ez numeral
      expect(app.filterTypicalPsalms('141:6').some(r => r.item.lc === 141 && r.item.ls === 6)).toBe(true);
      expect(app.filterTypicalPsalms('፵፬:፱').some(r => r.item.lc === 44 && r.item.ls === 9)).toBe(true);
      expect(app.filterTypicalPsalms('Psalm 45:9').some(r => r.item.mc === 45 && r.item.ms === 9)).toBe(true);

      // Clicking a filtered option passes its true TYPICAL_PSALMS index to the callback
      geezMatches[0].click();
      expect(chosenIdx).toBeGreaterThanOrEqual(0);
      expect(window.TYPICAL_PSALMS[chosenIdx].mc).toBe(142);
    });
  });

  describe('2013/14 Patriarchate Gitsawe Engine, Canonical Fasting & Scroll/Slides Parish Toggles', () => {
    it('ships complete 2013/14 Fixed Daily (366 days), Seasonal Sundays (66 sections), and Nineveh + Abiy Tsom/Pascha fasts', () => {
      expect(Object.keys(window.EOTC_GITSAWE_2014_DAILY).length).toBe(366);
      expect(window.EOTC_GITSAWE_2014_SUNDAYS.length).toBe(66);
      expect(window.EOTC_GITSAWE_2014_FASTS.nineveh.days.length).toBe(3);
      expect(window.EOTC_GITSAWE_2014_FASTS.abiyTsom.days.length).toBe(53);
    });

    it('evaluates all 7 canonical EOTC fasts (ሰባቱ አጽዋማት), 50-day Paschal fast-free season, and Genna/Timket Wed/Fri overrides', () => {
      const bh = window.computeEotcBahireHasab(2018);
      expect(bh.moveableDates.nineveh).toEqual({ year: 2018, month: 5, day: 25 });
      expect(bh.moveableDates.abiyTsom).toEqual({ year: 2018, month: 6, day: 9 });
      expect(bh.moveableDates.tinsae).toEqual({ year: 2018, month: 8, day: 4 });
      expect(bh.moveableDates.paraclete).toEqual({ year: 2018, month: 9, day: 23 });

      // 1. Fast of Nineveh (Yekatit 25, 2018)
      const ninevehDay1 = window.getEotcFastingStatus(2018, 5, 25);
      expect(ninevehDay1.isFastingDay).toBe(true);
      expect(ninevehDay1.primaryFast?.id).toBe('tsome_nenewe');
      expect(ninevehDay1.specialFastId).toBe('nineveh');

      // 2. Great Lent & Holy Week (Miyazia 1, 2018 = Holy Wednesday)
      const holyWed = window.getEotcFastingStatus(2018, 8, 1);
      expect(holyWed.isFastingDay).toBe(true);
      expect(holyWed.primaryFast?.id).toBe('semone_himamat');

      // 3. 50-Day Paschal Fast-Free Season (Miyazia 7, 2018 = Bright Wednesday -> NOT a fasting day!)
      const brightWed = window.getEotcFastingStatus(2018, 8, 7);
      expect(brightWed.isFastFreeSeason).toBe(true);
      expect(brightWed.isFastingDay).toBe(false);

      // 4. Fast of the Apostles (Ginbot 24, 2018 = Monday after Pentecost)
      const apostlesDay1 = window.getEotcFastingStatus(2018, 9, 24);
      expect(apostlesDay1.isFastingDay).toBe(true);
      expect(apostlesDay1.primaryFast?.id).toBe('tsome_hawariyat');

      // 5. Fast of the Assumption / Filseta (Nehasse 7, 2018)
      const filsetaDay = window.getEotcFastingStatus(2018, 12, 7);
      expect(filsetaDay.isFastingDay).toBe(true);
      expect(filsetaDay.primaryFast?.id).toBe('tsome_filseta');

      // 6. Fast of the Prophets / Advent + Paramony Gahad (Tahsas 28, 2018 -> Eve of Genna)
      const gahadGenna = window.getEotcFastingStatus(2018, 4, 28);
      expect(gahadGenna.isFastingDay).toBe(true);
      expect(gahadGenna.activeFasts.map(f => f.id)).toEqual(expect.arrayContaining(['tsome_nebiyat', 'tsome_gahad']));

      // 7. Genna (Tahsas 29) & Timket (Tir 11) are Fast-Free even if falling on Wednesday/Friday
      const timketFri = window.getEotcFastingStatus(2018, 5, 11, 5);
      expect(timketFri.isFastFreeSeason).toBe(true);
      expect(timketFri.isFastingDay).toBe(false);

      // 8. Ordinary Wednesday outside Paschal season -> Weekly Fast of Salvation (ጾመ ድኅነት)
      const ordWed = window.getEotcFastingStatus(2018, 2, 4, 3);
      expect(ordWed.isFastingDay).toBe(true);
      expect(ordWed.primaryFast?.id).toBe('tsome_dihnet');
    });

    it('surfaces Zemene Tsige Tach Bet / Lay Bet Sunday Mezmur toggles, Pentecost -> Tinsae rubric, and Pascha Qidase', () => {
      // Tikimt 15, 2019 E.C. is a Sunday in Zemene Tsige (3rd Sunday of Tsige -> offers Tach Bet Tsige 2 & Lay Bet Tsige 4 + Daily!)
      const tsigeSun = ethToGregDate(2019, 2, 15, { forWazemaEvening: false, hours: 8, minutes: 0 });
      app.setCustomDateTimeOverride(tsigeSun);
      const tsigeProfiles = app.getActiveKidaseProfilesForDate();
      const labels = tsigeProfiles.map(p => p.shortLabel);
      expect(labels[0]).toBe('Sunday (Tsige 3)');
      expect(labels).toContain('Tach Bet (Tsige 2)');
      expect(labels).toContain('Lay Bet (Tsige 4)');
      expect(labels).toContain('Daily (Tikimt 15)');

      // Pentecost Sunday (Ginbot 23, 2018 E.C.) -> automatically resolves empty 8th Sunday liturgy to Tinsae Resurrection Qidase!
      const pentecostProfiles = window.getEotcKidaseProfilesForDate(2018, 9, 23, 0, (lxx) => window.convertLxxPsalmRefToMt(lxx, app.getMtFromLxx));
      expect(pentecostProfiles[0].id).toBe('sunday-pentecost-tinsae');
      expect(pentecostProfiles[0].refs.pauline).toBe('1 Corinthians 15:20-41');
      expect(pentecostProfiles[0].refs.gospel).toBe('John 20:1-19');

      // Zewerede (1st Sunday of Great Lent, Yekatit 8, 2018 E.C., dayOffset = -1 before Monday of Lent!)
      const zeweredeProfiles = window.getEotcKidaseProfilesForDate(2018, 6, 8, 0, (lxx) => window.convertLxxPsalmRefToMt(lxx, app.getMtFromLxx));
      expect(zeweredeProfiles[0].shortLabel).toBe('Zewerede (1st Lent)');
      expect(zeweredeProfiles[0].category).toBe('fast');
    });

    it('keeps 1938 continuous Bible Reading Plan on Pray tab while serving 2013/14 Gitsawe + Scroll & Slides toggles on Liturgy tab', async () => {
      loadBrowserScriptIntoWindow('app/src/main/assets/js/kidase.js');
      await window.WeahaduBibleService.fetchBook('en-kjv', 'Matthew');
      await window.WeahaduBibleService.fetchBook('en-kjv', 'John');
      await window.WeahaduBibleService.fetchBook('en-kjv', '1 Timothy');
      await window.WeahaduBibleService.fetchBook('en-kjv', '1 Corinthians');
      await window.WeahaduBibleService.fetchBook('en-kjv', 'Psalms');

      // 1a. Ordinary day (Meskerem 18, 2019 E.C.) on Pray Tab -> continuous 1938 Bible Reading Plan (Genesis + Acts)!
      const meskerem18Morning = ethToGregDate(2019, 1, 18, { forWazemaEvening: false, hours: 8, minutes: 0 });
      app.setCustomDateTimeOverride(meskerem18Morning, { render: false });
      app.setDailyLectionaryPeriod('morning', { render: false });
      const ordPrayCalls = [];
      app.renderDailyLectionarySection((title, isCollapsible, meta) => ordPrayCalls.push({ title, meta }));
      const ordPrayTitles = ordPrayCalls.map(c => c.title).join(' | ');
      expect(ordPrayTitles).toContain('Genesis');
      expect(ordPrayTitles).toContain('Acts');

      // 1b. Meskerem 17, 2019 E.C. (Sunday Meskel) at 8:00 AM -> Pray Tab uses 1938 Matins (Psalm 84:6-7 / Matthew 5:1-17)
      // while Liturgy Tab uses 2013/14 Patriarchate Gitsawe (Psalms 60:4-5 / John 3:14-22 & Matthew 8:16-28)!
      const meskelMorning = ethToGregDate(2019, 1, 17, { forWazemaEvening: false, hours: 8, minutes: 0 });
      app.setCustomDateTimeOverride(meskelMorning, { render: false });

      const prayCalls = [];
      app.renderDailyLectionarySection((title, isCollapsible, meta) => prayCalls.push({ title, meta }));
      const prayTitles = prayCalls.map(c => c.title).join(' | ');
      expect(prayTitles).toContain('Psalm 84:6-7');
      expect(prayTitles).toContain('Matthew 5:1-17');

      // 2. Liturgy Tab in Scroll Mode renders Parish Lectionary pills on reading cards & Right Sidebar
      app.switchPrimaryTab('liturgy');
      app._renderPrayersSync();

      const sidebarPill = document.querySelector('#kidase-reading-set-container .lectionary-set-pill');
      expect(sidebarPill).toBeTruthy();
      expect(sidebarPill.textContent).toContain('Meskel (2014)');
      expect(sidebarPill.textContent).toContain('Alternate (ዓዲ)');
      expect(sidebarPill.textContent).toContain('Sunday (Meskel Sunday)');

      const gospelOpeningCard = document.querySelector('.prayer-card[data-reading-type="gospel"]');
      expect(gospelOpeningCard).toBeTruthy();
      expect(gospelOpeningCard.querySelector('.lectionary-set-pill')).toBeTruthy();
      expect(gospelOpeningCard.textContent).toContain('Matthew 8:16-28');

      // Multi-verse Gospel cards (verses 2..N) also carry compact .slide-only-lectionary-pill-wrap for Slides Mode!
      const allGospelVerseCards = document.querySelectorAll('.prayer-card[data-reading-slot="gospel"]');
      expect(allGospelVerseCards.length).toBeGreaterThan(3);
      expect(allGospelVerseCards[2].querySelector('.slide-only-lectionary-pill-wrap .lectionary-set-pill')).toBeTruthy();

      // 3. Enter Slides Mode on Gospel, advance to Verse 3, and click "Alternate (ዓዲ)" right from Verse 3's slide pill!
      app.togglePresentationMode({ readingType: 'gospel' });
      expect(app.getDisplayOptions().presentationMode).toBe('slides');
      app.nextSlide();
      app.nextSlide(); // Now on Verse 3 of Gospel (data-reading-slot="gospel", without data-reading-type!)

      const slidesNow = document.querySelectorAll('#prayer-display .prayer-card, #prayer-display .section-title.collapsible');
      const verse3Slide = slidesNow[app.getActiveLectionaryReadingsSnapshot().currentSlideIndex];
      expect(verse3Slide.dataset.readingSlot).toBe('gospel');
      expect(verse3Slide.dataset.readingType).toBeUndefined();

      const altBtnOnVerse3 = Array.from(verse3Slide.querySelectorAll('.lectionary-set-pill-btn'))
        .find(b => b.textContent === 'Alternate (ዓዲ)');
      expect(altBtnOnVerse3).toBeTruthy();
      altBtnOnVerse3.click();
      // Wait for async renderPrayers() DOM rebuild triggered by pill click
      await new Promise(resolve => setTimeout(resolve, 150));

      // Verify Slides Mode switched to John 19:25-28 AND stayed anchored on the Gospel opening slide!
      const snapAfter = app.getActiveLectionaryReadingsSnapshot();
      expect(snapAfter.selectedKidaseReadingSetIndex).toBe(1);
      expect(snapAfter.kidaseLectionaryRefs.gospel).toBe('John 19:25-28');

      const slidesAfter = document.querySelectorAll('#prayer-display .prayer-card, #prayer-display .section-title.collapsible');
      const activeSlideAfter = slidesAfter[snapAfter.currentSlideIndex];
      expect(activeSlideAfter.dataset.readingType).toBe('gospel');
      expect(activeSlideAfter.textContent).toContain('John 19:25-28');

      // Clean up presentation mode back to scroll
      app.togglePresentationMode();
    }, 30000);
  });
});
