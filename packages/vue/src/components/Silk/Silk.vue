<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { createSilk, type SilkController } from '@jolt/core/webgl/silk';

// Mirrors `silkSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  colors?: string[];
  speed?: number;
  scale?: number;
  rotation?: number;
  noise?: number;
  opacity?: number;
}
const props = defineProps<Props>();
const root = ref<HTMLDivElement | null>(null);
let controller: SilkController | null = null;

onMounted(() => {
  if (root.value) controller = createSilk(root.value, props);
});
onBeforeUnmount(() => controller?.revert());
</script>

<template>
  <div ref="root" aria-hidden="true" class="h-full w-full" />
</template>
