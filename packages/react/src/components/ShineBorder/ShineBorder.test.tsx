import { render } from '@testing-library/react';
import { ShineBorder } from './ShineBorder';

describe('ShineBorder (react)', () => {
  it('renders a <div> card wrapping its children', () => {
    const { getByText } = render(<ShineBorder>Card body</ShineBorder>);
    expect(getByText('Card body').closest('.jolt-shine-border')?.tagName).toBe('DIV');
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(<ShineBorder color="#fff" speed={5} width={4} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.getPropertyValue('--jolt-color')).toBe('#fff');
    expect(el.style.getPropertyValue('--jolt-speed')).toBe('5s');
    expect(el.style.getPropertyValue('--jolt-width')).toBe('4px');
  });

  it('forwards native div attributes via rest', () => {
    const { getByLabelText } = render(<ShineBorder aria-label="panel" />);
    expect(getByLabelText('panel')).toBeTruthy();
  });
});
