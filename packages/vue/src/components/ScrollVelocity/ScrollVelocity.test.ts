import { render } from '@testing-library/vue';
import ScrollVelocity from './ScrollVelocity.vue';

// Mock only the animation primitive to assert structure + lifecycle wiring.
const mocks = vi.hoisted(() => {
  const revert = vi.fn();
  return { revert, createScrollVelocity: vi.fn(() => ({ play: vi.fn(), revert })) };
});
vi.mock('@jolt/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@jolt/core')>();
  return { ...actual, createScrollVelocity: mocks.createScrollVelocity };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ScrollVelocity (vue)', () => {
  it('exposes the text via aria-label and repeats it in an aria-hidden track', () => {
    const { container } = render(ScrollVelocity, { props: { text: 'Jolt' } });
    expect(container.querySelector('[aria-label]')?.getAttribute('aria-label')).toBe('Jolt');
    const track = container.querySelector('[data-jolt-track]');
    expect(track?.getAttribute('aria-hidden')).toBe('true');
    expect(track?.querySelectorAll('span').length).toBe(8);
  });

  it('creates the animation on mount and reverts on unmount', () => {
    const { unmount } = render(ScrollVelocity, { props: { text: 'Hi' } });
    expect(mocks.createScrollVelocity).toHaveBeenCalledTimes(1);
    unmount();
    expect(mocks.revert).toHaveBeenCalledTimes(1);
  });
});
