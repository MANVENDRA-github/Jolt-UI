import * as THREE from 'three';
import { wavesSchema, type WavesProps } from '../schemas/waves';
import { prefersReducedMotion } from '../motion';
import { applyWaves } from './waves-field';

export interface WavesController {
  /** Stop the loop, dispose every GPU resource, and remove the canvas — call on unmount. */
  revert(): void;
}

const NOOP: WavesController = { revert() {} };

const PLANE_SIZE = 32;

/**
 * Render an undulating wireframe plane into `el` (a sized container). The whole
 * animation lives here in the shared core, so the React/Vue/Svelte skins — which only
 * mount `el` and call this — cannot drift. WebGL is created lazily and never on the
 * server or in jsdom (the guards below bail before any `WebGLRenderer`); the GL path is
 * exercised only by the Playwright parity harness. See D-030.
 */
export function createWaves(el: HTMLElement, props: WavesProps): WavesController {
  const opts = wavesSchema.parse(props);

  if (typeof window === 'undefined') return NOOP;
  const probe = document.createElement('canvas');
  if (!(probe.getContext('webgl2') ?? probe.getContext('webgl'))) return NOOP;

  const width = el.clientWidth || 1;
  const height = el.clientHeight || 1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(0, -20, 14);
  camera.lookAt(0, 0, 0);

  const geometry = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE, opts.density, opts.density);
  const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
  const positions = positionAttr.array as Float32Array;

  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(opts.color),
    wireframe: true,
    transparent: true,
    opacity: opts.opacity,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.style.cssText = 'display:block;width:100%;height:100%';
  el.appendChild(canvas);

  const update = (t: number) => {
    applyWaves(positions, t, opts);
    positionAttr.needsUpdate = true;
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
