import { type CSSProperties } from 'react';
import { counterCells, type CounterProps } from '@jolt/core';
import '@jolt/core/styles/counter.css';

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/** A digit-roll display that rolls each column up to its target on mount. */
export function Counter({
  value = 2025,
  digits = 1,
  duration = 1.1,
  color = '#7c5cff',
}: CounterProps) {
  const cells = counterCells(value, digits);
  const vars = { '--jolt-duration': `${duration}s`, '--jolt-color': color } as CSSProperties;

  return (
    <span className="jolt-counter" style={vars} aria-label={cells.label} role="img">
      {cells.digits.map((digit, i) => (
        <span key={i} data-jolt-col aria-hidden="true">
          <span data-jolt-strip style={{ '--jolt-digit': digit } as CSSProperties}>
            {DIGITS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
