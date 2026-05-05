# Interface: ScoredMemoryTrace

Defined in: [packages/agentos/src/memory/core/types.ts:228](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L228)

## Extends

- [`MemoryTrace`](MemoryTrace.md)

## Properties

### accessCount

> **accessCount**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:127](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L127)

Total access count (includes non-retrieval touches).

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`accessCount`](MemoryTrace.md#accesscount)

***

### associatedTraceIds

> **associatedTraceIds**: `string`[]

Defined in: [packages/agentos/src/memory/core/types.ts:136](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L136)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`associatedTraceIds`](MemoryTrace.md#associatedtraceids)

***

### consolidatedAt?

> `optional` **consolidatedAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:141](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L141)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`consolidatedAt`](MemoryTrace.md#consolidatedat)

***

### content

> **content**: `string`

Defined in: [packages/agentos/src/memory/core/types.ts:104](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L104)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`content`](MemoryTrace.md#content)

***

### createdAt

> **createdAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:139](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L139)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`createdAt`](MemoryTrace.md#createdat)

***

### emotionalContext

> **emotionalContext**: [`EmotionalContext`](EmotionalContext.md)

Defined in: [packages/agentos/src/memory/core/types.ts:113](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L113)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`emotionalContext`](MemoryTrace.md#emotionalcontext)

***

### encodingStrength

> **encodingStrength**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:117](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L117)

S_0: initial encoding strength, set at creation.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`encodingStrength`](MemoryTrace.md#encodingstrength)

***

### entities

> **entities**: `string`[]

Defined in: [packages/agentos/src/memory/core/types.ts:106](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L106)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`entities`](MemoryTrace.md#entities)

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/memory/core/types.ts:98](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L98)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`id`](MemoryTrace.md#id)

***

### importance?

> `optional` **importance**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:119](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L119)

Optional normalized salience score used by some consolidation/retrieval paths.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`importance`](MemoryTrace.md#importance)

***

### isActive

> **isActive**: `boolean`

Defined in: [packages/agentos/src/memory/core/types.ts:142](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L142)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`isActive`](MemoryTrace.md#isactive)

***

### lastAccessedAt

> **lastAccessedAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:125](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L125)

Unix ms of last retrieval.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`lastAccessedAt`](MemoryTrace.md#lastaccessedat)

***

### nextReinforcementAt?

> `optional` **nextReinforcementAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:133](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L133)

When this memory is next due for reinforcement review.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`nextReinforcementAt`](MemoryTrace.md#nextreinforcementat)

***

### provenance

> **provenance**: [`MemoryProvenance`](MemoryProvenance.md)

Defined in: [packages/agentos/src/memory/core/types.ts:110](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L110)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`provenance`](MemoryTrace.md#provenance)

***

### reinforcementInterval

> **reinforcementInterval**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:131](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L131)

Current interval (ms); doubles on each successful recall.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`reinforcementInterval`](MemoryTrace.md#reinforcementinterval)

***

### retrievalCount

> **retrievalCount**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:123](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L123)

Number of times this trace has been successfully retrieved.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`retrievalCount`](MemoryTrace.md#retrievalcount)

***

### retrievalScore

> **retrievalScore**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:230](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L230)

Composite retrieval score (0-1).

***

### scope

> **scope**: [`MemoryScope`](../type-aliases/MemoryScope.md)

Defined in: [packages/agentos/src/memory/core/types.ts:100](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L100)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`scope`](MemoryTrace.md#scope)

***

### scopeId

> **scopeId**: `string`

Defined in: [packages/agentos/src/memory/core/types.ts:101](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L101)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`scopeId`](MemoryTrace.md#scopeid)

***

### scoreBreakdown

> **scoreBreakdown**: `object`

Defined in: [packages/agentos/src/memory/core/types.ts:232](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L232)

Individual score components for debugging.

#### emotionalCongruenceScore

> **emotionalCongruenceScore**: `number`

#### graphActivationScore

> **graphActivationScore**: `number`

#### importanceScore

> **importanceScore**: `number`

#### recencyScore

> **recencyScore**: `number`

#### similarityScore

> **similarityScore**: `number`

#### strengthScore

> **strengthScore**: `number`

***

### stability

> **stability**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:121](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L121)

Time constant (ms); grows with each successful retrieval.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`stability`](MemoryTrace.md#stability)

***

### structuredData?

> `optional` **structuredData**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/memory/core/types.ts:105](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L105)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`structuredData`](MemoryTrace.md#structureddata)

***

### tags

> **tags**: `string`[]

Defined in: [packages/agentos/src/memory/core/types.ts:107](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L107)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`tags`](MemoryTrace.md#tags)

***

### type

> **type**: [`MemoryType`](../type-aliases/MemoryType.md)

Defined in: [packages/agentos/src/memory/core/types.ts:99](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L99)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`type`](MemoryTrace.md#type)

***

### updatedAt

> **updatedAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:140](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L140)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`updatedAt`](MemoryTrace.md#updatedat)
