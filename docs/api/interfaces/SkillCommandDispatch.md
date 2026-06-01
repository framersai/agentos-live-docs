# Interface: SkillCommandDispatch

Defined in: [packages/agentos/src/cognition/skills/types.ts:136](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/skills/types.ts#L136)

Dispatch specification for skill commands.

## Properties

### argMode?

> `optional` **argMode**: `"raw"`

Defined in: [packages/agentos/src/cognition/skills/types.ts:144](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/skills/types.ts#L144)

How to forward user-provided args

***

### kind

> **kind**: `"tool"`

Defined in: [packages/agentos/src/cognition/skills/types.ts:138](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/skills/types.ts#L138)

Dispatch kind (tool invocation)

***

### toolName

> **toolName**: `string`

Defined in: [packages/agentos/src/cognition/skills/types.ts:141](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/skills/types.ts#L141)

Name of the tool to invoke
