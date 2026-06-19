# Add Crowd Odds And No-Money Bets

## Summary

Add a social prediction layer where players can see everyone else’s predictions before kickoff, including named picks and a simple no-money confidence value. The feature should feel like “crowd odds” and office discussion, not gambling: no currency, no payouts, no wagering balance, and no betting terminology that implies real stakes.

## Key Changes

- Extend each saved prediction with:
  - `confidence`: integer `1-5`
  - `confidenceLabel`: derived in UI, not stored, such as `Low`, `Medium`, `High`
  - Keep existing fields: `username`, `matchId`, `pred1`, `pred2`, `submittedAt`, scoring fields.
- Add a crowd data loader that fetches all predictions for visible fixtures from Firestore, grouped by `matchId`.
- On each match card, show:
  - “Crowd pick” summary: most common scoreline, outcome split, average confidence.
  - Named prediction list: display name/username, predicted score, confidence.
  - Your pick remains editable until the existing match lock rule.
- Add a confidence selector beside the score inputs using a compact segmented control or slider from `1-5`.
- Avoid changing scoring rules: confidence is informational only in v1 and does not affect leaderboard points.
- Use existing Firestore `predictions` collection instead of creating a separate betting collection.

## Implementation Details

- Update `scripts/app.js` state with a new `crowdPredictions` map keyed by `matchId`.
- Add `loadCrowdPredictions()` after fixture/user sync, querying Firestore `predictions`.
- Merge user display names from `users` where available; fallback to username.
- Update `savePrediction()` to persist `confidence`, defaulting to `3` for old/local predictions.
- Add render helpers for crowd summary:
  - outcome percentages: team1 win / draw / team2 win
  - most popular exact scoreline
  - average confidence
  - named rows sorted by latest submitted, then username
- Update `style.css` for compact crowd panels inside match cards, with mobile-safe stacking.
- Update docs after code changes:
  - `README.md` current feature list
  - `docs/ARCHITECTURE.md` prediction schema
  - `docs/PROJECT_BRIEF.md` or `docs/SCORING.md` to clarify confidence does not affect points

## Test Plan

- Existing prediction save still works with score inputs only.
- New predictions save `confidence`.
- Old predictions without `confidence` display as confidence `3`.
- Crowd section appears for matches with predictions from multiple users.
- Crowd section shows empty state when no one has predicted yet.
- Player can see named predictions before kickoff.
- Locked matches remain non-editable, but crowd data still displays.
- Leaderboard totals do not change when confidence changes.
- Mobile view does not overflow inside match cards.
- Run syntax checks for touched JavaScript files.

## Assumptions

- Visibility is always-on: players can see other people’s predictions before match lock.
- Display is named, not anonymous.
- “Bets” means confidence tokens only, with no money, no wallet, no odds payout, and no scoring impact in v1.
- Firestore read access for `predictions` must allow approved users to read all predictions.
