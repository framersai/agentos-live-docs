# Interface: ICognitiveMemoryManager

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:97](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L97)

## Methods

### assembleForPrompt()

> **assembleForPrompt**(`query`, `tokenBudget`, `mood`, `options?`): `Promise`\<[`AssembledMemoryContext`](AssembledMemoryContext.md)\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:124](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L124)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:139](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L139)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:101](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L101)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:204](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L204)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:180](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L180)

Get the resolved cognitive-memory runtime config.

#### Returns

[`CognitiveMemoryConfig`](CognitiveMemoryConfig.md)

***

### getContextTransparencyReport()

> **getContextTransparencyReport**(): `string` \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:233](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L233)

Get a human-readable compaction/transparency report when enabled.

#### Returns

`string` \| `null`

***

### getContextWindowStats()

> **getContextWindowStats**(): [`ContextWindowStats`](ContextWindowStats.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:230](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L230)

Get infinite-context runtime stats when enabled.

#### Returns

[`ContextWindowStats`](ContextWindowStats.md) \| `null`

***

### getGraph()

> **getGraph**(): [`IMemoryGraph`](IMemoryGraph.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:183](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L183)

Get graph module when enabled.

#### Returns

[`IMemoryGraph`](IMemoryGraph.md) \| `null`

***

### getHydeRetriever()?

> `optional` **getHydeRetriever**(): [`HydeRetriever`](../classes/HydeRetriever.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:219](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L219)

Get the HyDE retriever if configured, or `null`.

#### Returns

[`HydeRetriever`](../classes/HydeRetriever.md) \| `null`

***

### getMemoryHealth()

> **getMemoryHealth**(): `Promise`\<[`MemoryHealthReport`](MemoryHealthReport.md)\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:163](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L163)

Get memory health diagnostics.

#### Returns

`Promise`\<[`MemoryHealthReport`](MemoryHealthReport.md)\>

***

### getObserver()

> **getObserver**(): [`MemoryObserver`](../classes/MemoryObserver.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:186](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L186)

Get observer module when enabled.

#### Returns

[`MemoryObserver`](../classes/MemoryObserver.md) \| `null`

***

### getProspective()

> **getProspective**(): [`ProspectiveMemoryManager`](../classes/ProspectiveMemoryManager.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:210](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L210)

Get prospective-memory manager when enabled.

#### Returns

[`ProspectiveMemoryManager`](../classes/ProspectiveMemoryManager.md) \| `null`

***

### getReflector()

> **getReflector**(): [`MemoryReflector`](../classes/MemoryReflector.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:189](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L189)

Get the memory reflector if configured, or `null`.

#### Returns

[`MemoryReflector`](../classes/MemoryReflector.md) \| `null`

***

### getRerankerService()?

> `optional` **getRerankerService**(): `RerankerService` \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:227](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L227)

Get the attached neural reranker, or `null` when none is
configured. Step 3 uses this so the bench-side `HybridRetriever`
can plumb the manager's reranker into the per-case retriever
without bracket-accessing a private field.

#### Returns

`RerankerService` \| `null`

***

### getStore()

> **getStore**(): [`MemoryStore`](../classes/MemoryStore.md)

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:166](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L166)

Access the underlying long-term memory store for diagnostics/devtools.

#### Returns

[`MemoryStore`](../classes/MemoryStore.md)

***

### getTraceCount()

> **getTraceCount**(): `number`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:174](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L174)

Total number of memory traces currently resident in the manager's
in-memory trace cache. Ergonomic passthrough to
[MemoryStore.getTraceCount](../classes/MemoryStore.md#gettracecount); used by agentos-bench for
memory-footprint telemetry.

#### Returns

`number`

***

### getWorkingMemory()

> **getWorkingMemory**(): [`CognitiveWorkingMemory`](../classes/CognitiveWorkingMemory.md)

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:177](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L177)

Access the working-memory model for diagnostics/devtools.

#### Returns

[`CognitiveWorkingMemory`](../classes/CognitiveWorkingMemory.md)

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:98](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L98)

#### Parameters

##### config

[`CognitiveMemoryConfig`](CognitiveMemoryConfig.md)

#### Returns

`Promise`\<`void`\>

***

### listProspective()?

> `optional` **listProspective**(): `Promise`\<[`ProspectiveMemoryItem`](ProspectiveMemoryItem.md)[]\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:154](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L154)

List active prospective reminders.

#### Returns

`Promise`\<[`ProspectiveMemoryItem`](ProspectiveMemoryItem.md)[]\>

***

### observe()?

> `optional` **observe**(`role`, `content`, `mood?`): `Promise`\<[`ObservationNote`](ObservationNote.md)[] \| `null`\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:132](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L132)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:147](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L147)

Register a new prospective reminder/intention.

#### Parameters

##### input

`Omit`\<[`ProspectiveMemoryItem`](ProspectiveMemoryItem.md), `"id"` \| `"createdAt"` \| `"triggered"` \| `"cueEmbedding"`\> & `object`

#### Returns

`Promise`\<[`ProspectiveMemoryItem`](ProspectiveMemoryItem.md)\>

***

### rehydrate()?

> `optional` **rehydrate**(`traceId`, `requestContext?`): `Promise`\<`string` \| `null`\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:244](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L244)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:157](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L157)

Remove a prospective reminder.

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`boolean`\>

***

### retrieve()

> **retrieve**(`query`, `mood`, `options?`): `Promise`\<[`CognitiveRetrievalResult`](CognitiveRetrievalResult.md)\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:117](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L117)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:160](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L160)

Run consolidation cycle (Batch 2).

#### Returns

`Promise`\<[`ConsolidationResult`](ConsolidationResult.md)\>

***

### setHydeRetriever()?

> `optional` **setHydeRetriever**(`retriever`): `void`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:216](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L216)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:247](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L247)

Shutdown and release resources.

#### Returns

`Promise`\<`void`\>
