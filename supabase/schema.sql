-- Exodus WC Predictor Supabase Database Schema
-- Run this in the Supabase SQL Editor to initialize all tables, enable RLS, and configure policies.

-- 1. Create Tables
create table if not exists public.users (
    username text primary key,
    "displayName" text not null,
    "secretCode" text not null,
    "isAdmin" boolean default false,
    "totalPoints" int default 0,
    "exactScores" int default 0,
    "correctOutcomes" int default 0,
    predicted int default 0,
    scored int default 0,
    "joinedAt" timestamptz default now()
);

create table if not exists public.fixtures (
    "matchId" text primary key,
    round text not null,
    "group" text,
    stage text not null, -- 'group' or 'knockout'
    date text not null,
    time text not null,
    "kickoffUTC" timestamptz not null,
    team1 text not null,
    team2 text not null,
    ground text,
    "apiFixtureId" int
);

create table if not exists public.predictions (
    id text primary key, -- Format: {username}_{matchId}
    username text not null references public.users(username) on delete cascade,
    "matchId" text not null references public.fixtures("matchId") on delete cascade,
    pred1 int not null,
    pred2 int not null,
    "submittedAt" timestamptz default now(),
    "pointsAwarded" int,
    "scoredAt" timestamptz
);

create table if not exists public.results (
    "matchId" text primary key references public.fixtures("matchId") on delete cascade,
    score1 int not null,
    score2 int not null,
    status text not null, -- 'FT', 'LIVE', 'HT', 'NS'
    "lastUpdated" timestamptz default now(),
    "homeScorers" text[] default '{}',
    "awayScorers" text[] default '{}'
);

create table if not exists public.leaderboard (
    username text primary key references public.users(username) on delete cascade,
    rank int not null,
    "displayName" text not null,
    "totalPoints" int default 0,
    "exactScores" int default 0,
    "correctOutcomes" int default 0,
    predicted int default 0,
    scored int default 0,
    "completedPredictions" int default 0,
    "updatedAt" timestamptz default now()
);

create table if not exists public.account_requests (
    username text primary key,
    "displayName" text not null,
    note text,
    status text default 'pending', -- 'pending', 'approved', 'rejected'
    "secretCode" text not null,
    "createdAt" timestamptz default now(),
    "resolvedAt" timestamptz
);

-- 2. Create Indexes for optimization
create index if not exists idx_predictions_username on public.predictions(username);
create index if not exists idx_predictions_matchId on public.predictions("matchId");
create index if not exists idx_fixtures_kickoffUTC on public.fixtures("kickoffUTC");
create index if not exists idx_leaderboard_points on public.leaderboard("totalPoints" desc, "exactScores" desc, "correctOutcomes" desc);

-- 3. Enable Row Level Security (RLS) on all tables
alter table public.users enable row level security;
alter table public.fixtures enable row level security;
alter table public.predictions enable row level security;
alter table public.results enable row level security;
alter table public.leaderboard enable row level security;
alter table public.account_requests enable row level security;

-- 4. Create Public Access Policies (anon role)
-- Note: Clients use the anon public API key. We permit full select, insert, and update.
create policy "Allow public read users" on public.users for select using (true);
create policy "Allow public insert users" on public.users for insert with check (true);
create policy "Allow public update users" on public.users for update using (true);

create policy "Allow public read fixtures" on public.fixtures for select using (true);
create policy "Allow public write fixtures" on public.fixtures for all using (true);

create policy "Allow public read predictions" on public.predictions for select using (true);
create policy "Allow public write predictions" on public.predictions for all using (true);

create policy "Allow public read results" on public.results for select using (true);
create policy "Allow public write results" on public.results for all using (true);

create policy "Allow public read leaderboard" on public.leaderboard for select using (true);
create policy "Allow public write leaderboard" on public.leaderboard for all using (true);

create policy "Allow public read account_requests" on public.account_requests for select using (true);
create policy "Allow public write account_requests" on public.account_requests for all using (true);
