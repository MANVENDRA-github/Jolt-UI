import { z } from 'zod';

/**
 * Props for the Rings background (Three.js). Concentric rings of points that counter-rotate
 * (alternate rings spin opposite ways) with a gentle radial pulse — full-bleed, no text, no
 * required input.
 */
export const ringsSchema = z.object({
  color: z.string().default('#7c5cff').describe('Point color (any CSS color Three.js accepts).'),
  ringCount: z.number().int().positive().default(7).describe('Number of concentric rings.'),
  pointsPerRing: z.number().int().positive().default(64).describe('Points per ring.'),
  spacing: z.number().positive().default(0.9).describe('Radius step between rings (world units).'),
  size: z.number().positive().default(3).describe('Point size in pixels.'),
  speed: z
    .number()
    .default(0.4)
    .describe('Rotation speed in radians per second (negative reverses).'),
  amplitude: z
    .number()
    .nonnegative()
    .default(0.12)
    .describe('Radial-pulse depth as a fraction of the radius.'),
  frequency: z.number().positive().default(1).describe('Radial-pulse speed.'),
  opacity: z.number().min(0).max(1).default(0.85).describe('Point opacity.'),
});

/** Public prop shape (all optional with defaults — a background needs no required input). */
export type RingsProps = z.input<typeof ringsSchema>;
/** Fully-resolved options after defaults are applied. */
export type RingsOptions = z.output<typeof ringsSchema>;

export const ringsMeta = {
  id: 'rings',
  name: 'Rings',
  category: 'background',
  deps: ['three'],
  a11y: 'Decorative background; the canvas container is aria-hidden and conveys no information.',
} as const;
