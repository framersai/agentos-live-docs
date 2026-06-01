# Interface: WrapForgeToolOptions

Defined in: [packages/agentos/src/cognition/emergent/wrapForgeTool.ts:70](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/wrapForgeTool.ts#L70)

Options for [wrapForgeTool](../functions/wrapForgeTool.md).

## Properties

### agentId

> **agentId**: `string`

Defined in: [packages/agentos/src/cognition/emergent/wrapForgeTool.ts:74](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/wrapForgeTool.ts#L74)

GMI / agent id patched onto the tool execution context.

***

### capture()

> **capture**: (`record`) => `void`

Defined in: [packages/agentos/src/cognition/emergent/wrapForgeTool.ts:78](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/wrapForgeTool.ts#L78)

Required capture sink. Every attempt (valid or not) is recorded.

#### Parameters

##### record

[`CapturedForge`](CapturedForge.md)

#### Returns

`void`

***

### log()?

> `optional` **log**: (`event`) => `void`

Defined in: [packages/agentos/src/cognition/emergent/wrapForgeTool.ts:89](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/wrapForgeTool.ts#L89)

Optional log callback for lifecycle visibility. When undefined,
no log events are emitted (quiet mode).

#### Parameters

##### event

[`ForgeLogEvent`](../type-aliases/ForgeLogEvent.md)

#### Returns

`void`

***

### raw

> **raw**: [`ForgeToolMetaTool`](../classes/ForgeToolMetaTool.md)

Defined in: [packages/agentos/src/cognition/emergent/wrapForgeTool.ts:72](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/wrapForgeTool.ts#L72)

The raw ForgeToolMetaTool instance from EmergentCapabilityEngine.

***

### scope?

> `optional` **scope**: `string`

Defined in: [packages/agentos/src/cognition/emergent/wrapForgeTool.ts:84](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/wrapForgeTool.ts#L84)

Optional scope label propagated onto every CapturedForge. Use for
semantic grouping when multiple callers share a wrapper (dept
name, channel id, agent role, etc.).

***

### sessionId

> **sessionId**: `string`

Defined in: [packages/agentos/src/cognition/emergent/wrapForgeTool.ts:76](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/wrapForgeTool.ts#L76)

Session id patched onto the tool execution context under sessionData.
