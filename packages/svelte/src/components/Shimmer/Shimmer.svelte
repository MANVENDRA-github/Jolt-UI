<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { ShimmerProps } from '@jolt/core';
  import '@jolt/core/styles/shimmer.css';

  // Visual props + label fallback from the shared schema; everything else is a native
  // <button> attr (onclick, disabled, type, aria-*) spread via ...rest. class/style are
  // narrowed to string + pulled out of rest so the spread can't clobber the base class.
  type Props = ShimmerProps &
    Omit<HTMLButtonAttributes, 'children' | 'class' | 'style'> & {
      children?: Snippet;
      class?: string;
      style?: string;
    };

  let {
    color = '#6d5efc',
    shine = '#b3a9ff',
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
  class="jolt-shimmer {className}"
  style="--jolt-color:{color};--jolt-shine:{shine};--jolt-speed:{speed}s;{style}"
  >{#if children}{@render children()}{:else}{label}{/if}</button
>
