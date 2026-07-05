import { describe, expect, it } from 'vitest';
import { MAX_SPREAD, filamentOffsets, normalizePointer } from './volt-field-uniforms';

describe('filamentOffsets', () => {
  it('returns one merged current at split 0', () => {
    expect(filamentOffsets(0)).toEqual([0, 0, 0]);
  });

  it('returns three fully-parted streams at split 1', () => {
    const [lo, mid, hi] = filamentOffsets(1);
    expect(lo).toBeCloseTo(-MAX_SPREAD, 10);
    expect(mid).toBe(0);
    expect(hi).toBeCloseTo(MAX_SPREAD, 10);
  });

  it('is symmetric and monotonically parting in between', () => {
    let prev = 0;
    for (const split of [0.2, 0.4, 0.6, 0.8]) {
      const [lo, , hi] = filamentOffsets(split);
      expect(lo).toBeCloseTo(-hi, 10);
      expect(hi).toBeGreaterThan(prev);
      prev = hi;
    }
  });

  it('clamps split outside [0, 1]', () => {
    expect(filamentOffsets(-2)).toEqual(filamentOffsets(0));
    expect(filamentOffsets(5)).toEqual(filamentOffsets(1));
  });
});

describe('normalizePointer', () => {
  const rect = { left: 100, top: 50, width: 200, height: 100 };

  it('maps the rect center to (0, 0)', () => {
    expect(normalizePointer(200, 100, rect)).toEqual({ x: 0, y: 0 });
  });

  it('maps the corners to ±1', () => {
    expect(normalizePointer(100, 50, rect)).toEqual({ x: -1, y: -1 });
    expect(normalizePointer(300, 150, rect)).toEqual({ x: 1, y: 1 });
  });

  it('clamps positions outside the rect to the edge', () => {
    expect(normalizePointer(-500, 100, rect)).toEqual({ x: -1, y: 0 });
    expect(normalizePointer(200, 9999, rect)).toEqual({ x: 0, y: 1 });
  });

  it('yields the center for a degenerate rect (no NaN)', () => {
    expect(normalizePointer(10, 10, { left: 0, top: 0, width: 0, height: 0 })).toEqual({
      x: 0,
      y: 0,
    });
  });
});
