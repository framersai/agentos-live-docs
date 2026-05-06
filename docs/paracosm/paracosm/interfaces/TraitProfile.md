# Interface: TraitProfile

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:119](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/trait-models/index.ts#L119)

A leader's (or agent's) profile under a specific trait model. Stored
on ActorConfig.traitProfile and Agent.traitProfile.

## Properties

### modelId

> **modelId**: `string`

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:121](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/trait-models/index.ts#L121)

id of the registered TraitModel.

***

### traits

> **traits**: `Record`\<`string`, `number`\>

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:123](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/trait-models/index.ts#L123)

axis-id -> float in [0, 1].
