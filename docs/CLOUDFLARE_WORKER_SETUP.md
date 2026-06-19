# Cloudflare Worker Backend Setup & Verification Guide

This guide describes how to configure, run, and test the Cloudflare Worker backend for the GGO WC 2026 Predictor.

---

## ⚙️ Prerequisites & Environment Setup

The Cloudflare Worker requires several environment variables for Supabase (primary database) and Firestore (backup database) access.

### 1. Local Configuration (`.dev.vars`)
Create a file named `.dev.vars` in the root of the project to store your secret environment variables for local testing (Wrangler automatically loads this file).

```ini
SUPABASE_URL="https://nthnysznieivbkncpqrk.supabase.co"
SUPABASE_KEY="sb_publishable_q4iEOMH_S09dgmg3mHtK-w_08jFDVUo"
FIREBASE_PROJECT_ID="ggowcpredictor"
FIREBASE_SERVICE_ACCOUNT_JSON='{"type": "service_account", "project_id": "ggowcpredictor", ...}'
ZAFRONIX_API_KEY="your-zafronix-key-optional"
API_FOOTBALL_KEY="e532b2712d33b3c4d7d6ed963c85703a"
SEED_TOKEN="ggo-secret-admin-token-123"
```

---

## 🚀 Local Development & Testing

You can run the Cloudflare Worker locally using the Wrangler CLI.

### 1. Start Wrangler Dev Server
Run the dev server in the workspace directory:
```powershell
npx wrangler dev
```
By default, this will spin up the local worker at:
`http://localhost:8787`

---

## 🔍 API Testing & Verification

Once the local dev server is running, you can test the endpoints using `curl` or any API client (like Postman or a web browser).

### 1. Test Root Endpoint
Retrieve general API routing info:
```powershell
curl http://localhost:8787/
```
**Expected Response:**
```json
{
  "ok": true,
  "routes": ["/sync", "/sync-scores", "/fixtures", "/leaderboard"],
  "message": "GGO WC 2026 Predictor API. Use /sync for all data, /sync-scores to trigger live score fetch."
}
```

### 2. Test Fetching Data (`/sync`)
Fetch all current fixtures, results, user profiles, and calculated leaderboard standings:
```powershell
curl http://localhost:8787/sync
```

### 3. Test Triggering a Score Sync & Recalculation (`/sync-scores`)
This triggers the live matches fetch, updates databases, and recalculates the leaderboard. It requires authentication.

**Option A: Using Query Parameters**
```powershell
curl "http://localhost:8787/sync-scores?token=ggo-secret-admin-token-123"
```

**Option B: Using Authorization Headers**
```powershell
curl -H "Authorization: Bearer ggo-secret-admin-token-123" http://localhost:8787/sync-scores
```

**Expected Response:**
```json
{
  "success": true,
  "matched": 4,
  "updated": 4,
  "leaderboard": [...],
  "mode": "manual-sync-scores"
}
```

### 4. Test Sub-endpoints
- **Fixtures only**: `curl http://localhost:8787/fixtures`
- **Leaderboard only**: `curl http://localhost:8787/leaderboard`

---

## 💾 Data Verification Steps

To verify that the worker is reading and writing correctly:

1. **Verify Supabase**:
   - Open your Supabase Console.
   - Navigate to the Table Editor and inspect `fixtures`, `results`, `predictions`, and `leaderboard`.
   - Verify that data synced via `/sync-scores` is saved in the tables.
2. **Verify Firestore Failover (Testing Fallback)**:
   - Temporarily rename `SUPABASE_URL` in `.dev.vars` to an invalid URL.
   - Send a `GET` request to `http://localhost:8787/sync`.
   - Verify that the worker successfully falls back to Firestore REST endpoints, logs a warning on Supabase failure, and returns valid database records.
