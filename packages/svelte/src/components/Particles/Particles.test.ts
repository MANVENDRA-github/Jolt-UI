import { render } from '@testing-library/svelte';
import Particles from './Particles.svelte';

// Mock the WebGL factory at its SUBPATH so `three` never loads in jsdom.
const mocks = vi.hoisted(() => {
  const revert = vi.fn();
  return { revert, createParticles: vi.fn(() => ({ revert })) };
});
vi.mock('@jolt/core/webgl/particles', () => ({ createParticles: mocks.createParticles }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Particles (svelte)', () => {
  it('renders a decorative, aria-hidden container', () => {
    const { container } = render(Particles);
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
  });

  it('creates the field on mount and reverts on unmount', () => {
    const { unmount } = render(Particles);
    expect(mocks.createParticles).toHaveBeenCalledTimes(1);
    unmount();
    expect(mocks.revert).toHaveBeenCalledTimes(1);
  });
});
