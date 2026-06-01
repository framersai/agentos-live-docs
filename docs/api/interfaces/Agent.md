# Interface: Agent

Defined in: [packages/agentos/src/api/agent.ts:333](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L333)

A stateful agent instance returned by [agent](../functions/agent.md).

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/api/agent.ts:362](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L362)

Releases all in-memory session state held by this agent.

#### Returns

`Promise`\<`void`\>

***

### export()

> **export**(`metadata?`): [`AgentExportConfig`](AgentExportConfig.md)

Defined in: [packages/agentos/src/api/agent.ts:368](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L368)

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

Defined in: [packages/agentos/src/api/agent.ts:374](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L374)

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

Defined in: [packages/agentos/src/api/agent.ts:342](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L342)

Generates a single reply without maintaining session history.
Accepts plain text or multimodal content (text + image parts).

#### Parameters

##### prompt

`MessageContent`

User prompt as text string or MessageContent array.

##### opts?

`Partial`\<[`GenerateTextOptions`](GenerateTextOptions.md)\>

Optional overrides merged on top of the agent's base options.

#### Returns

`Promise`\<[`GenerateTextResult`](GenerateTextResult.md)\>

The complete generation result.

***

### getAvatarBindings()

> **getAvatarBindings**(): `AvatarBindingInputs` & `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/api/agent.ts:376](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L376)

Read current avatar binding state (auto-populated from mood/voice/relationship).

#### Returns

`AvatarBindingInputs` & `Record`\<`string`, `unknown`\>

***

### session()

> **session**(`id?`): [`AgentSession`](AgentSession.md)

Defined in: [packages/agentos/src/api/agent.ts:358](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L358)

Returns (or creates) a named [AgentSession](AgentSession.md) with its own conversation history.

#### Parameters

##### id?

`string`

Optional session ID. A unique ID is generated when omitted.

#### Returns

[`AgentSession`](AgentSession.md)

The session object for this ID.

***

### setAvatarBindingOverrides()

> **setAvatarBindingOverrides**(`overrides`): `void`

Defined in: [packages/agentos/src/api/agent.ts:378](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L378)

Inject game-specific binding overrides (healthBand, combatMode, etc.).

#### Parameters

##### overrides

`Record`\<`string`, `unknown`\>

#### Returns

`void`

***

### stream()

> **stream**(`prompt`, `opts?`): [`StreamTextResult`](StreamTextResult.md)

Defined in: [packages/agentos/src/api/agent.ts:351](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L351)

Streams a single reply without maintaining session history.
Accepts plain text or multimodal content (text + image parts).

#### Parameters

##### prompt

`MessageContent`

User prompt as text string or MessageContent array.

##### opts?

`Partial`\<[`GenerateTextOptions`](GenerateTextOptions.md)\>

Optional overrides merged on top of the agent's base options.

#### Returns

[`StreamTextResult`](StreamTextResult.md)

A [StreamTextResult](StreamTextResult.md).

***

### usage()

> **usage**(`sessionId?`): `Promise`\<[`AgentOSUsageAggregate`](AgentOSUsageAggregate.md)\>

Defined in: [packages/agentos/src/api/agent.ts:360](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L360)

Returns persisted usage totals for the whole agent or a single session.

#### Parameters

##### sessionId?

`string`

#### Returns

`Promise`\<[`AgentOSUsageAggregate`](AgentOSUsageAggregate.md)\>
