import { z } from 'zod';

/**
 * Props for the TrueFocus component (CSS-only). The shared `styles/true-focus.css`
 * reads these via CSS custom properties the skin sets from these values.
 */
export const trueFocusSchema = z.object({
  text: z.string().describe('The text to animate.'),
  by: z.enum(['chars', 'words']).default('chars').describe('Split granularity.'),
  blur: z.number().default(4).describe('Blur radius of the out-of-focus segments, in pixels.'),
  dim: z.number().default(0.55).describe('Opacity of the out-of-focus segments (0–1).'),
  speed: z.number().default(0.28).describe('Seconds the focus rests on each segment.'),
});

export type TrueFocusProps = z.input<typeof trueFocusSchema>;

export const trueFocusMeta = {
  id: 'true-focus',
  name: 'TrueFocus',
  category: 'text',
  deps: [],
  a11y: 'Full text is exposed via aria-label; animated segments are aria-hidden.',
} as const;
