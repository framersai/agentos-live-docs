# Interface: ScenarioSetupSchema

Defined in: [apps/paracosm/src/engine/types.ts:51](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/types.ts#L51)

Default values for the simulation setup form.

## Properties

### configurableSections

> **configurableSections**: (`"leaders"` \| `"personnel"` \| `"resources"` \| `"departments"` \| `"events"` \| `"models"` \| `"advanced"`)[]

Defined in: [apps/paracosm/src/engine/types.ts:60](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/types.ts#L60)

Which setup form sections to expose in the dashboard

***

### defaultPopulation

> **defaultPopulation**: `number`

Defined in: [apps/paracosm/src/engine/types.ts:56](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/types.ts#L56)

***

### defaultSeed

> **defaultSeed**: `number`

Defined in: [apps/paracosm/src/engine/types.ts:53](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/types.ts#L53)

***

### defaultStartYear

> **defaultStartYear**: `number`

Defined in: [apps/paracosm/src/engine/types.ts:54](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/types.ts#L54)

***

### defaultTurns

> **defaultTurns**: `number`

Defined in: [apps/paracosm/src/engine/types.ts:52](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/types.ts#L52)

***

### defaultYearsPerTurn?

> `optional` **defaultYearsPerTurn**: `number`

Defined in: [apps/paracosm/src/engine/types.ts:55](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/types.ts#L55)

***

### maxEventsPerTurn?

> `optional` **maxEventsPerTurn**: `number`

Defined in: [apps/paracosm/src/engine/types.ts:58](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/types.ts#L58)

Maximum events the Event Director can generate per turn. Default: 3
