import { z } from 'zod';

/**
 * Props for the ScrollVelocity component (GSAP ScrollTrigger). A horizontal
 * marquee that scrolls continuously and speeds up / flips direction with the
 * page's scroll velocity.
 */
export const scrollVelocitySchema = z.object({
  text: z.string().describe('The marquee text (repeated to fill the row).'),
  baseVelocity: z.number().positive().default(6).describe('Idle scroll speed; higher is faster.'),
  direction: z.enum(['left', 'right']).default('left').describe('Base scroll direction.'),
});

/** Public prop shape (`text` required; everything else optional with defaults). */
export type ScrollVelocityProps = z.input<typeof scrollVelocitySchema>;
/** Fully-resolved options after defaults are applied. */
export type ScrollVelocityOptions = z.output<typeof scrollVelocitySchema>;

export const scrollVelocityMeta = {
  id: 'scroll-velocity',
  name: 'ScrollVelocity',
  category: 'text',
  deps: ['gsap'],
  a11y: 'The text is exposed once via aria-label; the repeated marquee copies are aria-hidden.',
} as const;
