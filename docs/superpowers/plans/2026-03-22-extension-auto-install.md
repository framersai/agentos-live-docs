# Extension Auto-Install & Smart Recommendations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire auto-install, secret prompting, and smart extension recommendations into the wunderland CLI so users get a guided experience from init to running agent.

**Architecture:** Three new modules in `packages/wunderland/src/cli/extensions/` (installer, secret-prompter, recommender) integrated into existing marketplace, start, and init commands. Credential-based recommendations replace the current silent Google auto-enable.

**Tech Stack:** Node.js child_process, existing SECRET_ENV_MAP from @framers/agentos-extensions-registry, existing agent.config.json schema, vitest for tests.

---

## File Structure

| Action | File                                         | Responsibility                                                    |
| ------ | -------------------------------------------- | ----------------------------------------------------------------- |
| Create | `src/cli/extensions/installer.ts`            | Package manager detection + npm/pnpm/yarn install                 |
| Create | `src/cli/extensions/secret-prompter.ts`      | Prompt for missing API keys, persist to .env                      |
| Create | `src/cli/extensions/recommender.ts`          | Scan env for credentials, map to extensions, generate suggestions |
| Modify | `src/cli/commands/marketplace.ts`            | Wire installer + secret-prompter into `install` subcommand        |
| Modify | `src/cli/commands/start/extension-loader.ts` | Remove silent Google auto-enable, wire recommender                |
| Create | `tests/cli/extensions/installer.spec.ts`     | Unit tests for package manager detection                          |
| Create | `tests/cli/extensions/recommender.spec.ts`   | Unit tests for credential-to-extension mapping                    |

---

### Task 1: Package Manager Detection (`installer.ts`)

**Files:**

- Create: `packages/wunderland/src/cli/extensions/installer.ts`
- Create: `packages/wunderland/tests/cli/extensions/installer.spec.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// packages/wunderland/tests/cli/extensions/installer.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { detectPackageManager } from '../../src/cli/extensions/installer.js';
import { existsSync } from 'node:fs';

vi.mock('node:fs', () => ({ existsSync: vi.fn() }));

describe('detectPackageManager', () => {
  beforeEach(() => vi.mocked(existsSync).mockReturnValue(false));

  it('detects pnpm from pnpm-lock.yaml', () => {
    vi.mocked(existsSync).mockImplementation((p: any) => String(p).includes('pnpm-lock.yaml'));
    expect(detectPackageManager('/tmp/test')).toBe('pnpm');
  });

  it('detects yarn from yarn.lock', () => {
    vi.mocked(existsSync).mockImplementation((p: any) => String(p).includes('yarn.lock'));
    expect(detectPackageManager('/tmp/test')).toBe('yarn');
  });

  it('detects bun from bun.lockb', () => {
    vi.mocked(existsSync).mockImplementation((p: any) => String(p).includes('bun.lockb'));
    expect(detectPackageManager('/tmp/test')).toBe('bun');
  });

  it('falls back to npm', () => {
    expect(detectPackageManager('/tmp/test')).toBe('npm');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/wunderland && npx vitest run tests/cli/extensions/installer.spec.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write installer implementation**

```typescript
// packages/wunderland/src/cli/extensions/installer.ts
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

/**
 * Detects the project's package manager by checking for lockfiles.
 * Priority: pnpm > yarn > bun > npm (fallback).
 */
export function detectPackageManager(cwd?: string): 'pnpm' | 'yarn' | 'bun' | 'npm' {
  const dir = cwd ?? process.cwd();
  if (existsSync(join(dir, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(dir, 'yarn.lock'))) return 'yarn';
  if (existsSync(join(dir, 'bun.lockb'))) return 'bun';
  return 'npm';
}

const ADD_CMD: Record<string, string> = {
  pnpm: 'pnpm add',
  yarn: 'yarn add',
  bun: 'bun add',
  npm: 'npm install',
};

const REMOVE_CMD: Record<string, string> = {
  pnpm: 'pnpm remove',
  yarn: 'yarn remove',
  bun: 'bun remove',
  npm: 'npm uninstall',
};

/**
 * Installs an npm package using the detected package manager.
 * Returns true on success, false on failure (logs stderr).
 */
export async function installExtension(
  packageName: string,
  opts?: { cwd?: string; dev?: boolean }
): Promise<boolean> {
  const pm = detectPackageManager(opts?.cwd);
  const devFlag = opts?.dev ? ' -D' : '';
  const cmd = `${ADD_CMD[pm]}${devFlag} ${packageName}`;
  try {
    execSync(cmd, {
      cwd: opts?.cwd ?? process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 120_000,
    });
    return true;
  } catch (err: any) {
    const stderr = err?.stderr?.toString() ?? err?.message ?? 'Unknown error';
    console.error(`Failed to install ${packageName}: ${stderr}`);
    return false;
  }
}

/**
 * Uninstalls an npm package.
 */
export async function uninstallExtension(
  packageName: string,
  opts?: { cwd?: string }
): Promise<boolean> {
  const pm = detectPackageManager(opts?.cwd);
  const cmd = `${REMOVE_CMD[pm]} ${packageName}`;
  try {
    execSync(cmd, {
      cwd: opts?.cwd ?? process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 60_000,
    });
    return true;
  } catch (err: any) {
    console.error(`Failed to uninstall ${packageName}: ${err?.message}`);
    return false;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/wunderland && npx vitest run tests/cli/extensions/installer.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/wunderland/src/cli/extensions/installer.ts packages/wunderland/tests/cli/extensions/installer.spec.ts
git commit -m "feat(cli): add package manager detection and extension installer"
```

---

### Task 2: Secret Prompter (`secret-prompter.ts`)

**Files:**

- Create: `packages/wunderland/src/cli/extensions/secret-prompter.ts`

- [ ] **Step 1: Write secret prompter**

```typescript
// packages/wunderland/src/cli/extensions/secret-prompter.ts
import { readFileSync, appendFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createInterface } from 'node:readline';

export interface SecretPromptResult {
  key: string;
  envVar: string;
  value: string;
  persisted: boolean;
}

interface SecretRequirement {
  id: string;
  envVar: string;
  signupUrl?: string;
  freeTier?: string;
}

/**
 * Prompts user for missing API keys required by an extension.
 * Persists entered values to .env in the project root.
 */
export async function promptForMissingSecrets(
  secrets: SecretRequirement[],
  opts?: { cwd?: string; nonInteractive?: boolean }
): Promise<SecretPromptResult[]> {
  const results: SecretPromptResult[] = [];
  const envPath = join(opts?.cwd ?? process.cwd(), '.env');

  // Parse existing .env to avoid duplicates
  const existing = parseEnvFile(envPath);

  for (const secret of secrets) {
    // Skip if already in environment or .env
    if (process.env[secret.envVar] || existing[secret.envVar]) continue;

    if (opts?.nonInteractive) {
      console.log(`  ⚠ ${secret.envVar} required — set it in .env or environment`);
      continue;
    }

    console.log(`\n  ${secret.id} requires ${secret.envVar}`);
    if (secret.signupUrl) console.log(`  Sign up: ${secret.signupUrl}`);
    if (secret.freeTier) console.log(`  Free tier: ${secret.freeTier}`);

    const value = await askLine(`  Enter ${secret.envVar} (or press Enter to skip): `);
    if (!value) continue;

    // Append to .env
    const line = `\n# Added by wunderland marketplace install\n${secret.envVar}=${value}\n`;
    appendFileSync(envPath, line, 'utf8');
    process.env[secret.envVar] = value;

    results.push({
      key: secret.id,
      envVar: secret.envVar,
      value,
      persisted: true,
    });
  }

  return results;
}

function parseEnvFile(path: string): Record<string, string> {
  if (!existsSync(path)) return {};
  const content = readFileSync(path, 'utf8');
  const vars: Record<string, string> = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      vars[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
    }
  }
  return vars;
}

function askLine(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/wunderland/src/cli/extensions/secret-prompter.ts
git commit -m "feat(cli): add secret prompter for extension API keys"
```

---

### Task 3: Smart Recommender (`recommender.ts`)

**Files:**

- Create: `packages/wunderland/src/cli/extensions/recommender.ts`
- Create: `packages/wunderland/tests/cli/extensions/recommender.spec.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// packages/wunderland/tests/cli/extensions/recommender.spec.ts
import { describe, it, expect } from 'vitest';
import { getRecommendations } from '../../src/cli/extensions/recommender.js';

describe('getRecommendations', () => {
  it('recommends news-search when NEWSAPI_API_KEY is set', async () => {
    const recs = await getRecommendations({
      env: { NEWSAPI_API_KEY: 'test-key' },
      enabledExtensions: [],
    });
    const match = recs.find((r) => r.extensionId === 'news-search');
    expect(match).toBeDefined();
    expect(match!.reason).toBe('credential_detected');
  });

  it('skips already-enabled extensions', async () => {
    const recs = await getRecommendations({
      env: { SERPER_API_KEY: 'test-key' },
      enabledExtensions: ['web-search'],
    });
    const match = recs.find((r) => r.extensionId === 'web-search');
    expect(match).toBeUndefined();
  });

  it('returns empty array when no credentials detected', async () => {
    const recs = await getRecommendations({ env: {}, enabledExtensions: [] });
    expect(recs).toEqual([]);
  });

  it('recommends both gmail and calendar for Google credentials', async () => {
    const recs = await getRecommendations({
      env: {
        GOOGLE_CLIENT_ID: 'id',
        GOOGLE_CLIENT_SECRET: 'secret',
        GOOGLE_REFRESH_TOKEN: 'token',
      },
      enabledExtensions: [],
    });
    const ids = recs.map((r) => r.extensionId);
    expect(ids).toContain('email-gmail');
    expect(ids).toContain('calendar-google');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/wunderland && npx vitest run tests/cli/extensions/recommender.spec.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write recommender implementation**

```typescript
// packages/wunderland/src/cli/extensions/recommender.ts

export interface ExtensionRecommendation {
  extensionId: string;
  packageName: string;
  reason: 'credential_detected' | 'skill_requires' | 'preset_default';
  displayName: string;
  envVar?: string;
}

/**
 * Credential-to-extension mapping.
 * Each entry maps one or more env vars to an extension that should be suggested.
 */
const CREDENTIAL_MAP: Array<{
  envVars: string[];
  allRequired: boolean;
  extensionId: string;
  packageName: string;
  displayName: string;
}> = [
  {
    envVars: ['NEWSAPI_API_KEY'],
    allRequired: false,
    extensionId: 'news-search',
    packageName: '@framers/agentos-ext-news-search',
    displayName: 'News Search (NewsAPI)',
  },
  {
    envVars: ['SERPER_API_KEY'],
    allRequired: false,
    extensionId: 'web-search',
    packageName: '@framers/agentos-ext-web-search',
    displayName: 'Web Search (Serper)',
  },
  {
    envVars: ['GIPHY_API_KEY'],
    allRequired: false,
    extensionId: 'giphy',
    packageName: '@framers/agentos-ext-giphy',
    displayName: 'Giphy',
  },
  {
    envVars: ['ELEVENLABS_API_KEY'],
    allRequired: false,
    extensionId: 'voice-synthesis',
    packageName: '@framers/agentos-ext-voice-synthesis',
    displayName: 'Voice Synthesis (ElevenLabs)',
  },
  {
    envVars: ['GITHUB_TOKEN'],
    allRequired: false,
    extensionId: 'github',
    packageName: '@framers/agentos-ext-github',
    displayName: 'GitHub',
  },
  {
    envVars: ['TELEGRAM_BOT_TOKEN'],
    allRequired: false,
    extensionId: 'telegram',
    packageName: '@framers/agentos-ext-telegram',
    displayName: 'Telegram',
  },
  {
    envVars: ['DISCORD_BOT_TOKEN'],
    allRequired: false,
    extensionId: 'discord',
    packageName: '@framers/agentos-ext-discord',
    displayName: 'Discord',
  },
  {
    envVars: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REFRESH_TOKEN'],
    allRequired: true,
    extensionId: 'email-gmail',
    packageName: '@framers/agentos-ext-email-gmail',
    displayName: 'Gmail',
  },
  {
    envVars: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REFRESH_TOKEN'],
    allRequired: true,
    extensionId: 'calendar-google',
    packageName: '@framers/agentos-ext-calendar-google',
    displayName: 'Google Calendar',
  },
];

/**
 * Scans environment for known API keys and recommends matching extensions.
 * Skips extensions that are already enabled.
 */
export async function getRecommendations(opts: {
  env?: Record<string, string | undefined>;
  enabledExtensions?: string[];
}): Promise<ExtensionRecommendation[]> {
  const env = opts.env ?? process.env;
  const enabled = new Set(opts.enabledExtensions ?? []);
  const recs: ExtensionRecommendation[] = [];

  for (const mapping of CREDENTIAL_MAP) {
    if (enabled.has(mapping.extensionId)) continue;

    const hasCredentials = mapping.allRequired
      ? mapping.envVars.every((v) => !!env[v])
      : mapping.envVars.some((v) => !!env[v]);

    if (!hasCredentials) continue;

    recs.push({
      extensionId: mapping.extensionId,
      packageName: mapping.packageName,
      reason: 'credential_detected',
      displayName: mapping.displayName,
      envVar: mapping.envVars[0],
    });
  }

  return recs;
}

/**
 * Formats recommendations as a CLI-friendly table.
 */
export function formatRecommendations(recs: ExtensionRecommendation[]): string {
  if (recs.length === 0) return '';
  const lines = ['', '  Recommended extensions (credentials detected):', ''];
  for (const r of recs) {
    lines.push(`    ${r.displayName} (${r.extensionId}) — ${r.envVar} found`);
  }
  lines.push('');
  return lines.join('\n');
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/wunderland && npx vitest run tests/cli/extensions/recommender.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/wunderland/src/cli/extensions/recommender.ts packages/wunderland/tests/cli/extensions/recommender.spec.ts
git commit -m "feat(cli): add credential-based extension recommender"
```

---

### Task 4: Wire Installer into Marketplace Command

**Files:**

- Modify: `packages/wunderland/src/cli/commands/marketplace.ts`

- [ ] **Step 1: Read the existing marketplace.ts install subcommand**

Check the current `install` subcommand (around lines 160-216). It currently just prints the install command.

- [ ] **Step 2: Replace the `install` subcommand with auto-install flow**

In the `install` handler, after resolving the item:

1. Call `installExtension(item.packageName)`
2. If success, prompt to enable via existing `enableExtension()` logic
3. Look up required secrets from `SECRET_ENV_MAP`
4. Call `promptForMissingSecrets()` for any missing keys
5. Print success summary

Import the new modules:

```typescript
import { installExtension } from '../../extensions/installer.js';
import { promptForMissingSecrets } from '../../extensions/secret-prompter.js';
```

Replace the existing `console.log(\`Install: pnpm add ${item.packageName}\`)` block with the actual install + prompt flow.

- [ ] **Step 3: Commit**

```bash
git add packages/wunderland/src/cli/commands/marketplace.ts
git commit -m "feat(cli): marketplace install now auto-installs + prompts for secrets"
```

---

### Task 5: Wire Recommender into Start Command + Remove Silent Google Auto-Enable

**Files:**

- Modify: `packages/wunderland/src/cli/commands/start/extension-loader.ts`

- [ ] **Step 1: Remove silent Google auto-enable (lines 149-171)**

Find and remove the block that auto-adds `email-gmail` and `calendar-google` based on Google credentials. This logic is now handled by the recommender with user confirmation.

- [ ] **Step 2: Add recommender call before extension loading**

After loading the agent config and resolving extension lists, but before calling `resolveExtensionsByNames()`:

```typescript
import { getRecommendations, formatRecommendations } from '../../extensions/recommender.js';
import { installExtension } from '../../extensions/installer.js';
import { createInterface } from 'node:readline';

// Gather currently enabled extensions
const allEnabled = [
  ...(toolExtensions ?? []),
  ...(voiceExtensions ?? []),
  ...(productivityExtensions ?? []),
];

const recs = await getRecommendations({
  env: process.env,
  enabledExtensions: allEnabled,
});

if (recs.length > 0 && !ctx.noRecommendations) {
  const summary = formatRecommendations(recs);
  console.log(summary);

  if (ctx.yes) {
    // --yes flag: auto-accept all
    for (const r of recs) {
      toolExtensions.push(r.extensionId);
    }
  } else {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const answer = await new Promise<string>((resolve) =>
      rl.question('  Enable recommended extensions? (y/n): ', (a) => {
        rl.close();
        resolve(a.trim().toLowerCase());
      })
    );
    if (answer === 'y' || answer === 'yes') {
      for (const r of recs) {
        toolExtensions.push(r.extensionId);
      }
    }
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add packages/wunderland/src/cli/commands/start/extension-loader.ts
git commit -m "feat(cli): recommend extensions on start, remove silent Google auto-enable"
```

---

### Task 6: Export New Modules from Extensions Index

**Files:**

- Modify: `packages/wunderland/src/cli/extensions/` — create or update index.ts barrel

- [ ] **Step 1: Create barrel export if missing**

```typescript
// packages/wunderland/src/cli/extensions/index.ts
export { normalizeExtensionName, normalizeExtensionList } from './aliases.js';
export { mergeExtensionOverrides } from './settings.js';
export { detectPackageManager, installExtension, uninstallExtension } from './installer.js';
export { promptForMissingSecrets } from './secret-prompter.js';
export { getRecommendations, formatRecommendations } from './recommender.js';
```

- [ ] **Step 2: Commit and push**

```bash
git add packages/wunderland/src/cli/extensions/
git commit -m "feat(cli): export installer, secret-prompter, recommender from extensions barrel"
git push
```

---

### Task 7: Verify Build

- [ ] **Step 1: Run TypeScript build**

```bash
cd packages/wunderland && npx tsc -p tsconfig.build.json --noEmit
```

Expected: No errors

- [ ] **Step 2: Run all tests**

```bash
cd packages/wunderland && npx vitest run tests/cli/extensions/
```

Expected: All pass

- [ ] **Step 3: Final commit and push**

```bash
git push
```
