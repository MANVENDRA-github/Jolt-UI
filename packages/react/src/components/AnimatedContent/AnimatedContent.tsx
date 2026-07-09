import { useLayoutEffect, useRef, type HTMLAttributes, type CSSProperties } from 'react';
import { observeReveal, type AnimatedContentProps as AnimatedContentStyleProps } from '@jolt/core';
import '@jolt/core/styles/animated-content.css';

type AnimatedContentProps = AnimatedContentStyleProps & HTMLAttributes<HTMLDivElement>;

/** Slides and scales your content in when it scrolls into view */
export function AnimatedContent({
  distance = 40,
  scale = 0.94,
  duration = 0.7,
  delay = 0,
  className,
  style,
  children,
  ...rest
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Hide the content until it scrolls into view. Visible by default — the behavior only arms
  // it when a real IntersectionObserver exists and motion is allowed.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = observeReveal(el);
    return () => controller.revert();
  }, []);

  const vars = {
    '--jolt-distance': `${distance}px`,
    '--jolt-scale': scale,
    '--jolt-duration': `${duration}s`,
    '--jolt-delay': `${delay}s`,
    ...style,
  } as CSSProperties;

  return (
    <div
      {...rest}
      ref={ref}
      className={`jolt-animated-content${className ? ` ${className}` : ''}`}
      style={vars}
    >
      {children}
    </div>
  );
}
