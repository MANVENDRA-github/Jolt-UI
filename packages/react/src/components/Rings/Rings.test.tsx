import { render } from '@testing-library/react';
import { Rings } from './Rings';

// Mock the WebGL factory at its SUBPATH so `three` never loads in jsdom.
const mocks = vi.hoisted(() => {
  const revert = vi.fn();
  return { revert, createRings: vi.fn(() => ({ revert })) };
});
vi.mock('@jolt/core/webgl/rings', () => ({ createRings: mocks.createRings }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Rings (react)', () => {
  it('renders a decorative, aria-hidden container', () => {
    const { container } = render(<Rings />);
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
  });

  it('creates the field on mount and reverts on unmount', () => {
    const { unmount } = render(<Rings />);
    expect(mocks.createRings).toHaveBeenCalledTimes(1);
    unmount();
    expect(mocks.revert).toHaveBeenCalledTimes(1);
  });
});
