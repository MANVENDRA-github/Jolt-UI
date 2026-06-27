import type { CSSProperties } from 'react';
import type { ShinyTextProps } from '@jolt/core';
import '@jolt/core/styles/shiny-text.css';

/** CSS-only sheen sweeping across muted text (whole-text, not per-char). */
export function ShinyText({ text, duration = 3 }: ShinyTextProps) {
  const style = { '--jolt-duration': `${duration}s` } as CSSProperties;

  return (
    <span className="jolt-shiny-text" style={style}>
      {text}
    </span>
  );
}
