import type { CSSProperties } from 'react';
import type { DotBounceProps } from '@jolt/core';
import '@jolt/core/styles/dot-bounce.css';

/** Three bouncing dots (CSS-only loader). Exposes role="status" with an accessible label. */
export function DotBounce({
  color = '#7c5cff',
  size = 12,
  speed = 1.2,
  label = 'Loading…',
}: DotBounceProps) {
  const style = {
    '--jolt-color': color,
    '--jolt-size': `${size}px`,
    '--jolt-speed': `${speed}s`,
  } as CSSProperties;

  return (
    <div role="status" aria-label={label} className="jolt-dot-bounce" style={style}>
      <span />
      <span />
      <span />
    </div>
  );
}
