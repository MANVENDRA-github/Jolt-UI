import { useLayoutEffect, useRef, type HTMLAttributes, type CSSProperties } from 'react';
import { observeReveal, type FadeContentProps as FadeContentStyleProps } from '@jolt/core';
import '@jolt/core/styles/fade-content.css';

type FadeContentProps = FadeContentStyleProps & HTMLAttributes<HTMLDivElement>;

/** Fades your content in when it scrolls into view */
export function FadeContent({
  duration = 0.7,
  delay = 0,
  blur = 6,
  className,
  style,
  children,
  ...rest
}: FadeContentProps) {
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
    '--jolt-duration': `${duration}s`,
    '--jolt-delay': `${delay}s`,
    '--jolt-blur': `${blur}px`,
    ...style,
  } as CSSProperties;

  return (
    <div
      {...rest}
      ref={ref}
      className={`jolt-fade-content${className ? ` ${className}` : ''}`}
      style={vars}
    >
      {children}
    </div>
  );
}
