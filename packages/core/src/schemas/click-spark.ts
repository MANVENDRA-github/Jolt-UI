import { z } from 'zod';

/**
 * Props for the ClickSpark card (CSS-only, visual-only). The skin renders a `<div>` wrapping
 * your content (children/slot); the shared `styles/click-spark.css` reads these via the CSS
 * custom properties the skin sets.
 */
export const clickSparkSchema = z.object({
  color: z.string().default('#c6ff4f').describe('Spark color (any CSS color).'),
  size: z.number().default(12).describe('How far each ray flies, in pixels.'),
  speed: z.number().default(0.45).describe('Seconds a burst lasts.'),
});

export type ClickSparkProps = z.input<typeof clickSparkSchema>;

export const clickSparkMeta = {
  id: 'click-spark',
  name: 'ClickSpark',
  category: 'effect',
  deps: [],
  a11y: 'A transparent wrapper around your content — it adds no semantics, and the spark rays are aria-hidden. Clicks pass through to whatever you wrapped.',
} as const;
