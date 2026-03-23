# Extension Auto-Install, Secret Prompting, and Smart Recommendations

## Goal

Make extension discovery, installation, configuration, and recommendation seamless across the wunderland CLI — so users go from `wunderland init` to a fully configured agent without manually running `npm install` or hunting for env var names.

## Architecture

Three capabilities layered on existing infrastructure:

1. **Auto-install** — `wunderland marketplace install <id>` detects package manager and runs install, then enables in agent.config.json
2. **Secret prompting** — after install, prompt for required API keys if not already in env, persist to `.env` or agent config
3. **Smart recommendations** — on `wunderland start` and `wunderland init`, detect available credentials and installed packages, suggest extensions to enable/install

All gated behind user confirmation (no silent auto-enable). `--yes` flag for CI/automation.

## Tech Stack

- Node.js `child_process.execSync` for package manager detection + install
- Existing `SECRET_ENV_MAP` from `@framers/agentos-extensions-registry`
- Existing `TOOL_CATALOG` / `CHANNEL_CATALOG` for extension metadata
- Existing `agent.config.json` schema for persistence

---

## Component 1: Package Manager Detection + Auto-Install

### File: `packages/wunderland/src/cli/extensions/installer.ts` (new)

Detects package manager by checking lockfiles in priority order:

- `pnpm-lock.yaml` → `pnpm add`
- `yarn.lock` → `yarn add`
- `bun.lockb` → `bun add`
- `package-lock.json` or fallback → `npm install`

```typescript
export function detectPackageManager(cwd?: string): 'pnpm' | 'yarn' | 'bun' | 'npm';
export async function installExtension(
  packageName: string,
  opts?: { cwd?: string; dev?: boolean }
): Promise<boolean>;
export async function uninstallExtension(
  packageName: string,
  opts?: { cwd?: string }
): Promise<boolean>;
```

`installExtension` runs the install command via `execSync`, returns `true` on success. Catches errors and returns `false` with stderr logged.

### Changes to: `packages/wunderland/src/cli/commands/marketplace.ts`

The existing `marketplace install <id>` subcommand currently just prints the install command. Change it to:

1. Resolve `<id>` to npm package name via TOOL_CATALOG / CHANNEL_CATALOG
2. Call `installExtension(packageName)`
3. If success, prompt: "Enable <name> for current agent? (y/n)"
4. If yes, add to `agent.config.json` extensions list
5. Check `SECRET_ENV_MAP` for required secrets
6. If secrets missing, prompt for each one (see Component 2)

---

## Component 2: Secret Prompting

### File: `packages/wunderland/src/cli/extensions/secret-prompter.ts` (new)

After installing an extension, check if it requires API keys. If keys are missing from env, prompt the user interactively.

```typescript
export interface SecretPromptResult {
  key: string;
  value: string;
  persisted: boolean;
}

export async function promptForMissingSecrets(
  extensionId: string,
  opts?: { nonInteractive?: boolean }
): Promise<SecretPromptResult[]>;
```

Flow:

1. Look up required secrets from `SECRET_ENV_MAP` and extension manifest
2. Check `process.env` for each — skip if present
3. For each missing secret:
   - Show: `<name> requires <ENV_VAR>` + signup URL if available + free tier info
   - Prompt: "Enter API key (or press Enter to skip):"
   - If provided, append to `.env` file in project root
4. Return list of configured secrets

### Persistence

Secrets are appended to `.env` in the project root (standard convention). The prompter:

- Reads existing `.env` to avoid duplicates
- Appends new entries with a comment header: `# Added by wunderland marketplace install`
- Never overwrites existing values

---

## Component 3: Smart Recommendations on Start/Init

### File: `packages/wunderland/src/cli/extensions/recommender.ts` (new)

On `wunderland start` and `wunderland init`, scan for opportunities:

```typescript
export interface ExtensionRecommendation {
  extensionId: string;
  packageName: string;
  reason: 'credential_detected' | 'skill_requires' | 'preset_default';
  installed: boolean;
  enabled: boolean;
  secretsPresent: boolean;
}

export async function getRecommendations(opts: {
  agentConfig?: AgentConfig;
  env?: Record<string, string>;
}): Promise<ExtensionRecommendation[]>;
```

Three recommendation sources:

**A. Credential detection** — scan env for known API keys and map to extensions:

| Env Var              | Extension        | Display                                                  |
| -------------------- | ---------------- | -------------------------------------------------------- |
| `NEWSAPI_API_KEY`    | news-search      | "NewsAPI key detected → enable news-search?"             |
| `SERPER_API_KEY`     | web-search       | "Serper key detected → enable web-search?"               |
| `GIPHY_API_KEY`      | giphy            | "Giphy key detected → enable giphy?"                     |
| `ELEVENLABS_API_KEY` | voice-synthesis  | "ElevenLabs key detected → enable voice-synthesis?"      |
| `GITHUB_TOKEN`       | github           | "GitHub token detected → enable github skill?"           |
| `TELEGRAM_BOT_TOKEN` | telegram         | "Telegram token detected → enable telegram channel?"     |
| `DISCORD_BOT_TOKEN`  | discord          | "Discord token detected → enable discord channel?"       |
| `GOOGLE_CLIENT_ID`   | gmail + calendar | "Google credentials detected → enable gmail + calendar?" |

**B. Skill requirements** — if agent config has skills that need specific tools (e.g., `social-broadcast` skill needs multi-channel-post tool), recommend installing those tools.

**C. Preset defaults** — each preset (researcher, assistant, etc.) has a recommended extension set. Suggest any that aren't installed/enabled.

### Integration points

**`wunderland start`** — after loading agent config, before starting runtime:

1. Call `getRecommendations()`
2. Filter to non-enabled recommendations
3. If any found, print summary table
4. Prompt: "Enable recommended extensions? (y/n/select)"
   - `y` = enable all, install missing packages
   - `n` = skip
   - `select` = interactive checklist
5. `--yes` flag auto-accepts all
6. `--no-recommendations` flag skips entirely

**`wunderland init`** — during agent creation wizard:

1. After user picks preset and skills, call `getRecommendations()`
2. Show suggestions as part of the wizard flow
3. Selected extensions get written to initial `agent.config.json`

### Fix: Remove silent Google auto-enable

In `packages/wunderland/src/cli/commands/start/extension-loader.ts` (lines 149-171), remove the silent auto-enable of `email-gmail` and `calendar-google`. These will now be handled by the recommender with user confirmation.

---

## Component 4: Dashboard UI (Future — not in this spec)

The rabbithole dashboard extensions page is currently read-only. A future spec will add enable/disable/configure buttons. This spec focuses on CLI only.

---

## Error Handling

- Package install failure → log stderr, continue without extension
- Secret prompt timeout → skip (non-blocking)
- Invalid API key format → accept anyway (validation is extension's job at runtime)
- No package manager detected → fall back to `npm install`
- `--yes` in non-interactive env (CI) → auto-accept recommendations, skip secret prompts

## Testing

- Unit tests for `detectPackageManager()` with mocked filesystem
- Unit tests for `getRecommendations()` with various env/config combinations
- Integration test for `installExtension()` in a temp directory
- Snapshot tests for recommendation output formatting

## Files Summary

| Action | File                                                               |
| ------ | ------------------------------------------------------------------ |
| Create | `packages/wunderland/src/cli/extensions/installer.ts`              |
| Create | `packages/wunderland/src/cli/extensions/secret-prompter.ts`        |
| Create | `packages/wunderland/src/cli/extensions/recommender.ts`            |
| Modify | `packages/wunderland/src/cli/commands/marketplace.ts`              |
| Modify | `packages/wunderland/src/cli/commands/start/extension-loader.ts`   |
| Modify | `packages/wunderland/src/cli/commands/start.ts` (wire recommender) |
| Modify | `packages/wunderland/src/cli/commands/init.ts` (wire recommender)  |
| Create | `packages/wunderland/tests/cli/extensions/installer.spec.ts`       |
| Create | `packages/wunderland/tests/cli/extensions/recommender.spec.ts`     |
