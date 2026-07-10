<script lang="ts">
  import { onMount } from 'svelte';
  import type { LightRaysProps } from '@jolt/core';
  import { createLightRays } from '@jolt/core/webgl/light-rays';

  let { colors, speed, count, spread, falloff, origin, opacity }: LightRaysProps = $props();
  let root: HTMLDivElement;

  onMount(() => {
    const controller = createLightRays(root, {
      colors,
      speed,
      count,
      spread,
      falloff,
      origin,
      opacity,
    });
    return () => controller.revert();
  });
</script>

<div bind:this={root} aria-hidden="true" class="h-full w-full"></div>
