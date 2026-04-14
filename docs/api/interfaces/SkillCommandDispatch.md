# Interface: SkillCommandDispatch

Defined in: [packages/agentos/src/skills/types.ts:136](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/skills/types.ts#L136)

Dispatch specification for skill commands.

## Properties

### argMode?

> `optional` **argMode**: `"raw"`

Defined in: [packages/agentos/src/skills/types.ts:144](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/skills/types.ts#L144)

How to forward user-provided args

***

### kind

> **kind**: `"tool"`

Defined in: [packages/agentos/src/skills/types.ts:138](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/skills/types.ts#L138)

Dispatch kind (tool invocation)

***

### toolName

> **toolName**: `string`

Defined in: [packages/agentos/src/skills/types.ts:141](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/skills/types.ts#L141)

Name of the tool to invoke
