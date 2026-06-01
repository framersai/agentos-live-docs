# Class: MemoryStore

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/MemoryStore.ts:178](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/MemoryStore.ts#L178)

## Constructors

### Constructor

> **new MemoryStore**(`config`): `MemoryStore`

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/MemoryStore.ts:197](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/MemoryStore.ts#L197)

#### Parameters

##### config

[`MemoryStoreConfig`](../interfaces/MemoryStoreConfig.md)

#### Returns

`MemoryStore`

## Methods

### getActiveTraceCount()

> **getActiveTraceCount**(): `number`

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/MemoryStore.ts:741](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/MemoryStore.ts#L741)

Get active trace count.

#### Returns

`number`

***

### getBrain()

> **getBrain**(): [`Brain`](Brain.md) \| `null`

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/MemoryStore.ts:218](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/MemoryStore.ts#L218)

Access the attached Brain for export/import operations.
Returns null when no brain is attached (in-memory only mode).

#### Returns

[`Brain`](Brain.md) \| `null`

***

### getByScope()

> **getByScope**(`scope`, `scopeId`, `type?`): `Promise`\<[`MemoryTrace`](../interfaces/MemoryTrace.md)[]\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/MemoryStore.ts:619](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/MemoryStore.ts#L619)

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

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/MemoryStore.ts:727](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/MemoryStore.ts#L727)

Get a trace by ID.

#### Parameters

##### traceId

`string`

#### Returns

[`MemoryTrace`](../interfaces/MemoryTrace.md) \| `undefined`

***

### getTraceCount()

> **getTraceCount**(): `number`

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/MemoryStore.ts:734](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/MemoryStore.ts#L734)

Get trace count.

#### Returns

`number`

***

### listTraces()

> **listTraces**(`options?`): [`MemoryTrace`](../interfaces/MemoryTrace.md)[]

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/MemoryStore.ts:752](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/MemoryStore.ts#L752)

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

### persistTraceMetadata()

> **persistTraceMetadata**(`traceId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/MemoryStore.ts:684](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/MemoryStore.ts#L684)

Re-upsert a trace's metadata to the vector store using the cached
embedding. Used by consolidation when a mutation to the in-memory
trace (e.g. `provenance.contradictedBy`, `provenance.lastVerifiedAt`)
needs to survive a process restart without paying for re-embedding.

No-ops silently when the trace or its embedding is not cached; the
caller should `getTrace` first or accept that an uncached trace will
not be durably updated.

#### Parameters

##### traceId

`string`

#### Returns

`Promise`\<`void`\>

***

### query()

> **query**(`queryText`, `currentMood`, `options?`): `Promise`\<\{ `partial`: [`PartiallyRetrievedTrace`](../interfaces/PartiallyRetrievedTrace.md)[]; `scored`: [`ScoredMemoryTrace`](../interfaces/ScoredMemoryTrace.md)[]; `timings`: \{ `scoringMs`: `number`; `vectorSearchMs`: `number`; \}; \}\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/MemoryStore.ts:355](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/MemoryStore.ts#L355)

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

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/MemoryStore.ts:542](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/MemoryStore.ts#L542)

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

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/MemoryStore.ts:210](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/MemoryStore.ts#L210)

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

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/MemoryStore.ts:707](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/MemoryStore.ts#L707)

Soft-delete a trace.

#### Parameters

##### traceId

`string`

#### Returns

`Promise`\<`void`\>

***

### store()

> **store**(`trace`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/store/MemoryStore.ts:230](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/store/MemoryStore.ts#L230)

Store a new memory trace: embed content, upsert into vector store,
and record as episodic memory in the knowledge graph.

#### Parameters

##### trace

[`MemoryTrace`](../interfaces/MemoryTrace.md)

#### Returns

`Promise`\<`void`\>
