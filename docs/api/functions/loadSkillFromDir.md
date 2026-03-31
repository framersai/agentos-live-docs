# Function: loadSkillFromDir()

> **loadSkillFromDir**(`skillDir`): `Promise`\<[`SkillEntry`](../interfaces/SkillEntry.md) \| `null`\>

Defined in: [packages/agentos/src/skills/SkillLoader.ts:181](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/skills/SkillLoader.ts#L181)

Load a single skill from a directory.

## Parameters

### skillDir

`string`

Path to skill directory (should contain SKILL.md)

## Returns

`Promise`\<[`SkillEntry`](../interfaces/SkillEntry.md) \| `null`\>

SkillEntry or null if invalid
