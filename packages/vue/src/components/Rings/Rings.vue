<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { createRings, type RingsController } from '@jolt/core/webgl/rings';

// Mirrors `ringsSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  color?: string;
  ringCount?: number;
  pointsPerRing?: number;
  spacing?: number;
  size?: number;
  speed?: number;
  amplitude?: number;
  frequency?: number;
  opacity?: number;
}
const props = defineProps<Props>();
const root = ref<HTMLDivElement | null>(null);
let controller: RingsController | null = null;

onMounted(() => {
  if (root.value) controller = createRings(root.value, props);
});
onBeforeUnmount(() => controller?.revert());
</script>

<template>
  <div ref="root" aria-hidden="true" class="h-full w-full" />
</template>
