# Class: UsageLedger

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:54](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/utils/usage/UsageLedger.ts#L54)

UsageLedger accumulates usage metrics from provider responses.
Usage ingestion MUST be called for final streaming chunks or any non-streaming responses.

## Constructors

### Constructor

> **new UsageLedger**(`options?`): `UsageLedger`

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:58](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/utils/usage/UsageLedger.ts#L58)

#### Parameters

##### options?

[`UsageLedgerOptions`](../interfaces/UsageLedgerOptions.md) = `{}`

#### Returns

`UsageLedger`

## Methods

### bootstrapFromPersistence()

> **bootstrapFromPersistence**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:172](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/utils/usage/UsageLedger.ts#L172)

Load all buckets from persistence (merging into existing).

#### Returns

`Promise`\<`void`\>

***

### flush()

> **flush**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:164](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/utils/usage/UsageLedger.ts#L164)

Persist current buckets if an adapter is configured.

#### Returns

`Promise`\<`void`\>

***

### getSessionAggregate()

> **getSessionAggregate**(`sessionId`): `UsageBucket` \| `undefined`

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:147](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/utils/usage/UsageLedger.ts#L147)

Aggregate totals across all buckets for a session.

#### Parameters

##### sessionId

`string`

#### Returns

`UsageBucket` \| `undefined`

***

### getSummariesBySession()

> **getSummariesBySession**(`sessionId`): `UsageBucket`[]

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:142](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/utils/usage/UsageLedger.ts#L142)

Query by session id.

#### Parameters

##### sessionId

`string`

#### Returns

`UsageBucket`[]

***

### ingestCompletionChunk()

> **ingestCompletionChunk**(`dim`, `chunk`): `void`

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:82](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/utils/usage/UsageLedger.ts#L82)

Ingest a completion response chunk (streaming final or single shot) updating usage aggregates.
Non-final streaming chunks are ignored unless includeInterimStreamingUsage=true.

#### Parameters

##### dim

[`UsageDimensions`](../interfaces/UsageDimensions.md)

##### chunk

`ModelCompletionResponse`

#### Returns

`void`

***

### ingestUsage()

> **ingestUsage**(`dim`, `usage`): `void`

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:114](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/utils/usage/UsageLedger.ts#L114)

Manual ingestion for custom usage objects (e.g. embeddings).

#### Parameters

##### dim

[`UsageDimensions`](../interfaces/UsageDimensions.md)

##### usage

`ModelUsage` & `object`

#### Returns

`void`

***

### listAllSummaries()

> **listAllSummaries**(): `UsageBucket`[]

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:137](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/utils/usage/UsageLedger.ts#L137)

Return all summaries.

#### Returns

`UsageBucket`[]
