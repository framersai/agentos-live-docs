# Interface: ScenarioSetupSchema

Defined in: [apps/paracosm/src/engine/types.ts:68](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L68)

Default values for the simulation setup form.

## Properties

### configurableSections

> **configurableSections**: (`"actors"` \| `"personnel"` \| `"resources"` \| `"departments"` \| `"events"` \| `"models"` \| `"advanced"`)[]

Defined in: [apps/paracosm/src/engine/types.ts:77](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L77)

Which setup form sections to expose in the dashboard

***

### defaultPopulation

> **defaultPopulation**: `number`

Defined in: [apps/paracosm/src/engine/types.ts:73](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L73)

***

### defaultSeed

> **defaultSeed**: `number`

Defined in: [apps/paracosm/src/engine/types.ts:70](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L70)

***

### defaultStartTime

> **defaultStartTime**: `number`

Defined in: [apps/paracosm/src/engine/types.ts:71](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L71)

***

### defaultTimePerTurn?

> `optional` **defaultTimePerTurn**: `number`

Defined in: [apps/paracosm/src/engine/types.ts:72](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L72)

***

### defaultTurns

> **defaultTurns**: `number`

Defined in: [apps/paracosm/src/engine/types.ts:69](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L69)

***

### maxEventsPerTurn?

> `optional` **maxEventsPerTurn**: `number`

Defined in: [apps/paracosm/src/engine/types.ts:75](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L75)

Maximum events the Event Director can generate per turn. Default: 3
