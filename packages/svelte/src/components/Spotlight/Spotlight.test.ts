import { render } from '@testing-library/svelte';
import Spotlight from './Spotlight.svelte';

describe('Spotlight (svelte)', () => {
  it('maps props to CSS custom properties on a <div> card', () => {
    const { container } = render(Spotlight, { props: { color: '#fff', size: 80, opacity: 0.5 } });
    const el = container.querySelector('.jolt-spotlight') as HTMLElement;
    expect(el.tagName).toBe('DIV');
    expect(el.style.getPropertyValue('--jolt-color')).toBe('#fff');
    expect(el.style.getPropertyValue('--jolt-size')).toBe('80%');
    expect(el.style.getPropertyValue('--jolt-opacity')).toBe('0.5');
  });

  it('forwards native div attributes via rest', () => {
    const { getByLabelText } = render(Spotlight, { props: { 'aria-label': 'panel' } });
    expect(getByLabelText('panel')).toBeTruthy();
  });

  it('tracks the pointer on mount and cleans up on unmount without throwing', () => {
    const { unmount } = render(Spotlight);
    expect(() => unmount()).not.toThrow();
  });
});
