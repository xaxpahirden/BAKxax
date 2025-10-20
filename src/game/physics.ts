export function clamp(value: number, min: number, max: number): number {
  if (min > max) throw new Error('min must be <= max');
  return Math.max(min, Math.min(max, value));
}

// Axis-aligned bounding box intersection test
export function aabbIntersect(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}
