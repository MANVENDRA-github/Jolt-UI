import { useLayoutEffect, useRef } from 'react';
import type { SilkProps } from '@jolt/core';
import { createSilk } from '@jolt/core/webgl/silk';

/** A decorative Silk background (Three.js custom shader), full-bleed canvas. */
export function Silk({ colors, speed, scale, rotation, noise, opacity }: SilkProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = createSilk(el, { colors, speed, scale, rotation, noise, opacity });
    return () => controller.revert();
  }, [colors, speed, scale, rotation, noise, opacity]);

  return <div ref={ref} aria-hidden="true" className="h-full w-full" />;
}
