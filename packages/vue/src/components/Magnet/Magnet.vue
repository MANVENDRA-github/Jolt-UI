<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { trackPointer, writeMagnet, type PointerController } from '@jolt/core';
import '@jolt/core/styles/magnet.css';

// Mirrors `magnetSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  strength?: number;
  speed?: number;
}
const { strength = 14, speed = 0.25 } = defineProps<Props>();

const root = ref<HTMLDivElement | null>(null);
let controller: PointerController | null = null;
// Publish a signed -1..1 pull toward the cursor; the stylesheet scales it by --jolt-strength.
onMounted(() => {
  if (root.value) controller = trackPointer(root.value, writeMagnet);
});
onBeforeUnmount(() => controller?.revert());

const style = computed(() => ({
  '--jolt-strength': `${strength}px`,
  '--jolt-speed': `${speed}s`,
}));
</script>

<template>
  <div ref="root" class="jolt-magnet" :style="style"><slot /></div>
</template>
