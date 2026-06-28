import { z } from 'zod';

/**
 * Props for the CountUp component (GSAP). The core factory tweens a number from
 * `from` to `to` and writes the formatted value into the element's text.
 */
export const countUpSchema = z.object({
  to: z.number().describe('The target value to count to.'),
  from: z.number().default(0).describe('The starting value.'),
  duration: z.number().positive().default(2).describe('Seconds to reach the target.'),
  delay: z.number().nonnegative().default(0).describe('Seconds to wait before counting starts.'),
  decimals: z.number().int().nonnegative().default(0).describe('Decimal places to show.'),
  separator: z.string().default('').describe("Thousands separator, e.g. ','. Empty for none."),
});

/** Public prop shape (`to` required; everything else optional with defaults). */
export type CountUpProps = z.input<typeof countUpSchema>;
/** Fully-resolved options after defaults are applied. */
export type CountUpOptions = z.output<typeof countUpSchema>;

export const countUpMeta = {
  id: 'count-up',
  name: 'CountUp',
  category: 'text',
  deps: ['gsap'],
  a11y: 'The animated number is the element text; reduced-motion shows the final value immediately.',
} as const;
