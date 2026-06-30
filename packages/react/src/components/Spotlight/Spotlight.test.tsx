import { render } from '@testing-library/react';
import { Spotlight } from './Spotlight';

describe('Spotlight (react)', () => {
  it('renders a <div> card wrapping its children', () => {
    const { getByText } = render(<Spotlight>Card body</Spotlight>);
    const child = getByText('Card body');
    expect(child.closest('.jolt-spotlight')?.tagName).toBe('DIV');
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(<Spotlight color="#fff" size={80} opacity={0.5} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.getPropertyValue('--jolt-color')).toBe('#fff');
    expect(el.style.getPropertyValue('--jolt-size')).toBe('80%');
    expect(el.style.getPropertyValue('--jolt-opacity')).toBe('0.5');
  });

  it('forwards native div attributes via rest', () => {
    const { getByLabelText } = render(<Spotlight aria-label="panel" />);
    expect(getByLabelText('panel')).toBeTruthy();
  });

  it('tracks the pointer on mount and cleans up on unmount without throwing', () => {
    const { unmount } = render(<Spotlight>x</Spotlight>);
    expect(() => unmount()).not.toThrow();
  });
});
