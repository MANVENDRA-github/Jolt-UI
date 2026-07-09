/**
 * The scroll-reveal imperative shell. A skin mounts a container and calls `observeReveal(el)`;
 * the element is *armed* (hidden by the shared stylesheet's `[data-jolt-armed]` rule) and
 * un-armed the moment it scrolls into view, so the CSS transition plays as an entrance.
 *
 * The default state is visible. Arming only happens when every capability lines up (see
 * `shouldArmReveal`), so SSR output, a missing `IntersectionObserver`, and a reduced-motion
 * user all render the content immediately — a JS failure can never blank the page.
 *
 * This is the shipped, per-element counterpart to the site's own chrome reveal
 * (`apps/site/src/lib/reveal.ts`), which sweeps `document` for `[data-reveal]` and only arms
 * below-fold elements. A consumer drops this component anywhere, so it observes exactly the
 * one element it was handed.
 */
import { prefersReducedMotion } from '../motion';
import { revealRootMargin, shouldArmReveal } from './reveal-math';

export interface RevealController {
  /** Stop observing and drop the hidden state — call on unmount. */
  revert(): void;
}

/** Returned when the enhancement doesn't run (SSR, no observer, reduced motion). */
const NOOP: RevealController = { revert() {} };

/** The attribute the shared stylesheet keys its hidden state on. */
const ARMED = 'data-jolt-armed';

export interface RevealOptions {
  /** Percent of the viewport height to pull the trigger line up from the bottom. */
  offset?: number;
}

/**
 * Hide `el` until it scrolls into view, then reveal it. Returns a controller whose `revert()`
 * disconnects the observer and clears the hidden state.
 */
export function observeReveal(
  el: HTMLElement,
  { offset = 12 }: RevealOptions = {},
): RevealController {
  const hasWindow = typeof window !== 'undefined';
  const arm = shouldArmReveal({
    hasWindow,
    hasObserver: hasWindow && typeof window.IntersectionObserver === 'function',
    reducedMotion: hasWindow && prefersReducedMotion(),
  });
  if (!arm) return NOOP;

  el.setAttribute(ARMED, '');

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.removeAttribute(ARMED);
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: revealRootMargin(offset) },
  );
  observer.observe(el);

  return {
    revert() {
      observer.disconnect();
      el.removeAttribute(ARMED);
    },
  };
}
