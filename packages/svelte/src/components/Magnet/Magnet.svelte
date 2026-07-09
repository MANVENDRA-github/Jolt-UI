<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { trackPointer, writeMagnet, type MagnetProps } from '@jolt/core';
  import '@jolt/core/styles/magnet.css';

  type Props = MagnetProps &
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class' | 'style'> & {
      children?: Snippet;
      class?: string;
      style?: string;
    };

  let {
    strength = 14,
    speed = 0.25,
    class: className = '',
    style = '',
    children,
    ...rest
  }: Props = $props();

  let root: HTMLDivElement;
  // Publish a signed -1..1 pull toward the cursor; the stylesheet scales it by --jolt-strength.
  onMount(() => trackPointer(root, writeMagnet).revert);
</script>

<div
  {...rest}
  bind:this={root}
  class="jolt-magnet {className}"
  style="--jolt-strength:{strength}px;--jolt-speed:{speed}s;{style}"
>
  {#if children}{@render children()}{/if}
</div>
