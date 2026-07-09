import type { CSSProperties } from 'react';
import { splitSegments, type CircularTextProps } from '@jolt/core';
import '@jolt/core/styles/circular-text.css';

/** Text laid around a circle, turning slowly */
export function CircularText({ text, by = 'chars', radius = 48, speed = 14 }: CircularTextProps) {
  const segments = splitSegments(text, by);
  // Each segment sits at `i / count` of a turn, so the stylesheet needs the total count.
  const rootStyle = {
    '--jolt-radius': `${radius}px`,
    '--jolt-speed': `${speed}s`,
    '--jolt-count': segments.length,
  } as CSSProperties;

  return (
    <span className="jolt-circular-text" aria-label={text} style={rootStyle}>
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
