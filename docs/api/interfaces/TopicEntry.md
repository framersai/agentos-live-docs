# Interface: TopicEntry

Defined in: [packages/agentos/src/query-router/types.ts:1214](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L1214)

A topic extracted from a query or document for routing and filtering.
Used by the [TopicExtractor](../classes/TopicExtractor.md) to guide retrieval strategy.

## Properties

### name

> **name**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:1216](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L1216)

The topic name or phrase (e.g., "authentication", "database migrations").

***

### source

> **source**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:1222](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L1222)

Where this topic was derived from.

#### Example

```ts
'query', 'document', 'graph-entity'
```
