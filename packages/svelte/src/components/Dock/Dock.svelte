<script lang="ts">
  import { onMount } from 'svelte';
  import { trackDock, type DockProps } from '@jolt/core';
  import '@jolt/core/styles/dock.css';

  let {
    items = ['Home', 'Search', 'Files', 'Mail', 'Trash'],
    size = 44,
    magnification = 1.8,
    range = 140,
    color = '#7c5cff',
  }: DockProps = $props();

  let root: HTMLDivElement;
  onMount(() => trackDock(root, { range, maxScale: magnification }).revert);
</script>

<div
  bind:this={root}
  class="jolt-dock"
  style="--jolt-size:{size}px;--jolt-color:{color}"
  role="list"
>
  {#each items as label, i (i)}
    <span data-jolt-dock-item role="listitem" aria-label={label} title={label}
      >{label.slice(0, 1)}</span
    >
  {/each}
</div>
