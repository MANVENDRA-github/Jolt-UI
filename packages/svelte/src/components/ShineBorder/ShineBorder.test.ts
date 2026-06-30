import { render } from '@testing-library/svelte';
import ShineBorder from './ShineBorder.svelte';

describe('ShineBorder (svelte)', () => {
  it('maps props to CSS custom properties on a <div> card', () => {
    const { container } = render(ShineBorder, { props: { color: '#fff', speed: 5, width: 4 } });
    const el = container.querySelector('.jolt-shine-border') as HTMLElement;
    expect(el.tagName).toBe('DIV');
    expect(el.style.getPropertyValue('--jolt-color')).toBe('#fff');
    expect(el.style.getPropertyValue('--jolt-speed')).toBe('5s');
    expect(el.style.getPropertyValue('--jolt-width')).toBe('4px');
  });

  it('forwards native div attributes via rest', () => {
    const { getByLabelText } = render(ShineBorder, { props: { 'aria-label': 'panel' } });
    expect(getByLabelText('panel')).toBeTruthy();
  });
});
