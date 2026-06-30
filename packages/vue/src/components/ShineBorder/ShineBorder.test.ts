import { render } from '@testing-library/vue';
import ShineBorder from './ShineBorder.vue';

describe('ShineBorder (vue)', () => {
  it('renders a <div> card wrapping its slot content', () => {
    const { getByText } = render(ShineBorder, { slots: { default: () => 'Card body' } });
    expect(getByText('Card body').closest('.jolt-shine-border')?.tagName).toBe('DIV');
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(ShineBorder, { props: { color: '#fff', speed: 5, width: 4 } });
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.getPropertyValue('--jolt-color')).toBe('#fff');
    expect(el.style.getPropertyValue('--jolt-speed')).toBe('5s');
    expect(el.style.getPropertyValue('--jolt-width')).toBe('4px');
  });

  it('forwards native div attributes via fallthrough', () => {
    const { getByLabelText } = render(ShineBorder, { attrs: { 'aria-label': 'panel' } });
    expect(getByLabelText('panel')).toBeTruthy();
  });
});
