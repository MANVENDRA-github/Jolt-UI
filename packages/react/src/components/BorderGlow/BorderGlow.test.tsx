import { render } from '@testing-library/react';
import { BorderGlow } from './BorderGlow';

describe('BorderGlow (react)', () => {
  it('renders a <div> card wrapping its content', () => {
    const { getByText } = render(<BorderGlow>Card body</BorderGlow>);
    expect(getByText('Card body').closest('.jolt-border-glow')?.tagName).toBe('DIV');
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(<BorderGlow color="#7c5cff" />);
    const el = container.querySelector('.jolt-border-glow') as HTMLElement;
    expect(el.style.getPropertyValue('--jolt-color')).toBe('#7c5cff');
  });

  it('mounts and unmounts without throwing', () => {
    const { unmount } = render(<BorderGlow />);
    expect(() => unmount()).not.toThrow();
  });

  it('tracks the pointer: the resting centre state is written on mount', () => {
    const { container } = render(<BorderGlow />);
    const el = container.querySelector('.jolt-border-glow') as HTMLElement;
    expect(el.style.getPropertyValue('--jolt-x')).toBe('50%');
    expect(el.style.getPropertyValue('--jolt-y')).toBe('50%');
  });
});
