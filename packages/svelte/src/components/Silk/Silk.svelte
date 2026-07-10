<script lang="ts">
  import { onMount } from 'svelte';
  import type { SilkProps } from '@jolt/core';
  import { createSilk } from '@jolt/core/webgl/silk';

  let { colors, speed, scale, rotation, noise, opacity }: SilkProps = $props();
  let root: HTMLDivElement;

  onMount(() => {
    const controller = createSilk(root, { colors, speed, scale, rotation, noise, opacity });
    return () => controller.revert();
  });
</script>

<div bind:this={root} aria-hidden="true" class="h-full w-full"></div>
