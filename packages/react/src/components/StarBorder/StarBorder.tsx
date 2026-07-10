import type { ButtonHTMLAttributes, CSSProperties } from 'react';
import type { StarBorderProps as StarBorderStyleProps } from '@jolt/core';
import '@jolt/core/styles/star-border.css';

type StarBorderProps = StarBorderStyleProps & ButtonHTMLAttributes<HTMLButtonElement>;

/** A star travels around the border */
export function StarBorder({
  color = '#14141c',
  star = '#c6ff4f',
  width = 2,
  speed = 4,
  label = 'Button',
  type = 'button',
  className,
  style,
  children,
  ...rest
}: StarBorderProps) {
  const vars = {
    '--jolt-color': color,
    '--jolt-star': star,
    '--jolt-width': `${width}px`,
    '--jolt-speed': `${speed}s`,
    ...style,
  } as CSSProperties;

  return (
    <button
      {...rest}
      type={type}
      className={`jolt-star-border${className ? ` ${className}` : ''}`}
      style={vars}
    >
      {children ?? label}
    </button>
  );
}
