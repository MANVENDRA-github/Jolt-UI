import { z } from 'zod';

/**
 * Props for the BlurIn component (CSS-only). The shared `styles/blur-in.css`
 * reads these via CSS custom properties the skin sets from these values.
 */
export const blurInSchema = z.object({
  text: z.string().describe('The text to animate.'),
  by: z.enum(['chars', 'words']).default('chars').describe('Split granularity.'),
  blur: z.number().nonnegative().default(10).describe('Initial blur radius in pixels.'),
  stagger: z
    .number()
    .nonnegative()
    .default(0.05)
    .describe('Seconds between each segment starting.'),
  duration: z.number().positive().default(0.6).describe('Seconds each segment takes to resolve.'),
  delay: z.number().nonnegative().default(0).describe('Seconds to wait before the first segment.'),
});

export type BlurInProps = z.input<typeof blurInSchema>;

export const blurInMeta = {
  id: 'blur-in',
  name: 'BlurIn',
  category: 'text',
  deps: [],
  a11y: 'Full text is exposed via aria-label; animated segments are aria-hidden.',
} as const;
