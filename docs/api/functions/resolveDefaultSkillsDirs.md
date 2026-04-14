# Function: resolveDefaultSkillsDirs()

> **resolveDefaultSkillsDirs**(`options?`): `string`[]

Defined in: [packages/agentos/src/skills/paths.ts:63](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/skills/paths.ts#L63)

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
