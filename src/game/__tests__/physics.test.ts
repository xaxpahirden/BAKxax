import { describe, it, expect } from 'vitest';
import { aabbIntersect, clamp } from '../physics';

describe('physics', () => {
  it('clamp works', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('aabbIntersect detects overlap', () => {
    // overlapping
    expect(aabbIntersect(0, 0, 10, 10, 5, 5, 10, 10)).toBe(true);
    // touching edges (should be false with < and > rules)
    expect(aabbIntersect(0, 0, 10, 10, 10, 0, 10, 10)).toBe(false);
    // separated
    expect(aabbIntersect(0, 0, 10, 10, 20, 20, 5, 5)).toBe(false);
  });
});
