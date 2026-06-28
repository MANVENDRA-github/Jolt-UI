// Pure string -> string edits that splice a generated component into the central
// registration files at anchor-comment markers. Every marker sits on its own line;
// the block is inserted on the line(s) immediately before it. Insertion asserts the
// marker occurs exactly once (fail visible if a marker was hand-removed). The shell
// runs `containsComponent` over every target first (all-or-nothing collision precheck),
// so these never double-insert in practice.

import * as emit from './emit.mjs';

/**
 * Insert `block` immediately before the line containing `marker`.
 * @param {string} src
 * @param {string} marker  an anchor that must appear exactly once.
 * @param {string} block   text to insert (carries its own indentation).
 * @returns {string}
 */
export function insertBeforeMarker(src, marker, block) {
  const idx = src.indexOf(marker);
  if (idx === -1) throw new Error(`gen-component: marker not found: ${marker}`);
  if (src.indexOf(marker, idx + marker.length) !== -1) {
    throw new Error(`gen-component: marker appears more than once: ${marker}`);
  }
  const lineStart = src.lastIndexOf('\n', idx) + 1;
  return `${src.slice(0, lineStart)}${block}\n${src.slice(lineStart)}`;
}

const FRAMEWORKS = ['react', 'vue', 'svelte'];

// --- per-file apply functions (each: (content, contract) -> content) ----------

export function applyCoreIndex(src, c) {
  return insertBeforeMarker(src, '// gen:exports', emit.emitCoreExports(c));
}

export function applyPackageIndex(src, c) {
  return insertBeforeMarker(src, '// gen:exports', emit.emitPackageExport(c));
}

export function applyVueShim(src, c) {
  return insertBeforeMarker(src, '// gen:shims', emit.emitVueShim(c));
}

export function applySvelteShim(src, c) {
  return insertBeforeMarker(src, '// gen:shims', emit.emitSvelteShim(c));
}

export function applyJsrepoConfig(src, c) {
  let out = src;
  for (const fw of FRAMEWORKS) {
    out = insertBeforeMarker(out, `// gen:${fw}-items`, emit.emitJsrepoItem(c, fw));
  }
  return out;
}

export function applyParityHarness(src, c) {
  let out = src;
  for (const fw of FRAMEWORKS) {
    out = insertBeforeMarker(out, `// gen:${fw}`, emit.emitParityImport(c, fw));
  }
  return insertBeforeMarker(out, '{/* gen:cells */}', emit.emitParityCells(c));
}

export function applyParitySpec(src, c) {
  const marker = c.parity.kind === 'per-char' ? '// gen:per-char' : '// gen:whole-text';
  let out = insertBeforeMarker(src, marker, `  '${c.id}',`);
  if (!c.parity.pixelParity) out = insertBeforeMarker(out, '// gen:no-pixel', `  '${c.id}',`);
  return out;
}

export function applyCliSmoke(src, c) {
  let out = insertBeforeMarker(src, '// gen:add', `  '${c.id}',`);
  // CSS components assert the skin file + its bundled stylesheet land.
  return insertBeforeMarker(out, '// gen:css', `  ['${c.name}.tsx', '${c.id}.css'],`);
}

export function applyComponentsIndex(src, c) {
  let out = insertBeforeMarker(src, '// gen:card-import', `  ${c.name},`);
  return insertBeforeMarker(out, '{/* gen:card */}', emit.emitCard(c));
}

/**
 * True if `content` already references this component — the per-file collision
 * check the shell runs across every edit target before writing anything.
 * @param {string} content
 * @param {{ id: string, name: string }} c
 */
export function containsComponent(content, c) {
  return (
    content.includes(`'${c.id}'`) || // jsrepo item / parity-spec / cli-smoke add
    content.includes(`"${c.id}-react"`) || // parity harness cell
    content.includes(`/components/text/${c.id}`) || // components index card
    content.includes(`./schemas/${c.id}`) || // core barrel export
    content.includes(`./components/${c.name}`) || // package barrel export
    content.includes(`${c.name}:`) // vue/svelte shim declaration
  );
}
