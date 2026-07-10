import { useLayoutEffect, useRef, type HTMLAttributes, type CSSProperties } from 'react';
import { trackPointer, writeMagnet, type MagnetProps as MagnetStyleProps } from '@jolt/core';
import '@jolt/core/styles/magnet.css';

type MagnetProps = MagnetStyleProps & HTMLAttributes<HTMLDivElement>;

/** Pulls your content toward the cursor */
export function Magnet({
  strength = 14,
  speed = 0.25,
  className,
  style,
  children,
  ...rest
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Publish a signed -1..1 pull toward the cursor; the stylesheet scales it by --jolt-strength.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = trackPointer(el, writeMagnet);
    return () => controller.revert();
  }, []);

  const vars = {
    '--jolt-strength': `${strength}px`,
    '--jolt-speed': `${speed}s`,
    ...style,
  } as CSSProperties;

  return (
    <div
      {...rest}
      ref={ref}
      className={`jolt-magnet${className ? ` ${className}` : ''}`}
      style={vars}
    >
      {children}
    </div>
  );
}
