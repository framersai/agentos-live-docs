# Interface: CognitiveMemoryPersonaConfig

Defined in: [packages/agentos/src/cognition/memory/core/config.ts:208](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/config.ts#L208)

## Properties

### decay?

> `optional` **decay**: `Partial`\<[`DecayConfig`](DecayConfig.md)\>

Defined in: [packages/agentos/src/cognition/memory/core/config.ts:218](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/config.ts#L218)

Decay config overrides.

***

### encoding?

> `optional` **encoding**: `Partial`\<[`EncodingConfig`](EncodingConfig.md)\>

Defined in: [packages/agentos/src/cognition/memory/core/config.ts:216](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/config.ts#L216)

Encoding config overrides.

***

### featureDetectionStrategy?

> `optional` **featureDetectionStrategy**: `"hybrid"` \| `"llm"` \| `"keyword"`

Defined in: [packages/agentos/src/cognition/memory/core/config.ts:210](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/config.ts#L210)

Feature detection strategy.

#### Default

```ts
'keyword'
```

***

### graph?

> `optional` **graph**: `Partial`\<[`MemoryGraphConfig`](MemoryGraphConfig.md)\>

Defined in: [packages/agentos/src/cognition/memory/core/config.ts:224](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/config.ts#L224)

Memory graph config (Batch 2).

***

### infiniteContext?

> `optional` **infiniteContext**: `Partial`\<[`InfiniteContextConfig`](InfiniteContextConfig.md)\>

Defined in: [packages/agentos/src/cognition/memory/core/config.ts:226](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/config.ts#L226)

Infinite context config (Batch 3).

***

### observer?

> `optional` **observer**: `Partial`\<[`ObserverConfig`](ObserverConfig.md)\>

Defined in: [packages/agentos/src/cognition/memory/core/config.ts:220](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/config.ts#L220)

Observer config (Batch 2).

***

### reflector?

> `optional` **reflector**: `Partial`\<[`ReflectorConfig`](ReflectorConfig.md)\>

Defined in: [packages/agentos/src/cognition/memory/core/config.ts:222](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/config.ts#L222)

Reflector config (Batch 2).

***

### tokenBudget?

> `optional` **tokenBudget**: `Partial`\<[`MemoryBudgetAllocation`](MemoryBudgetAllocation.md)\>

Defined in: [packages/agentos/src/cognition/memory/core/config.ts:214](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/config.ts#L214)

Token budget allocation percentages override.

***

### workingMemoryCapacity?

> `optional` **workingMemoryCapacity**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/config.ts:212](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/config.ts#L212)

Working memory slot capacity override.
