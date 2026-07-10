<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { createIridescence, type IridescenceController } from '@jolt/core/webgl/iridescence';

// Mirrors `iridescenceSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  colors?: string[];
  speed?: number;
  scale?: number;
  amplitude?: number;
  opacity?: number;
}
const props = defineProps<Props>();
const root = ref<HTMLDivElement | null>(null);
let controller: IridescenceController | null = null;

onMounted(() => {
  if (root.value) controller = createIridescence(root.value, props);
});
onBeforeUnmount(() => controller?.revert());
</script>

<template>
  <div ref="root" aria-hidden="true" class="h-full w-full" />
</template>
