import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { scrambleSchema, type ScrambleProps, type ScrambleOptions } from '../schemas/scramble';
import { prefersReducedMotion } from '../motion';

// Register once at module load. Co-located here (not in motion.ts) so the plugin
// only loads with Scramble — SplitText and the other components don't pull it in.
gsap.registerPlugin(ScrambleTextPlugin);

export interface ScrambleController {
  /** Replay the decode from the start. */
  play(): void;
  /** Kill the tween and show the final text — call on unmount. */
  revert(): void;
}

/**
 * Decode `el`'s text into `text` via GSAP's ScrambleTextPlugin. The skin owns
 * rendering (idiomatic per framework); the core owns the motion (written once).
 * Props are validated at this boundary.
 */
export function createScramble(el: HTMLElement, props: ScrambleProps): ScrambleController {
  const opts: ScrambleOptions = scrambleSchema.parse(props);

  if (prefersReducedMotion()) {
    el.textContent = opts.text;
    return { play() {}, revert() {} };
  }

  const tween = gsap.to(el, {
    duration: opts.duration,
    delay: opts.delay,
    ease: 'none',
    scrambleText: {
      text: opts.text,
      chars: opts.chars,
      speed: opts.speed,
      revealDelay: opts.revealDelay,
    },
  });

  return {
    play() {
      tween.restart(true);
    },
    revert() {
      tween.kill();
      el.textContent = opts.text;
    },
  };
}
