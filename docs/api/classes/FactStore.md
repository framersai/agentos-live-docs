# Class: FactStore

Defined in: [packages/agentos/src/memory/retrieval/fact-graph/FactStore.ts:22](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/fact-graph/FactStore.ts#L22)

## Constructors

### Constructor

> **new FactStore**(): `FactStore`

#### Returns

`FactStore`

## Methods

### getAllTimeOrdered()

> **getAllTimeOrdered**(`scope`, `scopeId`, `subject`): [`Fact`](../interfaces/Fact.md)[]

Defined in: [packages/agentos/src/memory/retrieval/fact-graph/FactStore.ts:90](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/fact-graph/FactStore.ts#L90)

Return ALL facts for a subject (across predicates), time-sorted
ascending. Used for temporal queries where history matters.

#### Parameters

##### scope

`string`

##### scopeId

`string`

##### subject

`string`

#### Returns

[`Fact`](../interfaces/Fact.md)[]

***

### getLatest()

> **getLatest**(`scope`, `scopeId`, `subject`, `predicate`): [`Fact`](../interfaces/Fact.md) \| `null`

Defined in: [packages/agentos/src/memory/retrieval/fact-graph/FactStore.ts:67](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/fact-graph/FactStore.ts#L67)

Return the latest fact for (subject, predicate) or null. Supports
un-canonicalized subject input (canonicalized internally). Returns
null for predicates outside the closed schema.

#### Parameters

##### scope

`string`

##### scopeId

`string`

##### subject

`string`

##### predicate

`string`

#### Returns

[`Fact`](../interfaces/Fact.md) \| `null`

***

### upsert()

> **upsert**(`scope`, `scopeId`, `facts`): `void`

Defined in: [packages/agentos/src/memory/retrieval/fact-graph/FactStore.ts:41](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/fact-graph/FactStore.ts#L41)

Insert facts. Facts with predicates outside the closed schema are
silently dropped (matches the `FactExtractor` contract). Subjects
are canonicalized; the stored form carries the canonical subject.
Per-(subject, predicate) entries stay time-sorted ascending so
[getLatest](#getlatest) is O(1) and [getAllTimeOrdered](#getalltimeordered) is O(n).

#### Parameters

##### scope

`string`

##### scopeId

`string`

##### facts

readonly [`Fact`](../interfaces/Fact.md)[]

#### Returns

`void`
