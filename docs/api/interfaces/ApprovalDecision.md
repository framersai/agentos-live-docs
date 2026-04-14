# Interface: ApprovalDecision

Defined in: [packages/agentos/src/api/types.ts:616](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L616)

The resolved decision returned by `HitlConfig.handler`.

## Properties

### approved

> **approved**: `boolean`

Defined in: [packages/agentos/src/api/types.ts:618](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L618)

Whether the action was approved.

***

### modifications?

> `optional` **modifications**: `object`

Defined in: [packages/agentos/src/api/types.ts:626](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L626)

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

Defined in: [packages/agentos/src/api/types.ts:620](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L620)

Optional human-provided rationale for the decision.
