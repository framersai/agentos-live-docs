# Interface: TopicEntry

Defined in: [packages/agentos/src/query-router/types.ts:1228](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L1228)

A topic extracted from a query or document for routing and filtering.
Used by the [TopicExtractor](../classes/TopicExtractor.md) to guide retrieval strategy.

## Properties

### name

> **name**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:1230](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L1230)

The topic name or phrase (e.g., "authentication", "database migrations").

***

### source

> **source**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:1236](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L1236)

Where this topic was derived from.

#### Example

```ts
'query', 'document', 'graph-entity'
```
