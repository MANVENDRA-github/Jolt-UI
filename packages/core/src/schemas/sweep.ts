import { z } from 'zod';

/**
 * Props for the Sweep button (CSS-only). A ghost button whose colored fill wipes in
 * from the left on hover/focus; the shared `styles/sweep.css` reads `--jolt-color` /
 * `--jolt-speed`. The skin renders a native `<button>` (label via children/slot or
 * this `label` fallback) and forwards click / disabled / native attributes.
 */
export const sweepSchema = z.object({
  color: z.string().default('#7c5cff').describe('Border, text, and fill color (any CSS color).'),
  speed: z.number().positive().default(0.3).describe('Seconds for the fill to wipe across.'),
  label: z
    .string()
    .default('Button')
    .describe('Visible text — the fallback when no children/slot is given.'),
});

export type SweepProps = z.input<typeof sweepSchema>;

export const sweepMeta = {
  id: 'sweep',
  name: 'Sweep',
  category: 'button',
  deps: [],
  a11y:
    'Renders a native <button>: focusable, keyboard-activatable, labeled by its text (children or the ' +
    'label prop); forwards disabled + click. The hover fill is instant (no transition) under reduced-motion.',
} as const;
