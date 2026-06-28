import { render } from '@testing-library/react';
import { Globe } from './Globe';

// Mock the WebGL factory at its SUBPATH so `three` never loads in jsdom.
const mocks = vi.hoisted(() => {
  const revert = vi.fn();
  return { revert, createGlobe: vi.fn(() => ({ revert })) };
});
vi.mock('@jolt/core/webgl/globe', () => ({ createGlobe: mocks.createGlobe }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Globe (react)', () => {
  it('renders a decorative, aria-hidden container', () => {
    const { container } = render(<Globe />);
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
  });

  it('creates the field on mount and reverts on unmount', () => {
    const { unmount } = render(<Globe />);
    expect(mocks.createGlobe).toHaveBeenCalledTimes(1);
    unmount();
    expect(mocks.revert).toHaveBeenCalledTimes(1);
  });
});
