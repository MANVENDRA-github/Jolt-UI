/**
 * Pure decision logic for the scroll-reveal behavior — no DOM, no observers. The imperative
 * shell (`./reveal.ts`) supplies the live capabilities; keeping the decisions here means the
 * React/Vue/Svelte skins share one implementation and the whole surface is unit-testable.
 */

/** The environment facts that decide whether the reveal enhancement runs at all. */
export interface RevealCapabilities {
  hasWindow: boolean;
  hasObserver: boolean;
  reducedMotion: boolean;
}

/**
 * Whether to *arm* an element — that is, hide it and wait for it to scroll into view.
 *
 * The default is always "visible". Arming is a progressive enhancement, so it requires every
 * capability at once: a window (never during SSR), a real `IntersectionObserver` (without one
 * nothing would ever un-hide the element), and a user who has not asked for reduced motion.
 * Getting this backwards — hiding first and revealing on capability — is how a JS failure
 * turns into a permanently blank page.
 */
export function shouldArmReveal({
  hasWindow,
  hasObserver,
  reducedMotion,
}: RevealCapabilities): boolean {
  return hasWindow && hasObserver && !reducedMotion;
}

/**
 * The observer `rootMargin` that pulls the trigger line up from the bottom of the viewport by
 * `offset` percent, so an element reveals once it is meaningfully on screen rather than the
 * instant its first pixel appears. Clamped to `0..99`: a margin of `-100%` or worse would
 * collapse the root box and the element could never intersect.
 */
export function revealRootMargin(offset: number): string {
  const pct = Math.min(99, Math.max(0, Math.trunc(offset)));
  return `0px 0px ${pct === 0 ? '0' : `-${pct}`}% 0px`;
}
