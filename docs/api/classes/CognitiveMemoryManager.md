# Class: CognitiveMemoryManager

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:201](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L201)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:638](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L638)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:861](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L861)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:999](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L999)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:399](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L399)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1089](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L1089)

Export the full brain state as a JSON string.
Delegates to JsonExporter through the MemoryStore's brain.
Throws if no brain is attached.

#### Parameters

##### options?

[`ExportOptions`](../interfaces/ExportOptions.md)

#### Returns

`Promise`\<`string`\>

***

### getCompactionHistory()

> **getCompactionHistory**(): readonly [`CompactionEntry`](../interfaces/CompactionEntry.md)[]

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1032](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L1032)

Get compaction history for audit/UI.

#### Returns

readonly [`CompactionEntry`](../interfaces/CompactionEntry.md)[]

***

### getConfig()

> **getConfig**(): [`CognitiveMemoryConfig`](../interfaces/CognitiveMemoryConfig.md)

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1068](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L1068)

Get the resolved cognitive-memory runtime config.

#### Returns

[`CognitiveMemoryConfig`](../interfaces/CognitiveMemoryConfig.md)

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getConfig`](../interfaces/ICognitiveMemoryManager.md#getconfig)

***

### getContextTransparencyReport()

> **getContextTransparencyReport**(): `string` \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1027](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L1027)

Get full transparency report (for agent self-inspection or UI).

#### Returns

`string` \| `null`

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getContextTransparencyReport`](../interfaces/ICognitiveMemoryManager.md#getcontexttransparencyreport)

***

### getContextWindowManager()

> **getContextWindowManager**(): [`ContextWindowManager`](ContextWindowManager.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1042](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L1042)

Get the context window manager (for advanced usage).

#### Returns

[`ContextWindowManager`](ContextWindowManager.md) \| `null`

***

### getContextWindowStats()

> **getContextWindowStats**(): [`ContextWindowStats`](../interfaces/ContextWindowStats.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1022](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L1022)

Get context window transparency stats.

#### Returns

[`ContextWindowStats`](../interfaces/ContextWindowStats.md) \| `null`

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getContextWindowStats`](../interfaces/ICognitiveMemoryManager.md#getcontextwindowstats)

***

### getGraph()

> **getGraph**(): [`IMemoryGraph`](../interfaces/IMemoryGraph.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1072](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L1072)

Get graph module when enabled.

#### Returns

[`IMemoryGraph`](../interfaces/IMemoryGraph.md) \| `null`

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getGraph`](../interfaces/ICognitiveMemoryManager.md#getgraph)

***

### getHydeRetriever()

> **getHydeRetriever**(): [`HydeRetriever`](HydeRetriever.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1140](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L1140)

Get the HyDE retriever if configured, or `null`.

#### Returns

[`HydeRetriever`](HydeRetriever.md) \| `null`

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getHydeRetriever`](../interfaces/ICognitiveMemoryManager.md#gethyderetriever)

***

### getMemoryHealth()

> **getMemoryHealth**(): `Promise`\<[`MemoryHealthReport`](../interfaces/MemoryHealthReport.md)\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:934](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L934)

Get memory health diagnostics.

#### Returns

`Promise`\<[`MemoryHealthReport`](../interfaces/MemoryHealthReport.md)\>

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getMemoryHealth`](../interfaces/ICognitiveMemoryManager.md#getmemoryhealth)

***

### getObserver()

> **getObserver**(): [`MemoryObserver`](MemoryObserver.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1076](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L1076)

Get observer module when enabled.

#### Returns

[`MemoryObserver`](MemoryObserver.md) \| `null`

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getObserver`](../interfaces/ICognitiveMemoryManager.md#getobserver)

***

### getProspective()

> **getProspective**(): [`ProspectiveMemoryManager`](ProspectiveMemoryManager.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1080](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L1080)

Get prospective-memory manager when enabled.

#### Returns

[`ProspectiveMemoryManager`](ProspectiveMemoryManager.md) \| `null`

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getProspective`](../interfaces/ICognitiveMemoryManager.md#getprospective)

***

### getStore()

> **getStore**(): [`MemoryStore`](MemoryStore.md)

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1060](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L1060)

Access the underlying long-term memory store for diagnostics/devtools.

#### Returns

[`MemoryStore`](MemoryStore.md)

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getStore`](../interfaces/ICognitiveMemoryManager.md#getstore)

***

### getSummaryContext()

> **getSummaryContext**(): `string`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1017](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L1017)

Get the rolling summary chain text for prompt injection.

#### Returns

`string`

***

### getWorkingMemory()

> **getWorkingMemory**(): [`CognitiveWorkingMemory`](CognitiveWorkingMemory.md)

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1064](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L1064)

Access the working-memory model for diagnostics/devtools.

#### Returns

[`CognitiveWorkingMemory`](CognitiveWorkingMemory.md)

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getWorkingMemory`](../interfaces/ICognitiveMemoryManager.md#getworkingmemory)

***

### importFromString()

> **importFromString**(`json`, `options?`): `Promise`\<[`ImportResult`](../interfaces/ImportResult.md)\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1103](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L1103)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:237](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L237)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:882](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L882)

List active prospective reminders.

#### Returns

`Promise`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md)[]\>

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`listProspective`](../interfaces/ICognitiveMemoryManager.md#listprospective)

***

### observe()

> **observe**(`role`, `content`, `mood?`): `Promise`\<[`ObservationNote`](../interfaces/ObservationNote.md)[] \| `null`\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:786](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L786)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:871](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L871)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:904](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L904)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:886](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L886)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:495](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L495)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:914](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L914)

Run consolidation cycle (Batch 2).

#### Returns

`Promise`\<[`ConsolidationResult`](../interfaces/ConsolidationResult.md)\>

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`runConsolidation`](../interfaces/ICognitiveMemoryManager.md#runconsolidation)

***

### searchCompactionHistory()

> **searchCompactionHistory**(`keyword`): [`CompactionEntry`](../interfaces/CompactionEntry.md)[]

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1037](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L1037)

Search compaction history for a keyword.

#### Parameters

##### keyword

`string`

#### Returns

[`CompactionEntry`](../interfaces/CompactionEntry.md)[]

***

### setHydeRetriever()

> **setHydeRetriever**(`retriever`): `void`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1135](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L1135)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:1050](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L1050)

Shutdown and release resources.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`shutdown`](../interfaces/ICognitiveMemoryManager.md#shutdown)

***

### trackMessage()

> **trackMessage**(`role`, `content`): `void`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:990](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L990)

Track a conversation message for context window management.
Call for every user/assistant/system/tool message in the conversation.

#### Parameters

##### role

`"user"` | `"tool"` | `"system"` | `"assistant"`

##### content

`string`

#### Returns

`void`
