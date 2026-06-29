<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { BorderDrawProps } from '@jolt/core';
  import '@jolt/core/styles/border-draw.css';

  type Props = BorderDrawProps &
    Omit<HTMLButtonAttributes, 'children' | 'class' | 'style'> & {
      children?: Snippet;
      class?: string;
      style?: string;
    };

  let {
    color = '#6d5efc',
    speed = 3,
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
  class="jolt-border-draw {className}"
  style="--jolt-color:{color};--jolt-speed:{speed}s;{style}"
  >{#if children}{@render children()}{:else}{label}{/if}</button
>
