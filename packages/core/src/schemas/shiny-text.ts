import { z } from 'zod';

/**
 * Props for the ShinyText component (CSS-only). The shared `styles/shiny-text.css`
 * reads `--jolt-duration` via a CSS custom property; base + highlight colors are
 * themeable via `--jolt-shiny-base` / `--jolt-shiny-highlight`.
 */
export const shinyTextSchema = z.object({
  text: z.string().describe('The text to animate.'),
  duration: z.number().positive().default(3).describe('Seconds for one shine sweep.'),
});

export type ShinyTextProps = z.input<typeof shinyTextSchema>;

export const shinyTextMeta = {
  id: 'shiny-text',
  name: 'ShinyText',
  category: 'text',
  deps: [],
  a11y: 'Renders the text directly (no segmentation); the shine is decorative.',
} as const;
