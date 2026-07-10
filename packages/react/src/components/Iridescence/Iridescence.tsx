import { useLayoutEffect, useRef } from 'react';
import type { IridescenceProps } from '@jolt/core';
import { createIridescence } from '@jolt/core/webgl/iridescence';

/** A decorative Iridescence background (Three.js custom shader), full-bleed canvas. */
export function Iridescence({ colors, speed, scale, amplitude, opacity }: IridescenceProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = createIridescence(el, { colors, speed, scale, amplitude, opacity });
    return () => controller.revert();
  }, [colors, speed, scale, amplitude, opacity]);

  return <div ref={ref} aria-hidden="true" className="h-full w-full" />;
}
