---
title: "Skills Overview"
sidebar_position: 1
---

Skills are prompt-level capability modules for AgentOS. They are not runtime extensions; they teach an agent when and how to use tools, workflows, and external systems through `SKILL.md` content.

## The 3-Tier Skills Architecture

AgentOS skills are split into three public layers:

1. `@framers/agentos/skills`
   The runtime engine. This is where `SkillLoader`, `SkillRegistry`, snapshots, and path helpers live.
2. `@framers/agentos-skills`
   The curated content package. It ships `SKILL.md` files plus the generated `registry.json` index.
3. `@framers/agentos-skills-registry`
   The catalog SDK. It provides query helpers, lazy loading, and factories over the curated content package.

## Start Here

- Use [Skills (SKILL.md)](/skills/skill-format) to author and structure skills.
- Use [`@framers/agentos-skills`](/skills/agentos-skills) when you need the curated content pack.
- Use [`@framers/agentos-skills-registry`](/skills/agentos-skills-registry) when you need catalog search, lazy loading, or factories.

## Skills vs Extensions

- Extensions are runtime code: tools, guardrails, workflows, and providers.
- Skills are prompt content: they explain operating procedures, decision rules, and tool-usage patterns to the model.

Both can participate in discovery, but they solve different layers of the system.

## SkillRegistry API

The `SkillRegistry` class manages loaded skills at runtime. It scans directories, filters by platform and eligibility, and builds snapshots for agent context.

### Initialization

```typescript
import { SkillRegistry } from '@framers/agentos/skills';

const registry = new SkillRegistry({
  allowBundled: ['github', 'web-search', 'category:research'],  // optional allowlist
  entries: {
    'github': { enabled: true, apiKey: 'ghp_...' },
    'deprecated-skill': { enabled: false },
  },
});

// Load skills from multiple directories in precedence order
const count = await registry.reload({
  workspaceDir: './skills',                       // highest precedence
  managedSkillsDir: '~/.agentos/skills',          // user-global
  bundledSkillsDir: './node_modules/@framers/agentos-skills/registry/curated',
  extraDirs: ['./custom-skills'],                 // lowest precedence
});

console.log(`Loaded ${count} skills`);
```

Loading precedence: workspace > managed > bundled > extra. First registered wins, so workspace skills override bundled skills with the same name.

### Key Methods

| Method | Description |
|--------|-------------|
| `register(entry)` | Register a single skill. Returns `false` if already exists or blocked by config. |
| `unregister(name)` | Remove a skill by name. |
| `reload(options)` | Clear and re-scan all configured directories. |
| `getByName(name)` | Look up a single skill. |
| `listAll()` | All registered skills. |
| `filterByPlatform(platform)` | Skills available on darwin/linux/win32. |
| `filterByEligibility(context)` | Skills matching an eligibility context. |
| `getUserInvocableSkills()` | Skills the user can invoke via slash commands. |
| `getModelInvocableSkills()` | Skills the model can invoke autonomously. |
| `buildSnapshot(options)` | Build a token-budgeted snapshot for agent context. |
| `checkAllRequirements(hasBin)` | Check binary requirements for all skills. |

### Snapshots for Agent Context

```typescript
const snapshot = registry.buildSnapshot({
  platform: 'darwin',
  strict: true,  // only include skills whose requirements are met (bins, env vars, config)
});

console.log(snapshot.prompt);          // formatted markdown for the system prompt
console.log(snapshot.skills);          // [{name, primaryEnv}]
console.log(snapshot.version);         // increments on any registration change
```

The `strict` mode evaluates each skill's `requires` block against the current environment: binary availability (PATH scan), environment variables, and config paths. Skills that fail any requirement check are excluded.

### SkillsConfig

```typescript
interface SkillsConfig {
  allowBundled?: string[];              // restrict which bundled skills load
  entries?: Record<string, {
    enabled?: boolean;                   // disable a specific skill
    apiKey?: string;                     // inject a credential
    env?: Record<string, string>;        // inject environment variables
  }>;
}
```

## How the Registry Auto-Updates

The skills registry updates automatically through three mechanisms:

1. **Reload on startup.** When the agent initializes, `SkillRegistry.reload()` scans all configured directories. Any new SKILL.md files added to those directories since the last startup are picked up automatically.

2. **SkillExporter bridges emergent tools.** When an emergent tool is promoted and exported via [`exportToolAsSkillPack()`](/features/emergent-capabilities#skill-export--forged-tools-to-skills), the resulting SKILL.md + CAPABILITY.yaml are written to a skills directory. On the next reload, the registry picks them up.

3. **CapabilityManifestScanner hot-reload.** The [Capability Discovery Engine](/features/capability-discovery) watches for new CAPABILITY.yaml manifests via `fs.watch`. When a new manifest appears (e.g., from a skill export or package install), the discovery engine reindexes without requiring a full restart.

The result: install a new `@framers/agentos-skills` version, export a forged tool as a skill pack, or drop a SKILL.md into your workspace skills directory, and the registry picks it up on the next initialization cycle.
