# @framers/agentos-skills

Curated catalog of **skills** for the [AgentOS](https://github.com/framersai/agentos) ecosystem.

[![npm](https://img.shields.io/npm/v/@framers/agentos-skills?logo=npm&color=cb3837)](https://www.npmjs.com/package/@framers/agentos-skills)

```bash
npm install @framers/agentos-skills
```

## What's Inside

This package is **data only** — no runtime code, no heavy dependencies. It ships:

| File                          | Description                                                          |
| ----------------------------- | -------------------------------------------------------------------- |
| `registry/curated/*/SKILL.md` | 16+ curated skill definitions (weather, github, slack, notion, etc.) |
| `registry.json`               | Flat JSON index of every skill with metadata                         |
| `types.d.ts`                  | TypeScript type declarations for the registry schema                 |

Each skill is a directory containing a `SKILL.md` file with **YAML frontmatter** (metadata, requirements, install specs) and a **markdown body** (instructions injected into an agent's system prompt).

## Available Skills

| Category            | Skills                                                 |
| ------------------- | ------------------------------------------------------ |
| **Information**     | weather, summarize                                     |
| **Developer Tools** | github, coding-agent                                   |
| **Communication**   | slack-helper, discord-helper                           |
| **Productivity**    | notion, obsidian, trello, apple-notes, apple-reminders |
| **DevOps**          | healthcheck                                            |
| **Media**           | spotify-player, whisper-transcribe                     |
| **Security**        | 1password                                              |
| **Creative**        | image-gen                                              |

## Usage

### Raw data (no dependencies needed)

```typescript
import registry from '@framers/agentos-skills';

// registry.json is the full catalog
console.log(registry.skills.curated.length); // 16+
```

### With the typed SDK

For programmatic queries, filtering, and runtime loading, use [`@framers/agentos-skills-registry`](https://www.npmjs.com/package/@framers/agentos-skills-registry):

```bash
npm install @framers/agentos-skills-registry
```

```typescript
import { searchSkills, getSkillsByCategory } from '@framers/agentos-skills-registry/catalog';

const devTools = getSkillsByCategory('developer-tools');
const matches = searchSkills('github');
```

## Relationship to Other Packages

```
@framers/agentos-skills          ← You are here (data: SKILL.md files + JSON index)
  └── @framers/agentos-skills-registry   (SDK: typed catalog, query helpers, registry factories)
        └── @framers/agentos             (optional peer: live SkillRegistry + snapshots)
```

| Package                              | What                                      | Runtime Code | Dependencies                           |
| ------------------------------------ | ----------------------------------------- | :----------: | -------------------------------------- |
| **@framers/agentos-skills**          | Raw SKILL.md files + JSON index           |      No      | Zero                                   |
| **@framers/agentos-skills-registry** | Typed catalog + query helpers + factories |     Yes      | `agentos-skills`, optionally `agentos` |
| **@framers/agentos**                 | Full cognitive runtime with SkillRegistry |     Yes      | Many                                   |

## License

MIT
