# Interface: DiagnosticsView

Defined in: [packages/agentos/src/orchestration/ir/types.ts:371](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L371)

Accumulated diagnostic telemetry for an entire graph run.
Appended to `GraphState.diagnostics` after each node completes.

## Properties

### checkpointsSaved

> **checkpointsSaved**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:383](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L383)

Number of checkpoint snapshots persisted during the run.

***

### discoveryResults

> **discoveryResults**: `Record`\<`string`, \{ `latencyMs`: `number`; `query`: `string`; `toolsFound`: `string`[]; \}\>

Defined in: [packages/agentos/src/orchestration/ir/types.ts:379](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L379)

Results from each `DiscoveryPolicy`-triggered capability lookup.

***

### guardrailResults

> **guardrailResults**: `Record`\<`string`, \{ `action`: `string`; `guardrailId`: `string`; `latencyMs`: `number`; `passed`: `boolean`; \}\>

Defined in: [packages/agentos/src/orchestration/ir/types.ts:381](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L381)

Results from each guardrail evaluation.

***

### memoryReads

> **memoryReads**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:385](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L385)

Number of memory read operations performed.

***

### memoryWrites

> **memoryWrites**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:387](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L387)

Number of memory write operations performed (including pending).

***

### nodeTimings

> **nodeTimings**: `Record`\<`string`, \{ `endMs`: `number`; `startMs`: `number`; `tokensUsed`: `number`; \}\>

Defined in: [packages/agentos/src/orchestration/ir/types.ts:377](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L377)

Per-node timing and token attribution.

***

### totalDurationMs

> **totalDurationMs**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:375](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L375)

Wall-clock duration from graph start to the latest completed node.

***

### totalTokensUsed

> **totalTokensUsed**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:373](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L373)

Cumulative LLM tokens consumed across all `gmi` nodes.
