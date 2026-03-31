# Function: loadSkillFromDir()

> **loadSkillFromDir**(`skillDir`): `Promise`\<[`SkillEntry`](../interfaces/SkillEntry.md) \| `null`\>

Defined in: [packages/agentos/src/skills/SkillLoader.ts:181](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/skills/SkillLoader.ts#L181)

Load a single skill from a directory.

## Parameters

### skillDir

`string`

Path to skill directory (should contain SKILL.md)

## Returns

`Promise`\<[`SkillEntry`](../interfaces/SkillEntry.md) \| `null`\>

SkillEntry or null if invalid
