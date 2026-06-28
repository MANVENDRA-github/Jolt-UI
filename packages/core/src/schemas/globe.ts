import { z } from 'zod';

/**
 * Props for the Globe background (Three.js). A slowly rotating sphere of points with a
 * gentle breathing pulse — full-bleed, no text, no required input.
 */
export const globeSchema = z.object({
  color: z.string().default('#6d5efc').describe('Point color (any CSS color Three.js accepts).'),
  count: z.number().int().positive().default(900).describe('Number of points on the sphere.'),
  size: z.number().positive().default(3).describe('Point size in pixels.'),
  radius: z.number().positive().default(5).describe('Sphere radius in world units.'),
  speed: z.number().default(0.25).describe('Rotation speed in radians per second (negative reverses).'),
  amplitude: z
    .number()
    .nonnegative()
    .default(0.06)
    .describe('Breathing-pulse depth as a fraction of the radius.'),
  frequency: z.number().positive().default(1.2).describe('Breathing-pulse speed.'),
  opacity: z.number().min(0).max(1).default(0.85).describe('Point opacity.'),
});

/** Public prop shape (all optional with defaults — a background needs no required input). */
export type GlobeProps = z.input<typeof globeSchema>;
/** Fully-resolved options after defaults are applied. */
export type GlobeOptions = z.output<typeof globeSchema>;

export const globeMeta = {
  id: 'globe',
  name: 'Globe',
  category: 'background',
  deps: ['three'],
  a11y: 'Decorative background; the canvas container is aria-hidden and conveys no information.',
} as const;
