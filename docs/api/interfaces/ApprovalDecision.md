# Interface: ApprovalDecision

Defined in: [packages/agentos/src/api/types.ts:684](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L684)

The resolved decision returned by `HitlConfig.handler`.

## Properties

### approved

> **approved**: `boolean`

Defined in: [packages/agentos/src/api/types.ts:686](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L686)

Whether the action was approved.

***

### modifications?

> `optional` **modifications**: `object`

Defined in: [packages/agentos/src/api/types.ts:694](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L694)

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

Defined in: [packages/agentos/src/api/types.ts:688](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L688)

Optional human-provided rationale for the decision.
