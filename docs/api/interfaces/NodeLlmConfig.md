# Interface: NodeLlmConfig

Defined in: [packages/agentos/src/orchestration/ir/types.ts:363](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L363)

Optional per-node LLM override attached during planning or compilation.

The runtime may use this to route different graph nodes to different
providers/models without changing the graph-level default LLM config.

## Properties

### model

> **model**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:367](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L367)

Model identifier selected for this node.

***

### providerId

> **providerId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:365](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L365)

Logical provider identifier selected for this node (e.g. `openai`, `anthropic`, `groq`).

***

### reason?

> `optional` **reason**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:369](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L369)

Human-readable explanation for audit/debugging.
