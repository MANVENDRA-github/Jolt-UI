<script setup lang="ts">
import { computed } from 'vue';
import '@jolt/core/styles/neon.css';

// Mirrors `neonSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  text: string;
  glow?: number;
  duration?: number;
  color?: string;
}
const { text, glow = 12, duration = 1.6, color = '#7c5cff' } = defineProps<Props>();
const rootStyle = computed(() => ({
  '--jolt-glow': `${glow}px`,
  '--jolt-duration': `${duration}s`,
  '--jolt-color': color,
}));
</script>

<template>
  <span class="jolt-neon" :style="rootStyle">{{ text }}</span>
</template>
