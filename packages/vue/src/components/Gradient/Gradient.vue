<script setup lang="ts">
import { computed } from 'vue';
import '@jolt/core/styles/gradient.css';

// Mirrors `gradientSchema` in @jolt/core (D-011). Native button attrs fall through to
// the single root <button>; no defineEmits.
interface Props {
  colors?: string[];
  speed?: number;
  label?: string;
}
const {
  colors = ['#7c5cff', '#a855f7', '#ec4899'],
  speed = 4,
  label = 'Button',
} = defineProps<Props>();

// Repeat the first stop so the 200% background scroll loops seamlessly.
const style = computed(() => ({
  '--jolt-gradient': `linear-gradient(90deg, ${colors.concat(colors.slice(0, 1)).join(', ')})`,
  '--jolt-speed': `${speed}s`,
}));
</script>

<template>
  <button class="jolt-gradient" :style="style">
    <slot>{{ label }}</slot>
  </button>
</template>
