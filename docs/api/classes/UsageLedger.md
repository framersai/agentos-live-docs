# Class: UsageLedger

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:67](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/utils/usage/UsageLedger.ts#L67)

UsageLedger accumulates usage metrics from provider responses.
Usage ingestion MUST be called for final streaming chunks or any non-streaming responses.

## Constructors

### Constructor

> **new UsageLedger**(`options?`): `UsageLedger`

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:71](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/utils/usage/UsageLedger.ts#L71)

#### Parameters

##### options?

[`UsageLedgerOptions`](../interfaces/UsageLedgerOptions.md) = `{}`

#### Returns

`UsageLedger`

## Methods

### bootstrapFromPersistence()

> **bootstrapFromPersistence**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:209](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/utils/usage/UsageLedger.ts#L209)

Load all buckets from persistence (merging into existing).

#### Returns

`Promise`\<`void`\>

***

### flush()

> **flush**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:201](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/utils/usage/UsageLedger.ts#L201)

Persist current buckets if an adapter is configured.

#### Returns

`Promise`\<`void`\>

***

### getSessionAggregate()

> **getSessionAggregate**(`sessionId`): `UsageBucket` \| `undefined`

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:178](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/utils/usage/UsageLedger.ts#L178)

Aggregate totals across all buckets for a session.

#### Parameters

##### sessionId

`string`

#### Returns

`UsageBucket` \| `undefined`

***

### getSummariesBySession()

> **getSummariesBySession**(`sessionId`): `UsageBucket`[]

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:173](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/utils/usage/UsageLedger.ts#L173)

Query by session id.

#### Parameters

##### sessionId

`string`

#### Returns

`UsageBucket`[]

***

### ingestCompletionChunk()

> **ingestCompletionChunk**(`dim`, `chunk`): `void`

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:95](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/utils/usage/UsageLedger.ts#L95)

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

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:138](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/utils/usage/UsageLedger.ts#L138)

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

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:168](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/utils/usage/UsageLedger.ts#L168)

Return all summaries.

#### Returns

`UsageBucket`[]
