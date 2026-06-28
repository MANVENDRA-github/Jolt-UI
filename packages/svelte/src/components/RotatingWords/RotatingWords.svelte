<script lang="ts">
  import type { RotatingWordsProps } from '@jolt/core';
  import '@jolt/core/styles/rotating-words.css';

  let {
    words = ['design', 'animate', 'ship'],
    interval = 2,
    delay = 0,
  }: RotatingWordsProps = $props();
  const label = $derived(words.join(' '));
</script>

<!-- prettier-ignore -->
<span class="jolt-rotating-words" aria-label={label} style="--jolt-count:{words.length}; --jolt-interval:{interval}s; --jolt-delay:{delay}s"><span class="jolt-rotating-words__list">{#each words as word, i (i)}<span class="jolt-rotating-words__word" data-jolt-segment aria-hidden="true">{word}</span>{/each}<span class="jolt-rotating-words__word" aria-hidden="true">{words[0]}</span></span></span>
