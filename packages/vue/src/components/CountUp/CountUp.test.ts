import { render } from '@testing-library/vue';
import CountUp from './CountUp.vue';

// Mock only the animation primitive to assert lifecycle wiring deterministically.
const mocks = vi.hoisted(() => {
  const revert = vi.fn();
  return { revert, createCountUp: vi.fn(() => ({ play: vi.fn(), revert })) };
});
vi.mock('@jolt/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@jolt/core')>();
  return { ...actual, createCountUp: mocks.createCountUp };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('CountUp (vue)', () => {
  it('renders the formatted starting value', () => {
    const { container } = render(CountUp, { props: { to: 2000, from: 1234, separator: ',' } });
    expect(container.querySelector('span')?.textContent).toBe('1,234');
  });

  it('creates the animation on mount and reverts on unmount', () => {
    const { unmount } = render(CountUp, { props: { to: 100 } });
    expect(mocks.createCountUp).toHaveBeenCalledTimes(1);
    unmount();
    expect(mocks.revert).toHaveBeenCalledTimes(1);
  });
});
