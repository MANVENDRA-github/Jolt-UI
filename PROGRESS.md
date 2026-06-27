# PROGRESS — Jolt UI

> The cross-session heartbeat. **Read this first** to resume; **update it last** before you stop.
> Newest session entry on top.

## Snapshot

- **Current phase:** **Phase 2 IN PROGRESS** — filling the Text-Animations category. **Merged to `main`:** SplitText (Phase 1) · Blur In + Wave (PR #8) · Gradient Text + Shiny Text (PR #9) — **5 of ~9 components.** **Next: PR 2c (Typewriter + Rotating Words).** The full remaining plan, the three proven component patterns, and the baked-in gotchas are in **“Next up — Phase 2”** below. Phase 0–1 merged (PRs #1–#7).
- **Repo:** `D:\Jolt-UI` · remote `github.com/MANVENDRA-github/Jolt-UI`. Branch → PR → merge (never push `main`).
- **Health (on `main`):** `pnpm verify` green (**71 tests** + registry:check, astro check 13 pages) · `pnpm test:cli` (adds all 5 components → consumer typechecks) · `pnpm test:e2e` (parity across all 5) green.

## How to resume

```bash
cd D:\Jolt-UI
pnpm install
pnpm verify        # typecheck + lint + test + registry:check  (expect green)
pnpm test:cli      # E2E: jsrepo add into a temp fixture -> bundles core + consumer typechecks
pnpm test:e2e      # E2E: Playwright cross-framework parity for every component (real browser)
pnpm dev           # site: '/components/<id>' demos (split-text, blur-in, wave, gradient-text, shiny-text)
```

Then open `ROADMAP.md` → Phase 2, and `COMPONENT_GUIDE.md` for the add-a-component steps.

## Next up — Phase 2 (fill the Text-Animations category)

Phase 2 fills the Text-Animations category, ~2 components per PR, each its own small PR the maintainer merges. **Shipped:** SplitText (GSAP), Blur In + Wave (per-char CSS), Gradient Text + Shiny Text (whole-text CSS). **Remaining PRs (approved batching):**

- **PR 2c — Typewriter + Rotating Words** (CSS-only, structural). Typewriter: `steps()` width/character reveal + a blinking caret. Rotating Words: cycle a list of words (vertical slide/fade); takes a `words: string[]` prop (the `propsTable` array support landed in 2b). Reduced-motion → show the full/first word statically.
- **PR 2d — Count Up + Scramble** (GSAP). Count Up: animate a number to a target. Scramble: ScrambleText-style decode. Use the GSAP pattern below (core `animation/<id>.ts` factory; register `ScrambleTextPlugin` in `core/motion.ts`); reduced-motion → final value/text.
- **PR 2e — Scroll-Velocity + category index page** (GSAP ScrollTrigger). A marquee whose speed reacts to scroll velocity; then build `/components` (or `/components/index.astro`) listing every component with a live mini-preview. Register `ScrollTrigger` in `core/motion.ts`; guard `window`.

### The per-component slice (repeat this — see `COMPONENT_GUIDE.md` for the full checklist)
Zod schema (`packages/core/src/schemas/<id>.ts`, every field `.describe()`'d + `.default()`) → behavior (shared CSS module **or** GSAP factory) → 3 skins (`packages/{react,vue,svelte}/src/components/<Name>/` + barrel + `index.ts` export + vue/svelte `types.d.ts` shim) → demo page (`apps/site/src/pages/components/<id>.astro`) → registry items in `jsrepo.config.ts` (all 3 frameworks) → unit tests (3 frameworks) → extend the parity harness (`apps/site/src/pages/internal/parity.astro`) + `e2e/parity.spec.ts` (add the id to `PER_CHAR` or `WHOLE_TEXT`) → extend `scripts/cli-smoke.mjs` → **gates: `pnpm verify` + `pnpm test:cli` + `pnpm test:e2e`, then PR.**

### Three proven component patterns (pick one per component)
- **Per-char CSS-only** (Blur In, Wave): split via `splitSegments` (`core/dom/split.ts`); shared `@jolt/core/src/styles/<id>.css` with `@keyframes`; skins render `<span aria-label> + aria-hidden segments` and set `--jolt-*` (+ per-segment `--jolt-i`). DECISIONS **D-013, D-014**.
- **Whole-text CSS-only** (Gradient, Shiny): no segmentation — `<span class="jolt-…">{text}</span>` directly (natively accessible, no aria-label); `background-clip: text`. DECISIONS **D-016**.
- **GSAP** (SplitText; use for 2d/2e): framework-agnostic factory in `core/animation/<id>.ts` returning `{ play, revert }`; skins call it on mount and `revert` on unmount; register plugins in `core/motion.ts`. DECISIONS **D-008**.

### Gotchas already solved (don't rediscover — see `DECISIONS.md`)
- **Parity for looping/infinite animations:** the parity spec freezes all animations to their end-state before screenshotting (**D-015**) — reduced-motion alone won't freeze them on CI. Keep using `/internal/parity` + `e2e/parity.spec.ts`.
- **Reduced-motion** must set the static final state **and** release `will-change: auto` for a deterministic frame (**D-014**).
- **Vue skins** declare a local `Props` interface mirroring the schema — the SFC compiler can't resolve the Zod-inferred type in `defineProps` (**D-011**).
- **Registry** bundles the whole `core` (incl. `styles/*.css`) via a build transform that rewrites `@jolt/core` → `@/jolt-core` (**D-012, D-013**); always validate a registry change with `pnpm test:cli`.
- **CSS imports** need each package's `src/css.d.ts` (`declare module '*.css'`) for typecheck.

A reusable `gen-component` scaffolder (Phase 3) will stamp this slice from one contract once the pattern has repeated enough.

## Open assumptions (change freely; from the approved plan)

- Name **"Jolt UI"**, scope `@jolt/*`, at `D:\Jolt-UI`. License **MIT + Commons-Clause**.
- v1 ships **TS + Tailwind only** per framework (no JS/plain-CSS variants yet).
- Phase-1 slice is a **GSAP** component (`split-text`) to front-load integration risk.

## Known issues / watch-list

- **Dual Vite:** the site + all type-checks resolve **Vite 6** (single, correct). vitest's internal `@vitest/mocker` still pulls **Vite 7** (auto-installed peer that pnpm `overrides` doesn't constrain). Harmless — isolated to the test runner; build + `astro check` + tests are green. Revisit when Astro/vitest align on one Vite major, or pin via a different mechanism. See `DECISIONS.md` D-007.
- **Hand-written type shims:** `packages/vue/types.d.ts` and `packages/svelte/types.d.ts` declare the public component types by hand so `astro check` can type cross-package `.vue`/`.svelte` imports. Replace with generated types when a build step is added. See `DECISIONS.md` D-006.
- `@astrojs/svelte` bundles its own `vite-plugin-svelte` 5.1.1 (upstream) → no action needed.

## Session log

### 2026-06-28 — PR 2b merged + docs continuity pass

Merged PR #9 (Gradient + Shiny) to `main`; synced the vault. Then refreshed the resume docs so a fresh session has full context without re-deriving: rewrote PROGRESS **“Next up”** with the concrete remaining PRs (2c/2d/2e), the three proven component patterns (per-char CSS · whole-text CSS · GSAP), and the gotchas already solved (parity freeze, reduced-motion `will-change`, Vue local `Props`, registry bundling); status-tracked Phase 2 in `ROADMAP.md`; rewrote `COMPONENT_GUIDE.md` to the **actual** proven procedure (shared CSS module in `@jolt/core/src/styles/`, correct paths, the three patterns). 5 of ~9 Phase-2 components shipped; next is **PR 2c (Typewriter + Rotating Words)**.

### 2026-06-28 — Phase 2 PR 2b: Gradient Text + Shiny Text (whole-text CSS-only)

Added the next two Text-Animation components and the **whole-text** CSS-only sub-pattern (vs the per-character Blur In/Wave). **Gradient Text** (a flowing multi-color gradient) and **Shiny Text** (a sweeping sheen) both use `background-clip: text` on the whole string — **no segmentation, no aria-label** (the text renders directly and is natively accessible).

- Same shared-CSS distribution as 2a (`@jolt/core/src/styles/<id>.css`, skins set `--jolt-*` from props, bundled via the registry's core item). Gradient builds `--jolt-gradient` from a `colors` array, repeating the first stop so the scroll loops seamlessly.
- **Generalized `propsTable`** to describe array props (`string[]`) for Gradient's `colors` — TDD red → green.
- **Parity harness/spec now handles two component kinds:** per-char (aria-label + aria-hidden segments) and whole-text (text read from the component's own span). Reading the text from the text-bearing element — not the whole cell — keeps a `client:load` island's inline hydration script out of the comparison.
- Each component: `.describe()`'d Zod schema + shared CSS + 3 skins + barrels + type shims + demo page (`/components/<id>`) + 2 unit tests (text content + CSS-var mapping) + registry item.

Green local: `pnpm verify` (**71 tests** + registry:check, astro check 13 pages) · `pnpm test:cli` (5 components) · `pnpm test:e2e` (parity all 5). On `feat/phase-2b-gradient-shiny`; PR pending. Decision **D-016** (whole-text sub-pattern).

### 2026-06-28 — Phase 2 PR 2a: Blur In + Wave (CSS-only distribution proven)

Started Phase 2 by filling the first two Text-Animation slots and — the real point — establishing the **CSS-only component distribution pattern** (the one new mechanic vs the GSAP SplitText). **Blur In** (per-char fade + de-blur) and **Wave** (traveling per-char bob) are both CSS-only, per-character, tri-framework.

- **Shared CSS module** per component in `@jolt/core/src/styles/<id>.css` (single source → no cross-framework drift); skins set `--jolt-*` custom properties from props and import the sheet. Reduced-motion renders the static final state **and releases `will-change`** so parity screenshots rasterize on the deterministic CPU path — a GPU-layer subpixel diff was the lone parity failure (see DECISIONS **D-014**).
- **Registry bundling** (DECISIONS **D-013**): CSS files are part of the `core` item (`styles/*.css` glob); the skin's CSS import resolves to a registry file and is rewritten on `add`. CLI-smoke now adds split-text + blur-in + wave and asserts both stylesheets land + the consumer type-checks.
- **Generalized the tooling for the rest of the category:** `splitTextPropsTable()` → reusable `propsTable(schema)`; `registry-check.mjs` loops **every** component item per framework; the parity harness/spec became a combined `/internal/parity` + `e2e/parity.spec.ts` looping over component ids (replaced the SplitText-specific pair).
- Per component: `.describe()`'d Zod schema + shared CSS + 3 skins + barrels + type shims + demo page (`/components/<id>`) + 3 unit tests (aria-label, per-char segment count, CSS-var mapping) + registry item.

Green: `pnpm verify` (**58 tests** + registry:check, astro check 11 pages) · `pnpm test:cli` (3 components) · `pnpm test:e2e` (parity for all three). On `feat/phase-2a-blur-wave`; PR pending.

### 2026-06-28 — Phase 1 (final slice): code tabs + schema-driven props table

Closed out Phase 1. The component page (`/components/split-text`) now has: live demos, an **install** block, **tabbed source** (React/Vue/Svelte) with copy buttons via `astro-expressive-code`, and a **props table generated from the schema**. To make the table schema-derived, added `.describe()` to each `splitTextSchema` field plus a `splitTextPropsTable()` helper in `@jolt/core` (introspects the schema via zod `instanceof` narrowing — no `any`), with tests asserting it can't drift. Added `@jolt/core` + `astro-expressive-code` to the site's deps. Also hardened `cli-smoke.mjs` — it now snapshots/restores the *pre-run* lockfile instead of `git checkout HEAD`, so it can't clobber uncommitted lockfile changes. `pnpm verify` (37 tests) + `test:cli` + `test:e2e` + `build` (3 pages) green. **Phase 1 complete.**

### 2026-06-28 — Phase 1: Playwright parity E2E

Added Playwright (`@playwright/test` + chromium) and `e2e/split-text-parity.spec.ts` (`pnpm test:e2e`, wired into CI after build). Against the Astro dev server with `reducedMotion: 'reduce'` (so the core renders its static final state), it loads an internal harness (`/internal/split-text-parity`, identical text in all three frameworks) and asserts: every island hydrates; identical segment count + text (DOM parity); and the three rendered cells are **pixel-identical** (compared to each other via pixelmatch within one run → OS-independent, no committed golden). Also fixed a latent dev-SSR bug — `@jolt/core`'s raw `.ts` wasn't in `vite.ssr.noExternal`; switched to a `[/^@jolt\//]` regex (build already worked, dev now does too). `pnpm verify` + `test:cli` + `test:e2e` + `build` (3 pages) all green.

### 2026-06-28 — Phase 1: CLI-smoke E2E

Added `scripts/cli-smoke.mjs` (`pnpm test:cli`, wired into CI after build). It builds the registry, then `jsrepo add`s `split-text` into a throwaway fixture via the local **fs provider** (`fs://…`, no network/live origin), and asserts: the bundled `core` files land (subdirs intact), the `@/jolt-core` import is rewritten to a relative path, no test files leak — and **the consumer project type-checks** (`tsc --noEmit` with react/gsap/zod present; gsap+zod are auto-installed by `jsrepo add`). Fixture dir `.cli-smoke-tmp/` is git-ignored and cleaned up. Kept out of `verify` (it installs + type-checks → runs in CI). Confirms the registry works end-to-end for a real consumer.

### 2026-06-28 — Phase 1: jsrepo registry (own-the-code bundling)

Added a jsrepo registry: `jsrepo.config.ts`, a root `tsconfig.json` (for jsrepo's `@/jolt-core` alias), and `scripts/registry-check.mjs`. Three per-framework registries build to `apps/site/public/r/{react,vue,svelte}`; each `split-text` component **bundles** the shared `core` (registry dependency) so consumers own 100% of the code. Achieved via a jsrepo `build.transforms` rewrite of `@jolt/core` → `@/jolt-core` that runs before import resolution — **source stays `@jolt/core`, so runtime/Vitest/type-checking are unchanged**. Core ships with subdirs preserved, tests excluded (`!(*.test).ts`). `registry:build` is part of `build`; `registry:check` is part of `verify` (asserts core bundled, no `@jolt/core` npm dep, import rewritten, no tests leaked). Output is git-ignored (regenerated). Full findings + jsrepo gotchas in DECISIONS **D-012**. `pnpm verify` (incl. registry:check) + `pnpm build` green.

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
