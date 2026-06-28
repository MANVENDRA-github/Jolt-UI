import * as THREE from 'three';
import { particlesSchema, type ParticlesProps } from '../schemas/particles';
import { prefersReducedMotion } from '../motion';
import { generateField, advanceDrift } from './particles-field';

export interface ParticlesController {
  /** Stop the loop, dispose every GPU resource, and remove the canvas — call on unmount. */
  revert(): void;
}

/** Returned when there's nothing to render (SSR, or no WebGL) — a safe no-op. */
const NOOP: ParticlesController = { revert() {} };

/**
 * Render a drifting point field into `el` (a sized container). The entire
 * animation lives here in the shared core, so the React/Vue/Svelte skins — which
 * only mount `el` and call this — cannot drift in look or motion. WebGL is created
 * lazily and **never** on the server or in jsdom (the guards below bail before any
 * `WebGLRenderer`), so SSR and unit tests stay safe; the GL path is exercised only
 * by the Playwright parity harness in a real browser.
 */
export function createParticles(el: HTMLElement, props: ParticlesProps): ParticlesController {
  const opts = particlesSchema.parse(props);

  // SSR: nothing to render on the server.
  if (typeof window === 'undefined') return NOOP;

  // No WebGL (jsdom, unsupported browsers): bail before constructing a renderer,
  // which throws on a null GL context.
  const probe = document.createElement('canvas');
  if (!(probe.getContext('webgl2') ?? probe.getContext('webgl'))) return NOOP;

  const width = el.clientWidth || 1;
  const height = el.clientHeight || 1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.z = opts.spread * 1.6;

  const positions = generateField(opts.count, opts.spread);
  const positionAttr = new THREE.BufferAttribute(positions, 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', positionAttr);

  const material = new THREE.PointsMaterial({
    color: new THREE.Color(opts.color),
    size: opts.size,
    sizeAttenuation: false,
    transparent: true,
    opacity: opts.opacity,
    depthWrite: false,
  });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0); // transparent — the page shows through behind the points
  const canvas = renderer.domElement;
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  el.appendChild(canvas);

  const render = () => renderer.render(scene, camera);

  let raf = 0;
  let observer: ResizeObserver | null = null;
  const disposeAll = () => {
    if (raf) cancelAnimationFrame(raf);
    observer?.disconnect();
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.forceContextLoss(); // drop the GL context so the browser reclaims it immediately
    canvas.remove();
  };

  // Reduced motion: render one static frame, no loop.
  if (prefersReducedMotion()) {
    render();
    return { revert: disposeAll };
  }

  let last = 0;
  const tick = (now: number) => {
    const dt = last ? (now - last) / 1000 : 0;
    last = now;
    advanceDrift(positions, dt, opts.speed, opts.spread);
    positionAttr.needsUpdate = true;
    points.rotation.y += dt * 0.05; // a slow parallax drift
    render();
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  observer = new ResizeObserver(() => {
    const w = el.clientWidth || 1;
    const h = el.clientHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  observer.observe(el);

  return { revert: disposeAll };
}
