import type { CSSProperties } from 'react';
import type { ProgressBarProps } from '@jolt/core';
import '@jolt/core/styles/progress-bar.css';

/** An indeterminate progress bar (CSS-only loader). Exposes role="status" with an accessible label. */
export function ProgressBar({
  color = '#7c5cff',
  width = 160,
  thickness = 4,
  speed = 1.4,
  label = 'Loading…',
}: ProgressBarProps) {
  const style = {
    '--jolt-color': color,
    '--jolt-width': `${width}px`,
    '--jolt-thickness': `${thickness}px`,
    '--jolt-speed': `${speed}s`,
  } as CSSProperties;

  return (
    <div role="status" aria-label={label} className="jolt-progress-bar" style={style}>
      <span />
    </div>
  );
}
