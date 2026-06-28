# ROADMAP — Jolt UI

Build order. Each phase is a session-sized slice that ends **runnable + verified + merged**. Don't scaffold ahead of the current phase. Mark phases done here and mirror the live state in `PROGRESS.md`.

---

## ✅ Phase 0 — Foundation & tooling — **DONE (2026-06-27)**

**Goal:** an empty but fully-wired monorepo that lints, typechecks, tests, and builds an Astro shell proving React + Vue + Svelte coexist + hydrate on one page.

Delivered: pnpm workspace; TS strict + `tsconfig.base`; ESLint flat + Prettier; Vitest (one project per framework, trivial test each); `@jolt/tokens` (`theme.css` + `tokens.ts` + parity test); Astro site rendering one hello-island per framework with dark-mode toggle; `pnpm verify`; GitHub Actions CI; all tracking docs.

**Exit criteria — met:** `pnpm verify` green (typecheck + lint + 8 tests); `pnpm build` green (3 framework bundles, 1 page); all three islands render in SSR output. See `PROGRESS.md` for captured output.

---

## ✅ Phase 1 — Vertical slice: one GSAP component, end-to-end, tri-framework — **DONE (2026-06-28)**

Delivered across PRs #1/#3 (SplitText core + 3 skins + demo + unit tests), #4 (jsrepo registry, own-the-code bundling), #5 (CLI-smoke E2E), #6 (Playwright parity E2E), and the docs slice (code-tabs + schema-driven props table). `pnpm verify` + `test:cli` + `test:e2e` + `build` all green; the `split-text` registry installs into a real consumer and type-checks.

**Goal:** prove the *entire* pipeline on the hardest path so the rest is downhill. Component: `split-text` (a GSAP split/stagger reveal).

**Deliverables:**
- `packages/core`: Zod prop schema (`schemas/split-text.ts`) + framework-agnostic GSAP primitive (`primitives/split-text.ts`) + `motion.ts` (reduced-motion + plugin registration).
- Three thin skins: `@jolt/{react,vue,svelte}` SplitText calling the core, reverting on unmount.
- Site: a component page with 3 live islands + tabbed source (expressive-code) + copy button + MDX doc with a schema-generated props table.
- `packages/registry`: jsrepo config; `react|vue|svelte/split-text` blocks + shared `lib/core` & `lib/tokens` blocks.
- Tests: per-framework unit tests (DOM parity for same props, cleanup on unmount, reduced-motion path); Playwright **parity** E2E; **CLI smoke** (jsrepo add into a fixture → typecheck); `registry:check` sync test.

**Exit criteria:** demo live via `pnpm dev`; `npx jsrepo add` (local origin) installs + fixture typechecks; parity + copy + hydration E2E green; `pnpm registry:check` green; `pnpm verify` green.

---

## Phase 2 — Fill the Text-Animations category (10 components) — **DONE (2026-06-28)**

~2 components per PR (each its own small, phone-reviewable PR the maintainer merges). Every component follows the per-component slice in `COMPONENT_GUIDE.md` and **one of three proven patterns**: per-char CSS-only, whole-text CSS-only, or GSAP.

| PR | Components | Pattern | Status |
|----|-----------|---------|--------|
| Phase 1 | Split Text | GSAP | ✅ merged (#1–#7) |
| 2a | Blur In · Wave | per-char CSS | ✅ merged (#8) |
| 2b | Gradient Text · Shiny Text | whole-text CSS | ✅ merged (#9) |
| 2c | Typewriter · Rotating Words | CSS (structural) | ✅ merged (#11) |
| 2d | Count Up · Scramble | GSAP | ✅ merged (#12) |
| 2e | Scroll-Velocity + category index page | GSAP (ScrollTrigger) | ✅ merged (#13) |

Gates per PR: `pnpm verify` + `pnpm test:cli` + `pnpm test:e2e` green. Cross-framework parity is enforced by the Playwright harness (`/internal/parity` + `e2e/parity.spec.ts`), which **freezes animations to a deterministic frame** (DECISIONS D-015) — reduced-motion alone won't freeze a looping animation on CI. Live state, the three patterns, and solved gotchas: `PROGRESS.md` → “Next up”; rationale: `DECISIONS.md` (D-008, D-011–D-019).

## ✅ Phase 3 — Registry & copy-paste UX + scaffolder — **DONE (2026-06-28)**

Install tabs (pnpm/npm + jsrepo), dependency/peer badges, `scripts/gen-component.mjs` (stamps schema + 3 skins + demos + tests from one contract; CSS patterns), `registry:check` wired into `verify`.

## ✅ Phase 4 — Deploy + docs + SEO — **DONE (2026-06-28)**

Cloudflare Pages (site + `/r/*` registry from one origin, single `JOLT_ORIGIN`); Getting-Started / Theming / Accessibility / Contributing docs; sitemap + OG + JSON-LD; Pagefind search in prod; `_headers` + `DEPLOY.md`. **v1 complete** (the dashboard connect is the maintainer's one manual step).

## ✅ Phase 5 — Backgrounds category (Three.js) — **DONE (2026-06-28)** · merged (#23, #25)

The first non-text category, built as two slices:

- **5a — Category infrastructure** ✅: nested `/components/<category>/<id>` routes, a category sub-nav (`ComponentsLayout`), a grouped index, redirects from the old flat paths, and a `categories` registry. No new component.
- **5b — Particles (Three.js) vertical slice** ✅: one canvas background end-to-end, front-loading the Three.js stack — a `packages/core/src/webgl/` split + a `particles-core` jsrepo item so `three` lands only for the background (D-028), a functional-core/imperative-shell factory with full GPU disposal (D-030), and a non-text "background" parity kind (D-029).

## Phase 6 — Fill the Backgrounds category — **in progress**

More Three.js backgrounds, ~2 per PR on the proven Particles pattern (per-component slice + the factory pattern, DECISIONS D-028–D-032).

- **6a — Waves + Dots** ✅: an undulating wireframe plane + a rippling point grid. Generalized `particles-core` → a shared **`webgl-core`** item (D-031), so adding a background is now just a new file in `webgl/`.
- **6b — Globe + Rings** ✅: a rotating point-sphere (with a breathing pulse) + counter-rotating concentric rings. Also resolved the parity-harness WebGL-context limit — backgrounds now render on per-background isolated pages so only ~3 GL contexts are live at once, scaling to any number (D-032).
- Next: more backgrounds (Aurora/shader, …). The harness now scales past the context cap, so it's no longer a blocker.

## Later (out of v1 scope)

More categories · JS / plain-CSS variants via the scaffolder · GSAP support in the scaffolder · more frameworks (Solid, Angular, web components) · shadcn-registry JSON + MCP server · pro templates/themes · Turborepo (only if build caching warrants).
