---
sidebar_position: 6
---

# Skills System

Skills are modular prompt modules that extend what AgentOS agents can do. Each skill is defined by a `SKILL.md` file containing YAML frontmatter (metadata, requirements, install specs) and a markdown body (instructions injected into the agent's system prompt at runtime).

## NPM Packages

The skills system is distributed across two packages:

| Package                                                                                              | Purpose                                                             | Runtime Code | Dependencies                           |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | :----------: | -------------------------------------- |
| [`@framers/agentos-skills`](https://www.npmjs.com/package/@framers/agentos-skills)                   | Raw data -- 16+ SKILL.md files + JSON index                         |      No      | Zero                                   |
| [`@framers/agentos-skills-registry`](https://www.npmjs.com/package/@framers/agentos-skills-registry) | Typed SDK -- catalog queries, search, filtering, registry factories |     Yes      | `agentos-skills`, optionally `agentos` |

```bash
# Data only (zero deps)
npm install @framers/agentos-skills

# SDK with query helpers + factories
npm install @framers/agentos-skills-registry
```

## Two Import Paths

### Lightweight catalog (zero peer deps)

The `./catalog` sub-export works standalone with no `@framers/agentos` dependency:

```typescript
import {
  SKILLS_CATALOG,
  searchSkills,
  getSkillsByCategory,
  getSkillByName,
  getAvailableSkills,
  getCategories,
  getSkillsByTag,
  getCuratedSkills,
  getCommunitySkills,
  getAllSkills,
} from '@framers/agentos-skills-registry/catalog';
```

### Full registry (requires @framers/agentos)

Factory functions lazy-load `@framers/agentos` via dynamic `import()` -- only resolved when called:

```typescript
import {
  createCuratedSkillRegistry,
  createCuratedSkillSnapshot,
} from '@framers/agentos-skills-registry';

const registry = await createCuratedSkillRegistry();
const snapshot = await createCuratedSkillSnapshot({
  skills: ['github', 'weather', 'notion'],
  platform: 'darwin',
});
```

## Browsing Skills

### By category

```typescript
import { getCategories, getSkillsByCategory } from '@framers/agentos-skills-registry/catalog';

const categories = getCategories();
// ['communication', 'creative', 'developer-tools', 'devops', 'information', 'media', 'productivity', 'security']

const devTools = getSkillsByCategory('developer-tools');
```

### By keyword search

```typescript
import { searchSkills } from '@framers/agentos-skills-registry/catalog';

const results = searchSkills('github');
// Matches against name, description, and tags
```

### By tag

```typescript
import { getSkillsByTag } from '@framers/agentos-skills-registry/catalog';

const automationSkills = getSkillsByTag('automation');
```

### By available tools

```typescript
import { getAvailableSkills } from '@framers/agentos-skills-registry/catalog';

// Only skills whose required binaries are in the provided list
const available = getAvailableSkills(['web-search', 'filesystem', 'gh']);
```

## Community vs Curated Skills

Skills are organized into two tiers, both shipped in the same NPM package:

| Tier          | Directory             | Maintained By         | Verified | `source` Field |
| ------------- | --------------------- | --------------------- | :------: | -------------- |
| **Curated**   | `registry/curated/`   | AgentOS core team     |   Yes    | `'curated'`    |
| **Community** | `registry/community/` | External contributors |    No    | `'community'`  |

- **Curated** skills are maintained by the AgentOS team, tested in CI, and guaranteed to follow the latest schema.
- **Community** skills are submitted via pull request and reviewed before merge, but are not staff-maintained after acceptance.

Filter by source at runtime:

```typescript
import { getCuratedSkills, getCommunitySkills } from '@framers/agentos-skills-registry/catalog';

const curated = getCuratedSkills(); // Staff-maintained only
const community = getCommunitySkills(); // Community-contributed only
```

## Contributing a Skill

To publish a new skill to the catalog:

1. **Fork** the [`agentos-skills`](https://github.com/framersai/agentos-skills) repository.
2. **Create** a `SKILL.md` file in `registry/community/<your-skill>/` with valid YAML frontmatter and markdown instructions.
3. **Validate** locally by running the registry build and checking `registry.json`.
4. **Open a PR** against `main`. CI validates your SKILL.md format automatically.

See the full [`CONTRIBUTING.md`](https://github.com/framersai/agentos-skills/blob/main/CONTRIBUTING.md) for the format spec, naming conventions, and review criteria.

## Available Categories

| Category            | Example Skills                                         |
| ------------------- | ------------------------------------------------------ |
| **Information**     | weather, summarize                                     |
| **Developer Tools** | github, coding-agent                                   |
| **Communication**   | slack-helper, discord-helper                           |
| **Productivity**    | notion, obsidian, trello, apple-notes, apple-reminders |
| **DevOps**          | healthcheck                                            |
| **Media**           | spotify-player, whisper-transcribe                     |
| **Security**        | 1password                                              |
| **Creative**        | image-gen                                              |
