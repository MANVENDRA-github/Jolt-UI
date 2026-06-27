import { render } from '@testing-library/vue';
import GradientText from './GradientText.vue';

describe('GradientText (vue)', () => {
  it('renders the text content directly (natively accessible)', () => {
    const { container } = render(GradientText, { props: { text: 'Hello' } });
    expect(container.querySelector('.jolt-gradient-text')?.textContent).toBe('Hello');
  });

  it('maps colors + duration to CSS custom properties', () => {
    const { container } = render(GradientText, {
      props: { text: 'Hi', colors: ['#111111', '#222222'], duration: 8 },
    });
    const root = container.querySelector<HTMLElement>('.jolt-gradient-text');
    expect(root?.style.getPropertyValue('--jolt-duration')).toBe('8s');
    expect(root?.style.getPropertyValue('--jolt-gradient')).toContain('#111111');
  });
});
