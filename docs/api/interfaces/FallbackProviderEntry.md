# Interface: FallbackProviderEntry

Defined in: [packages/agentos/src/api/generateText.ts:175](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L175)

A fallback provider entry specifying an alternative provider (and optionally
model) to try when the primary provider fails with a retryable error.

## See

[GenerateTextOptions.fallbackProviders](GenerateTextOptions.md#fallbackproviders)

## Properties

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:179](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L179)

Model identifier override. When omitted, the provider's default text model is used.

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:177](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L177)

Provider identifier (e.g. `"openai"`, `"anthropic"`, `"openrouter"`).
