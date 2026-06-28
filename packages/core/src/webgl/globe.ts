import * as THREE from 'three';
import { globeSchema, type GlobeProps } from '../schemas/globe';
import { prefersReducedMotion } from '../motion';
import { generateSphere, applyPulse } from './globe-field';

export interface GlobeController {
  /** Stop the loop, dispose every GPU resource, and remove the canvas — call on unmount. */
  revert(): void;
}

const NOOP: GlobeController = { revert() {} };

/**
 * Render a slowly rotating sphere of points (with a gentle breathing pulse) into `el` (a
 * sized container). The whole animation lives here in the shared core, so the React/Vue/
 * Svelte skins — which only mount `el` and call this — cannot drift. WebGL is created
 * lazily and never on the server or in jsdom (the guards below bail before any
 * `WebGLRenderer`); the GL path is exercised only by the Playwright parity harness. See D-030.
 */
export function createGlobe(el: HTMLElement, props: GlobeProps): GlobeController {
  const opts = globeSchema.parse(props);

  if (typeof window === 'undefined') return NOOP;
  const probe = document.createElement('canvas');
  if (!(probe.getContext('webgl2') ?? probe.getContext('webgl'))) return NOOP;

  const width = el.clientWidth || 1;
  const height = el.clientHeight || 1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(0, 0, opts.radius * 2.8);
  camera.lookAt(0, 0, 0);

  // `base` is the rest-state sphere (never mutated); `positions` is the live buffer the
  // breathing pulse writes each frame, so the pulse can't accumulate.
  const base = generateSphere(opts.count, opts.radius);
  const positions = new Float32Array(base);
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
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.style.cssText = 'display:block;width:100%;height:100%';
  el.appendChild(canvas);

  const update = (t: number) => {
    applyPulse(positions, base, t, opts);
    positionAttr.needsUpdate = true;
    points.rotation.y = t * opts.speed;
    renderer.render(scene, camera);
  };

  let raf = 0;
  let observer: ResizeObserver | null = null;
  const disposeAll = () => {
    if (raf) cancelAnimationFrame(raf);
    observer?.disconnect();
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };

  if (prefersReducedMotion()) {
    update(0);
    return { revert: disposeAll };
  }

  let start = 0;
  const tick = (now: number) => {
    if (!start) start = now;
    update((now - start) / 1000);
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
