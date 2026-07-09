# PRP_SPEC — Jolt UI (Product Source of Truth)

> What Jolt UI is and the boundaries of v1. When code and this doc disagree, this doc wins (or this doc is wrong and should be fixed in the same PR).

## 1. Problem

Developers love copy-paste animated component galleries (react-bits, Aceternity, Magic UI) — but they are **React-only**. Vue, Svelte, and Solid developers either go without or use ports that are _separate repos which drift_ in look, behavior, and API. There is no gallery that ships one consistent, quality-controlled design language across multiple frameworks from a single source.

## 2. Product

Jolt UI is a **self-serve gallery website** + a **component registry**. A developer:

1. Browses components on the site, sees **live React, Vue, and Svelte demos side by side**.
2. Picks their framework, reads the docs + props table, and either **copies the code** or runs **`npx jsrepo add @jolt/<framework>/<component>`**.
3. Owns the code in their project (shadcn-style) — no version-locked runtime dependency.

The differentiator and the hard engineering bet: **the three framework versions of a component are visually and behaviorally identical, guaranteed by a shared source and an automated parity gate** — not by manual effort.

## 3. Target user

Front-end developers and small teams who want polished motion/interaction components in their framework of choice (React, Vue, or Svelte), without hand-porting from React.

## 4. Architecture principles

- **One design language** — all visual tokens (color, spacing, easing, duration, stagger) live once in `@jolt/tokens`.
- **One behavior core** — drift-prone animation logic lives once in `@jolt/core` (vanilla TS + GSAP); skins are thin lifecycle adapters.
- **One API contract** — each component's props/defaults are a single Zod schema in `core`; every framework derives its prop types from it.
- **Drift is a test failure** — a Playwright parity test renders all three demos at a deterministic frame and fails CI if they diverge.
- **One source, three surfaces** — package source feeds (a) the registry blocks, (b) the site code tabs, (c) the workspace demos/tests; a sync check keeps them identical.

## 5. v1 scope (lean MVP)

- **Category:** Text Animations (highest shared-logic ratio, SSR/a11y-friendly, CSS-first).
- **~8–12 components**, each in **React + Vue + Svelte**, **TS + Tailwind** variant only.
- **Delivery:** copy-paste on the site + jsrepo CLI registry.
- **Site:** Astro, live tri-framework demos, dark mode, search, MDX docs with schema-generated props tables.
- **Quality:** `pnpm verify` gate + parity/CLI/sync E2E; deployed live (Cloudflare).

## 6. Non-goals for v1 (explicitly deferred)

- JS variant and non-Tailwind/plain-CSS variant (the 4-variant matrix) — generatable later.
- Backgrounds (Three.js/WebGL) and other categories.
- Frameworks beyond the three (Solid, Angular, Astro-native, web components).
- A paid "pro" tier, templates/blocks, Figma kits.
- shadcn-registry JSON output and an MCP server.
- Auth, user accounts, or any backend beyond the static site + static registry.

## 7. Success criteria for v1

1. A developer can install any component into a fresh React, Vue, or Svelte project via copy-paste **and** CLI, and it typechecks + runs.
2. The three framework versions are pixel-consistent at the parity frame (CI-enforced).
3. The site is live, fast (Lighthouse pass), searchable, and documents every component.
4. Adding a new component is a single small PR following `COMPONENT_GUIDE.md`.
