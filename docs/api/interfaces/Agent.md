# Interface: Agent

Defined in: [packages/agentos/src/api/agent.ts:296](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L296)

A stateful agent instance returned by [agent](../functions/agent.md).

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/api/agent.ts:325](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L325)

Releases all in-memory session state held by this agent.

#### Returns

`Promise`\<`void`\>

***

### export()

> **export**(`metadata?`): [`AgentExportConfig`](AgentExportConfig.md)

Defined in: [packages/agentos/src/api/agent.ts:331](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L331)

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

Defined in: [packages/agentos/src/api/agent.ts:337](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L337)

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

Defined in: [packages/agentos/src/api/agent.ts:305](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L305)

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

Defined in: [packages/agentos/src/api/agent.ts:339](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L339)

Read current avatar binding state (auto-populated from mood/voice/relationship).

#### Returns

`AvatarBindingInputs` & `Record`\<`string`, `unknown`\>

***

### session()

> **session**(`id?`): [`AgentSession`](AgentSession.md)

Defined in: [packages/agentos/src/api/agent.ts:321](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L321)

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

Defined in: [packages/agentos/src/api/agent.ts:341](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L341)

Inject game-specific binding overrides (healthBand, combatMode, etc.).

#### Parameters

##### overrides

`Record`\<`string`, `unknown`\>

#### Returns

`void`

***

### stream()

> **stream**(`prompt`, `opts?`): [`StreamTextResult`](StreamTextResult.md)

Defined in: [packages/agentos/src/api/agent.ts:314](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L314)

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

Defined in: [packages/agentos/src/api/agent.ts:323](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L323)

Returns persisted usage totals for the whole agent or a single session.

#### Parameters

##### sessionId?

`string`

#### Returns

`Promise`\<[`AgentOSUsageAggregate`](AgentOSUsageAggregate.md)\>
