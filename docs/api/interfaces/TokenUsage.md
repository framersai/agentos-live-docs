# Interface: TokenUsage

Defined in: [packages/agentos/src/api/generateText.ts:91](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateText.ts#L91)

Token consumption figures reported by the provider for a single completion call.
All values are approximate and provider-dependent.

## Properties

### cacheCreationTokens?

> `optional` **cacheCreationTokens**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:120](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateText.ts#L120)

Tokens written to the provider's prompt-prefix cache as a new cache
entry. Billed at the cache-creation rate (1.25× input price on
Anthropic for 5-minute TTL, 2× for 1-hour TTL). NOT also counted in
`promptTokens`. A `cacheReadTokens` of 0 and `cacheCreationTokens > 0`
indicates the first call that filled the cache; subsequent calls
with a cache hit flip the numbers.

***

### cacheReadTokens?

> `optional` **cacheReadTokens**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:111](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateText.ts#L111)

Tokens served from the provider's prompt-prefix cache. When present,
these were billed at the cache-read rate (0.1× input price on
Anthropic) and are NOT also counted in `promptTokens`. Callers that
want total tokens-ever-sent should add `promptTokens + cacheReadTokens
+ cacheCreationTokens`.

Undefined when the provider does not report cache usage (OpenAI's
auto-cache does not expose this at the per-call layer; Anthropic
does via `cache_read_input_tokens`).

***

### completionTokens

> **completionTokens**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:95](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateText.ts#L95)

Number of tokens in the model's response.

***

### costUSD?

> `optional` **costUSD**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:99](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateText.ts#L99)

Total cost reported by the provider across all steps, when available.

***

### promptTokens

> **promptTokens**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:93](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateText.ts#L93)

Number of tokens in the prompt / input sent to the model.

***

### totalTokens

> **totalTokens**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:97](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateText.ts#L97)

Sum of `promptTokens` and `completionTokens`.
