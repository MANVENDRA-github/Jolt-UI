import { z } from 'zod';

/**
 * Props for the GradientText component (CSS-only). The shared
 * `styles/gradient-text.css` reads `--jolt-gradient` (built by the skin from
 * `colors`) and `--jolt-duration` via CSS custom properties.
 */
export const gradientTextSchema = z.object({
  text: z.string().describe('The text to animate.'),
  colors: z
    .array(z.string())
    .min(2)
    .default(['#6ee7b7', '#3b82f6', '#a78bfa'])
    .describe('Gradient color stops, flowing left to right and looping.'),
  duration: z.number().positive().default(4).describe('Seconds for one full gradient sweep.'),
});

export type GradientTextProps = z.input<typeof gradientTextSchema>;

export const gradientTextMeta = {
  id: 'gradient-text',
  name: 'GradientText',
  category: 'text',
  deps: [],
  a11y: 'Renders the text directly (no segmentation); the gradient is decorative.',
} as const;
