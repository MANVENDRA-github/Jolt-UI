<script lang="ts">
  import { onMount } from 'svelte';
  import type { GlobeProps } from '@jolt/core';
  import { createGlobe } from '@jolt/core/webgl/globe';

  let { color, count, size, radius, speed, amplitude, frequency, opacity }: GlobeProps = $props();
  let root: HTMLDivElement;

  onMount(() => {
    const controller = createGlobe(root, {
      color,
      count,
      size,
      radius,
      speed,
      amplitude,
      frequency,
      opacity,
    });
    return () => controller.revert();
  });
</script>

<div bind:this={root} aria-hidden="true" class="h-full w-full"></div>
