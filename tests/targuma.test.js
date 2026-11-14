import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { loadApp } from './helpers/loadApp.js';

const { findConfidentClauseSplitIndex } = require('../services/targuma-stream/server.js');

describe('Targuma Immutable-Clause Streaming Engine, Sanctuary UI & VAD Suite', () => {
  let targuma;

  beforeAll(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
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
    it('does not render Mode & Parish TV Sync controls, moves Model picker into Settings drawer, and omits ms latency from status pill', () => {
      targuma.toggleTargumaMode(true);

      // Parish TV Sync must NOT exist in the visible DOM
      expect(document.getElementById('targuma-room-mode-select')).toBeNull();
      expect(document.getElementById('targuma-room-code-input')).toBeNull();
      expect(document.getElementById('targuma-view').textContent).not.toContain('Mode & Parish TV Sync');

      // Model selector lives inside the collapsible settings drawer, not cluttering the primary bar
      const primaryBar = document.querySelector('.targuma-toolbar-primary');
      const settingsDrawer = document.getElementById('targuma-toolbar-drawer');
      expect(primaryBar.querySelector('#targuma-model-select')).toBeNull();
      expect(settingsDrawer.querySelector('#targuma-model-select')).not.toBeNull();

      // Status banner stays clean without technical millisecond numbers
      targuma.state.isListening = true;
      targuma.state.lastLatencyMs = 142;
      targuma.handleStreamingServerEvent({ type: 'ready' });
      const statusText = document.getElementById('targuma-status-pill').textContent;
      expect(statusText).toBe('Listening • አማርኛ → English');
      expect(statusText).not.toContain('ms');

      targuma.state.isListening = false;
      targuma.toggleTargumaMode(false);
    });

    it('renders Audio Input Source selector and toggles the File Replay bar in the settings drawer', () => {
      targuma.toggleTargumaMode(true);
      const sourceSelect = document.getElementById('targuma-audio-source-select');
      const replayBar = document.getElementById('targuma-file-replay-bar');
      const micLabel = document.getElementById('targuma-mic-btn-label');

      expect(sourceSelect).not.toBeNull();
      expect(replayBar).not.toBeNull();
      expect(replayBar.classList.contains('hidden')).toBe(true);

      sourceSelect.value = 'file';
      sourceSelect.dispatchEvent(new Event('change'));

      expect(replayBar.classList.contains('hidden')).toBe(false);
      expect(micLabel.textContent).toBe('Start File Replay');

      sourceSelect.value = 'microphone';
      sourceSelect.dispatchEvent(new Event('change'));
      expect(replayBar.classList.contains('hidden')).toBe(true);
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
});

