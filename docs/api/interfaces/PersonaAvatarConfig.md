# Interface: PersonaAvatarConfig

Defined in: [packages/agentos/src/cognition/substrate/personas/IPersonaDefinition.ts:51](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/personas/IPersonaDefinition.ts#L51)

Defines the configuration for a persona's visual representation (avatar).

## Interface

PersonaAvatarConfig

## Properties

### descriptionForGeneration?

> `optional` **descriptionForGeneration**: `string`

Defined in: [packages/agentos/src/cognition/substrate/personas/IPersonaDefinition.ts:54](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/personas/IPersonaDefinition.ts#L54)

***

### moodToAvatarStateMap?

> `optional` **moodToAvatarStateMap**: `Record`\<`string`, \{ `generationPromptSuffix?`: `string`; `sourceUrl?`: `string`; \}\>

Defined in: [packages/agentos/src/cognition/substrate/personas/IPersonaDefinition.ts:55](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/personas/IPersonaDefinition.ts#L55)

***

### sourceUrl?

> `optional` **sourceUrl**: `string`

Defined in: [packages/agentos/src/cognition/substrate/personas/IPersonaDefinition.ts:53](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/personas/IPersonaDefinition.ts#L53)

***

### type?

> `optional` **type**: `"static_image"` \| `"animated_image"` \| `"realtime_generative_placeholder"`

Defined in: [packages/agentos/src/cognition/substrate/personas/IPersonaDefinition.ts:52](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/personas/IPersonaDefinition.ts#L52)
