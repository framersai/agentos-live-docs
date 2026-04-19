# Interface: FallbackProviderEntry

Defined in: [packages/agentos/src/api/generateText.ts:181](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/generateText.ts#L181)

A fallback provider entry specifying an alternative provider (and optionally
model) to try when the primary provider fails with a retryable error.

## See

[GenerateTextOptions.fallbackProviders](GenerateTextOptions.md#fallbackproviders)

## Properties

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:185](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/generateText.ts#L185)

Model identifier override. When omitted, the provider's default text model is used.

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:183](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/generateText.ts#L183)

Provider identifier (e.g. `"openai"`, `"anthropic"`, `"openrouter"`).
