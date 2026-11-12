# Agent Guidelines & Operational Contract: The Mount of Mercy

This document defines the working relationship, responsibilities, testing standards, pedagogical foundations, and development protocols for any AI Agent working in this repository.

---

## 1. The Core Philosophy: Product Engineer & AI Agent Division of Roles

Based on insights from Amman's Developer Experience (Q4 2026) and modern AI-augmented engineering:

### The Human Role (Amman — Product Engineer & PM)
> *"Find out what people need, define 'good', and ship it. Turn what exists only in people's heads into code; turn the sense of the problem into a spec of the problem so agents can build it."*

- **Decide what to build:** Set product vision, liturgy priorities, prayer additions, Sunday School formation tools, and user experience direction.
- **Define "good":** Set quality bars, spiritual fidelity, linguistic accuracy, and design taste.
- **Ship to production:** Review verified changes, merge to `main`, and deploy to web/Android users.
- **Make it delightful & useful:** Ensure the app remains reverent, beautiful, accessible, and responsive for daily worship and parish education.
- **Scale:** Grow the app's reach across parishes, languages, and diaspora communities.

### The Agent's Role (Builder, Tester & Quality Guardian)
- **Implement with Excellence:** Turn specifications and requirements into clean, idiomatic code without unnecessary complexity.
- **Uncover Blind Spots & Edge Cases:** Proactively identify boundary conditions, rare language combinations, script variations, and platform quirks.
- **Protect Against Regressions:** Never break existing features. Every change must be verified against the test harness.
- **Lead Testing & Verification:** Maintain and expand the automated testing suite (`npm test`). Do NOT expect Amman to do manual QA.

---

## 2. Theological & Pedagogical Context (Why We Build What We Build)

Grounded in **Fr. Eshetu Gebresenbet's 2025 Thesis** (*Religious Education in the Ethiopian Orthodox Tewahedo Church: Challenges and Prospects in the Diaspora*) and over two years of parish usage:

1. **Bridging the Language & Liturgical Comprehension Gap:**
   - Empirical survey findings show that **88% of diaspora youth** struggle to understand the theological meaning and flow of the Divine Liturgy (*Qidase*) and sacraments due to the Ge'ez/Amharic language barrier, while **83% of youth** prefer interactive, peer-centered learning.
   - Features like the **BibleHub-Style Ge'ez Interlinear Explorer** (`js/geez_lexicon.js` & `js/learning_service.js`), **Targuma Live Captioning** (`js/targuma_service.js`), and **Multi-Script Phonetic Transliteration** exist to make ancient liturgical worship intelligible without sacrificing reverence.
2. **Sunday School Parish Class Tiers:**
   - When building educational or classroom features (`#learning-view`), always respect the parish's three Sunday School classes and their patron saints:
     - **Hitsanat (`ሕፃናት` • Under 7):** Foundational sacred words, icons, and 3×3 visual games.
     - **St. Arsema's Class (`ቅድስት አርሴማ` • Ages 7–9):** Congregation responses (`ተዋሥኦ`), Priest/Deacon/People roles, and 4×4 games.
     - **St. John's Class (`ቅዱስ ዮሐንስ ወንጌላዊ` • Ages 10–12, Patron: St. John the Evangelist):** Deep Ge'ez root/prefix/suffix morphology, *Qidase* lectionary progression, and 5×5 Procedural Classroom Jeopardy tailored to the active liturgical readings selected in the app.

---

## 3. Mandatory Agent Verification Protocol

Before declaring any coding task complete or committing changes, **every Agent MUST follow this checklist**:

1. **Run the Automated Test Suite:**
   ```bash
   npm test
   ```
   All test files must pass (100% green). If any test fails, fix the code immediately before finishing.

2. **Add Tests for New or Modified Application Logic:**
   - If you modify or add functions in `app/src/main/assets/js/` (or `public/js/`), add corresponding unit tests in `tests/`.
   - Never remove or weaken existing tests unless the product specification intentionally changed.

3. **Verify Liturgy & Scripture Cryptographic Integrity:**
   ```bash
   npm run verify:integrity
   ```
   Ensures SHA-256 dataset hashes match the gold master checksums in `docs/liturgy_checksums.json`.

4. **Preserve WebView & Web Dual Compatibility:**
   - Mount of Mercy runs in two environments: Android Native Container (`MainActivity.kt` with `WebViewAssetLoader` serving `app/src/main/assets/`) and PWA (`public/` & `index.html`).
   - Any script or CSS changes must remain 100% synchronized across both `app/src/main/assets/` and `public/`.
   - Core functions must be exported via the non-intrusive export bridge (`window.__mountOfMercy` / `module.exports`) at the bottom of `script.js`.

---

## 4. Testing Architecture

The project uses **Vitest** with **Happy-DOM** for instant, sub-second testing:

- **Command to run all tests:** `npm test`
- **Command for watch mode during development:** `npm run test:watch`
- **Test Suites Location:** `tests/`
  - `tests/psalms.test.js`: Septuagint (LXX) $\leftrightarrow$ Masoretic (MT) Psalm chapter and verse boundary mappings.
  - `tests/geez.test.js`: Ethiopic numerals (`toGeez`, `toGeezNumeral`) and calendar calculations.
  - `tests/state.test.js`: Unicode-safe Base64 state encoding, URL synchronization, and slugification.
  - `tests/citations.test.js`: Liturgical edition citations (`getEnglishEditionCitation`, `getGeezEditionCitation`, etc.) and author attribution.
  - `tests/text_processing.test.js`: Chant identification, rubrication, and assembly response filtering.
  - `tests/learning.test.js`: Ge'ez Interlinear morphological decomposition, Sunday School class tiers (`Hitsanat`, `St. Arsema's Class`, `St. John's Class`), dynamic Jeopardy clue generation from selected lectionary readings, and UI header/sidebar layout verification.
  - `tests/setup.js`: Global test setup (Firebase mocks, index.html DOM hydration, browser API stubs).

---

## 5. Interaction & Deliverable Style

- **Single Diff Delivery:** Amman prefers all updated diffs or files directly in one consolidated response so he can review and accept them at once.
- **Commit Messages:** Follow Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`) in concise, one-line imperative format with no trailing period.
