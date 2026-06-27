import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    name: 'vue',
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.ts'],
  },
});
