# Dandi Biyo — Implementation Plan

A polished, production-ready 3D web game of **डण्डी बियो (Dandi Biyo)**, the traditional Nepali stick-and-spindle game. Built with React + TypeScript + Vite, Three.js (React Three Fiber / Drei / Rapier), Tailwind CSS, and a Supabase backend, deployed on Vercel.

Stack: GitHub (source) · Vercel (hosting) · Supabase (auth, profiles, leaderboards, statistics).

---

## Phase 1 — Playable Game Prototype (current)

**Milestone:** Open the local/Vercel site, click PLAY, enter the 3D field, strike the biyo, watch it fly, and see the distance and score.

| Area | Scope |
|------|-------|
| Gameplay | Charge → lift → timing-strike → flight → landing → distance + score |
| 3D world | Nepali field (mountains, trees, village, prayer flags), biyo + dandi, camera rig, trajectory guide, distance marker |
| Modes | Practice (endless), Single Player vs AI (3/5/10 rounds), Local 2-player (planned) |
| State | Zustand store + mutable `runtime` for per-frame physics data; strict phase state machine |
| Controls | Keyboard (arrows aim, Space charge/strike) + mouse/touch |
| i18n | English + Nepali via `t(key)` |
| Audio | Procedural Web Audio (no assets) |
| AI | Difficulty-tuned (easy/medium/hard) using the same action API as the player |
| Backend | None required — gameplay is offline-first; Supabase services stubbed |

**Status:** Mostly complete. Physics verified in headless Chrome (distance scales with power: ~20 m at 40% power, ~78 m at 100%). Outstanding: menu polish for local multiplayer, `IMPLEMENTATION_PLAN.md`/README docs, and the first git commit once a GitHub repo link is provided.

### Phase 1 exit criteria
- [x] `tsc -b`, `oxlint`, `npm run build` pass
- [x] Headless test: menu → PRACTICE → full strike loop → distance + score displayed
- [x] Headless test: Single Player vs AI alternates turns and rounds advance
- [ ] Deploy preview on Vercel
- [ ] Commit and push to GitHub

---

## Phase 2 — Accounts, Profiles & Persistence

**Milestone:** Sign in (Supabase Auth), see your stats, and sync across devices.

- Supabase Auth (email/password + Google OAuth) with proper RLS policies
- Profiles: display name, avatar, preferred language
- Match history and per-match detail (per-round results, quality breakdown)
- Client lib: `lib/supabase.ts` + services (`authService`, `profileService`) already scaffolded
- Security: never expose the service-role key; all client access via anon key + RLS
- Keep gameplay fully playable while signed out; sync locally-recorded matches on login

### Phase 2 exit criteria
- [ ] Sign up / sign in / sign out flows work in production
- [ ] RLS policies verified (users can only read/write their own data)
- [ ] Match results persist and appear on the profile
- [ ] Vercel + Supabase env vars wired via `.env` / Vercel dashboard

---

## Phase 3 — Leaderboards, Achievements & Statistics

**Milestone:** Compete globally and earn bragging rights.

- Global leaderboard (best single distance, total score, streak) with pagination + personal rank
- Friend leaderboard / follow system (stretch)
- Achievements: first PERFECT, 100m+ strike, 10 wins, perfect streak, etc.
- Statistics dashboard: distance distribution, average score, best streak, recent form
- Tabs on the menu: Play / Leaderboard / Achievements / Stats / Settings

### Phase 3 exit criteria
- [ ] Leaderboard renders with real seeded + user data
- [ ] Achievements unlock and show notifications in-game
- [ ] Statistics charts render from stored matches

---

## Phase 4 — Polish & Launch

- Visual polish: particles on strike/landing, better shadows, weather/lighting variety
- Sound design pass + mute persistence
- Accessibility: colorblind-safe timing cues, reduced-motion, controller support (stretch)
- Performance: dynamic import / code-splitting to slim the ~3.4 MB bundle, mobile perf pass
- SEO/meta, OG image, favicon, social share card
- Game balance tuning from real-play data

### Phase 4 exit criteria
- [ ] Lighthouse performance/accessibility/SEO ≥ 90 on Vercel
- [ ] Passes on desktop + mobile browsers (WebGL available)
- [ ] Community playtest with Nepali players; balance feedback incorporated

---

## Working conventions

- One git commit per completed phase item; no giant commits; never commit `.env`
- Gameplay must work offline; Supabase is optional and degrades gracefully
- No service-role keys on the client; RLS for all Supabase access
- Real-time physics state lives outside React renders (`runtime` + imperative meters)
- Decisions are made autonomously and documented here when significant
