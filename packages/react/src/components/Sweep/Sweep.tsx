import type { ButtonHTMLAttributes, CSSProperties } from 'react';
import type { SweepProps as SweepStyleProps } from '@jolt/core';
import '@jolt/core/styles/sweep.css';

type SweepProps = SweepStyleProps & ButtonHTMLAttributes<HTMLButtonElement>;

/** A ghost button whose fill wipes in on hover (CSS-only). Renders a real <button>. */
export function Sweep({
  color = '#6d5efc',
  speed = 0.3,
  label = 'Button',
  type = 'button',
  className,
  style,
  children,
  ...rest
}: SweepProps) {
  const vars = {
    '--jolt-color': color,
    '--jolt-speed': `${speed}s`,
    ...style,
  } as CSSProperties;

  return (
    <button
      {...rest}
      type={type}
      className={`jolt-sweep${className ? ` ${className}` : ''}`}
      style={vars}
    >
      {children ?? label}
    </button>
  );
}
