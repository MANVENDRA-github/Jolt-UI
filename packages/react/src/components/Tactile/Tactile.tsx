import type { ButtonHTMLAttributes, CSSProperties } from 'react';
import type { TactileProps as TactileStyleProps } from '@jolt/core';
import '@jolt/core/styles/tactile.css';

type TactileProps = TactileStyleProps & ButtonHTMLAttributes<HTMLButtonElement>;

/** A raised button that presses down on click (CSS-only). Renders a real <button>. */
export function Tactile({
  color = '#7c5cff',
  speed = 0.12,
  label = 'Button',
  type = 'button',
  className,
  style,
  children,
  ...rest
}: TactileProps) {
  const vars = {
    '--jolt-color': color,
    '--jolt-speed': `${speed}s`,
    ...style,
  } as CSSProperties;

  return (
    <button
      {...rest}
      type={type}
      className={`jolt-tactile${className ? ` ${className}` : ''}`}
      style={vars}
    >
      {children ?? label}
    </button>
  );
}
