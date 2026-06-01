# Interface: TopicEntry

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1252](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1252)

A topic extracted from a query or document for routing and filtering.
Used by the [TopicExtractor](../classes/TopicExtractor.md) to guide retrieval strategy.

## Properties

### name

> **name**: `string`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1254](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1254)

The topic name or phrase (e.g., "authentication", "database migrations").

***

### source

> **source**: `string`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1260](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1260)

Where this topic was derived from.

#### Example

```ts
'query', 'document', 'graph-entity'
```
