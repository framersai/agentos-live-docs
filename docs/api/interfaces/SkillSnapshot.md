# Interface: SkillSnapshot

Defined in: [packages/agentos/src/skills/types.ts:233](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L233)

Snapshot of skills for agent context.

## Properties

### createdAt

> **createdAt**: `Date`

Defined in: [packages/agentos/src/skills/types.ts:247](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L247)

Created timestamp

***

### prompt

> **prompt**: `string`

Defined in: [packages/agentos/src/skills/types.ts:235](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L235)

Formatted prompt text for LLM

***

### resolvedSkills?

> `optional` **resolvedSkills**: [`Skill`](Skill.md)[]

Defined in: [packages/agentos/src/skills/types.ts:241](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L241)

Resolved skills

***

### skills

> **skills**: `object`[]

Defined in: [packages/agentos/src/skills/types.ts:238](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L238)

List of included skills with names

#### name

> **name**: `string`

#### primaryEnv?

> `optional` **primaryEnv**: `string`

***

### version?

> `optional` **version**: `number`

Defined in: [packages/agentos/src/skills/types.ts:244](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L244)

Snapshot version
