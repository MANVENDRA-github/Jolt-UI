<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { SweepProps } from '@jolt/core';
  import '@jolt/core/styles/sweep.css';

  type Props = SweepProps &
    Omit<HTMLButtonAttributes, 'children' | 'class' | 'style'> & {
      children?: Snippet;
      class?: string;
      style?: string;
    };

  let {
    color = '#6d5efc',
    speed = 0.3,
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
  class="jolt-sweep {className}"
  style="--jolt-color:{color};--jolt-speed:{speed}s;{style}"
  >{#if children}{@render children()}{:else}{label}{/if}</button
>
