# Class: SessionSummaryStore

Defined in: [packages/agentos/src/cognition/memory/retrieval/session/SessionSummaryStore.ts:99](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/session/SessionSummaryStore.ts#L99)

Dedicated vector store wrapper for session-level summaries.

## Example

```ts
const store = new SessionSummaryStore({ vectorStore, embeddingManager });
await store.indexSession({
  scope: 'user', scopeId: 'u42', sessionId: 's-7',
  summary: 'User discussed adopting a rescue dog from Portland shelter...',
});
const hits = await store.querySessions('rescue dog adoption', {
  scope: 'user', scopeId: 'u42', topK: 5,
});
```

## Constructors

### Constructor

> **new SessionSummaryStore**(`opts`): `SessionSummaryStore`

Defined in: [packages/agentos/src/cognition/memory/retrieval/session/SessionSummaryStore.ts:104](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/session/SessionSummaryStore.ts#L104)

#### Parameters

##### opts

[`SessionSummaryStoreOptions`](../interfaces/SessionSummaryStoreOptions.md)

#### Returns

`SessionSummaryStore`

## Methods

### indexSession()

> **indexSession**(`input`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/session/SessionSummaryStore.ts:115](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/session/SessionSummaryStore.ts#L115)

Embed the summary and upsert into the scope-specific collection.
Upsert is idempotent: re-indexing the same `sessionId` replaces
the prior vector rather than appending a duplicate.

#### Parameters

##### input

[`IndexSessionInput`](../interfaces/IndexSessionInput.md)

#### Returns

`Promise`\<`void`\>

***

### querySessions()

> **querySessions**(`query`, `options`): `Promise`\<[`QueriedSession`](../interfaces/QueriedSession.md)[]\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/session/SessionSummaryStore.ts:142](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/session/SessionSummaryStore.ts#L142)

Embed the query and return the top-K sessions for the given
scope, ordered by descending similarity. Returns `[]` when the
collection does not yet exist (cold scope).

#### Parameters

##### query

`string`

##### options

###### scope

[`MemoryScope`](../type-aliases/MemoryScope.md)

###### scopeId

`string`

###### topK

`number`

#### Returns

`Promise`\<[`QueriedSession`](../interfaces/QueriedSession.md)[]\>
