# Interface: QueriedSession

Defined in: [packages/agentos/src/memory/retrieval/session/SessionSummaryStore.ts:78](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/session/SessionSummaryStore.ts#L78)

One row from [SessionSummaryStore.querySessions](../classes/SessionSummaryStore.md#querysessions).

## Properties

### sessionId

> **sessionId**: `string`

Defined in: [packages/agentos/src/memory/retrieval/session/SessionSummaryStore.ts:79](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/session/SessionSummaryStore.ts#L79)

***

### similarityScore

> **similarityScore**: `number`

Defined in: [packages/agentos/src/memory/retrieval/session/SessionSummaryStore.ts:81](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/session/SessionSummaryStore.ts#L81)

Similarity in the vector store's configured metric (cosine by default, range [-1, 1]).
