import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { loadApp } from './helpers/loadApp.js';

describe('Kidase Audio Auto-Navigation, Sanctuary Interlude & Dual Red-Dot Tracker Suite', () => {
  let app;
  let tracker;
  let kidaseDataObj;

  beforeAll(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    const kidasePath = path.resolve(process.cwd(), 'app/src/main/assets/js/kidase.js');
    const kidaseCode = fs.readFileSync(kidasePath, 'utf8');
    kidaseDataObj = new Function(`${kidaseCode}\nreturn kidaseData;`)();
    window.kidaseData = kidaseDataObj;

    const prayersPath = path.resolve(process.cwd(), 'app/src/main/assets/js/prayers.js');
    const prayersCode = fs.readFileSync(prayersPath, 'utf8');
    window.prayers = new Function(`${prayersCode}\nreturn prayers;`)();

    app = loadApp();
    tracker = window.liturgyTracker;
  });

  beforeEach(() => {
    tracker.stopAutoFollow();
    tracker.setTrackerStyle('dot_plus_glow');
    tracker.setAutonomyMode('copilot');
    tracker.state.activeScope = 'anchor';
    tracker.state.suppressedTargets.clear();
  });

  describe('Dual-Environment Asset Parity & Slides Footer Placement', () => {
    it('keeps liturgy_tracker.js, liturgy_acoustic_worker.js, script.js, style.css, and service-worker.js 100% identical between Web and Android', () => {
      const pairs = [
        ['public/js/zema_acoustic_model_data.js', 'app/src/main/assets/js/zema_acoustic_model_data.js'],
        ['public/js/zaima_notation_data.js', 'app/src/main/assets/js/zaima_notation_data.js'],
        ['public/js/liturgy_guide_data.js', 'app/src/main/assets/js/liturgy_guide_data.js'],
        ['public/js/liturgy_tracker.js', 'app/src/main/assets/js/liturgy_tracker.js'],
        ['public/js/liturgy_acoustic_worker.js', 'app/src/main/assets/js/liturgy_acoustic_worker.js'],
        ['public/js/script.js', 'app/src/main/assets/js/script.js'],
        ['public/css/style.css', 'app/src/main/assets/css/style.css'],
        ['public/service-worker.js', 'app/src/main/assets/service-worker.js'],
      ];
      for (const [webRel, androidRel] of pairs) {
        const webContent = fs.readFileSync(path.resolve(process.cwd(), webRel), 'utf8');
        const androidContent = fs.readFileSync(path.resolve(process.cwd(), androidRel), 'utf8');
        expect(webContent, `Mismatch between ${webRel} and ${androidRel}`).toBe(androidContent);
      }
    });

    it('renders the Auto-Follow split button immediately to the left of .share-btn inside .prayer-actions in Slides Mode', () => {
      app.togglePresentationMode();
      const firstCard = document.querySelector('#prayer-display .prayer-card');
      expect(firstCard).toBeTruthy();

      const actions = firstCard.querySelector('.prayer-actions');
      expect(actions).toBeTruthy();

      const autoFollowGroup = actions.querySelector('.liturgy-autofollow-group');
      const shareBtn = actions.querySelector('.share-btn');
      expect(autoFollowGroup).toBeTruthy();
      expect(shareBtn).toBeTruthy();
      expect(autoFollowGroup.nextElementSibling).toBe(shareBtn);
      app.togglePresentationMode();
    });
  });

  describe('Cross-Lingual Phonetic & 9-Class Articulatory-Acoustic Skeletonizer', () => {
    it('maps real Oakland Wav2Vec2 CTC phones and Ethiopic script to congruent 9-class acoustic skeletons', () => {
      const ethTrinitarian = tracker.toCanonicalAcousticSkeleton('ብሩክ እግዚአብሔር አብ አኃዜ ኵሉ አምላክነ');
      const ctcTrinitarian = tracker.toCanonicalAcousticSkeleton('BURUK EGZIABHER AB AHAZE KULU MALAKINE');
      expect(ethTrinitarian.consonants).toContain('BRK');
      // Liquid 'l'/'r' merge into 'R' and nasals 'm'/'n' merge into 'M' -> 'amlakne' & 'MALAKINE' both yield 'MRKM'!
      expect(ethTrinitarian.consonants).toContain('MRKM');
      expect(ctcTrinitarian.consonants).toContain('MRKM');

      const ethHierarchy = tracker.toCanonicalAcousticSkeleton('በአባ ማትያስ ወበብፁዕ ሊቀ ጳጳስነ አባ ቴዎፍሎስ');
      const ctcHierarchy = tracker.toCanonicalAcousticSkeleton('BABAMATYAS WABABTSU LIQA PAPASINA BABA TOOFROSE');
      expect(ethHierarchy.full).toContain('ABAMAT');
      expect(ctcHierarchy.full).toContain('ABAMAT');
      expect(ethHierarchy.consonants).toContain('BMTS');
      expect(ctcHierarchy.consonants).toContain('BMTS');
    });
  });

  describe('IDF Repetitive-Refrain Guardrail & Inaudible Prayer Skipping', () => {
    it('advances +1 locally on repetitive refrains and skips Inaudible Prayers, while NEVER jumping cross-zone on refrains', () => {
      const syntheticSlides = [
        {
          cardId: '2-1',
          geez_script: 'Priest: እምቅድመ ሥዕለት ወስብሐት ብሩክ እግዚአብሔር አብ አኃዜ ኵሉ አምላክነ',
          english: 'Priest: Before the icons and glory, blessed be God the Father Almighty'
        },
        {
          cardId: '2-2',
          instruction: 'Inaudible Prayer (ጸሎት በልኁሳስ)',
          geez_script: 'እግዚአብሔር አምላክነ ዘበሰማያት ተወከፍ ጸሎተነ',
          english: 'O Lord our God in the heavens accept our prayer'
        },
        {
          cardId: '2-3',
          geez_script: 'Priest: ሰላም ለኵልክሙ',
          amharic_script: 'ካህን፤ ሰላም ለሁላችሁ ይሁን',
          english: 'Priest: Peace be unto you all'
        },
        // Add distinct stanzas so corpus N is realistic
        ...Array.from({ length: 18 }, (_, k) => ({
          cardId: `3-${k + 10}`,
          geez_script: `ዲያቆን፤ ንስእል ወንትመሐል ኀበ እግዚአብሔር ምዕራፍ ${k + 10}`,
          english: `Deacon: Let us beseech the Lord in litany stanza ${k + 10}`
        })),
        {
          cardId: 'Apostles-15',
          sectionTitle: 'Anaphora of the Apostles',
          geez_script: 'Priest: ሰላም ለኵልክሙ',
          amharic_script: 'ካህን፤ ሰላም ለሁላችሁ ይሁን',
          english: 'Priest: Peace be unto you all'
        }
      ];

      const graph = tracker.buildLiturgicalSlideGraph(syntheticSlides);
      expect(graph.nodes[1].isInaudible).toBe(true);
      expect(graph.nodes[2].isRepetitiveRefrain).toBe(true);
      expect(graph.nodes[graph.nodes.length - 1].isRepetitiveRefrain).toBe(true);

      // 1. When at slide 0 ('2-1'), hearing 'ሰላም ለኵልክሙ' should skip slide 1 (Inaudible Prayer)
      //    and advance locally to slide 2 ('2-3'), NOT jump to 'Apostles-15'!
      const obsSelam = tracker.createObservationProfile('ሰላም ለኵልክሙ peace be unto you all');
      const localStep = tracker.evaluateLiturgicalStep({
        obsProfile: obsSelam,
        rms: 0.05,
        phoneDensity: 0.45,
        windowDurationMs: 500,
        currentSlideIdx: 0,
        graph,
        shadowBranches: null,
        trackerState: {
          ...tracker.state,
          activeScope: 'unknown',
          suppressedTargets: new Map()
        }
      });
      expect(localStep.action).toBe('advance_local');
      expect(localStep.targetSlideIndex).toBe(2);

      // 2. When at slide 6 (far from any immediate next 'ሰላም ለኵልክሙ'), hearing ONLY 'ሰላም ለኵልክሙ'
      //    must NEVER trigger a global jump to slide 2 or 'Apostles-15'!
      const farStep = tracker.evaluateLiturgicalStep({
        obsProfile: obsSelam,
        rms: 0.05,
        phoneDensity: 0.45,
        windowDurationMs: 500,
        currentSlideIdx: 6,
        graph,
        shadowBranches: null,
        trackerState: {
          ...tracker.state,
          activeScope: 'unknown',
          unmatchedVoicedMs: 0,
          suppressedTargets: new Map()
        }
      });
      expect(farStep.action).not.toBe('jump_global_immediate');
      expect(farStep.action).not.toBe('prompt_copilot');
    });
  });

  describe('Co-Pilot Anaphora Auto-Switch & Apostles Congregation Backbone Fallback', () => {
    it('detects Anaphora of Our Lady Mary when Apostles is selected and triggers a 3s Co-Pilot prompt', () => {
      const apostlesSlides = (kidaseDataObj.apostles || []).slice(0, 10);
      const graph = tracker.buildLiturgicalSlideGraph(apostlesSlides);
      const shadowBranches = tracker.buildShadowLiturgicalBranches(kidaseDataObj, {
        selectedAnaphora: 'apostles',
        selectedKidaseDay: 'sunday'
      });
      expect(shadowBranches.unselectedAnaphora.length).toBeGreaterThan(0);

      // Feed opening words of Anaphora of St. Mary ("ጎሥዐ ልብየ ቃለ ሠናየ..." / St.Mary-1)
      const maryFirst = kidaseDataObj.mary[0];
      const maryObs = tracker.createObservationProfile(`${maryFirst.geez_script} ${maryFirst.amharic_script || ''}`);

      const step = tracker.evaluateLiturgicalStep({
        obsProfile: maryObs,
        rms: 0.06,
        phoneDensity: 0.5,
        windowDurationMs: 500,
        currentSlideIdx: 0,
        graph,
        shadowBranches,
        trackerState: {
          ...tracker.state,
          autonomyMode: 'copilot',
          anaphoraSwitchMode: 'prompt_3s',
          unmatchedVoicedMs: 0,
          suppressedTargets: new Map()
        }
      });

      expect(step.action).toBe('prompt_copilot');
      expect(step.branchType).toBe('anaphora');
      expect(step.anaphoraKey).toBe('mary');
    });

    it('detects Anaphora of St. Jacob of Serug when Apostles is selected and triggers a 3s Co-Pilot prompt', () => {
      const apostlesSlides = (kidaseDataObj.apostles || []).slice(0, 10);
      const graph = tracker.buildLiturgicalSlideGraph(apostlesSlides);
      const shadowBranches = tracker.buildShadowLiturgicalBranches(kidaseDataObj, {
        selectedAnaphora: 'apostles',
        selectedKidaseDay: 'saturday'
      });
      expect(shadowBranches.unselectedAnaphora.some(b => b.anaphoraKey === 'jacob')).toBe(true);

      // Feed distinctive opening stanza of Anaphora of St. Jacob of Serug ("ተንሥኡ ዘእምንዋም..." / St.Jacob-2)
      const jacobStanza2 = kidaseDataObj.jacob.find(p => p.chapter === 'St.Jacob' && p.stanza === '2');
      expect(jacobStanza2).toBeDefined();
      const jacobObs = tracker.createObservationProfile(`${jacobStanza2.geez_script} ${jacobStanza2.amharic_script || ''}`);

      const step = tracker.evaluateLiturgicalStep({
        obsProfile: jacobObs,
        rms: 0.06,
        phoneDensity: 0.5,
        windowDurationMs: 500,
        currentSlideIdx: 0,
        graph,
        shadowBranches,
        trackerState: {
          ...tracker.state,
          autonomyMode: 'copilot',
          anaphoraSwitchMode: 'prompt_3s',
          unmatchedVoicedMs: 0,
          suppressedTargets: new Map()
        }
      });

      expect(step.action).toBe('prompt_copilot');
      expect(step.branchType).toBe('anaphora');
      expect(step.anaphoraKey).toBe('jacob');
    });

    it('falls back to Anaphora of the Apostles congregation chants when recovering from an unbundled Anaphora interlude', () => {
      const orderSample = (kidaseDataObj.order || []).slice(0, 12);
      const graph = tracker.buildLiturgicalSlideGraph(orderSample);
      const shadowBranches = tracker.buildShadowLiturgicalBranches(kidaseDataObj, {
        selectedAnaphora: 'apostles',
        selectedKidaseDay: 'sunday'
      });
      expect(shadowBranches.apostlesBackbone.length).toBeGreaterThan(5);

      const targetBackbone = shadowBranches.apostlesBackbone[0];
      const obs = {
        rawText: targetBackbone.preview,
        fullSkeleton: targetBackbone.seq.fullSkeleton,
        consonantSkeleton: targetBackbone.seq.consonantSkeleton,
        shingles: targetBackbone.seq.shingles,
        consShingles: targetBackbone.seq.consShingles
      };

      const simState = {
        ...tracker.state,
        isSanctuaryInterludeVisible: true,
        unmatchedVoicedMs: 7000,
        reacquireStreak: 0,
        reacquireCandidateIdx: -1,
        suppressedTargets: new Map()
      };

      const step = tracker.evaluateLiturgicalStep({
        obsProfile: obs,
        rms: 0.06,
        phoneDensity: 0.48,
        windowDurationMs: 500,
        currentSlideIdx: 0,
        graph,
        shadowBranches,
        trackerState: simState
      });

      expect(step.action).toBe('exit_interlude_to_apostles_backbone');
      expect(step.cardId).toBe(targetBackbone.cardId);
      expect(simState.usingApostlesBackboneFallback).toBe(true);
    });
  });

  describe('Sanctuary Icon Interlude (With-her-beloved-Son.png) Smooth Cross-Fade', () => {
    it('never enters interlude on pure silence, enters after >=5.5s of off-book speech, and jumps behind the curtain before fading out', () => {
      const slides = (kidaseDataObj.order || []).filter(p => !/inaudible/i.test(p.instruction || '')).slice(0, 25);
      const graph = tracker.buildLiturgicalSlideGraph(slides);
      const simState = {
        ...tracker.state,
        isSanctuaryInterludeVisible: false,
        unmatchedVoicedMs: 0,
        reacquireStreak: 0,
        reacquireCandidateIdx: -1,
        suppressedTargets: new Map()
      };

      // 1. 15 seconds of silence (censing / silent pause) -> NEVER enters interlude
      const silentObs = tracker.createObservationProfile('');
      for (let i = 0; i < 15; i++) {
        const res = tracker.evaluateLiturgicalStep({
          obsProfile: silentObs,
          rms: 0.002,
          phoneDensity: 0.02,
          windowDurationMs: 1000,
          currentSlideIdx: 0,
          graph,
          shadowBranches: null,
          trackerState: simState
        });
        expect(res.action).toBe('hold_silent');
      }
      expect(simState.isSanctuaryInterludeVisible).toBe(false);

      // 2. 6 seconds of sustained off-book sermon speech -> enters Sanctuary Interlude
      const sermonObs = tracker.createObservationProfile(
        'ዛሬ በደብረ ምሕረት ቅዱስ ሚካኤል ቤተ ክርስቲያን የሰንበት ትምህርት ቤት መርሐ ግብርና ልዩ ማስታወቂያ እንነግራችኋለን'
      );
      let lastRes = null;
      for (let i = 0; i < 6; i++) {
        lastRes = tracker.evaluateLiturgicalStep({
          obsProfile: sermonObs,
          rms: 0.055,
          phoneDensity: 0.46,
          windowDurationMs: 1000,
          currentSlideIdx: 0,
          graph,
          shadowBranches: null,
          trackerState: simState
        });
      }
      expect(lastRes.action).toBe('enter_sanctuary_interlude');
      expect(simState.isSanctuaryInterludeVisible).toBe(true);

      // Verify DOM overlay uses `With-her-beloved-Son.png` and executes hidden jump callback BEFORE fade-out
      document.body.classList.add('presentation-mode-slides');
      tracker.setSanctuaryInterludeVisible(true);
      const interludeEl = document.getElementById('slides-sanctuary-interlude');
      const imgEl = document.getElementById('sanctuary-interlude-img');
      expect(interludeEl.classList.contains('is-visible')).toBe(true);
      expect(imgEl.getAttribute('src')).toContain('img/With-her-beloved-Son.png');

      let wasVisibleDuringHiddenJump = false;
      tracker.setSanctuaryInterludeVisible(false, () => {
        wasVisibleDuringHiddenJump = interludeEl.classList.contains('is-visible');
      });
      expect(wasVisibleDuringHiddenJump).toBe(true);

      // 3. Two consecutive windows matching a distinctive audible stanza -> confirms and exits interlude cleanly
      const resumeIdx = graph.nodes.findIndex((n, idx) => idx >= 4 && !n.isInaudible && !n.isRepetitiveRefrain);
      expect(resumeIdx).toBeGreaterThanOrEqual(4);
      const resumeSlide = slides[resumeIdx];
      const resumeObs = tracker.createObservationProfile(`${resumeSlide.geez_script || ''} ${resumeSlide.amharic_script || ''}`);
      const c1 = tracker.evaluateLiturgicalStep({
        obsProfile: resumeObs,
        rms: 0.06,
        phoneDensity: 0.5,
        windowDurationMs: 500,
        currentSlideIdx: 0,
        graph,
        shadowBranches: null,
        trackerState: simState
      });
      expect(c1.action).toBe('interlude_confirming');

      const c2 = tracker.evaluateLiturgicalStep({
        obsProfile: resumeObs,
        rms: 0.06,
        phoneDensity: 0.5,
        windowDurationMs: 500,
        currentSlideIdx: 0,
        graph,
        shadowBranches: null,
        trackerState: simState
      });
      expect(c2.action).toBe('exit_interlude_to_slide');
      expect(c2.targetSlideIndex).toBe(resumeIdx);
      expect(simState.isSanctuaryInterludeVisible).toBe(false);
    });
  });

  describe('Dual Ge\'ez + Phonetic Congregation Red-Dot & Multi-Column / Shadow Bible Alignment', () => {
    it('maps Ge\'ez words 1:1 to their congregation phonetic twin even after Priest lines', () => {
      // Simulate card where Priest speaks 3 words, then People chant 4 words
      const geezWords = ['እግዚአብሔር', 'ምስሌክሙ', 'ይኩን', 'ምስለ', 'መንፈስከ', 'ንሴብሖ', 'ለአምላክነ'];
      const peoplePhoneticWords = ['misle', 'menfesike', 'nisebiho', 'le-amlakine'];

      const wordMap = tracker.computeGeezToPhoneticWordMap(geezWords, peoplePhoneticWords);
      expect(wordMap[0]).toBe(-1);
      expect(wordMap[3]).toBe(0); // ምስለ -> misle
      expect(wordMap[4]).toBe(1); // መንፈስከ -> menfesike
      expect(wordMap[5]).toBe(2); // ንሴብሖ -> nisebiho
      expect(wordMap[6]).toBe(3); // ለአምላክነ -> le-amlakine

      // Verify DOM instrumentation creates both primary and phonetic red dots
      const card = document.createElement('div');
      card.className = 'prayer-card active-slide';
      card.innerHTML = `
        <div class="language-section lang-geez_script">
          <p class="language-text">ሕዝብ፡ ምስለ መንፈስከ ንሴብሖ ለአምላክነ<i class="geez-phonetic-append"><br>Ḥizb: misle menfesike nisebiho le-amlakine</i></p>
        </div>
      `;
      document.body.appendChild(card);
      const meta = tracker.ensureSlideInstrumented(card);
      expect(meta.colSpans.geez_script.length).toBe(4);
      expect(meta.phoneticSpans.length).toBe(4);
      expect(meta.geezToPhonMap).toEqual([0, 1, 2, 3]);

      tracker.renderRedDotPosition(card, 'geez_script', 2, 0.5);
      expect(meta.colSpans.geez_script[2].classList.contains('mom-word-active')).toBe(true);
      expect(meta.phoneticSpans[2].classList.contains('mom-word-active')).toBe(true);
      tracker.cleanupInstrumentedSlide();
      card.remove();
    });

    it('dynamically switches spoken column (Ge\'ez -> Amharic -> English) and projects shadow am54 Bible editions onto am-2000', () => {
      const trilingualSlide = {
        cardId: 'Pauline-Rom11',
        readingType: 'pauline',
        geez_script: 'እብል እንከ ቦኑ ከዐዎሙ እግዚአብሔር ለሕዝቡ ሐሰ ቦቱ',
        amharic_script: 'እንግዲህ እግዚአብሔር ሕዝቡን ጣላቸውን እላለሁ አይደለም እኔ ደግሞ እስራኤላዊ ነኝና',
        english: 'I say then has God cast away His people Certainly not For I also am an Israelite',
        _shadowTexts: [
          {
            langKey: 'amharic_script',
            edition: 'am54',
            text: 'እንግዲህ እግዚአብሔር ወገኖቹን ፈጽሞ ትቶአቸዋልን አይደለም ከአብርሃም ዘር የሆንሁ እስራኤላዊ ነኝ'
          }
        ]
      };
      const graph = tracker.buildLiturgicalSlideGraph([trilingualSlide]);
      const node = graph.nodes[0];

      // 1. Reader speaks English column -> selects `english` and advances word index
      const engObs = tracker.createObservationProfile('has God cast away His people Certainly not');
      const resEng = tracker.evaluateMultiColumnRedDot(engObs, node, null, -1, 1000);
      expect(resEng.activeColumn).toBe('english');
      expect(resEng.wordIndex).toBeGreaterThanOrEqual(5);

      // 2. Reader reads from the older 1954 Haile Selassie Bible (`am54` shadow text) while `am-2000` is displayed ->
      //    still selects `amharic_script` and projects word progress cleanly!
      const am54Obs = tracker.createObservationProfile('እንግዲህ እግዚአብሔር ወገኖቹን ፈጽሞ ትቶአቸዋልን አይደለም');
      const resAm54 = tracker.evaluateMultiColumnRedDot(am54Obs, node, 'english', 7, 2500);
      expect(resAm54.activeColumn).toBe('amharic_script');
      expect(resAm54.wordIndex).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Pillar A: Supervised Ge\'ez Zema CTC Head & Online Coupled Slide Viterbi Aligner', () => {
    it('exports a valid [10 x 392] column-stochastic Zema routing matrix with special tokens pinned to BLANK', () => {
      const modelData = window.ZEMA_ACOUSTIC_MODEL_DATA;
      expect(modelData).toBeTruthy();
      expect(modelData.classes).toEqual(['_', 'A', 'I', 'U', 'B', 'M', 'T', 'S', 'K', 'R']);
      expect(modelData.routingMatrix.length).toBe(10);
      expect(modelData.routingMatrix[0].length).toBe(392);

      // Special tokens 0..3 (<pad>, <s>, </s>, <unk>) must route 100% to BLANK (class 0)
      for (let tok = 0; tok <= 3; tok++) {
        expect(modelData.routingMatrix[0][tok]).toBeCloseTo(1.0, 3);
      }

      // Every IPA token column sums to ~1.0
      for (let v = 0; v < 392; v++) {
        let colSum = 0;
        for (let c = 0; c < 10; c++) colSum += modelData.routingMatrix[c][v];
        expect(colSum).toBeGreaterThan(0.99);
        expect(colSum).toBeLessThan(1.01);
      }
    });

    it('holds steady during prolonged Zema vowel melisma without bunny-hopping, then crosses to next slide on congregation entry', () => {
      const slide326 = {
        cardId: '3-26',
        chapter: '3',
        stanza: '26',
        geez_script: 'ካህን፤ አሐዱ አብ ቅዱስ'
      };
      const slide327 = {
        cardId: '3-27',
        chapter: '3',
        stanza: '27',
        geez_script: 'ሕዝብ፤ በአማን አብ ቅዱስ'
      };
      const graph = tracker.buildLiturgicalSlideGraph([slide326, slide327]);
      const simState = { ...tracker.state, activeSpokenColumn: 'geez_script' };

      const makeSyntheticFrames = (clsSeq) => {
        const NUM_C = 10;
        const post = new Float32Array(clsSeq.length * NUM_C);
        const rms = new Float32Array(clsSeq.length).fill(0.05);
        for (let t = 0; t < clsSeq.length; t++) {
          const target = clsSeq[t];
          for (let c = 0; c < NUM_C; c++) {
            post[t * NUM_C + c] = c === target ? -0.12 : -4.2;
          }
        }
        return { post, rms };
      };

      // Classes: 0:_, 1:A, 2:I, 3:U, 4:B, 5:M, 6:T, 7:S, 8:K, 9:R
      // Sing `አሐዱ` (A K A T U) followed by a long 120-frame (4.8s) melisma on `U`!
      const ahaduMelisma = [
        1, 1, 1, 8, 8, 8, 1, 1, 1, 6, 6, 6,
        ...new Array(120).fill(3)
      ];
      const f1 = makeSyntheticFrames(ahaduMelisma);
      const v1 = tracker.updateOnlineCoupledViterbi(graph.nodes[0], graph.nodes[1], 1, f1.post, f1.rms, simState);
      expect(v1.wordIndex).toBe(0); // Must stay on `አሐዱ` (word 0), NEVER bunny-hopping across `አብ ቅዱስ`!
      expect(v1.crossedToNext).toBe(false);

      // Now sing `አብ ቅዱስ` (A B K T U S) + long cadence melisma on `ቅዱስ`
      const abKidusCadence = [
        1, 1, 1, 4, 4, 4, 8, 8, 8, 6, 6, 6,
        ...new Array(60).fill(3),
        7, 7, 7, 7
      ];
      const f2 = makeSyntheticFrames(abKidusCadence);
      const v2 = tracker.updateOnlineCoupledViterbi(graph.nodes[0], graph.nodes[1], 1, f2.post, f2.rms, simState);
      expect(v2.wordIndex).toBe(2); // Reached `ቅዱስ` (word 2)
      expect(v2.crossedToNext).toBe(false); // Still on 3-26!

      // Now congregation enters on 3-27 `በአማን አብ ቅዱስ` (B I A M A M A B K T U S) -> crosses cleanly!
      const beAmanEntry = [];
      for (const cls of [4, 2, 1, 5, 1, 5, 1, 4, 8, 6, 3, 7]) {
        beAmanEntry.push(cls, cls, cls, cls, cls);
      }
      const f3 = makeSyntheticFrames(beAmanEntry);
      const v3 = tracker.updateOnlineCoupledViterbi(graph.nodes[0], graph.nodes[1], 1, f3.post, f3.rms, simState);
      expect(v3.crossedToNext).toBe(true);
      expect(v3.nextSlideIdx).toBe(1);
    });

    it('stitches hop skeletons without ring-buffer boundary duplication', () => {
      let s = '';
      s = tracker.appendStitchedHopSkeleton(s, 'AKAT', 32);
      s = tracker.appendStitchedHopSkeleton(s, 'TUAB', 32);
      expect(s).toBe('AKATUAB');
    });
  });

  describe('Pillar B & C: St. Yared Multi-Row Zaima Notation & Heavenly Liturgy Guide Modal', () => {
    it('renders 1-to-3 row interlinear Zaima notation with Izzel rubric red, Beit margin, and full Red-Dot compatibility', () => {
      const zaima = window.ZAIMA_NOTATION_DATA;
      expect(zaima).toBeTruthy();
      expect(zaima.hasZaimaNotationForCard('3-26')).toBe(true);
      expect(zaima.hasZaimaNotationForCard('3-119')).toBe(true);

      const rawHtml = '<strong>ካህን፤</strong> አሐዱ አብ ቅዱስ አሐዱ ወልድ ቅዱስ አሐዱ ውእቱ መንፈስ ቅዱስ።<br><i class="geez-phonetic-append">Kahn: Aḥadu Ab ḳidus</i>';
      const decorated = zaima.decorateGeezHtmlWithZaima(rawHtml, '3-26');

      // 3-26 must NOT render the Ahadu `፩` Beit numeral
      expect(decorated).not.toContain('zaima-beit-margin');
      expect(decorated).not.toContain('፩');
      expect(decorated).toContain('zaima-rows-3');
      expect(decorated).toContain('zaima-mode-izzel');
      // 3-119 still supports Beit margin
      const decoratedNisgid = zaima.decorateGeezHtmlWithZaima('<strong>ካህን፤</strong> ንስግድ', '3-119');
      expect(decoratedNisgid).toContain('zaima-beit-margin');
      // Phonetic tail must remain 100% untouched!
      expect(decorated).toContain('<i class="geez-phonetic-append">Kahn: Aḥadu Ab ḳidus</i>');

      // Verify Red-Dot DOM instrumentation wraps base words cleanly without corrupting `.zaima-rt` notation!
      const card = document.createElement('div');
      card.className = 'prayer-card active-slide';
      card.dataset.cardId = '3-26';
      card.innerHTML = `<div class="language-section lang-geez_script"><p class="language-text">${decorated}</p></div>`;
      document.body.appendChild(card);

      const rtCountBefore = card.querySelectorAll('.zaima-rt').length;
      const meta = tracker.ensureSlideInstrumented(card);
      expect(meta.colSpans.geez_script.length).toBe(10); // Exactly the 10 chanted Ge'ez words (excluding `ካህን፤` and Zaima `ምልክት`!)
      expect(card.querySelectorAll('.zaima-rt').length).toBe(rtCountBefore);

      tracker.renderRedDotPosition(card, 'geez_script', 2, 0.5);
      expect(meta.colSpans.geez_script[2].classList.contains('mom-word-active')).toBe(true);

      tracker.cleanupInstrumentedSlide();
      expect(card.querySelectorAll('.zaima-rt').length).toBe(rtCountBefore);
      card.remove();

      // Also verify partially-notated recurring responses (`ተንሥኡ ለጸሎት ...`) collect mixed Zaima + plain words in DOM order
      const mixedHtml = zaima.decorateGeezHtmlWithZaima('<strong>ዲያቆን፤</strong> ተንሥኡ ለጸሎት በሰላም', '99-1');
      const mixedCard = document.createElement('div');
      mixedCard.className = 'prayer-card active-slide';
      mixedCard.innerHTML = `<div class="language-section lang-geez_script"><p class="language-text">${mixedHtml}</p></div>`;
      document.body.appendChild(mixedCard);
      const mixedMeta = tracker.ensureSlideInstrumented(mixedCard);
      expect(mixedMeta.colSpans.geez_script.length).toBe(3); // `ተንሥኡ` (.zaima-word), `ለጸሎት` (.zaima-word), `በሰላም` (plain)
      tracker.cleanupInstrumentedSlide();
      mixedCard.remove();
    });

    it('exposes the 11-Station Heavenly Liturgy Map, 100+ Essential Kidase Words, and interactive modal tabs', () => {
      const guide = window.LITURGY_GUIDE_DATA;
      expect(guide).toBeTruthy();
      expect(guide.LITURGY_MAP_STATIONS.length).toBe(11);
      expect(guide.ESSENTIAL_100_WORDS.length).toBeGreaterThanOrEqual(100);
      expect(guide.ZAIMA_QIRTS_TABLE.length).toBe(12);

      window.openLiturgyGuideModal('map');
      const modal = document.getElementById('liturgy-guide-modal');
      expect(modal).toBeTruthy();
      expect(modal.style.display).toBe('flex');
      expect(modal.querySelectorAll('.lg-station-card').length).toBe(11);

      window.openLiturgyGuideModal('lexicon');
      const searchInput = document.getElementById('lg-lexicon-search');
      expect(searchInput).toBeTruthy();
      searchInput.value = 'ቅዱስ';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      const visibleRows = Array.from(modal.querySelectorAll('.lg-lex-row')).filter(r => r.style.display !== 'none');
      expect(visibleRows.length).toBeGreaterThanOrEqual(1);
      expect(visibleRows.length).toBeLessThan(15);

      window.closeLiturgyGuideModal();
      expect(modal.style.display).toBe('none');
    });

    it('aligns Zaima base fidels on a flat inline-block baseline (.zaima-rb last-child) and opens/pins #zaima-inspector-popover on hover & click', () => {
      const zaima = window.ZAIMA_NOTATION_DATA;
      const decorated = zaima.decorateGeezHtmlWithZaima('<strong>ካህን፤</strong> አሐዱ አብ ቅዱስ', '3-26');
      const card = document.createElement('div');
      card.className = 'prayer-card active-slide';
      card.dataset.cardId = '3-26';
      card.innerHTML = `<div class="language-section lang-geez_script"><p class="language-text">${decorated}</p></div>`;
      document.body.appendChild(card);

      // 1. Every `.zaima-fidel-col` MUST have `.zaima-rb` as `:last-child` so CSS inline-block baseline
      //    locks 0-, 1-, 2-, and 3-row words onto a single flat horizontal line!
      const cols = Array.from(card.querySelectorAll('.zaima-fidel-col'));
      expect(cols.length).toBeGreaterThanOrEqual(7);
      for (const col of cols) {
        expect(col.lastElementChild?.classList.contains('zaima-rb')).toBe(true);
      }

      // 2. DOM `buildLiturgicalSlideGraph` must NOT split Zaima-decorated words into single-letter tokens!
      const domGraph = tracker.buildLiturgicalSlideGraph([card]);
      const domWords = domGraph.nodes[0].columns.geez_script.words.map(w => w.surface);
      expect(domWords).toEqual(['አሐዱ', 'አብ', 'ቅዱስ']);

      // 3. Clicking a non-empty `.zaima-rt` opens & pins `#zaima-inspector-popover` with Qirts/Miliket details
      const activeRt = card.querySelector('.zaima-rt:not(.is-empty)');
      expect(activeRt).toBeTruthy();
      activeRt.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      const pop = document.getElementById('zaima-inspector-popover');
      expect(pop).toBeTruthy();
      expect(pop.classList.contains('is-visible')).toBe(true);
      expect(pop.classList.contains('is-pinned')).toBe(true);
      expect(pop.textContent).toContain('አሐዱ');

      // Clicking outside unpins & hides `#zaima-inspector-popover`
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(pop.classList.contains('is-visible')).toBe(false);
      card.remove();
    });
  });

  describe('Strict Chronological +1 Follow ("anchor" Scope) & Spoken English CTC Alignment', () => {
    it('never teleports globally when activeScope is "anchor", advancing strictly +1 while allowing "unknown" scope to find place & re-lock', () => {
      const audibleOrder = (kidaseDataObj.order || []).filter(p => !/inaudible/i.test(p.instruction || '')).slice(0, 30);
      const graph = tracker.buildLiturgicalSlideGraph(audibleOrder);

      // Pick a distinctive stanza far ahead (e.g. slide 18) while anchored on slide 2
      const distantIdx = graph.nodes.findIndex((n, idx) => idx >= 15 && !n.isRepetitiveRefrain && n.distinctiveShingleCount >= 6);
      expect(distantIdx).toBeGreaterThanOrEqual(15);
      const distantSlide = audibleOrder[distantIdx];
      const distantObs = tracker.createObservationProfile(`${distantSlide.geez_script || ''} ${distantSlide.english || ''}`);

      // 1. In default "Follow from current slide" (`activeScope: 'anchor'`), distant audio MUST NOT jump!
      const anchorState = {
        ...tracker.state,
        autonomyMode: 'copilot',
        activeScope: 'anchor',
        unmatchedVoicedMs: 0,
        suppressedTargets: new Map()
      };
      const blockedJump = tracker.evaluateLiturgicalStep({
        obsProfile: distantObs,
        rms: 0.05,
        phoneDensity: 0.45,
        windowDurationMs: 450,
        currentSlideIdx: 2,
        graph,
        shadowBranches: null,
        trackerState: anchorState
      });
      expect(blockedJump.action).not.toBe('jump_global_immediate');
      expect(blockedJump.action).not.toBe('prompt_copilot');
      expect(blockedJump.action).not.toBe('advance_local');

      // 2. Speaking the immediate next slide (+1, slide 3) advances cleanly by +1!
      const nextSlide = audibleOrder[3];
      const nextObs = tracker.createObservationProfile(`${nextSlide.geez_script || ''} ${nextSlide.amharic_script || ''}`);
      const stepPlusOne = tracker.evaluateLiturgicalStep({
        obsProfile: nextObs,
        rms: 0.05,
        phoneDensity: 0.45,
        windowDurationMs: 450,
        currentSlideIdx: 2,
        graph,
        shadowBranches: null,
        trackerState: anchorState
      });
      expect(stepPlusOne.action).toBe('advance_local');
      expect(stepPlusOne.targetSlideIndex).toBe(3);

      // 3. If user explicitly selects "I don't know where we're at" (`activeScope: 'unknown'`),
      //    it jumps to `distantIdx` AND automatically locks `activeScope` back to `'anchor'`!
      const findState = {
        ...tracker.state,
        autonomyMode: 'copilot',
        activeScope: 'unknown',
        unmatchedVoicedMs: 0,
        suppressedTargets: new Map()
      };
      const foundStep = tracker.evaluateLiturgicalStep({
        obsProfile: distantObs,
        rms: 0.05,
        phoneDensity: 0.45,
        windowDurationMs: 450,
        currentSlideIdx: 2,
        graph,
        shadowBranches: null,
        trackerState: findState
      });
      expect(foundStep.action).toBe('jump_global_immediate');
      expect(foundStep.targetSlideIndex).toBe(distantIdx);
      expect(findState.activeScope).toBe('anchor');
    });

    it('tracks spoken English CTC skeletons on 3-26 ("One is the Holy Father...") and advances +1 to 3-27 ("Truly the Father is Holy...")', () => {
      const ahaduSlides = (kidaseDataObj.order || []).filter(
        p => p.chapter === '3' && Number(p.stanza) >= 26 && Number(p.stanza) <= 30
      );
      const graph = tracker.buildLiturgicalSlideGraph(ahaduSlides);
      const simState = {
        ...tracker.state,
        autonomyMode: 'copilot',
        activeScope: 'anchor',
        unmatchedVoicedMs: 0,
        suppressedTargets: new Map()
      };

      // Feed real Wav2Vec2 eSpeak IPA -> 9-class CTC skeleton for spoken English 3-26:
      // "One is the Holy Father, one is the Holy Son, one is the Holy Spirit"
      const spokenEng326 = tracker.createObservationProfile('UAMISTIKURIBATIRUAMISTIKURISAMUAMISTIKURISBIRIT');
      const track326 = tracker.evaluateLiturgicalStep({
        obsProfile: spokenEng326,
        rms: 0.05,
        phoneDensity: 0.42,
        windowDurationMs: 450,
        currentSlideIdx: 0,
        graph,
        shadowBranches: null,
        trackerState: simState
      });
      expect(track326.action).toBe('track_current_slide');
      expect(track326.dotEval.activeColumn).toBe('english');
      expect(track326.dotEval.wordIndex).toBeGreaterThanOrEqual(8);

      // Now congregation responds in English on 3-27:
      // "Truly the Father is Holy, truly the Son is Holy, and truly the Holy Spirit is Holy"
      const spokenEng327 = tracker.createObservationProfile('TRURITIBATIRISKURITRURITISAMISKURIAMTRURITIKURISBIRITISKURI');
      const adv327 = tracker.evaluateLiturgicalStep({
        obsProfile: spokenEng327,
        rms: 0.05,
        phoneDensity: 0.45,
        windowDurationMs: 450,
        currentSlideIdx: 0,
        graph,
        shadowBranches: null,
        trackerState: simState
      });
      expect(adv327.action).toBe('advance_local');
      expect(adv327.targetSlideIndex).toBe(1);
    });

    it('never sets inline style.position on .prayer-card (preventing transition-fade black slides) and suppresses cross-column dot glide', () => {
      const container = document.createElement('div');
      container.id = 'prayer-display';
      container.className = 'transition-fade';
      container.innerHTML = `
        <div class="prayer-card active-slide" data-card-id="2-72">
          <div class="language-section lang-english"><p class="language-text">፨ THE ORDER OF THE LITURGY ፨<br>In the Name of the Father, of the Son, and of the Holy Spirit, One God, Amen</p></div>
          <div class="language-section lang-geez_script"><p class="language-text">፨ ሥርዓተ ቅዳሴ ፨<br>በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ አሜን።</p></div>
        </div>
      `;
      document.body.appendChild(container);
      const card = container.querySelector('.prayer-card');
      expect(card.style.position).toBe('');

      const meta = tracker.ensureSlideInstrumented(card);
      expect(card.style.position).toBe('');
      expect(meta.colSpans.english[5].textContent).toBe('In');
      expect(meta.primaryDot.classList.contains('no-glide')).toBe(true);

      tracker.cleanupInstrumentedSlide();
      expect(card.style.position).toBe('');
      container.remove();
    });

    it('skips unspoken ፨...፨ banners & (...) glosses while locking activeColumn to English without drifting across columns', () => {
      const s0 = (kidaseDataObj.order || []).find(p => /ORDER OF THE LITURGY/i.test(p.english || ''));
      const s275 = (kidaseDataObj.order || []).find(p => p.chapter === '2' && p.stanza === '75');
      const s31 = (kidaseDataObj.order || []).find(p => p.chapter === '3' && p.stanza === '1');
      const graph = tracker.buildLiturgicalSlideGraph([s0, s275, s31], {
        languages: ['geez_script', 'amharic_script', 'english']
      });

      const eng0 = graph.nodes[0].columns.english;
      expect(eng0.words.slice(0, 5).every(w => w.isUnspokenRubric)).toBe(true);
      expect(eng0.words[5].surface).toBe('In');
      expect(eng0.words[5].isUnspokenRubric).toBe(false);
      expect(eng0.zemaStates[0].wordIndex).toBe(5);

      const eng31 = graph.nodes[2].columns.english;
      const fullIdx = eng31.words.findIndex(w => w.surface.toLowerCase() === 'full');
      expect(fullIdx).toBeGreaterThanOrEqual(2);
      expect(eng31.words[fullIdx].isUnspokenRubric).toBe(true);

      const simState = {
        ...tracker.state,
        isActive: true,
        autonomyMode: 'copilot',
        activeScope: 'anchor',
        lockedSpokenColumn: null,
        _colLockCandidate: null,
        _colLockStreak: 0,
        _colChallenger: null,
        _colChallengerStreak: 0,
        unmatchedVoicedMs: 0,
        suppressedTargets: new Map()
      };

      // Feed spoken English CTC skeleton for "In the Name of the Father, of the Son, and of the Holy Spirit, One God, Amen"
      const engChantObs = tracker.createObservationProfile('IMTIMIMABTIBATIRABTISAMAMTABTIKURISBIRITUAMKATAMIM');
      const r1 = tracker.evaluateLiturgicalStep({
        obsProfile: engChantObs,
        rms: 0.05,
        phoneDensity: 0.40,
        windowDurationMs: 450,
        currentSlideIdx: 0,
        graph,
        shadowBranches: null,
        trackerState: simState
      });
      expect(r1.action).toBe('track_current_slide');
      expect(r1.dotEval.activeColumn).toBe('english');
      expect(simState.lockedSpokenColumn).toBe('english');
      expect(r1.dotEval.wordIndex).toBeGreaterThanOrEqual(15);

      // Even if a transient ambiguous 1-word "Amen" ("AMIM") arrives next, column MUST stay locked on 'english'!
      const sharedAmenObs = tracker.createObservationProfile('AMIMAMIM');
      const r2 = tracker.evaluateLiturgicalStep({
        obsProfile: sharedAmenObs,
        rms: 0.04,
        phoneDensity: 0.30,
        windowDurationMs: 450,
        currentSlideIdx: 0,
        graph,
        shadowBranches: null,
        trackerState: simState
      });
      expect(simState.lockedSpokenColumn).toBe('english');
      if (r2.dotEval && r2.dotEval.activeColumn) {
        expect(r2.dotEval.activeColumn).toBe('english');
      }
    });

    it('advances +1 after finishing the final word + acoustic pause (English >= 500ms, Ge\'ez >= 1650ms) without false-advancing on mid-slide silence or voiced Zema sustain', () => {
      const sOpening = (kidaseDataObj.order || []).find(p => /ORDER OF THE LITURGY/i.test(p.english || ''));
      const s275 = (kidaseDataObj.order || []).find(p => p.chapter === '2' && p.stanza === '75');
      const graph = tracker.buildLiturgicalSlideGraph([sOpening, s275], {
        languages: ['english', 'geez_script']
      });

      const makePosteriors = (clsSeq, rmsVal = 0.05) => {
        const NUM_C = 10;
        const post = new Float32Array(clsSeq.length * NUM_C);
        const rms = new Float32Array(clsSeq.length).fill(rmsVal);
        for (let t = 0; t < clsSeq.length; t++) {
          const target = clsSeq[t];
          for (let c = 0; c < NUM_C; c++) {
            post[t * NUM_C + c] = c === target ? -0.10 : -4.2;
          }
        }
        return { post, rms };
      };

      // 1. Mid-slide English pause MUST NOT advance
      const engState = {
        ...tracker.state,
        isActive: true,
        autonomyMode: 'copilot',
        activeScope: 'anchor',
        lockedSpokenColumn: 'english',
        _viterbiSession: null,
        _endOfSlideMeta: null,
        endOfSlideSilentMs: 0,
        lastSlideAdvanceAt: 0,
        unmatchedVoicedMs: 0,
        suppressedTargets: new Map()
      };
      const midObs = tracker.createObservationProfile('IMTIMIMABTIBATIR');
      const midFrames = makePosteriors([2, 5, 6, 2, 5, 2, 5, 1, 4, 6, 2, 4, 1, 6, 2, 9]);
      tracker.evaluateLiturgicalStep({
        obsProfile: midObs,
        rms: 0.05,
        phoneDensity: 0.45,
        hopPosteriors: midFrames.post,
        hopRms: midFrames.rms,
        windowDurationMs: 450,
        currentSlideIdx: 0,
        graph,
        shadowBranches: null,
        trackerState: engState,
        nowMs: 1000
      });
      const midPause = tracker.evaluateLiturgicalStep({
        obsProfile: tracker.createObservationProfile(''),
        rms: 0.001,
        phoneDensity: 0,
        windowDurationMs: 800,
        currentSlideIdx: 0,
        graph,
        shadowBranches: null,
        trackerState: engState,
        nowMs: 1800
      });
      expect(midPause.action).toBe('hold_silent');

      // 2. Completing the English slide ("...One God, Amen") + 550ms true silence advances +1 (`end_of_slide_pause`)
      const engFullObs = tracker.createObservationProfile('IMTIMIMABTIBATIRABTISAMAMTABTIKURISBIRITUAMKATAMIM');
      const endStep = tracker.evaluateLiturgicalStep({
        obsProfile: engFullObs,
        rms: 0.05,
        phoneDensity: 0.45,
        windowDurationMs: 450,
        currentSlideIdx: 0,
        graph,
        shadowBranches: null,
        trackerState: engState,
        nowMs: 3000
      });
      expect(endStep.dotEval.wordIndex).toBeGreaterThanOrEqual(20);

      const postSilenceAdvance = tracker.evaluateLiturgicalStep({
        obsProfile: tracker.createObservationProfile(''),
        rms: 0.001,
        phoneDensity: 0,
        windowDurationMs: 550,
        currentSlideIdx: 0,
        graph,
        shadowBranches: null,
        trackerState: engState,
        nowMs: 3600
      });
      expect(postSilenceAdvance.action).toBe('advance_local');
      expect(postSilenceAdvance.reason).toBe('end_of_slide_pause');
      expect(postSilenceAdvance.targetSlideIndex).toBe(1);

      // 3. Ge'ez end-of-slide: voiced sustain with low phoneDensity (rms >= 0.008) must NOT trigger pause advance,
      //    while true acoustic silence (`rms < 0.008`) >= 1650ms DOES advance +1!
      const ap26 = kidaseDataObj.apostles.find(p => p.stanza === '26'); // ዲያቆን፤ ውስተ ጽባሕ ነጽሩ
      const ap27 = kidaseDataObj.apostles.find(p => p.stanza === '27');
      const gzGraph = tracker.buildLiturgicalSlideGraph([ap26, ap27], { languages: ['geez_script', 'english'] });
      const gzState = {
        ...tracker.state,
        isActive: true,
        autonomyMode: 'copilot',
        activeScope: 'anchor',
        lockedSpokenColumn: 'geez_script',
        _viterbiSession: null,
        _endOfSlideMeta: null,
        endOfSlideSilentMs: 0,
        lastSlideAdvanceAt: 0,
        unmatchedVoicedMs: 0,
        suppressedTargets: new Map()
      };
      // Classes: 0:_, 1:A, 2:I, 3:U, 4:B, 5:M, 6:T, 7:S, 8:K, 9:R
      // `ውስተ ጽባሕ ነጽሩ` -> U S T A  S B A K  M A S R U
      const gzSeq = [];
      for (const cls of [3, 7, 6, 1, 7, 4, 1, 8, 5, 1, 7, 9, 3]) {
        gzSeq.push(cls, cls, cls);
      }
      const gzFrames = makePosteriors(gzSeq, 0.05);
      const gzTrack = tracker.evaluateLiturgicalStep({
        obsProfile: tracker.createObservationProfile('USTASBAK'),
        rms: 0.05,
        phoneDensity: 0.45,
        hopPosteriors: gzFrames.post,
        hopRms: gzFrames.rms,
        windowDurationMs: 600,
        currentSlideIdx: 0,
        graph: gzGraph,
        shadowBranches: null,
        trackerState: gzState,
        nowMs: 2000
      });
      expect(gzTrack.action).toBe('track_current_slide');
      expect(gzTrack.dotEval.activeColumn).toBe('geez_script');
      expect(gzState._endOfSlideMeta?.reached).toBe(true);

      // Loud steady melisma (rms=0.05, phoneDensity=0.01) must NOT count as silence!
      const voicedLowDensity = tracker.evaluateLiturgicalStep({
        obsProfile: tracker.createObservationProfile(''),
        rms: 0.05,
        phoneDensity: 0.01,
        hopPosteriors: makePosteriors([3, 3, 3], 0.05).post,
        hopRms: makePosteriors([3, 3, 3], 0.05).rms,
        windowDurationMs: 2000,
        currentSlideIdx: 0,
        graph: gzGraph,
        shadowBranches: null,
        trackerState: gzState,
        nowMs: 4000
      });
      expect(voicedLowDensity.action).toBe('hold_silent');
      expect(gzState.endOfSlideSilentMs).toBe(0);

      // Brief 900ms Ge'ez pause still holds (< 1650ms Zema breath guard)
      const shortGzPause = tracker.evaluateLiturgicalStep({
        obsProfile: tracker.createObservationProfile(''),
        rms: 0.001,
        phoneDensity: 0,
        windowDurationMs: 900,
        currentSlideIdx: 0,
        graph: gzGraph,
        shadowBranches: null,
        trackerState: gzState,
        nowMs: 4900
      });
      expect(shortGzPause.action).toBe('hold_silent');

      // Continuing to >= 1650ms total silence advances +1 cleanly
      const finalGzPause = tracker.evaluateLiturgicalStep({
        obsProfile: tracker.createObservationProfile(''),
        rms: 0.001,
        phoneDensity: 0,
        windowDurationMs: 900,
        currentSlideIdx: 0,
        graph: gzGraph,
        shadowBranches: null,
        trackerState: gzState,
        nowMs: 5800
      });
      expect(finalGzPause.action).toBe('advance_local');
      expect(finalGzPause.reason).toBe('end_of_slide_pause');
      expect(finalGzPause.targetSlideIndex).toBe(1);
    });

    it('renders Ge\'ez word-0 red dot on the very first voiced hop without multi-hop lock delay', () => {
      const s326 = (kidaseDataObj.order || []).find(p => p.chapter === '3' && p.stanza === '26');
      const s327 = (kidaseDataObj.order || []).find(p => p.chapter === '3' && p.stanza === '27');
      const graph = tracker.buildLiturgicalSlideGraph([s326, s327], {
        languages: ['english', 'geez_script']
      });

      const makePosteriors = (clsSeq) => {
        const NUM_C = 10;
        const post = new Float32Array(clsSeq.length * NUM_C);
        const rms = new Float32Array(clsSeq.length).fill(0.05);
        for (let t = 0; t < clsSeq.length; t++) {
          const target = clsSeq[t];
          for (let c = 0; c < NUM_C; c++) {
            post[t * NUM_C + c] = c === target ? -0.10 : -4.2;
          }
        }
        return { post, rms };
      };

      const simState = {
        ...tracker.state,
        isActive: true,
        autonomyMode: 'copilot',
        activeScope: 'anchor',
        lockedSpokenColumn: null,
        activeSpokenColumn: null,
        _viterbiSession: null,
        unmatchedVoicedMs: 0,
        suppressedTargets: new Map()
      };

      // First hop of `አሐዱ` (`A K I T U`): emaLlr quickly exceeds 0.14 on word 0 (`አሐዱ`)
      const firstHop = makePosteriors([1, 1, 8, 8, 2, 2, 6, 6, 3, 3, 3, 3]);
      const step = tracker.evaluateLiturgicalStep({
        obsProfile: tracker.createObservationProfile('AKITU'),
        rms: 0.05,
        phoneDensity: 0.45,
        hopPosteriors: firstHop.post,
        hopRms: firstHop.rms,
        windowDurationMs: 450,
        currentSlideIdx: 0,
        graph,
        shadowBranches: null,
        trackerState: simState,
        nowMs: 500
      });
      expect(step.action).toBe('track_current_slide');
      expect(step.dotEval.activeColumn).toBe('geez_script');
      expect(step.dotEval.wordIndex).toBe(0);
    });

    it('marks Chanting Tracker and Zaima Notation as Beta, prunes scope popover options, and gates Zaima behind Scribe login', () => {
      // 1. Left & Right sidebars carry (Beta) tags
      expect(document.body.textContent).toContain('Slide Chanting Tracker (Beta)');
      const zaimaRow = document.getElementById('zaima-notation-setting-row');
      expect(zaimaRow).toBeTruthy();
      expect(zaimaRow.textContent).toContain('St. Yared Notation | የዜማ ምልክት (Beta)');
      // Gated behind Scribe login (hidden by default when logged out)
      expect(zaimaRow.style.display).toBe('none');

      // Also verify React LeftSidebar & RightSidebar source match the Beta tags & scribe gate
      const leftTsx = fs.readFileSync(path.resolve(process.cwd(), 'src/components/LeftSidebar.tsx'), 'utf8');
      const rightTsx = fs.readFileSync(path.resolve(process.cwd(), 'src/components/RightSidebar.tsx'), 'utf8');
      expect(leftTsx).toContain('Slide Chanting Tracker (Beta)');
      expect(rightTsx).toContain('St. Yared Notation | የዜማ ምልክት (Beta)');
      expect(rightTsx).toContain("id=\"zaima-notation-setting-row\"");

      // 2. LITURGY_SCOPES has 5 options (removing `prep` and `theotokia`)
      const scopeIds = tracker.LITURGY_SCOPES.map(s => s.id);
      expect(scopeIds).toEqual(['anchor', 'unknown', 'matins_kidan', 'liturgy_word', 'anaphora']);
      expect(scopeIds).not.toContain('prep');
      expect(scopeIds).not.toContain('theotokia');

      // 3. Follow scope popover displays Beta Feature badge/notice & pruned options
      const ctrl = tracker.createSlideAutoFollowControl();
      document.body.appendChild(ctrl);
      ctrl.querySelector('.liturgy-scope-btn').click();
      const pop = document.getElementById('liturgy-scope-popover');
      expect(pop).toBeTruthy();
      expect(pop.style.display).toBe('block');
      expect(pop.textContent).toMatch(/Beta/i);
      expect(pop.textContent).toContain('Beta Feature');
      expect(pop.querySelectorAll('.liturgy-scope-option').length).toBe(5);
      expect(pop.textContent).not.toContain('Preparatory Service & Psalms');
      expect(pop.textContent).not.toContain('Praises of the Mother of God');
      pop.style.display = 'none';
      ctrl.remove();

      // 4. Even if showZaimaNotation is forced true without Scribe login, prayer cards do NOT render Zaima markup
      const zaimaToggle = document.getElementById('show-zaima-notation-toggle');
      if (zaimaToggle) {
        zaimaToggle.checked = true;
        zaimaToggle.dispatchEvent(new Event('change', { bubbles: true }));
      }
      app.renderPrayers();
      expect(document.querySelectorAll('#prayer-display .zaima-word').length).toBe(0);
      if (zaimaToggle) {
        zaimaToggle.checked = false;
        zaimaToggle.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  });
});

