import { z } from 'zod';

/**
 * Props for the Gradient button (CSS-only). A multi-color gradient flows across the
 * surface; the shared `styles/gradient.css` reads `--jolt-gradient` (built by the skin
 * from `colors`) and `--jolt-speed`. The skin renders a native `<button>` (label via
 * children/slot or this `label` fallback) and forwards click / disabled / native attributes.
 */
export const gradientSchema = z.object({
  colors: z
    .array(z.string())
    .min(2)
    .default(['#7c5cff', '#a855f7', '#ec4899'])
    .describe('Gradient color stops, flowing left to right and looping.'),
  speed: z.number().positive().default(4).describe('Seconds per gradient sweep.'),
  label: z
    .string()
    .default('Button')
    .describe('Visible text — the fallback when no children/slot is given.'),
});

export type GradientProps = z.input<typeof gradientSchema>;

export const gradientMeta = {
  id: 'gradient',
  name: 'Gradient',
  category: 'button',
  deps: [],
  a11y:
    'Renders a native <button>: focusable, keyboard-activatable, labeled by its text (children or ' +
    'the label prop); forwards disabled + click. The flow freezes to a static gradient under reduced-motion.',
} as const;
