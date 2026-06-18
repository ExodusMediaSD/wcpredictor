# Exodus World Cup 2026 Predictor

A premium, custom prediction game for the **Exodus Discord Server** built with a gorgeous dark glassmorphic interface and a tailored red/gold/green brand theme. 

This is a clean, simplified copy of the original tournament predictor. It utilizes **Supabase only** (no Firestore/Firebase dual-database clutter) and a **Cloudflare Worker** API backend for fetching live match scores, updating results, and updating leaderboard standings automatically.

---

## 🚀 Tech Stack
- **Frontend**: React + Vite + Vanilla CSS (Custom Design System with DM Sans & Barlow Condensed fonts).
- **Primary Database**: Supabase (PostgreSQL with RLS policies and optimized indices).
- **Backend API & Cron Engine**: Cloudflare Workers (updates scores every 5 minutes and recalculates rankings).

---

## 🛠️ Step-by-Step Setup Instructions

Follow these instructions in order to set up your database, seed match fixtures, deploy the backend syncing engine, and run the app.

### Step 1: Supabase Database Setup
1. Go to the [Supabase Console](https://supabase.com/) and create a new project.
2. Open the **SQL Editor** in your Supabase dashboard.
3. Open the file [supabase/schema.sql](file:///C:/Users/abdel/OneDrive/Desktop/exoduswcpredictor/supabase/schema.sql) in this repository, copy its contents, paste them into the Supabase SQL Editor, and click **Run**.
   - This creates the 6 required tables (`users`, `fixtures`, `predictions`, `results`, `leaderboard`, `account_requests`).
   - It enables **Row Level Security (RLS)** on all tables.
   - It configures public policies allowing the client `anon` key to securely read and write data.
   - It creates optimized database indices.

---

### Step 2: Database Seeding
To populate your database with the official FIFA World Cup 2026 fixtures and create your default administrator account:
1. In the root of the project, create a file named `.env` and fill it with your Supabase keys (found under Project Settings -> API in your Supabase dashboard):
   ```ini
   SUPABASE_URL="https://your-supabase-project.supabase.co"
   SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."
   ```
   *Note: Use the `service_role` key here because the seeding script needs high privileges to bypass RLS and insert initial entries.*
2. Run the seeding script in your terminal:
   ```bash
   node scripts/seed.js
   ```
3. Once completed, your database will have all 104 fixtures initialized, and a default admin user will be created:
   - **Username**: `admin`
   - **Secret Code**: `EXODUS2026` *(You can change this or add new users in the database users table).*

---

### Step 3: Cloudflare Worker API Setup
The Cloudflare Worker manages the background cron task that fetches live matches from APIs (e.g. `worldcup26.ir` or Zafronix) and updates scores and standings.
1. Navigate to the worker directory:
   ```bash
   cd workers/live-results
   ```
2. Upload the required environment secrets to Cloudflare using the Wrangler CLI. Execute each command and enter the value when prompted:
   ```bash
   npx wrangler secret put SUPABASE_URL
   npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
   npx wrangler secret put SEED_TOKEN
   ```
   - **SUPABASE_URL**: Your project URL.
   - **SUPABASE_SERVICE_ROLE_KEY**: The high-privilege service key so the worker can update scores and rebuild the leaderboard.
   - **SEED_TOKEN**: A secure string token of your choice (e.g. `exodus-secret-key-123`). This token is used to authorize manual triggers of the `/sync-scores` endpoint.
3. Deploy the worker to Cloudflare:
   ```bash
   npx wrangler deploy
   ```
   - *This mounts the worker at `https://exoduswcpredictor.your-username.workers.dev` and installs a Cron Trigger that executes the sync scores code automatically every 5 minutes.*

---

### Step 4: Run the React App Locally
1. Navigate back to the root folder:
   ```bash
   cd ../..
   ```
2. Start the local Vite development server:
   ```bash
   npm run dev
   ```
3. Open the local address in your browser (usually `http://localhost:5173`).
4. Click the **Connection Settings** button on the login screen to configure your frontend parameters:
   - **Supabase URL**: Your Supabase URL.
   - **Supabase Anon Key**: Your public `anon` key (not the service_role key!).
   - **Cloudflare Worker URL**: The URL of your deployed Cloudflare worker (from Step 3).
   - **Cloudflare SEED_TOKEN**: The `SEED_TOKEN` secret you configured (allows you to trigger sync from the header button).
5. Click **Save Settings**. The app will reload and connect to your database!
6. Log in with your admin credentials (`admin` / `EXODUS2026`) and start playing!

---

## 🎯 Scoring & Multipliers
The game computes points dynamically:
- **Exact Score**: 15 points (predicted score matches final score exactly).
- **Correct Outcome + Goal Difference within 1**: 8 points.
- **Correct Outcome Only**: 5 points.
- **Wrong Outcome**: 0 points.

To make late-stage knockout matches more critical, base points are multiplied depending on the round:
- **Group Stage / Round of 32**: x1 multiplier.
- **Round of 16**: x2 multiplier.
- **Quarter-Finals**: x3 multiplier.
- **Semi-Finals**: x4 multiplier.
- **Finals / 3rd Place**: x5 multiplier.

*(e.g., An exact prediction on the World Cup Final yields 15 x 5 = 75 points!)*
# wcpredictor
