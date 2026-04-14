# Interface: FallbackProviderEntry

Defined in: [packages/agentos/src/api/generateText.ts:151](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L151)

A fallback provider entry specifying an alternative provider (and optionally
model) to try when the primary provider fails with a retryable error.

## See

[GenerateTextOptions.fallbackProviders](GenerateTextOptions.md#fallbackproviders)

## Properties

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:155](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L155)

Model identifier override. When omitted, the provider's default text model is used.

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:153](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L153)

Provider identifier (e.g. `"openai"`, `"anthropic"`, `"openrouter"`).
