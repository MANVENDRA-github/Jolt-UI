import { render } from '@testing-library/react';
import { ScrollVelocity } from './ScrollVelocity';

// Mock only the animation primitive so we can assert structure + lifecycle wiring
// (create on mount, revert on unmount) deterministically.
const mocks = vi.hoisted(() => {
  const revert = vi.fn();
  return { revert, createScrollVelocity: vi.fn(() => ({ play: vi.fn(), revert })) };
});
vi.mock('@jolt/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@jolt/core')>();
  return { ...actual, createScrollVelocity: mocks.createScrollVelocity };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ScrollVelocity (react)', () => {
  it('exposes the text via aria-label and repeats it in an aria-hidden track', () => {
    const { container } = render(<ScrollVelocity text="Jolt" />);
    expect(container.querySelector('[aria-label]')?.getAttribute('aria-label')).toBe('Jolt');
    const track = container.querySelector('[data-jolt-track]');
    expect(track?.getAttribute('aria-hidden')).toBe('true');
    expect(track?.querySelectorAll('span').length).toBe(8);
  });

  it('creates the animation on mount and reverts on unmount', () => {
    const { unmount } = render(<ScrollVelocity text="Hi" />);
    expect(mocks.createScrollVelocity).toHaveBeenCalledTimes(1);
    unmount();
    expect(mocks.revert).toHaveBeenCalledTimes(1);
  });
});
