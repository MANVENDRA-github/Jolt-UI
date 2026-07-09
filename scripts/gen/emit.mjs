// Pure emitters: ComponentContract -> source strings. No I/O — every function
// returns a string the shell writes (or inserts at a marker). Scoped to the CSS
// patterns (css-per-char / css-whole-text / css-structural / css-container /
// css-interactive); the generator rejects `gsap` with a hand-write hint.
//
// The emitted slice mirrors the shipped CSS components (blur-in, gradient-text,
// spotlight, shimmer): a Zod schema + meta, a shared stylesheet (a parity-safe
// starting effect the author then customizes), three skins that set --jolt-* from
// props, unit tests, a demo page, type shims, the registry items, the parity cells,
// and the index card.

import { isCssPattern, categorySlug } from './contract.mjs';

const lcfirst = (s) => s[0].toLowerCase() + s.slice(1);
const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

/** Per-component identifiers derived from the contract. */
function names(c) {
  return { id: c.id, Name: c.name, camel: lcfirst(c.name), cls: `jolt-${c.id}` };
}

const isPerChar = (c) => c.parity.kind === 'per-char';
const isContainer = (c) => c.parity.kind === 'container';
const isInteractive = (c) => c.parity.kind === 'interactive';
/** The component's plural URL segment (`text`, `cards`, `buttons`, `effects`, `ui`). */
const slug = (c) => categorySlug(c.category);
/** Props that map to a --jolt-* custom property (everything but text/by/label). */
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

/** An attribute string prefixed by a space, or '' when there are no attributes. */
const lead = (s) => (s ? ` ${s}` : '');

// ---------------------------------------------------------------- core: schema

/** The schema doc-comment, which differs by what the skin renders. */
function schemaDoc(c) {
  const { id, Name } = names(c);
  if (isContainer(c)) {
    return `/**
 * Props for the ${Name} card (CSS-only, visual-only). The skin renders a \`<div>\` wrapping
 * your content (children/slot); the shared \`styles/${id}.css\` reads these via the CSS
 * custom properties the skin sets.
 */`;
  }
  if (isInteractive(c)) {
    return `/**
 * Props for the ${Name} button (CSS-only, visual-only + a \`label\` fallback). The skin renders
 * a native \`<button>\` and forwards native button attrs; the shared \`styles/${id}.css\` reads
 * these via the CSS custom properties the skin sets.
 */`;
  }
  return `/**
 * Props for the ${Name} component (CSS-only). The shared \`styles/${id}.css\`
 * reads these via CSS custom properties the skin sets from these values.
 */`;
}

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

${schemaDoc(c)}
export const ${camel}Schema = z.object({
${fields}
});

export type ${Name}Props = z.input<typeof ${camel}Schema>;

export const ${camel}Meta = {
  id: '${id}',
  name: '${Name}',
  category: '${c.category ?? 'text'}',
  deps: [${c.deps.map(q).join(', ')}],
  a11y: ${q(c.a11y)},
} as const;
`;
}

// -------------------------------------------------------------- core: stylesheet

export function emitCss(c) {
  const { Name, cls } = names(c);

  if (isContainer(c)) {
    return `/* ${Name} — a CSS container that wraps the consumer's content. Generated scaffold:
   a card surface with a soft highlight — customize the rules for the real effect. The skin
   sets --jolt-* from props. A cursor-tracking card additionally calls the shared pointer
   behavior (behavior/pointer.ts), which writes --jolt-x / --jolt-y; the fallbacks below keep
   the untracked (SSR, reduced-motion, pre-hydration) state centered and deterministic. */
.${cls} {
  position: relative;
  display: block;
  border-radius: 12px;
  padding: 1.5rem;
  background: #14141c;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  isolation: isolate;
  transition: box-shadow 0.3s ease;
}

.${cls}::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: radial-gradient(
    circle at var(--jolt-x, 50%) var(--jolt-y, 50%),
    var(--jolt-color, #7c5cff) 0%,
    transparent var(--jolt-size, 60%)
  );
  opacity: var(--jolt-opacity, 0.35);
}

@media (prefers-reduced-motion: reduce) {
  .${cls} {
    transition: none;
    /* Release the GPU layer so the static card rasterizes deterministically (D-014). */
    will-change: auto;
  }
}
`;
  }

  if (isInteractive(c)) {
    return `/* ${Name} — a CSS-only animated <button>. Generated scaffold: a solid base that
   brightens on hover/focus — customize the rules (or add a @keyframes) for the real effect.
   The skin sets --jolt-* from props; click/disabled are native, so there is no JS in core. */
.${cls} {
  display: inline-block;
  border: none;
  border-radius: 8px;
  padding: 0.6em 1.2em;
  font: inherit;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  background: var(--jolt-color, #7c5cff);
  transition: filter 0.2s ease;
}

.${cls}:hover,
.${cls}:focus-visible {
  filter: brightness(1.15);
}

.${cls}:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (prefers-reduced-motion: reduce) {
  .${cls} {
    transition: none;
    will-change: auto;
  }
}
`;
  }

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

  // Container + interactive skins take the shipped Spotlight/Shimmer shape: the schema
  // carries only the visual contract, and each skin adds the native element's attribute
  // surface idiomatically — `& HTMLAttributes` / `& ButtonHTMLAttributes` + `...rest`,
  // no `any` (D-036, D-037).
  if (isContainer(c) || isInteractive(c)) {
    const button = isInteractive(c);
    const el = button ? 'button' : 'div';
    const attrType = button
      ? 'ButtonHTMLAttributes<HTMLButtonElement>'
      : 'HTMLAttributes<HTMLDivElement>';
    const typeImports = `${button ? 'ButtonHTMLAttributes' : 'HTMLAttributes'}, CSSProperties`;
    const extraParam = button ? "\n  type = 'button'," : '';
    const extraAttr = button ? '\n      type={type}' : '';
    const body = button ? '{children ?? label}' : '{children}';
    const destructure = c.props.map((p) => `  ${p.name} = ${defLit(p)},`).join('\n');
    return `import type { ${typeImports} } from 'react';
import type { ${Name}Props as ${Name}StyleProps } from '@jolt/core';
${cssImport}

type ${Name}Props = ${Name}StyleProps & ${attrType};

/** ${c.blurb} */
export function ${Name}({
${destructure}${extraParam}
  className,
  style,
  children,
  ...rest
}: ${Name}Props) {
  const vars = {
${styleObjectEntries(c, '    ')}
    ...style,
  } as CSSProperties;

  return (
    <${el}
      {...rest}${extraAttr}
      className={\`${cls}\${className ? \` \${className}\` : ''}\`}
      style={vars}
    >
      ${body}
    </${el}>
  );
}
`;
  }

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

  // Native attrs reach the single root element through Vue's attribute fallthrough, so
  // there is no defineEmits; declaring the visual props keeps them off the DOM element.
  if (isContainer(c) || isInteractive(c)) {
    const button = isInteractive(c);
    const markup = button
      ? `  <button class="${cls}" :style="style">\n    <slot>{{ label }}</slot>\n  </button>`
      : `  <div class="${cls}" :style="style"><slot /></div>`;
    return `<script setup lang="ts">
import { computed } from 'vue';
import '@jolt/core/styles/${id}.css';

${mirror}
interface Props {
${vueInterfaceFields(c)}
}
const { ${params(c)} } = defineProps<Props>();

const style = computed(() => ({
${styleObjectEntries(c, '  ')}
}));
</script>

<template>
${markup}
</template>
`;
  }

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

  if (isContainer(c) || isInteractive(c)) {
    const button = isInteractive(c);
    const el = button ? 'button' : 'div';
    const attrType = button ? 'HTMLButtonAttributes' : 'HTMLAttributes<HTMLDivElement>';
    // `class`/`style` are narrowed to string and pulled out of rest so the spread can't
    // clobber the base class; children is a Snippet (Svelte 5).
    const destructure = c.props.map((p) => `    ${p.name} = ${defLit(p)},`).join('\n');
    const extraParam = button ? "\n    type = 'button'," : '';
    const extraAttr = button ? '\n  {type}' : '';
    const vars = cssVarProps(c)
      .map((p) => `${p.cssVar.name}:{${p.name}}${p.cssVar.unit ?? ''}`)
      .join(';');
    // A <button>'s markup is closed tight around the label: stray whitespace inside the
    // element becomes a rendered space and would widen the Svelte cell against React's in
    // the parity pixel diff. A block <div> collapses its whitespace, so it can breathe.
    const markup = button
      ? `  >{#if children}{@render children()}{:else}{label}{/if}</${el}\n>`
      : `>\n  {#if children}{@render children()}{/if}\n</${el}>`;
    return `<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ${button ? 'HTMLButtonAttributes' : 'HTMLAttributes'} } from 'svelte/elements';
  import type { ${Name}Props } from '@jolt/core';
  import '@jolt/core/styles/${id}.css';

  type Props = ${Name}Props &
    Omit<${attrType}, 'children' | 'class' | 'style'> & {
      children?: Snippet;
      class?: string;
      style?: string;
    };

  let {
${destructure}${extraParam}
    class: className = '',
    style = '',
    children,
    ...rest
  }: Props = $props();
</script>

<${el}
  {...rest}${extraAttr}
  class="${cls} {className}"
  style="${vars};{style}"
${markup}
`;
  }

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
  // A number gets a distinct probe value; other types reuse the default (any value round-trips).
  const raw = p.type === 'number' ? 7 : p.default;
  const value = p.type === 'number' ? String(raw) : q(raw);
  const jsxAttr = p.type === 'number' ? `{${raw}}` : `"${raw}"`;
  const expected = `'${raw}${p.cssVar.unit ?? ''}'`;
  return { prop: p, value, jsxAttr, expected };
}

function containerTestBody(c, framework) {
  const { Name, cls } = names(c);
  const react = framework === 'react';
  const lib = `@testing-library/${framework}`;
  const importLine = react
    ? `import { ${Name} } from './${Name}';`
    : `import ${Name} from './${Name}.${framework}';`;
  const cv = sampleCssVar(c);
  const renderVars = react
    ? `render(<${Name} ${cv.prop.name}=${cv.jsxAttr} />)`
    : `render(${Name}, { props: { ${cv.prop.name}: ${cv.value} } })`;
  const renderChild = react
    ? `render(<${Name}>Card body</${Name}>)`
    : framework === 'vue'
      ? `render(${Name}, { slots: { default: () => 'Card body' } })`
      : `render(${Name})`;
  const childAssert =
    framework === 'svelte'
      ? `    const el = container.querySelector('.${cls}') as HTMLElement;
    expect(el.tagName).toBe('DIV');`
      : `    expect(getByText('Card body').closest('.${cls}')?.tagName).toBe('DIV');`;
  const childDestructure = framework === 'svelte' ? 'container' : 'getByText';
  return `import { render } from '${lib}';
${importLine}

describe('${Name} (${framework})', () => {
  it('renders a <div> card wrapping its content', () => {
    const { ${childDestructure} } = ${renderChild};
${childAssert}
  });

  it('maps props to CSS custom properties', () => {
    const { container } = ${renderVars};
    const el = container.querySelector('.${cls}') as HTMLElement;
    expect(el.style.getPropertyValue('${cv.prop.cssVar.name}')).toBe(${cv.expected});
  });

  it('mounts and unmounts without throwing', () => {
    const { unmount } = ${react ? `render(<${Name} />)` : `render(${Name})`};
    expect(() => unmount()).not.toThrow();
  });
});
`;
}

function interactiveTestBody(c, framework) {
  const { Name } = names(c);
  const react = framework === 'react';
  const lib = `@testing-library/${framework}`;
  const importLine = react
    ? `import { ${Name} } from './${Name}';`
    : `import ${Name} from './${Name}.${framework}';`;
  const cv = sampleCssVar(c);
  // Vue types `props` against the declared props only, so its fallthrough attrs (onClick,
  // disabled) go through the render `attrs` option; Svelte 5 takes them as props (D-036).
  const nativeOpt = framework === 'vue' ? 'attrs' : 'props';
  const clickHandler =
    framework === 'react' ? 'onClick' : framework === 'vue' ? 'onClick' : 'onclick';
  const labelRender = react
    ? `render(<${Name} label="Go" />)`
    : `render(${Name}, { props: { label: 'Go' } })`;
  const childrenRender = react
    ? `render(<${Name} label="fallback">Click me</${Name}>)`
    : framework === 'vue'
      ? `render(${Name}, { props: { label: 'fallback' }, slots: { default: () => 'Click me' } })`
      : null;
  const childrenTest = childrenRender
    ? `

  it('renders children over the label fallback', () => {
    const { getByRole } = ${childrenRender};
    expect(getByRole('button').textContent?.trim()).toBe('Click me');
  });`
    : '';
  const clickRender = react
    ? `render(<${Name} ${clickHandler}={${clickHandler}}>Go</${Name}>)`
    : `render(${Name}, { ${nativeOpt}: { ${clickHandler} } })`;
  const disabledRender = react
    ? `render(<${Name} disabled>Go</${Name}>)`
    : `render(${Name}, { ${nativeOpt}: { disabled: true } })`;
  const varsRender = react
    ? `render(<${Name} ${cv.prop.name}=${cv.jsxAttr} />)`
    : `render(${Name}, { props: { ${cv.prop.name}: ${cv.value} } })`;
  const awaitKw = react ? '' : 'await ';
  const asyncKw = react ? '' : 'async ';
  return `import { render, fireEvent } from '${lib}';
${importLine}

describe('${Name} (${framework})', () => {
  it('renders a <button> with the label prop as fallback text', () => {
    const { getByRole } = ${labelRender};
    const btn = getByRole('button');
    expect(btn.tagName).toBe('BUTTON');
    expect(btn.textContent?.trim()).toBe('Go');
  });${childrenTest}

  it('forwards a click handler', ${asyncKw}() => {
    const ${clickHandler} = vi.fn();
    const { getByRole } = ${clickRender};
    ${awaitKw}fireEvent.click(getByRole('button'));
    expect(${clickHandler}).toHaveBeenCalledTimes(1);
  });

  it('reflects the disabled attribute on the native button', () => {
    const { getByRole } = ${disabledRender};
    expect((getByRole('button') as HTMLButtonElement).disabled).toBe(true);
  });

  it('maps props to CSS custom properties', () => {
    const { getByRole } = ${varsRender};
    expect(getByRole('button').style.getPropertyValue('${cv.prop.cssVar.name}')).toBe(${cv.expected});
  });
});
`;
}

function reactTestBody(c) {
  const { Name, cls } = names(c);
  if (isContainer(c)) return containerTestBody(c, 'react');
  if (isInteractive(c)) return interactiveTestBody(c, 'react');
  const cv = sampleCssVar(c);
  const mapTest = cv
    ? `

  it('maps props to CSS custom properties', () => {
    const { container } = render(<${Name} text="Hi" ${cv.prop.name}=${cv.jsxAttr} />);
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
  if (isContainer(c)) return containerTestBody(c, framework);
  if (isInteractive(c)) return interactiveTestBody(c, framework);
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

/** The three framework preview slots on a demo page, per component kind. */
function demoPreviews(c) {
  const { Name } = names(c);
  const demo = attrs(c.demoProps);
  const fws = [
    ['react', 'React'],
    ['vue', 'Vue'],
    ['svelte', 'Svelte'],
  ];
  if (isContainer(c)) {
    // Cursor-tracking cards need hydration for the pointer behavior; self-running ones don't.
    const hydrate = c.hydrate ? ' client:visible' : '';
    return fws
      .map(
        ([fw, Pre]) => `      <div class={previewBox} slot="${fw}"><${Pre}${Name}${lead(
          demo,
        )}${hydrate}>
        <div class={cardBody}>
          <div class={cardTitle}>${c.cardText}</div>
          <p class={cardCopy}>${c.blurb}</p>
        </div>
      </${Pre}${Name}></div>`,
      )
      .join('\n');
  }
  if (isInteractive(c)) {
    return fws
      .map(
        ([fw, Pre]) =>
          `      <div class={previewBox} slot="${fw}"><${Pre}${Name}${lead(demo)} /></div>`,
      )
      .join('\n');
  }
  return fws
    .map(
      ([fw, Pre]) =>
        `      <div class="text-3xl font-semibold" slot="${fw}"><${Pre}${Name}${lead(demo)} /></div>`,
    )
    .join('\n');
}

/** Frontmatter style consts a demo page's previews reference, per component kind. */
function demoStyleConsts(c) {
  if (isContainer(c)) {
    return `const previewBox =
  'h-40 w-full rounded-[var(--radius-jolt)] border border-[color:var(--jolt-border)] bg-[var(--jolt-surface-sunken)] p-3';
const cardBody = 'space-y-2';
const cardTitle = 'text-lg font-semibold';
const cardCopy = 'text-sm text-[var(--jolt-text-muted)]';
`;
  }
  if (isInteractive(c)) {
    return `const previewBox = 'flex h-32 w-full items-center justify-center';
`;
  }
  return '';
}

export function emitDemoPage(c) {
  const { id, Name, camel } = names(c);
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
${demoStyleConsts(c)}---

<ComponentsLayout title="${Name} — Jolt UI">
  <Breadcrumbs id="${id}" />
  <h1 class="font-display text-3xl font-semibold tracking-tight">${Name}</h1>
  <p class="mt-2 text-[var(--jolt-text-muted)]">${c.blurb}</p>

  <div class="mt-8">
    <FrameworkSwitcher id="${id}">
${demoPreviews(c)}
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

/**
 * Declared prop fields for a hand-written type shim. An interactive component's `disabled`
 * reaches the native `<button>` through attribute fallthrough / rest, so it isn't a schema
 * prop — but `astro check` needs it declared to type `<Shimmer disabled />` (D-036).
 */
function shimFields(c) {
  const fields = c.props.map((p) => `  ${p.name}${p.required ? '' : '?'}: ${tsType(p)};`);
  if (isInteractive(c)) fields.push('  disabled?: boolean;');
  return fields.join('\n');
}

export function emitVueShim(c) {
  const { Name } = names(c);
  return `export declare const ${Name}: DefineComponent<{
${shimFields(c)}
}>;`;
}

export function emitSvelteShim(c) {
  const { Name } = names(c);
  return `export declare const ${Name}: (props: {
${shimFields(c)}
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

/**
 * The three parity-harness cells. CSS-only components need no client directive; a
 * cursor-tracking container does (`hydrate`), because its pointer behavior only writes the
 * deterministic rest state once hydrated. Containers slot the harness's shared `TEXT`
 * constant so the CONTAINER assert can compare identical child text across frameworks (D-037).
 */
export function emitParityCells(c) {
  const { id, Name } = names(c);
  const harness = attrs(c.harnessProps);
  const hydrate = c.hydrate ? ' client:load' : '';
  return ['react', 'vue', 'svelte']
    .map((fw) => {
      const prefix = fw[0].toUpperCase();
      const tag = `${prefix}${Name}`;
      const cell = isContainer(c)
        ? `<${tag}${lead(harness)}${hydrate}>{TEXT}</${tag}>`
        : `<${tag}${lead(harness)}${hydrate} />`;
      return `    <div data-testid="${id}-${fw}">${cell}</div>`;
    })
    .join('\n');
}

/**
 * The /components index card. A live `<button>` must not nest inside the card's `<a>`
 * (invalid HTML + a double tab stop), so an interactive component gets a `<div>` card with a
 * sibling "View →" link (D-036); a container renders a `<div>` root, so it keeps the normal
 * clickable `<a>` card (D-037).
 */
export function emitCard(c) {
  const { id, Name } = names(c);
  const href = `/components/${slug(c)}/${id}`;

  if (isInteractive(c)) {
    return `      <div class={buttonCard}>
        <div class={centerPreview}><${Name} label="${c.cardText}" /></div>
        <div class={name}>${c.cardText}</div>
        <div class={blurb}>${c.blurb}</div>
        <a href="${href}" class={viewLink}>View →</a>
      </div>`;
  }
  if (isContainer(c)) {
    const hydrate = c.hydrate ? ' client:visible' : '';
    return `      <a href="${href}" class={card}>
        <${Name}${hydrate}>
          <div class="text-sm font-semibold">${c.cardText}</div>
          <div class="text-xs text-[var(--jolt-text-subtle)]">${c.blurb}</div>
        </${Name}>
        <div class={name}>${c.cardText}</div>
        <div class={blurb}>${c.blurb}</div>
      </a>`;
  }
  return `    <a href="${href}" class={card}>
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
