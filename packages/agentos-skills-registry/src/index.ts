/**
 * @fileoverview AgentOS Skills Registry Bundle.
 *
 * Single-import package that discovers and loads curated AgentOS skills
 * from the `@framers/agentos-skills` catalog.
 *
 * @module @framers/agentos-skills-registry
 */

import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { createRequire } from 'node:module';

import {
  SkillRegistry,
  type SkillSnapshot,
  type SkillsConfig,
  type SkillEligibilityContext,
} from '@framers/agentos/skills';

export type { SkillSnapshot, SkillsConfig, SkillEligibilityContext };

// Re-export the programmatic catalog
export {
  SKILLS_CATALOG,
  getSkillsByCategory,
  getSkillByName,
  getAvailableSkills,
  getCategories,
  getSkillsByTag,
  searchSkills,
} from './catalog.js';
export type { SkillCatalogEntry } from './catalog.js';

const require = createRequire(import.meta.url);

export type CuratedSkillsSelection = 'all' | 'none' | string[];

export interface CuratedSkillsOptions {
  /** Which curated skills to include. Default: 'all'. */
  skills?: CuratedSkillsSelection;
  /** Optional skills config (disable entries, env overrides, etc.). */
  config?: SkillsConfig;
  /** Platform filter for snapshot building. */
  platform?: string;
  /** Eligibility filter for snapshot building. */
  eligibility?: SkillEligibilityContext;
}

export interface SkillsCatalogEntry {
  id: string;
  name: string;
  version: string;
  path: string;
  description: string;
  verified: boolean;
  verifiedAt?: string;
  keywords?: string[];
  metadata?: Record<string, unknown>;
}

export interface SkillsCatalog {
  version: string;
  updated: string;
  categories: { curated: string[]; community: string[] };
  skills: { curated: SkillsCatalogEntry[]; community: SkillsCatalogEntry[] };
  stats?: Record<string, unknown>;
}

function resolveCatalogPath(): string {
  return require.resolve('@framers/agentos-skills/registry.json');
}

function resolveSkillsPackageDir(): string {
  const pkgJsonPath = require.resolve('@framers/agentos-skills/package.json');
  return path.dirname(pkgJsonPath);
}

/**
 * Absolute path to the bundled curated skills directory.
 *
 * This directory can be passed to `SkillRegistry.loadFromDirs([dir])`.
 */
export function getBundledCuratedSkillsDir(): string {
  return path.join(resolveSkillsPackageDir(), 'registry', 'curated');
}

/**
 * Absolute path to the bundled community skills directory.
 */
export function getBundledCommunitySkillsDir(): string {
  return path.join(resolveSkillsPackageDir(), 'registry', 'community');
}

/**
 * Load the `@framers/agentos-skills` catalog JSON.
 */
export async function getSkillsCatalog(): Promise<SkillsCatalog> {
  const registryPath = resolveCatalogPath();
  const raw = await fs.readFile(registryPath, 'utf-8');
  return JSON.parse(raw) as SkillsCatalog;
}

/**
 * Convenience: list curated skills from the catalog.
 */
export async function getAvailableCuratedSkills(): Promise<SkillsCatalogEntry[]> {
  const catalog = await getSkillsCatalog();
  return catalog.skills.curated ?? [];
}

/**
 * Create a SkillRegistry loaded with bundled curated skills.
 */
export async function createCuratedSkillRegistry(
  options?: Pick<CuratedSkillsOptions, 'config'>
): Promise<SkillRegistry> {
  const registry = new SkillRegistry(options?.config);
  await registry.loadFromDirs([getBundledCuratedSkillsDir()]);
  return registry;
}

/**
 * Build a SkillSnapshot from bundled curated skills.
 */
export async function createCuratedSkillSnapshot(
  options?: CuratedSkillsOptions
): Promise<SkillSnapshot> {
  const createdAt = new Date();
  const selection = options?.skills ?? 'all';

  if (selection === 'none') {
    return {
      prompt: '',
      skills: [],
      resolvedSkills: [],
      version: 1,
      createdAt,
    };
  }

  const registry = await createCuratedSkillRegistry({ config: options?.config });
  const filter = Array.isArray(selection) ? selection : undefined;

  return registry.buildSnapshot({
    platform: options?.platform,
    eligibility: options?.eligibility,
    filter,
  });
}
