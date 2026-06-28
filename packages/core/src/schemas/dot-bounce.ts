import { z } from 'zod';

/**
 * Props for the DotBounce loader (CSS-only). Three dots bouncing in sequence; the shared
 * `styles/dot-bounce.css` reads `--jolt-color` / `--jolt-size` / `--jolt-speed`.
 * `role="status"` carries the accessible `label`.
 */
export const dotBounceSchema = z.object({
  color: z.string().default('#6d5efc').describe('Dot color (any CSS color).'),
  size: z.number().positive().default(12).describe('Dot diameter in pixels.'),
  speed: z.number().positive().default(1.2).describe('Seconds per bounce cycle.'),
  label: z.string().default('Loading…').describe('Accessible label announced via role="status".'),
});

export type DotBounceProps = z.input<typeof dotBounceSchema>;

export const dotBounceMeta = {
  id: 'dot-bounce',
  name: 'DotBounce',
  category: 'loader',
  deps: [],
  a11y: 'Exposes role="status" with an accessible label; the dots are decorative and pause under reduced-motion.',
} as const;
