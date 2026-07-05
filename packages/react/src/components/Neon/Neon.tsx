import type { CSSProperties } from 'react';
import type { NeonProps } from '@jolt/core';
import '@jolt/core/styles/neon.css';

/** Neon sign that flickers on to a steady glow */
export function Neon({ text, glow = 12, duration = 1.6, color = '#7c5cff' }: NeonProps) {
  const rootStyle = {
    '--jolt-glow': `${glow}px`,
    '--jolt-duration': `${duration}s`,
    '--jolt-color': color,
  } as CSSProperties;

  return (
    <span className="jolt-neon" style={rootStyle}>
      {text}
    </span>
  );
}
