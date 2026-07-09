import { z } from 'zod';

/**
 * Props for the StarBorder button (CSS-only, visual-only + a `label` fallback). The skin renders
 * a native `<button>` and forwards native button attrs; the shared `styles/star-border.css` reads
 * these via the CSS custom properties the skin sets.
 */
export const starBorderSchema = z.object({
  color: z.string().default('#14141c').describe('Button surface color (any CSS color).'),
  star: z.string().default('#c6ff4f').describe('Color of the traveling star (any CSS color).'),
  width: z.number().default(2).describe('Border thickness, in pixels.'),
  speed: z.number().default(4).describe('Seconds for one trip around the border.'),
  label: z.string().default('Button').describe('Fallback text when no children are provided.'),
});

export type StarBorderProps = z.input<typeof starBorderSchema>;

export const starBorderMeta = {
  id: 'star-border',
  name: 'StarBorder',
  category: 'button',
  deps: [],
  a11y: 'A native <button>: focusable, keyboard-activatable, and it forwards onClick/disabled. The traveling star is decorative.',
} as const;
