import { z } from 'zod';

/**
 * Props for the Wave component (CSS-only). The shared `styles/wave.css` reads
 * these via CSS custom properties the skin sets from these values.
 */
export const waveSchema = z.object({
  text: z.string().describe('The text to animate.'),
  by: z.enum(['chars', 'words']).default('chars').describe('Split granularity.'),
  amplitude: z
    .number()
    .nonnegative()
    .default(10)
    .describe('Peak vertical travel of each segment, in pixels.'),
  duration: z.number().positive().default(1.5).describe('Seconds for one full bob cycle.'),
  stagger: z
    .number()
    .nonnegative()
    .default(0.08)
    .describe('Seconds between adjacent segments — sets the wave speed.'),
  delay: z.number().nonnegative().default(0).describe('Seconds to wait before the wave starts.'),
});

export type WaveProps = z.input<typeof waveSchema>;

export const waveMeta = {
  id: 'wave',
  name: 'Wave',
  category: 'text',
  deps: [],
  a11y: 'Full text is exposed via aria-label; animated segments are aria-hidden.',
} as const;
