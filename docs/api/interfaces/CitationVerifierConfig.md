# Interface: CitationVerifierConfig

Defined in: [packages/agentos/src/cognition/rag/citation/types.ts:72](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/types.ts#L72)

Configuration for CitationVerifier.

## Properties

### embedFn()

> **embedFn**: (`texts`) => `Promise`\<`number`[][]\>

Defined in: [packages/agentos/src/cognition/rag/citation/types.ts:74](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/types.ts#L74)

Batch embedding function: texts → embedding vectors.

#### Parameters

##### texts

`string`[]

#### Returns

`Promise`\<`number`[][]\>

***

### extractClaims()?

> `optional` **extractClaims**: (`text`) => `Promise`\<`string`[]\>

Defined in: [packages/agentos/src/cognition/rag/citation/types.ts:85](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/types.ts#L85)

Optional claim extractor. Falls back to sentence splitting.

#### Parameters

##### text

`string`

#### Returns

`Promise`\<`string`[]\>

***

### nliFn()?

> `optional` **nliFn**: (`premise`, `hypothesis`) => `Promise`\<\{ `label`: `"neutral"` \| `"entailment"` \| `"contradiction"`; `score`: `number`; \}\>

Defined in: [packages/agentos/src/cognition/rag/citation/types.ts:80](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/types.ts#L80)

Optional NLI function for contradiction detection.

#### Parameters

##### premise

`string`

##### hypothesis

`string`

#### Returns

`Promise`\<\{ `label`: `"neutral"` \| `"entailment"` \| `"contradiction"`; `score`: `number`; \}\>

***

### supportThreshold?

> `optional` **supportThreshold**: `number`

Defined in: [packages/agentos/src/cognition/rag/citation/types.ts:76](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/types.ts#L76)

Cosine similarity threshold for "supported". Default: 0.6

***

### unverifiableThreshold?

> `optional` **unverifiableThreshold**: `number`

Defined in: [packages/agentos/src/cognition/rag/citation/types.ts:78](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/types.ts#L78)

Below this threshold, claim is "unverifiable". Default: 0.3
