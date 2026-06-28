# COMPONENT_GUIDE — adding a component to Jolt UI

The repeatable unit of work. A new component = **one small PR** touching a predictable set of files. Follow `DESIGN_SYSTEM.md` for the rules and `DECISIONS.md` for the why; this is the procedure, proven across SplitText, Blur In, Wave, Gradient Text, and Shiny Text. Test-first throughout (`TEST_CONTRACT.md`).

> **Naming:** kebab-case id (`blur-in`), PascalCase component (`BlurIn`). Use the id in the registry, schema filename, CSS filename, demo page, and parity testid; the PascalCase name for the exported component + folder.

## Generate with the scaffolder (CSS components)

For a **CSS** component you don't write the slice by hand — `scripts/gen-component.mjs` stamps all of it (steps 1–7 below) from one contract, including a **working** opacity-fade animation and passing invariant tests, then you customize the motion test-first.

1. Write `scripts/contracts/<id>.mjs` (`export default { ... }`, typed by the `ComponentContract` JSDoc in `scripts/gen/contract.mjs`): `id`, `name`, `pattern` (`css-per-char` | `css-whole-text` | `css-structural`), `blurb`, `a11y`, `deps` (`[]`), `props` (each `{ name, type, default|required, describe, cssVar? }` — a `text` string prop is required; per-char also needs a `by` enum), `parity` (`{ kind, pixelParity }`), `demoProps`, `harnessProps`, `cardText`. Use `scripts/gen/__fixtures__/sample.contract.mjs` as the template.
2. `node scripts/gen-component.mjs <id>` — writes the 12 slice files, splices the component into the 8 central files at their `gen:*` markers, and runs Prettier. Re-running aborts (no duplicate writes).
3. **Customize the animation test-first:** write the real motion's behavior test (red), then edit `packages/core/src/styles/<id>.css` to make it pass (green). The scaffold's opacity fade + reduced-motion block are a parity-safe starting point.
4. Gate: `pnpm verify` **and** `pnpm test:cli` **and** `pnpm test:e2e` — already green right after generation; keep them green as you customize. Branch → PR → merge.

GSAP components are **not** scaffolded yet (the generator rejects `pattern: 'gsap'`) — hand-write them per the steps below. The manual procedure is also the reference for what the scaffolder emits.

## First, pick a pattern

| Pattern | When | Behavior lives in | Skin does | a11y | Examples |
|---------|------|-------------------|-----------|------|----------|
| **Per-char CSS-only** | each character animates | `core/src/styles/<id>.css` | `splitSegments` → `aria-label` + aria-hidden segments; set `--jolt-*` (+ per-segment `--jolt-i`) | aria-label carries full text | Blur In, Wave |
| **Whole-text CSS-only** | the whole string animates | `core/src/styles/<id>.css` | render `<span class="jolt-…">{text}</span>`; set `--jolt-*` | native (real text) | Gradient Text, Shiny Text |
| **GSAP** | needs JS (measure, scroll, scramble, count) | `core/src/animation/<id>.ts` factory | call factory on mount, `revert` on unmount | per case | Split Text |
| **Background (Three.js)** | a full-bleed animated canvas | `core/src/webgl/<id>.ts` shell + pure `webgl/<id>-field.ts` | mount an `aria-hidden` container, call factory, `revert` on unmount | decorative → `aria-hidden` | Particles |
| **Loader (CSS)** | a self-animating spinner / dots / bars (no text) | `core/src/styles/<id>.css` | render `<div role="status" aria-label={label} class="jolt-…">` + decorative children; set `--jolt-*` | `role="status"` + label | Spinner, Bars |

## Steps

1. **Contract (core).** `packages/core/src/schemas/<id>.ts`: a Zod object, **every field `.default()` + `.describe()`** (the `propsTable` helper turns these into the docs table). Export `type <Name>Props = z.input<typeof <id>Schema>` (use `z.input` — defaults make fields optional) and a `<id>Meta` const (`id`, `name`, `category`, `deps`, `a11y`). Export both from `core/src/index.ts`. Write the failing schema/defaults test first.

2. **Behavior (core) — per the chosen pattern.**
   - **CSS-only:** add a self-contained `packages/core/src/styles/<id>.css` — `@keyframes` + a `.jolt-<id>` (whole-text) or `.jolt-<id> [data-jolt-segment]` (per-char) rule reading tunables from `--jolt-*` custom properties (per-char also reads per-segment `--jolt-i`). Add a `@media (prefers-reduced-motion: reduce)` block that renders the **static final state and sets `will-change: auto`** (D-014).
   - **GSAP:** add `packages/core/src/animation/<id>.ts` exporting a framework-agnostic factory `(el, opts) => { play, revert }`; register any plugin in `core/motion.ts`; guard `window`. Use `prefersReducedMotion()` to jump to the final state. Unit-test the pure logic.
   - **Background (Three.js):** split into a pure `packages/core/src/webgl/<id>-field.ts` (no three/DOM → jsdom-unit-tested) and an imperative `webgl/<id>.ts` shell. The shell **must guard SSR/jsdom** (bail to a no-op before `new WebGLRenderer()` if `window` is undefined or `getContext('webgl2'|'webgl')` is null); reduced-motion → one static frame; `revert()` disposes **every** GPU resource (cancel RAF, disconnect the ResizeObserver, dispose geometry/material/renderer + `forceContextLoss()`, remove the canvas). Do **not** export the factory from `core/index.ts` (keeps `three` out of the universal barrel). D-030.

3. **Three skins.** `packages/{react,vue,svelte}/src/components/<Name>/<Name>.{tsx,vue,svelte}` + a barrel `index.ts`; re-export from each package `src/index.ts`; add a shim to the vue/svelte `types.d.ts`.
   - **CSS-only skins:** `import '@jolt/core/styles/<id>.css'`; render the markup and set `--jolt-*` from props (per-char: map `splitSegments(text, by)` to segment spans with `--jolt-i`). No lifecycle.
   - **GSAP skins:** call the core factory on mount and `revert` on unmount — React `useEffect`, Vue `onMounted`/`onUnmounted`, Svelte `onMount` returning the cleanup.
   - **Background skins:** same lifecycle, but render an empty `aria-hidden` container (no text) and import the factory from the **subpath** `@jolt/core/webgl/<id>` (the type from `@jolt/core`). Unit tests `vi.mock` that subpath so `three` never loads in jsdom.
   - **Vue** declares a **local `Props` interface** mirroring the schema (the SFC compiler can't resolve the Zod-inferred type — D-011).

4. **Unit tests (per framework, test-first).** Across all three frameworks assert identical DOM for identical props. Per-char: `aria-label` = text, one aria-hidden segment per character, `--jolt-*` mapping. Whole-text: text content, `--jolt-*` mapping. GSAP: also `revert`-on-unmount (no leaked tweens) and reduced-motion final state.

5. **Demo page (site).** `apps/site/src/pages/components/<category>/<id>.astro` (under `ComponentsLayout` — `text/` for text, `backgrounds/` for backgrounds; D-027): three live previews (CSS-only need **no** `client:` directive; GSAP/WebGL use `client:visible` — a WebGL canvas needs a fixed-size box), an install tab + tabbed source via `CodeTabs` + `?raw` imports, and a props table from `propsTable(<id>Schema)`. Add a card to the right category `<section>` in `components/index.astro`.

6. **Registry.** Add `react|vue|svelte/<id>` component items to the root `jsrepo.config.ts`. The `build.transforms` rewrite bundles the whole `core` (incl. `styles/*.css`) — you don't list the CSS separately (D-012, D-013). **A heavy or untyped dep (e.g. `three`) goes in a dedicated lib item the core glob excludes** so it reaches only the components that use it, not all of core (D-028). All Three.js backgrounds share one `webgl-core` item — a new background is just a file in `webgl/` (no new item), and its skin imports the factory via the `@jolt/core/webgl/<id>` subpath (D-031). Run `pnpm registry:check`.

7. **Parity + CLI E2E.** **Text** components: add cells (all three frameworks) to `apps/site/src/pages/internal/parity.astro` and the id to `PER_CHAR` or `WHOLE_TEXT` in `e2e/parity.spec.ts` (the spec freezes animations to a deterministic frame — D-015). **Backgrounds** are isolated: create a dedicated harness page `apps/site/src/pages/internal/parity-bg/<id>.astro` (3 sized `aria-hidden` cells, `client:load`) and add the id to `BACKGROUND` — each background lives on its own page so only 3 WebGL contexts are live per load (the background test visits them one at a time with `newPage`/`close`; D-032), and asserts structure + a `<canvas>`, not pixels (D-029). **Loaders** (and other non-text CSS graphics) stay on the shared `parity.astro` (cells, no `client:` directive) and add the id to `GRAPHIC` — pixel-compared across frameworks, no text/segment asserts (D-034). Add the id to `scripts/cli-smoke.mjs` (the `jsrepo add` list + the file/stylesheet assertions).

8. **Gate.** `pnpm verify` **and** `pnpm test:cli` **and** `pnpm test:e2e` green — capture output in the PR. Update `PROGRESS.md`. Branch → PR → merge (never push `main`).

## Definition of done for a component

Exists in all three frameworks · identical look/motion/API (parity E2E green) · copy-paste === CLI install === source (`registry:check` + `test:cli` green) · documented with a schema-driven props table · reduced-motion + (GSAP) cleanup tested · `pnpm verify` green.
