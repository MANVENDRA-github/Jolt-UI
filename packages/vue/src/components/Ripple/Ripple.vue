<script setup lang="ts">
import { computed } from 'vue';
import '@jolt/core/styles/ripple.css';

// Mirrors `rippleSchema` in @jolt/core (see DECISIONS D-011).
interface Props {
  color?: string;
  size?: number;
  speed?: number;
  label?: string;
}
const { color = '#6d5efc', size = 48, speed = 1.2, label = 'Loading…' } = defineProps<Props>();

const style = computed(() => ({
  '--jolt-color': color,
  '--jolt-size': `${size}px`,
  '--jolt-speed': `${speed}s`,
}));
</script>

<template>
  <div role="status" :aria-label="label" class="jolt-ripple" :style="style">
    <span />
    <span />
  </div>
</template>
