import { render } from '@testing-library/react';
import { GlitchText } from './GlitchText';

describe('GlitchText (react)', () => {
  it('renders the text directly', () => {
    const { container } = render(<GlitchText text="Hello" />);
    expect(container.querySelector('.jolt-glitch-text')?.textContent).toBe('Hello');
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(<GlitchText text="Hi" color="#7c5cff" />);
    const root = container.querySelector<HTMLElement>('.jolt-glitch-text');
    expect(root?.style.getPropertyValue('--jolt-color')).toBe('#7c5cff');
  });
});
