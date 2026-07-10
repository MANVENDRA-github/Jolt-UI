<script setup lang="ts">
import { computed } from 'vue';
import '@jolt/core/styles/glitch-text.css';

// Mirrors `glitchTextSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  text: string;
  color?: string;
  offset?: number;
  speed?: number;
}
const { text, color = '#7c5cff', offset = 2, speed = 2.5 } = defineProps<Props>();
const rootStyle = computed(() => ({
  '--jolt-color': color,
  '--jolt-offset': `${offset}px`,
  '--jolt-speed': `${speed}s`,
}));
</script>

<template>
  <span class="jolt-glitch-text" :style="rootStyle">{{ text }}</span>
</template>
