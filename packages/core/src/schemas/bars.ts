import { z } from 'zod';

/**
 * Props for the Bars loader (CSS-only). Five equalizer bars scaling vertically in sequence;
 * the shared `styles/bars.css` reads `--jolt-color` / `--jolt-size` / `--jolt-speed`.
 * `role="status"` carries the accessible `label`.
 */
export const barsSchema = z.object({
  color: z.string().default('#7c5cff').describe('Bar color (any CSS color).'),
  size: z.number().positive().default(32).describe('Overall height in pixels.'),
  speed: z.number().positive().default(1).describe('Seconds per pulse cycle.'),
  label: z.string().default('Loading…').describe('Accessible label announced via role="status".'),
});

export type BarsProps = z.input<typeof barsSchema>;

export const barsMeta = {
  id: 'bars',
  name: 'Bars',
  category: 'loader',
  deps: [],
  a11y: 'Exposes role="status" with an accessible label; the bars are decorative and pause under reduced-motion.',
} as const;
