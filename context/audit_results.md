# Technical Quality Audit — GGO WC 2026 Predictor

This report documents the results of a comprehensive code-level technical quality check across accessibility, performance, theming, responsive design, and anti-patterns. 

---

## Audit Health Score

| # | Dimension | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | **1/4** | Missing `for` attributes on login forms; lack of keyboard focus indicators and landmarks. |
| 2 | Performance | **2/4** | Unconditional `setInterval` re-renders full DOM every 30s; double Apps Script API calls on sync. |
| 3 | Responsive Design | **2/4** | Toast styling encapsulated inside mobile media query makes toasts invisible on desktop. |
| 4 | Theming | **2/4** | Token system bypassed in key UI components; no support for standard theme-switching. |
| 5 | Anti-Patterns | **1/4** | 3 conflicting scoring implementations; global namespace pollution in Apps Script causing temporal dead zone (TDZ) ReferenceErrors. |
| **Total** | | **8/20** | **Poor (Major overhaul needed)** |

---

## Anti-Patterns Verdict
**FAIL**: The codebase contains heavy AI aesthetic tells and structural anomalies.
- **Visual tells**: Glassmorphism login card with heavy background blur (`backdrop-filter`) and solid borders (`border: 1px solid rgba(0, 61, 165, 0.3)`); generic "DM Sans" and "Barlow Condensed" typography pairings with deep blue/red gradient backdrops.
- **Structural anomalies**: Redundant and contradictory business logic across client and backend files. Three separate scoring calculators, a completely stubbed leaderboard system, and global scope collisions in Google Apps Script files that lead to execution crashes.

---

## Executive Summary
- **Audit Health Score**: 8/20 (Poor)
- **Total Issues Found**: 14 issues
  - **P0 (Critical Blocking)**: 1
  - **P1 (Major Release Blocker)**: 6
  - **P2 (Minor UX/Aesthetic)**: 5
  - **P3 (Polish/Cleanup)**: 2

### Top Critical Issues
1. **[P0] `savePrediction` Crash**: Referencing `prediction` and `match` variables in the locked branch before they are defined, causing a fatal runtime exception.
2. **[P1] Apps Script ReferenceError**: Accessing `firebaseConfig.apiKey` in `src/main.js` while the config object is named `FIREBASE_CONFIG`, crashing backend routing.
3. **[P1] Multi-Source Scoring Conflict**: 3 different point allocation algorithms in the codebase (15/8/5/3/0 vs 15/5/3/0 vs 4/3/2/0).
4. **[P1] Results `matchId` API Mismatch**: The sync script stores live scores under API-Football fixture IDs, whereas the app renders matches using local sequential integers, resulting in score updates never aligning.
5. **[P1] Stubbed Leaderboard Updater**: `src/leaderboard.js` is a template containing empty arrays, writing blank leaderboards on daily triggers.

---

## Detailed Findings by Severity

### P0: Blocking (Fix Immediately)

#### 1. [P0] savePrediction Runtime Crash
- **Location**: [app.js:L422-L461](file:///c:/Users/abdel/OneDrive/Desktop/ggofiles/ggowcpredictor/scripts/app.js#L422-L461)
- **Category**: Performance / Code Correctness
- **Impact**: When a user attempts to update a prediction on a match that is locked (kickoff < 15 minutes away), the application crashes due to a ReferenceError because it attempts to reference `prediction` and `match` before they are defined or in scopes where they don't exist.
- **Recommendation**: Redefine the lock check boundary. If a match is locked, immediately prompt the user via toast/alert, trigger `renderPredictions()` to revert UI inputs, and return early without mutating state or accessing undefined variables.
- **Suggested Command**: `$harden`

---

### P1: Major (Fix Before Release)

#### 2. [P1] Apps Script ReferenceError (`firebaseConfig` is undefined)
- **Location**: [src/main.js:L83, L110](file:///c:/Users/abdel/OneDrive/Desktop/ggofiles/ggowcpredictor/src/main.js#L83-L110)
- **Category**: Code Correctness
- **Impact**: Google Apps Script router crashes immediately during `getFixtures` or `syncAllData` because it attempts to load `firebaseConfig.apiKey`, but the local configuration is declared as `FIREBASE_CONFIG`.
- **Recommendation**: Standardize on `firebaseConfig` across both client and server code. Ensure the configuration is declared using `var` in Google Apps Script files to avoid Temporal Dead Zone (TDZ) ReferenceErrors caused by execution file ordering.
- **Suggested Command**: `$normalize`

#### 3. [P1] Conflicting Scoring Calculations
- **Location**: `scripts/app.js`, `src/main.js`, `src/leaderboard.js`
- **Category**: Code Correctness / Business Logic
- **Impact**: Client-side point calculations display different values than the Apps Script sync router and the leaderboard generator, leading to inconsistencies in standings and final scores.
- **Recommendation**: Implement the unified, locked scoring system defined in [SCORING.md](file:///c:/Users/abdel/OneDrive/Desktop/ggofiles/ggowcpredictor/docs/SCORING.md) (15 pts exact, 8 pts outcome+GD≤1, 5 pts outcome, 3 pts wrong outcome close-call, 0 pts miss, multiplied by stage weights). Delete the local stubs.
- **Suggested Command**: `$normalize`

#### 4. [P1] Results matchId Provider Mismatch
- **Location**: [src/fixtures.js:L136-L153](file:///c:/Users/abdel/OneDrive/Desktop/ggofiles/ggowcpredictor/src/fixtures.js#L136-L153)
- **Category**: Data Integration
- **Impact**: Synced live results are stored with document IDs like `api_12345` (API-Football fixture IDs), but local matches and user predictions are saved using sequential integers (`1` to `104`). Scores will never match or render.
- **Recommendation**: Populate `apiFixtureId` inside the `fixtures/` collection when seeding, and use it as a bridge mapping during the live result sync to write scores back to the correct sequential integer document.
- **Suggested Command**: `$normalize`

#### 5. [P1] Leaderboard Calculation is a Stub
- **Location**: [src/leaderboard.js:L13-L14](file:///c:/Users/abdel/OneDrive/Desktop/ggofiles/ggowcpredictor/src/leaderboard.js#L13-L14)
- **Category**: Code Correctness
- **Impact**: The daily trigger execution fails to compile any points because `players` and `results` are empty arrays with a `TODO: Fetch from Firebase` comment.
- **Recommendation**: Implement REST API query fetches to get all users from the `users` collection, all predictions from `predictions`, and all match scores from `results`, then calculate totals and write to `leaderboard/current`.
- **Suggested Command**: `$harden`

#### 6. [P1] seedFixturesFromJSON Reads from Invalid Google Drive Path
- **Location**: [src/fixtures.js:L13](file:///c:/Users/abdel/OneDrive/Desktop/ggofiles/ggowcpredictor/src/fixtures.js#L13)
- **Category**: Data Integration
- **Impact**: Seeding fails because `DriveApp.getFilesByName("worldcup.json").next()` expects a file in the user's personal Google Drive, whereas the actual JSON structure is stored locally under `2026/worldcup.json`.
- **Recommendation**: Add a fallback script that allows the user to post/upload the local JSON file directly, or read it as a resource, rather than relying on Google Drive search.
- **Suggested Command**: `$harden`

#### 7. [P1] Duplicate API Sync Operations
- **Location**: [app.js:L1047-L1062](file:///c:/Users/abdel/OneDrive/Desktop/ggofiles/ggowcpredictor/scripts/app.js#L1047-L1062)
- **Category**: Performance
- **Impact**: `loadResultsFromApi` performs an HTTP fetch request requesting `?action=sync` instead of `?action=sync` being combined with general hydration. This duplicates high-latency calls, consuming double API quota limit on each client reload.
- **Recommendation**: Merge result fetching into a single unified `?action=sync` game data endpoint query, storing all data in local client state.
- **Suggested Command**: `$optimize`

---

### P2: Minor (Aesthetics & UX)

#### 8. [P2] Toast Invisible on Desktop
- **Location**: [style.css:L1115-L1141](file:///c:/Users/abdel/OneDrive/Desktop/ggofiles/ggowcpredictor/style.css#L1115-L1141)
- **Category**: Responsive Design
- **Impact**: The `.toast` utility styles are defined inside a `@media (max-width: 480px)` responsive block. Any screen width above 480px renders the element with zero styles (invisible, positioned incorrectly).
- **Recommendation**: Move the `.toast` CSS rules out of the media query into the global scope.
- **Suggested Command**: `$adapt`

#### 9. [P2] showToast Declared Inside savePrediction
- **Location**: [app.js:L473-L484](file:///c:/Users/abdel/OneDrive/Desktop/ggofiles/ggowcpredictor/scripts/app.js#L473-L484)
- **Category**: Code Correctness
- **Impact**: No other functions can display notifications (e.g. login failures, sync successes) because `showToast` is scoped privately to `savePrediction`.
- **Recommendation**: Refactor `showToast` to be a global frontend function.
- **Suggested Command**: `$normalize`

#### 10. [P2] Unconditional 30s DOM Re-renders
- **Location**: [app.js:L62-L68](file:///c:/Users/abdel/OneDrive/Desktop/ggofiles/ggowcpredictor/scripts/app.js#L62-L68)
- **Category**: Performance
- **Impact**: Full list re-renders occur every 30 seconds unconditionally. If the user is typing in a field or if the tab is hidden (`document.hidden`), performance degrades, inputs lose focus, and battery is drained.
- **Recommendation**: Wrap the interval execution in a `document.hidden` check, and only re-render if the page tab is actively visible.
- **Suggested Command**: `$optimize`

#### 11. [P2] Login Form Input Accessibility Gaps
- **Location**: [index.html:L45-L54](file:///c:/Users/abdel/OneDrive/Desktop/ggofiles/ggowcpredictor/index.html#L45-L54)
- **Category**: Accessibility (A11y)
- **Impact**: Inputs lack associated `id` attributes matching labels' `for` properties. Screen readers fail to connect fields, and clicking label text does not focus the inputs.
- **Recommendation**: Add matching `for` attributes on labels (e.g., `<label for="login-name">`) and associate them with input `id` attributes.
- **Suggested Command**: `$harden`

#### 12. [P2] Hardcoded Palette Violations
- **Location**: [style.css:L788-L799, L1120, L1139](file:///c:/Users/abdel/OneDrive/Desktop/ggofiles/ggowcpredictor/style.css#L788-L799)
- **Category**: Theming
- **Impact**: Toast messages, rank badges, and error panels use hardcoded values like `#10B981` (emerald) and `#EF4444` (red), bypassing root design tokens.
- **Recommendation**: Define accent tokens (`--wc-success`, `--wc-danger`) inside `:root` variables and use them in all classes.
- **Suggested Command**: `$normalize`

---

### P3: Polish (Nice to Have)

#### 13. [P3] Spelling Typo in Head-to-Head Return Object
- **Location**: [src/leaderboard.js:L174](file:///c:/Users/abdel/OneDrive/Desktop/ggofiles/ggowcpredictor/src/leaderboard.js#L174)
- **Category**: Code Cleanup
- **Impact**: Typo `matcheCompared` instead of `matchesCompared` in return payload.
- **Recommendation**: Fix typo from `matcheCompared` to `matchesCompared`.
- **Suggested Command**: `$polish`

#### 14. [P3] Silent API Fetch Failure
- **Location**: [app.js:L244-L249](file:///c:/Users/abdel/OneDrive/Desktop/ggofiles/ggowcpredictor/scripts/app.js#L244-L249)
- **Category**: Accessibility / UX
- **Impact**: When local sync requests fail, the client logs to the console but displays no visual indicator, leaving the user with stale/outdated standings and predictions.
- **Recommendation**: Call `showToast("Sync failed. Using local cached data.", "error")` inside the sync error catch block.
- **Suggested Command**: `$clarify`

---

## Patterns & Systemic Issues
- **Scoped Variables TDZ Crashes**: Throughout Google Apps Script files, dependencies are initialized out of order because all files run in a shared global scope. Standardizing on globally unique variables with `var` declarations is required.
- **Visual Token Drift**: Client components fall back to hardcoded hex values rather than using CSS variables. Spacing units are inconsistently sized (`20px`, `25px`, `40px` arbitrary values) rather than fitting a structured scale.

---

## Positive Findings
- **Clean Responsive Grids**: The fixture group listings adapt gracefully to small screen sizes using CSS Grid Auto-fit layout properties.
- **Comprehensive API Fallback Chain**: If Firebase Firestore is down or unavailable, the client correctly loads `2026/worldcup.json` and preserves predictions using `localStorage`.

---

## Recommended Actions

1. **[P0] `$harden`** — Fix `savePrediction` crash and prevent editing locked matches.
2. **[P1] `$normalize`** — Unify scoring logic across client/backend, bridge the `matchId` mismatch, and resolve the Apps Script configuration ReferenceError.
3. **[P1] `$harden`** — Populate the leaderboard calculations in `src/leaderboard.js`.
4. **[P2] `$adapt`** — Move the `.toast` CSS styles out of the mobile-only media query.
5. **[P2] `$optimize`** — Stop blind 30s background re-renders when the tab is hidden.
6. **[P2] `$normalize`** — Move `showToast` to the global scope of `app.js` and use design tokens for colors.
7. **[P3] `$polish`** — Perform a final code cleanup, address the typo, and confirm the system functions end-to-end.

> You can ask me to run these one at a time, all at once, or in any order you prefer.
>
> Re-run `$audit` after fixes to see your score improve.
