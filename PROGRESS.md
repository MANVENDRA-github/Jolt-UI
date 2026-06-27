# PROGRESS — Jolt UI

> The cross-session heartbeat. **Read this first** to resume; **update it last** before you stop.
> Newest session entry on top.

## Snapshot

- **Current phase:** Phase 1 in progress — SplitText core + 3 skins + live demo + unit tests ✅ (PR #2, branch `feat/phase-1-split-text`, stacked on the Phase 0 PR). **Remaining:** jsrepo registry/CLI, Playwright parity/E2E, code-tabs + MDX docs.
- **Repo:** `D:\Jolt-UI` · remote `github.com/MANVENDRA-github/Jolt-UI`.
- **Health:** `pnpm verify` green (35 tests) · `pnpm build` green (2 pages).

## How to resume

```bash
cd D:\Jolt-UI
pnpm install
pnpm verify        # typecheck + lint + test  (expect green)
pnpm dev           # site: '/' hello-islands, '/components/split-text' the SplitText demo (3 frameworks)
```

Then open `ROADMAP.md` → Phase 1, and `COMPONENT_GUIDE.md` for the add-a-component steps.

## Next up (Phase 1, remaining)

SplitText core + skins + demo + unit tests are done (PR #2). What's left in Phase 1:

1. **Registry (`packages/registry`)**: jsrepo config exposing `react|vue|svelte/split-text` blocks + shared `lib/core` & `lib/tokens`; build into `apps/site/public/r`. Add a `registry:check` sync test (source === block === code-tab) and wire it into `verify`.
2. **CLI smoke E2E**: `jsrepo add` against the locally-built registry into a fixture project → it typechecks. Never hits the live origin.
3. **Parity E2E (Playwright)**: render the 3 demos, force a deterministic frame (reduced-motion end-state), screenshot, assert cross-framework match.
4. **Code tabs + docs**: add `astro-expressive-code` for tabbed source + copy on the demo page; MDX doc with a schema-generated props table.

## Open assumptions (change freely; from the approved plan)

- Name **"Jolt UI"**, scope `@jolt/*`, at `D:\Jolt-UI`. License **MIT + Commons-Clause**.
- v1 ships **TS + Tailwind only** per framework (no JS/plain-CSS variants yet).
- Phase-1 slice is a **GSAP** component (`split-text`) to front-load integration risk.

## Known issues / watch-list

- **Dual Vite:** the site + all type-checks resolve **Vite 6** (single, correct). vitest's internal `@vitest/mocker` still pulls **Vite 7** (auto-installed peer that pnpm `overrides` doesn't constrain). Harmless — isolated to the test runner; build + `astro check` + tests are green. Revisit when Astro/vitest align on one Vite major, or pin via a different mechanism. See `DECISIONS.md` D-007.
- **Hand-written type shims:** `packages/vue/types.d.ts` and `packages/svelte/types.d.ts` declare the public component types by hand so `astro check` can type cross-package `.vue`/`.svelte` imports. Replace with generated types when a build step is added. See `DECISIONS.md` D-006.
- `@astrojs/svelte` bundles its own `vite-plugin-svelte` 5.1.1 (upstream) → no action needed.

## Session log

### 2026-06-28 — Phase 1 vertical slice: SplitText (core + 3 skins + demo)

Built the first real component end-to-end. `@jolt/core` now holds the single sources: `splitTextSchema` (Zod props/defaults), `splitSegments` (pure splitter), `createSplitText` (GSAP primitive returning a `revert()`), and `prefersReducedMotion`. Each of `@jolt/{react,vue,svelte}` has a thin `SplitText` skin that renders the segment spans and calls the core on mount / reverts on unmount. New demo page `/components/split-text` shows all three live islands.

Tests (35 total, green): core — splitter, schema defaults, reduced-motion, revert; per-framework — DOM parity (same aria-label, segment count, text across all three) + lifecycle (create-on-mount / revert-on-unmount, via a mocked core). SSR check: the demo page renders all three islands (3 aria-labels, 56 segment spans).

Decision **D-011**: Vue's SFC compiler can't resolve the zod-inferred `defineProps` type, so the Vue skin declares a local `Props` interface mirroring the schema (React/Svelte use the inferred type directly).

**Remaining in Phase 1:** registry/CLI, parity + CLI-smoke E2E, code-tabs + MDX docs (see "Next up").

### 2026-06-27 — Renamed to Jolt UI + migrated to the GitHub clone

Renamed the project (Triad → **Jolt UI**): scope `@triad/*` → `@jolt/*`, CSS tokens `--triad-*` → `--jolt-*`, all docs. Migrated the whole tree from the throwaway `D:\triad` into the cloned repo `D:\Jolt-UI` (remote `github.com/MANVENDRA-github/Jolt-UI`), reinstalled cleanly (no peer warnings), and re-verified green: `pnpm verify` (typecheck + lint + 8 tests) + `pnpm build` (3 bundles, 1 page). Scaffold committed on branch `feat/phase-0-foundation` → PR to `main`. The throwaway `D:\triad` was removed.

### 2026-06-27 — Phase 0 foundation (scaffold + tracking docs)

Built the monorepo from scratch and got the full gate green. Verified output:

- `pnpm verify` → typecheck (tokens/react via tsc, vue via vue-tsc, svelte via svelte-check, site via **astro check: 0 errors**), lint clean, **8 tests passed** across 4 Vitest projects (tokens, react, vue, svelte).
- `pnpm build` → React + Vue + Svelte client bundles emitted; 1 page built; "Complete!".
- SSR output of `/` contains "Hello … from React", "… from Vue", "… from Svelte" — all three islands render.

Decisions made this session logged in `DECISIONS.md` (D-001…D-007). Tracking docs created: CLAUDE, PRP_SPEC, ROADMAP, PROGRESS, DESIGN_SYSTEM, COMPONENT_GUIDE, TEST_CONTRACT, DECISIONS, PLAN_TEMPLATE, README, LICENSE.

**Next session:** start Phase 1 at "Next up" above.
