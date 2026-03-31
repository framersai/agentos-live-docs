# Function: resolveProvider()

> **resolveProvider**(`providerId`, `modelId`, `overrides?`): `ResolvedProvider`

Defined in: [packages/agentos/src/api/model.ts:105](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/model.ts#L105)

Resolves a complete provider configuration for LLM text providers.

Reads API keys and base URLs from well-known environment variables
(e.g. `OPENAI_API_KEY`, `OLLAMA_BASE_URL`) and merges caller-supplied
`overrides`.  Applies the Anthropic → OpenRouter fallback when
`ANTHROPIC_API_KEY` is absent but `OPENROUTER_API_KEY` is set.

## Parameters

### providerId

`string`

Provider identifier (e.g. `"openai"`, `"anthropic"`, `"ollama"`).

### modelId

`string`

Model identifier within the provider.

### overrides?

Optional explicit API key and/or base URL that take precedence
  over environment variable lookups.

#### apiKey?

`string`

#### baseUrl?

`string`

## Returns

`ResolvedProvider`

A `ResolvedProvider` ready for `createProviderManager()`.

## Throws

When no credentials can be resolved for the given provider.
