# Interface: WorkingMemorySlot

Defined in: [packages/agentos/src/memory/core/types.ts:149](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L149)

## Properties

### activationLevel

> **activationLevel**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:154](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L154)

0-1 activation level; determines if slot is "in focus".

***

### attentionWeight

> **attentionWeight**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:160](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L160)

How much attention is allocated to this slot (0-1).

***

### enteredAt

> **enteredAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:156](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L156)

When this trace entered working memory (Unix ms).

***

### rehearsalCount

> **rehearsalCount**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:158](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L158)

Maintenance rehearsal counter.

***

### slotId

> **slotId**: `string`

Defined in: [packages/agentos/src/memory/core/types.ts:150](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L150)

***

### traceId

> **traceId**: `string`

Defined in: [packages/agentos/src/memory/core/types.ts:152](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L152)

Reference to the underlying MemoryTrace (or a transient key).
