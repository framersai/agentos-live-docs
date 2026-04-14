# Interface: ScoredMemoryTrace

Defined in: [packages/agentos/src/memory/core/types.ts:210](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/types.ts#L210)

## Extends

- [`MemoryTrace`](MemoryTrace.md)

## Properties

### accessCount

> **accessCount**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:119](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/types.ts#L119)

Total access count (includes non-retrieval touches).

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`accessCount`](MemoryTrace.md#accesscount)

***

### associatedTraceIds

> **associatedTraceIds**: `string`[]

Defined in: [packages/agentos/src/memory/core/types.ts:128](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/types.ts#L128)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`associatedTraceIds`](MemoryTrace.md#associatedtraceids)

***

### consolidatedAt?

> `optional` **consolidatedAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:133](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/types.ts#L133)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`consolidatedAt`](MemoryTrace.md#consolidatedat)

***

### content

> **content**: `string`

Defined in: [packages/agentos/src/memory/core/types.ts:96](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/types.ts#L96)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`content`](MemoryTrace.md#content)

***

### createdAt

> **createdAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:131](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/types.ts#L131)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`createdAt`](MemoryTrace.md#createdat)

***

### emotionalContext

> **emotionalContext**: [`EmotionalContext`](EmotionalContext.md)

Defined in: [packages/agentos/src/memory/core/types.ts:105](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/types.ts#L105)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`emotionalContext`](MemoryTrace.md#emotionalcontext)

***

### encodingStrength

> **encodingStrength**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:109](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/types.ts#L109)

S_0: initial encoding strength, set at creation.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`encodingStrength`](MemoryTrace.md#encodingstrength)

***

### entities

> **entities**: `string`[]

Defined in: [packages/agentos/src/memory/core/types.ts:98](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/types.ts#L98)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`entities`](MemoryTrace.md#entities)

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/memory/core/types.ts:90](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/types.ts#L90)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`id`](MemoryTrace.md#id)

***

### importance?

> `optional` **importance**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:111](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/types.ts#L111)

Optional normalized salience score used by some consolidation/retrieval paths.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`importance`](MemoryTrace.md#importance)

***

### isActive

> **isActive**: `boolean`

Defined in: [packages/agentos/src/memory/core/types.ts:134](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/types.ts#L134)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`isActive`](MemoryTrace.md#isactive)

***

### lastAccessedAt

> **lastAccessedAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:117](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/types.ts#L117)

Unix ms of last retrieval.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`lastAccessedAt`](MemoryTrace.md#lastaccessedat)

***

### nextReinforcementAt?

> `optional` **nextReinforcementAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:125](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/types.ts#L125)

When this memory is next due for reinforcement review.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`nextReinforcementAt`](MemoryTrace.md#nextreinforcementat)

***

### provenance

> **provenance**: [`MemoryProvenance`](MemoryProvenance.md)

Defined in: [packages/agentos/src/memory/core/types.ts:102](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/types.ts#L102)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`provenance`](MemoryTrace.md#provenance)

***

### reinforcementInterval

> **reinforcementInterval**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:123](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/types.ts#L123)

Current interval (ms); doubles on each successful recall.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`reinforcementInterval`](MemoryTrace.md#reinforcementinterval)

***

### retrievalCount

> **retrievalCount**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:115](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/types.ts#L115)

Number of times this trace has been successfully retrieved.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`retrievalCount`](MemoryTrace.md#retrievalcount)

***

### retrievalScore

> **retrievalScore**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:212](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/types.ts#L212)

Composite retrieval score (0-1).

***

### scope

> **scope**: [`MemoryScope`](../type-aliases/MemoryScope.md)

Defined in: [packages/agentos/src/memory/core/types.ts:92](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/types.ts#L92)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`scope`](MemoryTrace.md#scope)

***

### scopeId

> **scopeId**: `string`

Defined in: [packages/agentos/src/memory/core/types.ts:93](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/types.ts#L93)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`scopeId`](MemoryTrace.md#scopeid)

***

### scoreBreakdown

> **scoreBreakdown**: `object`

Defined in: [packages/agentos/src/memory/core/types.ts:214](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/types.ts#L214)

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

Defined in: [packages/agentos/src/memory/core/types.ts:113](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/types.ts#L113)

Time constant (ms); grows with each successful retrieval.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`stability`](MemoryTrace.md#stability)

***

### structuredData?

> `optional` **structuredData**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/memory/core/types.ts:97](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/types.ts#L97)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`structuredData`](MemoryTrace.md#structureddata)

***

### tags

> **tags**: `string`[]

Defined in: [packages/agentos/src/memory/core/types.ts:99](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/types.ts#L99)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`tags`](MemoryTrace.md#tags)

***

### type

> **type**: [`MemoryType`](../type-aliases/MemoryType.md)

Defined in: [packages/agentos/src/memory/core/types.ts:91](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/types.ts#L91)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`type`](MemoryTrace.md#type)

***

### updatedAt

> **updatedAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:132](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/types.ts#L132)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`updatedAt`](MemoryTrace.md#updatedat)
