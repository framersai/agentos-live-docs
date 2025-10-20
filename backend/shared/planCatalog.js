// Runtime bridge for the shared plan catalog so dev (`tsx`) and build (`tsc`) environments
// both resolve `../../../shared/planCatalog.js` without duplicating the catalog content.

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(backendRoot, '..');

const candidatePaths = [
  // Source of truth while running the TS dev server.
  path.resolve(repoRoot, 'shared', 'planCatalog.ts'),
  // Compiled output generated via `npm run build:shared`.
  path.resolve(backendRoot, 'dist', 'shared', 'planCatalog.js'),
];

let planCatalogModule = null;
let lastError = null;

for (const candidate of candidatePaths) {
  if (!fs.existsSync(candidate)) {
    continue;
  }
  try {
    planCatalogModule = await import(pathToFileURL(candidate).href);
    break;
  } catch (error) {
    lastError = error;
  }
}

if (!planCatalogModule) {
  const searched = candidatePaths.join(', ');
  throw new Error(
    `[PlanCatalogBridge] Unable to load shared plan catalog. Checked: ${searched}${
      lastError ? `. Last error: ${String(lastError)}` : ''
    }`,
  );
}

export const PLAN_CATALOG = planCatalogModule.PLAN_CATALOG;
export const PUBLIC_PLAN_ORDER = planCatalogModule.PUBLIC_PLAN_ORDER;
export const getPublicPlans = planCatalogModule.getPublicPlans;
export const findPlanById = planCatalogModule.findPlanById;
export const PLAN_ROLLOVER_RULES = planCatalogModule.PLAN_ROLLOVER_RULES;
export const GPT4O_COST_PER_KTOKENS = planCatalogModule.GPT4O_COST_PER_KTOKENS;
export const GPT4O_MINI_COST_PER_KTOKENS = planCatalogModule.GPT4O_MINI_COST_PER_KTOKENS;
