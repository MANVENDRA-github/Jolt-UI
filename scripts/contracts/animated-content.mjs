// AnimatedContent — wraps your content and slides + scales it in when it scrolls into view.
// Same scroll-reveal behavior as FadeContent, a different entrance.
export default {
  id: 'animated-content',
  name: 'AnimatedContent',
  category: 'effect',
  pattern: 'css-container',
  blurb: 'Slides and scales your content in when it scrolls into view',
  a11y:
    'A transparent wrapper around your content — it adds no semantics. The content is visible ' +
    'by default and is only hidden once JS arms the reveal, so no-JS and reduced-motion users ' +
    'always see it.',
  deps: [],
  hydrate: true,
  props: [
    {
      name: 'distance',
      type: 'number',
      default: 40,
      describe: 'How far the content travels, in pixels.',
      cssVar: { name: '--jolt-distance', unit: 'px' },
    },
    {
      name: 'scale',
      type: 'number',
      default: 0.94,
      describe: 'Scale the content starts at (1 = no scaling).',
      cssVar: { name: '--jolt-scale' },
    },
    {
      name: 'duration',
      type: 'number',
      default: 0.7,
      describe: 'Seconds the entrance takes.',
      cssVar: { name: '--jolt-duration', unit: 's' },
    },
    {
      name: 'delay',
      type: 'number',
      default: 0,
      describe: 'Seconds to wait after the content enters view.',
      cssVar: { name: '--jolt-delay', unit: 's' },
    },
  ],
  parity: { kind: 'container', pixelParity: true },
  demoProps: {},
  harnessProps: {},
  cardText: 'Animated Content',
};
