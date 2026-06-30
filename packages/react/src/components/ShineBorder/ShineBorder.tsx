import type { HTMLAttributes, CSSProperties } from 'react';
import type { ShineBorderProps as ShineBorderStyleProps } from '@jolt/core';
import '@jolt/core/styles/shine-border.css';

type ShineBorderProps = ShineBorderStyleProps & HTMLAttributes<HTMLDivElement>;

/** A card with a gradient border that continuously flows around the perimeter (CSS-only). */
export function ShineBorder({
  color = '#6d5efc',
  speed = 3,
  width = 2,
  className,
  style,
  children,
  ...rest
}: ShineBorderProps) {
  const vars = {
    '--jolt-color': color,
    '--jolt-speed': `${speed}s`,
    '--jolt-width': `${width}px`,
    ...style,
  } as CSSProperties;

  return (
    <div {...rest} className={`jolt-shine-border${className ? ` ${className}` : ''}`} style={vars}>
      {children}
    </div>
  );
}
