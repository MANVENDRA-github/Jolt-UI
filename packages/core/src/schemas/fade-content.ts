import { z } from 'zod';

/**
 * Props for the FadeContent card (CSS-only, visual-only). The skin renders a `<div>` wrapping
 * your content (children/slot); the shared `styles/fade-content.css` reads these via the CSS
 * custom properties the skin sets.
 */
export const fadeContentSchema = z.object({
  duration: z.number().default(0.7).describe('Seconds the entrance takes.'),
  delay: z.number().default(0).describe('Seconds to wait after the content enters view.'),
  blur: z.number().default(6).describe('How blurred the content starts, in pixels.'),
});

export type FadeContentProps = z.input<typeof fadeContentSchema>;

export const fadeContentMeta = {
  id: 'fade-content',
  name: 'FadeContent',
  category: 'effect',
  deps: [],
  a11y: 'A transparent wrapper around your content — it adds no semantics. The content is visible by default and is only hidden once JS arms the reveal, so no-JS and reduced-motion users always see it.',
} as const;
