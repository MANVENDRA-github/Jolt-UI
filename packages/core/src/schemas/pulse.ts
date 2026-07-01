import { z } from 'zod';

/**
 * Props for the Pulse loader (CSS-only). Two sonar-ping discs expanding from the
 * center; the shared `styles/pulse.css` reads `--jolt-color` / `--jolt-size` /
 * `--jolt-speed`. `role="status"` carries the accessible `label`.
 */
export const pulseSchema = z.object({
  color: z.string().default('#7c5cff').describe('Disc color (any CSS color).'),
  size: z.number().positive().default(40).describe('Diameter in pixels at full expansion.'),
  speed: z.number().positive().default(1.2).describe('Seconds per pulse cycle.'),
  label: z.string().default('Loading…').describe('Accessible label announced via role="status".'),
});

export type PulseProps = z.input<typeof pulseSchema>;

export const pulseMeta = {
  id: 'pulse',
  name: 'Pulse',
  category: 'loader',
  deps: [],
  a11y: 'Exposes role="status" with an accessible label; the discs are decorative and pause under reduced-motion.',
} as const;
