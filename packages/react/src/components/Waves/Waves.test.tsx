import { render } from '@testing-library/react';
import { Waves } from './Waves';

// Mock the WebGL factory at its SUBPATH so `three` never loads in jsdom.
const mocks = vi.hoisted(() => {
  const revert = vi.fn();
  return { revert, createWaves: vi.fn(() => ({ revert })) };
});
vi.mock('@jolt/core/webgl/waves', () => ({ createWaves: mocks.createWaves }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Waves (react)', () => {
  it('renders a decorative, aria-hidden container', () => {
    const { container } = render(<Waves />);
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
  });

  it('creates the field on mount and reverts on unmount', () => {
    const { unmount } = render(<Waves />);
    expect(mocks.createWaves).toHaveBeenCalledTimes(1);
    unmount();
    expect(mocks.revert).toHaveBeenCalledTimes(1);
  });
});
