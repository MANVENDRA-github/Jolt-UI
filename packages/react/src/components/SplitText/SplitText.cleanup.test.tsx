import { render } from '@testing-library/react';
import { SplitText } from './SplitText';

// Mock only the animation primitive so we can assert the skin's lifecycle wiring
// (create on mount, revert on unmount) deterministically — the drift-prone part.
const mocks = vi.hoisted(() => {
  const revert = vi.fn();
  return { revert, createSplitText: vi.fn(() => ({ play: vi.fn(), revert })) };
});
vi.mock('@jolt/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@jolt/core')>();
  return { ...actual, createSplitText: mocks.createSplitText };
});

describe('SplitText (react) lifecycle', () => {
  it('creates the animation on mount and reverts on unmount', () => {
    const { unmount } = render(<SplitText text="Hi" />);
    expect(mocks.createSplitText).toHaveBeenCalledTimes(1);
    unmount();
    expect(mocks.revert).toHaveBeenCalledTimes(1);
  });
});
