<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { createLightRays, type LightRaysController } from '@jolt/core/webgl/light-rays';

// Mirrors `lightRaysSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  colors?: string[];
  speed?: number;
  count?: number;
  spread?: number;
  falloff?: number;
  origin?: number;
  opacity?: number;
}
const props = defineProps<Props>();
const root = ref<HTMLDivElement | null>(null);
let controller: LightRaysController | null = null;

onMounted(() => {
  if (root.value) controller = createLightRays(root.value, props);
});
onBeforeUnmount(() => controller?.revert());
</script>

<template>
  <div ref="root" aria-hidden="true" class="h-full w-full" />
</template>
