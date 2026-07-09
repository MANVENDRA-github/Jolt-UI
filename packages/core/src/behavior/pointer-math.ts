/**
 * Pure pointer-to-CSS math for the Card components — no DOM, no events. The imperative
 * shell (`./pointer.ts`) feeds a real `pointermove` through these; keeping the math here
 * means the React/Vue/Svelte skins share one implementation and cannot drift, and the
 * whole surface is unit-testable in jsdom (callers pass a plain rect, not a live element).
 */

/** A pointer position normalized to a rect: `x`/`y` in `0..1`, origin top-left. */
export interface PointerFraction {
  x: number;
  y: number;
}

const clamp01 = (n: number): number => (n < 0 ? 0 : n > 1 ? 1 : n);

/**
 * Map a `clientX`/`clientY` against an element rect to a clamped `0..1` fraction.
 * Divides by `width`/`height` guarded with `|| 1` so a zero-sized rect never yields NaN.
 */
export function pointerFraction(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number },
): PointerFraction {
  return {
    x: clamp01((clientX - rect.left) / (rect.width || 1)),
    y: clamp01((clientY - rect.top) / (rect.height || 1)),
  };
}

/**
 * Tilt rotation (degrees) from a `0..1` fraction. The center `(0.5, 0.5)` is flat `(0, 0)`;
 * each axis reaches `±max` at the edges. `rotateX` is inverted relative to `y` so the edge
 * nearest the pointer lifts toward the viewer (pointer at the top → the top tilts back).
 */
export function tiltRotation(
  f: PointerFraction,
  max: number,
): { rotateX: number; rotateY: number } {
  return {
    // `(0.5 - y)` rather than `-(y - 0.5)` so the center is +0 (not -0 → a stray "-0deg").
    rotateX: (0.5 - f.y) * 2 * max,
    rotateY: (f.x - 0.5) * 2 * max,
  };
}

/**
 * Magnet displacement from a `0..1` fraction: a signed `-1..1` pull toward the pointer, `(0, 0)`
 * at the center. This is a *fraction*, not pixels — the stylesheet multiplies it by the
 * component's `--jolt-strength`, so the travel distance stays a CSS concern and the behavior
 * needs no per-component argument (contrast `tiltRotation`, whose cap is a rotation in degrees
 * and has no useful CSS unit to be scaled by).
 */
export function magnetOffset(f: PointerFraction): { x: number; y: number } {
  return {
    x: (f.x - 0.5) * 2,
    y: (f.y - 0.5) * 2,
  };
}
