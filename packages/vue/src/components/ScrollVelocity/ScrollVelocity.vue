<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { createScrollVelocity, type ScrollVelocityController } from '@jolt/core';

// Mirrors `scrollVelocitySchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  text: string;
  baseVelocity?: number;
  direction?: 'left' | 'right';
}
const props = defineProps<Props>();
const root = ref<HTMLSpanElement | null>(null);
const copies = 8;
let controller: ScrollVelocityController | null = null;

onMounted(() => {
  if (root.value) controller = createScrollVelocity(root.value, props);
});
onBeforeUnmount(() => controller?.revert());
</script>

<template>
  <span ref="root" class="block overflow-hidden whitespace-nowrap" :aria-label="props.text"
    ><span class="inline-block will-change-transform" data-jolt-track aria-hidden="true"
      ><span v-for="i in copies" :key="i" class="inline-block pr-8">{{ props.text }}</span></span
    ></span
  >
</template>
