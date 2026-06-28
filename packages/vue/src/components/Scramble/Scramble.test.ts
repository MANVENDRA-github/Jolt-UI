import { render } from '@testing-library/vue';
import Scramble from './Scramble.vue';

// Mock only the animation primitive to assert structure + lifecycle wiring.
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

describe('Scramble (vue)', () => {
  it('exposes the text via aria-label and renders it', () => {
    const { container } = render(Scramble, { props: { text: 'Hello' } });
    const root = container.querySelector('[aria-label]');
    expect(root?.getAttribute('aria-label')).toBe('Hello');
    expect(root?.textContent).toBe('Hello');
  });

  it('creates the animation on mount and reverts on unmount', () => {
    const { unmount } = render(Scramble, { props: { text: 'Hi' } });
    expect(mocks.createScramble).toHaveBeenCalledTimes(1);
    unmount();
    expect(mocks.revert).toHaveBeenCalledTimes(1);
  });
});
