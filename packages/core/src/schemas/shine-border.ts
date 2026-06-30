import { z } from 'zod';

/**
 * Props for the Shine Border card. A presentational container with a gradient border that
 * continuously flows around the perimeter (self-running CSS, no pointer). The shared
 * `styles/shine-border.css` reads `--jolt-color` / `--jolt-speed` / `--jolt-width`; the
 * skin renders a `<div>` wrapping your content (children/slot).
 */
export const shineBorderSchema = z.object({
  color: z.string().default('#6d5efc').describe('Border gradient base color.'),
  speed: z.number().positive().default(3).describe('Seconds per border-gradient sweep.'),
  width: z.number().positive().default(2).describe('Border thickness in px.'),
});

export type ShineBorderProps = z.input<typeof shineBorderSchema>;

export const shineBorderMeta = {
  id: 'shine-border',
  name: 'Shine Border',
  category: 'card',
  deps: [],
  a11y:
    'Renders a plain presentational <div> wrapping your content; the animated gradient border is ' +
    'decorative. The border flow freezes to a static gradient under reduced-motion.',
} as const;
