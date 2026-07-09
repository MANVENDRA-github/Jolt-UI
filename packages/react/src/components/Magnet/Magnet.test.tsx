import { render } from '@testing-library/react';
import { Magnet } from './Magnet';

describe('Magnet (react)', () => {
  it('renders a <div> card wrapping its content', () => {
    const { getByText } = render(<Magnet>Card body</Magnet>);
    expect(getByText('Card body').closest('.jolt-magnet')?.tagName).toBe('DIV');
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(<Magnet strength={7} />);
    const el = container.querySelector('.jolt-magnet') as HTMLElement;
    expect(el.style.getPropertyValue('--jolt-strength')).toBe('7px');
  });

  it('mounts and unmounts without throwing', () => {
    const { unmount } = render(<Magnet />);
    expect(() => unmount()).not.toThrow();
  });

  it('tracks the pointer: the resting (zero) pull is written on mount', () => {
    const { container } = render(<Magnet>Jolt UI</Magnet>);
    const el = container.querySelector('.jolt-magnet') as HTMLElement;
    expect(el.style.getPropertyValue('--jolt-fx')).toBe('0');
    expect(el.style.getPropertyValue('--jolt-fy')).toBe('0');
  });
});
