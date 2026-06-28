import { render } from '@testing-library/react';
import { Scramble } from './Scramble';

// Mock only the animation primitive so we can assert the skin's structure +
// lifecycle wiring (create on mount, revert on unmount) deterministically.
const mocks = vi.hoisted(() => {
  const revert = vi.fn();
  return { revert, createScramble: vi.fn(() => ({ play: vi.fn(), revert })) };
});
vi.mock('@jolt/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@jolt/core')>();
  return { ...actual, createScramble: mocks.createScramble };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Scramble (react)', () => {
  it('exposes the text via aria-label and renders it', () => {
    const { container } = render(<Scramble text="Hello" />);
    const root = container.querySelector('[aria-label]');
    expect(root?.getAttribute('aria-label')).toBe('Hello');
    expect(root?.textContent).toBe('Hello');
  });

  it('creates the animation on mount and reverts on unmount', () => {
    const { unmount } = render(<Scramble text="Hi" />);
    expect(mocks.createScramble).toHaveBeenCalledTimes(1);
    unmount();
    expect(mocks.revert).toHaveBeenCalledTimes(1);
  });
});
