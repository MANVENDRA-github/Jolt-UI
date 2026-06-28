import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  scrollVelocitySchema,
  type ScrollVelocityProps,
  type ScrollVelocityOptions,
} from '../schemas/scroll-velocity';
import { prefersReducedMotion } from '../motion';

// ScrollTrigger registration calls `window.matchMedia`, so it must run client-side
// only (jsdom/SSR lack it). Register lazily inside the factory, past the
// reduced-motion early-return — never in tests or on the server.
let registered = false;
function ensureScrollTrigger(): void {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

/** Selector for the moving track the skins render (the text repeated to fill the row). */
export const SCROLL_VELOCITY_TRACK = '[data-jolt-track]';

export interface ScrollVelocityController {
  /** Replay the marquee from the start. */
  play(): void;
  /** Kill the tween + ScrollTrigger and clear inline styles — call on unmount. */
  revert(): void;
}

/**
 * Drive the marquee track inside `el`: a seamless horizontal loop whose speed and
 * direction react to the page's scroll velocity. The skin owns rendering (the
 * repeated copies); the core owns the motion. Props are validated at this boundary.
 */
export function createScrollVelocity(
  el: HTMLElement,
  props: ScrollVelocityProps,
): ScrollVelocityController {
  const opts: ScrollVelocityOptions = scrollVelocitySchema.parse(props);
  const track = el.querySelector<HTMLElement>(SCROLL_VELOCITY_TRACK);

  if (!track || prefersReducedMotion()) {
    return { play() {}, revert() {} };
  }

  ensureScrollTrigger();

  // The track holds the text repeated an even number of times, so animating
  // xPercent 0 -> -50 loops seamlessly (the second half takes the first's place).
  const base = opts.direction === 'right' ? -1 : 1;
  const roll = gsap.fromTo(
    track,
    { xPercent: 0 },
    { xPercent: -50, ease: 'none', duration: 50 / opts.baseVelocity, repeat: -1 },
  );
  roll.timeScale(base);

  // Scroll velocity boosts the speed and flips direction with the scroll direction;
  // it eases back to the idle speed shortly after scrolling stops.
  let idle: gsap.core.Tween | null = null;
  const trigger = ScrollTrigger.create({
    onUpdate: (self) => {
      const v = self.getVelocity();
      const boost = 1 + Math.min(Math.abs(v) / 600, 6);
      const dir = v < 0 ? -base : base;
      gsap.to(roll, { timeScale: dir * boost, duration: 0.3, overwrite: true });
      idle?.kill();
      idle = gsap.to(roll, { timeScale: base, duration: 0.6, delay: 0.2, overwrite: true });
    },
  });

  return {
    play() {
      roll.restart(true);
      roll.timeScale(base);
    },
    revert() {
      idle?.kill();
      roll.kill();
      trigger.kill();
      gsap.set(track, { clearProps: 'all' });
    },
  };
}
