# Interface: GuardrailPolicy

Defined in: [packages/agentos/src/orchestration/ir/types.ts:312](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L312)

Declarative guardrail policy attached to a node or edge.

## Properties

### input?

> `optional` **input**: `string`[]

Defined in: [packages/agentos/src/orchestration/ir/types.ts:313](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L313)

Guardrail ids evaluated against the node's incoming payload.

***

### onViolation

> **onViolation**: `"block"` \| `"reroute"` \| `"warn"` \| `"sanitize"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:315](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L315)

Action taken when any guardrail fires.

***

### output?

> `optional` **output**: `string`[]

Defined in: [packages/agentos/src/orchestration/ir/types.ts:314](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L314)

Guardrail ids evaluated against the node's outgoing payload.

***

### rerouteTarget?

> `optional` **rerouteTarget**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:316](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L316)

Required when `onViolation` is `'reroute'`.
