# Interface: SkillCommandDispatch

Defined in: [packages/agentos/src/skills/types.ts:136](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L136)

Dispatch specification for skill commands.

## Properties

### argMode?

> `optional` **argMode**: `"raw"`

Defined in: [packages/agentos/src/skills/types.ts:144](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L144)

How to forward user-provided args

***

### kind

> **kind**: `"tool"`

Defined in: [packages/agentos/src/skills/types.ts:138](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L138)

Dispatch kind (tool invocation)

***

### toolName

> **toolName**: `string`

Defined in: [packages/agentos/src/skills/types.ts:141](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L141)

Name of the tool to invoke
