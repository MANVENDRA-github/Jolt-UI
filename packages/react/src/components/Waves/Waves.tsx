import { useLayoutEffect, useRef } from 'react';
import type { WavesProps } from '@jolt/core';
import { createWaves } from '@jolt/core/webgl/waves';

/** A decorative undulating wireframe plane (Three.js), rendered to a full-bleed canvas. */
export function Waves({ color, amplitude, frequency, speed, density, opacity }: WavesProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = createWaves(el, { color, amplitude, frequency, speed, density, opacity });
    return () => controller.revert();
  }, [color, amplitude, frequency, speed, density, opacity]);

  return <div ref={ref} aria-hidden="true" className="h-full w-full" />;
}
