import { useLayoutEffect, useRef, type HTMLAttributes, type CSSProperties } from 'react';
import { trackPointer, makeTiltWriter, type TiltProps as TiltStyleProps } from '@jolt/core';
import '@jolt/core/styles/tilt.css';

type TiltProps = TiltStyleProps & HTMLAttributes<HTMLDivElement>;

/** A card that rotates in 3-D toward the cursor. Renders a <div> wrapping your content. */
export function Tilt({
  color = '#7c5cff',
  maxTilt = 12,
  speed = 0.15,
  className,
  style,
  children,
  ...rest
}: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = trackPointer(el, makeTiltWriter(maxTilt));
    return () => controller.revert();
  }, [maxTilt]);

  const vars = {
    '--jolt-color': color,
    '--jolt-speed': `${speed}s`,
    ...style,
  } as CSSProperties;

  return (
    <div
      {...rest}
      ref={ref}
      className={`jolt-tilt${className ? ` ${className}` : ''}`}
      style={vars}
    >
      {children}
    </div>
  );
}
