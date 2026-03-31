# Interface: ContextWindowStats

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:326](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/ContextWindowManager.ts#L326)

## Extends

- [`CompactionLogStats`](CompactionLogStats.md)

## Properties

### avgCompressionRatio

> **avgCompressionRatio**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionLog.ts:178](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/CompactionLog.ts#L178)

#### Inherited from

[`CompactionLogStats`](CompactionLogStats.md).[`avgCompressionRatio`](CompactionLogStats.md#avgcompressionratio)

***

### avgDurationMs

> **avgDurationMs**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionLog.ts:181](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/CompactionLog.ts#L181)

#### Inherited from

[`CompactionLogStats`](CompactionLogStats.md).[`avgDurationMs`](CompactionLogStats.md#avgdurationms)

***

### compactedMessageCount

> **compactedMessageCount**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:332](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/ContextWindowManager.ts#L332)

***

### currentTokens

> **currentTokens**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:327](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/ContextWindowManager.ts#L327)

***

### currentTurn

> **currentTurn**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:330](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/ContextWindowManager.ts#L330)

***

### enabled

> **enabled**: `boolean`

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:336](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/ContextWindowManager.ts#L336)

***

### maxTokens

> **maxTokens**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:328](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/ContextWindowManager.ts#L328)

***

### messageCount

> **messageCount**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:331](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/ContextWindowManager.ts#L331)

***

### newestEntry

> **newestEntry**: [`CompactionEntry`](CompactionEntry.md) \| `undefined`

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionLog.ts:183](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/CompactionLog.ts#L183)

#### Inherited from

[`CompactionLogStats`](CompactionLogStats.md).[`newestEntry`](CompactionLogStats.md#newestentry)

***

### oldestEntry

> **oldestEntry**: [`CompactionEntry`](CompactionEntry.md) \| `undefined`

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionLog.ts:182](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/CompactionLog.ts#L182)

#### Inherited from

[`CompactionLogStats`](CompactionLogStats.md).[`oldestEntry`](CompactionLogStats.md#oldestentry)

***

### strategy

> **strategy**: `string`

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:335](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/ContextWindowManager.ts#L335)

***

### summaryChainNodes

> **summaryChainNodes**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:333](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/ContextWindowManager.ts#L333)

***

### summaryChainTokens

> **summaryChainTokens**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:334](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/ContextWindowManager.ts#L334)

***

### totalCompactions

> **totalCompactions**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionLog.ts:175](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/CompactionLog.ts#L175)

#### Inherited from

[`CompactionLogStats`](CompactionLogStats.md).[`totalCompactions`](CompactionLogStats.md#totalcompactions)

***

### totalEntitiesPreserved

> **totalEntitiesPreserved**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionLog.ts:180](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/CompactionLog.ts#L180)

#### Inherited from

[`CompactionLogStats`](CompactionLogStats.md).[`totalEntitiesPreserved`](CompactionLogStats.md#totalentitiespreserved)

***

### totalInputTokens

> **totalInputTokens**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionLog.ts:176](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/CompactionLog.ts#L176)

#### Inherited from

[`CompactionLogStats`](CompactionLogStats.md).[`totalInputTokens`](CompactionLogStats.md#totalinputtokens)

***

### totalOutputTokens

> **totalOutputTokens**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionLog.ts:177](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/CompactionLog.ts#L177)

#### Inherited from

[`CompactionLogStats`](CompactionLogStats.md).[`totalOutputTokens`](CompactionLogStats.md#totaloutputtokens)

***

### totalTracesCreated

> **totalTracesCreated**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionLog.ts:179](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/CompactionLog.ts#L179)

#### Inherited from

[`CompactionLogStats`](CompactionLogStats.md).[`totalTracesCreated`](CompactionLogStats.md#totaltracescreated)

***

### utilization

> **utilization**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:329](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/ContextWindowManager.ts#L329)
