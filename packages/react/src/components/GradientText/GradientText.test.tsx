import { render } from '@testing-library/react';
import { GradientText } from './GradientText';

describe('GradientText (react)', () => {
  it('renders the text content directly (natively accessible)', () => {
    const { container } = render(<GradientText text="Hello" />);
    expect(container.querySelector('.jolt-gradient-text')?.textContent).toBe('Hello');
  });

  it('maps colors + duration to CSS custom properties', () => {
    const { container } = render(
      <GradientText text="Hi" colors={['#111111', '#222222']} duration={8} />,
    );
    const root = container.querySelector<HTMLElement>('.jolt-gradient-text');
    expect(root?.style.getPropertyValue('--jolt-duration')).toBe('8s');
    expect(root?.style.getPropertyValue('--jolt-gradient')).toContain('#111111');
  });
});
