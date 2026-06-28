import { useLayoutEffect, useRef } from 'react';
import type { GlobeProps } from '@jolt/core';
import { createGlobe } from '@jolt/core/webgl/globe';

/** A decorative rotating sphere of points with a breathing pulse (Three.js), full-bleed canvas. */
export function Globe({
  color,
  count,
  size,
  radius,
  speed,
  amplitude,
  frequency,
  opacity,
}: GlobeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = createGlobe(el, {
      color,
      count,
      size,
      radius,
      speed,
      amplitude,
      frequency,
      opacity,
    });
    return () => controller.revert();
  }, [color, count, size, radius, speed, amplitude, frequency, opacity]);

  return <div ref={ref} aria-hidden="true" className="h-full w-full" />;
}
