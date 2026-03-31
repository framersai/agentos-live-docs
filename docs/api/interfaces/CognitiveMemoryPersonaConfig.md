# Interface: CognitiveMemoryPersonaConfig

Defined in: [packages/agentos/src/memory/core/config.ts:156](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L156)

## Properties

### decay?

> `optional` **decay**: `Partial`\<[`DecayConfig`](DecayConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:166](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L166)

Decay config overrides.

***

### encoding?

> `optional` **encoding**: `Partial`\<[`EncodingConfig`](EncodingConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:164](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L164)

Encoding config overrides.

***

### featureDetectionStrategy?

> `optional` **featureDetectionStrategy**: `"hybrid"` \| `"llm"` \| `"keyword"`

Defined in: [packages/agentos/src/memory/core/config.ts:158](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L158)

Feature detection strategy.

#### Default

```ts
'keyword'
```

***

### graph?

> `optional` **graph**: `Partial`\<[`MemoryGraphConfig`](MemoryGraphConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:172](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L172)

Memory graph config (Batch 2).

***

### infiniteContext?

> `optional` **infiniteContext**: `Partial`\<[`InfiniteContextConfig`](InfiniteContextConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:174](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L174)

Infinite context config (Batch 3).

***

### observer?

> `optional` **observer**: `Partial`\<[`ObserverConfig`](ObserverConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:168](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L168)

Observer config (Batch 2).

***

### reflector?

> `optional` **reflector**: `Partial`\<[`ReflectorConfig`](ReflectorConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:170](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L170)

Reflector config (Batch 2).

***

### tokenBudget?

> `optional` **tokenBudget**: `Partial`\<[`MemoryBudgetAllocation`](MemoryBudgetAllocation.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:162](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L162)

Token budget allocation percentages override.

***

### workingMemoryCapacity?

> `optional` **workingMemoryCapacity**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:160](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L160)

Working memory slot capacity override.
