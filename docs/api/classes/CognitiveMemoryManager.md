# Class: CognitiveMemoryManager

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:189](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L189)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:553](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L553)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:669](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L669)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:786](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L786)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:347](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L347)

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

### getCompactionHistory()

> **getCompactionHistory**(): readonly [`CompactionEntry`](../interfaces/CompactionEntry.md)[]

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:819](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L819)

Get compaction history for audit/UI.

#### Returns

readonly [`CompactionEntry`](../interfaces/CompactionEntry.md)[]

***

### getConfig()

> **getConfig**(): [`CognitiveMemoryConfig`](../interfaces/CognitiveMemoryConfig.md)

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:855](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L855)

Get the resolved cognitive-memory runtime config.

#### Returns

[`CognitiveMemoryConfig`](../interfaces/CognitiveMemoryConfig.md)

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getConfig`](../interfaces/ICognitiveMemoryManager.md#getconfig)

***

### getContextTransparencyReport()

> **getContextTransparencyReport**(): `string` \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:814](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L814)

Get full transparency report (for agent self-inspection or UI).

#### Returns

`string` \| `null`

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getContextTransparencyReport`](../interfaces/ICognitiveMemoryManager.md#getcontexttransparencyreport)

***

### getContextWindowManager()

> **getContextWindowManager**(): [`ContextWindowManager`](ContextWindowManager.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:829](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L829)

Get the context window manager (for advanced usage).

#### Returns

[`ContextWindowManager`](ContextWindowManager.md) \| `null`

***

### getContextWindowStats()

> **getContextWindowStats**(): [`ContextWindowStats`](../interfaces/ContextWindowStats.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:809](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L809)

Get context window transparency stats.

#### Returns

[`ContextWindowStats`](../interfaces/ContextWindowStats.md) \| `null`

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getContextWindowStats`](../interfaces/ICognitiveMemoryManager.md#getcontextwindowstats)

***

### getGraph()

> **getGraph**(): [`IMemoryGraph`](../interfaces/IMemoryGraph.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:859](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L859)

Get graph module when enabled.

#### Returns

[`IMemoryGraph`](../interfaces/IMemoryGraph.md) \| `null`

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getGraph`](../interfaces/ICognitiveMemoryManager.md#getgraph)

***

### getHydeRetriever()

> **getHydeRetriever**(): [`HydeRetriever`](HydeRetriever.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:896](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L896)

Get the HyDE retriever if configured, or `null`.

#### Returns

[`HydeRetriever`](HydeRetriever.md) \| `null`

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getHydeRetriever`](../interfaces/ICognitiveMemoryManager.md#gethyderetriever)

***

### getMemoryHealth()

> **getMemoryHealth**(): `Promise`\<[`MemoryHealthReport`](../interfaces/MemoryHealthReport.md)\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:721](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L721)

Get memory health diagnostics.

#### Returns

`Promise`\<[`MemoryHealthReport`](../interfaces/MemoryHealthReport.md)\>

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getMemoryHealth`](../interfaces/ICognitiveMemoryManager.md#getmemoryhealth)

***

### getObserver()

> **getObserver**(): [`MemoryObserver`](MemoryObserver.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:863](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L863)

Get observer module when enabled.

#### Returns

[`MemoryObserver`](MemoryObserver.md) \| `null`

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getObserver`](../interfaces/ICognitiveMemoryManager.md#getobserver)

***

### getProspective()

> **getProspective**(): [`ProspectiveMemoryManager`](ProspectiveMemoryManager.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:867](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L867)

Get prospective-memory manager when enabled.

#### Returns

[`ProspectiveMemoryManager`](ProspectiveMemoryManager.md) \| `null`

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getProspective`](../interfaces/ICognitiveMemoryManager.md#getprospective)

***

### getStore()

> **getStore**(): [`MemoryStore`](MemoryStore.md)

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:847](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L847)

Access the underlying long-term memory store for diagnostics/devtools.

#### Returns

[`MemoryStore`](MemoryStore.md)

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getStore`](../interfaces/ICognitiveMemoryManager.md#getstore)

***

### getSummaryContext()

> **getSummaryContext**(): `string`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:804](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L804)

Get the rolling summary chain text for prompt injection.

#### Returns

`string`

***

### getWorkingMemory()

> **getWorkingMemory**(): [`CognitiveWorkingMemory`](CognitiveWorkingMemory.md)

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:851](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L851)

Access the working-memory model for diagnostics/devtools.

#### Returns

[`CognitiveWorkingMemory`](CognitiveWorkingMemory.md)

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`getWorkingMemory`](../interfaces/ICognitiveMemoryManager.md#getworkingmemory)

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:219](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L219)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:690](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L690)

List active prospective reminders.

#### Returns

`Promise`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md)[]\>

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`listProspective`](../interfaces/ICognitiveMemoryManager.md#listprospective)

***

### observe()

> **observe**(`role`, `content`, `mood?`): `Promise`\<[`ObservationNote`](../interfaces/ObservationNote.md)[] \| `null`\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:624](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L624)

Feed a message to the observer (Batch 2). Returns notes if threshold reached.

#### Parameters

##### role

`"user"` | `"tool"` | `"system"` | `"assistant"`

##### content

`string`

##### mood?

[`PADState`](../interfaces/PADState.md)

#### Returns

`Promise`\<[`ObservationNote`](../interfaces/ObservationNote.md)[] \| `null`\>

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`observe`](../interfaces/ICognitiveMemoryManager.md#observe)

***

### registerProspective()

> **registerProspective**(`input`): `Promise`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md)\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:679](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L679)

Register a new prospective reminder/intention.

#### Parameters

##### input

`Omit`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md), `"id"` \| `"createdAt"` \| `"triggered"` \| `"cueEmbedding"`\> & `object`

#### Returns

`Promise`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md)\>

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`registerProspective`](../interfaces/ICognitiveMemoryManager.md#registerprospective)

***

### removeProspective()

> **removeProspective**(`id`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:694](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L694)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:443](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L443)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:702](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L702)

Run consolidation cycle (Batch 2).

#### Returns

`Promise`\<[`ConsolidationResult`](../interfaces/ConsolidationResult.md)\>

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`runConsolidation`](../interfaces/ICognitiveMemoryManager.md#runconsolidation)

***

### searchCompactionHistory()

> **searchCompactionHistory**(`keyword`): [`CompactionEntry`](../interfaces/CompactionEntry.md)[]

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:824](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L824)

Search compaction history for a keyword.

#### Parameters

##### keyword

`string`

#### Returns

[`CompactionEntry`](../interfaces/CompactionEntry.md)[]

***

### setHydeRetriever()

> **setHydeRetriever**(`retriever`): `void`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:891](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L891)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:837](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L837)

Shutdown and release resources.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md).[`shutdown`](../interfaces/ICognitiveMemoryManager.md#shutdown)

***

### trackMessage()

> **trackMessage**(`role`, `content`): `void`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:777](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L777)

Track a conversation message for context window management.
Call for every user/assistant/system/tool message in the conversation.

#### Parameters

##### role

`"user"` | `"tool"` | `"system"` | `"assistant"`

##### content

`string`

#### Returns

`void`
