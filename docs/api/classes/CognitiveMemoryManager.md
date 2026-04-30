# Class: CognitiveMemoryManager

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:256](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L256)

## Implements

- [`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md)

## Constructors

### Constructor

> **new CognitiveMemoryManager**(): `CognitiveMemoryManager`

#### Returns

`CognitiveMemoryManager`

## Methods

### assembleForPrompt()

> **assembleForPrompt**(`query`, `tokenBudget`, `mood`, `options?`): `Promise`\<[`AssembledMemoryContext`](../interfaces/AssembledMemoryContext.md)\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:739](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L739)

Assemble memory context for prompt injection within a token budget.

#### Parameters

##### query

`string`

##### tokenBudget

`number`

##### mood

[`PADState`](../interfaces/PADState.md)

##### options?

[`CognitiveRetrievalOptions`](../interfaces/CognitiveRetrievalOptions.md) = `{}`

#### Returns

`Promise`\<[`AssembledMemoryContext`](../interfaces/AssembledMemoryContext.md)\>

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`assembleForPrompt`](../interfaces/ICognitiveMemoryManager.md#assembleforprompt)

***

### checkProspective()

> **checkProspective**(`context`): `Promise`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md)[]\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:962](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L962)

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

`Promise`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md)[]\>

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`checkProspective`](../interfaces/ICognitiveMemoryManager.md#checkprospective)

***

### compactIfNeeded()

> **compactIfNeeded**(`systemPromptTokens`, `memoryBudgetTokens`): `Promise`\<[`ContextMessage`](../interfaces/ContextMessage.md)[] \| `null`\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1100](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L1100)

Run context window compaction if needed. Call BEFORE assembling the LLM prompt.
Returns the (potentially compacted) message list for the conversation.
If infinite context is disabled, returns null (caller should use original messages).

#### Parameters

##### systemPromptTokens

`number`

##### memoryBudgetTokens

`number`

#### Returns

`Promise`\<[`ContextMessage`](../interfaces/ContextMessage.md)[] \| `null`\>

***

### encode()

> **encode**(`input`, `mood`, `gmiMood`, `options?`): `Promise`\<[`MemoryTrace`](../interfaces/MemoryTrace.md)\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:463](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L463)

Encode a new input into a memory trace. Called after each user message.

#### Parameters

##### input

`string`

##### mood

[`PADState`](../interfaces/PADState.md)

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

`Promise`\<[`MemoryTrace`](../interfaces/MemoryTrace.md)\>

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`encode`](../interfaces/ICognitiveMemoryManager.md#encode)

***

### exportToString()

> **exportToString**(`options?`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1261](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L1261)

Export the full brain state as a JSON string.
Delegates to JsonExporter through the MemoryStore's brain.
Throws if no brain is attached.

#### Parameters

##### options?

[`ExportOptions`](../interfaces/ExportOptions.md)

#### Returns

`Promise`\<`string`\>

***

### flushReflection()

> **flushReflection**(`mood?`, `scopeOverride?`): `Promise`\<[`FlushReflectionResult`](../interfaces/FlushReflectionResult.md)\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1209](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L1209)

Step-8: Force the reflector to run over pending notes regardless of
threshold. Encodes reflection traces, soft-deletes superseded IDs.
Safe to call when no reflector or no pending notes exist (returns
an empty result). Errors do not propagate — reflection is non-critical.

`scopeOverride` forces every encoded reflection trace to use the
caller-supplied scope + scopeId, overriding whatever the reflector
LLM invented. Callers that want all reflection traces to land in a
single canonical scope (e.g. bench adapters that retrieve under
`user/bench`) should pass this override.

#### Parameters

##### mood?

[`PADState`](../interfaces/PADState.md)

##### scopeOverride?

###### scope

[`MemoryScope`](../type-aliases/MemoryScope.md)

###### scopeId

`string`

#### Returns

`Promise`\<[`FlushReflectionResult`](../interfaces/FlushReflectionResult.md)\>

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`flushReflection`](../interfaces/ICognitiveMemoryManager.md#flushreflection)

***

### getCompactionHistory()

> **getCompactionHistory**(): readonly [`CompactionEntry`](../interfaces/CompactionEntry.md)[]

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1133](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L1133)

Get compaction history for audit/UI.

#### Returns

readonly [`CompactionEntry`](../interfaces/CompactionEntry.md)[]

***

### getConfig()

> **getConfig**(): [`CognitiveMemoryConfig`](../interfaces/CognitiveMemoryConfig.md)

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1180](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L1180)

Get the resolved cognitive-memory runtime config.

#### Returns

[`CognitiveMemoryConfig`](../interfaces/CognitiveMemoryConfig.md)

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getConfig`](../interfaces/ICognitiveMemoryManager.md#getconfig)

***

### getContextTransparencyReport()

> **getContextTransparencyReport**(): `string` \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1128](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L1128)

Get full transparency report (for agent self-inspection or UI).

#### Returns

`string` \| `null`

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getContextTransparencyReport`](../interfaces/ICognitiveMemoryManager.md#getcontexttransparencyreport)

***

### getContextWindowManager()

> **getContextWindowManager**(): [`ContextWindowManager`](ContextWindowManager.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1143](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L1143)

Get the context window manager (for advanced usage).

#### Returns

[`ContextWindowManager`](ContextWindowManager.md) \| `null`

***

### getContextWindowStats()

> **getContextWindowStats**(): [`ContextWindowStats`](../interfaces/ContextWindowStats.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1123](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L1123)

Get context window transparency stats.

#### Returns

[`ContextWindowStats`](../interfaces/ContextWindowStats.md) \| `null`

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getContextWindowStats`](../interfaces/ICognitiveMemoryManager.md#getcontextwindowstats)

***

### getGraph()

> **getGraph**(): [`IMemoryGraph`](../interfaces/IMemoryGraph.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1184](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L1184)

Get graph module when enabled.

#### Returns

[`IMemoryGraph`](../interfaces/IMemoryGraph.md) \| `null`

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getGraph`](../interfaces/ICognitiveMemoryManager.md#getgraph)

***

### getHydeRetriever()

> **getHydeRetriever**(): [`HydeRetriever`](HydeRetriever.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1312](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L1312)

Get the HyDE retriever if configured, or `null`.

#### Returns

[`HydeRetriever`](HydeRetriever.md) \| `null`

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getHydeRetriever`](../interfaces/ICognitiveMemoryManager.md#gethyderetriever)

***

### getMemoryHealth()

> **getMemoryHealth**(): `Promise`\<[`MemoryHealthReport`](../interfaces/MemoryHealthReport.md)\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1035](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L1035)

Get memory health diagnostics.

#### Returns

`Promise`\<[`MemoryHealthReport`](../interfaces/MemoryHealthReport.md)\>

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getMemoryHealth`](../interfaces/ICognitiveMemoryManager.md#getmemoryhealth)

***

### getObserver()

> **getObserver**(): [`MemoryObserver`](MemoryObserver.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1188](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L1188)

Get observer module when enabled.

#### Returns

[`MemoryObserver`](MemoryObserver.md) \| `null`

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getObserver`](../interfaces/ICognitiveMemoryManager.md#getobserver)

***

### getProspective()

> **getProspective**(): [`ProspectiveMemoryManager`](ProspectiveMemoryManager.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1252](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L1252)

Get prospective-memory manager when enabled.

#### Returns

[`ProspectiveMemoryManager`](ProspectiveMemoryManager.md) \| `null`

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getProspective`](../interfaces/ICognitiveMemoryManager.md#getprospective)

***

### getReflector()

> **getReflector**(): [`MemoryReflector`](MemoryReflector.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1193](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L1193)

Step-8: accessor mirror of [getObserver](#getobserver), for the reflector.

#### Returns

[`MemoryReflector`](MemoryReflector.md) \| `null`

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getReflector`](../interfaces/ICognitiveMemoryManager.md#getreflector)

***

### getRerankerService()

> **getRerankerService**(): `RerankerService` \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1323](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L1323)

Return the attached neural reranker, or `null` when none is
configured. Public read-only accessor for Step-3 bench wiring:
the bench constructs a per-case `HybridRetriever` that needs the
same reranker the manager uses, without bracket-accessing the
private field.

#### Returns

`RerankerService` \| `null`

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getRerankerService`](../interfaces/ICognitiveMemoryManager.md#getrerankerservice)

***

### getStore()

> **getStore**(): [`MemoryStore`](MemoryStore.md)

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1161](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L1161)

Access the underlying long-term memory store for diagnostics/devtools.

#### Returns

[`MemoryStore`](MemoryStore.md)

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getStore`](../interfaces/ICognitiveMemoryManager.md#getstore)

***

### getSummaryContext()

> **getSummaryContext**(): `string`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1118](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L1118)

Get the rolling summary chain text for prompt injection.

#### Returns

`string`

***

### getTraceCount()

> **getTraceCount**(): `number`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1171](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L1171)

Total number of memory traces currently resident in the manager's
in-memory trace cache. Ergonomic passthrough to
[MemoryStore.getTraceCount](MemoryStore.md#gettracecount); used by agentos-bench for
memory-footprint telemetry without reaching into `getStore()`.

#### Returns

`number`

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getTraceCount`](../interfaces/ICognitiveMemoryManager.md#gettracecount)

***

### getWorkingMemory()

> **getWorkingMemory**(): [`CognitiveWorkingMemory`](CognitiveWorkingMemory.md)

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1176](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L1176)

Access the working-memory model for diagnostics/devtools.

#### Returns

[`CognitiveWorkingMemory`](CognitiveWorkingMemory.md)

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getWorkingMemory`](../interfaces/ICognitiveMemoryManager.md#getworkingmemory)

***

### importFromString()

> **importFromString**(`json`, `options?`): `Promise`\<[`ImportResult`](../interfaces/ImportResult.md)\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1275](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L1275)

Import a JSON brain payload into the attached brain.
Delegates to JsonImporter through the MemoryStore's brain.
Throws if no brain is attached.

#### Parameters

##### json

`string`

##### options?

`Pick`\<[`ImportOptions`](../interfaces/ImportOptions.md), `"dedup"`\>

#### Returns

`Promise`\<[`ImportResult`](../interfaces/ImportResult.md)\>

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:292](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L292)

#### Parameters

##### config

[`CognitiveMemoryConfig`](../interfaces/CognitiveMemoryConfig.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`initialize`](../interfaces/ICognitiveMemoryManager.md#initialize)

***

### listProspective()

> **listProspective**(): `Promise`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md)[]\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:983](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L983)

List active prospective reminders.

#### Returns

`Promise`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md)[]\>

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`listProspective`](../interfaces/ICognitiveMemoryManager.md#listprospective)

***

### observe()

> **observe**(`role`, `content`, `mood?`): `Promise`\<[`ObservationNote`](../interfaces/ObservationNote.md)[] \| `null`\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:887](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L887)

Feed a conversation message to the observation pipeline.

Pipeline flow:
1. Observer extracts typed observation notes from buffered messages
2. Notes are fed to the Reflector for consolidation into long-term traces
3. Reflected traces are encoded via `encode()` (typed as semantic/episodic/etc.)
4. Superseded traces are soft-deleted
5. Commitment and intention notes are auto-registered with ProspectiveMemoryManager

#### Parameters

##### role

Message role (user, assistant, system, tool)

`"user"` | `"tool"` | `"system"` | `"assistant"`

##### content

`string`

Message text content

##### mood?

[`PADState`](../interfaces/PADState.md)

Optional PAD emotional state at observation time

#### Returns

`Promise`\<[`ObservationNote`](../interfaces/ObservationNote.md)[] \| `null`\>

Observation notes if threshold was reached, null otherwise

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`observe`](../interfaces/ICognitiveMemoryManager.md#observe)

***

### registerProspective()

> **registerProspective**(`input`): `Promise`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md)\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:972](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L972)

Register a new prospective reminder/intention.

#### Parameters

##### input

`Omit`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md), `"id"` \| `"createdAt"` \| `"triggered"` \| `"cueEmbedding"`\> & `object`

#### Returns

`Promise`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md)\>

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`registerProspective`](../interfaces/ICognitiveMemoryManager.md#registerprospective)

***

### rehydrate()

> **rehydrate**(`traceId`, `requestContext?`): `Promise`\<`string` \| `null`\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1005](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L1005)

Rehydrate a gisted/archived trace to its original verbatim content.

Delegates to the configured `IMemoryArchive`. Returns `null` when no
archive is configured or when the trace is not found/integrity fails.

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

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`rehydrate`](../interfaces/ICognitiveMemoryManager.md#rehydrate)

***

### removeProspective()

> **removeProspective**(`id`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:987](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L987)

Remove a prospective reminder.

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`removeProspective`](../interfaces/ICognitiveMemoryManager.md#removeprospective)

***

### retrieve()

> **retrieve**(`query`, `mood`, `options?`): `Promise`\<[`CognitiveRetrievalResult`](../interfaces/CognitiveRetrievalResult.md)\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:559](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L559)

Retrieve relevant memories for a query. Called before prompt construction.

#### Parameters

##### query

`string`

##### mood

[`PADState`](../interfaces/PADState.md)

##### options?

[`CognitiveRetrievalOptions`](../interfaces/CognitiveRetrievalOptions.md) = `{}`

#### Returns

`Promise`\<[`CognitiveRetrievalResult`](../interfaces/CognitiveRetrievalResult.md)\>

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`retrieve`](../interfaces/ICognitiveMemoryManager.md#retrieve)

***

### runConsolidation()

> **runConsolidation**(): `Promise`\<[`ConsolidationResult`](../interfaces/ConsolidationResult.md)\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1015](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L1015)

Run consolidation cycle (Batch 2).

#### Returns

`Promise`\<[`ConsolidationResult`](../interfaces/ConsolidationResult.md)\>

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`runConsolidation`](../interfaces/ICognitiveMemoryManager.md#runconsolidation)

***

### searchCompactionHistory()

> **searchCompactionHistory**(`keyword`): [`CompactionEntry`](../interfaces/CompactionEntry.md)[]

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1138](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L1138)

Search compaction history for a keyword.

#### Parameters

##### keyword

`string`

#### Returns

[`CompactionEntry`](../interfaces/CompactionEntry.md)[]

***

### setHydeRetriever()

> **setHydeRetriever**(`retriever`): `void`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1307](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L1307)

Attach a HyDE retriever to enable hypothesis-driven memory recall.

When set, the `retrieve()` and `assembleForPrompt()` methods can accept
`options.hyde = true` to generate a hypothetical memory trace before
searching. This improves recall for vague or abstract queries by
producing embeddings that are semantically closer to stored traces.

#### Parameters

##### retriever

A pre-configured HydeRetriever instance, or `null`
  to disable HyDE.

[`HydeRetriever`](HydeRetriever.md) | `null`

#### Returns

`void`

#### Example

```typescript
memoryManager.setHydeRetriever(new HydeRetriever({
  llmCaller: myLlmCaller,
  embeddingManager: myEmbeddingManager,
  config: { enabled: true },
}));
```

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`setHydeRetriever`](../interfaces/ICognitiveMemoryManager.md#sethyderetriever)

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1151](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L1151)

Shutdown and release resources.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`shutdown`](../interfaces/ICognitiveMemoryManager.md#shutdown)

***

### trackMessage()

> **trackMessage**(`role`, `content`): `void`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1091](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/CognitiveMemoryManager.ts#L1091)

Track a conversation message for context window management.
Call for every user/assistant/system/tool message in the conversation.

#### Parameters

##### role

`"user"` | `"tool"` | `"system"` | `"assistant"`

##### content

`string`

#### Returns

`void`
