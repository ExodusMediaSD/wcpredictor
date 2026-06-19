# GGO WC 2026 Predictor — Setup Guide

---

## Prerequisites

- A Google account with access to the GGO Firebase project (`ggowcpredictor`)
- Access to the Apps Script project (Google Account that owns it)
- Access to the Supabase project `ggowcpredictor`
- Optionally: `clasp` installed (only needed to push backend changes)

> ⚠️ This PC has no admin/PATH access. All commands below use PowerShell built-ins or browser-based tools only.

---

## Step 1 — Verify Firebase Project

1. Open [Firebase Console](https://console.firebase.google.com) → project `ggowcpredictor`
2. Confirm Firestore database exists in region `me-central1`
3. Confirm these collections exist (create if missing):
   - `users`
   - `fixtures`
   - `predictions`
   - `results`
   - `leaderboard`
   - `teams`

---

## Step 2 — Add Players (users collection)

For each player, create a document in `users/{username}` with these fields:

| Field         | Type      | Example          |
| ------------- | --------- | ---------------- |
| `displayName` | string    | `"Ben Arthur"`   |
| `secretCode`  | string    | `"GGO2026"`      |
| `isAdmin`     | boolean   | `true` / `false` |
| `totalPoints` | number    | `0`              |
| `joinedAt`    | timestamp | (now)            |

You can do this directly in the Firebase Console UI, or use the Firestore REST API.

---

## Step 3 — Set API-Football Key in Apps Script

1. Open [Apps Script](https://script.google.com) → project linked to `ggowcpredictor`
2. Go to **Project Settings → Script Properties**
3. Add property:
   - Key: `API_FOOTBALL_KEY`
   - Value: your api-sports.io key

> ⚠️ Never put this key in `index.html`, `scripts/app.js`, or any frontend file.

---

## Step 4 — Seed Fixtures into Firestore

**Option A (recommended): Run from Apps Script editor**

1. Upload `2026/worldcup.json` to the Google Drive of the account that owns the Apps Script.
2. In the Apps Script editor, open `fixtures.js`, select `seedFixturesFromJSON`, and click **Run**.
3. Check the Execution Log — should report `~104 created, 0 failed`.

**Option B: Manual paste**

If Drive access is unavailable, paste the JSON content directly as a parameter to a modified version of `seedFixturesFromJSON` that accepts inline data.

---

## Step 5 — Set Up Scheduled Triggers

In the Apps Script editor:

1. Go to **Triggers** (clock icon)
2. Add trigger:
   - Function: `scheduledLiveScoresUpdate`
   - Event source: Time-driven
   - Type: Hour timer, every 1 hour
3. Add trigger:
   - Function: `scheduledLeaderboardUpdate`
   - Event source: Time-driven
   - Type: Day timer (e.g. midnight)

---

## Step 6 — Configure Supabase Backup

1. Open Supabase project `ggowcpredictor`.
2. Run the SQL in [SUPABASE_SETUP.md](SUPABASE_SETUP.md).
3. In Apps Script **Project Settings → Script Properties**, add:
   - `SUPABASE_URL`: `https://nthnysznieivbkncpqrk.supabase.co`
   - `SUPABASE_KEY`: the Supabase publishable key
4. After Firebase quota resets, run `migrateFirestoreToSupabase()` once from Apps Script.

The backend will try Firestore first and fall back to Supabase if Firestore is blocked by quota.

---

## Step 7 — Configure the Browser App

1. Open `index.html` in a browser (serve via local web server, not `file://` — fetch requires HTTP).
2. Log in with an admin account.
3. Click the settings gear → enter the **Game Data API URL**:
   ```
   https://script.google.com/macros/s/AKfycbwk6Xx2K9Y043hGFKCkMcIYfphV3mL3-qkNkR7yIyDEabPUqzNvseHmVwxCmmY6QN6L/exec
   ```
4. Click **Save & Reconnect** → it should sync and show fixtures.

---

## Step 8 — Serve Locally (for testing)

Since this PC has no global CLI, use PowerShell's built-in HTTP listener or Python (if installed):

```powershell
# Check if Python is available
python --version

# If yes, serve from the project folder:
python -m http.server 8080 --directory "C:\Users\abdel\OneDrive\Desktop\ggofiles\ggowcpredictor"

# Then open: http://localhost:8080
```

---

## Step 9 — Deploy for Team

Options (no CLI required):

- **Firebase Hosting**: Upload `index.html`, `style.css`, `scripts/`, `2026/`, and image assets via the Firebase Console file browser.
- **GitHub Pages**: Push repo to GitHub → enable Pages on the root or `ggowcpredictor/` folder.
- **SharePoint / OneDrive share link**: Share `index.html` (note: `fetch` may fail on some SharePoint origins — prefer a real web server).

---

## Firestore Security Rules (Before Going Live)

Add these rules to prevent clients from writing results or manipulating other players' predictions:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Anyone authenticated can read
    match /fixtures/{doc} { allow read; allow write: if false; }
    match /results/{doc}  { allow read; allow write: if false; }
    match /leaderboard/{doc} { allow read; allow write: if false; }
    match /teams/{doc}    { allow read; allow write: if false; }
    match /users/{username} { allow read; allow write: if false; }

    // Predictions: users can write only their own, read all
    match /predictions/{predId} {
      allow read;
      allow write: if predId.matches(request.auth.uid + '_.*');
    }
  }
}
```

> ⚠️ Currently the app uses username/secretCode auth, NOT Firebase Auth. Until Firebase Auth is wired up, keep rules permissive in dev. Lock them down before sharing with the team.
