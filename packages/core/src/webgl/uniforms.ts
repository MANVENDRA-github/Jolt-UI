/**
 * Pure prop→uniform resolution shared by every shader background — no Three.js, no DOM, no GPU.
 * Parses hex color stops to normalized RGB and packs exactly N of them (a shader's fixed-size
 * `uColors` array) into a flat Float32Array. Unit-testable in jsdom; each WebGL shell
 * (`./aurora.ts`, `./silk.ts`, `./iridescence.ts`, `./light-rays.ts`) feeds the result into its
 * uniforms. Keep this file Three-free.
 *
 * D-033 established that a shader's "functional core" is exactly this resolution step (its GLSL
 * cannot run in jsdom and is proven by live verification instead). It was `aurora-field.ts` when
 * one shader needed it; four shaders resolve the same thing, so it is one shared module (D-046).
 *
 * Shader `colors` are hex-only — a fragment shader needs numeric RGB, not `rebeccapurple`.
 */

const WHITE: [number, number, number] = [1, 1, 1];

/**
 * Degrees to radians for an angle uniform. A non-finite angle collapses to `0` rather than
 * reaching the GPU: a NaN uniform silently blanks the whole draw with no console error, which
 * would look exactly like a shader that failed to compile.
 */
export function degreesToRadians(degrees: number): number {
  return Number.isFinite(degrees) ? (degrees * Math.PI) / 180 : 0;
}

/** Parse a `#rgb` / `#rrggbb` hex string (the `#` is optional) to normalized `[r,g,b]` in 0..1; malformed input → white. */
export function hexToRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return [...WHITE];
  const n = parseInt(h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/**
 * Pack color stops into a flat `[r,g,b, …]` Float32Array of exactly `count` triples for the
 * shader's `uColors[count]`: pads by repeating the last stop when fewer, truncates when more,
 * and falls back to white for an empty list. The shell builds `THREE.Vector3`s from this once.
 */
export function packColorStops(colors: string[], count = 3): Float32Array {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const src = colors.length ? colors[Math.min(i, colors.length - 1)] : '#ffffff';
    const [r, g, b] = hexToRgb(src);
    out[i * 3] = r;
    out[i * 3 + 1] = g;
    out[i * 3 + 2] = b;
  }
  return out;
}
