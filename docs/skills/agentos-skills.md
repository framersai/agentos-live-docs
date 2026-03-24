---
title: '@framers/agentos-skills'
sidebar_position: 6
---

# @framers/agentos-skills

The skills runtime package — loads, parses, and manages SKILL.md prompt modules.

```bash
npm install @framers/agentos-skills
```

## What It Does

`@framers/agentos-skills` provides the runtime engine for the skills system:

| Export                                 | Description                                                                                                       |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `SkillLoader`                          | Parses SKILL.md files (YAML frontmatter + markdown body), loads from directories, filters by platform/eligibility |
| `SkillRegistry`                        | Runtime registry — registration, querying, bulk loading, snapshot building, command spec generation               |
| `Skill`, `SkillEntry`, `SkillMetadata` | Type definitions for skill objects                                                                                |
| `getDefaultSkillDirs()`                | Resolves default skill directories (CLI flags, `AGENTOS_SKILLS_DIR`, `~/.codex/skills`, `cwd/skills`)             |

## How It Relates to Other Packages

```
@framers/agentos-skills              ← Runtime (this package)
@framers/agentos-skills-registry     ← Catalog (40 curated SKILL.md files)
@framers/agentos                     ← Re-exports skills via @framers/agentos/skills
```

The runtime handles loading and execution. The registry provides the curated skill catalog. AgentOS re-exports the runtime for convenience.

## Usage

```typescript
import { SkillLoader, SkillRegistry } from '@framers/agentos-skills';

// Load skills from a directory
const skills = await SkillLoader.loadFromDirectory('~/.wunderland/skills');

// Or use the registry
const registry = new SkillRegistry();
await registry.loadSkillsFromDir('~/.wunderland/skills');

const skill = registry.get('deep-research');
console.log(skill?.displayName, skill?.description);
```

Or import via AgentOS (same API):

```typescript
import { SkillLoader, SkillRegistry } from '@framers/agentos/skills';
```

## See Also

- [`@framers/agentos-skills-registry`](./agentos-skills-registry) — curated skill catalog
- [Skills (SKILL.md)](./skill-format) — how to write skills
