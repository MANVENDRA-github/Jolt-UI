<script setup lang="ts">
import { computed } from 'vue';
import '@jolt/core/styles/shimmer.css';

// Mirrors `shimmerSchema` in @jolt/core (see DECISIONS D-011). Only the visual props +
// the label fallback are declared; native button attrs (@click, disabled, type, aria-*)
// fall through to the single root <button> (inheritAttrs defaults to true) — so no
// defineEmits, and declaring the visual props keeps them off the DOM element.
interface Props {
  color?: string;
  shine?: string;
  speed?: number;
  label?: string;
}
const { color = '#7c5cff', shine = '#b3a9ff', speed = 3, label = 'Button' } = defineProps<Props>();

const style = computed(() => ({
  '--jolt-color': color,
  '--jolt-shine': shine,
  '--jolt-speed': `${speed}s`,
}));
</script>

<template>
  <button class="jolt-shimmer" :style="style">
    <slot>{{ label }}</slot>
  </button>
</template>
