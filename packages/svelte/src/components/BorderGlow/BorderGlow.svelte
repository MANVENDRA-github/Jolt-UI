<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { trackPointer, writeSpotlight, type BorderGlowProps } from '@jolt/core';
  import '@jolt/core/styles/border-glow.css';

  type Props = BorderGlowProps &
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class' | 'style'> & {
      children?: Snippet;
      class?: string;
      style?: string;
    };

  let {
    color = '#7c5cff',
    width = 2,
    glow = 120,
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
  class="jolt-border-glow {className}"
  style="--jolt-color:{color};--jolt-width:{width}px;--jolt-glow:{glow}px;{style}"
>
  {#if children}{@render children()}{/if}
</div>
