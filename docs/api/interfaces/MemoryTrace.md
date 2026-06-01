# Interface: MemoryTrace

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:290](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L290)

## Extended by

- [`ScoredMemoryTrace`](ScoredMemoryTrace.md)

## Properties

### accessCount

> **accessCount**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:320](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L320)

Total access count (includes non-retrieval touches).

***

### associatedTraceIds

> **associatedTraceIds**: `string`[]

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:329](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L329)

***

### consolidatedAt?

> `optional` **consolidatedAt**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:344](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L344)

***

### content

> **content**: `string`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:297](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L297)

***

### createdAt

> **createdAt**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:342](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L342)

***

### emotionalContext

> **emotionalContext**: [`EmotionalContext`](EmotionalContext.md)

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:306](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L306)

***

### encodingStrength

> **encodingStrength**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:310](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L310)

S_0: initial encoding strength, set at creation.

***

### entities

> **entities**: `string`[]

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:299](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L299)

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:291](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L291)

***

### importance?

> `optional` **importance**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:312](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L312)

Optional normalized salience score used by some consolidation/retrieval paths.

***

### isActive

> **isActive**: `boolean`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:345](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L345)

***

### lastAccessedAt

> **lastAccessedAt**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:318](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L318)

Unix ms of last retrieval.

***

### nextReinforcementAt?

> `optional` **nextReinforcementAt**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:326](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L326)

When this memory is next due for reinforcement review.

***

### policy?

> `optional` **policy**: [`MemoryTrustPolicy`](MemoryTrustPolicy.md)

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:339](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L339)

Per-trace capability gating. Set at encoding time from the source-type
defaults table ([DEFAULT\_TRUST\_POLICY\_BY\_SOURCE](../variables/DEFAULT_TRUST_POLICY_BY_SOURCE.md)). When absent, the
runtime treats the memory as unrestricted; callers should use
[canUseFor](../functions/canUseFor.md) to gate against authorization / personalization /
fact-claim use cases.

***

### provenance

> **provenance**: [`MemoryProvenance`](MemoryProvenance.md)

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:303](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L303)

***

### reinforcementInterval

> **reinforcementInterval**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:324](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L324)

Current interval (ms); doubles on each successful recall.

***

### retrievalCount

> **retrievalCount**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:316](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L316)

Number of times this trace has been successfully retrieved.

***

### scope

> **scope**: [`MemoryScope`](../type-aliases/MemoryScope.md)

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:293](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L293)

***

### scopeId

> **scopeId**: `string`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:294](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L294)

***

### stability

> **stability**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:314](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L314)

Time constant (ms); grows with each successful retrieval.

***

### structuredData?

> `optional` **structuredData**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:298](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L298)

***

### tags

> **tags**: `string`[]

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:300](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L300)

***

### type

> **type**: [`MemoryType`](../type-aliases/MemoryType.md)

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:292](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L292)

***

### updatedAt

> **updatedAt**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:343](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L343)
