# Interface: Agent

Defined in: [packages/agentos/src/api/agent.ts:101](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/agent.ts#L101)

A stateful agent instance returned by [agent](../functions/agent.md).

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/api/agent.ts:128](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/agent.ts#L128)

Releases all in-memory session state held by this agent.

#### Returns

`Promise`\<`void`\>

***

### export()

> **export**(`metadata?`): [`AgentExportConfig`](AgentExportConfig.md)

Defined in: [packages/agentos/src/api/agent.ts:134](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/agent.ts#L134)

Exports the agent's configuration as a portable object.

#### Parameters

##### metadata?

Optional human-readable metadata to attach.

###### author?

`string`

Author identifier (person or system).

###### description?

`string`

Free-text description of what this agent does.

###### name?

`string`

Display name for the exported agent.

###### tags?

`string`[]

Searchable tags for categorization.

#### Returns

[`AgentExportConfig`](AgentExportConfig.md)

A portable [AgentExportConfig](AgentExportConfig.md) object.

***

### exportJSON()

> **exportJSON**(`metadata?`): `string`

Defined in: [packages/agentos/src/api/agent.ts:140](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/agent.ts#L140)

Exports the agent's configuration as a pretty-printed JSON string.

#### Parameters

##### metadata?

Optional human-readable metadata to attach.

###### author?

`string`

Author identifier (person or system).

###### description?

`string`

Free-text description of what this agent does.

###### name?

`string`

Display name for the exported agent.

###### tags?

`string`[]

Searchable tags for categorization.

#### Returns

`string`

JSON string.

***

### generate()

> **generate**(`prompt`, `opts?`): `Promise`\<[`GenerateTextResult`](GenerateTextResult.md)\>

Defined in: [packages/agentos/src/api/agent.ts:109](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/agent.ts#L109)

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

Defined in: [packages/agentos/src/api/agent.ts:124](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/agent.ts#L124)

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

Defined in: [packages/agentos/src/api/agent.ts:117](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/agent.ts#L117)

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

Defined in: [packages/agentos/src/api/agent.ts:126](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/agent.ts#L126)

Returns persisted usage totals for the whole agent or a single session.

#### Parameters

##### sessionId?

`string`

#### Returns

`Promise`\<[`AgentOSUsageAggregate`](AgentOSUsageAggregate.md)\>
