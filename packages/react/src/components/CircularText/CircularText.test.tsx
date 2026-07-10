import { render } from '@testing-library/react';
import { splitSegments } from '@jolt/core';
import { CircularText } from './CircularText';

describe('CircularText (react)', () => {
  it('exposes the full text via aria-label', () => {
    const { container } = render(<CircularText text="Hello" />);
    expect(container.querySelector('[aria-label]')?.getAttribute('aria-label')).toBe('Hello');
  });

  it('renders one aria-hidden segment per character', () => {
    const { container } = render(<CircularText text="Hello" />);
    const segs = container.querySelectorAll('[data-jolt-segment]');
    expect(segs.length).toBe(splitSegments('Hello', 'chars').length);
    expect(Array.from(segs).every((s) => s.getAttribute('aria-hidden') === 'true')).toBe(true);
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(<CircularText text="Hi" radius={7} />);
    const root = container.querySelector<HTMLElement>('.jolt-circular-text');
    expect(root?.style.getPropertyValue('--jolt-radius')).toBe('7px');
  });

  it('publishes the segment count as --jolt-count', () => {
    const { container } = render(<CircularText text="Hello" />);
    const root = container.querySelector<HTMLElement>('.jolt-circular-text');
    expect(root?.style.getPropertyValue('--jolt-count')).toBe(
      String(splitSegments('Hello', 'chars').length),
    );
  });
});
