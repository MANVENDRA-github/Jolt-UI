import { useLayoutEffect, useRef, type HTMLAttributes, type CSSProperties } from 'react';
import {
  trackPointer,
  writeSpotlight,
  type SpotlightProps as SpotlightStyleProps,
} from '@jolt/core';
import '@jolt/core/styles/spotlight.css';

type SpotlightProps = SpotlightStyleProps & HTMLAttributes<HTMLDivElement>;

/** A card whose radial glow follows the cursor. Renders a <div> wrapping your content. */
export function Spotlight({
  color = '#6d5efc',
  size = 60,
  opacity = 0.35,
  className,
  style,
  children,
  ...rest
}: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = trackPointer(el, writeSpotlight);
    return () => controller.revert();
  }, []);

  const vars = {
    '--jolt-color': color,
    '--jolt-size': `${size}%`,
    '--jolt-opacity': opacity,
    ...style,
  } as CSSProperties;

  return (
    <div
      {...rest}
      ref={ref}
      className={`jolt-spotlight${className ? ` ${className}` : ''}`}
      style={vars}
    >
      {children}
    </div>
  );
}
