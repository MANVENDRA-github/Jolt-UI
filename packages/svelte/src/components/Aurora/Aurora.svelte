<script lang="ts">
  import { onMount } from 'svelte';
  import type { AuroraProps } from '@jolt/core';
  import { createAurora } from '@jolt/core/webgl/aurora';

  let { colors, speed, intensity, scale, opacity }: AuroraProps = $props();
  let root: HTMLDivElement;

  onMount(() => {
    const controller = createAurora(root, { colors, speed, intensity, scale, opacity });
    return () => controller.revert();
  });
</script>

<div bind:this={root} aria-hidden="true" class="h-full w-full"></div>
