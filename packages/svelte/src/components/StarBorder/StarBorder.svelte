<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { StarBorderProps } from '@jolt/core';
  import '@jolt/core/styles/star-border.css';

  type Props = StarBorderProps &
    Omit<HTMLButtonAttributes, 'children' | 'class' | 'style'> & {
      children?: Snippet;
      class?: string;
      style?: string;
    };

  let {
    color = '#14141c',
    star = '#c6ff4f',
    width = 2,
    speed = 4,
    label = 'Button',
    type = 'button',
    class: className = '',
    style = '',
    children,
    ...rest
  }: Props = $props();
</script>

<button
  {...rest}
  {type}
  class="jolt-star-border {className}"
  style="--jolt-color:{color};--jolt-star:{star};--jolt-width:{width}px;--jolt-speed:{speed}s;{style}"
  >{#if children}{@render children()}{:else}{label}{/if}</button
>
