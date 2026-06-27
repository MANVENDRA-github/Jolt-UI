import { render } from '@testing-library/svelte';
import SplitText from './SplitText.svelte';

// Mock only the animation primitive to assert lifecycle wiring deterministically.
const mocks = vi.hoisted(() => {
  const revert = vi.fn();
  return { revert, createSplitText: vi.fn(() => ({ play: vi.fn(), revert })) };
});
vi.mock('@jolt/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@jolt/core')>();
  return { ...actual, createSplitText: mocks.createSplitText };
});

describe('SplitText (svelte) lifecycle', () => {
  it('creates the animation on mount and reverts on unmount', () => {
    const { unmount } = render(SplitText, { props: { text: 'Hi' } });
    expect(mocks.createSplitText).toHaveBeenCalledTimes(1);
    unmount();
    expect(mocks.revert).toHaveBeenCalledTimes(1);
  });
});
