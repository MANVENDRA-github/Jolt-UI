import { render } from '@testing-library/svelte';
import GlitchText from './GlitchText.svelte';

describe('GlitchText (svelte)', () => {
  it('renders the text directly', () => {
    const { container } = render(GlitchText, { props: { text: 'Hello' } });
    expect(container.querySelector('.jolt-glitch-text')?.textContent).toBe('Hello');
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(GlitchText, { props: { text: 'Hi', color: '#7c5cff' } });
    const root = container.querySelector<HTMLElement>('.jolt-glitch-text');
    expect(root?.style.getPropertyValue('--jolt-color')).toBe('#7c5cff');
  });
});
