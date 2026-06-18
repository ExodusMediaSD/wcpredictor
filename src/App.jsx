import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import logoImg from "./assets/logo.png";

const FINAL_STATUSES = ["FT", "AET", "PEN", "COMPLETED", "FINAL"];
const LIVE_STATUSES = ["1H", "HT", "2H", "ET", "P", "LIVE"];

const MULTIPLIERS = {
  group: 1,
  r32: 1,
  r16: 2,
  qf: 3,
  sf: 4,
  third: 5,
  final: 5,
};

const TEAM_FLAG_CODES = {
  mexico: "mx",
  "south africa": "za",
  "south korea": "kr",
  "czech republic": "cz",
  canada: "ca",
  "bosnia & herzegovina": "ba",
  usa: "us",
  paraguay: "py",
  qatar: "qa",
  switzerland: "ch",
  brazil: "br",
  morocco: "ma",
  haiti: "ht",
  scotland: "gb-sct",
  australia: "au",
  turkey: "tr",
  germany: "de",
  curaçao: "cw",
  netherlands: "nl",
  japan: "jp",
  "ivory coast": "ci",
  ecuador: "ec",
  sweden: "se",
  tunisia: "tn",
  belgium: "be",
  egypt: "eg",
  iran: "ir",
  "new zealand": "nz",
  spain: "es",
  "cape verde": "cv",
  "saudi arabia": "sa",
  uruguay: "uy",
  france: "fr",
  senegal: "sn",
  iraq: "iq",
  norway: "no",
  argentina: "ar",
  algeria: "dz",
  austria: "at",
  jordan: "jo",
  portugal: "pt",
  "dr congo": "cd",
  uzbekistan: "uz",
  colombia: "co",
  england: "gb-eng",
  croatia: "hr",
  ghana: "gh",
  panama: "pa",
};

// --- Client-side Score Calculation ---
function calculatePoints(pred1, pred2, actual1, actual2, stage) {
  let base = 0;
  if (pred1 === actual1 && pred2 === actual2) {
    base = 15;
  } else {
    const predOutcome = Math.sign(pred1 - pred2);
    const actualOutcome = Math.sign(actual1 - actual2);
    if (predOutcome === actualOutcome) {
      const diffGap = Math.abs(pred1 - pred2 - (actual1 - actual2));
      base = diffGap <= 1 ? 8 : 5;
    } else {
      base = 0;
    }
  }
  const mult = MULTIPLIERS[stage] || 1;
  return base * mult;
}

export default function App() {
  // --- Configuration State ---
  const [supabaseUrl, setSupabaseUrl] = useState(
    localStorage.getItem("exodus_supabase_url") || import.meta.env.VITE_SUPABASE_URL || ""
  );
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(
    localStorage.getItem("exodus_supabase_anon_key") || import.meta.env.VITE_SUPABASE_ANON_KEY || ""
  );
  const [workerUrl, setWorkerUrl] = useState(
    localStorage.getItem("exodus_worker_url") || ""
  );

  // --- App State ───
  const [supabaseClient, setSupabaseClient] = useState(null);
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState("predictions");
  const [fixtures, setFixtures] = useState([]);
  const [results, setResults] = useState({});
  const [predictions, setPredictions] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [users, setUsers] = useState([]);
  const [accountRequests, setAccountRequests] = useState([]);

  // --- UI Filters and Flags ---
  const [predFilter, setPredFilter] = useState("all"); // 'all', 'open', 'locked'
  const [resultsFilter, setResultsFilter] = useState("all"); // 'all', 'live', 'ft'
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState(null);

  // --- Modal Visibility ---
  const [showSettings, setShowSettings] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showAccountRequest, setShowAccountRequest] = useState(false);

  // --- Auth Input Fields ---
  const [loginUsername, setLoginUsername] = useState("");
  const [loginCode, setLoginCode] = useState("");
  const [requestDisplayName, setRequestDisplayName] = useState("");
  const [requestUsername, setRequestUsername] = useState("");
  const [requestNote, setRequestNote] = useState("");

  // --- Suggestions List for autocomplete ---
  const [usernameSuggestions, setUsernameSuggestions] = useState([]);

  // --- Setup Supabase Client on credentials change ---
  useEffect(() => {
    if (supabaseUrl && supabaseAnonKey) {
      try {
        const client = createClient(supabaseUrl, supabaseAnonKey);
        setSupabaseClient(client);
      } catch (err) {
        console.error("Failed to initialize Supabase client:", err);
        setSupabaseClient(null);
      }
    } else {
      setSupabaseClient(null);
    }
  }, [supabaseUrl, supabaseAnonKey]);

  // --- Restore Session and Fetch initial setup data ---
  useEffect(() => {
    const savedSession = localStorage.getItem("exodus_wc_session");
    if (savedSession) {
      try {
        setSession(JSON.parse(savedSession));
      } catch (e) {
        localStorage.removeItem("exodus_wc_session");
      }
    }
    loadPublicData();
  }, [supabaseClient]);

  // --- Fetch predictions whenever user logs in ---
  useEffect(() => {
    if (session?.username && supabaseClient) {
      fetchUserPredictions(session.username);
    }
  }, [session, supabaseClient]);

  // --- Fetch account requests if user is Admin ---
  useEffect(() => {
    if (session?.isAdmin && supabaseClient && activeTab === "admin") {
      fetchAccountRequests();
    }
  }, [session, activeTab, supabaseClient]);

  // --- Helper to show messages ---
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Load public data (Fixtures, Results, Leaderboard, Users) ---
  const loadPublicData = async () => {
    if (!supabaseClient) {
      // Setup default mock values for testing before configuration
      setFixtures([
        { matchId: "1", round: "Matchday 1", group: "Group A", stage: "group", date: "2026-06-11", time: "16:00 UTC-5", kickoffUTC: "2026-06-11T21:00:00Z", team1: "Mexico", team2: "South Africa", ground: "Azteca" },
        { matchId: "2", round: "Matchday 1", group: "Group A", stage: "group", date: "2026-06-11", time: "19:00 UTC-5", kickoffUTC: "2026-06-12T00:00:00Z", team1: "Canada", team2: "Bosnia & Herzegovina", ground: "BC Place" },
        { matchId: "3", round: "Matchday 1", group: "Group B", stage: "group", date: "2026-06-12", time: "15:00 UTC-4", kickoffUTC: "2026-06-12T19:00:00Z", team1: "USA", team2: "Paraguay", ground: "MetLife" },
      ]);
      setLeaderboard([
        { username: "admin", rank: 1, displayName: "Exodus Admin", totalPoints: 45, exactScores: 2, correctOutcomes: 4, predicted: 3, scored: 3, completedPredictions: 3 }
      ]);
      return;
    }

    setLoading(true);
    try {
      const [fixturesRes, resultsRes, leaderboardRes, usersRes] = await Promise.all([
        supabaseClient.from("fixtures").select("*").order("kickoffUTC", { ascending: true }),
        supabaseClient.from("results").select("*"),
        supabaseClient.from("leaderboard").select("*").order("rank", { ascending: true }),
        supabaseClient.from("users").select("username, displayName, isAdmin")
      ]);

      if (fixturesRes.data) setFixtures(fixturesRes.data);
      if (usersRes.data) setUsers(usersRes.data);
      
      if (resultsRes.data) {
        const rMap = {};
        resultsRes.data.forEach((r) => {
          rMap[r.matchId] = r;
        });
        setResults(rMap);
      }

      if (leaderboardRes.data && leaderboardRes.data.length > 0) {
        setLeaderboard(leaderboardRes.data);
      } else {
        // Fallback leaderboard compute if leaderboard table empty
        calculateLocalLeaderboard(fixturesRes.data || [], resultsRes.data || [], usersRes.data || []);
      }
    } catch (err) {
      console.error("Error loading data from Supabase:", err);
      showToast("Failed to sync database entries", "error");
    } finally {
      setLoading(false);
    }
  };

  const calculateLocalLeaderboard = async (fixtureList, resultList, userList) => {
    try {
      const predsRes = await supabaseClient.from("predictions").select("*");
      if (!predsRes.data) return;

      const resultsMap = {};
      resultList.forEach((r) => {
        if (FINAL_STATUSES.includes(String(r.status || "").toUpperCase())) {
          resultsMap[r.matchId] = r;
        }
      });

      const fixtureMap = {};
      fixtureList.forEach((f) => {
        fixtureMap[f.matchId] = f;
      });

      const uMap = {};
      userList.forEach((u) => {
        uMap[u.username] = {
          username: u.username,
          displayName: u.displayName || u.username,
          totalPoints: 0,
          exactScores: 0,
          correctOutcomes: 0,
          predicted: 0,
          scored: 0,
          completedPredictions: 0,
        };
      });

      predsRes.data.forEach((p) => {
        const u = p.username;
        if (!uMap[u]) return;

        uMap[u].predicted++;
        const r = resultsMap[p.matchId];
        if (!r) return;

        uMap[u].completedPredictions++;
        uMap[u].scored++;

        const fix = fixtureMap[p.matchId] || {};
        const stage = fix.stage || "group";
        const pts = calculatePoints(p.pred1, p.pred2, r.score1, r.score2, stage);
        uMap[u].totalPoints += pts;

        const basePoints = pts / (MULTIPLIERS[stage] || 1);
        if (basePoints === 15) uMap[u].exactScores++;
        if (basePoints > 0) uMap[u].correctOutcomes++;
      });

      const sorted = Object.values(uMap).sort((a, b) => {
        if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
        if (b.exactScores !== a.exactScores) return b.exactScores - a.exactScores;
        if (b.correctOutcomes !== a.correctOutcomes) return b.correctOutcomes - a.correctOutcomes;
        return a.username.localeCompare(b.username);
      });

      const ranked = [];
      let rank = 1;
      let i = 0;
      while (i < sorted.length) {
        let j = i;
        while (j < sorted.length && sorted[j].totalPoints === sorted[i].totalPoints) {
          j++;
        }
        for (let k = i; k < j; k++) {
          ranked.push({ ...sorted[k], rank });
        }
        rank += (j - i);
        i = j;
      }

      setLeaderboard(ranked);
    } catch (e) {
      console.error(e);
    }
  };

  // --- Fetch predictions for currently logged in user ---
  const fetchUserPredictions = async (username) => {
    try {
      const { data, error } = await supabaseClient
        .from("predictions")
        .select("*")
        .eq("username", username);

      if (error) throw error;

      if (data) {
        const pMap = {};
        data.forEach((p) => {
          pMap[p.matchId] = p;
        });
        setPredictions(pMap);
      }
    } catch (err) {
      console.error("Failed to load user predictions:", err);
    }
  };

  // --- Fetch Account Requests (Admin Only) ---
  const fetchAccountRequests = async () => {
    try {
      const { data, error } = await supabaseClient
        .from("account_requests")
        .select("*")
        .order("createdAt", { ascending: false });

      if (error) throw error;
      if (data) setAccountRequests(data);
    } catch (err) {
      console.error("Failed to load account requests:", err);
    }
  };

  // --- Save settings changes ---
  const handleSaveSettings = () => {
    localStorage.setItem("exodus_supabase_url", supabaseUrl);
    localStorage.setItem("exodus_supabase_anon_key", supabaseAnonKey);
    localStorage.setItem("exodus_worker_url", workerUrl);
    setShowSettings(false);
    showToast("Settings updated successfully", "success");
    window.location.reload();
  };

  // --- Handle Login verification ---
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginUsername.trim()) return;

    // Local admin login bypass for initial setup testing
    if (loginUsername === "admin" && loginCode === "EXODUS2026" && !supabaseClient) {
      const localAdminSession = { username: "admin", displayName: "Local Admin", isAdmin: true };
      setSession(localAdminSession);
      localStorage.setItem("exodus_wc_session", JSON.stringify(localAdminSession));
      showToast("Logged in as Local Admin (Supabase Offline)", "warning");
      return;
    }

    if (!supabaseClient) {
      showToast("Supabase is not configured yet. Set credentials in Settings.", "error");
      return;
    }

    try {
      const { data, error } = await supabaseClient
        .from("users")
        .select("*")
        .eq("username", loginUsername.trim().toLowerCase())
        .single();

      if (error || !data) {
        showToast("User account not found.", "error");
        return;
      }

      if (data.secretCode !== loginCode.trim()) {
        showToast("Incorrect secret code. Try again.", "error");
        return;
      }

      const activeSession = {
        username: data.username,
        displayName: data.displayName || data.username,
        isAdmin: Boolean(data.isAdmin),
      };

      setSession(activeSession);
      localStorage.setItem("exodus_wc_session", JSON.stringify(activeSession));
      showToast(`Welcome back, ${activeSession.displayName}!`, "success");

      // Show rules modal on first login
      const rulesShownKey = `exodus_rules_shown_${data.username}`;
      if (!localStorage.getItem(rulesShownKey)) {
        setShowRules(true);
      }
    } catch (err) {
      console.error(err);
      showToast("Login failed. Check server status.", "error");
    }
  };

  const handleLogout = () => {
    setSession(null);
    setPredictions({});
    localStorage.removeItem("exodus_wc_session");
    showToast("Logged out successfully");
  };

  // --- Submit prediction scoring changes ---
  const handlePredictionChange = async (matchId, val1, val2) => {
    if (!session) return;
    const fixture = fixtures.find((f) => f.matchId === matchId);
    if (!fixture) return;

    // Check match lock state (locked 1 minute before kickoff)
    const isLocked = new Date() >= new Date(fixture.kickoffUTC).getTime() - 1 * 60 * 1000;
    if (isLocked) {
      showToast("This match has already locked.", "error");
      return;
    }

    const p1 = parseInt(val1);
    const p2 = parseInt(val2);
    if (isNaN(p1) || isNaN(p2) || p1 < 0 || p2 < 0) return;

    // Update local optimistic state
    const optimisticPred = {
      ...predictions[matchId],
      matchId,
      username: session.username,
      pred1: p1,
      pred2: p2,
      submittedAt: new Date().toISOString(),
    };
    setPredictions((prev) => ({ ...prev, [matchId]: optimisticPred }));

    if (!supabaseClient) {
      showToast("Local mockup prediction saved (Database offline)", "warning");
      return;
    }

    try {
      const predId = `${session.username}_${matchId}`;
      const { error } = await supabaseClient.from("predictions").upsert({
        id: predId,
        username: session.username,
        matchId,
        pred1: p1,
        pred2: p2,
        submittedAt: new Date().toISOString(),
      });

      if (error) throw error;
      showToast(`Saved prediction: ${fixture.team1} ${p1}-${p2} ${fixture.team2}`);
    } catch (err) {
      console.error("Failed to save prediction to Supabase:", err);
      showToast("Failed to persist prediction on database", "error");
    }
  };

  // --- Submit new Account Request ---
  const handleSubmitAccountRequest = async (e) => {
    e.preventDefault();
    if (!requestUsername.trim() || !requestDisplayName.trim()) return;

    if (!supabaseClient) {
      showToast("Cannot send request: Supabase offline", "error");
      return;
    }

    try {
      const user = requestUsername.trim().toLowerCase();
      
      // Auto-generate a secret access code
      const randHex = Math.random().toString(16).slice(2, 8).toUpperCase();
      const generatedCode = `EXO-${randHex}`;

      const { error } = await supabaseClient.from("account_requests").insert({
        username: user,
        displayName: requestDisplayName.trim(),
        note: requestNote.trim(),
        status: "pending",
        secretCode: generatedCode,
        createdAt: new Date().toISOString()
      });

      if (error) {
        if (error.code === "23505") {
          showToast("A request already exists for this username", "error");
        } else {
          throw error;
        }
        return;
      }

      showToast("Account request submitted successfully!", "success");
      setRequestUsername("");
      setRequestDisplayName("");
      setRequestNote("");
      setShowAccountRequest(false);
    } catch (err) {
      console.error(err);
      showToast("Failed to submit request", "error");
    }
  };

  // --- Approve / Reject account requests (Admin) ---
  const handleResolveAccountRequest = async (request, approved) => {
    if (!supabaseClient) return;

    try {
      const status = approved ? "approved" : "rejected";
      
      // Update account requests table
      const { error: reqError } = await supabaseClient
        .from("account_requests")
        .update({ status, resolvedAt: new Date().toISOString() })
        .eq("username", request.username);

      if (reqError) throw reqError;

      // If approved, insert profile row into the users table
      if (approved) {
        const { error: userError } = await supabaseClient.from("users").upsert({
          username: request.username,
          displayName: request.displayName,
          secretCode: request.secretCode,
          isAdmin: false,
          joinedAt: new Date().toISOString()
        });

        if (userError) throw userError;
        showToast(`Approved ${request.username}. Code: ${request.secretCode}`, "success");
      } else {
        showToast(`Rejected request for ${request.username}`, "warning");
      }

      // Refresh list
      fetchAccountRequests();
      loadPublicData();
    } catch (err) {
      console.error(err);
      showToast("Failed to resolve request", "error");
    }
  };

  // --- Trigger Score Sync via worker ---
  const handleRequestSync = async () => {
    if (!workerUrl) {
      showToast("Worker API URL not set. Configure in settings.", "error");
      return;
    }

    setSyncing(true);
    try {
      const expectedToken = localStorage.getItem("exodus_seed_token") || "";
      const response = await fetch(`${workerUrl.replace(/\/$/, "")}/sync-scores`, {
        headers: {
          Authorization: `Bearer ${expectedToken}`,
        },
      });

      if (!response.ok) throw new Error("Sync scores API returned error");

      const data = await response.json();
      showToast(`Synced! Matches matched: ${data.matched || 0}. Updated: ${data.updated || 0}`, "success");
      loadPublicData();
    } catch (err) {
      console.error(err);
      showToast("Score sync connection failed", "error");
    } finally {
      setSyncing(false);
    }
  };

  // --- Filter usernames logic for login suggestions ---
  const handleUsernameInput = (val) => {
    setLoginUsername(val);
    if (!val.trim()) {
      setUsernameSuggestions([]);
      return;
    }
    const matching = users.filter((u) =>
      u.username.toLowerCase().includes(val.toLowerCase())
    );
    setUsernameSuggestions(matching.slice(0, 5));
  };

  // --- Helper to get team flags via flagcdn or fallbacks ---
  const getTeamFlag = (teamName) => {
    const code = TEAM_FLAG_CODES[String(teamName).toLowerCase().trim()];
    if (!code) {
      // Return first 3 letters capitalized if code doesn't exist
      const fallbackCode = String(teamName || "TBD").slice(0, 3).toUpperCase();
      return <span style={{ fontSize: "12px", fontWeight: "800", color: "var(--accent-gold)" }}>{fallbackCode}</span>;
    }
    return (
      <img
        className="inline-flag-img"
        src={`https://flagcdn.com/w80/${code}.png`}
        alt={teamName}
        width="38"
        height="25"
      />
    );
  };

  // --- Group standings engine ---
  const getGroupStandings = () => {
    const groupMatches = fixtures.filter((f) => f.stage === "group" && f.group);
    const groups = {};

    groupMatches.forEach((f) => {
      const grp = f.group;
      if (!groups[grp]) groups[grp] = {};

      [f.team1, f.team2].forEach((t) => {
        if (!groups[grp][t]) {
          groups[grp][t] = { team: t, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 };
        }
      });

      const res = results[f.matchId];
      const prd = predictions[f.matchId];

      const applyMatch = (s1, s2) => {
        const t1 = groups[grp][f.team1];
        const t2 = groups[grp][f.team2];
        t1.played++;
        t2.played++;
        t1.gf += s1;
        t1.ga += s2;
        t2.gf += s2;
        t2.ga += s1;

        if (s1 > s2) {
          t1.won++;
          t1.points += 3;
          t2.lost++;
        } else if (s2 > s1) {
          t2.won++;
          t2.points += 3;
          t1.lost++;
        } else {
          t1.drawn++;
          t2.drawn++;
          t1.points += 1;
          t2.points += 1;
        }
        t1.gd = t1.gf - t1.ga;
        t2.gd = t2.gf - t2.ga;
      };

      if (res && res.score1 !== null && res.score2 !== null && res.status !== "NS") {
        applyMatch(res.score1, res.score2);
      } else if (prd && prd.pred1 !== null && prd.pred2 !== null) {
        applyMatch(prd.pred1, prd.pred2);
      }
    });

    // Sort standings per group
    const sortedGroups = {};
    Object.entries(groups).forEach(([grpName, teamMap]) => {
      sortedGroups[grpName] = Object.values(teamMap).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.gd !== a.gd) return b.gd - a.gd;
        if (b.gf !== a.gf) return b.gf - a.gf;
        return a.team.localeCompare(b.team);
      });
    });

    return sortedGroups;
  };

  // --- Bracket Builder ---
  const renderBracket = () => {
    // Scaffold simple knockout bracket list
    // Round of 16 (matches 89-96), Quarters (97-100), Semis (101-102), Final (104)
    const getKnockoutTeam = (matchNum, slot) => {
      // Find match and see result
      const match = fixtures.find((f) => f.matchId === String(matchNum));
      if (!match) return "TBD";
      const res = results[String(matchNum)];
      const prd = predictions[String(matchNum)];

      if (res && res.score1 !== null && res.score2 !== null) {
        return res.score1 > res.score2 
          ? (slot === 1 ? match.team1 : match.team2) 
          : (slot === 1 ? match.team2 : match.team1);
      }
      if (prd && prd.pred1 !== null && prd.pred2 !== null) {
        return prd.pred1 > prd.pred2 
          ? (slot === 1 ? match.team1 : match.team2) 
          : (slot === 1 ? match.team2 : match.team1);
      }
      return slot === 1 ? match.team1 : match.team2;
    };

    return (
      <div className="bracket-container">
        <div className="vertical-bracket">
          <div className="bracket-round">
            <div className="round-name">Round of 16</div>
            <div className="bracket-match">
              <div className="bm-team winner">
                <span className="bm-name">Winner A1</span>
                <span className="bm-score">3</span>
              </div>
              <div className="bm-team">
                <span className="bm-name">Runner B2</span>
                <span className="bm-score">1</span>
              </div>
            </div>
            <div className="bracket-match">
              <div className="bm-team winner">
                <span className="bm-name">Winner C1</span>
                <span className="bm-score">2</span>
              </div>
              <div className="bm-team">
                <span className="bm-name">Runner D2</span>
                <span className="bm-score">0</span>
              </div>
            </div>
          </div>

          <div className="bracket-round">
            <div className="round-name">Quarter-Finals</div>
            <div className="bracket-match">
              <div className="bm-team winner">
                <span className="bm-name">Winner R16-1</span>
                <span className="bm-score">2</span>
              </div>
              <div className="bm-team">
                <span className="bm-name">Winner R16-2</span>
                <span className="bm-score">1</span>
              </div>
            </div>
          </div>

          <div className="bracket-round">
            <div className="round-name">Semi-Finals</div>
            <div className="bracket-match">
              <div className="bm-team">
                <span className="bm-name">Winner QF-1</span>
                <span className="bm-score">-</span>
              </div>
              <div className="bm-team">
                <span className="bm-name">Winner QF-2</span>
                <span className="bm-score">-</span>
              </div>
            </div>
          </div>

          <div className="bracket-round">
            <div className="round-name">Final</div>
            <div className="bracket-match">
              <div className="bm-team">
                <span className="bm-name">Winner SF-1</span>
                <span className="bm-score">-</span>
              </div>
              <div className="bm-team">
                <span className="bm-name">Winner SF-2</span>
                <span className="bm-score">-</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── Render Login Screen if not authenticated ───
  if (!session) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">
            <img className="resized-logo" src={logoImg} alt="Exodus Logo" />
            <h2>Exodus <span>WC</span> 2026</h2>
            <p>Score Predictor</p>
          </div>

          <div className="login-divider"></div>

          {!supabaseClient && (
            <div style={{ background: "rgba(224,170,29,0.1)", border: "1px solid var(--accent-gold)", color: "var(--accent-gold)", padding: "10px", borderRadius: "6px", fontSize: "11px", marginBottom: "15px", textAlign: "center" }}>
              ⚠️ Database Connection Offline. Connect in settings or log in using local Admin bypass (admin / EXODUS2026).
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ position: "relative" }}>
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={loginUsername}
                onChange={(e) => handleUsernameInput(e.target.value)}
                required
              />
              {usernameSuggestions.length > 0 && (
                <div style={{ position: "absolute", width: "100%", background: "#111", border: "1px solid var(--dark-border)", borderRadius: "8px", zIndex: 10, top: "72px" }}>
                  {usernameSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.username}
                      onClick={() => {
                        setLoginUsername(suggestion.username);
                        setUsernameSuggestions([]);
                      }}
                      style={{ padding: "10px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      {suggestion.displayName} ({suggestion.username})
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Secret Code</label>
              <input
                type="password"
                placeholder="Enter your code"
                value={loginCode}
                onChange={(e) => setLoginCode(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%" }}>
              Enter Predictor
            </button>
          </form>

          <button
            type="button"
            className="login-ghost-btn"
            onClick={() => setShowAccountRequest(true)}
          >
            Request an Account
          </button>

          <button
            type="button"
            className="login-ghost-btn"
            style={{ borderStyle: "solid", borderColor: "rgba(224,170,29,0.25)", color: "var(--accent-gold)", marginTop: "10px" }}
            onClick={() => setShowSettings(true)}
          >
            ⚙️ Connection Settings
          </button>
        </div>

        {/* Account Request Modal */}
        {showAccountRequest && (
          <div className="modal-overlay show">
            <div className="modal">
              <div className="modal-header">
                <h2>Request Account</h2>
                <button className="close-modal" onClick={() => setShowAccountRequest(false)}>X</button>
              </div>
              <p style={{ color: "var(--muted-text)", fontSize: "13px", marginBottom: "20px" }}>
                Submit a request to the Exodus Discord administration team. An admin will verify and generate an access code.
              </p>
              <form onSubmit={handleSubmitAccountRequest}>
                <div className="form-group">
                  <label>Full Name / Display Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={requestDisplayName}
                    onChange={(e) => setRequestDisplayName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Desired Username</label>
                  <input
                    type="text"
                    placeholder="Choose username"
                    value={requestUsername}
                    onChange={(e) => setRequestUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Discord ID / Note</label>
                  <input
                    type="text"
                    placeholder="Optional details"
                    value={requestNote}
                    onChange={(e) => setRequestNote(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ width: "100%" }}>
                  Send Request
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Settings modal */}
        {showSettings && (
          <div className="modal-overlay show">
            <div className="modal">
              <div className="modal-header">
                <h2>Settings</h2>
                <button className="close-modal" onClick={() => setShowSettings(false)}>X</button>
              </div>
              <div className="form-group">
                <label>Supabase URL</label>
                <input
                  type="text"
                  placeholder="https://...supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Supabase Anon Key</label>
                <input
                  type="password"
                  placeholder="Anon public key"
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Cloudflare Worker URL</label>
                <input
                  type="text"
                  placeholder="https://...workers.dev"
                  value={workerUrl}
                  onChange={(e) => setWorkerUrl(e.target.value)}
                />
              </div>
              <button className="btn-primary" style={{ width: "100%", marginBottom: "10px" }} onClick={handleSaveSettings}>
                Save Settings
              </button>
              <button className="btn-secondary" style={{ width: "100%" }} onClick={() => setShowSettings(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {toast && <div className={`toast ${toast.type} show`}>{toast.message}</div>}
      </div>
    );
  }

  // --- Filter predictions depending on selection Open / Locked ---
  const getVisibleFixtures = () => {
    return fixtures.filter((f) => {
      const isLocked = new Date() >= new Date(f.kickoffUTC).getTime() - 1 * 60 * 1000;
      if (predFilter === "open") return !isLocked;
      if (predFilter === "locked") return isLocked;
      return true;
    });
  };

  // --- Filter results depending on selection Live / FT ---
  const getVisibleResults = () => {
    return fixtures.filter((f) => {
      const res = results[f.matchId];
      if (!res) return false;
      const status = String(res.status || "").toUpperCase();
      if (resultsFilter === "live") return LIVE_STATUSES.includes(status);
      if (resultsFilter === "ft") return FINAL_STATUSES.includes(status);
      return res.score1 !== null && res.score2 !== null;
    });
  };

  // ─── Main App UI Render ───
  return (
    <div>
      <header>
        <div className="header-top">
          <div className="logo">
            <img src={logoImg} alt="Exodus Logo" className="header-logo" />
            <div className="logo-divider"></div>
            <div className="logo-text">
              <h1>Exodus <span>WC</span> 2026</h1>
              <p>Predictor Game</p>
            </div>
          </div>

          <div className="user-pill">
            <div className="user-avatar">{session.username.slice(0, 2).toUpperCase()}</div>
            <span>{session.displayName}</span>
            <button className="logout-btn" onClick={handleLogout}>✕</button>
          </div>
        </div>

        <nav id="main-nav">
          <button className={`nav-btn ${activeTab === "predictions" ? "active" : ""}`} onClick={() => setActiveTab("predictions")}>
            Predictions
          </button>
          <button className={`nav-btn ${activeTab === "leaderboard" ? "active" : ""}`} onClick={() => setActiveTab("leaderboard")}>
            Leaderboard
          </button>
          <button className={`nav-btn ${activeTab === "results" ? "active" : ""}`} onClick={() => setActiveTab("results")}>
            Results
          </button>
          <button className={`nav-btn ${activeTab === "bracket" ? "active" : ""}`} onClick={() => setActiveTab("bracket")}>
            Bracket
          </button>
          {session.isAdmin && (
            <button className={`nav-btn ${activeTab === "admin" ? "active" : ""}`} onClick={() => setActiveTab("admin")} style={{ borderLeft: "1px solid rgba(255,255,255,0.15)" }}>
              Admin Panel
            </button>
          )}
        </nav>

        <div className="sync-container">
          <div className="sync-status">
            <span className={`status-dot ${syncing ? "loading" : ""}`}></span>
            <span>Live Sync</span>
          </div>
          {workerUrl && (
            <button className="sync-btn" onClick={handleRequestSync} disabled={syncing}>
              {syncing ? "Syncing..." : "Sync Scores"}
            </button>
          )}
          <button className="sync-btn" style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.15)" }} onClick={() => setShowSettings(true)}>
            ⚙️ Connection
          </button>
        </div>
      </header>

      <main>
        {/* Predictions view */}
        {activeTab === "predictions" && (
          <div className="view active">
            <div className="section-title">My <span className="title-accent">Predictions</span></div>
            <div className="matches-filter">
              <button className={`filter-btn ${predFilter === "all" ? "active" : ""}`} onClick={() => setPredFilter("all")}>All</button>
              <button className={`filter-btn ${predFilter === "open" ? "active" : ""}`} onClick={() => setPredFilter("open")}>Open</button>
              <button className={`filter-btn ${predFilter === "locked" ? "active" : ""}`} onClick={() => setPredFilter("locked")}>Locked</button>
            </div>

            <div className="matches-list">
              {getVisibleFixtures().length === 0 ? (
                <div className="empty-state">No matching fixtures found.</div>
              ) : (
                getVisibleFixtures().map((f) => {
                  const pred = predictions[f.matchId] || { pred1: "", pred2: "" };
                  const isLocked = new Date() >= new Date(f.kickoffUTC).getTime() - 1 * 60 * 1000;
                  const res = results[f.matchId];

                  return (
                    <article className={`match-card ${isLocked ? "locked" : "open"}`} key={f.matchId}>
                      <div className="mc-header">
                        <span className="mc-kickoff">{new Date(f.kickoffUTC).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                        <span className={`mc-badge ${isLocked ? "locked" : "open"}`}>
                          {isLocked ? "Locked" : "Open"}
                        </span>
                      </div>
                      <div className="mc-body">
                        <div className="mc-team">
                          {getTeamFlag(f.team1)}
                          <div className="mc-name">{f.team1}</div>
                        </div>

                        <div className="mc-middle">
                          {res && res.score1 !== null && res.score2 !== null ? (
                            <div className="mc-score-display">
                              <span className="score-num">{res.score1}</span>
                              <span className="mc-vs">-</span>
                              <span className="score-num">{res.score2}</span>
                            </div>
                          ) : (
                            <div className="mc-vs">VS</div>
                          )}
                        </div>

                        <div className="mc-team">
                          {getTeamFlag(f.team2)}
                          <div className="mc-name">{f.team2}</div>
                        </div>
                      </div>

                      <div className="mc-inputs">
                        <input
                          type="number"
                          min="0"
                          disabled={isLocked}
                          value={pred.pred1}
                          onChange={(e) => handlePredictionChange(f.matchId, e.target.value, pred.pred2)}
                          placeholder="-"
                        />
                        <span style={{ color: "var(--muted-text)" }}>:</span>
                        <input
                          type="number"
                          min="0"
                          disabled={isLocked}
                          value={pred.pred2}
                          onChange={(e) => handlePredictionChange(f.matchId, pred.pred1, e.target.value)}
                          placeholder="-"
                        />
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            {/* Standings Sub-view */}
            <div className="section-title" style={{ marginTop: "60px" }}><span className="title-accent">Group</span> Standings</div>
            <div className="group-grid">
              {Object.entries(getGroupStandings()).map(([groupName, teamStandings]) => (
                <article className="group-standings-card" key={groupName}>
                  <div className="group-title">{groupName}</div>
                  <table className="standings-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th style={{ textAlign: "left" }}>Team</th>
                        <th>P</th>
                        <th>GD</th>
                        <th>Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamStandings.map((t, idx) => (
                        <tr key={t.team}>
                          <td>{idx + 1}</td>
                          <td style={{ textAlign: "left", display: "flex", gap: "6px", alignItems: "center" }}>
                            {t.team}
                          </td>
                          <td>{t.played}</td>
                          <td>{t.gd > 0 ? `+${t.gd}` : t.gd}</td>
                          <td><strong>{t.points}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard view */}
        {activeTab === "leaderboard" && (
          <div className="view active">
            <div className="section-title"><span className="title-accent">Rankings</span> Leaderboard</div>
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th style={{ textAlign: "left" }}>Player</th>
                  <th>Points</th>
                  <th>Exact</th>
                  <th>Outcome</th>
                  <th>Predicted</th>
                  <th>Correct Outcome %</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: "40px", color: "var(--muted-text)" }}>No scores calculated yet.</td>
                  </tr>
                ) : (
                  leaderboard.map((row) => {
                    const denominator = row.completedPredictions > 0 ? row.completedPredictions : row.predicted || 1;
                    const percent = row.correctOutcomes > 0 ? (row.correctOutcomes / denominator) * 100 : 0;

                    return (
                      <tr key={row.username} className={row.username === session.username ? "current-user" : ""}>
                        <td><span className={`rank-badge ${row.rank === 1 ? "gold" : row.rank === 2 ? "silver" : row.rank === 3 ? "bronze" : ""}`}>{row.rank}</span></td>
                        <td style={{ textAlign: "left" }}>
                          <div className="player-info">
                            <span className="player-avatar">{row.displayName.slice(0, 2).toUpperCase()}</span>
                            <span className="player-name">{row.displayName}</span>
                          </div>
                        </td>
                        <td><strong>{row.totalPoints}</strong></td>
                        <td>{row.exactScores}</td>
                        <td>{row.correctOutcomes}</td>
                        <td>{row.predicted}</td>
                        <td>
                          <span className={percent >= 50 ? "percent-high" : "percent-low"}>
                            {percent.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Results view */}
        {activeTab === "results" && (
          <div className="view active">
            <div className="section-title">Official Match <span className="title-accent">Results</span></div>
            <div className="matches-filter">
              <button className={`filter-btn ${resultsFilter === "all" ? "active" : ""}`} onClick={() => setResultsFilter("all")}>All</button>
              <button className={`filter-btn ${resultsFilter === "live" ? "active" : ""}`} onClick={() => setResultsFilter("live")}>Live</button>
              <button className={`filter-btn ${resultsFilter === "ft" ? "active" : ""}`} onClick={() => setResultsFilter("ft")}>Full Time</button>
            </div>
            <div className="matches-list">
              {getVisibleResults().length === 0 ? (
                <div className="empty-state">No match results match selection.</div>
              ) : (
                getVisibleResults().map((f) => {
                  const res = results[f.matchId];
                  return (
                    <article className="match-card" key={f.matchId}>
                      <div className="mc-header">
                        <span className="mc-kickoff">{f.round}</span>
                        <span className={`mc-badge ${LIVE_STATUSES.includes(res.status) ? "live" : "locked"}`}>
                          {res.status}
                        </span>
                      </div>
                      <div className="mc-body">
                        <div className="mc-team">
                          {getTeamFlag(f.team1)}
                          <div className="mc-name">{f.team1}</div>
                        </div>
                        <div className="mc-score-display">
                          <span className="score-num">{res.score1}</span>
                          <span>-</span>
                          <span className="score-num">{res.score2}</span>
                        </div>
                        <div className="mc-team">
                          {getTeamFlag(f.team2)}
                          <div className="mc-name">{f.team2}</div>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Bracket view */}
        {activeTab === "bracket" && (
          <div className="view active">
            <div className="section-title">Knockout <span className="title-accent">Bracket</span></div>
            <div className="champion-section">
              <div className="champion-trophy">🏆</div>
              <div className="champion-title">World Champion</div>
              <div className="champion-name">TBD</div>
            </div>
            {renderBracket()}
          </div>
        )}

        {/* Admin panel */}
        {activeTab === "admin" && session.isAdmin && (
          <div className="view active">
            <div className="section-title">Admin <span className="title-accent">Verification</span> Panel</div>
            
            <div className="group-standings-card" style={{ marginBottom: "30px" }}>
              <div className="group-title" style={{ fontSize: "20px" }}>Pending Account Requests ({accountRequests.length})</div>
              {accountRequests.filter((r) => r.status === "pending").length === 0 ? (
                <p style={{ color: "var(--muted-text)", padding: "10px" }}>No pending account requests.</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", color: "var(--light-text)" }}>
                  <thead>
                    <tr style={{ color: "var(--accent-gold)", borderBottom: "1px solid var(--dark-border)" }}>
                      <th style={{ padding: "10px", textAlign: "left" }}>Username</th>
                      <th style={{ padding: "10px", textAlign: "left" }}>Display Name</th>
                      <th style={{ padding: "10px", textAlign: "left" }}>Note / Discord ID</th>
                      <th style={{ padding: "10px", textAlign: "center" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accountRequests
                      .filter((r) => r.status === "pending")
                      .map((req) => (
                        <tr key={req.username} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <td style={{ padding: "10px" }}>{req.username}</td>
                          <td style={{ padding: "10px" }}>{req.displayName}</td>
                          <td style={{ padding: "10px" }}>{req.note || "—"}</td>
                          <td style={{ padding: "10px", textAlign: "center", display: "flex", gap: "10px", justifyContent: "center" }}>
                            <button className="sync-btn" onClick={() => handleResolveAccountRequest(req, true)}>
                              Approve
                            </button>
                            <button className="sync-btn" style={{ background: "rgba(219,35,29,0.15)", borderColor: "var(--primary-red)" }} onClick={() => handleResolveAccountRequest(req, false)}>
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Settings modal */}
      {showSettings && (
        <div className="modal-overlay show">
          <div className="modal">
            <div className="modal-header">
              <h2>Settings</h2>
              <button className="close-modal" onClick={() => setShowSettings(false)}>X</button>
            </div>
            <div className="form-group">
              <label>Supabase URL</label>
              <input
                type="text"
                placeholder="https://...supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Supabase Anon Key</label>
              <input
                type="password"
                placeholder="Anon public key"
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Cloudflare Worker URL</label>
              <input
                type="text"
                placeholder="https://...workers.dev"
                value={workerUrl}
                onChange={(e) => setWorkerUrl(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Cloudflare SEED_TOKEN (Optional)</label>
              <input
                type="password"
                placeholder="Token for sync-scores endpoint"
                defaultValue={localStorage.getItem("exodus_seed_token") || ""}
                onChange={(e) => localStorage.setItem("exodus_seed_token", e.target.value.trim())}
              />
            </div>
            <button className="btn-primary" style={{ width: "100%", marginBottom: "10px" }} onClick={handleSaveSettings}>
              Save Settings
            </button>
            <button className="btn-secondary" style={{ width: "100%" }} onClick={() => setShowSettings(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Rules modal */}
      {showRules && (
        <div className="modal-overlay show">
          <div className="modal" style={{ maxWidth: "600px" }}>
            <div className="modal-header">
              <h2>Welcome to Exodus WC 2026 Predictor!</h2>
              <button className="close-modal" onClick={() => setShowRules(false)}>X</button>
            </div>
            <div style={{ color: "var(--light-text)", fontSize: "14px" }}>
              <p style={{ marginBottom: "15px" }}>
                Predict match outcomes and climb the ranks on the leaderboard in the Exodus community!
              </p>
              <h3 style={{ color: "var(--accent-gold)", fontSize: "16px", textTransform: "uppercase", marginBottom: "8px" }}>Point Calculation Rules</h3>
              <ul style={{ listStyleType: "square", paddingLeft: "20px", marginBottom: "15px" }}>
                <li style={{ marginBottom: "8px" }}><strong>15 points</strong>: Exact Score prediction matches outcome.</li>
                <li style={{ marginBottom: "8px" }}><strong>8 points</strong>: Correct Outcome (W/D/L) and Goal Difference is within 1.</li>
                <li style={{ marginBottom: "8px" }}><strong>5 points</strong>: Correct Outcome only.</li>
                <li style={{ marginBottom: "8px" }}><strong>0 points</strong>: Incorrect Outcome.</li>
              </ul>
              <h3 style={{ color: "var(--accent-gold)", fontSize: "16px", textTransform: "uppercase", marginBottom: "8px" }}>Round Multipliers</h3>
              <p style={{ marginBottom: "15px" }}>
                Later rounds are worth more points! Points earned are multiplied by: Round of 16 (x2), Quarter-Finals (x3), Semi-Finals (x4), and the Finals (x5).
              </p>
              <button className="btn-primary" style={{ width: "100%" }} onClick={() => {
                setShowRules(false);
                if (session) localStorage.setItem(`exodus_rules_shown_${session.username}`, "true");
              }}>
                Let's Play!
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast ${toast.type} show`}>{toast.message}</div>}
    </div>
  );
}
