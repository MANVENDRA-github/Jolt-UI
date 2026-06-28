<script setup lang="ts">
import { computed } from 'vue';
import '@jolt/core/styles/rotating-words.css';

// Mirrors `rotatingWordsSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  words?: string[];
  interval?: number;
  delay?: number;
}
const { words = ['design', 'animate', 'ship'], interval = 2, delay = 0 } = defineProps<Props>();

const label = computed(() => words.join(' '));
const style = computed(() => ({
  '--jolt-count': words.length,
  '--jolt-interval': `${interval}s`,
  '--jolt-delay': `${delay}s`,
}));
</script>

<template>
  <span class="jolt-rotating-words" :aria-label="label" :style="style"
    ><span class="jolt-rotating-words__list"
      ><span
        v-for="(word, i) in words"
        :key="i"
        class="jolt-rotating-words__word"
        data-jolt-segment
        aria-hidden="true"
        >{{ word }}</span
      ><span class="jolt-rotating-words__word" aria-hidden="true">{{ words[0] }}</span></span
    ></span
  >
</template>
