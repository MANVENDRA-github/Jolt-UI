# Jolt UI

> One design language. Three frameworks. A gallery of animated UI components for **React, Vue, and Svelte** — from a single source.

Jolt UI is a multi-framework animated component gallery (think [react-bits](https://github.com/DavidHDev/react-bits), but every component ships for React **and** Vue **and** Svelte, kept identical by a shared design language and an automated parity gate). Components are consumed via **copy-paste** on the site or a **CLI registry** (`npx jsrepo add …`).

## Status

**Phase 0 — Foundation: complete.** A pnpm monorepo with TS strict, ESLint + Prettier, Vitest (one project per framework), shared design tokens, and an Astro site that renders live React + Vue + Svelte islands on one page. See [`PROGRESS.md`](./PROGRESS.md) for the live state and [`ROADMAP.md`](./ROADMAP.md) for what's next.

## Quickstart

```bash
pnpm install          # install the workspace
pnpm dev              # run the Astro gallery site (apps/site)
pnpm verify           # the pre-PR gate: typecheck + lint + test
pnpm build            # build the static site
```

## Layout

```
apps/site/        Astro gallery + docs (multi-framework islands)
packages/tokens/  Shared design language (CSS-var tokens + keyframes)
packages/react/   React component skins
packages/vue/     Vue component skins
packages/svelte/  Svelte component skins
```

## Docs

- [`CLAUDE.md`](./CLAUDE.md) — operating guide (read first, every session)
- [`PRP_SPEC.md`](./PRP_SPEC.md) — product spec (source of truth)
- [`ROADMAP.md`](./ROADMAP.md) — phased build order
- [`PROGRESS.md`](./PROGRESS.md) — cross-session state & session log
- [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) — design language + per-component contract
- [`COMPONENT_GUIDE.md`](./COMPONENT_GUIDE.md) — how to add a component (all 3 frameworks)
- [`TEST_CONTRACT.md`](./TEST_CONTRACT.md) — binding test rules
- [`DECISIONS.md`](./DECISIONS.md) — architecture decision log

## License

[MIT + Commons Clause](./LICENSE) — free for personal and commercial use; you may not sell the Software itself.
