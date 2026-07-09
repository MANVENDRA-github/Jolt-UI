<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { attachClickSpark, type ClickSparkProps } from '@jolt/core';
  import '@jolt/core/styles/click-spark.css';

  type Props = ClickSparkProps &
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class' | 'style'> & {
      children?: Snippet;
      class?: string;
      style?: string;
    };

  let {
    color = '#c6ff4f',
    size = 12,
    speed = 0.45,
    class: className = '',
    style = '',
    children,
    ...rest
  }: Props = $props();

  let root: HTMLDivElement;
  // Emit a burst of CSS rays from every click.
  onMount(() => attachClickSpark(root).revert);
</script>

<div
  {...rest}
  bind:this={root}
  class="jolt-click-spark {className}"
  style="--jolt-color:{color};--jolt-size:{size}px;--jolt-speed:{speed}s;{style}"
>
  {#if children}{@render children()}{/if}
</div>
