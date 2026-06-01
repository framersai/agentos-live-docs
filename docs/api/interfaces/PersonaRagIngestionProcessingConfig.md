# Interface: PersonaRagIngestionProcessingConfig

Defined in: [packages/agentos/src/cognition/substrate/personas/IPersonaDefinition.ts:161](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/personas/IPersonaDefinition.ts#L161)

Configuration for RAG ingestion processing.

## Interface

PersonaRagIngestionProcessingConfig

## Properties

### keywordExtraction?

> `optional` **keywordExtraction**: `object`

Defined in: [packages/agentos/src/cognition/substrate/personas/IPersonaDefinition.ts:169](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/personas/IPersonaDefinition.ts#L169)

#### enabled

> **enabled**: `boolean`

#### maxKeywords?

> `optional` **maxKeywords**: `number`

***

### summarization?

> `optional` **summarization**: `object`

Defined in: [packages/agentos/src/cognition/substrate/personas/IPersonaDefinition.ts:162](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/personas/IPersonaDefinition.ts#L162)

#### enabled

> **enabled**: `boolean`

#### method?

> `optional` **method**: `"extractive"` \| `"abstractive_llm"`

#### modelId?

> `optional` **modelId**: `string`

#### providerId?

> `optional` **providerId**: `string`

#### targetLength?

> `optional` **targetLength**: `number` \| `"medium"` \| `"short"` \| `"long"`
