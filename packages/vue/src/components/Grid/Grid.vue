<script setup lang="ts">
import { computed } from 'vue';
import '@jolt/core/styles/grid.css';

// Mirrors `gridSchema` in @jolt/core (see DECISIONS D-011).
interface Props {
  color?: string;
  size?: number;
  speed?: number;
  label?: string;
}
const { color = '#7c5cff', size = 12, speed = 1.3, label = 'Loading…' } = defineProps<Props>();

const style = computed(() => ({
  '--jolt-color': color,
  '--jolt-size': `${size}px`,
  '--jolt-speed': `${speed}s`,
}));
</script>

<template>
  <div role="status" :aria-label="label" class="jolt-grid" :style="style">
    <span />
    <span />
    <span />
    <span />
    <span />
    <span />
    <span />
    <span />
    <span />
  </div>
</template>
