import type { CSSProperties } from 'react';
import type { SpinnerProps } from '@jolt/core';
import '@jolt/core/styles/spinner.css';

/** A rotating-ring loading spinner (CSS-only). Exposes role="status" with an accessible label. */
export function Spinner({
  color = '#6d5efc',
  size = 40,
  thickness = 4,
  speed = 0.8,
  label = 'Loading…',
}: SpinnerProps) {
  const style = {
    '--jolt-color': color,
    '--jolt-size': `${size}px`,
    '--jolt-thickness': `${thickness}px`,
    '--jolt-speed': `${speed}s`,
  } as CSSProperties;

  return <div role="status" aria-label={label} className="jolt-spinner" style={style} />;
}
