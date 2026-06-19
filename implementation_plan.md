# Exodus World Cup Predictor — Implementation Plan

This plan details the design and scaffolding of the **Exodus World Cup Predictor** game, tailored for the Exodus Discord server. The stack is simplified to use **Supabase only** (removing all Firebase/Firestore dual-database complexity), paired with a **Cloudflare Worker** backend for automated live score syncing and leaderboard cron tasks, and a modern **React + Vite** frontend.

## User Review Required

> [!IMPORTANT]
> **Database Simplification (Supabase Only)**
> This clean copy completely removes Firebase. All data (users, predictions, results, fixtures, leaderboard) will be read and written directly to Supabase.

> [!TIP]
> **Exodus Branding Theme**
> We will design the UI with a custom "Exodus" theme using the provided color palette:
> - **Primary Brand Red**: `#DB231D`
> - **Accent Goldenrod/Gold**: `#E0AA1D`
> - **Secondary Deep Green**: `#32480F`
> - **Logo**: Sourced from `WhatsApp_Image_2024-09-16_at_21.13.04-removebg-preview (1).png`.
> The design will use a premium glassmorphic dark theme, incorporating these colors as key gradients, accents, status indicators, and custom button states.

## Open Questions
- **Scoring Rules Cutoff**: In the original project, matches before Jun 18, 2026 had a "close wrong result" rule (3 pts). For the new Exodus setup, should we use a clean modern rule from Match 1 (15 exact / 8 correct + GD≤1 / 5 correct outcome / 0 wrong)? We recommend a clean scoring rule from the start.
- **Discord Integration**: Since this is for your Exodus Discord server, would you like us to add a Discord Webhook configuration in the Cloudflare Worker to automatically post leaderboard updates or daily match previews?

---

## Proposed Changes

We will create a clean React project inside `C:/Users/abdel/OneDrive/Desktop/exoduswcpredictor/` with the following structure:

```
C:/Users/abdel/OneDrive/Desktop/exoduswcpredictor/
├── src/
│   ├── assets/              # Flags and Logos
│   ├── components/          # React Components (Tabs, Drawer, Modals)
│   ├── hooks/               # Custom hooks for fetching and state
│   ├── App.jsx              # Main App entrypoint
│   ├── index.css            # Premium Exodus design system & typography
│   └── main.jsx
├── workers/
│   └── live-results/
│       ├── index.js         # Cloudflare Worker for cron syncing matches
│       └── wrangler.toml    # CF Worker configuration
├── scripts/
│   ├── seed.js              # Database seed script for Supabase
│   ├── worldcup.json        # Tournament fixtures source
│   └── worldcup.teams.json  # Tournament teams / flags mapping
├── supabase/
│   └── schema.sql           # Database schema, RLS policies, and indexes
├── .env.example             # Env templates
└── README.md                # Detailed setup instructions for Cloudflare & Supabase
```

### Component Breakdown

#### [NEW] [schema.sql](file:///C:/Users/abdel/OneDrive/Desktop/exoduswcpredictor/supabase/schema.sql)
Contains all table schemas, primary keys, relationships, index creations, and Postgres Row Level Security (RLS) policies for:
- `users` (username, displayName, secretCode, isAdmin, totalPoints, joinedAt)
- `fixtures` (matchId, round, group, stage, date, time, kickoffUTC, team1, team2, ground, apiFixtureId)
- `results` (matchId, score1, score2, status, lastUpdated, homeScorers, awayScorers)
- `predictions` (id, username, matchId, pred1, pred2, submittedAt, pointsAwarded, scoredAt)
- `leaderboard` (username, rank, displayName, totalPoints, exactScores, correctOutcomes, predicted, scored, completedPredictions, updatedAt)
- `account_requests` (username, displayName, note, status, secretCode, createdAt, resolvedAt)

#### [NEW] [index.js](file:///C:/Users/abdel/OneDrive/Desktop/exoduswcpredictor/workers/live-results/index.js)
A lightweight Cloudflare Worker backend written in ES Modules.
- Fetches matches from live sources (worldcup26.ir, Zafronix, or Livescore API).
- Compares score differentials and updates Supabase `results` and `fixtures`.
- Recalculates leaderboard standings and writes them to the Supabase `leaderboard` table.
- Implements CORS and exposes read endpoints `/sync` (or `/leaderboard`) if needed, though the React app can also query Supabase directly for speed.

#### [NEW] [seed.js](file:///C:/Users/abdel/OneDrive/Desktop/exoduswcpredictor/scripts/seed.js)
A script utilizing `@supabase/supabase-js` to read local `worldcup.json` and `worldcup.teams.json` and seed the tables in Supabase with standard 2026 fixtures and teams data.

#### [NEW] [App.jsx](file:///C:/Users/abdel/OneDrive/Desktop/exoduswcpredictor/src/App.jsx)
A single-page React app component structured with clean components:
- **Login screen**: Prompts for username and secret code, validating against the Supabase `users` table.
- **Header**: Displays user avatar, display name, and active sync details.
- **Predictions Panel**: Displays chronological match cards grouped by date/round, allows interactive prediction inputs, computes group standings dynamically, and locks predictions immediately when the kickoff time is reached.
- **Leaderboard Panel**: Clean sortable table ranking users with points, exact predictions, outcome counts, total predictions made, and correct outcome percentage (based on resolved matches). Rows support competition-style tie ranking and are clickable to redirect to the user's profile page.
- **Results Panel**: Lists official match scores and live statuses.
- **Bracket Panel**: Renders a beautiful canvas/SVG or CSS flex-based knockout bracket that advances based on predicted scores or actual results.

#### [NEW] [index.css](file:///C:/Users/abdel/OneDrive/Desktop/exoduswcpredictor/src/index.css)
A custom stylesheet built from scratch using clean vanilla CSS:
- Dark theme palette matching Exodus: Background `#0a0b0d`, card backgrounds `rgba(22, 26, 33, 0.7)` with glassmorphism `backdrop-filter: blur(12px)`.
- Vibrant neon highlights: cyan (`#00f0ff`) and purple (`#b026ff`) gradients.
- DM Sans and Barlow Condensed Google Fonts.
- Responsive styles, mobile cards layout, smooth hover states, and inputs formatting.

#### [NEW] [README.md](file:///C:/Users/abdel/OneDrive/Desktop/exoduswcpredictor/README.md)
Comprehensive, step-by-step setup guide for the user to:
1. Create a Supabase project and run the `schema.sql` queries.
2. Setup and deploy the Cloudflare Worker using Wrangler (`npx wrangler deploy`), setting secret variables (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SEED_TOKEN`).
3. Set up the CRON trigger on Cloudflare to run the worker every 5 minutes automatically.
4. Run the seed script to populate fixtures.
5. Deploy the React app.

---

## Verification Plan

### Automated Steps
- Verification of database writes: execute `seed.js` locally to populate a test Supabase instance and verify matches are entered correctly.
- Worker compilation: run wrangler dev server locally to verify the `/sync-scores` endpoint successfully communicates with the football API and writes scores to Supabase.
- React bundle build: run `npm run build` in the Vite project to ensure no TypeScript or JSX build errors occur.

### Manual Steps
- Run the dev server `npm run dev` and open the browser.
- Perform login, input predictions, and check that group standings and bracket updates refresh in real-time.
- Verify desktop and mobile layouts adapt dynamically.
