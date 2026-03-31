# Function: resolveDefaultSkillsDirs()

> **resolveDefaultSkillsDirs**(`options?`): `string`[]

Defined in: [packages/agentos/src/skills/paths.ts:63](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/skills/paths.ts#L63)

Resolve the "default" skills directories to scan for `SKILL.md` folders.

Order is high → low precedence for first-registered wins systems:
- CLI flag dirs
- AGENTOS_SKILLS_DIR
- CODEX_HOME/skills
- ~/.codex/skills
- <cwd>/skills

## Parameters

### options?

[`ResolveSkillsDirsOptions`](../interfaces/ResolveSkillsDirsOptions.md)

## Returns

`string`[]
