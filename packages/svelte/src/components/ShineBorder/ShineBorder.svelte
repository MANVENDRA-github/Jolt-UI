<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { ShineBorderProps } from '@jolt/core';
  import '@jolt/core/styles/shine-border.css';

  type Props = ShineBorderProps &
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class' | 'style'> & {
      children?: Snippet;
      class?: string;
      style?: string;
    };

  let {
    color = '#7c5cff',
    speed = 3,
    width = 2,
    class: className = '',
    style = '',
    children,
    ...rest
  }: Props = $props();
</script>

<div
  {...rest}
  class="jolt-shine-border {className}"
  style="--jolt-color:{color};--jolt-speed:{speed}s;--jolt-width:{width}px;{style}"
>
  {#if children}{@render children()}{/if}
</div>
