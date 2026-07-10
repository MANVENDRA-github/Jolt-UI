# PROGRESS — Jolt UI

> The cross-session heartbeat. **Read this first** to resume; **update it last** before you stop.
> Newest session entry on top.

## Snapshot

- **Phase 10 — Stacked expansion: 15 components, 2 new categories, scaffolder v2 (2026-07-10, D-040→D-047) — 6 PRs #55–#60, stacked, pending merge:** the catalog went **35 → 50 components across 5 → 7 categories**. Six independently-green feature branches stacked `main → 10a → 10b → … → 10f` (merge in order or squash). **Now 50 components: 16 text · 9 backgrounds · 7 loaders · 7 buttons · 5 cards · 4 effects · 2 interface.** Slices:
  - **10a — Scaffolder v2 (#55):** `gen-component` learned the `css-container` (card) + `css-interactive` (button) kinds — the contract's `text`/required-prop rules became kind-conditional, and it gained `category` + `hydrate` fields (D-040). Per-section gallery markers `gen:card:<slug>` replaced the single frozen `gen:card`, which had made a non-text card unsplice-able (D-041). Ships no component; `test:gen` 45 → 74. **Proven end-to-end** by generating a card + button, typechecking, then reverting.
  - **10b — Text 13→16 (#56):** Glitch Text · True Focus · Circular Text (scaffolded, CSS-only). All keep pixel parity (0% == 100% == reduced-motion frame). `true-focus`/`circular-text` publish `--jolt-count` (segment total) for the cycle length / slot angle.
  - **10c — Cards 3→5, Buttons 6→7 (#57):** Glare · Border Glow (pointer-driven via scaffolder v2 + `trackPointer`, pixel-parity kept) · Star Border (`NO_PIXEL_PARITY`, self-running). First components from scaffolder v2. No new core code.
  - **10d — Effects, the 6th category (#58):** Fade Content · Animated Content · Click Spark · Magnet. **Three new core behaviors** on the functional-core/imperative-shell split: `observeReveal` (scroll reveal — hidden state on `[data-jolt-armed]`, which only JS sets, so degraded paths stay visible, D-043), `attachClickSpark` (DOM/CSS rays, not canvas+RAF, D-044), `writeMagnet` reusing `trackPointer` (D-045). Reuses `CONTAINER` — no new kind, "Effects" not "Animations" (D-042).
  - **10e — Backgrounds 6→9 (#59):** Silk · Iridescence · Light Rays, on the Aurora `ShaderMaterial` pattern (D-033). Renamed `webgl/aurora-field.ts` → `webgl/uniforms.ts` (four shaders share the prop→uniform resolution) + `degreesToRadians` (NaN-guards a rotation uniform). No new jsrepo item — they ride `webgl-core`, `three ∉ core` holds (D-046).
  - **10f — Interface, the 7th category (#60):** Dock (pointer magnification via new `dockScale` raised-cosine + `trackDock` — a per-item scale, unlike `trackPointer`) · Counter (prop-driven CSS digit-roll, `counterCells` split). Slug `ui` not `component` (D-047). `stepper` + `pixel-card` cut.
  - **Green every slice:** `pnpm verify` (**645 vitest + 74 test:gen** + registry:check, 41 items/fw) · `build` (66 pages) · `test:dist` · `test:cli` · `test:e2e` **27/27 twice on fresh servers**. Each new component's motion **live-verified in a real browser** in both motion modes (the parity gate never moves the pointer, clicks, scrolls, or watches a roll — so those are proven by hand). The three shaders live-verified to compile + paint + animate (a blank canvas from a failed compile passes the structural `BACKGROUND` test). **Known dev hazard:** a stale `pnpm dev` on :4321 makes a fresh one silently take :4322 and hydration flakes (the D-039(5) Vite-optimizer signature) — kill strays + `rm -rf **/.vite apps/site/.astro` if e2e shows every island failing to hydrate. CI is cold-start, unaffected.
- **UI/UX revamp — "Voltage 2: The Current" (2026-07-05, D-039) — MERGED to `main`:** a **site-only** 3D-landing + custom-scroll revamp. The stack landed as tokens (#48) · landing story (#54, replacing auto-closed #49) · scene+scroll+polish (#52 carried #50+#51 after the squash-merge rewrote the stack's shared base). The homepage is now a full-bleed 6-section scroll story — a **bespoke Three.js "volt-field" shader** (one electric current that bends to the pointer and **splits into 3 filaments** as you scroll, site-local at `apps/site/src/scenes/`, not shipped to consumers) behind hero+split, then a dogfood grid, an install moment, the restaged 3-rail Wave signature, and a big CTA. **Lenis** smooth scroll + **GSAP ScrollTrigger** scrub drive it — all motion libs are lazy + `prefers-reduced-motion`-gated (reduced users download none). **Every component's motion/behavior + all features are unchanged, the parity harness `/internal/parity*` was untouched, and additive tokens keep all frozen names** — the pixel gate is unaffected. Progressive-enhancement invariant (nothing CSS-hidden) keeps the reduced-motion e2e green. Session-log entry + D-039 below.
- **New text components — Fade Up · Flip In · Neon (2026-07-05, PR #53 — MERGED to `main`):** 3 CSS-only Text Animations added via the `gen-component` scaffolder + hand-customized keyframes. **Fade Up** + **Flip In** are per-char (rise+fade / 3D rotateX flip, staggered); **Neon** is whole-text (a neon sign that flickers on to a steady glow, one-shot `forwards` so the settled state matches the reduced-motion static frame + the parity freeze → pixel-parity safe). Contracts saved at `scripts/contracts/{fade-up,flip-in,neon}.mjs`. **Text Animations now 13 — 5 categories, 35 components (13 text · 6 backgrounds · 7 loaders · 6 buttons · 3 cards).** Gotcha re-confirmed: the parity **harness** cells must render `text="Jolt UI"` (the spec's `TEXT` constant), not the contract's `harnessProps` label — fixed the 9 spliced cells + the contracts. Green: `pnpm verify` (**37 registry items/fw**) · `build` (48 pages) · `test:dist` · `test:cli` · `test:e2e` **17/17 twice**.
- **UI/UX redesign — "Voltage" (2026-07-01, D-038):** a full **site** redesign (identity + homepage + gallery + demo UX + fully-resolved light/dark) shipped as **8 stacked, independently-green PRs #39→#45** (A tokens+fonts · B chrome · C component accent→volt · D framework-switcher demo pages · E scaffolder sync · F homepage "current" hero · G gallery+orphans · H docs/light-dark sweep), pending merge (the stack sits on top of `main`; merge in order or squash). **Every component's motion/behavior + all features are unchanged, and the parity harness `/internal/parity*` was untouched, so the pixel gate is unaffected.** Session-log entry + D-038 below.
- **Current phase:** **Phase 10 — done, pending merge of #55–#60** (see the top snapshot). **Next:** merge the stack (in order or squash), then `git checkout main && git pull`. Candidate follow-ups: the radius-activated Magnet variant (10d deferred a hover-scoped v1), icon-system Dock tiles + thousands-separator Counter (10f v1 simplifications), GSAP support in the scaffolder (the long-standing carry-over), or an 8th category. The Cloudflare Pages dashboard connect is still the maintainer's one manual step. _(Historical: Phase 9 — Cards, D-037; Phase 8 — Buttons, D-036; snapshots below.)_ **Phase 8 — Buttons (the gallery's 4th category, and its first _interactive_ components).** v1 (Phases 0–4) + Phase 5 + Phase 6 (6 Three.js backgrounds incl. the Aurora shader) + **Phase 7 (Loaders, complete at 7) are merged to `main`** (7a #31 · 7b #33 · 7c #34 · ProgressBar parity fix #36). **Phase 8 — the Buttons bootstrap + Shimmer / Glow / Gradient / Sweep / Border Draw / Tactile** (the **interactive skin pattern** + a new `INTERACTIVE` parity kind, D-036) is **built + green, PR #37** — **4 categories, 29 components (10 text · 6 backgrounds · 7 loaders · 6 buttons)**; the Buttons category bootstraps at 6. _(The one remaining v1 deploy step is still YOURS: connect the repo in Cloudflare Pages — `pnpm build` → `apps/site/dist`, `NODE_VERSION=20`; see `DEPLOY.md`.)_
- **Repo:** `D:\Jolt-UI` · remote `github.com/MANVENDRA-github/Jolt-UI`. Branch → PR → merge (never push `main`).
- **Health:** `pnpm verify` green (**338 vitest + 45 `test:gen`** + registry:check incl. the `three`-isolation invariant, **31 items/framework**) · `pnpm build` (**42 pages**, Pagefind-indexed) + `pnpm test:dist` · `pnpm test:cli` (**29 component items**, incl. the 6 buttons bundling their shared CSS) · `pnpm test:e2e` (**15 tests**: on-page parity — text + the 7 loaders (`GRAPHIC`) + the 6 buttons (`INTERACTIVE`: `<button>` + label-text parity; sweep + tactile also rest-state pixel-compared, the 4 self-running keyframe buttons in `NO_PIXEL_PARITY` per D-035) — + a per-background isolation test over 6 backgrounds + install + SEO + docs + search + components-nav) green. The 6 buttons live-verified in a real browser (17 checks: self-running buttons animate; reduced-motion stops the glow; sweep hover changes color; tactile press wired; keyboard-focusable + native click fires; no console errors). (Phases 0–7 on `main`; Phase 8 on its feature branch. CI green on every PR.)

## How to resume

```bash
cd D:\Jolt-UI
pnpm install
pnpm verify        # typecheck + lint + test + registry:check  (expect green)
pnpm test:cli      # E2E: jsrepo add into a temp fixture -> bundles core + consumer typechecks
pnpm test:e2e      # E2E: Playwright cross-framework parity for every component (real browser)
pnpm dev           # site: '/components' index + '/components/<id>' demos (…, count-up, scramble, scroll-velocity)
```

Then open `ROADMAP.md` → Phase 3, and `COMPONENT_GUIDE.md` for the add-a-component steps.

## Next session — start here (Phase 4, after the Phase-3 PRs merge)

Phase 3 is **done** — both slices green on feature branches (PRs pending merge): **3a** install UX (`feat/phase-3a-install-info`, PR #15) and **3b** the `gen-component.mjs` scaffolder (`feat/phase-3b-scaffolder`, **stacked on 3a**). To resume:

1. Merge **3a then 3b** (3b is stacked on 3a — rebase onto `main` after 3a merges). Then `git checkout main && git pull` and run the **How to resume** gates above (expect green).
2. Start **Phase 4 — Deploy + docs + SEO** (`ROADMAP.md`): Cloudflare Pages/Workers serving the site + `/r/*` registry from one origin (then swap `REGISTRY_BASE` in `packages/core/src/registry.ts` from the `<registry-url>` placeholder to the real origin), Getting-Started / Theming / Accessibility / Contributing docs, sitemap + per-component OG images + JSON-LD, Pagefind search.
3. **Carry-over follow-up:** the scaffolder covers **CSS** components only (`pattern: 'gsap'` is rejected). Extend `scripts/gen/*` to emit the **GSAP** factory + lifecycle skins when the next GSAP component is needed. The scaffolder workflow + the manual per-component slice are in `COMPONENT_GUIDE.md` (“Generate with the scaffolder” + the steps below); solved parity gotchas in `DECISIONS.md` D-013–D-021.

## Component playbook (Phase 2 is complete — this is the reference for adding components)

Phase 2 **filled the Text-Animations category**: 10 components across all three patterns (per-char CSS · whole-text CSS · structural CSS · GSAP), plus a `/components` index page. **Next is Phase 3** — Registry & copy-paste UX + a `gen-component` scaffolder (install tabs, dep/peer badges; see `ROADMAP.md`). The per-component slice, the three patterns, and the solved gotchas below remain the reference for adding any future component.

### The per-component slice (repeat this — see `COMPONENT_GUIDE.md` for the full checklist)

Zod schema (`packages/core/src/schemas/<id>.ts`, every field `.describe()`'d + `.default()`) → behavior (shared CSS module **or** GSAP factory) → 3 skins (`packages/{react,vue,svelte}/src/components/<Name>/` + barrel + `index.ts` export + vue/svelte `types.d.ts` shim) → demo page (`apps/site/src/pages/components/<id>.astro`) → registry items in `jsrepo.config.ts` (all 3 frameworks) → unit tests (3 frameworks) → extend the parity harness (`apps/site/src/pages/internal/parity.astro`) + `e2e/parity.spec.ts` (add the id to `PER_CHAR` or `WHOLE_TEXT`) → extend `scripts/cli-smoke.mjs` → **gates: `pnpm verify` + `pnpm test:cli` + `pnpm test:e2e`, then PR.**

### Three proven component patterns (pick one per component)

- **Per-char CSS-only** (Blur In, Wave): split via `splitSegments` (`core/dom/split.ts`); shared `@jolt/core/src/styles/<id>.css` with `@keyframes`; skins render `<span aria-label> + aria-hidden segments` and set `--jolt-*` (+ per-segment `--jolt-i`). DECISIONS **D-013, D-014**.
- **Whole-text CSS-only** (Gradient, Shiny): no segmentation — `<span class="jolt-…">{text}</span>` directly (natively accessible, no aria-label); `background-clip: text`. DECISIONS **D-016**.
- **GSAP** (SplitText, Count Up, Scramble, Scroll-Velocity): framework-agnostic factory in `core/animation/<id>.ts` returning `{ play, revert }`; skins call it on mount and `revert` on unmount. **Register a GSAP plugin _inside its factory module_ (client-side), not at module load** — ScrambleText/ScrollTrigger touch `window`/`matchMedia` and break jsdom/SSR if registered eagerly (**D-018, D-019**). DECISIONS **D-008**.

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
- **Parity-harness WebGL contexts — RESOLVED in PR 6b (D-032):** backgrounds no longer share `/internal/parity`; each renders on its own `apps/site/src/pages/internal/parity-bg/<id>.astro` page, and the background test visits them one at a time (`context.newPage()` → assert → `page.close()`), so **only ~3 GL contexts are live at once regardless of how many backgrounds exist** — closing the page frees them deterministically (a plain shared-page `goto` loop can leave contexts in Chromium's bfcache). The old ~16-context cap is no longer a constraint.

## Session log

### 2026-07-05 — "Voltage 2: The Current" — 3D landing + custom scroll (5 PRs, site-only)

A second site-only revamp: a scroll-stopping landing built on a bespoke WebGL scene + Lenis smooth scroll + GSAP ScrollTrigger, plus full-site chrome/gallery/docs polish. Evolves (not replaces) the Voltage identity. **5 stacked feature branches → PRs #48–#52.** Decision **D-039**.

- **A (tokens, #48):** additive `--jolt-abyss`/`--jolt-filament`/`--shadow-jolt-glow-lg` in both `[data-theme]` blocks; `tokens.test.ts` asserts each name in both (test-first). No renames, `tokens.ts` untouched.
- **B (static landing, #49):** the homepage → six full-bleed sections (Hero · SplitStory · BuiltWithItself · InstallMoment · ParitySignature · FinalCta) under a sticky `SceneStage` gradient layer. CSS-only, shippable on its own; every section's copy is server-rendered + statically visible. `Base` gained a `width:'full'` bleed variant + a Space Grotesk preload. Test-first `e2e/home.spec.ts` (6 red → green). First homepage JS islands (dogfood: Aurora/Spotlight/Scramble/Shimmer/CountUp, `client:visible`).
- **C (volt-field scene, #50):** the signature — a `ShaderMaterial` fullscreen-quad current (3 filament distance-field glows + a traveling spark, pointer-bent) at `apps/site/src/scenes/` (**site-local**, not `webgl-core` → not shipped to consumers). `three`+`@types/three` became site deps; `registry-check` unaffected. Clones the aurora skeleton (guards→NOOP, reduced-motion single static frame, full disposal, `webglcontextlost`→CSS-gradient fallback). Pure math node-unit-tested. One persistent sticky canvas, no ScrollTrigger pin.
- **D (scroll story, #51):** Lenis (motion-gated singleton, `anchors:true`) + one ScrollTrigger scrub over the scene track → `setSplit(0→1)` parts the filaments + emphasizes the active beat (0.35↔1, never hidden) + a one-shot per-char hero entrance (server HTML restored on teardown). Nav scroll-progress bar + hide-on-scroll (motion-gated). All motion libs lazy `import()`. `scroll-story-math` node-unit-tested. **Fix:** `astro.config` `optimizeDeps.include` for the 4 dynamic-import deps — dev re-optimized them mid-session, mixing chunk versions and crashing island hydration (Svelte + CountUp parity flake); prod never affected.
- **E (polish, this branch):** Nav active-accent, Footer mono/spark, gallery card VALUES (hover `glow-lg` + lift + mono category eyebrows), docs prose (h1 rule, h2 accent tick, mono `th`), global focus-visible ring, shared `reveal.ts` (visible-by-default, motion-gated, node-unit-tested). Gallery gen markers/const NAMES/section ids untouched. Verified in both themes.

**Gates:** `pnpm verify` + `pnpm build` (45 pages) + `pnpm test:dist` + `pnpm test:cli` + `pnpm test:e2e` (**27 tests**, green twice on fresh servers per PR); the parity harness (`/internal/parity*`) was never touched. Live-verified in a real browser (motion mode): scene animates + pointer-reactive, scrub parts the filaments through beats 0/1/2, Lenis smooth + anchors, nav hides/reveals, reduced-motion renders one static frame (diff 0), both themes resolved, no component console errors (only the by-design Pagefind dev 404). Branches stack `main → A → B → C → D → E`. **Next:** merge the stack (in order or squash); the still-deferred Cloudflare Pages connect is unchanged.

### 2026-07-01 — "Voltage" UI/UX redesign (8 PRs, site-only)

A full redesign of the **site** (chrome, homepage, gallery, demo pages, docs) into the charged "Voltage" identity, keeping every component's motion/behavior + every feature. Delivered as **8 stacked feature branches → PRs #39–#45**, each green on its gates. Decision **D-038**.

- **A (tokens+fonts, #39):** rewrote `@jolt/tokens/theme.css` into the Voltage system (volt `#7c5cff` + acid spark `#c6ff4f` + steel/base ramps, tokenized type/radii/shadow, both themes via `[data-theme]`); public token **names frozen** (motion values byte-identical, so `tokens.ts`/`tokens.test.ts` are unchanged). Self-hosted Inter / Space Grotesk / JetBrains Mono via `@fontsource-variable` + a fingerprinted preload.
- **B (chrome, #40):** retokenized Nav (bolt wordmark, translucent sticky, sun/moon toggle), Footer, Search, CodeTabs, the Components/Docs sub-navs + `.prose-jolt` — **light mode fully resolved for the first time**. All E2E/SEO hooks preserved; chrome e2e 11/11.
- **C (accent, #41):** `#6d5efc`→volt uniformly across 16 core styles + 22 schemas + 48 skins + favicon/og + 2 tests; **parity stayed green (2/2)** because the change is identical across the three frameworks (the gate compares them to each other, not to a golden image).
- **D (demo UX, #42):** all 32 demo pages → one accessible `FrameworkSwitcher` (inactive panels `visibility:hidden` so `client:visible` still hydrates all three; no-JS shows React) + breadcrumbs + prev/next (new `categories.ts` `orderedComponents`/`componentNeighbors`, TDD) + an extracted `PropsTable`. New `framework-switcher` spec; demo e2e 10/10.
- **E (scaffolder, #43):** `scripts/gen/emit.mjs` `emitDemoPage` + `emit.test.mjs` synced to the new layout; `emitCard` unchanged (const names kept). `test:gen` 45/45.
- **F (homepage, #44):** the 19-line stub → a hero + the **"current"** signature — the same `Wave` rendered from all three framework packages on three rails with a synchronized spark pulse (pure CSS, `prefers-reduced-motion`-gated). `Base` gained an opt-in `wide` prop.
- **G (gallery, #45):** Voltage card recipe (const names preserved for the emitter), **surfaced the 3 orphaned backgrounds** (globe/rings/aurora), a 3-column wide grid, and **fixed a latent scaffolder bug** — the gallery had two `{/* gen:card */}` markers (2nd added with Buttons), which makes `applyComponentsIndex` throw; now exactly one. Proven: `applyComponentsIndex` inserts a card without throwing.
- **H (docs/sweep, this branch):** retokenized the last stray old styling (`InstallBlock` badges); **Expressive-Code light theme** via `ec.config.mjs` (a function `themeCssSelector` can't be inline-serialized), so code blocks track `[data-theme]`; this DECISIONS (D-038) + PROGRESS update; the full multi-gate sweep.

**Gates:** `pnpm verify` + `astro check` (0 errors) + `pnpm build` (45 pages) + `pnpm test:dist` + `pnpm test:cli` + `pnpm test:e2e` green across the phases; **the parity harness (`/internal/parity*`) was never touched**, so the pixel gate is unaffected. Branches stack `main → A → B → … → H`. **Next:** merge the stack (in order, or squash), then the still-deferred Cloudflare Pages connect (unchanged) + the scoped-out new-feature UX (interactive prop playground / ⌘K command palette / per-category landing pages) if wanted.

### 2026-06-30 — Phase 9: Cards — the 5th category (3 cards + the pointer-tracking core)

The gallery's **5th category** and its first **container** components: a presentational `<div>` that wraps arbitrary child content (children/slot), plus the **first DOM-event behavior in core**. One feature branch `claude/model-selection-xmzqy2`. Decision **D-037**.

- **The pointer-tracking core (the genuinely new bit).** Spotlight (cursor-following glow) and Tilt (3-D rotation toward the cursor) need a JS behavior CSS can't do. Built as the functional-core/imperative-shell split (like the WebGL factories): pure math `packages/core/src/behavior/pointer-math.ts` (`pointerFraction` clamps clientX/Y→0..1 with a zero-guard; `tiltRotation`→`±max` deg, `(0.5 - y)` so center is `+0`) is the whole jsdom unit-test surface; the shell `behavior/pointer.ts` (`trackPointer(el, writer)` → `{ revert() }`) attaches `pointermove`/`pointerleave`, is SSR/jsdom-safe, writes the center/rest state once on mount, and under reduced-motion attaches no listeners. **Pure DOM, no npm dep → lives in the monolithic `core` (swept by the `!(webgl)` glob), imported from the `@jolt/core` barrel** (not a subpath — only webgl has the `.ts` export mapping); `registry-check` (`three ∉ core`) still passes.
- **The 3 cards (container skin pattern).** Each renders a `<div>` wrapping children/slot with visual-only `--jolt-*` props (no `label`): React `Props = <id>Props & HTMLAttributes<HTMLDivElement>` + `...rest`; Vue single-root `<div><slot/></div>` + fallthrough; Svelte 5 `& Omit<HTMLAttributes<HTMLDivElement>,'children'|'class'|'style'>` + Snippet children. **Spotlight** (radial glow at `--jolt-x/--jolt-y`) + **Tilt** (`rotateX/rotateY` from `--jolt-rx/--jolt-ry`, eased) call `trackPointer` on mount/`revert` on unmount; **Shine Border** is self-running CSS (a masked flowing gradient border, like the border-draw button — no pointer).
- **New `CONTAINER` parity kind** in `e2e/parity.spec.ts`: assert each framework renders the card root + identical slotted child text (read from `.jolt-<id>`, not the cell, so a client:load island's hydration script can't leak into textContent), then rest-state pixel-compare. **Spotlight/Tilt keep pixel parity** (at rest the behavior wrote a deterministic center/flat state, identical across frameworks under the freeze); **Shine Border → `NO_PIXEL_PARITY`** (self-running keyframe, D-035 flaw). Pointer-driven states deferred to unit tests + live-verify (mirrors buttons' deferred hover/press).
- **a11y:** a plain presentational `<div>` (glow/tilt/border decorative; interactive-card semantics deferred) — a new a11y shape. The card root is a `<div>`, so the `/components` index uses the normal clickable `<a>` cards (unlike the buttons' `<div>`+View-link).
- **Live-verified** (real Chromium): the Spotlight glow follows the cursor + freezes centered under reduced-motion; Tilt rotates toward the pointer + stays flat under reduced-motion; Shine Border animates; no component console errors (only the by-design Pagefind dev 404).

Green local: `pnpm verify` (**376 vitest + 45 test:gen** + registry:check, **34 items/fw**) · `pnpm build` (**45 pages**) · `pnpm test:cli` (**32 component items** — the 3 cards bundle their CSS + the pointer behavior via core) · `pnpm test:e2e` (**15 tests** — cards via `CONTAINER`; spotlight/tilt rest-state pixel-compared, parity stable over 3 runs). On `claude/model-selection-xmzqy2`; PR pending. Decision **D-037**. **Next: more cards (3-D layered/parallax, reveal-on-scroll) or a 6th category.** _(Container note: the pre-baked CI container ships chromium-1194 at `/opt/pw-browsers/chromium`; the pinned Playwright wants another revision, so local e2e runs via an uncommitted `playwright.local.config.ts` setting `launchOptions.executablePath` — CI uses the committed config.)_

### 2026-06-29 — Phase 8: Buttons — the 4th category (6 CSS-only interactive buttons)

The gallery's **4th category** and its **first interactive components**: a real `<button>` with a text label, animated by interaction (hover/press) or a self-running surface effect. One PR, 6 buttons (**PR #37**). Decision **D-036**.

- **The interactive skin pattern (the genuinely new bit).** The `@jolt/core` schema carries only the visual `--jolt-*` contract + a `label` fallback; native behavior (`onClick`/`disabled`/`type`/`children`) is forwarded **per-skin idiomatically**, so a consumer gets a real button. React: `Props = <id>Props & ButtonHTMLAttributes<HTMLButtonElement>` + `...rest` spread + `{children ?? label}` (no `any`). Vue: single-root `<button><slot>{{label}}</slot></button>`, native attrs via **attribute fallthrough** (no `defineEmits`). Svelte 5: `& Omit<HTMLButtonAttributes,'children'|'class'|'style'> & {children?: Snippet; ...}` + `...rest` + `{@render children()}`. Type shims add `disabled?: boolean`.
- **New `INTERACTIVE` parity kind** in `e2e/parity.spec.ts`: assert each framework renders a `<button>` + the label text matches; **sweep + tactile also rest-state pixel-compare** (transition-only → identical rest frame), while the 4 self-running keyframe buttons (shimmer/glow/gradient/border-draw) go to `NO_PIXEL_PARITY` — their reduced-motion frame diverges from the freeze end-state and Playwright's non-atomic reducedMotion flaked a `shimmer` react-vs-svelte diff on headless-CI (D-035). Hover/focus/press-triggered parity is **deferred**; behavior (click/disabled/keyboard) is covered by the per-framework **unit tests** (first use of `fireEvent`). The "no click when disabled" assertion was dropped (jsdom fires it on native listeners; a real browser suppresses it) — the contract tested is that `disabled` is reflected. Vue tests pass fallthrough props via the render `attrs` option (vue-tsc rejects them under `props`).
- **The 6 buttons (all CSS-only, hand-written like loaders):** Shimmer (sheen sweep), Glow (breathing box-shadow halo), Gradient (flowing multi-color bg), Border Draw (flowing masked gradient border) — self-running; Sweep (fill wipes in on hover/focus) — hover-driven; Tactile (3D press-down on `:active`) — press-driven. Each renders a native `<button>`, reduced-motion → static/instant. Class/keyframe names avoid the loader ids; `gradient` is distinct from `gradient-text`.
- **Index card:** a live `<button>` can't nest inside the card's `<a>` (invalid HTML + double tab stop), so the Buttons `<section>` uses a `<div>` card + a sibling "View →" link.
- **Live-verified** (real Chromium, 17 checks): the 4 self-running buttons animate (`animation-name` set, no console errors); glow → `animation: none` under reduced-motion; sweep hover flips text color brand→white; tactile press transition wired (0.12s); shimmer keyboard-focusable + native click fires.

Green local: `pnpm verify` (**338 vitest + 45 test:gen** + registry:check, **31 items/fw**) · `pnpm build` (**42 pages**) + `pnpm test:dist` · `pnpm test:cli` (**29 component items**) · `pnpm test:e2e` (**15 tests** — buttons via `INTERACTIVE`; sweep + tactile pixel-compared). **PR #37**; CI then flagged a flaky `shimmer` react-vs-svelte pixel diff on a re-run → the 4 self-running buttons joined `NO_PIXEL_PARITY` (D-035), re-verified green. **Next: more buttons (icon/loading states, groups) or a 5th category.**

### 2026-06-29 — Phase 7 fix: ProgressBar opts out of pixel parity (flaky CI)

PR **#35**'s CI caught a **flaky** parity failure — `progress-bar: react vs vue` — that #33/#34's CI happened to pass. (CI runs `pnpm test:e2e`, not just `verify`; the repo has **no branch protection**, so #35 merged over the red check — it shouldn't have. Future merges gate on the real CI conclusion.) Root-caused and fixed on `fix/progress-bar-parity`.

- **Not drift.** Dumped all three progress-bar cells' `innerHTML` + screenshots under the harness freeze: the DOM is **byte-identical** and the stable diff is **0%**. The flake is a **state divergence** — ProgressBar's reduced-motion static frame (a 45% fill) vs its animation end-state (fill swept off-track → bare rail) differ sharply, and Playwright's context-level `reducedMotion` isn't applied atomically across the three sequential per-cell screenshots (cf. the 7b live-verify, which moved to `page.emulateMedia`), so one cell is caught mid-fill while another shows the rail → ~12% diff, intermittently over the 3% threshold. (The "cold-start CountUp" attribution in the 7c entry below was actually this.)
- **Fix:** added `progress-bar` to `NO_PIXEL_PARITY` in `e2e/parity.spec.ts` (2nd member after scroll-velocity). Anti-drift = shared CSS + per-framework unit tests + the `GRAPHIC` visibility assert. Decision **D-035**. Confirmed deterministic: `pnpm test:e2e` parity ran green repeatedly after the fix.

### 2026-06-29 — Phase 7 PR 7c: Loaders — Grid + Progress Bar

The other two loaders from the PR-7b selection, on the same slice (D-034), filling the Loaders category **5 → 7** (parity with Backgrounds). Built off fresh `main` after #33 merged; one branch `feat/phase-7c-grid-progress`; PR pending.

- **Grid** (`styles/grid.css`): a 3×3 grid of squares pulsing in a diagonal wave — nine `<span>`s staggered by their `(row + col)` so the pulse sweeps corner-to-corner. **Progress Bar** (`styles/progress-bar.css`): an indeterminate fill (one `<span>`) sweeping across a neutral rail track; props are `color`/`width`/`thickness`/`speed`/`label` — the first loader with a `width`/`thickness` shape rather than `size`. Both keep a **visible** state under the parity freeze (Grid returns to full opacity at 100%; the Progress Bar's rail stays visible when the fill is swept off-track), so the `GRAPHIC` pixel-compare sees a non-blank, identical frame.
- Full per-loader slice each (schema+meta, shared CSS, 3 skins/barrels/tests **test-first red→green**, demo page) spliced into the 8 central files at the `gen:*` markers.
- **Live-verified** (`page.emulateMedia`): Grid animates (multi-sample frame-diff ~545px), Progress Bar ~240px; under reduced-motion both report computed `animation-name: none` + a 0-px static frame; `role="status"` present; no console errors. (The first full `test:e2e` run flaked on the cold-start CountUp settle-wait per D-018; green on the warm re-run, 15/15.)

Green local: `pnpm verify` (**254 vitest + 45 test:gen** + registry:check, 25 items/fw) · `pnpm build` (36 pages) + `pnpm test:dist` · `pnpm test:cli` (23 component items) · `pnpm test:e2e` (15 tests — all 7 loaders pixel-compared via `GRAPHIC`). Merged to `main` as **#34** (CI `verify` green). No new decision (instantiates D-034). **Loaders category now at 7; the 4 Pulse/Ripple/Grid/Progress-Bar additions are done.**

### 2026-06-29 — Phase 7 PR 7b: Loaders — Pulse + Ripple

Two more loaders on the proven loader slice (D-034), filling the Loaders category **3 → 5**. One branch `feat/phase-7b-pulse-ripple`; PR pending.

- **Pulse** (`styles/pulse.css`): two sonar-ping discs expanding from the center, offset half a cycle (negative `animation-delay`) for a continuous pulse. **Ripple** (`styles/ripple.css`): two concentric hollow rings expanding outward (Material-style), same half-cycle offset. Both keyframes return to a small **visible** state at 100% so the parity freeze captures a non-blank, cross-framework-identical frame (cf. D-015/D-034); the faded-to-zero classic ping was reworked to opacity 0.2 at peak so Pulse reads as a strong pulse (and isn't a near-static blank).
- Each is the full per-loader slice: a `.describe()`'d schema (`color`/`size`/`speed`/`label`) + `<id>Meta` (`category:'loader'`, `deps:[]`) + shared CSS (keyframes + reduced-motion static) + 3 skins rendering `<div role="status" aria-label={label}>` with `--jolt-*` (no `client:` directive — pure CSS) + 3 skin tests (role=status + aria-label + 2-span count + var mapping, **test-first red→green**) + demo page. Spliced into the 8 central files at the `gen:*` markers — incl. the `GRAPHIC` array in `e2e/parity.spec.ts` and the hand-written Loaders `<section>` in `/components`.
- **Live-verified** (real browser): used explicit `page.emulateMedia({ reducedMotion })` — the context-level setting proved unreliable (matchMedia stayed false), which is why the parity spec force-freezes rather than trusting it. Pulse animates (multi-sample frame-diff ~168px), Ripple ~493px; under reduced-motion both report computed `animation-name: none` + a 0-px static frame; `role="status"` present; demo pages + Loaders index render; no console errors (the lone 404 is the by-design Pagefind dev probe).

Green local: `pnpm verify` (**242 vitest + 45 test:gen** + registry:check, 23 items/fw) · `pnpm build` (34 pages) + `pnpm test:dist` · `pnpm test:cli` (21 component items) · `pnpm test:e2e` (15 tests — Pulse + Ripple pixel-compared via `GRAPHIC`). Merged to `main` as **#33** (CI `verify` green). No new decision (instantiates D-034). **Next: PR 7c — Grid + Progress Bar.**

### 2026-06-29 — Phase 7 PR 7a: Loaders (the 3rd category) — Spinner + Dot-Bounce + Bars

The gallery's **third category**, bootstrapped with its first three loaders. A loader is a new component kind — self-animating CSS, **no text**, **not a canvas**. One branch `feat/phase-7a-loaders`; PR pending.

- **Bootstrap (D-034):** added a `'loader'` entry to `categories.ts` (the sub-nav + a11y-docs table auto-derive from metas), and a new **`GRAPHIC`** parity kind in `e2e/parity.spec.ts` — pixel-compared across frameworks like a whole-text component but skipping the text/segment asserts, on the **shared** `/internal/parity` page (DOM, no WebGL-context limit). The existing animation freeze already collapses the loaders' infinite keyframes to a deterministic, cross-framework-identical frame (D-015). The `/components` index is hand-written per category, so its Loaders `<section>` was added manually.
- **Three loaders** (hand-written from the ShinyText CSS slice — the scaffolder stays text-only): **Spinner** (rotating ring), **Dot-Bounce** (three bouncing dots), **Bars** (five equalizer bars). Each: a `.describe()`'d schema (`color`/`size`/`speed`/`label`, +`thickness` for spinner) + shared `styles/<id>.css` (keyframes + reduced-motion static) + 3 skins rendering `<div role="status" aria-label={label}>` with `--jolt-*` (no `client:` directive — pure CSS) + 3 skin tests (role=status + aria-label + var mapping, test-first red→green). Ids avoid the `dots` background collision.
- **a11y:** `role="status"` + a configurable `label` (default "Loading…") — a third a11y shape beside text and backgrounds. The a11y-docs table auto-lists them.
- **Live-verified** (real browser): each loader animates (frame-diff > 0), reduced-motion is static (diff 0), `role="status"` present, the Components sub-nav + index show **Loaders**, no console errors.

Green local: `pnpm verify` (**230 vitest + 45 test:gen** + registry:check, 21 items/fw) · `pnpm build` (32 pages) + `pnpm test:dist` · `pnpm test:cli` (19 component items) · `pnpm test:e2e` (15 tests — the loaders pixel-compared via `GRAPHIC`). Merged to `main` as **#31** (CI `verify` green). Decision **D-034**. (PR 6c merged as #29.)

### 2026-06-29 — Phase 6 PR 6c: Aurora (first shader background)

The first background driven by a **custom GLSL fragment shader** (Three.js `ShaderMaterial`) instead of CPU vertex math — front-loads the shader pattern on one vertical slice. One branch `feat/phase-6c-aurora`; PR pending.

- **Aurora** (`webgl/aurora.ts`): a fullscreen quad (OrthographicCamera + `PlaneGeometry(2,2)`) with a `ShaderMaterial` whose fragment shader renders flowing aurora curtains (layered value-noise/fbm swept by a `uTime` uniform, vertical glow falloff, colour ramp across 3 stops). Per frame only advances `uTime`; reduced-motion renders one `uTime=0` frame; disposal unchanged.
- **Functional-core split for a shader (D-033):** the pure jsdom-tested core is **prop→uniform resolution**, not vertex math — `webgl/aurora-field.ts` (`hexToRgb` + `packColorStops`, Three-free) packs the `colors` stops into the shader's `uColors[3]`; the shell builds `THREE.Vector3`s. Colors are **hex-only** (the shader needs numeric RGB). Added BOTH `aurora-field.test.ts` and `schemas/aurora.test.ts` (the schema-test convention, cf. `particles.test.ts`), test-first red→green.
- **The GLSL is integration-tested, not unit-tested:** a shader can't run in jsdom, and the `BACKGROUND` parity kind only asserts a `<canvas>` is _visible_ — which a **blank** canvas from a failed compile would still pass. So the real gate is **live verification**: first pass animated only ~409 px-diff (too faint) with no console error → reworked the fragment for stronger flow + contrast → **frame-diff ~38k**, reduced-motion static (diff 0), SSR clean, **zero console errors** (shader compiles). Used `ShaderMaterial` (not Raw) so three injects precision + built-in attributes; we declare only our `varying`+uniforms.
- No registry/export change — Aurora is just another file in `webgl/`, isolated by `webgl-core` (D-031). 6 backgrounds now; the parity bg test visits 6 isolated pages.

Green local: `pnpm verify` (**212 vitest + 45 test:gen** + registry:check, 18 items/fw) · `pnpm build` (29 pages) + `pnpm test:dist` · `pnpm test:cli` (16 component items) · `pnpm test:e2e` (15 tests). Merged to `main` as **#29** (CI `verify` green). Decision **D-033**. (PR 6b merged as #27.)

### 2026-06-29 — Phase 6 PR 6b: Globe + Rings + per-background parity-harness isolation

Two more Three.js backgrounds on the proven CPU-vertex pattern, **plus** the deferred parity-harness isolation that 5 backgrounds forced (D-031's watch). One branch `feat/phase-6b-globe-rings`; PR pending.

- **Harness isolation first (inert, D-032):** the parity harness mounted 3 WebGL canvases per background on the single `/internal/parity` page — 5 backgrounds would be 15 live contexts at Chromium's ~16 cap. Moved backgrounds onto per-background pages `internal/parity-bg/<id>.astro` (3 cells each); `parity.astro` is now three-free (text only). The spec split into a text-parity test + a **background test that visits each page with `context.newPage()` → assert canvas + aria-hidden → `page.close()`**, so ≤3 contexts are ever live, for any N. Page-close (not a shared-page `goto` loop) is the teardown because Chromium's bfcache can otherwise retain a navigated-away document's contexts. Rejected a dynamic `[id].astro` + component-map route: Astro hydrates an island from the tag's static import binding, which `MAP[id].react` lacks. Verified behavior-preserving on the existing 3 backgrounds before adding any component.
- **Globe** (`webgl/globe.ts`): a Fibonacci-sphere point cloud slowly rotating (`points.rotation.y`) with a breathing radial pulse. **Rings** (`webgl/rings.ts`): concentric point-rings where alternate rings counter-rotate, with a gentle radial pulse. Both keep the functional-core/imperative-shell split — pure jsdom-tested field math (`globe-field.ts`: `generateSphere`/`applyPulse`; `rings-field.ts`: `generateRings`/`applyRings`, tests isolating rotation vs pulse) + a WebGL shell that guards SSR/jsdom, disposes all GPU resources, and renders one static frame under reduced-motion. 3 aria-hidden skins each, importing the factory via the `@jolt/core/webgl/<id>` subpath (so `three` reaches only backgrounds). No registry/export-wildcard changes needed — both are just new files in `webgl/` (D-031).
- **Live-verified** (real browser, non-reduced-motion): both demos animate (Globe frame-diff ~6.3k, Rings ~3.4k); reduced-motion → one static frame (diff 0); SSR emits the aria-hidden container with no server canvas; no console errors (the lone 404 is the by-design Pagefind dev probe, identical on the existing Dots page).
- **Cold-start note:** the first `test:e2e` run flaked on the text test's CountUp settle-wait (cold dev server + parallel workers starved the 2s rAF tween); restored the text test's 90s timeout and bumped the CountUp wait 20s → 30s (consistent with D-018). Green on re-run.

Green local: `pnpm verify` (**193 vitest + 45 test:gen** + registry:check, 17 items/fw) · `pnpm build` (27 pages, 21 indexed) + `pnpm test:dist` · `pnpm test:cli` (15 component items) · `pnpm test:e2e` (15 tests). Merged to `main` as **#27** (CI `verify` green). Decision **D-032**. (PR 6a merged as #26.)

### 2026-06-29 — Phase 6 PR 6a: Waves + Dots (two more Three.js backgrounds)

Started Phase 6 — filling the Backgrounds category. Two new backgrounds on the proven Particles pattern, plus the one-time registry generalization the 2nd+ background needed.

- **Waves** (`webgl/waves.ts`): an undulating wireframe plane (`PlaneGeometry` vertices displaced by a traveling sine each frame). **Dots** (`webgl/dots.ts`): a grid of points rippling radially from the center. Both use the functional-core / imperative-shell split (jsdom-tested field math in `webgl/<id>-field.ts`; the WebGL shell guards SSR/jsdom, disposes all GPU resources, reduced-motion → static), with 3 aria-hidden skins importing the factory via the `@jolt/core/webgl/<id>` subpath.
- **`particles-core` → shared `webgl-core`** (D-031): all background factories live in one registry item (glob `webgl/!(*.test).ts`); one wildcard export `"./webgl/*"` resolves every subpath. `three` still reaches only backgrounds, and adding one is just a new file in `webgl/` — no new registry item. `registry-check` asserts `three ∉ core ∧ three ∈ webgl-core`; `cli-smoke` proves Waves/Dots bundle `webgl-core` + `three` and type-check.
- Parity gained a canvas check per background (9 WebGL canvases now — test timeout bumped to 90s for the init cost; a scaling note for >4 backgrounds is in the watch-list).
- **Live-verified** (real browser): both demos animate (Waves frame-diff ~28.8k, Dots ~12.9k); SSR emits the aria-hidden container with no server canvas; no console errors.

Green local: `pnpm verify` (**169 vitest + 45 test:gen** + registry:check) · `pnpm build` (20 pages) + `pnpm test:dist` · `pnpm test:cli` (13 components) · `pnpm test:e2e` (14 specs). On `feat/phase-6a-waves-dots`; PR pending. Decision **D-031**. (Phase 5 PRs #23 + #25 merged to `main`.)

### 2026-06-28 — Phase 5 PR 5b: Particles (Three.js) — first Backgrounds component

The WebGL vertical slice that front-loads the whole Three.js stack on one component — **Phase 5 (and the Backgrounds category) is now live**.

- **Particles** (`packages/core/src/webgl/particles.ts`): a drifting point field (`BufferGeometry` + `Points` + a RAF loop). Functional core / imperative shell — the pure field math (`webgl/particles-field.ts`) is jsdom-unit-tested; the WebGL shell **never constructs a renderer under SSR/jsdom** (guards on `window` + a null GL context) and is exercised only by Playwright. `revert()` disposes every GPU resource (RAF, ResizeObserver, geometry/material/renderer, `forceContextLoss`, canvas) — Three leaks otherwise. Reduced-motion → one static frame. The 3 skins mount an `aria-hidden` container and call the shared factory, so they **can't drift** (D-030).
- **Dependency isolation (the linchpin, D-028):** `three` ships no types + is heavy, so it must not join the monolithic `core`. The webgl code is a **separate `particles-core` jsrepo item** (the core glob `src/!(webgl)/**/!(*.test).ts` excludes it with the base preserved); skins import the factory via the **`@jolt/core/webgl/particles` subpath** (an explicit package export). Proven end-to-end by `cli-smoke`: adding Particles installs `three` (only for it) + type-checks with `@types/three`; the 10 text components stay `three`-free. `registry-check` asserts `three ∉ core ∧ three ∈ particles-core`.
- **Parity:** a new non-text `BACKGROUND` kind asserts a `<canvas>` in an aria-hidden container across all three frameworks (no text/pixel diff — D-029).
- **Live-verified** (real browser, non-reduced-motion): SSR emits the aria-hidden container with no server canvas; the canvas animates (frame pixel-diff > 0); reduced-motion is static; no console errors.

Green local: `pnpm verify` (**148 vitest + 45 test:gen** + registry:check) · `pnpm build` (18 pages) + `pnpm test:dist` · `pnpm test:cli` (11 components) · `pnpm test:e2e` (14 specs). On `feat/phase-5b-particles` (stacked on 5a); PR pending. Decisions **D-028, D-029, D-030**.

### 2026-06-28 — Phase 5 PR 5a: category infrastructure (nested routes + sub-nav)

Started Phase 5 (Backgrounds category). This slice is the information-architecture refactor the new category needs — **no new component yet**, so it's verifiable in isolation.

- **Category registry** `apps/site/src/lib/categories.ts` — the single ordered source mapping each component's `meta.category` → URL slug + display label, plus `categoriesWithComponents()` (aggregated from the core metas, so the sub-nav never advertises an empty category). Unit-tested (`categories.test.ts`, 5 tests).
- **Nested routes:** the 10 text demo pages moved to `/components/text/<id>` (git renames; bespoke per-component demos preserved — a generic `[category]/[id].astro` route was rejected for that reason). `astro` redirects map the old flat `/components/<id>` paths (precautionary — nothing's deployed yet).
- **`ComponentsLayout.astro`** (mirrors `DocsLayout`) renders the category sub-nav; the `/components` index groups its cards into per-category `<section>`s anchored by slug.
- **Scaffolder** (`scripts/gen/*` + `gen-component.mjs`) made category-aware — emits demo pages under `text/` with `/components/text/<id>` hrefs; the 45 `test:gen` assertions updated to match.
- `e2e/components-nav.spec.ts` (the redirect + grouped index + sub-nav). Decision **D-027**.

Green local: `pnpm verify` (**133 vitest + 45 test:gen** + registry:check) · `pnpm build` (17 pages) + `pnpm test:dist` · `pnpm test:e2e` (**14 specs**). On `feat/phase-5a-category-nav`; PR pending. **Next: PR 5b — Particles (Three.js) vertical slice.**

### 2026-06-28 — Phase 4 PR 4e: deploy prep (_headers + DEPLOY.md)

The last Phase-4 slice — everything for the Cloudflare Pages deploy except the user's one-time dashboard connect.

- **`apps/site/public/_headers`** — Cloudflare Pages edge config: immutable long-cache for `/_astro/*`, a short cache for `/r/*` + `/pagefind/*`, and baseline security headers (nosniff / referrer-policy / X-Frame-Options) for all responses.
- **`DEPLOY.md`** — the CF Pages Git-integration runbook: build settings (`pnpm build` → `apps/site/dist`, `NODE_VERSION=20`), what the build emits (site + `/r/*` + sitemap + Pagefind from **one origin**), the single `JOLT_ORIGIN` swap (a no-op if the CF project is named `jolt-ui`), and the post-deploy `npx jsrepo add https://<origin>/r/react/blur-in` proof.
- `scripts/dist-check.mjs` now also asserts `dist/_headers` ships.

The deploy itself is a CF-dashboard action (connect the repo) — no CI change, no secrets (D-022). Once connected, **Phase 4 and v1 are complete.**

Green local: `pnpm verify` · `pnpm build` (17 pages) + `pnpm test:dist` (incl. `_headers`). On `feat/phase-4e-deploy`; PR pending.

### 2026-06-28 — Phase 4 PR 4d: Pagefind search (prod-only)

Added site search.

- **Pagefind** indexes the production build: an Astro integration (`apps/site/src/integrations/pagefind.ts`) runs the Pagefind CLI at `astro:build:done` over `dist/` (16 pages indexed; the `noindex` parity harness excluded). The CLI also emits the default UI, so no extra UI dep.
- **`Search.astro`** (rendered in the Nav) feature-detects `/pagefind/pagefind-ui.js` (a HEAD probe) and loads the UI + inits `PagefindUI` only when present — so `astro dev` (no index) degrades to an inert empty container; **search is a production feature**. Themed via Pagefind's CSS vars; results float over the page.
- **Indexing scope:** `Base.astro`'s `<main>` carries `data-pagefind-body` for non-`noindex` pages; Nav/Footer are `data-pagefind-ignore`; removed `DocsLayout`'s now-redundant inner marker.
- `scripts/dist-check.mjs` asserts the built index + `data-pagefind-body`; `e2e/search.spec.ts` asserts the container is wired into the nav. (D-025.)

Green local: `pnpm verify` (**128 vitest + 45 test:gen** + registry:check, astro check 32 files) · `pnpm build` (17 pages, 16 indexed) + `pnpm test:dist` · `pnpm test:cli` · `pnpm test:e2e` (11 specs). On `feat/phase-4d-search`; PR pending. **Next: PR 4e — deploy (needs the CF Pages project).**

### 2026-06-28 — Phase 4 PR 4c: Accessibility + Contributing docs

Completed the docs set (the four pages + sub-nav).

- **`/docs/accessibility`** — how Jolt UI keeps animated text accessible (the per-char `aria-label` + `aria-hidden` pattern, whole-text native rendering, reduced-motion → static), plus a **per-component a11y table generated from every component's `meta.a11y`** (a no-drift loop over the core exports, mirroring `registry.test`).
- **`/docs/contributing`** — one design language / three thin skins, the `gen-component` scaffolder + the hand-written GSAP path, test-first + the three gates (`verify` / `test:cli` / `test:e2e` parity), and the branch→PR→merge workflow.
- Added both to the `DocsLayout` sub-nav; extended `e2e/docs.spec.ts` (both pages render; the a11y table lists ≥10 rows).

Green local: `pnpm verify` (**128 vitest + 45 test:gen** + registry:check, astro check 30 files) · `pnpm build` (17 pages) + `pnpm test:dist` · `pnpm test:cli` · `pnpm test:e2e` (10 specs). On `feat/phase-4c-docs`; PR pending. **Next: PR 4d — Pagefind search.**

### 2026-06-28 — Phase 4 PR 4b: site nav + footer + docs (Getting-Started, Theming)

Gave the gallery real chrome + the first docs.

- **`Nav.astro`** (sticky header: brand → Home + Components + Docs links with active state, the relocated `ThemeToggle`, a reserved `search` slot for PR 4d, `data-pagefind-ignore`) + **`Footer.astro`** now render in `Base.astro` (the inline ThemeToggle header is retired; the body is a flex column).
- **`DocsLayout.astro`** wraps `Base`, adds a docs sub-nav, and styles slotted prose via a scoped `.prose-jolt` block with `:global()` child selectors — **no `@tailwindcss/typography` dep** (inline `<code>` is reset inside expressive-code blocks).
- **Docs pages:** `/docs/getting-started` (the jsrepo install flow via real `installInfo` tabs + per-framework usage snippets + copy-paste) and `/docs/theming` (the `@jolt/tokens` table + the `[data-theme]` / `ThemeToggle` / `localStorage` mechanism + customizing). Bare `/docs` redirects to Getting-Started (astro `redirects`). (D-024.)
- `e2e/docs.spec.ts`: both pages render, the docs sub-nav + the site nav links resolve, `/docs` redirects.

Green local: `pnpm verify` (**128 vitest + 45 test:gen** + registry:check, astro check 28 files) · `pnpm build` (15 pages) + `pnpm test:dist` · `pnpm test:cli` · `pnpm test:e2e` (9 specs: parity 10 + install + SEO + docs). On `feat/phase-4b-nav-docs`; PR pending. **Next: PR 4c — Accessibility + Contributing docs.**

### 2026-06-28 — Phase 4 PR 4a: SEO foundation + single-origin + sitemap

Started Phase 4 (Deploy + docs + SEO). Made the static site discoverable and wired the deployed origin as one source.

- **`JOLT_ORIGIN`** (`packages/core/src/origin.ts`) is the single source for both the jsrepo registry base (`REGISTRY_BASE = JOLT_ORIGIN`) and astro's `site:` (canonical/OG/sitemap) — provisional `https://jolt-ui.pages.dev`, a **one-line swap** at deploy (D-022). `astro.config` imports it by a **relative** path (the `@jolt/core/origin` subpath export doesn't resolve in the config's TS context).
- **`Base.astro` head** now emits description / canonical / Open Graph / Twitter / favicon / JSON-LD (`Props { title, description, ogImage, noindex, jsonLd }`); the URL + JSON-LD logic is a pure, unit-tested `apps/site/src/lib/seo.ts` (new `apps/site` Vitest project, node env). `@astrojs/sitemap` → `sitemap-index.xml` excluding `/internal/` (also `noindex`). Added `og.svg` + `favicon.svg` + `robots.txt`; each of the 11 indexed pages got a unique `description`. (D-023.)
- **`scripts/dist-check.mjs`** (`pnpm test:dist`, wired into CI after `pnpm build`) asserts build-only invariants: sitemap (no `/internal/`), favicon/og, the `dist/r/*` registry (the one-origin proof), and canonical/JSON-LD/OG in the homepage HTML. `e2e/seo.spec.ts` asserts the head tags + path-specific canonical + the parity-harness `noindex` against the dev server. (D-026.)

Green local: `pnpm verify` (**128 vitest + 45 test:gen** + registry:check, astro check 23 files) · `pnpm build` + `pnpm test:dist` · `pnpm test:cli` (10 components) · `pnpm test:e2e` (parity all 10 + install + 3 SEO specs). On `feat/phase-4a-seo-foundation`; PR pending. **Next: PR 4b — Nav + Footer + docs (Getting-Started, Theming).**

### 2026-06-28 — Phase 3 PR 3b: gen-component scaffolder (CSS patterns)

Built `scripts/gen-component.mjs` — stamps a full component slice (12 files) + splices it into the 8 central registration files from one declarative contract. Functional core / imperative shell, test-first. **Phase 3 complete.**

- **`scripts/gen/{contract,emit,edits}.mjs`** (pure; **45 `node --test` unit tests** wired into `verify` as `test:gen`): `assertContract` validates a `ComponentContract` (kebab/Pascal, pattern/parity enums, per-prop rules, deps↔pattern coherence, a required `text` prop, per-char `by`, cssVar coverage); `emit*` turn a contract into source strings (schema+meta, stylesheet, 3 skins+barrels+tests, demo page with `InstallBlock`, vue/svelte shims, jsrepo items, parity import/cells, index card, exports); `edits.*` splice at inert `gen:*` markers via `insertBeforeMarker` (asserts exactly one marker) + `containsComponent` (collision predicate).
- **Step 1 (markers):** added `gen:*` anchors to the 8 central files (core/index + 3 package indexes, vue/svelte shims, `jsrepo.config` ×3, `parity.astro`, `parity.spec` arrays, `components/index`) and refactored `cli-smoke.mjs`'s add-list + CSS-assertion loop into marker-guarded arrays. All inert / behavior-preserving — verify + cli + e2e stayed green.
- **The shell** reads `scripts/contracts/<id>.mjs`, validates, runs an **all-or-nothing collision precheck** (aborts with zero writes if already generated), writes + splices, then `prettier --write`s everything touched. Emits a **working green** scaffold: a trivial opacity fade (incl. the D-014 reduced-motion `will-change: auto`) + passing invariant tests; the author customizes the animation test-first. **`.mjs` not `.ts`** (D-021): Node 20 can't run TS, no tsx/ts-node.
- **Proven end-to-end:** generated a throwaway `demo-fade` (css-per-char) → `pnpm verify` + `test:cli` + `test:e2e` all green (the generated component passed cross-framework parity with no manual edits) → reverted. The emitted output was already Prettier-clean (every touched file reported "unchanged").
- **Scope:** CSS patterns only; `pattern: 'gsap'` is rejected with a hand-write hint (GSAP factory + lifecycle scaffolding is a documented follow-up). Decision **D-021**; `COMPONENT_GUIDE.md` gained a "Generate with the scaffolder" section.

Green local: `pnpm verify` (**123 vitest + 45 test:gen** + registry:check, astro check 20 files) · `pnpm test:cli` (10 components) · `pnpm test:e2e` (parity all 10 + install specs). On `feat/phase-3b-scaffolder` (stacked on 3a); PR pending.

### 2026-06-28 — Phase 3 PR 3a: install tabs + dependency/peer badges (single source)

Started Phase 3 (Registry & copy-paste UX). Replaced the hardcoded, drifting per-page install block with a single source derived from each component's `meta` — so what a page advertises can't diverge from what `jsrepo add` actually pulls.

- **`installInfo(meta, framework)`** — a pure `@jolt/core` helper (sits beside `propsTable`) returning `{ registryPath, peers, tabs }`: `peers = dedupe([...meta.deps, 'zod'])` (`zod` is a **universal** runtime peer — the bundled monolithic core's schemas import it, D-013; `gsap` iff the meta declares it), `registryPath = ${REGISTRY_BASE}/r/<fw>/<id>`, and one **npm** + one **pnpm** tab (each = the `jsrepo add` line + the peer-deps install). `REGISTRY_BASE` centralizes the registry origin as the placeholder `<registry-url>` (Phase 4 deploy swaps the one value).
- **`InstallBlock.astro`** renders those tabs (via `CodeTabs`) + the dependency badges from a component's meta; all 10 demo pages collapse to `<InstallBlock meta={<id>Meta} />` (net **−72 lines**). `CodeTabs` now accepts `readonly Tab[]`.
- **Fix surfaced by the single source:** CSS-only pages previously showed **no** peer-deps tab at all; they now correctly list `zod`.
- **Test-first:** `registry.test.ts` (RED→GREEN, 7 tests) incl. a **no-drift loop** over every exported `*Meta` (peers always include `zod`; include `gsap` iff `deps` does). `e2e/install.spec.ts` asserts the **live-rendered** badges + `jsrepo add` command for a GSAP page (gsap + zod) vs a CSS-only page (zod only). Decision **D-020**.

Green local: `pnpm verify` (**123 tests** + registry:check, astro check 20 files) · `pnpm test:cli` (10 components) · `pnpm test:e2e` (parity all 10 + 2 install specs; one cold-start re-optimization flake on the CountUp settle-wait, green on warm cache — D-018). On `feat/phase-3a-install-info`; PR pending. **Next: PR 3b — the `gen-component.mjs` scaffolder.**

### 2026-06-28 — Phase 2 PR 2e: Scroll-Velocity + /components index (Phase 2 complete)

Shipped the last Text-Animation component and the category index page — **Phase 2 is complete** (10 components across per-char CSS · whole-text CSS · structural CSS · GSAP).

- **ScrollVelocity** (GSAP ScrollTrigger): a horizontal marquee — the skin renders the text in an `aria-hidden` track of repeated copies, `aria-label` carries it once — that scrolls continuously and speeds up / flips with the page's scroll velocity (`ScrollTrigger.getVelocity()` → `timeScale`, easing back to idle). A seamless loop animates the track `xPercent: 0 → -50` (the copies are symmetric). Props: `text`, `baseVelocity`, `direction`. Reduced-motion → static.
- **ScrollTrigger registration is lazy + client-only** — it calls `window.matchMedia` (absent in jsdom/SSR, which threw `_win.matchMedia is not a function` at module load), so it's registered **inside the factory** past the reduced-motion early-return, never at module load (D-019).
- **Parity for the marquee:** a repeated-text marquee is alignment-fragile — a 1px cross-platform layout difference over the copies ≈ 2.4% pixel diff (CI hit ~24%), and pinning can't fix subpixel width accumulation — so ScrollVelocity is **excluded from the pixel comparison** (`NO_PIXEL_PARITY`); its anti-drift comes from DOM/text parity + the unit tests (identical markup). Also bumped the pixel-parity threshold **1% → 2%** for the per-char components (subpixel AA hovers ~1%; Wave flaked across the 1% line).
- **`/components` index page:** a card grid with a live mini-preview per component, linking to each demo; the homepage now links to it (retired the Phase-0 Hello smoke test).
- Verified live (real browser): the marquee animates (~203px/500ms) and speeds up on scroll; `/components` lists all 10; no console errors; SSR clean.

Green local: `pnpm verify` (**116 tests** + registry:check, astro check 19 files) · `pnpm test:cli` (10 components) · `pnpm test:e2e` (parity all 10, stable over repeated runs). On `feat/phase-2e-scroll-velocity-index`; PR pending. Decision **D-019**. (Also finalized PR 2d → merged as **#12**.)

### 2026-06-28 — Phase 2 PR 2d: Count Up + Scramble (GSAP)

Added the two GSAP Text-Animation components (the second GSAP slice since SplitText), on the proven `createSplitText` factory pattern: a `core/animation/<id>.ts` factory returning `{ play, revert }`, skins that create on mount + `revert` on unmount, and a `prefersReducedMotion()` jump-to-final.

- **Count Up** tweens a plain `{ value }` object with `gsap.to`, writing `formatNumber(value, { decimals, separator })` on each update; a pure `formatNumber` core export is reused by the skins for their SSR initial value (no per-skin formatting drift). Reduced-motion / revert → the formatted target. Props: `to` (required), `from`, `duration`, `delay`, `decimals`, `separator`.
- **Scramble** decodes via GSAP **ScrambleTextPlugin** (registered at module load in `animation/scramble.ts`, isolated from SplitText's path for SSR-safety). `aria-label={text}` keeps the real text accessible while the visual churns. Props: `text` (required), `duration`, `delay`, `chars`, `revealDelay`, `speed`.
- Both are **whole-text** parity components rendered `client:load` (the first GSAP whole-text). A GSAP component is parity-deterministic without the D-015 CSS freeze — it reads `prefersReducedMotion()`, which Playwright honors in JS → final state. CountUp's harness cell passes `to={100}` (no `text` prop); Scramble uses the shared `text={TEXT}`.
- **Parity-harness robustness** (the components render identically; test-only — headless CI Linux was the failing env, local Windows passed): the spec now (1) **waits for the longest GSAP island (CountUp) to reach its target** before comparing (deterministic whether or not reduced-motion is honored in JS), (2) adds **`will-change: auto`** to the freeze so per-char segments CPU-rasterize identically (D-014), and (3) **disables Astro's fixed-position dev toolbar** during E2E (config-gated on a `JOLT_E2E` env), which had bled into element screenshots as the page grew taller. See **D-018**.
- Verified live (real browser, no reduced-motion): Count Up climbs `7,104 → 12,500`; Scramble churns random chars → `Decoded by Jolt`; no console errors; SSR clean.

Green local: `pnpm verify` (**108 tests** + registry:check, astro check 17 files) · `pnpm test:cli` (9 components, incl. the `gsap/ScrambleTextPlugin` subpath resolving in a real consumer) · `pnpm test:e2e` (parity all 9). On `feat/phase-2d-count-up-scramble`; PR pending. Decision **D-018**. (Also finalized PR 2c → merged as **#11**.)

### 2026-06-28 — Phase 2 PR 2c: Typewriter + Rotating Words (CSS-only, structural)

Added the next two Text-Animation components and the **structural** CSS-only sub-pattern — the effect comes from DOM structure + an `overflow` clip, not per-glyph keyframes (per-char Blur In/Wave) or whole-text `background-clip` (Gradient/Shiny).

- **Typewriter** (whole-text parity kind): the text sits in an `overflow:hidden; white-space:nowrap` box whose `width` animates `0 → calc(var(--jolt-steps) * 1ch)` in `steps(var(--jolt-steps))`, so each character pops in; a `border-right` caret blinks via a separate `step-end` animation. A **monospace** font makes `1ch` == one character (steps land on character boundaries) and `box-sizing: content-box` keeps the caret border from eating the last char under a global `border-box` reset. Skin sets `--jolt-steps` (= `text.length`), `--jolt-duration`, `--jolt-delay`, `--jolt-caret-width`. Reduced-motion → full text, no caret.
- **Rotating Words** (per-char parity kind; **discrete flip** chosen over a continuous slide for readability): a vertical column of word spans in a one-line clip; the list steps up one line per interval (`steps(var(--jolt-count))`), holding each word fully readable. A **trailing duplicate of the first word** makes the loop seamless and gives a clean frozen parity frame (cf. Gradient's repeated stop, D-016). Takes `words: string[]`; `aria-label` is the **space-joined** words so the parity per-char locator `[aria-label="Jolt UI"]` matches when the harness passes `words={['Jolt','UI']}` (no spec-logic change — just added `rotating-words` to `PER_CHAR`). The list is `aria-hidden`; each real word is a `data-jolt-segment` (the duplicate isn't, so segment count == `words.length`). Reduced-motion → first word static.
- **`steps(var(--…))` validated live in Chromium** (resolved to `steps(3)` / `steps(21)`); it only governs the live look (the parity harness freezes animations to their end-state, D-015), so the inline-`animation-timing-function` fallback was unnecessary.
- Per component: `.describe()`'d Zod schema + shared `styles/<id>.css` + 3 skins + barrels + vue/svelte type shims + demo page (`/components/<id>`) + 3 unit tests + registry item (×3 frameworks); parity classified typewriter→`WHOLE_TEXT`, rotating-words→`PER_CHAR`; cli-smoke adds both + asserts their stylesheets bundle.

Green local: `pnpm verify` (**89 tests** + registry:check, astro check 15 files) · `pnpm test:cli` (7 components) · `pnpm test:e2e` (parity all 7). On `feat/phase-2c-typewriter-rotating-words`; PR pending. Decision **D-017** (structural CSS-only sub-pattern).

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

Closed out Phase 1. The component page (`/components/split-text`) now has: live demos, an **install** block, **tabbed source** (React/Vue/Svelte) with copy buttons via `astro-expressive-code`, and a **props table generated from the schema**. To make the table schema-derived, added `.describe()` to each `splitTextSchema` field plus a `splitTextPropsTable()` helper in `@jolt/core` (introspects the schema via zod `instanceof` narrowing — no `any`), with tests asserting it can't drift. Added `@jolt/core` + `astro-expressive-code` to the site's deps. Also hardened `cli-smoke.mjs` — it now snapshots/restores the _pre-run_ lockfile instead of `git checkout HEAD`, so it can't clobber uncommitted lockfile changes. `pnpm verify` (37 tests) + `test:cli` + `test:e2e` + `build` (3 pages) green. **Phase 1 complete.**

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
