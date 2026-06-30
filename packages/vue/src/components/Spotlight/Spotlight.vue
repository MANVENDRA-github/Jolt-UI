<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue';
import { trackPointer, writeSpotlight, type PointerController } from '@jolt/core';
import '@jolt/core/styles/spotlight.css';

// Mirrors `spotlightSchema` in @jolt/core (D-011). Native attrs fall through to the single
// root <div>; the cursor glow is driven by the shared pointer behavior.
interface Props {
  color?: string;
  size?: number;
  opacity?: number;
}
const { color = '#7c5cff', size = 60, opacity = 0.35 } = defineProps<Props>();

const root = ref<HTMLDivElement | null>(null);
let controller: PointerController | null = null;
onMounted(() => {
  if (root.value) controller = trackPointer(root.value, writeSpotlight);
});
onBeforeUnmount(() => controller?.revert());

const style = computed(() => ({
  '--jolt-color': color,
  '--jolt-size': `${size}%`,
  '--jolt-opacity': opacity,
}));
</script>

<template>
  <div ref="root" class="jolt-spotlight" :style="style"><slot /></div>
</template>
