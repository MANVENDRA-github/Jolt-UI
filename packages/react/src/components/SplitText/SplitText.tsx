import { useLayoutEffect, useRef } from 'react';
import { createSplitText, splitSegments, type SplitTextProps } from '@jolt/core';

/** Animated text that reveals its characters/words with a staggered rise. */
export function SplitText({ text, by = 'chars', stagger, duration, delay, y }: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const segments = splitSegments(text, by);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = createSplitText(el, { text, by, stagger, duration, delay, y });
    return () => controller.revert();
  }, [text, by, stagger, duration, delay, y]);

  return (
    <span ref={ref} aria-label={text} className="inline-block">
      {segments.map((segment, i) => (
        <span
          key={i}
          data-jolt-segment=""
          aria-hidden="true"
          className="inline-block whitespace-pre will-change-transform"
        >
          {segment}
        </span>
      ))}
    </span>
  );
}
