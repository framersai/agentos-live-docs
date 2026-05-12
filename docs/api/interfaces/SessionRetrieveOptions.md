# Interface: SessionRetrieveOptions

Defined in: [packages/agentos/src/memory/retrieval/session/SessionRetriever.ts:92](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/session/SessionRetriever.ts#L92)

Per-call options for [SessionRetriever.retrieve](../classes/SessionRetriever.md#retrieve).

## Properties

### chunksPerSession?

> `optional` **chunksPerSession**: `number`

Defined in: [packages/agentos/src/memory/retrieval/session/SessionRetriever.ts:96](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/session/SessionRetriever.ts#L96)

Override M (chunks per session).

***

### recallTopK?

> `optional` **recallTopK**: `number`

Defined in: [packages/agentos/src/memory/retrieval/session/SessionRetriever.ts:98](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/session/SessionRetriever.ts#L98)

Final truncation after merge and rerank.

#### Default

```ts
10
```

***

### sessionTagPrefix?

> `optional` **sessionTagPrefix**: `string`

Defined in: [packages/agentos/src/memory/retrieval/session/SessionRetriever.ts:100](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/session/SessionRetriever.ts#L100)

Prefix for parsing session IDs off trace tags.

#### Default

```ts
'bench-session:'
```

***

### topSessions?

> `optional` **topSessions**: `number`

Defined in: [packages/agentos/src/memory/retrieval/session/SessionRetriever.ts:94](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/session/SessionRetriever.ts#L94)

Override K (sessions).
