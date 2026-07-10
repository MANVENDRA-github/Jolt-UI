import { render } from '@testing-library/vue';
import Iridescence from './Iridescence.vue';

const mocks = vi.hoisted(() => {
  const revert = vi.fn();
  return { revert, createIridescence: vi.fn(() => ({ revert })) };
});
vi.mock('@jolt/core/webgl/iridescence', () => ({ createIridescence: mocks.createIridescence }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Iridescence (vue)', () => {
  it('renders a decorative, aria-hidden container', () => {
    const { container } = render(Iridescence);
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
  });

  it('creates the field on mount and reverts on unmount', () => {
    const { unmount } = render(Iridescence);
    expect(mocks.createIridescence).toHaveBeenCalledTimes(1);
    unmount();
    expect(mocks.revert).toHaveBeenCalledTimes(1);
  });
});
