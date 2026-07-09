import { z } from 'zod';

/**
 * Props for the GlitchText component (CSS-only). The shared `styles/glitch-text.css`
 * reads these via CSS custom properties the skin sets from these values.
 */
export const glitchTextSchema = z.object({
  text: z.string().describe('The text to animate.'),
  color: z.string().default('#7c5cff').describe('Base text color (any CSS color).'),
  offset: z.number().default(2).describe('How far the color channels split, in pixels.'),
  speed: z.number().default(2.5).describe('Seconds for one glitch cycle.'),
});

export type GlitchTextProps = z.input<typeof glitchTextSchema>;

export const glitchTextMeta = {
  id: 'glitch-text',
  name: 'GlitchText',
  category: 'text',
  deps: [],
  a11y: 'Renders the text directly (natively readable); the glitch is decorative.',
} as const;
