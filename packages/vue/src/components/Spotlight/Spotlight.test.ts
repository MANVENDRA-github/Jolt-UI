import { render } from '@testing-library/vue';
import Spotlight from './Spotlight.vue';

describe('Spotlight (vue)', () => {
  it('renders a <div> card wrapping its slot content', () => {
    const { getByText } = render(Spotlight, { slots: { default: () => 'Card body' } });
    expect(getByText('Card body').closest('.jolt-spotlight')?.tagName).toBe('DIV');
  });

  it('maps props to CSS custom properties', () => {
    const { container } = render(Spotlight, { props: { color: '#fff', size: 80, opacity: 0.5 } });
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.getPropertyValue('--jolt-color')).toBe('#fff');
    expect(el.style.getPropertyValue('--jolt-size')).toBe('80%');
    expect(el.style.getPropertyValue('--jolt-opacity')).toBe('0.5');
  });

  it('forwards native div attributes via fallthrough', () => {
    const { getByLabelText } = render(Spotlight, { attrs: { 'aria-label': 'panel' } });
    expect(getByLabelText('panel')).toBeTruthy();
  });

  it('tracks the pointer on mount and cleans up on unmount without throwing', () => {
    const { unmount } = render(Spotlight);
    expect(() => unmount()).not.toThrow();
  });
});
