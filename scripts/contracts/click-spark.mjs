// ClickSpark — wraps your content and throws a burst of sparks from every click.
// DOM + CSS rays (no canvas, no RAF); needs client hydration for the click listener.
export default {
  id: 'click-spark',
  name: 'ClickSpark',
  category: 'effect',
  pattern: 'css-container',
  blurb: 'Throws a burst of sparks from every click',
  a11y:
    'A transparent wrapper around your content — it adds no semantics, and the spark rays are ' +
    'aria-hidden. Clicks pass through to whatever you wrapped.',
  deps: [],
  hydrate: true,
  props: [
    {
      name: 'color',
      type: 'string',
      default: '#c6ff4f',
      describe: 'Spark color (any CSS color).',
      cssVar: { name: '--jolt-color' },
    },
    {
      name: 'size',
      type: 'number',
      default: 12,
      describe: 'How far each ray flies, in pixels.',
      cssVar: { name: '--jolt-size', unit: 'px' },
    },
    {
      name: 'speed',
      type: 'number',
      default: 0.45,
      describe: 'Seconds a burst lasts.',
      cssVar: { name: '--jolt-speed', unit: 's' },
    },
  ],
  parity: { kind: 'container', pixelParity: true },
  demoProps: {},
  harnessProps: {},
  cardText: 'Click Spark',
};
