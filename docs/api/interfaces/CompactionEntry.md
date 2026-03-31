# Interface: CompactionEntry

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:64](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/types.ts#L64)

## Properties

### compressionRatio

> **compressionRatio**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:76](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/types.ts#L76)

Compression ratio (inputTokens / outputTokens).

***

### droppedContent

> **droppedContent**: `string`[]

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:80](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/types.ts#L80)

Content fragments intentionally dropped (low importance).

***

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:90](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/types.ts#L90)

Duration of the compaction operation in ms.

***

### emotionalContext?

> `optional` **emotionalContext**: [`EmotionalContext`](EmotionalContext.md)

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:88](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/types.ts#L88)

Emotional context at time of compaction.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:65](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/types.ts#L65)

***

### inputTokens

> **inputTokens**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:72](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/types.ts#L72)

Token count of the raw messages before compaction.

***

### observationNotes?

> `optional` **observationNotes**: [`ObservationNote`](ObservationNote.md)[]

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:86](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/types.ts#L86)

Observation notes extracted during compaction (hybrid strategy).

***

### outputTokens

> **outputTokens**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:74](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/types.ts#L74)

Token count of the produced summary.

***

### preservedEntities

> **preservedEntities**: `string`[]

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:82](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/types.ts#L82)

Named entities preserved in the summary.

***

### strategy

> **strategy**: [`CompactionStrategy`](../type-aliases/CompactionStrategy.md)

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:70](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/types.ts#L70)

Strategy that produced this compaction.

***

### summary

> **summary**: `string`

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:78](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/types.ts#L78)

The summary text that replaced the raw messages.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:66](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/types.ts#L66)

***

### tracesCreated

> **tracesCreated**: `string`[]

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:84](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/types.ts#L84)

Memory trace IDs created from this compaction.

***

### turnRange

> **turnRange**: \[`number`, `number`\]

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:68](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/types.ts#L68)

Inclusive turn range that was compacted.
