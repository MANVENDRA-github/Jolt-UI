import type { CSSProperties } from 'react';
import type { GridProps } from '@jolt/core';
import '@jolt/core/styles/grid.css';

/** A 3×3 grid of squares pulsing in a diagonal wave (CSS-only loader). Exposes role="status". */
export function Grid({ color = '#7c5cff', size = 12, speed = 1.3, label = 'Loading…' }: GridProps) {
  const style = {
    '--jolt-color': color,
    '--jolt-size': `${size}px`,
    '--jolt-speed': `${speed}s`,
  } as CSSProperties;

  return (
    <div role="status" aria-label={label} className="jolt-grid" style={style}>
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}
