import { z } from 'zod';

/**
 * Props for the Silk background (Three.js, custom shader). Softly rippling folds of silk —
 * noise-warped stripes lit by a moving sheen. Full-bleed, no text, no required input. Colors
 * are hex-only (the shader needs numeric RGB); up to 3 stops light the folds (D-033).
 */
export const silkSchema = z.object({
  colors: z
    .array(z.string())
    .min(1)
    .default(['#1b1633', '#7c5cff', '#c6b8ff'])
    .describe('Color stops (hex), from the deepest fold to the brightest sheen. Up to 3 are used.'),
  speed: z.number().nonnegative().default(0.35).describe('How fast the folds drift.'),
  scale: z
    .number()
    .positive()
    .default(1.4)
    .describe('Spatial scale of the folds (higher = finer).'),
  rotation: z.number().default(-18).describe('Angle of the weave, in degrees.'),
  noise: z.number().min(0).max(1).default(0.45).describe('How much the folds are warped (0–1).'),
  opacity: z.number().min(0).max(1).default(1).describe('Overall opacity.'),
});

/** Public prop shape (all optional with defaults — a background needs no required input). */
export type SilkProps = z.input<typeof silkSchema>;
/** Fully-resolved options after defaults are applied. */
export type SilkOptions = z.output<typeof silkSchema>;

export const silkMeta = {
  id: 'silk',
  name: 'Silk',
  category: 'background',
  deps: ['three'],
  a11y: 'Decorative background; the canvas container is aria-hidden and conveys no information.',
} as const;
