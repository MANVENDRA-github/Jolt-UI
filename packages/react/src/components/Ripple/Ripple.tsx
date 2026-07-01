import type { CSSProperties } from 'react';
import type { RippleProps } from '@jolt/core';
import '@jolt/core/styles/ripple.css';

/** Two concentric expanding rings (CSS-only loader). Exposes role="status" with an accessible label. */
export function Ripple({
  color = '#7c5cff',
  size = 48,
  speed = 1.2,
  label = 'Loading…',
}: RippleProps) {
  const style = {
    '--jolt-color': color,
    '--jolt-size': `${size}px`,
    '--jolt-speed': `${speed}s`,
  } as CSSProperties;

  return (
    <div role="status" aria-label={label} className="jolt-ripple" style={style}>
      <span />
      <span />
    </div>
  );
}
