<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { attachClickSpark, type SparkController } from '@jolt/core';
import '@jolt/core/styles/click-spark.css';

// Mirrors `clickSparkSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  color?: string;
  size?: number;
  speed?: number;
}
const { color = '#c6ff4f', size = 12, speed = 0.45 } = defineProps<Props>();

const root = ref<HTMLDivElement | null>(null);
let controller: SparkController | null = null;
// Emit a burst of CSS rays from every click.
onMounted(() => {
  if (root.value) controller = attachClickSpark(root.value);
});
onBeforeUnmount(() => controller?.revert());

const style = computed(() => ({
  '--jolt-color': color,
  '--jolt-size': `${size}px`,
  '--jolt-speed': `${speed}s`,
}));
</script>

<template>
  <div ref="root" class="jolt-click-spark" :style="style"><slot /></div>
</template>
