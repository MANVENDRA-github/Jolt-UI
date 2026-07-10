import { dockScale } from './dock-math';

describe('dockScale', () => {
  it('reaches the full magnification at the pointer', () => {
    expect(dockScale(0, 120, 2)).toBeCloseTo(2, 10);
  });

  it('rests at 1 at and beyond the range', () => {
    expect(dockScale(120, 120, 2)).toBeCloseTo(1, 10);
    expect(dockScale(500, 120, 2)).toBeCloseTo(1, 10);
  });

  it('is symmetric — sign of the distance does not matter', () => {
    expect(dockScale(-40, 120, 2)).toBeCloseTo(dockScale(40, 120, 2), 10);
  });

  it('decreases monotonically from the pointer outward', () => {
    const near = dockScale(20, 120, 2);
    const mid = dockScale(60, 120, 2);
    const far = dockScale(100, 120, 2);
    expect(near).toBeGreaterThan(mid);
    expect(mid).toBeGreaterThan(far);
  });

  it('stays within [1, maxScale]', () => {
    for (const d of [0, 10, 45, 90, 120, 200]) {
      const s = dockScale(d, 120, 2.5);
      expect(s).toBeGreaterThanOrEqual(1);
      expect(s).toBeLessThanOrEqual(2.5);
    }
  });

  it('disables magnification for a non-positive range instead of dividing by zero', () => {
    expect(dockScale(0, 0, 2)).toBe(1);
    expect(dockScale(10, -5, 2)).toBe(1);
  });
});
