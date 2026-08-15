# Dandi Biyo (डण्डी बियो)

A 3D web game of the traditional Nepali game **Dandi Biyo**. Charge up, strike the biyo, and send it flying as far as you can.

Playable prototype live at the first milestone: click **PLAY**, enter the 3D field, strike the biyo, and see your distance and score.

## Tech Stack

- **React + TypeScript + Vite**
- **Three.js** via React Three Fiber, Drei, and Rapier (physics)
- **Tailwind CSS v4**
- **Zustand** (state) + mutable `runtime` singleton for per-frame physics data
- **Supabase** (auth, profiles, leaderboards — Phase 2+; gameplay is offline-first)
- **Oxlint** for linting

## Getting Started

Requires Node.js 20.19+.

```bash
npm install
npm run dev        # start the dev server
npm run build      # production build
npm run preview    # preview the production build
npx tsc -b         # typecheck
npx oxlint src     # lint
```

Open `http://localhost:5173`.

### Environment

Copy `.env.example` to `.env` and fill in Supabase values when backend features (Phase 2+) are wired. The game runs fully offline without them. Never commit `.env`.

## How to Play

- **Space** — hold to charge power, release to lift the biyo, press again to strike
- **Arrow keys** — aim (left/right) and adjust elevation (up/down)
- Timing matters: hit the center of the timing bar for a **PERFECT** strike

Modes: **Practice** (endless), **Single Player** vs AI (easy/medium/hard, 3/5/10 rounds). Local 2-player coming in Phase 1 polish.

## Project Structure

```
src/
  game/            # core gameplay (runtime, actions, biyoApi, state machine)
    world/         # 3D environment, ground
    biyo/ dandi/   # the biyo and dandi objects
    ai/            # difficulty-tuned AI controller
    physics/       # tunable gameplay constants
    scoring/       # distance/score calculation
    camera/        # camera rig
    aim/ distance/ # trajectory guide, distance marker
  scenes/          # menu + game scenes
  stores/          # zustand stores (game, settings, ui)
  components/      # UI: menu, HUD, result banner, pause, game over
  i18n/            # English + Nepali translations
  services/        # Supabase services (auth, profile, leaderboard, …)
  audio/           # procedural Web Audio
```

## Roadmap

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for the full phased plan:

1. **Phase 1** — Playable prototype (current)
2. **Phase 2** — Accounts, profiles & persistence
3. **Phase 3** — Leaderboards, achievements & statistics
4. **Phase 4** — Polish & launch
