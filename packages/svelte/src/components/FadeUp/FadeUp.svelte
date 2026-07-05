<script lang="ts">
  import { splitSegments, type FadeUpProps } from '@jolt/core';
  import '@jolt/core/styles/fade-up.css';

  let {
    text,
    by = 'chars',
    distance = 0.7,
    stagger = 0.04,
    duration = 0.5,
    delay = 0,
  }: FadeUpProps = $props();
  const segments = $derived(splitSegments(text, by));
</script>

<!-- prettier-ignore -->
<span class="jolt-fade-up" aria-label={text} style="--jolt-distance:{distance}em; --jolt-stagger:{stagger}s; --jolt-duration:{duration}s; --jolt-delay:{delay}s">{#each segments as segment, i (i)}<span data-jolt-segment aria-hidden="true" style="--jolt-i:{i}">{segment}</span>{/each}</span>
