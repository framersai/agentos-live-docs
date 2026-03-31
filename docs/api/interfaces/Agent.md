# Interface: Agent

Defined in: [packages/agentos/src/api/agent.ts:127](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/agent.ts#L127)

A stateful agent instance returned by [agent](../functions/agent.md).

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/api/agent.ts:154](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/agent.ts#L154)

Releases all in-memory session state held by this agent.

#### Returns

`Promise`\<`void`\>

***

### export()

> **export**(`metadata?`): [`AgentExportConfig`](AgentExportConfig.md)

Defined in: [packages/agentos/src/api/agent.ts:160](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/agent.ts#L160)

Exports the agent's configuration as a portable object.

#### Parameters

##### metadata?

Optional human-readable metadata to attach.

###### author?

`string`

###### description?

`string`

###### name?

`string`

###### tags?

`string`[]

#### Returns

[`AgentExportConfig`](AgentExportConfig.md)

A portable [AgentExportConfig](AgentExportConfig.md) object.

***

### exportJSON()

> **exportJSON**(`metadata?`): `string`

Defined in: [packages/agentos/src/api/agent.ts:166](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/agent.ts#L166)

Exports the agent's configuration as a pretty-printed JSON string.

#### Parameters

##### metadata?

Optional human-readable metadata to attach.

###### author?

`string`

###### description?

`string`

###### name?

`string`

###### tags?

`string`[]

#### Returns

`string`

JSON string.

***

### generate()

> **generate**(`prompt`, `opts?`): `Promise`\<[`GenerateTextResult`](GenerateTextResult.md)\>

Defined in: [packages/agentos/src/api/agent.ts:135](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/agent.ts#L135)

Generates a single reply without maintaining session history.

#### Parameters

##### prompt

`string`

User prompt text.

##### opts?

`Partial`\<[`GenerateTextOptions`](GenerateTextOptions.md)\>

Optional overrides merged on top of the agent's base options.

#### Returns

`Promise`\<[`GenerateTextResult`](GenerateTextResult.md)\>

The complete generation result.

***

### session()

> **session**(`id?`): [`AgentSession`](AgentSession.md)

Defined in: [packages/agentos/src/api/agent.ts:150](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/agent.ts#L150)

Returns (or creates) a named [AgentSession](AgentSession.md) with its own conversation history.

#### Parameters

##### id?

`string`

Optional session ID. A unique ID is generated when omitted.

#### Returns

[`AgentSession`](AgentSession.md)

The session object for this ID.

***

### stream()

> **stream**(`prompt`, `opts?`): [`StreamTextResult`](StreamTextResult.md)

Defined in: [packages/agentos/src/api/agent.ts:143](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/agent.ts#L143)

Streams a single reply without maintaining session history.

#### Parameters

##### prompt

`string`

User prompt text.

##### opts?

`Partial`\<[`GenerateTextOptions`](GenerateTextOptions.md)\>

Optional overrides merged on top of the agent's base options.

#### Returns

[`StreamTextResult`](StreamTextResult.md)

A [StreamTextResult](StreamTextResult.md).

***

### usage()

> **usage**(`sessionId?`): `Promise`\<[`AgentOSUsageAggregate`](AgentOSUsageAggregate.md)\>

Defined in: [packages/agentos/src/api/agent.ts:152](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/agent.ts#L152)

Returns persisted usage totals for the whole agent or a single session.

#### Parameters

##### sessionId?

`string`

#### Returns

`Promise`\<[`AgentOSUsageAggregate`](AgentOSUsageAggregate.md)\>
