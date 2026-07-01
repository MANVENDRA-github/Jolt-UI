<script setup lang="ts">
import { computed } from 'vue';
import '@jolt/core/styles/shine-border.css';

// Mirrors `shineBorderSchema` in @jolt/core (D-011). Native attrs fall through to the
// single root <div>; the gradient border is self-running CSS (no pointer).
interface Props {
  color?: string;
  speed?: number;
  width?: number;
}
const { color = '#7c5cff', speed = 3, width = 2 } = defineProps<Props>();

const style = computed(() => ({
  '--jolt-color': color,
  '--jolt-speed': `${speed}s`,
  '--jolt-width': `${width}px`,
}));
</script>

<template>
  <div class="jolt-shine-border" :style="style"><slot /></div>
</template>
