# Interface: GuardrailPolicy

Defined in: [packages/agentos/src/orchestration/ir/types.ts:350](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L350)

Declarative guardrail policy attached to a node or edge.

## Properties

### input?

> `optional` **input**: `string`[]

Defined in: [packages/agentos/src/orchestration/ir/types.ts:351](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L351)

Guardrail ids evaluated against the node's incoming payload.

***

### onViolation

> **onViolation**: `"block"` \| `"reroute"` \| `"warn"` \| `"sanitize"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:353](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L353)

Action taken when any guardrail fires.

***

### output?

> `optional` **output**: `string`[]

Defined in: [packages/agentos/src/orchestration/ir/types.ts:352](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L352)

Guardrail ids evaluated against the node's outgoing payload.

***

### rerouteTarget?

> `optional` **rerouteTarget**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:354](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L354)

Required when `onViolation` is `'reroute'`.
