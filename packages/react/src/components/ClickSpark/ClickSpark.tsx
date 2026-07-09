import { useLayoutEffect, useRef, type HTMLAttributes, type CSSProperties } from 'react';
import { attachClickSpark, type ClickSparkProps as ClickSparkStyleProps } from '@jolt/core';
import '@jolt/core/styles/click-spark.css';

type ClickSparkProps = ClickSparkStyleProps & HTMLAttributes<HTMLDivElement>;

/** Throws a burst of sparks from every click */
export function ClickSpark({
  color = '#c6ff4f',
  size = 12,
  speed = 0.45,
  className,
  style,
  children,
  ...rest
}: ClickSparkProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Emit a burst of CSS rays from every click.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = attachClickSpark(el);
    return () => controller.revert();
  }, []);

  const vars = {
    '--jolt-color': color,
    '--jolt-size': `${size}px`,
    '--jolt-speed': `${speed}s`,
    ...style,
  } as CSSProperties;

  return (
    <div
      {...rest}
      ref={ref}
      className={`jolt-click-spark${className ? ` ${className}` : ''}`}
      style={vars}
    >
      {children}
    </div>
  );
}
