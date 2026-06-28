/**
 * Install metadata derived from a component's `meta` — the single source for the
 * docs site's install tabs + dependency badges, so they can't drift from the
 * component's real dependencies. Joins `propsTable` as a core docs helper.
 */

/**
 * Origin of the published jsrepo registry. A placeholder until the Phase 4 deploy
 * wires a real domain — at which point only this one value changes.
 */
export const REGISTRY_BASE = '<registry-url>';

export type Framework = 'react' | 'vue' | 'svelte';

/** A package-manager install tab: the `jsrepo add` line plus the peer-deps install. */
export interface InstallTab {
  label: 'npm' | 'pnpm';
  lang: 'bash';
  code: string;
}

export interface InstallInfo {
  /** The path passed to `jsrepo add`, e.g. `<registry-url>/r/react/blur-in`. */
  registryPath: string;
  /**
   * Peer dependencies the consumer must install. `zod` is universal — the bundled
   * monolithic core's schemas import it (D-013) — and `gsap` is present iff the
   * component declares it in `meta.deps`.
   */
  peers: readonly string[];
  /** One tab per package manager. */
  tabs: readonly InstallTab[];
}

/** Build the install info for a component in a given framework, from its meta. */
export function installInfo(
  meta: { id: string; deps: readonly string[] },
  framework: Framework,
): InstallInfo {
  const registryPath = `${REGISTRY_BASE}/r/${framework}/${meta.id}`;
  // zod is a universal runtime peer; dedupe defensively in case a meta lists it.
  const peers = [...new Set([...meta.deps, 'zod'])];
  const tabs: InstallTab[] = [
    {
      label: 'npm',
      lang: 'bash',
      code: `npx jsrepo add ${registryPath}\nnpm i ${peers.join(' ')}`,
    },
    {
      label: 'pnpm',
      lang: 'bash',
      code: `pnpm dlx jsrepo add ${registryPath}\npnpm add ${peers.join(' ')}`,
    },
  ];
  return { registryPath, peers, tabs };
}
