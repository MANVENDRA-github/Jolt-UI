/**
 * Pure magnification math for the Dock — no DOM, no events. The imperative shell (`./dock.ts`)
 * feeds each item's center and the pointer position through this; keeping the curve here means
 * the React/Vue/Svelte skins share one implementation and it is unit-testable in jsdom.
 */

/**
 * The scale for a dock item whose center is `distance` pixels from the pointer. At the pointer
 * (`distance` 0) it reaches `maxScale`; at or beyond `range` it rests at `1`; between, it eases
 * on a raised cosine so the row swells smoothly rather than in a hard linear cone. A
 * non-positive `range` disables magnification (everything rests at 1) rather than dividing by 0.
 */
export function dockScale(distance: number, range: number, maxScale: number): number {
  if (range <= 0) return 1;
  const d = Math.min(Math.abs(distance), range);
  // Raised cosine: 1 at d=0, 0 at d=range, smooth (zero-slope) at both ends.
  const falloff = 0.5 + 0.5 * Math.cos((d / range) * Math.PI);
  return 1 + (maxScale - 1) * falloff;
}
