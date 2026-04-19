# Class: MemoryStore

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:132](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/store/MemoryStore.ts#L132)

## Constructors

### Constructor

> **new MemoryStore**(`config`): `MemoryStore`

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:151](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/store/MemoryStore.ts#L151)

#### Parameters

##### config

[`MemoryStoreConfig`](../interfaces/MemoryStoreConfig.md)

#### Returns

`MemoryStore`

## Methods

### getActiveTraceCount()

> **getActiveTraceCount**(): `number`

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:566](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/store/MemoryStore.ts#L566)

Get active trace count.

#### Returns

`number`

***

### getBrain()

> **getBrain**(): [`SqliteBrain`](SqliteBrain.md) \| `null`

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:172](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/store/MemoryStore.ts#L172)

Access the attached SqliteBrain for export/import operations.
Returns null when no brain is attached (in-memory only mode).

#### Returns

[`SqliteBrain`](SqliteBrain.md) \| `null`

***

### getByScope()

> **getByScope**(`scope`, `scopeId`, `type?`): `Promise`\<[`MemoryTrace`](../interfaces/MemoryTrace.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:474](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/store/MemoryStore.ts#L474)

Get all traces for a scope (for consolidation pipeline).

**Limitation**: This primarily returns traces from the in-process cache.
Traces that were persisted to the vector store in a prior process lifetime
(or by another process) will only be returned if the cache is empty for this
scope, in which case we fall back to querying the vector store with a
zero-vector and metadata filter. The fallback is approximate (limited by
topK) and does not guarantee completeness.

#### Parameters

##### scope

[`MemoryScope`](../type-aliases/MemoryScope.md)

##### scopeId

`string`

##### type?

[`MemoryType`](../type-aliases/MemoryType.md)

#### Returns

`Promise`\<[`MemoryTrace`](../interfaces/MemoryTrace.md)[]\>

***

### getTrace()

> **getTrace**(`traceId`): [`MemoryTrace`](../interfaces/MemoryTrace.md) \| `undefined`

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:552](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/store/MemoryStore.ts#L552)

Get a trace by ID.

#### Parameters

##### traceId

`string`

#### Returns

[`MemoryTrace`](../interfaces/MemoryTrace.md) \| `undefined`

***

### getTraceCount()

> **getTraceCount**(): `number`

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:559](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/store/MemoryStore.ts#L559)

Get trace count.

#### Returns

`number`

***

### listTraces()

> **listTraces**(`options?`): [`MemoryTrace`](../interfaces/MemoryTrace.md)[]

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:577](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/store/MemoryStore.ts#L577)

List cached traces for diagnostics and tooling.

#### Parameters

##### options?

###### activeOnly?

`boolean`

###### scope?

[`MemoryScope`](../type-aliases/MemoryScope.md)

###### scopeId?

`string`

###### type?

[`MemoryType`](../type-aliases/MemoryType.md)

#### Returns

[`MemoryTrace`](../interfaces/MemoryTrace.md)[]

***

### query()

> **query**(`queryText`, `currentMood`, `options?`): `Promise`\<\{ `partial`: [`PartiallyRetrievedTrace`](../interfaces/PartiallyRetrievedTrace.md)[]; `scored`: [`ScoredMemoryTrace`](../interfaces/ScoredMemoryTrace.md)[]; \}\>

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:290](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/store/MemoryStore.ts#L290)

Query memory traces with cognitive scoring.

#### Parameters

##### queryText

`string`

##### currentMood

[`PADState`](../interfaces/PADState.md)

##### options?

[`CognitiveRetrievalOptions`](../interfaces/CognitiveRetrievalOptions.md) = `{}`

#### Returns

`Promise`\<\{ `partial`: [`PartiallyRetrievedTrace`](../interfaces/PartiallyRetrievedTrace.md)[]; `scored`: [`ScoredMemoryTrace`](../interfaces/ScoredMemoryTrace.md)[]; \}\>

***

### recordAccess()

> **recordAccess**(`traceId`): `Promise`\<[`RetrievalUpdateResult`](../interfaces/RetrievalUpdateResult.md) \| `null`\>

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:397](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/store/MemoryStore.ts#L397)

Record that a memory was accessed (retrieved).
Updates decay parameters via spaced repetition.

#### Parameters

##### traceId

`string`

#### Returns

`Promise`\<[`RetrievalUpdateResult`](../interfaces/RetrievalUpdateResult.md) \| `null`\>

***

### setBrain()

> **setBrain**(`brain`): `void`

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:164](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/store/MemoryStore.ts#L164)

Attach a SqliteBrain for durable write-through persistence.
Once attached, all store/softDelete/recordAccess operations also
write to the brain's `memory_traces` table.

#### Parameters

##### brain

[`SqliteBrain`](SqliteBrain.md)

SqliteBrain instance (already initialized with schema)

#### Returns

`void`

***

### softDelete()

> **softDelete**(`traceId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:532](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/store/MemoryStore.ts#L532)

Soft-delete a trace.

#### Parameters

##### traceId

`string`

#### Returns

`Promise`\<`void`\>

***

### store()

> **store**(`trace`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:184](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/store/MemoryStore.ts#L184)

Store a new memory trace: embed content, upsert into vector store,
and record as episodic memory in the knowledge graph.

#### Parameters

##### trace

[`MemoryTrace`](../interfaces/MemoryTrace.md)

#### Returns

`Promise`\<`void`\>
