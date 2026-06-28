<script lang="ts">
  import { onMount } from 'svelte';
  import { createCountUp, formatNumber, type CountUpProps } from '@jolt/core';

  let { to, from = 0, duration, delay, decimals = 0, separator = '' }: CountUpProps = $props();
  let root: HTMLSpanElement;
  const initial = $derived(formatNumber(from, { decimals, separator }));

  onMount(() => {
    const controller = createCountUp(root, { to, from, duration, delay, decimals, separator });
    return () => controller.revert();
  });
</script>

<span bind:this={root} class="tabular-nums">{initial}</span>
