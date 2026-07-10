import type { CSSProperties } from 'react';
import type { GlitchTextProps } from '@jolt/core';
import '@jolt/core/styles/glitch-text.css';

/** Chromatic split and jitter, glitching on a loop */
export function GlitchText({ text, color = '#7c5cff', offset = 2, speed = 2.5 }: GlitchTextProps) {
  const rootStyle = {
    '--jolt-color': color,
    '--jolt-offset': `${offset}px`,
    '--jolt-speed': `${speed}s`,
  } as CSSProperties;

  return (
    <span className="jolt-glitch-text" style={rootStyle}>
      {text}
    </span>
  );
}
