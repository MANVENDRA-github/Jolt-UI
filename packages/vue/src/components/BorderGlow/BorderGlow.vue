<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { trackPointer, writeSpotlight, type PointerController } from '@jolt/core';
import '@jolt/core/styles/border-glow.css';

// Mirrors `borderGlowSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  color?: string;
  width?: number;
  glow?: number;
}
const { color = '#7c5cff', width = 2, glow = 120 } = defineProps<Props>();

const root = ref<HTMLDivElement | null>(null);
let controller: PointerController | null = null;
onMounted(() => {
  if (root.value) controller = trackPointer(root.value, writeSpotlight);
});
onBeforeUnmount(() => controller?.revert());

const style = computed(() => ({
  '--jolt-color': color,
  '--jolt-width': `${width}px`,
  '--jolt-glow': `${glow}px`,
}));
</script>

<template>
  <div ref="root" class="jolt-border-glow" :style="style"><slot /></div>
</template>
