<script setup lang="ts">
import { computed } from 'vue';
import { splitSegments } from '@jolt/core';
import '@jolt/core/styles/blur-in.css';

// Mirrors `blurInSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  text: string;
  by?: 'chars' | 'words';
  blur?: number;
  stagger?: number;
  duration?: number;
  delay?: number;
}
const {
  text,
  by = 'chars',
  blur = 10,
  stagger = 0.05,
  duration = 0.6,
  delay = 0,
} = defineProps<Props>();

const segments = computed(() => splitSegments(text, by));
const rootStyle = computed(() => ({
  '--jolt-blur': `${blur}px`,
  '--jolt-stagger': `${stagger}s`,
  '--jolt-duration': `${duration}s`,
  '--jolt-delay': `${delay}s`,
}));
</script>

<template>
  <span class="jolt-blur-in" :aria-label="text" :style="rootStyle"
    ><span
      v-for="(segment, i) in segments"
      :key="i"
      data-jolt-segment
      aria-hidden="true"
      :style="{ '--jolt-i': i }"
      >{{ segment }}</span
    ></span
  >
</template>
