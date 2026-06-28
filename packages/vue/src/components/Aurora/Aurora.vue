<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { createAurora, type AuroraController } from '@jolt/core/webgl/aurora';

// Mirrors `auroraSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  colors?: string[];
  speed?: number;
  intensity?: number;
  scale?: number;
  opacity?: number;
}
const props = defineProps<Props>();
const root = ref<HTMLDivElement | null>(null);
let controller: AuroraController | null = null;

onMounted(() => {
  if (root.value) controller = createAurora(root.value, props);
});
onBeforeUnmount(() => controller?.revert());
</script>

<template>
  <div ref="root" aria-hidden="true" class="h-full w-full" />
</template>
