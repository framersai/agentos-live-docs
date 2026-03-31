# Interface: ApprovalDecision

Defined in: [packages/agentos/src/api/types.ts:424](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L424)

The resolved decision returned by `HitlConfig.handler`.

## Properties

### approved

> **approved**: `boolean`

Defined in: [packages/agentos/src/api/types.ts:426](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L426)

Whether the action was approved.

***

### modifications?

> `optional` **modifications**: `object`

Defined in: [packages/agentos/src/api/types.ts:434](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L434)

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

Defined in: [packages/agentos/src/api/types.ts:428](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L428)

Optional human-provided rationale for the decision.
