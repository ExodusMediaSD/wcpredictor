# Error Reduction Rules

Last updated: 2026-06-10

Use this file before making code changes.

## Source Of Truth

1. Read `docs/PROJECT_BRIEF.md` first.
2. Treat `context/*.md` as historical conversation, not current truth.
3. Treat `BACKEND_SETUP.md`, `FIREBASE_SETUP.md`, and `INTEGRATION_CHECKLIST.md` as useful but partially stale.
4. Confirm mismatches in code before editing.

## High-Risk Mismatches

- `index.html` loads `scripts/app.js`; it does not load `src/main.js`.
- `src/` files are Apps Script files deployed through clasp.
- Firebase SDK scripts in `index.html` are non-module CDN scripts. If they do not expose global `firebase`, login will fail.
- After any merge or conflict resolution in `scripts/app.js`, run `node --check scripts/app.js` before testing login. A single syntax error anywhere in the file blocks the entire browser app.
- `requestSync()` references `.sync-btn`, but `index.html` currently has no visible button with that class.
- `seedFixturesFromJSON()` expects a Drive file named `worldcup.json`, not the local `2026/worldcup.json`.
- `src/fixtures.js` uses both `firebaseConfig` and hardcoded project values. Keep one canonical config.
- Scoring rules conflict across docs and code. Do not touch leaderboard logic until scoring is confirmed.
- Fixture IDs can be numeric or string depending on source. Choose one canonical type before writing predictions or results.
- Locking predictions only in the UI is not enough. Production needs server-side or security-rule enforcement.

## Safe Edit Process

1. Run `git status --short`.
2. Read the file you plan to edit and the caller/callee that depends on it.
3. Update `docs/WORKLOG.md` with the intent before or immediately after substantial edits.
4. Keep changes scoped. Do not rewrite old context files unless the user asks.
5. After edits, run the lightest useful verification available in this environment.
6. Record verification results in `docs/WORKLOG.md`.

## Testing Priorities

- Static app can load without JavaScript syntax errors.
- Firebase initializes or shows a clear offline/development fallback.
- Login failure and success paths both display correctly.
- Fixtures render from Firestore data or seeded local data consistently.
- Prediction saves do not write empty/NaN scores.
- Locked matches cannot be updated.
- Leaderboard scoring uses the confirmed scoring system.

## Deployment Guardrails

- Do not put API-Football keys in `index.html` or `scripts/app.js`.
- Do not rely on client-side code for admin-only score updates.
- Do not require Node, npm, clasp, or firebase CLI unless first checking they exist, because PATH is unreliable on this PC.
- If using Apps Script endpoint calls, remember `doGet` handles URL GET actions and `doPost` handles JSON body actions.
