# Interface: PersonaRagIngestionProcessingConfig

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:161](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/personas/IPersonaDefinition.ts#L161)

Configuration for RAG ingestion processing.

## Interface

PersonaRagIngestionProcessingConfig

## Properties

### keywordExtraction?

> `optional` **keywordExtraction**: `object`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:169](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/personas/IPersonaDefinition.ts#L169)

#### enabled

> **enabled**: `boolean`

#### maxKeywords?

> `optional` **maxKeywords**: `number`

***

### summarization?

> `optional` **summarization**: `object`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:162](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/personas/IPersonaDefinition.ts#L162)

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
