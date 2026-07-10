import { useLayoutEffect, useRef } from 'react';
import type { LightRaysProps } from '@jolt/core';
import { createLightRays } from '@jolt/core/webgl/light-rays';

/** A decorative LightRays background (Three.js custom shader), full-bleed canvas. */
export function LightRays({
  colors,
  speed,
  count,
  spread,
  falloff,
  origin,
  opacity,
}: LightRaysProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = createLightRays(el, {
      colors,
      speed,
      count,
      spread,
      falloff,
      origin,
      opacity,
    });
    return () => controller.revert();
  }, [colors, speed, count, spread, falloff, origin, opacity]);

  return <div ref={ref} aria-hidden="true" className="h-full w-full" />;
}
