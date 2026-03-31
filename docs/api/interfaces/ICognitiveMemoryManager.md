# Interface: ICognitiveMemoryManager

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:71](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L71)

## Methods

### assembleForPrompt()

> **assembleForPrompt**(`query`, `tokenBudget`, `mood`, `options?`): `Promise`\<[`AssembledMemoryContext`](AssembledMemoryContext.md)\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:98](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L98)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:113](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L113)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:75](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L75)

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

### getConfig()

> **getConfig**(): [`CognitiveMemoryConfig`](CognitiveMemoryConfig.md)

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:146](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L146)

Get the resolved cognitive-memory runtime config.

#### Returns

[`CognitiveMemoryConfig`](CognitiveMemoryConfig.md)

***

### getContextTransparencyReport()

> **getContextTransparencyReport**(): `string` \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:170](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L170)

Get a human-readable compaction/transparency report when enabled.

#### Returns

`string` \| `null`

***

### getContextWindowStats()

> **getContextWindowStats**(): [`ContextWindowStats`](ContextWindowStats.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:167](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L167)

Get infinite-context runtime stats when enabled.

#### Returns

[`ContextWindowStats`](ContextWindowStats.md) \| `null`

***

### getGraph()

> **getGraph**(): [`IMemoryGraph`](IMemoryGraph.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:149](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L149)

Get graph module when enabled.

#### Returns

[`IMemoryGraph`](IMemoryGraph.md) \| `null`

***

### getHydeRetriever()?

> `optional` **getHydeRetriever**(): [`HydeRetriever`](../classes/HydeRetriever.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:164](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L164)

Get the HyDE retriever if configured, or `null`.

#### Returns

[`HydeRetriever`](../classes/HydeRetriever.md) \| `null`

***

### getMemoryHealth()

> **getMemoryHealth**(): `Promise`\<[`MemoryHealthReport`](MemoryHealthReport.md)\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:137](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L137)

Get memory health diagnostics.

#### Returns

`Promise`\<[`MemoryHealthReport`](MemoryHealthReport.md)\>

***

### getObserver()

> **getObserver**(): [`MemoryObserver`](../classes/MemoryObserver.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:152](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L152)

Get observer module when enabled.

#### Returns

[`MemoryObserver`](../classes/MemoryObserver.md) \| `null`

***

### getProspective()

> **getProspective**(): [`ProspectiveMemoryManager`](../classes/ProspectiveMemoryManager.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:155](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L155)

Get prospective-memory manager when enabled.

#### Returns

[`ProspectiveMemoryManager`](../classes/ProspectiveMemoryManager.md) \| `null`

***

### getStore()

> **getStore**(): [`MemoryStore`](../classes/MemoryStore.md)

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:140](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L140)

Access the underlying long-term memory store for diagnostics/devtools.

#### Returns

[`MemoryStore`](../classes/MemoryStore.md)

***

### getWorkingMemory()

> **getWorkingMemory**(): [`CognitiveWorkingMemory`](../classes/CognitiveWorkingMemory.md)

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:143](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L143)

Access the working-memory model for diagnostics/devtools.

#### Returns

[`CognitiveWorkingMemory`](../classes/CognitiveWorkingMemory.md)

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:72](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L72)

#### Parameters

##### config

[`CognitiveMemoryConfig`](CognitiveMemoryConfig.md)

#### Returns

`Promise`\<`void`\>

***

### listProspective()?

> `optional` **listProspective**(): `Promise`\<[`ProspectiveMemoryItem`](ProspectiveMemoryItem.md)[]\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:128](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L128)

List active prospective reminders.

#### Returns

`Promise`\<[`ProspectiveMemoryItem`](ProspectiveMemoryItem.md)[]\>

***

### observe()?

> `optional` **observe**(`role`, `content`, `mood?`): `Promise`\<[`ObservationNote`](ObservationNote.md)[] \| `null`\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:106](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L106)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:121](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L121)

Register a new prospective reminder/intention.

#### Parameters

##### input

`Omit`\<[`ProspectiveMemoryItem`](ProspectiveMemoryItem.md), `"id"` \| `"createdAt"` \| `"triggered"` \| `"cueEmbedding"`\> & `object`

#### Returns

`Promise`\<[`ProspectiveMemoryItem`](ProspectiveMemoryItem.md)\>

***

### removeProspective()?

> `optional` **removeProspective**(`id`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:131](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L131)

Remove a prospective reminder.

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`boolean`\>

***

### retrieve()

> **retrieve**(`query`, `mood`, `options?`): `Promise`\<[`CognitiveRetrievalResult`](CognitiveRetrievalResult.md)\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:91](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L91)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:134](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L134)

Run consolidation cycle (Batch 2).

#### Returns

`Promise`\<[`ConsolidationResult`](ConsolidationResult.md)\>

***

### setHydeRetriever()?

> `optional` **setHydeRetriever**(`retriever`): `void`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:161](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L161)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:173](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/CognitiveMemoryManager.ts#L173)

Shutdown and release resources.

#### Returns

`Promise`\<`void`\>
