// Run: node scripts/seed.js
// Seeds fixtures, teams, and a default admin user in Supabase.

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import dotenv from "dotenv";

// Load environment variables from .env or .env.local
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in your environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const DEFAULT_USERS = [
  { username: "admin", displayName: "Exodus Admin", secretCode: "EXODUS2026", isAdmin: true, totalPoints: 0, joinedAt: new Date().toISOString() }
];

function getStage(round = "") {
  const r = round.toLowerCase();
  if (r.includes("matchday") || r.includes("group")) return "group";
  if (r.includes("round of 32")) return "r32";
  if (r.includes("round of 16")) return "r16";
  if (r.includes("quarter")) return "qf";
  if (r.includes("semi")) return "sf";
  if (r.includes("third")) return "third";
  if (r.includes("final")) return "final";
  return "group";
}

function toKickoffUTC(date, time) {
  const timeMatch = String(time || "").match(
    /(\d{1,2}):(\d{2})\s+UTC([+-]\d{1,2}(?:\.\d+)?)/i,
  );

  if (!date || !timeMatch) {
    return date ? new Date(`${date}T00:00:00Z`).toISOString() : "";
  }

  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);
  const offset = Number(timeMatch[3]);
  const [y, m, d] = String(date).split("-").map(Number);

  return new Date(Date.UTC(y, m - 1, d, hour - offset, minute)).toISOString();
}

async function seed() {
  console.log("Initializing seeding to Supabase...");

  // 1. Seed Default Admin User
  console.log("Seeding default users...");
  for (const user of DEFAULT_USERS) {
    const { data, error } = await supabase
      .from("users")
      .upsert(user, { onConflict: "username" });

    if (error) {
      console.error(`  Error seeding user ${user.username}:`, error.message);
    } else {
      console.log(`  Seeded user: ${user.username}`);
    }
  }

  // 2. Seed Fixtures
  console.log("Seeding fixtures...");
  const rawFixtures = JSON.parse(readFileSync("scripts/data/worldcup.json", "utf8"));
  const matches = rawFixtures.matches || [];
  const fixtureRows = [];

  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const matchId = String(m.num || i + 1);
    const stage = getStage(m.round);

    fixtureRows.push({
      matchId,
      round: m.round || "",
      group: m.group || (stage === "group" ? "" : null),
      stage,
      date: m.date || "",
      time: m.time || "",
      kickoffUTC: toKickoffUTC(m.date, m.time),
      team1: m.team1 || "TBD",
      team2: m.team2 || "TBD",
      ground: m.ground || "",
      apiFixtureId: null
    });
  }

  // Batch insert fixtures (100 at a time)
  const batchSize = 100;
  for (let i = 0; i < fixtureRows.length; i += batchSize) {
    const batch = fixtureRows.slice(i, i + batchSize);
    const { error } = await supabase
      .from("fixtures")
      .upsert(batch, { onConflict: "matchId" });

    if (error) {
      console.error(`  Error seeding fixtures batch ${i / batchSize + 1}:`, error.message);
    } else {
      console.log(`  Seeded fixtures batch ${i / batchSize + 1} (${batch.length} rows)`);
    }
  }

  console.log("Done seeding database successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding crashed:", err);
  process.exit(1);
});
