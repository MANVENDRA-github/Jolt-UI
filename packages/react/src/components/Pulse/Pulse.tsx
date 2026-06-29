import type { CSSProperties } from 'react';
import type { PulseProps } from '@jolt/core';
import '@jolt/core/styles/pulse.css';

/** Two expanding sonar-ping discs (CSS-only loader). Exposes role="status" with an accessible label. */
export function Pulse({
  color = '#6d5efc',
  size = 40,
  speed = 1.2,
  label = 'Loading…',
}: PulseProps) {
  const style = {
    '--jolt-color': color,
    '--jolt-size': `${size}px`,
    '--jolt-speed': `${speed}s`,
  } as CSSProperties;

  return (
    <div role="status" aria-label={label} className="jolt-pulse" style={style}>
      <span />
      <span />
    </div>
  );
}
