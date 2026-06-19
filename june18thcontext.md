Claude finished the response

Claude finished the response bennnnnnyyyyyyyy/ggowcpredictor main GITHUB i have 74 points in leaderboard, but in profile it shows this, GGO WC 2026 Player Profile [Back to Predictor](https://bennnnnnyyyyyyyy.github.io/ggowcpredictor/index.html) BA #11 Ben Arthur @ben_arthur Rank #11

pasted

bennnnnnyyyyyyyy/ggowcpredictor
main

GITHUB

11:48 AM
Let me pull the current files from GitHub to produce the exact corrected versions.

Ran 3 commands, viewed a file
Ran 3 commands, viewed a file
Good — the worker already has the recalculateLeaderboard fix applied. The worker is correct. The problem is still showing 35pts, which means either the worker hasn't been deployed or there's a frontend caching issue.

Let me check profile.js:

Viewed 2 files
Viewed 2 files
Found it. Line 247 — the Supabase fallback buildProfilePayload uses lb.totalPoints ?? totalPoints. When lb.totalPoints is 0 (falsy but valid) OR when the Supabase leaderboard row has a stale value of 35, it returns 35. The worker path is correct, but the worker URL on the profile page is falling back to localhost:8787 — meaning it's hitting Supabase directly instead.

Viewed 2 files
Viewed 2 files
Now I have the full picture. The profile.js and worker are both already patched from the previous session. The real problem: getWorkerUrl() returns localhost:8787 because ggo_wc_url isn't set in localStorage for the profile page — so it falls through to Supabase direct, which uses the stale leaderboard table showing 35.

Two fixes needed:

buildProfilePayload (Supabase fallback) — lb.totalPoints ?? totalPoints must become a recalculated sum, not trust the stale leaderboard table
getWorkerUrl — default must be the deployed worker URL, not localhost

Ran 3 commands
Ran 3 commands
There it is. app.js defaults to https://ggowcpredictor.ben-arthur-wiz.workers.dev but profile.js still defaults to localhost:8787. Since the profile page is a separate page with its own localStorage scope, if ggo_wc_url was never set from that page it falls back to localhost → worker fails → Supabase fallback → stale 35pts.

Fix is two things:

Change the default in getWorkerUrl() in profile.js to the deployed URL
Fix buildProfilePayload to not trust stale lb.totalPoints (use recalculated sum as the source of truth in the fallback path)

Edited 2 files
Edited 2 files
Now fix buildProfilePayload — the Supabase fallback — so it never trusts the stale leaderboard table for totalPoints. It should always use the recalculated sum:

Fix buildProfilePayload to use recalculated totalPoints, not stale lb table
Fix buildProfilePayload to use recalculated totalPoints, not stale lb table
Now verify the changes look right:

Verify all three fixes
Verify all three fixes
Clean. No more localhost:8787, no more stale lb.\* trust. Now copy to outputs:

Ran a command, read a file
Ran a command, read a file
Root cause was simple: wrong default URL.

profile.js defaulted to localhost:8787 while app.js defaulted to the deployed worker. So on the profile page, the worker call always failed silently → fell back to Supabase direct → buildProfilePayload used the stale leaderboard table showing 35pts.

Three changes made:

Location Change
getWorkerUrl() line 94 localhost:8787 → https://ggowcpredictor.ben-arthur-wiz.workers.dev
loadRivalry() line 280 Same URL fix
buildProfilePayload() return Removed lb.totalPoints ?? — always use the freshly recalculated sum
The third change is a safety net: even if the worker ever fails again, the Supabase fallback will now recalculate from raw predictions+results instead of trusting the stale leaderboard table.

Deploy scripts/profile.js and the 35→93pts discrepancy goes away.

Profile
JS

PS C:\Users\abdel\OneDrive\Desktop\ggofiles\ggowcpredictor> git push Enumerating objects: 17, done. Counting objects: 100% (17/17), done. Delta compression using up to 8 threads Compressing objects: 100% (8/8), done. Writing objects: 100% (9/9), 6.20 KiB | 577.00 KiB/s, done. Total 9 (delta 7)

pasted

Ben.arthur.wiz@gmail.com's Account Account home Recents ggowcpredictor Workers Dashboards Analytics Workers & Pages Compute Overview Domains bd2026 Workers Domains Observe Investigate Analytics Build Compute Workers & Pages Observability Workers for Platfor

pasted

i deployerd

11:52 AM
RLS is blocking the cron writes. The worker is using the anon/publishable key but needs the service role key for upserts.

Check how the worker resolves the Supabase key
Check how the worker resolves the Supabase key
The code already looks for SUPABASE_SERVICE_KEY first. The issue is that binding isn't set in Cloudflare — the worker is falling through to SUPABASE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) which is the anon key.

Check what's actually bound:

Ran 5 commands
Ran 5 commands
No wrangler.toml in the repo — it's gitignored (contains secrets). The fix needs to be done via Cloudflare dashboard or wrangler secret.

The fix is simple: add SUPABASE_SERVICE_KEY as a secret in Cloudflare with your Supabase service role key.

The problem: Your Supabase results and leaderboard tables have RLS enabled. The cron/worker uses the anon key which is blocked by RLS policies. The service role key bypasses RLS.

Fix — run this in your terminal:

bash
wrangler secret put SUPABASE_SERVICE_KEY
When prompted, paste your Supabase service_role key (from Supabase Dashboard → Project Settings → API → service_role — the long eyJ... one, not the anon key).

Then redeploy:

bash
wrangler deploy
That's it. The worker code already prioritizes SUPABASE_SERVICE_KEY over SUPABASE_KEY, so once the secret is set the 401s stop and the cron writes will succeed.

To verify it worked, after deploying run your sync-scores curl again and check the Cloudflare logs — the 401 warnings should be gone and you'll see the leaderboard updating every 5 minutes.

i want a script to see if firestore is on sync with supabase

11:57 AM

Ran 2 commands
Ran 2 commands
Claude's response was interrupted.
bennnnnnyyyyyyyy/ggowcpredictor
main

GITHUB

i need help adding flags

instead of team code <div class="match-teams">
<div class="team"><div class="team-name"><span class="team-code">KOR</span>South Korea</div></div>
<div class="result-score">2 - 1</div>
<div class="team"><div class="team-name"><span class="team-code">CZE</span>Czech Republic</div></div>
</div>

i want a png of the flags, i have a repo with all of the links
https://flagdownload.com/

i just dont want to fuck up the orientation

Show more
12:00 PM
Let me check that flags repo first.

Searched the web
Searched the web
That site is a download page, not a CDN — no direct PNG URLs. Better to use a proper flag CDN. The most reliable one used in projects like this is flagcdn.com which serves flags by ISO 2-letter country code.

Map all WC 2026 teams to ISO codes
Map all WC 2026 teams to ISO codes
Good. Now I'll write the changes — a getTeamFlag() function in app.js and the updated render HTML. Keeping the layout unchanged, just swapping the <span class="team-code"> chip for a flag <img> everywhere it appears.

Find all flag/team-code usage in app.js
Find all flag/team-code usage in app.js
This response didn't load.
bennnnnnyyyyyyyy/ggowcpredictor
main

GITHUB

i need help adding flags

instead of team code <div class="match-teams">
<div class="team"><div class="team-name"><span class="team-code">KOR</span>South Korea</div></div>
<div class="result-score">2 - 1</div>
<div class="team"><div class="team-name"><span class="team-code">CZE</span>Czech Republic</div></div>
</div>

i want a png of the flags, i have a repo with all of the links
https://flagdownload.com/

i just dont want to fuck up the orientation

Show more
12:01 PM
dont edit it all if its hard tell me what to do

12:01 PM
Easy fix. Use flagcdn.com — it's a free CDN, no download needed, just a URL with the country's 2-letter code.

What to do:

Add this function to scripts/app.js (anywhere near getTeamCode):
js
const TEAM_FLAG_CODES = {
"mexico": "mx", "south africa": "za", "south korea": "kr",
"czech republic": "cz", "canada": "ca", "bosnia & herzegovina": "ba",
"usa": "us", "paraguay": "py", "qatar": "qa", "switzerland": "ch",
"brazil": "br", "morocco": "ma", "haiti": "ht", "scotland": "gb-sct",
"australia": "au", "turkey": "tr", "germany": "de", "curaçao": "cw",
"netherlands": "nl", "japan": "jp", "ivory coast": "ci", "ecuador": "ec",
"sweden": "se", "tunisia": "tn", "belgium": "be", "egypt": "eg",
"iran": "ir", "new zealand": "nz", "spain": "es", "cape verde": "cv",
"saudi arabia": "sa", "uruguay": "uy", "france": "fr", "senegal": "sn",
"iraq": "iq", "norway": "no", "argentina": "ar", "algeria": "dz",
"austria": "at", "jordan": "jo", "portugal": "pt", "dr congo": "cd",
"uzbekistan": "uz", "colombia": "co", "england": "gb-eng",
"croatia": "hr", "ghana": "gh", "panama": "pa"
};

function getFlagImg(teamName) {
const code = TEAM_FLAG_CODES[String(teamName).toLowerCase().trim()];
if (!code) return `<span class="team-code">${escapeHtml(getTeamCode(teamName))}</span>`;
return `<img class="inline-flag-img" src="https://flagcdn.com/w40/${code}.png" alt="${escapeHtml(teamName)}" width="40" height="27">`;
}
In style.css, you already have .inline-flag-img defined. Done.
In renderResults() inside app.js, find this line (×2):
js
<span class="team-code">${escapeHtml(getTeamCode(fixture.team1))}</span>
Replace both with:

js
${getFlagImg(fixture.team1)}
That's it — only touches the results cards. Test it first before doing prediction cards and bracket.

return `
<article class="result-card" onclick="openMatchDrawer('${fixture.matchId}')">
<div class="match-date">${formatKickoff(fixture)}</div>
          <div class="match-teams">
            <div class="team"><div class="team-name">${getFlagImg(fixture.team1)}${escapeHtml(fixture.team1)}</div></div>
            <div class="result-score">${result.score1 ?? "-"} - ${result.score2 ?? "-"}</div>
            <div class="team"><div class="team-name">${getFlagImg(fixture.team2)}${escapeHtml(fixture.team2)}</div></div>
</div>

flags are still a bit fuzzy but lets add to predictions
Show more
12:03 PM
For predictions the flag goes in .team-mark (the green box). Replace the team-mark div in renderPredictionCard:

Find:

js

<div class="team-mark">${escapeHtml(team1Code)}</div>
Replace both (team1 and team2) with:

js

<div class="team-mark">${getFlagImg(match.team1)}</div>
and

js

<div class="team-mark">${getFlagImg(match.team2)}</div>
For the fuzziness — bump the CDN size from w40 to w80 in the function:

js
return `<img class="inline-flag-img" src="https://flagcdn.com/w80/${code}.png" ...>`;
And update the CSS to display it at the right size:

css
.inline-flag-img {
width: 40px;
height: 27px;
object-fit: cover;
border-radius: 2px;
border: 1px solid rgba(255, 255, 255, 0.2);
flex-shrink: 0;
}
Fetch w80 but display at 40px = sharp on all screens including retina.

want to make prediction box more sompact on mobile

12:06 PM
Share a screenshot or describe what's taking up too much space — the score inputs, team names, venue/kickoff header, or all of it?

unnamed.png
12:07 PM
The problem is clear — on mobile the layout stacks vertically (team → score → team) making each card massive. Need to switch to a horizontal row layout on mobile like the results cards.

Add this to the bottom of style.css:

css
@media (max-width: 768px) {
/_ Horizontal layout: flag+name | score | flag+name _/
.mc-body {
grid-template-columns: 1fr auto 1fr !important;
gap: 8px !important;
padding: 12px 10px !important;
}

.mc-team,
.mc-team:first-child,
.mc-team:last-child {
flex-direction: column;
align-items: center !important;
text-align: center !important;
gap: 4px;
}

/_ Smaller flag box _/
.team-mark {
width: 44px !important;
height: 32px !important;
font-size: 16px !important;
}

.team-mark .inline-flag-img {
width: 100% !important;
height: 100% !important;
object-fit: cover;
}

.mc-name {
font-size: 11px !important;
max-width: 80px !important;
line-height: 1.1;
}

/_ Tighten the score input _/
.score-input {
width: 48px !important;
height: 42px !important;
font-size: 20px !important;
}

/_ Shrink the result grid _/
.mc-result-grid {
width: 160px !important;
gap: 4px !important;
}

.mc-result-score {
font-size: 20px !important;
}

.mc-result-score--sub {
font-size: 14px !important;
}

/_ Tighten header _/
.mc-header {
padding: 10px 12px !important;
gap: 6px !important;
}

.mc-kickoff {
font-size: 13px !important;
}

.mc-venue strong {
font-size: 12px !important;
}
}
This keeps the 3-column grid on mobile instead of collapsing to 1 column, and shrinks all the elements to fit. Each card should now be roughly half the height.

You are out of free messages until 4:30 PM

Claude is AI and can make mistakes. Please double-check responses.
Profile · JS
// GGO WC 2026 — Player Profile Script
// Reads ?user= from URL, fetches data from Worker /profile endpoint,
// falls back to Supabase direct, then Firestore.

// ─── Config (mirrors app.js) ────────────────────────────────────────────────

const firebaseConfig = {
apiKey: "AIzaSyAVBLnjdM4cV9vBwV27dl6bEc4ZqVjuFBw",
authDomain: "ggowcpredictor.firebaseapp.com",
projectId: "ggowcpredictor",
storageBucket: "ggowcpredictor.firebasestorage.app",
messagingSenderId: "126058028551",
appId: "1:126058028551:web:e60b6e211c3e2e56e154a2",
};

const supabaseConfig = {
url: "https://nthnysznieivbkncpqrk.supabase.co",
key: "sb_publishable_q4iEOMH_S09dgmg3mHtK-w_08jFDVUo",
};

// ─── Supabase helpers ────────────────────────────────────────────────────────

function sbHeaders(extra = {}) {
return Object.assign(
{
apikey: supabaseConfig.key,
Authorization: `Bearer ${supabaseConfig.key}`,
},
extra,
);
}

async function sbSelect(table, selectQ = "\*", filterQ = "") {
let qs = `select=${encodeURIComponent(selectQ)}`;
if (filterQ) qs += `&${filterQ}`;
const base = supabaseConfig.url.replace(/\/$/, "");
  const res = await fetch(`${base}/rest/v1/${table}?${qs}`, {
    headers: sbHeaders(),
  });
  if (!res.ok) throw new Error(`Supabase ${table} HTTP ${res.status}`);
return res.json();
}

// ─── Firebase ────────────────────────────────────────────────────────────────

let db = null;
function initFirebase() {
if (!window.firebase?.initializeApp) return;
try {
firebase.initializeApp(firebaseConfig);
db = firebase.firestore();
} catch (e) {
console.warn("Firebase init failed:", e.message);
}
}

// ─── Scoring (mirrors app.js calculateMatchPoints) ──────────────────────────

function calcPoints(p1, p2, a1, a2) {
if (p1 === a1 && p2 === a2) return 15;
const po = Math.sign(p1 - p2);
const ao = Math.sign(a1 - a2);
if (po === ao) return Math.abs(p1 - p2 - (a1 - a2)) <= 1 ? 8 : 5;
return Math.abs(p1 - a1) + Math.abs(p2 - a2) <= 2 ? 3 : 0;
}

function isLiveStatus(s = "") {
return ["1H", "HT", "2H", "ET", "P", "LIVE"].includes(
String(s).toUpperCase(),
);
}
function isFinalStatus(s = "") {
return ["FT", "AET", "PEN", "COMPLETED", "FINAL"].includes(
String(s).toUpperCase(),
);
}
function hasResult(r) {
if (!r) return false;
if (!Number.isFinite(r.score1) || !Number.isFinite(r.score2)) return false;
const s = String(r.status || "").toUpperCase();
return s !== "NS" && (isLiveStatus(s) || isFinalStatus(s));
}

function nullNum(v) {
if (v === null || v === undefined || v === "") return null;
const n = Number(v);
return Number.isFinite(n) ? n : null;
}

// ─── Data fetching ───────────────────────────────────────────────────────────

function getWorkerUrl() {
return (
localStorage.getItem("ggo_wc_url") ||
"https://ggowcpredictor.ben-arthur-wiz.workers.dev"
).replace(/\/$/, "");
}

async function fetchProfileFromWorker(username) {
const url = `${getWorkerUrl()}/profile?username=${encodeURIComponent(username)}`;
const res = await fetch(url, { cache: "no-store" });
if (!res.ok) throw new Error(`Worker /profile HTTP ${res.status}`);
return res.json();
}

async function fetchProfileFromSupabase(username) {
const [users, preds, leaderboard, fixtures, results] = await Promise.all([
sbSelect("users", "*", `username=eq.${encodeURIComponent(username)}`),
sbSelect(
"predictions",
"*",
`username=eq.${encodeURIComponent(username)}&order=matchId.asc`,
),
sbSelect("leaderboard", "*", `username=eq.${encodeURIComponent(username)}`),
sbSelect("fixtures", "*"),
sbSelect("results", "*"),
]);

const user = users?.[0];
if (!user) throw new Error("User not found in Supabase");

const lb = leaderboard?.[0] || {};
const fixtureMap = {};
(fixtures || []).forEach((f) => {
const id = String(f.matchId || f.id || "").replace(/^match*/, "");
if (id) fixtureMap[id] = f;
});
const resultMap = {};
(results || []).forEach((r) => {
const id = String(r.matchId || r.id || "").replace(/^match*/, "");
if (id) resultMap[id] = r;
});

return buildProfilePayload(user, lb, preds || [], fixtureMap, resultMap);
}

async function fetchProfileFromFirestore(username) {
if (!db) throw new Error("Firestore not initialized");

const [userSnap, predsSnap, currentSnap, fixturesSnap, resultsSnap] =
await Promise.all([
db.collection("users").doc(username).get(),
db.collection("predictions").where("username", "==", username).get(),
db.collection("leaderboard").doc("current").get(),
db.collection("fixtures").get(),
db.collection("results").get(),
]);

if (!userSnap.exists) throw new Error("User not found in Firestore");

const user = { username, ...userSnap.data() };
const preds = predsSnap.docs.map((d) => d.data());

const lb = {};
if (currentSnap.exists) {
const players = currentSnap.data().players || [];
const found = players.find((p) => p.username === username);
if (found) Object.assign(lb, found);
}

const fixtureMap = {};
fixturesSnap.docs.forEach((d) => {
const f = { id: d.id, ...d.data() };
const id = String(f.matchId || f.id || "").replace(/^match*/, "");
if (id) fixtureMap[id] = f;
});
const resultMap = {};
resultsSnap.docs.forEach((d) => {
const r = { id: d.id, ...d.data() };
const id = String(r.matchId || r.id || "").replace(/^match*/, "");
if (id) resultMap[id] = r;
});

return buildProfilePayload(user, lb, preds, fixtureMap, resultMap);
}

function buildProfilePayload(user, lb, preds, fixtureMap, resultMap) {
let totalPoints = 0,
exactScores = 0,
correctOutcomes = 0;

const predictions = preds
.filter((p) => p.matchId != null)
.map((p) => {
const matchId = String(p.matchId).replace(/^match\_/, "");
const fixture = fixtureMap[matchId] || {};
const result = resultMap[matchId];

      const pred1 = nullNum(p.pred1);
      const pred2 = nullNum(p.pred2);
      const hasPred = pred1 !== null && pred2 !== null;

      let actualHome = null,
        actualAway = null,
        points = null,
        statusType = "upcoming";
      if (result) {
        actualHome = nullNum(
          result.score1 ?? result.homeScore ?? result.team1Score,
        );
        actualAway = nullNum(
          result.score2 ?? result.awayScore ?? result.team2Score,
        );
        const status = String(result.status || "NS").toUpperCase();
        if (isFinalStatus(status)) statusType = "finished";
        else if (isLiveStatus(status)) statusType = "live";
      }

      if (hasPred && actualHome !== null && actualAway !== null) {
        points = calcPoints(pred1, pred2, actualHome, actualAway);
        totalPoints += points;
        if (points === 15) exactScores++;
        if (points > 0) correctOutcomes++;
      }

      return {
        matchId,
        home: fixture.team1 || "TBD",
        away: fixture.team2 || "TBD",
        group: fixture.group || "",
        round: fixture.round || "",
        date: fixture.date || "",
        time: fixture.time || "",
        predictedHome: hasPred ? pred1 : null,
        predictedAway: hasPred ? pred2 : null,
        actualHome,
        actualAway,
        points,
        status: String(result?.status || "NS").toUpperCase(),
        statusType,
      };
    })
    .sort((a, b) => {
      // finished first (by matchId desc), then live, then upcoming
      const order = { finished: 0, live: 1, upcoming: 2 };
      const od = (order[a.statusType] ?? 3) - (order[b.statusType] ?? 3);
      if (od !== 0) return od;
      return Number(a.matchId) - Number(b.matchId);
    });

const rank = lb.rank ?? null;

return {
user: {
username: user.username,
displayName: user.displayName || user.username,
isAdmin: Boolean(user.isAdmin),
totalPoints: totalPoints,
exactScores: exactScores,
correctOutcomes: correctOutcomes,
predicted: preds.length,
rank,
},
predictions,
};
}

// ─── Main data loader (waterfall) ────────────────────────────────────────────

async function loadProfile(username) {
// 1. Try Worker /profile endpoint
try {
return await fetchProfileFromWorker(username);
} catch (e) {
console.warn("Worker /profile unavailable:", e.message);
}

// 2. Try Supabase direct
try {
return await fetchProfileFromSupabase(username);
} catch (e) {
console.warn("Supabase profile fetch failed:", e.message);
}

// 3. Firestore fallback
return fetchProfileFromFirestore(username);
}
async function loadRivalry(username) {
try {
const workerUrl = (
localStorage.getItem("ggo_wc_url") ||
"https://ggowcpredictor.ben-arthur-wiz.workers.dev"
).replace(/\/$/, "");
    const res = await fetch(
      `${workerUrl}/rivalry?username=${encodeURIComponent(username)}`,
      { cache: "no-store" },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
return res.json();
} catch (e) {
console.warn("Rivalry fetch failed:", e.message);
return null;
}
}
// ─── Helpers ─────────────────────────────────────────────────────────────────

function esc(v) {
return String(v ?? "")
.replaceAll("&", "&amp;")
.replaceAll("<", "&lt;")
.replaceAll(">", "&gt;")
.replaceAll('"', "&quot;")
.replaceAll("'", "&#039;");
}

function getInitials(name) {
return String(name)
.split(/\s+/)
.filter(Boolean)
.map((w) => w[0])
.slice(0, 2)
.join("")
.toUpperCase();
}

function rankChipClass(rank) {
if (rank === 1) return "gold";
if (rank === 2) return "silver";
if (rank === 3) return "bronze";
return "";
}

function ptsTierClass(pts) {
if (pts === null) return "pts-pending";
if (pts >= 15) return "pts-exact";
if (pts >= 8) return "pts-good";
if (pts > 0) return "pts-partial";
return "pts-zero";
}

function stripeClass(pts, statusType) {
if (statusType !== "finished" && statusType !== "live")
return "stripe-pending";
if (pts === null) return "stripe-pending";
if (pts >= 15) return "stripe-exact";
if (pts >= 8) return "stripe-good";
if (pts > 0) return "stripe-partial";
return "stripe-zero";
}

function formatPts(pts, statusType) {
if (statusType === "upcoming")
return `<span class="pred-pts pts-pending">Upcoming</span>`;
if (statusType === "live" && pts === null)
return `<span class="pred-pts pts-pending">Live</span>`;
if (pts === null) return `<span class="pred-pts pts-pending">No pick</span>`;
const cls = ptsTierClass(pts);
return `<span class="pred-pts ${cls}">${pts}<sub>pts</sub></span>`;
}

function statusTagHtml(statusType, rawStatus) {
if (statusType === "live") {
return `<span class="pred-status-tag live"><span style="width:6px;height:6px;border-radius:50%;background:var(--warning);display:inline-block"></span>Live · ${esc(rawStatus)}</span>`;
}
if (statusType === "finished") {
return `<span class="pred-status-tag finished">FT</span>`;
}
return `<span class="pred-status-tag upcoming">Upcoming</span>`;
}

function scoreDisplay(home, away, cls) {
if (home === null || away === null) {
return `<span class="pred-score-value no-pick">—</span>`;
}
return `<span class="pred-score-value ${cls}">${home}–${away}</span>`;
}

// ─── Render ───────────────────────────────────────────────────────────────────

function renderProfile(data) {
const { user, predictions } = data;
const initials = getInitials(user.displayName);
const rankLabel = user.rank ? `#${user.rank}` : "–";
const rankCls = rankChipClass(user.rank);

// Accuracy %
const scored = predictions.filter((p) => p.points !== null).length;
const correct = predictions.filter((p) => p.points > 0).length;
const accuracy = scored > 0 ? Math.round((correct / scored) \* 100) : 0;

// Filter state
let activeFilter = "all";

function renderList(filter) {
let list = predictions;
if (filter === "finished")
list = predictions.filter((p) => p.statusType === "finished");
if (filter === "live")
list = predictions.filter((p) => p.statusType === "live");
if (filter === "upcoming")
list = predictions.filter((p) => p.statusType === "upcoming");
if (filter === "scoring") {
list = predictions
.filter((p) => p.points !== null)
.sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
// Scoring view: flat list by points, no date grouping
if (!list.length) {
return `<div class="empty-state"><div class="empty-icon">–</div><p>No scored predictions yet.</p></div>`;
}
return list.map((p) => renderPredCard(p, user.displayName)).join("");
}

    if (!list.length) {
      return `<div class="empty-state"><div class="empty-icon">–</div><p>No predictions in this view.</p></div>`;
    }

    // Group by date (same as main app)
    const groups = {};
    list.forEach((p) => {
      const dateKey = p.date || "Unknown Date";
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(p);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dateKey, preds]) => {
        const dateLabel = formatProfileDate(dateKey);
        return `
        <div class="profile-date-group">
          <div class="profile-date-heading">${esc(dateLabel)}</div>
          ${preds.map((p) => renderPredCard(p, user.displayName)).join("")}
        </div>
      `;
      })
      .join("");

}
function renderPredCard(p, displayName) {
const stripe = stripeClass(p.points, p.statusType);
const ptsHtml = formatPts(p.points, p.statusType);
const groupPart = p.group
? `<span class="pred-meta-tag"><span class="accent">${esc(p.group)}</span></span>`
: "";
const roundPart = p.round
? `<span class="pred-meta-tag">${esc(p.round)}</span>`
: "";
const datePart = p.date
? `<span class="pred-meta-tag">${esc(p.date)}</span>`
: "";
const hasPred = p.predictedHome !== null && p.predictedAway !== null;
const firstName = (displayName || "").split(" ")[0];

    return `
    <article class="pred-card">
      <div class="pred-stripe ${stripe}"></div>
      <div class="pred-body">
        <div class="pred-matchup">
          <span class="pred-team">${esc(p.home)}</span>
          <span class="pred-vs">vs</span>
          <span class="pred-team">${esc(p.away)}</span>
        </div>
        ${ptsHtml}
        <div class="pred-scores">
          <div class="pred-score-row">
            <span class="pred-score-label">Result</span>
            ${scoreDisplay(p.actualHome, p.actualAway, "actual")}
          </div>
          <div class="pred-score-row">
            <span class="pred-score-label">${esc(firstName)}'s pick</span>
            ${hasPred ? scoreDisplay(p.predictedHome, p.predictedAway, "pick") : `<span class="pred-score-value no-pick">No pick</span>`}
          </div>
        </div>
        <div class="pred-meta">
          ${groupPart}${roundPart}${datePart}
          ${statusTagHtml(p.statusType, p.status)}
        </div>
      </div>
    </article>

`;
  }
  function formatProfileDate(dateStr) {
    // dateStr = "2026-06-11"
    const m = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return dateStr;
    return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])).toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  }
  const html = `
<a href="index.html" class="profile-back">
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="M10 3L5 8l5 5"/>
</svg>
Back to Predictor
</a>

    <!-- ── Hero ── -->
    <div class="profile-hero">
      <div class="profile-hero-inner">
        <div class="profile-avatar-wrap">
          <div class="profile-avatar">${esc(initials)}</div>
          ${user.rank ? `<div class="profile-rank-chip ${rankCls}">${esc(rankLabel)}</div>` : ""}
        </div>
        <div class="profile-hero-text">
          <div class="profile-display-name">${esc(user.displayName)}</div>
          <div class="profile-username">@<span>${esc(user.username)}</span></div>
          <div class="profile-badges">
            <span class="profile-badge">Rank ${esc(rankLabel)}</span>
            <span class="profile-badge">${esc(user.predicted || 0)} predictions</span>
            ${user.isAdmin ? `<span class="profile-badge admin-badge">Admin</span>` : ""}
          </div>
        </div>
      </div>
    </div>

    <!-- ── Stats ── -->
    <div class="profile-stats-grid">
      <div class="stat-card stat-pts">
        <div class="stat-value">${user.totalPoints ?? 0}</div>
        <div class="stat-label">Total Points</div>
      </div>
      <div class="stat-card stat-exact">
        <div class="stat-value">${user.exactScores ?? 0}</div>
        <div class="stat-label">Exact Scores</div>
      </div>
      <div class="stat-card stat-outcome">
        <div class="stat-value">${user.correctOutcomes ?? 0}</div>
        <div class="stat-label">Correct Results</div>
      </div>
      <div class="stat-card stat-made">
        <div class="stat-value">${user.predicted ?? 0}</div>
        <div class="stat-label">Predictions Made</div>
      </div>
    </div>

    <!-- Accuracy bar -->
    ${
      scored > 0
        ? `
    <div class="accuracy-bar-wrap" style="margin-bottom:28px">
      <span style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;white-space:nowrap">Scoring accuracy</span>
      <div class="accuracy-bar-track">
        <div class="accuracy-bar-fill" style="width:${accuracy}%"></div>
      </div>
      <span class="accuracy-label">${accuracy}%</span>
    </div>`
        : ""
    }



    <!-- ── Prediction history ── -->
    <div class="profile-section-title">
      <span>Prediction <span class="title-accent">History</span></span>
      <span class="profile-section-count" id="pred-count">${predictions.length}</span>
    </div>

    <div class="profile-filter-row">
      <button class="filter-btn active" onclick="setFilter('all', this)">All</button>
      <button class="filter-btn" onclick="setFilter('finished', this)">Finished</button>
      <button class="filter-btn" onclick="setFilter('live', this)">Live</button>
      <button class="filter-btn" onclick="setFilter('upcoming', this)">Upcoming</button>
      <button class="filter-btn" onclick="setFilter('scoring', this)">Top Scores</button>
    </div>

    <div class="pred-history-list" id="pred-list">
      ${renderList("all")}
    </div>

`;

const content = document.getElementById("profile-content");
content.innerHTML = html;
content.style.display = "block";
document.getElementById("profile-loading").style.display = "none";

// Wire filter buttons (needs closure over predictions + renderList)
window.setFilter = function (filter, btn) {
activeFilter = filter;
document
.querySelectorAll(".profile-filter-row .filter-btn")
.forEach((b) => b.classList.remove("active"));
if (btn) btn.classList.add("active");

    const listEl = document.getElementById("pred-list");
    if (listEl) listEl.innerHTML = renderList(filter);

    // Update count badge
    const counts = {
      all: predictions.length,
      finished: 0,
      live: 0,
      upcoming: 0,
      scoring: 0,
    };
    predictions.forEach((p) => {
      if (p.statusType === "finished") counts.finished++;
      else if (p.statusType === "live") counts.live++;
      else counts.upcoming++;
      if (p.points !== null) counts.scoring++;
    });
    const countEl = document.getElementById("pred-count");
    if (countEl) countEl.textContent = counts[filter] ?? predictions.length;

};
}

function renderError(message) {
document.getElementById("profile-loading").style.display = "none";
const content = document.getElementById("profile-content");
content.innerHTML = `     <a href="index.html" class="profile-back">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 3L5 8l5 5"/>
      </svg>
      Back to Predictor
    </a>
    <div class="profile-error">
      <div class="error-code">404</div>
      <p>${esc(message)}</p>
      <br>
      <a href="index.html" class="btn-primary" style="max-width:180px;display:inline-block;text-decoration:none;text-align:center">Return to App</a>
    </div>
  `;
content.style.display = "block";
}

// ─── Boot ────────────────────────────────────────────────────────────────────

(async function init() {
initFirebase();

const params = new URLSearchParams(window.location.search);
const username = (params.get("user") || "").trim().toLowerCase();

if (!username) {
renderError(
"No username provided. Try clicking a player's name from the Leaderboard.",
);
return;
}

document.title = `${username} — GGO WC 2026`;

try {
// Single parallel load
const [data, rivalry] = await Promise.all([
loadProfile(username),
loadRivalry(username),
]);

    if (!data?.user) {
      renderError(`Player "${username}" was not found.`);
      return;
    }
    renderProfile(data, rivalry);

} catch (err) {
console.error("Profile load failed:", err);
renderError(
`Could not load profile for "${username}". Check your connection or try again later.`,
);
}
})();
