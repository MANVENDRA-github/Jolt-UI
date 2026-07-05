/**
 * Pure progress mapping for the landing scroll story (node-tested; no DOM/GSAP).
 * One ScrollTrigger spans the whole scene track — hero plus split story — and
 * feeds its raw progress through these maps.
 */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Smoothstep — the same easing family the scene's filament split uses. */
const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * Split progress for the volt-field: 0 across the hero portion of the track,
 * then eased 0 → 1 across the split-story segment.
 */
export function splitProgress(trackProgress: number, heroPortion: number): number {
  const p = clamp01(trackProgress);
  if (p <= heroPortion) return 0;
  return smooth((p - heroPortion) / (1 - heroPortion));
}

/** Which story beat is active: the split-story segment divided into thirds. */
export function activeBeat(trackProgress: number, heroPortion: number): 0 | 1 | 2 {
  const p = clamp01(trackProgress);
  if (p <= heroPortion) return 0;
  const seg = (p - heroPortion) / (1 - heroPortion);
  if (seg < 1 / 3) return 0;
  if (seg < 2 / 3) return 1;
  return 2;
}
