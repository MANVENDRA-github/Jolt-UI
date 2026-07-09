// TrueFocus — the text rests softly blurred and a sharp focus sweeps across it, one
// segment at a time. CSS-only, per-character (the sweep is a per-segment phase offset).
export default {
  id: 'true-focus',
  name: 'TrueFocus',
  pattern: 'css-per-char',
  blurb: 'A sharp focus sweeps across softly blurred text',
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
      name: 'blur',
      type: 'number',
      default: 4,
      describe: 'Blur radius of the out-of-focus segments, in pixels.',
      cssVar: { name: '--jolt-blur', unit: 'px' },
    },
    {
      name: 'dim',
      type: 'number',
      default: 0.55,
      describe: 'Opacity of the out-of-focus segments (0–1).',
      cssVar: { name: '--jolt-dim' },
    },
    {
      name: 'speed',
      type: 'number',
      default: 0.28,
      describe: 'Seconds the focus rests on each segment.',
      cssVar: { name: '--jolt-speed', unit: 's' },
    },
  ],
  parity: { kind: 'per-char', pixelParity: true },
  demoProps: { text: 'True Focus' },
  harnessProps: { text: 'Jolt UI' },
  cardText: 'True Focus',
};
