<script setup lang="ts">
const { name = 'World' } = defineProps<{ name?: string }>();
</script>

<template>
  <span data-framework="vue">Hello {{ name }} from Vue</span>
</template>
