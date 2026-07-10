import type { CSSProperties } from 'react';
import { splitSegments, type BlurInProps } from '@jolt/core';
import '@jolt/core/styles/blur-in.css';

/** CSS-only per-character fade + de-blur reveal. */
export function BlurIn({
  text,
  by = 'chars',
  blur = 10,
  stagger = 0.05,
  duration = 0.6,
  delay = 0,
}: BlurInProps) {
  const segments = splitSegments(text, by);
  const rootStyle = {
    '--jolt-blur': `${blur}px`,
    '--jolt-stagger': `${stagger}s`,
    '--jolt-duration': `${duration}s`,
    '--jolt-delay': `${delay}s`,
  } as CSSProperties;

  return (
    <span className="jolt-blur-in" aria-label={text} style={rootStyle}>
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
