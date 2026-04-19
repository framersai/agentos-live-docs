# Class: AgentMemory

Defined in: [packages/agentos/src/memory/AgentMemory.ts:118](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L118)

High-level memory facade for AI agents.

Wraps either `ICognitiveMemoryManager` or the standalone `Memory` facade
with a simple API that hides PAD mood models, HEXACO traits, SQLite
storage details, and internal architecture.

## Constructors

### Constructor

> **new AgentMemory**(`backend?`): `AgentMemory`

Defined in: [packages/agentos/src/memory/AgentMemory.ts:123](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L123)

#### Parameters

##### backend?

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md) | `StandaloneMemoryBackend`

#### Returns

`AgentMemory`

## Accessors

### isInitialized

#### Get Signature

> **get** **isInitialized**(): `boolean`

Defined in: [packages/agentos/src/memory/AgentMemory.ts:825](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L825)

##### Returns

`boolean`

***

### raw

#### Get Signature

> **get** **raw**(): [`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md)

Defined in: [packages/agentos/src/memory/AgentMemory.ts:830](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L830)

Access the underlying manager for advanced usage.

##### Returns

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md)

***

### rawMemory

#### Get Signature

> **get** **rawMemory**(): `StandaloneMemoryBackend` \| `undefined`

Defined in: [packages/agentos/src/memory/AgentMemory.ts:841](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L841)

Access the underlying standalone Memory facade for advanced usage.

##### Returns

`StandaloneMemoryBackend` \| `undefined`

## Methods

### consolidate()

> **consolidate**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:312](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L312)

Run consolidation cycle.

#### Returns

`Promise`\<`void`\>

***

### export()

> **export**(`outputPath`, `options?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:370](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L370)

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

### exportSnapshot()

> **exportSnapshot**(): `Promise`\<`CognitiveMemorySnapshot`\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:710](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L710)

Export full memory state as a serializable snapshot.
Used for companion portability across worlds in wilds-ai.

#### Returns

`Promise`\<`CognitiveMemorySnapshot`\>

#### Throws

When backed by standalone SQLite

***

### feedback()

> **feedback**(`traceId`, `signal`, `query?`): `void`

Defined in: [packages/agentos/src/memory/AgentMemory.ts:382](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L382)

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

### forceReflection()

> **forceReflection**(): `Promise`\<\{ `superseded`: `number`; `traces`: `number`; \}\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:675](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L675)

Force a reflection cycle (useful for testing / devtools).
Triggers the Observer's note extraction and the Reflector's consolidation
regardless of token thresholds.

#### Returns

`Promise`\<\{ `superseded`: `number`; `traces`: `number`; \}\>

Reflection result with typed traces, or empty result if no observer

#### Throws

When backed by standalone SQLite

***

### getAssociations()

> **getAssociations**(`seedTraceIds`, `opts?`): `Promise`\<`object`[]\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:479](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L479)

Get spreading activation results from seed memories.
Returns memories that are associatively connected to the seeds.

#### Parameters

##### seedTraceIds

`string`[]

IDs of seed traces to activate from

##### opts?

Optional depth and limit controls

###### limit?

`number`

###### maxDepth?

`number`

#### Returns

`Promise`\<`object`[]\>

#### Throws

When backed by standalone SQLite

***

### getClusters()

> **getClusters**(`minSize?`): `Promise`\<`object`[]\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:611](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L611)

Get clusters of strongly associated memories.

#### Parameters

##### minSize?

`number`

Minimum cluster size (default 3)

#### Returns

`Promise`\<`object`[]\>

#### Throws

When backed by standalone SQLite

***

### getConflicts()

> **getConflicts**(): `Promise`\<`object`[]\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:579](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L579)

Get pairs of contradicting memory traces.

#### Returns

`Promise`\<`object`[]\>

#### Throws

When backed by standalone SQLite

***

### getContext()

> **getContext**(`query`, `options?`): `Promise`\<[`AssembledMemoryContext`](../interfaces/AssembledMemoryContext.md)\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:276](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L276)

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

### getGraph()

> **getGraph**(): `Promise`\<`MemoryGraphSnapshot`\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:401](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L401)

Get a serializable snapshot of the memory graph for visualization.
Returns nodes (traces), edges (associations), clusters, and aggregate stats.

#### Returns

`Promise`\<`MemoryGraphSnapshot`\>

Graph snapshot suitable for JSON serialization

#### Throws

When backed by standalone SQLite (requires CognitiveMemoryManager)

***

### getObservationStats()

> **getObservationStats**(): `Promise`\<`ObservationPipelineStats`\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:642](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L642)

Get observation pipeline stats (pending notes, compression ratio, reflection count).

#### Returns

`Promise`\<`ObservationPipelineStats`\>

#### Throws

When backed by standalone SQLite

***

### getProspectiveItems()

> **getProspectiveItems**(): `Promise`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md)[]\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:663](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L663)

Get active prospective memory items (reminders/intentions).
Alias for `reminders()` with a more descriptive name.

#### Returns

`Promise`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md)[]\>

***

### getRelationalMemories()

> **getRelationalMemories**(`opts?`): `Promise`\<[`ScoredMemoryTrace`](../interfaces/ScoredMemoryTrace.md)[]\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:526](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L526)

Get relational memory traces (trust signals, boundaries, emotional bonds).
Convenience wrapper around getTracesByType('relational').

#### Parameters

##### opts?

###### limit?

`number`

#### Returns

`Promise`\<[`ScoredMemoryTrace`](../interfaces/ScoredMemoryTrace.md)[]\>

***

### getStrengthDistribution()

> **getStrengthDistribution**(): `Promise`\<`Record`\<[`MemoryType`](../type-aliases/MemoryType.md), `MemoryTypeStats`\>\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:536](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L536)

Get memory strength distribution by type.
Returns count, average strength, decaying count, and flashbulb count per type.

#### Returns

`Promise`\<`Record`\<[`MemoryType`](../type-aliases/MemoryType.md), `MemoryTypeStats`\>\>

#### Throws

When backed by standalone SQLite

***

### getTracesByType()

> **getTracesByType**(`type`, `opts?`): `Promise`\<[`ScoredMemoryTrace`](../interfaces/ScoredMemoryTrace.md)[]\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:505](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L505)

Get all traces filtered by memory type.

#### Parameters

##### type

[`MemoryType`](../type-aliases/MemoryType.md)

Memory type to filter by (episodic, semantic, procedural, prospective, relational)

##### opts?

Optional limit and minimum strength filter

###### limit?

`number`

###### minStrength?

`number`

#### Returns

`Promise`\<[`ScoredMemoryTrace`](../interfaces/ScoredMemoryTrace.md)[]\>

#### Throws

When backed by standalone SQLite

***

### getWorkingMemory()

> **getWorkingMemory**(): `Promise`\<[`WorkingMemorySlot`](../interfaces/WorkingMemorySlot.md)[]\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:628](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L628)

Get working memory slots — what's currently "in focus".

#### Returns

`Promise`\<[`WorkingMemorySlot`](../interfaces/WorkingMemorySlot.md)[]\>

#### Throws

When backed by standalone SQLite

***

### health()

> **health**(): `Promise`\<[`MemoryHealthReport`](../interfaces/MemoryHealthReport.md)\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:322](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L322)

Memory health diagnostics.

#### Returns

`Promise`\<[`MemoryHealthReport`](../interfaces/MemoryHealthReport.md)\>

***

### importFrom()

> **importFrom**(`source`, `options?`): `Promise`\<[`ImportResult`](../interfaces/ImportResult.md)\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:358](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L358)

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

### importSnapshot()

> **importSnapshot**(`snapshot`): `Promise`\<\{ `conflicts`: `number`; `imported`: `number`; \}\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:776](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L776)

Import a memory snapshot (for character portability across worlds).
Encodes each trace and registers prospective items.

#### Parameters

##### snapshot

`CognitiveMemorySnapshot`

Previously exported snapshot

#### Returns

`Promise`\<\{ `conflicts`: `number`; `imported`: `number`; \}\>

Count of imported traces and conflicts detected

#### Throws

When backed by standalone SQLite

***

### ingest()

> **ingest**(`source`, `options?`): `Promise`\<[`IngestResult`](../interfaces/IngestResult.md)\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:346](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L346)

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

Defined in: [packages/agentos/src/memory/AgentMemory.ts:163](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L163)

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

Defined in: [packages/agentos/src/memory/AgentMemory.ts:262](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L262)

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

Defined in: [packages/agentos/src/memory/AgentMemory.ts:227](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L227)

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

Defined in: [packages/agentos/src/memory/AgentMemory.ts:180](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L180)

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

Defined in: [packages/agentos/src/memory/AgentMemory.ts:290](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L290)

Register a prospective memory (reminder/intention).

#### Parameters

##### input

`Omit`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md), `"id"` \| `"createdAt"` \| `"triggered"` \| `"cueEmbedding"`\> & `object`

#### Returns

`Promise`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md) \| `null`\>

***

### reminders()

> **reminders**(): `Promise`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md)[]\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:303](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L303)

List active reminders.

#### Returns

`Promise`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md)[]\>

***

### search()

> **search**(`query`, `options?`): `Promise`\<[`ScoredMemoryTrace`](../interfaces/ScoredMemoryTrace.md)[]\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:249](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L249)

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

Defined in: [packages/agentos/src/memory/AgentMemory.ts:331](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L331)

Shutdown and release resources.

#### Returns

`Promise`\<`void`\>

***

### sqlite()

> `static` **sqlite**(`config?`): `Promise`\<`AgentMemory`\>

Defined in: [packages/agentos/src/memory/AgentMemory.ts:153](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L153)

Create an initialized SQLite-backed AgentMemory for standalone usage.

#### Parameters

##### config?

[`MemoryConfig`](../interfaces/MemoryConfig.md)

#### Returns

`Promise`\<`AgentMemory`\>

***

### wrap()

> `static` **wrap**(`manager`): `AgentMemory`

Defined in: [packages/agentos/src/memory/AgentMemory.ts:137](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L137)

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

Defined in: [packages/agentos/src/memory/AgentMemory.ts:146](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/AgentMemory.ts#L146)

Create an AgentMemory wrapping the standalone SQLite-first Memory facade.

#### Parameters

##### memory

`StandaloneMemoryBackend`

#### Returns

`AgentMemory`
