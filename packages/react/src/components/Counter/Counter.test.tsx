import { render } from '@testing-library/react';
import { Counter } from './Counter';

describe('Counter (react)', () => {
  it('exposes the whole number via aria-label', () => {
    const { container } = render(<Counter value={42} />);
    expect(container.querySelector('.jolt-counter')?.getAttribute('aria-label')).toBe('42');
  });

  it('renders one aria-hidden rolling column per digit', () => {
    const { container } = render(<Counter value={1990} />);
    const cols = container.querySelectorAll('[data-jolt-col]');
    expect(cols.length).toBe(4);
    expect(Array.from(cols).every((c) => c.getAttribute('aria-hidden') === 'true')).toBe(true);
  });

  it('sets each column strip to its target digit', () => {
    const { container } = render(<Counter value={42} />);
    const strips = container.querySelectorAll<HTMLElement>('[data-jolt-strip]');
    expect(strips[0].style.getPropertyValue('--jolt-digit')).toBe('4');
    expect(strips[1].style.getPropertyValue('--jolt-digit')).toBe('2');
  });

  it('zero-pads to the requested minimum column count', () => {
    const { container } = render(<Counter value={7} digits={3} />);
    expect(container.querySelectorAll('[data-jolt-col]').length).toBe(3);
    expect(container.querySelector('.jolt-counter')?.getAttribute('aria-label')).toBe('007');
  });

  it('maps duration + color to CSS custom properties', () => {
    const { container } = render(<Counter value={1} duration={2} color="#fff" />);
    const el = container.querySelector('.jolt-counter') as HTMLElement;
    expect(el.style.getPropertyValue('--jolt-duration')).toBe('2s');
    expect(el.style.getPropertyValue('--jolt-color')).toBe('#fff');
  });
});
