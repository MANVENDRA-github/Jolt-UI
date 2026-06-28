import { describe, it, expect } from 'vitest';
import { generateGrid, rippleZ, applyRipple } from './dots-field';

const P = { amplitude: 2, frequency: 0.5, speed: 1 };

describe('generateGrid', () => {
  it('returns count*count*3 floats with z = 0', () => {
    const g = generateGrid(4, 1);
    expect(g.length).toBe(48);
    for (let i = 2; i < g.length; i += 3) expect(g[i]).toBe(0);
  });

  it('is centered on the origin', () => {
    const g = generateGrid(5, 1);
    let sumX = 0;
    for (let i = 0; i < g.length; i += 3) sumX += g[i];
    expect(sumX).toBeCloseTo(0);
  });
});

describe('rippleZ', () => {
  it('is zero at the origin at t=0 (dist=0, sin(0)=0)', () => {
    expect(rippleZ(0, 0, 0, P)).toBe(0);
  });

  it('never exceeds the amplitude', () => {
    for (let x = -8; x <= 8; x += 1.1) {
      expect(Math.abs(rippleZ(x, x * 0.5, 2.2, P))).toBeLessThanOrEqual(P.amplitude + 1e-9);
    }
  });
});

describe('applyRipple', () => {
  it('writes z per point and leaves x and y untouched', () => {
    const pos = new Float32Array([3, 4, 99]);
    applyRipple(pos, 0.5, P);
    expect(pos[0]).toBe(3);
    expect(pos[1]).toBe(4);
    expect(pos[2]).toBeCloseTo(rippleZ(3, 4, 0.5, P));
  });
});
