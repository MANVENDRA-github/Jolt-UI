import type { CSSProperties } from 'react';
import { splitSegments, type FlipInProps } from '@jolt/core';
import '@jolt/core/styles/flip-in.css';

/** Per-character 3D flip-in entrance */
export function FlipIn({
  text,
  by = 'chars',
  duration = 0.6,
  stagger = 0.05,
  perspective = 400,
  delay = 0,
}: FlipInProps) {
  const segments = splitSegments(text, by);
  const rootStyle = {
    '--jolt-duration': `${duration}s`,
    '--jolt-stagger': `${stagger}s`,
    '--jolt-perspective': `${perspective}px`,
    '--jolt-delay': `${delay}s`,
  } as CSSProperties;

  return (
    <span className="jolt-flip-in" aria-label={text} style={rootStyle}>
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
