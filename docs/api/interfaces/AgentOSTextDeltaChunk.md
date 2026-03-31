# Interface: AgentOSTextDeltaChunk

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:58](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types/AgentOSResponse.ts#L58)

## Extends

- [`AgentOSResponseChunk`](AgentOSResponseChunk.md)

## Properties

### gmiInstanceId

> **gmiInstanceId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:46](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types/AgentOSResponse.ts#L46)

#### Inherited from

[`AgentOSResponseChunk`](AgentOSResponseChunk.md).[`gmiInstanceId`](AgentOSResponseChunk.md#gmiinstanceid)

***

### isFinal

> **isFinal**: `boolean`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:48](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types/AgentOSResponse.ts#L48)

#### Inherited from

[`AgentOSResponseChunk`](AgentOSResponseChunk.md).[`isFinal`](AgentOSResponseChunk.md#isfinal)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:50](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types/AgentOSResponse.ts#L50)

#### Inherited from

[`AgentOSResponseChunk`](AgentOSResponseChunk.md).[`metadata`](AgentOSResponseChunk.md#metadata)

***

### personaId

> **personaId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:47](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types/AgentOSResponse.ts#L47)

#### Inherited from

[`AgentOSResponseChunk`](AgentOSResponseChunk.md).[`personaId`](AgentOSResponseChunk.md#personaid)

***

### streamId

> **streamId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:45](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types/AgentOSResponse.ts#L45)

#### Inherited from

[`AgentOSResponseChunk`](AgentOSResponseChunk.md).[`streamId`](AgentOSResponseChunk.md#streamid)

***

### textDelta

> **textDelta**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:60](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types/AgentOSResponse.ts#L60)

***

### timestamp

> **timestamp**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:49](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types/AgentOSResponse.ts#L49)

#### Inherited from

[`AgentOSResponseChunk`](AgentOSResponseChunk.md).[`timestamp`](AgentOSResponseChunk.md#timestamp)

***

### type

> **type**: [`TEXT_DELTA`](../enumerations/AgentOSResponseChunkType.md#text_delta)

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:59](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types/AgentOSResponse.ts#L59)

#### Overrides

[`AgentOSResponseChunk`](AgentOSResponseChunk.md).[`type`](AgentOSResponseChunk.md#type)
