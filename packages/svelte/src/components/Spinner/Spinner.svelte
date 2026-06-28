<script lang="ts">
  import type { SpinnerProps } from '@jolt/core';
  import '@jolt/core/styles/spinner.css';

  let {
    color = '#6d5efc',
    size = 40,
    thickness = 4,
    speed = 0.8,
    label = 'Loading…',
  }: SpinnerProps = $props();
</script>

<div
  role="status"
  aria-label={label}
  class="jolt-spinner"
  style="--jolt-color:{color};--jolt-size:{size}px;--jolt-thickness:{thickness}px;--jolt-speed:{speed}s"
></div>
