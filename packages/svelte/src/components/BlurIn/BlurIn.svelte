<script lang="ts">
  import { splitSegments, type BlurInProps } from '@jolt/core';
  import '@jolt/core/styles/blur-in.css';

  let { text, by = 'chars', blur = 10, stagger = 0.05, duration = 0.6, delay = 0 }: BlurInProps =
    $props();
  const segments = $derived(splitSegments(text, by));
</script>

<!-- prettier-ignore -->
<span class="jolt-blur-in" aria-label={text} style="--jolt-blur:{blur}px; --jolt-stagger:{stagger}s; --jolt-duration:{duration}s; --jolt-delay:{delay}s">{#each segments as segment, i (i)}<span data-jolt-segment aria-hidden="true" style="--jolt-i:{i}">{segment}</span>{/each}</span>
