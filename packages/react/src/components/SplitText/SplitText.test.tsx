import { render } from '@testing-library/react';
import { splitSegments } from '@jolt/core';
import { SplitText } from './SplitText';

describe('SplitText (react)', () => {
  it('exposes the full text via aria-label', () => {
    const { container } = render(<SplitText text="Hello" />);
    expect(container.querySelector('[aria-label]')?.getAttribute('aria-label')).toBe('Hello');
  });

  it('renders one aria-hidden segment per character', () => {
    const { container } = render(<SplitText text="Hello" />);
    const segs = container.querySelectorAll('[data-jolt-segment]');
    expect(segs.length).toBe(splitSegments('Hello', 'chars').length);
    expect(Array.from(segs).every((s) => s.getAttribute('aria-hidden') === 'true')).toBe(true);
  });

  it('preserves the rendered text content', () => {
    const { container } = render(<SplitText text="Hello" />);
    expect(container.querySelector('[aria-label]')?.textContent).toBe('Hello');
  });
});
