<script lang="ts">
  import { onMount } from 'svelte';
  import type { IridescenceProps } from '@jolt/core';
  import { createIridescence } from '@jolt/core/webgl/iridescence';

  let { colors, speed, scale, amplitude, opacity }: IridescenceProps = $props();
  let root: HTMLDivElement;

  onMount(() => {
    const controller = createIridescence(root, { colors, speed, scale, amplitude, opacity });
    return () => controller.revert();
  });
</script>

<div bind:this={root} aria-hidden="true" class="h-full w-full"></div>
