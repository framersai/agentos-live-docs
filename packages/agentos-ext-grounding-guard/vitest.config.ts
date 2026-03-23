import { defineConfig } from 'vitest/config';
import path from 'path';
import fs from 'fs';

// Monorepo layout: sibling package at packages/agentos/
const localPath = path.resolve(__dirname, '../agentos/src');
// CI layout: agentos cloned into packages/agentos/ inside this repo
const ciPath = path.resolve(__dirname, '../../../../packages/agentos/src');
// Standalone layout: agentos is a sibling at ../agentos/
const monoPath = path.resolve(__dirname, '../../../../../agentos/src');

const agentosPath = fs.existsSync(localPath)
  ? localPath
  : fs.existsSync(ciPath)
    ? ciPath
    : fs.existsSync(monoPath)
      ? monoPath
      : null;

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.spec.ts'],
    testTimeout: 10000,
  },
  resolve: agentosPath
    ? {
        alias: {
          '@framers/agentos': agentosPath,
        },
      }
    : {},
});
