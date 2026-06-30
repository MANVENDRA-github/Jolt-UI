<script lang="ts">
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { trackPointer, writeSpotlight, type SpotlightProps } from '@jolt/core';
  import '@jolt/core/styles/spotlight.css';

  type Props = SpotlightProps &
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class' | 'style'> & {
      children?: Snippet;
      class?: string;
      style?: string;
    };

  let {
    color = '#6d5efc',
    size = 60,
    opacity = 0.35,
    class: className = '',
    style = '',
    children,
    ...rest
  }: Props = $props();

  let root: HTMLDivElement;
  onMount(() => trackPointer(root, writeSpotlight).revert);
</script>

<div
  {...rest}
  bind:this={root}
  class="jolt-spotlight {className}"
  style="--jolt-color:{color};--jolt-size:{size}%;--jolt-opacity:{opacity};{style}"
>
  {#if children}{@render children()}{/if}
</div>
