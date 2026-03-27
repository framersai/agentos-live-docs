---
title: 'Skills Tools'
sidebar_position: 3
---

Skills discovery and enablement tools are provided by `@framers/agentos-skills` via `SkillRegistry`.

These tools work alongside:

- `@framers/agentos` (core runtime)
- `@framers/agentos-skills-registry` (curated SKILL.md files + typed catalog)

## Tools

- `skills_list` — list curated skills from the catalog (with basic eligibility checks)
- `skills_read` — read a curated skill's `SKILL.md`
- `skills_enable` — copy a curated skill into a local skills directory (side-effects; should be HITL-gated)
- `skills_status` — OpenClaw-style status report (enabled/eligible/missing requirements)
- `skills_install` — install missing dependencies from `metadata.install` (side-effects; HITL-gated unless running autonomous)

## Usage

```ts
import { SkillRegistry } from '@framers/agentos-skills';

const registry = new SkillRegistry();
await registry.loadFromDirs(['./skills']);

const snapshot = registry.buildSnapshot({ platform: process.platform });
console.log(snapshot.prompt);
```

## Capability Discovery Integration

Skills are automatically indexed by the **Capability Discovery Engine** (`@framers/agentos/discovery`), which provides semantic search across all capabilities -- tools, skills, extensions, and channels -- using embedding similarity and graph re-ranking. No separate extension wrapper is needed.
