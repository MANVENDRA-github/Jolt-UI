<script setup lang="ts">
import { computed } from 'vue';
import '@jolt/core/styles/tactile.css';

// Mirrors `tactileSchema` in @jolt/core (D-011). Native button attrs fall through to
// the single root <button>; no defineEmits.
interface Props {
  color?: string;
  speed?: number;
  label?: string;
}
const { color = '#6d5efc', speed = 0.12, label = 'Button' } = defineProps<Props>();

const style = computed(() => ({
  '--jolt-color': color,
  '--jolt-speed': `${speed}s`,
}));
</script>

<template>
  <button class="jolt-tactile" :style="style">
    <slot>{{ label }}</slot>
  </button>
</template>
