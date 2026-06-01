# Interface: ToolUsageStats

Defined in: [packages/agentos/src/cognition/emergent/types.ts:384](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L384)

Accumulated runtime usage statistics for an emergent tool.

Used by the promotion engine to decide when a tool has proven sufficient
reliability to advance to the next [ToolTier](../type-aliases/ToolTier.md).

## Properties

### avgExecutionTimeMs

> **avgExecutionTimeMs**: `number`

Defined in: [packages/agentos/src/cognition/emergent/types.ts:405](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L405)

Rolling average wall-clock execution time in milliseconds, computed over
all recorded invocations.

***

### confidenceScore

> **confidenceScore**: `number`

Defined in: [packages/agentos/src/cognition/emergent/types.ts:418](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L418)

Aggregate confidence score in [0, 1] derived from judge verdict history.
Updated each time a new [CreationVerdict](CreationVerdict.md) or [PromotionVerdict](PromotionVerdict.md)
is recorded.

***

### failureCount

> **failureCount**: `number`

Defined in: [packages/agentos/src/cognition/emergent/types.ts:399](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L399)

Number of invocations that returned an error or threw an exception.

***

### lastUsedAt

> **lastUsedAt**: `string` \| `null`

Defined in: [packages/agentos/src/cognition/emergent/types.ts:411](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L411)

ISO-8601 timestamp of the most recent invocation, or `null` if the tool
has never been invoked.

***

### successCount

> **successCount**: `number`

Defined in: [packages/agentos/src/cognition/emergent/types.ts:394](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L394)

Number of invocations that completed without throwing or returning an error.

***

### totalUses

> **totalUses**: `number`

Defined in: [packages/agentos/src/cognition/emergent/types.ts:389](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L389)

Total number of times the tool has been invoked across all sessions
since it was first registered.
