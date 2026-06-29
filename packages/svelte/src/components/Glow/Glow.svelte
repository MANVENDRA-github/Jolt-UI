<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { GlowProps } from '@jolt/core';
  import '@jolt/core/styles/glow.css';

  type Props = GlowProps &
    Omit<HTMLButtonAttributes, 'children' | 'class' | 'style'> & {
      children?: Snippet;
      class?: string;
      style?: string;
    };

  let {
    color = '#6d5efc',
    speed = 2,
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
  class="jolt-glow {className}"
  style="--jolt-color:{color};--jolt-speed:{speed}s;{style}"
  >{#if children}{@render children()}{:else}{label}{/if}</button
>
