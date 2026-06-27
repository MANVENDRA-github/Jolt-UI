import { gsap } from 'gsap';
import { splitTextSchema, type SplitTextProps } from '../schemas/split-text';
import { prefersReducedMotion } from '../motion';

/** Approximates the `--ease-jolt-out` design token; GSAP can't take a raw cubic-bezier without a plugin. */
const EASE = 'power3.out';

/** Selector for the segment spans the skins render. */
export const SEGMENT_SELECTOR = '[data-jolt-segment]';

export interface SplitTextController {
  /** Replay the animation from the start. */
  play(): void;
  /** Kill the animation and clear inline styles — call on unmount. */
  revert(): void;
}

/**
 * Animate the segment spans the skin has already rendered inside `container`.
 *
 * The skin owns rendering (idiomatic per framework); the core owns the motion
 * (written once). This is the anti-drift boundary: timing, staggering, and
 * cleanup live here, never in a skin. Props are validated at this boundary.
 */
export function createSplitText(
  container: HTMLElement,
  props: SplitTextProps,
): SplitTextController {
  const opts = splitTextSchema.parse(props);
  const segments = Array.from(
    container.querySelectorAll<HTMLElement>(SEGMENT_SELECTOR),
  );

  if (segments.length === 0) {
    return { play() {}, revert() {} };
  }

  if (prefersReducedMotion()) {
    gsap.set(segments, { opacity: 1, y: 0 });
    return {
      play() {},
      revert() {
        gsap.set(segments, { clearProps: 'all' });
      },
    };
  }

  const tween = gsap.fromTo(
    segments,
    { opacity: 0, y: opts.y },
    {
      opacity: 1,
      y: 0,
      duration: opts.duration,
      delay: opts.delay,
      stagger: opts.stagger,
      ease: EASE,
    },
  );

  return {
    play() {
      tween.restart(true);
    },
    revert() {
      tween.kill();
      gsap.set(segments, { clearProps: 'all' });
    },
  };
}
