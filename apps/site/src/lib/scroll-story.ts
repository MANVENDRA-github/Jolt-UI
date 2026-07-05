import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { VoltFieldScene } from '../scenes/volt-field';
import { activeBeat, splitProgress } from './scroll-story-math';
import { getLenis } from './smooth-scroll';

// Registered at module scope but the module itself is only imported client-side in
// motion mode (dynamic import behind the media-query gate), matching the house rule
// that ScrollTrigger never registers during SSR/jsdom (D-018/D-019).
gsap.registerPlugin(ScrollTrigger);

/**
 * The landing's scroll orchestration: one scrub over the scene track drives the
 * volt-field's split and the story-beat emphasis; the hero headline gets a one-shot
 * per-char entrance. Everything here is an *enhancement* — beats dim to 0.35, never
 * hide, and the server HTML is untouched apart from transient char spans.
 * Returns a full teardown.
 */
export function initScrollStory(track: HTMLElement, scene: VoltFieldScene | null): () => void {
  const teardowns: Array<() => void> = [];

  // Bridge Lenis and ScrollTrigger when smooth scrolling is active. Lenis keeps its
  // own rAF (autoRaf) and animates the real scroll position; ScrollTrigger just needs
  // an update ping per emitted scroll. (Driving lenis.raf from gsap.ticker as well
  // would mix two time epochs — deliberately avoided.)
  const lenis = getLenis();
  if (lenis) {
    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);
    gsap.ticker.lagSmoothing(0);
    teardowns.push(() => {
      lenis.off('scroll', onScroll);
    });
  }

  // Hero portion of the track = the hero's share of the total scrollable story.
  const hero = track.querySelector<HTMLElement>('#hero');
  const heroPortion = hero
    ? Math.min(0.9, hero.offsetHeight / Math.max(track.offsetHeight, 1))
    : 1 / 3;

  const beats = Array.from(track.querySelectorAll<HTMLElement>('[data-beat]'));
  // Arming lets the CSS de-emphasize inactive beats (0.35) — without it (no JS or
  // reduced motion) every beat stays at full opacity.
  const story = track.querySelector<HTMLElement>('#split-story');
  story?.setAttribute('data-story-armed', '');
  teardowns.push(() => story?.removeAttribute('data-story-armed'));

  const trigger = ScrollTrigger.create({
    trigger: track,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate(self) {
      scene?.setSplit(splitProgress(self.progress, heroPortion));
      const active = activeBeat(self.progress, heroPortion);
      for (const beat of beats) {
        if (beat.dataset.beat === String(active)) beat.dataset.active = '';
        else delete beat.dataset.active;
      }
    },
  });
  teardowns.push(() => trigger.kill());

  // Per-char hero entrance. The chars are wrapped client-side only (view-source and
  // reduced-motion keep the intact server string) and unwrapped on teardown.
  const headline = track.querySelector<HTMLElement>('[data-split-chars]');
  if (headline) teardowns.push(splitCharsEntrance(headline));

  return () => {
    for (const fn of teardowns.splice(0)) fn();
  };
}

/** Wrap each text character in an inline-block span and stagger them in. */
function splitCharsEntrance(el: HTMLElement): () => void {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text);

  const chars: HTMLElement[] = [];
  for (const node of textNodes) {
    const frag = document.createDocumentFragment();
    for (const ch of node.textContent ?? '') {
      if (ch.trim() === '') {
        frag.append(ch);
        continue;
      }
      const span = document.createElement('span');
      span.textContent = ch;
      span.style.display = 'inline-block';
      span.style.willChange = 'transform, opacity';
      frag.append(span);
      chars.push(span);
    }
    node.replaceWith(frag);
  }

  const tween = gsap.fromTo(
    chars,
    { yPercent: 60, opacity: 0 },
    {
      yPercent: 0,
      opacity: 1,
      duration: 0.7,
      ease: 'power3.out', // approximates --ease-jolt-out
      stagger: 0.028,
      onComplete() {
        for (const span of chars) span.style.willChange = 'auto';
      },
    },
  );

  return () => {
    tween.kill();
    // Restore the intact text so a torn-down page leaves no span litter.
    el.normalize();
    for (const span of chars) span.replaceWith(span.textContent ?? '');
    el.normalize();
  };
}
