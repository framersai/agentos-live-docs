# @framers/agentos-ext-skills

AgentOS extension pack that provides **skills discovery + enablement tools** for `SKILL.md` prompt modules.

> **Note:** This package was renamed from `@framers/agentos-skills` to `@framers/agentos-ext-skills`
> in the wunderland-sol workspace to avoid a naming collision with the main
> `@framers/agentos-skills` content package (which ships 88 curated SKILL.md files,
> registry.json, and types.d.ts). The two packages serve different purposes:
> `@framers/agentos-skills` is content-only data, while this package is an extension
> pack that provides runtime tools for discovering and enabling skills.

This extension is intended to be used alongside:

- `@framers/agentos` (core runtime -- the skills engine lives at `@framers/agentos/skills`)
- `@framers/agentos-skills` (content: 88 curated SKILL.md files + registry.json + types)
- `@framers/agentos-skills-registry` (catalog SDK: query helpers + lazy-loading factories)

## Tools

- `skills_list` -- list curated skills from the catalog (with basic eligibility checks)
- `skills_read` -- read a curated skill's `SKILL.md`
- `skills_enable` -- copy a curated skill into a local skills directory (side-effects; should be HITL-gated)
- `skills_status` -- OpenClaw-style status report (enabled/eligible/missing requirements)
- `skills_install` -- install missing dependencies from `metadata.install` (side-effects; HITL-gated unless running autonomous)

## Usage

```ts
import { AgentOS } from '@framers/agentos';
import { createExtensionPack } from '@framers/agentos-ext-skills';

const agentos = new AgentOS();
await agentos.initialize({
  // ...
  extensionManifest: {
    packs: [
      { factory: () => createExtensionPack({ options: {}, logger: console }), enabled: true },
    ],
  },
});
```
