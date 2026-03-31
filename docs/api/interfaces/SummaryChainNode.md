# Interface: SummaryChainNode

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:95](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/types.ts#L95)

## Properties

### childIds

> **childIds**: `string`[]

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:110](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/types.ts#L110)

IDs of child nodes that were merged to create this node.

***

### compactionEntryId

> **compactionEntryId**: `string`

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:114](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/types.ts#L114)

Compaction entry ID that produced this node.

***

### createdAt

> **createdAt**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:106](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/types.ts#L106)

Timestamp of creation.

***

### entities

> **entities**: `string`[]

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:112](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/types.ts#L112)

Key entities mentioned in this summary.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:96](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/types.ts#L96)

***

### level

> **level**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:98](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/types.ts#L98)

Level in the hierarchy (0 = leaf summary, higher = summary-of-summaries).

***

### parentId?

> `optional` **parentId**: `string`

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:108](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/types.ts#L108)

ID of the parent node (summary that absorbed this one), if any.

***

### summary

> **summary**: `string`

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:102](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/types.ts#L102)

The summary text.

***

### tokenEstimate

> **tokenEstimate**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:104](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/types.ts#L104)

Token estimate for this summary.

***

### turnRange

> **turnRange**: \[`number`, `number`\]

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:100](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/types.ts#L100)

Turn range covered by this node.
