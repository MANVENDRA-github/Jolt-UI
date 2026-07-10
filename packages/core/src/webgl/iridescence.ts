import * as THREE from 'three';
import { iridescenceSchema, type IridescenceProps } from '../schemas/iridescence';
import { prefersReducedMotion } from '../motion';
import { packColorStops } from './uniforms';

export interface IridescenceController {
  /** Stop the loop, dispose every GPU resource, and remove the canvas — call on unmount. */
  revert(): void;
}

const NOOP: IridescenceController = { revert() {} };

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// A thin-film sheen: concentric interference rings (sin of radial distance) drifting outward,
// their phase perturbed by fbm so the film ripples rather than pulsing as perfect circles. The
// phase then indexes a cyclic 3-stop ramp — the mix back to stop 0 at the top of the cycle is
// what keeps the film from snapping when the phase wraps.
const FRAGMENT = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColors[3];
  uniform float uSpeed;
  uniform float uScale;
  uniform float uAmplitude;
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
    float d = length(p);

    float ripple = sin(d * 9.0 - t * 2.0) * 0.5 + 0.5;
    float n = fbm(p * 1.7 + t * 0.25);
    float phase = fract(ripple * uAmplitude * 0.5 + n * 0.7 + t * 0.08);

    vec3 col = mix(uColors[0], uColors[1], smoothstep(0.0, 0.5, phase));
    col = mix(col, uColors[2], smoothstep(0.45, 0.9, phase));
    // Close the loop: fade back to the first stop as the phase wraps, so there is no seam.
    col = mix(col, uColors[0], smoothstep(0.88, 1.0, phase));

    // A soft specular lift where the rings crowd together — the "oil slick" highlight.
    float spec = pow(ripple, 6.0) * 0.35;

    gl_FragColor = vec4(col + spec, uOpacity);
  }
`;

/**
 * Render a shifting thin-film sheen into `el` (a sized container) with a Three.js custom
 * `ShaderMaterial` on a fullscreen quad — the whole animation lives in the fragment shader, so
 * the three skins, which only mount `el` and call this, cannot drift. WebGL is created lazily
 * and never on the server or in jsdom. See D-030, D-033.
 */
export function createIridescence(el: HTMLElement, props: IridescenceProps): IridescenceController {
  const opts = iridescenceSchema.parse(props);

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
      uAmplitude: { value: opts.amplitude },
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
