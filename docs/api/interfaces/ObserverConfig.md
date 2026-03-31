# Interface: ObserverConfig

Defined in: [packages/agentos/src/memory/core/config.ts:63](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/config.ts#L63)

## Properties

### activationThresholdTokens

> **activationThresholdTokens**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:65](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/config.ts#L65)

Token threshold before observer activates.

#### Default

```ts
30_000
```

***

### llmInvoker()?

> `optional` **llmInvoker**: (`systemPrompt`, `userPrompt`) => `Promise`\<`string`\>

Defined in: [packages/agentos/src/memory/core/config.ts:69](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/config.ts#L69)

LLM invoker function.

#### Parameters

##### systemPrompt

`string`

##### userPrompt

`string`

#### Returns

`Promise`\<`string`\>

***

### modelId?

> `optional` **modelId**: `string`

Defined in: [packages/agentos/src/memory/core/config.ts:67](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/config.ts#L67)

LLM model ID for observation extraction (per-persona).
