<script setup lang="ts">
import { computed } from 'vue';
import '@jolt/core/styles/typewriter.css';

// Mirrors `typewriterSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  text: string;
  duration?: number;
  delay?: number;
  caret?: boolean;
}
const { text, duration = 2.5, delay = 0, caret = true } = defineProps<Props>();

const style = computed(() => ({
  '--jolt-steps': text.length,
  '--jolt-duration': `${duration}s`,
  '--jolt-delay': `${delay}s`,
  '--jolt-caret-width': caret ? '0.08em' : '0',
}));
</script>

<template>
  <span class="jolt-typewriter" :style="style">{{ text }}</span>
</template>
