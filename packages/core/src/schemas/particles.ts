import { z } from 'zod';

/**
 * Props for the Particles background (Three.js). A decorative drifting point
 * field rendered to a full-bleed canvas behind content — no text, no required input.
 */
export const particlesSchema = z.object({
  count: z.number().int().positive().default(800).describe('Number of points in the field.'),
  color: z.string().default('#6d5efc').describe('Point color (any CSS color Three.js accepts).'),
  size: z.number().positive().default(2).describe('Point size in pixels.'),
  speed: z
    .number()
    .nonnegative()
    .default(0.4)
    .describe('Vertical drift speed in world units per second.'),
  spread: z
    .number()
    .positive()
    .default(12)
    .describe('Half-extent of the cubic field around the origin.'),
  opacity: z.number().min(0).max(1).default(0.8).describe('Point opacity.'),
});

/** Public prop shape (all optional with defaults — a background needs no required input). */
export type ParticlesProps = z.input<typeof particlesSchema>;
/** Fully-resolved options after defaults are applied. */
export type ParticlesOptions = z.output<typeof particlesSchema>;

export const particlesMeta = {
  id: 'particles',
  name: 'Particles',
  category: 'background',
  deps: ['three'],
  a11y: 'Decorative background; the canvas container is aria-hidden and conveys no information.',
} as const;
