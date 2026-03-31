# Interface: WorkingMemorySlot

Defined in: [packages/agentos/src/memory/core/types.ts:141](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/types.ts#L141)

## Properties

### activationLevel

> **activationLevel**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:146](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/types.ts#L146)

0-1 activation level; determines if slot is "in focus".

***

### attentionWeight

> **attentionWeight**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:152](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/types.ts#L152)

How much attention is allocated to this slot (0-1).

***

### enteredAt

> **enteredAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:148](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/types.ts#L148)

When this trace entered working memory (Unix ms).

***

### rehearsalCount

> **rehearsalCount**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:150](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/types.ts#L150)

Maintenance rehearsal counter.

***

### slotId

> **slotId**: `string`

Defined in: [packages/agentos/src/memory/core/types.ts:142](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/types.ts#L142)

***

### traceId

> **traceId**: `string`

Defined in: [packages/agentos/src/memory/core/types.ts:144](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/types.ts#L144)

Reference to the underlying MemoryTrace (or a transient key).
