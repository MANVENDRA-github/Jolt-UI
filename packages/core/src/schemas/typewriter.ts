import { z } from 'zod';

/**
 * Props for the Typewriter component (CSS-only, structural). The shared
 * `styles/typewriter.css` reveals the text by animating an overflow-clipped box's
 * width in `steps()`; the skin sets `--jolt-steps` (character count),
 * `--jolt-duration`, `--jolt-delay`, and `--jolt-caret-width` via CSS custom
 * properties.
 */
export const typewriterSchema = z.object({
  text: z.string().describe('The text to type out.'),
  duration: z.number().positive().default(2.5).describe('Seconds to type the full text.'),
  delay: z.number().nonnegative().default(0).describe('Seconds to wait before typing starts.'),
  caret: z.boolean().default(true).describe('Show the blinking caret.'),
});

export type TypewriterProps = z.input<typeof typewriterSchema>;

export const typewriterMeta = {
  id: 'typewriter',
  name: 'Typewriter',
  category: 'text',
  deps: [],
  a11y: 'Renders the text directly (clipped, not segmented); the caret is decorative.',
} as const;
