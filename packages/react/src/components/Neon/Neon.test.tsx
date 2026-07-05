import { render } from '@testing-library/react';
import { Neon } from './Neon';

describe('Neon (react)', () => {
  it('renders the text directly', () => {
    const { container } = render(<Neon text="Hello" />);
    expect(container.querySelector('.jolt-neon')?.textContent).toBe('Hello');
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(<Neon text="Hi" glow={7} />);
    const root = container.querySelector<HTMLElement>('.jolt-neon');
    expect(root?.style.getPropertyValue('--jolt-glow')).toBe('7px');
  });
});
