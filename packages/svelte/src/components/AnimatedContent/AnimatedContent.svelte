<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { observeReveal, type AnimatedContentProps } from '@jolt/core';
  import '@jolt/core/styles/animated-content.css';

  type Props = AnimatedContentProps &
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class' | 'style'> & {
      children?: Snippet;
      class?: string;
      style?: string;
    };

  let {
    distance = 40,
    scale = 0.94,
    duration = 0.7,
    delay = 0,
    class: className = '',
    style = '',
    children,
    ...rest
  }: Props = $props();

  let root: HTMLDivElement;
  // Hide the content until it scrolls into view. Visible by default — the behavior only arms
  // it when a real IntersectionObserver exists and motion is allowed.
  onMount(() => observeReveal(root).revert);
</script>

<div
  {...rest}
  bind:this={root}
  class="jolt-animated-content {className}"
  style="--jolt-distance:{distance}px;--jolt-scale:{scale};--jolt-duration:{duration}s;--jolt-delay:{delay}s;{style}"
>
  {#if children}{@render children()}{/if}
</div>
