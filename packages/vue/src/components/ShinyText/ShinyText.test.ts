import { render } from '@testing-library/vue';
import ShinyText from './ShinyText.vue';

describe('ShinyText (vue)', () => {
  it('renders the text content directly (natively accessible)', () => {
    const { container } = render(ShinyText, { props: { text: 'Hello' } });
    expect(container.querySelector('.jolt-shiny-text')?.textContent).toBe('Hello');
  });

  it('maps duration to a CSS custom property', () => {
    const { container } = render(ShinyText, { props: { text: 'Hi', duration: 6 } });
    const root = container.querySelector<HTMLElement>('.jolt-shiny-text');
    expect(root?.style.getPropertyValue('--jolt-duration')).toBe('6s');
  });
});
