<script setup lang="ts">
import { computed } from 'vue';
import { splitSegments } from '@jolt/core';
import '@jolt/core/styles/true-focus.css';

// Mirrors `trueFocusSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  text: string;
  by?: 'chars' | 'words';
  blur?: number;
  dim?: number;
  speed?: number;
}
const { text, by = 'chars', blur = 4, dim = 0.55, speed = 0.28 } = defineProps<Props>();

const segments = computed(() => splitSegments(text, by));
// The sweep's cycle is `speed` per segment, so the stylesheet needs the total count.
const rootStyle = computed(() => ({
  '--jolt-blur': `${blur}px`,
  '--jolt-dim': dim,
  '--jolt-speed': `${speed}s`,
  '--jolt-count': segments.value.length,
}));
</script>

<template>
  <span class="jolt-true-focus" :aria-label="text" :style="rootStyle"
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
