/**
 * Pure sphere-point + breathing math — no Three.js, no DOM. The functional core of the
 * Globe background: it spreads points evenly over a sphere (Fibonacci spiral) and scales
 * them radially by a time-driven "breathing" pulse. Unit-testable in jsdom; the WebGL
 * shell (`./globe.ts`) only renders what this produces (and spins the whole mesh). Keep
 * this file Three-free.
 */

export interface PulseParams {
  amplitude: number;
  frequency: number;
}

/**
 * `count` points spread evenly over a sphere of radius `radius`, as `[x,y,z, …]` triplets,
 * via the Fibonacci-sphere distribution (golden-angle spiral) — no clustering at the poles.
 */
export function generateSphere(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5)); // golden angle (radians)
  for (let i = 0; i < count; i++) {
    const y = count === 1 ? 0 : 1 - (i / (count - 1)) * 2; // walk 1 → -1
    const ring = Math.sqrt(Math.max(0, 1 - y * y)); // ring radius at height y
    const theta = golden * i;
    positions[i * 3] = Math.cos(theta) * ring * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * ring * radius;
  }
  return positions;
}

/** Uniform breathing scale at time `t` (seconds): `1 + amplitude·sin(t·frequency)`. */
export function pulseScale(t: number, { amplitude, frequency }: PulseParams): number {
  return 1 + amplitude * Math.sin(t * frequency);
}

/**
 * Scale every coordinate of `base` by the breathing pulse, writing into `out` (same
 * length). `base` (the rest-state sphere) is read-only, so the pulse can't accumulate
 * frame-to-frame — the shell keeps `base` and reuses `out` as the live buffer.
 */
export function applyPulse(
  out: Float32Array,
  base: Float32Array,
  t: number,
  params: PulseParams,
): void {
  const s = pulseScale(t, params);
  for (let i = 0; i < base.length; i++) out[i] = base[i] * s;
}
