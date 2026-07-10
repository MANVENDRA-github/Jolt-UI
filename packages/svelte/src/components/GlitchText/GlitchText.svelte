<script lang="ts">
  import type { GlitchTextProps } from '@jolt/core';
  import '@jolt/core/styles/glitch-text.css';

  let { text, color = '#7c5cff', offset = 2, speed = 2.5 }: GlitchTextProps = $props();
</script>

<span
  class="jolt-glitch-text"
  style="--jolt-color:{color}; --jolt-offset:{offset}px; --jolt-speed:{speed}s">{text}</span
>
