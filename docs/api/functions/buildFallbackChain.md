# Function: buildFallbackChain()

> **buildFallbackChain**(`excludeProvider?`): [`FallbackProviderEntry`](../interfaces/FallbackProviderEntry.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:561](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L561)

Auto-discovers available LLM providers from well-known environment variables
and builds an ordered fallback chain.

Each entry in the returned array contains a provider identifier and an
optional cheap model suitable for fallback use.  Providers are ordered by
general availability and cost-effectiveness:
1. OpenAI (`gpt-4o-mini`)
2. Anthropic (`claude-haiku-4-5-20251001`)
3. OpenRouter (default model)
4. Gemini (`gemini-2.5-flash`)

## Parameters

### excludeProvider?

`string`

Provider to omit from the chain (typically the
  primary provider that already failed).

## Returns

[`FallbackProviderEntry`](../interfaces/FallbackProviderEntry.md)[]

An array of `{ provider, model? }` entries ready for use as
  [GenerateTextOptions.fallbackProviders](../interfaces/GenerateTextOptions.md#fallbackproviders).

## Example

```ts
// Primary is anthropic — build fallback chain from remaining providers
const chain = buildFallbackChain('anthropic');
// => [{ provider: 'openai', model: 'gpt-4o-mini' }, { provider: 'openrouter' }, ...]
```
