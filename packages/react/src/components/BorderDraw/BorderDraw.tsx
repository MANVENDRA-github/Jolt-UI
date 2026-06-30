import type { ButtonHTMLAttributes, CSSProperties } from 'react';
import type { BorderDrawProps as BorderDrawStyleProps } from '@jolt/core';
import '@jolt/core/styles/border-draw.css';

type BorderDrawProps = BorderDrawStyleProps & ButtonHTMLAttributes<HTMLButtonElement>;

/** A ghost button with a flowing gradient border (CSS-only). Renders a real <button>. */
export function BorderDraw({
  color = '#7c5cff',
  speed = 3,
  label = 'Button',
  type = 'button',
  className,
  style,
  children,
  ...rest
}: BorderDrawProps) {
  const vars = {
    '--jolt-color': color,
    '--jolt-speed': `${speed}s`,
    ...style,
  } as CSSProperties;

  return (
    <button
      {...rest}
      type={type}
      className={`jolt-border-draw${className ? ` ${className}` : ''}`}
      style={vars}
    >
      {children ?? label}
    </button>
  );
}
