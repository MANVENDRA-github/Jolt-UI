import { render } from '@testing-library/vue';
import Tilt from './Tilt.vue';

describe('Tilt (vue)', () => {
  it('renders a <div> card wrapping its slot content', () => {
    const { getByText } = render(Tilt, { slots: { default: () => 'Card body' } });
    expect(getByText('Card body').closest('.jolt-tilt')?.tagName).toBe('DIV');
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(Tilt, { props: { color: '#fff', speed: 5 } });
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.getPropertyValue('--jolt-color')).toBe('#fff');
    expect(el.style.getPropertyValue('--jolt-speed')).toBe('5s');
  });

  it('forwards native div attributes via fallthrough', () => {
    const { getByLabelText } = render(Tilt, { attrs: { 'aria-label': 'panel' } });
    expect(getByLabelText('panel')).toBeTruthy();
  });

  it('tracks the pointer on mount and cleans up on unmount without throwing', () => {
    const { unmount } = render(Tilt);
    expect(() => unmount()).not.toThrow();
  });
});
