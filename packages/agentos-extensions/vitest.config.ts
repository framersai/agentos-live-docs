import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'scripts/',
        'templates/',
        '**/*.config.ts',
        '**/*.spec.ts',
        '**/*.test.ts'
      ],
      include: [
        'test/**/*.ts'
      ]
    },
    include: ['test/**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    testTimeout: 15000
  },
  resolve: {
    alias: {
      '@agentos/core': path.resolve(__dirname, '../../packages/agentos/src')
    }
  }
});
