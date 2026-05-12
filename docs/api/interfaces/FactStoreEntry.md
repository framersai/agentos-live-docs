# Interface: FactStoreEntry

Defined in: [packages/agentos/src/memory/retrieval/fact-graph/types.ts:37](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/fact-graph/types.ts#L37)

Time-sorted-ascending list of facts for a single (subject, predicate)
pair. The latest fact supersedes earlier ones for `getLatest`
queries; all of them are visible to temporal queries via
`getAllTimeOrdered`.

## Properties

### facts

> **facts**: [`Fact`](Fact.md)[]

Defined in: [packages/agentos/src/memory/retrieval/fact-graph/types.ts:38](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/fact-graph/types.ts#L38)
