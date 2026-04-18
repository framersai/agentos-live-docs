# Interface: SkillMetadata

Defined in: [packages/agentos/src/skills/types.ts:92](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L92)

Skill metadata from SKILL.md frontmatter.

## Properties

### always?

> `optional` **always**: `boolean`

Defined in: [packages/agentos/src/skills/types.ts:94](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L94)

Always include this skill regardless of requirements

***

### emoji?

> `optional` **emoji**: `string`

Defined in: [packages/agentos/src/skills/types.ts:103](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L103)

Emoji for display

***

### homepage?

> `optional` **homepage**: `string`

Defined in: [packages/agentos/src/skills/types.ts:106](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L106)

Homepage URL

***

### install?

> `optional` **install**: [`SkillInstallSpec`](SkillInstallSpec.md)[]

Defined in: [packages/agentos/src/skills/types.ts:115](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L115)

Installation specifications

***

### os?

> `optional` **os**: readonly `string`[]

Defined in: [packages/agentos/src/skills/types.ts:109](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L109)

Limit to specific OS platforms

***

### primaryEnv?

> `optional` **primaryEnv**: `string`

Defined in: [packages/agentos/src/skills/types.ts:100](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L100)

Primary environment variable for this skill

***

### requires?

> `optional` **requires**: [`SkillRequirements`](SkillRequirements.md)

Defined in: [packages/agentos/src/skills/types.ts:112](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L112)

Requirements for eligibility

***

### skillKey?

> `optional` **skillKey**: `string`

Defined in: [packages/agentos/src/skills/types.ts:97](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L97)

Override skill key (default: folder name)
