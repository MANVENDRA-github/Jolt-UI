<script lang="ts">
  import { counterCells, type CounterProps } from '@jolt/core';
  import '@jolt/core/styles/counter.css';

  let { value = 2025, digits = 1, duration = 1.1, color = '#7c5cff' }: CounterProps = $props();

  const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const cells = $derived(counterCells(value, digits));
</script>

<!-- prettier-ignore -->
<span class="jolt-counter" style="--jolt-duration:{duration}s;--jolt-color:{color}" aria-label={cells.label} role="img">{#each cells.digits as digit, i (i)}<span data-jolt-col aria-hidden="true"><span data-jolt-strip style="--jolt-digit:{digit}">{#each DIGITS as d (d)}<span>{d}</span>{/each}</span></span>{/each}</span>
