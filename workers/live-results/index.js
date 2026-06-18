// Exodus World Cup Predictor — Cloudflare Worker Backend
// Setup: npx wrangler deploy
// Env Secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SEED_TOKEN, API_FOOTBALL_KEY, ZAFRONIX_API_KEY

import { createClient } from "@supabase/supabase-js";

const WORLDCUP26_GAMES_URL = "https://worldcup26.ir/get/games";
const ZAFRONIX_URL = "https://api.zafronix.com/fifa/worldcup/v1/tournaments/2026/matches";

const FINAL_STATUSES = ["FT", "AET", "PEN", "COMPLETED", "FINAL"];

const MULTIPLIERS = {
  group: 1,
  r32: 1,
  r16: 2,
  qf: 3,
  sf: 4,
  third: 5,
  final: 5
};

// ─── Scoring Engine ──────────────────────────────────────────────────────────
function scoreMatch(p1, p2, a1, a2, stage) {
  let basePoints = 0;
  if (p1 === a1 && p2 === a2) {
    basePoints = 15;
  } else {
    const predOutcome = Math.sign(p1 - p2);
    const actualOutcome = Math.sign(a1 - a2);
    if (predOutcome === actualOutcome) {
      const diffGap = Math.abs((p1 - p2) - (a1 - a2));
      basePoints = diffGap <= 1 ? 8 : 5;
    } else {
      basePoints = 0;
    }
  }
  const mult = MULTIPLIERS[stage] || 1;
  return basePoints * mult;
}

// ─── Build Leaderboard ──────────────────────────────────────────────────────
function buildLeaderboard(resultRows, predictionRows, userRows, fixtureRows) {
  const displayNames = {};
  for (const user of userRows) {
    const username = String(user.username || "").trim();
    if (username) displayNames[username] = user.displayName || username;
  }

  const fixtureMap = {};
  for (const f of fixtureRows) {
    const id = String(f.matchId || "").replace(/^match_/, "");
    if (id) fixtureMap[id] = f;
  }

  const results = {};
  for (const r of resultRows) {
    const matchId = String(r.matchId || "").replace(/^match_/, "");
    const status = String(r.status || "").toUpperCase();
    const score1 = toNullableNumber(r.score1);
    const score2 = toNullableNumber(r.score2);
    if (!matchId || score1 === null || score2 === null) continue;
    if (!FINAL_STATUSES.includes(status)) continue;
    results[matchId] = { matchId, score1, score2, status };
  }

  const userMap = {};
  for (const prediction of predictionRows) {
    const username = String(prediction.username || "").trim();
    const matchId = String(prediction.matchId || "").replace(/^match_/, "");
    const pred1 = toNullableNumber(prediction.pred1);
    const pred2 = toNullableNumber(prediction.pred2);
    if (!username || !matchId || pred1 === null || pred2 === null) continue;

    if (!userMap[username]) {
      userMap[username] = {
        username,
        displayName: displayNames[username] || username,
        totalPoints: 0,
        exactScores: 0,
        correctOutcomes: 0,
        predicted: 0,
        scored: 0,
        completedPredictions: 0,
      };
    }

    userMap[username].predicted++;
    const result = results[matchId];
    if (!result) continue;

    userMap[username].completedPredictions++;
    const fixture = fixtureMap[matchId] || {};
    const stage = fixture.stage || "group";
    const points = scoreMatch(pred1, pred2, result.score1, result.score2, stage);
    userMap[username].totalPoints += points;
    userMap[username].scored++;
    
    // Base points mapping for exact/outcome metrics (ignoring multiplier)
    const basePoints = points / (MULTIPLIERS[stage] || 1);
    if (basePoints === 15) userMap[username].exactScores++;
    if (basePoints > 0) userMap[username].correctOutcomes++;
  }

  // Sort by points (desc), then exactScores, then correctOutcomes (desc)
  const sorted = Object.values(userMap).sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (b.exactScores !== a.exactScores) return b.exactScores - a.exactScores;
    if (b.correctOutcomes !== a.correctOutcomes) return b.correctOutcomes - a.correctOutcomes;
    return a.username.localeCompare(b.username);
  });

  // Competition ranking calculation (ties share same rank, skip rank counts)
  const ranked = [];
  let rank = 1;
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j < sorted.length && sorted[j].totalPoints === sorted[i].totalPoints) {
      j++;
    }
    const currentRank = rank;
    for (let k = i; k < j; k++) {
      ranked.push({
        ...sorted[k],
        rank: currentRank,
      });
    }
    rank += (j - i);
    i = j;
  }

  return {
    leaderboard: ranked,
    scoredMatches: Object.keys(results).length,
  };
}

// ─── Rivals & Twins logic ───────────────────────────────────────────────────
async function handleRivalryGet(supabase, username) {
  const [predsRes, resultsRes, usersRes] = await Promise.all([
    supabase.from("predictions").select("*"),
    supabase.from("results").select("*"),
    supabase.from("users").select("*")
  ]);

  if (predsRes.error || resultsRes.error || usersRes.error) {
    throw new Error("Failed to load records from Supabase for rivalry calculation");
  }

  const allPredictions = predsRes.data;
  const allResults = resultsRes.data;
  const allUsers = usersRes.data;

  const finishedMatchIds = new Set(
    allResults
      .filter((r) => FINAL_STATUSES.includes(String(r.status || "").toUpperCase()))
      .map((r) => String(r.matchId || "").replace(/^match_/, ""))
  );

  const myPreds = {};
  allPredictions
    .filter((p) => String(p.username || "").toLowerCase() === username.toLowerCase())
    .forEach((p) => {
      const mid = String(p.matchId || "").replace(/^match_/, "");
      if (finishedMatchIds.has(mid)) {
        myPreds[mid] = {
          pred1: toNullableNumber(p.pred1),
          pred2: toNullableNumber(p.pred2),
        };
      }
    });

  if (!Object.keys(myPreds).length) {
    return { rival: null, twin: null, reason: "not_enough_data" };
  }

  const userScores = {};
  allPredictions
    .filter((p) => {
      const u = String(p.username || "").toLowerCase();
      return u !== username.toLowerCase() && u !== "";
    })
    .forEach((p) => {
      const mid = String(p.matchId || "").replace(/^match_/, "");
      const mine = myPreds[mid];
      if (!mine || mine.pred1 === null || mine.pred2 === null) return;

      const theirP1 = toNullableNumber(p.pred1);
      const theirP2 = toNullableNumber(p.pred2);
      if (theirP1 === null || theirP2 === null) return;

      const u = String(p.username || "").toLowerCase();
      if (!userScores[u]) {
        userScores[u] = { username: u, divergence: 0, shared: 0, agreement: 0 };
      }

      const diff = Math.abs(mine.pred1 - theirP1) + Math.abs(mine.pred2 - theirP2);
      userScores[u].divergence += diff;
      userScores[u].shared += 1;
      if (diff === 0) userScores[u].agreement += 1;
    });

  const candidates = Object.values(userScores).filter((u) => u.shared >= 3);
  if (!candidates.length) return { rival: null, twin: null, reason: "not_enough_data" };

  candidates.sort((a, b) => (b.divergence / b.shared) - (a.divergence / a.shared));
  const rivalEntry = candidates[0];

  candidates.sort((a, b) => (b.agreement / b.shared) - (a.agreement / a.shared));
  const twinEntry = candidates[0];

  const nameMap = {};
  allUsers.forEach((u) => {
    nameMap[String(u.username || "").toLowerCase()] = u.displayName || u.username;
  });

  return {
    rival: {
      username: rivalEntry.username,
      displayName: nameMap[rivalEntry.username] || rivalEntry.username,
      divergenceScore: Math.round((rivalEntry.divergence / rivalEntry.shared) * 10) / 10,
      sharedMatches: rivalEntry.shared,
    },
    twin: (twinEntry.agreement / twinEntry.shared) > 0.2
      ? {
        username: twinEntry.username,
        displayName: nameMap[twinEntry.username] || twinEntry.username,
        agreementPct: Math.round((twinEntry.agreement / twinEntry.shared) * 100),
        sharedMatches: twinEntry.shared,
      }
      : null,
  };
}

// ─── Single User Profile logic ──────────────────────────────────────────────
async function handleProfileGet(supabase, username) {
  const [usersRes, predsRes, fixturesRes, resultsRes] = await Promise.all([
    supabase.from("users").select("*"),
    supabase.from("predictions").select("*"),
    supabase.from("fixtures").select("*"),
    supabase.from("results").select("*")
  ]);

  if (usersRes.error || predsRes.error || fixturesRes.error || resultsRes.error) {
    throw new Error("Failed to load records from Supabase for profile calculation");
  }

  const user = usersRes.data.find(
    (u) => String(u.username || "").trim().toLowerCase() === username.toLowerCase()
  );
  if (!user) {
    return { success: false, error: "User not found" };
  }

  // Recalculate leaderboard positions
  const leaderboardData = buildLeaderboard(resultsRes.data, predsRes.data, usersRes.data, fixturesRes.data);
  const lbEntry = leaderboardData.leaderboard.find(
    (e) => String(e.username || "").toLowerCase() === username.toLowerCase()
  ) || {};

  const fixtureMap = {};
  for (const f of fixturesRes.data) {
    const id = String(f.matchId || "").replace(/^match_/, "");
    if (id) fixtureMap[id] = f;
  }

  const resultMap = {};
  for (const r of resultsRes.data) {
    const id = String(r.matchId || "").replace(/^match_/, "");
    if (id) resultMap[id] = r;
  }

  const userPredictions = predsRes.data.filter(
    (p) => String(p.username || "").toLowerCase() === username.toLowerCase()
  );

  const LIVE_STS = ["1H", "HT", "2H", "ET", "P", "LIVE"];

  const predictions = userPredictions
    .filter((p) => p.matchId != null)
    .map((p) => {
      const matchId = String(p.matchId).replace(/^match_/, "");
      const fixture = fixtureMap[matchId] || {};
      const result = resultMap[matchId];

      const pred1 = toNullableNumber(p.pred1);
      const pred2 = toNullableNumber(p.pred2);
      const hasPred = pred1 !== null && pred2 !== null;

      let actualHome = null,
        actualAway = null,
        points = null,
        statusType = "upcoming";

      if (result) {
        actualHome = toNullableNumber(result.score1);
        actualAway = toNullableNumber(result.score2);
        const st = String(result.status || "NS").toUpperCase();
        if (FINAL_STATUSES.includes(st)) statusType = "finished";
        else if (LIVE_STS.includes(st)) statusType = "live";
      }

      if (hasPred && actualHome !== null && actualAway !== null) {
        const stage = fixture.stage || "group";
        points = scoreMatch(pred1, pred2, actualHome, actualAway, stage);
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
      const order = { finished: 0, live: 1, upcoming: 2 };
      const od = (order[a.statusType] ?? 3) - (order[b.statusType] ?? 3);
      return od !== 0 ? od : Number(a.matchId) - Number(b.matchId);
    });

  return {
    user: {
      username: user.username || username,
      displayName: user.displayName || username,
      isAdmin: Boolean(user.isAdmin),
      totalPoints: lbEntry.totalPoints ?? 0,
      exactScores: lbEntry.exactScores ?? 0,
      correctOutcomes: lbEntry.correctOutcomes ?? 0,
      predicted: userPredictions.length,
      rank: lbEntry.rank ?? null,
    },
    predictions,
  };
}

// ─── Live Scores Sync logic ──────────────────────────────────────────────────
async function syncLiveResults(supabase, env) {
  const [fixturesRes, apiMatches] = await Promise.all([
    supabase.from("fixtures").select("*"),
    fetchPrimaryOrBackupMatches(env),
  ]);

  if (fixturesRes.error) {
    throw new Error(`Failed to load fixtures: ${fixturesRes.error.message}`);
  }

  const fixtureRows = fixturesRes.data;
  const fixtureLookups = buildFixtureLookups(fixtureRows);
  const matchedUpdates = [];
  const fixtureApiUpdates = [];

  for (const item of apiMatches) {
    const resolved = resolveFixtureMatch(item, fixtureLookups);
    if (!resolved) continue;

    const { fixture, flipped } = resolved;
    const internalMatchId = normalizeMatchId(fixture.matchId);
    const apiHome = toNullableNumber(readScore(item, "home"));
    const apiAway = toNullableNumber(readScore(item, "away"));
    const apiGameId = toNullableNumber(item.apiGameId);

    if (apiGameId !== null && !fixture.apiFixtureId) {
      fixtureApiUpdates.push({
        matchId: internalMatchId,
        apiFixtureId: apiGameId,
      });
      fixtureLookups.byApiId.set(String(apiGameId), fixture);
      fixture.apiFixtureId = apiGameId;
    }

    matchedUpdates.push({
      matchId: internalMatchId,
      score1: flipped ? apiAway : apiHome,
      score2: flipped ? apiHome : apiAway,
      status: mapStatus(item.status),
      lastUpdated: new Date().toISOString(),
      homeScorers: flipped ? item.awayScorers : item.homeScorers,
      awayScorers: flipped ? item.homeScorers : item.awayScorers,
    });
  }

  // Write API fixture IDs to db
  if (fixtureApiUpdates.length) {
    await supabase.from("fixtures").upsert(fixtureApiUpdates);
  }

  const liveOrFinished = matchedUpdates.filter(
    (u) => u.status !== "NS" && u.score1 !== null && u.score2 !== null
  );

  if (liveOrFinished.length) {
    await supabase.from("results").upsert(liveOrFinished);
  }

  // Recalculate and update the leaderboard Table
  await recalculateAndSaveLeaderboard(supabase);

  return {
    success: true,
    matched: matchedUpdates.length,
    updated: liveOrFinished.length,
    apiFixtureIdsUpdated: fixtureApiUpdates.length,
  };
}

async function recalculateAndSaveLeaderboard(supabase) {
  const [resRows, predRows, uRows, fixRows] = await Promise.all([
    supabase.from("results").select("*"),
    supabase.from("predictions").select("*"),
    supabase.from("users").select("*"),
    supabase.from("fixtures").select("*")
  ]);

  if (resRows.error || predRows.error || uRows.error || fixRows.error) {
    throw new Error("Failed to load records for leaderboard refresh");
  }

  const { leaderboard } = buildLeaderboard(resRows.data, predRows.data, uRows.data, fixRows.data);

  if (leaderboard.length) {
    const rows = leaderboard.map((p) => ({
      username: p.username,
      rank: p.rank,
      displayName: p.displayName,
      totalPoints: p.totalPoints,
      exactScores: p.exactScores,
      correctOutcomes: p.correctOutcomes,
      predicted: p.predicted,
      scored: p.scored,
      completedPredictions: p.completedPredictions,
      updatedAt: new Date().toISOString(),
    }));

    await supabase.from("leaderboard").upsert(rows);
  }

  return leaderboard;
}

// ─── External Matches Fetchers ────────────────────────────────────────────────
async function fetchPrimaryOrBackupMatches(env) {
  const zafronixKey = env.ZAFRONIX_API_KEY;

  try {
    const response = await fetch(WORLDCUP26_GAMES_URL, {
      headers: { Accept: "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      return normalizeWorldcup26Games(data);
    }
  } catch (error) {
    console.warn("worldcup26.ir fetch failed:", error.message);
  }

  if (zafronixKey) {
    try {
      const response = await fetch(ZAFRONIX_URL, {
        headers: { "X-API-Key": zafronixKey, Accept: "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        return Array.isArray(data) ? data : data.matches || [];
      }
    } catch (error) {
      console.warn("Zafronix fetch failed:", error.message);
    }
  }

  return [];
}

// ─── Score Normalizers ───────────────────────────────────────────────────────
function normalizeMatchId(value) {
  return String(value || "").replace(/^match_/, "");
}

function cleanTeamName(name) {
  let clean = String(name || "")
    .toLowerCase()
    .replace(/\band\b/g, "")
    .replace(/&/g, "")
    .replace(/[^a-z0-9]/g, "");
  if (clean === "korearepublic" || clean === "repofkorea" || clean === "koreasouth") return "southkorea";
  if (clean === "unitedstates" || clean === "unitedstatesofamerica") return "usa";
  if (clean === "czechia") return "czechrepublic";
  if (clean === "cotedivoire" || clean === "ivorycoast") return "ivorycoast";
  if (clean === "curaao" || clean === "curacao") return "curacao";
  if (
    clean === "drcongo" ||
    clean === "congodr" ||
    clean === "democraticrepublicofcongo" ||
    clean === "democraticrepublicofthecongo" ||
    clean === "congodemocraticrepublic"
  ) {
    return "drcongo";
  }
  if (clean === "capeverde" || clean === "caboverde") return "capeverde";
  return clean;
}

function buildFixtureLookups(fixtureRows) {
  const byApiId = new Map();
  const byTeams = new Map();

  for (const fixture of fixtureRows) {
    const matchId = normalizeMatchId(fixture.matchId);
    if (!matchId) continue;

    if (fixture.apiFixtureId !== null && fixture.apiFixtureId !== undefined) {
      byApiId.set(String(fixture.apiFixtureId), fixture);
    }

    const home = cleanTeamName(fixture.team1);
    const away = cleanTeamName(fixture.team2);
    if (home && away) {
      byTeams.set(`${home}__${away}`, { fixture, flipped: false });
      byTeams.set(`${away}__${home}`, { fixture, flipped: true });
    }
  }

  return { byApiId, byTeams };
}

function resolveFixtureMatch(item, lookups) {
  const apiGameId = item.apiGameId ?? item.matchId ?? null;
  const homeTeam = cleanTeamName(item.homeTeam || item.team1 || "");
  const awayTeam = cleanTeamName(item.awayTeam || item.team2 || "");
  if (!homeTeam || !awayTeam) return null;

  if (apiGameId !== null && apiGameId !== undefined && apiGameId !== "") {
    const byId = lookups.byApiId.get(String(apiGameId));
    if (byId) {
      const dbHome = cleanTeamName(byId.team1);
      const dbAway = cleanTeamName(byId.team2);
      const flipped = dbHome === awayTeam && dbAway === homeTeam;
      return { fixture: byId, flipped };
    }
  }

  const teamMatch = lookups.byTeams.get(`${homeTeam}__${awayTeam}`);
  if (teamMatch) return teamMatch;

  return null;
}

function mapStatus(zStatus) {
  if (!zStatus) return "NS";
  const s = String(zStatus).toLowerCase();
  if (["completed", "finished", "ft", "full-time", "fulltime"].includes(s)) return "FT";
  if (["halftime", "ht", "half-time"].includes(s)) return "HT";
  if (["live", "in_play", "inplay", "1h", "first half"].includes(s)) return "1H";
  if (["second half", "2h"].includes(s)) return "2H";
  if (["aet", "extra time", "extra-time"].includes(s)) return "AET";
  if (["pen", "penalties", "pens"].includes(s)) return "PEN";
  return "NS";
}

function readScore(item, side) {
  const keys = side === "home"
    ? ["homeScore", "score1", "team1Score", "home_goal", "homeGoals"]
    : ["awayScore", "score2", "team2Score", "away_goal", "awayGoals"];

  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null && item[key] !== "") return item[key];
  }
  return null;
}

function normalizeWorldcup26Games(payload) {
  const games = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.games)
      ? payload.games
      : [];
  return games.map((game) => ({
    source: "worldcup26",
    apiGameId: String(game.id || ""),
    homeTeam: game.home_team_name_en || game.home_team_label || game.home_team || "",
    awayTeam: game.away_team_name_en || game.away_team_label || game.away_team || "",
    homeScore: game.home_score ?? null,
    awayScore: game.away_score ?? null,
    status: game.finished ? "FT" : "NS",
    homeScorers: parseScorers(game.home_scorers),
    awayScorers: parseScorers(game.away_scorers),
  }));
}

function parseScorers(raw) {
  if (!raw || raw === "null") return [];
  return String(raw)
    .replace(/^\{/, "")
    .replace(/\}$/, "")
    .split(/",\s*"/)
    .map((s) => s.replace(/^"+|"+$/g, "").trim())
    .filter(Boolean);
}

function toNullableNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

// ─── Cloudflare Worker Entrypoint ──────────────────────────────────────────
export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    
    const dbUrl = env.SUPABASE_URL;
    const dbKey = env.SUPABASE_SERVICE_ROLE_KEY;

    if (!dbUrl || !dbKey) {
      return new Response(JSON.stringify({ error: "Missing Supabase credentials in environment" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const supabase = createClient(dbUrl, dbKey);

    try {
      // 1. /sync-scores (auth required)
      if (path === "/sync-scores") {
        const authHeader = request.headers.get("Authorization") || "";
        const queryToken = url.searchParams.get("token") || "";
        const expectedToken = env.SEED_TOKEN;

        if (expectedToken && authHeader !== `Bearer ${expectedToken}` && queryToken !== expectedToken) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }

        const result = await syncLiveResults(supabase, env);
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }

      // 2. /sync (returns full dataset: fixtures, results, users, leaderboard)
      if (path === "/sync") {
        const [fixturesRes, resultsRes, usersRes, leaderboardRes] = await Promise.all([
          supabase.from("fixtures").select("*"),
          supabase.from("results").select("*"),
          supabase.from("users").select("username, displayName, isAdmin"),
          supabase.from("leaderboard").select("*").order("rank", { ascending: true })
        ]);

        const resultsMap = {};
        if (resultsRes.data) {
          for (const r of resultsRes.data) {
            resultsMap[r.matchId] = r;
          }
        }

        return new Response(JSON.stringify({
          fixtures: fixturesRes.data || [],
          results: resultsMap,
          users: usersRes.data || [],
          leaderboard: leaderboardRes.data || [],
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }

      // 3. /leaderboard
      if (path === "/leaderboard") {
        const { data, error } = await supabase
          .from("leaderboard")
          .select("*")
          .order("rank", { ascending: true });

        if (error) throw error;

        return new Response(JSON.stringify({
          leaderboard: data || [],
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }

      // 4. /profile
      if (path === "/profile") {
        const username = url.searchParams.get("username") || "";
        if (!username) {
          return new Response(JSON.stringify({ error: "username parameter required" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }

        const profileData = await handleProfileGet(supabase, username);
        return new Response(JSON.stringify(profileData), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }

      // 5. /rivalry
      if (path === "/rivalry") {
        const username = url.searchParams.get("username") || "";
        if (!username) {
          return new Response(JSON.stringify({ error: "username parameter required" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }

        const rivalryData = await handleRivalryGet(supabase, username);
        return new Response(JSON.stringify(rivalryData), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }

      // Root endpoint
      return new Response(JSON.stringify({
        ok: true,
        message: "Exodus WC 2026 Predictor API. Endpoints: /sync, /sync-scores, /leaderboard, /profile, /rivalry"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    } catch (err) {
      console.error("Worker routing error:", err);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
  },

  async scheduled(event, env, ctx) {
    const dbUrl = env.SUPABASE_URL;
    const dbKey = env.SUPABASE_SERVICE_ROLE_KEY;
    if (dbUrl && dbKey) {
      const supabase = createClient(dbUrl, dbKey);
      ctx.waitUntil(syncLiveResults(supabase, env));
    }
  }
};
