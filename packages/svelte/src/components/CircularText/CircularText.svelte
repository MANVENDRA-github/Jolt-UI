<script lang="ts">
  import { splitSegments, type CircularTextProps } from '@jolt/core';
  import '@jolt/core/styles/circular-text.css';

  let { text, by = 'chars', radius = 48, speed = 14 }: CircularTextProps = $props();
  const segments = $derived(splitSegments(text, by));
</script>

<!-- Each segment sits at `i / count` of a turn, so the stylesheet needs the total count. -->
<!-- prettier-ignore -->
<span class="jolt-circular-text" aria-label={text} style="--jolt-radius:{radius}px; --jolt-speed:{speed}s; --jolt-count:{segments.length}">{#each segments as segment, i (i)}<span data-jolt-segment aria-hidden="true" style="--jolt-i:{i}">{segment}</span>{/each}</span>
