import type { CSSProperties } from 'react';
import type { TypewriterProps } from '@jolt/core';
import '@jolt/core/styles/typewriter.css';

/** CSS-only typewriter: a stepped width reveal types the text out behind a clip,
    with a blinking caret. */
export function Typewriter({ text, duration = 2.5, delay = 0, caret = true }: TypewriterProps) {
  const style = {
    '--jolt-steps': text.length,
    '--jolt-duration': `${duration}s`,
    '--jolt-delay': `${delay}s`,
    '--jolt-caret-width': caret ? '0.08em' : '0',
  } as CSSProperties;

  return (
    <span className="jolt-typewriter" style={style}>
      {text}
    </span>
  );
}
