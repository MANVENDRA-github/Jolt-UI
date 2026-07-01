import { z } from 'zod';

/**
 * Props for the Border Draw button (CSS-only). A ghost button with a gradient border
 * that continuously flows around the perimeter; the shared `styles/border-draw.css`
 * reads `--jolt-color` / `--jolt-speed`. The skin renders a native `<button>` (label
 * via children/slot or this `label` fallback) and forwards click / disabled / native attributes.
 */
export const borderDrawSchema = z.object({
  color: z.string().default('#7c5cff').describe('Border + text color (any CSS color).'),
  speed: z.number().positive().default(3).describe('Seconds per border-gradient sweep.'),
  label: z
    .string()
    .default('Button')
    .describe('Visible text — the fallback when no children/slot is given.'),
});

export type BorderDrawProps = z.input<typeof borderDrawSchema>;

export const borderDrawMeta = {
  id: 'border-draw',
  name: 'BorderDraw',
  category: 'button',
  deps: [],
  a11y:
    'Renders a native <button>: focusable, keyboard-activatable, labeled by its text (children or the ' +
    'label prop); forwards disabled + click. The border flow freezes to a static gradient under reduced-motion.',
} as const;
