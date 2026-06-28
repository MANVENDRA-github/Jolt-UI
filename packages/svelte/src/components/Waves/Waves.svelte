<script lang="ts">
  import { onMount } from 'svelte';
  import type { WavesProps } from '@jolt/core';
  import { createWaves } from '@jolt/core/webgl/waves';

  let { color, amplitude, frequency, speed, density, opacity }: WavesProps = $props();
  let root: HTMLDivElement;

  onMount(() => {
    const controller = createWaves(root, { color, amplitude, frequency, speed, density, opacity });
    return () => controller.revert();
  });
</script>

<div bind:this={root} aria-hidden="true" class="h-full w-full"></div>
