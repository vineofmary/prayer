import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { loadApp } from './helpers/loadApp.js';

const {
  findConfidentClauseSplitIndex,
  containsProfanity: serverContainsProfanity,
  maskProfanity: serverMaskProfanity,
  translateImmutableClause
} = require('../services/targuma-stream/server.js');

describe('Targuma Immutable-Clause Streaming Engine, Sanctuary UI & VAD Suite', () => {
  let targuma;

  beforeAll(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    const miraclesPath = path.resolve(process.cwd(), 'app/src/main/assets/js/miracles_of_mary.js');
    const miraclesCode = fs.readFileSync(miraclesPath, 'utf8');
    window.MIRACLES_OF_MARY = new Function(`${miraclesCode}\nreturn MIRACLES_OF_MARY;`)();

    loadApp();

    const targumaPath = path.resolve(process.cwd(), 'app/src/main/assets/js/targuma_service.js');
    const targumaCode = fs.readFileSync(targumaPath, 'utf8');
    new Function('window', 'document', 'firebase', targumaCode)(window, document, window.firebase);
    targuma = window.targumaService;
  });

  beforeEach(() => {
    targuma.clearAllCaptions();
    targuma.state.sourceLang = 'am';
    targuma.state.targetLang = 'en';
    targuma.state.displayMode = 'target';
    targuma.state.maxLines = 3;
  });

  describe('Dual-Environment Asset Parity', () => {
    it('keeps targuma_service.js, style.css, and service-worker.js 100% identical between Android and Web', () => {
      const androidJs = fs.readFileSync(path.resolve(process.cwd(), 'app/src/main/assets/js/targuma_service.js'), 'utf8');
      const webJs = fs.readFileSync(path.resolve(process.cwd(), 'public/js/targuma_service.js'), 'utf8');
      expect(androidJs).toBe(webJs);

      const androidCss = fs.readFileSync(path.resolve(process.cwd(), 'app/src/main/assets/css/style.css'), 'utf8');
      const webCss = fs.readFileSync(path.resolve(process.cwd(), 'public/css/style.css'), 'utf8');
      expect(androidCss).toBe(webCss);

      const androidSw = fs.readFileSync(path.resolve(process.cwd(), 'app/src/main/assets/service-worker.js'), 'utf8');
      const webSw = fs.readFileSync(path.resolve(process.cwd(), 'public/service-worker.js'), 'utf8');
      expect(androidSw).toBe(webSw);
    });
  });

  describe('16kHz PCM Downsampler & WAV RIFF Encoder', () => {
    it('downsamples 48kHz Float32 audio to 16kHz Int16 PCM accurately with clipping protection', () => {
      const input48k = new Float32Array(480);
      for (let i = 0; i < input48k.length; i++) {
        input48k[i] = i < 240 ? 0.5 : -1.5;
      }
      const pcm16k = targuma.downsampleFloat32ToInt16Pcm(input48k, 48000, 16000);
      expect(pcm16k.length).toBe(160);
      expect(pcm16k[0]).toBeCloseTo(16383, -1);
      expect(pcm16k[159]).toBe(-32768);
    });

    it('encodes Int16 PCM samples into a valid 44-byte RIFF/WAVE 16kHz mono container', () => {
      const samples = new Int16Array([0, 12000, -12000, 32767]);
      const wav = targuma.encodePcm16ToWavBytes(samples, 16000);
      expect(wav.byteLength).toBe(44 + samples.length * 2);

      const ascii = String.fromCharCode(...wav.slice(0, 4)) + String.fromCharCode(...wav.slice(8, 12));
      expect(ascii).toBe('RIFFWAVE');

      const view = new DataView(wav.buffer, wav.byteOffset, wav.byteLength);
      expect(view.getUint16(22, true)).toBe(1);
      expect(view.getUint32(24, true)).toBe(16000);
      expect(view.getUint16(34, true)).toBe(16);
      expect(view.getUint32(40, true)).toBe(8);
    });
  });

  describe('Clause-Level VAD Endpointing & Server Run-On Sentence Clause Splitter', () => {
    it('ignores transient <160ms cough/click bursts and resets cleanly on silence', () => {
      let tracker = { spokenMs: 0, trailingPauseMs: 0, totalMs: 0, sustainedActiveMs: 0 };
      tracker = targuma.evaluateVadEndpointState(tracker, 0.05, 100);
      expect(tracker.shouldFlush).toBe(false);
      tracker = targuma.evaluateVadEndpointState(tracker, 0.001, 300);
      expect(tracker.shouldFlush).toBe(false);
      expect(tracker.totalMs).toBe(0);
    });

    it('flushes cleanly at a 280ms natural breath pause after >=2.0s of speech', () => {
      let tracker = { spokenMs: 0, trailingPauseMs: 0, totalMs: 0, sustainedActiveMs: 0 };
      for (let i = 0; i < 22; i++) {
        tracker = targuma.evaluateVadEndpointState(tracker, 0.04, 100);
        expect(tracker.shouldFlush).toBe(false);
      }
      tracker = targuma.evaluateVadEndpointState(tracker, 0.001, 300);
      expect(tracker.shouldFlush).toBe(true);
      expect(tracker.keepOverlap).toBe(false);
    });

    it('soft-splits continuous rapid speech at 4.6s with keepOverlap=true so boundary words are preserved', () => {
      let tracker = { spokenMs: 0, trailingPauseMs: 0, totalMs: 0, sustainedActiveMs: 0 };
      for (let i = 0; i < 46; i++) {
        tracker = targuma.evaluateVadEndpointState(tracker, 0.04, 100);
      }
      expect(tracker.shouldFlush).toBe(true);
      expect(tracker.keepOverlap).toBe(true);
    });

    it('splits long Amharic run-on sentences cleanly at clause boundaries while guarding right-edge interim words', () => {
      const runOn = 'ዛሬ እመቤታችን የቅድስት ድንግል ማርያም ከልጇ ከወዳጇ ከጌታችን ከአምላካችን ከኢየሱስ ክርስቶስ';
      const idx = findConfidentClauseSplitIndex(runOn, false);
      expect(idx).toBeGreaterThan(0);
      const firstClause = runOn.slice(0, idx).trim();
      const remainder = runOn.slice(idx).trim();
      expect(firstClause).toBe('ዛሬ እመቤታችን የቅድስት ድንግል ማርያም');
      expect(remainder.startsWith('ከልጇ')).toBe(true);
    });
  });

  describe('Immutable Clause-at-a-Time Display & Strict Zero-Flicker Guarantee', () => {
    it('suppresses word-by-word drafts and never mutates a clause once displayed on screen', () => {
      targuma.toggleTargumaMode(true);
      targuma.state.maxLines = 3;

      // Word-by-word draft events must NEVER appear on screen
      targuma.handleStreamingServerEvent({
        type: 'draft',
        segmentId: 'clause_1',
        sourceText: 'ዛሬ የቅዱስ',
        translatedText: 'Today of Saint'
      });

      const listEl = document.getElementById('targuma-captions-list');
      expect(targuma.state.liveDraft).toBeNull();
      expect(listEl.querySelector('.targuma-line-draft')).toBeNull();
      expect(targuma.state.captions.length).toBe(0);

      // Confident clause commit appears once, already polished
      targuma.handleStreamingServerEvent({
        type: 'commit',
        seq: 1,
        segmentId: 'clause_1',
        sourceText: 'ዛሬ የቅዱስ ሚካኤል ዓመታዊ ክብረ በዓል በደብረ ምሕረት ይከበራል።',
        translatedText: 'Today the annual feast of Archangel Saint Michael is celebrated at *Debre Mihret* [Mount of Mercy].',
        polished: true
      });

      expect(targuma.state.captions.length).toBe(1);
      const originalHtml = targuma.state.captions[0].translatedHtml;
      expect(originalHtml).toContain('Debre Mihret');
      expect(originalHtml).toContain('Mount of Mercy');
      expect(originalHtml).toContain('rubric-red');

      // Any subsequent duplicate commit or late polish for clause_1 MUST NOT overwrite the displayed text
      targuma.handleStreamingServerEvent({
        type: 'polish',
        segmentId: 'clause_1',
        sourceText: 'ዛሬ የቅዱስ ሚካኤል ዓመታዊ ክብረ በዓል በደብረ ምሕረት ይከበራል።',
        translatedText: 'Different wording that would confuse the reader.'
      });
      targuma.commitFinalizedCaption(
        'clause_1',
        'ዛሬ የቅዱስ ሚካኤል ዓመታዊ ክብረ በዓል በደብረ ምሕረት ይከበራል።',
        'Another rewrite attempt.'
      );

      expect(targuma.state.captions.length).toBe(1);
      expect(targuma.state.captions[0].translatedHtml).toBe(originalHtml);
    });

    it('keeps 2–3 stacked clauses visible in chronological seq order', () => {
      targuma.commitFinalizedCaption('sse_1', '፩', 'First confident clause.', { seq: 1 });
      targuma.commitFinalizedCaption('sse_3', '፫', 'Third confident clause.', { seq: 3 });
      targuma.commitFinalizedCaption('sse_2', '፪', 'Second confident clause.', { seq: 2 });

      expect(targuma.state.captions.map(c => c.id)).toEqual(['sse_1', 'sse_2', 'sse_3']);
    });
  });

  describe('Clean Sanctuary Toolbar, Hidden Parish Sync & Replay Controls', () => {
    it('does not render Mode & Parish TV Sync controls, moves Caption Size into primary bar, keeps Model picker in drawer with Gemini 3 Flash default, and hides idle status pill', () => {
      targuma.toggleTargumaMode(true);

      // Parish TV Sync must NOT exist in the visible DOM
      expect(document.getElementById('targuma-room-mode-select')).toBeNull();
      expect(document.getElementById('targuma-room-code-input')).toBeNull();
      expect(document.getElementById('targuma-view').textContent).not.toContain('Mode & Parish TV Sync');

      // Title at top of Targuma page
      expect(document.querySelector('.targuma-title-text').textContent).toBe('Targuma: Live Translations');

      // Desktop header BETA badge removed
      const headerTab = document.getElementById('targuma-mode-toggle-header');
      expect(headerTab).not.toBeNull();
      expect(headerTab.querySelector('.nav-beta-badge')).toBeNull();
      const headerTsx = fs.readFileSync(path.resolve(process.cwd(), 'src/components/Header.tsx'), 'utf8');
      expect(headerTsx).not.toContain('nav-beta-badge');

      // Caption Size is in the primary bar, while Model stays in the collapsible settings drawer
      const primaryBar = document.querySelector('.targuma-toolbar-primary');
      const settingsDrawer = document.getElementById('targuma-toolbar-drawer');
      expect(primaryBar.querySelector('#targuma-font-slider')).not.toBeNull();
      expect(settingsDrawer.querySelector('#targuma-font-slider')).toBeNull();
      expect(primaryBar.querySelector('#targuma-model-select')).toBeNull();
      expect(settingsDrawer.querySelector('#targuma-model-select')).not.toBeNull();

      // Default model is Gemini 3 Flash
      expect(targuma.state.geminiModel).toBe('gemini-3-flash-preview');
      expect(document.getElementById('targuma-model-select').value).toBe('gemini-3-flash-preview');

      // Renamed labels and options in settings drawer
      const drawerText = settingsDrawer.textContent;
      expect(drawerText).toContain('Visible Lines');
      expect(drawerText).not.toContain('Visible Clauses');
      expect(Array.from(document.getElementById('targuma-lines-select').options).map(o => o.textContent)).toEqual([
        '2 Lines',
        '3 Lines',
        '4 Lines'
      ]);
      expect(settingsDrawer.querySelector('label[for="targuma-icon-select"]').textContent).toBe('Icon');
      expect(settingsDrawer.querySelector('label[for="targuma-model-select"]').textContent).toBe('Model');

      // Removed wide double icons & renamed Covenant of Mercy
      const iconSelect = document.getElementById('targuma-icon-select');
      const iconValues = Array.from(iconSelect.options).map(o => o.value);
      const iconLabels = Array.from(iconSelect.options).map(o => o.textContent);
      expect(iconValues).not.toContain('ephraim_mary_thursday');
      expect(iconValues).not.toContain('covenant_mercy');
      expect(iconLabels).toContain('Covenant of Mercy');
      expect(iconLabels).not.toContain('Covenant of Mercy with Psalm 44');

      // Idle dynamic instruction pill is hidden and empty
      const statusPill = document.getElementById('targuma-status-pill');
      expect(statusPill.classList.contains('hidden')).toBe(true);
      expect(statusPill.textContent.trim()).toBe('');

      // Empty placeholder has English Psalm attribution and unparenthesized Ge'ez
      const placeholderText = document.querySelector('.targuma-empty-placeholder').textContent.replace(/\s+/g, ' ').trim();
      expect(placeholderText).toContain('“Listen, my daughter, and see, and incline your ear” — Psalm 44:10');
      expect(placeholderText).toContain('ስምዒ ወለትየ ወርእዪ ወአጽምዒ እዝነኪ — መዝ ፵፬፡፲');
      expect(placeholderText).not.toContain('(ስምዒ');

      // Previous lines stay full brightness in CSS
      const css = fs.readFileSync(path.resolve(process.cwd(), 'app/src/main/assets/css/style.css'), 'utf8');
      expect(css).toMatch(/\.targuma-line-previous\s*\{[^}]*opacity:\s*1;/);

      // Status banner appears cleanly during active listening without ms latency
      targuma.state.isListening = true;
      targuma.state.lastLatencyMs = 142;
      targuma.handleStreamingServerEvent({ type: 'ready' });
      expect(statusPill.classList.contains('hidden')).toBe(false);
      expect(statusPill.textContent).toBe('Listening • አማርኛ → English');
      expect(statusPill.textContent).not.toContain('ms');

      targuma.state.isListening = false;
      targuma.toggleTargumaMode(false);
    });

    it('renders Audio Input Source selector with updated option labels and keeps idle pill hidden when switching sources', () => {
      targuma.toggleTargumaMode(true);
      const sourceSelect = document.getElementById('targuma-audio-source-select');
      const replayBar = document.getElementById('targuma-file-replay-bar');
      const micLabel = document.getElementById('targuma-mic-btn-label');
      const statusPill = document.getElementById('targuma-status-pill');

      expect(sourceSelect).not.toBeNull();
      const sourceLabels = Array.from(sourceSelect.options).map(o => o.textContent);
      expect(sourceLabels).toContain('Device Microphone');
      expect(sourceLabels).toContain('Audio / Video File');
      expect(replayBar).not.toBeNull();
      expect(replayBar.classList.contains('hidden')).toBe(true);

      sourceSelect.value = 'file';
      sourceSelect.dispatchEvent(new Event('change'));

      expect(replayBar.classList.contains('hidden')).toBe(false);
      expect(micLabel.textContent).toBe('Start File Replay');
      expect(statusPill.classList.contains('hidden')).toBe(true);
      expect(statusPill.textContent.trim()).toBe('');

      sourceSelect.value = 'microphone';
      sourceSelect.dispatchEvent(new Event('change'));
      expect(replayBar.classList.contains('hidden')).toBe(true);
      expect(statusPill.classList.contains('hidden')).toBe(true);
      targuma.toggleTargumaMode(false);
    });

    it('renders updated Targuma: Live Translated Captions info modal with historical Targum context', () => {
      targuma.toggleTargumaMode(true);
      const modal = document.getElementById('targuma-info-modal');
      expect(modal).not.toBeNull();
      const title = modal.querySelector('h3');
      expect(title.textContent).toBe('Targuma: Live Translated Captions');

      const modalText = modal.textContent;
      expect(modalText).toContain('Targuma bridges the language barrier in our parishes');
      expect(modalText).toContain('Historical Context:');
      expect(modalText).toContain('Targum');
      targuma.toggleTargumaMode(false);
    });
  });

  describe('Miracle of Mary Live Voice Identification', () => {
    beforeEach(() => {
      if (targuma && typeof targuma.stopMiracleLiveIdentification === 'function') {
        targuma.stopMiracleLiveIdentification();
      }
    });

    it('cleanly toggles #miracle-voice-detect-btn label and unhides #miracle-voice-status without garbled duplicate text', () => {
      const openBtn = document.getElementById('open-miracle-modal-btn');
      const modal = document.getElementById('miracle-modal');
      const btn = document.getElementById('miracle-voice-detect-btn');
      const label = document.getElementById('miracle-voice-detect-label');
      const statusBox = document.getElementById('miracle-voice-status');
      const closeBtn = document.getElementById('close-miracle-modal');

      expect(btn).not.toBeNull();
      expect(label).not.toBeNull();
      expect(statusBox).not.toBeNull();
      expect(label.textContent.trim()).toBe('Identify by Voice');
      expect(statusBox.classList.contains('hidden')).toBe(true);

      // Stub Android bridge permission request so JSDOM stays in active listening state without needing real hardware mic
      const prevBridge = window.AndroidTargumaBridge;
      window.AndroidTargumaBridge = {
        hasAudioPermission: () => false,
        requestAudioPermission: () => {}
      };

      try {
        openBtn.click();
        expect(modal.style.display).toBe('block');

        btn.click();
        expect(targuma.isMiracleLiveDetectActive).toBe(true);
        expect(btn.classList.contains('listening')).toBe(true);
        expect(label.textContent.trim()).toBe('Stop Listening');
        expect(btn.textContent).not.toContain('Identify Live Reading (Targuma AI)');
        expect(btn.textContent).not.toContain('Identify by Voice');
        expect(statusBox.classList.contains('hidden')).toBe(false);

        // Closing the modal automatically stops live voice detection and resets the button
        closeBtn.click();
        expect(modal.style.display).toBe('none');
        expect(targuma.isMiracleLiveDetectActive).toBe(false);
        expect(btn.classList.contains('listening')).toBe(false);
        expect(label.textContent.trim()).toBe('Identify by Voice');
        expect(statusBox.classList.contains('hidden')).toBe(true);
      } finally {
        window.AndroidTargumaBridge = prevBridge;
      }
    });

    it('filters out universal Teamire Mariam opening preambles in English, Ge\'ez, and Amharic without false matches', () => {
      expect(typeof window.rankMiraclesByLiveTranscript).toBe('function');

      const engPreamble = window.rankMiraclesByLiveTranscript(
        '',
        'Listen my fathers and my brothers to a miracle performed by Our Lady the Holy Twofold Virgin Mary may her prayer and blessing be with us forever amen'
      );
      expect(engPreamble.status).toBe('preamble');
      expect(engPreamble.matches.length).toBe(0);

      const ethPreamble = window.rankMiraclesByLiveTranscript(
        'ስምዑ አበዊነ ወአኃውየ ተአምረ እግዝእትነ ቅድስት ድንግል በክልኤ ማርያም ወላዲተ አምላክ ጸሎቷና በረከቷ ከሁላችን ጋር ይሁን አሜን',
        'Listen our fathers and brothers to the miracle of Our Lady Holy Virgin Mary Mother of God'
      );
      expect(ethPreamble.status).toBe('preamble');
      expect(ethPreamble.matches.length).toBe(0);
    });

    it('ranks specific Miracle stories accurately across English, Amharic, and Ge\'ez incipit clues', () => {
      // 1. Dexius of Toledo (#13)
      const dexius = window.rankMiraclesByLiveTranscript(
        'ደቅስዮስ ኤጲስ ቆጶስ ዘሀገረ ቶሌዶ',
        'There was a bishop named Dexius in the city of Toledo who received heavenly vestments'
      );
      expect(dexius.status).toBe('matched');
      expect(dexius.matches[0].miracle.id).toBe('13');

      // 2. Woman Gives Water to a Thirsty Dog (#236)
      const thirstyDog = window.rankMiraclesByLiveTranscript(
        'ለተጠማ ውሻ በጫማዋ ውሃ አጠጣችው',
        'she filled her shoe with water and gave drink to the thirsty dog'
      );
      expect(thirstyDog.status).toBe('matched');
      expect(thirstyDog.matches[0].miracle.id).toBe('236');

      // 3. Cannibal of Qemer / Belate Seb (#125, most_read: false)
      const cannibal = window.rankMiraclesByLiveTranscript(
        'በላዕተ ሰብእ ዘሀገረ ቅምር',
        'a man from Qemer who ate seventy-eight souls and gave a handful of water to a beggar'
      );
      expect(cannibal.status).toBe('matched');
      expect(cannibal.matches[0].miracle.id).toBe('125');

      // 4. Scribe with Golden Ink (#162, most_read: false)
      const scribe = window.rankMiraclesByLiveTranscript(
        'ጸሐፊ በወርቅ ቀለም ስሟን ይጽፍ ነበር',
        'a scribe who always wrote the name of Mary in golden ink'
      );
      expect(scribe.status).toBe('matched');
      expect(scribe.matches[0].miracle.id).toBe('162');

      // 5. Artist falls from a ladder painting the devil (#33, most_read: false)
      const painter = window.rankMiraclesByLiveTranscript(
        '',
        'an artist was standing high on a ladder painting the ugly devil when the scaffold fell and the icon stretched out its hand'
      );
      expect(painter.status).toBe('matched');
      expect(painter.matches[0].miracle.id).toBe('33');
    });

    it('supports 1-tap selection of matched Miracles even when Show only most read toggle is checked', () => {
      const openBtn = document.getElementById('open-miracle-modal-btn');
      const modal = document.getElementById('miracle-modal');
      const mostReadToggle = document.getElementById('miracle-most-read-toggle');
      const statusBox = document.getElementById('miracle-voice-status');
      const selectedMiracleText = document.getElementById('selected-miracle-text');

      openBtn.click();
      expect(modal.style.display).toBe('block');
      expect(mostReadToggle.checked).toBe(true);

      // Simulate live speech chunk arriving for Miracle #125 (Cannibal of Qemer, most_read = false)
      targuma.evaluateMiracleLiveMatch(
        'በላዕተ ሰብእ ዘሀገረ ቅምር',
        'The cannibal of Qemer who ate seventy-eight people and gave a handful of water'
      );

      expect(statusBox.classList.contains('hidden')).toBe(false);
      const topChip = statusBox.querySelector('.miracle-live-match-chip[data-miracle-id="125"]');
      expect(topChip).not.toBeNull();

      topChip.click();
      expect(modal.style.display).toBe('none');
      expect(selectedMiracleText.textContent).toContain('The noble man from Qemer');
      expect(selectedMiracleText.textContent).toContain('ate 78 people');
    });
  });

  describe('Profanity Safeguard (All Targuma Languages, Scriptural Preservation & Re-processing)', () => {
    it('preserves scriptural, liturgical, and benign words across English, Spanish, Amharic, and Tigrinya', () => {
      const safePhrases = [
        'And I will bless them that bless thee, and curse him that curseth thee.',
        'The gates of hell shall not prevail against the Church, nor eternal damnation.',
        'He rode upon a colt, the foal of an ass, before the cock crowed twice.',
        'Classic compassion and tithe offerings at the Tabernacle.',
        'El versículo del tabernáculo habla de la disputa y las zorras en la viña.',
        'ለተጠማ ውሻ ውሃ አጠጣችው፤ እናትህንና አባትህን አክብር።',
        'በደላችንን ይቅር በለን፤ በዳይ አንሁን።',
        'ዝሙትን ረሳሕን ሓሳዊን ተግባር ነጽሐ።'
      ];

      for (const phrase of safePhrases) {
        expect(serverContainsProfanity(phrase)).toBe(false);
        expect(serverMaskProfanity(phrase)).toBe(phrase);
        expect(targuma.containsProfanity(phrase)).toBe(false);
        expect(targuma.maskProfanity(phrase)).toBe(phrase);
      }
    });

    it('masks vulgar profanity, modern expletives, and slurs with first-letter asterisks across en, es, am, and ti', () => {
      expect(serverMaskProfanity('What the fuck is this shit?')).toBe('What the f*** is this s***?');
      expect(serverMaskProfanity('No seas cabrón ni digas mierda, pendejo.')).toBe('No seas c***** ni digas m*****, p******.');
      expect(serverMaskProfanity('አንተ ሸርሙጣ እና ቅዘናም ነህ።')).toBe('አንተ ሸ*** እና ቅ*** ነህ።');
      expect(serverMaskProfanity('መዓኮር እና ሻርሙጣ አይባልም።')).toBe('መ*** እና ሻ*** አይባልም።');

      // Client fail-safe inside sanitizeTargetLanguageText & commitFinalizedCaption (bilingual mode)
      targuma.state.targetLang = 'en';
      expect(targuma.sanitizeTargetLanguageText('Please fucking listen', 'en')).toBe('Please f****** listen');

      targuma.commitFinalizedCaption(
        'prof_test_1',
        'አንተ ሸርሙጣ አትበል',
        'Do not say bullshit in church'
      );
      expect(targuma.state.captions[0].sourceText).toBe('አንተ ሸ*** አትበል');
      expect(targuma.state.captions[0].rawTarget).toBe('Do not say b******* in church');
      expect(targuma.state.captions[0].translatedHtml).toContain('b*******');
    });

    it('re-processes flagged translations once with Gemini context before falling back to first-letter masking', async () => {
      let reprocessCalls = 0;

      // 1. Clean translation skips re-processing completely
      const cleanRes = await translateImmutableClause(
        {
          sourceText: 'እግዚአብሔር ይመስገን',
          sourceLang: 'am',
          targetLang: 'en',
          modelId: 'gemini-3-flash-preview',
          enablePolish: true
        },
        {
          translateFn: async () => 'Thanks be to God',
          geminiFn: async () => 'Glory be to God',
          reprocessFn: async () => {
            reprocessCalls++;
            return 'Should not be called';
          }
        }
      );
      expect(cleanRes.translatedText).toBe('Glory be to God');
      expect(reprocessCalls).toBe(0);

      // 2. Flagged NMT/Gemini glitch triggers one contextual re-process and returns clean text
      const recoveredRes = await translateImmutableClause(
        {
          sourceText: 'በቃሉ ጸንቶ ቆመ',
          sourceLang: 'am',
          targetLang: 'en',
          modelId: 'gemini-3-flash-preview',
          enablePolish: false
        },
        {
          translateFn: async () => 'He stood fucking firm in his word',
          reprocessFn: async ({ candidateTranslation }) => {
            reprocessCalls++;
            expect(candidateTranslation).toContain('fucking');
            return 'He stood steadfast in His word';
          }
        }
      );
      expect(reprocessCalls).toBe(1);
      expect(recoveredRes.translatedText).toBe('He stood steadfast in His word');
      expect(recoveredRes.reprocessed).toBe(true);
      expect(recoveredRes.polished).toBe(true);

      // 3. If re-processing still contains profanity (or fails), first-letter asterisk masking acts as fail-safe
      const fallbackMaskedRes = await translateImmutableClause(
        {
          sourceText: 'Same language ASR shit',
          sourceLang: 'en',
          targetLang: 'en',
          modelId: 'gemini-3-flash-preview',
          enablePolish: true
        },
        {
          reprocessFn: async () => 'Same language ASR shit'
        }
      );
      expect(fallbackMaskedRes.translatedText).toBe('Same language ASR s***');
      expect(fallbackMaskedRes.reprocessed).toBe(true);
    });
  });
});


