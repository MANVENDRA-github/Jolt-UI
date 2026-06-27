import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

// Phase 0: lint TS/JS only. Framework files (.vue/.svelte/.astro) are type-checked
// by vue-tsc / svelte-check / astro check; dedicated ESLint plugins are deferred.
export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/.astro/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/*.vue',
      '**/*.svelte',
      '**/*.astro',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,mjs,cjs}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
);
