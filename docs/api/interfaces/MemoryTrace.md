# Interface: MemoryTrace

Defined in: [packages/agentos/src/memory/core/types.ts:89](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L89)

## Extended by

- [`ScoredMemoryTrace`](ScoredMemoryTrace.md)

## Properties

### accessCount

> **accessCount**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:119](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L119)

Total access count (includes non-retrieval touches).

***

### associatedTraceIds

> **associatedTraceIds**: `string`[]

Defined in: [packages/agentos/src/memory/core/types.ts:128](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L128)

***

### consolidatedAt?

> `optional` **consolidatedAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:133](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L133)

***

### content

> **content**: `string`

Defined in: [packages/agentos/src/memory/core/types.ts:96](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L96)

***

### createdAt

> **createdAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:131](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L131)

***

### emotionalContext

> **emotionalContext**: [`EmotionalContext`](EmotionalContext.md)

Defined in: [packages/agentos/src/memory/core/types.ts:105](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L105)

***

### encodingStrength

> **encodingStrength**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:109](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L109)

S_0: initial encoding strength, set at creation.

***

### entities

> **entities**: `string`[]

Defined in: [packages/agentos/src/memory/core/types.ts:98](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L98)

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/memory/core/types.ts:90](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L90)

***

### importance?

> `optional` **importance**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:111](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L111)

Optional normalized salience score used by some consolidation/retrieval paths.

***

### isActive

> **isActive**: `boolean`

Defined in: [packages/agentos/src/memory/core/types.ts:134](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L134)

***

### lastAccessedAt

> **lastAccessedAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:117](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L117)

Unix ms of last retrieval.

***

### nextReinforcementAt?

> `optional` **nextReinforcementAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:125](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L125)

When this memory is next due for reinforcement review.

***

### provenance

> **provenance**: [`MemoryProvenance`](MemoryProvenance.md)

Defined in: [packages/agentos/src/memory/core/types.ts:102](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L102)

***

### reinforcementInterval

> **reinforcementInterval**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:123](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L123)

Current interval (ms); doubles on each successful recall.

***

### retrievalCount

> **retrievalCount**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:115](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L115)

Number of times this trace has been successfully retrieved.

***

### scope

> **scope**: [`MemoryScope`](../type-aliases/MemoryScope.md)

Defined in: [packages/agentos/src/memory/core/types.ts:92](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L92)

***

### scopeId

> **scopeId**: `string`

Defined in: [packages/agentos/src/memory/core/types.ts:93](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L93)

***

### stability

> **stability**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:113](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L113)

Time constant (ms); grows with each successful retrieval.

***

### structuredData?

> `optional` **structuredData**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/memory/core/types.ts:97](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L97)

***

### tags

> **tags**: `string`[]

Defined in: [packages/agentos/src/memory/core/types.ts:99](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L99)

***

### type

> **type**: [`MemoryType`](../type-aliases/MemoryType.md)

Defined in: [packages/agentos/src/memory/core/types.ts:91](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L91)

***

### updatedAt

> **updatedAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:132](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L132)
