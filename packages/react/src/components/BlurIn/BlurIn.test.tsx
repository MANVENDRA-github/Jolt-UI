import { render } from '@testing-library/react';
import { splitSegments } from '@jolt/core';
import { BlurIn } from './BlurIn';

describe('BlurIn (react)', () => {
  it('exposes the full text via aria-label', () => {
    const { container } = render(<BlurIn text="Hello" />);
    expect(container.querySelector('[aria-label]')?.getAttribute('aria-label')).toBe('Hello');
  });

  it('renders one aria-hidden segment per character', () => {
    const { container } = render(<BlurIn text="Hello" />);
    const segs = container.querySelectorAll('[data-jolt-segment]');
    expect(segs.length).toBe(splitSegments('Hello', 'chars').length);
    expect(Array.from(segs).every((s) => s.getAttribute('aria-hidden') === 'true')).toBe(true);
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(<BlurIn text="Hi" blur={20} />);
    const root = container.querySelector<HTMLElement>('.jolt-blur-in');
    expect(root?.style.getPropertyValue('--jolt-blur')).toBe('20px');
  });
});
