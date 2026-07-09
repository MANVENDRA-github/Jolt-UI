/**
 * Pure geometry for the click-spark behavior — no DOM. The imperative shell (`./spark.ts`)
 * turns each ray into a `<span>` carrying its direction as CSS custom properties, so the
 * animation itself is a stylesheet and the math is unit-testable.
 */

/** A unit vector, in screen coordinates (`dy` grows downward). */
export interface SparkRay {
  dx: number;
  dy: number;
}

/**
 * `count` unit vectors evenly spaced around a circle, starting at 3 o'clock and walking
 * clockwise on screen. A non-positive count yields no rays rather than throwing — a burst of
 * nothing is a perfectly good burst.
 */
export function sparkRays(count: number): SparkRay[] {
  const n = Math.trunc(count);
  if (n <= 0) return [];
  const step = (2 * Math.PI) / n;
  return Array.from({ length: n }, (_, i) => ({
    dx: Math.cos(i * step),
    dy: Math.sin(i * step),
  }));
}
