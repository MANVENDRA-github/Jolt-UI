<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { observeReveal, type FadeContentProps } from '@jolt/core';
  import '@jolt/core/styles/fade-content.css';

  type Props = FadeContentProps &
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class' | 'style'> & {
      children?: Snippet;
      class?: string;
      style?: string;
    };

  let {
    duration = 0.7,
    delay = 0,
    blur = 6,
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
  class="jolt-fade-content {className}"
  style="--jolt-duration:{duration}s;--jolt-delay:{delay}s;--jolt-blur:{blur}px;{style}"
>
  {#if children}{@render children()}{/if}
</div>
