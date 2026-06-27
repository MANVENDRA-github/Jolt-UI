import { createSplitText } from './split-text';

function makeContainer(segmentCount: number): HTMLElement {
  const el = document.createElement('div');
  for (let i = 0; i < segmentCount; i++) {
    const span = document.createElement('span');
    span.setAttribute('data-jolt-segment', '');
    span.textContent = 'x';
    el.appendChild(span);
  }
  document.body.appendChild(el);
  return el;
}

describe('createSplitText', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  it('returns a controller and reverts without throwing', () => {
    const el = makeContainer(3);
    const controller = createSplitText(el, { text: 'abc' });
    expect(typeof controller.play).toBe('function');
    expect(() => controller.revert()).not.toThrow();
  });

  it('clears inline styles on revert (no leaked state)', () => {
    const el = makeContainer(3);
    const controller = createSplitText(el, { text: 'abc' });
    controller.revert();
    const segment = el.querySelector<HTMLElement>('[data-jolt-segment]')!;
    expect(segment.style.opacity).toBe('');
    expect(segment.style.transform).toBe('');
  });

  it('renders the final state under reduced motion', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: true, media: query }));
    const el = makeContainer(2);
    createSplitText(el, { text: 'ab' });
    const segment = el.querySelector<HTMLElement>('[data-jolt-segment]')!;
    expect(segment.style.opacity).toBe('1');
  });

  it('is a no-op when there are no segments', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    expect(() => createSplitText(el, { text: 'abc' }).revert()).not.toThrow();
  });
});
