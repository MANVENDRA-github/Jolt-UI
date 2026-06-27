import type { CSSProperties } from 'react';
import { splitSegments, type WaveProps } from '@jolt/core';
import '@jolt/core/styles/wave.css';

/** CSS-only per-character vertical wave. */
export function Wave({
  text,
  by = 'chars',
  amplitude = 10,
  duration = 1.5,
  stagger = 0.08,
  delay = 0,
}: WaveProps) {
  const segments = splitSegments(text, by);
  const rootStyle = {
    '--jolt-amplitude': `${amplitude}px`,
    '--jolt-duration': `${duration}s`,
    '--jolt-stagger': `${stagger}s`,
    '--jolt-delay': `${delay}s`,
  } as CSSProperties;

  return (
    <span className="jolt-wave" aria-label={text} style={rootStyle}>
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
