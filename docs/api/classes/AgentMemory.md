# Class: AgentMemory

Defined in: [packages/agentos/src/memory/AgentMemory.ts:113](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/AgentMemory.ts#L113)

High-level memory facade for AI agents.

Wraps either `ICognitiveMemoryManager` or the standalone `Memory` facade
with a simple API that hides PAD mood models, HEXACO traits, SQLite
storage details, and internal architecture.

## Constructors

### Constructor

> **new AgentMemory**(`backend?`): `AgentMemory`

Defined in: [packages/agentos/src/memory/AgentMemory.ts:118](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/AgentMemory.ts#L118)

#### Parameters

##### backend?

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md) | `StandaloneMemoryBackend`

#### Returns

`AgentMemory`

## Accessors

### isInitialized

#### Get Signature

> **get** **isInitialized**(): `boolean`

Defined in: [packages/agentos/src/memory/AgentMemory.ts:385](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/AgentMemory.ts#L385)

##### Returns

`boolean`

***

### raw

#### Get Signature

> **get** **raw**(): [`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md)

Defined in: [packages/agentos/src/memory/AgentMemory.ts:390](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/AgentMemory.ts#L390)

Access the underlying manager for advanced usage.

##### Returns

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md)

***

### rawMemory

#### Get Signature

> **get** **rawMemory**(): `StandaloneMemoryBackend` \| `undefined`

Defined in: [packages/agentos/src/memory/AgentMemory.ts:401](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/AgentMemory.ts#L401)

Access the underlying standalone Memory facade for advanced usage.

##### Returns

`StandaloneMemoryBackend` \| `undefined`

## Methods

### consolidate()

> **consolidate**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:307](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/AgentMemory.ts#L307)

Run consolidation cycle.

#### Returns

`Promise`\<`void`\>

***

### export()

> **export**(`outputPath`, `options?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:365](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/AgentMemory.ts#L365)

Export memory data. Available only when backed by the standalone
SQLite-first Memory facade.

#### Parameters

##### outputPath

`string`

##### options?

[`ExportOptions`](../interfaces/ExportOptions.md)

#### Returns

`Promise`\<`void`\>

***

### feedback()

> **feedback**(`traceId`, `signal`, `query?`): `void`

Defined in: [packages/agentos/src/memory/AgentMemory.ts:377](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/AgentMemory.ts#L377)

Record used/ignored retrieval feedback. Available only when backed by the
standalone SQLite-first Memory facade.

#### Parameters

##### traceId

`string`

##### signal

`"used"` | `"ignored"`

##### query?

`string`

#### Returns

`void`

***

### getContext()

> **getContext**(`query`, `options?`): `Promise`\<[`AssembledMemoryContext`](../interfaces/AssembledMemoryContext.md)\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:271](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/AgentMemory.ts#L271)

Get assembled memory context for prompt injection within a token budget.

#### Parameters

##### query

`string`

##### options?

###### tokenBudget?

`number`

#### Returns

`Promise`\<[`AssembledMemoryContext`](../interfaces/AssembledMemoryContext.md)\>

***

### health()

> **health**(): `Promise`\<[`MemoryHealthReport`](../interfaces/MemoryHealthReport.md)\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:317](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/AgentMemory.ts#L317)

Memory health diagnostics.

#### Returns

`Promise`\<[`MemoryHealthReport`](../interfaces/MemoryHealthReport.md)\>

***

### importFrom()

> **importFrom**(`source`, `options?`): `Promise`\<[`ImportResult`](../interfaces/ImportResult.md)\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:353](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/AgentMemory.ts#L353)

Import previously exported memory data. Available only when backed by the
standalone SQLite-first Memory facade.

#### Parameters

##### source

`string`

##### options?

[`ImportOptions`](../interfaces/ImportOptions.md)

#### Returns

`Promise`\<[`ImportResult`](../interfaces/ImportResult.md)\>

***

### ingest()

> **ingest**(`source`, `options?`): `Promise`\<[`IngestResult`](../interfaces/IngestResult.md)\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:341](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/AgentMemory.ts#L341)

Ingest files, directories, or URLs. Available only when backed by the
standalone SQLite-first Memory facade.

#### Parameters

##### source

`string`

##### options?

[`IngestOptions`](../interfaces/IngestOptions.md)

#### Returns

`Promise`\<[`IngestResult`](../interfaces/IngestResult.md)\>

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:158](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/AgentMemory.ts#L158)

Initialize the cognitive-manager path. Only needed when constructing the
legacy cognitive backend directly (not via `AgentMemory.wrap()` or
`AgentMemory.sqlite()`).

#### Parameters

##### config

[`CognitiveMemoryConfig`](../interfaces/CognitiveMemoryConfig.md)

#### Returns

`Promise`\<`void`\>

***

### observe()

> **observe**(`role`, `content`): `Promise`\<[`ObservationNote`](../interfaces/ObservationNote.md)[] \| `null`\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:257](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/AgentMemory.ts#L257)

Feed a conversation turn to the observational memory system.
The Observer creates dense notes when the token threshold is reached.

#### Parameters

##### role

`"user"` | `"tool"` | `"system"` | `"assistant"`

##### content

`string`

#### Returns

`Promise`\<[`ObservationNote`](../interfaces/ObservationNote.md)[] \| `null`\>

#### Example

```ts
await memory.observe('user', "Can you help me debug this?");
await memory.observe('assistant', "Sure! The issue is in your useEffect...");
```

***

### recall()

> **recall**(`query`, `options?`): `Promise`\<[`RecallResult`](../interfaces/RecallResult.md)\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:222](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/AgentMemory.ts#L222)

Recall memories relevant to a query.

#### Parameters

##### query

`string`

##### options?

[`SearchOptions`](../interfaces/SearchOptions.md)

#### Returns

`Promise`\<[`RecallResult`](../interfaces/RecallResult.md)\>

#### Example

```ts
const results = await memory.recall("what does the user prefer?");
for (const m of results.memories) {
  console.log(m.content, m.retrievalScore);
}
```

***

### remember()

> **remember**(`content`, `options?`): `Promise`\<[`RememberResult`](../interfaces/RememberResult.md)\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:175](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/AgentMemory.ts#L175)

Store information in long-term memory.

#### Parameters

##### content

`string`

##### options?

###### entities?

`string`[]

###### importance?

`number`

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

`Promise`\<[`RememberResult`](../interfaces/RememberResult.md)\>

#### Example

```ts
await memory.remember("User prefers dark mode");
await memory.remember("Deploy by Friday", { type: 'prospective', tags: ['deadline'] });
```

***

### remind()

> **remind**(`input`): `Promise`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md) \| `null`\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:285](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/AgentMemory.ts#L285)

Register a prospective memory (reminder/intention).

#### Parameters

##### input

`Omit`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md), `"id"` \| `"createdAt"` \| `"triggered"` \| `"cueEmbedding"`\> & `object`

#### Returns

`Promise`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md) \| `null`\>

***

### reminders()

> **reminders**(): `Promise`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md)[]\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:298](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/AgentMemory.ts#L298)

List active reminders.

#### Returns

`Promise`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md)[]\>

***

### search()

> **search**(`query`, `options?`): `Promise`\<[`ScoredMemoryTrace`](../interfaces/ScoredMemoryTrace.md)[]\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:244](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/AgentMemory.ts#L244)

Search memories (alias for recall with simpler return).

#### Parameters

##### query

`string`

##### options?

[`SearchOptions`](../interfaces/SearchOptions.md)

#### Returns

`Promise`\<[`ScoredMemoryTrace`](../interfaces/ScoredMemoryTrace.md)[]\>

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:326](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/AgentMemory.ts#L326)

Shutdown and release resources.

#### Returns

`Promise`\<`void`\>

***

### sqlite()

> `static` **sqlite**(`config?`): `Promise`\<`AgentMemory`\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:148](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/AgentMemory.ts#L148)

Create an initialized SQLite-backed AgentMemory for standalone usage.

#### Parameters

##### config?

[`MemoryConfig`](../interfaces/MemoryConfig.md)

#### Returns

`Promise`\<`AgentMemory`\>

***

### wrap()

> `static` **wrap**(`manager`): `AgentMemory`

Defined in: [packages/agentos/src/memory/AgentMemory.ts:132](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/AgentMemory.ts#L132)

Create an AgentMemory wrapping an existing CognitiveMemoryManager.
Use this in wunderland where the manager is already constructed.

#### Parameters

##### manager

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md)

#### Returns

`AgentMemory`

***

### wrapMemory()

> `static` **wrapMemory**(`memory`): `AgentMemory`

Defined in: [packages/agentos/src/memory/AgentMemory.ts:141](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/AgentMemory.ts#L141)

Create an AgentMemory wrapping the standalone SQLite-first Memory facade.

#### Parameters

##### memory

`StandaloneMemoryBackend`

#### Returns

`AgentMemory`
