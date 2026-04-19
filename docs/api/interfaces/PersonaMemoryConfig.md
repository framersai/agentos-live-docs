# Interface: PersonaMemoryConfig

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:180](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/cognitive_substrate/personas/IPersonaDefinition.ts#L180)

Configuration for the persona's memory systems.

## Interface

PersonaMemoryConfig

## Properties

### conversationContext?

> `optional` **conversationContext**: [`PersonaConversationContextConfig`](PersonaConversationContextConfig.md)

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:182](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/cognitive_substrate/personas/IPersonaDefinition.ts#L182)

***

### enabled

> **enabled**: `boolean`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:181](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/cognitive_substrate/personas/IPersonaDefinition.ts#L181)

***

### lifecycleConfig?

> `optional` **lifecycleConfig**: `object`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:211](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/cognitive_substrate/personas/IPersonaDefinition.ts#L211)

#### negotiationEnabled?

> `optional` **negotiationEnabled**: `boolean`

***

### ragConfig?

> `optional` **ragConfig**: `object`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:183](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/cognitive_substrate/personas/IPersonaDefinition.ts#L183)

#### dataSources?

> `optional` **dataSources**: [`PersonaRagDataSourceConfig`](PersonaRagDataSourceConfig.md)[]

#### defaultIngestionDataSourceId?

> `optional` **defaultIngestionDataSourceId**: `string`

#### defaultRetrievalStrategy?

> `optional` **defaultRetrievalStrategy**: `"similarity"` \| `"mmr"` \| `"hybrid_search"`

#### defaultRetrievalTopK?

> `optional` **defaultRetrievalTopK**: `number`

#### enabled

> **enabled**: `boolean`

#### ingestionProcessing?

> `optional` **ingestionProcessing**: [`PersonaRagIngestionProcessingConfig`](PersonaRagIngestionProcessingConfig.md)

#### ingestionTriggers?

> `optional` **ingestionTriggers**: [`PersonaRagConfigIngestionTrigger`](PersonaRagConfigIngestionTrigger.md)

#### queryAugmentationPromptName?

> `optional` **queryAugmentationPromptName**: `string`

#### rerankerConfig?

> `optional` **rerankerConfig**: `object`

##### rerankerConfig.apiKeyEnvVar?

> `optional` **apiKeyEnvVar**: `string`

##### rerankerConfig.enabled

> **enabled**: `boolean`

##### rerankerConfig.modelName?

> `optional` **modelName**: `string`

##### rerankerConfig.provider

> **provider**: `string`

##### rerankerConfig.topN?

> `optional` **topN**: `number`

#### resultSynthesizerPromptName?

> `optional` **resultSynthesizerPromptName**: `string`

#### retrievalTriggers?

> `optional` **retrievalTriggers**: [`PersonaRagConfigRetrievalTrigger`](PersonaRagConfigRetrievalTrigger.md)

#### retrievedContextProcessing?

> `optional` **retrievedContextProcessing**: [`PersonaUtilityProcessingConfig`](PersonaUtilityProcessingConfig.md)

***

### workingMemoryProcessing?

> `optional` **workingMemoryProcessing**: `object`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:203](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/cognitive_substrate/personas/IPersonaDefinition.ts#L203)

#### adaptationRules?

> `optional` **adaptationRules**: `object`[]
