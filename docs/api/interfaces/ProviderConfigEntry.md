# Interface: ProviderConfigEntry

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:39](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/llm/providers/AIModelProviderManager.ts#L39)

Configuration for a single AI model provider entry within the manager.

## Interface

ProviderConfigEntry

## Properties

### config

> **config**: `Partial`\<`Record`\<`string`, `any`\> \| `OpenAIProviderConfig` \| `OpenRouterProviderConfig` \| `OllamaProviderConfig` \| `AnthropicProviderConfig` \| `GroqProviderConfig` \| `TogetherProviderConfig` \| `MistralProviderConfig` \| `XAIProviderConfig` \| `GeminiProviderConfig` \| `ClaudeCodeProviderConfig` \| `GeminiCLIProviderConfig`\>

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:42](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/llm/providers/AIModelProviderManager.ts#L42)

***

### enabled

> **enabled**: `boolean`

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:41](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/llm/providers/AIModelProviderManager.ts#L41)

***

### isDefault?

> `optional` **isDefault**: `boolean`

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:43](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/llm/providers/AIModelProviderManager.ts#L43)

***

### providerId

> **providerId**: `string`

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:40](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/llm/providers/AIModelProviderManager.ts#L40)
