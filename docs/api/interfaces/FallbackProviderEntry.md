# Interface: FallbackProviderEntry

Defined in: [packages/agentos/src/api/generateText.ts:203](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L203)

A fallback provider entry specifying an alternative provider (and optionally
model) to try when the primary provider fails with a retryable error.

## See

[GenerateTextOptions.fallbackProviders](GenerateTextOptions.md#fallbackproviders)

## Properties

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:207](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L207)

Model identifier override. When omitted, the provider's default text model is used.

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:205](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L205)

Provider identifier (e.g. `"openai"`, `"anthropic"`, `"openrouter"`).
