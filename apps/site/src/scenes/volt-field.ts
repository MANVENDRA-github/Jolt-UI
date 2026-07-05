import * as THREE from 'three';
import { packColorStops } from '@jolt/core/webgl/aurora-field';
import { prefersReducedMotion } from '@jolt/core';
import { filamentOffsets, normalizePointer, type DOMRectLike } from './volt-field-uniforms';

/**
 * The landing page's signature scene: one electric current that bends toward the
 * pointer and splits into three synchronized filaments as the scroll story drives
 * `setSplit` 0 → 1. Site-local on purpose — everything under `packages/core/src/webgl/`
 * ships to registry consumers via the webgl-core item, and this scene is not a
 * distributable component. The skeleton (guards, static reduced-motion frame, full
 * GPU disposal) follows @jolt/core's aurora factory (D-030, D-033).
 */
export interface VoltFieldScene {
  /** 0 = one merged current, 1 = three parted filaments. Scrubbed by the scroll story. */
  setSplit(progress: number): void;
  /** Pointer position in client coordinates; the filaments bend toward it with inertia. */
  setPointer(clientX: number, clientY: number): void;
  /** Stop/start the RAF loop (offscreen or hidden-tab). Uniform updates still apply. */
  setPaused(paused: boolean): void;
  /** Stop the loop, dispose every GPU resource, and remove the canvas — call on teardown. */
  revert(): void;
}

export interface VoltFieldOptions {
  /** Exactly three hex stops: [glow, filament core, spark node]. */
  colors?: readonly [string, string, string];
  /** Overall energy multiplier. */
  intensity?: number;
}

const NOOP: VoltFieldScene = {
  setSplit() {},
  setPointer() {},
  setPaused() {},
  revert() {},
};

const DEFAULT_COLORS = ['#7c5cff', '#efeaff', '#c6ff4f'] as const;

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Three neon filaments drawn as inverse-distance glows around wobbling centerlines.
// uOffsets carries the CPU-eased split offsets (filamentOffsets); uPointer bends the
// lines toward the cursor inside a gaussian window; a spark node travels each line —
// the same motif as the parity rails' traveling spark.
const FRAGMENT = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uSplit;
  uniform vec3 uOffsets;
  uniform vec2 uPointer;
  uniform float uPointerEnergy;
  uniform vec3 uColors[3];
  uniform float uIntensity;
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
    vec2 uv = vUv;
    float t = uTime * 0.55;

    // Pointer in uv space (uPointer is [-1,1], y down in screen space).
    vec2 p = vec2(uPointer.x * 0.5 + 0.5, 0.5 - uPointer.y * 0.5);
    float bendWindow = exp(-pow((uv.x - p.x) * 2.6, 2.0));

    vec3 col = vec3(0.0);
    float energy = 0.0;

    for (int i = 0; i < 3; i++) {
      float off = uOffsets[i];
      float phase = float(i) * 2.39996; // golden-angle phases keep the wobbles unsynced

      // The merged current churns harder; parted filaments run calmer.
      float churn = mix(1.5, 0.9, uSplit);
      float wob = (fbm(vec2(uv.x * 2.4 + t + phase, t * 0.8 + phase * 1.7)) - 0.5) * 0.075 * churn;
      float bend = (p.y - 0.5) * 0.2 * bendWindow * uPointerEnergy;

      // The current rides a diagonal band — low on the left (clear of the left-aligned
      // copy), rising toward the open right half of the composition.
      float center = 0.30 + (uv.x - 0.5) * 0.22 + off + wob + bend;
      float d = abs(uv.y - center);

      float core = 0.0032 / max(d, 0.0009);
      float glow = 0.0125 / max(d, 0.0045);
      float pulse = 0.78 + 0.22 * sin(uv.x * 22.0 - t * 5.5 + phase * 3.0);
      float line = (core * 0.85 + glow * 0.32) * pulse;

      // Neon: volt glow with a hot filament-white core.
      col += uColors[0] * line + uColors[1] * core * 0.55;
      energy += line;

      // The traveling spark node.
      float sparkX = fract(t * 0.21 + float(i) * 0.333);
      float sd = length(vec2((uv.x - sparkX) * aspect, uv.y - center));
      float spark = 0.0045 / max(sd, 0.0016);
      col += uColors[2] * spark * 0.45;
      energy += spark * 0.28;
    }

    // Soft-clip the accumulated energy and vignette the top/bottom so overlaid copy stays legible.
    col = vec3(1.0) - exp(-col * 0.9);
    float vfade = smoothstep(0.0, 0.12, uv.y) * smoothstep(1.0, 0.88, uv.y);
    float a = clamp(energy * 0.5, 0.0, 1.0) * vfade * uIntensity;
    gl_FragColor = vec4(col, a);
  }
`;

export function createVoltField(el: HTMLElement, opts: VoltFieldOptions = {}): VoltFieldScene {
  const colors = opts.colors ?? DEFAULT_COLORS;
  const intensity = opts.intensity ?? 1;

  if (typeof window === 'undefined') return NOOP;
  const probe = document.createElement('canvas');
  if (!(probe.getContext('webgl2') ?? probe.getContext('webgl'))) return NOOP;

  const width = el.clientWidth || 1;
  const height = el.clientHeight || 1;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;

  const packed = packColorStops([...colors], 3);
  const uColors = [0, 1, 2].map(
    (i) => new THREE.Vector3(packed[i * 3], packed[i * 3 + 1], packed[i * 3 + 2]),
  );

  const reduced = prefersReducedMotion();
  // Reduced motion shows the story's end state: three parted filaments, one frame.
  const initialSplit = reduced ? 1 : 0;
  const [lo, mid, hi] = filamentOffsets(initialSplit);

  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uSplit: { value: initialSplit },
      uOffsets: { value: new THREE.Vector3(lo, mid, hi) },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerEnergy: { value: 0 },
      uColors: { value: uColors },
      // The static reduced-motion frame runs calmer so the parted filaments never
      // compete with the copy they sit behind.
      uIntensity: { value: intensity * (reduced ? 0.7 : 1) },
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
  let disposed = false;
  const disposeAll = () => {
    if (disposed) return;
    disposed = true;
    canvas.removeEventListener('webglcontextlost', onContextLost);
    if (raf) cancelAnimationFrame(raf);
    observer?.disconnect();
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };
  // A lost context can't be trusted to come back — dispose and leave the CSS
  // gradient behind the canvas as the visual (fail visibly, degrade gracefully).
  const onContextLost = () => disposeAll();
  canvas.addEventListener('webglcontextlost', onContextLost);

  const markReady = () => {
    canvas.dataset.ready = '';
  };

  if (reduced) {
    update(0);
    markReady();
    return {
      setSplit() {},
      setPointer() {},
      setPaused() {},
      revert: disposeAll,
    };
  }

  // Pointer with inertia: setPointer stores the target; the tick lerps toward it.
  // uPointerEnergy eases 0 → 1 on first pointer contact so the bend fades in.
  let targetX = 0;
  let targetY = 0;
  let pointerSeen = false;
  let paused = false;
  let start = 0;
  let lastT = 0;

  const tick = (now: number) => {
    if (disposed || paused) return;
    // Anchor `start` so scene time resumes where it froze — no jump after a pause.
    if (!start) start = now - lastT * 1000;

    const u = material.uniforms;
    const pointer = u.uPointer.value as THREE.Vector2;
    pointer.x += (targetX - pointer.x) * 0.06;
    pointer.y += (targetY - pointer.y) * 0.06;
    const targetEnergy = pointerSeen ? 1 : 0;
    u.uPointerEnergy.value += (targetEnergy - (u.uPointerEnergy.value as number)) * 0.04;

    lastT = (now - start) / 1000;
    update(lastT);
    if (!('ready' in canvas.dataset)) markReady();
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

  return {
    setSplit(progress) {
      if (disposed) return;
      const clamped = Math.min(1, Math.max(0, progress));
      const [a, b, c] = filamentOffsets(clamped);
      material.uniforms.uSplit.value = clamped;
      (material.uniforms.uOffsets.value as THREE.Vector3).set(a, b, c);
    },
    setPointer(clientX, clientY) {
      if (disposed) return;
      const rect: DOMRectLike = el.getBoundingClientRect();
      const { x, y } = normalizePointer(clientX, clientY, rect);
      targetX = x;
      targetY = y;
      pointerSeen = true;
    },
    setPaused(next) {
      if (disposed || paused === next) return;
      paused = next;
      if (paused) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else {
        start = 0; // re-anchor to `lastT` on the next frame
        raf = requestAnimationFrame(tick);
      }
    },
    revert: disposeAll,
  };
}
