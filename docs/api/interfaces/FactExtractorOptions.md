# Interface: FactExtractorOptions

Defined in: [packages/agentos/src/cognition/memory/retrieval/fact-graph/FactExtractor.ts:27](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/fact-graph/FactExtractor.ts#L27)

## Properties

### cacheFingerprint

> **cacheFingerprint**: `string`

Defined in: [packages/agentos/src/cognition/memory/retrieval/fact-graph/FactExtractor.ts:35](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/fact-graph/FactExtractor.ts#L35)

Fingerprint appended to the content hash for cache keying. Bump
when the prompt or schema changes so prior-version extractions
don't leak into new runs.

***

### llmInvoker()

> **llmInvoker**: (`systemPrompt`, `userPrompt`) => `Promise`\<`string`\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/fact-graph/FactExtractor.ts:29](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/fact-graph/FactExtractor.ts#L29)

Called with (systemPrompt, userPrompt). Must return the model's text response.

#### Parameters

##### systemPrompt

`string`

##### userPrompt

`string`

#### Returns

`Promise`\<`string`\>

***

### maxOutputTokens?

> `optional` **maxOutputTokens**: `number`

Defined in: [packages/agentos/src/cognition/memory/retrieval/fact-graph/FactExtractor.ts:37](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/fact-graph/FactExtractor.ts#L37)

Hard cap on LLM output tokens. Default 1024.
