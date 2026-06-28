<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { createGlobe, type GlobeController } from '@jolt/core/webgl/globe';

// Mirrors `globeSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  color?: string;
  count?: number;
  size?: number;
  radius?: number;
  speed?: number;
  amplitude?: number;
  frequency?: number;
  opacity?: number;
}
const props = defineProps<Props>();
const root = ref<HTMLDivElement | null>(null);
let controller: GlobeController | null = null;

onMounted(() => {
  if (root.value) controller = createGlobe(root.value, props);
});
onBeforeUnmount(() => controller?.revert());
</script>

<template>
  <div ref="root" aria-hidden="true" class="h-full w-full" />
</template>
