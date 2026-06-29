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
// the canvas can't diverge (D-029). Each background gets its OWN harness page so only
// 3 live WebGL contexts exist at once — the second test below visits them one at a time
// and closes each page, staying under Chromium's ~16-context cap (D-032).
const BACKGROUND: readonly string[] = [
  'particles',
  'waves',
  'dots',
  'globe',
  'rings',
  'aurora',
  // gen:background
];
// Loaders (+ future non-text graphics) are self-animating CSS — no text, not a canvas — so
// they're pixel-compared across frameworks like whole-text components but skip the text/segment
// assertions. They live on this shared harness page (DOM, no WebGL-context limit). The freeze
// below collapses their infinite keyframes to a deterministic, cross-framework-identical frame.
const GRAPHIC: readonly string[] = [
  'spinner',
  'dot-bounce',
  'bars',
  'pulse',
  'ripple',
  'grid',
  'progress-bar',
  // gen:graphic
];
const COMPONENTS = [...PER_CHAR, ...WHOLE_TEXT, ...GRAPHIC];
const FRAMEWORKS = ['react', 'vue', 'svelte'] as const;
const TEXT = 'Jolt UI';

// ScrollVelocity is an infinite marquee of *repeated* text. A sub-pixel cross-platform
// layout difference accumulated over the copies misaligns the repeating pattern and blows
// up the pixel diff (measured: a 1px shift ≈ 2.4%, 8px ≈ 24%), so it can't be pixel-compared
// reliably across OSes. Its anti-drift is covered by the DOM/text-parity check below + the
// per-framework unit tests (identical markup); only the screenshot diff is skipped.
const NO_PIXEL_PARITY: readonly string[] = [
  'scroll-velocity',
  // ProgressBar has no stable frozen frame: its reduced-motion static state (a 45% fill at
  // the left) and its animation end-state — the freeze target — sweep the fill off the track,
  // leaving the bare rail. Those two states differ sharply, and the harness's reduced-motion
  // emulation is not applied atomically across the three sequential per-cell screenshots
  // (Playwright's context-level reducedMotion is flaky — the live-verify uses page.emulateMedia
  // instead), so one cell can be captured mid-fill while another shows the rail, spiking the
  // diff (~12%) intermittently. The DOM is byte-identical across frameworks and the stable diff
  // is 0%; anti-drift is the shared CSS + the per-framework unit tests + the visibility assert
  // below — same rationale as scroll-velocity (D-019, extended in D-035).
  'progress-bar',
  // gen:no-pixel
];

test('every on-page component renders identically across React, Vue, and Svelte', async ({ page }) => {
  // The whole E2E run shares one cold Astro dev server across parallel workers; the first
  // loads trigger a Vite dep-optimization + hydration storm that can delay these GSAP
  // islands settling, so keep generous headroom over Playwright's 30s default (D-018).
  // (WebGL backgrounds moved to their own isolated pages — see the next test, D-032.)
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
  // first load and several spec files hydrate in parallel against it, which can starve
  // this 2s tween's rAF and delay first-island hydration well past the old 8s (D-018).
  // A warm cache settles in well under a second.
  await expect(page.locator('[data-testid="count-up-svelte"] span').first()).toHaveText('100', {
    timeout: 30000,
  });

  for (const id of COMPONENTS) {
    const isPerChar = (PER_CHAR as readonly string[]).includes(id);
    const isGraphic = (GRAPHIC as readonly string[]).includes(id);

    if (isGraphic) {
      // Graphic (loader): no text — just assert every framework cell is visible; the
      // pixel comparison below is the real cross-framework parity check.
      for (const fw of FRAMEWORKS) {
        await expect(page.locator(`[data-testid="${id}-${fw}"]`)).toBeVisible();
      }
    } else {
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
          counts.push(
            await page.locator(`[data-testid="${id}-${fw}"] [data-jolt-segment]`).count(),
          );
        }
        expect(new Set(counts).size, `${id}: segment counts differ: ${counts.join(', ')}`).toBe(1);
      }
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

test('every background mounts a canvas across React, Vue, and Svelte', async ({ context }) => {
  // Each background has its own harness page (3 cells = 3 WebGL contexts). Visiting them
  // with a fresh page we then close() keeps ≤3 contexts live at any moment — deterministic
  // and bfcache-proof — so the harness scales past Chromium's ~16-context cap (D-032). The
  // first page pays three's (~700KB) cold Vite dep-optimization, hence the headroom.
  test.setTimeout(60_000);
  for (const id of BACKGROUND) {
    const page = await context.newPage();
    try {
      await page.goto(`/internal/parity-bg/${id}`);
      // Structural parity: every framework mounts a <canvas> inside an aria-hidden
      // container. No text or pixel comparison (D-029).
      for (const fw of FRAMEWORKS) {
        const cell = page.locator(`[data-testid="${id}-${fw}"]`);
        await expect(cell.locator('[aria-hidden="true"]')).toBeVisible({ timeout: 20000 });
        await expect(cell.locator('canvas')).toBeVisible({ timeout: 20000 });
      }
    } finally {
      await page.close();
    }
  }
});
