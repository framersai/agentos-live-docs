# Interface: PersonaUtilityProcessingConfig

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:118](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/personas/IPersonaDefinition.ts#L118)

Configuration for how memory (e.g., conversation history, retrieved documents) is processed by utility AI.

## Interface

PersonaUtilityProcessingConfig

## Properties

### engine

> **engine**: `"llm"` \| `"statistical"` \| `"none"`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:119](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/personas/IPersonaDefinition.ts#L119)

***

### llmConfig?

> `optional` **llmConfig**: `object`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:120](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/personas/IPersonaDefinition.ts#L120)

#### maxOutputTokens?

> `optional` **maxOutputTokens**: `number`

#### modelId?

> `optional` **modelId**: `string`

#### promptTemplateName?

> `optional` **promptTemplateName**: `string`

#### providerId?

> `optional` **providerId**: `string`

***

### statisticalConfig?

> `optional` **statisticalConfig**: `object`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:126](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/personas/IPersonaDefinition.ts#L126)

#### keywordExtractionMethod?

> `optional` **keywordExtractionMethod**: `string`

#### maxKeywords?

> `optional` **maxKeywords**: `number`

#### summarizationLength?

> `optional` **summarizationLength**: `number` \| `"medium"` \| `"short"` \| `"long"`

#### summarizationMethod?

> `optional` **summarizationMethod**: `string`
