/**
 * Pure wave-displacement math — no Three.js, no DOM. The functional core of the Waves
 * background: given a plane vertex's (x, y) and a time, it returns the z-displacement,
 * and mutates a flat xyz buffer in place. Unit-testable in jsdom; the WebGL shell
 * (`./waves.ts`) only renders what this produces. Keep this file Three-free.
 */

export interface WaveParams {
  amplitude: number;
  frequency: number;
  speed: number;
}

/** Travelling-wave z-displacement for a vertex at (x, y) at time `t` (seconds). */
export function waveZ(
  x: number,
  y: number,
  t: number,
  { amplitude, frequency, speed }: WaveParams,
): number {
  return amplitude * Math.sin(x * frequency + t * speed) * Math.cos(y * frequency + t * speed);
}

/**
 * Displace the z of every vertex in a flat `[x,y,z, x,y,z, …]` buffer (a plane in the
 * XY plane) by `waveZ(x, y, t)`. Mutates in place (the render loop reuses one buffer);
 * x and y are left untouched.
 */
export function applyWaves(positions: Float32Array, t: number, params: WaveParams): void {
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 2] = waveZ(positions[i], positions[i + 1], t, params);
  }
}
