# Interface: CitationVerifierConfig

Defined in: [packages/agentos/src/rag/citation/types.ts:57](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/types.ts#L57)

Configuration for CitationVerifier.

## Properties

### embedFn()

> **embedFn**: (`texts`) => `Promise`\<`number`[][]\>

Defined in: [packages/agentos/src/rag/citation/types.ts:59](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/types.ts#L59)

Batch embedding function: texts → embedding vectors.

#### Parameters

##### texts

`string`[]

#### Returns

`Promise`\<`number`[][]\>

***

### extractClaims()?

> `optional` **extractClaims**: (`text`) => `Promise`\<`string`[]\>

Defined in: [packages/agentos/src/rag/citation/types.ts:70](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/types.ts#L70)

Optional claim extractor. Falls back to sentence splitting.

#### Parameters

##### text

`string`

#### Returns

`Promise`\<`string`[]\>

***

### nliFn()?

> `optional` **nliFn**: (`premise`, `hypothesis`) => `Promise`\<\{ `label`: `"neutral"` \| `"entailment"` \| `"contradiction"`; `score`: `number`; \}\>

Defined in: [packages/agentos/src/rag/citation/types.ts:65](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/types.ts#L65)

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

Defined in: [packages/agentos/src/rag/citation/types.ts:61](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/types.ts#L61)

Cosine similarity threshold for "supported". Default: 0.6

***

### unverifiableThreshold?

> `optional` **unverifiableThreshold**: `number`

Defined in: [packages/agentos/src/rag/citation/types.ts:63](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/types.ts#L63)

Below this threshold, claim is "unverifiable". Default: 0.3
