import { z } from 'zod';

/**
 * Props for the Scramble component (GSAP ScrambleTextPlugin). The core factory
 * decodes the element's text into `text` from a churn of random characters.
 */
export const scrambleSchema = z.object({
  text: z.string().describe('The final decoded text.'),
  duration: z.number().positive().default(1.5).describe('Seconds for the decode.'),
  delay: z.number().nonnegative().default(0).describe('Seconds to wait before decoding starts.'),
  chars: z
    .string()
    .default('upperCase')
    .describe("Scramble set: 'upperCase', 'lowerCase', 'upperAndLowerCase', or custom characters."),
  revealDelay: z
    .number()
    .nonnegative()
    .default(0)
    .describe('Seconds before characters begin resolving to the final text.'),
  speed: z.number().positive().default(1).describe('How fast the scrambled characters churn.'),
});

/** Public prop shape (`text` required; everything else optional with defaults). */
export type ScrambleProps = z.input<typeof scrambleSchema>;
/** Fully-resolved options after defaults are applied. */
export type ScrambleOptions = z.output<typeof scrambleSchema>;

export const scrambleMeta = {
  id: 'scramble',
  name: 'Scramble',
  category: 'text',
  deps: ['gsap'],
  a11y: 'The full text is exposed via aria-label; the scrambling characters are decorative.',
} as const;
