import { z } from 'zod';

/**
 * Props for the Neon component (CSS-only). The shared `styles/neon.css`
 * reads these via CSS custom properties the skin sets from these values.
 */
export const neonSchema = z.object({
  text: z.string().describe('The text to animate.'),
  glow: z.number().default(12).describe('Glow radius in pixels.'),
  duration: z.number().default(1.6).describe('Seconds for the flicker-on to settle.'),
  color: z.string().default('#7c5cff').describe('Neon tube color (text + glow).'),
});

export type NeonProps = z.input<typeof neonSchema>;

export const neonMeta = {
  id: 'neon',
  name: 'Neon',
  category: 'text',
  deps: [],
  a11y: 'Renders the text directly (natively readable); the glow is decorative.',
} as const;
