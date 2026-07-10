import { render } from '@testing-library/react';
import { Silk } from './Silk';

// Mock the WebGL factory at its SUBPATH so `three` never loads in jsdom.
const mocks = vi.hoisted(() => {
  const revert = vi.fn();
  return { revert, createSilk: vi.fn(() => ({ revert })) };
});
vi.mock('@jolt/core/webgl/silk', () => ({ createSilk: mocks.createSilk }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Silk (react)', () => {
  it('renders a decorative, aria-hidden container', () => {
    const { container } = render(<Silk />);
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
  });

  it('creates the field on mount and reverts on unmount', () => {
    const { unmount } = render(<Silk />);
    expect(mocks.createSilk).toHaveBeenCalledTimes(1);
    unmount();
    expect(mocks.revert).toHaveBeenCalledTimes(1);
  });
});
