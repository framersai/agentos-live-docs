# Interface: MetaPromptDefinition

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:323](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/personas/IPersonaDefinition.ts#L323)

Defines a meta-prompt for GMI self-regulation.

## Interface

MetaPromptDefinition

## Properties

### description?

> `optional` **description**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:325](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/personas/IPersonaDefinition.ts#L325)

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:324](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/personas/IPersonaDefinition.ts#L324)

***

### maxOutputTokens?

> `optional` **maxOutputTokens**: `number`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:329](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/personas/IPersonaDefinition.ts#L329)

***

### modelId?

> `optional` **modelId**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:327](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/personas/IPersonaDefinition.ts#L327)

***

### outputSchema?

> `optional` **outputSchema**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:331](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/personas/IPersonaDefinition.ts#L331)

***

### promptTemplate

> **promptTemplate**: `string` \| \{ `template`: `string`; `variables?`: `string`[]; \}

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:326](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/personas/IPersonaDefinition.ts#L326)

***

### providerId?

> `optional` **providerId**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:328](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/personas/IPersonaDefinition.ts#L328)

***

### temperature?

> `optional` **temperature**: `number`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:330](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/personas/IPersonaDefinition.ts#L330)

***

### trigger?

> `optional` **trigger**: \{ `intervalTurns`: `number`; `type`: `"turn_interval"`; \} \| \{ `eventName`: `string`; `type`: `"event_based"`; \} \| \{ `type`: `"manual"`; \}

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:332](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/personas/IPersonaDefinition.ts#L332)
