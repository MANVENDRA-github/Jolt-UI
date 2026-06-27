<script setup lang="ts">
import { computed } from 'vue';
import '@jolt/core/styles/shiny-text.css';

// Mirrors `shinyTextSchema` in @jolt/core (see DECISIONS D-011).
interface Props {
  text: string;
  duration?: number;
}
const { text, duration = 3 } = defineProps<Props>();

const style = computed(() => ({ '--jolt-duration': `${duration}s` }));
</script>

<template>
  <span class="jolt-shiny-text" :style="style">{{ text }}</span>
</template>
