# Walkthrough — Exodus World Cup Predictor Scaffolding

I have successfully scaffolded a clean, Supabase-only copy of the tournament predictor game in `C:/Users/abdel/OneDrive/Desktop/exoduswcpredictor` specifically customized for the Exodus Discord Server. 

All Firebase/Firestore dependencies have been removed, resulting in a lightweight, modern, and highly performant architecture.

---

## 📂 Project Structure Created

The following directories and files have been set up in the `exoduswcpredictor` workspace:

- [supabase/schema.sql](file:///C:/Users/abdel/OneDrive/Desktop/exoduswcpredictor/supabase/schema.sql): Schema definition for the database tables (`users`, `fixtures`, `predictions`, `results`, `leaderboard`, `account_requests`), indices, RLS configuration, and role-based policies.
- [workers/live-results/index.js](file:///C:/Users/abdel/OneDrive/Desktop/exoduswcpredictor/workers/live-results/index.js): Cloudflare Worker API backend that handles cron updates, scores syncing, leaderboard computation, and user profiles/rivalries endpoints.
- [workers/live-results/wrangler.toml](file:///C:/Users/abdel/OneDrive/Desktop/exoduswcpredictor/workers/live-results/wrangler.toml): Cloudflare Worker configuration, including compatibility settings, environment variables, and the cron triggers.
- [scripts/seed.js](file:///C:/Users/abdel/OneDrive/Desktop/exoduswcpredictor/scripts/seed.js): A database seeding script that populates all 104 fixtures for the 2026 World Cup and sets up the default administrator account.
- [scripts/data/](file:///C:/Users/abdel/OneDrive/Desktop/exoduswcpredictor/scripts/data/): Folder containing all raw match details, teams, flags, and stadiums mappings.
- [src/App.jsx](file:///C:/Users/abdel/OneDrive/Desktop/exoduswcpredictor/src/App.jsx): The React dashboard component, containing custom glassmorphic tab views (Predictions, Standings, Leaderboard, Results, Brackets, Admin Verification Panel, and Connection Settings).
- [src/index.css](file:///C:/Users/abdel/OneDrive/Desktop/exoduswcpredictor/src/index.css): Beautiful dark glassmorphic styling system custom-designed with Exodus colors (Primary Red, Accent Gold, Secondary Deep Green).
- [README.md](file:///C:/Users/abdel/OneDrive/Desktop/exoduswcpredictor/README.md): Detailed sequential setup guide for database, seeding, worker, and frontend.

---

## ⚙️ How to Complete the Setup

Following your instructions, **no Git deployments or automated commands have been run**. To complete the setup on your end, follow these steps:

### 1. Database Creation
- Go to the [Supabase Console](https://supabase.com/) and create a new project.
- Open the **SQL Editor**, paste the contents of [supabase/schema.sql](file:///C:/Users/abdel/OneDrive/Desktop/exoduswcpredictor/supabase/schema.sql), and execute them to construct the tables and security rules.

### 2. Run Seeding Script
- Create a `.env` file in the root of the project with:
  ```ini
  SUPABASE_URL="https://your-supabase-project.supabase.co"
  SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
  ```
- Run the command to seed the default admin account (`admin`/`EXODUS2026`) and fixtures:
  ```bash
  node scripts/seed.js
  ```

### 3. Deploy Cloudflare Worker API
- Navigate to the worker directory `cd workers/live-results`
- Set worker environment secrets:
  ```bash
  npx wrangler secret put SUPABASE_URL
  npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
  npx wrangler secret put SEED_TOKEN
  ```
- Deploy the backend worker:
  ```bash
  npx wrangler deploy
  ```

### 4. Run the Dev Server
- Open a terminal in the root directory and start Vite:
  ```bash
  npm run dev
  ```
- Open `http://localhost:5173` in your browser.
- Click **Connection Settings** on the login screen to configure your Supabase Anon key, Supabase URL, and Cloudflare Worker URL, then log in and start using the app!
