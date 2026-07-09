import { useLayoutEffect, useRef, type HTMLAttributes, type CSSProperties } from 'react';
import {
  trackPointer,
  writeSpotlight,
  type BorderGlowProps as BorderGlowStyleProps,
} from '@jolt/core';
import '@jolt/core/styles/border-glow.css';

type BorderGlowProps = BorderGlowStyleProps & HTMLAttributes<HTMLDivElement>;

/** The border lights up where the cursor is */
export function BorderGlow({
  color = '#7c5cff',
  width = 2,
  glow = 120,
  className,
  style,
  children,
  ...rest
}: BorderGlowProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = trackPointer(el, writeSpotlight);
    return () => controller.revert();
  }, []);

  const vars = {
    '--jolt-color': color,
    '--jolt-width': `${width}px`,
    '--jolt-glow': `${glow}px`,
    ...style,
  } as CSSProperties;

  return (
    <div
      {...rest}
      ref={ref}
      className={`jolt-border-glow${className ? ` ${className}` : ''}`}
      style={vars}
    >
      {children}
    </div>
  );
}
