# Interface: ICognitiveMemoryManager

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:98](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L98)

## Methods

### assembleForPrompt()

> **assembleForPrompt**(`query`, `tokenBudget`, `mood`, `options?`): `Promise`\<[`AssembledMemoryContext`](AssembledMemoryContext.md)\>

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:132](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L132)

Assemble memory context for prompt injection within a token budget.

#### Parameters

##### query

`string`

##### tokenBudget

`number`

##### mood

[`PADState`](PADState.md)

##### options?

[`CognitiveRetrievalOptions`](CognitiveRetrievalOptions.md)

#### Returns

`Promise`\<[`AssembledMemoryContext`](AssembledMemoryContext.md)\>

***

### checkProspective()?

> `optional` **checkProspective**(`context`): `Promise`\<[`ProspectiveMemoryItem`](ProspectiveMemoryItem.md)[]\>

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:147](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L147)

Check prospective memory triggers (Batch 2).

#### Parameters

##### context

###### events?

`string`[]

###### now?

`number`

###### queryEmbedding?

`number`[]

###### queryText?

`string`

#### Returns

`Promise`\<[`ProspectiveMemoryItem`](ProspectiveMemoryItem.md)[]\>

***

### encode()

> **encode**(`input`, `mood`, `gmiMood`, `options?`): `Promise`\<[`MemoryTrace`](MemoryTrace.md)\>

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:102](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L102)

Encode a new input into a memory trace. Called after each user message.

#### Parameters

##### input

`string`

##### mood

[`PADState`](PADState.md)

##### gmiMood

`string`

##### options?

###### contentSentiment?

`number`

###### entities?

`string`[]

###### perspectiveSource?

\{ `eventHash`: `string`; `eventId`: `string`; \}

When encoding a subjective trace from PerspectiveObserver,
thread the source-event identifiers through so the resulting
[MemoryTrace](MemoryTrace.md) carries the `MechanismMetadata` fields that
`applyReconsolidation` reads at retrieval time.

###### perspectiveSource.eventHash

`string`

###### perspectiveSource.eventId

`string`

###### scope?

[`MemoryScope`](../type-aliases/MemoryScope.md)

###### scopeId?

`string`

###### sourceType?

[`MemorySourceType`](../type-aliases/MemorySourceType.md)

###### tags?

`string`[]

###### type?

[`MemoryType`](../type-aliases/MemoryType.md)

#### Returns

`Promise`\<[`MemoryTrace`](MemoryTrace.md)\>

***

### flushReflection()

> **flushReflection**(`mood?`, `scopeOverride?`): `Promise`\<[`FlushReflectionResult`](FlushReflectionResult.md)\>

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:212](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L212)

Step-8: Force the memory reflector to run over any pending observation
notes regardless of accumulated-token threshold. Encoded reflection
traces land in the memory store; superseded trace IDs are soft-deleted.
Returns the IDs so callers can apply side effects (e.g. BM25 indexing).

#### Parameters

##### mood?

[`PADState`](PADState.md)

Optional mood override passed to each encoded trace.

##### scopeOverride?

When set, overrides the `scope` + `scopeId` on
  every reflection-derived trace before encoding. Needed when the
  caller (e.g. bench adapter) needs all reflection traces to land in
  the same scope the retrieval path queries, regardless of what the
  reflector LLM invented.

###### scope

[`MemoryScope`](../type-aliases/MemoryScope.md)

###### scopeId

`string`

#### Returns

`Promise`\<[`FlushReflectionResult`](FlushReflectionResult.md)\>

***

### getConfig()

> **getConfig**(): [`CognitiveMemoryConfig`](CognitiveMemoryConfig.md)

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:188](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L188)

Get the resolved cognitive-memory runtime config.

#### Returns

[`CognitiveMemoryConfig`](CognitiveMemoryConfig.md)

***

### getContextTransparencyReport()

> **getContextTransparencyReport**(): `string` \| `null`

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:241](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L241)

Get a human-readable compaction/transparency report when enabled.

#### Returns

`string` \| `null`

***

### getContextWindowStats()

> **getContextWindowStats**(): [`ContextWindowStats`](ContextWindowStats.md) \| `null`

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:238](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L238)

Get infinite-context runtime stats when enabled.

#### Returns

[`ContextWindowStats`](ContextWindowStats.md) \| `null`

***

### getGraph()

> **getGraph**(): [`IMemoryGraph`](IMemoryGraph.md) \| `null`

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:191](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L191)

Get graph module when enabled.

#### Returns

[`IMemoryGraph`](IMemoryGraph.md) \| `null`

***

### getHydeRetriever()?

> `optional` **getHydeRetriever**(): [`HydeRetriever`](../classes/HydeRetriever.md) \| `null`

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:227](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L227)

Get the HyDE retriever if configured, or `null`.

#### Returns

[`HydeRetriever`](../classes/HydeRetriever.md) \| `null`

***

### getMemoryHealth()

> **getMemoryHealth**(): `Promise`\<[`MemoryHealthReport`](MemoryHealthReport.md)\>

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:171](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L171)

Get memory health diagnostics.

#### Returns

`Promise`\<[`MemoryHealthReport`](MemoryHealthReport.md)\>

***

### getObserver()

> **getObserver**(): [`MemoryObserver`](../classes/MemoryObserver.md) \| `null`

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:194](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L194)

Get observer module when enabled.

#### Returns

[`MemoryObserver`](../classes/MemoryObserver.md) \| `null`

***

### getProspective()

> **getProspective**(): [`ProspectiveMemoryManager`](../classes/ProspectiveMemoryManager.md) \| `null`

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:218](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L218)

Get prospective-memory manager when enabled.

#### Returns

[`ProspectiveMemoryManager`](../classes/ProspectiveMemoryManager.md) \| `null`

***

### getReflector()

> **getReflector**(): [`MemoryReflector`](../classes/MemoryReflector.md) \| `null`

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:197](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L197)

Get the memory reflector if configured, or `null`.

#### Returns

[`MemoryReflector`](../classes/MemoryReflector.md) \| `null`

***

### getRerankerService()?

> `optional` **getRerankerService**(): `RerankerService` \| `null`

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:235](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L235)

Get the attached neural reranker, or `null` when none is
configured. Step 3 uses this so the bench-side `HybridRetriever`
can plumb the manager's reranker into the per-case retriever
without bracket-accessing a private field.

#### Returns

`RerankerService` \| `null`

***

### getStore()

> **getStore**(): [`MemoryStore`](../classes/MemoryStore.md)

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:174](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L174)

Access the underlying long-term memory store for diagnostics/devtools.

#### Returns

[`MemoryStore`](../classes/MemoryStore.md)

***

### getTraceCount()

> **getTraceCount**(): `number`

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:182](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L182)

Total number of memory traces currently resident in the manager's
in-memory trace cache. Ergonomic passthrough to
[MemoryStore.getTraceCount](../classes/MemoryStore.md#gettracecount); used by agentos-bench for
memory-footprint telemetry.

#### Returns

`number`

***

### getWorkingMemory()

> **getWorkingMemory**(): [`CognitiveWorkingMemory`](../classes/CognitiveWorkingMemory.md)

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:185](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L185)

Access the working-memory model for diagnostics/devtools.

#### Returns

[`CognitiveWorkingMemory`](../classes/CognitiveWorkingMemory.md)

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:99](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L99)

#### Parameters

##### config

[`CognitiveMemoryConfig`](CognitiveMemoryConfig.md)

#### Returns

`Promise`\<`void`\>

***

### listProspective()?

> `optional` **listProspective**(): `Promise`\<[`ProspectiveMemoryItem`](ProspectiveMemoryItem.md)[]\>

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:162](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L162)

List active prospective reminders.

#### Returns

`Promise`\<[`ProspectiveMemoryItem`](ProspectiveMemoryItem.md)[]\>

***

### observe()?

> `optional` **observe**(`role`, `content`, `mood?`): `Promise`\<[`ObservationNote`](ObservationNote.md)[] \| `null`\>

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:140](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L140)

Feed a message to the observer (Batch 2). Returns notes if threshold reached.

#### Parameters

##### role

`"user"` | `"tool"` | `"system"` | `"assistant"`

##### content

`string`

##### mood?

[`PADState`](PADState.md)

#### Returns

`Promise`\<[`ObservationNote`](ObservationNote.md)[] \| `null`\>

***

### registerProspective()?

> `optional` **registerProspective**(`input`): `Promise`\<[`ProspectiveMemoryItem`](ProspectiveMemoryItem.md)\>

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:155](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L155)

Register a new prospective reminder/intention.

#### Parameters

##### input

`Omit`\<[`ProspectiveMemoryItem`](ProspectiveMemoryItem.md), `"id"` \| `"createdAt"` \| `"triggered"` \| `"cueEmbedding"`\> & `object`

#### Returns

`Promise`\<[`ProspectiveMemoryItem`](ProspectiveMemoryItem.md)\>

***

### rehydrate()?

> `optional` **rehydrate**(`traceId`, `requestContext?`): `Promise`\<`string` \| `null`\>

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:252](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L252)

Return the verbatim content that was archived when this trace was
consolidated, or `null` if the trace is not gisted/archived or the
archive is unreachable.

#### Parameters

##### traceId

`string`

The trace id to rehydrate.

##### requestContext?

`string`

Optional caller hint for audit.

#### Returns

`Promise`\<`string` \| `null`\>

The original verbatim content, or `null`.

***

### removeProspective()?

> `optional` **removeProspective**(`id`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:165](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L165)

Remove a prospective reminder.

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`boolean`\>

***

### retrieve()

> **retrieve**(`query`, `mood`, `options?`): `Promise`\<[`CognitiveRetrievalResult`](CognitiveRetrievalResult.md)\>

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:125](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L125)

Retrieve relevant memories for a query. Called before prompt construction.

#### Parameters

##### query

`string`

##### mood

[`PADState`](PADState.md)

##### options?

[`CognitiveRetrievalOptions`](CognitiveRetrievalOptions.md)

#### Returns

`Promise`\<[`CognitiveRetrievalResult`](CognitiveRetrievalResult.md)\>

***

### runConsolidation()?

> `optional` **runConsolidation**(): `Promise`\<[`ConsolidationResult`](ConsolidationResult.md)\>

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:168](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L168)

Run consolidation cycle (Batch 2).

#### Returns

`Promise`\<[`ConsolidationResult`](ConsolidationResult.md)\>

***

### setHydeRetriever()?

> `optional` **setHydeRetriever**(`retriever`): `void`

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:224](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L224)

Attach a HyDE retriever for hypothesis-driven memory recall.
Pass `null` to disable.

#### Parameters

##### retriever

[`HydeRetriever`](../classes/HydeRetriever.md) | `null`

#### Returns

`void`

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:255](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L255)

Shutdown and release resources.

#### Returns

`Promise`\<`void`\>
