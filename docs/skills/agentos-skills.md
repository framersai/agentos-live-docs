---
title: '@framers/agentos-skills'
sidebar_position: 6
---

# @framers/agentos-skills

The skills **content** package -- 69 curated SKILL.md prompt modules, a machine-readable registry index, and TypeScript type definitions. This package contains **no runtime code**.

```bash
npm install @framers/agentos-skills
```

## What It Does

`@framers/agentos-skills` is the **content-only** data package for the skills system:

| Export                 | Description                                                        |
| ---------------------- | ------------------------------------------------------------------ |
| `registry/curated/`   | 69 curated SKILL.md files organized by category                    |
| `registry.json`       | Machine-readable index of all skills with metadata                 |
| `types.d.ts`          | TypeScript type definitions for skill entries and registry schema   |

It ships no parser, no loader, and no registry runtime. Those live in the engine package.

## How It Relates to Other Packages

```
@framers/agentos/skills              <-- Runtime ENGINE (SkillLoader, SkillRegistry, parser)
@framers/agentos-skills              <-- CONTENT (this package: 69 SKILL.md files + registry.json + types)
@framers/agentos-skills-registry     <-- Catalog SDK (query helpers, factories, resolves content from here)
```

The runtime engine lives in `@framers/agentos/src/skills/` and is re-exported as `@framers/agentos/skills`. The catalog SDK in `@framers/agentos-skills-registry` resolves content from this package via `createRequire()`.

## Usage

For **runtime imports** (SkillLoader, SkillRegistry, etc.), import from the engine:

```typescript
import { SkillLoader, SkillRegistry } from '@framers/agentos/skills';

// Load skills from a directory
const skills = await SkillLoader.loadFromDirectory('~/.wunderland/skills');

// Or use the registry
const registry = new SkillRegistry();
await registry.loadSkillsFromDir('~/.wunderland/skills');

const skill = registry.get('deep-research');
console.log(skill?.displayName, skill?.description);
```

For **content imports** (registry data, types), import from this package:

```typescript
import registry from '@framers/agentos-skills/registry.json';
import type { SkillRegistryEntry } from '@framers/agentos-skills/types';

console.log(registry.skills.curated.length); // 69
```

## See Also

- [`@framers/agentos-skills-registry`](./agentos-skills-registry) -- catalog SDK with query helpers and factories
- [Skills (SKILL.md)](./skill-format) -- how to write skills
- [`@framers/agentos/skills`](/architecture/tool-calling-and-loading) -- the runtime engine
