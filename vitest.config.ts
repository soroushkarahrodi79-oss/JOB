import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

// One jsdom environment for the whole workspace. Domain and token tests do not need the DOM but
// are unaffected by it; running everything in jsdom avoids per-project environment drift. Domain
// purity is enforced by the ESLint layer boundary, not by the test environment.
export default defineConfig({
  esbuild: { jsx: 'automatic' },
  resolve: {
    alias: {
      '@platform/domain': fileURLToPath(new URL('./packages/domain/src/index.ts', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./vitest.setup.ts'],
    include: ['packages/*/src/**/*.test.{ts,tsx}'],
  },
});
