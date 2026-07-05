import { z } from 'zod';

/**
 * Props for the FadeUp component (CSS-only). The shared `styles/fade-up.css`
 * reads these via CSS custom properties the skin sets from these values.
 */
export const fadeUpSchema = z.object({
  text: z.string().describe('The text to animate.'),
  by: z.enum(['chars', 'words']).default('chars').describe('Split granularity.'),
  distance: z.number().default(0.7).describe('How far each segment rises from, in em.'),
  stagger: z.number().default(0.04).describe('Seconds between each segment starting.'),
  duration: z.number().default(0.5).describe('Seconds each segment takes to resolve.'),
  delay: z.number().default(0).describe('Seconds to wait before the first segment.'),
});

export type FadeUpProps = z.input<typeof fadeUpSchema>;

export const fadeUpMeta = {
  id: 'fade-up',
  name: 'FadeUp',
  category: 'text',
  deps: [],
  a11y: 'Full text is exposed via aria-label; animated segments are aria-hidden.',
} as const;
