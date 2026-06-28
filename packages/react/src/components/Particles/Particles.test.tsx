import { render } from '@testing-library/react';
import { Particles } from './Particles';

// Mock the WebGL factory at its SUBPATH so `three` never loads in jsdom; this lets us
// assert the skin's lifecycle wiring (create on mount, revert on unmount) and that the
// container is a decorative, aria-hidden element.
const mocks = vi.hoisted(() => {
  const revert = vi.fn();
  return { revert, createParticles: vi.fn(() => ({ revert })) };
});
vi.mock('@jolt/core/webgl/particles', () => ({ createParticles: mocks.createParticles }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Particles (react)', () => {
  it('renders a decorative, aria-hidden container', () => {
    const { container } = render(<Particles />);
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
  });

  it('creates the field on mount and reverts on unmount', () => {
    const { unmount } = render(<Particles />);
    expect(mocks.createParticles).toHaveBeenCalledTimes(1);
    unmount();
    expect(mocks.revert).toHaveBeenCalledTimes(1);
  });
});
