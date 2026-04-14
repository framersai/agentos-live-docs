# Interface: Agent

Defined in: [packages/agentos/src/api/agent.ts:181](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/agent.ts#L181)

A stateful agent instance returned by [agent](../functions/agent.md).

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/api/agent.ts:210](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/agent.ts#L210)

Releases all in-memory session state held by this agent.

#### Returns

`Promise`\<`void`\>

***

### export()

> **export**(`metadata?`): [`AgentExportConfig`](AgentExportConfig.md)

Defined in: [packages/agentos/src/api/agent.ts:216](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/agent.ts#L216)

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

Defined in: [packages/agentos/src/api/agent.ts:222](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/agent.ts#L222)

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

Defined in: [packages/agentos/src/api/agent.ts:190](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/agent.ts#L190)

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

Defined in: [packages/agentos/src/api/agent.ts:224](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/agent.ts#L224)

Read current avatar binding state (auto-populated from mood/voice/relationship).

#### Returns

`AvatarBindingInputs` & `Record`\<`string`, `unknown`\>

***

### session()

> **session**(`id?`): [`AgentSession`](AgentSession.md)

Defined in: [packages/agentos/src/api/agent.ts:206](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/agent.ts#L206)

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

Defined in: [packages/agentos/src/api/agent.ts:226](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/agent.ts#L226)

Inject game-specific binding overrides (healthBand, combatMode, etc.).

#### Parameters

##### overrides

`Record`\<`string`, `unknown`\>

#### Returns

`void`

***

### stream()

> **stream**(`prompt`, `opts?`): [`StreamTextResult`](StreamTextResult.md)

Defined in: [packages/agentos/src/api/agent.ts:199](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/agent.ts#L199)

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

Defined in: [packages/agentos/src/api/agent.ts:208](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/agent.ts#L208)

Returns persisted usage totals for the whole agent or a single session.

#### Parameters

##### sessionId?

`string`

#### Returns

`Promise`\<[`AgentOSUsageAggregate`](AgentOSUsageAggregate.md)\>
