# Function: resolveDefaultSkillsDirs()

> **resolveDefaultSkillsDirs**(`options?`): `string`[]

Defined in: [packages/agentos/src/skills/paths.ts:63](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/skills/paths.ts#L63)

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
