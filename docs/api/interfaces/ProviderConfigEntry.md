# Interface: ProviderConfigEntry

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:39](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/providers/AIModelProviderManager.ts#L39)

Configuration for a single AI model provider entry within the manager.

## Interface

ProviderConfigEntry

## Properties

### config

> **config**: `Partial`\<`Record`\<`string`, `any`\> \| `OpenAIProviderConfig` \| `OpenRouterProviderConfig` \| `OllamaProviderConfig` \| `AnthropicProviderConfig` \| `GroqProviderConfig` \| `TogetherProviderConfig` \| `MistralProviderConfig` \| `XAIProviderConfig` \| `GeminiProviderConfig` \| `ClaudeCodeProviderConfig` \| `GeminiCLIProviderConfig`\>

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:42](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/providers/AIModelProviderManager.ts#L42)

***

### enabled

> **enabled**: `boolean`

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:41](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/providers/AIModelProviderManager.ts#L41)

***

### isDefault?

> `optional` **isDefault**: `boolean`

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:43](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/providers/AIModelProviderManager.ts#L43)

***

### providerId

> **providerId**: `string`

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:40](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/providers/AIModelProviderManager.ts#L40)
