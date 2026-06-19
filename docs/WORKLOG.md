# Work Log

## 2026-06-17 - Leaderboard matchId mapping repair

### Root cause

- Ben Arthur showed **35 pts / 14 scored** instead of **~74 pts** because **9 predictions had no matching `results` row**, not because the scoring formula was wrong.
- Supabase audit confirmed: `predictions = 23`, `matched_results = 14` for `ben_arthur`.
- Four finished matches (**49, 50, 55, 56**) were matched from `worldcup26.ir` but never persisted in `results` (DB had 16 rows; sync simulation would write 20).
- Adding those four rows alone restores Ben to **74 points** (including a **15-pt exact** on Austria 3–1 Jordan).
- `fixtures.apiFixtureId` was **null for all rows**, so API `game.id` could not be used as a stable bridge.
- `/sync-scores` reported `"updated": 69` while only **live/finished rows with scores** are written — a misleading count.
- Team alias gap: `"Democratic Republic of the Congo"` did not normalize to `drcongo`, breaking future sync for Portugal vs DR Congo (match 61).

### What changed

- **`workers/live-results.js`**: Resolve API games → `fixtures.matchId` via `apiFixtureId` first, team names second; backfill `apiFixtureId` during sync; fix DR Congo alias; return `updated` = rows actually written.
- **`scripts/repair-matchids.js`**: One-shot repair — backfill `apiFixtureId`, upsert missing results with internal `matchId`, delete orphan API-id results.
- **`scripts/liveResultsCron.js`**, **`src/fixtures.js`**: Same DR Congo alias fix.
- **`supabase/migrations/20260617000000_matchid_mapping_notes.sql`**: Documents the mapping contract.

### Deploy / repair

```bash
# 1. Apply Supabase migration (notes only)
supabase db push

# 2. Backfill fixtures + missing results
SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node scripts/repair-matchids.js

# 3. Deploy worker
npx wrangler deploy

# 4. Recalculate leaderboard
curl -H "Authorization: Bearer $SEED_TOKEN" https://ggowcpredictor.ben-arthur-wiz.workers.dev/sync-scores
```

### Verification query

```sql
select count(*) as predictions, count(r."matchId") as matched_results
from predictions p
left join results r on p."matchId" = r."matchId"
where p.username = 'ben_arthur';
-- Expect matched_results ≈ number of finished matches Ben predicted
```

---

## 2026-06-15 - Repository Reorganization & Asset Routing Fixes

### What changed

- **Directory Structure**: Created the `assets/images/` folder and moved all project `.png` assets there.
- **HTML Asset Paths**: Updated all image source attributes in `index.html` and `error.html` to point to the new `assets/images/` path.
- **Relocated Documentation**: Moved all root-level `.md` files (`BACKEND_SETUP.md`, `CLOUDFLARE_WORKER_SETUP.md`, `FIREBASE_SETUP.md`, `INTEGRATION_CHECKLIST.md`, and `history.md`) into the `docs/` folder. Copied `AGENTS.md` to `docs/AGENTS.md` to maintain the root-level IDE rules file while organizing documentation.
- **Root README**: Replaced the root-level `README.md` with a clean index file pointing directly to the new `docs/` directory files.

### Verification

- Spot-checked image references and confirmed they load correctly from `assets/images/`.

---

## 2026-06-15 - Repository Cleanup & Gitignore Optimization

### What changed

- **`.gitignore`**: Added rules to ignore local debugging files (`*.log`), diagnostic files (`*.har`), temporary testing scripts (`scripts/_check_*.js`), and agent system directories (`.agents/`, `.gemini/`).
- **File Deletion**: Permanently deleted obsolete high-volume diagnostic and temporary files to clean the workspace (`docs/127.0.0.1.har` 10MB, `emojiissuesocntext.md`, `fixemojis.md`, and `docs/s.html`).
- **Audit**: Conducted a full directory audit classifying files into Crucial, Legacy/Outdated, and Junk. Generated a detailed report in `directory_audit_report.md`.

### Verification

- Confirmed all deleted files were cleanly removed from the filesystem and that the updated `.gitignore` prevents future tracking of junk files.

---

## 2026-06-15 - Launch Preparation & Architecture Documentation Alignment

### What changed

- **`docs/ARCHITECTURE.md`**: Extensively refactored the system architecture documentation to show the finalized transition from the Google Apps Script backend to the **Cloudflare Worker** backend as the primary API, and from Google Sheets/Firestore as the primary datastores to **Supabase** (primary) and **Firestore** (backup). Added a Mermaid system architecture diagram and updated data load priority tables.
- **`docs/migration_plan.md`**: Updated the migration checklist and status to reflect that all steps (including Step 2.5 data recovery and verification) are **100% completed and production ready**.
- **Verification**: Verified database table counts and synchronization status using remote REST verification queries. Verified CLI tools availability.

### Verification

- Syntax validation of all edited project files succeeded. Verified local worker and tunnel connections are live and functioning.

---

## 2026-06-15 - Chronological fixtures sorting fix

### What changed

- **`scripts/app.js`**: Introduced a `sortFixtures(fixtures)` helper function and integrated it across all data loading pathways (`loadFixtures()` and `loadGameData()`). Previously, fixtures loaded from the API/Worker sync were not sorted, causing date headers on the Predictions page to display out of order (e.g., jumping from June 11 to June 18 and then back to June 12). Fixtures and Results are now consistently sorted in ascending chronological order by kickoff date and time.

### Verification

- Syntax validation of `scripts/app.js` using `node --check` succeeded.

---

## 2026-06-15 - System Settings accessibility fix

### What changed

- **`scripts/app.js`**: Added a "System Settings" button inside the `renderAdmin()` Admin Panel interface.
- **`index.html`**: Added a "Connection Settings" button on the login screen and a "Settings" button in the main app header next to the "Sync" button. This solves the chicken-and-egg usability issue where a user could not configure the API URL before logging in, or if they were logged in as a non-admin.

### Verification

- Checked syntax parsing of `scripts/app.js` using `node --check` successfully.

---

## 2026-06-15 - Critical Bug Fixes: Score Flip & Group Standings

### What changed

- **`workers/live-results.js`**: Fixed P0 home/away score flip in `syncLiveResults`. When the live API returns teams in reversed order from the fixture database, scores were saved in the wrong columns (score1 got the away team's goals). Added a `flipped` flag that swaps scores when team order is reversed.
- **`scripts/app.js`**: Fixed P0 group standings rendering. `renderGroupTable()` was using `STATE.predictions` (user's guesses) to build the standings table instead of `STATE.results` (actual match outcomes). Now prioritizes actual results, falling back to predictions only for unplayed matches.
- **`wrangler.jsonc`**: Added `rules` config to handle `.html` files as `Text` type, fixing the Cloudflare build error `No loader is configured for ".html" files: index.html`.

### Verification

- Ran `node --check workers/live-results.js` successfully.
- Ran `node --check scripts/app.js` successfully.

### Impact

- All group standings will now show real match outcomes.
- Leaderboard scoring will use correctly-oriented scores.
- Next `sync-scores` run will re-fetch and store scores in the correct order.
- Cloudflare deployment build should now succeed.

---

## 2026-06-15 - Cloudflare Worker integration

### What changed

- Added Supabase REST config & fetch helper wrappers (`supabaseSelect`, `supabaseUpsert`) in `scripts/app.js`.
- Refactored `handleLogin`, `hydrateLoginUsers`, `submitAccountRequest`, `approveAccountRequest`, `rejectAccountRequest`, predictions loading/saving, results loading, and leaderboard to prioritize checking Supabase, falling back/mirroring to Firestore SDK/REST.
- Updated Settings modal label in `index.html` to "Cloudflare Worker URL" and defaulted the connection URL to `http://localhost:8787` for local development.
- Implemented `pullLeaderboardFromWorker()`, hourly cron trigger `scheduledLeaderboardPull`, and `pullLeaderboard` action handler in `src/main.js` to periodically fetch data from the Cloudflare Worker and back up the leaderboard visually in Sheets.
- Conducted technical audit scoring 18/20 and updated status checklist in `docs/migration_plan.md`.

### Verification

- Ran `node --check scripts/app.js` successfully.
- Ran `node --check src/main.js` successfully.
- Generated `audit_report.md` with 18/20 audit health score.

---

## 2026-06-13 - Supabase fallback and leaderboard repair

### What changed

- Replaced the misnamed `src/supabaseConfig,js` file with `src/supabase.js` so clasp can deploy the Supabase helper layer.
- Added paginated Firestore collection reads for leaderboard data, removing the old 500-document ceiling.
- Added Supabase fallback reads for `users`, `fixtures`, `predictions`, and `results` when Firestore is blocked.
- Added `migrateFirestoreToSupabase()` plus `doPost` action `migrateToSupabase` for copying Firestore data after quota reset.
- Updated `src/main.js` so `?action=sync` and `?action=leaderboard` use the same leaderboard calculation path as the scheduled job.
- Leaderboard writes now try Firestore and also upsert rows into the Supabase `leaderboard` table.
- Added [SUPABASE_SETUP.md](SUPABASE_SETUP.md) with table SQL and the migration runbook.

### Verification

- Ran `node --check src/main.js`.
- Ran `node --check src/leaderboard.js`.
- Ran `node --check src/supabase.js`.
- Confirmed only one `scheduledLeaderboardUpdate` and one `calculateLeaderboard` definition remain in `src/`.

### Notes

- Existing Firebase quota limits can still block the initial migration until the daily reset.
- Supabase tables must be created before fallback reads or leaderboard upserts will succeed.

## 2026-06-13 - Fixture kickoff display fix

### What changed

- Updated `scripts/app.js` so fixture `date` + `time` with UTC offset takes priority over stored `kickoffUTC` when calculating kickoff instants.
- Changed visible kickoff labels to show the fixture's listed stadium-local time instead of forcing Cairo/browser-local display.
- Changed prediction day grouping to use the fixture date, avoiding date shifts caused by timezone conversion.

### Verification

- Ran `node --check scripts/app.js`.
- Spot-checked Canada vs Bosnia, Qatar vs Switzerland, and USA vs Paraguay kickoff parsing from `2026/worldcup.json`.

## 2026-06-10 - Repo orientation and docs setup

### What I learned

- The app is meant to be a GGO-branded FIFA World Cup 2026 employee score predictor.
- Current browser entrypoint is `index.html` plus `scripts/app.js`.
- Current backend folder is `src/`, intended for Google Apps Script/clasp deployment.
- Firebase is already configured in multiple places for project `ggowcpredictor`.
- Firestore is intended as shared state for users, fixtures, predictions, results, and leaderboard.
- Apps Script is intended to seed/sync data and call external score APIs without exposing API keys to the frontend.

### Files inspected

- `context/copilotchathistory.md`
- `context/chathistoryclaude.md`
- `context/context.md`
- `README.md`
- `package.json`
- `index.html`
- `style.css`
- `scripts/app.js`
- `scripts/firebaseConfig.js`
- `src/main.js`
- `src/firebase.js`
- `src/fixtures.js`
- `src/leaderboard.js`
- `src/Code.js`
- `src/firebaseConfig.js`
- `2026/worldcup.json`
- `2026/worldcup.groups.json`
- `BACKEND_SETUP.md`
- `FIREBASE_SETUP.md`
- `INTEGRATION_CHECKLIST.md`

### Current blockers / decisions needed

- Confirm the final scoring system. Current docs and code disagree.
- Confirm whether login should remain direct Firestore username/code or move behind Apps Script.
- Confirm API-Football key availability and where it will be stored in Apps Script properties.
- Decide whether to seed fixtures from local `2026/worldcup.json` via a local Node script or via Apps Script/Drive.
- Replace hardcoded group teams in `scripts/app.js` with data from Firestore or `2026/worldcup.groups.json`.

### Changes made

- Added `docs/PROJECT_BRIEF.md`.
- Added `docs/ERROR_REDUCTION.md`.
- Added this work log.

### Verification

- Ran `git status --short`.
- Read back all new docs with `Get-Content -Raw`.
- Reviewed README diff to confirm it points to the new docs.
- No app runtime tests were run because this change only adds documentation.

## 2026-06-13 - Mobile layout pass

### What changed

- Tightened the app shell for phones and small tablets.
- Converted leaderboard and group standings into stacked card layouts on narrow screens.
- Reworked header navigation, filters, and sync controls to scroll and wrap more gracefully on touch devices.
- Stacked match and result cards more aggressively on small screens so content no longer relies on desktop-width columns.
- Added `.impeccable.md` with project design context for future UI work.

### Verification

- No browser run was captured in this session.
- Reviewed the responsive CSS and table renderers after the edits to confirm the new mobile data labels and stacked layouts are in place.

## 2026-06-13 - Post-merge login recovery

### What changed

- Repaired a merge-broken syntax error in `scripts/app.js` that prevented the browser script from loading and blocked login.
- Removed an unreachable duplicate return in `isLocked(match)` while preserving the 1-minute pre-kickoff lock rule.
- Kept `hasResult(result)` aligned with the current app behavior by requiring numeric scores plus a live/final status.

### Verification

- Ran `node --check scripts/app.js` successfully.
- Searched `scripts/app.js` for leftover merge markers and found none.

## 2026-06-11 - Full audit, canonical docs, and project visualizer

### What changed

- Ran a deep technical audit across all source files (`app.js`, `style.css`, `src/main.js`, `src/leaderboard.js`, `src/fixtures.js`, `src/firebase.js`).
- Identified 1 P0 bug, 6 P1 bugs, 6 P2 issues, 2 P3 polish items.
- Created `docs/SCORING.md` — canonical scoring system (15/8/5/3/0 + round multipliers + mini tourney ¼-point variant).
- Created `docs/ARCHITECTURE.md` — full system diagram, Firestore schema, backend file status.
- Created `docs/SETUP.md` — step-by-step admin setup guide.
- Created `docs/project-tracker.html` — self-contained interactive project dashboard (open in browser).
- Locked the scoring system: 15 exact / 8 correct+GD≤1 / 5 correct outcome / 3 close wrong / 0 miss × round multipliers.
- Confirmed game flow: players predict ALL 104 matches (group + knockout); predicted bracket auto-advances. Mini tourney activates post-group-stage with ¼ points.

### Key decisions logged

- Scoring: app.js variant (15/8/5/3/0) confirmed as canonical, plus stage multipliers (×1/1/2/3/4/5).
- Mini tourney: separate leaderboard, knockout only, activates after 2026-06-27.
- matchId: must be a consistent string throughout all layers.

### Verification

- All new docs read back after creation.
- project-tracker.html is self-contained and requires no server to open.

### Blockers still open

- `savePrediction` P0 crash (locked branch references undefined vars)
- `main.js` ReferenceError (`FIREBASE_CONFIG` vs `firebaseConfig`) is fixed by the shared collection loader path
- `leaderboard.js` now fetches users, predictions, and results from Firestore and writes `leaderboard/current`
- matchId mismatch between fixtures (sequential int) and API-Football results (API fixture ID)
- `seedFixturesFromJSON` reads from wrong Drive location

---

## 2026-06-10 - Flags, lock timing, and game data API

### What changed

- Added country flags sourced from `2026/worldcup.teams.json`.
- Rendered flags in prediction cards, results, standings, and bracket views.
- Kept prediction inputs disabled when the match is inside the 15-minute lock window.
- Added a 30-second UI refresh so lock state updates without a hard reload.
- Switched the browser app to prefer the configured Game Data API URL for `?action=sync`, `?action=fixtures`, and `?action=leaderboard`, with local/Firestore fallback.
- Renamed the settings label from `Apps Script / Firebase URL` to `Game Data API URL`.

### Verification

- Ran `node --check scripts/app.js`.
- Started a temporary static server from `C:\tmp` to verify the app loads over HTTP.
- Confirmed `http://127.0.0.1:4173/` returned `200`.
- Confirmed `http://127.0.0.1:4173/2026/worldcup.teams.json` returned `200`.

### Notes

- The app still falls back to Firestore/local JSON if the configured API URL is empty or unreachable.
- No browser screenshot was captured in this run because the browser automation tool was not available in this session.
