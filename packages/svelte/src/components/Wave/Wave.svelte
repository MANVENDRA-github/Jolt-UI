<script lang="ts">
  import { splitSegments, type WaveProps } from '@jolt/core';
  import '@jolt/core/styles/wave.css';

  let { text, by = 'chars', amplitude = 10, duration = 1.5, stagger = 0.08, delay = 0 }: WaveProps =
    $props();
  const segments = $derived(splitSegments(text, by));
</script>

<!-- prettier-ignore -->
<span class="jolt-wave" aria-label={text} style="--jolt-amplitude:{amplitude}px; --jolt-duration:{duration}s; --jolt-stagger:{stagger}s; --jolt-delay:{delay}s">{#each segments as segment, i (i)}<span data-jolt-segment aria-hidden="true" style="--jolt-i:{i}">{segment}</span>{/each}</span>
