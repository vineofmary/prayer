import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { loadApp } from './helpers/loadApp.js';

describe('Learning & Games Module, Interlinear Ge\'ez, and Header/Sidebar Reorganization', () => {
  let app;
  let lexicon;
  let learning;

  beforeAll(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    app = loadApp();

    const lexiconPath = path.resolve(process.cwd(), 'app/src/main/assets/js/geez_lexicon.js');
    const lexiconCode = fs.readFileSync(lexiconPath, 'utf8');
    new Function('window', 'document', lexiconCode)(window, document);
    lexicon = window.GeezLexiconService;

    const learningPath = path.resolve(process.cwd(), 'app/src/main/assets/js/learning_service.js');
    const learningCode = fs.readFileSync(learningPath, 'utf8');
    new Function('window', 'document', learningCode)(window, document);
    learning = window.MountOfMercyLearning;
  });

  describe('Top Bar & Left Settings Panel Reorganization', () => {
    it('places the Church/Home Learning & Games button (#learning-mode-toggle-header) in the top header actions', () => {
      const headerBtn = document.querySelector('.header-actions #learning-mode-toggle-header');
      expect(headerBtn).not.toBeNull();
      const svgPath = headerBtn.querySelector('svg path');
      expect(svgPath).not.toBeNull();
      expect(svgPath.getAttribute('d')).toContain('M18 12.22V9');
    });

    it('moves the Toggle Light/Dark Mode button (#theme-toggle) out of the top header and into Pick Theme in #left-sidebar', () => {
      const headerThemeBtn = document.querySelector('.header-actions #theme-toggle');
      expect(headerThemeBtn).toBeNull();

      const sidebarThemeBtn = document.querySelector('#left-sidebar .setting-group #theme-toggle');
      expect(sidebarThemeBtn).not.toBeNull();
      expect(sidebarThemeBtn.parentElement.querySelector('#palette-selector')).not.toBeNull();
    });

    it('moves the Help button (#help-button) out of the top header and under Share Feedback (#feedback-button) in #left-sidebar', () => {
      const headerHelpBtn = document.querySelector('.header-actions #help-button');
      expect(headerHelpBtn).toBeNull();

      const sidebarHelpBtn = document.querySelector('#left-sidebar .feedback-section #help-button');
      const feedbackBtn = document.querySelector('#left-sidebar .feedback-section #feedback-button');
      expect(sidebarHelpBtn).not.toBeNull();
      expect(feedbackBtn).not.toBeNull();
    });
  });

  describe('Sunday School Classes & Age Tiers', () => {
    it('defines St. Kirkos\' Kids (Under 7), St. Arsema\'s Kids (7-9), St. John\'s Kids (10-12), and St. Michael\'s Kids (13+)', () => {
      expect(lexicon).toBeDefined();
      const classes = lexicon.SUNDAY_SCHOOL_CLASSES;
      expect(classes).toHaveLength(4);

      expect(classes[0].id).toBe('st_kirkos');
      expect(classes[0].name).toBe("St. Kirkos' Kids");
      expect(classes[0].ageRange).toContain('Under 7');
      expect(classes[0].boardSize).toBe(3);
      expect(classes[0].allowedTabs).toEqual(['blitz', 'matcher']);

      expect(classes[1].id).toBe('st_arsema');
      expect(classes[1].name).toBe("St. Arsema's Kids");
      expect(classes[1].ageRange).toContain('7–9');
      expect(classes[1].boardSize).toBe(4);
      expect(classes[1].allowedTabs).toEqual(['blitz', 'jeopardy', 'matcher']);

      expect(classes[2].id).toBe('st_john');
      expect(classes[2].name).toBe("St. John's Kids");
      expect(classes[2].ageRange).toContain('10–12');
      expect(classes[2].boardSize).toBe(5);
      expect(classes[2].allowedTabs).toEqual(['blitz', 'jeopardy', 'matcher']);

      expect(classes[3].id).toBe('st_michael');
      expect(classes[3].name).toBe("St. Michael's Kids");
      expect(classes[3].ageRange).toContain('13+');
      expect(classes[3].boardSize).toBe(5);
      expect(classes[3].allowedTabs).toEqual(['blitz', 'jeopardy', 'matcher', 'interlinear']);
    });

    it('excludes any unwanted labels, Morphology in pack title, or speaker/audio buttons', () => {
      const lexiconRaw = fs.readFileSync(path.resolve(process.cwd(), 'app/src/main/assets/js/geez_lexicon.js'), 'utf8');
      const learningRaw = fs.readFileSync(path.resolve(process.cwd(), 'app/src/main/assets/js/learning_service.js'), 'utf8');
      const combined = lexiconRaw + '\n' + learningRaw;

      expect(combined).not.toContain('HDMI Arrival Warm-Up');
      expect(combined).not.toContain('Little Lambs');
      expect(combined).not.toContain('Young Deacons');
      expect(combined).not.toContain('Daily Prayer & Morphology');
      expect(lexicon.MATCHER_PACKS.map(p => p.title)).toContain("Daily Prayer & The Lord's Prayer");
      expect(combined).not.toContain('🔊');
      expect(combined).not.toContain('Hear Pronunciation');
    });
  });

  describe('BibleHub-Style Ge\'ez Interlinear Morphological Analyzer', () => {
    it('resolves curated liturgical words with root, prefix/suffix breakdown, and cognates', () => {
      const besme = lexicon.analyzeGeezWord('በስመ');
      expect(besme.geez).toBe('በስመ');
      expect(besme.meaning).toContain('In the name of');
      expect(besme.breakdown).toContain('በ');

      const abune = lexicon.analyzeGeezWord('አቡነ');
      expect(abune.meaning).toContain('Our Father');
      expect(abune.breakdown).toContain('-ነ');
    });

    it('dynamically decomposes compound Ge\'ez prefixes and suffixes', () => {
      const dynamicWord = lexicon.analyzeGeezWord('ወበሰላምነ');
      expect(dynamicWord).not.toBeNull();
      expect(dynamicWord.breakdown).toContain('ወበ-');
      expect(dynamicWord.breakdown).toContain('ሰላም');
      expect(dynamicWord.breakdown).toContain('-ነ');
    });

    it('resolves loanwords and prefixed loanwords using LOANWORD_MAPPING', () => {
      const kristos = lexicon.analyzeGeezWord('ክርስቶስ');
      expect(kristos).not.toBeNull();
      expect(kristos.pos).toContain('Loanword (Greek)');
      expect(kristos.meaning).toContain('Anointed One');

      const beKristos = lexicon.analyzeGeezWord('በክርስቶስ');
      expect(beKristos).not.toBeNull();
      expect(beKristos.breakdown).toContain('በ-');
      expect(beKristos.breakdown).toContain('ክርስቶስ');
      expect(beKristos.meaning).toContain('in / by / with');

      const leMaryam = lexicon.analyzeGeezWord('ለማርያም');
      expect(leMaryam).not.toBeNull();
      expect(leMaryam.breakdown).toContain('ለ-');
      expect(leMaryam.breakdown).toContain('ማርያም');
    });
  });

  describe('Procedural Classroom Jeopardy & Tailoring to Selected Liturgical Readings', () => {
    it('generates 100-500pt clues dynamically from the app\'s active liturgical readings', () => {
      const dynamicClues = learning.generateSelectedReadingsClues();
      expect(dynamicClues).toHaveLength(5);
      expect(dynamicClues.map(c => c.points)).toEqual([100, 200, 300, 400, 500]);

      const snapshot = app.getActiveLectionaryReadingsSnapshot();
      const gospelRef = snapshot.kidaseLectionaryRefs.gospel;
      const paulineRef = snapshot.kidaseLectionaryRefs.pauline;
      expect(dynamicClues[0].prompt).toContain(gospelRef);
      expect(dynamicClues[1].prompt).toContain(paulineRef);
    });

    it('builds procedural boards according to class tier specifications', () => {
      const state = learning.getState();

      state.selectedClassId = 'st_michael';
      const michaelBoard = learning.buildProceduralJeopardyBoard();
      expect(michaelBoard).toHaveLength(5);
      expect(michaelBoard[0].clues).toHaveLength(5);

      state.selectedClassId = 'st_john';
      const johnBoard = learning.buildProceduralJeopardyBoard();
      expect(johnBoard).toHaveLength(5);
      expect(johnBoard[0].clues).toHaveLength(5);

      state.selectedClassId = 'st_arsema';
      const arsemaBoard = learning.buildProceduralJeopardyBoard();
      expect(arsemaBoard).toHaveLength(4);
      expect(arsemaBoard[0].clues).toHaveLength(4);

      state.selectedClassId = 'st_kirkos';
      const kirkosBoard = learning.buildProceduralJeopardyBoard();
      expect(kirkosBoard).toHaveLength(3);
      expect(kirkosBoard[0].clues).toHaveLength(3);

      state.selectedClassId = 'st_michael';
    });
  });

  describe('Refined Learning Games UI, Mascot, Themes, Scoreboard, and Tab Filtering', () => {
    it('removes Learning Games title, shows Oakland plushy mascot with squish animation, and uses compact class dropdown', () => {
      learning.toggleLearningMode(true);
      const learningView = document.getElementById('learning-view');
      expect(learningView).not.toBeNull();
      expect(learningView.classList.contains('hidden')).toBe(false);

      // No "Learning Games" title or Ge'ez badge
      expect(learningView.querySelector('.learning-title')).toBeNull();
      expect(learningView.querySelector('.learning-brand-badge')).toBeNull();

      // Plushy Oakland parish mascot icon with entry squish animation
      const mascotBtn = learningView.querySelector('#learning-plushy-mascot-btn');
      expect(mascotBtn).not.toBeNull();
      const mascotImg = mascotBtn.querySelector('.learning-plushy-icon');
      expect(mascotImg).not.toBeNull();
      expect(mascotImg.getAttribute('src')).toContain('img/oakland_dmkm-eotc.png');
      expect(mascotImg.classList.contains('plushy-squish-anim')).toBe(true);

      // Compact class dropdown instead of 4 wide pills
      const classSelect = learningView.querySelector('#learning-class-select');
      expect(classSelect).not.toBeNull();
      const options = Array.from(classSelect.querySelectorAll('option'));
      expect(options).toHaveLength(4);
      expect(options[0].textContent).toBe("St. Kirkos' Kids (Under 7)");
      expect(options[3].textContent).toBe("St. Michael's Kids (Ages 13+)");

      // Classroom TV Display button hidden unless external display / HDMI is connected
      expect(learningView.querySelector('#learning-tv-toggle-btn')).toBeNull();

      const state = learning.getState();
      expect(state.selectedClassId).toBe('st_michael');
      expect(state.activeTab).toBe('blitz');

      // Hides Kidase Order tab across all classes
      const tabBtns = Array.from(learningView.querySelectorAll('.learning-tab-btn'));
      const labels = tabBtns.map(btn => btn.querySelector('.tab-label').textContent);
      expect(labels).toEqual(['Trivia', 'Jeopardy', 'Match It', "Ge'ez Reader"]);

      // Trivia button copy updates: "Reveal Clue" and "Next →"
      const revealBtn = learningView.querySelector('#blitz-reveal-phonetic-btn');
      expect(revealBtn).not.toBeNull();
      expect(revealBtn.textContent).toBe('Reveal Clue');
      const nextBtn = learningView.querySelector('#blitz-next-card-btn');
      expect(nextBtn).not.toBeNull();
      expect(nextBtn.textContent).toBe('Next →');
    });

    it('filters available tabs based on selected Sunday school class via dropdown', () => {
      const learningView = document.getElementById('learning-view');

      // Select St. Kirkos' Kids (Under 7): only Trivia and Match It should be visible
      let classSelect = learningView.querySelector('#learning-class-select');
      classSelect.value = 'st_kirkos';
      classSelect.dispatchEvent(new Event('change'));
      let tabBtns = Array.from(learningView.querySelectorAll('.learning-tab-btn'));
      let tabIds = tabBtns.map(btn => btn.getAttribute('data-tab'));
      expect(tabIds).toEqual(['blitz', 'matcher']);

      // Select St. Arsema's Kids (7–9): Trivia, Jeopardy, Match It
      classSelect = learningView.querySelector('#learning-class-select');
      classSelect.value = 'st_arsema';
      classSelect.dispatchEvent(new Event('change'));
      tabBtns = Array.from(learningView.querySelectorAll('.learning-tab-btn'));
      tabIds = tabBtns.map(btn => btn.getAttribute('data-tab'));
      expect(tabIds).toEqual(['blitz', 'jeopardy', 'matcher']);

      // Select St. John's Kids (10–12): Trivia, Jeopardy, Match It
      classSelect = learningView.querySelector('#learning-class-select');
      classSelect.value = 'st_john';
      classSelect.dispatchEvent(new Event('change'));
      tabBtns = Array.from(learningView.querySelectorAll('.learning-tab-btn'));
      tabIds = tabBtns.map(btn => btn.getAttribute('data-tab'));
      expect(tabIds).toEqual(['blitz', 'jeopardy', 'matcher']);

      // Return to St. Michael's Kids (13+): Trivia, Jeopardy, Match It, Ge'ez Reader
      classSelect = learningView.querySelector('#learning-class-select');
      classSelect.value = 'st_michael';
      classSelect.dispatchEvent(new Event('change'));
      tabBtns = Array.from(learningView.querySelectorAll('.learning-tab-btn'));
      tabIds = tabBtns.map(btn => btn.getAttribute('data-tab'));
      expect(tabIds).toEqual(['blitz', 'jeopardy', 'matcher', 'interlinear']);
    });

    it('renders team scoreboard below stage body with default 2 teams and "Your Turn" badge', () => {
      const learningView = document.getElementById('learning-view');
      const stageBody = learningView.querySelector('#learning-stage-body');
      const scoreboard = learningView.querySelector('.learning-scoreboard-bar');
      expect(scoreboard).not.toBeNull();

      // Verify scoreboard is placed AFTER #learning-stage-body
      expect(stageBody.nextElementSibling).toBe(scoreboard);

      // Verify "Your Turn" pill text
      const turnBadge = scoreboard.querySelector('.team-turn-badge');
      expect(turnBadge).not.toBeNull();
      expect(turnBadge.textContent).toBe('Your Turn');

      // Default team count is 2
      const teamInputs = Array.from(scoreboard.querySelectorAll('.team-name-input'));
      expect(teamInputs.length).toBe(2);
      expect(teamInputs[0].value).toBe('Team #1');
      expect(teamInputs[1].value).toBe('Team #2');

      const countSelect = scoreboard.querySelector('#scoreboard-team-count');
      expect(countSelect).not.toBeNull();
      expect(countSelect.value).toBe('2');

      // Change team count to 4
      countSelect.value = '4';
      countSelect.dispatchEvent(new Event('change'));
      const updatedInputs = Array.from(document.querySelectorAll('.learning-scoreboard-bar .team-name-input'));
      expect(updatedInputs.length).toBe(4);
    });

    it('places Vocabulary Pack controls below matching cards and removes Moves counter in Match It', () => {
      const learningView = document.getElementById('learning-view');
      const matcherTabBtn = learningView.querySelector('[data-tab="matcher"]');
      matcherTabBtn.click();

      const boardCols = learningView.querySelector('.matcher-board-columns');
      const bottomControls = learningView.querySelector('.matcher-bottom-controls');
      expect(boardCols).not.toBeNull();
      expect(bottomControls).not.toBeNull();
      expect(boardCols.nextElementSibling).toBe(bottomControls);
      expect(learningView.textContent).not.toContain('Moves:');
    });

    it('renders Ge\'ez Reader in BibleHub inline order (phonetic top, Ge\'ez second) with Note at bottom', () => {
      const learningView = document.getElementById('learning-view');

      // Switch to Ge'ez Reader tab
      const readerTabBtn = learningView.querySelector('[data-tab="interlinear"]');
      readerTabBtn.click();

      // Drawer should initially not be in DOM
      expect(document.getElementById('interlinear-inspector-card')).toBeNull();

      // Verify word stack order: phonetic first, Ge'ez second, English third
      const wordBtn = learningView.querySelector('[data-interlinear-word]');
      expect(wordBtn).not.toBeNull();
      const childrenClasses = Array.from(wordBtn.children).map(el => el.className);
      expect(childrenClasses[0]).toContain('iw-phonetic');
      expect(childrenClasses[1]).toContain('iw-geez');
      expect(childrenClasses[2]).toContain('iw-english');

      // Verify Note banner is at the bottom of .interlinear-workspace
      const workspace = learningView.querySelector('.interlinear-workspace');
      expect(workspace.lastElementChild.classList.contains('interlinear-pedagogical-banner')).toBe(true);

      // Click the first word stack
      wordBtn.click();

      // Drawer should now be visible
      const inspectorCard = document.getElementById('interlinear-inspector-card');
      expect(inspectorCard).not.toBeNull();
      const closeBtn = document.getElementById('inspector-close-btn');
      expect(closeBtn).not.toBeNull();

      // Click close button
      closeBtn.click();
      expect(document.getElementById('interlinear-inspector-card')).toBeNull();
    });

    it('supports configurable Game Mode vibes and celebratory answer animations', () => {
      const learningView = document.getElementById('learning-view');
      const vibeSelect = learningView.querySelector('#learning-vibe-select');
      expect(vibeSelect).not.toBeNull();
      vibeSelect.value = 'st_john_meadow';
      vibeSelect.dispatchEvent(new Event('change'));
      expect(learningView.getAttribute('data-game-theme')).toBe('st_john_meadow');

      const triviaTabBtn = learningView.querySelector('[data-tab="blitz"]');
      triviaTabBtn.click();
      expect(learningView.querySelector('.blitz-pack-tag')).toBeNull();
      expect(learningView.querySelector('.jeopardy-board-info')).toBeNull();
    });
  });
});
