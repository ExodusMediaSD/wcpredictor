# Firebase Integration Checklist

## ❌ MISSING IN CURRENT CODE

### 1. **Firebase SDK Not Imported**
- **Location**: `script.js` top
- **Missing**:
  ```javascript
  import { initializeApp } from "firebase/app";
  import { getFirestore, doc, getDoc, setDoc, collection, getDocs, query, where } from "firebase/firestore";
  ```
- **Action**: Add imports at very top of script.js, or add `<script type="module">` tag to HTML

### 2. **No Firebase Initialization**
- **Location**: `script.js` after SESSION object
- **Missing**:
  ```javascript
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  window.firebaseDB = db;
  ```
- **Action**: Add Firebase config + init code

### 3. **CONFIG Object Still Has Old Keys**
- **Current**:
  ```javascript
  const CONFIG = {
    appsScriptUrl: localStorage.getItem("ggo_wc_url") || "",
    apiKey: localStorage.getItem("ggo_wc_key") || "",
  };
  ```
- **Should Be**: Delete entirely, Firebase config is in firebaseConfig object
- **Action**: Remove CONFIG object completely

### 4. **handleLogin() Uses Mock Auth**
- **Current**: `const mockResult = { ok: true, ... }` (placeholder)
- **Should Be**: Real Firestore lookup + secret code verification
- **Action**: Replace entire function with Firebase version from FIREBASE_SETUP.md Step 4

### 5. **requestSync() is Fake**
- **Current**: `await new Promise((r) => setTimeout(r, 800)); // simulate`
- **Should Be**: Real Firestore queries for fixtures, results, predictions, leaderboard
- **Action**: Replace with Firebase version from FIREBASE_SETUP.md Step 5

### 6. **Dropdown Seeding Not Implemented**
- **Current**: Hardcoded `demoNames` array
- **Should Be**: Fetch from Firestore users collection
- **Action**: Add:
  ```javascript
  async function seedUserDropdown() {
    const usersSnap = await getDocs(collection(db, "users"));
    const sel = document.getElementById("login-name");
    usersSnap.docs.forEach(doc => {
      const user = doc.data();
      const option = document.createElement("option");
      option.value = doc.id; // username
      option.textContent = user.displayName;
      sel.appendChild(option);
    });
  }
  ```
  Call in DOMContentLoaded before everything else

### 7. **Prediction Submission Not Wired**
- **Current**: No handler for `.pred-input` fields
- **Missing**: 
  ```javascript
  function savePrediction(matchId, pred1, pred2) {
    const docId = `${SESSION.username}_${matchId}`;
    return setDoc(
      doc(db, "predictions", docId),
      {
        username: SESSION.username,
        matchId: matchId,
        pred1: parseInt(pred1),
        pred2: parseInt(pred2),
        submittedAt: new Date(),
        pointsAwarded: null,
        scoredAt: null
      },
      { merge: true }
    );
  }
  ```
- **Action**: Add event listeners to prediction inputs + save handler

### 8. **renderPredictions() is Empty**
- **Current**: Just shows empty state
- **Should Be**:
  ```javascript
  function renderPredictions() {
    const el = document.getElementById("predictions-list");
    if (STATE.fixtures.length === 0) {
      el.innerHTML = `<div class="empty-state">...</div>`;
      return;
    }
    // Group by matchday
    // For each fixture:
    //  - Show team flags + names
    //  - Show prediction inputs (disabled if match started)
    //  - Show lock status
    //  - Show points if match is complete
  }
  ```
- **Action**: Implement full render logic

### 9. **renderLeaderboard() is Empty**
- **Current**: Just shows "No predictions scored yet"
- **Should Be**:
  ```javascript
  function renderLeaderboard() {
    const tbody = document.getElementById("leaderboard-body");
    if (STATE.leaderboard.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6">Loading...</td></tr>`;
      return;
    }
    // For each player in STATE.leaderboard:
    //  - Row with rank, name, points, exact, outcome, predicted
    //  - Highlight current user
  }
  ```
- **Action**: Implement full render logic

### 10. **renderResults() is Empty**
- **Current**: Just shows empty state
- **Should Be**:
  ```javascript
  function renderResults() {
    const el = document.getElementById("results-list");
    if (Object.keys(STATE.results).length === 0) {
      el.innerHTML = `<div class="empty-state">...</div>`;
      return;
    }
    // For each result in STATE.results:
    //  - Show match cards with final scores
    //  - Show live status indicator if match ongoing
  }
  ```
- **Action**: Implement full render logic

### 11. **renderBracket() is Empty**
- **Current**: TODO comment only
- **Should Be**: Build knockout tree from group predictions + results
- **Action**: Implement bracket rendering (complex)

### 12. **Filter Functions Not Wired**
- **Current**: `filterMatches()` and `filterResults()` have TODO comments
- **Should Be**: Actually filter STATE arrays and re-render
- **Action**: Implement filter logic

### 13. **Settings Modal Not Complete**
- **Current**: Modal exists but save handler might not work with Firebase
- **Should Be**: Check if needed at all (Firebase config is static, not user-editable)
- **Action**: Possibly remove or repurpose for user preferences

### 14. **No Error Handling**
- **Current**: No try/catch in most places
- **Should Be**: Wrap all Firestore calls in try/catch
- **Action**: Add error handling throughout

### 15. **No Debouncing on Prediction Inputs**
- **Current**: Would save immediately on every keystroke
- **Should Be**: Debounce 500ms before saving
- **Action**: Add debounce wrapper:
  ```javascript
  function debounce(fn, ms) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  }
  ```

---

## ✅ IMPLEMENTATION ORDER

1. **Add Firebase imports** → Make it a module
2. **Initialize Firebase** → Firestore connection ready
3. **Seed user dropdown** → Can login with real users
4. **Update handleLogin()** → Real auth working
5. **Update requestSync()** → Real data fetching
6. **Implement renderLeaderboard()** → See rankings
7. **Implement renderPredictions()** → Can enter predictions
8. **Add savePrediction()** → Predictions persist
9. **Implement renderResults()** → See match results
10. **Implement renderBracket()** → See knockout stage
11. **Add filter logic** → Can filter matches
12. **Polish + error handling** → Production ready
