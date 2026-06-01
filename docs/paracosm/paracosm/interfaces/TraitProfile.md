# Interface: TraitProfile

Defined in: [apps/paracosm/src/engine/traits/index.ts:119](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/traits/index.ts#L119)

A leader's (or agent's) profile under a specific trait model. Stored
on ActorConfig.traitProfile and Agent.traitProfile.

## Properties

### modelId

> **modelId**: `string`

Defined in: [apps/paracosm/src/engine/traits/index.ts:121](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/traits/index.ts#L121)

id of the registered TraitModel.

***

### traits

> **traits**: `Record`\<`string`, `number`\>

Defined in: [apps/paracosm/src/engine/traits/index.ts:123](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/traits/index.ts#L123)

axis-id -> float in [0, 1].
