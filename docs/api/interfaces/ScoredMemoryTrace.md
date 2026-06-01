# Interface: ScoredMemoryTrace

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:439](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L439)

## Extends

- [`MemoryTrace`](MemoryTrace.md)

## Properties

### accessCount

> **accessCount**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:320](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L320)

Total access count (includes non-retrieval touches).

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`accessCount`](MemoryTrace.md#accesscount)

***

### associatedTraceIds

> **associatedTraceIds**: `string`[]

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:329](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L329)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`associatedTraceIds`](MemoryTrace.md#associatedtraceids)

***

### consolidatedAt?

> `optional` **consolidatedAt**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:344](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L344)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`consolidatedAt`](MemoryTrace.md#consolidatedat)

***

### content

> **content**: `string`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:297](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L297)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`content`](MemoryTrace.md#content)

***

### createdAt

> **createdAt**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:342](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L342)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`createdAt`](MemoryTrace.md#createdat)

***

### emotionalContext

> **emotionalContext**: [`EmotionalContext`](EmotionalContext.md)

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:306](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L306)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`emotionalContext`](MemoryTrace.md#emotionalcontext)

***

### encodingStrength

> **encodingStrength**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:310](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L310)

S_0: initial encoding strength, set at creation.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`encodingStrength`](MemoryTrace.md#encodingstrength)

***

### entities

> **entities**: `string`[]

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:299](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L299)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`entities`](MemoryTrace.md#entities)

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:291](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L291)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`id`](MemoryTrace.md#id)

***

### importance?

> `optional` **importance**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:312](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L312)

Optional normalized salience score used by some consolidation/retrieval paths.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`importance`](MemoryTrace.md#importance)

***

### isActive

> **isActive**: `boolean`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:345](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L345)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`isActive`](MemoryTrace.md#isactive)

***

### lastAccessedAt

> **lastAccessedAt**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:318](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L318)

Unix ms of last retrieval.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`lastAccessedAt`](MemoryTrace.md#lastaccessedat)

***

### nextReinforcementAt?

> `optional` **nextReinforcementAt**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:326](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L326)

When this memory is next due for reinforcement review.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`nextReinforcementAt`](MemoryTrace.md#nextreinforcementat)

***

### policy?

> `optional` **policy**: [`MemoryTrustPolicy`](MemoryTrustPolicy.md)

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:339](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L339)

Per-trace capability gating. Set at encoding time from the source-type
defaults table ([DEFAULT\_TRUST\_POLICY\_BY\_SOURCE](../variables/DEFAULT_TRUST_POLICY_BY_SOURCE.md)). When absent, the
runtime treats the memory as unrestricted; callers should use
[canUseFor](../functions/canUseFor.md) to gate against authorization / personalization /
fact-claim use cases.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`policy`](MemoryTrace.md#policy)

***

### provenance

> **provenance**: [`MemoryProvenance`](MemoryProvenance.md)

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:303](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L303)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`provenance`](MemoryTrace.md#provenance)

***

### reinforcementInterval

> **reinforcementInterval**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:324](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L324)

Current interval (ms); doubles on each successful recall.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`reinforcementInterval`](MemoryTrace.md#reinforcementinterval)

***

### retrievalCount

> **retrievalCount**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:316](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L316)

Number of times this trace has been successfully retrieved.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`retrievalCount`](MemoryTrace.md#retrievalcount)

***

### retrievalScore

> **retrievalScore**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:441](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L441)

Composite retrieval score (0-1).

***

### scope

> **scope**: [`MemoryScope`](../type-aliases/MemoryScope.md)

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:293](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L293)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`scope`](MemoryTrace.md#scope)

***

### scopeId

> **scopeId**: `string`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:294](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L294)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`scopeId`](MemoryTrace.md#scopeid)

***

### scoreBreakdown

> **scoreBreakdown**: `object`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:443](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L443)

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

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:314](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L314)

Time constant (ms); grows with each successful retrieval.

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`stability`](MemoryTrace.md#stability)

***

### structuredData?

> `optional` **structuredData**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:298](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L298)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`structuredData`](MemoryTrace.md#structureddata)

***

### tags

> **tags**: `string`[]

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:300](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L300)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`tags`](MemoryTrace.md#tags)

***

### type

> **type**: [`MemoryType`](../type-aliases/MemoryType.md)

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:292](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L292)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`type`](MemoryTrace.md#type)

***

### updatedAt

> **updatedAt**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:343](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L343)

#### Inherited from

[`MemoryTrace`](MemoryTrace.md).[`updatedAt`](MemoryTrace.md#updatedat)
