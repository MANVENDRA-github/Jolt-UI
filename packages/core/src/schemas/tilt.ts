import { z } from 'zod';

/**
 * Props for the Tilt card. A presentational container that rotates in 3-D toward the cursor
 * — the shared `styles/tilt.css` reads `--jolt-color` / `--jolt-speed`, and the pointer
 * behavior (`behavior/pointer.ts`) updates `--jolt-rx` / `--jolt-ry`. The skin renders a
 * `<div>` wrapping your content (children/slot).
 */
export const tiltSchema = z.object({
  color: z.string().default('#6d5efc').describe('Accent color for the card surface.'),
  maxTilt: z.number().positive().default(12).describe('Max rotation per axis, in degrees.'),
  speed: z.number().positive().default(0.15).describe('Seconds for the tilt to ease.'),
});

export type TiltProps = z.input<typeof tiltSchema>;

export const tiltMeta = {
  id: 'tilt',
  name: 'Tilt',
  category: 'card',
  deps: [],
  a11y:
    'Renders a plain presentational <div> wrapping your content; the cursor-driven 3-D tilt is ' +
    'purely decorative. Under reduced-motion the card stays flat and the pointer is not tracked.',
} as const;
