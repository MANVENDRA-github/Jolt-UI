<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { createSplitText, splitSegments, type SplitTextController } from '@jolt/core';

/**
 * Mirrors `splitTextSchema` in @jolt/core. Declared locally because Vue's SFC
 * compiler cannot resolve the schema-inferred (`z.input`) type inside `defineProps`.
 * Keep in sync with the schema (see DECISIONS D-011).
 */
interface Props {
  text: string;
  by?: 'chars' | 'words';
  stagger?: number;
  duration?: number;
  delay?: number;
  y?: number;
}

const props = withDefaults(defineProps<Props>(), { by: 'chars' });
const root = ref<HTMLSpanElement | null>(null);
const segments = computed(() => splitSegments(props.text, props.by));
let controller: SplitTextController | null = null;

onMounted(() => {
  if (root.value) controller = createSplitText(root.value, props);
});
onBeforeUnmount(() => controller?.revert());
</script>

<template>
  <span ref="root" :aria-label="props.text" class="inline-block"
    ><span
      v-for="(segment, i) in segments"
      :key="i"
      data-jolt-segment
      aria-hidden="true"
      class="inline-block whitespace-pre will-change-transform"
      >{{ segment }}</span
    ></span
  >
</template>
