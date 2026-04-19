# Interface: DiagnosticsView

Defined in: [packages/agentos/src/orchestration/ir/types.ts:409](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L409)

Accumulated diagnostic telemetry for an entire graph run.
Appended to `GraphState.diagnostics` after each node completes.

## Properties

### checkpointsSaved

> **checkpointsSaved**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:421](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L421)

Number of checkpoint snapshots persisted during the run.

***

### discoveryResults

> **discoveryResults**: `Record`\<`string`, \{ `latencyMs`: `number`; `query`: `string`; `toolsFound`: `string`[]; \}\>

Defined in: [packages/agentos/src/orchestration/ir/types.ts:417](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L417)

Results from each `DiscoveryPolicy`-triggered capability lookup.

***

### guardrailResults

> **guardrailResults**: `Record`\<`string`, \{ `action`: `string`; `guardrailId`: `string`; `latencyMs`: `number`; `passed`: `boolean`; \}\>

Defined in: [packages/agentos/src/orchestration/ir/types.ts:419](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L419)

Results from each guardrail evaluation.

***

### memoryReads

> **memoryReads**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:423](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L423)

Number of memory read operations performed.

***

### memoryWrites

> **memoryWrites**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:425](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L425)

Number of memory write operations performed (including pending).

***

### nodeTimings

> **nodeTimings**: `Record`\<`string`, \{ `endMs`: `number`; `startMs`: `number`; `tokensUsed`: `number`; \}\>

Defined in: [packages/agentos/src/orchestration/ir/types.ts:415](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L415)

Per-node timing and token attribution.

***

### totalDurationMs

> **totalDurationMs**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:413](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L413)

Wall-clock duration from graph start to the latest completed node.

***

### totalTokensUsed

> **totalTokensUsed**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:411](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L411)

Cumulative LLM tokens consumed across all `gmi` nodes.
