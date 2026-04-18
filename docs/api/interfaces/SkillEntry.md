# Interface: SkillEntry

Defined in: [packages/agentos/src/skills/types.ts:190](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L190)

Complete skill entry with all metadata.

## Properties

### frontmatter

> **frontmatter**: [`ParsedSkillFrontmatter`](../type-aliases/ParsedSkillFrontmatter.md)

Defined in: [packages/agentos/src/skills/types.ts:195](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L195)

Raw frontmatter values

***

### invocation?

> `optional` **invocation**: [`SkillInvocationPolicy`](SkillInvocationPolicy.md)

Defined in: [packages/agentos/src/skills/types.ts:201](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L201)

Invocation policy

***

### metadata?

> `optional` **metadata**: [`SkillMetadata`](SkillMetadata.md)

Defined in: [packages/agentos/src/skills/types.ts:198](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L198)

Parsed AgentOS/Wunderland/OpenClaw metadata

***

### skill

> **skill**: [`Skill`](Skill.md)

Defined in: [packages/agentos/src/skills/types.ts:192](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L192)

Core skill data

***

### source?

> `optional` **source**: `string`

Defined in: [packages/agentos/src/skills/types.ts:207](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L207)

Optional source tag indicating where the skill was loaded from (e.g., "bundled", "workspace").

***

### sourcePath?

> `optional` **sourcePath**: `string`

Defined in: [packages/agentos/src/skills/types.ts:204](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L204)

Source directory path
