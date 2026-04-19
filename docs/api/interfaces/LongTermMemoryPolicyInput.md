# Interface: LongTermMemoryPolicyInput

Defined in: [packages/agentos/src/core/conversation/LongTermMemoryPolicy.ts:16](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/conversation/LongTermMemoryPolicy.ts#L16)

## Properties

### allowedCategories?

> `optional` **allowedCategories**: [`RollingSummaryMemoryCategory`](../type-aliases/RollingSummaryMemoryCategory.md)[]

Defined in: [packages/agentos/src/core/conversation/LongTermMemoryPolicy.ts:45](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/conversation/LongTermMemoryPolicy.ts#L45)

Optional allowlist of `memory_json` categories to persist as atomic docs.
- `null` / `undefined`: persist all categories supported by the sink
- `[]`: persist none

***

### enabled?

> `optional` **enabled**: `boolean`

Defined in: [packages/agentos/src/core/conversation/LongTermMemoryPolicy.ts:24](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/conversation/LongTermMemoryPolicy.ts#L24)

Master switch for persisting long-term memory (e.g., to RAG / knowledge graph).

Notes:
- This does NOT disable rolling-summary compaction (prompt compaction).
- When false, sinks should not persist any long-term memory artifacts.

***

### scopes?

> `optional` **scopes**: `Partial`\<`Record`\<[`LongTermMemoryScope`](../type-aliases/LongTermMemoryScope.md), `boolean`\>\>

Defined in: [packages/agentos/src/core/conversation/LongTermMemoryPolicy.ts:32](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/conversation/LongTermMemoryPolicy.ts#L32)

Enabled scopes for persistence. Unspecified scopes inherit prior/default values.

Defaults are conservative:
- conversation: true
- user/persona/org: false

***

### shareWithOrganization?

> `optional` **shareWithOrganization**: `boolean`

Defined in: [packages/agentos/src/core/conversation/LongTermMemoryPolicy.ts:37](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/conversation/LongTermMemoryPolicy.ts#L37)

Explicit opt-in required to write to organization-scoped memory.
Even when `scopes.organization=true`, implementations should gate on this flag.

***

### storeAtomicDocs?

> `optional` **storeAtomicDocs**: `boolean`

Defined in: [packages/agentos/src/core/conversation/LongTermMemoryPolicy.ts:39](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/conversation/LongTermMemoryPolicy.ts#L39)

Whether to create atomic per-item memory docs from `memory_json` (recommended).
