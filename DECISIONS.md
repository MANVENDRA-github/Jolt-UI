# DECISIONS — Jolt UI (Architecture Decision Log)

Append-only. One entry per non-trivial choice so future sessions don't relitigate. Newest at the bottom.

---

### D-001 — Direction: multi-framework gallery (2026-06-27)
Ship every component for **React + Vue + Svelte** from one design language, rather than a React-only react-bits clone. **Why:** react-bits/Aceternity/Magic UI are React-only; their Vue/Svelte ports are separate, drifting repos. Unifying three frameworks from one source is the defensible, ownable angle. **Cost:** ~3× per-component work, mitigated by a shared core + scaffolder.

### D-002 — Site framework: Astro 5 (2026-06-27)
**Why:** Astro is the only mainstream meta-framework that renders React + Vue + Svelte islands on a single page (islands architecture) — exactly the live tri-framework demo need. Static output, great SEO/perf, MDX + content collections. Considered Next.js (React-only for the site, awkward for Vue/Svelte demos) and Vite SPA (weaker docs/SEO).

### D-003 — Monorepo: pnpm workspaces, source ("just-in-time") packages (2026-06-27)
Packages export raw TS/`.vue`/`.svelte` source (no build step); the site/tests compile them via Vite + framework plugins. Astro `vite.ssr.noExternal: ['@jolt/*']` so they're transformed server-side. **Why:** zero build ceremony for a solo dev; one source of truth. No Turborepo yet (task graph is small) — revisit if build caching hurts.

### D-004 — Delivery: jsrepo registry + copy-paste (2026-06-27)
**Why:** jsrepo is framework-agnostic (multi-framework blocks), supports copy-paste + `npx jsrepo add`, and is what react-bits uses. shadcn CLI is React-centric. Implemented in Phase 1+.

### D-005 — v1 variants: TS + Tailwind only; Tailwind v4 CSS-first (2026-06-27)
Cut react-bits' 4-variant matrix (JS/TS × CSS/TW) → 12 files/component/3 frameworks. v1 ships **TS + Tailwind** per framework. **Why:** simplicity-first; JS/plain-CSS variants are mechanical and scaffold-generatable later. Tailwind **v4** chosen specifically: CSS-first `@theme` lets one `tokens/theme.css` be shared across all packages with no JS preset duplication.

### D-006 — Hand-written type shims for cross-package Vue/Svelte (2026-06-27)
`packages/{vue,svelte}/types.d.ts` declare the public component types by hand; `exports.types` points at them so `astro check` can type cross-package `.vue`/`.svelte` imports (Astro's checker has no Vue/Svelte language tooling). The **Svelte** shim is typed **props-first** (`(props) => unknown`) because Astro reads a component's first parameter as its props, whereas Svelte 5's `Component<P>` puts internals first. **Replace with generated `.d.ts` when a build step is added.**

### D-007 — Pin Vite to ^6; vitest's internal Vite 7 tolerated (2026-06-27)
Astro 5 uses Vite 6; `auto-install-peers` was pulling Vite 7 for plugin peers, causing a type clash in `astro.config.ts` (Tailwind plugin typed against Vite 7 vs Astro's Vite 6). Fixed by `pnpm.overrides.vite=^6` + an explicit root `vite@^6` devDep + reverting the Vue/Svelte Vitest plugins to their Vite-6 lines. **Residual:** vitest's `@vitest/mocker` still resolves Vite 7 (an auto-installed peer pnpm overrides don't constrain). Harmless — isolated to the test runner; site build, `astro check`, and tests are all green. Revisit if it ever bites.

### D-008 — Animation: CSS-first, GSAP when needed (2026-06-27)
GSAP became 100% free (incl. SplitText with built-in a11y, ScrollTrigger) in 2025 and is framework-agnostic → ideal shared core. Used as a **peer dependency**, registered client-side, only on components that need it. Three.js deferred to the Backgrounds category. Implemented in Phase 1.

### D-009 — Node ≥ 20.3 (2026-06-27)
Engines target Node ≥ 20.3 (the dev machine runs 20.20.1; satisfies Astro/Tailwind v4/Vitest). CI runs Node 20. Bump to 22 LTS later if a dependency requires it.

### D-010 — Name "Jolt UI", scope `@jolt/*` (2026-06-27)
Project named **Jolt UI** (was the placeholder "Triad"). npm/registry scope `@jolt/*`; CSS token prefix `--jolt-*`; CLI intent `npx jolt add` (Phase 1+). Canonical home is the GitHub repo `MANVENDRA-github/Jolt-UI`, cloned at `D:\Jolt-UI`; the throwaway scaffold dir `D:\triad` was migrated here and removed.

### D-011 — Vue skin declares props locally (2026-06-28)
Vue's `@vue/compiler-sfc` cannot resolve a schema-inferred type (`z.input<typeof splitTextSchema>`) inside `defineProps<T>()` — it throws "Unresolvable type reference". React and Svelte compile the inferred type fine. **Resolution:** the Vue SFC declares a local `Props` interface that mirrors the schema (kept in sync by hand + comment). The Zod schema remains the single source for runtime validation/defaults and for React/Svelte prop types; only Vue duplicates the *shape*. A future guard: a Vue-package test asserting the local interface keys match `splitTextSchema.shape`.

### D-012 — Registry: bundle the core ("own 100%") via a build transform (2026-06-28)
Distribute components via **jsrepo** so consumers own all the code, including the shared core (no npm runtime dep). Key jsrepo (v3.8) behaviors discovered empirically:
- jsrepo treats a package-like specifier (`@jolt/core`) as an **npm dependency** and will not bundle it. Only **path aliases** (e.g. `@/jolt-core`) are resolved to local files and bundled (with the import rewritten on `add`).
- jsrepo resolves path aliases from a `tsconfig.json` at the **config cwd (repo root)** — per-package tsconfig `paths` were ignored. So a root `tsconfig.json` declares `@/jolt-core` → `packages/core/src/index.ts`.
- A jsrepo **`build.transforms`** entry runs **before** import resolution, so we rewrite `@jolt/core` → `@/jolt-core` at build time. The **source keeps `@jolt/core`** (monorepo runtime, Vitest, and type-checking are unchanged); only the distributed blocks use the alias.

**Shape:** one registry per framework (item names must be globally unique) → `apps/site/public/r/{react,vue,svelte}`. Each has a `split-text` component item + a shared `core` lib item; `split-text` declares `core` as a registry dependency. Core files use the glob `packages/core/src/**/!(*.test).ts` — subdirs preserved, **tests excluded** (jsrepo has no file-ignore; `target` and negative-glob entries did not work; the extglob did).

**Plumbing:** the output is git-ignored and regenerated by `registry:build` (run as part of `build`) and validated by `registry:check` (part of `verify`; asserts core is bundled, no `@jolt/core` npm dep, import rewritten, no test files leaked).

### D-013 — CSS-only components: one shared stylesheet in the core (2026-06-28)
CSS-only animations (Blur In, Wave, …) keep their `@keyframes` + classes in a **shared module** `packages/core/src/styles/<id>.css` — the single source so all three skins render identically (no per-framework CSS drift). The skins set tunable values as `--jolt-*` **custom properties** from props and `import '@jolt/core/styles/<id>.css'`. **Why one source:** the differentiator is cross-framework parity; duplicating CSS per skin would reintroduce the drift we exist to prevent.
- **Resolution/typecheck:** added a `@jolt/core/*` subpath export (`"./*": "./src/*"`) + a root `@/jolt-core/*` alias; each framework package has a `src/css.d.ts` (`declare module '*.css'`) so `tsc`/`vue-tsc`/`svelte-check` accept the side-effect import.
- **Registry bundling:** the CSS files are part of the **`core`** item (added a `styles/*.css` glob); the skin's CSS import resolves to a registry file, so `jsrepo add <id>` bundles core + the stylesheet and rewrites the import to a local path on `add`. Validated end-to-end by CLI-smoke (adds the component, asserts the `.css` lands, consumer type-checks). **Trade-off:** the core item is monolithic, so any component install pulls the whole core (all schemas + every CSS). Acceptable while core is small; revisit with per-component slices if it grows.
- Generalized alongside this: `propsTable(schema)` (was `splitTextPropsTable`), `registry-check.mjs` loops **all** component items, and the parity harness/spec is now a combined `/internal/parity` + `e2e/parity.spec.ts` that loops over component ids.

### D-014 — Release `will-change` in the reduced-motion final state (2026-06-28)
A CSS-only segment animating `filter`/`transform` carries `will-change` to hint GPU compositing. The parity E2E (which runs under `prefers-reduced-motion: reduce`) failed for Blur In at ~2.2% because the static segments were **still GPU-composited** (`will-change` left on), and per-glyph layer rasterization differs subtly between the React and Vue cells. **Fix:** the `@media (prefers-reduced-motion: reduce)` block sets `will-change: auto` (alongside `animation: none`), so the static text rasterizes on the deterministic CPU path. SplitText (GSAP) didn't hit this because GSAP clears the hint at its final state. **Rule:** any CSS-only component must neutralize `will-change` in its reduced-motion state, not just the animation.
