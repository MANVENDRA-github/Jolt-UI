<script lang="ts">
  import type { PulseProps } from '@jolt/core';
  import '@jolt/core/styles/pulse.css';

  let { color = '#6d5efc', size = 40, speed = 1.2, label = 'Loading…' }: PulseProps = $props();
</script>

<div
  role="status"
  aria-label={label}
  class="jolt-pulse"
  style="--jolt-color:{color};--jolt-size:{size}px;--jolt-speed:{speed}s"
>
  <span></span>
  <span></span>
</div>
