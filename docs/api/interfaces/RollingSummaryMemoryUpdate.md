# Interface: RollingSummaryMemoryUpdate

Defined in: [packages/agentos/src/core/conversation/IRollingSummaryMemorySink.ts:11](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/conversation/IRollingSummaryMemorySink.ts#L11)

## Properties

### conversationId

> **conversationId**: `string`

Defined in: [packages/agentos/src/core/conversation/IRollingSummaryMemorySink.ts:16](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/conversation/IRollingSummaryMemorySink.ts#L16)

***

### memoryPolicy?

> `optional` **memoryPolicy**: [`ResolvedLongTermMemoryPolicy`](ResolvedLongTermMemoryPolicy.md)

Defined in: [packages/agentos/src/core/conversation/IRollingSummaryMemorySink.ts:26](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/conversation/IRollingSummaryMemorySink.ts#L26)

Effective long-term memory policy for this conversation at the time of compaction.
Implementations should respect this (e.g., allow per-conversation opt-out).

***

### mode?

> `optional` **mode**: `string`

Defined in: [packages/agentos/src/core/conversation/IRollingSummaryMemorySink.ts:19](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/conversation/IRollingSummaryMemorySink.ts#L19)

Optional routing mode (customFlags.mode, persona id, etc.).

***

### organizationId?

> `optional` **organizationId**: `string`

Defined in: [packages/agentos/src/core/conversation/IRollingSummaryMemorySink.ts:14](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/conversation/IRollingSummaryMemorySink.ts#L14)

Optional organization context (multi-tenant / org-scoped memory).

***

### personaId

> **personaId**: `string`

Defined in: [packages/agentos/src/core/conversation/IRollingSummaryMemorySink.ts:17](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/conversation/IRollingSummaryMemorySink.ts#L17)

***

### profileId?

> `optional` **profileId**: `string` \| `null`

Defined in: [packages/agentos/src/core/conversation/IRollingSummaryMemorySink.ts:21](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/conversation/IRollingSummaryMemorySink.ts#L21)

Compaction profile id used for this update (if profile routing is enabled).

***

### sessionId

> **sessionId**: `string`

Defined in: [packages/agentos/src/core/conversation/IRollingSummaryMemorySink.ts:15](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/conversation/IRollingSummaryMemorySink.ts#L15)

***

### summaryJson

> **summaryJson**: `any`

Defined in: [packages/agentos/src/core/conversation/IRollingSummaryMemorySink.ts:31](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/conversation/IRollingSummaryMemorySink.ts#L31)

The structured memory JSON (`memory_json`) emitted by the compactor.

***

### summaryText

> **summaryText**: `string`

Defined in: [packages/agentos/src/core/conversation/IRollingSummaryMemorySink.ts:29](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/conversation/IRollingSummaryMemorySink.ts#L29)

The rolling summary markdown (human-readable).

***

### summaryUpdatedAt?

> `optional` **summaryUpdatedAt**: `number` \| `null`

Defined in: [packages/agentos/src/core/conversation/IRollingSummaryMemorySink.ts:35](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/conversation/IRollingSummaryMemorySink.ts#L35)

When this summary snapshot was updated.

***

### summaryUptoTimestamp?

> `optional` **summaryUptoTimestamp**: `number` \| `null`

Defined in: [packages/agentos/src/core/conversation/IRollingSummaryMemorySink.ts:33](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/conversation/IRollingSummaryMemorySink.ts#L33)

Timestamp up to which messages are considered summarized.

***

### userId

> **userId**: `string`

Defined in: [packages/agentos/src/core/conversation/IRollingSummaryMemorySink.ts:12](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/conversation/IRollingSummaryMemorySink.ts#L12)
