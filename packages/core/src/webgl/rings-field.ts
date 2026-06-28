/**
 * Pure concentric-ring math — no Three.js, no DOM. The functional core of the Rings
 * background: it lays out points on concentric rings in the XY plane, then counter-
 * rotates alternate rings (even +, odd −) and applies a gentle radial pulse. Unit-testable
 * in jsdom; the WebGL shell (`./rings.ts`) only renders what this produces. Keep this file
 * Three-free.
 */

export interface RingsParams {
  speed: number;
  amplitude: number;
  frequency: number;
  pointsPerRing: number;
}

/**
 * `ringCount` concentric rings in the XY plane (z = 0), each with `pointsPerRing` points;
 * ring `r` (0-based) sits at radius `(r + 1) * spacing`. Flat `[x,y,z, …]` buffer.
 */
export function generateRings(
  ringCount: number,
  pointsPerRing: number,
  spacing: number,
): Float32Array {
  const positions = new Float32Array(ringCount * pointsPerRing * 3);
  let i = 0;
  for (let r = 0; r < ringCount; r++) {
    const radius = (r + 1) * spacing;
    for (let p = 0; p < pointsPerRing; p++) {
      const a = (p / pointsPerRing) * Math.PI * 2;
      positions[i++] = Math.cos(a) * radius; // x
      positions[i++] = Math.sin(a) * radius; // y
      positions[i++] = 0; // z
    }
  }
  return positions;
}

/**
 * Counter-rotate alternate rings (even rings +, odd rings −) by `t·speed`, and scale each
 * ring's radius by a gentle pulse `1 + amplitude·sin(t·frequency + ring)`. Reads `base`,
 * writes `out` (same length); `base` is never mutated (the shell reuses one live buffer).
 */
export function applyRings(
  out: Float32Array,
  base: Float32Array,
  t: number,
  { speed, amplitude, frequency, pointsPerRing }: RingsParams,
): void {
  const pointCount = base.length / 3;
  for (let p = 0; p < pointCount; p++) {
    const ring = Math.floor(p / pointsPerRing);
    const dir = ring % 2 === 0 ? 1 : -1;
    const angle = t * speed * dir;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const scale = 1 + amplitude * Math.sin(t * frequency + ring);
    const i = p * 3;
    const x = base[i];
    const y = base[i + 1];
    out[i] = (x * cos - y * sin) * scale;
    out[i + 1] = (x * sin + y * cos) * scale;
    out[i + 2] = base[i + 2];
  }
}
