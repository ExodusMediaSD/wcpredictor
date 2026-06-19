# Firebase Setup Guide for GGO WC 2026 Predictor

## Step 1: Firebase Console Configuration

### Create Collections in Firestore

```
firebaseapp.com/ggowcpredictor
  ├── users/
  │   ├── {username} (document)
  │   │   ├── displayName: string
  │   │   ├── secretCode: string (hashed in production)
  │   │   ├── isAdmin: boolean
  │   │   ├── totalPoints: number
  │   │   ├── joinedAt: timestamp
  │   │   └── lastSyncAt: timestamp
  │
  ├── fixtures/
  │   ├── {matchId} (document)
  │   │   ├── round: string (group/r32/qf/sf/3rd/final)
  │   │   ├── group: string (A-H or null)
  │   │   ├── date: string (YYYY-MM-DD)
  │   │   ├── kickoffUTC: timestamp
  │   │   ├── team1: string
  │   │   ├── team2: string
  │   │   ├── stage: string
  │   │   └── apiFixtureId: number
  │
  ├── results/
  │   ├── {matchId} (document)
  │   │   ├── team1Score: number
  │   │   ├── team2Score: number
  │   │   ├── status: string (NS/1H/HT/2H/FT/AET/PEN)
  │   │   └── lastUpdated: timestamp
  │
  ├── predictions/
  │   ├── {username}_{matchId} (document ID)
  │   │   ├── username: string
  │   │   ├── matchId: string
  │   │   ├── pred1: number
  │   │   ├── pred2: number
  │   │   ├── submittedAt: timestamp
  │   │   ├── pointsAwarded: number (null until result entered)
  │   │   └── scoredAt: timestamp (null until result entered)
  │
  └── leaderboard/
      └── current (document)
          └── players: array of {username, totalPoints, exactCount, outcomeCount}
```

---

## Step 2: Firebase Security Rules (Firestore)

Copy this into **Firestore Rules** tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users: only self can read, admin can read all
    match /users/{username} {
      allow read: if request.auth.uid == username || isAdmin(username);
      allow write: if false; // backend only
    }
    
    // Fixtures: everyone can read
    match /fixtures/{matchId} {
      allow read: if true;
      allow write: if false; // backend only
    }
    
    // Results: everyone can read
    match /results/{matchId} {
      allow read: if true;
      allow write: if false; // backend only
    }
    
    // Predictions: user can read/write own, admin can read all
    match /predictions/{document=**} {
      allow read: if isUserPrediction(document) || isAdmin(request.auth.uid);
      allow write: if isUserPrediction(document);
    }
    
    // Leaderboard: everyone can read
    match /leaderboard/{document=**} {
      allow read: if true;
      allow write: if false; // backend only
    }
    
    // Helper functions
    function isAdmin(uid) {
      return get(/databases/$(database)/documents/users/$(uid)).data.isAdmin == true;
    }
    
    function isUserPrediction(docPath) {
      let parts = docPath.split('_');
      return request.auth.uid == parts[0];
    }
  }
}
```

---

## Step 3: Initialize Firebase in JavaScript

Update `script.js` to add Firebase config initialization (top of file, after `const SESSION = {...}`):

```javascript
// Firebase initialization (from Firebase Console)
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, query, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Get from Firebase Console
  authDomain: "ggowcpredictor.firebaseapp.com",
  projectId: "ggowcpredictor",
  storageBucket: "ggowcpredictor.firebasestorage.app",
  messagingSenderId: "126058028551",
  appId: "1:126058028551:web:e60b6e211c3e2e56e154a2",
  measurementId: "G-YQLEYQ386D"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Global Firebase reference
window.firebaseDB = db;
```

---

## Step 4: Update `handleLogin()` in script.js

Replace the stub with real Firebase auth:

```javascript
async function handleLogin() {
  const username = document.getElementById("login-name").value.trim();
  const code = document.getElementById("login-code").value.trim();
  const errEl = document.getElementById("login-error");

  if (!username || !code) {
    errEl.textContent = "Please select your name and enter your code.";
    errEl.classList.add("show");
    return;
  }

  try {
    // Fetch user from Firestore
    const userRef = doc(db, "users", username);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      errEl.textContent = "User not found.";
      errEl.classList.add("show");
      return;
    }

    const userData = userSnap.data();
    
    // Verify secret code (compare plain text for now, hash in production)
    if (userData.secretCode !== code) {
      errEl.textContent = "Invalid code. Try again.";
      errEl.classList.add("show");
      return;
    }

    // Login successful
    const token = btoa(username + ":" + Date.now());
    sessionStorage.setItem("ggo_wc_token", token);
    sessionStorage.setItem("ggo_wc_user", username);
    sessionStorage.setItem("ggo_wc_displayname", userData.displayName);
    sessionStorage.setItem("ggo_wc_admin", userData.isAdmin);

    SESSION.token = token;
    SESSION.username = username;
    SESSION.displayName = userData.displayName;
    SESSION.isAdmin = userData.isAdmin;

    errEl.classList.remove("show");
    showApp();
    requestSync();
  } catch (e) {
    console.error("Login error:", e);
    errEl.textContent = "Login failed. Try again.";
    errEl.classList.add("show");
  }
}
```

---

## Step 5: Update `requestSync()` to Fetch Real Data

```javascript
async function requestSync() {
  const dot = document.getElementById("sync-dot");
  const timeEl = document.getElementById("last-sync-time");
  const syncBtn = document.querySelector(".sync-btn");

  dot.className = "status-dot loading";
  timeEl.textContent = "Syncing…";
  syncBtn.classList.add("loading");

  try {
    // Fetch fixtures
    const fixturesSnap = await getDocs(collection(db, "fixtures"));
    STATE.fixtures = fixturesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Fetch results
    const resultsSnap = await getDocs(collection(db, "results"));
    STATE.results = {};
    resultsSnap.docs.forEach(doc => {
      STATE.results[doc.id] = doc.data();
    });

    // Fetch user's predictions
    if (SESSION.username) {
      const predsSnap = await getDocs(
        query(collection(db, "predictions"), where("username", "==", SESSION.username))
      );
      STATE.predictions = {};
      predsSnap.docs.forEach(doc => {
        const data = doc.data();
        STATE.predictions[data.matchId] = data;
      });
    }

    // Fetch leaderboard
    const lbSnap = await getDoc(doc(db, "leaderboard", "current"));
    if (lbSnap.exists()) {
      STATE.leaderboard = lbSnap.data().players || [];
    }

    STATE.lastSync = new Date();
    dot.className = "status-dot active";
    timeEl.textContent = "Live · " + STATE.lastSync.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    renderPredictions();
    renderLeaderboard();
    renderResults();
    renderBracket();
  } catch (e) {
    dot.className = "status-dot";
    timeEl.textContent = "Sync failed";
    console.error("Sync error:", e);
  }

  syncBtn.classList.remove("loading");
}
```

---

## Step 6: Seed Fixtures & Users in Firebase

**Run once in Firebase Console shell or via a seeding script:**

### Seed Users
```javascript
const usersData = [
  { username: "ben_arthur", displayName: "Ben Arthur", secretCode: "1234", isAdmin: true },
  { username: "jimmy", displayName: "Jimmy", secretCode: "5678", isAdmin: false },
  { username: "jane", displayName: "Jane", secretCode: "9012", isAdmin: false },
  { username: "selene", displayName: "Selene", secretCode: "3456", isAdmin: false }
];

await Promise.all(
  usersData.map(u => setDoc(doc(db, "users", u.username), { ...u, joinedAt: new Date(), totalPoints: 0 }))
);
```

### Seed 104 Fixtures
*(Use API-Football data or manually for now)*

---

## Step 7: Store Football API Key in Firebase (NOT in HTML)

**Option A: Cloud Function (Recommended)**
- Store API key in Firebase Environment Variables
- Create HTTP trigger function to fetch scores
- Set scheduled trigger to sync every 60 seconds

**Option B: Server-side Node.js sync**
- Run on your machine or hosting
- Fetches from API-Football, writes to Firestore

---

## Next: Check HTML/JS for Missing Pieces

Now reviewing the existing files for gaps...
