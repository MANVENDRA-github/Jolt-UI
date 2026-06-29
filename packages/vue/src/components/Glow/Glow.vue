<script setup lang="ts">
import { computed } from 'vue';
import '@jolt/core/styles/glow.css';

// Mirrors `glowSchema` in @jolt/core (D-011). Native button attrs (@click, disabled,
// type, aria-*) fall through to the single root <button>; no defineEmits.
interface Props {
  color?: string;
  speed?: number;
  label?: string;
}
const { color = '#6d5efc', speed = 2, label = 'Button' } = defineProps<Props>();

const style = computed(() => ({
  '--jolt-color': color,
  '--jolt-speed': `${speed}s`,
}));
</script>

<template>
  <button class="jolt-glow" :style="style">
    <slot>{{ label }}</slot>
  </button>
</template>
