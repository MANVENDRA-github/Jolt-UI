<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { trackPointer, writeSpotlight, type PointerController } from '@jolt/core';
import '@jolt/core/styles/glare.css';

// Mirrors `glareSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  color?: string;
  angle?: number;
  spread?: number;
  opacity?: number;
}
const { color = '#ffffff', angle = 105, spread = 220, opacity = 0.18 } = defineProps<Props>();

const root = ref<HTMLDivElement | null>(null);
let controller: PointerController | null = null;
onMounted(() => {
  if (root.value) controller = trackPointer(root.value, writeSpotlight);
});
onBeforeUnmount(() => controller?.revert());

const style = computed(() => ({
  '--jolt-color': color,
  '--jolt-angle': `${angle}deg`,
  '--jolt-spread': `${spread}%`,
  '--jolt-opacity': opacity,
}));
</script>

<template>
  <div ref="root" class="jolt-glare" :style="style"><slot /></div>
</template>
