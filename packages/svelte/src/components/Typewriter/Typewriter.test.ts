import { render } from '@testing-library/svelte';
import Typewriter from './Typewriter.svelte';

describe('Typewriter (svelte)', () => {
  it('renders the text content directly (natively accessible)', () => {
    const { container } = render(Typewriter, { props: { text: 'Hello' } });
    expect(container.querySelector('.jolt-typewriter')?.textContent).toBe('Hello');
  });

  it('maps text length + duration to CSS custom properties', () => {
    const { container } = render(Typewriter, { props: { text: 'Hello', duration: 4 } });
    const root = container.querySelector<HTMLElement>('.jolt-typewriter');
    expect(root?.style.getPropertyValue('--jolt-steps')).toBe('5');
    expect(root?.style.getPropertyValue('--jolt-duration')).toBe('4s');
  });

  it('hides the caret when caret is false', () => {
    const { container } = render(Typewriter, { props: { text: 'Hi', caret: false } });
    const root = container.querySelector<HTMLElement>('.jolt-typewriter');
    expect(root?.style.getPropertyValue('--jolt-caret-width')).toBe('0');
  });
});
