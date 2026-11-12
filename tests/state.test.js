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

    it('produces distinct non-colliding slugs for parent::child composite keys', () => {
      const matinsParent = '<i>Matins</i> — Morning Prayer | ጸሎተ ነግህ';
      const matinsGospel = '<i>Matins</i> — Morning Prayer | ጸሎተ ነግህ::→ Prayer of the Gospel | ጸሎተ ወንጌል';
      const matinsKidan = '<i>Matins</i> — Morning Prayer | ጸሎተ ነግህ::→ <i>Kidan</i> — Prayer of the Covenant | ጸሎተ ኪዳን';
      expect(app.slugifyTitle(matinsParent)).not.toBe(app.slugifyTitle(matinsGospel));
      expect(app.slugifyTitle(matinsParent)).not.toBe(app.slugifyTitle(matinsKidan));
      expect(app.slugifyTitle(matinsGospel)).not.toBe(app.slugifyTitle(matinsKidan));

      const kidaseParent = '<i>Ḳidasé</i> — Liturgy | ቅዳሴ';
      const kidaseOrder = '<i>Ḳidasé</i> — Liturgy | ቅዳሴ::→ Order of the Liturgy | ሥርዓተ ቅዳሴ';
      const kidaseApostles = '<i>Ḳidasé</i> — Liturgy | ቅዳሴ::→ Anaphora of the Apostles | ቅዳሴ ሐዋርያት';
      expect(app.slugifyTitle(kidaseParent)).not.toBe(app.slugifyTitle(kidaseOrder));
      expect(app.slugifyTitle(kidaseParent)).not.toBe(app.slugifyTitle(kidaseApostles));
      expect(app.slugifyTitle(kidaseOrder)).not.toBe(app.slugifyTitle(kidaseApostles));
    });
  });

  describe('Pray & Liturgy Tab Default Profiles & Re-click Reset Behavior', () => {
    it('collapses all top-level and nested sections by default on the Liturgy tab', () => {
      const litProfile = app.getLiturgyTabDefaultProfile();
      expect(litProfile.areAllSectionsCollapsed).toBe(true);
      expect(litProfile.selectedProphetSongs).toHaveLength(15);
      expect(litProfile.selectedProphetSongs[0]).toBe('firstSongOfMoses');
      const cs = litProfile.collapsedSections;

      // All top-level and nested sections collapsed by default
      expect(cs['Daily Prayer | ዘዘወትር ጸሎት']).toBe(true);
      expect(cs['<i>Vespers</i> — Sunset Prayer | ጸሎተ ሠርክ']).toBe(true);
      expect(cs['Songs of the Prophets | መኃልየ ነቢያት']).toBe(true);
      expect(cs["<i>Se'atat</i> Readings | ምንባባተ ሰዓታት"]).toBe(true);
      expect(cs['Pre-Liturgy Psalms | መዝሙር ዘዳዊት ዘቅድመ ቅዳሴ']).toBe(true);

      expect(cs['<i>Matins</i> — Morning Prayer | ጸሎተ ነግህ']).toBe(true);
      expect(cs['<i>Matins</i> — Morning Prayer | ጸሎተ ነግህ::→ Prayer of the Gospel | ጸሎተ ወንጌል']).toBe(true);
      expect(cs['<i>Matins</i> — Morning Prayer | ጸሎተ ነግህ::→ <i>Kidan</i> — Prayer of the Covenant | ጸሎተ ኪዳን']).toBe(true);

      expect(cs['<i>Ḳidasé</i> — Liturgy | ቅዳሴ']).toBe(true);
      expect(cs['<i>Ḳidasé</i> — Liturgy | ቅዳሴ::→ Order of the Liturgy | ሥርዓተ ቅዳሴ']).toBe(true);
      expect(cs['<i>Ḳidasé</i> — Liturgy | ቅዳሴ::→ Anaphora of the Apostles | ቅዳሴ ሐዋርያት']).toBe(true);
      expect(cs['<i>Ḳidasé</i> — Liturgy | ቅዳሴ::→ Anaphora of Mary | ቅዳሴ ማርያም']).toBe(true);
    });

    it('preserves Pray tab collapsed state when switching from Liturgy to Pray and when re-clicking Pray or Liturgy', () => {
      // 1. Apply Pray tab default profile
      const prayDefault = app.getPrayTabDefaultProfile();
      app.applyTabProfile(prayDefault);
      let snap = app.getActiveLectionaryReadingsSnapshot();
      expect(snap.areAllSectionsCollapsed).toBe(true);
      expect(snap.isKidaseModeActive).toBe(false);
      expect(snap.selectedPsalms).toEqual([50]);
      expect(app.getActivePrayerViewPresetSummary()).toBe('Preset for Prayer: Daily Prayer, Theotokia, Psalter, Readings');

      // 2. Switch to Liturgy tab
      app.switchPrimaryTab('liturgy');
      snap = app.getActiveLectionaryReadingsSnapshot();
      expect(snap.activePrimaryTab).toBe('liturgy');
      expect(snap.areAllSectionsCollapsed).toBe(true);
      expect(snap.isKidaseModeActive).toBe(true);
      expect(snap.showPrepPsalms).toBe(true);
      expect(snap.showVespers).toBe(true);
      expect(snap.showMatins).toBe(true);
      expect(snap.showSeatatReadings).toBe(true);
      expect(snap.collapsedSections['Daily Prayer | ዘዘወትር ጸሎት']).toBe(true);
      expect(snap.collapsedSections['<i>Vespers</i> — Sunset Prayer | ጸሎተ ሠርክ']).toBe(true);
      expect(snap.collapsedSections['<i>Matins</i> — Morning Prayer | ጸሎተ ነግህ']).toBe(true);
      expect(snap.collapsedSections['<i>Ḳidasé</i> — Liturgy | ቅዳሴ']).toBe(true);

      // 3. Switch back to Pray tab -> must remain collapsed (not overwritten by Liturgy DOM)
      app.switchPrimaryTab('pray');
      snap = app.getActiveLectionaryReadingsSnapshot();
      expect(snap.activePrimaryTab).toBe('pray');
      expect(snap.areAllSectionsCollapsed).toBe(true);
      expect(snap.isKidaseModeActive).toBe(false);
      expect(snap.selectedPsalms).toEqual([50]);

      // 4. Re-click Pray tab while already on Pray tab -> resets to Pray defaults
      app.switchPrimaryTab('pray');
      snap = app.getActiveLectionaryReadingsSnapshot();
      expect(snap.activePrimaryTab).toBe( 'pray');
      expect(snap.areAllSectionsCollapsed).toBe(true);
      expect(snap.collapsedSections).toEqual({});

      // 5. Switch to Liturgy and re-click Liturgy -> resets to Liturgy defaults (all collapsed)
      app.switchPrimaryTab('liturgy');
      app.switchPrimaryTab('liturgy');
      snap = app.getActiveLectionaryReadingsSnapshot();
      expect(snap.activePrimaryTab).toBe('liturgy');
      expect(snap.areAllSectionsCollapsed).toBe(true);
      expect(snap.collapsedSections['Daily Prayer | ዘዘወትር ጸሎት']).toBe(true);
      expect(snap.collapsedSections['<i>Matins</i> — Morning Prayer | ጸሎተ ነግህ']).toBe(true);
      expect(snap.collapsedSections['<i>Matins</i> — Morning Prayer | ጸሎተ ነግህ::→ Prayer of the Gospel | ጸሎተ ወንጌል']).toBe(true);
      expect(snap.collapsedSections['<i>Ḳidasé</i> — Liturgy | ቅዳሴ']).toBe(true);
      expect(snap.collapsedSections['<i>Ḳidasé</i> — Liturgy | ቅዳሴ::→ Order of the Liturgy | ሥርዓተ ቅዳሴ']).toBe(true);
    });

    it('renders exact DOM collapse states on Pray & Liturgy tabs and resets cleanly when re-clicking active tabs', async () => {
      const fs = await import('fs');
      const path = await import('path');
      for (const file of ['prayers.js', 'songs.js', 'kidase.js']) {
        const filePath = path.resolve(process.cwd(), 'app/src/main/assets/js', file);
        const raw = fs.readFileSync(filePath, 'utf8');
        new Function('window', raw + '\nif (typeof prayers !== "undefined") window.prayers = prayers; if (typeof prophetSongs !== "undefined") window.prophetSongs = prophetSongs; if (typeof songs !== "undefined") window.songs = songs; if (typeof SEATAT_LECTIONARY_DATA !== "undefined") window.SEATAT_LECTIONARY_DATA = SEATAT_LECTIONARY_DATA; if (typeof kidaseData !== "undefined") window.kidaseData = kidaseData;')(window);
      }

      await app.loadSettings();

      // 1. Verify initial Pray tab DOM
      app.switchPrimaryTab('pray');
      app._renderPrayersSync();
      const prayerDisplay = document.getElementById('prayer-display');
      let prayHeaders = Array.from(prayerDisplay.querySelectorAll('.section-title.collapsible'));
      expect(prayHeaders.length).toBeGreaterThan(0);
      expect(prayHeaders.every(h => h.classList.contains('collapsed'))).toBe(true);

      // Verify Daily Prayer sneak-peek card and expand button exist on Pray tab
      const sneakPeekCard = prayerDisplay.querySelector('.daily-prayer-sneak-peek-card');
      const expandPreviewBtn = prayerDisplay.querySelector('.expand-daily-prayer-preview-btn');
      expect(sneakPeekCard).toBeTruthy();
      expect(expandPreviewBtn).toBeTruthy();

      // 2. Expand Daily Prayer and Praise of Mary on Pray tab, then re-click Pray tab
      prayHeaders[0].click();
      expect(prayHeaders[0].classList.contains('collapsed')).toBe(false);
      if (prayHeaders[1]) {
        prayHeaders[1].click();
        expect(prayHeaders[1].classList.contains('collapsed')).toBe(false);
      }

      // Re-click Pray tab -> all collapsible headers must return to collapsed
      app.switchPrimaryTab('pray');
      app._renderPrayersSync();
      prayHeaders = Array.from(prayerDisplay.querySelectorAll('.section-title.collapsible'));
      expect(prayHeaders.every(h => h.classList.contains('collapsed'))).toBe(true);

      // 3. Switch to Liturgy tab -> verify all sections (including Matins & Kidase) are collapsed by default
      app.switchPrimaryTab('liturgy');
      app._renderPrayersSync();
      const getHeader = (stateKey) => prayerDisplay.querySelector(`.section-title[data-state-key="${CSS.escape(stateKey)}"]`);

      const dailyHdr = getHeader('Daily Prayer | ዘዘወትር ጸሎት');
      const vespersHdr = getHeader('<i>Vespers</i> — Sunset Prayer | ጸሎተ ሠርክ');
      const prophetsHdr = getHeader('Songs of the Prophets | መኃልየ ነቢያት');
      const seatatHdr = getHeader("<i>Se'atat</i> Readings | ምንባባተ ሰዓታት");
      const matinsHdr = getHeader('<i>Matins</i> — Morning Prayer | ጸሎተ ነግህ');
      const matinsGospelHdr = getHeader('<i>Matins</i> — Morning Prayer | ጸሎተ ነግህ::→ Prayer of the Gospel | ጸሎተ ወንጌል');
      const matinsKidanHdr = getHeader('<i>Matins</i> — Morning Prayer | ጸሎተ ነግህ::→ <i>Kidan</i> — Prayer of the Covenant | ጸሎተ ኪዳን');
      const kidaseHdr = getHeader('<i>Ḳidasé</i> — Liturgy | ቅዳሴ');
      const kidaseOrderHdr = getHeader('<i>Ḳidasé</i> — Liturgy | ቅዳሴ::→ Order of the Liturgy | ሥርዓተ ቅዳሴ');
      const kidaseAnaphoraHdr = getHeader('<i>Ḳidasé</i> — Liturgy | ቅዳሴ::→ Anaphora of the Apostles | ቅዳሴ ሐዋርያት');

      expect(dailyHdr?.classList.contains('collapsed')).toBe(true);
      expect(vespersHdr?.classList.contains('collapsed')).toBe(true);
      expect(prophetsHdr?.classList.contains('collapsed')).toBe(true);
      expect(seatatHdr?.classList.contains('collapsed')).toBe(true);

      // Verify Holy Trinity icon is hidden when Daily Prayer is collapsed on Liturgy tab
      const trinityIcon = prayerDisplay.querySelector('.holy-trinity-icon');
      expect(trinityIcon).toBeTruthy();
      expect(trinityIcon.style.display).toBe('none');

      // Simulate inline lectionary pickers being created & refreshed (as happens when Bible data finishes loading)
      const inlinePicker = document.createElement('div');
      inlinePicker.classList.add('card-inline-lectionary-picker');
      prayerDisplay.appendChild(inlinePicker);
      app.createLectionaryPicker(inlinePicker, 'morningPsalm', ['Psalms']);
      app.refreshLectionaryPickers();
      app._renderPrayersSync();

      // Daily Prayer and Holy Trinity icon MUST remain collapsed/hidden after inline lectionary picker sync
      expect(getHeader('Daily Prayer | ዘዘወትር ጸሎት')?.classList.contains('collapsed')).toBe(true);
      expect(prayerDisplay.querySelector('.holy-trinity-icon')?.style.display).toBe('none');

      // Matins & Kidase and their sub-sections are all collapsed and hidden under collapsed parents
      expect(matinsHdr?.classList.contains('collapsed')).toBe(true);
      expect(matinsGospelHdr?.classList.contains('collapsed')).toBe(true);
      expect(matinsGospelHdr?.style.display).toBe('none');
      expect(matinsKidanHdr?.classList.contains('collapsed')).toBe(true);
      expect(matinsKidanHdr?.style.display).toBe('none');

      expect(kidaseHdr?.classList.contains('collapsed')).toBe(true);
      expect(kidaseOrderHdr?.classList.contains('collapsed')).toBe(true);
      expect(kidaseOrderHdr?.style.display).toBe('none');
      expect(kidaseAnaphoraHdr?.classList.contains('collapsed')).toBe(true);
      expect(kidaseAnaphoraHdr?.style.display).toBe('none');

      // 4. Modify Liturgy collapse states (expand Daily Prayer and Matins), then re-click Liturgy tab
      const currentDailyHdr = getHeader('Daily Prayer | ዘዘወትር ጸሎት');
      const currentMatinsHdr = getHeader('<i>Matins</i> — Morning Prayer | ጸሎተ ነግህ');
      currentDailyHdr.click();
      currentMatinsHdr.click();
      expect(currentDailyHdr.classList.contains('collapsed')).toBe(false);
      expect(currentMatinsHdr.classList.contains('collapsed')).toBe(false);

      // Re-click Liturgy tab -> resets to exact default Liturgy view (all sections collapsed)
      app.switchPrimaryTab('liturgy');
      app._renderPrayersSync();
      expect(getHeader('Daily Prayer | ዘዘወትር ጸሎት')?.classList.contains('collapsed')).toBe(true);
      expect(prayerDisplay.querySelector('.holy-trinity-icon')?.style.display).toBe('none');
      expect(getHeader('<i>Matins</i> — Morning Prayer | ጸሎተ ነግህ')?.classList.contains('collapsed')).toBe(true);
      expect(getHeader('<i>Matins</i> — Morning Prayer | ጸሎተ ነግህ::→ Prayer of the Gospel | ጸሎተ ወንጌል')?.classList.contains('collapsed')).toBe(true);
      expect(getHeader('<i>Ḳidasé</i> — Liturgy | ቅዳሴ')?.classList.contains('collapsed')).toBe(true);
      expect(getHeader('<i>Ḳidasé</i> — Liturgy | ቅዳሴ::→ Order of the Liturgy | ሥርዓተ ቅዳሴ')?.classList.contains('collapsed')).toBe(true);
    }, 15000);

    it('defers card-inline lectionary dropdown updates until the Go button is clicked and stays on the reading slide in Slides Mode', () => {
      // Use a focused Liturgy profile (Order of the Liturgy only) for fast DOM rendering in Happy-DOM
      app.applyTabProfile({
        ...app.getLiturgyTabDefaultProfile(),
        showDailyPrayer: false,
        showGateOfLight: false,
        showYewediswaMelaekt: false,
        showVespers: false,
        showMatins: false,
        showPrepPsalms: false,
        showSeatatReadings: false,
        showAnaphora: false,
        showSupplications: false,
        selectedPsalms: [],
        selectedProphetSongs: [],
        isKidaseModeActive: true
      });
      app._renderPrayersSync();
      const prayerDisplay = document.getElementById('prayer-display');

      // Find the Pauline Epistle opening slide and the card right before it
      let allSlides = Array.from(prayerDisplay.querySelectorAll('.prayer-card, .section-title.collapsible'));
      let paulineCard = prayerDisplay.querySelector('.prayer-card[data-reading-type="pauline"]');
      expect(paulineCard).toBeTruthy();
      const paulineSlideIdx = allSlides.indexOf(paulineCard);
      expect(paulineSlideIdx).toBeGreaterThan(0);

      // Enter slides mode from the card right before Pauline Epistle
      const prevCard = allSlides[paulineSlideIdx - 1];
      app.togglePresentationMode({
        signature: prevCard.dataset.prayerSignature,
        cardId: prevCard.dataset.cardId,
        prayerIndex: prevCard.dataset.prayerIndex
      });
      expect(app.getActiveLectionaryReadingsSnapshot().presentationMode).toBe('slides');

      // Advance one slide to the Pauline reading slide
      app.nextSlide();
      allSlides = Array.from(prayerDisplay.querySelectorAll('.prayer-card, .section-title.collapsible'));
      paulineCard = prayerDisplay.querySelector('.prayer-card[data-reading-type="pauline"]');
      const activePaulineIdx = allSlides.indexOf(paulineCard);
      expect(app.getActiveLectionaryReadingsSnapshot().currentSlideIndex).toBe(activePaulineIdx);

      const inlinePicker = paulineCard.querySelector('.card-inline-lectionary-picker');
      expect(inlinePicker).toBeTruthy();
      const goBtn = inlinePicker.querySelector('.lectionary-go-btn');
      expect(goBtn).toBeTruthy();
      expect(goBtn.classList.contains('has-pending-changes')).toBe(false);

      const initialRef = app.getActiveLectionaryReadingsSnapshot().kidaseLectionaryRefs.pauline;
      const selects = inlinePicker.querySelectorAll('.lectionary-picker-single-row select');
      expect(selects.length).toBe(4); // Book, Ch, Start, End
      const [bookSel, chSel, startSel, endSel] = selects;

      // Change Book to Galatians -> should NOT re-render or jump slides yet
      bookSel.value = 'Galatians';
      bookSel.dispatchEvent(new Event('change'));
      expect(app.getActiveLectionaryReadingsSnapshot().kidaseLectionaryRefs.pauline).toBe(initialRef);
      expect(app.getActiveLectionaryReadingsSnapshot().currentSlideIndex).toBe(activePaulineIdx);
      expect(goBtn.classList.contains('has-pending-changes')).toBe(true);
      // DOM card was NOT wiped/replaced while user is still configuring dropdowns
      expect(prayerDisplay.contains(paulineCard)).toBe(true);

      // Change Chapter to 2, Start to 1, End to 5 -> still deferred
      chSel.value = '2';
      chSel.dispatchEvent(new Event('change'));
      startSel.value = '1';
      startSel.dispatchEvent(new Event('change'));
      endSel.value = '5';
      endSel.dispatchEvent(new Event('change'));
      expect(app.getActiveLectionaryReadingsSnapshot().kidaseLectionaryRefs.pauline).toBe(initialRef);
      expect(app.getActiveLectionaryReadingsSnapshot().currentSlideIndex).toBe(activePaulineIdx);

      // Now click the Go button -> commits ref, re-renders, and jumps directly to the updated Pauline slide
      goBtn.click();
      app._renderPrayersSync();

      const afterSnap = app.getActiveLectionaryReadingsSnapshot();
      expect(afterSnap.kidaseLectionaryRefs.pauline).toBe('Galatians 2:1-5');

      allSlides = Array.from(prayerDisplay.querySelectorAll('.prayer-card, .section-title.collapsible'));
      const updatedPaulineCard = prayerDisplay.querySelector('.prayer-card[data-reading-type="pauline"]');
      expect(updatedPaulineCard).toBeTruthy();
      const updatedPaulineIdx = allSlides.indexOf(updatedPaulineCard);
      expect(afterSnap.currentSlideIndex).toBe(updatedPaulineIdx);

      // Exit slides mode to restore clean state
      app.togglePresentationMode();
    });
  });
});
