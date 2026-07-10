import { z } from 'zod';

/**
 * Props for the Iridescence background (Three.js, custom shader). A thin-film sheen whose color
 * shifts with the viewing angle — concentric interference rings drifting through the palette.
 * Full-bleed, no text, no required input. Colors are hex-only (D-033).
 */
export const iridescenceSchema = z.object({
  colors: z
    .array(z.string())
    .min(1)
    .default(['#7c5cff', '#22d3ee', '#c6ff4f'])
    .describe('Color stops (hex) the film cycles through. Up to 3 are used.'),
  speed: z.number().nonnegative().default(0.4).describe('How fast the film shifts.'),
  scale: z.number().positive().default(1).describe('Spatial scale of the rings (higher = finer).'),
  amplitude: z
    .number()
    .min(0)
    .max(2)
    .default(0.7)
    .describe('Strength of the interference ripple (0–2).'),
  opacity: z.number().min(0).max(1).default(1).describe('Overall opacity.'),
});

/** Public prop shape (all optional with defaults — a background needs no required input). */
export type IridescenceProps = z.input<typeof iridescenceSchema>;
/** Fully-resolved options after defaults are applied. */
export type IridescenceOptions = z.output<typeof iridescenceSchema>;

export const iridescenceMeta = {
  id: 'iridescence',
  name: 'Iridescence',
  category: 'background',
  deps: ['three'],
  a11y: 'Decorative background; the canvas container is aria-hidden and conveys no information.',
} as const;
