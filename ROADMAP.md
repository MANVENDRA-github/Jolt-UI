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

**Goal:** prove the _entire_ pipeline on the hardest path so the rest is downhill. Component: `split-text` (a GSAP split/stagger reveal).

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

| PR      | Components                            | Pattern              | Status            |
| ------- | ------------------------------------- | -------------------- | ----------------- |
| Phase 1 | Split Text                            | GSAP                 | ✅ merged (#1–#7) |
| 2a      | Blur In · Wave                        | per-char CSS         | ✅ merged (#8)    |
| 2b      | Gradient Text · Shiny Text            | whole-text CSS       | ✅ merged (#9)    |
| 2c      | Typewriter · Rotating Words           | CSS (structural)     | ✅ merged (#11)   |
| 2d      | Count Up · Scramble                   | GSAP                 | ✅ merged (#12)   |
| 2e      | Scroll-Velocity + category index page | GSAP (ScrollTrigger) | ✅ merged (#13)   |

Gates per PR: `pnpm verify` + `pnpm test:cli` + `pnpm test:e2e` green. Cross-framework parity is enforced by the Playwright harness (`/internal/parity` + `e2e/parity.spec.ts`), which **freezes animations to a deterministic frame** (DECISIONS D-015) — reduced-motion alone won't freeze a looping animation on CI. Live state, the three patterns, and solved gotchas: `PROGRESS.md` → “Next up”; rationale: `DECISIONS.md` (D-008, D-011–D-019).

## ✅ Phase 3 — Registry & copy-paste UX + scaffolder — **DONE (2026-06-28)**

Install tabs (pnpm/npm + jsrepo), dependency/peer badges, `scripts/gen-component.mjs` (stamps schema + 3 skins + demos + tests from one contract; CSS patterns), `registry:check` wired into `verify`.

## ✅ Phase 4 — Deploy + docs + SEO — **DONE (2026-06-28)**

Cloudflare Pages (site + `/r/*` registry from one origin, single `JOLT_ORIGIN`); Getting-Started / Theming / Accessibility / Contributing docs; sitemap + OG + JSON-LD; Pagefind search in prod; `_headers` + `DEPLOY.md`. **v1 complete** (the dashboard connect is the maintainer's one manual step).

## ✅ Phase 5 — Backgrounds category (Three.js) — **DONE (2026-06-28)** · merged (#23, #25)

The first non-text category, built as two slices:

- **5a — Category infrastructure** ✅: nested `/components/<category>/<id>` routes, a category sub-nav (`ComponentsLayout`), a grouped index, redirects from the old flat paths, and a `categories` registry. No new component.
- **5b — Particles (Three.js) vertical slice** ✅: one canvas background end-to-end, front-loading the Three.js stack — a `packages/core/src/webgl/` split + a `particles-core` jsrepo item so `three` lands only for the background (D-028), a functional-core/imperative-shell factory with full GPU disposal (D-030), and a non-text "background" parity kind (D-029).

## ✅ Phase 6 — Fill the Backgrounds category — **DONE (2026-06-29)** · merged (#26, #27, #29)

More Three.js backgrounds on the proven Particles pattern (per-component slice + the factory pattern, DECISIONS D-028–D-033).

- **6a — Waves + Dots** ✅: an undulating wireframe plane + a rippling point grid. Generalized `particles-core` → a shared **`webgl-core`** item (D-031), so adding a background is now just a new file in `webgl/`.
- **6b — Globe + Rings** ✅: a rotating point-sphere (with a breathing pulse) + counter-rotating concentric rings. Also resolved the parity-harness WebGL-context limit — backgrounds now render on per-background isolated pages so only ~3 GL contexts are live at once, scaling to any number (D-032).
- **6c — Aurora** ✅: the first **shader** background — a flowing aurora light-curtain in a custom-GLSL `ShaderMaterial` (the functional core becomes prop→uniform resolution; the GLSL is live-verified, D-033). Establishes the shader pattern.
- Backgrounds is a solid 6-component category; more (shaders / CPU-vertex) can come later.

## ✅ Phase 7 — Loaders (the 3rd category) — **DONE (2026-06-29)**

CSS-only animated loaders across all three frameworks, on the proven shared-CSS distribution.

- **7a — Spinner + Dot-Bounce + Bars** ✅ (#31): bootstrapped the `loader` category + a new **`GRAPHIC`** parity kind (non-text, non-canvas, pixel-compared CSS on the shared harness) + a `role="status"` a11y pattern (D-034). Loaders are hand-written (the scaffolder stays text-only).
- **7b — Pulse + Ripple** ✅ (#33): expanding sonar-ping discs + Material concentric rings. Loaders **3 → 5**.
- **7c — Grid + Progress Bar** ✅ (#34): a 3×3 diagonal-wave grid + an indeterminate sliding bar. Loaders **5 → 7**. (Follow-up #36: ProgressBar opts out of pixel parity, D-035.)

## ✅ Phase 8 — Buttons (the 4th category) — **DONE (2026-06-29)** · merged (#37)

The gallery's first **interactive** components — a real `<button>` with a text label, animated by interaction (hover/press) or a self-running surface effect. CSS-only, across all three frameworks, on the shared-CSS distribution.

- **Bootstrap (one PR, 6 buttons): Shimmer · Glow · Gradient · Sweep · Border Draw · Tactile** — establishes the **interactive skin pattern** (native `<button>`; `label` via children/slot; `onClick`/`disabled`/native attrs forwarded — React `& ButtonHTMLAttributes` + `...rest`, Vue attribute fallthrough, Svelte 5 `& HTMLButtonAttributes` + Snippet children) and a new **`INTERACTIVE`** parity kind (assert `<button>` + label-text parity + rest-state pixel-compare; hover/focus/press-triggered parity deferred). Buttons are hand-written (the scaffolder stays text-only). Decision **D-036**. Follow-up: the 4 self-running keyframe buttons joined `NO_PIXEL_PARITY` (D-035).

## ✅ Phase 9 — Cards (the 5th category) — **DONE (2026-06-30)**

The gallery's first **container** components — a presentational `<div>` wrapping arbitrary child content — and the first DOM-event behavior in core.

- **Spotlight · Tilt · Shine Border**, plus the **pointer-tracking core** (pure `behavior/pointer-math.ts` + the `behavior/pointer.ts` shell, SSR/reduced-motion safe) and a new **`CONTAINER`** parity kind (card root + slotted child text + rest-state pixel-compare; pointer-driven states deferred). Decision **D-037**.

_(Site-only, between phases: the "Voltage" redesign (D-038, #39–#45) and "Voltage 2: The Current" 3D landing (D-039, #48–#54), plus 3 more text components — Fade Up · Flip In · Neon (#53). Neither touched the parity harness.)_

## Phase 10 — Stacked expansion: 15 components, 2 new categories, scaffolder v2 — **in progress**

Broadening the catalog from 35 → 50 across six independently-green PRs. Machinery budget: CSS + the existing pointer behavior + three new core behaviors (scroll-reveal, click-spark, magnet). No new GSAP components; shader backgrounds ride the existing `webgl-core`.

- **10a — Scaffolder v2** ✅: `gen-component` learns the `css-container` (card) and `css-interactive` (button) kinds — the contract's `text`-prop and required-prop rules become kind-conditional, and the contract gains `category` + `hydrate` (D-040). Per-section gallery-card markers `gen:card:<slug>` replace the single frozen `gen:card`, which made a non-text card unsplice-able (D-041). Ships no component; gated by `test:gen`.
- **10b — Text 13→16:** Glitch Text · True Focus · Circular Text (scaffolded, CSS-only).
- **10c — Cards 3→5, Buttons 6→7:** Glare · Border Glow (pointer-driven, via scaffolder v2 + `trackPointer`) · Star Border.
- **10d — Effects (the 6th category):** Fade Content · Animated Content · Click Spark · Magnet, plus three new core behaviors on the functional-core/imperative-shell split. Reuses the `CONTAINER` parity kind.
- **10e — Backgrounds 6→9:** Silk · Iridescence · Light Rays, on the Aurora `ShaderMaterial` pattern (D-033).
- **10f — Interface (the 7th category):** Dock (pointer magnification) · Counter (prop-driven CSS digit roll).

Cut from scope: `pixel-card` (canvas + per-pixel RAF — outside the budget) and `stepper` (stateful → per-framework drift).

## Later (out of v1 scope)

More categories · JS / plain-CSS variants via the scaffolder · GSAP support in the scaffolder · more frameworks (Solid, Angular, web components) · shadcn-registry JSON + MCP server · pro templates/themes · Turborepo (only if build caching warrants).
