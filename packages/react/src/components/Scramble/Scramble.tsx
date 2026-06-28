import { useLayoutEffect, useRef } from 'react';
import { createScramble, type ScrambleProps } from '@jolt/core';

/** Text that decodes into place from a churn of random characters on mount (GSAP). */
export function Scramble({ text, duration, delay, chars, revealDelay, speed }: ScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = createScramble(el, { text, duration, delay, chars, revealDelay, speed });
    return () => controller.revert();
  }, [text, duration, delay, chars, revealDelay, speed]);

  return (
    <span ref={ref} aria-label={text}>
      {text}
    </span>
  );
}
