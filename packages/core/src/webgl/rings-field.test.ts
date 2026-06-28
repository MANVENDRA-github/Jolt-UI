import { describe, it, expect } from 'vitest';
import { generateRings, applyRings } from './rings-field';

describe('generateRings', () => {
  it('returns ringCount*pointsPerRing*3 floats, all z = 0', () => {
    const g = generateRings(4, 16, 0.8);
    expect(g.length).toBe(4 * 16 * 3);
    for (let i = 2; i < g.length; i += 3) expect(g[i]).toBe(0);
  });

  it('puts ring r at radius (r+1)*spacing', () => {
    const spacing = 0.8;
    const pointsPerRing = 12;
    const g = generateRings(5, pointsPerRing, spacing);
    for (let r = 0; r < 5; r++) {
      const i = r * pointsPerRing * 3; // first point of ring r
      expect(Math.hypot(g[i], g[i + 1])).toBeCloseTo((r + 1) * spacing, 6);
    }
  });
});

describe('applyRings', () => {
  const pointsPerRing = 8;
  const base = generateRings(3, pointsPerRing, 1);
  const angleOf = (buf: Float32Array, p: number) => Math.atan2(buf[p * 3 + 1], buf[p * 3]);

  it('preserves each ring radius under pure rotation (amplitude 0)', () => {
    const out = new Float32Array(base.length);
    applyRings(out, base, 1.3, { speed: 0.7, amplitude: 0, frequency: 1, pointsPerRing });
    for (let p = 0; p < base.length / 3; p++) {
      const i = p * 3;
      expect(Math.hypot(out[i], out[i + 1])).toBeCloseTo(Math.hypot(base[i], base[i + 1]), 5);
    }
  });

  it('counter-rotates alternate rings (ring 0 + vs ring 1 −)', () => {
    const out = new Float32Array(base.length);
    const t = 0.5;
    const speed = 1;
    applyRings(out, base, t, { speed, amplitude: 0, frequency: 1, pointsPerRing });
    expect(angleOf(out, 0) - angleOf(base, 0)).toBeCloseTo(t * speed, 5); // ring 0: +θ
    expect(angleOf(out, pointsPerRing) - angleOf(base, pointsPerRing)).toBeCloseTo(-t * speed, 5); // ring 1: −θ
  });

  it('pulses radius outward when not rotating (speed 0)', () => {
    const out = new Float32Array(base.length);
    const t = 0.5;
    const params = { speed: 0, amplitude: 0.25, frequency: 1, pointsPerRing };
    applyRings(out, base, t, params);
    for (let p = 0; p < base.length / 3; p++) {
      const i = p * 3;
      const ring = Math.floor(p / pointsPerRing);
      const scale = 1 + params.amplitude * Math.sin(t * params.frequency + ring);
      expect(Math.hypot(out[i], out[i + 1])).toBeCloseTo(
        Math.hypot(base[i], base[i + 1]) * scale,
        5,
      );
    }
  });

  it('leaves base untouched', () => {
    const snapshot = Float32Array.from(base);
    const out = new Float32Array(base.length);
    applyRings(out, base, 0.9, { speed: 1, amplitude: 0.3, frequency: 2, pointsPerRing });
    for (let i = 0; i < base.length; i++) expect(base[i]).toBe(snapshot[i]);
  });
});
