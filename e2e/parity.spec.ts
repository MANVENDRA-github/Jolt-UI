import { expect, test } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const COMPONENTS = ['split-text', 'blur-in', 'wave'] as const;
const FRAMEWORKS = ['react', 'vue', 'svelte'] as const;
const TEXT = 'Jolt UI';

test('every component renders identically across React, Vue, and Svelte', async ({ page }) => {
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
    }`,
  });

  for (const id of COMPONENTS) {
    // Each framework reaches the reduced-motion final state.
    for (const fw of FRAMEWORKS) {
      await expect(page.locator(`[data-testid="${id}-${fw}"] [aria-label="${TEXT}"]`)).toBeVisible();
      await expect(
        page.locator(`[data-testid="${id}-${fw}"] [data-jolt-segment]`).first(),
      ).toBeVisible();
    }

    // DOM parity: identical segment count + text across frameworks.
    const counts: number[] = [];
    const texts: (string | null)[] = [];
    for (const fw of FRAMEWORKS) {
      counts.push(await page.locator(`[data-testid="${id}-${fw}"] [data-jolt-segment]`).count());
      texts.push(
        await page.locator(`[data-testid="${id}-${fw}"] [aria-label]`).first().textContent(),
      );
    }
    expect(new Set(counts).size, `${id}: segment counts differ: ${counts.join(', ')}`).toBe(1);
    expect(new Set(texts).size, `${id}: text differs: ${texts.join(' | ')}`).toBe(1);

    // Visual parity: each framework's cell is pixel-identical to React's (compared
    // within one run → OS-independent, no committed golden).
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
      expect(mismatched / (base.width * base.height), `${id}: react vs ${fw}`).toBeLessThan(0.01);
    }
  }
});
