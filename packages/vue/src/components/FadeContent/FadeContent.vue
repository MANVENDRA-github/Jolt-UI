<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { observeReveal, type RevealController } from '@jolt/core';
import '@jolt/core/styles/fade-content.css';

// Mirrors `fadeContentSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  duration?: number;
  delay?: number;
  blur?: number;
}
const { duration = 0.7, delay = 0, blur = 6 } = defineProps<Props>();

const root = ref<HTMLDivElement | null>(null);
let controller: RevealController | null = null;
// Hide the content until it scrolls into view. Visible by default — the behavior only arms
// it when a real IntersectionObserver exists and motion is allowed.
onMounted(() => {
  if (root.value) controller = observeReveal(root.value);
});
onBeforeUnmount(() => controller?.revert());

const style = computed(() => ({
  '--jolt-duration': `${duration}s`,
  '--jolt-delay': `${delay}s`,
  '--jolt-blur': `${blur}px`,
}));
</script>

<template>
  <div ref="root" class="jolt-fade-content" :style="style"><slot /></div>
</template>
