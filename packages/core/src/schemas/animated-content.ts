import { z } from 'zod';

/**
 * Props for the AnimatedContent card (CSS-only, visual-only). The skin renders a `<div>` wrapping
 * your content (children/slot); the shared `styles/animated-content.css` reads these via the CSS
 * custom properties the skin sets.
 */
export const animatedContentSchema = z.object({
  distance: z.number().default(40).describe('How far the content travels, in pixels.'),
  scale: z.number().default(0.94).describe('Scale the content starts at (1 = no scaling).'),
  duration: z.number().default(0.7).describe('Seconds the entrance takes.'),
  delay: z.number().default(0).describe('Seconds to wait after the content enters view.'),
});

export type AnimatedContentProps = z.input<typeof animatedContentSchema>;

export const animatedContentMeta = {
  id: 'animated-content',
  name: 'AnimatedContent',
  category: 'effect',
  deps: [],
  a11y: 'A transparent wrapper around your content — it adds no semantics. The content is visible by default and is only hidden once JS arms the reveal, so no-JS and reduced-motion users always see it.',
} as const;
