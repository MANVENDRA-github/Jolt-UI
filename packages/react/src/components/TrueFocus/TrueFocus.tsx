import type { CSSProperties } from 'react';
import { splitSegments, type TrueFocusProps } from '@jolt/core';
import '@jolt/core/styles/true-focus.css';

/** A sharp focus sweeps across softly blurred text */
export function TrueFocus({
  text,
  by = 'chars',
  blur = 4,
  dim = 0.55,
  speed = 0.28,
}: TrueFocusProps) {
  const segments = splitSegments(text, by);
  // The sweep's cycle is `speed` per segment, so the stylesheet needs the total count.
  const rootStyle = {
    '--jolt-blur': `${blur}px`,
    '--jolt-dim': dim,
    '--jolt-speed': `${speed}s`,
    '--jolt-count': segments.length,
  } as CSSProperties;

  return (
    <span className="jolt-true-focus" aria-label={text} style={rootStyle}>
      {segments.map((segment, i) => (
        <span
          key={i}
          data-jolt-segment=""
          aria-hidden="true"
          style={{ '--jolt-i': i } as CSSProperties}
        >
          {segment}
        </span>
      ))}
    </span>
  );
}
