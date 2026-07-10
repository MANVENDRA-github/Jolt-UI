import { z } from 'zod';

/**
 * Props for the BorderGlow card (CSS-only, visual-only). The skin renders a `<div>` wrapping
 * your content (children/slot); the shared `styles/border-glow.css` reads these via the CSS
 * custom properties the skin sets.
 */
export const borderGlowSchema = z.object({
  color: z.string().default('#7c5cff').describe('Glow color (any CSS color).'),
  width: z.number().default(2).describe('Border thickness, in pixels.'),
  glow: z.number().default(120).describe('Radius of the lit stretch of border, in pixels.'),
});

export type BorderGlowProps = z.input<typeof borderGlowSchema>;

export const borderGlowMeta = {
  id: 'border-glow',
  name: 'BorderGlow',
  category: 'card',
  deps: [],
  a11y: 'Renders a plain presentational <div> wrapping your content; the glowing border is purely decorative. Under reduced-motion the glow stays centered and the pointer is not tracked.',
} as const;
