import { render } from '@testing-library/react';
import { LightRays } from './LightRays';

// Mock the WebGL factory at its SUBPATH so `three` never loads in jsdom.
const mocks = vi.hoisted(() => {
  const revert = vi.fn();
  return { revert, createLightRays: vi.fn(() => ({ revert })) };
});
vi.mock('@jolt/core/webgl/light-rays', () => ({ createLightRays: mocks.createLightRays }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('LightRays (react)', () => {
  it('renders a decorative, aria-hidden container', () => {
    const { container } = render(<LightRays />);
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
  });

  it('creates the field on mount and reverts on unmount', () => {
    const { unmount } = render(<LightRays />);
    expect(mocks.createLightRays).toHaveBeenCalledTimes(1);
    unmount();
    expect(mocks.revert).toHaveBeenCalledTimes(1);
  });
});
