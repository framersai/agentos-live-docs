# Function: resolveDefaultSkillsDirs()

> **resolveDefaultSkillsDirs**(`options?`): `string`[]

Defined in: [packages/agentos/src/cognition/skills/paths.ts:63](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/skills/paths.ts#L63)

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
