# TEST_CONTRACT — Jolt UI

Binding rules for tests. Test-first is mandatory: write the failing test, watch it fail for the right reason, make it pass, refactor.

## Non-negotiables

1. **No production code without a test that would fail without it.**
2. **No live network / no real LLM or external endpoints in unit tests.** Everything hermetic.
3. **Determinism:** animations are tested by *seeking* to a frame or asserting the reduced-motion final state — never by wall-clock timing, `Date.now()`, or randomness in assertions.
4. **`pnpm verify` must be green before any PR** (typecheck + lint + test today; registry sync + E2E join the gate as they land).

## Layers

| Layer | Tool | Asserts |
|---|---|---|
| Core logic | Vitest (node) | Zod schema parse + defaults; DOM splitter output; reduced-motion branch. Pure functions only. |
| Per-framework unit | Vitest projects + `@testing-library/{react,vue,svelte}` | For identical props, the rendered DOM is **identical across frameworks**; defaults applied; **`revert` called on unmount** (no leaked GSAP tweens); reduced-motion renders the static final state. |
| Token parity | Vitest (node) | Every motion value in `tokens.ts` appears in `theme.css`. |
| Parity (E2E, Phase 1+) | Playwright | The 3 framework demos match at a deterministic frame (and a committed golden) within threshold. The anti-drift gate. |
| Registry sync (Phase 1+) | node script (`registry:check`) | Package source === built registry block === site code-tab content. |
| CLI smoke (E2E, Phase 1+) | Playwright/node | `jsrepo add` against the **locally built** registry installs files into a fixture that then **typechecks**. Never hits the live origin. |
| Demos/UX (E2E, Phase 1+) | Playwright | All 3 islands hydrate on one page; copy button copies the exact source; theme toggle works; search finds the component. |

## Vitest setup

- One project per framework (`packages/*/vitest.config.ts`), each with its own plugin + `jsdom` env + `globals: true`. The root `vitest.config.ts` lists them under `test.projects`.
- Tests live next to source as `*.test.ts(x)`.

## Coverage

- Phase 0: no threshold (foundation). From Phase 1: a coverage gate on `@jolt/core` (the highest-value code) — start 90% lines/branches, lighter on thin skins. Add `--coverage` to the gate when introduced.
