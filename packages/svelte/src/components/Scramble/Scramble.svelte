<script lang="ts">
  import { onMount } from 'svelte';
  import { createScramble, type ScrambleProps } from '@jolt/core';

  let { text, duration, delay, chars, revealDelay, speed }: ScrambleProps = $props();
  let root: HTMLSpanElement;

  onMount(() => {
    const controller = createScramble(root, { text, duration, delay, chars, revealDelay, speed });
    return () => controller.revert();
  });
</script>

<span bind:this={root} aria-label={text}>{text}</span>
