import type { ButtonHTMLAttributes, CSSProperties } from 'react';
import type { GradientProps as GradientStyleProps } from '@jolt/core';
import '@jolt/core/styles/gradient.css';

type GradientProps = GradientStyleProps & ButtonHTMLAttributes<HTMLButtonElement>;

/** A flowing-gradient CTA button (CSS-only). Renders a real <button> and forwards native button attrs. */
export function Gradient({
  colors = ['#7c5cff', '#a855f7', '#ec4899'],
  speed = 4,
  label = 'Button',
  type = 'button',
  className,
  style,
  children,
  ...rest
}: GradientProps) {
  // Repeat the first stop so the 200% background scroll loops seamlessly.
  const stops = colors.concat(colors.slice(0, 1)).join(', ');
  const vars = {
    '--jolt-gradient': `linear-gradient(90deg, ${stops})`,
    '--jolt-speed': `${speed}s`,
    ...style,
  } as CSSProperties;

  return (
    <button
      {...rest}
      type={type}
      className={`jolt-gradient${className ? ` ${className}` : ''}`}
      style={vars}
    >
      {children ?? label}
    </button>
  );
}
