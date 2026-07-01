import { z } from 'zod';

/**
 * Props for the Grid loader (CSS-only). A 3×3 grid of squares pulsing in a diagonal
 * wave; the shared `styles/grid.css` reads `--jolt-color` / `--jolt-size` /
 * `--jolt-speed`. `role="status"` carries the accessible `label`.
 */
export const gridSchema = z.object({
  color: z.string().default('#7c5cff').describe('Square color (any CSS color).'),
  size: z.number().positive().default(12).describe('Square size in pixels (the grid is 3×3).'),
  speed: z.number().positive().default(1.3).describe('Seconds per pulse cycle.'),
  label: z.string().default('Loading…').describe('Accessible label announced via role="status".'),
});

export type GridProps = z.input<typeof gridSchema>;

export const gridMeta = {
  id: 'grid',
  name: 'Grid',
  category: 'loader',
  deps: [],
  a11y: 'Exposes role="status" with an accessible label; the squares are decorative and pause under reduced-motion.',
} as const;
