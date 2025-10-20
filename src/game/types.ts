export type GamePhase = 'menu' | 'playing' | 'gameover';

export interface Bird {
  x: number;
  y: number;
  radius: number;
  vy: number;
  rotation: number; // radians
}

export interface PipePair {
  x: number; // left position
  width: number;
  gapY: number; // center of gap
  gapHeight: number;
  passed: boolean; // whether score has been counted
}

export interface World {
  width: number;
  height: number;
  groundHeight: number;
}

export interface GameState {
  phase: GamePhase;
  paused: boolean;
  score: number;
  highScore: number;
  bird: Bird;
  pipes: PipePair[];
  timeSinceSpawn: number;
}
