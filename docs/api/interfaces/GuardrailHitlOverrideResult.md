# Interface: GuardrailHitlOverrideResult

Defined in: [packages/agentos/src/api/agency.ts:1487](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agency.ts#L1487)

Result of a post-approval guardrail check.

Contains the blocking guardrail's ID and reason when the override fires.

## Properties

### guardrailId?

> `optional` **guardrailId**: `string`

Defined in: [packages/agentos/src/api/agency.ts:1491](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agency.ts#L1491)

The guardrail ID that triggered the block (when `passed` is `false`).

***

### passed

> **passed**: `boolean`

Defined in: [packages/agentos/src/api/agency.ts:1489](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agency.ts#L1489)

Whether the guardrails passed (tool call may proceed).

***

### reason?

> `optional` **reason**: `string`

Defined in: [packages/agentos/src/api/agency.ts:1493](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agency.ts#L1493)

Human-readable reason for the block.
