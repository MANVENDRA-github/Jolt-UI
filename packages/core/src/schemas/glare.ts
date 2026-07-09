import { z } from 'zod';

/**
 * Props for the Glare card (CSS-only, visual-only). The skin renders a `<div>` wrapping
 * your content (children/slot); the shared `styles/glare.css` reads these via the CSS
 * custom properties the skin sets.
 */
export const glareSchema = z.object({
  color: z.string().default('#ffffff').describe('Sheen color (any CSS color).'),
  angle: z.number().default(105).describe('Angle of the sheen band, in degrees.'),
  spread: z
    .number()
    .default(220)
    .describe('Size of the sheen relative to the card, as a percentage.'),
  opacity: z.number().default(0.18).describe('Peak sheen opacity (0–1).'),
});

export type GlareProps = z.input<typeof glareSchema>;

export const glareMeta = {
  id: 'glare',
  name: 'Glare',
  category: 'card',
  deps: [],
  a11y: 'Renders a plain presentational <div> wrapping your content; the sheen is purely decorative. Under reduced-motion the sheen stays centered and the pointer is not tracked.',
} as const;
