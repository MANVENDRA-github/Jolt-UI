import { z } from 'zod';

/**
 * Props for the Waves background (Three.js). A decorative wireframe plane whose
 * vertices undulate with a traveling sine wave — full-bleed, no text, no required input.
 */
export const wavesSchema = z.object({
  color: z
    .string()
    .default('#6d5efc')
    .describe('Wireframe color (any CSS color Three.js accepts).'),
  amplitude: z.number().nonnegative().default(1.5).describe('Wave height in world units.'),
  frequency: z.number().positive().default(0.35).describe('Spatial frequency of the ripples.'),
  speed: z.number().nonnegative().default(1).describe('Animation speed.'),
  density: z.number().int().positive().default(40).describe('Grid resolution (segments per side).'),
  opacity: z.number().min(0).max(1).default(0.5).describe('Wireframe opacity.'),
});

/** Public prop shape (all optional with defaults — a background needs no required input). */
export type WavesProps = z.input<typeof wavesSchema>;
/** Fully-resolved options after defaults are applied. */
export type WavesOptions = z.output<typeof wavesSchema>;

export const wavesMeta = {
  id: 'waves',
  name: 'Waves',
  category: 'background',
  deps: ['three'],
  a11y: 'Decorative background; the canvas container is aria-hidden and conveys no information.',
} as const;
