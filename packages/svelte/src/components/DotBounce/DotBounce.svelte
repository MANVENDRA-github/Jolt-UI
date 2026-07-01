<script lang="ts">
  import type { DotBounceProps } from '@jolt/core';
  import '@jolt/core/styles/dot-bounce.css';

  let { color = '#7c5cff', size = 12, speed = 1.2, label = 'Loading…' }: DotBounceProps = $props();
</script>

<div
  role="status"
  aria-label={label}
  class="jolt-dot-bounce"
  style="--jolt-color:{color};--jolt-size:{size}px;--jolt-speed:{speed}s"
>
  <span></span>
  <span></span>
  <span></span>
</div>
