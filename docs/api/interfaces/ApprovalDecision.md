# Interface: ApprovalDecision

Defined in: [packages/agentos/src/api/types.ts:391](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L391)

The resolved decision returned by `HitlConfig.handler`.

## Properties

### approved

> **approved**: `boolean`

Defined in: [packages/agentos/src/api/types.ts:393](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L393)

Whether the action was approved.

***

### modifications?

> `optional` **modifications**: `object`

Defined in: [packages/agentos/src/api/types.ts:401](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L401)

Optional in-line modifications the approver wishes to apply.
The orchestrator merges these on top of the original action before
proceeding (only when `approved` is `true`).

#### instructions?

> `optional` **instructions**: `string`

Additional instructions injected into the agent's system prompt.

#### output?

> `optional` **output**: `string`

Overridden output text.

#### toolArgs?

> `optional` **toolArgs**: `unknown`

Overridden tool arguments.

***

### reason?

> `optional` **reason**: `string`

Defined in: [packages/agentos/src/api/types.ts:395](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L395)

Optional human-provided rationale for the decision.
