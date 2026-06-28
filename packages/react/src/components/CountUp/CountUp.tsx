import { useLayoutEffect, useRef } from 'react';
import { createCountUp, formatNumber, type CountUpProps } from '@jolt/core';

/** A number that animates from `from` to `to` on mount (GSAP). */
export function CountUp({
  to,
  from = 0,
  duration,
  delay,
  decimals = 0,
  separator = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = createCountUp(el, { to, from, duration, delay, decimals, separator });
    return () => controller.revert();
  }, [to, from, duration, delay, decimals, separator]);

  return (
    <span ref={ref} className="tabular-nums">
      {formatNumber(from, { decimals, separator })}
    </span>
  );
}
