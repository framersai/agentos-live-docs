# Interface: ToolUsageStats

Defined in: [packages/agentos/src/emergent/types.ts:382](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/types.ts#L382)

Accumulated runtime usage statistics for an emergent tool.

Used by the promotion engine to decide when a tool has proven sufficient
reliability to advance to the next [ToolTier](../type-aliases/ToolTier.md).

## Properties

### avgExecutionTimeMs

> **avgExecutionTimeMs**: `number`

Defined in: [packages/agentos/src/emergent/types.ts:403](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/types.ts#L403)

Rolling average wall-clock execution time in milliseconds, computed over
all recorded invocations.

***

### confidenceScore

> **confidenceScore**: `number`

Defined in: [packages/agentos/src/emergent/types.ts:416](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/types.ts#L416)

Aggregate confidence score in [0, 1] derived from judge verdict history.
Updated each time a new [CreationVerdict](CreationVerdict.md) or [PromotionVerdict](PromotionVerdict.md)
is recorded.

***

### failureCount

> **failureCount**: `number`

Defined in: [packages/agentos/src/emergent/types.ts:397](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/types.ts#L397)

Number of invocations that returned an error or threw an exception.

***

### lastUsedAt

> **lastUsedAt**: `string` \| `null`

Defined in: [packages/agentos/src/emergent/types.ts:409](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/types.ts#L409)

ISO-8601 timestamp of the most recent invocation, or `null` if the tool
has never been invoked.

***

### successCount

> **successCount**: `number`

Defined in: [packages/agentos/src/emergent/types.ts:392](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/types.ts#L392)

Number of invocations that completed without throwing or returning an error.

***

### totalUses

> **totalUses**: `number`

Defined in: [packages/agentos/src/emergent/types.ts:387](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/types.ts#L387)

Total number of times the tool has been invoked across all sessions
since it was first registered.
