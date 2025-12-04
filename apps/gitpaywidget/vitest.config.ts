import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    exclude: ['tests/e2e/**'],
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['lib/**/*.ts', 'app/api/**/*.ts'],
      exclude: ['**/*.d.ts', '**/types.ts'],
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@gitpaywidget/payments-core': resolve(__dirname, '../../packages/payments-core/src'),
      '@gitpaywidget/widget': resolve(__dirname, '../../packages/gitpaywidget-widget/src'),
      '@gitpaywidget/sdk': resolve(__dirname, '../../packages/gitpaywidget-sdk/src'),
    },
  },
});
