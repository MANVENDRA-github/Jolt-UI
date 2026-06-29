<script lang="ts">
  import type { ProgressBarProps } from '@jolt/core';
  import '@jolt/core/styles/progress-bar.css';

  let {
    color = '#6d5efc',
    width = 160,
    thickness = 4,
    speed = 1.4,
    label = 'Loading…',
  }: ProgressBarProps = $props();
</script>

<div
  role="status"
  aria-label={label}
  class="jolt-progress-bar"
  style="--jolt-color:{color};--jolt-width:{width}px;--jolt-thickness:{thickness}px;--jolt-speed:{speed}s"
>
  <span></span>
</div>
