# Interface: TopicEntry

Defined in: [packages/agentos/src/query-router/types.ts:1239](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L1239)

A topic extracted from a query or document for routing and filtering.
Used by the [TopicExtractor](../classes/TopicExtractor.md) to guide retrieval strategy.

## Properties

### name

> **name**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:1241](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L1241)

The topic name or phrase (e.g., "authentication", "database migrations").

***

### source

> **source**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:1247](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L1247)

Where this topic was derived from.

#### Example

```ts
'query', 'document', 'graph-entity'
```
