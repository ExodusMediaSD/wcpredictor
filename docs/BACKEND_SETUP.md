# GGO WC 2026 - Google Apps Script Backend Setup

## ✅ Completed Setup

### Project Structure
```
ggowcpredictor/
├── .clasp.json                    # ✅ Configured with Script ID
├── src/
│   ├── appsscript.json           # ✅ Manifest (already configured)
│   ├── main.js                   # ✅ Main deployment endpoint (doGet/doPost)
│   ├── fixtures.js               # ✅ Fixture seeding logic
│   ├── leaderboard.js            # ✅ Scoring/leaderboard calculation
│   ├── supabase.js               # ✅ Supabase backup/fallback utilities
│   ├── firebase.js               # ✅ Firebase REST API utilities
│   ├── Code.js                   # ✅ Entry point (auto-loaded by clasp)
│   ├── config.gs                 # Old - can be archived
│   └── Firebase.gs               # Old - can be archived
```

### Key Files Created

**main.js**
- `doGet(e)` - HTTP GET endpoint for frontend to fetch fixtures/leaderboard/results
- `doPost(e)` - HTTP POST endpoint for backend operations
- Supports actions: `fixtures`, `sync`, `leaderboard`
- Error handling with JSON responses

**fixtures.js**
- `seedFixturesFromJSON()` - Reads worldcup.json and prepares 104 matches for Firebase
- `fetchAndUpdateLiveScores()` - Stub for API-Football integration (scheduled trigger)
- `parseWorldcupJSON()` - Parses openfootball format
- `validateFixture()` - Data validation

**leaderboard.js**
- `calculateAndUpdateLeaderboard()` - Fetches users, predictions, and results from Firestore with Supabase fallback, scores every player, and writes `leaderboard/current`
- `migrateFirestoreToSupabase()` - Copies Firestore users, fixtures, predictions, and results into matching Supabase tables after Firebase quota resets

**supabase.js**
- `fetchSupabaseCollection(table)` - Reads all rows from a Supabase table with pagination
- `writeToSupabaseBackup(table, payload)` - Upserts rows into Supabase using the table primary key
- Used automatically when Firestore reads fail because of quota/errors
- `calculateMatchPoints()` - Scoring system:
  - Exact score: **15 points**
  - Correct outcome: **5 points**
  - Close goal-difference match: **8 points**
  - Close wrong-outcome guess: **3 points**
- Head-to-head comparison helpers

**firebase.js**
- `firebaseGetFixtures()` - Fetch all fixtures from Firebase
- `firebaseGetResults()` - Fetch completed match results
- `firebaseGetPredictions()` - Fetch player predictions
- `firebaseSaveFixture/Result/LeaderboardEntry()` - Write data to Firebase
- Firebase document format conversion (Firestore REST API)
- Test connection helper

## 📋 Next Steps to Deploy

### 1. Deploy Code to Apps Script
```powershell
cd C:\Users\ben.arthur\Desktop\ggowcpredictor
clasp push
```

### 2. Set Up Deployment
In Google Apps Script editor (online):
- Go to **Deployments** → **New deployment**
- Type: **Web app**
- Execute as: Your account
- Who has access: **Anyone (anonymous)**
- Copy deployment URL (format: `https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec`)

### 3. Set Up Triggers (optional, for scheduled updates)
In Google Apps Script editor:
- **Triggers** (clock icon)
- New trigger → `scheduledLiveScoresUpdate` → Time-driven → Every minute
- New trigger → `scheduledLeaderboardUpdate` → Time-driven → Daily at 1 AM

### 4. Verify Firebase and Supabase Credentials
Firebase credentials live in `src/firebaseConfig.js` as `firebaseConfig`.

For Supabase, set Apps Script **Script Properties** when possible:
- `SUPABASE_URL`
- `SUPABASE_KEY`

If those properties are missing, `src/supabase.js` falls back to the Supabase values in `firebaseConfig`.

### 5. Seed Fixtures (One-time)
```bash
# Call via curl or fetch:
curl "https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec?action=seedFixtures"
```

Or from Apps Script editor Executions tab:
```javascript
seedFixturesFromJSON();
```

### 6. Update Frontend
In `scripts/app.js`, update the `requestSync()` function:
```javascript
async function requestSync() {
  try {
    const deploymentUrl = "https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec";
    const response = await fetch(`${deploymentUrl}?action=sync`);
    const data = await response.json();
    
    // Update UI with data
    console.log("Synced:", data);
  } catch (error) {
    console.error("Sync failed:", error);
  }
}
```

## 🔗 Frontend-Backend Integration Points

### From frontend (scripts/app.js):
```javascript
// Get fixtures
const fixturesUrl = `${APPS_SCRIPT_URL}?action=fixtures`;

// Get full sync
const syncUrl = `${APPS_SCRIPT_URL}?action=sync`;

// Get leaderboard
const leaderboardUrl = `${APPS_SCRIPT_URL}?action=leaderboard`;
```

### Responses from backend:
```json
// GET ?action=fixtures
{
  "fixtures": [...],
  "timestamp": "2026-06-10T...",
  "status": "ready"
}

// GET ?action=sync
{
  "fixtures": [...],
  "results": [...],
  "leaderboard": [...],
  "timestamp": "2026-06-10T..."
}

// GET ?action=leaderboard
{
  "leaderboard": [
    {"rank": 1, "playerName": "...", "totalPoints": 125},
    ...
  ],
  "timestamp": "2026-06-10T..."
}
```

## 📝 Scoring System Details

| Prediction | Points |
|-----------|---------|
| Exact score match | 15 |
| Correct outcome (W/D/L) | 5 |
| Correct outcome + off by 1 goal | 8 |
| Off by exactly 1 goal total | 3 |
| No match | 0 |

Example:
- Predict: 2-1, Actual: 2-1 → 15 points (exact)
- Predict: 2-0, Actual: 2-1 → 8 points (correct outcome, off by 1 goal on total)
- Predict: 1-0, Actual: 2-0 → 5 points (correct outcome only)

## 🔑 Architecture Notes

- **Single source of truth**: Apps Script reads from external APIs, writes to Firebase
- **Firebase as hub**: Frontend reads from Firebase, backend maintains it
- **Supabase as backup**: Apps Script falls back to Supabase when Firestore is unavailable and mirrors leaderboard rows there
- **No API keys exposed**: Frontend never calls external APIs directly
- **Scheduled updates**: Live scores every 60 seconds, leaderboard daily
- **Stateless**: Each request to Apps Script endpoint is independent

## 📁 Data Collections (Firebase)

```
fixtures/
├── match_1 → {matchId, date, team1, team2, group, status, ...}
├── match_2 → {...}
└── ...

results/
├── match_1 → {matchId, score1, score2, status, timestamp}
├── match_2 → {...}
└── ...

predictions/
├── user123_match1 → {playerId, matchId, score1, score2, timestamp}
├── user123_match2 → {...}
└── ...

leaderboard/
├── user123 → {playerId, playerName, totalPoints, rank, timestamp}
├── user456 → {...}
└── ...
```

## ⚠️ TODO - Firebase Integration

The backend is structured and ready. These Firebase calls need implementation:
1. [ ] Add Firebase REST API key to credentials
2. [ ] Test `firebaseGetFixtures()` connection
3. [ ] Complete `seedFixturesFromJSON()` to write to Firebase
4. [ ] Integrate API-Football for live scores
5. [ ] Test end-to-end flow: Login → View Fixtures → Predict → Calculate Scores

## 🚀 Deployment URL (Once Deployed)

Your deployment URL will be:
```
https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec
```

Share this with the frontend to call these actions:
- `?action=fixtures` - Get all matches
- `?action=sync` - Get complete sync (fixtures + results + leaderboard)
- `?action=leaderboard` - Get player rankings
