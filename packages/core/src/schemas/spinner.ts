import { z } from 'zod';

/**
 * Props for the Spinner loader (CSS-only). A rotating ring; the shared `styles/spinner.css`
 * reads `--jolt-color` / `--jolt-size` / `--jolt-thickness` / `--jolt-speed`. `role="status"`
 * carries the accessible `label`.
 */
export const spinnerSchema = z.object({
  color: z.string().default('#6d5efc').describe('Ring color (any CSS color).'),
  size: z.number().positive().default(40).describe('Diameter in pixels.'),
  thickness: z.number().positive().default(4).describe('Ring thickness in pixels.'),
  speed: z.number().positive().default(0.8).describe('Seconds per rotation.'),
  label: z.string().default('Loading…').describe('Accessible label announced via role="status".'),
});

export type SpinnerProps = z.input<typeof spinnerSchema>;

export const spinnerMeta = {
  id: 'spinner',
  name: 'Spinner',
  category: 'loader',
  deps: [],
  a11y: 'Exposes role="status" with an accessible label; the spinner is decorative and pauses under reduced-motion.',
} as const;
