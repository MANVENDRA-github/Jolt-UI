import type { CSSProperties } from 'react';
import type { GradientTextProps } from '@jolt/core';
import '@jolt/core/styles/gradient-text.css';

/** CSS-only animated gradient clipped to the text (whole-text, not per-char). */
export function GradientText({
  text,
  colors = ['#6ee7b7', '#3b82f6', '#a78bfa'],
  duration = 4,
}: GradientTextProps) {
  // Repeat the first stop so the 200% background scroll loops seamlessly.
  const stops = colors.concat(colors.slice(0, 1)).join(', ');
  const style = {
    '--jolt-gradient': `linear-gradient(90deg, ${stops})`,
    '--jolt-duration': `${duration}s`,
  } as CSSProperties;

  return (
    <span className="jolt-gradient-text" style={style}>
      {text}
    </span>
  );
}
