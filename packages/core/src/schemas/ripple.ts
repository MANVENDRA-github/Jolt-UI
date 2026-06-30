import { z } from 'zod';

/**
 * Props for the Ripple loader (CSS-only). Two concentric rings expanding from the
 * center (Material-style); the shared `styles/ripple.css` reads `--jolt-color` /
 * `--jolt-size` / `--jolt-speed`. `role="status"` carries the accessible `label`.
 */
export const rippleSchema = z.object({
  color: z.string().default('#7c5cff').describe('Ring color (any CSS color).'),
  size: z.number().positive().default(48).describe('Diameter in pixels at full expansion.'),
  speed: z.number().positive().default(1.2).describe('Seconds per ripple cycle.'),
  label: z.string().default('Loading…').describe('Accessible label announced via role="status".'),
});

export type RippleProps = z.input<typeof rippleSchema>;

export const rippleMeta = {
  id: 'ripple',
  name: 'Ripple',
  category: 'loader',
  deps: [],
  a11y: 'Exposes role="status" with an accessible label; the rings are decorative and pause under reduced-motion.',
} as const;
