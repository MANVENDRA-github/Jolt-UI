import { gsap } from 'gsap';
import { countUpSchema, type CountUpProps, type CountUpOptions } from '../schemas/count-up';
import { prefersReducedMotion } from '../motion';

/** Decelerating ease for the count. */
const EASE = 'power1.out';

/** Format a number with fixed decimals and an optional thousands separator. Pure. */
export function formatNumber(
  value: number,
  opts: { decimals?: number; separator?: string },
): string {
  const decimals = opts.decimals ?? 0;
  const separator = opts.separator ?? '';
  const fixed = value.toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');
  const grouped = separator ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator) : intPart;
  return decPart ? `${grouped}.${decPart}` : grouped;
}

export interface CountUpController {
  /** Replay the count from the start. */
  play(): void;
  /** Kill the tween and show the final value — call on unmount. */
  revert(): void;
}

/**
 * Tween a number from `from` to `to`, writing the formatted value into `el`.
 * The skin owns rendering (idiomatic per framework); the core owns the motion
 * (written once). Props are validated at this boundary.
 */
export function createCountUp(el: HTMLElement, props: CountUpProps): CountUpController {
  const opts: CountUpOptions = countUpSchema.parse(props);
  const render = (value: number) => {
    el.textContent = formatNumber(value, opts);
  };

  if (prefersReducedMotion()) {
    render(opts.to);
    return { play() {}, revert() {} };
  }

  const state = { value: opts.from };
  render(opts.from);
  const tween = gsap.to(state, {
    value: opts.to,
    duration: opts.duration,
    delay: opts.delay,
    ease: EASE,
    onUpdate() {
      render(state.value);
    },
    onComplete() {
      render(opts.to);
    },
  });

  return {
    play() {
      state.value = opts.from;
      tween.restart(true);
    },
    revert() {
      tween.kill();
      render(opts.to);
    },
  };
}
