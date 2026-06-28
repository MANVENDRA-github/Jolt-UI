import { useLayoutEffect, useRef } from 'react';
import type { ParticlesProps } from '@jolt/core';
import { createParticles } from '@jolt/core/webgl/particles';

/** A decorative drifting WebGL point field (Three.js), rendered to a full-bleed canvas. */
export function Particles({ count, color, size, speed, spread, opacity }: ParticlesProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = createParticles(el, { count, color, size, speed, spread, opacity });
    return () => controller.revert();
  }, [count, color, size, speed, spread, opacity]);

  return <div ref={ref} aria-hidden="true" className="h-full w-full" />;
}
