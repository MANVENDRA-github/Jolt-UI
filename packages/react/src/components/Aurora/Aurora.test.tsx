import { render } from '@testing-library/react';
import { Aurora } from './Aurora';

// Mock the WebGL factory at its SUBPATH so `three` never loads in jsdom.
const mocks = vi.hoisted(() => {
  const revert = vi.fn();
  return { revert, createAurora: vi.fn(() => ({ revert })) };
});
vi.mock('@jolt/core/webgl/aurora', () => ({ createAurora: mocks.createAurora }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Aurora (react)', () => {
  it('renders a decorative, aria-hidden container', () => {
    const { container } = render(<Aurora />);
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
  });

  it('creates the field on mount and reverts on unmount', () => {
    const { unmount } = render(<Aurora />);
    expect(mocks.createAurora).toHaveBeenCalledTimes(1);
    unmount();
    expect(mocks.revert).toHaveBeenCalledTimes(1);
  });
});
