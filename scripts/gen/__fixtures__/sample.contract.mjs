// A realistic CSS-per-char contract, used as the fixture for the gen unit tests.
// Mirrors the shape of the shipped blur-in/wave components.
/** @type {import('../contract.mjs').ComponentContract} */
export default {
  id: 'fade-up',
  name: 'FadeUp',
  pattern: 'css-per-char',
  blurb: 'A per-character upward fade-in — CSS-only, three frameworks.',
  a11y: 'Full text is exposed via aria-label; animated segments are aria-hidden.',
  deps: [],
  props: [
    { name: 'text', type: 'string', required: true, describe: 'The text to animate.' },
    {
      name: 'by',
      type: 'enum',
      values: ['chars', 'words'],
      default: 'chars',
      describe: 'Split granularity.',
    },
    {
      name: 'distance',
      type: 'number',
      default: 16,
      describe: 'Pixels each segment rises from.',
      cssVar: { name: '--jolt-distance', unit: 'px' },
    },
    {
      name: 'stagger',
      type: 'number',
      default: 0.05,
      describe: 'Seconds between each segment starting.',
      cssVar: { name: '--jolt-stagger', unit: 's' },
    },
    {
      name: 'duration',
      type: 'number',
      default: 0.6,
      describe: 'Seconds each segment takes to resolve.',
      cssVar: { name: '--jolt-duration', unit: 's' },
    },
    {
      name: 'delay',
      type: 'number',
      default: 0,
      describe: 'Seconds to wait before the first segment.',
      cssVar: { name: '--jolt-delay', unit: 's' },
    },
  ],
  parity: { kind: 'per-char', pixelParity: true },
  demoProps: { text: 'Fade up into place' },
  harnessProps: { text: 'Jolt UI' },
  cardText: 'Fade Up',
};
