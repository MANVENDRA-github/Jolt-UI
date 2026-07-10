import { render } from '@testing-library/svelte';
import Silk from './Silk.svelte';

const mocks = vi.hoisted(() => {
  const revert = vi.fn();
  return { revert, createSilk: vi.fn(() => ({ revert })) };
});
vi.mock('@jolt/core/webgl/silk', () => ({ createSilk: mocks.createSilk }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Silk (svelte)', () => {
  it('renders a decorative, aria-hidden container', () => {
    const { container } = render(Silk);
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
  });

  it('creates the field on mount and reverts on unmount', () => {
    const { unmount } = render(Silk);
    expect(mocks.createSilk).toHaveBeenCalledTimes(1);
    unmount();
    expect(mocks.revert).toHaveBeenCalledTimes(1);
  });
});
