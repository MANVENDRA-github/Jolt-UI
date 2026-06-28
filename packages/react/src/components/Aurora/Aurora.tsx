import { useLayoutEffect, useRef } from 'react';
import type { AuroraProps } from '@jolt/core';
import { createAurora } from '@jolt/core/webgl/aurora';

/** A decorative flowing aurora light-curtain (Three.js custom shader), full-bleed canvas. */
export function Aurora({ colors, speed, intensity, scale, opacity }: AuroraProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = createAurora(el, { colors, speed, intensity, scale, opacity });
    return () => controller.revert();
  }, [colors, speed, intensity, scale, opacity]);

  return <div ref={ref} aria-hidden="true" className="h-full w-full" />;
}
