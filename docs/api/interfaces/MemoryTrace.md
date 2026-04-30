# Interface: MemoryTrace

Defined in: [packages/agentos/src/memory/core/types.ts:96](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L96)

## Extended by

- [`ScoredMemoryTrace`](ScoredMemoryTrace.md)

## Properties

### accessCount

> **accessCount**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:126](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L126)

Total access count (includes non-retrieval touches).

***

### associatedTraceIds

> **associatedTraceIds**: `string`[]

Defined in: [packages/agentos/src/memory/core/types.ts:135](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L135)

***

### consolidatedAt?

> `optional` **consolidatedAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:140](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L140)

***

### content

> **content**: `string`

Defined in: [packages/agentos/src/memory/core/types.ts:103](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L103)

***

### createdAt

> **createdAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:138](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L138)

***

### emotionalContext

> **emotionalContext**: [`EmotionalContext`](EmotionalContext.md)

Defined in: [packages/agentos/src/memory/core/types.ts:112](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L112)

***

### encodingStrength

> **encodingStrength**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:116](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L116)

S_0: initial encoding strength, set at creation.

***

### entities

> **entities**: `string`[]

Defined in: [packages/agentos/src/memory/core/types.ts:105](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L105)

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/memory/core/types.ts:97](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L97)

***

### importance?

> `optional` **importance**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:118](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L118)

Optional normalized salience score used by some consolidation/retrieval paths.

***

### isActive

> **isActive**: `boolean`

Defined in: [packages/agentos/src/memory/core/types.ts:141](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L141)

***

### lastAccessedAt

> **lastAccessedAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:124](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L124)

Unix ms of last retrieval.

***

### nextReinforcementAt?

> `optional` **nextReinforcementAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:132](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L132)

When this memory is next due for reinforcement review.

***

### provenance

> **provenance**: [`MemoryProvenance`](MemoryProvenance.md)

Defined in: [packages/agentos/src/memory/core/types.ts:109](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L109)

***

### reinforcementInterval

> **reinforcementInterval**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:130](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L130)

Current interval (ms); doubles on each successful recall.

***

### retrievalCount

> **retrievalCount**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:122](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L122)

Number of times this trace has been successfully retrieved.

***

### scope

> **scope**: [`MemoryScope`](../type-aliases/MemoryScope.md)

Defined in: [packages/agentos/src/memory/core/types.ts:99](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L99)

***

### scopeId

> **scopeId**: `string`

Defined in: [packages/agentos/src/memory/core/types.ts:100](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L100)

***

### stability

> **stability**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:120](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L120)

Time constant (ms); grows with each successful retrieval.

***

### structuredData?

> `optional` **structuredData**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/memory/core/types.ts:104](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L104)

***

### tags

> **tags**: `string`[]

Defined in: [packages/agentos/src/memory/core/types.ts:106](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L106)

***

### type

> **type**: [`MemoryType`](../type-aliases/MemoryType.md)

Defined in: [packages/agentos/src/memory/core/types.ts:98](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L98)

***

### updatedAt

> **updatedAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:139](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L139)
