---
title: '@framers/agentos-skills'
sidebar_position: 6
---

# @framers/agentos-skills

The skills **content** package — 69 curated SKILL.md prompt modules + a `registry.json` index.

```bash
npm install @framers/agentos-skills
```

## What It Does

`@framers/agentos-skills` ships the curated SKILL.md files that agents consume. It does **not** contain the runtime engine — that lives in `@framers/agentos/skills`.

| What ships                  | Description                                                                 |
| --------------------------- | --------------------------------------------------------------------------- |
| `registry/curated/*/SKILL.md` | 69 curated skill files (developer tools, productivity, social, voice, etc.) |
| `registry.json`             | Machine-readable index of all bundled skills (name, category, description)  |

## How It Relates to Other Packages

```
@framers/agentos/skills               <- Engine (SkillLoader, SkillRegistry, path utils)
@framers/agentos-skills               <- Content (this package — 69 SKILL.md files)
@framers/agentos-skills-registry      <- Catalog SDK (SKILLS_CATALOG, query helpers, factories)
```

This mirrors the extensions layout:

```
@framers/agentos-extensions            <- Content (107 extension implementations)
@framers/agentos-extensions-registry   <- Catalog SDK (CHANNEL_CATALOG, TOOL_CATALOG, etc.)
```

The engine handles loading and execution. This package provides the skill content. The registry SDK provides typed catalog queries and snapshot factories.

## Usage

Load curated skill content using the engine from `@framers/agentos/skills`:

```typescript
import { SkillRegistry } from '@framers/agentos/skills';

// Point the engine at the content package's curated directory
const registry = new SkillRegistry();
await registry.loadFromDirs([
  require.resolve('@framers/agentos-skills').replace(/index\.[cm]?js$/, 'registry/curated'),
]);

const skill = registry.get('deep-research');
console.log(skill?.displayName, skill?.description);
```

Or use the registry SDK (which wires content + engine together automatically):

```typescript
import { createCuratedSkillSnapshot } from '@framers/agentos-skills-registry';

const snapshot = await createCuratedSkillSnapshot({ skills: ['github', 'weather'] });
console.log(snapshot.prompt);
```

## See Also

- [`@framers/agentos-skills-registry`](./agentos-skills-registry) — catalog SDK with query helpers and factories
- [`@framers/agentos/skills`](../api/skills) — the runtime engine (SkillLoader, SkillRegistry)
- [Skills (SKILL.md)](./skill-format) — how to write skills
