# GGO WC 2026 Predictor - Project Brief

Last updated: 2026-06-10

## Goal

Build an internal FIFA World Cup 2026 prediction game for Gulf Global Outsourcing employees.

Employees log in with a username and secret code, predict individual match scores, see projected group tables from their own predictions, and compete on a shared leaderboard. Real results should be synced automatically from a football scores API; an admin should not manually enter match results.

## Current Architecture

- `index.html` is the static app shell.
- `style.css` is the visual system.
- `scripts/app.js` is the browser app logic currently loaded by `index.html`.
- `src/` is Google Apps Script backend code deployed by clasp.
- `2026/worldcup.json` and related files are local fixture seed data from openfootball.
- Firestore is the shared data store for users, fixtures, predictions, results, and leaderboard.
- Apps Script is intended as a thin scheduled backend for score syncing and backend maintenance tasks.

Important naming note: `src/main.js` is not the browser entrypoint. It is Google Apps Script backend code.

## Intended Runtime Flow

1. Employee opens the static site.
2. Browser initializes Firebase.
3. Employee logs in with a Firestore `users/{username}` document and `secretCode`.
4. Browser reads `fixtures`, current user's `predictions`, `results`, and `leaderboard`.
5. Employee submits score predictions into `predictions/{username}_{matchId}`.
6. Predictions must lock 15 minutes before kickoff. This must be enforced in backend rules or trusted server logic before production.
7. Apps Script periodically fetches real scores from API-Football and writes `results`.
8. Apps Script or a trusted backend recalculates `leaderboard`.

## Canonical Data Model

### users/{username}

- `displayName`: string
- `secretCode`: string
- `isAdmin`: boolean
- `totalPoints`: number
- `joinedAt`: timestamp

### fixtures/{matchId}

- `matchId`: string or number, but use one type consistently
- `round`: string
- `group`: string
- `date`: string
- `time`: string
- `kickoffUTC`: timestamp or ISO string
- `team1`: string
- `team2`: string
- `ground`: string
- `stage`: string
- `apiFixtureId`: number or string, once mapped to the live score provider

### predictions/{username}_{matchId}

- `username`: string
- `matchId`: same type as fixtures
- `pred1`: number
- `pred2`: number
- `submittedAt`: timestamp
- `pointsAwarded`: number or null
- `scoredAt`: timestamp or null

### results/{matchId}

- `matchId`: same type as fixtures
- `score1`: number or null
- `score2`: number or null
- `status`: string
- `lastUpdated`: timestamp

### leaderboard/current

- `players`: array of player summary objects
- `updatedAt`: ISO timestamp for the last leaderboard refresh

## Scoring Decision To Confirm

There are conflicting scoring notes in the repo:

- `context/context.md` says exact score 4, correct outcome plus goal difference 3, correct outcome 2.
- `src/leaderboard.js` and `BACKEND_SETUP.md` use exact score 15, correct outcome 5, close guess 3.

Before implementing leaderboard behavior, pick one scoring system and update all docs and code to match it.

## Known State On 2026-06-10

- Firebase config exists in `scripts/app.js`, `scripts/firebaseConfig.js`, and `src/firebaseConfig.js`.
- Firestore database is reported as created in `me-central1`.
- Login reads Firestore directly and falls back to mock users if Firebase fails.
- Fixture rendering exists but still has rough edges.
- Group standings in `scripts/app.js` use hardcoded group teams, and some values conflict with `2026/worldcup.groups.json`.
- Result rendering, bracket rendering, filtering, score sync, and real leaderboard calculation are not complete.
- Apps Script deployment ID in context: `AKfycbwk6Xx2K9Y043hGFKCkMcIYfphV3mL3-qkNkR7yIyDEabPUqzNvseHmVwxCmmY6QN6L`.
- Apps Script project ID in `.clasp.json`: `1Lx-q30o3CFcM7_h6OiuoiPNgRzaZE2SK_WnKkPFoBplS8W4ckWWa0B_0`.

## External Services Needed

- Firebase Firestore project: `ggowcpredictor`.
- API-Football key from API-Sports, stored only in Apps Script or another trusted backend.
- Google Apps Script/clasp deployment for scheduled score sync.

## Environment Constraints

The user stated this PC has no cmd, no admin, and nothing added to PATH. Prefer PowerShell built-ins and existing local files. Do not assume global CLIs are installed.
