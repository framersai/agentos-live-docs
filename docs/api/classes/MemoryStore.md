# Class: MemoryStore

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:132](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/MemoryStore.ts#L132)

## Constructors

### Constructor

> **new MemoryStore**(`config`): `MemoryStore`

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:144](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/MemoryStore.ts#L144)

#### Parameters

##### config

[`MemoryStoreConfig`](../interfaces/MemoryStoreConfig.md)

#### Returns

`MemoryStore`

## Methods

### getActiveTraceCount()

> **getActiveTraceCount**(): `number`

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:484](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/MemoryStore.ts#L484)

Get active trace count.

#### Returns

`number`

***

### getByScope()

> **getByScope**(`scope`, `scopeId`, `type?`): `Promise`\<[`MemoryTrace`](../interfaces/MemoryTrace.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:401](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/MemoryStore.ts#L401)

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

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:470](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/MemoryStore.ts#L470)

Get a trace by ID.

#### Parameters

##### traceId

`string`

#### Returns

[`MemoryTrace`](../interfaces/MemoryTrace.md) \| `undefined`

***

### getTraceCount()

> **getTraceCount**(): `number`

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:477](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/MemoryStore.ts#L477)

Get trace count.

#### Returns

`number`

***

### listTraces()

> **listTraces**(`options?`): [`MemoryTrace`](../interfaces/MemoryTrace.md)[]

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:495](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/MemoryStore.ts#L495)

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

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:229](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/MemoryStore.ts#L229)

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

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:336](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/MemoryStore.ts#L336)

Record that a memory was accessed (retrieved).
Updates decay parameters via spaced repetition.

#### Parameters

##### traceId

`string`

#### Returns

`Promise`\<[`RetrievalUpdateResult`](../interfaces/RetrievalUpdateResult.md) \| `null`\>

***

### softDelete()

> **softDelete**(`traceId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:459](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/MemoryStore.ts#L459)

Soft-delete a trace.

#### Parameters

##### traceId

`string`

#### Returns

`Promise`\<`void`\>

***

### store()

> **store**(`trace`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:158](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/MemoryStore.ts#L158)

Store a new memory trace: embed content, upsert into vector store,
and record as episodic memory in the knowledge graph.

#### Parameters

##### trace

[`MemoryTrace`](../interfaces/MemoryTrace.md)

#### Returns

`Promise`\<`void`\>
