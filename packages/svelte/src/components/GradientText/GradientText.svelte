<script lang="ts">
  import type { GradientTextProps } from '@jolt/core';
  import '@jolt/core/styles/gradient-text.css';

  let { text, colors = ['#6ee7b7', '#3b82f6', '#a78bfa'], duration = 4 }: GradientTextProps =
    $props();
  // Repeat the first stop so the 200% background scroll loops seamlessly.
  const gradient = $derived(
    `linear-gradient(90deg, ${colors.concat(colors.slice(0, 1)).join(', ')})`,
  );
</script>

<span class="jolt-gradient-text" style="--jolt-gradient:{gradient}; --jolt-duration:{duration}s"
  >{text}</span
>
