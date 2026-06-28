import { createScramble } from './scramble';

function makeEl(): HTMLElement {
  const el = document.createElement('span');
  document.body.appendChild(el);
  return el;
}

describe('createScramble', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  it('renders the final text under reduced motion', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: true, media: query }));
    const el = makeEl();
    createScramble(el, { text: 'Hello' });
    expect(el.textContent).toBe('Hello');
  });

  it('settles on the final text after revert (no leaked tween)', () => {
    const el = makeEl();
    const controller = createScramble(el, { text: 'Hello' });
    controller.revert();
    expect(el.textContent).toBe('Hello');
  });

  it('returns a controller', () => {
    const el = makeEl();
    const controller = createScramble(el, { text: 'Hi' });
    expect(typeof controller.play).toBe('function');
    expect(() => controller.revert()).not.toThrow();
  });
});
