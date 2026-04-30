# Interface: LongTermMemoryPolicyInput

Defined in: [packages/agentos/src/core/conversation/LongTermMemoryPolicy.ts:22](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/conversation/LongTermMemoryPolicy.ts#L22)

## Properties

### allowedCategories?

> `optional` **allowedCategories**: [`RollingSummaryMemoryCategory`](../type-aliases/RollingSummaryMemoryCategory.md)[]

Defined in: [packages/agentos/src/core/conversation/LongTermMemoryPolicy.ts:51](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/conversation/LongTermMemoryPolicy.ts#L51)

Optional allowlist of `memory_json` categories to persist as atomic docs.
- `null` / `undefined`: persist all categories supported by the sink
- `[]`: persist none

***

### enabled?

> `optional` **enabled**: `boolean`

Defined in: [packages/agentos/src/core/conversation/LongTermMemoryPolicy.ts:30](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/conversation/LongTermMemoryPolicy.ts#L30)

Master switch for persisting long-term memory (e.g., to RAG / knowledge graph).

Notes:
- This does NOT disable rolling-summary compaction (prompt compaction).
- When false, sinks should not persist any long-term memory artifacts.

***

### retrieval?

> `optional` **retrieval**: [`MemoryRetrievalPolicy`](MemoryRetrievalPolicy.md) \| `null`

Defined in: [packages/agentos/src/core/conversation/LongTermMemoryPolicy.ts:53](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/conversation/LongTermMemoryPolicy.ts#L53)

Optional retrieval policy override for prompt-time long-term recall.

***

### scopes?

> `optional` **scopes**: `Partial`\<`Record`\<[`LongTermMemoryScope`](../type-aliases/LongTermMemoryScope.md), `boolean`\>\>

Defined in: [packages/agentos/src/core/conversation/LongTermMemoryPolicy.ts:38](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/conversation/LongTermMemoryPolicy.ts#L38)

Enabled scopes for persistence. Unspecified scopes inherit prior/default values.

Defaults are conservative:
- conversation: true
- user/persona/org: false

***

### shareWithOrganization?

> `optional` **shareWithOrganization**: `boolean`

Defined in: [packages/agentos/src/core/conversation/LongTermMemoryPolicy.ts:43](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/conversation/LongTermMemoryPolicy.ts#L43)

Explicit opt-in required to write to organization-scoped memory.
Even when `scopes.organization=true`, implementations should gate on this flag.

***

### storeAtomicDocs?

> `optional` **storeAtomicDocs**: `boolean`

Defined in: [packages/agentos/src/core/conversation/LongTermMemoryPolicy.ts:45](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/conversation/LongTermMemoryPolicy.ts#L45)

Whether to create atomic per-item memory docs from `memory_json` (recommended).
