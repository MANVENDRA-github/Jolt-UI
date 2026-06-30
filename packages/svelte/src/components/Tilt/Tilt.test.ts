import { render } from '@testing-library/svelte';
import Tilt from './Tilt.svelte';

describe('Tilt (svelte)', () => {
  it('maps props to CSS custom properties on a <div> card', () => {
    const { container } = render(Tilt, { props: { color: '#fff', speed: 5 } });
    const el = container.querySelector('.jolt-tilt') as HTMLElement;
    expect(el.tagName).toBe('DIV');
    expect(el.style.getPropertyValue('--jolt-color')).toBe('#fff');
    expect(el.style.getPropertyValue('--jolt-speed')).toBe('5s');
  });

  it('forwards native div attributes via rest', () => {
    const { getByLabelText } = render(Tilt, { props: { 'aria-label': 'panel' } });
    expect(getByLabelText('panel')).toBeTruthy();
  });

  it('tracks the pointer on mount and cleans up on unmount without throwing', () => {
    const { unmount } = render(Tilt);
    expect(() => unmount()).not.toThrow();
  });
});
