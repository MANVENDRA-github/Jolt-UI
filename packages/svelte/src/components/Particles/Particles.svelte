<script lang="ts">
  import { onMount } from 'svelte';
  import type { ParticlesProps } from '@jolt/core';
  import { createParticles } from '@jolt/core/webgl/particles';

  let { count, color, size, speed, spread, opacity }: ParticlesProps = $props();
  let root: HTMLDivElement;

  onMount(() => {
    const controller = createParticles(root, { count, color, size, speed, spread, opacity });
    return () => controller.revert();
  });
</script>

<div bind:this={root} aria-hidden="true" class="h-full w-full"></div>
