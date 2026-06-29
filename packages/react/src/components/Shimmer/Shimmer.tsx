import type { ButtonHTMLAttributes, CSSProperties } from 'react';
import type { ShimmerProps as ShimmerStyleProps } from '@jolt/core';
import '@jolt/core/styles/shimmer.css';

type ShimmerProps = ShimmerStyleProps & ButtonHTMLAttributes<HTMLButtonElement>;

/** A shimmering CTA button (CSS-only). Renders a real <button> and forwards native button attrs. */
export function Shimmer({
  color = '#6d5efc',
  shine = '#b3a9ff',
  speed = 3,
  label = 'Button',
  type = 'button',
  className,
  style,
  children,
  ...rest
}: ShimmerProps) {
  const vars = {
    '--jolt-color': color,
    '--jolt-shine': shine,
    '--jolt-speed': `${speed}s`,
    ...style,
  } as CSSProperties;

  return (
    <button
      {...rest}
      type={type}
      className={`jolt-shimmer${className ? ` ${className}` : ''}`}
      style={vars}
    >
      {children ?? label}
    </button>
  );
}
