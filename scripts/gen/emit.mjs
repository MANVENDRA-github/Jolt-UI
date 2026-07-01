// Pure emitters: ComponentContract -> source strings. No I/O — every function
// returns a string the shell writes (or inserts at a marker). Scoped to the CSS
// patterns (css-per-char / css-whole-text / css-structural); the generator rejects
// `gsap` with a hand-write hint (GSAP scaffolding is a follow-up).
//
// The emitted slice mirrors the shipped CSS components (e.g. blur-in, gradient-text):
// a Zod schema + meta, a shared stylesheet (a simple opacity fade the author then
// customizes), three skins that set --jolt-* from props, unit tests, a demo page,
// type shims, the registry items, the parity cells, and the index card.

import { isCssPattern } from './contract.mjs';

const lcfirst = (s) => s[0].toLowerCase() + s.slice(1);
const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

/** Per-component identifiers derived from the contract. */
function names(c) {
  return { id: c.id, Name: c.name, camel: lcfirst(c.name), cls: `jolt-${c.id}` };
}

const isPerChar = (c) => c.parity.kind === 'per-char';
/** Props that map to a --jolt-* custom property (everything but text/by). */
const cssVarProps = (c) => c.props.filter((p) => p.cssVar);

/** TS type for a prop (string | number | boolean | enum union | string[]). */
function tsType(p) {
  if (p.type === 'enum') return p.values.map((v) => q(v)).join(' | ');
  if (p.type === 'string[]') return 'string[]';
  return p.type;
}

/** A prop's default rendered as a JS literal. */
function defLit(p) {
  if (p.type === 'string' || p.type === 'enum') return q(p.default);
  if (p.type === 'string[]') return `[${p.default.map(q).join(', ')}]`;
  return String(p.default);
}

/** `text, by = 'chars', distance = 16, ...` — skin destructuring with defaults. */
function params(c) {
  return c.props.map((p) => (p.required ? p.name : `${p.name} = ${defLit(p)}`)).join(', ');
}

/** `${name}px` style value for a cssVar prop, or the bare value when unitless. */
function cssVarValue(p) {
  return p.cssVar.unit ? `\`\${${p.name}}${p.cssVar.unit}\`` : p.name;
}

/** Object-literal entries mapping each cssVar prop to its --jolt-* property. */
function styleObjectEntries(c, indent) {
  return cssVarProps(c)
    .map((p) => `${indent}'${p.cssVar.name}': ${cssVarValue(p)},`)
    .join('\n');
}

/** Svelte inline style string: `--jolt-distance:{distance}px; ...`. */
function svelteStyleString(c) {
  return cssVarProps(c)
    .map((p) => `${p.cssVar.name}:{${p.name}}${p.cssVar.unit ?? ''}`)
    .join('; ');
}

/** Vue local Props interface fields (required = no `?`). */
function vueInterfaceFields(c) {
  return c.props.map((p) => `  ${p.name}${p.required ? '' : '?'}: ${tsType(p)};`).join('\n');
}

/** JSX/Astro attributes from a props object (string -> "v", other -> {v}). */
function attrs(obj) {
  return Object.entries(obj)
    .map(([k, v]) => {
      if (typeof v === 'string') return `${k}="${v}"`;
      if (v === true) return k;
      return `${k}={${JSON.stringify(v)}}`;
    })
    .join(' ');
}

// ---------------------------------------------------------------- core: schema

export function emitSchema(c) {
  const { id, Name, camel } = names(c);
  const fields = c.props
    .map((p) => {
      let base;
      if (p.type === 'enum') base = `z.enum([${p.values.map(q).join(', ')}])`;
      else if (p.type === 'string[]') base = 'z.array(z.string())';
      else base = `z.${p.type}()`;
      const def = p.required ? '' : `.default(${defLit(p)})`;
      return `  ${p.name}: ${base}${def}.describe(${q(p.describe)}),`;
    })
    .join('\n');
  return `import { z } from 'zod';

/**
 * Props for the ${Name} component (CSS-only). The shared \`styles/${id}.css\`
 * reads these via CSS custom properties the skin sets from these values.
 */
export const ${camel}Schema = z.object({
${fields}
});

export type ${Name}Props = z.input<typeof ${camel}Schema>;

export const ${camel}Meta = {
  id: '${id}',
  name: '${Name}',
  category: 'text',
  deps: [${c.deps.map(q).join(', ')}],
  a11y: ${q(c.a11y)},
} as const;
`;
}

// -------------------------------------------------------------- core: stylesheet

export function emitCss(c) {
  const { Name, cls } = names(c);
  if (isPerChar(c)) {
    return `/* ${Name} — CSS-only per-character reveal. Generated scaffold: a simple opacity
   fade — customize the @keyframes for the real motion. The skin sets --jolt-*
   from props; each segment carries its index in --jolt-i for the stagger. */
@keyframes ${cls} {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.${cls} {
  display: inline-block;
}

.${cls} [data-jolt-segment] {
  display: inline-block;
  white-space: pre;
  opacity: 0;
  will-change: opacity;
  animation: ${cls} var(--jolt-duration, 0.6s) ease both;
  animation-delay: calc(var(--jolt-delay, 0s) + var(--jolt-i, 0) * var(--jolt-stagger, 0.05s));
}

@media (prefers-reduced-motion: reduce) {
  .${cls} [data-jolt-segment] {
    animation: none;
    opacity: 1;
    /* Release the GPU layer so the static text rasterizes deterministically (D-014). */
    will-change: auto;
  }
}
`;
  }
  return `/* ${Name} — CSS-only whole-text reveal. Generated scaffold: a simple opacity
   fade — customize the @keyframes for the real motion. The skin sets --jolt-*. */
@keyframes ${cls} {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.${cls} {
  display: inline-block;
  opacity: 0;
  will-change: opacity;
  animation: ${cls} var(--jolt-duration, 0.6s) ease both;
  animation-delay: var(--jolt-delay, 0s);
}

@media (prefers-reduced-motion: reduce) {
  .${cls} {
    animation: none;
    opacity: 1;
    will-change: auto;
  }
}
`;
}

export function emitBehavior(c) {
  if (!isCssPattern(c.pattern)) throw new Error('emitBehavior: only CSS patterns are supported');
  return emitCss(c);
}

// --------------------------------------------------------------------- skins

export function emitReactSkin(c) {
  const { id, Name, cls } = names(c);
  const style = styleObjectEntries(c, '    ');
  const hasStyle = cssVarProps(c).length > 0;
  const styleConst = hasStyle ? `  const rootStyle = {\n${style}\n  } as CSSProperties;\n` : '';
  const styleAttr = hasStyle ? ' style={rootStyle}' : '';
  const cssImport = `import '@jolt/core/styles/${id}.css';`;

  if (isPerChar(c)) {
    return `import type { CSSProperties } from 'react';
import { splitSegments, type ${Name}Props } from '@jolt/core';
${cssImport}

/** ${c.blurb} */
export function ${Name}({ ${params(c)} }: ${Name}Props) {
  const segments = splitSegments(text, by);
${styleConst}
  return (
    <span className="${cls}" aria-label={text}${styleAttr}>
      {segments.map((segment, i) => (
        <span
          key={i}
          data-jolt-segment=""
          aria-hidden="true"
          style={{ '--jolt-i': i } as CSSProperties}
        >
          {segment}
        </span>
      ))}
    </span>
  );
}
`;
  }
  const typeImport = hasStyle ? "import type { CSSProperties } from 'react';\n" : '';
  return `${typeImport}import type { ${Name}Props } from '@jolt/core';
${cssImport}

/** ${c.blurb} */
export function ${Name}({ ${params(c)} }: ${Name}Props) {
${styleConst}
  return (
    <span className="${cls}"${styleAttr}>
      {text}
    </span>
  );
}
`;
}

export function emitVueSkin(c) {
  const { id, camel, cls } = names(c);
  const style = styleObjectEntries(c, '  ');
  const hasStyle = cssVarProps(c).length > 0;
  const styleConst = hasStyle ? `const rootStyle = computed(() => ({\n${style}\n}));\n` : '';
  const styleBind = hasStyle ? ' :style="rootStyle"' : '';
  const mirror = `// Mirrors \`${camel}Schema\` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).`;

  if (isPerChar(c)) {
    return `<script setup lang="ts">
import { computed } from 'vue';
import { splitSegments } from '@jolt/core';
import '@jolt/core/styles/${id}.css';

${mirror}
interface Props {
${vueInterfaceFields(c)}
}
const { ${params(c)} } = defineProps<Props>();

const segments = computed(() => splitSegments(text, by));
${styleConst}</script>

<template>
  <span class="${cls}" :aria-label="text"${styleBind}
    ><span
      v-for="(segment, i) in segments"
      :key="i"
      data-jolt-segment
      aria-hidden="true"
      :style="{ '--jolt-i': i }"
      >{{ segment }}</span
    ></span
  >
</template>
`;
  }
  const computedImport = hasStyle ? "import { computed } from 'vue';\n" : '';
  return `<script setup lang="ts">
${computedImport}import '@jolt/core/styles/${id}.css';

${mirror}
interface Props {
${vueInterfaceFields(c)}
}
const { ${params(c)} } = defineProps<Props>();
${styleConst}</script>

<template>
  <span class="${cls}"${styleBind}>{{ text }}</span>
</template>
`;
}

export function emitSvelteSkin(c) {
  const { id, Name, cls } = names(c);
  const styleStr = svelteStyleString(c);
  const styleAttr = styleStr ? ` style="${styleStr}"` : '';

  if (isPerChar(c)) {
    return `<script lang="ts">
  import { splitSegments, type ${Name}Props } from '@jolt/core';
  import '@jolt/core/styles/${id}.css';

  let { ${params(c)} }: ${Name}Props = $props();
  const segments = $derived(splitSegments(text, by));
</script>

<!-- prettier-ignore -->
<span class="${cls}" aria-label={text}${styleAttr}>{#each segments as segment, i (i)}<span data-jolt-segment aria-hidden="true" style="--jolt-i:{i}">{segment}</span>{/each}</span>
`;
  }
  return `<script lang="ts">
  import type { ${Name}Props } from '@jolt/core';
  import '@jolt/core/styles/${id}.css';

  let { ${params(c)} }: ${Name}Props = $props();
</script>

<span class="${cls}"${styleAttr}>{text}</span>
`;
}

export function emitBarrel(framework, c) {
  const { Name } = names(c);
  if (framework === 'react') return `export { ${Name} } from './${Name}';\n`;
  const ext = framework === 'vue' ? 'vue' : 'svelte';
  return `export { default as ${Name} } from './${Name}.${ext}';\n`;
}

// ----------------------------------------------------------------- unit tests

/** The first cssVar prop, used to assert --jolt-* mapping in the generated tests. */
function sampleCssVar(c) {
  const p = cssVarProps(c)[0];
  if (!p) return null;
  const value = p.type === 'number' ? 7 : q(p.default);
  const expected = p.cssVar.unit
    ? `'${p.type === 'number' ? 7 : p.default}${p.cssVar.unit}'`
    : `'${p.default}'`;
  return { prop: p, value, expected };
}

function reactTestBody(c) {
  const { Name, cls } = names(c);
  const cv = sampleCssVar(c);
  const mapTest = cv
    ? `

  it('maps props to CSS custom properties', () => {
    const { container } = render(<${Name} text="Hi" ${cv.prop.name}={${cv.value}} />);
    const root = container.querySelector<HTMLElement>('.${cls}');
    expect(root?.style.getPropertyValue('${cv.prop.cssVar.name}')).toBe(${cv.expected});
  });`
    : '';
  if (isPerChar(c)) {
    return `import { render } from '@testing-library/react';
import { splitSegments } from '@jolt/core';
import { ${Name} } from './${Name}';

describe('${Name} (react)', () => {
  it('exposes the full text via aria-label', () => {
    const { container } = render(<${Name} text="Hello" />);
    expect(container.querySelector('[aria-label]')?.getAttribute('aria-label')).toBe('Hello');
  });

  it('renders one aria-hidden segment per character', () => {
    const { container } = render(<${Name} text="Hello" />);
    const segs = container.querySelectorAll('[data-jolt-segment]');
    expect(segs.length).toBe(splitSegments('Hello', 'chars').length);
    expect(Array.from(segs).every((s) => s.getAttribute('aria-hidden') === 'true')).toBe(true);
  });${mapTest}
});
`;
  }
  return `import { render } from '@testing-library/react';
import { ${Name} } from './${Name}';

describe('${Name} (react)', () => {
  it('renders the text directly', () => {
    const { container } = render(<${Name} text="Hello" />);
    expect(container.querySelector('.${cls}')?.textContent).toBe('Hello');
  });${mapTest}
});
`;
}

function frameworkTestBody(c, framework) {
  // Vue and Svelte share the same testing-library shape; only the import + render differ.
  const { Name, cls } = names(c);
  const lib = framework === 'vue' ? '@testing-library/vue' : '@testing-library/svelte';
  const importLine =
    framework === 'vue'
      ? `import ${Name} from './${Name}.vue';`
      : `import ${Name} from './${Name}.svelte';`;
  const cv = sampleCssVar(c);
  const mapTest = cv
    ? `

  it('maps props to CSS custom properties', () => {
    const { container } = render(${Name}, { props: { text: 'Hi', ${cv.prop.name}: ${cv.value} } });
    const root = container.querySelector<HTMLElement>('.${cls}');
    expect(root?.style.getPropertyValue('${cv.prop.cssVar.name}')).toBe(${cv.expected});
  });`
    : '';
  if (isPerChar(c)) {
    return `import { render } from '${lib}';
import { splitSegments } from '@jolt/core';
${importLine}

describe('${Name} (${framework})', () => {
  it('exposes the full text via aria-label', () => {
    const { container } = render(${Name}, { props: { text: 'Hello' } });
    expect(container.querySelector('[aria-label]')?.getAttribute('aria-label')).toBe('Hello');
  });

  it('renders one aria-hidden segment per character', () => {
    const { container } = render(${Name}, { props: { text: 'Hello' } });
    const segs = container.querySelectorAll('[data-jolt-segment]');
    expect(segs.length).toBe(splitSegments('Hello', 'chars').length);
    expect(Array.from(segs).every((s) => s.getAttribute('aria-hidden') === 'true')).toBe(true);
  });${mapTest}
});
`;
  }
  return `import { render } from '${lib}';
${importLine}

describe('${Name} (${framework})', () => {
  it('renders the text directly', () => {
    const { container } = render(${Name}, { props: { text: 'Hello' } });
    expect(container.querySelector('.${cls}')?.textContent).toBe('Hello');
  });${mapTest}
});
`;
}

export const emitReactTest = (c) => reactTestBody(c);
export const emitVueTest = (c) => frameworkTestBody(c, 'vue');
export const emitSvelteTest = (c) => frameworkTestBody(c, 'svelte');

// ------------------------------------------------------------------ demo page

export function emitDemoPage(c) {
  const { id, Name, camel } = names(c);
  const demo = attrs(c.demoProps);
  return `---
import ComponentsLayout from '../../../layouts/ComponentsLayout.astro';
import Breadcrumbs from '../../../components/Breadcrumbs.astro';
import FrameworkSwitcher from '../../../components/FrameworkSwitcher.astro';
import CodeTabs from '../../../components/CodeTabs.astro';
import InstallBlock from '../../../components/InstallBlock.astro';
import PropsTable from '../../../components/PropsTable.astro';
import ComponentPager from '../../../components/ComponentPager.astro';
import { ${Name} as React${Name} } from '@jolt/react';
import { ${Name} as Vue${Name} } from '@jolt/vue';
import { ${Name} as Svelte${Name} } from '@jolt/svelte';
import { ${camel}Schema, ${camel}Meta } from '@jolt/core';
import reactSource from '../../../../../../packages/react/src/components/${Name}/${Name}.tsx?raw';
import vueSource from '../../../../../../packages/vue/src/components/${Name}/${Name}.vue?raw';
import svelteSource from '../../../../../../packages/svelte/src/components/${Name}/${Name}.svelte?raw';

const sourceTabs = [
  { label: 'React', lang: 'tsx', code: reactSource },
  { label: 'Vue', lang: 'vue', code: vueSource },
  { label: 'Svelte', lang: 'svelte', code: svelteSource },
];
---

<ComponentsLayout title="${Name} — Jolt UI">
  <Breadcrumbs id="${id}" />
  <h1 class="font-display text-3xl font-semibold tracking-tight">${Name}</h1>
  <p class="mt-2 text-[var(--jolt-text-muted)]">${c.blurb}</p>

  <div class="mt-8">
    <FrameworkSwitcher id="${id}">
      <div class="text-3xl font-semibold" slot="react"><React${Name} ${demo} /></div>
      <div class="text-3xl font-semibold" slot="vue"><Vue${Name} ${demo} /></div>
      <div class="text-3xl font-semibold" slot="svelte"><Svelte${Name} ${demo} /></div>
    </FrameworkSwitcher>
  </div>

  <InstallBlock meta={${camel}Meta} />

  <section class="mt-12">
    <h2 class="font-display text-xl font-semibold">Source</h2>
    <p class="mt-2 text-sm text-[var(--jolt-text-subtle)]">Identical behavior, idiomatic per framework.</p>
    <div class="mt-3"><CodeTabs tabs={sourceTabs} /></div>
  </section>

  <PropsTable schema={${camel}Schema} />
  <ComponentPager id="${id}" />
</ComponentsLayout>
`;
}

// -------------------------------------------------------------------- shims

export function emitVueShim(c) {
  const { Name } = names(c);
  const fields = c.props
    .map((p) => `  ${p.name}${p.required ? '' : '?'}: ${tsType(p)};`)
    .join('\n');
  return `export declare const ${Name}: DefineComponent<{
${fields}
}>;`;
}

export function emitSvelteShim(c) {
  const { Name } = names(c);
  const fields = c.props
    .map((p) => `  ${p.name}${p.required ? '' : '?'}: ${tsType(p)};`)
    .join('\n');
  return `export declare const ${Name}: (props: {
${fields}
}) => unknown;`;
}

// ------------------------------------------------------ central-file insertions

const EXT = { react: 'tsx', vue: 'vue', svelte: 'svelte' };

/** A jsrepo component item for one framework registry. */
export function emitJsrepoItem(c, framework) {
  const { id, Name } = names(c);
  return `        {
          name: '${id}',
          type: 'component',
          files: [{ path: 'packages/${framework}/src/components/${Name}/${Name}.${EXT[framework]}' }],
        },`;
}

/** The framework-prefixed import alias inserted in a parity.astro import block. */
export function emitParityImport(c, framework) {
  const prefix = framework[0].toUpperCase();
  const { Name } = names(c);
  return `  ${Name} as ${prefix}${Name},`;
}

/** The three parity-harness cells (CSS-only: no client directive). */
export function emitParityCells(c) {
  const { id, Name } = names(c);
  const harness = attrs(c.harnessProps);
  return ['react', 'vue', 'svelte']
    .map((fw) => {
      const prefix = fw[0].toUpperCase();
      return `    <div data-testid="${id}-${fw}"><${prefix}${Name} ${harness} /></div>`;
    })
    .join('\n');
}

/** The /components index card. */
export function emitCard(c) {
  const { id, Name } = names(c);
  return `    <a href="/components/text/${id}" class={card}>
      <div class={preview}><${Name} text="${c.cardText}" /></div>
      <div class={name}>${c.cardText}</div>
      <div class={blurb}>${c.blurb}</div>
    </a>`;
}

/** Core barrel exports (schema + meta + Props type). */
export function emitCoreExports(c) {
  const { id, Name, camel } = names(c);
  return `export { ${camel}Schema, ${camel}Meta } from './schemas/${id}';
export type { ${Name}Props } from './schemas/${id}';`;
}

/** A framework package barrel re-export. */
export function emitPackageExport(c) {
  const { Name } = names(c);
  return `export { ${Name} } from './components/${Name}';`;
}
