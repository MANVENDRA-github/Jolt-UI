<script setup lang="ts">
import { computed } from 'vue';
import '@jolt/core/styles/progress-bar.css';

// Mirrors `progressBarSchema` in @jolt/core (see DECISIONS D-011).
interface Props {
  color?: string;
  width?: number;
  thickness?: number;
  speed?: number;
  label?: string;
}
const {
  color = '#7c5cff',
  width = 160,
  thickness = 4,
  speed = 1.4,
  label = 'Loading…',
} = defineProps<Props>();

const style = computed(() => ({
  '--jolt-color': color,
  '--jolt-width': `${width}px`,
  '--jolt-thickness': `${thickness}px`,
  '--jolt-speed': `${speed}s`,
}));
</script>

<template>
  <div role="status" :aria-label="label" class="jolt-progress-bar" :style="style">
    <span />
  </div>
</template>
