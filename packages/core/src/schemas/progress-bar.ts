import { z } from 'zod';

/**
 * Props for the ProgressBar loader (CSS-only). An indeterminate fill sweeping across
 * a track; the shared `styles/progress-bar.css` reads `--jolt-color` / `--jolt-width`
 * / `--jolt-thickness` / `--jolt-speed`. `role="status"` carries the accessible `label`.
 */
export const progressBarSchema = z.object({
  color: z.string().default('#7c5cff').describe('Fill color (any CSS color).'),
  width: z.number().positive().default(160).describe('Track width in pixels.'),
  thickness: z.number().positive().default(4).describe('Track height in pixels.'),
  speed: z.number().positive().default(1.4).describe('Seconds per sweep.'),
  label: z.string().default('Loading…').describe('Accessible label announced via role="status".'),
});

export type ProgressBarProps = z.input<typeof progressBarSchema>;

export const progressBarMeta = {
  id: 'progress-bar',
  name: 'ProgressBar',
  category: 'loader',
  deps: [],
  a11y: 'Exposes role="status" with an accessible label; the bar is decorative and pauses to a static partial fill under reduced-motion.',
} as const;
