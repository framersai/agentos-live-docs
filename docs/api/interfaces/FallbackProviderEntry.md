# Interface: FallbackProviderEntry

Defined in: [packages/agentos/src/api/generateText.ts:124](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L124)

A fallback provider entry specifying an alternative provider (and optionally
model) to try when the primary provider fails with a retryable error.

## See

[GenerateTextOptions.fallbackProviders](GenerateTextOptions.md#fallbackproviders)

## Properties

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:128](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L128)

Model identifier override. When omitted, the provider's default text model is used.

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:126](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L126)

Provider identifier (e.g. `"openai"`, `"anthropic"`, `"openrouter"`).
