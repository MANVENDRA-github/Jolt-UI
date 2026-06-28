import { useLayoutEffect, useRef } from 'react';
import { createScrollVelocity, type ScrollVelocityProps } from '@jolt/core';

/** Copies of the text rendered into the track so the marquee can loop seamlessly. */
const COPIES = 8;

/** A horizontal marquee whose speed + direction react to scroll velocity (GSAP). */
export function ScrollVelocity({ text, baseVelocity, direction }: ScrollVelocityProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = createScrollVelocity(el, { text, baseVelocity, direction });
    return () => controller.revert();
  }, [text, baseVelocity, direction]);

  return (
    <span ref={ref} className="block overflow-hidden whitespace-nowrap" aria-label={text}>
      <span className="inline-block will-change-transform" data-jolt-track aria-hidden="true">
        {[...Array(COPIES).keys()].map((i) => (
          <span key={i} className="inline-block pr-8">
            {text}
          </span>
        ))}
      </span>
    </span>
  );
}
