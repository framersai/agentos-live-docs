# Interface: CognitiveMemoryConfig

Defined in: [packages/agentos/src/memory/core/config.ts:181](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/config.ts#L181)

## Properties

### agentId

> **agentId**: `string`

Defined in: [packages/agentos/src/memory/core/config.ts:189](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/config.ts#L189)

***

### cognitiveMechanisms?

> `optional` **cognitiveMechanisms**: [`CognitiveMechanismsConfig`](CognitiveMechanismsConfig.md)

Defined in: [packages/agentos/src/memory/core/config.ts:215](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/config.ts#L215)

Optional per-mechanism cognitive science extensions (reconsolidation, RIF, FOK, etc.).

***

### collectionPrefix?

> `optional` **collectionPrefix**: `string`

Defined in: [packages/agentos/src/memory/core/config.ts:225](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/config.ts#L225)

#### Default

```ts
'cogmem'
```

***

### consolidation?

> `optional` **consolidation**: `Partial`\<[`ConsolidationConfig`](ConsolidationConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:211](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/config.ts#L211)

***

### decay?

> `optional` **decay**: `Partial`\<[`DecayConfig`](DecayConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:202](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/config.ts#L202)

***

### embeddingManager

> **embeddingManager**: [`IEmbeddingManager`](IEmbeddingManager.md)

Defined in: [packages/agentos/src/memory/core/config.ts:186](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/config.ts#L186)

***

### encoding?

> `optional` **encoding**: `Partial`\<[`EncodingConfig`](EncodingConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:201](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/config.ts#L201)

***

### featureDetectionLlmInvoker()?

> `optional` **featureDetectionLlmInvoker**: (`systemPrompt`, `userPrompt`) => `Promise`\<`string`\>

Defined in: [packages/agentos/src/memory/core/config.ts:198](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/config.ts#L198)

Required when strategy is 'llm' or 'hybrid'.

#### Parameters

##### systemPrompt

`string`

##### userPrompt

`string`

#### Returns

`Promise`\<`string`\>

***

### featureDetectionStrategy

> **featureDetectionStrategy**: `"hybrid"` \| `"llm"` \| `"keyword"`

Defined in: [packages/agentos/src/memory/core/config.ts:196](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/config.ts#L196)

#### Default

```ts
'keyword'
```

***

### graph?

> `optional` **graph**: `Partial`\<[`MemoryGraphConfig`](MemoryGraphConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:210](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/config.ts#L210)

***

### infiniteContext?

> `optional` **infiniteContext**: `Partial`\<[`InfiniteContextConfig`](InfiniteContextConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:219](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/config.ts#L219)

Infinite context window config. Enables transparent compaction for forever conversations.

***

### knowledgeGraph

> **knowledgeGraph**: [`IKnowledgeGraph`](IKnowledgeGraph.md)

Defined in: [packages/agentos/src/memory/core/config.ts:184](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/config.ts#L184)

***

### maxContextTokens?

> `optional` **maxContextTokens**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:221](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/config.ts#L221)

Max context window size in tokens (required for infinite context).

***

### moodProvider()

> **moodProvider**: () => [`PADState`](PADState.md)

Defined in: [packages/agentos/src/memory/core/config.ts:192](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/config.ts#L192)

Callback to get current mood from MoodEngine or similar.

#### Returns

[`PADState`](PADState.md)

***

### observer?

> `optional` **observer**: `Partial`\<[`ObserverConfig`](ObserverConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:208](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/config.ts#L208)

***

### reflector?

> `optional` **reflector**: `Partial`\<[`ReflectorConfig`](ReflectorConfig.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:209](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/config.ts#L209)

***

### tokenBudget?

> `optional` **tokenBudget**: `Partial`\<[`MemoryBudgetAllocation`](MemoryBudgetAllocation.md)\>

Defined in: [packages/agentos/src/memory/core/config.ts:205](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/config.ts#L205)

***

### traits

> **traits**: [`HexacoTraits`](HexacoTraits.md)

Defined in: [packages/agentos/src/memory/core/config.ts:190](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/config.ts#L190)

***

### vectorStore

> **vectorStore**: [`IVectorStore`](IVectorStore.md)

Defined in: [packages/agentos/src/memory/core/config.ts:185](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/config.ts#L185)

***

### workingMemory

> **workingMemory**: `IWorkingMemory`

Defined in: [packages/agentos/src/memory/core/config.ts:183](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/config.ts#L183)

***

### workingMemoryCapacity?

> `optional` **workingMemoryCapacity**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:204](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/config.ts#L204)

#### Default

```ts
7 (Miller's number)
```
