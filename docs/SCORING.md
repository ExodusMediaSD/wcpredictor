# GGO WC 2026 — Canonical Scoring Rules

> **Status: LOCKED** — This is the single source of truth. All other files (`src/main.js`, `src/leaderboard.js`, `scripts/app.js`) must use these exact values.

---

## How the game works

Players predict the score of **every match** — group stage + all knockout rounds. Knockout bracket slots unlock as real results come in, but players can pre-fill them. This is the same model as the beIN Sports predictor.

There are **two scoring contexts**:

| Context | Description |
|---|---|
| **Main Game** | All 104 matches. Full point values (see below). |
| **Mini Tourney** (bonus) | A secondary competition that starts when the group stage ends. Uses **¼ of the main point values**, rounded down. Only knockout stage predictions count. |

---

## Main Game Scoring Table

| Result | Points |
|--------|--------|
| **Exact score** (e.g. predicted 2-1, actual 2-1) | **15** |
| **Correct outcome + goal difference within 1** (e.g. predicted 2-0, actual 3-0) | **8** |
| **Correct outcome only** (right W/D/L, but GD off by 2+) | **5** |
| **Wrong outcome, scores off by ≤1 per team** (close call) | **3** |
| **No match** | **0** |

### How "correct outcome + GD within 1" works

`Math.abs((pred1 - pred2) - (actual1 - actual2)) <= 1`

Example: You predict 2-0 (GD=+2), actual is 3-1 (GD=+2) → GD gap = 0 → **8 pts**
Example: You predict 2-0 (GD=+2), actual is 4-1 (GD=+3) → GD gap = 1 → **8 pts**
Example: You predict 2-0 (GD=+2), actual is 4-0 (GD=+4) → GD gap = 2 → **5 pts**

### How "close call" works (wrong outcome only)

`Math.abs(pred1 - actual1) + Math.abs(pred2 - actual2) <= 2`

Example: You predict 1-0 (win), actual is 0-1 (loss) → |1-0| + |0-1| = 2 → **3 pts**
Example: You predict 2-0 (win), actual is 0-2 (loss) → |2-0| + |0-2| = 4 → **0 pts**

---

## Mini Tourney Scoring (¼ values)

Starts when group stage ends (after **2026-06-27**). Only **Round of 32 onwards** count.

| Result | Points |
|--------|--------|
| Exact score | **3** |
| Correct outcome + GD within 1 | **2** |
| Correct outcome only | **1** |
| Wrong outcome, close call | **0** |
| No match | **0** |

---

## Round Multipliers

To make late-stage games more valuable, apply a multiplier on top of base points:

| Stage | Multiplier |
|-------|-----------|
| Group Stage (Matchday 1–17) | ×1 |
| Round of 32 | ×1 |
| Round of 16 | ×2 |
| Quarter-final | ×3 |
| Semi-final | ×4 |
| Final / 3rd Place | ×5 |

> **Example**: Exact score in the Final = 15 × 5 = **75 points**

---

## Implementation Notes

- The canonical `scoreMatch(p1, p2, a1, a2, stage)` function should be the **single function** used everywhere.
- `src/leaderboard.js:calculateMatchPoints` — **DELETE** (replaced by this system).
- `src/main.js:scoreMatch` — **UPDATE** to include multiplier and close-call partial credit.
- `scripts/app.js:calculateMatchPoints` — **UPDATE** to match exactly.
- Multipliers should be derived from the fixture's `stage` field (`group`, `r32`, `r16`, `qf`, `sf`, `final`/`third`).

---

## Locking Rules

- Predictions lock **15 minutes before kickoff** (UTC).
- Locking is enforced on the frontend (UI disables inputs).
- **Production must also enforce this in Firestore Security Rules** — client-side lock is not sufficient.
