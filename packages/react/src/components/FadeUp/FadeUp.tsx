import type { CSSProperties } from 'react';
import { splitSegments, type FadeUpProps } from '@jolt/core';
import '@jolt/core/styles/fade-up.css';

/** Per-character rise + fade-in entrance */
export function FadeUp({
  text,
  by = 'chars',
  distance = 0.7,
  stagger = 0.04,
  duration = 0.5,
  delay = 0,
}: FadeUpProps) {
  const segments = splitSegments(text, by);
  const rootStyle = {
    '--jolt-distance': `${distance}em`,
    '--jolt-stagger': `${stagger}s`,
    '--jolt-duration': `${duration}s`,
    '--jolt-delay': `${delay}s`,
  } as CSSProperties;

  return (
    <span className="jolt-fade-up" aria-label={text} style={rootStyle}>
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
