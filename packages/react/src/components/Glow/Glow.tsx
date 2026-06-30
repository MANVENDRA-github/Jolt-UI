import type { ButtonHTMLAttributes, CSSProperties } from 'react';
import type { GlowProps as GlowStyleProps } from '@jolt/core';
import '@jolt/core/styles/glow.css';

type GlowProps = GlowStyleProps & ButtonHTMLAttributes<HTMLButtonElement>;

/** A glowing CTA button (CSS-only). Renders a real <button> and forwards native button attrs. */
export function Glow({
  color = '#7c5cff',
  speed = 2,
  label = 'Button',
  type = 'button',
  className,
  style,
  children,
  ...rest
}: GlowProps) {
  const vars = {
    '--jolt-color': color,
    '--jolt-speed': `${speed}s`,
    ...style,
  } as CSSProperties;

  return (
    <button
      {...rest}
      type={type}
      className={`jolt-glow${className ? ` ${className}` : ''}`}
      style={vars}
    >
      {children ?? label}
    </button>
  );
}
