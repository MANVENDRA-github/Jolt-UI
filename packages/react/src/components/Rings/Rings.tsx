import { useLayoutEffect, useRef } from 'react';
import type { RingsProps } from '@jolt/core';
import { createRings } from '@jolt/core/webgl/rings';

/** Decorative counter-rotating concentric rings of points (Three.js), full-bleed canvas. */
export function Rings({
  color,
  ringCount,
  pointsPerRing,
  spacing,
  size,
  speed,
  amplitude,
  frequency,
  opacity,
}: RingsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = createRings(el, {
      color,
      ringCount,
      pointsPerRing,
      spacing,
      size,
      speed,
      amplitude,
      frequency,
      opacity,
    });
    return () => controller.revert();
  }, [color, ringCount, pointsPerRing, spacing, size, speed, amplitude, frequency, opacity]);

  return <div ref={ref} aria-hidden="true" className="h-full w-full" />;
}
