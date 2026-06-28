# PROGRESS — Jolt UI

> The cross-session heartbeat. **Read this first** to resume; **update it last** before you stop.
> Newest session entry on top.

## Snapshot

- **Current phase:** **Phase 4 IN PROGRESS — Deploy + docs + SEO.** PRs **4a–4c** are **merged to `main`** (#18, #19, #20). PR **4d (Pagefind search — build-time index, prod-only)** is **complete and green** on `feat/phase-4d-search` (PR pending). **Next: PR 4e — deploy (CF Pages + `_headers` + finalize the origin; needs the user's CF project) — the last Phase-4 slice.** Phases 0–3 + 4a–4c merged to `main`.
- **Repo:** `D:\Jolt-UI` · remote `github.com/MANVENDRA-github/Jolt-UI`. Branch → PR → merge (never push `main`).
- **Health:** `pnpm verify` green (**128 vitest + 45 `test:gen`** + registry:check, astro check 32 files) · `pnpm build` (17 pages, 16 Pagefind-indexed) + `pnpm test:dist` (incl. the Pagefind index) · `pnpm test:cli` (10 components) · `pnpm test:e2e` (11 specs: parity all 10 + install + SEO + docs + search) green. (Phases 0–3 + 4a–4c on `main`; PR 4d on `feat/phase-4d-search`, PR pending. CI green on every PR.)

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

## Session log

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
