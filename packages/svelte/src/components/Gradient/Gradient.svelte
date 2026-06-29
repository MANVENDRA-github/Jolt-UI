<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { GradientProps } from '@jolt/core';
  import '@jolt/core/styles/gradient.css';

  type Props = GradientProps &
    Omit<HTMLButtonAttributes, 'children' | 'class' | 'style'> & {
      children?: Snippet;
      class?: string;
      style?: string;
    };

  let {
    colors = ['#6d5efc', '#a855f7', '#ec4899'],
    speed = 4,
    label = 'Button',
    type = 'button',
    class: className = '',
    style = '',
    children,
    ...rest
  }: Props = $props();

  // Repeat the first stop so the 200% background scroll loops seamlessly.
  const gradient = $derived(
    `linear-gradient(90deg, ${colors.concat(colors.slice(0, 1)).join(', ')})`,
  );
</script>

<button
  {...rest}
  {type}
  class="jolt-gradient {className}"
  style="--jolt-gradient:{gradient};--jolt-speed:{speed}s;{style}"
  >{#if children}{@render children()}{:else}{label}{/if}</button
>
