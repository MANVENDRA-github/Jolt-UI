<script lang="ts">
  import type { TypewriterProps } from '@jolt/core';
  import '@jolt/core/styles/typewriter.css';

  let { text, duration = 2.5, delay = 0, caret = true }: TypewriterProps = $props();
  const caretWidth = $derived(caret ? '0.08em' : '0');
</script>

<span
  class="jolt-typewriter"
  style="--jolt-steps:{text.length}; --jolt-duration:{duration}s; --jolt-delay:{delay}s; --jolt-caret-width:{caretWidth}"
  >{text}</span
>
