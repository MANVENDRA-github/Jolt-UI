import { z } from 'zod';

/**
 * The single source of truth for SplitText's props, defaults, and validation.
 * Every framework skin derives its prop type from this schema, so adding or
 * changing a prop here changes all three frameworks at once.
 *
 * Numeric defaults intentionally mirror the motion tokens in `@jolt/tokens`
 * (durationBase 600ms → 0.6s, stagger 30ms → 0.03s).
 */
export const splitTextSchema = z.object({
  /** The text to animate. */
  text: z.string(),
  /** Split granularity. */
  by: z.enum(['chars', 'words']).default('chars'),
  /** Seconds between each segment starting. */
  stagger: z.number().nonnegative().default(0.03),
  /** Seconds each segment takes to animate in. */
  duration: z.number().positive().default(0.6),
  /** Seconds to wait before the first segment starts. */
  delay: z.number().nonnegative().default(0),
  /** Initial vertical offset in pixels; animates to 0. */
  y: z.number().default(20),
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
