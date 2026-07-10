<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue';
import { trackDock, type DockController } from '@jolt/core';
import '@jolt/core/styles/dock.css';

// Mirrors `dockSchema` in @jolt/core (Vue's SFC compiler can't resolve the schema-inferred
// type in defineProps — see DECISIONS D-011).
interface Props {
  items?: string[];
  size?: number;
  magnification?: number;
  range?: number;
  color?: string;
}
const {
  items = ['Home', 'Search', 'Files', 'Mail', 'Trash'],
  size = 44,
  magnification = 1.8,
  range = 140,
  color = '#7c5cff',
} = defineProps<Props>();

const root = ref<HTMLDivElement | null>(null);
let controller: DockController | null = null;
onMounted(() => {
  if (root.value) controller = trackDock(root.value, { range, maxScale: magnification });
});
onBeforeUnmount(() => controller?.revert());

const style = computed(() => ({ '--jolt-size': `${size}px`, '--jolt-color': color }));
</script>

<template>
  <div ref="root" class="jolt-dock" :style="style" role="list">
    <span
      v-for="(label, i) in items"
      :key="i"
      data-jolt-dock-item
      role="listitem"
      :aria-label="label"
      :title="label"
      >{{ label.slice(0, 1) }}</span
    >
  </div>
</template>
