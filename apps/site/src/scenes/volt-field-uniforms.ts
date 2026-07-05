/**
 * Pure math for the volt-field scene (the functional core — see the webgl
 * `*-field.ts` convention in @jolt/core). Everything here is DOM- and Three-free
 * so it runs under the site's node-env vitest project.
 */

/** How far (in uv units) the outer filaments spread from center at full split. */
export const MAX_SPREAD = 0.18;

export interface DOMRectLike {
  left: number;
  top: number;
  width: number;
  height: number;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Smoothstep — eases the split so the filaments part gently, not linearly. */
const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * Vertical center offsets of the three filaments for a split progress in [0, 1].
 * 0 → one merged current ([0, 0, 0]); 1 → three parted streams ([-MAX_SPREAD, 0, MAX_SPREAD]).
 * Input outside [0, 1] clamps.
 */
export function filamentOffsets(split: number): [number, number, number] {
  const spread = MAX_SPREAD * smooth(clamp01(split));
  return [spread > 0 ? -spread : 0, 0, spread];
}

/**
 * Normalize a client-space pointer position into [-1, 1] on both axes relative to
 * `rect` (x right, y down — the shader flips to uv space). Positions outside the
 * rect clamp to the edge; a degenerate rect yields the center (0, 0).
 */
export function normalizePointer(
  clientX: number,
  clientY: number,
  rect: DOMRectLike,
): { x: number; y: number } {
  if (rect.width <= 0 || rect.height <= 0) return { x: 0, y: 0 };
  const x = clamp01((clientX - rect.left) / rect.width) * 2 - 1;
  const y = clamp01((clientY - rect.top) / rect.height) * 2 - 1;
  return { x, y };
}
