<script lang="ts">
  import type { GridProps } from '@jolt/core';
  import '@jolt/core/styles/grid.css';

  let { color = '#6d5efc', size = 12, speed = 1.3, label = 'Loading…' }: GridProps = $props();
</script>

<div
  role="status"
  aria-label={label}
  class="jolt-grid"
  style="--jolt-color:{color};--jolt-size:{size}px;--jolt-speed:{speed}s"
>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
</div>
