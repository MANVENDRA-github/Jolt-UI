<script lang="ts">
  import { onMount } from 'svelte';
  import { createScrollVelocity, type ScrollVelocityProps } from '@jolt/core';

  let { text, baseVelocity, direction }: ScrollVelocityProps = $props();
  let root: HTMLSpanElement;
  const copies = [...Array(8).keys()];

  onMount(() => {
    const controller = createScrollVelocity(root, { text, baseVelocity, direction });
    return () => controller.revert();
  });
</script>

<!-- prettier-ignore -->
<span bind:this={root} class="block overflow-hidden whitespace-nowrap" aria-label={text}><span class="inline-block will-change-transform" data-jolt-track aria-hidden="true">{#each copies as i (i)}<span class="inline-block pr-8">{text}</span>{/each}</span></span>
