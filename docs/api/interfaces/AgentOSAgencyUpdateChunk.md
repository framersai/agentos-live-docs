# Interface: AgentOSAgencyUpdateChunk

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:189](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types/AgentOSResponse.ts#L189)

## Extends

- [`AgentOSResponseChunk`](AgentOSResponseChunk.md)

## Properties

### agency

> **agency**: `object`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:191](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types/AgentOSResponse.ts#L191)

#### agencyId

> **agencyId**: `string`

#### conversationId?

> `optional` **conversationId**: `string`

#### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

#### seats

> **seats**: `object`[]

#### workflowId

> **workflowId**: `string`

***

### gmiInstanceId

> **gmiInstanceId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:46](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types/AgentOSResponse.ts#L46)

#### Inherited from

[`AgentOSResponseChunk`](AgentOSResponseChunk.md).[`gmiInstanceId`](AgentOSResponseChunk.md#gmiinstanceid)

***

### isFinal

> **isFinal**: `boolean`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:48](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types/AgentOSResponse.ts#L48)

#### Inherited from

[`AgentOSResponseChunk`](AgentOSResponseChunk.md).[`isFinal`](AgentOSResponseChunk.md#isfinal)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:50](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types/AgentOSResponse.ts#L50)

#### Inherited from

[`AgentOSResponseChunk`](AgentOSResponseChunk.md).[`metadata`](AgentOSResponseChunk.md#metadata)

***

### personaId

> **personaId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:47](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types/AgentOSResponse.ts#L47)

#### Inherited from

[`AgentOSResponseChunk`](AgentOSResponseChunk.md).[`personaId`](AgentOSResponseChunk.md#personaid)

***

### streamId

> **streamId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:45](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types/AgentOSResponse.ts#L45)

#### Inherited from

[`AgentOSResponseChunk`](AgentOSResponseChunk.md).[`streamId`](AgentOSResponseChunk.md#streamid)

***

### timestamp

> **timestamp**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:49](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types/AgentOSResponse.ts#L49)

#### Inherited from

[`AgentOSResponseChunk`](AgentOSResponseChunk.md).[`timestamp`](AgentOSResponseChunk.md#timestamp)

***

### type

> **type**: [`AGENCY_UPDATE`](../enumerations/AgentOSResponseChunkType.md#agency_update)

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:190](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types/AgentOSResponse.ts#L190)

#### Overrides

[`AgentOSResponseChunk`](AgentOSResponseChunk.md).[`type`](AgentOSResponseChunk.md#type)
