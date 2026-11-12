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
    `if (typeof songs !== 'undefined') { window.songs = songs; globalThis.songs = songs; }\n`
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

    it('maps Anaphora 4 (St. Mary) to "mary" and defaults all other 13 Anaphoras (and null) to "apostles"', () => {
      expect(window.resolveAppAnaphoraKey(4)).toBe('mary');
      expect(window.resolveAppAnaphoraKey(1)).toBe('apostles');
      expect(window.resolveAppAnaphoraKey(null)).toBe('apostles');
      for (const id of [2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]) {
        expect(window.resolveAppAnaphoraKey(id)).toBe('apostles');
      }
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
      // Saturday, Sep 26, 2026 at 5:59 PM -> still Saturday (Meskerem 16 = 1/16, A-4 Mary)
      const satBefore6pm = new Date(2026, 8, 26, 17, 59, 0);
      app.setCustomDateTimeOverride(satBefore6pm);

      const ethBefore = app.computeEthiopianDate(app.getEffectiveDate());
      expect(ethBefore.ethMonth).toBe(1);
      expect(ethBefore.ethDay).toBe(16);
      expect(ethBefore.isWazemaEvening).toBe(false);

      let snap = app.getActiveLectionaryReadingsSnapshot();
      expect(snap.selectedAnaphora).toBe('mary'); // 1/16 is A-4!

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
      expect(snap.kidaseLectionaryRefs.morningPsalm).toBe('Psalms 84:6-7');
      expect(snap.kidaseLectionaryRefs.morningGospel).toBe('Matthew 5:1-17');
      expect(snap.kidaseLectionaryRefs.pauline).toBe('1 Timothy 5:9-16');
      expect(snap.kidaseLectionaryRefs.gospel).toBe('Matthew 8:16-28');
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
    it('keeps default Matins Misbak/Gospel on ordinary days (e.g. 1/3)', () => {
      const greg = ethToGregDate(2019, 1, 3, { forWazemaEvening: false, hours: 7, minutes: 30 });
      app.setCustomDateTimeOverride(greg);

      const snap = app.getActiveLectionaryReadingsSnapshot();
      expect(snap.kidaseLectionaryRefs.morningPsalm).toBe('Psalms 34:7-8');
      expect(snap.kidaseLectionaryRefs.morningGospel).toBe('Matthew 24:30-36');
      expect(snap.kidaseLectionaryRefs.pauline).toBe('2 Thessalonians 3:13-End');
    });

    it('switches Qidase reading sets cleanly on multi-reading feast days (e.g. 1/17 Meskel & 2/6)', () => {
      const meskelGreg = ethToGregDate(2019, 1, 17, { forWazemaEvening: false, hours: 8, minutes: 0 });
      app.setCustomDateTimeOverride(meskelGreg);

      let snap = app.getActiveLectionaryReadingsSnapshot();
      expect(snap.kidaseLectionaryRefs.psalm).toBe('Psalms 60:3-5');
      expect(snap.kidaseLectionaryRefs.gospel).toBe('Matthew 8:16-28');

      // Switch to Set 2 on Meskel (1/17)
      app.selectKidaseReadingSet(1);
      snap = app.getActiveLectionaryReadingsSnapshot();
      expect(snap.selectedKidaseReadingSetIndex).toBe(1);
      expect(snap.kidaseLectionaryRefs.psalm).toBe('Psalms 32:6-7');
      expect(snap.kidaseLectionaryRefs.gospel).toBe('John 19:25-28');

      // Check 3-set day (Tikimt 6 = 2/6)
      const tikimt6Greg = ethToGregDate(2019, 2, 6, { forWazemaEvening: false, hours: 8, minutes: 0 });
      app.setCustomDateTimeOverride(tikimt6Greg);
      app.selectKidaseReadingSet(2);
      snap = app.getActiveLectionaryReadingsSnapshot();
      expect(snap.selectedKidaseReadingSetIndex).toBe(2);
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
    });

    it('renders Morning/Sunset Daily Readings with 5 PM auto-switch, pill toggle, day arrows, Ge\'ez year, Feast subtitle, and Se\'atat-style subsection titles', () => {
      const toggleLabel = document.querySelector('#show-daily-lectionary-toggle')?.parentElement?.textContent || '';
      expect(toggleLabel).toContain('Daily Readings | ምንባባት ዘለለዕለቱ');
      expect(toggleLabel).not.toContain('ዘየዕለቱ');

      // 1. Before 5:00 PM (8:00 AM on Meskerem 1, 2019 ዓ.ም. — Feast of Ethiopian New Year / St. John the Baptist)
      const meskerem1Morning = ethToGregDate(2019, 1, 1, { forWazemaEvening: false, hours: 8, minutes: 0 });
      app.setCustomDateTimeOverride(meskerem1Morning);
      app.setDailyLectionaryPeriod(null, { render: false });
      app.stepDailyLectionaryDayOffset(0, { reset: true, render: false });

      expect(app.getEffectiveDailyLectionaryPeriod()).toBe('morning');
      const morningCalls = [];
      app.renderDailyLectionarySection((title, isCollapsible, meta) => morningCalls.push({ title, isCollapsible, meta }));

      expect(morningCalls[0].title).toBe('Morning Readings | ምንባባት ዘነግህ');
      expect(morningCalls[0].meta.date).toBe('Meskerem 1, 2019 ዓ.ም. | መስከረም ፩፣ ፳፻፲፱ ዓ.ም.');
      expect(morningCalls[0].meta.feast).toContain('New Year');
      expect(morningCalls[0].meta.customElement).toBeTruthy();

      const morningTitles = morningCalls.map(c => c.title);
      expect(morningTitles).toContain('→ Matins - Psalm 65:11 | ምስባክ ዘነግህ');
      expect(morningTitles).toContain('→ Matins - Luke 4:16-23 | ወንጌል ዘነግህ');
      expect(morningTitles.some(t => t.includes('ዘሠርክ'))).toBe(false);

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
});
