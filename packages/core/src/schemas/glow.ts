import { z } from 'zod';

/**
 * Props for the Glow button (CSS-only). A breathing box-shadow halo pulses in and
 * out; the shared `styles/glow.css` reads `--jolt-color` / `--jolt-speed`. The skin
 * renders a native `<button>` (label via children/slot or this `label` fallback) and
 * forwards click / disabled / native attributes.
 */
export const glowSchema = z.object({
  color: z.string().default('#6d5efc').describe('Button + glow color (any CSS color).'),
  speed: z.number().positive().default(2).describe('Seconds per glow pulse.'),
  label: z
    .string()
    .default('Button')
    .describe('Visible text — the fallback when no children/slot is given.'),
});

export type GlowProps = z.input<typeof glowSchema>;

export const glowMeta = {
  id: 'glow',
  name: 'Glow',
  category: 'button',
  deps: [],
  a11y:
    'Renders a native <button>: focusable, keyboard-activatable, labeled by its text (children or ' +
    'the label prop); forwards disabled + click. The pulse settles to a steady glow under reduced-motion.',
} as const;
