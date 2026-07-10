<script setup lang="ts">
import { computed } from 'vue';
import { splitSegments } from '@jolt/core';
import '@jolt/core/styles/wave.css';

// Mirrors `waveSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  text: string;
  by?: 'chars' | 'words';
  amplitude?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
}
const {
  text,
  by = 'chars',
  amplitude = 10,
  duration = 1.5,
  stagger = 0.08,
  delay = 0,
} = defineProps<Props>();

const segments = computed(() => splitSegments(text, by));
const rootStyle = computed(() => ({
  '--jolt-amplitude': `${amplitude}px`,
  '--jolt-duration': `${duration}s`,
  '--jolt-stagger': `${stagger}s`,
  '--jolt-delay': `${delay}s`,
}));
</script>

<template>
  <span class="jolt-wave" :aria-label="text" :style="rootStyle"
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
