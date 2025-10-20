import { describe, it, expect } from 'vitest';
import { createRng, randRange } from '../rng';

describe('rng', () => {
  it('produces deterministic sequence for same seed', () => {
    const a = createRng(12345);
    const b = createRng(12345);
    for (let i = 0; i < 10; i++) {
      expect(a()).toBeCloseTo(b(), 10);
    }
  });

  it('randRange produces numbers in range', () => {
    const rng = createRng(1);
    for (let i = 0; i < 100; i++) {
      const v = randRange(rng, -5, 5);
      expect(v).toBeGreaterThanOrEqual(-5);
      expect(v).toBeLessThanOrEqual(5);
    }
  });
});
