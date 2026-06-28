/**
 * Pure dot-grid + ripple math — no Three.js, no DOM. The functional core of the Dots
 * background: it lays out a centered grid of points and computes each point's
 * z-displacement as a radial ripple. Unit-testable in jsdom; the WebGL shell
 * (`./dots.ts`) only renders what this produces. Keep this file Three-free.
 */

export interface RippleParams {
  amplitude: number;
  frequency: number;
  speed: number;
}

/** A centered `count × count` grid of points (xyz triplets) in the XY plane (z = 0). */
export function generateGrid(count: number, spacing: number): Float32Array {
  const positions = new Float32Array(count * count * 3);
  const offset = ((count - 1) * spacing) / 2;
  let i = 0;
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      positions[i++] = col * spacing - offset; // x
      positions[i++] = row * spacing - offset; // y
      positions[i++] = 0; // z
    }
  }
  return positions;
}

/** Radial-ripple z-displacement for a point at (x, y) at time `t` (seconds). */
export function rippleZ(
  x: number,
  y: number,
  t: number,
  { amplitude, frequency, speed }: RippleParams,
): number {
  const dist = Math.sqrt(x * x + y * y);
  return amplitude * Math.sin(dist * frequency - t * speed);
}

/** Displace the z of every point in a flat `[x,y,z, …]` buffer by `rippleZ`. Mutates in place. */
export function applyRipple(positions: Float32Array, t: number, params: RippleParams): void {
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 2] = rippleZ(positions[i], positions[i + 1], t, params);
  }
}
