/**
 * Pure color-uniform resolution for the Aurora shader — no Three.js, no DOM, no GPU.
 * Parses hex color stops to normalized RGB and packs exactly N of them (the shader's
 * fixed-size `uColors` array) into a flat Float32Array. Unit-testable in jsdom; the WebGL
 * shell (`./aurora.ts`) feeds the result into the shader uniform. Keep this file Three-free.
 *
 * Aurora's `colors` are hex-only (the fragment shader needs numeric RGB) — see DECISIONS D-033.
 */

const WHITE: [number, number, number] = [1, 1, 1];

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
