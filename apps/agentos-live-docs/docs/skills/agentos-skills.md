---
title: '@framers/agentos-skills'
sidebar_position: 4
---

Curated catalog of **skills** for the [AgentOS](https://github.com/framersai/agentos) ecosystem.

```bash
npm install @framers/agentos-skills
```

## What's Inside

This package is **data only** — no runtime code, no heavy dependencies. It ships:

| File                          | Description                                                         |
| ----------------------------- | ------------------------------------------------------------------- |
| `registry/curated/*/SKILL.md` | 18 curated skill definitions (weather, github, slack, notion, etc.) |
| `registry.json`               | Flat JSON index of every skill with metadata                        |
| `types.d.ts`                  | TypeScript type declarations for the registry schema                |

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

## Contributing a Skill

1. **Fork** the [agentos-skills](https://github.com/framersai/agentos-skills) repository.
2. **Create** a `SKILL.md` file in `registry/community/<your-skill>/`.
3. **Open a PR** against `main`.

See [`CONTRIBUTING.md`](https://github.com/framersai/agentos-skills/blob/main/CONTRIBUTING.md) for the full SKILL.md format spec and submission process.

## Community vs Curated

Skills ship in two tiers, all bundled in this single package:

| Tier          | Namespace    | Maintained By   | Verified |
| ------------- | ------------ | --------------- | :------: |
| **Curated**   | `wunderland` | Core staff      |   Yes    |
| **Community** | `community`  | PR contributors |    No    |

Curated skills live in `registry/curated/` and are maintained and tested by the AgentOS team. Community skills live in `registry/community/` and are submitted via pull request from the community.

## Skill Format Quick Reference

```yaml
---
name: my-skill
description: Short description of what this skill does
namespace: community # or 'wunderland' for curated
category: productivity # information | developer-tools | communication | productivity | devops | media | security | creative
tags: [example, template]
metadata:
  openclaw:
    emoji: "\U0001F4A1"
    primaryEnv: MY_API_KEY # optional
    os: [darwin, linux] # optional platform restriction
    requires:
      bins: [my-tool] # all must exist
    install:
      - id: brew
        kind: brew
        formula: my-tool
        bins: [my-tool]
        label: 'Install via Homebrew'
---
# My Skill

Instructions injected into the agent's system prompt go here.
```

## License

MIT
