import { z } from 'zod';

/**
 * The single source of truth for SplitText's props, defaults, validation, and
 * docs. Every framework skin derives its prop type from this schema, and the
 * docs site renders its props table from `splitTextPropsTable()` — so adding or
 * changing a prop here updates the types, all three skins, and the docs at once.
 *
 * Numeric defaults intentionally mirror the motion tokens in `@jolt/tokens`
 * (durationBase 600ms → 0.6s, stagger 30ms → 0.03s).
 */
export const splitTextSchema = z.object({
  text: z.string().describe('The text to animate.'),
  by: z.enum(['chars', 'words']).default('chars').describe('Split granularity.'),
  stagger: z
    .number()
    .nonnegative()
    .default(0.03)
    .describe('Seconds between each segment starting.'),
  duration: z
    .number()
    .positive()
    .default(0.6)
    .describe('Seconds each segment takes to animate in.'),
  delay: z
    .number()
    .nonnegative()
    .default(0)
    .describe('Seconds to wait before the first segment starts.'),
  y: z.number().default(20).describe('Initial vertical offset in pixels; animates to 0.'),
});

/** Public prop shape (text required; everything else optional with defaults). */
export type SplitTextProps = z.input<typeof splitTextSchema>;
/** Fully-resolved options after defaults are applied. */
export type SplitTextOptions = z.output<typeof splitTextSchema>;

export const splitTextMeta = {
  id: 'split-text',
  name: 'SplitText',
  category: 'text',
  deps: ['gsap'],
  a11y: 'Full text is exposed via aria-label; animated segments are aria-hidden.',
} as const;
