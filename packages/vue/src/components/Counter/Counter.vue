<script setup lang="ts">
import { computed } from 'vue';
import { counterCells } from '@jolt/core';
import '@jolt/core/styles/counter.css';

// Mirrors `counterSchema` in @jolt/core (D-011).
interface Props {
  value?: number;
  digits?: number;
  duration?: number;
  color?: string;
}
const { value = 2025, digits = 1, duration = 1.1, color = '#7c5cff' } = defineProps<Props>();

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const cells = computed(() => counterCells(value, digits));
const style = computed(() => ({ '--jolt-duration': `${duration}s`, '--jolt-color': color }));
</script>

<template>
  <span class="jolt-counter" :style="style" :aria-label="cells.label" role="img"
    ><span v-for="(digit, i) in cells.digits" :key="i" data-jolt-col aria-hidden="true"
      ><span data-jolt-strip :style="{ '--jolt-digit': digit }"
        ><span v-for="d in DIGITS" :key="d">{{ d }}</span></span
      ></span
    ></span
  >
</template>
