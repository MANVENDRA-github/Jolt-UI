# COMPONENT_GUIDE — adding a component to Jolt UI

The repeatable unit of work. A new component = **one small PR** touching a predictable set of files. Follow `DESIGN_SYSTEM.md` for the rules and `DECISIONS.md` for the why; this is the procedure, proven across SplitText, Blur In, Wave, Gradient Text, and Shiny Text. Test-first throughout (`TEST_CONTRACT.md`).

> **Naming:** kebab-case id (`blur-in`), PascalCase component (`BlurIn`). Use the id in the registry, schema filename, CSS filename, demo page, and parity testid; the PascalCase name for the exported component + folder.

## First, pick a pattern

| Pattern | When | Behavior lives in | Skin does | a11y | Examples |
|---------|------|-------------------|-----------|------|----------|
| **Per-char CSS-only** | each character animates | `core/src/styles/<id>.css` | `splitSegments` → `aria-label` + aria-hidden segments; set `--jolt-*` (+ per-segment `--jolt-i`) | aria-label carries full text | Blur In, Wave |
| **Whole-text CSS-only** | the whole string animates | `core/src/styles/<id>.css` | render `<span class="jolt-…">{text}</span>`; set `--jolt-*` | native (real text) | Gradient Text, Shiny Text |
| **GSAP** | needs JS (measure, scroll, scramble, count) | `core/src/animation/<id>.ts` factory | call factory on mount, `revert` on unmount | per case | Split Text |

## Steps

1. **Contract (core).** `packages/core/src/schemas/<id>.ts`: a Zod object, **every field `.default()` + `.describe()`** (the `propsTable` helper turns these into the docs table). Export `type <Name>Props = z.input<typeof <id>Schema>` (use `z.input` — defaults make fields optional) and a `<id>Meta` const (`id`, `name`, `category`, `deps`, `a11y`). Export both from `core/src/index.ts`. Write the failing schema/defaults test first.

2. **Behavior (core) — per the chosen pattern.**
   - **CSS-only:** add a self-contained `packages/core/src/styles/<id>.css` — `@keyframes` + a `.jolt-<id>` (whole-text) or `.jolt-<id> [data-jolt-segment]` (per-char) rule reading tunables from `--jolt-*` custom properties (per-char also reads per-segment `--jolt-i`). Add a `@media (prefers-reduced-motion: reduce)` block that renders the **static final state and sets `will-change: auto`** (D-014).
   - **GSAP:** add `packages/core/src/animation/<id>.ts` exporting a framework-agnostic factory `(el, opts) => { play, revert }`; register any plugin in `core/motion.ts`; guard `window`. Use `prefersReducedMotion()` to jump to the final state. Unit-test the pure logic.

3. **Three skins.** `packages/{react,vue,svelte}/src/components/<Name>/<Name>.{tsx,vue,svelte}` + a barrel `index.ts`; re-export from each package `src/index.ts`; add a shim to the vue/svelte `types.d.ts`.
   - **CSS-only skins:** `import '@jolt/core/styles/<id>.css'`; render the markup and set `--jolt-*` from props (per-char: map `splitSegments(text, by)` to segment spans with `--jolt-i`). No lifecycle.
   - **GSAP skins:** call the core factory on mount and `revert` on unmount — React `useEffect`, Vue `onMounted`/`onUnmounted`, Svelte `onMount` returning the cleanup.
   - **Vue** declares a **local `Props` interface** mirroring the schema (the SFC compiler can't resolve the Zod-inferred type — D-011).

4. **Unit tests (per framework, test-first).** Across all three frameworks assert identical DOM for identical props. Per-char: `aria-label` = text, one aria-hidden segment per character, `--jolt-*` mapping. Whole-text: text content, `--jolt-*` mapping. GSAP: also `revert`-on-unmount (no leaked tweens) and reduced-motion final state.

5. **Demo page (site).** `apps/site/src/pages/components/<id>.astro`: three live previews (CSS-only need **no** `client:` directive; GSAP uses `client:visible`), an install tab + tabbed source via `CodeTabs` + `?raw` imports, and a props table from `propsTable(<id>Schema)`.

6. **Registry.** Add `react|vue|svelte/<id>` component items to the root `jsrepo.config.ts`. The `build.transforms` rewrite bundles the whole `core` (incl. `styles/*.css`) — you don't list the CSS separately (D-012, D-013). Run `pnpm registry:check`.

7. **Parity + CLI E2E.** Add cells for the component (all three frameworks) to `apps/site/src/pages/internal/parity.astro`, and add the id to `e2e/parity.spec.ts` (`PER_CHAR` or `WHOLE_TEXT`). The spec freezes animations to a deterministic frame (D-015). Add the id to `scripts/cli-smoke.mjs` (the `jsrepo add` list + the file/stylesheet assertions).

8. **Gate.** `pnpm verify` **and** `pnpm test:cli` **and** `pnpm test:e2e` green — capture output in the PR. Update `PROGRESS.md`. Branch → PR → merge (never push `main`).

## Definition of done for a component

Exists in all three frameworks · identical look/motion/API (parity E2E green) · copy-paste === CLI install === source (`registry:check` + `test:cli` green) · documented with a schema-driven props table · reduced-motion + (GSAP) cleanup tested · `pnpm verify` green.
