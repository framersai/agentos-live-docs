# Function: loadSkillFromDir()

> **loadSkillFromDir**(`skillDir`): `Promise`\<[`SkillEntry`](../interfaces/SkillEntry.md) \| `null`\>

Defined in: [packages/agentos/src/skills/SkillLoader.ts:181](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/skills/SkillLoader.ts#L181)

Load a single skill from a directory.

## Parameters

### skillDir

`string`

Path to skill directory (should contain SKILL.md)

## Returns

`Promise`\<[`SkillEntry`](../interfaces/SkillEntry.md) \| `null`\>

SkillEntry or null if invalid
