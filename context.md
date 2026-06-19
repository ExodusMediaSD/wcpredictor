# Exodus World Cup 2026 Prediction Game — Developer Context

This document provides a full handoff and explanation of the developer context, architecture, database schema, scoring rules, and frontend-backend interactions for the **Exodus WC 2026 Predictor** game, ported from the original **GGO World Cup 2026 Prediction Game**.

---

## 📂 Project Overview

An internal World Cup 2026 prediction game for Exodus employees. Each employee logs in with a username and secret code, predicts scores for all 104 FIFA World Cup matches, and earns points based on accuracy. A live leaderboard ranks everyone. Matches are automatically synchronized with actual scores using a Cloudflare Worker that pulls from a live sports API.

---

## 🛠️ Technology Stack

1. **Frontend**: Vite + React
   - Main page: [App.jsx](file:///c:/Users/abdel/OneDrive/Desktop/exoduswcpredictor/src/App.jsx)
   - Styling: [index.css](file:///c:/Users/abdel/OneDrive/Desktop/exoduswcpredictor/src/index.css) (Vanilla CSS design system)
   - Setup: [main.jsx](file:///c:/Users/abdel/OneDrive/Desktop/exoduswcpredictor/src/main.jsx) & [index.html](file:///c:/Users/abdel/OneDrive/Desktop/exoduswcpredictor/index.html)
2. **Backend / Database**: Supabase
   - Setup script: [supabase/schema.sql](file:///c:/Users/abdel/OneDrive/Desktop/exoduswcpredictor/supabase/schema.sql)
   - Interaction is done using the `@supabase/supabase-js` client SDK on the client side.
3. **Cron / Synchronization Worker**: Cloudflare Worker
   - Location: [workers/live-results](file:///c:/Users/abdel/OneDrive/Desktop/exoduswcpredictor/workers/live-results)
   - Keeps match results (`results` table) and player rankings (`leaderboard` table) updated by pulling from a soccer results API.

---

## 📊 Database Schema

The database consists of the following 6 tables in Supabase (fully defined in `supabase/schema.sql`):

### 1. `users`
Represents the user/player accounts.
- `username` (text, Primary Key): The user's unique identification handle.
- `displayName` (text): Public name shown on leaderboard.
- `secretCode` (text): Authorization code/password.
- `isAdmin` (boolean): Whether they have admin capabilities.
- `totalPoints` (int): Combined points won.
- `exactScores` (int): Total exact prediction hits.
- `correctOutcomes` (int): Total correct outcomes (W/D/L).
- `predicted` (int): Total matches predicted.
- `scored` (int): Total predictions scored.
- `joinedAt` (timestamptz): Timestamp of account creation.

### 2. `fixtures`
Seeded list of all 104 matches of the FIFA World Cup 2026.
- `matchId` (text, Primary Key): Identifier (e.g. `"1"`, `"2"`).
- `round` (text): e.g. `"Matchday 1"`, `"Round of 16"`.
- `group` (text): e.g. `"Group A"`, `"Group B"` (null for knockouts).
- `stage` (text): Stage classification (e.g. `"group"`, `"r32"`, `"r16"`, `"qf"`, `"sf"`, `"third"`, `"final"`).
- `date` (text): Local date string.
- `time` (text): Local time string.
- `kickoffUTC` (timestamptz): Canonical date/time used to calculate locking.
- `team1` (text): Home team name.
- `team2` (text): Away team name.
- `ground` (text): Arena/Venue name.
- `apiFixtureId` (int): Corresponding ID in the third-party soccer API.

### 3. `predictions`
User-submitted score predictions.
- `id` (text, Primary Key): Combined key formatted as `{username}_{matchId}`.
- `username` (text, references `users`): Predicting user.
- `matchId` (text, references `fixtures`): Predicted match.
- `pred1` (int): Predicted home team goals.
- `pred2` (int): Predicted away team goals.
- `submittedAt` (timestamptz): Timestamp of prediction.
- `pointsAwarded` (int): Calculated points for this prediction.
- `scoredAt` (timestamptz): When the score was calculated.

### 4. `results`
Actual match results fetched from API.
- `matchId` (text, Primary Key, references `fixtures`): The match.
- `score1` (int): Real home team score.
- `score2` (int): Real away team score.
- `status` (text): Match status (e.g. `"FT"`, `"LIVE"`, `"HT"`, `"NS"`).
- `lastUpdated` (timestamptz): When the result was last updated.
- `homeScorers` (text[]): List of home goalscorers.
- `awayScorers` (text[]): List of away goalscorers.

### 5. `leaderboard`
Pre-calculated public ranking cache.
- `username` (text, Primary Key, references `users`): User handle.
- `rank` (int): Position ranking.
- `displayName` (text): User's screen name.
- `totalPoints` (int): Score tally.
- `exactScores` (int): Exact predictions count.
- `correctOutcomes` (int): Correct W/D/L outcomes.
- `predicted` (int): Total predicted matches.
- `scored` (int): Total scored predictions.
- `completedPredictions` (int): Predicted matches that have finished.
- `updatedAt` (timestamptz): When this rank row was computed.

### 6. `account_requests`
Sign-up/Access requests submitted by new users.
- `username` (text, Primary Key): Desired handle.
- `displayName` (text): Public name.
- `note` (text): Optional custom sign-up note.
- `status` (text): Request state (`'pending'`, `'approved'`, `'rejected'`).
- `secretCode` (text): Auto-generated hex code for access.
- `createdAt` (timestamptz): Time of request.
- `resolvedAt` (timestamptz): Time request was resolved.

---

## 🎯 Scoring System Rules

Scoring calculates points gained by players from their predictions against actual results:

| Prediction Result | Base Points | Description |
| :--- | :--- | :--- |
| **Exact Score** | **15 pts** | Predicted score matches actual score exactly (e.g. predicted 2-1, actual 2-1) |
| **Outcome + Goal Difference within 1** | **8 pts** | Correct W/D/L outcome, and difference between prediction GD and actual GD is $\le 1$ |
| **Outcome Only** | **5 pts** | Correct W/D/L outcome, but goal difference gap is $\ge 2$ |
| **Close Call** | **3 pts** | Incorrect outcome (e.g. predicted home win, actual was draw/loss), but predicted goals are off by $\le 1$ per team |
| **No Match** | **0 pts** | Incorrect outcome and not matching the close call criteria |

### Stage Multipliers
Points are scaled dynamically based on tournament stage:
- **Group Stage / Round of 32**: $\times 1$ multiplier
- **Round of 16**: $\times 2$ multiplier
- **Quarter-Finals**: $\times 3$ multiplier
- **Semi-Finals**: $\times 4$ multiplier
- **Finals / 3rd Place Match**: $\times 5$ multiplier

### Locking Rules
- Predictions lock exactly **15 minutes** before kickoff (enforced client-side and verified in workers/security rules).

---

## 🌐 API Integrations

### Flag CDN
- Flags are dynamically resolved using the [FlagCDN API](https://flagcdn.com/) via country codes mapped in `TEAM_FLAG_CODES`.
- Images are retrieved at `w80` size and formatted as `38px` $\times$ `25px` covering element ratios sharp on high DPI displays.

---

## 👥 Copied Workspace Files
The following files and folders have been imported from `ggowcpredictor` to assist agent actions:
- `.agents/` — Custom CLI scripts and modular agent skills.
- `.cursor/` — Workspace custom setup directory.
- `context/` — Pre-existing handoffs, audits, and chat logs.
- `docs/` — Canonical markdown documentation including Architecture, Worker setup, and Scoring details.
- Root helper markdowns: `AGENTS.md`, `codexchange scoring.md`, `contextforleaderboardissue.md`, `june18thcontext.md`, `x.md`, `Untitled-1.md`.
