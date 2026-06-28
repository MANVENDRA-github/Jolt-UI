import { expect, test } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

// Per-char components split the text into aria-hidden segments (the full text is
// carried on an aria-label); whole-text components render the text directly, so
// it's natively accessible — no segments, no aria-label.
const PER_CHAR = [
  'split-text',
  'blur-in',
  'wave',
  'rotating-words',
  // gen:per-char
] as const;
const WHOLE_TEXT = [
  'gradient-text',
  'shiny-text',
  'typewriter',
  'count-up',
  'scramble',
  'scroll-velocity',
  // gen:whole-text
] as const;
// Backgrounds are WebGL canvases — no text, and non-deterministic per-frame output
// (GPU/timing dependent), so they can't be text- or pixel-compared. Parity is
// structural: every framework mounts a <canvas> inside an aria-hidden container. The
// anti-drift guarantee is that all three skins call the one shared core factory, so
// the canvas can't diverge (D-029).
const BACKGROUND: readonly string[] = [
  'particles',
  'waves',
  'dots',
  // gen:background
];
const COMPONENTS = [...PER_CHAR, ...WHOLE_TEXT, ...BACKGROUND];
const FRAMEWORKS = ['react', 'vue', 'svelte'] as const;
const TEXT = 'Jolt UI';

// ScrollVelocity is an infinite marquee of *repeated* text. A sub-pixel cross-platform
// layout difference accumulated over the copies misaligns the repeating pattern and blows
// up the pixel diff (measured: a 1px shift ≈ 2.4%, 8px ≈ 24%), so it can't be pixel-compared
// reliably across OSes. Its anti-drift is covered by the DOM/text-parity check below + the
// per-framework unit tests (identical markup); only the screenshot diff is skipped.
const NO_PIXEL_PARITY: readonly string[] = [
  'scroll-velocity',
  // gen:no-pixel
];

test('every component renders identically across React, Vue, and Svelte', async ({ page }) => {
  // The harness mounts several WebGL canvases (3 per background); each renderer's init
  // (GL context + shader compile) adds up, so give this heavy cross-framework test
  // generous headroom over Playwright's 30s default.
  test.setTimeout(90_000);
  await page.goto('/internal/parity');

  // Freeze every animation at a deterministic end-state before comparing. The
  // context already requests reduced-motion (so components render their static
  // final state), but a *looping* CSS animation (e.g. Wave's infinite bob) only
  // freezes if that emulation is honored at paint time — which is unreliable on
  // headless CI Chromium, where the still-running loop is then captured at
  // slightly different phases per cell. Forcing duration→0 + a single iteration
  // collapses any animation to its final frame regardless, so the pixel
  // comparison sees the same frozen frame across all three frameworks.
  await page.addStyleTag({
    content: `*, *::before, *::after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      animation-iteration-count: 1 !important;
      animation-fill-mode: forwards !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
      /* CPU-rasterize (drop GPU layer hints) so per-glyph antialiasing is identical
         across frameworks on headless CI — cf. D-014 (SplitText/per-char segments
         carry will-change: transform). */
      will-change: auto !important;
    }`,
  });

  // Wait until the client:load GSAP islands have settled to their final state before
  // comparing. Waiting on the longest animation (CountUp, 2s) to reach its target is
  // deterministic whether or not reduced-motion is honored in JS on this runner: if
  // honored the factory jumps to final instantly; if not, the real tween still
  // finishes here. By then SplitText (~0.8s) and Scramble (1.5s) are done too.
  // Generous timeout: a cold dev server (CI always starts cold) re-optimizes deps on
  // first load — now including three's ~700KB — which delays first-island hydration
  // past the old 8s (D-018). A warm cache settles in well under a second.
  await expect(page.locator('[data-testid="count-up-svelte"] span').first()).toHaveText('100', {
    timeout: 20000,
  });

  for (const id of COMPONENTS) {
    if (BACKGROUND.includes(id)) {
      // Structural parity for a WebGL background: every framework mounts a <canvas>
      // inside an aria-hidden container. No text or pixel comparison.
      for (const fw of FRAMEWORKS) {
        const cell = page.locator(`[data-testid="${id}-${fw}"]`);
        await expect(cell.locator('[aria-hidden="true"]')).toBeVisible();
        await expect(cell.locator('canvas')).toBeVisible();
      }
      continue;
    }

    const isPerChar = (PER_CHAR as readonly string[]).includes(id);

    // DOM parity: every framework shows the same accessible text. Per-char
    // components additionally expose it via aria-label + aria-hidden segments.
    const texts: (string | null)[] = [];
    for (const fw of FRAMEWORKS) {
      const cell = page.locator(`[data-testid="${id}-${fw}"]`);
      await expect(cell).toBeVisible();
      // Read text from the element that carries it — the aria-label span for
      // per-char components, the component's own span for whole-text — so a
      // client:load island's inline hydration script never leaks into textContent.
      const textEl = isPerChar
        ? cell.locator(`[aria-label="${TEXT}"]`)
        : cell.locator('span').first();
      if (isPerChar) {
        await expect(textEl).toBeVisible();
        await expect(cell.locator('[data-jolt-segment]').first()).toBeVisible();
      }
      texts.push((await textEl.textContent())?.trim() ?? null);
    }
    expect(new Set(texts).size, `${id}: text differs: ${texts.join(' | ')}`).toBe(1);

    if (isPerChar) {
      const counts: number[] = [];
      for (const fw of FRAMEWORKS) {
        counts.push(await page.locator(`[data-testid="${id}-${fw}"] [data-jolt-segment]`).count());
      }
      expect(new Set(counts).size, `${id}: segment counts differ: ${counts.join(', ')}`).toBe(1);
    }

    // Visual parity: each framework's cell matches React's within a small tolerance
    // (compared within one run → OS-independent, no committed golden). The layout is
    // identical; the headroom absorbs subpixel antialiasing between independent
    // framework renders of the same per-char segments — ~1% typically, but the
    // glyph-dense Rotating Words column reaches ~2.01% on headless CI Linux, so the
    // ceiling is 3%. Real cross-framework drift (missing element, wrong text/layout)
    // is far larger, so 3% still catches it (cf. D-019, which raised 1% → 2%).
    if (!NO_PIXEL_PARITY.includes(id)) {
      const shots: Record<string, Buffer> = {};
      for (const fw of FRAMEWORKS) {
        shots[fw] = await page.locator(`[data-testid="${id}-${fw}"]`).screenshot();
      }
      const base = PNG.sync.read(shots.react);
      for (const fw of ['vue', 'svelte'] as const) {
        const other = PNG.sync.read(shots[fw]);
        expect(other.width, `${id} ${fw} width`).toBe(base.width);
        expect(other.height, `${id} ${fw} height`).toBe(base.height);
        const mismatched = pixelmatch(base.data, other.data, null, base.width, base.height, {
          threshold: 0.1,
        });
        expect(mismatched / (base.width * base.height), `${id}: react vs ${fw}`).toBeLessThan(0.03);
      }
    }
  }
});
