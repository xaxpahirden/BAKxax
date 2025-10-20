import type { Bird, World } from './types';
import { clamp } from './physics';

export const BIRD_RADIUS = 14;
export const GRAVITY = 1800; // px/s^2
export const FLAP_IMPULSE = -450; // px/s
export const ROTATE_UP = -0.35; // radians ceiling when flapping
export const ROTATE_DOWN_MAX = 1.2; // radians max tilt when falling

export function createBird(world: World): Bird {
  return {
    x: Math.round(world.width * 0.35),
    y: Math.round(world.height * 0.45),
    radius: BIRD_RADIUS,
    vy: 0,
    rotation: 0
  };
}

export function flap(bird: Bird) {
  bird.vy = FLAP_IMPULSE;
  bird.rotation = ROTATE_UP;
}

export function updateBird(bird: Bird, dt: number, world: World): void {
  bird.vy += GRAVITY * dt;
  bird.y += bird.vy * dt;

  // Rotation towards down as falling
  const target = bird.vy > 0 ? ROTATE_DOWN_MAX : ROTATE_UP;
  bird.rotation += (target - bird.rotation) * clamp(10 * dt, 0, 1);

  // Keep bird within top; ground collision handled elsewhere
  bird.y = clamp(bird.y, bird.radius, world.height - world.groundHeight - 0.001);
}

export function birdAABB(bird: Bird) {
  const size = bird.radius * 1.6; // broaden a bit to make game slightly harder
  return {
    x: bird.x - size / 2,
    y: bird.y - size / 2,
    w: size,
    h: size
  };
}
