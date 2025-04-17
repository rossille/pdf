import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin', '@babel/plugin-syntax-import-assertions'],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    css: true,
    deps: {
      optimizer: {
        web: {
          include: ['@emotion/react', '@emotion/styled']
        }
      }
    },
    mockReset: true,
    restoreMocks: true,
  },
});