# Interface: TokenUsage

Defined in: [packages/agentos/src/api/generateText.ts:113](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L113)

Token consumption figures reported by the provider for a single completion call.
All values are approximate and provider-dependent.

## Properties

### cacheCreationTokens?

> `optional` **cacheCreationTokens**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:142](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L142)

Tokens written to the provider's prompt-prefix cache as a new cache
entry. Billed at the cache-creation rate (1.25× input price on
Anthropic for 5-minute TTL, 2× for 1-hour TTL). NOT also counted in
`promptTokens`. A `cacheReadTokens` of 0 and `cacheCreationTokens > 0`
indicates the first call that filled the cache; subsequent calls
with a cache hit flip the numbers.

***

### cacheReadTokens?

> `optional` **cacheReadTokens**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:133](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L133)

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

Defined in: [packages/agentos/src/api/generateText.ts:117](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L117)

Number of tokens in the model's response.

***

### costUSD?

> `optional` **costUSD**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:121](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L121)

Total cost reported by the provider across all steps, when available.

***

### promptTokens

> **promptTokens**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:115](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L115)

Number of tokens in the prompt / input sent to the model.

***

### totalTokens

> **totalTokens**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:119](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L119)

Sum of `promptTokens` and `completionTokens`.
