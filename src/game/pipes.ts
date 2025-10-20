import type { PipePair, World, Bird } from './types';
import { aabbIntersect } from './physics';
import { birdAABB } from './bird';

export const PIPE_WIDTH = 64;
export const PIPE_GAP = 160;
export const PIPE_MIN_Y = 100;
export const PIPE_MAX_Y = 400;
export const PIPE_SPEED = 200; // px/s to left
export const PIPE_SPAWN_INTERVAL = 1.2; // seconds

export function createPipe(world: World, gapY: number): PipePair {
  return {
    x: world.width + 20,
    width: PIPE_WIDTH,
    gapY,
    gapHeight: PIPE_GAP,
    passed: false
  };
}

export function updatePipes(pipes: PipePair[], dt: number) {
  for (const p of pipes) {
    p.x -= PIPE_SPEED * dt;
  }
}

export function cullPipes(pipes: PipePair[], world: World) {
  // remove offscreen to the left
  return pipes.filter((p) => p.x + p.width > -50);
}

export function checkPipeCollisions(pipes: PipePair[], bird: Bird, world: World): boolean {
  const bb = birdAABB(bird);
  for (const p of pipes) {
    const topRect = { x: p.x, y: 0, w: p.width, h: p.gapY - p.gapHeight / 2 };
    const bottomRect = {
      x: p.x,
      y: p.gapY + p.gapHeight / 2,
      w: p.width,
      h: world.height - (p.gapY + p.gapHeight / 2) - world.groundHeight
    };
    if (
      aabbIntersect(bb.x, bb.y, bb.w, bb.h, topRect.x, topRect.y, topRect.w, topRect.h) ||
      aabbIntersect(bb.x, bb.y, bb.w, bb.h, bottomRect.x, bottomRect.y, bottomRect.w, bottomRect.h)
    ) {
      return true;
    }
  }
  return false;
}

export function updateScore(pipes: PipePair[], bird: Bird, currentScore: number): number {
  let score = currentScore;
  for (const p of pipes) {
    if (!p.passed && p.x + p.width < bird.x) {
      p.passed = true;
      score += 1;
    }
  }
  return score;
}
