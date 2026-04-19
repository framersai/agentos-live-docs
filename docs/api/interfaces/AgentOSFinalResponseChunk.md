# Interface: AgentOSFinalResponseChunk

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:125](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSResponse.ts#L125)

## Extends

- [`AgentOSResponseChunk`](AgentOSResponseChunk.md)

## Properties

### activePersonaDetails?

> `optional` **activePersonaDetails**: `Partial`\<[`IPersonaDefinition`](IPersonaDefinition.md)\>

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:141](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSResponse.ts#L141)

***

### audioOutput?

> `optional` **audioOutput**: [`AudioOutputConfig`](AudioOutputConfig.md)

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:135](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSResponse.ts#L135)

***

### error?

> `optional` **error**: `object`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:139](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSResponse.ts#L139)

#### code

> **code**: `string`

#### details?

> `optional` **details**: `any`

#### message

> **message**: `string`

***

### finalResponseText

> **finalResponseText**: `string` \| `null`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:127](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSResponse.ts#L127)

***

### finalResponseTextPlain?

> `optional` **finalResponseTextPlain**: `string` \| `null`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:132](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSResponse.ts#L132)

Plain-text rendering of `finalResponseText` intended for voice/TTS and logs.
When omitted, clients can derive it by stripping Markdown.

***

### finalToolCalls?

> `optional` **finalToolCalls**: [`ToolCallRequest`](ToolCallRequest.md)[]

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:133](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSResponse.ts#L133)

***

### finalUiCommands?

> `optional` **finalUiCommands**: [`UICommand`](UICommand.md)[]

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:134](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSResponse.ts#L134)

***

### gmiInstanceId

> **gmiInstanceId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:46](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSResponse.ts#L46)

#### Inherited from

[`AgentOSResponseChunk`](AgentOSResponseChunk.md).[`gmiInstanceId`](AgentOSResponseChunk.md#gmiinstanceid)

***

### imageOutput?

> `optional` **imageOutput**: [`ImageOutputConfig`](ImageOutputConfig.md)

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:136](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSResponse.ts#L136)

***

### isFinal

> **isFinal**: `boolean`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:48](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSResponse.ts#L48)

#### Inherited from

[`AgentOSResponseChunk`](AgentOSResponseChunk.md).[`isFinal`](AgentOSResponseChunk.md#isfinal)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:50](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSResponse.ts#L50)

#### Inherited from

[`AgentOSResponseChunk`](AgentOSResponseChunk.md).[`metadata`](AgentOSResponseChunk.md#metadata)

***

### personaId

> **personaId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:47](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSResponse.ts#L47)

#### Inherited from

[`AgentOSResponseChunk`](AgentOSResponseChunk.md).[`personaId`](AgentOSResponseChunk.md#personaid)

***

### ragSources?

> `optional` **ragSources**: [`RagRetrievedChunk`](RagRetrievedChunk.md)[]

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:149](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSResponse.ts#L149)

RAG source chunks that were used to generate this response.
Populated by the GMI when RAG retrieval was performed.
Used by grounding guardrails to verify response faithfulness.
Undefined when no RAG retrieval was performed.

***

### reasoningTrace?

> `optional` **reasoningTrace**: [`ReasoningTraceEntry`](ReasoningTraceEntry.md)[]

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:138](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSResponse.ts#L138)

***

### streamId

> **streamId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:45](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSResponse.ts#L45)

#### Inherited from

[`AgentOSResponseChunk`](AgentOSResponseChunk.md).[`streamId`](AgentOSResponseChunk.md#streamid)

***

### timestamp

> **timestamp**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:49](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSResponse.ts#L49)

#### Inherited from

[`AgentOSResponseChunk`](AgentOSResponseChunk.md).[`timestamp`](AgentOSResponseChunk.md#timestamp)

***

### type

> **type**: [`FINAL_RESPONSE`](../enumerations/AgentOSResponseChunkType.md#final_response)

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:126](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSResponse.ts#L126)

#### Overrides

[`AgentOSResponseChunk`](AgentOSResponseChunk.md).[`type`](AgentOSResponseChunk.md#type)

***

### updatedConversationContext?

> `optional` **updatedConversationContext**: `ConversationContext`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:140](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSResponse.ts#L140)

***

### usage?

> `optional` **usage**: [`CostAggregator`](CostAggregator.md)

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:137](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSResponse.ts#L137)
