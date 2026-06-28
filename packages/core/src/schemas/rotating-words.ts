import { z } from 'zod';

/**
 * Props for the RotatingWords component (CSS-only, structural). The shared
 * `styles/rotating-words.css` steps a vertical column of words up one line per
 * interval; the skin sets `--jolt-count` (word count), `--jolt-interval`, and
 * `--jolt-delay` via CSS custom properties.
 */
export const rotatingWordsSchema = z.object({
  words: z
    .array(z.string())
    .min(1)
    .default(['design', 'animate', 'ship'])
    .describe('The words to cycle through.'),
  interval: z.number().positive().default(2).describe('Seconds each word stays before the next.'),
  delay: z.number().nonnegative().default(0).describe('Seconds to wait before cycling starts.'),
});

export type RotatingWordsProps = z.input<typeof rotatingWordsSchema>;

export const rotatingWordsMeta = {
  id: 'rotating-words',
  name: 'RotatingWords',
  category: 'text',
  deps: [],
  a11y: 'All words are exposed via aria-label; the animated list is aria-hidden.',
} as const;
