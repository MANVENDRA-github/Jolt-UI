<script lang="ts">
  import type { ShinyTextProps } from '@jolt/core';
  import '@jolt/core/styles/shiny-text.css';

  let { text, duration = 3 }: ShinyTextProps = $props();
</script>

<span class="jolt-shiny-text" style="--jolt-duration:{duration}s">{text}</span>
