import { z } from 'zod';

/**
 * Props for the FlipIn component (CSS-only). The shared `styles/flip-in.css`
 * reads these via CSS custom properties the skin sets from these values.
 */
export const flipInSchema = z.object({
  text: z.string().describe('The text to animate.'),
  by: z.enum(['chars', 'words']).default('chars').describe('Split granularity.'),
  duration: z.number().default(0.6).describe('Seconds each segment takes to flip in.'),
  stagger: z.number().default(0.05).describe('Seconds between each segment starting.'),
  perspective: z
    .number()
    .default(400)
    .describe('Depth of the 3D flip, in pixels (smaller is more extreme).'),
  delay: z.number().default(0).describe('Seconds to wait before the first segment.'),
});

export type FlipInProps = z.input<typeof flipInSchema>;

export const flipInMeta = {
  id: 'flip-in',
  name: 'FlipIn',
  category: 'text',
  deps: [],
  a11y: 'Full text is exposed via aria-label; animated segments are aria-hidden.',
} as const;
