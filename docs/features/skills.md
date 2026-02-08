---
sidebar_position: 13
title: Skills
description: Skill system for extending agent capabilities with SKILL.md prompt modules
---

# Skills

Skills are modular prompt extensions that give agents domain-specific capabilities. Each skill is defined by a `SKILL.md` file containing YAML frontmatter (metadata, dependencies) and markdown body (instructions for the LLM).

## Architecture

The skills system has three layers:

| Layer       | Package                            | Role                                                       |
| ----------- | ---------------------------------- | ---------------------------------------------------------- |
| **Data**    | `@framers/agentos-skills`          | 18 curated SKILL.md files in `registry/curated/`           |
| **SDK**     | `@framers/agentos-skills-registry` | Typed catalog, query helpers, snapshot builder             |
| **Runtime** | `@framers/agentos` (SkillRegistry) | Filesystem discovery, platform filtering, prompt injection |

## Curated Skills Catalog

| Skill                | Category        | Required Tools | Required Secrets                                                |
| -------------------- | --------------- | -------------- | --------------------------------------------------------------- |
| `web-search`         | information     | web-search     | --                                                              |
| `weather`            | information     | web-search     | --                                                              |
| `summarize`          | information     | web-search     | --                                                              |
| `github`             | developer-tools | --             | github.token                                                    |
| `coding-agent`       | developer-tools | filesystem     | --                                                              |
| `git`                | developer-tools | --             | --                                                              |
| `slack-helper`       | communication   | --             | slack.bot_token, slack.app_token                                |
| `discord-helper`     | communication   | --             | discord.bot_token                                               |
| `notion`             | productivity    | --             | notion.api_key                                                  |
| `obsidian`           | productivity    | filesystem     | --                                                              |
| `trello`             | productivity    | --             | trello.api_key, trello.token                                    |
| `apple-notes`        | productivity    | filesystem     | --                                                              |
| `apple-reminders`    | productivity    | filesystem     | --                                                              |
| `healthcheck`        | devops          | web-search     | --                                                              |
| `spotify-player`     | media           | --             | spotify.client_id, spotify.client_secret, spotify.refresh_token |
| `whisper-transcribe` | media           | filesystem     | openai.api_key                                                  |
| `1password`          | security        | --             | --                                                              |
| `image-gen`          | creative        | --             | openai.api_key                                                  |

## Using Skills

### Via CLI

```bash
# List available skills
wunderland skills list

# Get details about a skill
wunderland skills info github

# Enable/disable skills
wunderland skills enable github
wunderland skills disable github
```

### Via agent.config.json

Skills declared in `agent.config.json` are automatically loaded on startup:

```json
{
  "skills": ["web-search", "summarize", "github"]
}
```

### Via Presets

Agent presets include curated skill sets. When you scaffold from a preset, the skills are pre-configured:

```bash
wunderland init my-agent --preset research-assistant
# Automatically includes: web-search, summarize, github
```

## Preset Skill Auto-Resolution

When `wunderland start` or `wunderland chat` loads an agent, the CLI:

1. Loads directory-based skills from `./skills/` and `--skills-dir` paths
2. Reads the `skills` array from `agent.config.json`
3. Calls `resolveSkillsByNames()` to validate each skill against the curated catalog
4. Builds a prompt snapshot and merges it into the LLM system prompt

```typescript
import { resolveSkillsByNames } from 'wunderland';

// Resolve skills by name from the curated registry
const snapshot = await resolveSkillsByNames(['summarize', 'github']);
console.log(snapshot.prompt); // Combined SKILL.md content
console.log(snapshot.skills); // Metadata for each resolved skill
```

If a skill name doesn't match the catalog, it's skipped with a warning. If `@framers/agentos-skills-registry` is not installed, the resolution gracefully falls back to an empty snapshot.

## SDK Query Helpers

The `@framers/agentos-skills-registry` package provides typed query functions:

```typescript
import {
  getSkillByName,
  getSkillsByCategory,
  getSkillsByTag,
  searchSkills,
  getAvailableSkills,
  getCuratedSkills,
  getCategories,
} from '@framers/agentos-skills-registry/catalog';

// Find a specific skill
const github = getSkillByName('github');

// Get all developer tools
const devTools = getSkillsByCategory('developer-tools');

// Search by keyword
const results = searchSkills('transcription');

// Get skills available given installed tools
const available = getAvailableSkills(['filesystem', 'web-search']);
```

## Creating Custom Skills

See the [CONTRIBUTING guide](https://github.com/framersai/agentos-skills/blob/main/CONTRIBUTING.md) in the `@framers/agentos-skills` repository for the full submission workflow.

### SKILL.md Format

```markdown
---
name: my-custom-skill
version: '1.0.0'
description: What the skill does
author: Your Name
namespace: community
category: productivity
tags: [keyword1, keyword2]
requires_secrets: []
requires_tools: [filesystem]
---

# My Custom Skill

Instructions for the LLM on how to use this skill...
```

### Validation

```bash
cd packages/agentos-skills
node scripts/validate-skill.mjs registry/curated/my-skill/SKILL.md
```

## Related

- [Skills Overview](/docs/skills/overview) -- dedicated skills documentation section
- [Extensions Overview](/docs/extensions/overview) -- how skills relate to tools/extensions
- [Guardrails](/docs/features/guardrails) -- security controls for skill execution
- [Agent Communication](/docs/features/agent-communication) -- inter-agent messaging
