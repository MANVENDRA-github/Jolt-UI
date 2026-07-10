<script setup lang="ts">
import { computed } from 'vue';
import '@jolt/core/styles/star-border.css';

// Mirrors `starBorderSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  color?: string;
  star?: string;
  width?: number;
  speed?: number;
  label?: string;
}
const {
  color = '#14141c',
  star = '#c6ff4f',
  width = 2,
  speed = 4,
  label = 'Button',
} = defineProps<Props>();

const style = computed(() => ({
  '--jolt-color': color,
  '--jolt-star': star,
  '--jolt-width': `${width}px`,
  '--jolt-speed': `${speed}s`,
}));
</script>

<template>
  <button class="jolt-star-border" :style="style">
    <slot>{{ label }}</slot>
  </button>
</template>
