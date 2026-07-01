<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue';
import { trackPointer, makeTiltWriter, type PointerController } from '@jolt/core';
import '@jolt/core/styles/tilt.css';

// Mirrors `tiltSchema` in @jolt/core (D-011). Native attrs fall through to the single root
// <div>; the 3-D tilt is driven by the shared pointer behavior.
interface Props {
  color?: string;
  maxTilt?: number;
  speed?: number;
}
const { color = '#7c5cff', maxTilt = 12, speed = 0.15 } = defineProps<Props>();

const root = ref<HTMLDivElement | null>(null);
let controller: PointerController | null = null;
onMounted(() => {
  if (root.value) controller = trackPointer(root.value, makeTiltWriter(maxTilt));
});
onBeforeUnmount(() => controller?.revert());

const style = computed(() => ({
  '--jolt-color': color,
  '--jolt-speed': `${speed}s`,
}));
</script>

<template>
  <div ref="root" class="jolt-tilt" :style="style"><slot /></div>
</template>
