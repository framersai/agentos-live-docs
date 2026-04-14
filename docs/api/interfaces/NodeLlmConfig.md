# Interface: NodeLlmConfig

Defined in: [packages/agentos/src/orchestration/ir/types.ts:363](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/ir/types.ts#L363)

Optional per-node LLM override attached during planning or compilation.

The runtime may use this to route different graph nodes to different
providers/models without changing the graph-level default LLM config.

## Properties

### model

> **model**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:367](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/ir/types.ts#L367)

Model identifier selected for this node.

***

### providerId

> **providerId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:365](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/ir/types.ts#L365)

Logical provider identifier selected for this node (e.g. `openai`, `anthropic`, `groq`).

***

### reason?

> `optional` **reason**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:369](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/ir/types.ts#L369)

Human-readable explanation for audit/debugging.
