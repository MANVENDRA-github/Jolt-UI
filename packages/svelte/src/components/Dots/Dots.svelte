<script lang="ts">
  import { onMount } from 'svelte';
  import type { DotsProps } from '@jolt/core';
  import { createDots } from '@jolt/core/webgl/dots';

  let { color, count, size, amplitude, frequency, speed, opacity }: DotsProps = $props();
  let root: HTMLDivElement;

  onMount(() => {
    const controller = createDots(root, {
      color,
      count,
      size,
      amplitude,
      frequency,
      speed,
      opacity,
    });
    return () => controller.revert();
  });
</script>

<div bind:this={root} aria-hidden="true" class="h-full w-full"></div>
