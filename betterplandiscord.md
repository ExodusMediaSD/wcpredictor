# Exodus WC Predictor — Build Notes & Discord Login Plan

Consolidated notes from the GGO WC Predictor debugging history, applied as upfront
design constraints for the Exodus rebuild, plus the Discord OAuth2 implementation plan.

---

## 1. Lessons from GGO Predictor (apply these from day one)

These are bugs that took multiple sessions to find in the old Firebase/Firestore +
Cloudflare Worker + Supabase hybrid build. The Exodus rebuild should be designed so
none of these are possible in the first place, not patched after the fact.

### 1.1 matchId mismatch (openfootball IDs vs API-Football IDs)

**What happened:** Fixtures were seeded with openfootball's sequential numbering
(`1`, `2`, `3`...), but the live-score API used its own internal fixture IDs. Nothing
tied the two together, so score updates either silently failed to match or matched
the wrong fixture.

**Design rule for the rebuild:**

- Fixtures table keeps the internal sequential `matchId` as primary key — never the
  external API's ID.
- Add an `apiFixtureId` column (already present in `worldcup.json` seeding via
  `seed.js` — it's currently always `null`). The **first successful match** between
  an internal fixture and an external API match should **persist** the external ID
  back onto the fixture row, so every subsequent sync for that match is a direct
  ID lookup, not a re-run of fuzzy team-name matching.
- This is already partially implemented in `workers/live-results/index.js` via
  `fixtureApiUpdates` — keep that pattern, but verify it's actually firing (log
  `apiFixtureIdsUpdated` count on every sync and alert if it stays at 0 after the
  tournament starts).

### 1.2 `cleanTeamName()` silently dropping matches (France vs Senegal bug)

**What happened:** Team-name normalization didn't account for every variant an
external API might send (accented characters, "and" vs "&", confederation-specific
naming like "IR Iran" or "Korea Republic"). When normalization produced two
different strings for what was actually the same match, `resolveFixtureMatch`
returned `null` — **with no error and no log.** The match just never got a result.

**Design rule for the rebuild:**

- Never let a fixture-resolution failure fail silently. Every unmatched API match
  should be written to a `sync_log` (or even just `console.error` plus a counter
  returned from `/sync-scores`) so it's visible immediately instead of discovered
  weeks later when someone notices a missing scoreline.
- Build the team-name alias table from the **actual confirmed roster** of countries
  in `worldcup.teams.json` / `worldcup.squads.json` (45 teams), not reactively as
  failures are discovered. Test `cleanTeamName()` against every team name in
  `worldcup.teams.json` _and_ every `name_normalised` variant before going live —
  don't wait for a live match to reveal a gap.
- Treat apostrophes/diacritics carefully: confirm `Curaçao`, `Côte d'Ivoire` /
  "Ivory Coast", and `Bosnia & Herzegovina` all normalize identically regardless of
  which side (DB seed vs. live API) the string comes from. Write this as an actual
  unit test, not a manual spot-check.

### 1.3 Leaderboard cron overwriting manual fixes

**What happened:** When a user's leaderboard total was wrong, it'd get manually
corrected via SQL — and then silently reverted a few minutes later when the cron
job re-ran `recalculateAndSaveLeaderboard()` and upserted the whole table from
scratch.

**Design rule for the rebuild:**

- The leaderboard table is a **derived cache**, full stop. Never hand-edit it
  directly. If a number is wrong, the bug is in `predictions`, `results`, or the
  scoring function — fix the source, then let recalculation produce the correct
  leaderboard naturally.
- If a temporary manual override is ever truly needed (e.g. correcting a bad
  result during a live event before the API catches up), put it in `results`,
  not `leaderboard`, so the cron's normal recompute produces the right answer
  instead of being overwritten by it.

### 1.4 Firestore security rules blocking non-admin users

**What happened:** Carried over from the Firebase-era version of this project.
Not directly applicable now that the rebuild is Supabase-only, but the underlying
lesson is generic.

**Design rule for the rebuild:**

- Supabase RLS policies should be written and tested for **both** roles (anon
  read/write for regular users, service-role for the Worker) before any feature
  work happens on top of them — not discovered via a 403 in production.
- Specifically test: can a logged-in non-admin submit a prediction? Read the
  leaderboard? Read fixtures? Can an anon (logged-out) visitor read public data
  (fixtures/leaderboard) but not write predictions?

### 1.5 `hasResult()` treating unplayed matches as having results

**What happened:** A loose-equality or missing-null-check bug in an earlier
version caused matches with no score yet to register as "has a result," which
fed wrong data into standings and the leaderboard.

**Design rule for the rebuild:**

- Already partially correct in the current `App.jsx`/Worker code via
  `toNullableNumber()` plus explicit `=== null` checks before treating a result
  as final — keep this pattern everywhere a result is read. Never treat `0`/`NS`/
  empty-string score fields as falsy-but-valid; always check status against
  `FINAL_STATUSES` explicitly, not just "scores exist."

### 1.6 Timezone / Cairo display conversion

**Design rule for the rebuild:**

- Store `kickoffUTC` as the single source of truth (already done in `seed.js` via
  `toKickoffUTC`). All display-side conversion (Cairo time, or any other local
  time) happens client-side from that UTC value — never re-derive or re-parse the
  human-readable `time` string (`"13:00 UTC-6"`) anywhere except at seed time.

### 1.7 CSS duplicate rules / mobile layout

**Design rule for the rebuild:**

- Keep the stylesheet single-source per component block (the current
  `src/index.css` is reasonably organized into clearly commented sections — keep
  that discipline as new views are added). Do a duplicate-selector lint pass
  before shipping (`grep` for repeated class selectors) rather than discovering
  conflicts visually after the fact.

### 1.8 General process lesson

The GGO predictor's bugs were almost all **silent failures**: wrong matchId →
nothing happens; team name mismatch → nothing happens; security rule block →
generic error. The single highest-leverage change for the rebuild is **logging
and surfacing every failure path** (sync mismatches, RLS denials, unresolved
fixtures) so issues are caught in minutes, not weeks.

---

## 2. Discord OAuth2 Integration Plan

Replaces the manual username/secret-code login with one-click Discord login, so
any verified member of the Exodus Discord server can log in directly.

### 2.1 Flow

```
User clicks "Login with Discord"
        ↓
Redirected to discord.com (user authorizes the app)
        ↓
Discord redirects back to the app with ?code=...
        ↓
Cloudflare Worker exchanges the code for user info
  → Verifies they are a member of the Exodus Discord server
  → Auto-creates/updates their row in the Supabase `users` table
  → Returns a signed session object
        ↓
User is logged in — Discord username, display name, and avatar are used
```

### 2.2 Decisions (from project plan)

| Decision                | Choice                                                                        |
| ----------------------- | ----------------------------------------------------------------------------- |
| Auth type               | OAuth2 only — no bot, no gateway connection                                   |
| Token exchange location | Cloudflare Worker (extends `workers/live-results/index.js`)                   |
| Guild verification      | Required — `GET /users/@me/guilds/members/{guild_id}` must return 200         |
| Legacy login            | `admin` / `EXODUS2026` code login kept as fallback for the admin account only |
| Regular member login    | Discord OAuth2 only, no secret codes going forward                            |

### 2.3 Info needed before implementation

1. **Exodus Discord Server ID** — Server Settings → right-click icon → Copy Server
   ID (requires Developer Mode enabled in Discord client settings).
2. **Production app URL** — e.g. `https://exoduswcpredictor.pages.dev`. This is the
   OAuth2 redirect URI registered in the Discord Developer Portal.

### 2.4 Discord Developer Portal setup

- Redirect URIs to register:
  - Dev: `http://localhost:5173`
  - Production: `https://<your-deployed-url>`
- `DISCORD_CLIENT_ID`: `1517443293162504202`
- `DISCORD_CLIENT_SECRET`: from the Dev Portal (treat as a secret, never commit)

### 2.5 Cloudflare Worker changes

**File:** `workers/live-results/index.js`

New endpoints:

| Endpoint                      | Behavior                                                                                                        |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `GET /auth/discord`           | Returns the Discord OAuth2 authorize URL to redirect the user to                                                |
| `POST /auth/discord/exchange` | Exchanges the `code` for an access token, fetches identity + guild membership, upserts `users`, returns session |

Exchange endpoint logic:

1. `POST https://discord.com/api/oauth2/token` → access token
2. `GET https://discord.com/api/users/@me` → Discord profile (id, username,
   global_name, avatar hash)
3. `GET https://discord.com/api/users/@me/guilds/members/{guild_id}` → confirms
   membership, returns server nickname if set
4. If step 3 returns non-200 → respond `403` with a clear error code
   (`not_guild_member`) so the frontend can show a specific message
5. Upsert `users` row keyed by `discord_{discordId}` as `username`
6. Return session: `{ username, displayName, discordId, avatar, isAdmin }`

New secrets (`wrangler secret put ...`):

```bash
npx wrangler secret put DISCORD_CLIENT_ID
npx wrangler secret put DISCORD_CLIENT_SECRET
npx wrangler secret put DISCORD_GUILD_ID
npx wrangler secret put DISCORD_REDIRECT_URI
```

**Apply the GGO lesson here too:** if guild-membership verification or the token
exchange fails, log _why_ (expired code, wrong redirect URI, not a member, Discord
API error) rather than collapsing every failure into one generic "login failed" —
this exact category of silent failure is what cost the most debugging time in the
old project.

### 2.6 React app changes

**File:** `src/App.jsx`

- Add a Discord-branded "Login with Discord" button.
- On page load, check for `?code=` in the URL; if present, automatically POST it
  to `/auth/discord/exchange` and complete login — don't make the user click
  twice.
- Keep the existing username/secret-code form, but collapse it behind an "Admin
  Login" disclosure — it's only for the `admin` fallback account now.
- Header user pill: render the Discord avatar (`https://cdn.discordapp.com/avatars/{discordId}/{avatar}.png`)
  instead of initials when `discordId` is present; fall back to initials only for
  the legacy admin session.
- Display name resolution order: **server nickname → Discord global display name
  → Discord username.**
- Non-member error state: show a specific screen — _"You need to be a member of
  the Exodus Discord server to play. Join here, then try logging in again."_ —
  not a generic failure toast. This was one of the two open questions in the
  original plan; resolving it explicitly avoids a confusing dead-end for new users.

### 2.7 Admin panel changes

**File:** `public/admin.html`

- Remove the "Account Requests" section entirely — Discord membership is now the
  gate, so there's nothing to approve.
- Keep: Add Player (manual override only, e.g. for the admin fallback account),
  View Players, Score Sync trigger.
- Show Discord avatar + username next to each player row.

### 2.8 Admin flag resolution (second open question)

Decision: **keep `isAdmin` as a manual flag in the Supabase `users` table**, set
by hand for now, rather than deriving it from a Discord role. Simpler, matches
what already exists, and avoids a second dependency on Discord's role API. This
can be revisited later if role-based admin becomes worth the added complexity.

### 2.9 Verification plan

**Local:**

1. Register `http://localhost:5173` as a redirect URI in the Discord Dev Portal.
2. Run `npm run dev` and `npx wrangler dev` (worker on port 8787) side by side.
3. Click "Login with Discord" → authorize → confirm redirect back auto-completes
   login with correct avatar/displayName.
4. Test the non-member path with an account that isn't in the Exodus server —
   confirm the specific error screen appears, not a generic failure.

**Production:**

1. `npx wrangler deploy`.
2. Switch the registered redirect URI to the production URL.
3. Run the full flow end-to-end once with a real Discord account.
4. Confirm the admin fallback login (`admin` / `EXODUS2026`) still works
   independently of the Discord flow.

---

## 3. Summary checklist before shipping

- [ ] `apiFixtureId` persistence confirmed working (not just present in schema)
- [ ] `cleanTeamName()` tested against all 45 team names + normalised variants
- [ ] Unmatched sync results are logged/visible, not silent
- [ ] Leaderboard table never hand-edited directly
- [ ] RLS policies tested for anon read, authenticated write, service-role full access
- [ ] All result/score checks use explicit status + null checks, never truthy shortcuts
- [ ] `kickoffUTC` is the only timezone source of truth used in the UI
- [ ] Discord OAuth2 redirect URIs registered for both dev and prod
- [ ] Guild-membership failure shows a specific, actionable message
- [ ] Admin fallback login still functions after Discord login ships
