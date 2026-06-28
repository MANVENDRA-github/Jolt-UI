<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { createWaves, type WavesController } from '@jolt/core/webgl/waves';

// Mirrors `wavesSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  color?: string;
  amplitude?: number;
  frequency?: number;
  speed?: number;
  density?: number;
  opacity?: number;
}
const props = defineProps<Props>();
const root = ref<HTMLDivElement | null>(null);
let controller: WavesController | null = null;

onMounted(() => {
  if (root.value) controller = createWaves(root.value, props);
});
onBeforeUnmount(() => controller?.revert());
</script>

<template>
  <div ref="root" aria-hidden="true" class="h-full w-full" />
</template>
