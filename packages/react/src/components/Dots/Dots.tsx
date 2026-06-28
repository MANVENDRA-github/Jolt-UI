import { useLayoutEffect, useRef } from 'react';
import type { DotsProps } from '@jolt/core';
import { createDots } from '@jolt/core/webgl/dots';

/** A decorative grid of points rippling from the center (Three.js), full-bleed canvas. */
export function Dots({ color, count, size, amplitude, frequency, speed, opacity }: DotsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = createDots(el, { color, count, size, amplitude, frequency, speed, opacity });
    return () => controller.revert();
  }, [color, count, size, amplitude, frequency, speed, opacity]);

  return <div ref={ref} aria-hidden="true" className="h-full w-full" />;
}
