# Interface: GraphNode

Defined in: [packages/agentos/src/orchestration/ir/types.ts:399](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L399)

A single vertex in the compiled execution graph.

Nodes are immutable once compiled; all runtime state lives in `GraphState`.

## Properties

### checkpoint

> **checkpoint**: `"both"` \| `"none"` \| `"before"` \| `"after"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:421](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L421)

When the runtime should persist a checkpoint snapshot.
- `before` — snapshot taken before executor runs (enables re-entry on crash).
- `after`  — snapshot taken after executor succeeds.
- `both`   — snapshot taken at both points.
- `none`   — no snapshot for this node.

***

### complexity?

> `optional` **complexity**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:427](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L427)

Optional planner-estimated node complexity (0-1).

***

### discoveryPolicy?

> `optional` **discoveryPolicy**: [`DiscoveryPolicy`](DiscoveryPolicy.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:433](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L433)

Dynamic capability discovery configuration applied before execution.

***

### effectClass

> **effectClass**: [`EffectClass`](../type-aliases/EffectClass.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:409](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L409)

Classifies the side-effects this node may produce.

***

### executionMode

> **executionMode**: [`NodeExecutionMode`](../type-aliases/NodeExecutionMode.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:407](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L407)

Controls the LLM turn budget for this node.

***

### executorConfig

> **executorConfig**: [`NodeExecutorConfig`](../type-aliases/NodeExecutorConfig.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:405](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L405)

Full executor configuration; discriminated union determines runtime strategy.

***

### guardrailPolicy?

> `optional` **guardrailPolicy**: [`GuardrailPolicy`](GuardrailPolicy.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:437](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L437)

Declarative guardrails evaluated on input and/or output payloads.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:401](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L401)

Unique identifier within the parent `CompiledExecutionGraph`. Must not equal `START` or `END`.

***

### inputSchema?

> `optional` **inputSchema**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/orchestration/ir/types.ts:423](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L423)

JSON-Schema-compatible description of the expected input shape.

***

### llm?

> `optional` **llm**: [`NodeLlmConfig`](NodeLlmConfig.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:429](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L429)

Optional per-node LLM provider/model override.

***

### memoryPolicy?

> `optional` **memoryPolicy**: [`MemoryPolicy`](MemoryPolicy.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:431](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L431)

Memory read/write configuration applied by the runtime around execution.

***

### outputSchema?

> `optional` **outputSchema**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/orchestration/ir/types.ts:425](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L425)

JSON-Schema-compatible description of the expected output shape.

***

### personaPolicy?

> `optional` **personaPolicy**: [`PersonaPolicy`](PersonaPolicy.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:435](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L435)

Persona layer configuration injected into the prompt context.

***

### retryPolicy?

> `optional` **retryPolicy**: [`RetryPolicy`](RetryPolicy.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:413](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L413)

Automatic retry configuration for transient failures.

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:411](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L411)

Maximum wall-clock execution time in milliseconds before the node is aborted.

***

### type

> **type**: `"tool"` \| `"extension"` \| `"voice"` \| `"gmi"` \| `"human"` \| `"guardrail"` \| `"router"` \| `"subgraph"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:403](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L403)

Coarse type label kept in sync with `executorConfig.type` for fast switching.
