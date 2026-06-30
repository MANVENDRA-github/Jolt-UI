import { z } from 'zod';

/**
 * Props for the Aurora background (Three.js, custom shader). A flowing aurora light-curtain
 * rendered by a fragment shader — full-bleed, no text, no required input. Colors are hex-only
 * (the shader needs numeric RGB); up to 3 stops are blended across the curtains (D-033).
 */
export const auroraSchema = z.object({
  colors: z
    .array(z.string())
    .min(1)
    .default(['#5eead4', '#7c5cff', '#22d3ee'])
    .describe('Aurora color stops (hex), blended across the curtains. Up to 3 are used.'),
  speed: z.number().nonnegative().default(0.3).describe('Flow speed of the curtains.'),
  intensity: z.number().nonnegative().default(1).describe('Brightness/strength of the aurora.'),
  scale: z
    .number()
    .positive()
    .default(1)
    .describe('Spatial scale of the curtains (higher = finer).'),
  opacity: z.number().min(0).max(1).default(0.85).describe('Overall opacity.'),
});

/** Public prop shape (all optional with defaults — a background needs no required input). */
export type AuroraProps = z.input<typeof auroraSchema>;
/** Fully-resolved options after defaults are applied. */
export type AuroraOptions = z.output<typeof auroraSchema>;

export const auroraMeta = {
  id: 'aurora',
  name: 'Aurora',
  category: 'background',
  deps: ['three'],
  a11y: 'Decorative background; the canvas container is aria-hidden and conveys no information.',
} as const;
