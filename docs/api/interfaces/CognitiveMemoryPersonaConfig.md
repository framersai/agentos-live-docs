# Interface: CognitiveMemoryPersonaConfig

Defined in: [packages/agentos/src/memory/core/config.ts:199](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L199)

## Properties

### decay?

> `optional` **decay**: `Partial`\<[`DecayConfig`](DecayConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:209](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L209)

Decay config overrides.

***

### encoding?

> `optional` **encoding**: `Partial`\<[`EncodingConfig`](EncodingConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:207](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L207)

Encoding config overrides.

***

### featureDetectionStrategy?

> `optional` **featureDetectionStrategy**: `"hybrid"` \| `"llm"` \| `"keyword"`

Defined in: [packages/agentos/src/memory/core/config.ts:201](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L201)

Feature detection strategy.

#### Default

```ts
'keyword'
```

***

### graph?

> `optional` **graph**: `Partial`\<[`MemoryGraphConfig`](MemoryGraphConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:215](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L215)

Memory graph config (Batch 2).

***

### infiniteContext?

> `optional` **infiniteContext**: `Partial`\<[`InfiniteContextConfig`](InfiniteContextConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:217](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L217)

Infinite context config (Batch 3).

***

### observer?

> `optional` **observer**: `Partial`\<[`ObserverConfig`](ObserverConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:211](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L211)

Observer config (Batch 2).

***

### reflector?

> `optional` **reflector**: `Partial`\<[`ReflectorConfig`](ReflectorConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:213](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L213)

Reflector config (Batch 2).

***

### tokenBudget?

> `optional` **tokenBudget**: `Partial`\<[`MemoryBudgetAllocation`](MemoryBudgetAllocation.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:205](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L205)

Token budget allocation percentages override.

***

### workingMemoryCapacity?

> `optional` **workingMemoryCapacity**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:203](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L203)

Working memory slot capacity override.
