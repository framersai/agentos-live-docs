# Interface: PromotionResult

Defined in: [packages/agentos/src/emergent/types.ts:611](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/types.ts#L611)

Result returned after a `promote_tool` invocation.

On success the tool's tier is incremented and the new record is persisted.

## Properties

### error?

> `optional` **error**: `string`

Defined in: [packages/agentos/src/emergent/types.ts:626](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/types.ts#L626)

Human-readable error for system-level failures during the promotion process.

***

### success

> **success**: `boolean`

Defined in: [packages/agentos/src/emergent/types.ts:615](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/types.ts#L615)

`true` when both reviewers approved and the tier was incremented.

***

### verdict?

> `optional` **verdict**: [`PromotionVerdict`](PromotionVerdict.md)

Defined in: [packages/agentos/src/emergent/types.ts:621](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/types.ts#L621)

The multi-reviewer promotion verdict.
Present whether the promotion succeeded or was rejected.
