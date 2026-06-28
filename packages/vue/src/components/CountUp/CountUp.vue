<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { createCountUp, formatNumber, type CountUpController } from '@jolt/core';

// Mirrors `countUpSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  to: number;
  from?: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  separator?: string;
}
const props = withDefaults(defineProps<Props>(), { from: 0, decimals: 0, separator: '' });
const root = ref<HTMLSpanElement | null>(null);
const initial = computed(() =>
  formatNumber(props.from, { decimals: props.decimals, separator: props.separator }),
);
let controller: CountUpController | null = null;

onMounted(() => {
  if (root.value) controller = createCountUp(root.value, props);
});
onBeforeUnmount(() => controller?.revert());
</script>

<template>
  <span ref="root" class="tabular-nums">{{ initial }}</span>
</template>
