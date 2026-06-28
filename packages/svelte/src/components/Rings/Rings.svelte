<script lang="ts">
  import { onMount } from 'svelte';
  import type { RingsProps } from '@jolt/core';
  import { createRings } from '@jolt/core/webgl/rings';

  let {
    color,
    ringCount,
    pointsPerRing,
    spacing,
    size,
    speed,
    amplitude,
    frequency,
    opacity,
  }: RingsProps = $props();
  let root: HTMLDivElement;

  onMount(() => {
    const controller = createRings(root, {
      color,
      ringCount,
      pointsPerRing,
      spacing,
      size,
      speed,
      amplitude,
      frequency,
      opacity,
    });
    return () => controller.revert();
  });
</script>

<div bind:this={root} aria-hidden="true" class="h-full w-full"></div>
