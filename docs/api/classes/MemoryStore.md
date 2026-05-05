# Class: MemoryStore

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:149](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/store/MemoryStore.ts#L149)

## Constructors

### Constructor

> **new MemoryStore**(`config`): `MemoryStore`

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:168](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/store/MemoryStore.ts#L168)

#### Parameters

##### config

[`MemoryStoreConfig`](../interfaces/MemoryStoreConfig.md)

#### Returns

`MemoryStore`

## Methods

### getActiveTraceCount()

> **getActiveTraceCount**(): `number`

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:682](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/store/MemoryStore.ts#L682)

Get active trace count.

#### Returns

`number`

***

### getBrain()

> **getBrain**(): [`Brain`](Brain.md) \| `null`

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:189](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/store/MemoryStore.ts#L189)

Access the attached Brain for export/import operations.
Returns null when no brain is attached (in-memory only mode).

#### Returns

[`Brain`](Brain.md) \| `null`

***

### getByScope()

> **getByScope**(`scope`, `scopeId`, `type?`): `Promise`\<[`MemoryTrace`](../interfaces/MemoryTrace.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:590](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/store/MemoryStore.ts#L590)

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

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:668](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/store/MemoryStore.ts#L668)

Get a trace by ID.

#### Parameters

##### traceId

`string`

#### Returns

[`MemoryTrace`](../interfaces/MemoryTrace.md) \| `undefined`

***

### getTraceCount()

> **getTraceCount**(): `number`

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:675](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/store/MemoryStore.ts#L675)

Get trace count.

#### Returns

`number`

***

### listTraces()

> **listTraces**(`options?`): [`MemoryTrace`](../interfaces/MemoryTrace.md)[]

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:693](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/store/MemoryStore.ts#L693)

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

> **query**(`queryText`, `currentMood`, `options?`): `Promise`\<\{ `partial`: [`PartiallyRetrievedTrace`](../interfaces/PartiallyRetrievedTrace.md)[]; `scored`: [`ScoredMemoryTrace`](../interfaces/ScoredMemoryTrace.md)[]; `timings`: \{ `scoringMs`: `number`; `vectorSearchMs`: `number`; \}; \}\>

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:326](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/store/MemoryStore.ts#L326)

Query memory traces with cognitive scoring.

#### Parameters

##### queryText

`string`

##### currentMood

[`PADState`](../interfaces/PADState.md)

##### options?

[`CognitiveRetrievalOptions`](../interfaces/CognitiveRetrievalOptions.md) = `{}`

#### Returns

`Promise`\<\{ `partial`: [`PartiallyRetrievedTrace`](../interfaces/PartiallyRetrievedTrace.md)[]; `scored`: [`ScoredMemoryTrace`](../interfaces/ScoredMemoryTrace.md)[]; `timings`: \{ `scoringMs`: `number`; `vectorSearchMs`: `number`; \}; \}\>

***

### recordAccess()

> **recordAccess**(`traceId`): `Promise`\<[`RetrievalUpdateResult`](../interfaces/RetrievalUpdateResult.md) \| `null`\>

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:513](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/store/MemoryStore.ts#L513)

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

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:181](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/store/MemoryStore.ts#L181)

Attach a Brain for durable write-through persistence.
Once attached, all store/softDelete/recordAccess operations also
write to the brain's `memory_traces` table.

#### Parameters

##### brain

[`Brain`](Brain.md)

Brain instance (already initialized with schema)

#### Returns

`void`

***

### softDelete()

> **softDelete**(`traceId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:648](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/store/MemoryStore.ts#L648)

Soft-delete a trace.

#### Parameters

##### traceId

`string`

#### Returns

`Promise`\<`void`\>

***

### store()

> **store**(`trace`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:201](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/store/MemoryStore.ts#L201)

Store a new memory trace: embed content, upsert into vector store,
and record as episodic memory in the knowledge graph.

#### Parameters

##### trace

[`MemoryTrace`](../interfaces/MemoryTrace.md)

#### Returns

`Promise`\<`void`\>
