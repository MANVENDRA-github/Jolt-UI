import { render } from '@testing-library/react';
import { Tilt } from './Tilt';

describe('Tilt (react)', () => {
  it('renders a <div> card wrapping its children', () => {
    const { getByText } = render(<Tilt>Card body</Tilt>);
    expect(getByText('Card body').closest('.jolt-tilt')?.tagName).toBe('DIV');
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(<Tilt color="#fff" speed={5} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.getPropertyValue('--jolt-color')).toBe('#fff');
    expect(el.style.getPropertyValue('--jolt-speed')).toBe('5s');
  });

  it('forwards native div attributes via rest', () => {
    const { getByLabelText } = render(<Tilt aria-label="panel" />);
    expect(getByLabelText('panel')).toBeTruthy();
  });

  it('tracks the pointer on mount and cleans up on unmount without throwing', () => {
    const { unmount } = render(<Tilt>x</Tilt>);
    expect(() => unmount()).not.toThrow();
  });
});
