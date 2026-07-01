import { z } from 'zod';

/**
 * Props for the Shimmer button (CSS-only). A diagonal sheen sweeps across the
 * surface; the shared `styles/shimmer.css` reads `--jolt-color` / `--jolt-shine`
 * / `--jolt-speed`. The skin renders a native `<button>` (label via children/slot
 * or this `label` fallback) and forwards click / disabled / native attributes.
 */
export const shimmerSchema = z.object({
  color: z.string().default('#7c5cff').describe('Base button color (any CSS color).'),
  shine: z.string().default('#b3a9ff').describe('Sheen highlight swept across the surface.'),
  speed: z.number().positive().default(3).describe('Seconds per sheen sweep.'),
  label: z
    .string()
    .default('Button')
    .describe('Visible text — the fallback when no children/slot is given.'),
});

export type ShimmerProps = z.input<typeof shimmerSchema>;

export const shimmerMeta = {
  id: 'shimmer',
  name: 'Shimmer',
  category: 'button',
  deps: [],
  a11y:
    'Renders a native <button>: focusable, keyboard-activatable, labeled by its text (children or ' +
    'the label prop); forwards disabled + click. The sheen freezes to a solid fill under reduced-motion.',
} as const;
