<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { createParticles, type ParticlesController } from '@jolt/core/webgl/particles';

// Mirrors `particlesSchema` in @jolt/core (Vue's SFC compiler can't resolve the
// schema-inferred type in defineProps — see DECISIONS D-011).
interface Props {
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
  spread?: number;
  opacity?: number;
}
const props = defineProps<Props>();
const root = ref<HTMLDivElement | null>(null);
let controller: ParticlesController | null = null;

onMounted(() => {
  if (root.value) controller = createParticles(root.value, props);
});
onBeforeUnmount(() => controller?.revert());
</script>

<template>
  <div ref="root" aria-hidden="true" class="h-full w-full" />
</template>
