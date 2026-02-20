import * as path from 'node:path';
import * as fs from 'node:fs/promises';

import type {
  ITool,
  JSONSchemaObject,
  ToolExecutionContext,
  ToolExecutionResult,
} from '@framers/agentos';

import {
  findSkillEntry,
  loadSkillsRegistry,
  resolveDefaultEnableDir,
  resolveSkillAbsoluteDir,
} from '../catalog.js';

type SkillsEnableInput = {
  skill: string;
  targetDir?: string;
  overwrite?: boolean;
  dryRun?: boolean;
};

type SkillsEnableOutput = {
  skill: string;
  sourceDir: string;
  targetDir: string;
  destDir: string;
  copied: boolean;
};

/**
 * Validates that a resolved path stays within its expected parent directory.
 * Prevents Zip Slip and symlink-following path traversal attacks.
 *
 * Ported from OpenClaw upstream security fix (OC-22).
 */
async function assertPathContainment(
  resolvedPath: string,
  allowedParent: string,
  label: string
): Promise<void> {
  // Resolve both to real paths (follows symlinks)
  let realResolved: string;
  try {
    realResolved = await fs.realpath(resolvedPath);
  } catch {
    // Path doesn't exist yet — resolve the parent to check containment
    const parent = path.dirname(resolvedPath);
    try {
      const realParent = await fs.realpath(parent);
      realResolved = path.join(realParent, path.basename(resolvedPath));
    } catch {
      // Parent doesn't exist either — will be created, treat resolved as-is
      realResolved = path.resolve(resolvedPath);
    }
  }

  const realParent = path.resolve(allowedParent);

  if (!realResolved.startsWith(realParent + path.sep) && realResolved !== realParent) {
    throw new Error(
      `Path containment violation: ${label} "${realResolved}" escapes allowed directory "${realParent}"`
    );
  }
}

/**
 * Recursively checks a directory tree for symlinks and rejects if any are found.
 *
 * Prevents symlink-following attacks in skill packages.
 */
async function rejectSymlinks(dir: string): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    // Use lstat to detect symlinks without following them
    const stat = await fs.lstat(fullPath);
    if (stat.isSymbolicLink()) {
      throw new Error(
        `Symlink detected in skill package: "${fullPath}". Skill packages must not contain symlinks.`
      );
    }
    if (stat.isDirectory()) {
      await rejectSymlinks(fullPath);
    }
  }
}

export class SkillsEnableTool implements ITool<SkillsEnableInput, SkillsEnableOutput> {
  public readonly id = 'agentos-skills-enable-v1';
  public readonly name = 'skills_enable';
  public readonly displayName = 'Enable Skill';
  public readonly description =
    'Copy a curated skill from @framers/agentos-skills-registry into a local skills directory (e.g. ~/.codex/skills or ./skills). This has side effects and should be human-approved.';
  public readonly category = 'system';
  public readonly hasSideEffects = true;

  public readonly inputSchema: JSONSchemaObject = {
    type: 'object',
    required: ['skill'],
    properties: {
      skill: { type: 'string', description: 'Skill name or id to enable' },
      targetDir: {
        type: 'string',
        description:
          'Directory to copy into (default: AGENTOS_SKILLS_DIR, CODEX_HOME/skills, or ~/.codex/skills)',
      },
      overwrite: {
        type: 'boolean',
        description: 'Overwrite if the destination already exists',
        default: false,
      },
      dryRun: {
        type: 'boolean',
        description: 'Return what would happen without copying',
        default: false,
      },
    },
    additionalProperties: false,
  };

  async execute(
    input: SkillsEnableInput,
    _context: ToolExecutionContext
  ): Promise<ToolExecutionResult<SkillsEnableOutput>> {
    try {
      const ref = (input.skill || '').trim();
      if (!ref) {
        return { success: false, error: 'Missing required field: skill' };
      }

      const registry = await loadSkillsRegistry();
      const entry = findSkillEntry(registry, ref);
      if (!entry) {
        return { success: false, error: `Skill not found in catalog: ${ref}` };
      }

      const sourceDir = resolveSkillAbsoluteDir(entry);
      const targetDir = path.resolve(
        (input.targetDir && String(input.targetDir).trim()) || resolveDefaultEnableDir()
      );
      const destDir = path.join(targetDir, entry.name);

      const overwrite = input.overwrite === true;
      const dryRun = input.dryRun === true;

      if (dryRun) {
        return {
          success: true,
          output: {
            skill: entry.name,
            sourceDir,
            targetDir,
            destDir,
            copied: false,
          },
        };
      }

      // Security: reject symlinks in source skill package (Zip Slip / symlink-following prevention)
      await rejectSymlinks(sourceDir);

      await fs.mkdir(targetDir, { recursive: true });

      // Security: verify destDir stays within targetDir (path containment)
      await assertPathContainment(destDir, targetDir, 'destination');

      const exists = await fs
        .stat(destDir)
        .then(() => true)
        .catch(() => false);

      if (exists) {
        if (!overwrite) {
          return {
            success: false,
            error: `Destination already exists: ${destDir} (set overwrite=true to replace)`,
          };
        }
        await fs.rm(destDir, { recursive: true, force: true });
      }

      await fs.cp(sourceDir, destDir, { recursive: true, force: overwrite });

      // Security: verify copied files didn't escape containment (post-copy check)
      await assertPathContainment(destDir, targetDir, 'post-copy destination');

      return {
        success: true,
        output: {
          skill: entry.name,
          sourceDir,
          targetDir,
          destDir,
          copied: true,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || String(error),
      };
    }
  }
}
