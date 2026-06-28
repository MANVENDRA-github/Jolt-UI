/**
 * Pure particle-field math — no Three.js, no DOM. The functional core of the
 * Particles background: it generates the point cloud and advances its drift each
 * frame, so the motion is unit-testable in jsdom while the imperative WebGL shell
 * (`./particles.ts`) only renders what these produce. Keep this file Three-free —
 * it's bundled into every Particles install but must never pull `three`.
 */

/** Fill an xyz buffer with `count` points uniformly spread in a cube of side `2*spread`. */
export function generateField(
  count: number,
  spread: number,
  rng: () => number = Math.random,
): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < positions.length; i++) {
    positions[i] = (rng() * 2 - 1) * spread;
  }
  return positions;
}

/**
 * Advance each point's y by `speed * dt`, wrapping within [-spread, spread] so the
 * field loops seamlessly. Mutates `positions` in place (the render loop reuses one
 * buffer). `dt` is seconds.
 */
export function advanceDrift(
  positions: Float32Array,
  dt: number,
  speed: number,
  spread: number,
): void {
  const step = speed * dt;
  const span = spread * 2;
  for (let i = 1; i < positions.length; i += 3) {
    let y = positions[i] + step;
    if (y > spread) y -= span;
    positions[i] = y;
  }
}
