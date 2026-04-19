# Interface: ICognitiveMemoryManager

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:72](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L72)

## Methods

### assembleForPrompt()

> **assembleForPrompt**(`query`, `tokenBudget`, `mood`, `options?`): `Promise`\<[`AssembledMemoryContext`](AssembledMemoryContext.md)\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:99](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L99)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:114](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L114)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:76](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L76)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:147](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L147)

Get the resolved cognitive-memory runtime config.

#### Returns

[`CognitiveMemoryConfig`](CognitiveMemoryConfig.md)

***

### getContextTransparencyReport()

> **getContextTransparencyReport**(): `string` \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:171](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L171)

Get a human-readable compaction/transparency report when enabled.

#### Returns

`string` \| `null`

***

### getContextWindowStats()

> **getContextWindowStats**(): [`ContextWindowStats`](ContextWindowStats.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:168](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L168)

Get infinite-context runtime stats when enabled.

#### Returns

[`ContextWindowStats`](ContextWindowStats.md) \| `null`

***

### getGraph()

> **getGraph**(): [`IMemoryGraph`](IMemoryGraph.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:150](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L150)

Get graph module when enabled.

#### Returns

[`IMemoryGraph`](IMemoryGraph.md) \| `null`

***

### getHydeRetriever()?

> `optional` **getHydeRetriever**(): [`HydeRetriever`](../classes/HydeRetriever.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:165](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L165)

Get the HyDE retriever if configured, or `null`.

#### Returns

[`HydeRetriever`](../classes/HydeRetriever.md) \| `null`

***

### getMemoryHealth()

> **getMemoryHealth**(): `Promise`\<[`MemoryHealthReport`](MemoryHealthReport.md)\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:138](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L138)

Get memory health diagnostics.

#### Returns

`Promise`\<[`MemoryHealthReport`](MemoryHealthReport.md)\>

***

### getObserver()

> **getObserver**(): [`MemoryObserver`](../classes/MemoryObserver.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:153](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L153)

Get observer module when enabled.

#### Returns

[`MemoryObserver`](../classes/MemoryObserver.md) \| `null`

***

### getProspective()

> **getProspective**(): [`ProspectiveMemoryManager`](../classes/ProspectiveMemoryManager.md) \| `null`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:156](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L156)

Get prospective-memory manager when enabled.

#### Returns

[`ProspectiveMemoryManager`](../classes/ProspectiveMemoryManager.md) \| `null`

***

### getStore()

> **getStore**(): [`MemoryStore`](../classes/MemoryStore.md)

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:141](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L141)

Access the underlying long-term memory store for diagnostics/devtools.

#### Returns

[`MemoryStore`](../classes/MemoryStore.md)

***

### getWorkingMemory()

> **getWorkingMemory**(): [`CognitiveWorkingMemory`](../classes/CognitiveWorkingMemory.md)

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:144](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L144)

Access the working-memory model for diagnostics/devtools.

#### Returns

[`CognitiveWorkingMemory`](../classes/CognitiveWorkingMemory.md)

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:73](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L73)

#### Parameters

##### config

[`CognitiveMemoryConfig`](CognitiveMemoryConfig.md)

#### Returns

`Promise`\<`void`\>

***

### listProspective()?

> `optional` **listProspective**(): `Promise`\<[`ProspectiveMemoryItem`](ProspectiveMemoryItem.md)[]\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:129](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L129)

List active prospective reminders.

#### Returns

`Promise`\<[`ProspectiveMemoryItem`](ProspectiveMemoryItem.md)[]\>

***

### observe()?

> `optional` **observe**(`role`, `content`, `mood?`): `Promise`\<[`ObservationNote`](ObservationNote.md)[] \| `null`\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:107](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L107)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:122](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L122)

Register a new prospective reminder/intention.

#### Parameters

##### input

`Omit`\<[`ProspectiveMemoryItem`](ProspectiveMemoryItem.md), `"id"` \| `"createdAt"` \| `"triggered"` \| `"cueEmbedding"`\> & `object`

#### Returns

`Promise`\<[`ProspectiveMemoryItem`](ProspectiveMemoryItem.md)\>

***

### rehydrate()?

> `optional` **rehydrate**(`traceId`, `requestContext?`): `Promise`\<`string` \| `null`\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:182](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L182)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:132](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L132)

Remove a prospective reminder.

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`boolean`\>

***

### retrieve()

> **retrieve**(`query`, `mood`, `options?`): `Promise`\<[`CognitiveRetrievalResult`](CognitiveRetrievalResult.md)\>

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:92](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L92)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:135](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L135)

Run consolidation cycle (Batch 2).

#### Returns

`Promise`\<[`ConsolidationResult`](ConsolidationResult.md)\>

***

### setHydeRetriever()?

> `optional` **setHydeRetriever**(`retriever`): `void`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:162](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L162)

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

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:185](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/CognitiveMemoryManager.ts#L185)

Shutdown and release resources.

#### Returns

`Promise`\<`void`\>
