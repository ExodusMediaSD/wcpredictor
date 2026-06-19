# GGO WC 2026 Predictor — Full Context Handoff

---

## What This Is

An internal World Cup 2026 prediction game for Gulf Global Outsourcing employees. Each employee logs in, predicts scores for all 104 FIFA World Cup matches, and earns points based on accuracy. A live leaderboard ranks everyone. No admin manually enters results — everything is fetched automatically from a live football API.

---

## Current State

A fully scaffolded single HTML file (`wc26-predictor.html`) exists with:
- Complete CSS design system (FIFA WC 2026 colors replacing the old GGO green theme)
- Login screen UI (name dropdown + secret code)
- All 5 views stubbed: Predictions, Leaderboard, Results, Bracket, Admin
- Session management via `sessionStorage`
- Sync button + status dot wired up
- All render functions stubbed with `// TODO` markers ready to fill in
- Settings modal for API URL + key
- Responsive layout down to 480px

**Nothing is connected to a real backend yet.** Login accepts anything, render functions show empty states, STATE object is empty.

---

## Design System

```
Font display:   Barlow Condensed (900 weight) — WC 2026 style
Font body:      DM Sans
Font fallback:  TTFirsNeue (local .ttf)

--wc-blue:        #003DA5   (primary accent, was --green)
--wc-blue-dim:    #002d7a
--wc-blue-bright: #1a56cc
--wc-red:         #C8102E   (secondary accent, live/admin)
--dark:           #06080F   (background)
--card:           #0d1120
--card2:          #111827
--border:         #1a2540
--text:           #e8eeff
--muted:          #5a6a8a
--gold:           #FFD600
```

GGO logo URL: `https://gulfglobaloutsourcing.com/wp-content/uploads/2024/11/GGO-White-Var3.png`

---

## Architecture Decision

**Backend: Google Sheets + Google Apps Script** (same bridge pattern as existing `tourney.html`)

One deployed Apps Script web app URL handles all actions via `?action=` param. The HTML file calls this URL for everything. The Apps Script also runs a time-based trigger every 5 minutes to sync scores from the football API into the Results sheet.

**Live scores: API-Football (api-sports.io)**
- Free tier: 100 requests/day
- World Cup endpoint: `league=1, season=2026`
- Key stored server-side in Apps Script only, never in the HTML
- Apps Script caches API response for 60 seconds using `CacheService` so all 100 employees hitting the app never blow the daily limit

---

## Scoring System

| Result | Points |
|---|---|
| Exact correct score | **4 pts** |
| Correct outcome + correct goal difference | **3 pts** |
| Correct outcome only (right W/D/L) | **2 pts** |
| Wrong outcome | **0 pts** |

---

## Google Sheets Structure (5 tabs)

**`Users`**
```
Username | DisplayName | SecretCode | IsAdmin | TotalPoints | JoinedAt
```

**`Fixtures`** (seeded once, 104 rows, never changes)
```
MatchID | Round | Group | Date | KickoffUTC | Team1 | Team2 | Stage | APIFixtureID
```
Stage values: `group` / `r32` / `qf` / `sf` / `3rd` / `final`

**`Results`** (written by Apps Script from API-Football)
```
MatchID | Team1Score | Team2Score | Status | LastUpdated
```
Status values: `NS` / `1H` / `HT` / `2H` / `FT` / `AET` / `PEN`

**`Predictions`** (one row per user per match)
```
Username | MatchID | PredScore1 | PredScore2 | SubmittedAt | PointsAwarded | ScoredAt
```

**`Leaderboard`** (computed on-demand, cached)
```
Rank | DisplayName | TotalPoints | ExactScores | CorrectOutcomes | Predicted | LastUpdated
```

---

## Apps Script Actions

| `?action=` | Description |
|---|---|
| `login` | Validates username + SecretCode, returns `{ token, displayName, isAdmin }` |
| `getFixtures` | Returns all 104 fixtures merged with current Results tab scores |
| `getPredictions` | Returns all predictions for the token's user |
| `submitPrediction` | Writes prediction row; rejects if `now > kickoffUTC - 15min` |
| `getLeaderboard` | Computes and returns ranked leaderboard array |
| `syncScores` | Fetches API-Football, updates Results tab (also called by time trigger) |

---

## Session Management

- `sessionStorage` only — clears on tab close, no persistent login
- Token format: `btoa(username + ':' + timestamp)`
- Apps Script extracts username from token on every call to identify the user
- Prediction lock: enforced **server-side** in Apps Script, not just UI — rejects if `now > kickoffUTC - 15 minutes`

---

## What Needs to Be Built (in order)

### Phase 1 — Apps Script + Sheets
1. Create the 5-tab Google Sheet with exact headers above
2. Write `syncScores()` — fetches API-Football `league=1&season=2026`, maps fixture IDs, writes to Results tab, uses `CacheService` (60s TTL)
3. Write all 6 action handlers in one Apps Script file
4. Set up time-based trigger: `syncScores` every 5 minutes
5. Deploy as web app: Execute as Me, Anyone can access

### Phase 2 — HTML App (fill in the TODOs)
6. `renderPredictions()` — fixture cards with `pred-input` score fields, countdown timers, lock state, submitted state
7. `renderLeaderboard()` — populate `#leaderboard-body` with ranked rows, highlight current user's row with `.current-user`
8. `renderResults()` — match cards showing real score vs user's prediction, points badge per match
9. `renderBracket()` — knockout bracket from R32 through Final, teams populate as they qualify
10. Login: replace mock auth with real Apps Script `?action=login` call
11. `renderPredictions` filter buttons: `all` / `open` / `locked` / `scored` + per-group filters

### Phase 3 — Seed Data
12. Hardcode all 104 fixtures into the Fixtures sheet (from openfootball/worldcup.json 2026 data), mapping each to its `APIFixtureID` from API-Football

---

## What the Agent Needs From the User Before Starting

The agent must ask for these before writing a single line of code:

1. **API-Football key** — register free at `dashboard.api-football.com`, paste the key. Goes into Apps Script only.
2. **Firebase config OR Google Sheet ID** — confirm backend is Sheets+Apps Script (recommended) or Firebase
3. **Employee list** — names for the Users tab and the login dropdown. Format: one name per line
4. **Secret code setup** — one shared code for everyone (e.g. `GGO2026`) or individual codes per person?
5. **Google account** — which Gmail owns the Sheet (agent writes the code, user deploys the Apps Script themselves — 30-second process)
6. **GGO logo confirmation** — agent will use `gulfglobaloutsourcing.com/wp-content/uploads/2024/11/GGO-White-Var3.png` unless user provides a different file

---

## Key Files

- `wc26-predictor.html` — the scaffold, all CSS complete, JS stubs ready
- `TTFirsNeue-DemiBold.ttf` — local font, must be in same directory as the HTML
- `GGO-White-Var3.png` — GGO logo, loaded from remote URL (no local copy needed)

---

## Tournament Timeline (urgency note)

World Cup started **June 11, 2026**. Group stage runs through **June 26**. Knockout stage starts **June 29**. The agent should prioritize getting group stage predictions open immediately — employees can't predict matches that have already kicked off, so every day counts.