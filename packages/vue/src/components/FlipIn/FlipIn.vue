<script setup lang="ts">
import { computed } from 'vue';
import { splitSegments } from '@jolt/core';
import '@jolt/core/styles/flip-in.css';

// Mirrors `flipInSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  text: string;
  by?: 'chars' | 'words';
  duration?: number;
  stagger?: number;
  perspective?: number;
  delay?: number;
}
const {
  text,
  by = 'chars',
  duration = 0.6,
  stagger = 0.05,
  perspective = 400,
  delay = 0,
} = defineProps<Props>();

const segments = computed(() => splitSegments(text, by));
const rootStyle = computed(() => ({
  '--jolt-duration': `${duration}s`,
  '--jolt-stagger': `${stagger}s`,
  '--jolt-perspective': `${perspective}px`,
  '--jolt-delay': `${delay}s`,
}));
</script>

<template>
  <span class="jolt-flip-in" :aria-label="text" :style="rootStyle"
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
