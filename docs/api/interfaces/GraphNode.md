# Interface: GraphNode

Defined in: [packages/agentos/src/orchestration/ir/types.ts:437](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L437)

A single vertex in the compiled execution graph.

Nodes are immutable once compiled; all runtime state lives in `GraphState`.

## Properties

### checkpoint

> **checkpoint**: `"both"` \| `"none"` \| `"before"` \| `"after"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:459](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L459)

When the runtime should persist a checkpoint snapshot.
- `before` — snapshot taken before executor runs (enables re-entry on crash).
- `after`  — snapshot taken after executor succeeds.
- `both`   — snapshot taken at both points.
- `none`   — no snapshot for this node.

***

### complexity?

> `optional` **complexity**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:465](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L465)

Optional planner-estimated node complexity (0-1).

***

### discoveryPolicy?

> `optional` **discoveryPolicy**: [`DiscoveryPolicy`](DiscoveryPolicy.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:471](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L471)

Dynamic capability discovery configuration applied before execution.

***

### effectClass

> **effectClass**: [`EffectClass`](../type-aliases/EffectClass.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:447](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L447)

Classifies the side-effects this node may produce.

***

### executionMode

> **executionMode**: [`NodeExecutionMode`](../type-aliases/NodeExecutionMode.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:445](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L445)

Controls the LLM turn budget for this node.

***

### executorConfig

> **executorConfig**: [`NodeExecutorConfig`](../type-aliases/NodeExecutorConfig.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:443](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L443)

Full executor configuration; discriminated union determines runtime strategy.

***

### guardrailPolicy?

> `optional` **guardrailPolicy**: [`GuardrailPolicy`](GuardrailPolicy.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:475](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L475)

Declarative guardrails evaluated on input and/or output payloads.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:439](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L439)

Unique identifier within the parent `CompiledExecutionGraph`. Must not equal `START` or `END`.

***

### inputSchema?

> `optional` **inputSchema**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/orchestration/ir/types.ts:461](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L461)

JSON-Schema-compatible description of the expected input shape.

***

### llm?

> `optional` **llm**: [`NodeLlmConfig`](NodeLlmConfig.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:467](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L467)

Optional per-node LLM provider/model override.

***

### memoryPolicy?

> `optional` **memoryPolicy**: [`MemoryPolicy`](MemoryPolicy.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:469](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L469)

Memory read/write configuration applied by the runtime around execution.

***

### outputSchema?

> `optional` **outputSchema**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/orchestration/ir/types.ts:463](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L463)

JSON-Schema-compatible description of the expected output shape.

***

### personaPolicy?

> `optional` **personaPolicy**: [`PersonaPolicy`](PersonaPolicy.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:473](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L473)

Persona layer configuration injected into the prompt context.

***

### retryPolicy?

> `optional` **retryPolicy**: [`RetryPolicy`](RetryPolicy.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:451](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L451)

Automatic retry configuration for transient failures.

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:449](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L449)

Maximum wall-clock execution time in milliseconds before the node is aborted.

***

### type

> **type**: `"tool"` \| `"extension"` \| `"voice"` \| `"gmi"` \| `"human"` \| `"guardrail"` \| `"router"` \| `"subgraph"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:441](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L441)

Coarse type label kept in sync with `executorConfig.type` for fast switching.
