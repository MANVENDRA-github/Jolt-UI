import { render } from '@testing-library/svelte';
import Dots from './Dots.svelte';

// Mock the WebGL factory at its SUBPATH so `three` never loads in jsdom.
const mocks = vi.hoisted(() => {
  const revert = vi.fn();
  return { revert, createDots: vi.fn(() => ({ revert })) };
});
vi.mock('@jolt/core/webgl/dots', () => ({ createDots: mocks.createDots }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Dots (svelte)', () => {
  it('renders a decorative, aria-hidden container', () => {
    const { container } = render(Dots);
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
  });

  it('creates the field on mount and reverts on unmount', () => {
    const { unmount } = render(Dots);
    expect(mocks.createDots).toHaveBeenCalledTimes(1);
    unmount();
    expect(mocks.revert).toHaveBeenCalledTimes(1);
  });
});
