import { z } from 'zod';

/**
 * Props for the Dots background (Three.js). A decorative grid of points with a radial
 * ripple traveling out from the center — full-bleed, no text, no required input.
 */
export const dotsSchema = z.object({
  color: z.string().default('#6d5efc').describe('Point color (any CSS color Three.js accepts).'),
  count: z.number().int().positive().default(48).describe('Points per side of the grid.'),
  size: z.number().positive().default(3).describe('Point size in pixels.'),
  amplitude: z.number().nonnegative().default(1.2).describe('Ripple height in world units.'),
  frequency: z.number().positive().default(0.45).describe('Ripple spatial frequency.'),
  speed: z.number().nonnegative().default(1.5).describe('Ripple speed.'),
  opacity: z.number().min(0).max(1).default(0.8).describe('Point opacity.'),
});

/** Public prop shape (all optional with defaults — a background needs no required input). */
export type DotsProps = z.input<typeof dotsSchema>;
/** Fully-resolved options after defaults are applied. */
export type DotsOptions = z.output<typeof dotsSchema>;

export const dotsMeta = {
  id: 'dots',
  name: 'Dots',
  category: 'background',
  deps: ['three'],
  a11y: 'Decorative background; the canvas container is aria-hidden and conveys no information.',
} as const;
