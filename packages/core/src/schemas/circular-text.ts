import { z } from 'zod';

/**
 * Props for the CircularText component (CSS-only). The shared `styles/circular-text.css`
 * reads these via CSS custom properties the skin sets from these values.
 */
export const circularTextSchema = z.object({
  text: z.string().describe('The text to animate.'),
  by: z.enum(['chars', 'words']).default('chars').describe('Split granularity.'),
  radius: z.number().default(48).describe('Radius of the ring, in pixels.'),
  speed: z.number().default(14).describe('Seconds for one full turn.'),
});

export type CircularTextProps = z.input<typeof circularTextSchema>;

export const circularTextMeta = {
  id: 'circular-text',
  name: 'CircularText',
  category: 'text',
  deps: [],
  a11y: 'Full text is exposed via aria-label; the rotated segments are aria-hidden.',
} as const;
