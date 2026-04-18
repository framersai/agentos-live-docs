# Interface: ReflectorConfig

Defined in: [packages/agentos/src/memory/core/config.ts:72](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/config.ts#L72)

## Properties

### activationThresholdTokens

> **activationThresholdTokens**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:74](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/config.ts#L74)

Token threshold for notes before reflection triggers.

#### Default

```ts
40_000
```

***

### llmInvoker()?

> `optional` **llmInvoker**: (`systemPrompt`, `userPrompt`) => `Promise`\<`string`\>

Defined in: [packages/agentos/src/memory/core/config.ts:78](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/config.ts#L78)

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

Defined in: [packages/agentos/src/memory/core/config.ts:76](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/config.ts#L76)

LLM model ID for reflection/consolidation (per-persona).
