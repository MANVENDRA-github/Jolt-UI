import { useLayoutEffect, useRef, type HTMLAttributes, type CSSProperties } from 'react';
import { trackPointer, writeSpotlight, type GlareProps as GlareStyleProps } from '@jolt/core';
import '@jolt/core/styles/glare.css';

type GlareProps = GlareStyleProps & HTMLAttributes<HTMLDivElement>;

/** A glossy sheen that follows the cursor across the card */
export function Glare({
  color = '#ffffff',
  angle = 105,
  spread = 220,
  opacity = 0.18,
  className,
  style,
  children,
  ...rest
}: GlareProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = trackPointer(el, writeSpotlight);
    return () => controller.revert();
  }, []);

  const vars = {
    '--jolt-color': color,
    '--jolt-angle': `${angle}deg`,
    '--jolt-spread': `${spread}%`,
    '--jolt-opacity': opacity,
    ...style,
  } as CSSProperties;

  return (
    <div
      {...rest}
      ref={ref}
      className={`jolt-glare${className ? ` ${className}` : ''}`}
      style={vars}
    >
      {children}
    </div>
  );
}
