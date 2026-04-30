# Interface: ScoredMemoryTrace

Defined in: [packages/agentos/src/memory/core/types.ts:227](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L227)

## Extends

- [`MemoryTrace`](MemoryTrace.md)

## Properties

### accessCount

> **accessCount**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:126](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L126)

Total access count (includes non-retrieval touches).

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`accessCount`](MemoryTrace.md#accesscount)

***

### associatedTraceIds

> **associatedTraceIds**: `string`[]

Defined in: [packages/agentos/src/memory/core/types.ts:135](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L135)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`associatedTraceIds`](MemoryTrace.md#associatedtraceids)

***

### consolidatedAt?

> `optional` **consolidatedAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:140](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L140)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`consolidatedAt`](MemoryTrace.md#consolidatedat)

***

### content

> **content**: `string`

Defined in: [packages/agentos/src/memory/core/types.ts:103](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L103)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`content`](MemoryTrace.md#content)

***

### createdAt

> **createdAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:138](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L138)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`createdAt`](MemoryTrace.md#createdat)

***

### emotionalContext

> **emotionalContext**: [`EmotionalContext`](EmotionalContext.md)

Defined in: [packages/agentos/src/memory/core/types.ts:112](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L112)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`emotionalContext`](MemoryTrace.md#emotionalcontext)

***

### encodingStrength

> **encodingStrength**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:116](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L116)

S_0: initial encoding strength, set at creation.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`encodingStrength`](MemoryTrace.md#encodingstrength)

***

### entities

> **entities**: `string`[]

Defined in: [packages/agentos/src/memory/core/types.ts:105](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L105)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`entities`](MemoryTrace.md#entities)

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/memory/core/types.ts:97](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L97)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`id`](MemoryTrace.md#id)

***

### importance?

> `optional` **importance**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:118](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L118)

Optional normalized salience score used by some consolidation/retrieval paths.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`importance`](MemoryTrace.md#importance)

***

### isActive

> **isActive**: `boolean`

Defined in: [packages/agentos/src/memory/core/types.ts:141](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L141)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`isActive`](MemoryTrace.md#isactive)

***

### lastAccessedAt

> **lastAccessedAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:124](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L124)

Unix ms of last retrieval.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`lastAccessedAt`](MemoryTrace.md#lastaccessedat)

***

### nextReinforcementAt?

> `optional` **nextReinforcementAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:132](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L132)

When this memory is next due for reinforcement review.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`nextReinforcementAt`](MemoryTrace.md#nextreinforcementat)

***

### provenance

> **provenance**: [`MemoryProvenance`](MemoryProvenance.md)

Defined in: [packages/agentos/src/memory/core/types.ts:109](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L109)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`provenance`](MemoryTrace.md#provenance)

***

### reinforcementInterval

> **reinforcementInterval**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:130](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L130)

Current interval (ms); doubles on each successful recall.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`reinforcementInterval`](MemoryTrace.md#reinforcementinterval)

***

### retrievalCount

> **retrievalCount**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:122](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L122)

Number of times this trace has been successfully retrieved.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`retrievalCount`](MemoryTrace.md#retrievalcount)

***

### retrievalScore

> **retrievalScore**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:229](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L229)

Composite retrieval score (0-1).

***

### scope

> **scope**: [`MemoryScope`](../type-aliases/MemoryScope.md)

Defined in: [packages/agentos/src/memory/core/types.ts:99](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L99)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`scope`](MemoryTrace.md#scope)

***

### scopeId

> **scopeId**: `string`

Defined in: [packages/agentos/src/memory/core/types.ts:100](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L100)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`scopeId`](MemoryTrace.md#scopeid)

***

### scoreBreakdown

> **scoreBreakdown**: `object`

Defined in: [packages/agentos/src/memory/core/types.ts:231](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L231)

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

Defined in: [packages/agentos/src/memory/core/types.ts:120](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L120)

Time constant (ms); grows with each successful retrieval.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`stability`](MemoryTrace.md#stability)

***

### structuredData?

> `optional` **structuredData**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/memory/core/types.ts:104](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L104)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`structuredData`](MemoryTrace.md#structureddata)

***

### tags

> **tags**: `string`[]

Defined in: [packages/agentos/src/memory/core/types.ts:106](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L106)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`tags`](MemoryTrace.md#tags)

***

### type

> **type**: [`MemoryType`](../type-aliases/MemoryType.md)

Defined in: [packages/agentos/src/memory/core/types.ts:98](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L98)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`type`](MemoryTrace.md#type)

***

### updatedAt

> **updatedAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:139](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L139)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`updatedAt`](MemoryTrace.md#updatedat)
