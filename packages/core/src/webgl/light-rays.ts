import * as THREE from 'three';
import { lightRaysSchema, type LightRaysProps } from '../schemas/light-rays';
import { prefersReducedMotion } from '../motion';
import { packColorStops } from './uniforms';

export interface LightRaysController {
  /** Stop the loop, dispose every GPU resource, and remove the canvas — call on unmount. */
  revert(): void;
}

const NOOP: LightRaysController = { revert() {} };

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// God-rays from a point on the top edge. Everything is polar: the ray pattern is a function of
// the ANGLE from the source (so rays stay straight no matter the aspect), while brightness is a
// function of DISTANCE (an exponential falloff). Noise on the angle makes the fan flicker and
// keeps the rays from reading as a perfectly regular star. Alpha, not black, carries the
// falloff — the canvas is transparent, so the rays blend over whatever is behind them.
const FRAGMENT = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColors[2];
  uniform float uSpeed;
  uniform float uCount;
  uniform float uSpread;
  uniform float uFalloff;
  uniform float uOrigin;
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

    // Source on the top edge; y grows downward from it.
    vec2 p = vec2((vUv.x - uOrigin) * aspect, 1.0 - vUv.y);
    float dist = length(p);
    float angle = atan(p.x, max(p.y, 0.0001));

    float flicker = fbm(vec2(angle * 4.0, t)) * 1.6;
    float rays = 0.5 + 0.5 * sin(angle * uCount + flicker);
    rays = pow(rays, uSpread);

    // Exponential falloff, plus a bright core right at the source.
    float falloff = exp(-dist * uFalloff);
    float core = exp(-dist * 9.0) * 0.7;

    float a = clamp(rays * falloff + core, 0.0, 1.0) * uOpacity;
    vec3 col = mix(uColors[0], uColors[1], clamp(rays + core, 0.0, 1.0));

    gl_FragColor = vec4(col, a);
  }
`;

/**
 * Render volumetric god-rays into `el` (a sized container) with a Three.js custom
 * `ShaderMaterial` on a fullscreen quad — the whole animation lives in the fragment shader, so
 * the three skins, which only mount `el` and call this, cannot drift. WebGL is created lazily
 * and never on the server or in jsdom. See D-030, D-033.
 */
export function createLightRays(el: HTMLElement, props: LightRaysProps): LightRaysController {
  const opts = lightRaysSchema.parse(props);

  if (typeof window === 'undefined') return NOOP;
  const probe = document.createElement('canvas');
  if (!(probe.getContext('webgl2') ?? probe.getContext('webgl'))) return NOOP;

  const width = el.clientWidth || 1;
  const height = el.clientHeight || 1;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;

  // Two stops here, not three: a ray has a dim edge and a bright core, nothing between.
  const packed = packColorStops(opts.colors, 2);
  const uColors = [0, 1].map(
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
      uCount: { value: opts.count },
      uSpread: { value: opts.spread },
      uFalloff: { value: opts.falloff },
      uOrigin: { value: opts.origin },
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
