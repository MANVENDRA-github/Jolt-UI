// StarBorder — a bright star travels around the button's border. Interactive: a native
// <button> whose text comes from children/slot, with `label` as the fallback.
export default {
  id: 'star-border',
  name: 'StarBorder',
  category: 'button',
  pattern: 'css-interactive',
  blurb: 'A star travels around the border',
  a11y:
    'A native <button>: focusable, keyboard-activatable, and it forwards onClick/disabled. ' +
    'The traveling star is decorative.',
  deps: [],
  props: [
    {
      name: 'color',
      type: 'string',
      default: '#14141c',
      describe: 'Button surface color (any CSS color).',
      cssVar: { name: '--jolt-color' },
    },
    {
      name: 'star',
      type: 'string',
      default: '#c6ff4f',
      describe: 'Color of the traveling star (any CSS color).',
      cssVar: { name: '--jolt-star' },
    },
    {
      name: 'width',
      type: 'number',
      default: 2,
      describe: 'Border thickness, in pixels.',
      cssVar: { name: '--jolt-width', unit: 'px' },
    },
    {
      name: 'speed',
      type: 'number',
      default: 4,
      describe: 'Seconds for one trip around the border.',
      cssVar: { name: '--jolt-speed', unit: 's' },
    },
    {
      name: 'label',
      type: 'string',
      default: 'Button',
      describe: 'Fallback text when no children are provided.',
    },
  ],
  // A self-running keyframe: its reduced-motion static frame and the harness's freeze
  // end-state diverge, exactly like the Border Draw button it shares an idiom with (D-035).
  parity: { kind: 'interactive', pixelParity: false },
  demoProps: { label: 'Star Border' },
  harnessProps: { label: 'Jolt UI' },
  cardText: 'Star Border',
};
