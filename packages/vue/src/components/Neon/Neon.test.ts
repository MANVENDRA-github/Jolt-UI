import { render } from '@testing-library/vue';
import Neon from './Neon.vue';

describe('Neon (vue)', () => {
  it('renders the text directly', () => {
    const { container } = render(Neon, { props: { text: 'Hello' } });
    expect(container.querySelector('.jolt-neon')?.textContent).toBe('Hello');
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(Neon, { props: { text: 'Hi', glow: 7 } });
    const root = container.querySelector<HTMLElement>('.jolt-neon');
    expect(root?.style.getPropertyValue('--jolt-glow')).toBe('7px');
  });
});
