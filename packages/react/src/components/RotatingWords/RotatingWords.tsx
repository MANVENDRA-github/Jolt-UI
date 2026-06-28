import type { CSSProperties } from 'react';
import type { RotatingWordsProps } from '@jolt/core';
import '@jolt/core/styles/rotating-words.css';

/** CSS-only rotating words: a vertical list steps up one word per interval. A
    trailing duplicate of the first word makes the loop seamless. */
export function RotatingWords({
  words = ['design', 'animate', 'ship'],
  interval = 2,
  delay = 0,
}: RotatingWordsProps) {
  const style = {
    '--jolt-count': words.length,
    '--jolt-interval': `${interval}s`,
    '--jolt-delay': `${delay}s`,
  } as CSSProperties;

  return (
    <span className="jolt-rotating-words" aria-label={words.join(' ')} style={style}>
      <span className="jolt-rotating-words__list">
        {words.map((word, i) => (
          <span
            key={i}
            className="jolt-rotating-words__word"
            data-jolt-segment=""
            aria-hidden="true"
          >
            {word}
          </span>
        ))}
        <span className="jolt-rotating-words__word" aria-hidden="true">
          {words[0]}
        </span>
      </span>
    </span>
  );
}
