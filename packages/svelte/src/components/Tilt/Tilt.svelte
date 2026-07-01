<script lang="ts">
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { trackPointer, makeTiltWriter, type TiltProps } from '@jolt/core';
  import '@jolt/core/styles/tilt.css';

  type Props = TiltProps &
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class' | 'style'> & {
      children?: Snippet;
      class?: string;
      style?: string;
    };

  let {
    color = '#7c5cff',
    maxTilt = 12,
    speed = 0.15,
    class: className = '',
    style = '',
    children,
    ...rest
  }: Props = $props();

  let root: HTMLDivElement;
  onMount(() => trackPointer(root, makeTiltWriter(maxTilt)).revert);
</script>

<div
  {...rest}
  bind:this={root}
  class="jolt-tilt {className}"
  style="--jolt-color:{color};--jolt-speed:{speed}s;{style}"
>
  {#if children}{@render children()}{/if}
</div>
