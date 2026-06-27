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
