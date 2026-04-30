# Interface: WorkingMemorySlot

Defined in: [packages/agentos/src/memory/core/types.ts:148](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L148)

## Properties

### activationLevel

> **activationLevel**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:153](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L153)

0-1 activation level; determines if slot is "in focus".

***

### attentionWeight

> **attentionWeight**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:159](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L159)

How much attention is allocated to this slot (0-1).

***

### enteredAt

> **enteredAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:155](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L155)

When this trace entered working memory (Unix ms).

***

### rehearsalCount

> **rehearsalCount**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:157](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L157)

Maintenance rehearsal counter.

***

### slotId

> **slotId**: `string`

Defined in: [packages/agentos/src/memory/core/types.ts:149](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L149)

***

### traceId

> **traceId**: `string`

Defined in: [packages/agentos/src/memory/core/types.ts:151](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L151)

Reference to the underlying MemoryTrace (or a transient key).
