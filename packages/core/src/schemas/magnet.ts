import { z } from 'zod';

/**
 * Props for the Magnet card (CSS-only, visual-only). The skin renders a `<div>` wrapping
 * your content (children/slot); the shared `styles/magnet.css` reads these via the CSS
 * custom properties the skin sets.
 */
export const magnetSchema = z.object({
  strength: z
    .number()
    .default(14)
    .describe('How far the content can travel toward the cursor, in pixels.'),
  speed: z
    .number()
    .default(0.25)
    .describe('Seconds the content takes to catch up with the cursor.'),
});

export type MagnetProps = z.input<typeof magnetSchema>;

export const magnetMeta = {
  id: 'magnet',
  name: 'Magnet',
  category: 'effect',
  deps: [],
  a11y: 'A transparent wrapper around your content — it adds no semantics and the pull is purely decorative. Under reduced-motion the content stays put and the pointer is not tracked.',
} as const;
