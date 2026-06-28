import { createScrollVelocity } from './scroll-velocity';

function makeEl(): HTMLElement {
  const el = document.createElement('span');
  const track = document.createElement('span');
  track.setAttribute('data-jolt-track', '');
  track.textContent = 'Jolt UI';
  el.appendChild(track);
  document.body.appendChild(el);
  return el;
}

describe('createScrollVelocity', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  it('stays static under reduced motion (no transform applied)', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: true, media: query }));
    const el = makeEl();
    createScrollVelocity(el, { text: 'Jolt UI' });
    const track = el.querySelector<HTMLElement>('[data-jolt-track]')!;
    expect(track.style.transform).toBe('');
  });

  it('returns a controller that reverts without throwing', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: true, media: query }));
    const el = makeEl();
    const controller = createScrollVelocity(el, { text: 'Jolt UI' });
    expect(typeof controller.play).toBe('function');
    expect(() => controller.revert()).not.toThrow();
  });
});
