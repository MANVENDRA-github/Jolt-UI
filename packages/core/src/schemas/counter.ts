import { z } from 'zod';

/**
 * Props for the Counter — a digit-roll display that rolls each column up to its target on mount.
 * A prop-driven, one-shot entrance, unlike Count Up (a GSAP tween that counts continuously). The
 * shared `styles/counter.css` rolls each column via the `--jolt-digit` the skin sets; the whole
 * value is carried on an aria-label so a screen reader reads the number, not the column of 0–9s.
 */
export const counterSchema = z.object({
  value: z.number().default(2025).describe('The number to roll to.'),
  digits: z
    .number()
    .int()
    .min(1)
    .default(1)
    .describe('Minimum number of columns; the value is zero-padded to at least this many.'),
  duration: z.number().nonnegative().default(1.1).describe('Seconds the roll takes.'),
  color: z.string().default('#7c5cff').describe('Digit color (any CSS color).'),
});

export type CounterProps = z.input<typeof counterSchema>;

export const counterMeta = {
  id: 'counter',
  name: 'Counter',
  category: 'ui',
  deps: [],
  a11y:
    'The full number is exposed via aria-label; the rolling digit columns are aria-hidden. ' +
    'Under reduced-motion the columns show the final value with no roll.',
} as const;
