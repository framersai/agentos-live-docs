# Interface: PromotionResult

Defined in: [packages/agentos/src/cognition/emergent/types.ts:613](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L613)

Result returned after a `promote_tool` invocation.

On success the tool's tier is incremented and the new record is persisted.

## Properties

### error?

> `optional` **error**: `string`

Defined in: [packages/agentos/src/cognition/emergent/types.ts:628](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L628)

Human-readable error for system-level failures during the promotion process.

***

### success

> **success**: `boolean`

Defined in: [packages/agentos/src/cognition/emergent/types.ts:617](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L617)

`true` when both reviewers approved and the tier was incremented.

***

### verdict?

> `optional` **verdict**: [`PromotionVerdict`](PromotionVerdict.md)

Defined in: [packages/agentos/src/cognition/emergent/types.ts:623](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L623)

The multi-reviewer promotion verdict.
Present whether the promotion succeeded or was rejected.
