import * as core from './index';
import { installInfo, REGISTRY_BASE } from './registry';
import { blurInMeta } from './schemas/blur-in';
import { countUpMeta } from './schemas/count-up';

/** Structural guard so the no-drift loop can iterate the core barrel without `any`. */
function isMeta(value: unknown): value is { id: string; deps: readonly string[] } {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as { id?: unknown; deps?: unknown };
  return typeof v.id === 'string' && Array.isArray(v.deps);
}

describe('installInfo', () => {
  it('derives a zod-only peer set for a CSS-only component', () => {
    const info = installInfo(blurInMeta, 'react');
    expect(info.peers).toEqual(['zod']);
    expect(info.registryPath).toBe('https://jolt-ui.pages.dev/r/react/blur-in');
  });

  it('includes gsap (before zod) for a GSAP component', () => {
    expect(installInfo(countUpMeta, 'react').peers).toEqual(['gsap', 'zod']);
  });

  it('emits an npm and a pnpm tab, each with the jsrepo add line + the peer install', () => {
    const { tabs } = installInfo(blurInMeta, 'react');
    expect(tabs.map((t) => t.label)).toEqual(['npm', 'pnpm']);

    const npm = tabs.find((t) => t.label === 'npm');
    expect(npm?.lang).toBe('bash');
    expect(npm?.code).toContain('npx jsrepo add https://jolt-ui.pages.dev/r/react/blur-in');
    expect(npm?.code).toContain('npm i zod');
    expect(npm?.code).not.toContain('gsap');

    const pnpm = tabs.find((t) => t.label === 'pnpm');
    expect(pnpm?.code).toContain('pnpm dlx jsrepo add https://jolt-ui.pages.dev/r/react/blur-in');
    expect(pnpm?.code).toContain('pnpm add zod');
  });

  it('lists gsap in the peer install for a GSAP component', () => {
    const npm = installInfo(countUpMeta, 'react').tabs.find((t) => t.label === 'npm');
    expect(npm?.code).toContain('npm i gsap zod');
  });

  it('switches the framework segment of the registry path', () => {
    expect(installInfo(blurInMeta, 'vue').registryPath).toBe(
      'https://jolt-ui.pages.dev/r/vue/blur-in',
    );
    expect(installInfo(blurInMeta, 'svelte').registryPath).toBe(
      'https://jolt-ui.pages.dev/r/svelte/blur-in',
    );
  });

  it('roots every registry path at REGISTRY_BASE', () => {
    expect(installInfo(countUpMeta, 'react').registryPath.startsWith(REGISTRY_BASE)).toBe(true);
  });

  // No-drift guard (mirrors the propsTable no-drift test): every component's install
  // peers stay in lockstep with its meta — zod always, gsap iff the meta declares it.
  it('keeps peers in lockstep with every component meta', () => {
    let count = 0;
    // Treat values as `unknown` so `isMeta` narrows by replacement, not intersection
    // — the metas' `deps` is an `as const` tuple, which would otherwise collapse to
    // `readonly never[]` when intersected with the guard's `readonly string[]`.
    for (const [key, value] of Object.entries(core) as [string, unknown][]) {
      if (!key.endsWith('Meta') || !isMeta(value)) continue;
      count += 1;
      const { peers } = installInfo(value, 'react');
      expect(peers, `${key} must peer-depend on zod`).toContain('zod');
      expect(peers.includes('gsap'), `${key}: gsap peer must match meta.deps`).toBe(
        value.deps.includes('gsap'),
      );
    }
    expect(count, 'expected at least the 10 shipped component metas').toBeGreaterThanOrEqual(10);
  });
});
