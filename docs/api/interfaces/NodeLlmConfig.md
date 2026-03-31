# Interface: NodeLlmConfig

Defined in: [packages/agentos/src/orchestration/ir/types.ts:325](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L325)

Optional per-node LLM override attached during planning or compilation.

The runtime may use this to route different graph nodes to different
providers/models without changing the graph-level default LLM config.

## Properties

### model

> **model**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:329](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L329)

Model identifier selected for this node.

***

### providerId

> **providerId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:327](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L327)

Logical provider identifier selected for this node (e.g. `openai`, `anthropic`, `groq`).

***

### reason?

> `optional` **reason**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:331](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L331)

Human-readable explanation for audit/debugging.
