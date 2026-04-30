---
title: "Skills Engine"
sidebar_position: 8
---

> Deep dive into the skill loading pipeline, registry, and 3-tier ecosystem. For the full system overview, see [System Architecture](./system-architecture.md).

## Overview

The skills engine provides modular agent capabilities via SKILL.md files with YAML frontmatter. It operates through two core classes:

- **SkillLoader** -- parses SKILL.md files, extracts metadata, filters by platform and eligibility.
- **SkillRegistry** -- runtime registry for managing, querying, and building skill snapshots.

Source: `packages/agentos/src/skills/`

## 3-Tier Ecosystem

| Tier            | Package                            | Purpose                                                    |
| --------------- | ---------------------------------- | ---------------------------------------------------------- |
| **Engine**      | `@framers/agentos` (`src/skills/`) | SkillLoader, SkillRegistry, types, paths                   |
| **Content**     | `@framers/agentos-skills`          | 88 curated SKILL.md files + `registry.json` + `types.d.ts` |
| **Catalog SDK** | `@framers/agentos-skills-registry` | SKILLS_CATALOG, query helpers, factories                   |

The engine tier contains no content. The content tier contains no runtime code. The catalog SDK resolves content from `@framers/agentos-skills` via `createRequire()`.

## SKILL.md Format

Each skill lives in a directory containing a `SKILL.md` file with YAML frontmatter:

```markdown
---
name: web-search
description: Search the web for current information
metadata:
  emoji: "\U0001F50D"
  primaryEnv: SERPAPI_API_KEY
  requires:
    env: [SERPAPI_API_KEY]
  os: [darwin, linux, win32]
user-invocable: true
disable-model-invocation: false
---

# Web Search

Search the web using SerpAPI for real-time results.

## Usage

The agent can search for current events, technical documentation,
or any information not available in its training data.
```

### Frontmatter Fields

| Field                       | Type     | Description                                             |
| --------------------------- | -------- | ------------------------------------------------------- |
| `name`                      | string   | Skill name (defaults to directory name)                 |
| `description`               | string   | Short description (defaults to first paragraph of body) |
| `metadata.emoji`            | string   | Display emoji                                           |
| `metadata.primaryEnv`       | string   | Primary environment variable                            |
| `metadata.always`           | boolean  | Always include regardless of filters                    |
| `metadata.skillKey`         | string   | Alternate key for config lookups                        |
| `metadata.os`               | string[] | Supported platforms (`darwin`, `linux`, `win32`)        |
| `metadata.requires.bins`    | string[] | All required binaries                                   |
| `metadata.requires.anyBins` | string[] | At least one must be present                            |
| `metadata.requires.env`     | string[] | Required environment variables                          |
| `metadata.requires.config`  | string[] | Required runtime config paths                           |
| `metadata.install`          | object[] | Installation instructions                               |
| `user-invocable`            | boolean  | Can users invoke directly (default: true)               |
| `disable-model-invocation`  | boolean  | Prevent model from using (default: false)               |

## SkillLoader

### Loading Pipeline

```
loadSkillFromDir(skillDir)
  |
  +-- Read SKILL.md
  +-- parseSkillFrontmatter(content)
  |     - Split on '---' delimiters
  |     - YAML.parse(frontmatterBlock)
  |     - Return { frontmatter, body }
  |
  +-- extractMetadata(frontmatter)
  |     - Check metadata.openclaw, .wunderland, .agentos, or root
  |     - Return SkillMetadata { always, skillKey, primaryEnv, os, requires, ... }
  |
  +-- resolveSkillInvocationPolicy(frontmatter)
  |     - Parse user-invocable and disable-model-invocation flags
  |
  +-- Return SkillEntry { skill, frontmatter, metadata, invocation, sourcePath }
```

`loadSkillsFromDir(dir)` iterates all subdirectories and calls `loadSkillFromDir()` on each.

### Filtering

Three filter functions are available:

- **`filterByPlatform(entries, platform)`** -- OS name normalization (`darwin`/`macos`/`mac` all match).
- **`filterByEligibility(entries, context)`** -- checks `requires.bins`, `requires.anyBins`, `requires.env`, and platform.
- **`checkBinaryRequirements(entry, hasBin)`** -- returns `{ met, missing }` for a single entry.

## SkillRegistry

### Registration

```typescript
const registry = new SkillRegistry(config);

// Load from directories (high -> low precedence, first registered wins)
await registry.reload({
  workspaceDir: './.skills', // project-local skills
  managedSkillsDir: '~/.codex/skills', // global managed skills
  bundledSkillsDir: './bundled/', // packaged skills
  extraDirs: ['./community/'], // additional sources
});
```

Skills are loaded in precedence order: **workspace > managed > bundled > extra**. The first skill registered with a given name wins.

### Allowlist and Config

```typescript
interface SkillsConfig {
  allowBundled?: string[]; // only these bundled skills are allowed
  entries?: Record<
    string,
    {
      enabled?: boolean; // disable specific skills
      env?: Record<string, string>;
      apiKey?: string;
    }
  >;
}
```

If `allowBundled` is set, only bundled skills whose `skillKey` or `name` appears in the list are registered.

### Snapshot Building

`buildSnapshot()` produces a `SkillSnapshot` for injection into agent context:

```typescript
const snapshot = registry.buildSnapshot({
  platform: 'darwin',
  strict: true, // OpenClaw-style eligibility gating
  filter: ['web-search', 'file-reader'],
});
// snapshot: { prompt, skills, resolvedSkills, version, createdAt }
```

When `strict: true`, skills are filtered through `shouldIncludeSkillEntry()` which checks:

1. Config `enabled` flag
2. OS compatibility
3. `metadata.always` bypass
4. Required binaries (PATH scan via `fs.accessSync`)
5. Required environment variables
6. Required runtime config paths

### Prompt Building

`buildPrompt()` formats skills into Markdown for LLM context:

```markdown
# Available Skills

## [emoji] skill-name

Description text

Skill content from SKILL.md body

---

## [emoji] another-skill

...
```

### Command Specs

`buildCommandSpecs()` generates CLI command specifications from user-invocable skills, sanitizing names to lowercase alphanumeric with hyphens and resolving collisions with numeric suffixes.

## Key Source Files

| File                                           | Purpose                                     |
| ---------------------------------------------- | ------------------------------------------- |
| `packages/agentos/src/skills/SkillLoader.ts`   | SKILL.md parsing, filtering                 |
| `packages/agentos/src/skills/SkillRegistry.ts` | Runtime registry, snapshot building         |
| `packages/agentos/src/skills/types.ts`         | Skill, SkillEntry, SkillSnapshot types      |
| `packages/agentos-skills/`                     | 88 curated SKILL.md files                   |
| `packages/agentos-skills-registry/`            | Catalog SDK (SKILLS_CATALOG, query helpers) |

## See Also

- [Extension Loading](/architecture/extension-loading) -- the parallel extension system
- [Sandbox Security](/architecture/sandbox-security) -- code execution isolation for skill-generated code
- [System Architecture](./system-architecture.md) -- full system overview
