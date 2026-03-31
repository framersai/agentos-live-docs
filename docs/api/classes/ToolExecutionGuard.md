# Class: ToolExecutionGuard

Defined in: [packages/agentos/src/safety/runtime/ToolExecutionGuard.ts:62](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/runtime/ToolExecutionGuard.ts#L62)

## Constructors

### Constructor

> **new ToolExecutionGuard**(`config?`): `ToolExecutionGuard`

Defined in: [packages/agentos/src/safety/runtime/ToolExecutionGuard.ts:66](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/runtime/ToolExecutionGuard.ts#L66)

#### Parameters

##### config?

`Partial`\<[`ToolExecutionGuardConfig`](../interfaces/ToolExecutionGuardConfig.md)\>

#### Returns

`ToolExecutionGuard`

## Methods

### execute()

> **execute**\<`T`\>(`toolName`, `fn`): `Promise`\<[`GuardedToolResult`](../interfaces/GuardedToolResult.md)\<`T`\>\>

Defined in: [packages/agentos/src/safety/runtime/ToolExecutionGuard.ts:70](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/runtime/ToolExecutionGuard.ts#L70)

#### Type Parameters

##### T

`T`

#### Parameters

##### toolName

`string`

##### fn

() => `Promise`\<`T`\>

#### Returns

`Promise`\<[`GuardedToolResult`](../interfaces/GuardedToolResult.md)\<`T`\>\>

***

### getAllToolHealth()

> **getAllToolHealth**(): [`ToolHealthReport`](../interfaces/ToolHealthReport.md)[]

Defined in: [packages/agentos/src/safety/runtime/ToolExecutionGuard.ts:147](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/runtime/ToolExecutionGuard.ts#L147)

#### Returns

[`ToolHealthReport`](../interfaces/ToolHealthReport.md)[]

***

### getToolHealth()

> **getToolHealth**(`toolName`): [`ToolHealthReport`](../interfaces/ToolHealthReport.md)

Defined in: [packages/agentos/src/safety/runtime/ToolExecutionGuard.ts:120](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/runtime/ToolExecutionGuard.ts#L120)

#### Parameters

##### toolName

`string`

#### Returns

[`ToolHealthReport`](../interfaces/ToolHealthReport.md)

***

### resetAll()

> **resetAll**(): `void`

Defined in: [packages/agentos/src/safety/runtime/ToolExecutionGuard.ts:162](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/runtime/ToolExecutionGuard.ts#L162)

#### Returns

`void`

***

### resetTool()

> **resetTool**(`toolName`): `void`

Defined in: [packages/agentos/src/safety/runtime/ToolExecutionGuard.ts:151](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/runtime/ToolExecutionGuard.ts#L151)

#### Parameters

##### toolName

`string`

#### Returns

`void`
