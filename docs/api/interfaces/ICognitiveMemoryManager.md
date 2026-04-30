# Interface: ICognitiveMemoryManager

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:90](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L90)

## Methods

### assembleForPrompt()

> **assembleForPrompt**(`query`, `tokenBudget`, `mood`, `options?`): `Promise`\<[`AssembledMemoryContext`](AssembledMemoryContext.md)\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:117](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L117)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:132](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L132)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:94](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L94)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:197](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L197)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:173](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L173)

Get the resolved cognitive-memory runtime config.

#### Returns

[`CognitiveMemoryConfig`](CognitiveMemoryConfig.md)

***

### getContextTransparencyReport()

> **getContextTransparencyReport**(): `string` \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:226](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L226)

Get a human-readable compaction/transparency report when enabled.

#### Returns

`string` \| `null`

***

### getContextWindowStats()

> **getContextWindowStats**(): [`ContextWindowStats`](ContextWindowStats.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:223](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L223)

Get infinite-context runtime stats when enabled.

#### Returns

[`ContextWindowStats`](ContextWindowStats.md) \| `null`

***

### getGraph()

> **getGraph**(): [`IMemoryGraph`](IMemoryGraph.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:176](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L176)

Get graph module when enabled.

#### Returns

[`IMemoryGraph`](IMemoryGraph.md) \| `null`

***

### getHydeRetriever()?

> `optional` **getHydeRetriever**(): [`HydeRetriever`](../classes/HydeRetriever.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:212](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L212)

Get the HyDE retriever if configured, or `null`.

#### Returns

[`HydeRetriever`](../classes/HydeRetriever.md) \| `null`

***

### getMemoryHealth()

> **getMemoryHealth**(): `Promise`\<[`MemoryHealthReport`](MemoryHealthReport.md)\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:156](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L156)

Get memory health diagnostics.

#### Returns

`Promise`\<[`MemoryHealthReport`](MemoryHealthReport.md)\>

***

### getObserver()

> **getObserver**(): [`MemoryObserver`](../classes/MemoryObserver.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:179](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L179)

Get observer module when enabled.

#### Returns

[`MemoryObserver`](../classes/MemoryObserver.md) \| `null`

***

### getProspective()

> **getProspective**(): [`ProspectiveMemoryManager`](../classes/ProspectiveMemoryManager.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:203](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L203)

Get prospective-memory manager when enabled.

#### Returns

[`ProspectiveMemoryManager`](../classes/ProspectiveMemoryManager.md) \| `null`

***

### getReflector()

> **getReflector**(): [`MemoryReflector`](../classes/MemoryReflector.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:182](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L182)

Get the memory reflector if configured, or `null`.

#### Returns

[`MemoryReflector`](../classes/MemoryReflector.md) \| `null`

***

### getRerankerService()?

> `optional` **getRerankerService**(): `RerankerService` \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:220](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L220)

Get the attached neural reranker, or `null` when none is
configured. Step 3 uses this so the bench-side `HybridRetriever`
can plumb the manager's reranker into the per-case retriever
without bracket-accessing a private field.

#### Returns

`RerankerService` \| `null`

***

### getStore()

> **getStore**(): [`MemoryStore`](../classes/MemoryStore.md)

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:159](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L159)

Access the underlying long-term memory store for diagnostics/devtools.

#### Returns

[`MemoryStore`](../classes/MemoryStore.md)

***

### getTraceCount()

> **getTraceCount**(): `number`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:167](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L167)

Total number of memory traces currently resident in the manager's
in-memory trace cache. Ergonomic passthrough to
[MemoryStore.getTraceCount](../classes/MemoryStore.md#gettracecount); used by agentos-bench for
memory-footprint telemetry.

#### Returns

`number`

***

### getWorkingMemory()

> **getWorkingMemory**(): [`CognitiveWorkingMemory`](../classes/CognitiveWorkingMemory.md)

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:170](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L170)

Access the working-memory model for diagnostics/devtools.

#### Returns

[`CognitiveWorkingMemory`](../classes/CognitiveWorkingMemory.md)

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:91](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L91)

#### Parameters

##### config

[`CognitiveMemoryConfig`](CognitiveMemoryConfig.md)

#### Returns

`Promise`\<`void`\>

***

### listProspective()?

> `optional` **listProspective**(): `Promise`\<[`ProspectiveMemoryItem`](ProspectiveMemoryItem.md)[]\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:147](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L147)

List active prospective reminders.

#### Returns

`Promise`\<[`ProspectiveMemoryItem`](ProspectiveMemoryItem.md)[]\>

***

### observe()?

> `optional` **observe**(`role`, `content`, `mood?`): `Promise`\<[`ObservationNote`](ObservationNote.md)[] \| `null`\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:125](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L125)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:140](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L140)

Register a new prospective reminder/intention.

#### Parameters

##### input

`Omit`\<[`ProspectiveMemoryItem`](ProspectiveMemoryItem.md), `"id"` \| `"createdAt"` \| `"triggered"` \| `"cueEmbedding"`\> & `object`

#### Returns

`Promise`\<[`ProspectiveMemoryItem`](ProspectiveMemoryItem.md)\>

***

### rehydrate()?

> `optional` **rehydrate**(`traceId`, `requestContext?`): `Promise`\<`string` \| `null`\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:237](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L237)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:150](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L150)

Remove a prospective reminder.

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`boolean`\>

***

### retrieve()

> **retrieve**(`query`, `mood`, `options?`): `Promise`\<[`CognitiveRetrievalResult`](CognitiveRetrievalResult.md)\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:110](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L110)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:153](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L153)

Run consolidation cycle (Batch 2).

#### Returns

`Promise`\<[`ConsolidationResult`](ConsolidationResult.md)\>

***

### setHydeRetriever()?

> `optional` **setHydeRetriever**(`retriever`): `void`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:209](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L209)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:240](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L240)

Shutdown and release resources.

#### Returns

`Promise`\<`void`\>
