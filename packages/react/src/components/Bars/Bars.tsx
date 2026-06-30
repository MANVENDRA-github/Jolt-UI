import type { CSSProperties } from 'react';
import type { BarsProps } from '@jolt/core';
import '@jolt/core/styles/bars.css';

/** Five equalizer bars (CSS-only loader). Exposes role="status" with an accessible label. */
export function Bars({ color = '#7c5cff', size = 32, speed = 1, label = 'Loading…' }: BarsProps) {
  const style = {
    '--jolt-color': color,
    '--jolt-size': `${size}px`,
    '--jolt-speed': `${speed}s`,
  } as CSSProperties;

  return (
    <div role="status" aria-label={label} className="jolt-bars" style={style}>
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}
