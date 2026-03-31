# Interface: PersonaAvatarConfig

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:51](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/cognitive_substrate/personas/IPersonaDefinition.ts#L51)

Defines the configuration for a persona's visual representation (avatar).

## Interface

PersonaAvatarConfig

## Properties

### descriptionForGeneration?

> `optional` **descriptionForGeneration**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:54](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/cognitive_substrate/personas/IPersonaDefinition.ts#L54)

***

### moodToAvatarStateMap?

> `optional` **moodToAvatarStateMap**: `Record`\<`string`, \{ `generationPromptSuffix?`: `string`; `sourceUrl?`: `string`; \}\>

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:55](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/cognitive_substrate/personas/IPersonaDefinition.ts#L55)

***

### sourceUrl?

> `optional` **sourceUrl**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:53](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/cognitive_substrate/personas/IPersonaDefinition.ts#L53)

***

### type?

> `optional` **type**: `"static_image"` \| `"animated_image"` \| `"realtime_generative_placeholder"`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:52](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/cognitive_substrate/personas/IPersonaDefinition.ts#L52)
