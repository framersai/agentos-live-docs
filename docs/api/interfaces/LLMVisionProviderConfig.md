# Interface: LLMVisionProviderConfig

Defined in: [packages/agentos/src/vision/providers/LLMVisionProvider.ts:51](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/vision/providers/LLMVisionProvider.ts#L51)

Configuration for the LLM vision provider.

## Example

```typescript
const config: LLMVisionProviderConfig = {
  provider: 'openai',
  model: 'gpt-4o',
  prompt: 'Describe this image for a search index.',
  apiKey: process.env.OPENAI_API_KEY,
};
```

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/vision/providers/LLMVisionProvider.ts:75](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/vision/providers/LLMVisionProvider.ts#L75)

Override the API key instead of reading from environment variables.
Useful for multi-tenant setups where each user has their own key.

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/vision/providers/LLMVisionProvider.ts:80](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/vision/providers/LLMVisionProvider.ts#L80)

Override the provider base URL (e.g. for Ollama or local proxies).

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/vision/providers/LLMVisionProvider.ts:63](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/vision/providers/LLMVisionProvider.ts#L63)

Model identifier. When omitted, the provider's default vision model
is used.

#### Example

```ts
'gpt-4o', 'claude-sonnet-4-20250514', 'gemini-2.0-flash'
```

***

### prompt?

> `optional` **prompt**: `string`

Defined in: [packages/agentos/src/vision/providers/LLMVisionProvider.ts:69](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/vision/providers/LLMVisionProvider.ts#L69)

Custom prompt for image description. When omitted, a default prompt
optimized for search indexing is used.

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/vision/providers/LLMVisionProvider.ts:56](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/vision/providers/LLMVisionProvider.ts#L56)

LLM provider name (e.g. 'openai', 'anthropic', 'google', 'ollama').
Must be resolvable by the `generateText()` API.
