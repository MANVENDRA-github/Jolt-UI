<script lang="ts">
  import { splitSegments, type FlipInProps } from '@jolt/core';
  import '@jolt/core/styles/flip-in.css';

  let {
    text,
    by = 'chars',
    duration = 0.6,
    stagger = 0.05,
    perspective = 400,
    delay = 0,
  }: FlipInProps = $props();
  const segments = $derived(splitSegments(text, by));
</script>

<!-- prettier-ignore -->
<span class="jolt-flip-in" aria-label={text} style="--jolt-duration:{duration}s; --jolt-stagger:{stagger}s; --jolt-perspective:{perspective}px; --jolt-delay:{delay}s">{#each segments as segment, i (i)}<span data-jolt-segment aria-hidden="true" style="--jolt-i:{i}">{segment}</span>{/each}</span>
