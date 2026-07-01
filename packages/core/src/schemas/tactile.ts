import { z } from 'zod';

/**
 * Props for the Tactile button (CSS-only). A raised button that presses down with a
 * collapsing shadow on `:active`; the shared `styles/tactile.css` reads `--jolt-color`
 * / `--jolt-speed`. The skin renders a native `<button>` (label via children/slot or
 * this `label` fallback) and forwards click / disabled / native attributes.
 */
export const tactileSchema = z.object({
  color: z.string().default('#7c5cff').describe('Button color (any CSS color).'),
  speed: z.number().positive().default(0.12).describe('Seconds for the press transition.'),
  label: z
    .string()
    .default('Button')
    .describe('Visible text — the fallback when no children/slot is given.'),
});

export type TactileProps = z.input<typeof tactileSchema>;

export const tactileMeta = {
  id: 'tactile',
  name: 'Tactile',
  category: 'button',
  deps: [],
  a11y:
    'Renders a native <button>: focusable, keyboard-activatable, labeled by its text (children or the ' +
    'label prop); forwards disabled + click. The press is instant (no transition) under reduced-motion.',
} as const;
