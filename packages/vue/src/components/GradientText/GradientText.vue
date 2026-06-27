<script setup lang="ts">
import { computed } from 'vue';
import '@jolt/core/styles/gradient-text.css';

// Mirrors `gradientTextSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  text: string;
  colors?: string[];
  duration?: number;
}
const { text, colors = ['#6ee7b7', '#3b82f6', '#a78bfa'], duration = 4 } = defineProps<Props>();

const style = computed(() => ({
  '--jolt-gradient': `linear-gradient(90deg, ${colors.concat(colors.slice(0, 1)).join(', ')})`,
  '--jolt-duration': `${duration}s`,
}));
</script>

<template>
  <span class="jolt-gradient-text" :style="style">{{ text }}</span>
</template>
