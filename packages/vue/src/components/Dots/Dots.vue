<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { createDots, type DotsController } from '@jolt/core/webgl/dots';

// Mirrors `dotsSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  color?: string;
  count?: number;
  size?: number;
  amplitude?: number;
  frequency?: number;
  speed?: number;
  opacity?: number;
}
const props = defineProps<Props>();
const root = ref<HTMLDivElement | null>(null);
let controller: DotsController | null = null;

onMounted(() => {
  if (root.value) controller = createDots(root.value, props);
});
onBeforeUnmount(() => controller?.revert());
</script>

<template>
  <div ref="root" aria-hidden="true" class="h-full w-full" />
</template>
