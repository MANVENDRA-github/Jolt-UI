<script setup lang="ts">
import { computed } from 'vue';
import '@jolt/core/styles/spinner.css';

// Mirrors `spinnerSchema` in @jolt/core (see DECISIONS D-011).
interface Props {
  color?: string;
  size?: number;
  thickness?: number;
  speed?: number;
  label?: string;
}
const {
  color = '#7c5cff',
  size = 40,
  thickness = 4,
  speed = 0.8,
  label = 'Loading…',
} = defineProps<Props>();

const style = computed(() => ({
  '--jolt-color': color,
  '--jolt-size': `${size}px`,
  '--jolt-thickness': `${thickness}px`,
  '--jolt-speed': `${speed}s`,
}));
</script>

<template>
  <div role="status" :aria-label="label" class="jolt-spinner" :style="style" />
</template>
