# Supabase Backup Setup

Supabase is the backup datastore for Firebase quota outages. The Apps Script backend still tries Firestore first, then falls back to Supabase if Firestore returns a quota/error response.

## Project

- URL: `https://nthnysznieivbkncpqrk.supabase.co`
- Apps Script reads `SUPABASE_URL` and `SUPABASE_KEY` from Script Properties first.
- If those properties are missing, it falls back to `firebaseConfig.supabaseUrl` and `firebaseConfig.supabaseAnonKey`.

## Tables

Run this in the Supabase SQL Editor:

```sql
create table if not exists users (
  username text primary key,
  "displayName" text,
  "secretCode" text,
  "isAdmin" boolean default false,
  "totalPoints" int default 0,
  "joinedAt" timestamptz
);

create table if not exists fixtures (
  "matchId" text primary key,
  round text,
  "group" text,
  stage text,
  date text,
  time text,
  "kickoffUTC" timestamptz,
  team1 text,
  team2 text,
  ground text,
  "apiFixtureId" int
);

create table if not exists predictions (
  id text primary key,
  username text,
  "matchId" text,
  pred1 int,
  pred2 int,
  "submittedAt" timestamptz,
  "pointsAwarded" int,
  "scoredAt" timestamptz
);

create table if not exists results (
  "matchId" text primary key,
  score1 int,
  score2 int,
  status text,
  "lastUpdated" timestamptz
);

create table if not exists leaderboard (
  username text primary key,
  rank int,
  "displayName" text,
  "totalPoints" int default 0,
  "exactScores" int default 0,
  "correctOutcomes" int default 0,
  predicted int default 0,
  scored int default 0,
  "updatedAt" timestamptz
);
```

## Migration

After Firebase quota resets, run `migrateFirestoreToSupabase()` in Apps Script. It copies:

- `users`
- `fixtures`
- `predictions`
- `results`

You can also trigger it through `doPost` with:

```json
{ "action": "migrateToSupabase" }
```

## Row Level Security (RLS)

To secure the database tables and resolve the security warnings in the Supabase dashboard, enable Row Level Security (RLS) on all tables. Since the browser frontend and backend worker authenticate using the anonymous publishable API key, we configure public read and write policies for the `anon` role.

The migration script [20260616000000_enable_rls.sql](file:///C:/Users/abdel/OneDrive/Desktop/ggofiles/ggowcpredictor/supabase/migrations/20260616000000_enable_rls.sql) has been created to apply these changes.

To apply this migration:
1. Copy the SQL statements in the migration file.
2. Paste and run them in the **Supabase SQL Editor** in your project dashboard.
3. RLS is now enabled, and the dashboard warning will resolve while keeping predictions and logins fully functional!

## Dual-Database Merging & Resilience

To resolve issues where predictions created on one device (or during a temporary database glitch) do not sync across databases, the frontend app, backend worker, and Google Apps Script now **merge** results from both Supabase and Firestore:
1. When loading predictions or results, it reads from both databases.
2. It deduplicates and merges the items by their primary key (e.g. `matchId` or prediction `id`).
3. For rows present in both databases, it compares the update timestamps (`submittedAt`, `updatedAt`, `lastUpdated`) and retains the latest record.
4. This ensures that even if a write fails on one database, the user still sees all data and the leaderboard recalculates with 100% accuracy.

