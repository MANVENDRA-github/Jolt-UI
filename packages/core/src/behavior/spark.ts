/**
 * The click-spark imperative shell. A skin mounts a container and calls `attachClickSpark(el)`;
 * every click appends a short-lived burst of `<span>` rays at the click point, each carrying
 * its direction as CSS custom properties that the shared stylesheet animates outward.
 *
 * Deliberately DOM + CSS, not a `<canvas>` + `requestAnimationFrame` loop: no new dependency,
 * nothing to draw per frame, and the parity harness's animation freeze collapses a keyframe to
 * a deterministic end-state (D-015) where a RAF loop would keep painting. The rays carry no
 * text, so a container's slotted-child-text parity check is unaffected.
 *
 * SSR-safe (no `window` → no-op) and, under reduced motion, attaches no listener at all.
 */
import { prefersReducedMotion } from '../motion';
import { sparkRays } from './spark-math';

export interface SparkController {
  /** Remove the click listener and any burst still in flight — call on unmount. */
  revert(): void;
}

/** Returned when there's nothing to attach (SSR, or reduced motion) — a safe no-op. */
const NOOP: SparkController = { revert() {} };

/** The burst container's class; the shared stylesheet animates its ray children. */
export const SPARK_BURST_CLASS = 'jolt-spark-burst';

export interface SparkOptions {
  /** How many rays fly out of each click. */
  count?: number;
}

/**
 * Emit a spark burst from every click on `el`. Returns a controller whose `revert()` detaches
 * the listener and removes any burst still animating.
 */
export function attachClickSpark(
  el: HTMLElement,
  { count = 8 }: SparkOptions = {},
): SparkController {
  if (typeof window === 'undefined') return NOOP;
  if (prefersReducedMotion()) return NOOP;

  const onClick = (event: MouseEvent): void => {
    const rect = el.getBoundingClientRect();
    const burst = document.createElement('span');
    burst.className = SPARK_BURST_CLASS;
    // The burst is pure decoration; it must never reach the accessibility tree, and it must
    // never contribute text (a CONTAINER parity check reads the card root's textContent).
    burst.setAttribute('aria-hidden', 'true');
    burst.style.left = `${event.clientX - rect.left}px`;
    burst.style.top = `${event.clientY - rect.top}px`;

    for (const { dx, dy } of sparkRays(count)) {
      const ray = document.createElement('span');
      ray.style.setProperty('--jolt-dx', String(dx));
      ray.style.setProperty('--jolt-dy', String(dy));
      burst.appendChild(ray);
    }

    // Every ray shares one duration, so the first `animationend` to bubble up means they're
    // all done. `once` keeps the listener from outliving the node it cleans up.
    burst.addEventListener('animationend', () => burst.remove(), { once: true });
    el.appendChild(burst);
  };

  el.addEventListener('click', onClick);

  return {
    revert() {
      el.removeEventListener('click', onClick);
      for (const burst of el.querySelectorAll(`.${SPARK_BURST_CLASS}`)) burst.remove();
    },
  };
}
