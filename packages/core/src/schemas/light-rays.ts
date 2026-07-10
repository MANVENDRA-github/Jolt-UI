import { z } from 'zod';

/**
 * Props for the Light Rays background (Three.js, custom shader). Volumetric god-rays fanning out
 * from a single source, flickering as they travel. Full-bleed, no text, no required input.
 * Alpha falls off with distance so the rays blend over the page. Colors are hex-only (D-033).
 */
export const lightRaysSchema = z.object({
  colors: z
    .array(z.string())
    .min(1)
    .default(['#7c5cff', '#c6b8ff'])
    .describe('Ray color stops (hex), from the dim edge to the bright core. Up to 2 are used.'),
  speed: z.number().nonnegative().default(0.5).describe('How fast the rays flicker.'),
  count: z.number().positive().default(14).describe('Roughly how many rays fan out of the source.'),
  spread: z.number().positive().default(2.4).describe('How sharp each ray is (higher = thinner).'),
  falloff: z
    .number()
    .positive()
    .default(1.8)
    .describe('How quickly the rays fade with distance from the source.'),
  origin: z
    .number()
    .min(0)
    .max(1)
    .default(0.5)
    .describe('Where the source sits along the top edge (0 = left, 1 = right).'),
  opacity: z.number().min(0).max(1).default(0.9).describe('Overall opacity.'),
});

/** Public prop shape (all optional with defaults — a background needs no required input). */
export type LightRaysProps = z.input<typeof lightRaysSchema>;
/** Fully-resolved options after defaults are applied. */
export type LightRaysOptions = z.output<typeof lightRaysSchema>;

export const lightRaysMeta = {
  id: 'light-rays',
  name: 'LightRays',
  category: 'background',
  deps: ['three'],
  a11y: 'Decorative background; the canvas container is aria-hidden and conveys no information.',
} as const;
