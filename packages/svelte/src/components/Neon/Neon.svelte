<script lang="ts">
  import type { NeonProps } from '@jolt/core';
  import '@jolt/core/styles/neon.css';

  let { text, glow = 12, duration = 1.6, color = '#7c5cff' }: NeonProps = $props();
</script>

<span
  class="jolt-neon"
  style="--jolt-glow:{glow}px; --jolt-duration:{duration}s; --jolt-color:{color}">{text}</span
>
