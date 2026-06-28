import { describe, it, expect } from 'vitest';
import { generateField, advanceDrift } from './particles-field';

describe('generateField', () => {
  it('returns count*3 floats (xyz per point)', () => {
    expect(generateField(800, 10).length).toBe(2400);
  });

  it('keeps every coordinate within ±spread', () => {
    const spread = 5;
    for (const v of generateField(500, spread)) {
      expect(Math.abs(v)).toBeLessThanOrEqual(spread);
    }
  });

  it('is deterministic given a seeded rng', () => {
    const seeded = () => 0.5; // (0.5*2-1)*spread = 0
    const a = generateField(3, 4, seeded);
    const b = generateField(3, 4, seeded);
    expect(Array.from(a)).toEqual(Array.from(b));
    expect(Array.from(a)).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });
});

describe('advanceDrift', () => {
  it('moves points along y by speed*dt, leaving x and z untouched', () => {
    const pos = new Float32Array([0, 0, 0]);
    advanceDrift(pos, 1, 2, 10);
    expect(pos[1]).toBeCloseTo(2);
    expect(pos[0]).toBe(0);
    expect(pos[2]).toBe(0);
  });

  it('wraps y within the field for a seamless loop', () => {
    const spread = 10;
    const pos = new Float32Array([0, 9.9, 0]);
    advanceDrift(pos, 1, 1, spread); // 10.9 -> 10.9 - 20 = -9.1
    expect(pos[1]).toBeCloseTo(-9.1);
    expect(Math.abs(pos[1])).toBeLessThanOrEqual(spread);
  });
});
