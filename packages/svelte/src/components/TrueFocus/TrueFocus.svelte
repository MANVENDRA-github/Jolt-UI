<script lang="ts">
  import { splitSegments, type TrueFocusProps } from '@jolt/core';
  import '@jolt/core/styles/true-focus.css';

  let { text, by = 'chars', blur = 4, dim = 0.55, speed = 0.28 }: TrueFocusProps = $props();
  const segments = $derived(splitSegments(text, by));
</script>

<!-- The sweep's cycle is `speed` per segment, so the stylesheet needs the total count. -->
<!-- prettier-ignore -->
<span class="jolt-true-focus" aria-label={text} style="--jolt-blur:{blur}px; --jolt-dim:{dim}; --jolt-speed:{speed}s; --jolt-count:{segments.length}">{#each segments as segment, i (i)}<span data-jolt-segment aria-hidden="true" style="--jolt-i:{i}">{segment}</span>{/each}</span>
