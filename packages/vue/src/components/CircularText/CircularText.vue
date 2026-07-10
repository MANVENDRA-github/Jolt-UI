<script setup lang="ts">
import { computed } from 'vue';
import { splitSegments } from '@jolt/core';
import '@jolt/core/styles/circular-text.css';

// Mirrors `circularTextSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  text: string;
  by?: 'chars' | 'words';
  radius?: number;
  speed?: number;
}
const { text, by = 'chars', radius = 48, speed = 14 } = defineProps<Props>();

const segments = computed(() => splitSegments(text, by));
// Each segment sits at `i / count` of a turn, so the stylesheet needs the total count.
const rootStyle = computed(() => ({
  '--jolt-radius': `${radius}px`,
  '--jolt-speed': `${speed}s`,
  '--jolt-count': segments.value.length,
}));
</script>

<template>
  <span class="jolt-circular-text" :aria-label="text" :style="rootStyle"
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
