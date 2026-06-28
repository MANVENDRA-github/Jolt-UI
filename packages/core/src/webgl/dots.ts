import * as THREE from 'three';
import { dotsSchema, type DotsProps } from '../schemas/dots';
import { prefersReducedMotion } from '../motion';
import { generateGrid, applyRipple } from './dots-field';

export interface DotsController {
  /** Stop the loop, dispose every GPU resource, and remove the canvas — call on unmount. */
  revert(): void;
}

const NOOP: DotsController = { revert() {} };

const SPACING = 0.7;

/**
 * Render a grid of points rippling outward from the center into `el` (a sized
 * container). The whole animation lives here in the shared core, so the skins — which
 * only mount `el` and call this — cannot drift. WebGL is created lazily and never on the
 * server or in jsdom (the guards below bail before any `WebGLRenderer`). See D-030.
 */
export function createDots(el: HTMLElement, props: DotsProps): DotsController {
  const opts = dotsSchema.parse(props);

  if (typeof window === 'undefined') return NOOP;
  const probe = document.createElement('canvas');
  if (!(probe.getContext('webgl2') ?? probe.getContext('webgl'))) return NOOP;

  const width = el.clientWidth || 1;
  const height = el.clientHeight || 1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(0, -16, 13);
  camera.lookAt(0, 0, 0);

  const positions = generateGrid(opts.count, SPACING);
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
    applyRipple(positions, t, opts);
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
