import { z } from 'zod';

/**
 * Props for the Spotlight card. A presentational container whose radial glow follows the
 * cursor — the shared `styles/spotlight.css` reads `--jolt-color` / `--jolt-size` /
 * `--jolt-opacity`, and the pointer behavior (`behavior/pointer.ts`) updates `--jolt-x` /
 * `--jolt-y`. The skin renders a `<div>` wrapping your content (children/slot).
 */
export const spotlightSchema = z.object({
  color: z.string().default('#7c5cff').describe('Glow color (any CSS color).'),
  size: z.number().positive().default(60).describe('Glow radius as a % of the card.'),
  opacity: z.number().min(0).max(1).default(0.35).describe('Peak glow opacity (0–1).'),
});

export type SpotlightProps = z.input<typeof spotlightSchema>;

export const spotlightMeta = {
  id: 'spotlight',
  name: 'Spotlight',
  category: 'card',
  deps: [],
  a11y:
    'Renders a plain presentational <div> wrapping your content; the cursor-following glow is ' +
    'purely decorative. Under reduced-motion the glow stays centered and the pointer is not tracked.',
} as const;
