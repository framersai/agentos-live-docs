# Interface: FallbackProviderEntry

Defined in: [packages/agentos/src/api/generateText.ts:123](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/generateText.ts#L123)

A fallback provider entry specifying an alternative provider (and optionally
model) to try when the primary provider fails with a retryable error.

## See

[GenerateTextOptions.fallbackProviders](GenerateTextOptions.md#fallbackproviders)

## Properties

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:127](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/generateText.ts#L127)

Model identifier override. When omitted, the provider's default text model is used.

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:125](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/generateText.ts#L125)

Provider identifier (e.g. `"openai"`, `"anthropic"`, `"openrouter"`).
