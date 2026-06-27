import { render } from '@testing-library/react';
import { ShinyText } from './ShinyText';

describe('ShinyText (react)', () => {
  it('renders the text content directly (natively accessible)', () => {
    const { container } = render(<ShinyText text="Hello" />);
    expect(container.querySelector('.jolt-shiny-text')?.textContent).toBe('Hello');
  });

  it('maps duration to a CSS custom property', () => {
    const { container } = render(<ShinyText text="Hi" duration={6} />);
    const root = container.querySelector<HTMLElement>('.jolt-shiny-text');
    expect(root?.style.getPropertyValue('--jolt-duration')).toBe('6s');
  });
});
