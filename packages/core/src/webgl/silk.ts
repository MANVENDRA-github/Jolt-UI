import * as THREE from 'three';
import { silkSchema, type SilkProps } from '../schemas/silk';
import { prefersReducedMotion } from '../motion';
import { degreesToRadians, packColorStops } from './uniforms';

export interface SilkController {
  /** Stop the loop, dispose every GPU resource, and remove the canvas — call on unmount. */
  revert(): void;
}

const NOOP: SilkController = { revert() {} };

// A `ShaderMaterial` (not Raw) — three injects the precision qualifier and the built-in
// attributes/uniforms, so we declare only our own varying + uniforms.
const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Folds of silk: a rotated stripe field whose phase is warped by fbm, so the stripes bend and
// gather like fabric. The sheen is `sin(phase)` sharpened by pow(), which pinches the highlight
// into a narrow band along each fold; the colour ramp runs deepest-fold → mid → sheen.
const FRAGMENT = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColors[3];
  uniform float uSpeed;
  uniform float uScale;
  uniform float uRotation;
  uniform float uNoise;
  uniform float uOpacity;
  uniform vec2 uResolution;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    float t = uTime * uSpeed;

    vec2 p = (vUv - 0.5) * vec2(aspect, 1.0) * uScale;
    float c = cos(uRotation);
    float s = sin(uRotation);
    p = mat2(c, -s, s, c) * p;

    // Warp the stripe phase with slow noise — this is what turns straight lines into fabric.
    float warp = (fbm(p * 1.6 + vec2(t * 0.35, t * 0.18)) - 0.5) * 2.0 * uNoise;
    float phase = (p.y + warp) * 9.0 + t * 1.2;

    float sheen = 0.5 + 0.5 * sin(phase);
    sheen = pow(sheen, 2.6);
    float depth = 0.5 + 0.5 * sin(phase * 0.5 - t * 0.4);

    vec3 col = mix(uColors[0], uColors[1], smoothstep(0.0, 0.85, depth));
    col = mix(col, uColors[2], sheen * 0.85);

    gl_FragColor = vec4(col, uOpacity);
  }
`;

/**
 * Render softly rippling folds of silk into `el` (a sized container) with a Three.js custom
 * `ShaderMaterial` on a fullscreen quad — the whole animation lives in the fragment shader
 * (driven by the `uTime` uniform), so the React/Vue/Svelte skins, which only mount `el` and call
 * this, cannot drift. WebGL is created lazily and never on the server or in jsdom (the guards
 * below bail before any `WebGLRenderer`); the GLSL is exercised only by the Playwright parity
 * harness + live verification. See D-030, D-033.
 */
export function createSilk(el: HTMLElement, props: SilkProps): SilkController {
  const opts = silkSchema.parse(props);

  if (typeof window === 'undefined') return NOOP;
  const probe = document.createElement('canvas');
  if (!(probe.getContext('webgl2') ?? probe.getContext('webgl'))) return NOOP;

  const width = el.clientWidth || 1;
  const height = el.clientHeight || 1;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;

  const packed = packColorStops(opts.colors, 3);
  const uColors = [0, 1, 2].map(
    (i) => new THREE.Vector3(packed[i * 3], packed[i * 3 + 1], packed[i * 3 + 2]),
  );

  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uColors: { value: uColors },
      uSpeed: { value: opts.speed },
      uScale: { value: opts.scale },
      uRotation: { value: degreesToRadians(opts.rotation) },
      uNoise: { value: opts.noise },
      uOpacity: { value: opts.opacity },
      uResolution: { value: new THREE.Vector2(width, height) },
    },
  });
  const geometry = new THREE.PlaneGeometry(2, 2);
  scene.add(new THREE.Mesh(geometry, material));

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.style.cssText = 'display:block;width:100%;height:100%';
  el.appendChild(canvas);

  const update = (t: number) => {
    material.uniforms.uTime.value = t;
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
    renderer.setSize(w, h);
    (material.uniforms.uResolution.value as THREE.Vector2).set(w, h);
  });
  observer.observe(el);

  return { revert: disposeAll };
}
