# Class: SessionRetriever

Defined in: [packages/agentos/src/cognition/memory/retrieval/session/SessionRetriever.ts:124](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/session/SessionRetriever.ts#L124)

Two-stage hierarchical retriever.

## Example

```ts
const retriever = new SessionRetriever({
  summaryStore,
  memoryStore,
  embeddingManager,
  rerankerService,
  defaultTopSessions: 5,
  defaultChunksPerSession: 3,
});
const result = await retriever.retrieve(
  'What did the user say about their rescue dog?',
  { valence: 0, arousal: 0, dominance: 0 },
  { scope: 'user', scopeId: 'u42' },
  { recallTopK: 10 },
);
```

## Constructors

### Constructor

> **new SessionRetriever**(`opts`): `SessionRetriever`

Defined in: [packages/agentos/src/cognition/memory/retrieval/session/SessionRetriever.ts:129](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/session/SessionRetriever.ts#L129)

#### Parameters

##### opts

[`SessionRetrieverOptions`](../interfaces/SessionRetrieverOptions.md)

#### Returns

`SessionRetriever`

## Methods

### retrieve()

> **retrieve**(`query`, `mood`, `scope`, `options?`): `Promise`\<[`CognitiveRetrievalResult`](../interfaces/CognitiveRetrievalResult.md)\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/session/SessionRetriever.ts:148](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/session/SessionRetriever.ts#L148)

Two-stage retrieve. Returns a `CognitiveRetrievalResult`
compatible with the existing `CognitiveMemoryManager.retrieve`
shape.

Diagnostics are best-effort: timings reflect wall-clock of each
stage, not the cognitive-scorer internal accounting.

#### Parameters

##### query

`string`

##### mood

[`PADState`](../interfaces/PADState.md)

##### scope

###### scope

[`MemoryScope`](../type-aliases/MemoryScope.md)

###### scopeId

`string`

##### options?

[`SessionRetrieveOptions`](../interfaces/SessionRetrieveOptions.md) = `{}`

#### Returns

`Promise`\<[`CognitiveRetrievalResult`](../interfaces/CognitiveRetrievalResult.md)\>
