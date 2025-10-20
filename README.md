# Flappy Bird (React + TypeScript + Vite)

A minimalist Flappy Bird-style browser game implemented with React + TypeScript using Vite. Rendering uses Canvas 2D and a simple requestAnimationFrame-based loop.

## Features

- DevicePixelRatio-aware canvas for crisp visuals on mobile/retina
- Keyboard and touch controls
  - Space / ArrowUp / W to flap
  - P to pause
  - R to restart
  - Tap/click anywhere to flap
- Bird physics (gravity + flap impulse + rotation)
- Pipes spawning at intervals with randomized vertical gap
- Collision detection (AABB) against pipes and ground
- Start menu, in-game HUD, and game over screen with final score and retry
- High score saved in localStorage
- Simple synthesized audio (flap, score, hit) with mute toggle (initially muted, enabled on first interaction)
- ESLint + Prettier + strict TypeScript
- Small unit tests for utility functions (AABB collision, RNG)

## Getting started

Requirements: Node.js 18+ (Node 20 recommended) and npm

```bash
npm install
npm run dev
```

Open http://localhost:5173 to play locally. Click/tap or press Space/Up/W to flap.

### Build

```bash
npm run build
npm run preview
```

### Quality

```bash
npm run lint
npm run typecheck
npm test
```

## Project structure

```
src/
  main.tsx
  App.tsx
  game/
    loop.ts        # requestAnimationFrame loop with dt
    types.ts
    bird.ts
    pipes.ts
    physics.ts     # clamp, AABB
    rng.ts         # seedable RNG used in tests
  canvas/
    renderer.ts    # drawing helpers (background, ground, bird, pipes)
  ui/
    StartScreen.tsx
    GameOver.tsx
    HUD.tsx
    MuteToggle.tsx
```

## Deployment (GitHub Pages)

This repository includes a GitHub Actions workflow that runs lint/typecheck/tests on push/PR, and another workflow that builds and deploys the app to GitHub Pages (branch `gh-pages`). The build step passes the correct base path for Pages, so the app can be served from `https://<user>.github.io/<repo>/`.

If you fork/rename the repository, ensure GitHub Pages is enabled for the repository (Build and deployment: GitHub Actions).

## License

MIT
