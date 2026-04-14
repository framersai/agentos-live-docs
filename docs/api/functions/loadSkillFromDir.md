# Function: loadSkillFromDir()

> **loadSkillFromDir**(`skillDir`): `Promise`\<[`SkillEntry`](../interfaces/SkillEntry.md) \| `null`\>

Defined in: [packages/agentos/src/skills/SkillLoader.ts:181](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/skills/SkillLoader.ts#L181)

Load a single skill from a directory.

## Parameters

### skillDir

`string`

Path to skill directory (should contain SKILL.md)

## Returns

`Promise`\<[`SkillEntry`](../interfaces/SkillEntry.md) \| `null`\>

SkillEntry or null if invalid
