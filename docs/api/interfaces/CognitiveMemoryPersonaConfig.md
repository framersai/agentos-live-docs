# Interface: CognitiveMemoryPersonaConfig

Defined in: [packages/agentos/src/memory/core/config.ts:187](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/config.ts#L187)

## Properties

### decay?

> `optional` **decay**: `Partial`\<[`DecayConfig`](DecayConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:197](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/config.ts#L197)

Decay config overrides.

***

### encoding?

> `optional` **encoding**: `Partial`\<[`EncodingConfig`](EncodingConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:195](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/config.ts#L195)

Encoding config overrides.

***

### featureDetectionStrategy?

> `optional` **featureDetectionStrategy**: `"hybrid"` \| `"llm"` \| `"keyword"`

Defined in: [packages/agentos/src/memory/core/config.ts:189](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/config.ts#L189)

Feature detection strategy.

#### Default

```ts
'keyword'
```

***

### graph?

> `optional` **graph**: `Partial`\<[`MemoryGraphConfig`](MemoryGraphConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:203](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/config.ts#L203)

Memory graph config (Batch 2).

***

### infiniteContext?

> `optional` **infiniteContext**: `Partial`\<[`InfiniteContextConfig`](InfiniteContextConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:205](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/config.ts#L205)

Infinite context config (Batch 3).

***

### observer?

> `optional` **observer**: `Partial`\<[`ObserverConfig`](ObserverConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:199](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/config.ts#L199)

Observer config (Batch 2).

***

### reflector?

> `optional` **reflector**: `Partial`\<[`ReflectorConfig`](ReflectorConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:201](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/config.ts#L201)

Reflector config (Batch 2).

***

### tokenBudget?

> `optional` **tokenBudget**: `Partial`\<[`MemoryBudgetAllocation`](MemoryBudgetAllocation.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:193](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/config.ts#L193)

Token budget allocation percentages override.

***

### workingMemoryCapacity?

> `optional` **workingMemoryCapacity**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:191](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/config.ts#L191)

Working memory slot capacity override.
