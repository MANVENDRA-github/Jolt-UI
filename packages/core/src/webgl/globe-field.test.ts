import { describe, it, expect } from 'vitest';
import { generateSphere, pulseScale, applyPulse } from './globe-field';

describe('generateSphere', () => {
  it('returns count*3 floats', () => {
    expect(generateSphere(100, 2).length).toBe(300);
  });

  it('places every point on the sphere of the given radius', () => {
    const radius = 3;
    const g = generateSphere(200, radius);
    for (let i = 0; i < g.length; i += 3) {
      expect(Math.hypot(g[i], g[i + 1], g[i + 2])).toBeCloseTo(radius, 5);
    }
  });
});

describe('pulseScale', () => {
  it('is exactly 1 when the sine term is zero (t=0)', () => {
    expect(pulseScale(0, { amplitude: 0.2, frequency: 1 })).toBe(1);
  });

  it('never leaves [1-amplitude, 1+amplitude]', () => {
    const p = { amplitude: 0.15, frequency: 2 };
    for (let t = 0; t < 10; t += 0.3) {
      const s = pulseScale(t, p);
      expect(s).toBeGreaterThanOrEqual(1 - p.amplitude - 1e-9);
      expect(s).toBeLessThanOrEqual(1 + p.amplitude + 1e-9);
    }
  });
});

describe('applyPulse', () => {
  it('equals the base positions at t=0 and leaves base untouched', () => {
    const base = generateSphere(50, 2);
    const snapshot = Float32Array.from(base);
    const out = new Float32Array(base.length);
    applyPulse(out, base, 0, { amplitude: 0.2, frequency: 1 });
    for (let i = 0; i < base.length; i++) {
      expect(out[i]).toBeCloseTo(base[i], 6);
      expect(base[i]).toBe(snapshot[i]); // base never mutated
    }
  });

  it('scales every coordinate uniformly by the pulse', () => {
    const base = generateSphere(50, 2);
    const out = new Float32Array(base.length);
    const t = 0.5;
    const params = { amplitude: 0.3, frequency: 1 };
    applyPulse(out, base, t, params);
    const s = pulseScale(t, params);
    for (let i = 0; i < base.length; i++) expect(out[i]).toBeCloseTo(base[i] * s, 6);
  });
});
