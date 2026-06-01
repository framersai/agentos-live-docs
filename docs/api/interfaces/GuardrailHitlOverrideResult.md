# Interface: GuardrailHitlOverrideResult

Defined in: [packages/agentos/src/api/agency.ts:1524](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agency.ts#L1524)

Result of a post-approval guardrail check.

Contains the blocking guardrail's ID and reason when the override fires.

## Properties

### guardrailId?

> `optional` **guardrailId**: `string`

Defined in: [packages/agentos/src/api/agency.ts:1528](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agency.ts#L1528)

The guardrail ID that triggered the block (when `passed` is `false`).

***

### passed

> **passed**: `boolean`

Defined in: [packages/agentos/src/api/agency.ts:1526](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agency.ts#L1526)

Whether the guardrails passed (tool call may proceed).

***

### reason?

> `optional` **reason**: `string`

Defined in: [packages/agentos/src/api/agency.ts:1530](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agency.ts#L1530)

Human-readable reason for the block.
