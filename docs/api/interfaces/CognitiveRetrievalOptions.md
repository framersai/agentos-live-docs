# Interface: CognitiveRetrievalOptions

Defined in: [packages/agentos/src/memory/core/types.ts:183](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/types.ts#L183)

## Properties

### entities?

> `optional` **entities**: `string`[]

Defined in: [packages/agentos/src/memory/core/types.ts:188](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/types.ts#L188)

***

### hyde?

> `optional` **hyde**: `boolean`

Defined in: [packages/agentos/src/memory/core/types.ts:207](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/types.ts#L207)

Enable HyDE (Hypothetical Document Embedding) for memory retrieval.

When `true` and a HyDE retriever is configured on the memory manager,
the system generates a hypothetical memory trace matching the query
before embedding. This produces embeddings that are closer to actual
stored memories, improving recall — especially for vague or abstract
recall prompts (e.g. "that thing we discussed about deployment").

Adds one LLM call per retrieval. Use for important lookups where
recall quality matters more than latency.

#### Default

```ts
false
```

***

### minConfidence?

> `optional` **minConfidence**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:189](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/types.ts#L189)

***

### neutralMood?

> `optional` **neutralMood**: `boolean`

Defined in: [packages/agentos/src/memory/core/types.ts:192](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/types.ts#L192)

If true, skip emotional congruence bias (useful for factual lookups).

***

### scopes?

> `optional` **scopes**: `object`[]

Defined in: [packages/agentos/src/memory/core/types.ts:186](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/types.ts#L186)

#### scope

> **scope**: [`MemoryScope`](../type-aliases/MemoryScope.md)

#### scopeId

> **scopeId**: `string`

***

### tags?

> `optional` **tags**: `string`[]

Defined in: [packages/agentos/src/memory/core/types.ts:187](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/types.ts#L187)

***

### timeRange?

> `optional` **timeRange**: `object`

Defined in: [packages/agentos/src/memory/core/types.ts:190](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/types.ts#L190)

#### after?

> `optional` **after**: `number`

#### before?

> `optional` **before**: `number`

***

### topK?

> `optional` **topK**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:184](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/types.ts#L184)

***

### types?

> `optional` **types**: [`MemoryType`](../type-aliases/MemoryType.md)[]

Defined in: [packages/agentos/src/memory/core/types.ts:185](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/types.ts#L185)
