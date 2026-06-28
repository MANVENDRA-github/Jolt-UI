<script lang="ts">
  import type { BarsProps } from '@jolt/core';
  import '@jolt/core/styles/bars.css';

  let { color = '#6d5efc', size = 32, speed = 1, label = 'Loading…' }: BarsProps = $props();
</script>

<div
  role="status"
  aria-label={label}
  class="jolt-bars"
  style="--jolt-color:{color};--jolt-size:{size}px;--jolt-speed:{speed}s"
>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
</div>
