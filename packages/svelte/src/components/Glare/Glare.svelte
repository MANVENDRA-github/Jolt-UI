<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { trackPointer, writeSpotlight, type GlareProps } from '@jolt/core';
  import '@jolt/core/styles/glare.css';

  type Props = GlareProps &
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class' | 'style'> & {
      children?: Snippet;
      class?: string;
      style?: string;
    };

  let {
    color = '#ffffff',
    angle = 105,
    spread = 220,
    opacity = 0.18,
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
  class="jolt-glare {className}"
  style="--jolt-color:{color};--jolt-angle:{angle}deg;--jolt-spread:{spread}%;--jolt-opacity:{opacity};{style}"
>
  {#if children}{@render children()}{/if}
</div>
