# Interface: WorldState

Defined in: [apps/paracosm/src/engine/types.ts:106](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L106)

Runtime world state with typed record bags. Not everything is a flat numeric resource.

## Properties

### capacities

> **capacities**: `Record`\<`string`, `number`\>

Defined in: [apps/paracosm/src/engine/types.ts:110](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L110)

Capacity constraints: life support, housing

***

### environment

> **environment**: `Record`\<`string`, `number` \| `string` \| `boolean`\>

Defined in: [apps/paracosm/src/engine/types.ts:116](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L116)

Environment conditions

***

### metrics

> **metrics**: `Record`\<`string`, `number`\>

Defined in: [apps/paracosm/src/engine/types.ts:108](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L108)

Numeric gauges: food, power, water, population, morale

***

### politics

> **politics**: `Record`\<`string`, `number` \| `string` \| `boolean`\>

Defined in: [apps/paracosm/src/engine/types.ts:114](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L114)

Political/social pressures

***

### statuses

> **statuses**: `Record`\<`string`, `string` \| `boolean`\>

Defined in: [apps/paracosm/src/engine/types.ts:112](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L112)

Categorical state: governance status, faction alignment
