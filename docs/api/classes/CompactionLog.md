# Class: CompactionLog

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionLog.ts:12](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/context/CompactionLog.ts#L12)

## Constructors

### Constructor

> **new CompactionLog**(`maxEntries?`, `level?`): `CompactionLog`

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionLog.ts:17](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/context/CompactionLog.ts#L17)

#### Parameters

##### maxEntries?

`number` = `100`

##### level?

[`TransparencyLevel`](../type-aliases/TransparencyLevel.md) = `'summary'`

#### Returns

`CompactionLog`

## Accessors

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionLog.ts:169](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/context/CompactionLog.ts#L169)

##### Returns

`number`

## Methods

### append()

> **append**(`entry`): `void`

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionLog.ts:25](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/context/CompactionLog.ts#L25)

Record a compaction event.

#### Parameters

##### entry

[`CompactionEntry`](../interfaces/CompactionEntry.md)

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionLog.ts:165](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/context/CompactionLog.ts#L165)

Clear all entries.

#### Returns

`void`

***

### findByEntity()

> **findByEntity**(`entity`): [`CompactionEntry`](../interfaces/CompactionEntry.md)[]

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionLog.ts:66](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/context/CompactionLog.ts#L66)

Find entries that mention a specific entity.

#### Parameters

##### entity

`string`

#### Returns

[`CompactionEntry`](../interfaces/CompactionEntry.md)[]

***

### findByTimeRange()

> **findByTimeRange**(`startMs`, `endMs`): [`CompactionEntry`](../interfaces/CompactionEntry.md)[]

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionLog.ts:74](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/context/CompactionLog.ts#L74)

Find entries within a time range.

#### Parameters

##### startMs

`number`

##### endMs

`number`

#### Returns

[`CompactionEntry`](../interfaces/CompactionEntry.md)[]

***

### findByTurn()

> **findByTurn**(`turnIndex`): [`CompactionEntry`](../interfaces/CompactionEntry.md)[]

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionLog.ts:59](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/context/CompactionLog.ts#L59)

Find compaction entries that cover a specific turn index.

#### Parameters

##### turnIndex

`number`

#### Returns

[`CompactionEntry`](../interfaces/CompactionEntry.md)[]

***

### format()

> **format**(): `string`

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionLog.ts:157](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/context/CompactionLog.ts#L157)

Format full log for display.

#### Returns

`string`

***

### getAll()

> **getAll**(): readonly [`CompactionEntry`](../interfaces/CompactionEntry.md)[]

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionLog.ts:49](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/context/CompactionLog.ts#L49)

All entries, newest last.

#### Returns

readonly [`CompactionEntry`](../interfaces/CompactionEntry.md)[]

***

### getById()

> **getById**(`id`): [`CompactionEntry`](../interfaces/CompactionEntry.md) \| `undefined`

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionLog.ts:54](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/context/CompactionLog.ts#L54)

Get a single entry by ID.

#### Parameters

##### id

`string`

#### Returns

[`CompactionEntry`](../interfaces/CompactionEntry.md) \| `undefined`

***

### getStats()

> **getStats**(): [`CompactionLogStats`](../interfaces/CompactionLogStats.md)

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionLog.ts:89](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/context/CompactionLog.ts#L89)

Aggregate statistics across all logged compactions.

#### Returns

[`CompactionLogStats`](../interfaces/CompactionLogStats.md)

***

### search()

> **search**(`keyword`): [`CompactionEntry`](../interfaces/CompactionEntry.md)[]

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionLog.ts:81](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/context/CompactionLog.ts#L81)

Search compaction summaries for a keyword.

#### Parameters

##### keyword

`string`

#### Returns

[`CompactionEntry`](../interfaces/CompactionEntry.md)[]

***

### formatEntry()

> `static` **formatEntry**(`entry`): `string`

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionLog.ts:135](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/context/CompactionLog.ts#L135)

Format a single entry for display in the agent's context or UI.

#### Parameters

##### entry

[`CompactionEntry`](../interfaces/CompactionEntry.md)

#### Returns

`string`
