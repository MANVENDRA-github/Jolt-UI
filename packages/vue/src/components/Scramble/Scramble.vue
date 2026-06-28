<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { createScramble, type ScrambleController } from '@jolt/core';

// Mirrors `scrambleSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  text: string;
  duration?: number;
  delay?: number;
  chars?: string;
  revealDelay?: number;
  speed?: number;
}
const props = defineProps<Props>();
const root = ref<HTMLSpanElement | null>(null);
let controller: ScrambleController | null = null;

onMounted(() => {
  if (root.value) controller = createScramble(root.value, props);
});
onBeforeUnmount(() => controller?.revert());
</script>

<template>
  <span ref="root" :aria-label="props.text">{{ props.text }}</span>
</template>
