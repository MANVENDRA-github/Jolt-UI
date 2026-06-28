import { describe, it, expect } from 'vitest';
import { waveZ, applyWaves } from './waves-field';

const P = { amplitude: 2, frequency: 0.5, speed: 1 };

describe('waveZ', () => {
  it('is zero at the origin at t=0 (sin(0)=0)', () => {
    expect(waveZ(0, 0, 0, P)).toBe(0);
  });

  it('never exceeds the amplitude', () => {
    for (let x = -10; x <= 10; x += 1.3) {
      for (let t = 0; t < 6; t += 0.7) {
        expect(Math.abs(waveZ(x, x * 0.5, t, P))).toBeLessThanOrEqual(P.amplitude + 1e-9);
      }
    }
  });

  it('evolves over time (not static)', () => {
    expect(waveZ(3, 1, 0, P)).not.toBeCloseTo(waveZ(3, 1, 1.5, P));
  });
});

describe('applyWaves', () => {
  it('writes z per vertex and leaves x and y untouched', () => {
    const pos = new Float32Array([4, 2, 99, -3, 1, 99]);
    applyWaves(pos, 0.5, P);
    expect(pos[0]).toBe(4);
    expect(pos[1]).toBe(2);
    expect(pos[2]).toBeCloseTo(waveZ(4, 2, 0.5, P));
    expect(pos[3]).toBe(-3);
    expect(pos[4]).toBe(1);
    expect(pos[5]).toBeCloseTo(waveZ(-3, 1, 0.5, P));
  });
});
