<script lang="ts">
  import { onMount } from 'svelte';
  import { createSplitText, splitSegments, type SplitTextProps } from '@jolt/core';

  let { text, by = 'chars', stagger, duration, delay, y }: SplitTextProps = $props();
  let root: HTMLSpanElement;
  const segments = $derived(splitSegments(text, by));

  onMount(() => {
    const controller = createSplitText(root, { text, by, stagger, duration, delay, y });
    return () => controller.revert();
  });
</script>

<!-- prettier-ignore -->
<span bind:this={root} aria-label={text} class="inline-block">{#each segments as segment, i (i)}<span data-jolt-segment aria-hidden="true" class="inline-block whitespace-pre will-change-transform">{segment}</span>{/each}</span>
