import * as THREE from 'three';
import { auroraSchema, type AuroraProps } from '../schemas/aurora';
import { prefersReducedMotion } from '../motion';
import { packColorStops } from './aurora-field';

export interface AuroraController {
  /** Stop the loop, dispose every GPU resource, and remove the canvas — call on unmount. */
  revert(): void;
}

const NOOP: AuroraController = { revert() {} };

// A `ShaderMaterial` (not Raw) — three injects the precision qualifier and the built-in
// attributes/uniforms (position, uv, projectionMatrix, modelViewMatrix), so we declare only
// our own varying + uniforms.
const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Flowing aurora curtains: layered value-noise (fbm) over uv, scrolled by uTime, with a
// vertical glow falloff and a colour ramp across the three stops. Alpha falls to ~0 in the
// gaps so the curtains blend over the (transparent) page background.
const FRAGMENT = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColors[3];
  uniform float uSpeed;
  uniform float uIntensity;
  uniform float uScale;
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
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 uv = vUv;
    float t = uTime * uSpeed;

    // Vertical aurora curtains that sway horizontally and scroll upward over time.
    vec2 q = vec2(uv.x * aspect, uv.y) * uScale;
    float sway = (fbm(vec2(uv.y * 1.5, t * 0.6)) - 0.5) * 1.5;
    float curtain = fbm(vec2(q.x * 3.0 + sway, q.y * 1.2 - t * 1.2));
    float detail = fbm(vec2(q.x * 7.0 - t * 0.8, q.y * 2.0 + t * 0.4));
    float density = pow(clamp(curtain * 0.8 + detail * 0.4 - 0.1, 0.0, 1.0), 1.8);

    // Glow vertically: brightest in the lower-mid, fading toward the top and very bottom.
    float vfall = smoothstep(1.0, 0.15, uv.y) * smoothstep(0.0, 0.25, uv.y);
    density *= vfall * 1.8;

    float ramp = clamp(curtain + 0.35 * sin(t + uv.y * 4.0), 0.0, 1.0);
    vec3 col = mix(uColors[0], uColors[1], smoothstep(0.0, 0.55, ramp));
    col = mix(col, uColors[2], smoothstep(0.45, 1.0, ramp));

    float a = clamp(density, 0.0, 1.0) * uIntensity * uOpacity;
    gl_FragColor = vec4(col * (0.7 + 0.6 * density), a);
  }
`;

/**
 * Render a flowing aurora light-curtain into `el` (a sized container) with a Three.js custom
 * `ShaderMaterial` on a fullscreen quad — the whole animation lives in the fragment shader
 * (driven by the `uTime` uniform), so the React/Vue/Svelte skins, which only mount `el` and
 * call this, cannot drift. WebGL is created lazily and never on the server or in jsdom (the
 * guards below bail before any `WebGLRenderer`); the GLSL is exercised only by the Playwright
 * parity harness + live verification. See D-030, D-033.
 */
export function createAurora(el: HTMLElement, props: AuroraProps): AuroraController {
  const opts = auroraSchema.parse(props);

  if (typeof window === 'undefined') return NOOP;
  const probe = document.createElement('canvas');
  if (!(probe.getContext('webgl2') ?? probe.getContext('webgl'))) return NOOP;

  const width = el.clientWidth || 1;
  const height = el.clientHeight || 1;

  const scene = new THREE.Scene();
  // A fullscreen quad in clip space — the fragment shader does all the work.
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
      uIntensity: { value: opts.intensity },
      uScale: { value: opts.scale },
      uOpacity: { value: opts.opacity },
      uResolution: { value: new THREE.Vector2(width, height) },
    },
  });
  const geometry = new THREE.PlaneGeometry(2, 2);
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
