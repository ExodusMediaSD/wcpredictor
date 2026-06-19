# Live Results Setup

This project now separates responsibilities:

- Apps Script stays only for fixture seeding.
- Cloudflare Workers handles live scores and results.
- Firestore is the source of truth for the app UI.

## What Must Exist

### 1. Firestore collections

These collections must already exist in the `ggowcpredictor` Firestore database:

- `fixtures`
- `results`
- `predictions`
- `users`
- `teams`

For live results to work, the important one is `results`.

Each result document should look like this:

```json
{
  "matchId": "1",
  "score1": 2,
  "score2": 1,
  "status": "FT",
  "lastUpdated": "2026-06-12T00:00:00.000Z"
}
```

The document ID should be:

- `match_1`
- `match_2`
- and so on

### 2. Fixtures must already be seeded

The worker matches live scores to Firestore fixtures by team names.

Your fixture documents need:

- `matchId`
- `team1`
- `team2`
- `date`
- `time`
- `kickoffUTC`
- `round`
- `group`
- `stage`

If fixtures are missing, the worker has nothing to map live scores against.

### 3. A live score source

The worker supports:

- Primary: `worldcup26.ir` open-source API
- Backup 1: Zafronix
- Backup 2: `live-score-api.com`

Primary source endpoint:

- `https://worldcup26.ir/get/games`

Primary source does not require a secret for read access.

Backup 1 source secret:

- `ZAFRONIX_API_KEY`

Backup 2 source secrets:

- `LIVESCORE_API_KEY`
- `LIVESCORE_API_SECRET`

### 4. Firestore service account access

The Cloudflare Worker needs permission to write to Firestore.

Required secret:

- `FIREBASE_SERVICE_ACCOUNT_JSON`

Optional secret:

- `FIREBASE_PROJECT_ID`
- `SEED_TOKEN` for manual `/seed` and `/sync` requests

Default project:

- `ggowcpredictor`

## What To Disable

To avoid wasted quota and duplicate writes:

- Disable the Apps Script trigger `scheduledLiveScoresUpdate`
- Keep Apps Script only for fixture seeding
- Do not use Apps Script for live results anymore

## Cloudflare Worker Setup

In Cloudflare dashboard:

1. Open the Worker for `ggowcpredictor`.
2. Go to `Variables and secrets`.
3. Add these secrets:
   - `FIREBASE_SERVICE_ACCOUNT_JSON`
   - `ZAFRONIX_API_KEY`
   - `LIVESCORE_API_KEY`
   - `LIVESCORE_API_SECRET`
   - `SEED_TOKEN`
4. Go to `Trigger events`.
5. Enable the cron schedule.

To seed once manually, call the Worker with:

```bash
curl -H "Authorization: Bearer YOUR_SEED_TOKEN" https://YOUR-WORKER_URL/seed
```

The current schedule is:

- every 5 minutes

## Worker Files In This Repo

- [workers/live-results.js](../workers/live-results.js)
- [wrangler.jsonc](../wrangler.jsonc)

## How The Sync Works

1. Worker loads Supabase `fixtures` (Firestore fallback).
2. Worker fetches live match data from `worldcup26.ir` (Zafronix / Livescore as fallbacks).
3. For each API game, the worker resolves the internal fixture:
   - **Primary:** `worldcup26.ir game.id` → `fixtures.apiFixtureId` → `fixtures.matchId`
   - **Fallback:** normalized team names (`team1` / `team2`)
4. Scores are saved to `results.matchId` using the **internal** sequential id (`"1"`…`"104"`), never the API game id.
5. During sync, missing `apiFixtureId` values are backfilled on matched fixtures.
6. Only started/finished games with both scores are upserted into `results`.
7. Leaderboard is recalculated from `predictions` joined to `results` on `matchId`.

### MatchId mapping contract

```
worldcup26.ir game.id  →  fixtures.apiFixtureId  →  fixtures.matchId  →  results.matchId  →  predictions.matchId
```

If this chain breaks, users keep `predicted` counts but `scored` stays low.

### Repair after a mapping gap

```bash
# Dry run
SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node scripts/repair-matchids.js --dry-run

# Apply backfill + missing results
SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node scripts/repair-matchids.js

# Recalculate standings
curl -H "Authorization: Bearer YOUR_SEED_TOKEN" https://YOUR-WORKER_URL/sync-scores
```

## Why Results Might Still Not Show

If the Results tab is blank or leaderboard `scored` is too low, check these in order:

1. `results` collection/table is empty or missing finished matches.
2. `results.matchId` does not match `fixtures.matchId` / `predictions.matchId` (run `scripts/repair-matchids.js`).
3. `fixtures.apiFixtureId` is null and team-name matching failed (e.g. DR Congo alias).
4. The worker secrets are missing in Cloudflare.
5. The worker is deployed but the cron trigger is off.
6. `/sync-scores` `updated` count is low because games are still `NS` or scores are null in the API.

## Quick Verification In Firebase Console

Open Firestore and check:

- `fixtures/match_1`
- `results/match_1`

The `matchId` values should match.

If `fixtures/match_1` exists but `results/match_1` does not, the worker has not written the result yet.

## Quick Verification In The App

Open the browser console and inspect:

```js
Object.keys(STATE.results)
STATE.results["1"]
```

If `STATE.results["1"]` is empty or missing `score1` and `score2`, the sync did not write the live result correctly.

## Recommended Final State

- Apps Script seeds fixtures only
- Cloudflare Worker writes live results only
- Firestore stores everything shared
- The browser app only reads Firestore
