import { z } from 'zod';

/**
 * Props for the Dock — a row of labelled items that magnify toward the cursor, like the macOS
 * dock. The shared pointer behavior (`behavior/dock.ts`) writes each item's `--jolt-scale`; the
 * shared `styles/dock.css` reads it. Visual-only besides the `items` list.
 */
export const dockSchema = z.object({
  items: z
    .array(z.string())
    .min(1)
    .default(['Home', 'Search', 'Files', 'Mail', 'Trash'])
    .describe('The dock items, left to right.'),
  size: z.number().positive().default(44).describe('Base size of each item, in pixels.'),
  magnification: z
    .number()
    .min(1)
    .default(1.8)
    .describe('Scale of the item directly under the cursor (1 = no magnification).'),
  range: z
    .number()
    .positive()
    .default(140)
    .describe('Distance over which magnification falls off, in pixels.'),
  color: z.string().default('#7c5cff').describe('Accent color of the items.'),
});

export type DockProps = z.input<typeof dockSchema>;

export const dockMeta = {
  id: 'dock',
  name: 'Dock',
  category: 'ui',
  deps: [],
  a11y:
    'A list of items; each has an accessible label. The magnification is decorative — under ' +
    'reduced-motion the items rest at their base size and the pointer is not tracked.',
} as const;
