<script lang="ts">
  import type { RippleProps } from '@jolt/core';
  import '@jolt/core/styles/ripple.css';

  let { color = '#6d5efc', size = 48, speed = 1.2, label = 'Loading…' }: RippleProps = $props();
</script>

<div
  role="status"
  aria-label={label}
  class="jolt-ripple"
  style="--jolt-color:{color};--jolt-size:{size}px;--jolt-speed:{speed}s"
>
  <span></span>
  <span></span>
</div>
